# Capacitación · Consolidar el styling a Tailwind

> **Harness = skills.** Este curso se hace con Claude Code abierto. Cada lección usa skills MODO reales y casos del repo modo-landing. No es para leer y olvidar — es para ejecutar.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## Por qué existe este curso

modo-landing convivía con **tres sistemas CSS-in-JS al mismo tiempo**: Tailwind 3, Styled Components 5 y Emotion 11. Eso significa tres runtimes de styling, bundle más grande, SSR frágil y un blocker para la migración a Next.js 15. La consolidación a Tailwind-only resuelve todo eso — component-by-component, con skill auto-invoke como red de contención.

Este curso documenta la estrategia real que aplicamos en PR #1509 (Wave 2, 2026-05-28) y la extiende a un flujo repetible para cualquier componente del repo.

## Qué vas a saber hacer al terminar

1. Detectar qué sistema de styling usa cada componente (Tailwind, SC, Emotion, CSS modules).
2. Migrar un componente CSS-in-JS a Tailwind usando tokens del design system MODO.
3. Manejar props dinámicos, media queries y estados con clases condicionales.
4. Usar los tokens de `tailwind.config.js` sin hardcodear hex ni valores arbitrarios.
5. Migrar Tailwind 3 → 4 con `@config` backward-compat y los gotchas verificados.
6. Verificar la migración con Playwright visual regression sin snapshots.

## Learning path

| # | Lección | Skill harness | Lo que tocás |
|---|---------|---------------|--------------|
| 00 | [Los 3 sistemas](00-tres-sistemas.md) | `styled-components-to-tailwind` | Diagnóstico |
| 01 | [Estrategia](01-estrategia.md) | `styled-components-to-tailwind` | Plan de migración |
| 02 | [CSS-in-JS → utilities](02-css-in-js-a-utilities.md) | `styled-components-to-tailwind` | Mapeo de patrones |
| 03 | [Tokens + design system](03-tokens-design-system.md) | `tailwind-design-system` | Paleta SDK MODO |
| 04 | [Tailwind 3 → 4](04-tailwind-3-a-4.md) | `tailwind-3-to-4-migration` | Migración mayor |
| 05 | [Verify](05-verify.md) | `guardia`, Playwright | Visual regression |
| 🧪 | [Lab: migrar un componente](exercises/README.md) | todos | Integrador |

## Skills harness disponibles

```
/styled-components-to-tailwind   # auto-invoke al editar imports de SC/@emotion
/tailwind-3-to-4-migration       # usar post-consolidación de CSS-in-JS
/tailwind-design-system          # tokens, variantes, CVA
/guardia                         # gates completos incl. bundle + visual
```

## Reglas del equipo que este curso respeta

- **Sin hex hardcodeados** — tokens del design system o CSS variables del SDK.
- **Sin snapshots** — RTL semántico o Playwright.
- **Sin nuevas imports de SC o Emotion** tras la migración.
- **Sin `console.log/error/warn`** en prod.
- **Commits**: `type(COENXT-XXX): Subject`.
- **SonarCloud**: 0 new smells, 0 hotspots, ≤3% duplicación.

> Empezá por [00 · Los 3 sistemas](00-tres-sistemas.md).
