# 04 · URL-as-state

> Lección 04 · Filtros indexables

Cualquier filtro, categoría, búsqueda o página de resultados en un front MODO **tiene que vivir en la URL**. No en `useState` solo. Esta es la regla más importante del curso y la más frecuentemente violada.

---

## Por qué importa

Cuando el usuario aplica un filtro en `/promos` y la URL no cambia, pasan cinco cosas malas:

1. **Googlebot solo indexa el default** — el estado filtrado es invisible. "Promos de supermercados con MODO" no aparece en Google.
2. **AI crawlers ven solo el default** — Perplexity no puede citar "las promos de Galicia en supermercados".
3. **No se puede compartir** — copiar la URL y mandarla por WhatsApp lleva al default, no al filtro.
4. **Back/forward roto** — el browser no puede navegar al estado anterior.
5. **Analytics colapsado** — Amplitude/GTM recibe un solo `page_view` en lugar de uno por combinación.

**La regla**: todo cambio de estado público (filtro, chip, tab, select, search, sort, paginación, distancia, ciudad) vive en la URL. El estado privado (modal open, hover, tooltip, accordion) sigue en `useState`.

---

## Decision tree: segmento vs query

```
¿Es un eje taxonómico (1 valor, top-level, tiene identidad propia)?
  ├── Sí → segmento: /promos/categoria/supermercados
  └── No → query: ?categoria=supermercados

¿Combinable con otros filtros?
  ├── Sí → query siempre (la combinatoria en segmentos explota)
  └── No → segmento OK

¿Tiene SEO value (volumen de búsqueda)?
  ├── Sí → indexable + sitemap + canonical self
  └── No → noindex + canonical al padre
```

**Tabla de patrones canónicos**:

| Filtro | Patrón | Nota |
|--------|--------|------|
| Categoría top-level (sola) | `/promos/categoria/supermercados` | Mejor PageRank, breadcrumb natural |
| Múltiples filtros | `?categoria=supermercados&banco=galicia&dia=lunes` | Query string, combinatoria plana |
| Search box | `?q=cafe` | Genera `SearchAction` en JSON-LD |
| Paginación | `?page=2` | + canonical apuntando al merged o noindex |
| Sort | `?sort=relevance` | `noindex` si no agrega valor SEO |
| Geo (ciudad) | `?ciudad=caba` | Slug-friendly, no lat/lng directo |

---

## Implementación en modo-landing (Next 12, Pages router)

### Hook `useUrlFilter` — drop-in

```ts
// src/hooks/useUrlFilter.ts
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

type FilterShape = Record<string, string | string[] | undefined>;

export function useUrlFilter<T extends FilterShape>(defaults: T) {
  const router = useRouter();

  const value = useMemo(() => {
    const out = { ...defaults } as T;
    Object.keys(defaults).forEach((k) => {
      const q = router.query[k];
      if (q !== undefined) (out as Record<string, unknown>)[k] = q;
    });
    return out;
  }, [router.query, defaults]);

  const setValue = useCallback(
    (patch: Partial<T>, opts?: { push?: boolean }) => {
      const merged: Record<string, string | string[] | undefined> = {
        ...router.query,
        ...patch,
      };
      // Strip defaults y vacíos → URL limpia en default state
      Object.keys(merged).forEach((k) => {
        const v = merged[k];
        const isDefault = v === (defaults as Record<string, unknown>)[k];
        const isEmpty = v === '' || v === undefined || (Array.isArray(v) && v.length === 0);
        if (isDefault || isEmpty) delete merged[k];
      });
      const method = opts?.push ? router.push : router.replace;
      method({ pathname: router.pathname, query: merged }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router, defaults]
  );

  return [value, setValue] as const;
}
```

**Uso en `/promos`**:

```tsx
const [filters, setFilters] = useUrlFilter({
  categoria: 'todas',
  banco: 'todos',
  dia: 'todos',
  q: '',
});

// Click chip → escribe URL
<Chip onClick={() => setFilters({ categoria: 'supermercados' })} />

// Search debounced → replace (no push, no spam al history stack)
const onSearch = useMemo(
  () => debounce((q: string) => setFilters({ q }), 300),
  [setFilters]
);
```

### `getServerSideProps` consume la URL para SSR

