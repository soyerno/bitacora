# 02 · CSS-in-JS → utilities

> Objetivo: mapear los patrones más comunes de Styled Components y Emotion a clases Tailwind. Con casos reales de modo-landing PR #1509.

## Harness

- `styled-components-to-tailwind` — sugiere el mapeo cuando editás imports de SC o Emotion.

---

## Patrón 1: `styled.div` básico → JSX + className

**Antes (Styled Components)**:
```jsx
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  background-color: var(--greys-white);
`;

// uso
<Card>...</Card>
```

**Después (Tailwind)**:
```jsx
// sin import de styled-components

<div className="flex flex-col rounded-lg p-4 bg-[var(--greys-white)]">
  ...
</div>
```

> Si `Card` se usa en muchos lugares, extraé un componente React con `className` prop en lugar de un styled-component.

---

## Patrón 2: props dinámicos → clases condicionales

**Antes (Styled Components con props)**:
```jsx
const Badge = styled.span`
  background-color: ${({ variant }) =>
    variant === 'success' ? 'var(--brand-green-default)' : 'var(--greys-grey-2)'};
  color: ${({ variant }) =>
    variant === 'success' ? 'var(--greys-white)' : 'var(--greys-black)'};
  border-radius: 4px;
  padding: 2px 8px;
`;

<Badge variant="success">Activo</Badge>
```

**Después (Tailwind + classnames)**:
```jsx
import classnames from 'classnames';

// el paquete 'classnames' ya está instalado en modo-landing

function Badge({ variant, children }) {
  return (
    <span
      className={classnames(
        'rounded px-2 py-0.5',
        {
          'bg-[var(--brand-green-default)] text-[var(--greys-white)]': variant === 'success',
          'bg-[var(--greys-grey-2)] text-[var(--greys-black)]': variant !== 'success',
        }
      )}
    >
      {children}
    </span>
  );
}
```

> Para variantes más complejas (3+), CVA es más legible — ver [lección 03](03-tokens-design-system.md).

---

## Patrón 3: Emotion `css` template literal con media queries

Caso real de `CardImagePromo/index.jsx` (PR #1509 Wave 1):

**Antes (Emotion)**:
```jsx
import { css } from '@emotion/react';
import { theme } from '../../constants/theme';

<LazyLoadImage
  css={css`
    height: 100%;
    object-fit: cover;
    max-width: 100%;
    max-height: 130%;
    border-radius: 18px;
    @media screen and (min-width: ${theme.breakpoints.mobileMDmax}) {
      max-height: 100%;
      border-radius: 8px;
    }
  `}
  src={src}
/>
```

**Después (Tailwind)**:
```jsx
// sin import de @emotion/react
// sin import de theme (si solo se usaba para breakpoints en css``)

<LazyLoadImage
  className="h-full object-cover max-w-full max-h-[130%] rounded-[18px] md:max-h-full md:rounded-lg"
  src={src}
/>
```

**Steps replicables**:
1. Eliminar `import { css } from '@emotion/react'`.
2. Eliminar `import { theme }` si solo se usaba en `css```.
3. Reemplazar `css={css`...`}` con `className="..."`.
4. Mapear `@media screen and (min-width: <breakpoint>)` → prefijo responsive (`sm:`, `md:`, `lg:`).
5. Valores sin token → `[value]` arbitrary syntax.

> Trap: `LazyLoadImage` acepta `className` directo, no necesita `wrapperClassName` para utility-only styling.

---

## Patrón 4: `styled.div` con estado hover/focus

**Antes**:
```jsx
const Button = styled.button`
  background-color: var(--brand-green-default);
  color: var(--greys-white);
  &:hover {
    background-color: var(--brand-green-dark);
  }
  &:focus {
    outline: 2px solid var(--brand-green-default);
    outline-offset: 2px;
  }
`;
```

**Después**:
```jsx
<button
  className="bg-[var(--brand-green-default)] text-[var(--greys-white)] hover:bg-[var(--brand-green-dark)] focus-visible:outline-2 focus-visible:outline-[var(--brand-green-default)] focus-visible:outline-offset-2"
>
  ...
</button>
```

---

## Patrón 5: `css` con múltiples media queries anidadas

**Antes**:
```jsx
const Hero = styled.section`
  padding: 24px 16px;
  @media (min-width: 768px) {
    padding: 48px 32px;
  }
  @media (min-width: 1280px) {
    padding: 64px 48px;
  }
`;
```

**Después**:
```jsx
<section className="px-4 py-6 md:px-8 md:py-12 xl:px-12 xl:py-16">
  ...
</section>
```

> Breakpoints de Tailwind en modo-landing: `sm` (640), `md` (768), `lg` (1024), `xl` (1280), `xxl` (1536). Ver `tailwind.config.js` para los custom: `small`, `regular`, `medium`, `large`.

---

## Patrón 6: Emotion `cx` para composición de clases

**Antes**:
```jsx
import { css, cx } from '@emotion/css';

const base = css`font-size: 14px; color: var(--greys-black);`;
const active = css`color: var(--brand-green-default); font-weight: bold;`;

<span className={cx(base, isActive && active)}>...</span>
```

**Después**:
```jsx
import classnames from 'classnames';

<span
  className={classnames(
    'text-sm text-[var(--greys-black)]',
    isActive && 'text-[var(--brand-green-default)] font-bold'
  )}
>
  ...
</span>
```

---

## Qué hacer con valores sin token exacto

Cuando no hay token Tailwind exacto, usá `[value]` arbitrary syntax con la CSS variable del SDK:

```jsx
// ✅ Con CSS variable del SDK
className="text-[var(--font-size-body-medium)]"
className="rounded-[var(--border-radius-m)]"

// ✅ Con valor semántico si no existe token
className="rounded-[18px]"    // valor específico del diseño

// ❌ Hex hardcodeado
className="text-[#1a1a2e]"    // prohibido — usar var() siempre
```

---

## Checklist de salida

- [ ] Sabés convertir un `styled.div` básico a JSX + className
- [ ] Manejás props dinámicos con `classnames`
- [ ] Convertís Emotion media queries a responsive prefixes Tailwind
- [ ] Sabés usar `[value]` arbitrary con CSS variables, no con hex
- [ ] Post-migración: verificás que no queden imports unused

> Siguiente: [03 · Tokens + design system](03-tokens-design-system.md)
