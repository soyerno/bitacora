# Skills Distribution Specification

## Overview

Custom MODO skills are distributed as `.zip` bundles under `skills/`, indexed by `skills/skills.json`. Users (or agents) can download a ZIP, unzip it into `~/.claude/skills/`, and use the skill immediately.

Source files:
- `skills/skills.json` — manifest.
- `skills/*.zip` — bundle artifacts (each contains a `<name>.skill/` folder with `SKILL.md`).
- `~/.claude/skills/erno-modo-sync-all/scripts/sync.py` — regenerates the manifest + hashes.

---

## SPEC-SKILLS-001 — Install hint must be self-sufficient

### Requirements

- Every `install_hint` MUST contain a curl/unzip-able recipe:
  - `unzip <filename>` (filename equals `entry.filename`)
  - A target install dir under `~/.claude/skills/`
  - A `mv` step to strip the `.skill` suffix from the unzipped folder.

### Scenarios

#### Scenario: install_hint references the correct filename

```
For each entry in skills.json#skills[]:
  expect entry.install_hint.includes(entry.filename)
  expect entry.install_hint.includes('unzip')
  expect entry.install_hint.includes('~/.claude/skills/')
```

---

## SPEC-SKILLS-002 — Stable identifiers

### Requirements

- `name` is the canonical identifier and MUST NOT change once published.
- Filename MUST equal `<name>.zip`.
- Renaming a skill is a breaking change and requires keeping the old ZIP as an alias until consumers migrate.
