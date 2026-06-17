#!/usr/bin/env node
/**
 * Genera el index.html de una capacitación desde su course.json + los .md.
 *
 * Por qué existe: cada curso es single-file HTML con las lecciones inlineadas
 * en `window.LESSONS` (así funciona en GitHub Pages sin fetch/CORS). Mantener
 * eso a mano es frágil. Este generador lee el manifest + los markdown y emite
 * el HTML con el shell estándar (sidebar + progreso + checklists + tema).
 *
 * Uso:  node scripts/build-course.mjs <slug>
 * Ej.:  node scripts/build-course.mjs coding-con-agentes
 *
 * El shell es idéntico entre cursos (assets/course.css + assets/course.js).
 * Lo único específico del curso: title, subtitle, las lecciones y el prefijo
 * de localStorage (window.COURSE_LS).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildOne(slug) {
const dir = join("public", "capacitaciones", slug);
const course = JSON.parse(readFileSync(join(dir, "course.json"), "utf8"));

// Cada lección inlinea su markdown. `file` queda "" para intro/lab (no tienen
// número de lección); el markdown se lee de `file` o, si no hay, de `path`.
const lessons = course.lessons.map((l) => {
  const src = l.file || l.path;
  const md = readFileSync(join(dir, src), "utf8");
  return {
    id: l.id,
    num: l.num,
    title: l.title,
    eyebrow: l.eyebrow,
    file: l.file || "",
    md,
  };
});

const lsKey = `course:${slug}:`;
const canonical = `https://soyernomodo.github.io/erno-modo/capacitaciones/${slug}/`;
// Favicon inline (SVG data-uri): cuadrado verde MODO + M blanca. Evita un 404 y da marca.
const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23008859'/%3E%3Ctext x='16' y='23' font-size='19' font-family='sans-serif' font-weight='700' fill='white' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E";
const ld = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.subtitle,
  url: canonical,
  courseCode: slug,
  inLanguage: "es-AR",
  isAccessibleForFree: true,
  educationalLevel: "Intermediate",
  learningResourceType: "Interactive course",
  teaches: course.subtitle,
  provider: { "@type": "Organization", name: "MODO", url: "https://www.modo.com.ar" },
  author: { "@type": "Person", name: "Hernán De Souza", jobTitle: "Sr AI Engineer" },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT3H",
    inLanguage: "es-AR",
  },
};

const html = `<!DOCTYPE html>
<html lang="es" data-theme="">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(course.title)} · Capacitación MODO</title>
  <meta name="description" content="${esc(course.subtitle)}" />
  <meta name="author" content="Hernán De Souza" />
  <meta name="theme-color" content="#008859" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="${favicon}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Capacitaciones MODO" />
  <meta property="og:title" content="${esc(course.title)}" />
  <meta property="og:description" content="${esc(course.subtitle)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:locale" content="es_AR" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${esc(course.title)}" />
  <meta name="twitter:description" content="${esc(course.subtitle)}" />
  <script>
  /* Anti-FOUC: aplica el tema antes del primer paint. Respeta la preferencia
     guardada y, si no hay, el prefers-color-scheme del sistema. */
  (function(){try{
    var v=localStorage.getItem(${JSON.stringify(lsKey)}+'theme');
    var t=v?JSON.parse(v):(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'');
    if(t)document.documentElement.setAttribute('data-theme',t);
  }catch(e){}})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Red+Hat+Display:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/course.css" />
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
  </script>
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-logo" aria-hidden="true">M</span>
        <span class="brand-title">Capacitación MODO</span>
      </div>
      <p class="brand-sub">${esc(course.subtitle)}</p>
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
        <div class="progress-label" id="progress-label">0/0</div>
      </div>
      <nav class="lesson-nav-wrap" aria-label="Lecciones del curso">
        <ul class="lesson-nav" id="lesson-nav"></ul>
      </nav>
      <button class="theme-toggle" id="theme-toggle" type="button">🌙 Tema oscuro</button>
      <div class="sidebar-foot">
        <a href="../">← Capacitaciones</a> · <a href="../../">erno-modo</a><br />Hernán De Souza · Sr AI Engineer
      </div>
    </aside>
    <main class="content" id="main" tabindex="-1">
      <article class="content-inner" id="content-inner"></article>
    </main>
  </div>
  <script>window.LESSONS = ${JSON.stringify(lessons)};</script>
  <script>window.COURSE_LS = ${JSON.stringify(lsKey)};</script>
  <script src="../assets/marked.min.js" defer></script>
  <script src="../assets/course.js" defer></script>
</body>
</html>`;

writeFileSync(join(dir, "index.html"), html);
console.log(
  `✓ ${dir}/index.html — ${course.lessons.length} lecciones, ${html.length} bytes`,
);
}

let slugs = process.argv.slice(2);
if (slugs[0] === "--all") {
  const cap = join("public", "capacitaciones");
  slugs = readdirSync(cap).filter(
    (f) => statSync(join(cap, f)).isDirectory() && existsSync(join(cap, f, "course.json")),
  );
}
if (!slugs.length) {
  console.error("uso: node scripts/build-course.mjs <slug> [<slug2> ...] | --all");
  process.exit(1);
}
let ok = 0;
for (const s of slugs) {
  try {
    buildOne(s);
    ok++;
  } catch (e) {
    console.error(`✗ ${s} — ${e.message}`);
  }
}
console.log(`${ok}/${slugs.length} cursos generados`);
