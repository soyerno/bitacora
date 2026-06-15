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
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug) {
  console.error("uso: node scripts/build-course.mjs <slug>");
  process.exit(1);
}

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

const html = `<!DOCTYPE html>
<html lang="es" data-theme="">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${course.title} · Capacitación MODO</title>
  <meta name="description" content="${course.subtitle}" />
  <meta name="theme-color" content="#008859" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${course.title}" />
  <meta property="og:description" content="${course.subtitle}" />
  <meta property="og:locale" content="es_AR" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Red+Hat+Display:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/course.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": ${JSON.stringify(course.title)},
    "description": ${JSON.stringify(course.subtitle)},
    "provider": { "@type": "Organization", "name": "MODO" },
    "author": { "@type": "Person", "name": "Hernán De Souza", "jobTitle": "Sr AI Engineer" },
    "inLanguage": "es-AR"
  }
  </script>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-logo">M</span>
        <span class="brand-title">Capacitación MODO</span>
      </div>
      <p class="brand-sub">${course.subtitle}</p>
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
        <div class="progress-label" id="progress-label">0/0</div>
      </div>
      <ul class="lesson-nav" id="lesson-nav"></ul>
      <button class="theme-toggle" id="theme-toggle" type="button">🌙 Tema oscuro</button>
      <div class="sidebar-foot">
        <a href="../">← Capacitaciones</a> · <a href="../../">erno-modo</a><br />Hernán De Souza · Sr AI Engineer
      </div>
    </aside>
    <main class="content">
      <div class="content-inner" id="content-inner"></div>
    </main>
  </div>
  <script>window.LESSONS = ${JSON.stringify(lessons)};</script>
  <script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
  <script>window.COURSE_LS = ${JSON.stringify(`course:${slug}:`)};</script>
  <script src="../assets/course.js"></script>
</body>
</html>`;

writeFileSync(join(dir, "index.html"), html);
console.log(
  `✓ ${dir}/index.html — ${course.lessons.length} lecciones, ${html.length} bytes`,
);
