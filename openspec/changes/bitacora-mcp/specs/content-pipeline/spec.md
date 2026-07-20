# Content Pipeline Specification

## Purpose

Defines how bitácora content is fetched from the erno-modo source, cached, and sanitized before being served to MCP clients. The pipeline MUST guarantee freshness within a bounded window, MUST defend against prompt-injection vectors hidden in content, and MUST degrade gracefully when the upstream source is unavailable.

## Requirements

### Requirement: Source Manifest Fetching

The server MUST fetch the catalog manifests `decks.json`, `rfcs.json`, and `skills.json` from `https://soyernomodo.github.io/erno-modo/` (or `raw.githubusercontent.com/SoyErnoModo/erno-modo/main/` when GitHub Pages cache lags) and treat them as the source of truth for the catalog.

#### Scenario: Manifest fetch succeeds

- GIVEN a request that requires the deck catalog
- WHEN the server fetches `decks.json`
- THEN the response status MUST be 200
- AND the parsed JSON MUST be persisted to the cache layer with a key including the source URL and the fetch timestamp

#### Scenario: Manifest fetch fails with stale cache available

- GIVEN the upstream fetch to `decks.json` fails with a 5xx or network error
- AND a previously cached manifest exists
- WHEN any tool needs the catalog
- THEN the server MUST serve the cached manifest
- AND the response MUST include a `stale: true` flag in metadata
- AND a log entry MUST record the upstream failure

#### Scenario: Manifest fetch fails with no cache

- GIVEN no previously cached manifest exists
- AND the upstream fetch fails
- WHEN any tool needs the catalog
- THEN the tool MUST return `error: "upstream_unavailable"` with a human-readable message

### Requirement: Cache Layer with 5-Minute TTL

All upstream content fetches (manifests + individual posts) MUST be cached for 300 seconds. Cache MUST be keyed by source URL and version hash. Vercel KV MUST be used in production; in-memory cache MAY be used as a fallback for local development.

#### Scenario: Repeated fetch within TTL hits cache

- GIVEN a successful fetch of `decks.json` 120 seconds ago
- WHEN any tool again requires the deck catalog
- THEN the server MUST serve the cached copy
- AND no outbound HTTP request to the upstream MUST occur

#### Scenario: Fetch after TTL expiry refreshes cache

- GIVEN a cached entry whose age exceeds 300 seconds
- WHEN the tool requires the data
- THEN the server MUST issue a fresh upstream fetch
- AND the cache entry MUST be replaced on success

#### Scenario: Cache invalidation via webhook

- GIVEN an authenticated webhook POST to `/internal/cache/invalidate` carrying a valid signature
- WHEN the server processes the webhook
- THEN the targeted cache keys MUST be deleted
- AND the next fetch MUST hit the upstream

### Requirement: Content Sanitization

All content returned from tools and resources MUST be sanitized to mitigate prompt-injection and XSS vectors before serialization. Sanitization MUST run server-side and MUST NOT be optional.

#### Scenario: HTML script tags are stripped

- GIVEN upstream content containing a `<script>` tag
- WHEN the content is served via any tool or resource
- THEN the `<script>` tag and its contents MUST be removed from the response

#### Scenario: HTML event-handler attributes are stripped

- GIVEN upstream content containing attributes such as `onclick`, `onerror`, `onload`
- WHEN the content is served
- THEN all `on*` event-handler attributes MUST be removed

#### Scenario: JavaScript URIs are neutralized

- GIVEN upstream content containing `href="javascript:..."` or similar
- WHEN the content is served
- THEN the `href` value MUST be replaced with `"#"` or removed entirely

#### Scenario: Indirect prompt-injection patterns are flagged

- GIVEN upstream content containing literal phrases such as `"ignore previous instructions"`, `"system prompt:"`, `"<|im_start|>"`, or `"### Instruction"`
- WHEN the content is served
- THEN the response metadata MUST include a `prompt_injection_detected: true` flag listing matched patterns
- AND the content body MUST still be served (sanitization MUST NOT silently delete prose)

### Requirement: Content Type Boundaries

By default, all tool and resource responses MUST be served as plain text or markdown. Returning raw HTML MUST require an explicit per-tool flag and MUST add a security header note in metadata.

#### Scenario: Default response is markdown

- GIVEN a `read_post` invocation without explicit format flag
- WHEN the server responds
- THEN the response `content_type` MUST be `text/markdown`
- AND any HTML in the source MUST be converted to markdown or stripped

#### Scenario: HTML response requires explicit opt-in

- GIVEN a `read_post` invocation with `format: "html"`
- WHEN the server responds
- THEN the response `content_type` MUST be `text/html`
- AND the response metadata MUST include `raw_html: true`

### Requirement: Source URL Pinning

Every returned item MUST include a `source_url` field pointing to the canonical erno-modo URL (e.g., `https://soyernomodo.github.io/erno-modo/decks/<slug>.html`). The MCP client SHALL be able to attribute content to its source.

#### Scenario: Every item carries a source URL

- GIVEN any tool returning a content item
- WHEN the response is inspected
- THEN the item MUST include a `source_url` field
- AND the URL MUST resolve to a `https://soyernomodo.github.io/erno-modo/` path
