# 01 · Tickets JSM

> Harness: `modo-jsm-ticket` (`/modo-jsm-ticket`)

Un front nuevo en `playsistemico` dispara seis tickets en el portal JSM de MODO. Esta lección explica cuáles son, cuándo abrirlos y en qué orden — porque equivocarse en el orden bloquea la siguiente fase.

---

## Los 6 tickets canónicos

| # | Fase | Service Desk | Request Type | sd / rt | Cuándo |
|---|------|--------------|--------------|---------|--------|
| 1 | Bootstrap | HD · IT-Solicitudes | ABM de Repositorios de GitHub | 1 / **1404** | Antes de pushear infra |
| 2 | Bootstrap | CYBS · Cyber-Solicitudes IAM | Github - Creación de Team | 24 / 1576 | Después de #1 cerrado |
| 3 | Bootstrap | CYBS · Cyber-Solicitudes IAM | Github - Agregar Usuario a Team | 24 / 1577 | Después de #2 cerrado |
| 4 | Config k8s | PEA · Platform-Assistant | Investigar un problema | 23 / 10936 | Solo si necesitás KMS nuevas, DNS manual, o ALB legacy |
| 5 | Pre-prod | OFFSEC · Cyber Offensive Security | Cyber & GRC Hub | 192 / 14111 | Al pasar preprod (GATE de prod) |
| 6 | Post-prod | CYBS · Cyber-Solicitudes IAM | 1Password | 24 / 1042 | Solo después de prod desplegado |

> **Rt=1404 es el único validado live para HD-1404.** El catálogo expone también `rt=1175` y `rt=1403` con el mismo nombre — están deprecated. Usar siempre 1404.

---

## Reglas de orden (crítico)

```
Bootstrap (antes de código)
  → #1 crear repo (HD-1404)
  → #2 crear team (CYBS-1576)     ← esperar cierre de #1
  → #3 agregar miembros (CYBS-1577) ← esperar cierre de #2

Config k8s
  → #4 PEA-10936  (SOLO si: KMS keys nuevas / DNS manual / misc-alb.yml legacy)

Al pasar preprod (antes de prod)
  → #5 GRC review / threat model  ← GATE: si rebota, no hay prod

Post-prod
  → #6 1Password vault             ← solo después de prod desplegado
```

### Anti-patrones a evitar

- **"Cyber para crear el repo"** — no existe. CYBS no crea repos; solo gestiona teams y accesos. El repo es siempre HD-1404.
- **Abrir #5 el día de prod** — el SLA de OFFSEC no está declarado; tratalo como ≥72h. Abrilo al entrar a preprod.
- **Abrir #6 antes de prod** — el vault de prod no tiene credenciales que cargar hasta que prod esté desplegado.
- **Reusar `rt=1175` o `rt=1403`** — deprecated, pueden tener fields distintos al form actual.

---

## SLAs

| Ticket | SLA |
|--------|-----|
| CYBS (sd=24): #2, #3, #6 | **72h hábiles** desde aprobación |
| OFFSEC (sd=192): #5 | No declarado — tratá como ≥72h, confirmá en el portal |
| HD (sd=1): #1 | No declarado en el catálogo |
| PEA (sd=23): #4 | No declarado |

> Si tu fecha objetivo de prod es el lunes, meté #2 y #3 el martes anterior como mínimo. Calendarizá hacia atrás.

---

## Cómo abrirlos con el harness

El skill `modo-jsm-ticket` arma el payload, te muestra un preview con la URL del portal, y POSTea solo con tu confirmación explícita. Devuelve el issue key + link.

```
/modo-jsm-ticket
```

Al invocar, Claude te pregunta el ticket que querés abrir y los campos necesarios. Para #1 y #3 los templates están validados live (HD-11623, CYBS-6841); para los otros cuatro el skill hace un `fetch fields fresh` del portal antes de armar el payload.

> **Preguntar el aprobador antes de POSTear** — es campo obligatorio del ticket y no se inventa. Si no lo sabés, pedíselo al lead o manager del squad.

---

## Verificar que #1 cerró antes de seguir

```bash
# Chequear que el repo existe antes de arrancar los PRs de infra
gh repo view playsistemico/<nombre-de-tu-repo>
```

Si devuelve 404 → #1 no está cerrado o devops todavía no procesó. No sigas a la lección 02 hasta tener el repo.

---

## Tickets opcionales

Según el proyecto pueden hacer falta:

| Necesidad | Service Desk | sd / rt |
|-----------|--------------|---------|
| Datadog API key | CYBS · Cyber-Solicitudes IAM | 24 / 1144 |
| AWS · Alta de usuario | CYBS · Cyber-Solicitudes IAM | 24 / 1139 |
| Acceso a AWS | HD · IT-Solicitudes | 1 / 64 |

Mismas reglas de orden y SLA que los CYBS canónicos.

---

## Checklist de salida

- [ ] #1 HD-1404 abierto (o ya cerrado con el repo existiendo)
- [ ] #2 CYBS-1576 abierto (después del cierre de #1)
- [ ] #3 CYBS-1577 abierto (después de #2)
- [ ] SLAs anotados en el calendario: CYBS ≥72h hábiles
- [ ] Aprobador del ticket registrado (no inventado)
- [ ] `gh repo view playsistemico/<repo>` devuelve el repo

> Siguiente: [02 · PRs de infra](02-infra-prs.md)
