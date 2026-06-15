# Tasks — add-dev-harness

Cada gate se verificó corriéndolo de verdad (no "debería andar"): el hook se
probó disparándolo en un commit real.

## 1. Lint (arreglar el roto)

- [x] 1.1 Detectar que `next lint` está roto en Next 16 (removido → "Invalid project directory ... /lint")
- [x] 1.2 `eslint.config.mjs` con `eslint-config-next/core-web-vitals` (per `node_modules/next/dist/docs/.../03-eslint.md`)
- [x] 1.3 Pinear `eslint@9` (`eslint@10` rompe `eslint-plugin-react`: `getFilename is not a function`)
- [x] 1.4 `package.json`: `"lint": "eslint ."`

## 2. Size-gate

- [x] 2.1 `scripts/check-arch.mjs` (presupuesto 250 líneas, `GRANDFATHERED` shrink-only)
- [x] 2.2 Verificar 0 god-components en `origin/main` (23 `.tsx` ≤ 250, allow-list vacía)
- [x] 2.3 `package.json`: `"check:arch": "node scripts/check-arch.mjs"`

## 3. Pre-commit gate

- [x] 3.1 Instalar husky + lint-staged
- [x] 3.2 `.husky/pre-commit` → `lint-staged` + `pnpm validate`
- [x] 3.3 `.lintstagedrc.json`: `eslint --fix` sobre `*.{ts,tsx,js,mjs}` staged
- [x] 3.4 `package.json`: `validate` = typecheck + check:arch + check:visibility + test; `prepare` = husky
- [x] 3.5 Verificar el hook dispara en un commit real (lint-staged + 58 tests verde)

## 4. Tests del data layer

- [x] 4.1 Alias `@/` en `vitest.config.js` (regex `^@/` para no pisar paquetes `@scope`)
- [x] 4.2 `tests/unit/url.test.js` (isExternal / isStaticAsset / toAbsoluteHref)
- [x] 4.3 `tests/unit/visibility.test.js` (contrato: private NUNCA se filtra)
- [x] 4.4 `tests/unit/feeds.test.js` (datos reales: featured/urgent, key `items`, suma de tools)
- [x] 4.5 `tests/unit/search.test.js` (completitud del label map)
- [x] 4.6 Suite total verde: 38 → 58 tests
