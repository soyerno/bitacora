# 01 · Descubrir el portal

> Objetivo: dado un pedido en palabras, encontrás el service desk y request type correcto — con su `sd` y `rt` — antes de tocar ningún campo.

## Por qué importa elegir bien

Los `customfield_*` que pide un form **son únicos por request type**. Si elegís el form equivocado, los campos requeridos no van a matchear y el ticket va a ser rechazado o redirigido. La búsqueda es barata — hacela primero.

## Camino A: buscar en el catálogo local (offline, rápido)

El skill tiene el catálogo indexado en `~/.claude/skills/modo-jsm-ticket/reference/catalog.md` (29 desks / 318 forms, snapshot 2026-05-21).

Con Claude Code:
```
/modo-jsm-ticket acceso a GitHub team
```

O buscar directo en bash:
```bash
grep -i "github" ~/.claude/skills/modo-jsm-ticket/reference/catalog.md
```

Resultado típico:
```
- **Github - Agregar Usuario a Team**     · sd=24 rt=1577
- **Github - Alta de Usuario**            · sd=24 rt=1146
- **Github - Creación de Team**           · sd=24 rt=1576
- **Github - Eliminar Usuario de Team**   · sd=24 rt=1579
- **Github - Cambio de Miembros en un Grupo** · sd=24 rt=1578
- **Github - Alta de Copilot**            · sd=24 rt=1580
- **ABM de Repositorios de GitHub**       · sd=1  rt=1404
```

Tenés más de un match razonable → el skill te los muestra y te pregunta cuál. Elegís uno.

## Camino B: búsqueda live en el JSM

Si el catálogo puede estar stale (o el form es nuevo), buscás live desde el browser:

```js
// Desde evaluate_script en la página https://play-sistemico.atlassian.net/...
fetch("/rest/servicedeskapi/requesttype?searchQuery=github&limit=20", {
  headers: { "X-ExperimentalApi": "opt-in", "Accept": "application/json" }
}).then(r => r.json())
```

Response: array de `{ id, name, serviceDeskId, ... }`.

> El header `X-ExperimentalApi: opt-in` es **obligatorio** para este endpoint. Sin él, responde HTML/403.

## Referencia rápida: los forms más pedidos

### IT-Solicitudes (HD · sd=1)

| Request type | rt | Cuándo |
|--------------|----|--------|
| ABM de Repositorios de GitHub | 1404 | Crear / archivar / cambiar visibilidad de un repo |
| Acceso a Datadog | 62 | Alta en Datadog desde IT (sin rol específico) |
| Acceso a Amplitude | 165 | Alta en Amplitude |
| 1Password | 71 | Acceso a 1Password desde IT |
| Solicitud de permisos | 31 | Acceso genérico a una herramienta |

### Cyber · Solicitudes IAM (CYBS · sd=24)

| Request type | rt | Cuándo |
|--------------|----|--------|
| Github - Agregar Usuario a Team | 1577 | Sumar alguien a un team existente |
| Github - Creación de Team | 1576 | Team nuevo en la org |
| Github - Eliminar Usuario de Team | 1579 | Dar de baja de un team |
| Github - Alta de Usuario | 1146 | Usuario nuevo en la org GitHub |
| 1Password | 1042 | Alta de usuario en 1Password vía CYBS |
| 1Password - Asignar vaults | 1476 | Dar acceso a un vault existente |
| Datadog - Alta de Usuario | 1144 | Alta con rol en Datadog |
| Datadog - Cambio de Rol | 1570 | Cambiar rol existente en Datadog |
| Licencias de Claude | 3474 | Licencias de Claude Code / API |
| AWS - Alta de Usuario | 1139 | Alta en AWS |
| Amplitude - Alta de usuario | 1107 | Alta en Amplitude vía CYBS |
| API Key | 4706 | **SOLO** para Gemini/Claude — no para otros servicios |

### Cyber · Offensive Security (OFFSEC · sd=192)

| Request type | rt | Cuándo |
|--------------|----|--------|
| Cyber & GRC Hub | 14111 | Consultas / pedidos generales de ciberseguridad |
| Pentesting (WebSec / AppSec / Cloud) | 11620 | Solicitar pentest |
| Security Design Review (Threat Modeling) | 11619 | Threat modeling de un sistema |
| Vulnerability Disclosure | 11623 | Reportar vulnerabilidad |

### Cyber · GRC Solicitudes (ACR · sd=126)

| Request type | rt | Cuándo |
|--------------|----|--------|
| Autoevaluación de Activos | 11579 | — |
| Autoevaluación de Riesgos | 11578 | — |
| Solicitudes de auditoria | 12203 | — |

### Platform-Assistant (PEA · sd=23)

| Request type | rt | Cuándo |
|--------------|----|--------|
| Investigar un problema | 10936 | Problema en plataforma interna |

## Gotchas de selección de form

- **Crear repo** → HD rt=1404, **no** CYBS. CYBS solo tiene team/access (1576, 1577, 1578, 1579, 1580).
- **API Key para Datadog** → **no** usar CYBS rt=4706 (ese form es solo Gemini/Claude). Usar CYBS rt=1144 "Datadog - Alta de Usuario" y aclarar en descripción que es para API key.
- **Acceso a GitHub** ambiguo: ¿alta de usuario en la org? → rt=1146. ¿Agregar a un team? → rt=1577. ¿Crear team? → rt=1576.
- Si el catálogo local no tiene el form → correr `scripts/sync-catalog.sh` antes de concluir que no existe.

## Verificar que el form existe con `get-fields.sh`

Confirmado el `sd` y `rt`, pedile al skill (o corrés vos) el schema del form:

```bash
~/.claude/skills/modo-jsm-ticket/scripts/get-fields.sh 24 1577
```

Si devuelve `requestTypeFields[]` con los campos → el form existe y está activo. Si devuelve 404 o lista vacía → el `rt` puede estar deprecado, buscar alternativa.

---

> Siguiente: [02 · Mapear campos](02-mapear-campos.md)
