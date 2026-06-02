# 00 · Assessment — ¿qué tenés y a dónde vas?

> Objetivo: antes de tocar una línea, saber exactamente de dónde partís y confirmar que el target es **server-rendered** con `next start`.

---

## 1. Diagnosticar el punto de partida

Respondé estas preguntas primero:

### ¿Cuál es tu stack actual?

| Caso | Señales |
|------|---------|
| **Vite SPA** | `vite.config.ts` presente, `react-router`, sin `pages/` ni `app/`, `index.html` en raíz |
| **Next 12** | `package.json` con `"next": "12.x"`, `src/pages/`, `_app.js`, `_document.js` |
| **Next 13/14** | `"next": "13.x"` o `"14.x"`, puede tener `src/app/` |
| **Next 15** | `"next": "15.x"`, Turbopack en dev |
| **Static HTML** | Sin bundler, `index.html` por página, `nav-counts.js` etc. |

```bash
# Comando rápido de diagnóstico
cat package.json | grep -E '"next"|"vite"|"react-router"'
ls -1 src/ 2>/dev/null || ls -1 .
```

### ¿Hay un `output: 'export'` o similar?

```bash
grep -r "output" next.config* 2>/dev/null
grep -r "ssr.*false" next.config* 2>/dev/null
```

> **Trap**: si alguien configuró `output: 'export'` pensando en static hosting, hay que removerlo. La infra MODO necesita `next start` (Node server), no export estático. Un build con `output: 'export'` no soporta `getServerSideProps` ni ISR.

---

## 2. Confirmar el target: server-rendered, no export

El target de este curso es:

- `next start` en `:3000`.
- Output a `./dist/` (o el `distDir` configurado).
- **Sin** `output: 'export'` ni `output: 'standalone'`.
- Probes de k8s/Istio apuntan a `/<basePath>`, no a `/`.

Si tu caso es Vite SPA → App Router, este curso cubre la estrategia pero el skill `vite-to-nextjs-app-router` tiene el workflow detallado para App Router.

---

## 3. Resolver el package manager: un solo lockfile

> **Trap crítica**: dos lockfiles en el mismo repo (`package-lock.json` + `pnpm-lock.yaml`) causan inconsistencias silenciosas. El pre-push hook de safe-chain y los CI workflows usan el lockfile de pnpm — si hay otro, se ignora y los deps pueden diferir entre entornos.

```bash
# Inventariar lockfiles
git ls-files | grep -E "(package-lock|yarn\.lock|bun\.lock|pnpm-lock)"
```

**Regla**: quedate con `pnpm-lock.yaml`. Borrá los otros del repo.

```bash
git rm package-lock.json yarn.lock bun.lockb 2>/dev/null
git commit -m "chore(COENXT-XXX): rm lockfiles no-pnpm"
```

---

## 4. Campo `packageManager` en package.json

Next.js 16 + corepack esperan que `package.json` declare el manager:

```json
{
  "packageManager": "pnpm@9.x.x"
}
```

Chequear la versión usada en modo-landing como referencia:
```bash
cat /ruta/a/modo-landing/package.json | grep packageManager
```

Si falta el campo, corepack puede elegir una versión incompatible en CI.

---

## 5. Checklist de salida antes de seguir

- [ ] Stack actual identificado (Vite / Next 12 / Next 13+ / HTML)
- [ ] Confirmado target: `next start`, sin `output: 'export'`
- [ ] Un solo lockfile (`pnpm-lock.yaml`)
- [ ] Campo `packageManager` declarado en `package.json`
- [ ] Node ≥20.9 en `.nvmrc` (requerimiento Next 16)

```bash
node -v  # debe ser ≥20.9
cat .nvmrc 2>/dev/null || echo "falta .nvmrc"
```

> Siguiente: [01 · Estrategia](01-estrategia.md)
