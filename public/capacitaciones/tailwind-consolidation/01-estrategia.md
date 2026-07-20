# 01 · Estrategia

> Objetivo: entender el orden de migración, cuándo se auto-invoca el skill y cómo no romperse en el camino.

## Harness

- `styled-components-to-tailwind` — se auto-invoca cuando editás un archivo que importa `styled-components` o `@emotion/*`.

---

## El principio fundamental: leaf-first

Migrá de **afuera hacia adentro**. Los componentes hoja (sin hijos que usen SC) son los más seguros porque:
- No tienen dependencias que fallen si el SSR cambia.
- El diff es pequeño y revisable.
- Si algo se rompe visualmente, el scope es acotado.

```
❌ Migrás el layout root primero → rompe todo el árbol
✅ Migrás el componente de tarjeta leaf → scope acotado
```

### Orden recomendado

1. **Atoms** (Badge, Tag, Icon wrapper, Pill) — sin lógica, sin hijos SC.
2. **Cards y banners** (PromoCard, BannerHero, CardImagePromo) — lógica mínima, visible en tests.
3. **Componentes con props dinámicos** (variantes de color, size) — requieren `classnames` o CVA.
4. **Layouts y containers** — afectan muchas rutas, mejor al final.
5. **`_document.js` ServerStyleSheet** — solo cuando el grep de SC da 0.

---

## Auto-invoke del skill

El skill `styled-components-to-tailwind` se auto-invoca cuando Claude detecta que estás editando un archivo con:

```
import styled from 'styled-components'
import { css } from '@emotion/react'
import { css, cx } from '@emotion/css'
```

**Qué hace el skill cuando se invoca**:
1. Identifica los styled-components o emotion blocks en el archivo.
2. Mapea las CSS properties a tokens de `tailwind.config.js`.
3. Sugiere el equivalente Tailwind antes de que escribas el código.
4. Verifica que no queden imports unused post-migración.

Podés invocarlo manualmente también:
```
/styled-components-to-tailwind
```

---

## El workflow por componente

```
1. Grep: ¿qué sistema usa el archivo?
2. Leé el styled-component o emotion block completo.
3. Mapeá cada property a un token (lección 03) o utility Tailwind.
4. Reemplazá el bloque CSS-in-JS por className="...".
5. Eliminá los imports unused (styled, css, theme).
6. Verificación visual local.
7. pnpm lint → pnpm build (no corras build en el curso, pero en PR sí).
```

---

## Branches y PRs

La migración de modo-landing se organizó en **waves** bajo una rama de integración:

```
integration/nextjs-12-to-16   ← rama base
  └── feat/EXA-ssr-cms-body   ← PR #1509 (Waves 0-N de styling)
        ├── Wave 0: Tailwind 3 → 4 (1 commit)
        ├── Wave 1: 3 archivos Emotion migrados
        ├── Wave 2: 39 SC migrados (Batches A1-A6 + B1-B3)
        └── Wave 3+: pendientes
```

**Por qué waves y no un PR gigante**: cada wave tiene scope acotado, pasa SonarCloud, y es revisable. Un PR de 200 archivos de styling no pasa code review.

---

## Qué NO hacer

```
❌ import { styled } from '@emotion/styled'   ← reemplazo por otro CSS-in-JS
❌ style={{ color: '#1a1a2e' }}               ← inline style con hex
❌ crear styles.js nuevos                     ← aumenta la deuda
❌ migrar _document.js antes que todos los SC ← rompe SSR
❌ dejar imports unused post-migración        ← ESLint no-unused-vars falla
```

---

## Señales de que la migración va bien

- [ ] El grep de SC en el archivo da 0 después de migrar.
- [ ] El `import styled` o `import { css }` desapareció del archivo.
- [ ] No hay imports nuevos de SC ni Emotion.
- [ ] `pnpm lint` pasa sin `no-unused-vars`.
- [ ] La visual check local muestra el componente idéntico.

---

## Checklist de salida

- [ ] Entendés el orden leaf-first y por qué
- [ ] Sabés cuándo se auto-invoca el skill y qué hace
- [ ] Tenés claro el workflow por componente (6 pasos)
- [ ] Conocés los anti-patterns de la lista ❌

> Siguiente: [02 · CSS-in-JS → utilities](02-css-in-js-a-utilities.md)
