# 🤖 Automatización total · vos sos el QA

> El objetivo final del harness: que **todo lo operativo lo hagan skills y agentes**, y vos quedes como **QA** — el que valida, critica y aprueba en unos pocos gates, no el que ejecuta. Esta lección mapea el set completo de skills/agentes por fase, qué se automatiza, dónde decidís vos, y qué falta entrenar.
>
> Esta arquitectura se endureció en **5 pasadas de crítica** (completitud, gaps de automatización, claridad del QA, honestidad de lo-que-falta, y manejo de fallas). Lo que cambió en cada pasada está al final.

## El modelo: humano como QA

La idea no es “Claude hace todo solo”. Es: **lo mecánico se automatiza; el juicio queda en vos**, concentrado en gates explícitos. En cada gate ves **evidencia** (no re-ejecutás: revisás la salida que el agente ya produjo — *evidence over assertion*, [Anthropic](https://code.claude.com/docs/en/best-practices)) y decidís **aprobar** o **rechazar → volver a la fase X**.

Tenés exactamente **4 gates humanos** en todo el pipeline. El resto corre solo.

## El pipeline completo (skills/agentes por fase)

| Fase | Qué la maneja (skill/agente) | Estado | ¿Gate humano? | Evidencia que ves · si rechazás |
|------|------------------------------|--------|---------------|----------------------------------|
| 0 · Brief de la idea | intake con `AskUserQuestion` (hoy `modo-planner`) | existe (parcial) | — | — |
| 1 · Ambiente | `modo-team-onboarding`, `github-packages-auth`, `modo-services-monitor` | existe | — (auto; solo avisa si rompe) | — |
| 2 · Diseño con Claude | `modo-branding` · `modo-ux` · `modo-frontend` (apoyo: `modo-design-system`, `impeccable`, `ui-ux-pro-max`) | **existe** ✅ | ✅ **GATE 1 — gusto/marca** | mockup + lista de bloks + tokens · → vuelve a fase 2 |
| 3 · Assets | `imagegen-frontend-web` + optimización de imágenes (peso/AVIF) | existe (parcial) | — | — |
| 4 · Evaluación del diseño | `modo-design-review` (panel: Brand Guardian + Accessibility Auditor + `impeccable`) | **existe** ✅ | ✅ **GATE 2 — veredicto de diseño** | findings + verdict por lente · → vuelve a fase 2 |
| 5 · Spec / tasks | `sdd-propose` · `sdd-design` · `sdd-spec` · `sdd-tasks` | existe | — (spot-check opcional) | spec con scenarios |
| 6 · Construir | `modo-storyblok` (story + blok + registro 3 puntos) | existe | — | — |
| 7 · Verificar (TDD) | `test-driven-development` | existe | — (el test es el check) | salida de tests |
| 8 · Revisión de código | `guardia` (subagentes ‖) · `sdd-verify` · SonarCloud (MCP) | existe | ✅ **GATE 3 — calidad** | reporte + Quality Gate · → vuelve a fase 6 |
| 9 · Gates ‖ | `chrome-devtools` (perf) · `frontend-security-checklist` (CSP) · `modo-seo-geo-audit` (a11y+SEO) | existe | (incluido en GATE 3) | lighthouse + CSP + audit |
| 10 · Deploy alpha + smoke | `modo-frontend-deploy` · `modo-landing-smoke-test` | existe | — (auto contra alpha) | smoke 200 + perf/CSP del edge |
| 11 · Observabilidad | `modo-services-monitor` · Datadog (MCP) | existe | — (auto; alerta si degrada) | estado post-deploy |
| 12 · Pre-prod | `modo-stakeholder-gate` + `modo-pr-author` | existe | ✅ **GATE 4 — prod (humano + GRC)** | PR + validación de owners · → no promueve |
| — · Orquestación | `modo-page-pipeline` (full idea→prod, los 4 gates) + `modo-landing-page-builder` (integración 6→10) | **existe** ✅ | — | — |

## Lo entrenado (2026-06-17) y lo que falta

Las piezas que faltaban para que sea **un solo comando con vos solo en los 4 gates** ya están entrenadas:

1. ✅ **Agentes de diseño MODO** — `modo-branding`, `modo-ux`, `modo-frontend` (agents en `~/.claude/agents/`), aterrizados en las reglas reales de `modo-landing` (branding oficial, `src/CMS/`, bloks reales). Apoyo: `modo-design-system`, `impeccable`, `ui-ux-pro-max`.
2. ✅ **Panel de crítica de diseño** — `modo-design-review` (skill) compone Brand Guardian + Accessibility Auditor + `impeccable` en contexto fresco y emite veredicto (GATE 2).
3. ✅ **Orquestador full-pipeline** — `modo-page-pipeline` (skill) encadena idea→diseño→evaluación→integración→deploy parando en los 4 gates; delega la integración a `modo-landing-page-builder`.

Falta todavía (gap honesto):

- **Handoff diseño→storyblok** — automatizar que la salida aprobada de diseño (bloks + tokens + contenido) alimente directo a `modo-storyblok`, sin re-tipear.
- **Branding oficial en `modo-design-system`** — el skill canónico todavía documenta tokens `sdk-*` (legacy); hay que actualizarlo al branding oficial para que los agents lo citen sin caveats.

## Reglas para que “vos = QA” funcione de verdad

- **Cada gate trae evidencia, no promesas.** Un gate sin la salida del comando/reporte no es aprobable. (Sin evidencia ≠ passed.)
- **Rechazar siempre tiene destino.** El gate dice a qué fase volver; el orquestador hace loop-back, no skip.
- **Falla de gate = bloqueo, no “lo arreglo después”.** Si un control da rojo, el pipeline para en ese punto.
- **Nada de caps silenciosos.** Si el orquestador saltea algo (top-N, sin retry), lo **declara**; saltear en silencio se lee como “cubrí todo” cuando no.
- **Contexto limpio entre fases** (`/clear`, subagentes para investigar) — base de Anthropic para que la cadena larga no degrade.

## Cómo se endureció (las 5 pasadas)

1. **Completitud** → faltaban *assets* (fase 3) y *observabilidad post-deploy* (fase 11). Agregadas.
2. **Gaps de automatización** → se marcó explícito qué **no** se puede full-automatizar (gusto de marca, aprobación prod) como gates humanos obligatorios, sin fingir que son automáticos.
3. **Claridad del QA** → cada gate ahora dice **qué evidencia ves** y **a qué fase volvés si rechazás**.
4. **Honestidad** → columna *estado: existe / a entrenar*; no se implica automatización que no existe todavía.
5. **Manejo de fallas/orden** → loop-back explícito, falla = bloqueo, y regla anti-cap-silencioso.

## Recursos

- **Claude Code best practices** (verify, subagentes, fan-out, contexto): https://code.claude.com/docs/en/best-practices
- **Anthropic Academy**: https://anthropic.skilljar.com/ — *Claude Code in Action*, *Introduction to subagents*, *Introduction to agent skills*.

> Esta es la foto del destino: vos validás, criticás y aprobás; el harness ejecuta. El [🧭 Orden óptimo del harness](#orden) es el camino para llegar; el [⚙ Harness: los 4 gates](#gates), el criterio de cada control.
