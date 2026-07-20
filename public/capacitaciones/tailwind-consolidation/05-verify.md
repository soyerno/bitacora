# 05 · Verify

> Objetivo: verificar que la migración no rompió nada visualmente ni en build. Sin snapshots.

## Harness

- `guardia` — gates paralelos: bundle, visual regression, a11y, SonarCloud.
- Playwright — screenshots comparativos desktop + mobile.

---

## La regla: sin snapshots

> El equipo quiere eliminar los Jest snapshots. No los uses para verificar migraciones de styling. Usá RTL semántico o Playwright.

Los snapshots de styled-components se rompen con cada rerender de className generado dinámicamente — son falsos positivos o negativos constantes. Playwright ve el resultado visual real.

---

## Nivel 1: verificación local rápida

Antes de commitear, checklist mínimo:

```bash
pnpm lint            # ESLint: sin no-unused-vars, sin reglas SC/Emotion
pnpm test            # RTL tests: los existentes deben seguir verdes

# Grep de seguridad: que no queden imports
grep -n "from 'styled-components'\|from '@emotion" src/components/TuComponente/index.jsx
# debe dar 0 resultados
```

Visual check local: `pnpm dev` → abrí el componente migrado → comparar con el diseño o screenshot pre-migración.

---

## Nivel 2: Playwright visual regression

Para componentes críticos (hero, cards de promos, banners), capturá screenshots antes y después de la migración:

```typescript
// tests/visual/card-image-promo.spec.ts
import { test, expect } from '@playwright/test';

test('CardImagePromo visual regression', async ({ page }) => {
  await page.goto('/promos');
  
  // Screenshot del componente específico
  const card = page.locator('[data-testid="card-image-promo"]').first();
  await expect(card).toBeVisible();
  await expect(card).toHaveScreenshot('card-image-promo.png', {
    threshold: 0.02,  // 2% de diferencia aceptable
  });
});

test('CardImagePromo mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/promos');
  
  const card = page.locator('[data-testid="card-image-promo"]').first();
  await expect(card).toHaveScreenshot('card-image-promo-mobile.png', {
    threshold: 0.02,
  });
});
```

Correr y actualizar baseline si la migración es intencional:

```bash
npx playwright test tests/visual/
# Primera vez: genera los screenshots baseline
npx playwright test tests/visual/ --update-snapshots
# Tras migración: compara contra baseline
```

> Los screenshots de Playwright SÍ se usan como baseline visual. Los que están prohibidos son los **Jest snapshots de componentes React**.

---

## Nivel 3: gates con `/guardia`

Para PRs, `/guardia` corre en paralelo:

```
/guardia
```

Gates que aplican post-migración de styling:

| Gate | Qué verifica |
|------|-------------|
| **Bundle** | Que el bundle no creció (SC/Emotion removidos reducen JS) |
| **SonarCloud** | 0 new smells, 0 hotspots, ≤3% duplicación |
| **Visual** | Screenshots desktop 1280x800 + mobile 375x812 |
| **a11y** | Que el refactor no rompió atributos aria o roles |
| **ESLint** | Sin imports unused, sin reglas violadas |

---

## Qué mirar en bundle size

Post-migración de Styled Components o Emotion, el bundle JS debe bajar. Verificación:

```bash
# Antes de migrar (guardar el número)
pnpm build 2>&1 | grep "First Load JS"

# Después de migrar
pnpm build 2>&1 | grep "First Load JS"
```

Styled Components pesa ~12 KB gzip, Emotion ~7 KB. Si el bundle **creció** tras eliminar imports, hay algo mal (otro archivo los reintrodujo, o quedó un `import styled` olvidado).

```bash
# Verificar que no queden imports en todo el repo
grep -rl "from 'styled-components'" src/
grep -rl "@emotion/react\|@emotion/css" src/
```

---

## Qué NO verificar

- **Snapshots Jest** — prohibidos. Si el repo tiene `toMatchSnapshot`, no actualizarlos tras styling migration: refactorizarlos a RTL semántico.
- **Visual perfection pixel-perfect** — un 2% de threshold en Playwright es suficiente. Las fuentes tienen anti-aliasing diferente por OS.
- **CSS output manual** — no leas el CSS compilado línea a línea. Playwright y el build son el oráculo.

---

## Señales de que algo está roto

- Bundle JS **creció** → hay un import SC/Emotion que no se removió.
- Playwright screenshot diff >5% → cambio visual real, revisar.
- `pnpm lint` falla con `no-unused-vars` → import de `styled` o `css` olvidado.
- `pnpm build` falla con `Cannot apply unknown utility class` → gotcha de `@apply` custom class (lección 04).
- Componente se ve sin estilos → falta `globals.css` siendo importado, o el className no llegó al DOM.

---

## Checklist de salida

- [ ] `pnpm lint` pasa sin warnings nuevos
- [ ] `pnpm test` verde (RTL tests existentes)
- [ ] Grep de SC y Emotion da 0 en los archivos migrados
- [ ] Visual check local: componente idéntico al pre-migración
- [ ] (para PRs) Playwright screenshots del componente principal
- [ ] (para PRs) `/guardia` gates verdes

> Siguiente: [Lab integrador](exercises/README.md)
