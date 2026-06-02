# Design — Capacitación Storyblok modo-landing

## D1 · El harness son los agentes, no un runner custom

**Decisión:** el "harness" del curso es el conjunto de skills MODO + Claude Code, no un script propio.
**Razón:** evita mantener un motor paralelo; cada skill ya está probado y versionado. La capacitación referencia y orquesta.
**Impacto:** lecciones = markdown con instrucciones + invocaciones de skill. El único código nuevo es el skill orquestador + el Workflow.

## D2 · Lifecycle del curso = lifecycle real del código

**Decisión:** el orden de lecciones replica el pipeline verificado en `[[...slug]].jsx`:
setup → diseño (SDD + design system) → crear story+blok → TDD → gates → deploy alpha.
**Razón:** el learner mapea cada paso a un punto del código real (no teoría).
**Impacto:** lección 02 ancla en `src/CMS/utils/availableComponents.tsx` (registry) y `src/CMS/components/CMSComponent/index.tsx` (dispatcher vía `getCMSComponent`).

## D3 · Triple-layer skill + Workflow embebido

**Decisión:** `modo-landing-page-builder` triple-layer (skill auto-invocable + agent + slash). El skill describe el flujo; para los gates paralelizables invoca un Workflow JS.
**Razón:** patrón canónico MODO (`feedback_triple_layer_framework`). El Workflow da fan-out determinístico de los 4 gates.
**Impacto:** el skill NO duplica `modo-storyblok`/`guardia`/etc — delega. El Workflow corre cada gate como `agent()` con schema de veredicto, barrier antes de deploy.

## D4 · Gates como veredictos estructurados

**Decisión:** cada gate retorna `{passed: bool, findings: [...], evidence: "..."}`.
**Razón:** evita "claim fix sin verify" (`feedback_no_mentir_pedir_help`); el deploy-alpha solo procede si todos los gates `passed`.
**Impacto:** Workflow usa `parallel()` para los 3 grupos de gates (TDD ya corrió en fase previa), barrier, luego deploy.

## D5 · Lab con blok nuevo, no página completa

**Decisión:** el lab construye un solo blok (`SectionPromoBanner`) wireado al registry, renderizado en una story de prueba.
**Razón:** un blok es la unidad mínima que ejercita todo el pipeline (story + registry + tipos + test + gates) sin requerir scope de página productiva.
**Impacto:** solución de referencia incluida; el learner puede diffear.

## D6 · Storyblok region

**Decisión:** documentar `region: 'eu'` (valor en `src/CMS/config.ts:10` y `utils.tsx:54`), con nota de verificar contra el space asignado antes de autorar.
**Razón:** la memoria registra un space us histórico; el código productivo usa eu. La verdad operativa es el código + el token del ambiente.
**Impacto:** lección 00 incluye check explícito del region/space.

## Componentes

```
capacitaciones/storyblok-pages/
├── README.md              índice + learning path
├── 00..05-*.md            lecciones
├── exercises/             lab + solución de referencia
├── harness/               page-builder.workflow.js + gates.md
└── index.html             entry Pages branded

~/.claude/skills/modo-landing-page-builder/
├── SKILL.md  agent.md  command (triple-layer)
└── reference/            recipes
```
