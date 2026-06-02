# 01 · Estrategia — Pages Router server-rendered

> Objetivo: entender la estructura de integration branch + stacked sub-PRs, por qué server-rendered en EKS, cómo manejar `basePath` y `NEXT_PUBLIC_*` en runtime.

---

## Integration branch + sub-PRs apilados

**Regla fundamental**: nunca migrar directo a `main`. Toda la migración vive en un integration branch:

```
main
 └─► feat/COENXT-XXX-nextjs-12-to-16-migration   ← integration branch
       ├─► feat/COENXT-XXX-step-01-codemod-new-link
       │    └─► feat/COENXT-XXX-step-02-image-legacy
       │         └─► feat/COENXT-XXX-step-03-next14-bump
       │              └─► feat/COENXT-XXX-step-04-next15-bump
       │                   └─► feat/COENXT-XXX-step-05-react19
       │                        └─► feat/COENXT-XXX-step-06-next16-turbopack
```

Cada sub-PR usa el anterior como base. Cuando el sub-PR N mergea a integration, GitHub re-targetea N+1 automático.

### Merge strategy

| Dirección | Estrategia |
|-----------|-----------|
| Sub-PR → integration | Squash (1 commit por step) |
| Integration → main | Merge-commit (preserva historia para `git bisect`) |

### Crear el integration branch

```bash
git fetch origin main
git worktree add /private/tmp/wt-next-integration \
  -b feat/COENXT-XXX-nextjs-12-to-16-migration \
  origin/main

# Desde ese worktree, crear el primer sub-PR:
git worktree add /private/tmp/wt-next-step-01 \
  -b feat/COENXT-XXX-step-01-codemod-new-link \
  origin/feat/COENXT-XXX-nextjs-12-to-16-migration
```

> **Trampa**: nunca en el checkout principal. Siempre en worktrees. Si editás `main` directo y hay un deploy automático, podés romper develop/QA.

---

## Por qué server-rendered en EKS

La infra MODO corre los frontends en Kubernetes (EKS + Istio) con `next start`. Las razones:

1. **ISR real**: necesitás `getServerSideProps` / `getStaticProps` con `revalidate` para que el CMS (Storyblok) actualice sin rebuild.
2. **Runtime env**: las variables de entorno se inyectan en SSM al momento de boot, no en build. Con `output: 'export'` no hay runtime — todo se bakea en el bundle.
3. **Probes k8s**: liveness y readiness apuntan a la ruta real del pod. Si el pod no responde 200, nunca queda Ready.
4. **Deep links iOS/Android**: los rewrites de `next.config.js` para `apple-app-site-association` requieren el servidor Node corriendo.

### Contrato mínimo con la infra

```
next start -p 3000
GET /<basePath>      → 200
GET /                → 404  (cuando hay basePath configurado)
```

Si el probe de k8s pega a `/` en un repo con `basePath: '/modo'`, el pod nunca queda Ready. Más en [04 · Build + test + smoke](04-build-test-smoke.md).

---

## basePath

Cuando el frontend no vive en la raíz del dominio sino bajo un prefijo:

```js
// next.config.js
module.exports = {
  basePath: '/modo',
}
```

Qué cambia:
- `next/link` y assets estáticos resuelven el prefijo solos.
- `router.push('/algo')` resulta en `/modo/algo` sin que lo escribas.
- El smoke test debe pegar a `http://localhost:3000/modo`, no a `http://localhost:3000/`.

> **Trampa**: con `basePath`, `GET /` da **404**. Los probes de k8s/Istio deben apuntar a `/<basePath>`. Caso real: aprendeatumodo — los primeros deployos fallaban porque el liveness probe seguía en `/`.

---

## Runtime env — `NEXT_PUBLIC_*`

### El problema del bakeo

En Next.js, `NEXT_PUBLIC_*` se reemplaza en build time por el valor presente en ese momento. Con `next build` en CI, si el valor cambia entre ambientes (develop / QA / preprod / prod), necesitarías builds separados. La infra MODO usa **una imagen, N ambientes**.

### La solución: `next-runtime-env`

```bash
pnpm add next-runtime-env
```

```tsx
// app/layout.tsx o pages/_app.tsx
import { PublicEnvScript } from 'next-runtime-env';

// En el <head> o dentro del componente:
<PublicEnvScript />
```

```ts
// Donde necesitás el valor:
import { env } from 'next-runtime-env';
const apiUrl = env('NEXT_PUBLIC_API_BASE_URL');
```

El script inyecta los `NEXT_PUBLIC_*` presentes en `process.env` al momento de `next start` (no de `next build`). Una imagen se inicia con distintos SSM params por ambiente, sin rebuild.

> **No bakear `NEXT_PUBLIC_*` en build**. Verificar con `grep -rn "process.env.NEXT_PUBLIC_"` — si encontrás referencias fuera de `next-runtime-env` y fuera de `next.config.js`, son candidatos a migrar.

---

## Coexistencia Pages Router + App Router (opcional, avanzado)

Si en el futuro querés migrar páginas a App Router sin big-bang:

- `src/pages/` y `src/app/` coexisten en Next 13+.
- Las páginas nuevas van a `src/app/`, las viejas quedan en `src/pages/`.
- `_app.js` providers (Redux, Theme) eventualmente se mueven a `src/app/layout.tsx`.
- `_document.js` con `ServerStyleSheet` (styled-components) debe resolverse antes de mover páginas a App Router.

Este curso se enfoca en completar la migración de versión con Pages Router intacto. La migración a App Router es Phase 04 separada.

---

## Checklist de salida

- [ ] Integration branch creado con naming `feat/COENXT-XXX-nextjs-N-to-M-migration`
- [ ] Primer sub-PR apilado sobre integration (no sobre main)
- [ ] `basePath` documentado si aplica
- [ ] Decisión sobre `next-runtime-env` tomada (¿lo usás o no?)
- [ ] `.nvmrc` con Node ≥20.9

> Siguiente: [02 · Breaking changes](02-breaking-changes.md)
