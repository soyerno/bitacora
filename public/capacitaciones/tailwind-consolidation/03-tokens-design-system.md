# 03 · Tokens + design system

> Objetivo: usar los tokens del design system MODO en lugar de valores hardcodeados. Entender la paleta SDK, la tipografía y los espaciados disponibles en `tailwind.config.js`.

## Harness

- `tailwind-design-system` — patrones de design system con Tailwind, CVA, tokens.

---

## La regla que no se negocia

> **Sin hex hardcodeados. Sin valores arbitrarios de px que ya tienen token. Tokens del design system siempre.**

Si llegás a escribir `text-[#1a1a2e]` o `bg-[#00c46a]`, es una señal de que hay un token que no encontraste. Antes de usar un valor hardcodeado, buscá en `tailwind.config.js`.

---

## Dónde están los tokens

El fuente de verdad es `tailwind.config.js` en la raíz de modo-landing (~480 líneas). Los tokens viven en dos capas:

1. **CSS variables del SDK** — definidas en `:root` por el paquete `@playsistemico/modo-ui-lib-web`. Se consumen como `var(--nombre)`.
2. **Extensiones Tailwind** — mapeadas en `tailwind.config.js` para poder usarlas como clases directas.

---

## Paleta de colores SDK MODO

Usá estas CSS variables, no los hex que las definen internamente:

```
var(--greys-white)           ← blanco base
var(--greys-black)           ← negro base
var(--greys-grey-1)          ← gris muy claro
var(--greys-grey-2)          ← gris claro
var(--greys-grey-3)          ← gris medio
var(--greys-grey-4)          ← gris oscuro
var(--greys-grey-5)          ← gris muy oscuro

var(--brand-green-default)   ← verde MODO principal
var(--brand-green-dark)      ← verde oscuro (hover)
var(--brand-green-light)     ← verde claro (fondo suave)

var(--brand-blue-default)    ← azul MODO
var(--brand-blue-dark)       ← azul hover
var(--brand-blue-light)      ← azul fondo suave

var(--error-default)         ← rojo error
var(--warning-default)       ← amarillo warning
var(--success-default)       ← verde success
```

En Tailwind, se usan con `[var(...)]` arbitrary o como clase si están mapeadas en config:

```jsx
// Con arbitrary syntax (funciona siempre):
className="bg-[var(--brand-green-default)]"
className="text-[var(--greys-black)]"

// Como clase directa (si tailwind.config.js la tiene mapeada):
className="bg-brand-green"
className="text-greys-black"
```

> Antes de usar arbitrary, verificá si está en `tailwind.config.js` como extend.colors. Un `grep 'brand-green' tailwind.config.js` te dice si tiene nombre de clase directo.

---

## Tipografía

modo-landing define 40+ estilos tipográficos en `tailwind.config.js`. Los más usados:

```
text-h1-bold       ← heading grande
text-h2-bold
text-h3-bold
text-h4-bold
text-body-regular  ← cuerpo de texto
text-body-medium
text-body-bold
text-caption       ← texto pequeño
text-overline-s    ← etiquetas

/* versiones mobile/web */
text-p1-mobile     text-p1-web
text-p2-mobile     text-p2-web
text-p3-mobile     text-p3-web
```

Fuentes disponibles: `font-red-hat` (Red Hat Display, default MODO), `font-quicksand` (Rewards).

---

## Espaciado

Los tokens de spacing están como CSS variables del SDK:

```
var(--spacing-xxs)   /* muy pequeño */
var(--spacing-xs)
var(--spacing-sm)
var(--spacing-md)
var(--spacing-lg)
var(--spacing-xl)
var(--spacing-xxl)
```

Cuando el valor coincide con la escala default de Tailwind (`p-2`, `p-4`, `gap-6`, etc.), usá la clase estándar. Los custom vars son para valores fuera de esa escala.

---

## Border radius

```
rounded-s    ← var(--border-radius-s)
rounded-m    ← var(--border-radius-m)
rounded-l    ← var(--border-radius-l)
rounded-xl   ← var(--border-radius-xl)
```

> Si el diseño pide `border-radius: 18px` y no hay token exacto, usá `rounded-[18px]`. Si aparece en más de 3 componentes, proponé agregar el token al config.

---

## Props dinámicos con variantes: usar CVA

Para componentes con 3+ variantes de apariencia, `class-variance-authority` (CVA) es más legible que ternarios anidados:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import classnames from 'classnames';

const badgeVariants = cva(
  // base styles
  'inline-flex items-center rounded px-2 py-0.5 text-caption font-medium',
  {
    variants: {
      intent: {
        success: 'bg-[var(--brand-green-light)] text-[var(--brand-green-dark)]',
        warning: 'bg-[var(--warning-default)] text-[var(--greys-black)]',
        error:   'bg-[var(--error-default)] text-[var(--greys-white)]',
        neutral: 'bg-[var(--greys-grey-1)] text-[var(--greys-grey-5)]',
      },
    },
    defaultVariants: {
      intent: 'neutral',
    },
  }
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ intent, children, className }: BadgeProps) {
  return (
    <span className={classnames(badgeVariants({ intent }), className)}>
      {children}
    </span>
  );
}
```

> CVA no está instalado por default en modo-landing. Si el componente tiene 2 variantes o menos, `classnames` es suficiente y no agrega dependencia.

---

## Anti-patterns

```jsx
// ❌ Hex hardcodeado
className="bg-[#00c46a]"

// ❌ Valor px que tiene token equivalente
className="rounded-[8px]"    // si tailwind.config.js tiene rounded-m = 8px

// ❌ Inline style con valor fijo
style={{ color: '#1a1a2e' }}

// ✅ CSS variable del SDK
className="bg-[var(--brand-green-default)]"

// ✅ Token de config como clase directa
className="rounded-m"

// ✅ Arbitrary solo cuando no hay token
className="rounded-[18px]"    // valor específico del diseño, sin token equivalente
```

---

## Checklist de salida

- [ ] Sabés dónde buscar tokens en `tailwind.config.js`
- [ ] Usás CSS variables del SDK para colores (`var(--brand-green-default)`)
- [ ] Usás tokens de tipografía (`text-h2-bold`, `text-body-regular`)
- [ ] Sabés cuándo usar CVA vs classnames
- [ ] Cero hex hardcodeados en el componente migrado

> Siguiente: [04 · Tailwind 3 → 4](04-tailwind-3-a-4.md)
