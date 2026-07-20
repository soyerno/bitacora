# Solución de referencia · `SectionPromoBanner`

Mirá esto **después** de intentar el lab. Compará con lo tuyo.

## Archivos

| Archivo | Va a (en modo-landing) | Qué muestra |
|---------|------------------------|-------------|
| `types.ts` | `src/CMS/components/CMSSectionPromoBanner/types.ts` | interface extendiendo `IDefaultFields` |
| `index.tsx` | `src/CMS/components/CMSSectionPromoBanner/index.tsx` | adaptador fino + CTA condicional + `useMemo` |
| `CMSSectionPromoBanner.test.tsx` | mismo dir | RTL semántico, 4 tests, sin snapshots |
| `registry-snippet.md` | — | los 3 puntos de registro |
| `story.json` | Storyblok (no es archivo del repo) | story de prueba con 2 bloks (con y sin CTA) |

## Decisiones de la solución

- **CTA condicional con `&&`** sobre `ctaUrl` — el scenario "NO muestra CTA" lo verifica con `queryByRole('link')` + `not.toBeInTheDocument()`.
- **`useMemo` para `items`** — mismo patrón que `CMSHeroPrimary` con `pills`.
- **Variante por mapa de clases token** (`VARIANT_CLASS`), no `style={{ background: '#...' }}`. Las clases `bg-sdk-*` son ilustrativas: reemplazalas por los tokens reales de `tailwind.config.js`.
- **Sin `console.*`**, tipos en todo, `key` estable en la lista.

## Por qué pasa los gates

- **TDD**: 4 tests, los dos caminos del condicional, escritos antes (lo demostrás vos en RED).
- **Code review**: sin smells obvios, sin hex, tipos completos, sin `console`.
- **a11y**: `<h2>`, `<ul>/<li>`, link real con texto descriptivo. Si agregás imagen → `alt`.
- **Perf**: componente liviano, sin imágenes pesadas; si fuera hero, evaluar SSR.

## Lo que falta (a propósito)

La solución no incluye el `alt` de imágenes (el banner no tiene imagen) ni JSON-LD (no es un tipo schema.org puntual). Si tu variante del lab agrega imagen o es un tipo indexable, sumá `alt` descriptivo y seguí el patrón `buildExtraStructuredData` del catch-all.
