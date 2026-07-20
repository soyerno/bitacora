# 05 · Confirmación + tracking

> Objetivo: confirmás el payload antes de crear, obtenés el issue key + URL, y sabés cómo darle seguimiento sin que el ticket se pierda.

## Preview antes del POST: siempre

> **El skill nunca crea un ticket sin mostrarte el payload completo y esperar tu "dale".**

El preview incluye:
1. El JSON body completo (con los `customfield_*` resueltos y los `accountId` reales).
2. La URL del portal equivalente para crear manualmente si preferís.
3. La pregunta explícita de confirmación.

Ejemplo:

```
=== PREVIEW · no se creó nada todavía ===

Ticket: Github - Agregar Usuario a Team
Portal: CYBS (sd=24, rt=1577)

{
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev — Juan Pérez",
    "description": "Incorporación al team para el sprint de junio.",
    "customfield_11958": { "accountId": "557058:abc-def-123" },
    "customfield_10341": "modo-landing-dev",
    "customfield_10897": "Access requerido para trabajar en el squad frontend"
  }
}

URL portal (crear manualmente):
  https://play-sistemico.atlassian.net/servicedesk/customer/portal/24/group/-1/create/1577

¿Creo el ticket? → confirmá con "dale", "sí", "POST" o "crear"
```

Palabras que el skill reconoce como confirmación: `dale`, `sí`, `si`, `POST`, `crear`, `confirmar`, `ok`. Cualquier otra cosa es un "no todavía".

## Output exitoso

Con HTTP 201:

```
Ticket creado ✓

  Issue key : CYBS-6900
  Portal    : https://play-sistemico.atlassian.net/browse/CYBS-6900
  Estado    : Open (estado inicial)
```

El skill **no** declara "aprobado" ni "en progreso" — solo confirma el `issueKey` y el estado inicial que devuelve la API. El estado real depende del flujo de aprobación del portal.

## Seguimiento: endpoints útiles

### Ver el estado del ticket

```bash
EMAIL=$(cat ~/.atlassian/email)
TOKEN=$(cat ~/.atlassian/jsm-token)

curl -sS -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/request/CYBS-6900/status" \
  -H "Accept: application/json" | jq .
```

Response: `{ "currentStatus": { "status": "Waiting for approval", "statusDate": "..." } }`

### Ver comentarios

```bash
curl -sS -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/request/CYBS-6900/comment" \
  -H "Accept: application/json" | jq '.values[].body'
```

### Ver SLA

```bash
curl -sS -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/request/CYBS-6900/sla" \
  -H "Accept: application/json" | jq '.values[] | { name: .name, completedCycles: .completedCycles }'
```

### Mis tickets abiertos

```bash
curl -sS -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/request?requestOwnership=OWNED_REQUESTS&requestStatus=OPEN_REQUESTS&limit=20" \
  -H "Accept: application/json" | jq '.values[] | { issueKey: .issueKey, summary: .requestFieldValues.summary }'
```

## Flujo de aprobación típico en CYBS

```
Ticket creado (Open)
    ↓
Waiting for approval  ←── aprobador recibe notif por email/Slack
    ↓ (aprueba)
In Progress           ←── IAM team procesa
    ↓
Resolved / Done       ←── acceso concedido
```

Si el aprobador rechaza → el ticket pasa a "Declined". Te llega notificación. Podés crear uno nuevo con un aprobador correcto si fue un error de routing.

## SLA de referencia por portal

| Portal | SLA orientativo |
|--------|----------------|
| CYBS | 72h hábiles desde aprobación |
| HD | Variable por form (hardware → varios días; accesos → ~24h) |
| OFFSEC | Depende del form; Threat Modeling puede tomar semanas |
| PEA | Sin SLA publicado en el catálogo — preguntar al equipo |

> Verificá el SLA real con `GET /rest/servicedeskapi/request/{issueKey}/sla` — los valores del catálogo son orientativos.

## Comentar en el ticket

Si necesitás agregar información después de crear:

```bash
curl -sS -X POST -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/request/CYBS-6900/comment" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "body": "Aclaración: el usuario ya es miembro de la org GitHub, solo falta el team.",
    "public": true
  }'
```

## Checklist de cierre

- [ ] Preview mostrado y revisado (campos, `accountId`s, sd/rt correctos)
- [ ] Confirmación dada explícitamente
- [ ] `issueKey` guardado (ej. `CYBS-6900`)
- [ ] URL del portal guardada para seguimiento
- [ ] SLA conocido / revisado con el endpoint
- [ ] Si bloqueado en aprobación: contactar al aprobador por Slack con el issue key

---

> Volvé al [README](#intro) o hacé el [Lab integrador](exercises/README.md).
