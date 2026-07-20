# 00 · Los 3 sistemas

> Objetivo: entender qué convive en modo-landing, por qué es un problema y cómo detectar cada sistema antes de migrar.

## Harness

- `styled-components-to-tailwind` — auto-invoke al editar archivos con imports de SC o Emotion.

---

## El estado de base (modo-landing, 2026-05-28 pre-PR #1509)

modo-landing tenía **tres runtimes de styling activos al mismo tiempo**:

| Sistema | Versión | Import típico | Cantidad |
|---------|---------|---------------|----------|
| Tailwind CSS | 3.3.3 → 4.3.0 | `className="..."` | ~60% del codebase |
| Styled Components | 5.2.3 | `import styled from 'styled-components'` | ~25% |
| Emotion | 11.11.x | `import { css } from '@emotion/react'` | ~15% |

Además: algunos archivos con **CSS modules** (`*.module.css`) e inline `style={{}}` para overrides puntuales.

---

## Por qué consolidar

### 1. Bundle doble (o triple)

Cada sistema CSS-in-JS ship su runtime al cliente. Styled Components pesa ~12 KB gzip, Emotion ~7 KB. Con Tailwind utility-only, el CSS se shakea en build y el runtime JS baja a cero.

### 2. SSR frágil

`src/pages/_document.js` tiene un `ServerStyleSheet` de Styled Components para SSR. Eso es:
- Código de setup manual en `_document.js`.
- Un gotcha silencioso si un componente nuevo usa SC sin entender el patrón.
- Un **blocker duro** para migrar a App Router de Next 15 (incompatible con `ServerStyleSheet`).

### 3. DX fragmentada

Dev nuevo ve tres formas de hacer lo mismo. Code review tiene que razonar tres contextos. El design system MODO (`tailwind.config.js`, 480 líneas de tokens) existe completo — pero SC y Emotion lo ignoran y hardcodean valores.

### 4. Regla del equipo

> Sin hex hardcodeados. Sin nuevas imports de SC o Emotion. Tokens del design system siempre.

Esa regla es imposible de hacer cumplir con tres sistemas activos.

---

## Cómo detectar cada sistema

### Grep rápido

```bash
# Styled Components
grep -rl "from 'styled-components'" src/

# Emotion
grep -rl "@emotion/react\|@emotion/css\|@emotion/styled" src/

# CSS modules
find src/ -name "*.module.css"

# Tailwind (referencia, no hay que migrar esto)
grep -rl "className=" src/ | wc -l
```

### Por archivo: qué buscar

**Styled Components**:
```jsx
import styled from 'styled-components';
// o
import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  background-color: #1a1a2e;  /* ← hex hardcodeado */
`;
```

**Emotion con `css` template literal**:
```jsx
import { css } from '@emotion/react';

<div css={css`
  height: 100%;
  border-radius: 18px;
  @media screen and (min-width: 768px) {
    border-radius: 8px;
  }
`} />
```

**Emotion con `cx`/`css` function**:
```jsx
import { css, cx } from '@emotion/css';

const activeClass = css`color: green;`;
<span className={cx(baseClass, isActive && activeClass)} />
```

**Tailwind puro** (destino):
```jsx
<div className="flex bg-[var(--brand-green-default)] rounded-lg md:rounded-md" />
```

### Detectar SC en `_document.js`

```bash
grep -n "ServerStyleSheet\|StyleSheetManager" src/pages/_document.js
```

Si matchea, esa es la pieza que bloquea App Router. Se elimina recién cuando **todos** los SC del repo estén migrados.

---

## Priorizar qué migrar primero

No todo el repo se migra de una. El criterio:

1. **Leaf components sin lógica compleja** — los más fáciles (adaptadores de UI, tarjetas, badges).
2. **Componentes usados en rutas críticas** (home, /promos) — impactan bundle y SSR.
3. **Componentes que van a tocar otros PRs** — mejor migrar antes de que generen conflictos.
4. **`src/pages/_document.js` al final** — solo cuando el grep de SC devuelve 0 resultados.

> Trap común: migrar `_document.js` primero y dejar componentes SC huérfanos que crashean el SSR.

---

## Checklist de salida

- [ ] Sabés correr el grep para auditar qué sistema usa cada componente
- [ ] Identificaste al menos 3 componentes SC y 1 Emotion en el repo
- [ ] Entendés por qué `_document.js` se migra al final
- [ ] Tenés claro que el destino es Tailwind-only con tokens del design system

> Siguiente: [01 · Estrategia](01-estrategia.md)
