# Ingest Profile Specification

## Purpose

Defines the shape and semantics of the ingestion profile returned by `get_ingest_profile`. The profile is the canonical export of one developer's bitácora-as-knowledge-base — designed to be consumed by the modo-govern human-clone runtime as a PULL adapter input, per SPEC-110/111/118.

The profile MUST be self-contained: a downstream consumer that only has the profile JSON MUST be able to reconstruct a faithful first-person knowledge representation without further upstream calls.

## Requirements

### Requirement: Versioned Profile Schema

The profile MUST include a top-level `schema_version` field with semantic versioning. MVP MUST emit `schema_version: "1.0.0"`. Breaking schema changes MUST bump the major version.

#### Scenario: Profile carries schema version

- GIVEN a successful `get_ingest_profile` call
- WHEN the response is inspected
- THEN the document MUST include `schema_version: "1.0.0"` at the top level

#### Scenario: Major-version upgrade is backwards-compatible at endpoint level

- GIVEN a future schema version `2.0.0` is released
- WHEN a client requests `format: "json"` with header `Accept-Schema-Version: 1`
- THEN the server MUST still serve the `1.0.0` shape until that version is sunset
- AND the deprecation MUST be announced via the `deprecated_at` metadata field

### Requirement: Identity Block

The profile MUST include an `identity` object with `github_id`, `github_login`, `display_name`, `bio`, `pronouns` (optional), `timezone`, and `roles[]`. Values MUST be sourced from the authenticated GitHub user plus optional overrides in a server-side profile file.

#### Scenario: Identity block is populated

- GIVEN a successful `get_ingest_profile` call
- WHEN the response is inspected
- THEN `identity.github_id` MUST equal the JWT `sub`
- AND `identity.github_login` MUST equal `SoyErnoModo` for MVP
- AND `identity.display_name`, `identity.bio`, `identity.timezone`, and `identity.roles[]` MUST be present (may be empty strings or empty arrays when no data is available)

### Requirement: Knowledge Artifacts Inventory

The profile MUST include `artifacts.decks[]`, `artifacts.rfcs[]`, `artifacts.skills[]`, and `artifacts.posts[]`. Each entry MUST contain `slug`, `title`, `state`, `published_at`, `tags[]`, `summary`, `source_url`, and optional `read_resource_uri` (e.g., `bitacora://decks/<slug>`).

#### Scenario: Artifact catalog is complete

- GIVEN the upstream manifests contain N decks, M RFCs, K skills
- WHEN `get_ingest_profile` is invoked
- THEN `artifacts.decks` MUST contain N entries
- AND `artifacts.rfcs` MUST contain M entries
- AND `artifacts.skills` MUST contain K entries

#### Scenario: Each artifact entry includes a read URI

- GIVEN any artifact entry in the profile
- WHEN inspected
- THEN the entry MUST include a `read_resource_uri` value of the form `bitacora://<type>/<slug>`

### Requirement: Voice and Tone Hints

The profile MUST include a `voice` block with `language` (BCP 47, e.g., `es-AR`), `register` (e.g., `voseo-rioplatense`), `forbidden_phrases[]` (e.g., `["apetito", "si hay apetito"]`), and `preferred_phrases[]` (e.g., `["aguardo feedback"]`). Values MUST be sourced from the user's documented voice rules.

#### Scenario: Voice block is present

- GIVEN a successful call
- WHEN the response is inspected
- THEN `voice.language` MUST equal `es-AR`
- AND `voice.register` MUST be present
- AND `voice.forbidden_phrases[]` MUST contain at least `"apetito"`

### Requirement: Behavioral Rules Block

The profile MUST include a `behavioral_rules[]` array, each entry containing `id`, `rule` (one-sentence directive), `why` (rationale), `applies_when` (trigger condition). Rules MUST be sourced from the user's `feedback_*.md` memory files when available.

#### Scenario: Rules carry rationale

- GIVEN any behavioral rule entry
- WHEN inspected
- THEN it MUST include non-empty `rule`, `why`, and `applies_when` fields

### Requirement: PULL Adapter Compatibility

The profile MUST be compatible with the modo-govern PULL adapter pattern defined in SPEC-110, SPEC-111, and SPEC-118. Compatibility MUST be validated by either (a) a documented mapping table in `openspec/changes/bitacora-mcp/design.md` or (b) an automated schema check against the modo-govern schema artifact when published.

#### Scenario: Compatibility documented

- GIVEN the change folder
- WHEN the design phase completes
- THEN a `pull-adapter-mapping.md` (or section within `design.md`) MUST exist mapping each modo-govern PULL adapter field to a profile field or marking it as `not_applicable_for_mvp`

#### Scenario: Schema validation runs in CI when available

- GIVEN the modo-govern schema artifact is published as a JSON Schema file
- WHEN the CI pipeline runs
- THEN a validation job MUST validate the live `get_ingest_profile` output against that schema
- AND the job MUST fail the build on validation errors

### Requirement: Generated-At Timestamp and Provenance

The profile MUST include `generated_at` (ISO 8601 UTC), `source_commit` (the latest commit SHA of the erno-modo repo from which content was fetched), and `cache_freshness_seconds` describing how stale the underlying content snapshot is.

#### Scenario: Provenance fields are populated

- GIVEN a successful `get_ingest_profile` call
- WHEN the response is inspected
- THEN `generated_at` MUST be a valid ISO 8601 UTC timestamp within the last 10 seconds
- AND `source_commit` MUST be a 40-character hex SHA
- AND `cache_freshness_seconds` MUST be a non-negative integer ≤ 300

### Requirement: Markdown Rendering

When `format: "markdown"` is requested, the server MUST render the profile as a human-readable markdown document with stable section ordering: identity → voice → behavioral rules → artifacts (grouped by type) → provenance.

#### Scenario: Markdown profile renders all sections

- GIVEN `get_ingest_profile({format: "markdown"})`
- WHEN the response is inspected
- THEN the markdown MUST contain top-level headings for "Identity", "Voice", "Behavioral Rules", "Artifacts", and "Provenance"
- AND the section order MUST match the order above
