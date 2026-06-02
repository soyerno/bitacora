# 02 · Breaking changes — Next 12 → 16

> Objetivo: conocer cada cambio rotoso por step antes de aplicarlo. Cada sub-PR toca un step. No saltar versiones.

> **Regla del equipo**: no migrar 12→16 en un solo commit. El codemod oficial es per-step y mezclar breaking changes hace el debug exponencialmente más costoso.

---

## Step 1: Next 12 → 13

### Codemods a aplicar (non-interactive)

```bash
pnpm add next@13.x eslint-config-next@13.x
pnpm dlx @next/codemod@canary new-link --force ./
pnpm dlx @next/codemod@canary next-image-to-legacy-image --force ./
# Si usabas @next/font:
pnpm dlx @next/codemod@canary built-in-next-font --force ./
```

> **Trampa codemods interactivos**: `pnpm dlx @next/codemod@canary upgrade 13` pide selección manual. En automation y agentes usar codemods individuales con `--force`.

### Cambios manuales en `next.config.js`

```js
// ANTES (Next 12)
module.exports = {
  images: {
    domains: ['cdn.modo.com.ar', 'a.storyblok.com'],
    experimental: { allowFutureImage: true },
  },
}

// DESPUÉS (Next 13+)
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.modo.com.ar' },
      { protocol: 'https', hostname: 'a.storyblok.com' },
    ],
  },
}
```

- `images.domains` → `images.remotePatterns`
- Quitar `experimental.images` completo (incluye `allowFutureImage`)
- `swcMinify: true` es default — podés sacarlo del config

### `next/image` → `next/legacy/image` (temporal)

El codemod renombra todos los imports. Es **intencional y temporal** — el paso final (ver "Re-migrar a moderno" más abajo) los devuelve a `next/image`.

### Jest setup: bloqueante con `new-link`

Cuando aplicás `new-link`, `<Link>` usa `useRouter()` internamente. Sin mock global, **100% de las suites fallan** con "NextRouter was not mounted".

Agregar en `jest.setup.js`:

```js
jest.mock('next/router', () => {
  const noop = () => undefined;
  const router = {
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    prefetch: jest.fn().mockResolvedValue(undefined),
    reload: noop, back: noop, forward: noop,
    beforePopState: noop,
    isLocaleDomain: false,
    pathname: '/', route: '/', asPath: '/', basePath: '',
    query: {}, isReady: true, isPreview: false, isFallback: false,
  };
  const ReactLocal = jest.requireActual('react');
  return {
    __esModule: true,
    useRouter: () => router,
    default: router,
    withRouter: (C) => (props) =>
      ReactLocal.createElement(C, { ...props, router }),
  };
});
```

También mockear ambas versiones de image:

```js
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
jest.mock('next/legacy/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
```

---

## Step 2: Next 13 → 14

**Pages Router: sin breaking changes.** Bump pasivo:

```bash
pnpm add next@14.x eslint-config-next@14.x
```

Los codemods de Next 14 son todos App Router only. Si estás en Pages Router puro, este step es el más corto.

---

## Step 3: Next 14 → 15

### React 18 → pin explícito

Next 15 soporta React 19 pero también React 18. Aislar el bump de React en un sub-PR aparte. Mientras tanto, pinear React 18:

