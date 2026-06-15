# Dev Harness Specification

## Purpose

Define los gates de calidad de la bitácora: un pre-commit que corre rápido sobre lo tocado, un gate de arquitectura que frena god-components, lint que funciona bajo Next 16, y cobertura de tests del data layer. El objetivo es que la disciplina manual ("correr lint/typecheck/test antes de mergear") sea un gate enforced, sin castigar la deuda preexistente.

## ADDED Requirements

### Requirement: Pre-Commit Quality Gate

El repositorio SHALL ejecutar un hook de pre-commit (husky) que corre `lint-staged` (con `eslint --fix` solo sobre los archivos staged) seguido de `pnpm validate`. El script `validate` SHALL componer `typecheck` + `check:arch` + `check:visibility` + `test`. El gate SHALL poder saltearse con `git commit --no-verify` para emergencias.

#### Scenario: Un commit con cambios válidos pasa el gate

- GIVEN un working tree con cambios que pasan typecheck, arch, visibility y tests
- WHEN se ejecuta `git commit`
- THEN el hook corre lint-staged y `pnpm validate`
- AND el commit se concreta

#### Scenario: Un commit que rompe un test es bloqueado

- GIVEN un cambio que hace fallar un test
- WHEN se ejecuta `git commit`
- THEN `pnpm validate` falla
- AND el commit NO se concreta (salvo `--no-verify`)

### Requirement: Architecture Size Gate

El repositorio SHALL proveer `check:arch` (`scripts/check-arch.mjs`) que falla si un archivo `.tsx` bajo `app/` o `components/` supera el presupuesto de líneas (250), salvo que esté en una allow-list `GRANDFATHERED`. La allow-list SHALL poder solo achicar: un archivo nuevo NO puede agregarse para evadir el gate, y un archivo grandfathered NO puede crecer por encima de su cap.

#### Scenario: Un componente nuevo dentro del presupuesto pasa

- GIVEN todos los `.tsx` de `app/` y `components/` con ≤ 250 líneas y allow-list vacía
- WHEN se corre `check:arch`
- THEN el gate pasa con código 0

#### Scenario: Un god-component nuevo es bloqueado

- GIVEN un `.tsx` nuevo de 300 líneas no presente en `GRANDFATHERED`
- WHEN se corre `check:arch`
- THEN el gate falla con código distinto de 0
- AND reporta el archivo y su conteo de líneas

### Requirement: ESLint Flat Configuration

El proyecto SHALL lintarse con ESLint via flat config (`eslint.config.mjs`) usando `eslint-config-next/core-web-vitals`, porque `next lint` fue removido en Next.js 16. El script `lint` SHALL ser `eslint .`. ESLint SHALL estar pineado a la línea 9.x (la 10.x rompe `eslint-plugin-react`).

#### Scenario: El comando lint corre sin el error de "next lint" removido

- GIVEN Next.js 16 (sin subcomando `lint`)
- WHEN se corre `pnpm lint`
- THEN ESLint evalúa el proyecto con la config de Next
- AND no aparece el error "Invalid project directory provided ... /lint"

### Requirement: Data Layer Test Coverage

El data layer (`lib/`) SHALL tener cobertura de tests unitarios. Vitest SHALL resolver el alias `@/` a la raíz del repo (con un patrón que NO afecte paquetes con scope `@…/…`). Los tests SHALL cubrir, como mínimo, la normalización de hrefs (`url`), el filtrado por visibilidad (`visibility`) incluyendo el contrato de que `private` nunca se expone, y la lógica de feeds (`feeds`).

#### Scenario: Un item private nunca se incluye, aunque se lo permita explícito

- GIVEN una lista con un item `visibility: "private"`
- WHEN se llama `filterByVisibility(items, ["public","org","private"], default)`
- THEN el item private NO aparece en el resultado

#### Scenario: El alias @/ resuelve sin romper paquetes con scope

- GIVEN un test que importa `@/lib/url`
- WHEN Vitest resuelve el import
- THEN carga `lib/url.ts` desde la raíz del repo
- AND los imports de paquetes `@scope/pkg` siguen resolviendo a `node_modules`
