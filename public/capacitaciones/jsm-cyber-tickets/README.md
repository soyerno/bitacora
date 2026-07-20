# Capacitación · Armar tickets en el JSM de MODO (Cyber/IAM incluido)

> **Harness = agente.** Este curso se hace **con Claude Code abierto**, usando el skill `modo-jsm-ticket`. Cada paso tiene un payload real que podés copiar, parametrizar y — con confirmación tuya — crear en el portal.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## Para quién

Dev, QA, analyst o moder que necesite abrir tickets en el JSM de MODO: accesos, GitHub teams, 1Password, Cyber/IAM, OFFSEC, repos, o cualquiera de los 29 service desks catalogados. No necesitás saber de APIs ni de Jira internals.

## Qué vas a saber hacer al terminar

1. Encontrar el service desk y request type correcto en los 29 desks / 318 forms.
2. Mapear los campos requeridos sin inventar valores ni `customfield_*` IDs.
3. Armar el JSON payload completo y verificarlo antes de POSTear.
4. Crear el ticket vía REST API (browser session o API token) con confirmación explícita.
5. Entender los casos Cyber/IAM más comunes: GitHub team, 1Password, GRC Hub, repos ABM, PEA.
6. Darle seguimiento: URL del portal, SLA, estado, comentarios.

## Learning path

| # | Lección | Skill harness | Qué cubrís |
|---|---------|---------------|------------|
| 00 | [El JSM de MODO](00-el-jsm-modo.md) | `modo-jsm-ticket` | Portal, 29 desks, 318 forms, cuándo ticket vs PR |
| 01 | [Descubrir el portal](01-descubrir-portal.md) | `modo-jsm-ticket` | Buscar service desk + request type; sd/rt IDs |
| 02 | [Mapear campos](02-mapear-campos.md) | `modo-jsm-ticket` | Schema de campos, aprobador obligatorio, no inventar |
| 03 | [Payload + POST](03-payload-post.md) | `modo-jsm-ticket` | Armar el JSON, confirmar, POSTear vía REST |
| 04 | [Casos canónicos](04-casos-canonicos.md) | `modo-jsm-ticket` | GitHub team, 1Password, GRC Hub, repos ABM, PEA |
| 05 | [Confirmación + tracking](05-confirmacion-tracking.md) | `modo-jsm-ticket` | Preview obligatorio, URL del portal, seguimiento SLA |
| 🧪 | [Lab: armar un ticket](exercises/README.md) | todos | Ejercicio integrador · GitHub team access · dry-run |

## Atajo: el agente

Con Claude Code abierto, escribís:

```
/modo-jsm-ticket acceso a GitHub team modo-landing-dev para juan@modo.com.ar
```

El skill busca en el catálogo, fetchea el schema del form, te pregunta los campos que faltan y muestra el payload para tu confirmación antes de crear nada.

## Reglas del skill que el curso respeta

> **Nunca POSTear sin confirmación explícita.** Preview siempre.

- `customfield_*` IDs no se hardcodean — fetch en runtime desde el form schema.
- Campos de tipo `option` → usar el `id` del `validValues`, no el `value` string.
- Campos `user` → resolver `accountId` vía `lookupJiraAccountId`, no poner email directo.
- Fechas en el portal: formato `D/mmm/YY` (ej. `2/jun/26`) para evitar ambigüedad MM/DD.
- Voz rioplatense en `summary` y `description`. Sin buzzwords.

> Empezá por [00 · El JSM de MODO](00-el-jsm-modo.md).
