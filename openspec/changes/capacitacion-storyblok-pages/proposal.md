# Proposal — Capacitación: Crear páginas Storyblok-managed en modo-landing

## Intent

Convertir el conocimiento tácito de "cómo se crea una página administrada por Storyblok en modo-landing" en una **capacitación interactiva Claude-Code**, donde el ecosistema de agentes/skills MODO actúa como **harness** que guía al learner hands-on y verifica cada gate de calidad.

## Problem

- El flujo de página Storyblok vive disperso: `src/CMS/` (registry de bloks), Storyblok (autoría de stories), design system (`modo-ui-lib-web` + tokens tailwind), deploy a playsistemico (EKS/Istio) y ~20 skills MODO.
- Un dev nuevo no tiene un camino guiado end-to-end. Onboarding lento, inconsistente, sin gates explícitos (TDD, code review, perf, CSP, a11y, SEO/GEO).
- No existe un agente que orqueste el flujo completo de creación de una página.

## Scope

**In:**
1. Curso interactivo en `capacitaciones/storyblok-pages/` (lecciones 00–05 + README + lab).
2. Lab guiado: blok de ejemplo `SectionPromoBanner` (story + componente + test + gates).
3. Triple-layer skill `modo-landing-page-builder` (skill + agent + slash command).
4. Workflow orquestador `page-builder.workflow.js` (scaffold → TDD → gates en paralelo → deploy-alpha → verify).
5. Entry branded en erno-modo Pages (`index.html` + manifest `capacitaciones.json`).
6. Los 4 gates horneados: TDD red→green · Code review + SDD · Performance + CSP · a11y + SEO/GEO.

**Out:**
- No se crea repo nuevo en SoyErnoModo (vive en erno-modo).
- No se dispara deploy a prod (alpha documentado/dry-run).
- No se modifica código productivo de modo-landing (salvo el blok del lab, en su propio worktree si se ejecuta de verdad).

## Approach

El curso refleja el lifecycle real verificado en código (`[[...slug]].jsx` SSR → `body[]` → `getCMSComponent` → `CMS_COMPONENTS` registry). Cada lección delega a un skill MODO existente — la capacitación **orquesta, no duplica**. El skill `modo-landing-page-builder` es el harness ejecutable; el Workflow paraleliza los gates independientes.

## Success criteria

- Un dev sigue 00→05, construye el blok del lab y pasa los 4 gates verdes.
- `/modo-landing-page-builder` orquesta el flujo end-to-end y dispara el Workflow.
- El entry Pages rinde branded MODO y valida contra el filesystem (patrón `erno-modo-sync-all`).

## Author

Hernán De Souza · Sr AI Engineer
