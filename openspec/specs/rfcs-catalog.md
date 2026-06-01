# RFCs Catalog Specification

## Overview

Page `/rfcs/` lists every RFC tracked in `rfcs/rfcs.json`. Same controller as `/decks/` (`MODO.createCollection`), but with four stages and topic chips driven by `area`. Sagas (multiple versions of the same RFC) are collapsed: only the latest version is listed, older versions appear under a "versions" anchor when present.

Source files:
- `rfcs/index.html` — DOM contract + caller of `createCollection({ name: 'rfcs' })`.
- `assets/collection.js` — shared controller.
- `rfcs/rfcs.json` — data source (`{ _meta, rfcs: [...] }`).

---

## SPEC-RFCS-001 — JSON manifest schema

### Requirements

- `rfcs.json` MUST be a JSON object with two top-level keys: `_meta` and `rfcs`.
- `_meta` MUST contain at minimum `generated`, `source`, `deduped` (boolean).
- Each item in `rfcs[]` MUST contain:
  - `number` (string, e.g. `"R01"`, monotonic but free-form)
  - `slug` (string, kebab-case, unique)
  - `title` (string)
  - `summary` (string)
  - `status` (`draft` | `rfc` | `completo` | `archivado`)
  - `area` (string — feeds the chips)
  - `date` (ISO date)
  - At least one of `drive_url` or `repo_url` (external source of truth).
- Optional fields:
  - `tags` (array of strings)
  - `deck` (relative path to a deck HTML in this repo)
  - `versions` (array of older anchors with at minimum `date` and `drive_url`)

### Scenarios

#### Scenario: Every RFC carries a link to its source

```
Given rfcs/rfcs.json is loaded
When each entry of rfcs[] is inspected
Then it MUST have at least one of drive_url or repo_url
```

#### Scenario: Slugs are unique

```
Given rfcs/rfcs.json is loaded
When all slugs are collected
Then there MUST be no duplicates
```

#### Scenario: Status uses the four allowed values

```
Given rfcs/rfcs.json is loaded
When each entry.status is checked
Then it MUST be one of draft|rfc|completo|archivado
```

#### Scenario: Linked deck files exist when referenced

```
Given an RFC entry includes a `deck` field
When the path is resolved against the working tree
Then the file MUST exist
```

---

## SPEC-RFCS-002 — DOM contract for the catalog page

Same controller contract as decks. Selectors MUST exist under `[data-collection="rfcs"]`:
`[data-search]`, `[data-sort]`, `[data-tabs]`, `[data-chips]`, `[data-list]`, `[data-empty]`, `[data-result-count]`, `[data-clear]`.

### Scenarios

#### Scenario: Page exposes the rfcs collection scope

```
Given rfcs/index.html is loaded
Then it MUST contain exactly one [data-collection="rfcs"] containing all 8 data-* hooks above
```

---

## SPEC-RFCS-003 — Saga collapse and versions toggle

### Requirements

- Each rendered RFC item MAY include a `.versions-toggle` button targeting an element by `data-target` id.
- Clicking the toggle MUST flip the `open` class on the target element and update the button text prefix between `+ ` and `− `.
- Pressing the toggle again MUST collapse the panel.

### Scenarios

#### Scenario: Toggling versions opens and closes the panel

```
Given an RFC card with a [data-target="rfc-r02-versions"] panel and a .versions-toggle button
When the user clicks the toggle
Then the panel MUST gain the "open" class
And the button text MUST start with "− "
When the user clicks the toggle again
Then the panel MUST lose the "open" class
And the button text MUST start with "+ "
```

---

## SPEC-RFCS-004 — Status tabs include "archivado"

### Requirements

- The caller MUST pass `stages: ['draft', 'rfc', 'completo', 'archivado']`.
- "archivado" entries MUST NOT count as `completo`.
