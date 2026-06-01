#!/usr/bin/env node
/**
 * generate-redirects.mjs — genera stubs HTML con meta-refresh + canonical para
 * dejar en la rama de GitHub Pages cuando movemos a Vercel.
 *
 * GH Pages no soporta 301 nativos → workaround estándar: cada HTML del sitio
 * viejo se reemplaza por un stub mínimo que dispara meta-refresh inmediato
 * y declara `<link rel="canonical">` apuntando al dominio nuevo (preserva SEO).
 *
 * Uso:
 *   node scripts/generate-redirects.mjs https://bitacora.modo.com.ar
 *
 * Output: `gh-pages-redirects/` con la misma estructura que `public/` actual,
 * cada `.html` reemplazado por un stub. Workflow de cutover:
 *   1. Correr este script con el dominio final.
 *   2. En una checkout del repo erno-modo en otra branch (ej. `gh-pages-301`),
 *      reemplazar el contenido con `gh-pages-redirects/`.
 *   3. Pointing GH Pages a esa branch + deploy. Resultado: cada URL vieja
 *      redirecciona al dominio nuevo y los crawlers ven canonical.
 *
 * NO modifica `public/` ni la branch actual. Solo escribe a `gh-pages-redirects/`.
 */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, dirname, relative } from "node:path";

const target = process.argv[2];
if (!target || !/^https?:\/\//.test(target)) {
  console.error("uso: node scripts/generate-redirects.mjs https://<dominio-nuevo>");
  process.exit(1);
}
const TARGET = target.replace(/\/+$/, "");
const SRC = "public";
const OUT = "gh-pages-redirects";

const stub = (canonical, label) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Movido — Erno × MODO</title>
<meta http-equiv="refresh" content="0;url=${canonical}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="noindex,follow">
</head>
<body style="font-family:system-ui;padding:2rem;max-width:32rem;margin:auto">
<h1>Movido</h1>
<p>Este contenido vive ahora en <a href="${canonical}">${label}</a>.</p>
<p>Te redirigimos automáticamente. Si no, hacé click en el link de arriba.</p>
</body>
</html>
`;

async function walk(dir, hits = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, hits);
    else if (e.isFile() && e.name.endsWith(".html")) hits.push(p);
  }
  return hits;
}

const htmls = await walk(SRC);
console.log(`Found ${htmls.length} HTML files in ${SRC}/`);

let count = 0;
for (const src of htmls) {
  const rel = relative(SRC, src);
  // /decks/completo/foo.html → ${TARGET}/decks/completo/foo.html
  // /decks/index.html → ${TARGET}/decks/  (drop /index.html para clean URLs en Vercel)
  let urlPath = "/" + rel.replace(/\\/g, "/");
  if (urlPath.endsWith("/index.html")) urlPath = urlPath.slice(0, -"index.html".length);
  const canonical = TARGET + urlPath;
  const label = urlPath === "/" ? TARGET : `${TARGET}${urlPath}`;

  const outPath = join(OUT, rel);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, stub(canonical, label));
  count++;
}

console.log(`✓ Generated ${count} redirect stubs → ${OUT}/`);
console.log(`  target = ${TARGET}`);
console.log(`  next: deploy ${OUT}/ a la branch que sirve GH Pages.`);
