# 04 · Casos canónicos

> Objetivo: los 5 casos más frecuentes para un dev MODO — sabés qué portal, qué `sd/rt`, qué campos pedir y dónde están los gotchas.

## Caso 1 · GitHub: agregar usuario a un team (CYBS)

**Pedido típico**: "sumá a Juan al team `modo-landing-dev`"

| | |
|--|--|
| Service desk | CYBS · Cyber Solicitudes IAM |
| sd | 24 |
| rt | 1577 |
| Portal | https://play-sistemico.atlassian.net/servicedesk/customer/portal/24/group/-1/create/1577 |
| Validado live | Antecedente: CYBS-6841 (2026-05-21) |

**Campos típicos** (fetcheá el schema — los `customfield_*` son orientativos):

```json
{
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev — Juan Pérez",
    "description": "Pedido de incorporación al GitHub team modo-landing-dev para acceso a repos del squad frontend.",
    "customfield_XXXXX": "modo-landing-dev",
    "customfield_YYYYY": { "accountId": "<accountId_del_usuario>" },
    "customfield_ZZZZZ": { "accountId": "<accountId_del_aprobador>" }
  }
}
```

> **Los `customfield_*` reales los obtenés con** `get-fields.sh 24 1577`. No los copies de este ejemplo.

**Campos relacionados**:
- `sd=24 rt=1576` → Crear un team nuevo (necesitás un team que no existe).
- `sd=24 rt=1578` → Cambiar miembros en un grupo.
- `sd=24 rt=1579` → Eliminar usuario de un team.
- `sd=24 rt=1146` → Alta de usuario nuevo en la org GitHub (si todavía no es miembro de la org).

**Gotcha**: si el usuario no es miembro de la org de GitHub de MODO → primero rt=1146 (Alta de Usuario), después rt=1577 (Agregar a Team). No salteés el alta de org.

**Gotcha**: crear/archivar/renombrar un **repo** no está en CYBS. Usá HD sd=1 rt=1404.

---

## Caso 2 · 1Password (CYBS)

**Pedido típico**: "necesito acceso a 1Password para la cuenta de modo"

| | |
|--|--|
| Service desk | CYBS · Cyber Solicitudes IAM |
| sd | 24 |
| rt | 1042 |
| Portal | https://play-sistemico.atlassian.net/servicedesk/customer/portal/24/group/-1/create/1042 |

Formas relacionadas según el pedido exacto:

| Necesidad | rt |
|-----------|-----|
| Alta de usuario en 1Password | 1042 |
| Alta como guest | 1041 |
| Asignar vault existente | 1476 |
| Crear vault nuevo | 1475 |
| Generar API token para integraciones | 1474 |
| Recupero de contraseña | 1469 |

**Campos típicos** (orientativos — fetcheá el schema):

```json
{
  "serviceDeskId": "24",
  "requestTypeId": "1042",
  "requestFieldValues": {
    "summary": "Alta 1Password — Juan Pérez",
    "description": "Necesito acceso a 1Password para gestionar credenciales del proyecto modo-landing."
  }
}
```

El form rt=1042 suele requerir solo `summary`. Verificá con el schema — puede pedir aprobador.

---

## Caso 3 · Cyber GRC Hub (OFFSEC)

**Pedido típico**: "necesito hablar con el equipo de Cyber sobre un diseño de seguridad" / "consulta al GRC Hub"

| | |
|--|--|
| Service desk | OFFSEC · Cyber Offensive Security |
| sd | 192 |
| rt | 14111 |
| Portal | https://play-sistemico.atlassian.net/servicedesk/customer/portal/192/group/-1/create/14111 |

Este form es el entry point general para consultas al equipo de Cyber/GRC. Otros forms de OFFSEC:

| Necesidad | rt |
|-----------|----|
| Pentest (WebSec / AppSec / Cloud) | 11620 |
| Threat Modeling / Security Design Review | 11619 |
| Third-Party & Partner Offensive Audit | 11621 |
| Vulnerability Disclosure | 11623 |

**Campos típicos** (fetcheá el schema real):

