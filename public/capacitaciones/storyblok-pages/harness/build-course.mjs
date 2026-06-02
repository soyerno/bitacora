#!/usr/bin/env node
// Build script — genera el curso interactivo single-file (index.html) embebiendo
// las lecciones markdown como datos JS. Markdown = source of truth; HTML = derivado.
//
// uso: node harness/build-course.mjs   (desde capacitaciones/storyblok-pages/)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

// Lecciones en orden. file = basename para reescribir links .md → hash.
const LESSON_DEFS = [
  { id: 'intro', num: '·', title: 'Introducción', eyebrow: 'Capacitación interactiva', path: 'README.md' },
  { id: '00', num: '00', title: 'Setup de ambiente', eyebrow: 'Lección 00 · Harness: onboarding + GH Packages', path: '00-setup-ambiente.md', file: '00-setup-ambiente.md' },
  { id: '01', num: '01', title: 'Diseño: SDD + design system', eyebrow: 'Lección 01 · Harness: sdd-* + design system', path: '01-diseno-sdd-design-system.md', file: '01-diseno-sdd-design-system.md' },
  { id: '02', num: '02', title: 'Crear la página: story + blok', eyebrow: 'Lección 02 · Harness: modo-storyblok', path: '02-crear-pagina-storyblok.md', file: '02-crear-pagina-storyblok.md' },
  { id: '03', num: '03', title: 'TDD red→green', eyebrow: 'Lección 03 · Harness: test-driven-development', path: '03-tdd-red-green.md', file: '03-tdd-red-green.md' },
  { id: '04', num: '04', title: 'Gates de validación', eyebrow: 'Lección 04 · Harness: guardia · security · seo-geo', path: '04-gates-validacion.md', file: '04-gates-validacion.md' },
  { id: '05', num: '05', title: 'Deploy alpha a playsistemico', eyebrow: 'Lección 05 · Harness: modo-frontend-deploy', path: '05-deploy-alpha-playsistemico.md', file: '05-deploy-alpha-playsistemico.md' },
  { id: 'lab', num: '🧪', title: 'Lab: SectionPromoBanner', eyebrow: 'Lab integrador · los 4 gates', path: 'exercises/README.md' },
  { id: 'gates', num: '⚙', title: 'Harness: los 4 gates', eyebrow: 'Referencia del Workflow', path: 'harness/gates.md' },
];

// Lección sintética "Solución de referencia" — concatena los archivos de solution/ en code fences.
function buildSolucion() {
  const files = [
    { f: 'exercises/solution/types.ts', lang: 'ts', h: '### types.ts' },
    { f: 'exercises/solution/index.tsx', lang: 'tsx', h: '### index.tsx' },
    { f: 'exercises/solution/CMSSectionPromoBanner.test.tsx', lang: 'tsx', h: '### CMSSectionPromoBanner.test.tsx' },
    { f: 'exercises/solution/registry-snippet.md', lang: null, h: null },
    { f: 'exercises/solution/story.json', lang: 'json', h: '### story.json' },
  ];
  let md = '# Solución de referencia · `SectionPromoBanner`\n\n> Miralo **después** de intentar el lab. Comparalo con lo tuyo.\n\n';
  md += read('exercises/solution/README.md').replace(/^#\s.*\n/, '');
  md += '\n\n---\n\n## Código completo\n\n';
  for (const it of files) {
    if (!existsSync(resolve(ROOT, it.f))) continue;
    const body = read(it.f);
    if (it.lang === null) { md += '\n' + body + '\n'; continue; }
    md += '\n' + it.h + '\n\n```' + it.lang + '\n' + body.trimEnd() + '\n```\n';
  }
  return md;
}

const lessons = LESSON_DEFS.map((d) => ({
  id: d.id, num: d.num, title: d.title, eyebrow: d.eyebrow,
  file: d.file || '',
  md: read(d.path),
}));
// insertar solución después del lab
const labIdx = lessons.findIndex((l) => l.id === 'lab');
lessons.splice(labIdx + 1, 0, { id: 'solucion', num: '✅', title: 'Solución del lab', eyebrow: 'Lab · solución de referencia', file: '', md: buildSolucion() });

const DATA = 'window.LESSONS = ' + JSON.stringify(lessons) + ';';

const HTML = `<!DOCTYPE html>
<html lang="es" data-theme="">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Capacitación · Páginas Storyblok en modo-landing</title>
  <meta name="description" content="Curso interactivo Claude-Code para crear páginas Storyblok en modo-landing: setup, diseño SDD, story+blok, TDD, 4 gates y deploy alpha. Los agentes MODO son el harness." />
  <meta name="theme-color" content="#008859" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Capacitación · Páginas Storyblok en modo-landing" />
  <meta property="og:description" content="Curso interactivo: del setup al deploy alpha, con harness de agentes MODO y 4 gates de calidad." />
  <meta property="og:locale" content="es_AR" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Red+Hat+Display:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/course.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Crear páginas Storyblok-managed en modo-landing",
    "description": "Curso interactivo Claude-Code: setup, diseño SDD + design system, story + blok, TDD red→green, 4 gates y deploy alpha a playsistemico.",
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
      <p class="brand-sub">Páginas Storyblok en modo-landing</p>
      <div class="progress-wrap">
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
        <div class="progress-label" id="progress-label">0/0</div>
      </div>
      <ul class="lesson-nav" id="lesson-nav"></ul>
      <button class="theme-toggle" id="theme-toggle" type="button">🌙 Tema oscuro</button>
      <div class="sidebar-foot">
        Harness ejecutable: <code>/modo-landing-page-builder</code><br />
        <a href="../../">← erno-modo</a> · Hernán De Souza
      </div>
    </aside>
    <main class="content">
      <div class="content-inner" id="content-inner"></div>
    </main>
  </div>
  <script>${DATA}</script>
  <script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
  <script src="assets/course.js"></script>
</body>
</html>
`;

writeFileSync(resolve(ROOT, 'index.html'), HTML);
console.log('index.html generado · ' + lessons.length + ' lecciones · ' + (DATA.length / 1024).toFixed(1) + 'KB de datos embebidos');
