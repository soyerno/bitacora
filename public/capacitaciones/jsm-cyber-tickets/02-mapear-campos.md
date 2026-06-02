# 02 · Mapear campos

> Objetivo: dado un `sd` + `rt`, fetcheás el schema de campos y sabés qué preguntar, qué es requerido y cómo no inventar nada.

## Por qué nunca hardcodear `customfield_*`

Los IDs de campos custom cambian por service desk. `customfield_10897` en HD es distinto a `customfield_10897` en CYBS. Si copiás un payload de un ticket anterior de otro portal y mandás los mismos `customfield_*`, el JSM puede rechazarlo con un 400 silencioso o — peor — aceptarlo y guardar valores en el campo equivocado.

> Regla: **siempre fetcheá el schema en runtime**. Nunca asumas un `fieldId`.

## Fetch del schema de campos

```bash
# API token
EMAIL=$(cat ~/.atlassian/email)
TOKEN=$(cat ~/.atlassian/jsm-token)
curl -sS -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/servicedesk/24/requesttype/1577/field" \
  -H "Accept: application/json" | jq .
```

```js
// Browser session (evaluate_script)
fetch("/rest/servicedeskapi/servicedesk/24/requesttype/1577/field", {
  headers: { "Accept": "application/json" }
}).then(r => r.json())
```

Response: `{ "requestTypeFields": [ { "fieldId", "name", "required", "jiraSchema", "validValues", "defaultValues" } ] }`

## Anatomía de un campo

```json
{
  "fieldId": "customfield_10341",
  "name": "Empresa o Área Solicitante",
  "required": true,
  "jiraSchema": { "type": "string" },
  "validValues": [],
  "defaultValues": []
}
```

- `fieldId` → la key que va en `requestFieldValues`.
- `required: true` → obligatorio; el POST falla sin él.
- `jiraSchema.type` → determina el shape del valor (ver tabla abajo).
- `validValues` → si no está vacío, son las opciones válidas (usar `id`, no `value`).
- `defaultValues` → si el form ya propone un default, podés usarlo sin preguntar.

## Mapping tipo → shape del valor

| Tipo (`jiraSchema.type`) | Shape en el payload | Notas |
|--------------------------|---------------------|-------|
| `string` | `"valor plano"` | Texto libre, summary, description |
| `number` | `12500` | Sin comillas, sin separadores |
| `date` | `"2026-06-30"` | ISO 8601 (`YYYY-MM-DD`). En portal web: `D/mmm/YY` |
| `option` | `{ "id": "10325" }` | Usar `id` de `validValues`. Si da 400, probar `{ "value": "..." }` |
| `array` de `option` | `[{ "id": "10325" }, { "id": "10326" }]` | Multi-select |
| `user` | `{ "accountId": "557058:abc-123" }` | Resolver con `lookupJiraAccountId` |
| `array` de `user` | `[{ "accountId": "..." }]` | Multi-user picker |
| `priority` | `{ "name": "Medium" }` | Valores: Highest / High / Medium / Low / Lowest |
| `attachment` | `["TEMP-ID-1"]` | Dos pasos: subir temp primero |
| `labels` | `["etiqueta-1", "etiqueta-2"]` | Array de strings libres |

## Campo aprobador: cómo identificarlo

En muchos forms CYBS el aprobador es un campo `user` requerido. Se llama de distintas formas según el form:

- "Aprobador"
- "Manager / Aprobador"
- "Autorizador"

> **Es obligatorio y no lo podés inventar.** El JSM no acepta un nombre libre en ese campo — necesitás el `accountId` real del aprobador.

### Cómo resolver el accountId del aprobador

```
/modo-jsm-ticket lookup fernando.garade@modo.com.ar
```

O con MCP Atlassian:
```
mcp__claude_ai_Atlassian__lookupJiraAccountId  →  emailAddress: "fernando.garade@modo.com.ar"
```

Devuelve `accountId` tipo `"557058:abc-def-123"`. Ese es el valor que va en el payload.

> Si hay dos personas con el mismo nombre (ej. Fernando Garade vs Fernando Vega en el user-picker del portal), confirmá el email/displayName exacto antes de seleccionar.

## Campos especiales · validaciones MODO

| Campo | Validación |
|-------|-----------|
| CBU (`customfield_10845`) | 22 dígitos exactos |
| CUIT (`customfield_10795`) | 11 dígitos |
| Email `user` | Dominio `modo.com.ar` para empleados internos |
| Fecha de vencimiento (`customfield_10651`) | No anterior a hoy |
| Adjunto PDF (SDV-375 Solicitar contratación) | PDF, no texto plano |

Si una validación falla, el skill lo dice y pide corrección **antes** del POST. No manda y deja que el JSM rebote.

## Campos opcionales: qué hacer

Si un campo tiene `required: false` y el user no lo aclaró → **no lo incluyas** en el payload. No inventes valores, no pongas `""` o `null`. La API acepta payloads incompletos siempre que los requeridos estén.

## Checklist de mapeo

- [ ] Fetcheé el schema del form (`/servicedesk/{sd}/requesttype/{rt}/field`)
- [ ] Identifiqué los campos con `required: true`
- [ ] Para cada `option`: tengo el `id` de `validValues`, no el string display
- [ ] Para cada campo `user`: resolví el `accountId` con `lookupJiraAccountId`
- [ ] El aprobador tiene `accountId` real (no nombre libre)
- [ ] Fechas en formato `YYYY-MM-DD` (API) o `D/mmm/YY` (portal web)
- [ ] Los campos opcionales no rellenados quedan **fuera** del payload

---

> Siguiente: [03 · Payload + POST](03-payload-post.md)
