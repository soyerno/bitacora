# Decks Catalog Specification

## Overview

Page `/decks/` lists every HTML deck versioned in the repo. The list is rendered client-side by `MODO.createCollection` from the array in `decks/decks.json`, with search, sort, status tabs and topic chips.

Source files:
- `decks/index.html` — DOM contract (data-attributes) + caller of `createCollection`.
- `assets/collection.js` — generic controller (`MODO.createCollection`).
- `decks/decks.json` — data source (`{ _meta, decks: [...] }`).

---

## SPEC-DECKS-001 — JSON manifest schema

### Requirements

- `decks.json` MUST be a JSON object with two top-level keys: `_meta` and `decks`.
- `_meta` MUST contain at minimum `generated` (ISO date) and `source` (free-form path note).
- `decks` MUST be an array. Each item MUST contain:
  - `id` (string, kebab-case, unique across the file)
  - `title` (string)
  - `desc` (string)
  - `href` (string, relative path to the deck HTML inside the repo)
  - `status` (`draft` | `rfc` | `completo`)
  - `audience` (string)
  - `date` (ISO date `YYYY-MM-DD`)
  - `slides` (positive integer)
  - `topics` (array of strings — used by chips)
- `featured` (boolean) is OPTIONAL; only `true` is meaningful — the home page surfaces featured decks.
- Status `archivado` MUST NOT appear in decks (deck states are only `draft|rfc|completo`).
- Every `href` MUST point to an existing file in the working tree.

### Scenarios

#### Scenario: Every deck has the required fields

```
Given decks/decks.json is loaded
When each entry of decks[] is inspected
Then it MUST have id, title, desc, href, status, audience, date, slides, topics
And status MUST be one of draft|rfc|completo
And slides MUST be a positive integer
And topics MUST be an array (may be empty)
```

#### Scenario: Every href resolves on disk

```
Given decks/decks.json exists
When each entry.href is checked against the filesystem
Then the file MUST exist
```

#### Scenario: IDs are unique

```
Given decks/decks.json is loaded
When the ids of decks[] are collected
Then no duplicate ids MUST appear
```

---

## SPEC-DECKS-002 — DOM contract for the catalog page

The catalog page MUST expose this DOM contract so `MODO.createCollection({ name: 'decks', ... })` can wire itself up:

| Selector                                  | Role                                |
|-------------------------------------------|-------------------------------------|
| `[data-collection="decks"]`               | Root scope                          |
| `[data-search]`                           | `<input type="search">`             |
| `[data-sort]`                             | `<select>` with `value` per mode    |
| `[data-tabs]`                             | Empty container — controller fills  |
| `[data-chips]`                            | Empty container — controller fills  |
| `[data-list]`                             | Empty container — controller fills  |
| `[data-empty]`                            | Empty-state box (initially `hidden`)|
| `[data-result-count]`                     | Live region for counter             |
| `[data-clear]`                            | Button (initially `hidden`)         |

### Scenarios

#### Scenario: Page renders the full contract

```
Given decks/index.html is loaded as HTML
When the DOM is parsed
Then it MUST contain exactly one [data-collection="decks"]
And inside that scope it MUST contain each of [data-search], [data-sort], [data-tabs], [data-chips], [data-list], [data-empty], [data-result-count], [data-clear]
```

---

## SPEC-DECKS-003 — Controller behavior (search / tabs / chips / sort / clear)

### Requirements

- On init, the controller MUST render:
  - One `<button class="tab">` per stage in `opts.stages`, preceded by an "Todos" tab.
  - One `<button class="chip">` per topic key in `opts.labels` whose count > 0, in the order of `opts.labels` keys.
  - A result counter following the rule:
    - `N noun` when `N === total`,
    - `N de TOTAL noun` otherwise.
  - The empty state visible only when filtered length is 0.
  - The clear-filters button visible only when at least one filter (search, non-`all` stage, any topic) is active.
- Tabs MUST support roving focus with `ArrowLeft` / `ArrowRight`, skipping disabled tabs.
- Tabs whose stage has count 0 MUST be rendered with the `disabled` attribute.
- The "Todos" tab MUST start with `aria-selected="true"`.
- Chips MUST toggle `aria-pressed`; multiple chips MAY be active simultaneously.
- Search MUST match `opts.searchHaystack(item)` case-insensitively against the trimmed query.
- The `clear` button MUST reset: search input, search state, stage → `all`, chips off.

### Scenarios

#### Scenario: Initial render counts all items

```
Given a collection with N items split across stages
When the controller initializes
Then [data-result-count].textContent MUST equal "<N> <noun>"
And [data-empty] MUST be hidden
And [data-clear] MUST be hidden
```

#### Scenario: Switching stage filters to that status

```
Given a collection with 3 draft and 2 completo items
When the user clicks the "Draft" tab
Then the list MUST contain exactly 3 items
And [data-result-count] MUST read "3 de 5 <noun>"
And [data-clear] MUST be visible
```

#### Scenario: Search applies on top of stage and chips

```
Given the user has selected stage="completo" and chip "frontend"
When they type "promo" in [data-search]
Then only completo items tagged "frontend" whose searchHaystack contains "promo" remain
```

#### Scenario: Clear resets all filters

```
Given any combination of active filters
When the user clicks [data-clear]
Then state MUST be: search="" , stage="all" , topics=∅
And the list MUST render the full original set
And [data-clear] MUST be hidden again
```

#### Scenario: Empty result shows empty state

```
Given filters that match zero items
When apply() runs
Then [data-empty] MUST be visible (hidden=false)
And [data-list] MUST be hidden (hidden=true)
```

#### Scenario: Disabled tabs are skipped by arrow nav

```
Given a stage tab "rfc" has count 0 and is disabled
When the user presses ArrowRight from the previous tab
Then focus MUST land on the next non-disabled tab (skipping "rfc")
```

---

## SPEC-DECKS-004 — Home featured surfacing

### Requirements

- The home page (`/`) MUST surface decks marked `featured: true` from `decks/decks.json`.
- The number of featured decks SHOULD be small enough to fit the "Destacados" row without horizontal overflow on the 960px container.
