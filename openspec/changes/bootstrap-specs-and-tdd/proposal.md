# Bootstrap specs + TDD harness for erno-modo

## Intent

erno-modo started as a hand-edited static site. It now has external consumers
(catalog JSONs read by agents, downloadable skills used across machines) but no
test suite and no written contracts — every refactor risks silently breaking the
manifests. This change bootstraps OpenSpec + a Vitest harness so future work
can move in red→green cycles instead of by inspection.

## Scope

- OpenSpec scaffold (`openspec/config.yaml`, `openspec/specs/*.md`, this change folder).
- Vitest + happy-dom dev dependencies, `package.json`, `vitest.config.js`.
- Capability specs for: decks catalog, rfcs catalog, theme toggle, data integrity,
  skills distribution.
- 57 tests under `tests/specs/` covering: JSON shape, on-disk references,
  sha256/size drift, install hints, theme cycle + persistence + idempotency,
  helpers, DOM contracts of `decks/index.html` and `rfcs/index.html`, and the
  full `MODO.createCollection` behavior (tabs/chips/search/sort/clear/empty).

## Out of scope

- Changing UX or visual behavior. Specs document existing behavior verbatim.
- Refactoring `assets/common.js` or `assets/collection.js`. The only fix made to
  production code was reconciling `skills/skills.json` so its sha256 prefixes
  and descriptions match the on-disk ZIPs.

## Why TDD red→green

Red phase exposed two real bugs that had been silently shipping:

1. `modo-tech-architect.description` was the literal string `">"` — the daily
   sync script lost the YAML block-scalar marker when re-extracting the
   frontmatter. The folded-scalar content was discarded.
2. Six skills had stale `sha256_prefix` values (`modo-design-system`,
   `modo-code-review-checklist`, `modo-promos`, `consultar-promos-modo`,
   `simular-compra-agentica`, `agente-cx-whatsapp`). The ZIPs had been rebuilt
   without the sync step running.

Green phase regenerated those fields directly from the on-disk ZIPs. Agents
that verify the manifest against the file now succeed.

## Rollback

Pure-additive. To roll back, delete:

- `openspec/`
- `tests/`
- `package.json`, `pnpm-lock.yaml`, `vitest.config.js`, `node_modules/`
- The fields in `skills/skills.json` that were touched (sha256/size/description)
  can be reverted with `git checkout -- skills/skills.json` IF the goal is to
  restore the previously-stale state; the broken description for
  modo-tech-architect would return.

## Affected files

- new: `openspec/**`, `tests/**`, `package.json`, `vitest.config.js`,
  `.gitignore`, `pnpm-lock.yaml`, `.github/workflows/test.yml`
- changed: `skills/skills.json`, `README.md`