```json
{
  "serviceDeskId": "192",
  "requestTypeId": "14111",
  "requestFieldValues": {
    "summary": "Consulta de diseño de seguridad — nuevo MCP OAuth",
    "description": "Estamos diseñando un flujo OAuth para un MCP interno. Queremos validar el modelo de amenazas antes de implementar. Sistema: Node.js + Vercel + KV store."
  }
}
```

**SLA**: Cyber-Solicitudes tiene 72h hábiles desde aprobación como referencia general. Verificá el SLA real post-creación con `GET /rest/servicedeskapi/request/{issueKey}/sla`.

---

## Caso 4 · ABM de Repositorios de GitHub (HD)

**Pedido típico**: "necesito crear el repo `modo-new-feature` en playsistemico"

| | |
|--|--|
| Service desk | HD · IT-Solicitudes |
| sd | 1 |
| rt | 1404 |
| Portal | https://play-sistemico.atlassian.net/servicedesk/customer/portal/1/group/-1/create/1404 |
| Validado live | HD-11623 (2026-05-26) via Chrome session |

Este es el form para **crear, archivar, renombrar o cambiar visibilidad** de repos en la org GitHub de MODO. Los permisos de teams se piden en CYBS (sd=24).

**Campos típicos** (fetcheá el schema — rt=1404 tiene 8+ campos):

```json
{
  "serviceDeskId": "1",
  "requestTypeId": "1404",
  "requestFieldValues": {
    "summary": "Crear repo modo-new-feature en playsistemico",
    "description": "Necesitamos un repo nuevo para el proyecto X. Visibilidad: privado. Template: ninguno.",
    "customfield_10341": "Frontend",
    "customfield_10651": "2026-12-31"
  }
}
```

> `customfield_10651` (fecha de vencimiento) no puede ser anterior a hoy. Si la ponés pasada, el JSM rechaza con 400.

**Gotcha**: hay tres request types con el mismo nombre "ABM de Repositorios de GitHub" en HD (rt=1175, rt=1403, rt=1404). El validado live es **rt=1404**. Si uno de los otros da 400 en campos, probar 1404.

---

## Caso 5 · Platform-Assistant (PEA)

**Pedido típico**: "hay algo raro en la plataforma interna, necesito que alguien investigue"

| | |
|--|--|
| Service desk | PEA · Platform-Assistant |
| sd | 23 |
| rt | 10936 |
| Portal | https://play-sistemico.atlassian.net/servicedesk/customer/portal/23/group/-1/create/10936 |

**Campos típicos** (fetcheá el schema):

```json
{
  "serviceDeskId": "23",
  "requestTypeId": "10936",
  "requestFieldValues": {
    "summary": "Error 500 en endpoint /api/merchants — producción",
    "description": "Desde las 14:30 ART el endpoint devuelve 500. Última release: v2.421.0. Logs adjuntos."
  }
}
```

El otro form en PEA es `rt=10935` (Email request) — para contacto general.

---

## Tabla resumen

| Caso | Service Desk | sd | rt |
|------|-------------|----|----|
| GitHub: agregar usuario a team | CYBS | 24 | 1577 |
| GitHub: crear team nuevo | CYBS | 24 | 1576 |
| GitHub: alta usuario en org | CYBS | 24 | 1146 |
| GitHub: eliminar de team | CYBS | 24 | 1579 |
| GitHub: repos ABM (crear/archivar) | HD | 1 | 1404 |
| 1Password: alta usuario | CYBS | 24 | 1042 |
| 1Password: asignar vault | CYBS | 24 | 1476 |
| Cyber GRC Hub (consulta general) | OFFSEC | 192 | 14111 |
| Pentest | OFFSEC | 192 | 11620 |
| Threat Modeling | OFFSEC | 192 | 11619 |
| Platform-Assistant | PEA | 23 | 10936 |
| Datadog: alta usuario | CYBS | 24 | 1144 |
| Licencias Claude | CYBS | 24 | 3474 |

---

> Siguiente: [05 · Confirmación + tracking](05-confirmacion-tracking.md)
