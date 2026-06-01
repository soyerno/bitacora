# RFC · Auto-sync de rfcs.json desde Google Drive

- **ID**: R19
- **Estado**: draft
- **Fecha**: 2026-05-20
- **Autor**: Hernán De Souza
- **Equipos que opinan antes de avanzar**: TL frontend, PM modo-landing, Manager

---

## Contexto

`modo-decks` ahora lista 18 RFCs vivos en Google Drive. El catálogo está curado a mano en [rfcs/rfcs.json](./rfcs.json) y renderizado en [index.html](../index.html) con filtros por estado (rfc / completo / archivado / draft).

El listado es estático: cada vez que agrego un RFC nuevo a Drive tengo que abrir el repo, copiar metadata, deduplicar versiones, redactar la descripción y commitear. Eso se va a romper rápido — ya tenemos la saga "Migración modo-landing" con 14 versiones, y cada RFC nuevo suma fricción.

## Problema

1. **Fricción manual**: agregar un RFC nuevo requiere 3-5 min de copia-pega + redacción.
2. **Drift inevitable**: olvidé tres RFCs viejos que tuve que redescubrir buscando en Drive. El catálogo nunca va a estar 100% sincronizado si depende de mi memoria.
3. **Versionado caótico**: la saga modo-landing colapsó 14 versiones en una sola entrada manualmente. Cada vez que agrego una versión nueva al hilo, hay que reabrir el JSON y reordenar.
4. **Descripciones inconsistentes**: cada entrada tiene una frase resumen escrita por mí en momentos distintos, sin guía de voz centralizada.

## Propuesta

Dos opciones, no excluyentes:

### Opción A · Script Python (`scripts/sync-rfcs.py`)

Script standalone que:

1. Lee Drive vía `googleapis` o el MCP `claude_ai_Google_Drive` (server-side con service account).
2. Filtra por `title contains 'RFC'` + `owner = 'me'`.
3. Deduplica por título conceptual (regex que normaliza versiones: `v1/v2/v3/v6/clean/modularizada`).
4. Genera summary por RFC vía LLM (Claude Haiku) consumiendo los primeros 4KB del doc — voz rioplatense, sin emojis, una claim por oración.
5. Mergea con overrides manuales en `rfcs/overrides.json` (status, tags, area — los que el LLM no puede inferir bien).
6. Escribe `rfcs/rfcs.json` y opcionalmente actualiza el HTML.

**Pros**: corre en CI sin Claude Code. Determinístico. Versionable.
**Contras**: requiere service account Drive + tokens en CI. Mantenimiento del script.

### Opción B · Skill Claude Code `/modo-rfc-sync`

Skill MODO-específico en `~/.claude/skills/modo-rfc-sync/` que:

1. Lanza el skill desde cualquier ventana de Claude Code.
2. Usa las tools de Drive ya configuradas (con mi auth de usuario).
3. Reusa la curation logic (deduplicación + LLM summarization) inline en el skill.
4. Genera el JSON + edita HTML/README con Edit tools.
5. Commitea + pushea automáticamente (workflow `feat(RFCS): sync 2026-XX-XX`).

**Pros**: cero infra, usa la auth que ya tengo. Itera rápido.
**Contras**: solo corre desde Claude Code. No automatizable vía cron sin headless mode.

### Recomendación

**Empezar con Opción B** (skill `/modo-rfc-sync`). Es bajo costo, prueba la lógica de curation rápido, y si después quiero correrlo en CI lo migro a Python con la lógica ya validada.

## Schema esperado (`rfcs/rfcs.json` v2)

```json
{
  "_meta": {
    "generated": "ISO date",
    "source": "Google Drive",
    "deduped": true,
    "schema_version": 2
  },
  "rfcs": [
    {
      "number": "R01",
      "slug": "kebab-case",
      "title": "Título limpio",
      "summary": "Una oración rioplatense.",
      "status": "draft | rfc | completo | archivado",
      "tags": ["max", "3"],
      "area": "frontend | backend | sre | product | geo-seo | ai-agents | infra | tooling | misc",
      "date": "YYYY-MM-DD",
      "source": {
        "type": "drive | repo",
        "url": "https://..."
      },
      "deck": "decks/.../slug.html",
      "versions": [
        { "label": "vN", "url": "...", "date": "YYYY-MM-DD" }
      ]
    }
  ]
}
```

Cambio respecto a v1: campo `drive_url` se reemplaza por `source: { type, url }` para soportar RFCs que viven en el repo (markdown) además de Drive.

## Implementación (skill)

Estructura `~/.claude/skills/modo-rfc-sync/`:

```
SKILL.md              # trigger + workflow
scripts/
  fetch-drive.sh      # lista RFCs vía MCP Drive
  dedupe.py           # normaliza versiones, agrupa
  summarize.py        # llama Claude Haiku para summary
manifest.json         # workspace mapping (modo-decks repo path)
```

Trigger: `/modo-rfc-sync` o auto-invoke en frases como "actualizá el catálogo de RFCs", "sumá esta RFC al modo-decks", "sincronizá rfcs.json".

Salida esperada por corrida:
- Diff de `rfcs/rfcs.json` (Edit con Read previo)
- Update de counts en `index.html` (tabs: Todos/Draft/RFC/Completo/Archivado)
- Commit `feat(RFCS-sync): + N entradas, ~ M updates` en branch dedicada
- Optional: open PR si la diff supera N entradas (umbral configurable)

## Riesgos

1. **Falsos positivos en dedupe**: la saga modo-landing fue obvia, pero RFCs futuros con títulos cercanos podrían colapsarse mal. Mitigación: `overrides.json` con `force_distinct: ["slug-a", "slug-b"]`.
2. **Summaries inconsistentes**: Claude Haiku puede salirse de voz rioplatense. Mitigación: prompt fijo con 3 ejemplos del catálogo actual + check post-hoc por largo de oración + ausencia de buzzwords.
3. **Drive auth scope creep**: el script va a tener acceso de lectura completo al Drive. Mitigación: filtrar por carpeta específica (`parentId = '0AL9Kzf5BHE7PUk9PVA'` que ya usan todos los RFCs míos).
4. **Drift entre `rfcs.json` y el HTML**: si el HTML deja de regenerarse desde el JSON, vuelve el problema original. Mitigación: el skill SIEMPRE regenera ambos a partir del JSON; el HTML es derivado.

## Equipos que opinan antes de avanzar

- **TL frontend** (Hernán): ¿OK tener el HTML auto-generado? ¿Movemos el catálogo a un template + data source?
- **PM modo-landing**: ¿hay otros docs (specs, decks) que también valdría la pena sumar al catálogo?
- **Manager**: ¿prioridad? Esto es maduración interna, no afecta usuario final.

## Próximos pasos si se aprueba

1. Spike de 1 día: prototipo del skill `/modo-rfc-sync` que ya regenere el catálogo actual sin perder data.
2. Validar dedupe en saga modo-landing (caso límite).
3. Validar summaries Haiku vs descripciones actuales hechas a mano.
4. Si pasa, mover a skill estable + agregar al README de modo-decks como workflow operativo.
