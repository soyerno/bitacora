# 07 · Harness de gates

> Objetivo: montar gates que no te dejan mergear basura —rápidos en el commit, completos en CI— y que gatean el código **tocado** sin castigar la deuda preexistente. Y entender que un check verde no es una prueba de correctitud.

---

## La filosofía: rápido local, completo en CI

Dos velocidades:

- **Pre-commit** (local, < pocos segundos): solo lo que toca tu commit. Tiene que ser rápido o lo vas a saltear.
- **CI** (al pushear/PR): lo completo (build, lint full, typecheck full). Más lento, corre en la nube.

El pre-commit no reemplaza al CI; lo **adelanta** para los errores baratos de atrapar temprano.

---

## El pre-commit harness (husky + lint-staged + validate)

```
.husky/pre-commit  →  1) lint-staged    # eslint --fix SOLO en archivos staged
                      2) npm run validate # typecheck:src + check:arch + test:unit
```

- **`lint-staged`** corre `eslint --fix` solo en lo staged. Gatea el código tocado **sin castigar la deuda de lint preexistente** (CI marca el `lint` full como `continue-on-error`).
- **`validate`** agrega: typecheck acotado + gate de arquitectura + tests unit.

### Notas de scope (deliberadas, no atajos)

> **Trampa del typecheck envenenado**: el `tsc` completo local se envenena con los tipos generados de `.next` que quedan stale. Por eso `typecheck:src` usa un `tsconfig.precommit.json` acotado a `src/` que excluye `.next`. El typecheck completo lo regenera el CI con `next build`.

- `test:unit` corre solo el project jsdom (no el de Storybook/browser) — rápido.
- Emergencia: `git commit --no-verify` saltea el gate. El build/CI cubre lo completo igual.

---

## El gate de arquitectura (component-size-gate)

`check:arch` falla si un archivo de UI supera un presupuesto de líneas (ej. 400). Con una **allow-list grandfathered que solo puede achicar**: los god-components que ya existen están exceptuados, pero ninguno nuevo puede nacer, y migrar uno fuera de la lista es boy-scout (lo dejás mejor que como lo encontraste).

```
❌ big-bang: "refactoricemos los 7 god-components hoy"
✅ boy-scout: "el gate frena los nuevos; los viejos se achican cuando los tocás"
```

> Esto evita el dilema de todo-o-nada: no necesitás un refactor masivo para empezar a frenar la deuda nueva.

---

## Los otros gates del harness

| Gate | Qué prueba |
|------|-----------|
| `check:feature-coverage` / `-citations` | El contrato de flags ([Lección 06](06-feature-flags.md)) |
| `check:ai-parity` | El asistente IA + los agentes MCP cubren toda funcionalidad nueva |
| `pr-lint` | El PR tiene Pain/Purpose/How + metadata + 🏁 Hito |
| `commit-lint` | Conventional Commits |
| `release-on-merge` | semantic-release: cada merge a `main` → bump + tag + GitHub Release + CHANGELOG |

> **Gotchas de release-on-merge**: (1) deshabilitar el hook de commit **dentro** del job de release (`HUSKY=0`) o el job se cuelga; (2) la race entre merges paralelos —dos PRs mergeando casi a la vez pueden pelear por el tag—.

---

## La regla que hace honesto al harness

> Un check verde prueba lo que el check mide, **no** que el cambio sea correcto. El `feature-citations` prueba que la cita existe, no que el runtime gatea. El `test:unit` prueba lo que testeaste, no lo que olvidaste testear.

El harness es una red de seguridad, no un certificado de calidad. Sigue valiendo la regla de honestidad de la [Lección 00](00-mentalidad.md): corré la app, mirá el comportamiento real, no declares "done" porque el check está verde.

---

## Checklist de salida

- [ ] Pre-commit rápido: `lint-staged` (solo staged) + `validate` (typecheck:src + arch + test:unit)
- [ ] El typecheck local está acotado (no se envenena con `.next` stale)
- [ ] CI corre lo completo (build, lint full, typecheck full)
- [ ] El gate de arquitectura frena god-components nuevos con allow-list que solo achica
- [ ] Los gates de flags / parity / pr-lint / commit-lint están en el pipeline
- [ ] release-on-merge configurado con `HUSKY=0` en el job y consciente de la race
- [ ] Tenés claro que verde ≠ correcto: verificás el comportamiento real igual

> Siguiente: [08 · Pipeline de PRs](08-pipeline-prs.md)
