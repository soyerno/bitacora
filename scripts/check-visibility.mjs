#!/usr/bin/env node
/**
 * check-visibility.mjs — falla si un item marcado `private` está en alguno de
 * los feeds bajo `public/<section>/<section>.json`. Los feeds en public/ son
 * estáticos y unconditionally accesibles → no pueden contener items privados.
 *
 * Correr en CI antes del deploy. Sin items con `visibility:"private"` hoy
 * (los feeds vienen del sitio estático viejo), pero el check es preventivo:
 * apenas un generador empiece a marcar items privados, este script los caza.
 *
 * Exit 0 = OK · Exit 1 = leak detectado.
 */
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// Importar config: leer el .ts plano y extraer las secciones via regex simple
// (evitar dep de un transpiler en CI). Fallback: lista de secciones conocida.
const ROOT = resolve(process.cwd());
const CONFIG_PATH = join(ROOT, "bitacora.config.ts");

async function loadSections() {
  const src = await readFile(CONFIG_PATH, "utf8");
  // Match: type: "...", feed: "/.../...json", key: "...", visibility: "..."
  const re =
    /type:\s*"([^"]+)"[\s\S]*?feed:\s*"([^"]+)"[\s\S]*?key:\s*"([^"]+)"[\s\S]*?visibility:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ type: m[1], feed: m[2], key: m[3], visibility: m[4] });
  }
  return out;
}

const sections = await loadSections();
let leaks = 0;

for (const s of sections) {
  if (s.visibility === "private") continue; // toda la sección privada → no se sirve
  const feedPath = join(ROOT, "public", s.feed);
  let data;
  try {
    data = JSON.parse(await readFile(feedPath, "utf8"));
  } catch {
    console.warn(`⚠  ${s.type}: feed ilegible ${feedPath}`);
    continue;
  }
  const items = Array.isArray(data?.[s.key]) ? data[s.key] : [];
  const privateItems = items.filter((it) => it?.visibility === "private");
  if (privateItems.length > 0) {
    leaks += privateItems.length;
    console.error(
      `❌ ${s.type}: ${privateItems.length} item(s) private en feed público:`,
      privateItems.map((it) => it.id ?? it.slug ?? it.name ?? "?").join(", "),
    );
  }
}

if (leaks > 0) {
  console.error(`\nFAIL — ${leaks} private item(s) en feeds públicos.`);
  process.exit(1);
}
console.log(`✓ visibility check OK (${sections.length} secciones, 0 leaks).`);