```ts
export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  const { categoria = 'todas', banco = 'todos', dia = 'todos', q = '' } = query;
  const promos = await fetchPromos({ categoria, banco, dia, q });

  // Cache solo en success path (ver SKILL.md anti-pattern)
  if (promos.length > 0) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  }

  return {
    props: {
      promos,
      filters: { categoria, banco, dia, q },
      canonical: buildCanonical('/promos', { categoria, banco, dia, q }),
      jsonLd: buildItemListLD(promos, { categoria, banco, dia, q }),
    },
  };
};
```

### `buildCanonical` — URL limpia en default state

```ts
// src/utils/seo/buildCanonical.ts
const SEO_VALUE_KEYS = new Set(['categoria', 'banco', 'ciudad']); // indexables
const DEFAULT_VALUES: Record<string, string> = {
  categoria: 'todas',
  banco: 'todos',
  ciudad: 'todas',
};

export function buildCanonical(pathname: string, query: Record<string, unknown>): string {
  const base = `https://www.modo.com.ar${pathname}`;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    const val = String(v ?? '');
    if (!SEO_VALUE_KEYS.has(k)) return;        // solo keys con valor SEO
    if (val === DEFAULT_VALUES[k] || !val) return; // strip defaults
    params.set(k, val);
  });
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
```

### JSON-LD scoped al filtro

```ts
// src/utils/seo/buildItemListLD.ts
export function buildItemListLD(promos: Promo[], filters: FilterState) {
  const canonicalUrl = buildCanonical('/promos', filters);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Promociones MODO${filters.categoria !== 'todas' ? ` · ${filters.categoria}` : ''}`,
    url: canonicalUrl,
    inLanguage: 'es-AR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: promos.length,
      itemListElement: promos.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: canonicalUrl,
        item: {
          '@type': 'Offer',
          name: p.title,
          description: p.description,
        },
      })),
    },
  };
}
```

---

## `Cache-Control` correcto en pages con filtros

Un SSR con filtros tiene que cachear por URL (cada combinación es una entry distinta) y evitar cachear errores transitorios:

```ts
// Top combos (categoría sola o banco solo):
// → s-maxage=300, stale-while-revalidate=3600
// Combinaciones 2+ filtros:
// → s-maxage=60
// Search box, sort:
// → no-store

const cacheForState = (filters: FilterState): string => {
  const activeFilters = Object.values(filters).filter(v => v && v !== 'todas' && v !== 'todos' && v !== '').length;
  if (filters.q) return 'no-store';
  if (activeFilters >= 2) return 'public, s-maxage=60, stale-while-revalidate=600';
  return 'public, s-maxage=300, stale-while-revalidate=3600';
};
```

> **Trampa**: `Vary: Cookie` o `Vary: User-Agent` en HTML público. Rompe la cache del CDN (cada user = entry distinta → thrash). Usar `Vary: Accept-Encoding` solo.

---

## Anti-patterns (ya los quemamos)

- **Filtro con `useState` solo**: el chip cambia el grid pero no la URL. Googlebot solo ve el default.
- **Default state con query string vacío**: `?categoria=&banco=` es una URL distinta al default limpio. Dos entries en el índice que se canibalizan.
- **`router.push` en cada keystroke del search**: spam al history stack (300 entries por frase). Usar debounce 300ms + `router.replace`.
- **Cardinality sin whitelist**: si categorizás todos los combos N×M×7 como indexables → ~50k thin content pages → penalty. Indexar solo los curados. Resto: `noindex`.
- **Cache-Control al tope del gSSP**: cachea 404s transitorios sobre URLs válidas. Poner el setHeader después del success path.

---

## Checklist de salida

- [ ] Aplicar 2 filtros distintos → URLs distintas (test: `diff <url_A> <url_B>` debe diferir).
- [ ] Default state = URL limpia (sin `?categoria=todas`).
- [ ] `getServerSideProps` consume la query para SSR del subset.
- [ ] `buildCanonical` stripea defaults y keys sin SEO value.
- [ ] JSON-LD `ItemList` scoped al subset visible.
- [ ] `Cache-Control` diferenciado por cardinality del filtro.
- [ ] `router.replace` (no `push`) para search/sort.

> Siguiente: [05 · Audit + fix](05-audit-fix.md)
