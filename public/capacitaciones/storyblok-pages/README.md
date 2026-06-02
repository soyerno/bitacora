# Capacitación · Crear páginas Storyblok-managed en modo-landing

> **Harness = agentes.** Este no es un manual para leer y olvidar. Es un curso que se hace **con Claude Code abierto**, donde cada paso lo guía y verifica un skill MODO. Vos seguís, Claude orquesta, los gates te dicen si está bien.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## Para quién

Dev frontend que se suma a modo-landing y necesita crear/editar páginas administradas por Storyblok: desde levantar el ambiente hasta dejar la página corriendo en un alpha de playsistemico, pasando por los gates de calidad reales del equipo.

## Qué vas a saber hacer al terminar

1. Levantar modo-landing local con auth a GitHub Packages y vars de Storyblok.
2. Diseñar la página con SDD y el design system MODO antes de tocar código.
3. Crear una **story** en Storyblok y wirear su **blok** al registry de React (`CMS_COMPONENTS`).
4. Escribir el test **primero** (red→green→refactor, RTL semántico, sin snapshots).
5. Pasar los 4 gates: **TDD · Code review + SDD · Performance + CSP · a11y + SEO/GEO**.
6. Documentar y disparar un **deploy alpha** a develop/qa/preprod en playsistemico.

## Cómo está organizado el pipeline real (mapa mental)

```
Storyblok story (slug = URL)
        │ getServerSideProps  ── src/pages/[[...slug]].jsx
        ▼
   cdn/stories/<slug>  (SSR, resolve_relations)
        │ story.content.body[]
        ▼
   DynamicCMSComponent ── getCMSComponent(element) ── src/CMS/utils/utils.tsx
        │ lookup
        ▼
   CMS_COMPONENTS[element.component] ── src/CMS/utils/availableComponents.tsx
        │ render
        ▼
   <CMSHeroPrimary> … blok React con @playsistemico/modo-ui-lib-web + tokens tailwind
```

**Crear una página = autorar la story + (si el blok no existe) crear el componente y registrarlo.**

## Learning path

| # | Lección | Skill harness | Gate que toca |
|---|---------|---------------|---------------|
| 00 | [Setup de ambiente](00-setup-ambiente.md) | `modo-team-onboarding`, `github-packages-auth` | — |
| 01 | [Diseño: SDD + design system](01-diseno-sdd-design-system.md) | `sdd-*`, `modo-design-system` | SDD |
| 02 | [Crear la página: story + blok](02-crear-pagina-storyblok.md) | `modo-storyblok` | — |
| 03 | [TDD red→green](03-tdd-red-green.md) | `test-driven-development` | TDD |
| 04 | [Gates de validación](04-gates-validacion.md) | `guardia`, `frontend-security-checklist`, `modo-seo-geo-audit` | Code review · Perf · CSP · a11y · SEO |
| 05 | [Deploy alpha a playsistemico](05-deploy-alpha-playsistemico.md) | `modo-frontend-deploy`, `modo-frontend-onboarding` | — |
| 🧪 | [Lab: blok SectionPromoBanner](exercises/README.md) | todos | los 4 |

## Atajo: el agente orquestador

Si ya entendés el flujo y querés que un agente lo maneje punta a punta:

```
/modo-landing-page-builder
```

Triple-layer skill que orquesta scaffold → TDD → gates (en paralelo) → deploy-alpha → verify. Internamente dispara el Workflow [`harness/page-builder.workflow.js`](harness/page-builder.workflow.js). Ver [`harness/gates.md`](harness/gates.md) para el criterio de cada gate.

## Reglas del equipo que el curso respeta

- **Sin `console.log/error/warn`** en prod.
- **Sin snapshots** — RTL semántico o Playwright.
- **Tokens del design system**, no hex hardcodeados.
- **Tipos** en todos los props.
- **Commits**: `type(SCOPE-XXX): Subject` (scope = Jira, ej. `COENXT-123`).
- **SonarCloud**: 0 new smells, 0 hotspots, ≤3% duplicación.

> Empezá por [00 · Setup de ambiente](00-setup-ambiente.md).
