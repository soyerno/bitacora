# Lab · Migrar una page a server-rendered y verificar el contrato

> Lab integrador del curso [Migrar a Next.js 16](../README.md).
>
> Duracion estimada: 45-60 min con Claude Code abierto.

---

## Objetivo

Tomás una page existente en el repo (Vite o Next viejo), la migrás a Pages Router server-rendered en Next 16, y verificás el contrato de rutas.

---

## Contexto del lab

Para practicar sin tocar producción, vas a trabajar en un **worktree dedicado**:

```bash
# Desde la raíz del repo
git fetch origin main
git worktree add /private/tmp/wt-lab-next16 \
  -b feat/lab-next16-page-migration \
  origin/main
cd /private/tmp/wt-lab-next16
```

---

## Paso 1 — Elegir la page a migrar

Elegí una page que:
- No sea el catch-all `[[...slug]]` (ese es complejo, para el lab no).
- No tenga muchas dependencias externas.
- Tenga al menos un fetch de datos.

Buenas candidatas: `/pagar`, `/recargas`, una página de feature simple.

```bash
# Ver las páginas disponibles
ls src/pages/
```

Anotá el path elegido: `src/pages/________________.tsx`

---

## Paso 2 — Auditar la page actual

Antes de tocar algo, entender qué hace hoy:

- [ ] ¿Usa `getServerSideProps`, `getStaticProps`, o ninguno (client-only)?
- [ ] ¿Tiene `next/image`? ¿Con qué props?
- [ ] ¿Importa algo de `next/legacy/image`?
- [ ] ¿Tiene algún fetch client-side (`useEffect` + fetch)?
- [ ] ¿Tiene `console.log/error/warn`?

```bash
grep -n "getServerSideProps\|getStaticProps\|useEffect\|console\." src/pages/TU-PAGE.tsx
grep -n "next/image\|next/legacy" src/pages/TU-PAGE.tsx
```

---

## Paso 3 — Resolver el fetching de datos

Según lo que encontraste en el paso 2:

### Si es client-only (`useEffect` + fetch):

Mover el fetch a `getServerSideProps`:

```tsx
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const res = await fetch(`${process.env.API_BASE_URL}/endpoint`);
  if (!res.ok) return { notFound: true };
  const data = await res.json();
  return { props: { data } };
};
```

Borrar el `useEffect` de fetching inicial. El componente recibe los datos como props.

### Si ya tiene `getServerSideProps` o `getStaticProps`:

Verificar que el tipo esté correcto:

```tsx
import type { GetServerSideProps, NextPage } from 'next';
```

---

## Paso 4 — Migrar `next/image` si aplica

Si la page usa `next/legacy/image`:

```bash
# Swap del import
sed -i '' "s#from 'next/legacy/image'#from 'next/image'#g" src/pages/TU-PAGE.tsx

# Revisar props legacy
grep -n "layout=\|objectFit=\|lazyBoundary=" src/pages/TU-PAGE.tsx
```

Convertir props según la tabla de [02 · Breaking changes](../02-breaking-changes.md).

Verificar que `alt` esté presente en todos los `<Image>`.

---

## Paso 5 — Build y tests

```bash
# Build
pnpm lint && pnpm build
# o si hay problema de TTY:
CI=true pnpm build

# Tests relacionados a la page
npx jest src/pages/TU-PAGE
# o
npx jest src/components/ComponenteDeLaPage
```

- [ ] `pnpm lint` — 0 errores
- [ ] `pnpm build` — exit 0
- [ ] Tests de la page — verdes

Si hay snapshots en los tests de esta page:

```bash
find src -name "*.snap" | xargs grep -l "TU-PAGE\|ComponenteDeLaPage"
```

Reemplazarlos con assertions RTL semánticas.

---

## Paso 6 — Smoke del contrato

```bash
# Arrancar el servidor
./node_modules/.bin/next start -p 3000 &
SERVER_PID=$!

# Esperar a que levante
sleep 3

# Smoke de la page migrada (ajustar path según tu page)
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/TU-RUTA
# Espera: HTTP 200

# Smoke de la raíz (sin basePath configurado: 200 / con basePath: 404)
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/
# Ajustar expectativa según tu config

# Verificar que la page tiene contenido real (no loading spinner vacío)
curl -s http://localhost:3000/TU-RUTA | grep -c "<main\|<h1\|<section"

# Cleanup
kill $SERVER_PID
```

---

## Checklist final del lab

- [ ] Page migrada a server-rendered (`getServerSideProps` o `getStaticProps`)
- [ ] Sin client-only fetching en `useEffect` para datos iniciales
- [ ] `next/legacy/image` → `next/image` moderno (si aplica)
- [ ] `alt` presente en todos los `<Image>`
- [ ] Sin `console.log/error/warn`
- [ ] `pnpm lint` — 0 errores
- [ ] `pnpm build` — exit 0
- [ ] Tests de la page — verdes, sin snapshots
- [ ] Smoke `GET /TU-RUTA` = 200
- [ ] Smoke raíz = comportamiento esperado según basePath

---

## Limpiar el worktree cuando terminás

```bash
# Desde la raíz del repo (no desde el worktree)
git worktree remove /private/tmp/wt-lab-next16
git branch -d feat/lab-next16-page-migration
```

> Volver al [inicio del curso](../README.md) · Ver [04 · Build + test + smoke](../04-build-test-smoke.md) para referencia de comandos.
