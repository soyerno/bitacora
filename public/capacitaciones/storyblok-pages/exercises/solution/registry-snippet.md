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
