# 03 · Subdominio + basePath

> Harness: `modo-frontend-deploy` (`/modo-frontend-deploy`) · Istio + DNS

Esta lección cubre cómo le decís a la plataforma dónde vivir. Hay tres patrones; elegís uno según el rol del front. Confundir `basePath` con `assetPrefix` o poner las probes en el path equivocado son los dos bugs más frecuentes en el primer deploy.

---

## Los tres patrones de exposición

### Patrón A — Apex (caso `modo-landing`)

El front es la raíz de `modo.com.ar`. No tiene subdominio propio ni prefijo de path.

```yaml
# helm/values.yaml
domainName: modo.com.ar
exposeAliases: ['www']
```

Resultado por env:

| Env | FQDN |
|-----|------|
| develop | `develop.modo.com.ar` |
| qa | `qa.modo.com.ar` |
| preprod | `preprod.modo.com.ar` |
| production | `modo.com.ar` + `www.modo.com.ar` |

No usás `exposeName` ni `dnsAliasRecord`. Las probes van a `/`:

```yaml
livenessProbe:
  parameters: { path: /, port: 3000 ... }
readinessProbe:
  parameters: { path: /, port: 3000 ... }
```

---

### Patrón B — Subdominio dedicado (caso `promos-hub-site`)

El front vive en `<sub>.modo.com.ar`. Es el patrón estándar para un front nuevo.

```yaml
# helm/values.yaml
domainName: modo.com.ar
exposeName: "mifront"         # → mifront.modo.com.ar en prod
dnsAliasRecord:
  enabled: true               # la plataforma crea el record DNS automáticamente
istio:
  enabled: true
  external: true              # gateway externo → expuesto a internet
```

Resultado por env:

| Env | FQDN |
|-----|------|
| develop | `mifront.develop.modo.com.ar` |
| qa | `mifront.qa.modo.com.ar` |
| preprod | `mifront.preprod.modo.com.ar` |
| production | `mifront.modo.com.ar` |

Las probes van a `/` (la app vive en root en su subdominio):

```yaml
livenessProbe:
  parameters: { path: /, port: 3000 ... }
```

> **`exposeName` define el prefijo del subdominio.** Tiene que ser único en la plataforma y coincidir con la identidad del proyecto. No uses guiones bajos — solo minúsculas y guiones medios.

---

### Patrón C — Embebido bajo un path: `modo.com.ar/<path>`

El front no tiene subdominio propio; vive dentro del apex como un subpath. O tiene ambos (doble exposición, como promos).

```js
// next.config.mjs
const nextConfig = {
  assetPrefix: "/mipath",   // los assets se piden a /mipath/_next/*
  distDir: "./dist/",
  async rewrites() {
    return [
      { source: "/mipath/_next/:path*", destination: "/_next/:path*" },
    ];
  },
};
```

```bash
# config runtime (parameters/<env>/configurations.yaml)
NEXT_PUBLIC_BASE_PATH: /mipath
```

> **`basePath` vs `assetPrefix`** — no son lo mismo:
> - `assetPrefix` solo afecta los assets estáticos (`_next/static/`). La app puede seguir viviendo en `/` en su subdominio.
> - `basePath` hace que **todas** las rutas de la app vivan bajo `/mipath`, incluso en el subdominio propio. Usalo solo si el front **solo** vive embebido y nunca como root.
>
> promos usa `assetPrefix` (+ rewrite) porque también tiene subdominio propio. Si tu front solo existe embebido bajo un path, usá `basePath`.

Cuando usás `basePath`, las probes **tienen que apuntar al path**:

```yaml
livenessProbe:
  parameters: { path: /mipath, port: 3000 ... }
readinessProbe:
  parameters: { path: /mipath, port: 3000 ... }
```

> **Trampa clásica con `basePath`**: si las probes van a `/` y la app tiene `basePath: /mipath`, el pod responde 404 en `/` y el pod **nunca queda Ready**. El cluster lo mata y reinicia en loop. Siempre que haya `basePath`, las probes van al path.

---

## Istio external: cuándo hace falta ticket

Con `dnsAliasRecord.enabled: true` + `istio.external: true`, la plataforma crea el DNS y la regla del gateway automáticamente. **No hace falta ticket a PE CloudOps** para el caso estándar.

Cuando sí hace falta ticket (PEA-10936):

- Necesitás KMS keys nuevas para el `.sops.yaml`.
- El chart que estás usando es una versión vieja que **no** soporta `dnsAliasRecord` — en ese caso el DNS se crea con una regla manual en `misc-alb.yml` del repo `payment-k8s-services`.
- Pedido genérico de plataforma que no entra en los otros tickets.

> Si no sabés qué versión de chart estás usando, preguntale a CloudOps antes de asumir que `dnsAliasRecord` funciona.

---

## ALB legacy (caso borde)

Algunos fronts viejos no usan istio-external sino una regla manual en `payment-k8s-services/misc-alb.yml`. Ese es el fallback si el chart no soporta `dnsAliasRecord`. El proceso:

1. Ticket PEA-10936 a PE CloudOps con la regla que necesitás.
2. Ellos la agregan a `misc-alb.yml`.
3. Vos no tenés write access a ese repo — el diff va en el ticket.

Caso canónico: PE-3192. No es el patrón nuevo — si tenés opción, usá `dnsAliasRecord` + `istio.external`.

---

## Verificar la config antes de mergear

Antes de mergear el PR de helm, verificá mentalmente estas tres preguntas:

1. ¿`app.name` en `values.yaml` coincide con el `PROJECT_NAME` que dijiste en la lección 00? (define el namespace y el path SSM)
2. ¿Las probes apuntan al `path` correcto para tu tipo de exposición?
3. ¿El `containerPort` coincide con el puerto donde escucha `next start`? (3000 para Next 15/16)

```bash
# Verificar que la app levanta en el puerto esperado antes de pushear
pnpm build && pnpm start &
sleep 5
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:3000/   # debe ser 200
# Si tenés basePath:
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:3000/mipath   # 200
curl -s  -o /dev/null -w '%{http_code}\n' http://localhost:3000/          # 404
kill %1
```

---

## Checklist de salida

- [ ] Tipo de exposición elegido: apex / subdominio / path / doble
- [ ] `exposeName` definido (único, sin guiones bajos) si es subdominio
- [ ] `dnsAliasRecord.enabled: true` + `istio.external: true` si es subdominio
- [ ] Probes apuntan al path correcto (`/` o `/<basePath>`)
- [ ] `containerPort` en `values.yaml` = puerto real donde escucha la app (`:3000`)
- [ ] `assetPrefix`/`basePath` en `next.config` si aplica + rewrite `_next`
- [ ] `NEXT_PUBLIC_BASE_PATH` en `parameters/<env>/configurations.yaml` si aplica
- [ ] Ticket PEA-10936 abierto si necesitás KMS o ALB legacy (o confirmado que no hace falta)

> Siguiente: [04 · Deploy + verify](04-deploy-verify.md)
