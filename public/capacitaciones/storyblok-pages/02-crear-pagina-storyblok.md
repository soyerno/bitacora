# 02 · Crear la página: story + blok

> Objetivo: la página existe en Storyblok (story) y, si lleva un blok nuevo, ese blok rinde en React. Esta es la lección central.

## Harness

- `modo-storyblok` — autoría de stories, schema de bloks, folder/startpage pattern, PUT vía MCP o curl JSON-RPC.

## Parte A · La story en Storyblok

Una **story** es la página. Su `full_slug` es la URL (`/promos/black-friday` → story con slug `promos/black-friday`). El campo clave es `content.body`: un array de bloks.

```
story
 └─ content
     ├─ seo[]            → CMSSEO (title, description, og)
     ├─ seo_structured_data[]  → JSON-LD extra (bancos, service)
     └─ body[]           → los bloks que se renderizan en orden
         ├─ { component: "HeroPrimary", title, subtitle, ... }
         ├─ { component: "SectionGrid", ... }
         └─ ...
```

Cada item de `body` tiene `component` (el nombre que matchea el registry), `_uid` y sus campos. **El `component` string es el contrato** entre Storyblok y React.

Cómo se trae (no lo escribís vos, pero entendelo) — [`src/pages/[[...slug]].jsx`](../../../):

```js
const Storyblok = getStoryblok();
const { data } = await Storyblok.get(`cdn/stories/${slug}`, {
  version: 'published',                 // 'draft' solo en low-env con ?preview=true
  resolve_relations: storyblokResolveRelations,
});
// data.story.content.body[] → se mapea a componentes
```

> `version: 'published'` = la story tiene que estar **publicada** para verse en prod. En develop/qa con `?preview=true` se ve el draft.

### Autorar con el harness

La story se autora **vía Claude + el MCP de Storyblok** (skill `modo-storyblok`), no editando a mano en el panel: le pedís en lenguaje normal y Claude crea/actualiza la story por la API (curl JSON-RPC queda como fallback). Mínimo para una página:

1. Crear la story con `full_slug` = tu ruta.
2. Setear `content.body` con los bloks (cada uno con su `component` válido).
3. Setear `content.seo[0]` (title/description) — la lección 04 lo audita.
4. **Publicar**.

> Folder + `is_startpage` child pattern: para una sección con subpáginas, creás un folder y la home del folder es la story `is_startpage`. Ver `modo-storyblok` para el detalle.

## Parte B · El blok en React (solo si es nuevo)

Si tu `body` usa un `component` que **no está** en el registry, `getCMSComponent` devuelve `undefined` y el blok no rinde. Hay que crearlo. Tres archivos + un registro.

### Cómo se resuelve un blok

[`src/CMS/utils/utils.tsx`](../../../):

```ts
export const getCMSComponent = (element: IDefaultFields): JSX.Element | undefined => {
  const component = CMS_COMPONENTS[element.component];   // lookup por nombre
  if (component) return component(element);              // undefined si no existe
};
```

### Anatomía de un blok (patrón canónico)

Mirá `CMSHeroPrimary` como molde. Un blok es un **adaptador fino**: `data` de Storyblok → componente de `modo-ui-lib-web`.

`src/CMS/components/CMSMiBlok/types.ts`:
```ts
import { IMiComponenteProps } from '@playsistemico/modo-ui-lib-web';
import { IDefaultFields } from '../../types';

export interface ICMSMiBlok extends IDefaultFields, Omit<IMiComponenteProps, 'className'> {
  // campos que vienen de Storyblok
  title: string;
  ctaUrl?: string;
}
```

`src/CMS/components/CMSMiBlok/index.tsx`:
```tsx
import React from 'react';
import { MiComponente } from '@playsistemico/modo-ui-lib-web';
import { ICMSMiBlok } from './types';

interface Props {
  data: ICMSMiBlok;
}

export default function CMSMiBlok({ data }: Readonly<Props>) {
  return (
    <div className="cms-mi-blok">
      <MiComponente title={data.title} ctaUrl={data.ctaUrl} />
    </div>
  );
}
```

### Registrar el blok (3 puntos, sino no rinde)

1. **Tipo en la interface** — `src/CMS/types.ts`, agregá a `IAvailableComponents`:
   ```ts
   MiBlok: (data: ICMSMiBlok) => JSX.Element;
   ```
2. **Entrada en el registry** — `src/CMS/utils/availableComponents.tsx`:
   ```ts
   import CMSMiBlok from '../components/CMSMiBlok';
   import { ICMSMiBlok } from '../components/CMSMiBlok/types';

   export const CMS_COMPONENTS: IAvailableComponents = {
     // ...existentes
     MiBlok: (data: ICMSMiBlok) => <CMSMiBlok data={data} />,
   };
   ```
3. **El `component` en Storyblok** debe ser exactamente `MiBlok` (case-sensitive). Mismatch silencioso = blok que no aparece.

> ¿El blok necesita resolver una relación a otra story (referencia)? Agregá `MiBlok.reference` a `storyblokResolveRelations` en `src/CMS/constants/storyblok.ts`.

## Trampa conocida · HMR / dev server zombie

Si editás el blok y el browser sigue mostrando lo viejo sin actualizar, antes de culpar al código:

```bash
ps aux | grep -E "next dev|node server" | grep -v grep
```

Más de un proceso o un path bajo `.claude/worktrees/agent-*` (borrado) = dev server zombie sirviendo bundle viejo. Matá por PID y relanzá `pnpm dev` desde la raíz.

## Checklist de salida

- [ ] Story creada con `full_slug`, `body[]`, `seo[0]` y **publicada**
- [ ] Si blok nuevo: `index.tsx` + `types.ts` (adaptador fino sobre `modo-ui-lib-web`)
- [ ] Registrado en los 3 puntos (interface + registry + `component` string exacto)
- [ ] La ruta rinde el blok en `pnpm dev` (`?preview=true` para draft)

> Siguiente: [03 · TDD red→green](03-tdd-red-green.md)