```json
"pnpm": {
  "overrides": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### `experimental.typedRoutes`

Si tenés `experimental.typedRoutes: true` en `next.config.js`, **quitalo**. Next 15 lo promovió a strict `RouteImpl<string>` que rompe `<Link href={string}>` con paths dinámicos como `/comercios/[slug]`.

```js
// Sacar esto:
experimental: {
  typedRoutes: true,
}
```

### `next-usequerystate` → `nuqs`

Si el repo usa `next-usequerystate`, en Next 15 debe migrarse a `nuqs`:

```bash
pnpm remove next-usequerystate
pnpm add nuqs
```

---

## Step 4: Next 15 → 16

### Node ≥20.9 obligatorio

```bash
node -v  # ≥20.9
# Si no: nvm install 22 && nvm use 22
echo "22" > .nvmrc
```

### `images.qualities` — rompe imágenes en prod (NO en build)

> **Trampa silenciosa**: Next 15/16 valida el query `quality` del optimizer contra una whitelist. Default whitelist = solo `[75]`. Cualquier `<Image quality={95}/>` o `<Image quality={100}/>` → el optimizer devuelve **400 "q parameter (quality) of 95 is not allowed"** → la imagen no se ve en producción. No falla en build ni en smoke local si no renderizás esa imagen en el check.

Caso real: modo-landing PR #1482 — 19 imágenes de Storyblok del home (CMSImage q=95) rotas en preprod.

```bash
# Inventariar todas las qualities usadas
grep -rhoE "quality=\{?[0-9]+\}?" src/ | grep -oE "[0-9]+" | sort -un
```

Whitelistear en `next.config.js`:

```js
module.exports = {
  images: {
    qualities: [75, 95, 100],  // 75 = default + las que usás
  },
}
```

### `--webpack` flag en build si tenés callback custom

Si `next.config.js` tiene un callback `webpack(config, options)`, Next 16 default es Turbopack y puede ignorar ese callback. Para el sub-PR de Next 15→16, agregar el flag temporalmente:

```json
"scripts": {
  "build": "next lint && next build --webpack"
}
```

El sub-PR de Turbopack (siguiente) lo quita.

### `dangerouslyAllowSVG` — no agregar por reflejo

Solo hace falta si la app pasa SVG **por el optimizer de Next** (`<Image src="algo.svg">`). Si los SVG se sirven como `<img>` raw o `unoptimized`, el flag no aplica. Agregarlo sin verificar relaja seguridad sin beneficio. Verificar primero:

```bash
grep -rn "\.svg" src/ | grep -i "<Image\|next/image"
```

---

## Step 5: Turbopack default

Una vez que el build con `--webpack` pasa:

```js
// next.config.js — declarar intención explícita
module.exports = {
  turbopack: {},  // config vacío, silencia warnings de coexistencia
  // mantener el callback webpack como fallback para builds con --webpack explícito
}
```

```json
"scripts": {
  "build": "next lint && next build"  // sin --webpack
}
```

### CSS spec strictness (Turbopack)

Turbopack parser rechaza selectores no estándar. Si tenés:

```css
.clase::after[attr="x"] { }    /* INVÁLIDO */
```

Reordenarlo:

```css
.clase[attr="x"]::after { }    /* VÁLIDO */
```

El attribute selector debe preceder al pseudo-element.

---

## Re-migrar `next/legacy/image` → `next/image` moderno

El codemod del Step 1 es temporal. El estado final correcto es `next/image` moderno. SonarCloud levanta **S1874** ("Symbol deprecated") en cada `<Image>` de `next/legacy/image` — en un repo con muchas imágenes rompe el quality gate.

```bash
# Swap masivo del import
for f in $(grep -rln "next/legacy/image" src); do
  sed -i '' "s#from 'next/legacy/image'#from 'next/image'#g" "$f"
done

# Detectar props legacy que necesitan conversión manual
grep -rnE "(layout|objectFit|objectPosition|lazyBoundary|lazyRoot|onLoadingComplete)=" src \
  | grep -v "style="
```

### Conversión de props legacy → moderno

| Legacy | Moderno | Nota |
|--------|---------|------|
| `layout="fill"` | `fill` (sin valor) | El contenedor padre DEBE ser `position: relative/absolute/fixed` + dimensionado |
| `layout="fixed"` / `"intrinsic"` | (nada) | Default con `width`/`height` numéricos |
| `objectFit="cover"` | `style={{ objectFit: 'cover' }}` | |
| `objectPosition="x"` | `style={{ objectPosition: 'x' }}` | |
| `onLoadingComplete` | `onLoad` | |
| `lazyBoundary` / `lazyRoot` | (eliminar) | No existen en moderno |

### Gotchas post-swap

- `alt` es **obligatorio** en moderno. Las `.tsx` fallan en `tsc`, las `.jsx` tiran error en runtime.
- `width`/`height` deben ser **numéricos**. `width="100%"` es inválido → usar número o `fill`.
- `fill` + `width`/`height` juntos = error. Elegir uno.

### Verify-grep antes de declarar done

```bash
grep -rln "next/legacy/image" src | wc -l                    # → 0
grep -rnE "(layout=|objectFit=|lazyBoundary=)" src | grep -v "style="   # → vacío
grep -rnE 'width="[^0-9]|height="[^0-9]' src | grep -i image # → vacío
```

---

## React 18 → 19 (sub-PR separado, post-Next 16)

```bash
# Remover los overrides de React 18 del package.json primero
pnpm add react@19.2 react-dom@19.2 @types/react@^19 @types/react-dom@^19
```

Cambios relevantes en tests:

- React 19 hoist `<title>/<meta>/<link>` al `document.head` real. Tests que inspeccionaban el mock de `next/head` deben ahora inspeccionar `document.head.innerHTML`.
- **NO usar** `afterEach(() => document.head.innerHTML = '')` — rompe la reconciliación de React 19. `RTL cleanup()` automático ya maneja el unmount.

---

## Checklist de salida

- [ ] Step 12→13: codemods aplicados, `jest.setup.js` actualizado, `images.remotePatterns`
- [ ] Step 13→14: bump pasivo, suites verdes
- [ ] Step 14→15: `typedRoutes` removido, React 18 pineado si no migraste React aún
- [ ] Step 15→16: `images.qualities` configuradas, Node ≥20.9
- [ ] `next/legacy/image` → `next/image` moderno, verify-grep 0 residuos
- [ ] Turbopack: `turbopack: {}` declarado, CSS selectors válidos

> Siguiente: [03 · Routing + data](03-routing-data.md)
