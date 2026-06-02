# Tasks — capacitacion-storyblok-pages

## Fase 1 · SDD + estructura
- [x] Crear worktree `feat/capacitacion-storyblok-pages` en erno-modo
- [x] Scaffold SDD (proposal · design · spec-delta · tasks)
- [x] Crear `capacitaciones/storyblok-pages/` + README índice

## Fase 2 · Lecciones del curso
- [x] 00 · Setup de ambiente (node 22, pnpm, .npmrc GH Packages, vars Storyblok, region/space check)
- [x] 01 · Diseño: SDD lifecycle + design system MODO
- [x] 02 · Crear página: story Storyblok + blok wiring (registry + types)
- [x] 03 · TDD red→green (RTL semántico, sin snapshots)
- [x] 04 · Gates de validación (los 4)
- [x] 05 · Deploy alpha a playsistemico (ci-alpha.yaml + runbook k8s)

## Fase 3 · Lab
- [x] `exercises/README.md` — enunciado del lab `SectionPromoBanner`
- [x] `exercises/solution/` — solución de referencia (index.tsx, types.ts, test, snippet de registry, story JSON)

## Fase 4 · Harness (skill + workflow)
- [x] `~/.claude/skills/modo-landing-page-builder/SKILL.md` (triple-layer)
- [x] agent + slash command del skill
- [x] `reference/` recipes (page-creation, blok-registry, gates)
- [x] `harness/page-builder.workflow.js` (TDD→gates‖→barrier→deploy→verify) — `node --check` OK
- [x] `harness/gates.md` — comando + criterio por gate

## Fase 5 · Pages + manifest
- [x] `index.html` branded MODO (reusa assets/styles.css + Course JSON-LD)
- [x] `capacitaciones/capacitaciones.json` manifest (JSON válido, href→index.html existe)
- [x] Link desde `erno-modo/index.html` (nav + explore card)

## Fase 6 · Calidad + cierre
- [x] Audit-iterate: subagent review independiente — 0 findings, todas las claims verificadas contra código real (slug SSR, CMS_COMPONENTS, getCMSComponent, 3 puntos, region eu, ci-alpha workflow_dispatch)
- [x] Verificación: JSON válido · workflow JS parsea · href manifest OK · triple-layer files presentes
- [ ] Commit + PR a erno-modo
- [ ] `/erno-modo-sync-all` (bundlea el skill modo-landing-page-builder al sitio)
