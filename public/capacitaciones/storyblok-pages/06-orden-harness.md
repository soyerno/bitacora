# 🧭 Orden óptimo del harness

> Las lecciones 00→05 te dieron las herramientas. Esta las **ordena** en un flujo: **idea → diseño → evaluación → integración**. Lo importante: el **diseño se resuelve con Claude** (no solo el código), y la integración es lo **último** — recién cuando el diseño está evaluado y aprobado. Fundamentado en las prácticas oficiales de Anthropic para Claude Code.

## La columna vertebral: idea → diseño → evaluación → integración

```
IDEA            DISEÑO                 EVALUACIÓN            INTEGRACIÓN
qué querés  →   con Claude Design  →   revisión/crítica  →  recién acá: código
(brief)         + agents de diseño     del diseño            (story+blok, TDD, gates, deploy)
                ANTES de codear        (gate de diseño)
```

La trampa más común es saltar de la idea directo a la integración (“abro Storyblok y empiezo a tirar bloks”). Anthropic lo nombra explícito: *explorar y planear antes de codear* evita resolver el problema equivocado ([Claude Code best practices](https://code.claude.com/docs/en/best-practices)). Acá el **diseño es esa fase de planeo** — y la hacés con Claude, no a mano.

## Diseñá con Claude, no solo codees con Claude

La invitación de este curso: resolvé el **diseño** apoyándote en agents/skills de diseño de Claude, con foco de marca, UX y frontend. Los agents MODO dedicados ya existen (`~/.claude/agents/`):

| Agent | De qué es dueño |
|----------------|--------------------|
| `modo-branding` | Identidad de marca: paleta, tipografía, tono, consistencia con el sistema MODO |
| `modo-ux` | Arquitectura de información, flujos, jerarquía, accesibilidad, copy UX |
| `modo-frontend` | Traducción diseño→componentes: qué bloks, layout responsive, performance |

> **Entrenados (2026-06-17).** Los agents `modo-branding`, `modo-ux` y `modo-frontend` ya existen en `~/.claude/agents/`, aterrizados en las reglas reales de `modo-landing` (branding oficial, `src/CMS/`, bloks reales). Se apoyan en el skill **`modo-design-system`** (reglas de marca) y en **`impeccable`** / **`ui-ux-pro-max`** (diseño/UX). El panel de evaluación es **`modo-design-review`** y el orquestador full es **`modo-page-pipeline`**.

### El proceso, paso a paso

“Diseñar con Claude” no es pedirle “hacé una página linda”. Es un **loop corto y dirigido**: vos das el brief, cada agente aporta su capa, vos revisás y ajustás. Cada agente corre como **subagente** (contexto propio) para no ensuciar el hilo principal — patrón de Anthropic *use subagents for investigation*.

1. **Brief.** Arrancá con el qué y el porqué, no con el cómo. Dejá que Claude te entreviste si falta info: *“Quiero una landing de pagos agénticos. Entrevistame con `AskUserQuestion` sobre audiencia, mensaje y edge cases, y escribí un brief.”* (Anthropic *let Claude interview you*.)
2. **Marca → `modo-branding`.** *“Usá `modo-branding` para la dirección de marca de esta página.”* Devuelve tokens del branding oficial, tipografía y tono. Sin hex a mano.
3. **UX → `modo-ux`.** *“Pasá el brief + la dirección de marca a `modo-ux`.”* Devuelve estructura (orden de bloks), jerarquía, un CTA principal, requisitos de a11y y copy.
4. **Frontend → `modo-frontend`.** *“Con eso, `modo-frontend`: qué bloks reuso del CMS y cuál creo.”* Devuelve el plan técnico: reuse-vs-create sobre `CMS_COMPONENTS`, responsive y performance.
5. **Evaluación → `modo-design-review`.** *“Evaluá el diseño con `modo-design-review`.”* Un panel en contexto fresco (Brand Guardian + Accessibility Auditor + `impeccable`) intenta refutarlo y emite **APROBADO / RECHAZADO** con findings. Si rechaza, volvés al agente que corresponda.
6. **Gate humano.** Vos mirás el veredicto y aprobás. Recién ahí pasás a integración (`modo-storyblok`).

**Tips para que rinda:**

- **Encadenás la salida**, no repetís el contexto: la dirección de marca alimenta a UX, UX alimenta a frontend. El resultado es una mini-spec de diseño lista para `sdd-spec` y `modo-storyblok`.
- **Iterá corto.** Si algo no cierra, corregí en el acto (*“el hero compite con el CTA, bajale jerarquía”*) en vez de acumular vueltas. Anthropic *course-correct early and often*.
- **No saltees la evaluación.** Es la diferencia entre “se ve bien” y “probado”: un revisor que no hizo el diseño lo juzga sin sesgo.
- **El atajo:** `modo-page-pipeline` corre este loop completo (brief → marca → UX → frontend → evaluación) parando en los gates humanos — útil cuando ya tenés el flujo internalizado.

## El principio que ordena todo: el context window

La restricción base de Claude Code es el **context window**: se llena rápido y el rendimiento cae a medida que se llena. De ahí se derivan: **skills on-demand** (no meter todo en `CLAUDE.md`), **subagentes para investigar** (leer muchos archivos en contexto aparte) y **`/clear` entre fases**. Base: *Claude Code 101* y *Claude Code in Action* en [Anthropic Academy](https://anthropic.skilljar.com/).

## La secuencia óptima, fase por fase

Cada fila mapea a un principio nombrado de Anthropic. Fijate que **integración** (fila 8 en adelante) no arranca hasta que el diseño pasó su evaluación.

| Macro | Fase | Harness MODO | Principio Anthropic |
|-------|------|--------------|---------------------|
| **Idea** | 0 · Brief | `AskUserQuestion` (que Claude te entreviste) | *Let Claude interview you* → spec self-contained |
| **Idea** | 1 · Ambiente (una vez) | `modo-team-onboarding`, `github-packages-auth`, `CLAUDE.md` | *Configure your environment* |
| **Diseño** | 2 · Explorar | `sdd-explore` | *Explore first, then plan, then code* |
| **Diseño** | 3 · Diseñar con Claude | agents `modo-branding` / `modo-ux` / `modo-frontend` + apoyo `modo-design-system`, `impeccable`, `ui-ux-pro-max` | *Reference existing patterns* |
| **Evaluación** | 4 · Criticar el diseño | revisión adversarial del diseño: Brand Guardian + Accessibility Auditor + `impeccable` en contexto fresco | *Add an adversarial review step* aplicado al **diseño**, no solo al código |
| **Evaluación** | 5 · Formalizar | `sdd-propose` · `sdd-design` · `sdd-spec` · `sdd-tasks` | *Explore→plan→code* (la spec es el contrato) |
| **Evaluación** | — | **Gate de diseño**: ¿aprobado? Si no, volvé a la fase 3. | *Give Claude a way to verify its work* |
| **Integración** | 6 · Construir | `modo-storyblok` | *Provide specific context* |
| **Integración** | 7 · Verificar (TDD) | `test-driven-development` | *Give Claude a way to verify its work* |
| **Integración** | 8 · Revisar código | `guardia` (subagentes ‖) · `sdd-verify` · SonarCloud (MCP) | *Use subagents for investigation* |
| **Integración** | 9 · Gates ‖ | `chrome-devtools` · `frontend-security-checklist` · `modo-seo-geo-audit` | *Fan out* |
| **Integración** | 10 · Deploy + smoke | `modo-frontend-deploy` · `modo-landing-smoke-test` · `modo-stakeholder-gate` | *Verify against the real edge* |
| **Integración** | 11 · Orquestar | `modo-landing-page-builder` (Workflow) | *Run multiple sessions* · *Fan out* |

> El **gate de diseño** entre Evaluación e Integración es la clave del flujo: no se escribe una línea de código hasta que el diseño está evaluado y aprobado. Integrar antes es construir sobre arena.

## Cuándo usar qué

Anthropic lo resume como *“match features to your goal”*. Aplicado al harness:

| Si necesitás… | Usá | Ejemplo |
|---------------|-----|---------|
| Conocimiento/flujo reusable on-demand | **Skill** | `modo-storyblok`, `sdd-*`, `modo-design-system` |
| Diseñar/criticar con foco aislado | **Agent de diseño** | `modo-branding` / `modo-ux` / `modo-frontend` (+ Brand Guardian / Accessibility Auditor en `modo-design-review`) |
| Leer muchos archivos sin ensuciar el hilo | **Subagente** | revisores de `guardia` |
| Hablar con un servicio externo | **MCP** | SonarCloud, `chrome-devtools` |
| Algo determinístico que pase siempre | **Hook** | spec-first, pre-commit |
| Fan-out de varias fases | **Workflow** | `modo-landing-page-builder` |

Profundizá: *Introduction to agent skills*, *Introduction to subagents*, *Introduction to Model Context Protocol* en [Anthropic Academy](https://anthropic.skilljar.com/).

## Reglas de contexto (de Anthropic, aplicadas)

- **`/clear` entre fases** no relacionadas.
- **Subagentes para investigación y crítica** — que lean/evalúen ellos.
- **Verificá siempre, mostrá evidencia** — un gate “verde” sin la salida del comando es prosa. (Mismo criterio del harness MODO: sin evidencia ≠ passed.)
- **Idea → diseño → evaluación → integración** — y nunca integres un diseño que no pasó su evaluación.

## Recursos

- **Anthropic — Claude Code best practices**: https://code.claude.com/docs/en/best-practices
- **Match features to your goal** (skills vs subagents vs hooks vs MCP): https://code.claude.com/docs/en/features-overview
- **Anthropic Academy**: https://anthropic.skilljar.com/ — *Claude Code 101* · *Claude Code in Action* · *Introduction to agent skills* · *Introduction to subagents* · *Introduction to Model Context Protocol*
- Skills de diseño MODO/Claude hoy: `modo-design-system`, `impeccable`, `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`.

> Con el orden claro, el [⚙ Harness: los 4 gates](#gates) te da el criterio de cada control; el atajo `modo-landing-page-builder` corre la integración por vos.
