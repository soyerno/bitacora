# 03 · Payload + POST

> Objetivo: armás el JSON completo, lo revisás y — con confirmación tuya — lo mandás a la API. Sin secretos en el payload, sin POST sorpresa.

## Shape del payload

Todo ticket JSM se crea con `POST /rest/servicedeskapi/request`. El body siempre tiene la misma estructura raíz:

```json
{
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev team — Juan Pérez",
    "description": "Necesito agregar a Juan Pérez al GitHub team modo-landing-dev para que trabaje en el próximo sprint.",
    "customfield_XXXXX": "...",
    "customfield_YYYYY": { "id": "10325" }
  }
}
```

Campos raíz opcionales:

```json
{
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "raiseOnBehalfOf": "<accountId del beneficiario — solo si pedís por otra persona>",
  "requestParticipants": ["<accountId>"],
  "requestFieldValues": { ... }
}
```

> `raiseOnBehalfOf` solo cuando el ticket es para otra persona y el user lo pidió explícito. Default: el ticket queda a nombre tuyo.

## Endpoints

| Verbo | Path | Qué hace |
|-------|------|----------|
| POST | `/rest/servicedeskapi/request` | Crear el ticket |
| GET | `/rest/servicedeskapi/servicedesk/{sd}/requesttype/{rt}/field` | Fetchear schema de campos |
| GET | `/rest/servicedeskapi/request?requestOwnership=OWNED_REQUESTS` | Tus tickets abiertos |
| GET | `/rest/servicedeskapi/request/{issueKey}` | Estado de un ticket |

Base URL: `https://play-sistemico.atlassian.net`

Headers siempre necesarios:
```http
Accept: application/json
Content-Type: application/json
```

Para búsqueda global de request types: agregar `X-ExperimentalApi: opt-in`.

## Método A: Browser session (preferido, interactivo)

Con Chrome logueado en `play-sistemico.atlassian.net`, el skill ejecuta desde la página:

```js
const payload = {
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev — Juan Pérez",
    "description": "...",
    "customfield_11958": { "accountId": "557058:abc-def" }
  }
};

const response = await fetch("/rest/servicedeskapi/request", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(payload)
});
return { status: response.status, body: await response.json() };
```

Ventajas: sin token, sin credenciales en disco, refleja exactamente lo que ve el portal.

## Método B: cURL con API token (headless / CI)

```bash
EMAIL=$(cat ~/.atlassian/email)
TOKEN=$(cat ~/.atlassian/jsm-token)

curl -sS -X POST \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/request" \
  -u "$EMAIL:$TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "serviceDeskId": "24",
    "requestTypeId": "1577",
    "requestFieldValues": {
      "summary": "Agregar a modo-landing-dev — Juan Pérez",
      "description": "...",
      "customfield_11958": { "accountId": "557058:abc-def" }
    }
  }'
```

> Nunca pongas el token literal en el payload ni en el `summary`. El token va en el header `Authorization: Basic base64(email:token)`. El payload solo tiene datos del negocio.

### Setup del API token (una vez)

1. Ir a `https://id.atlassian.com/manage-profile/security/api-tokens`
2. Crear token, copiar valor.
3. Guardarlo con permisos seguros:

```bash
mkdir -p ~/.atlassian && chmod 700 ~/.atlassian
printf '%s' 'EL_TOKEN_AQUI' > ~/.atlassian/jsm-token
chmod 600 ~/.atlassian/jsm-token
printf '%s' 'tu-email@modo.com.ar' > ~/.atlassian/email
chmod 600 ~/.atlassian/email
```

## Preview obligatorio antes del POST

> **Regla dura: nunca POSTear sin mostrarte el payload completo.**

El skill siempre muestra el JSON antes de crear. Ejemplo de preview:

```
=== PREVIEW · no se creó nada todavía ===

POST https://play-sistemico.atlassian.net/rest/servicedeskapi/request

{
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev — Juan Pérez",
    "description": "Necesito agregar a Juan Pérez (juan.perez@modo.com.ar) al team modo-landing-dev para el sprint de junio.",
    "customfield_11958": { "accountId": "557058:abc-def-123" }
  }
}

Portal equivalente (crear manualmente):
  https://play-sistemico.atlassian.net/servicedesk/customer/portal/24/group/-1/create/1577

¿Creo el ticket? (confirmá con "dale", "sí", "POST" o "crear")
```

Solo después de tu confirmación explícita el skill ejecuta el POST.

## Response exitosa (HTTP 201)

```json
{
  "issueId": "98765",
  "issueKey": "CYBS-6900",
  "requestTypeId": "1577",
  "serviceDeskId": "24",
  "_links": {
    "jiraRest": "https://play-sistemico.atlassian.net/rest/api/2/issue/98765",
    "web": "https://play-sistemico.atlassian.net/browse/CYBS-6900",
    "self": "https://play-sistemico.atlassian.net/rest/servicedeskapi/request/CYBS-6900"
  }
}
```

Guardá el `issueKey` (ej. `CYBS-6900`) — lo necesitás para seguimiento y comentarios.

## Errores comunes

| HTTP | Causa típica | Fix |
|------|-------------|-----|
| 400 | Campo requerido faltante o `fieldId` incorrecto | Re-fetchear schema y corregir payload |
| 400 | Valor de `option` enviado como string en vez de `{ "id": "..." }` | Cambiar al shape correcto |
| 401 | Token incorrecto o expirado | Regenerar en id.atlassian.com |
| 403 | El user no es customer de ese portal | Hablar con IT para que te agreguen |
| 303 → HTML | Sesión del browser expirada | Re-loguearse en play-sistemico.atlassian.net |

---

> Siguiente: [04 · Casos canónicos](04-casos-canonicos.md)
