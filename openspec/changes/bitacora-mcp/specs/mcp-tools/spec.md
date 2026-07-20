# MCP Tools Specification

## Purpose

Defines the six MCP tools and four resource trees exposed by the bitácora MCP server. All tools and resources MUST be available to authenticated requests carrying a valid bearer token whose `sub` matches the authorized user. The tool catalog MUST be discoverable via the standard MCP `tools/list` and `resources/list` methods.

## Requirements

### Requirement: Tool Catalog Discovery

The server MUST respond to MCP `tools/list` with the catalog of all six tools, each entry containing `name`, `description`, and `inputSchema` as JSON Schema.

#### Scenario: Authenticated client lists tools

- GIVEN an authenticated MCP session
- WHEN the client invokes `tools/list`
- THEN the response MUST include exactly six tools: `read_post`, `search`, `list_decks`, `list_rfcs`, `list_skills`, `get_ingest_profile`
- AND each tool entry MUST include a valid `inputSchema` JSON Schema

#### Scenario: Unauthenticated client cannot list tools

- GIVEN no bearer token in the request
- WHEN the client invokes `tools/list`
- THEN the response status MUST be 401

### Requirement: `read_post` Tool

The `read_post(slug: string)` tool MUST return the content of a single bitácora post identified by slug. Returned content MUST be sanitized (see `content-pipeline` spec).

#### Scenario: Reading an existing post returns content

- GIVEN a slug `accesibilidad-lectura-asistida-tdah` corresponding to an existing deck or post
- WHEN `read_post({slug: "accesibilidad-lectura-asistida-tdah"})` is invoked
- THEN the response MUST include `content` (sanitized markdown or HTML), `title`, `type` (`deck` | `rfc` | `skill` | `post`), `published_at` (ISO 8601), and `source_url`
- AND the response MUST NOT include any HTML `<script>` tag

#### Scenario: Reading an unknown slug returns structured error

- GIVEN a slug that does not correspond to any indexed content
- WHEN `read_post({slug: "does-not-exist"})` is invoked
- THEN the response MUST include `error: "not_found"` and a human-readable `message`
- AND the response MUST NOT include any partial content

#### Scenario: Reading with invalid slug shape is rejected

- GIVEN a slug containing path traversal characters (`..`, `/`, `\`)
- WHEN `read_post` is invoked
- THEN the response MUST include `error: "invalid_input"`
- AND no upstream fetch MUST occur

### Requirement: `search` Tool

The `search(query: string, type?: string, limit?: number)` tool MUST perform a case-insensitive substring search across titles, descriptions, and tags of all indexed content. The optional `type` filter MUST accept one of `deck`, `rfc`, `skill`, `post`. The optional `limit` MUST default to 20 and cap at 100.

#### Scenario: Search returns ranked results

- GIVEN indexed content including a deck whose title contains "accesibilidad"
- WHEN `search({query: "accesibilidad"})` is invoked
- THEN the response MUST include an array `results`
- AND every result entry MUST contain `slug`, `title`, `type`, `excerpt`, `published_at`, and `relevance_score`
- AND results MUST be sorted by `relevance_score` descending

#### Scenario: Search with type filter narrows results

- GIVEN indexed content of multiple types
- WHEN `search({query: "MCP", type: "rfc"})` is invoked
- THEN every result MUST have `type: "rfc"`

#### Scenario: Empty query is rejected

- GIVEN an empty string query
- WHEN `search({query: ""})` is invoked
- THEN the response MUST include `error: "invalid_input"`
- AND no upstream fetch MUST occur

#### Scenario: Limit cap is enforced

- GIVEN a `limit` argument greater than 100
- WHEN `search` is invoked
- THEN the server MUST cap the effective limit at 100
- AND the response `results` array length MUST NOT exceed 100

### Requirement: `list_decks`, `list_rfcs`, `list_skills` Tools

Each list tool MUST return the catalog of items of its respective type, sourced from the corresponding JSON manifest in the erno-modo repository (`decks.json`, `rfcs.json`, `skills.json`). The optional `filter` argument MUST accept fields `tag`, `state` (e.g., `draft`, `rfc`, `completo`), and `since` (ISO 8601 date).

#### Scenario: Listing decks returns full catalog

- GIVEN `decks.json` in erno-modo containing N entries
- WHEN `list_decks({})` is invoked
- THEN the response MUST include `decks` array with N entries
- AND every entry MUST contain `slug`, `title`, `state`, `published_at`, `tags`, and `url`

#### Scenario: Filter by state narrows results

- GIVEN entries with mixed states
- WHEN `list_rfcs({filter: {state: "rfc"}})` is invoked
- THEN every returned RFC MUST have `state: "rfc"`

#### Scenario: Filter by since returns only newer items

- GIVEN entries with mixed `published_at` dates
- WHEN `list_skills({filter: {since: "2026-01-01"}})` is invoked
- THEN every returned skill MUST have `published_at >= 2026-01-01`

#### Scenario: Unknown filter field is rejected

- GIVEN a filter containing an unknown field
- WHEN any list tool is invoked
- THEN the response MUST include `error: "invalid_input"` referencing the unknown field

### Requirement: `get_ingest_profile` Tool

The `get_ingest_profile(format?: string)` tool MUST return the consolidated ingestion profile for the authenticated user, scoped by `sub`. Detailed shape requirements live in the `ingest-profile` spec.

#### Scenario: Default format returns JSON profile

- GIVEN no `format` argument
- WHEN `get_ingest_profile({})` is invoked
- THEN the response MUST include the profile JSON document conforming to the `ingest-profile` spec
- AND `format` MUST default to `"json"`

#### Scenario: Markdown format returns rendered text

- GIVEN `format: "markdown"`
- WHEN the tool is invoked
- THEN the response MUST include a `content` string containing the profile rendered as markdown
- AND the markdown MUST NOT contain executable script tags

#### Scenario: Unknown format is rejected

- GIVEN a `format` not in (`json`, `markdown`)
- WHEN the tool is invoked
- THEN the response MUST include `error: "invalid_input"`

### Requirement: Tool Output Size Limit

Every tool response payload MUST NOT exceed 1 MiB after serialization. If a request would produce a larger payload, the server MUST truncate the result, set `truncated: true`, and include a `next_cursor` when applicable.

#### Scenario: Oversized search result is truncated

- GIVEN a query whose full result set exceeds 1 MiB
- WHEN `search` is invoked
- THEN the response MUST include `truncated: true`
- AND the response payload size MUST NOT exceed 1 MiB

### Requirement: MCP Resource Trees

The server MUST expose four resource roots discoverable via MCP `resources/list`: `bitacora://decks/`, `bitacora://rfcs/`, `bitacora://skills/`, `bitacora://posts/`. Each resource URI MUST resolve to a stable canonical document.

#### Scenario: Resource listing returns the four roots

- GIVEN an authenticated MCP session
- WHEN the client invokes `resources/list`
- THEN the response MUST include at least the four root resource URIs above

#### Scenario: Resource read returns sanitized content

- GIVEN a resource URI `bitacora://decks/accesibilidad-lectura-asistida-tdah`
- WHEN the client invokes `resources/read` on that URI
- THEN the response MUST include `contents` with sanitized markdown
- AND the response MUST include `mimeType: "text/markdown"` or `"text/html"`
