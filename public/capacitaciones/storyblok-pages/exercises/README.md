# 🧪 Lab · Blok `SectionPromoBanner`

> Ejercicio integrador. Construís un blok nuevo de punta a punta y le pasás los 4 gates. La solución de referencia está en [`solution/`](solution/) — no la mires hasta intentarlo.

## El pedido (la spec)

Marketing quiere un banner de promo configurable desde Storyblok para usar en varias landings. Comportamiento:

1. Muestra un **título** y un **subtítulo** (ambos de Storyblok).
2. Muestra una **lista de beneficios** (`items[]`), cada uno con texto.
3. Muestra un **CTA** (botón con texto + URL) **solo si** `ctaUrl` está seteado. Si no, no hay botón.
4. Acepta una variante de color (`variant: 'primary' | 'secondary'`) usando **tokens del design system** (sin hex).

> Tiene lógica condicional (CTA) y mapeo de lista → **TDD obligatorio** (lección 03).

## Tu trabajo

Seguí el flujo completo del curso:

### 1. Diseño (lección 01)
Escribí la mini-spec: scenarios GIVEN/WHEN/THEN para cada punto del comportamiento. Decidí qué componente de `@playsistemico/modo-ui-lib-web` respalda el banner (o un `<section>` propio con tokens si no hay uno que encaje).

### 2. RED — test primero (lección 03)
`src/CMS/components/CMSSectionPromoBanner/CMSSectionPromoBanner.test.tsx`. Mínimo:
- renderiza título y subtítulo
- renderiza N items
- **muestra CTA cuando hay `ctaUrl`**
- **NO muestra CTA cuando falta `ctaUrl`**

Corré, vela fallar.

### 3. GREEN — el blok (lección 02)
- `types.ts` — interface extendiendo `IDefaultFields`.
- `index.tsx` — adaptador fino, condicional del CTA, `useMemo` para los items.
- Registrá en los **3 puntos**: `IAvailableComponents` (types.ts), `CMS_COMPONENTS` (availableComponents.tsx), y el `component: "SectionPromoBanner"` en la story.

### 4. La story (lección 02)
Creá una story de prueba (ej. slug `lab/promo-banner`) con un `body` que use tu blok. Publicá (o `?preview=true` en develop). Confirmá que rinde en `pnpm dev`.

### 5. Gates (lección 04)
- `pnpm test` verde
- `/guardia` — 0 smells, sin `console.*`, sin hex, tipos OK
- `/modo-seo-geo-audit` — `alt` descriptivo, JSON-LD si aplica
- Lighthouse + CSP contra el alpha (lección 05)

### 6. Deploy alpha (lección 05) — opcional
`gh workflow run ci-alpha.yaml -f environment=develop --ref <tu-rama>`, smoke 200.

## Criterio de aprobado

- [ ] Test escrito antes, visto fallar, luego verde
- [ ] CTA condicional cubierto por test (los dos caminos)
- [ ] Blok registrado en los 3 puntos · rinde en dev
- [ ] Sin hex (tokens) · sin `console.*` · tipos en props · `alt` descriptivo
- [ ] Los 4 gates verdes

## Atajo

```
/modo-landing-page-builder
```
Dejá que el agente orqueste el flujo y compará con lo que hiciste a mano.

> Solución de referencia: [`solution/`](solution/).
