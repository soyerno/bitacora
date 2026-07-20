# Lab · Armar un ticket de GitHub team access

> Ejercicio integrador. Objetivo: construir el payload completo para agregar un usuario a un GitHub team, en modo **dry-run** (sin POST real), usando el skill `modo-jsm-ticket`.

---

## Escenario

Nuevo dev en el equipo de frontend. Necesitás que tenga acceso al GitHub team `modo-landing-dev` en la org `playsistemico`.

- **Beneficiario**: `nuevo.dev@modo.com.ar`
- **Team target**: `modo-landing-dev`
- **Aprobador**: tu manager directo (o quien corresponda en tu equipo — usá su email real)
- **Objetivo**: construir el JSON payload correcto para `POST /rest/servicedeskapi/request` sin crear el ticket todavía.

---

## Paso 1 · Identificar el service desk y request type

Sin mirar la solución abajo, buscá en el catálogo:

```bash
grep -i "github.*team\|team.*github" \
  ~/.claude/skills/modo-jsm-ticket/reference/catalog.md
```

O con el skill:

```
/modo-jsm-ticket agregar usuario a GitHub team
```

- [ ] ¿Cuál es el `sd`? ___
- [ ] ¿Cuál es el `rt` para "Agregar Usuario a Team"? ___
- [ ] ¿Cuál es la URL del portal para ese form? ___

---

## Paso 2 · Fetchear el schema de campos

Con el `sd` y `rt` que encontraste:

```bash
# API token
EMAIL=$(cat ~/.atlassian/email)
TOKEN=$(cat ~/.atlassian/jsm-token)
curl -sS -u "$EMAIL:$TOKEN" \
  "https://play-sistemico.atlassian.net/rest/servicedeskapi/servicedesk/<sd>/requesttype/<rt>/field" \
  -H "Accept: application/json" | jq '.requestTypeFields[] | { fieldId, name, required }'
```

O con browser session desde Claude Code:

```
/modo-jsm-ticket fetch fields sd=<sd> rt=<rt>
```

- [ ] Listá los campos con `required: true`: ___
- [ ] ¿Hay algún campo de tipo `user`? ¿Cuál? ___
- [ ] ¿Hay algún campo de tipo `option`? ¿Cuál? ___

---

## Paso 3 · Resolver los `accountId`

Para el beneficiario y el aprobador necesitás sus `accountId` reales (no el email).

Con MCP Atlassian (desde Claude Code):
```
mcp__claude_ai_Atlassian__lookupJiraAccountId  →  emailAddress: "nuevo.dev@modo.com.ar"
mcp__claude_ai_Atlassian__lookupJiraAccountId  →  emailAddress: "manager@modo.com.ar"
```

- [ ] `accountId` del beneficiario: `557058:___`
- [ ] `accountId` del aprobador: `557058:___`

> Si no tenés acceso al MCP Atlassian en este momento, usá placeholders `ACCOUNT_ID_BENEFICIARIO` y `ACCOUNT_ID_APROBADOR` para el dry-run.

---

## Paso 4 · Armar el payload (dry-run)

Completá el JSON con los valores reales que obtuviste:

```json
{
  "serviceDeskId": "___",
  "requestTypeId": "___",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev — Nuevo Dev",
    "description": "...",
    "CUSTOMFIELD_DEL_TEAM": "modo-landing-dev",
    "CUSTOMFIELD_DEL_USUARIO": { "accountId": "ACCOUNT_ID_BENEFICIARIO" },
    "CUSTOMFIELD_DEL_APROBADOR": { "accountId": "ACCOUNT_ID_APROBADOR" }
  }
}
```

- [ ] Los `customfield_*` son los del schema real (no copiados de otra fuente)
- [ ] El `summary` es claro y describe el pedido en una línea
- [ ] La `description` incluye contexto: equipo, razón, repo o proyecto

---

## Paso 5 · Preview (sin POST)

Pasale el payload al skill para que lo revise:

```
/modo-jsm-ticket preview sd=24 rt=1577 <pega el JSON>
```

El skill debería mostrarte el preview y preguntar confirmación. **No confirmes** — este es el lab, no el ticket real.

- [ ] El preview muestra todos los campos requeridos
- [ ] No hay `customfield_*` inventados
- [ ] Los `accountId`s son los correctos (o los placeholders del dry-run)
- [ ] La URL del portal está incluida en el preview

---

## Checklist final del lab

- [ ] Encontré el service desk correcto (sd=24 · CYBS) y el request type correcto (rt=1577)
- [ ] Fetcheé el schema del form y listé los campos con `required: true`
- [ ] Resolví los `accountId` del beneficiario y el aprobador (o usé placeholders)
- [ ] Armé el JSON payload con los `customfield_*` reales del schema
- [ ] El skill mostró el preview sin errores
- [ ] **No POSTeé** — dry-run completo

---

## Solución de referencia (spoiler)

<details>
<summary>Ver solución (no mirar antes de terminar)</summary>

**sd=24 rt=1577** · Github - Agregar Usuario a Team

Los `customfield_*` exactos los obtenés solo del schema del form en runtime (cambian). Lo que SÍ podés hardcodear:

```json
{
  "serviceDeskId": "24",
  "requestTypeId": "1577",
  "requestFieldValues": {
    "summary": "Agregar a modo-landing-dev — Nuevo Dev",
    "description": "Incorporación al GitHub team modo-landing-dev para acceso a repos del squad frontend. Sprint de junio 2026.",
    "<fieldId_team>": "modo-landing-dev",
    "<fieldId_usuario>": { "accountId": "<accountId_del_beneficiario>" },
    "<fieldId_aprobador>": { "accountId": "<accountId_del_aprobador>" }
  }
}
```

URL del portal:
```
https://play-sistemico.atlassian.net/servicedesk/customer/portal/24/group/-1/create/1577
```

Casos relacionados si el usuario no es miembro de la org GitHub todavía:
- Primero: sd=24 rt=1146 (Github - Alta de Usuario)
- Después: sd=24 rt=1577 (Agregar Usuario a Team)

</details>

---

> Volvé al [README del curso](#intro)
