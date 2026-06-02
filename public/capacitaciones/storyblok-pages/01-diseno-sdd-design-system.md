# 01 · Diseño: SDD + design system

> Objetivo: antes de tocar código, definir QUÉ página y CON QUÉ piezas. Spec primero, design system después.

## Por qué diseñar antes

Una página Storyblok no es "tirar componentes". Es decidir qué bloks la componen, qué datos consume cada uno, y qué comportamiento verificable tiene. SDD te obliga a escribir eso antes — y los gates de la lección 04 verifican contra esa spec.

## Harness · SDD lifecycle

El ciclo SDD vive como skills encadenados. Para una página nueva:

```
sdd-explore   → mapear lo que ya existe (bloks reusables, páginas similares)
sdd-propose   → intent + scope + approach
sdd-design    → decisiones técnicas (qué bloks, datos, SSR vs estático)
sdd-spec      → requirements + scenarios (GIVEN/WHEN/THEN) verificables
sdd-tasks     → checklist de implementación
```

Todo vive en `openspec/changes/<tu-pagina>/`. Reglas del equipo:

- Toda spec bajo `openspec/changes/<slug>/` — nunca `docs/specs` ni ad-hoc.
- Tildá las tasks a medida que cerrás bloques (`sdd-track`), no todo al final.

> Para /comercios y rutas sensibles el equipo exige SDD + TDD por task. Para una landing simple, un proposal + spec liviano alcanza — pero **siempre** hay spec.

## Decidí: ¿blok nuevo o reusás?

Antes de crear un componente, mirá el registry. Quizás ya existe el blok que necesitás:

```bash
# qué bloks hay disponibles
sed -n '/export const CMS_COMPONENTS/,/^};/p' src/CMS/utils/availableComponents.tsx
```

Bloks actuales (no exhaustivo): `HeroPrimary`, `HeroSecondary`, `SectionBannerWithImage`, `SectionBannerWithoutImage`, `SectionGrid`, `SectionRounded`, `SectionBannerIcon`, `SectionCarousel`, `SectionCarouselGroup`, `SectionDualInfo`, `SectionDualList`, `SectionVideo`, `SectionBankList`, `SectionBlog`, `SectionCollapsible`, `Download`, `Navbar`, `Footer`.

**Regla:** si un blok existente cubre el caso, **reusalo** (solo autorás la story). Creás componente nuevo solo si ningún blok encaja.

## Harness · design system MODO

El skill `modo-design-system` codifica las reglas de marca MODO para páginas SDK Next/Astro. Lo que importa para un blok:

- Componentes base vienen de `@playsistemico/modo-ui-lib-web` (ej. `HeroPrimary`, `SectionDualVariants`). **No** reimplementes UI que la lib ya da.
- Colores/tipografía: tokens en `tailwind.config.js` (paleta SDK MODO, Red Hat Display). **Nunca hex hardcodeado.**
- El blok React es un **adaptador fino**: toma `data` de Storyblok y se la pasa al componente de la lib. Mirá [`src/CMS/components/CMSHeroPrimary/index.tsx`](../../../) — 30 líneas, mapea `data` → `<HeroPrimary>`.

## Output de esta lección

- `openspec/changes/<tu-pagina>/proposal.md` + `spec-delta.md` con scenarios verificables.
- Lista de bloks: cuáles reusás, cuál(es) creás.
- Para el blok nuevo: qué componente de `modo-ui-lib-web` lo respalda y qué campos de Storyblok consume.

## Checklist de salida

- [ ] Proposal + spec con scenarios GIVEN/WHEN/THEN
- [ ] Decisión reusar-vs-crear por cada blok, justificada
- [ ] Blok nuevo mapeado a un componente de `modo-ui-lib-web` + tokens (sin hex)

> Siguiente: [02 · Crear la página: story + blok](02-crear-pagina-storyblok.md)
