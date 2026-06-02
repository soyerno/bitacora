# 04 · Build + test + smoke — Contrato verde

> Objetivo: `pnpm build` verde + contrato de rutas verificado + suites de Jest pasando. Sin claim sin verify.

---

## El contrato mínimo

Antes de abrir un PR a integration, el sub-PR debe cumplir:

| Check | Comando | Esperado |
|-------|---------|---------|
| Lint | `pnpm lint` | 0 errores (warnings aceptables) |
| Build | `pnpm build` | Exit 0, sin errores TS ni webpack/turbopack |
| Tests | `pnpm test` | Todas las suites verdes |
| Smoke raíz | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` | `404` si hay basePath, `200` si no hay |
| Smoke basePath | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/<basePath>` | `200` |

---

## `pnpm build` verde

### `corepack` + TTY trap

> **Trampa**: bajo corepack, `pnpm build` puede correr un pre-script `runDepsStatusCheck` que aborta con `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` cuando no hay TTY (en agentes/CI).

Si el build falla con ese error, usar el workaround:

```bash
# Opción A: flag CI
CI=true pnpm build

# Opción B: llamar next build directo (skipea el wrapper)
./node_modules/.bin/next build
```

### `pnpm.overrides` para safe-chain

El pre-push hook `check-safe-chain-age.mjs` bloquea deps con <7 días (168h). Al bumpear Next/React major llegan deps transitivas frescas. Fix: pinear las flagged via `pnpm.overrides`:

```json
"pnpm": {
  "overrides": {
    "handlebars": "4.7.9",
    "semver": "7.7.4",
    "enhanced-resolve": "5.21.6"
  }
}
```

Verificar la age de cada candidata:

```bash
npm view <pkg> time --json | python3 -c "
import sys, json
from datetime import datetime
t = json.load(sys.stdin)
now = datetime.utcnow()
for v, ts in t.items():
    if v in ('created','modified'): continue
    d = datetime.fromisoformat(ts.replace('Z',''))
    age = (now-d).days
    if age >= 7: print(v, age, 'days')
" | tail -10
```

---

## Tests: política no-snapshots

La política MODO elimina los Jest snapshots. Post-codemod `new-link`, los class names cambian y los snapshots se rompen de todas formas.

```bash
# Inventariar snapshots existentes
find src -name "*.snap" -type f
find src -type d -name "__snapshots__"
```

**No regenerar** (`pnpm test:update-snap`). Reemplazar con assertions semánticas RTL:

```ts
// En lugar de: expect(container).toMatchSnapshot()
expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument();
expect(screen.getByText('Título')).toBeVisible();
```

Caso real modo-landing: 26 archivos `.snap` + 57 `toMatchSnapshot` → −6204 líneas netas eliminadas.

### Correr tests por path

> **Trampa de flags pnpm**: `pnpm test -- --testPathPattern=src/...` se come el flag. Usar:

```bash
# Opción A: npx directo
npx jest src/components/MiComponente

# Opción B: script dedicado
pnpm test:specific -t "MiComponente"
```

---

## Smoke test: contrato de rutas

Una vez que el build pasa, arrancar `next start` y verificar el contrato:

```bash
# En una terminal:
pnpm build && ./node_modules/.bin/next start -p 3000 &
SERVER_PID=$!

# Smoke básico (sin basePath):
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
# Espera: 200

# Smoke con basePath (ej. basePath: '/modo'):
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/modo
# Espera: 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
# Espera: 404

# Cleanup
kill $SERVER_PID
```

> **Por qué `GET /` debe dar 404 con basePath**: los probes de liveness/readiness en k8s/Istio apuntan a la ruta real del pod. Si tu deploy tiene `basePath: '/modo'` y el probe sigue pegando a `/`, el pod nunca queda Ready y el rollout falla silenciosamente.

### Verificar que `NEXT_PUBLIC_*` llega al HTML

Si usás `next-runtime-env`:

```bash
# Arrancá con una var de prueba
NEXT_PUBLIC_API_BASE_URL=https://test.modo.com.ar \
  ./node_modules/.bin/next start -p 3000 &

# El script inline debe aparecer en el HTML
curl -s http://localhost:3000/<basePath> | grep "__ENV"
# Debe salir algo como: window.__ENV = {"NEXT_PUBLIC_API_BASE_URL":"https://test.modo.com.ar"}
```

---

## Verify-greps antes de declarar done

```bash
# Sin residuos de legacy/image
grep -rln "next/legacy/image" src | wc -l   # → 0

# Sin props legacy de image
grep -rnE "(layout=|objectFit=|lazyBoundary=)" src | grep -v "style="   # → vacío

# Sin import.meta.env de Vite (si venías de Vite)
grep -rn "import.meta.env" src app 2>/dev/null   # → vacío

# Sin react-router (si venías de Vite)
grep -rln "react-router" src | grep -v test   # → vacío o solo tests

# Sin snapshots
find src -name "*.snap" | wc -l   # → 0

# Sin console.log/error/warn en prod
grep -rn "console\.\(log\|error\|warn\)" src | grep -v test | grep -v ".test." | grep -v "spec"
```

---

## SonarCloud: smells a prevenir por step

| Step | Smell probable | Fix |
|------|---------------|-----|
| new-link aplicado | S1874 si `next/legacy/image` quedó | Re-migrar a moderno |
| Archivo `.jsx` tocado | S6774 (props sin validar) | Agregar `Component.propTypes = {}` |
| Código nuevo con `any` | S4325 | Tipar o `// @ts-expect-error` documentado |

---

## Checklist de salida

- [ ] `pnpm lint` — 0 errores
- [ ] `pnpm build` (o `CI=true pnpm build`) — exit 0
- [ ] `pnpm test` — todas las suites verdes, 0 snapshots
- [ ] Smoke `GET /<basePath>` = 200
- [ ] Smoke `GET /` = 404 (si hay basePath), 200 (si no)
- [ ] Verify-greps: 0 legacy/image, 0 import.meta.env, 0 snapshots
- [ ] `NEXT_PUBLIC_*` aparece en el HTML inline (si usás next-runtime-env)

> Siguiente: [05 · Deploy](05-deploy.md)
