# 05 · Gate de prod

> Harness: `modo-jsm-ticket` (`/modo-jsm-ticket`) · GRC / OFFSEC

El gate de prod no es un paso de verificación post-deploy — es un **gate** que tiene que pasar **antes** de que podás promover a producción. Si OFFSEC lo rebota, no hay prod hasta que se resuelvan los hallazgos. Esta lección explica cómo prepararlo para que no bloquee la fecha.

---

## Ticket #5 · GRC review / threat model

| Campo | Valor |
|-------|-------|
| Service Desk | OFFSEC · Cyber Offensive Security |
| Request Type | Cyber & GRC Hub |
| sd / rt | 192 / 14111 |
| Cuándo abrirlo | Al pasar preprod (no el día de prod) |
| SLA | No declarado — tratá como ≥72h, confirmá en el portal |

```
/modo-jsm-ticket
```

El skill arma el payload del ticket con los campos del formulario live (hace fetch fresh de los fields), te muestra el preview y POSTea con tu confirmación.

> **Abrirlo al entrar a preprod, no el día de prod.** Con SLA no declarado y tratando como ≥72h, si lo abrís el lunes queriendo ir a prod el miércoles, probablemente no llegás. Calendarizá con margen.

---

## Qué necesita OFFSEC para aprobar

El equipo GRC/OFFSEC revisa:

- **Threat model básico**: qué datos maneja el front, qué APIs consume, qué puede hacer un usuario no autenticado.
- **CSP + headers de seguridad**: el resultado del Layer 3 del skill `frontend-security-checklist` acelera mucho la review.
- **Autenticación / autorización**: si el front tiene rutas protegidas o maneja sesiones, cómo están aseguradas.
- **Dependencias**: `npm audit` sin high/critical sin atender.
- **Secrets**: que no hay tokens hardcodeados en el código (el scan de Fase 2 del onboarding lo verifica).

### Preparar el Layer 3 antes de abrir el ticket

```
/frontend-security-checklist
```

El skill Layer 3 valida CSP y security headers contra el edge live de preprod. Pasarle el output al ticket #5 muestra que ya hiciste el trabajo:

```bash
# Layer 3 — validación CSP post-deploy contra preprod
# (el skill lo hace automáticamente, pero podés verificar a mano)
curl -sI https://<sub>.preprod.modo.com.ar/ | grep -i "content-security-policy\|x-frame-options\|strict-transport-security"
```

Headers esperados (mínimo):
- `Content-Security-Policy` presente y no vacío
- `X-Frame-Options: DENY` o `SAMEORIGIN`
- `Strict-Transport-Security` con `max-age` ≥ 31536000

---

## Qué hacer si el ticket rebota

Si OFFSEC encuentra hallazgos:

1. Leer cada hallazgo con calma — muchos son configuración, no código.
2. Resolver los bloqueantes (los que OFFSEC marcó como requeridos para prod).
3. Documentar los hallazgos opcionales como deuda en Jira (COENXT o el proyecto del squad).
4. Actualizar el ticket con las evidencias de fix (commit SHA, screenshot, curl output).
5. Pedir re-review dentro del mismo ticket (no abrir uno nuevo).

> No escondas hallazgos. Si algo no se puede resolver antes de prod, explicarlo honestamente en el ticket con el plan de remediación y la fecha. Es mejor un hallazgo documentado que uno ignorado.

---

## Ticket #6 · 1Password (post-prod)

| Campo | Valor |
|-------|-------|
| Service Desk | CYBS · Cyber-Solicitudes IAM |
| Request Type | 1Password |
| sd / rt | 24 / 1042 |
| Cuándo abrirlo | **Solo después de prod desplegado** |
| SLA | 72h hábiles desde aprobación |

Este ticket pide un vault en 1Password del team con las **credenciales de prod** (tokens, API keys, secrets del entorno de producción). No tiene sentido abrirlo antes de que prod exista — no hay credenciales que compartir.

Para dev/qa podés pedir un vault separado antes, con scope distinto.

---

## Validación final antes de prod

Además del OK de OFFSEC, verificar:

- [ ] **Datadog** recibe trazas de preprod (`unifiedServiceTagging` + `ddTrace` en `values.yaml`)
- [ ] **Amplitude** emite eventos de preprod (verificar en el dashboard de la propiedad)
- [ ] **CSP Layer 3** verde en preprod (resultado del skill `frontend-security-checklist`)
- [ ] **`npm audit`** sin vulnerabilidades high/critical sin atender

```bash
# Verificar observabilidad en preprod
curl -sI https://<sub>.preprod.modo.com.ar/ | grep -i "x-datadog-trace-id\|x-b3-traceid"

# npm audit
pnpm audit --audit-level=high
```

---

## Promover a prod

Solo después del OK explícito de OFFSEC en el ticket #5:

```bash
gh workflow run production.yaml \
  --repo playsistemico/<repo> \
  --field environment=production
# o desde GitHub Actions → production.yaml → Run workflow
```

Después del deploy:

```bash
# Re-validar CSP/headers contra el edge de prod
curl -sI https://<sub>.modo.com.ar/ | grep -i "content-security-policy\|strict-transport-security"

# Smoke final
curl -fsS -o /dev/null -w '%{http_code}\n' https://<sub>.modo.com.ar/
# Esperado: 200
```

---

## Checklist de salida

- [ ] Ticket #5 (OFFSEC-14111) abierto al entrar a preprod
- [ ] Layer 3 CSP ejecutado en preprod y resultado adjunto al ticket
- [ ] `npm audit` sin high/critical sin atender
- [ ] Datadog + Amplitude verificados en preprod
- [ ] OK explícito de OFFSEC en el ticket (no suposición)
- [ ] Deploy a prod ejecutado con `production.yaml`
- [ ] Smoke curl 200 en `https://<sub>.modo.com.ar/`
- [ ] CSP/headers Layer 3 re-validado en prod
- [ ] Ticket #6 (CYBS-1042 · 1Password) abierto con credenciales de prod

> ¡Listo! Tu front está en producción. Revisá el [Lab integrador](exercises/README.md) para consolidar el flujo completo.
