# Theme Toggle Specification

## Overview

Every page exposes a 3-state theme toggle that cycles `auto → light → dark → auto`, persists the choice in `localStorage`, and avoids the flash of incorrect theme via inline pre-paint script in `<head>`.

Source files:
- `assets/common.js` — `MODO.initThemeToggle` + `MODO.STATUS_LABELS` + `MODO.escapeHTML`.
- Pre-paint script inlined in each page's `<head>`.

---

## SPEC-THEME-001 — Cycle order

### Requirements

- The button `#theme-toggle` MUST cycle through `auto → light → dark → auto` on each click.
- The label `#theme-label` MUST display the Spanish label of the current state: `auto`, `claro`, `oscuro`.
- The `data-theme` attribute on `<html>` MUST be set to the new state.

### Scenarios

#### Scenario: First click moves from auto to light

```
Given <html data-theme="auto"> and a #theme-toggle button
When the user clicks the toggle
Then document.documentElement.getAttribute('data-theme') MUST equal "light"
And #theme-label.textContent MUST equal "claro"
```

#### Scenario: Wraps back to auto after dark

```
Given <html data-theme="dark">
When the user clicks the toggle
Then data-theme MUST equal "auto"
And #theme-label.textContent MUST equal "auto"
```

#### Scenario: Default state when no attribute is set

```
Given <html> with NO data-theme attribute
When the user clicks the toggle
Then data-theme MUST equal "light" (auto is treated as the default starting point)
```

---

## SPEC-THEME-002 — Persistence

### Requirements

- After each click, the new state MUST be written to `localStorage` under the key `modo-decks-theme`.
- Storage errors (e.g., disabled cookies, private mode) MUST be swallowed silently and MUST NOT throw.

### Scenarios

#### Scenario: localStorage gets updated

```
Given localStorage is empty
When the user clicks the toggle twice from auto
Then localStorage.getItem("modo-decks-theme") MUST equal "dark"
```

#### Scenario: localStorage failure does not break the cycle

```
Given localStorage.setItem throws
When the user clicks the toggle
Then no error MUST escape
And document.documentElement.dataset.theme MUST still update
```

---

## SPEC-THEME-003 — Idempotent init

### Requirements

- `MODO.initThemeToggle` MUST be safe to call when no `#theme-toggle` exists (e.g., in tests or 404 pages).
- It MUST still refresh `#theme-label` if present.

### Scenarios

#### Scenario: No toggle button present

```
Given a document with no #theme-toggle and a #theme-label
When MODO.initThemeToggle() runs
Then no error MUST be thrown
And #theme-label MUST reflect the current data-theme (or "auto")
```

---

## SPEC-THEME-004 — Helpers

### Requirements

- `MODO.escapeHTML(value)` MUST escape `& < > " '` and MUST coerce `null` / `undefined` to the empty string.
- `MODO.STATUS_LABELS` MUST contain at minimum keys `draft`, `rfc`, `completo`, `archivado` with human labels.

### Scenarios

#### Scenario: escapeHTML protects against HTML injection

```
When escapeHTML('<script>alert("x")</script>') runs
Then the result MUST equal "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
```

#### Scenario: escapeHTML coerces nullish values

```
When escapeHTML(null) runs
Then the result MUST equal ""
When escapeHTML(undefined) runs
Then the result MUST equal ""
```
