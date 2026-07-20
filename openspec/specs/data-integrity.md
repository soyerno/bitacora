# Data Integrity Specification

## Overview

The site is data-driven: home, decks, rfcs, and herramientas all rely on JSON manifests that are consumed both by the browser and by external agents. Manifests MUST stay consistent with the filesystem and with each other.

Source files:
- `decks/decks.json` — deck catalog.
- `rfcs/rfcs.json` — RFC catalog.
- `skills/skills.json` — downloadable skill ZIP manifest.
- `assets/profile.json` — GitHub stats refreshed by GH Actions.

The sync script `~/.claude/skills/erno-modo-sync-all/scripts/sync.py` re-derives these manifests; the contract below describes what valid output looks like.

---

## SPEC-DATA-001 — Required top-level shape

### Requirements

- Each of `decks.json`, `rfcs.json`, `skills.json` MUST be a JSON object with two top-level keys: `_meta` and the corresponding array (`decks`, `rfcs`, `skills`).
- `_meta.generated` MUST be an ISO date string `YYYY-MM-DD`.

### Scenarios

#### Scenario: Each manifest has _meta and its named array

```
For each of ['decks.json', 'rfcs.json', 'skills.json']:
  Given the file is loaded
  Then it MUST contain "_meta" and the matching array key
  And typeof _meta.generated MUST be string matching /^\d{4}-\d{2}-\d{2}$/
```

---

## SPEC-DATA-002 — Skills manifest fields

### Requirements

- Each entry in `skills.json#skills[]` MUST contain:
  - `name` (string, kebab-case, MUST equal the basename of `filename` without the `.zip` extension)
  - `description` (string, ≥ 10 chars)
  - `filename` (string, ends with `.zip`)
  - `sha256_prefix` (string, 16 hex chars — first 16 chars of the SHA-256 of the ZIP)
  - `size_kb` (number > 0, one decimal place)
  - `install_hint` (string, contains `unzip` and the filename)
- Every `filename` MUST resolve to a real file inside `skills/`.

### Scenarios

#### Scenario: Every skill ZIP exists on disk

```
Given skills/skills.json is loaded
When each entry.filename is checked against skills/
Then the file MUST exist
```

#### Scenario: SHA-256 prefix matches the ZIP on disk

```
Given a skill manifest entry with sha256_prefix = "8b90f8d8949e1714"
And the file at skills/<filename>
Then the first 16 hex chars of sha256(<file>) MUST equal "8b90f8d8949e1714"
```

#### Scenario: name matches filename basename

```
For each skill entry:
  expect entry.name === path.basename(entry.filename, '.zip')
```

---

## SPEC-DATA-003 — Cross-references

### Requirements

- Any `deck` field inside `rfcs.json` MUST resolve to a real HTML file under `decks/`.
- Any `href` inside `decks.json` MUST resolve to a real HTML file under `decks/`.
