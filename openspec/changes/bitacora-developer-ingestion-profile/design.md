# Design: bitácora como perfil de ingesta por developer

## Modelo mental

```
  Developer (autor)                 MODO Govern (consumidor)
  ┌─────────────────┐               ┌──────────────────────────┐
  │ Bitácora Next   │   PULL feeds  │ Adapter "bitácora"        │
  │ (template)      │ ────────────► │ (SPEC-118)                │
  │                 │   ingest.json │   → human-clone (SPEC-110)│
  │ decks/rfcs/rd/  │               │   → knowledge graph (109) │
  │ proyectos/skills│               │   → attribution (111)     │
  └─────────────────┘               └──────────────────────────┘
       1 por dev                         federación N bitácoras
```

La bitácora **no conoce** a Govern (desacople). Govern descubre y poolea. Cada dev
es dueño de su repo/deploy y de qué expone.

## Discovery findings (Fase 1 — verificado contra specs reales de modo-govern)

Leí SPEC-110/111/118 reales (no solo README). Correcciones al diseño inicial:

1. **PULL confirmado.** SPEC-110: workers incrementales (`since last_sync_at`),
   normalizan a common doc schema, redactan, diff→create/update/delete notes. ✅
2. **Consent es 100% Govern-side, NO de la bitácora.** SPEC-111 define `consent_records`
   (append-only; tipos `clone_ingestion/clone_sharing/cross_org_share/training_use/
   export_evidence`; `scope` jsonb; `signature_hash`; revocable; right-to-be-forgotten
   <30d; zero cross-org leakage; `knowledge_acl` squad-level). → **El bloque `consent`
   de `ingest.json` se degrada a hint/default; la autoridad vive en Govern.**
3. **La bitácora es un source más.** `ingestion_sources.source_type` tiene enum
   `'custom'` → la bitácora entra como `custom` (o se agrega `'bitacora'` al enum).
   Se registra con `scope_filters` jsonb + `redaction_rules` jsonb (Govern-side).
4. **El adapter hace el trabajo pesado** (SPEC-118 pattern canónico), no la bitácora.
   La bitácora solo publica manifest + feeds + artefactos (ya lo hace).
5. **content_hash por item**: `skills.json` ya trae `sha256_prefix` → precedente para
   exponer hash por item y habilitar dedup + incremental (SPEC-118 usa content_hash SHA-256).

## Componente 1 — Template por developer

La bitácora Next 16 (de `feat/nextjs-16-migration`) se vuelve un **template**:

- **Config del perfil** (`profile.config.ts` o `bitacora.config.json`): nombre,
  rol, handle GitHub, dominio, secciones habilitadas, defaults de visibilidad.
  Es lo único que cambia entre devs.
- **Contenido**: los feeds JSON + artefactos en `public/`. Propio de cada dev.
- **Código**: idéntico entre devs (el del template). Updates del template se
  propagan por merge/sync, no por copy.

Instanciación: fork del repo template → editar config → publicar contenido →
deploy. (Mecanismo exacto — fork vs `create-bitacora` CLI vs GitHub template repo
— se decide en tasks; default GitHub template repo por simpleza.)

## Componente 2 — Contrato de ingesta

### `ingest.json` (raíz del sitio, público)
Manifest discoverable que Govern lee primero. Propuesta de schema:

```jsonc
{
  "schema_version": "1.0",
  "developer": { "id": "hernan-desouza", "name": "Hernán De Souza", "role": "Sr AI Engineer", "github": "SoyErnoModo" },
  "generated_at": "2026-05-27T00:00:00Z",
  "base_url": "https://<dominio-del-dev>",
  "sections": [
    { "type": "decks",  "feed": "/decks/decks.json",   "key": "decks",  "count": 19, "visibility": "public" },
    { "type": "rfcs",   "feed": "/rfcs/rfcs.json",     "key": "rfcs",   "count": 20, "visibility": "org" },
    { "type": "rd",     "feed": "/rd/rd.json",         "key": "items",  "count": 3,  "visibility": "public" },
    { "type": "skills", "feed": "/skills/skills.json", "key": "skills", "count": 24, "visibility": "public" }
  ],
  "consent": { "ingestion": true, "granted_at": "2026-05-27", "scope": "org-clone" }
}
```

Ventaja: Govern no hardcodea rutas/keys (recordar el gotcha `rd.json`→key `items`).
El manifest declara key y visibilidad por sección. Discovery por convención:
`GET <base_url>/ingest.json`.

**Contrato por item (en cada feed)** — para habilitar el adapter SPEC-118:
- `content_hash` (SHA-256 del artefacto) → dedup + diff vs `source_documents`.
  `skills.json` ya trae `sha256_prefix`; extender a todos los feeds.
- `updated_at` → incremental (`updated_at > last_sync_at`, equivalente al
  `last_edited_time` de Notion en SPEC-118).
