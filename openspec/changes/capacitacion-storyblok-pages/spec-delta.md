# Spec delta — capacitacion-storyblok-pages

## ADDED Requirement: Curso interactivo de creación de páginas Storyblok

El sitio erno-modo DEBE exponer una capacitación interactiva que enseñe a crear páginas Storyblok-managed en modo-landing, consumible vía Claude Code con skills MODO como harness.

### Scenario: Learner completa el camino end-to-end
- **GIVEN** un dev con acceso al repo modo-landing y a Claude Code
- **WHEN** sigue las lecciones 00→05 de `capacitaciones/storyblok-pages/`
- **THEN** configura el ambiente, diseña con SDD + design system, crea una story + blok, escribe el test primero, pasa los 4 gates y documenta el deploy alpha.

### Scenario: Lab verificable
- **GIVEN** la lección del lab (`exercises/`)
- **WHEN** el learner construye el blok `SectionPromoBanner`
- **THEN** el blok queda registrado en `CMS_COMPONENTS`, tiene tipos en `types.ts`, un test RTL semántico (sin snapshots) y una solución de referencia para diffear.

## ADDED Requirement: Agente orquestador modo-landing-page-builder

DEBE existir un triple-layer skill que orqueste la creación de una página Storyblok end-to-end, delegando a los skills MODO especializados y disparando un Workflow para los gates.

### Scenario: Invocación del skill
- **GIVEN** el skill instalado en `~/.claude/skills/modo-landing-page-builder/`
- **WHEN** el user dice "crear página en modo-landing" o `/modo-landing-page-builder`
- **THEN** el skill guía scaffold → TDD → gates → deploy-alpha → verify, sin duplicar la lógica de los skills delegados.

### Scenario: Gates como barrier pre-deploy
- **GIVEN** el Workflow `page-builder.workflow.js`
- **WHEN** corre los gates (code-review+SDD ‖ perf+CSP ‖ a11y+SEO) en paralelo
- **THEN** el deploy-alpha solo procede si todos los gates retornan `passed: true`; cualquier gate fallido bloquea con su evidencia.

## ADDED Requirement: Publicación en erno-modo Pages

La capacitación DEBE tener un entry branded MODO linkeado desde la home de erno-modo y registrado en un manifest validable contra el filesystem.

### Scenario: Manifest consistente
- **GIVEN** `capacitaciones/capacitaciones.json`
- **WHEN** corre la validación (patrón `erno-modo-sync-all`)
- **THEN** cada entry del manifest apunta a un `href` existente en el filesystem; sin orphans.
