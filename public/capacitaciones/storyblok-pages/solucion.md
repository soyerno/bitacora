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


---

## Código completo

### types.ts

```ts
// SOLUCIÓN DE REFERENCIA — src/CMS/components/CMSSectionPromoBanner/types.ts
// (vive en modo-landing; acá es material del lab)

import { IDefaultFields } from '../../types';

export interface IPromoItem {
  text: string;
}

export interface ICMSSectionPromoBanner extends IDefaultFields {
  title: string;
  subtitle?: string;
  items?: IPromoItem[];
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'primary' | 'secondary';
}
```

### index.tsx

```tsx
// SOLUCIÓN DE REFERENCIA — src/CMS/components/CMSSectionPromoBanner/index.tsx
//
// Adaptador fino: data de Storyblok → UI con tokens del design system.
// NOTA: las clases de color (bg-sdk-*) son ilustrativas — usá los tokens REALES
// definidos en tailwind.config.js de modo-landing. Nunca hex hardcodeado.
// Si existe un componente de @playsistemico/modo-ui-lib-web que encaje, preferilo
// sobre este <section> propio.

import React, { useMemo } from 'react';
import { ICMSSectionPromoBanner } from './types';

interface Props {
  data: ICMSSectionPromoBanner;
}

const VARIANT_CLASS: Record<NonNullable<ICMSSectionPromoBanner['variant']>, string> = {
  primary: 'bg-sdk-primary text-sdk-on-primary',
  secondary: 'bg-sdk-secondary text-sdk-on-secondary',
};

export default function CMSSectionPromoBanner({ data }: Readonly<Props>) {
  const { title, subtitle, items, ctaText, ctaUrl, variant = 'primary' } = data;

  const itemList = useMemo(
    () => (items ?? []).map((item, i) => <li key={`${item.text}-${i}`}>{item.text}</li>),
    [items]
  );

  return (
    <section className={`cms-promo-banner ${VARIANT_CLASS[variant]}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {itemList.length > 0 && <ul>{itemList}</ul>}
      {ctaUrl && (
        <a href={ctaUrl} className="cms-promo-banner__cta">
          {ctaText ?? 'Ver más'}
        </a>
      )}
    </section>
  );
}
```

### CMSSectionPromoBanner.test.tsx

```tsx
// SOLUCIÓN DE REFERENCIA — src/CMS/components/CMSSectionPromoBanner/CMSSectionPromoBanner.test.tsx
//
// RTL semántico, sin snapshots. Cada scenario de la spec = un it().

import { render, screen } from '@testing-library/react';
import CMSSectionPromoBanner from './index';
import { ICMSSectionPromoBanner } from './types';

const base: ICMSSectionPromoBanner = {
  component: 'SectionPromoBanner',
  _uid: 'lab-1',
  _editable: '',
  title: 'Black Friday',
};

describe('CMSSectionPromoBanner', () => {
  it('renderiza título y subtítulo de Storyblok', () => {
    render(<CMSSectionPromoBanner data={{ ...base, subtitle: 'Hasta 40% off' }} />);
    expect(screen.getByRole('heading', { name: 'Black Friday' })).toBeInTheDocument();
    expect(screen.getByText('Hasta 40% off')).toBeInTheDocument();
  });

  it('renderiza la lista de beneficios', () => {
    render(
      <CMSSectionPromoBanner
        data={{ ...base, items: [{ text: 'Envío gratis' }, { text: 'Cuotas sin interés' }] }}
      />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Cuotas sin interés')).toBeInTheDocument();
  });

  it('muestra el CTA cuando hay ctaUrl', () => {
    render(<CMSSectionPromoBanner data={{ ...base, ctaText: 'Ver promos', ctaUrl: '/promos' }} />);
    expect(screen.getByRole('link', { name: 'Ver promos' })).toHaveAttribute('href', '/promos');
  });

  it('NO muestra el CTA cuando falta ctaUrl', () => {
    render(<CMSSectionPromoBanner data={base} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
```

# Registro del blok — los 3 puntos

Sin estos 3, el blok no rinde (`getCMSComponent` devuelve `undefined`).

## 1 · Tipo en la interface — `src/CMS/types.ts`

```ts
import { ICMSSectionPromoBanner } from './components/CMSSectionPromoBanner/types';

export interface IAvailableComponents {
  // ...existentes
  SectionPromoBanner: (data: ICMSSectionPromoBanner) => JSX.Element;
}
```

## 2 · Entrada en el registry — `src/CMS/utils/availableComponents.tsx`

```ts
import CMSSectionPromoBanner from '../components/CMSSectionPromoBanner';
import { ICMSSectionPromoBanner } from '../components/CMSSectionPromoBanner/types';

export const CMS_COMPONENTS: IAvailableComponents = {
  // ...existentes
  SectionPromoBanner: (data: ICMSSectionPromoBanner) => <CMSSectionPromoBanner data={data} />,
};
```

## 3 · El `component` en la story (Storyblok)

El blok del `body` debe tener `component: "SectionPromoBanner"` — **exacto, case-sensitive**. Ver `story.json`.

> No resuelve relaciones a otras stories → no hace falta tocar `storyblokResolveRelations`.


### story.json

```json
{
  "_comment": "Story de prueba para el lab. Crear vía modo-storyblok (MCP o curl). full_slug = lab/promo-banner → ruta /lab/promo-banner. Publicar (o ?preview=true en develop).",
  "story": {
    "name": "Lab Promo Banner",
    "slug": "promo-banner",
    "full_slug": "lab/promo-banner",
    "content": {
      "component": "page",
      "seo": [
        {
          "component": "Seo",
          "title": "Lab · Promo Banner",
          "description": "Página de prueba del lab de la capacitación Storyblok."
        }
      ],
      "body": [
        {
          "component": "SectionPromoBanner",
          "_uid": "promo-1",
          "title": "Black Friday MODO",
          "subtitle": "Aprovechá los descuentos pagando con MODO",
          "variant": "primary",
          "items": [
            { "text": "Hasta 40% de descuento" },
            { "text": "Cuotas sin interés" },
            { "text": "Reintegro en tu cuenta" }
          ],
          "ctaText": "Ver promos",
          "ctaUrl": "/promos"
        },
        {
          "component": "SectionPromoBanner",
          "_uid": "promo-2",
          "title": "Sin CTA",
          "subtitle": "Este banner no define ctaUrl, así que no muestra botón",
          "variant": "secondary"
        }
      ]
    }
  }
}
```
