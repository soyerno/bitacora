# PULL Adapter Mapping — bitacora-mcp → modo-govern

## Purpose

Documents the mapping between fields exposed by `get_ingest_profile` (schema `ingest-profile/v1.0.0.json`) and the PULL adapter contract defined in modo-govern SPEC-110, SPEC-111, and SPEC-118. This is the bridge between the bitácora-as-knowledge-base output and the human-clone runtime input.

**Status of upstream specs**: SPEC-110, SPEC-111, SPEC-118 are currently in **Draft** state in modo-govern (per `reference_bitacora_developer_ingestion_profile`, 2026-05-27). This mapping is therefore **provisional** and will be revisited once those specs are promoted to Stable. The provisional mapping is captured here so design work can proceed without blocking on upstream stabilization.

## Convention

For each PULL adapter field, the table below records:
- **PULL field** — name as it appears in the SPEC-110/111/118 draft (or expected name).
- **Type** — expected datatype.
- **bitacora-mcp source** — JSON Pointer into `get_ingest_profile` output.
- **Notes** — transformations, defaults, deferrals.

When a PULL field has no current equivalent in MVP, the row is marked `not_applicable_for_mvp` with a brief reason.

## Mapping Table

### Identity

| PULL field | Type | bitacora-mcp source | Notes |
|------------|------|---------------------|-------|
| `subject.id` | string | `/identity/github_id` | GitHub numeric ID. Stable across renames. |
| `subject.display_name` | string | `/identity/display_name` | From `data/owner-profile.json` override; falls back to GitHub `name`. |
| `subject.canonical_handle` | string | `/identity/github_login` | `SoyErnoModo` for MVP. |
| `subject.bio` | string | `/identity/bio` | Free text. |
| `subject.pronouns` | string \| null | `/identity/pronouns` | Optional. |
| `subject.timezone` | string (IANA) | `/identity/timezone` | e.g., `America/Argentina/Buenos_Aires`. |
| `subject.roles[]` | string[] | `/identity/roles` | E.g., `["Sr AI Engineer", "MODO"]`. |
| `subject.languages[]` | string[] | derived from `/voice/language` | MVP emits `["es-AR"]` if `voice.language === "es-AR"`. |

### Voice & Communication Style

| PULL field | Type | bitacora-mcp source | Notes |
|------------|------|---------------------|-------|
| `voice.primary_language` | string (BCP-47) | `/voice/language` | |
| `voice.register` | string | `/voice/register` | E.g., `voseo-rioplatense`. |
| `voice.forbidden_phrases[]` | string[] | `/voice/forbidden_phrases` | E.g., `["apetito"]`. |
| `voice.preferred_phrases[]` | string[] | `/voice/preferred_phrases` | E.g., `["aguardo feedback"]`. |
| `voice.tone_hints[]` | string[] | derived from `voice/behavioral_rules` whose `applies_when` mentions tone | Computed in profile-loader. |

### Behavioral Rules

| PULL field | Type | bitacora-mcp source | Notes |
|------------|------|---------------------|-------|
| `behavior.rules[].id` | string | `/behavioral_rules/N/id` | Stable slug. |
| `behavior.rules[].directive` | string | `/behavioral_rules/N/rule` | One-sentence rule. |
| `behavior.rules[].rationale` | string | `/behavioral_rules/N/why` | RFC 2119 style not required here. |
| `behavior.rules[].trigger` | string | `/behavioral_rules/N/applies_when` | Free-text condition. |
| `behavior.rules[].source_url` | string \| null | derived: link to the corresponding `feedback_*.md` memory if exposed | Likely `not_applicable_for_mvp` because memory files stay local. |

### Knowledge Artifacts

| PULL field | Type | bitacora-mcp source | Notes |
|------------|------|---------------------|-------|
| `knowledge.decks[].slug` | string | `/artifacts/decks/N/slug` | |
| `knowledge.decks[].title` | string | `/artifacts/decks/N/title` | |
| `knowledge.decks[].state` | string | `/artifacts/decks/N/state` | `draft` \| `rfc` \| `completo`. |
| `knowledge.decks[].tags[]` | string[] | `/artifacts/decks/N/tags` | |
| `knowledge.decks[].summary` | string | `/artifacts/decks/N/summary` | |
| `knowledge.decks[].read_uri` | string | `/artifacts/decks/N/read_resource_uri` | MCP resource URI for full content. |
| `knowledge.decks[].published_at` | string (ISO 8601) | `/artifacts/decks/N/published_at` | |
| `knowledge.decks[].source_url` | string | `/artifacts/decks/N/source_url` | Public URL on erno-modo. |
| `knowledge.rfcs[]` | same shape | `/artifacts/rfcs` | Identical structure. |
| `knowledge.skills[]` | same shape | `/artifacts/skills` | Identical structure. |
| `knowledge.posts[]` | same shape | `/artifacts/posts` | Identical structure. |

### Provenance

| PULL field | Type | bitacora-mcp source | Notes |
|------------|------|---------------------|-------|
| `provenance.generated_at` | string (ISO 8601 UTC) | `/generated_at` | |
| `provenance.source_commit` | string (40-hex) | `/source_commit` | erno-modo `main` SHA at time of generation. |
| `provenance.cache_freshness_seconds` | integer | `/cache_freshness_seconds` | ≤ 300. |
| `provenance.schema_version` | string (semver) | `/schema_version` | `1.0.0` at MVP. |
| `provenance.issuer` | string (URL) | constant `https://bitacora.konsor.com.ar` | Set by the server in the response. |

### Deferred (`not_applicable_for_mvp`)

| PULL field | Reason |
|------------|--------|
| `subject.org_memberships[]` | MVP single-tenant; org context not modeled. Fase 2. |
| `behavior.rules[].source_url` | Memory files are local and not exposed. Fase 2 may expose redacted excerpts. |
| `knowledge.private_artifacts[]` | All erno-modo content is public; no private bucket. Fase 2. |
| `interaction_history.recent_sessions[]` | Out of scope — this MCP does not log Claude sessions. Belongs to a separate adapter. |
| `relationships[]` (mentors, teammates) | No graph data in MVP. Fase 2 may emit from GitHub follows or curated list. |

## Compatibility Verification

Two layers:

1. **Static documentation check** (MVP): this file is committed and reviewed when the modo-govern SPEC-110/111/118 drafts are promoted to Stable. Any divergence triggers a `MODIFIED Requirements` entry in `specs/ingest-profile/spec.md`.
2. **Automated schema validation** (when schema artifact is published): the modo-govern project publishes a JSON Schema artifact for the PULL adapter input. A CI job in `bitacora-mcp` validates the live `get_ingest_profile` output against that schema. Validation failures block the build.

Until layer 2 exists, layer 1 is the contract.

## Open Items

- [ ] Confirm exact PULL field names with the SPEC-110/111/118 owner. Names above are placeholders matching the documented intent; the actual spec may use different casing/path structure.
- [ ] Confirm whether `behavior.rules[].trigger` is a free-text field or a structured event taxonomy.
- [ ] Confirm whether the modo-govern adapter accepts `read_uri` as a callable MCP URI or expects inlined content.
