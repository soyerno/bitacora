# Add a dev quality harness to the bitácora

## Why

La bitácora corre Next.js 16 + React 19 + Tailwind v4 con OpenSpec ya en uso, pero su harness de calidad era informal: `pnpm lint/typecheck/test/check:visibility` se corrían a mano "antes de mergear", sin un gate que lo enforce. Además `next lint` quedó roto (fue removido en Next 16) y el data layer (`lib/`) no tenía tests.

Este cambio aplica el harness de calidad destilado de Firulapp (eat-own-dogfood del curso *"Coding con una flota de agentes"*): convierte la disciplina manual en gates que no dejan mergear basura, **sin castigar la deuda preexistente**.

## What changes

- **Pre-commit gate** (husky + lint-staged + `validate`): cada commit corre `eslint --fix` sobre lo staged + `validate` (typecheck + `check:arch` + `check:visibility` + test).
- **Size-gate** (`check:arch`): ningún `.tsx` de UI nace god-component (presupuesto 250 líneas, allow-list grandfathered que solo puede achicar). En `origin/main` no hay god-components → allow-list vacía (gate puramente preventivo).
- **Lint arreglado**: `next lint` fue removido en Next 16 → ESLint flat config (`eslint-config-next/core-web-vitals`, per docs locales), pineado a `eslint@9` (`eslint@10` rompe `eslint-plugin-react`).
- **Tests del data layer**: cobertura de `lib/` (url, visibility, feeds, search): 38 → 58 tests.

## Out of scope / deuda conocida (honesto)

- No se refactoriza código que funciona. **No hay god-components en `origin/main`** que modularizar — los componentes ~390 líneas de Persona son trabajo local sin commitear, fuera del alcance de una branch basada en `main`.
- `eslint .` marca **2 errores preexistentes** (`react-hooks/set-state-in-effect` en `ThemeToggle.tsx` y `buscar/page.tsx`), patrones intencionales no auto-fixables. El lint full queda fuera del `validate` bloqueante; lint-staged gatea solo lo tocado (estilo Firulapp: "CI marca lint como continue-on-error").
- CI (`build.yml`/`test.yml`) no corre lint hoy; este cambio no lo agrega al gate bloqueante.
