# Plan ejecutable

## Worktree map

| Task | Worktree | Branch | Agent | Estimate (con IA) |
|---|---|---|---|---|
| T1 — postmans.json seed | `/private/tmp/erno-modo-postmans` | `feat/postmans-collection` | main thread | 5 min |
| T2 — postmans/index.html | idem | idem | main thread | 8 min |
| T3 — common.js STATUS_LABELS | idem | idem | main thread | 1 min |
| T4 — styles.css badges | idem | idem | main thread | 2 min |
| T5 — nav-counts.js target | idem | idem | main thread | 1 min |
| T6 — home refactor | idem | idem | main thread | 5 min |
| T7 — decks nav | idem | idem | main thread | 1 min |
| T8 — rfcs nav + footer | idem | idem | main thread | 2 min |
| T9 — herramientas nav + footer | idem | idem | main thread | 2 min |
| T10 — visual verify | idem | idem | main thread + chrome-devtools MCP | 5 min |
| T11 — commit + push + PR | idem | idem | main thread | 3 min |

**Total estimate con IA**: 35-45 min wall-clock.

## Jira

No aplica — repo personal del autor (`SoyErnoModo/erno-modo`), no requiere ticket. Commit scope: `BITACORA`.

## Quality gates

- [ ] JSON válido (parseable con `python3 -m json.tool postmans/postmans.json`).
- [ ] Browser sin errores en consola en las 5 páginas.
- [ ] Mobile viewport (375) no rompe layout.
- [ ] Nav-count-postmans se popula en todas las páginas.
- [ ] Footer home sin workflow-legend.
- [ ] Cada colección con su footer correcto.

## Out of orchestration

- No se invoca `ruflo swarm` — scope chico, una rama, sin paralelismo real.
- Se delega a sub-agent SÓLO el verify visual con chrome-devtools MCP si el browser local no responde.
