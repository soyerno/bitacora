#!/usr/bin/env node
// Build genérico de cursos interactivos. Un curso = capacitaciones/<slug>/ con:
//   course.json  → { slug, title, subtitle, lessons:[{id,num,title,eyebrow,path,file?}] }
//   <path>.md    → contenido de cada lección (markdown = source of truth)
// Emite <slug>/index.html single-file, embebiendo las lecciones, referenciando ../assets/.
//
// uso: node capacitaciones/build-course.mjs <slug> [<slug2> ...]
//      node capacitaciones/build-course.mjs --all
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CAP = dirname(fileURLToPath(import.meta.url));

function buildOne(slug) {
  const dir = resolve(CAP, slug);
  const cfgPath = resolve(dir, 'course.json');
  if (!existsSync(cfgPath)) { console.error('SKIP ' + slug + ' — falta course.json'); return false; }
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  const lessons = cfg.lessons.map((d) => {
    const mdPath = resolve(dir, d.path);
    if (!existsSync(mdPath)) throw new Error(slug + ': falta lección ' + d.path);
    return { id: d.id, num: d.num, title: d.title, eyebrow: d.eyebrow || '', file: d.file || '', md: readFileSync(mdPath, 'utf8') };
  });
  const DATA = 'window.LESSONS = ' + JSON.stringify(lessons) + ';';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const HTML = `<!DOCTYPE html>
<html lang="es" data-theme="">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(cfg.title)} · Capacitación MODO</title>
  <meta name="description" content="${esc(cfg.subtitle || cfg.title)}" />
  <meta name="theme-color" content="#008859" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(cfg.title)}" />
  <meta property="og:description" content="${esc(cfg.subtitle || cfg.title)}" />
  <meta property="og:locale" content="es_AR" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Red+Hat+Display:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/course.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": ${JSON.stringify(cfg.title)},
    "description": ${JSON.stringify(cfg.subtitle || cfg.title)},
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
      <p class="brand-sub">${esc(cfg.subtitle || '')}</p>
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
  <script>${DATA}</script>
  <script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
  <script>window.COURSE_LS = ${JSON.stringify('course:' + slug + ':')};</script>
  <script src="../assets/course.js"></script>
</body>
</html>
`;
  writeFileSync(resolve(dir, 'index.html'), HTML);
  console.log('✓ ' + slug + ' · ' + lessons.length + ' lecciones · ' + (DATA.length / 1024).toFixed(1) + 'KB');
  return true;
}

let slugs = process.argv.slice(2);
if (slugs[0] === '--all') {
  slugs = readdirSync(CAP).filter((f) => {
    const p = resolve(CAP, f);
    return statSync(p).isDirectory() && existsSync(resolve(p, 'course.json'));
  });
}
if (!slugs.length) { console.error('uso: node build-course.mjs <slug> [...] | --all'); process.exit(1); }
let ok = 0;
for (const s of slugs) { try { if (buildOne(s)) ok++; } catch (e) { console.error('✗ ' + s + ' — ' + e.message); } }
console.log(ok + '/' + slugs.length + ' cursos generados');
