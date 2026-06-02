# 03 · Routing + data — SSR / ISR / catch-all / rewrites

> Objetivo: entender los patterns de fetching de datos en Pages Router y cómo operan en la infra MODO. Sin inventar — todo lo que aparece acá está verificado en modo-landing.

---

## `getServerSideProps` — SSR por request

Ejecuta en cada request en el servidor. Usar cuando:
- El contenido cambia frecuentemente y no podés cachear.
- Necesitás headers/cookies de la request (autenticación, A/B por cookie).
- El CMS devuelve contenido personalizado por usuario.

```tsx
// src/pages/promos.tsx
import type { GetServerSideProps, NextPage } from 'next';

type Props = { promos: Promo[] };

const PromosPage: NextPage<Props> = ({ promos }) => (
  <main>{/* render */}</main>
);

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const data = await fetch(`${process.env.API_BASE_PROMOS_URL}/promos`);
  const promos = await data.json();
  return { props: { promos } };
};

export default PromosPage;
```

> En modo-landing, las páginas de promos y comercios usan `getServerSideProps` porque el contenido cambia por sesión y los filtros vienen como query params.

---

## `getStaticProps` + ISR — generación estática con revalidación

Genera el HTML en build y lo regenera en background cada N segundos cuando llega una request.

```tsx
export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchCMSData();
  return {
    props: { data },
    revalidate: 60,  // segundos — regenera en background cada 60s
  };
};
```

Usar cuando:
- El contenido cambia poco (landing pages, páginas de marketing).
- Querés el LCP lo más bajo posible (HTML precalculado).
- El CMS (Storyblok) sirve contenido no personalizado.

### ISR + Storyblok

En modo-landing, el catch-all `[[...slug]].jsx` usa `getServerSideProps` (no ISR) porque Storyblok necesita el `preview` token diferente según el ambiente. Para páginas menos dinámicas, ISR es válido con el `revalidate` ajustado.

> **Trampa `fallback: true`**: en Next 12, `fallback: true` en `getStaticPaths` retornaba una página en blanco mientras generaba. En Next 13+, el comportamiento cambió levemente. Si tenés `fallback: true` y ves páginas en blanco al navegar a slugs nuevos, revisar si necesitás `fallback: 'blocking'`.

```tsx
export const getStaticPaths: GetStaticPaths = async () => {
  // En modo-landing: catálogo de slugs del CMS
  const slugs = await fetchAllSlugs();
  return {
    paths: slugs.map((s) => ({ params: { slug: s.split('/') } })),
    fallback: 'blocking',  // espera la generación en lugar de retornar vacío
  };
};
```

---

## Catch-all route — `[[...slug]]`

El patrón principal de modo-landing para páginas CMS-driven:

```
src/pages/[[...slug]].jsx
```

- `[[...slug]]` (doble corchete) es **opcional** — también matchea `/` (raíz).
- `[...slug]` (simple corchete) es **requerido** — no matchea `/`.

En modo-landing, la raíz `/` y todas las páginas de Storyblok pasan por este catch-all. Las páginas con rutas dedicadas (`/promos`, `/comercios`) se resuelven antes del catch-all por orden de prioridad de Next.

```tsx
// src/pages/[[...slug]].jsx (simplificado)
export const getServerSideProps = async ({ params, preview }) => {
  const slug = params?.slug?.join('/') ?? '';
  const story = await storyblokClient.get(`cdn/stories/${slug}`, {
    version: preview ? 'draft' : 'published',
  });
  if (!story) return { notFound: true };
  return { props: { story: story.data.story } };
};
```

---

## Rewrites — deep links iOS/Android

modo-landing usa rewrites en `next.config.js` para servir `apple-app-site-association` y links de iOS/Android:

```js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/apple-app-site-association',
        destination: '/api/apple-app-site-association',
      },
      {
        source: '/.well-known/apple-app-site-association',
        destination: '/api/apple-app-site-association',
      },
    ];
  },
};
```

> **Importante**: los rewrites requieren el servidor Node corriendo (`next start`). Con `output: 'export'` no funcionan. Es otra razón para no usar static export.

### Rewrites con `basePath`

Con `basePath: '/modo'`, los rewrites aplican **después** del basePath. Si necesitás un path que NO tenga el basePath (ej. `/.well-known/` en la raíz), usar `skipMiddlewareUrlNormalize` no es la solución — los rewrites sí aplican a la raíz aunque haya basePath configurado.

---

## Variables de entorno en SSR

En `getServerSideProps` y rutas API, podés usar variables sin `NEXT_PUBLIC_`:

```tsx
export const getServerSideProps = async () => {
  // Solo disponible en el servidor — no se expone al cliente
  const data = await fetch(process.env.API_BASE_URL + '/endpoint');
  // ...
};
```

Las `NEXT_PUBLIC_*` sí están disponibles en ambos lados (server + client), pero con el caveat de runtime env explicado en [01 · Estrategia](01-estrategia.md).

---

## `head` — Document Metadata

En Pages Router, el metadata de cada página va en el componente `<Head>` de `next/head`:

```tsx
import Head from 'next/head';

const Page = () => (
  <>
    <Head>
      <title>Título de la página</title>
      <meta name="description" content="..." />
    </Head>
    <main>{/* contenido */}</main>
  </>
);
```

Con React 19 (sub-PR separado), estos elementos se hoist al `document.head` real. Los tests que inspeccionan `document.head.innerHTML` pueden requerir ajustes — ver [02 · Breaking changes](02-breaking-changes.md).

---

## Checklist de salida

- [ ] Cada página usa el método de fetching correcto (`getServerSideProps` vs `getStaticProps + ISR`)
- [ ] El catch-all `[[...slug]]` resuelve correctamente (sin conflictos con rutas dedicadas)
- [ ] `fallback: 'blocking'` si se usa `getStaticPaths` con slugs dinámicos
- [ ] Rewrites definidos para deep links si aplica
- [ ] Variables de entorno sin `NEXT_PUBLIC_` no expuestas en el cliente

> Siguiente: [04 · Build + test + smoke](04-build-test-smoke.md)