- `artifact_url` (o el `href` ya existente, absoluto) → el adapter fetchea el HTML
  completo y lo pasa por `markdownConverter` (HTML→MD), no solo el summary del feed.
- `visibility` por item (override del default de sección).

El `consent` block del manifest queda como **hint/default**, no autoridad — el
consentimiento real es `consent_records` en Govern (ver Discovery #2).

### Versionado
`schema_version` en el manifest. Cambios breaking del schema → bump mayor. Govern
soporta N versiones del adapter.

## Componente 3 — Atribución y privacidad (SPEC-111)

- **Visibilidad por sección y por item**: `public` (cualquiera) · `org` (solo MODO,
  fetch autenticado) · `private` (no se expone, no se ingesta).
- **Dos superficies**: feed público (filtrado a `public`) servido abierto; feed
  `org` servido detrás de token (Vercel: header check en route handler, o feed
  separado en path autenticado).
- **Consent explícito**: bloque `consent` en `ingest.json`. Sin `ingestion:true`,
  Govern no ingesta aunque los feeds sean públicos. El dev lo togglea desde su config.
- **Atribución preservada**: cada item ingestado lleva `developer.id` + URL fuente →
  el clon cita de dónde viene el conocimiento (cierra con SPEC-111 runtime SPEC-117).

## Componente 4 — Federación (SPEC-109)

Govern mantiene un registro de bitácoras (`developer.id` → `base_url`). Poolea cada
`ingest.json`, ingesta las secciones permitidas, arma el knowledge graph org
cruzando wikilinks/topics/tags entre bitácoras de distintos devs.

Registro: ¿lista curada en Govern, o auto-registro vía la página Consent de Govern?
→ open question, default lista curada en Govern (control + evita spam).

## Componente 5 — Adapter `ingest-bitacora` (lado Govern, SPEC-118)

Edge function en modo-govern siguiendo el pattern canónico (otro repo/change):

```
1. Validate auth + source_id (ingestion_sources, source_type='custom'/'bitacora')
2. Verify consent (consent_records: clone_ingestion granted)
3. GET <base_url>/ingest.json → secciones permitidas por scope_filters
4. Para cada item de cada feed permitido:
   a. Fetch artifact_url (HTML) + metadata del feed
   b. markdownConverter(HTML → MD)        [shared block SPEC-118]
   c. redactor(MD) → PII/secrets fuera    [shared block SPEC-118]
   d. content_hash → dedup vs source_documents (skip si igual)
   e. upsert source_documents → knowledge_notes (note_type mapping ↓)
   f. wikilinkExtractor → knowledge_links
5. ingestion_runs completed + last_sync_at + evidence event (SPEC-107)
```

**Mapping sección → note_type** (note_types de SPEC-109/110: literature, permanent,
project, meeting, decision):

| Sección bitácora | note_type | Razón |
|---|---|---|
| decks | literature | presentación curada, no atómica |
| rfcs | decision | una RFC = una decisión técnica |
| rd | literature / permanent | investigación; permanent si es conocimiento durable |
| proyectos | project | repos/contribuciones |
| skills | permanent | conocimiento reusable codificado |

**`scope_filters` para este source** (Govern-side):
```json
{ "base_url": "https://<dominio-dev>", "sections": ["decks","rfcs","rd","skills"], "visibility": ["public","org"] }
```

División de labor: **bitácora = publicar** (manifest+feeds+artefactos, ya existe);
**Govern = ingestar** (adapter + consent + redaction + graph + atribución).

## Trade-offs

| Decisión | A favor | En contra |
|---|---|---|
| Template-por-dev (vs multi-tenant) | Ownership claro, desacople, cada dev autónomo | Updates del template hay que propagarlos; no hay vista cross-dev nativa (la da Govern) |
| PULL (vs PUSH) | Bitácora no depende de Govern; Govern controla cadencia | Latencia de ingesta = intervalo de poll; Govern debe descubrir cada bitácora |
| `ingest.json` declarativo | Govern no hardcodea schema; versionable | Un artefacto más que mantener por bitácora (generable del build) |

## Gotchas / riesgos
- **Schema drift entre devs**: si cada uno toca el template, los feeds divergen.
  Mitigar: el `ingest.json` + schema versionado son contrato; CI del template valida.
- **Privacidad**: feed `org` público por error = leak de conocimiento interno. El
  default de visibilidad debe ser conservador (`org`, no `public`) y el build debe
  fallar si un item marcado `private` aparece en el feed público.
- **Atribución perdida**: si Govern ingesta sin guardar la fuente, el clon no cita.
  Contrato obliga `developer.id` + source URL por item.
- **Specs verificados** (Discovery Fase 1): SPEC-110/111/118 leídos. Status real de
  los 3 = 📝 **Draft** (no implementados todavía) → el adapter `ingest-bitacora` no
  se puede construir hasta que SPEC-110/118 estén shipeados en Govern. Dependencia dura.
