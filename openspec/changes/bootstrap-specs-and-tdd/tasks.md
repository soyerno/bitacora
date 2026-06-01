# Tasks — bootstrap-specs-and-tdd

Each task starts with a failing test (red), then a code or data change that
makes it pass (green). The task is "done" only when both the red and green
states have been observed locally.

## 1. Testing infrastructure

- [x] 1.1 Add `package.json` with `pnpm test` → `vitest run`
- [x] 1.2 Add `vitest.config.js` with `happy-dom` environment + setupFiles
- [x] 1.3 Add `tests/helpers/setup.js` polyfilling working `Storage` over Node 25's
      experimental webstorage + happy-dom's deferred-to-globalThis breakage
- [x] 1.4 Add `tests/helpers/load-asset.js` that evaluates an `assets/*.js` file
      against the JSDOM/happy-dom globals

## 2. OpenSpec scaffold

- [x] 2.1 `openspec/config.yaml`
- [x] 2.2 `openspec/specs/decks-catalog.md`
- [x] 2.3 `openspec/specs/rfcs-catalog.md`
- [x] 2.4 `openspec/specs/theme-toggle.md`
- [x] 2.5 `openspec/specs/data-integrity.md`
- [x] 2.6 `openspec/specs/skills-distribution.md`

## 3. Data integrity tests (red → green)

- [x] 3.1 Red: assert every `decks[].href` exists on disk (passed first try)
- [x] 3.2 Red: assert every `rfcs[].deck` reference exists on disk (passed first try)
- [x] 3.3 Red: assert `skills[].description.length >= 10` — **caught
      `modo-tech-architect.description === ">"`**
- [x] 3.4 Red: assert `skills[].sha256_prefix` matches the SHA-256 of
      `skills/<filename>` — **caught 6 stale prefixes**
- [x] 3.5 Green: regenerate sha256/size/description from disk using the same
      YAML block-scalar logic the sync script will need

## 4. Theme toggle tests (red → green)

- [x] 4.1 Red: cycle assertion failed because happy-dom dispatched
      `DOMContentLoaded` before our `loadAsset` ran — the wired init never fired
- [x] 4.2 Green: call `MODO.initThemeToggle()` explicitly in `beforeEach`
      (the spec already documents this as a supported pattern)
- [x] 4.3 Red: `localStorage.setItem is not a function` because Node 25's
      experimental webstorage clobbers happy-dom's working Storage
- [x] 4.4 Green: replace `globalThis.localStorage` with an in-memory
      `MemoryStorage` whose prototype is exposed as `Storage` so `vi.spyOn`
      works against `Storage.prototype.setItem`

## 5. Collection controller tests

- [x] 5.1 11 scenarios covering tabs / chips / search / sort / clear / empty
      / arrow-key navigation / versions toggle — all passed first run

## 6. DOM contract tests

- [x] 6.1 Parse `decks/index.html` and assert the 8 data-attributes exist
- [x] 6.2 Same for `rfcs/index.html`
- [x] 6.3 Strip `<link>` and `<script>` tags before parsing to avoid
      happy-dom's leaked async fetch rejections

## 7. Docs + CI

- [ ] 7.1 Update README with a "Tests + specs" section
- [ ] 7.2 Add `.github/workflows/test.yml`
