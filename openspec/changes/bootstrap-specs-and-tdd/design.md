# Design — bootstrap-specs-and-tdd

## Why happy-dom over jsdom

Both ship broken Storage on Node 25.5: jsdom 25 returns a plain Object with no
Storage methods on the prototype; happy-dom 15 defers to Node's experimental
`globalThis.localStorage` (gated behind `--localstorage-file`) which is also
unusable in unit tests. We use happy-dom because it is faster, smaller, and
its CSS parser tolerates the inline `<style>` blocks in our HTML files. The
Storage shim in `tests/helpers/setup.js` is environment-agnostic and would
keep working if we switched envs.

## Why eval the assets directly

`assets/common.js` and `assets/collection.js` are vanilla browser scripts that
register on `window.MODO`. They have no exports and no module system, so:

- We cannot `import()` them as ESM (no exports, top-level `document.add...`
  would still run).
- We cannot `require()` them either.

Wrapping the source in `new Function('window','document','localStorage', src)`
and calling it with `globalThis` as `this` gives us:

- Exactly the same global side effects the browser sees.
- An injection point for the test's own DOM and storage.
- No script tag-loading machinery, no resource fetches.

## Why not assert on the actual JSON manifests for collection.js

We DO have manifest-shape tests in `data-integrity.test.js`. The collection
tests use a deterministic fixture instead so that:

1. Filter/sort assertions are repeatable regardless of which deck was added
   today.
2. Edge cases like "all items in one stage" are exercised without polluting
   the real catalog.

## Cross-references between specs and tests

| Spec                          | Test file                            |
|-------------------------------|--------------------------------------|
| `decks-catalog.md`            | `data-integrity.test.js`, `dom-contract.test.js`, `collection.test.js` |
| `rfcs-catalog.md`             | `data-integrity.test.js`, `dom-contract.test.js`, `collection.test.js` (versions toggle) |
| `theme-toggle.md`             | `theme-toggle.test.js`               |
| `data-integrity.md`           | `data-integrity.test.js`             |
| `skills-distribution.md`      | `data-integrity.test.js` (install-hint block) |
