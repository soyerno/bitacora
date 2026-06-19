# Harness · Los 4 gates

Referencia ejecutable de [`page-builder.workflow.js`](page-builder.workflow.js). Cada gate retorna `{ gate, passed, findings, evidence }`. **El deploy alpha es un barrier: solo procede si todos `passed`.** Sin evidencia ≠ passed.

| Gate | Skill / herramienta | Comando | Passed cuando | Evidencia |
|------|---------------------|---------|---------------|-----------|
| **TDD** | `test-driven-development` | `pnpm test` · `npx jest <path>` | test escrito antes (red visto), verde ahora, RTL semántico, **sin snapshots**, scenario↔it | salida jest + commit del test previo |
| **Code review + SDD** | `guardia` + SonarCloud + `sdd-verify` | `/guardia` | 0 smells, 0 hotspots, ≤3% dup, sin `console.*`, sin hex, tipos; spec↔código; tasks tildadas | link Quality Gate + reporte |
| **Performance + CSP** | `chrome-devtools` + `frontend-security-checklist` L3 | `lighthouse_audit <url>` · `/modo-security-csp` | LCP/CLS en umbral; CSP/headers OK; blok no es LCP con `ssr:false` | reporte lighthouse + validador CSP |
| **a11y + SEO/GEO** | `modo-seo-geo-audit` | `/modo-seo-geo-audit` | sin barreras WCAG (alt, roles, foco, contraste); `seo[0]`; JSON-LD válido; URL-as-state | reporte audit + Rich Results |

## Correr el Workflow

```
# vía el skill (recomendado)
/modo-landing-page-builder

# o directo con la tool Workflow, pasando args:
Workflow({
  scriptPath: ".../harness/page-builder.workflow.js",
  args: {
    repoPath: "/ruta/modo-landing",
    slug: "promos/black-friday",
    blok: "SectionPromoBanner",
    alphaUrl: null,           // o "https://<alpha-host>/promos/black-friday"
    prNumber: null            // o el número de PR
  }
})
```

## Flujo del Workflow

```
TDD ─► Gates (3 en paralelo) ─► Barrier ─► Eval (LLM-judge) ─► Deploy (gates+eval ok)
                                  │              │
                         failed>0 → blocked   under-threshold → blocked (fix + re-correr)
```

- **TDD** corre primero (gate liviano, local).
- **Gates** (code-review+SDD ‖ perf+CSP ‖ a11y+SEO) corren en `parallel()` — barrier natural.
- **Barrier** consolida. Si algún `passed:false` → `status: "blocked"` con findings + evidencia. NO deploy.
- **Eval** (capa 6.5): un LLM-judge puntúa el **entregable** 1-5 por dimensión de la rúbrica MODO. Pass/fail dice "¿pasa?"; el eval dice "¿cuán bien quedó?".
- **Deploy** solo **prepara** el comando alpha (no lo dispara sin confirmación). Prod siempre fuera.

## El eval del entregable (capa 6.5)

Los gates son binarios; el eval **puntúa calidad** en lo que el binario no ve. Rúbrica (1-5, `parallel()` un judge por dimensión, schema `EVAL_SCHEMA`):

| Dimensión | Mide | `blocking` si… |
|---|---|---|
| `brand-voice` | copy en voz MODO + tokens/fidelidad de marca | hex hardcodeado o copy fuera de voz |
| `ux-clarity` | jerarquía, flujo, carga cognitiva, mobile | hay una barrera de uso real |
| `content-seo-quality` | calidad del contenido + completitud SEO/GEO | falta JSON-LD o metadata core |
| `simplicity-scope` | mínimo que resuelve, diff quirúrgico (Principio 2) | un senior lo llamaría sobre-complicado |

**Barrier del eval**: deploy solo si **cada dimensión ≥ 3 Y promedio ≥ 4**. Si no → `status: "blocked"` con los blockers + razones (los gates pasaron, pero la calidad no llega).

> Para review adversarial más duro, cambiá el judge plano por el skill `judgment-day` (dual blind) o los agents `review-risk/readability/reliability/resilience`.

## Calibración del eval (Lección 10)

Un eval sin calibrar es una opinión más. La calibración mide **si el judge coincide con tu veredicto humano** a lo largo del tiempo —cuando divergen, ahí está el aprendizaje—. El Workflow corre sin filesystem, así que esto vive en un helper standalone: [`calibration.mjs`](calibration.mjs).

```bash
# después del eval + tu review, registrá la corrida (judge = scores del eval; self = auto-score del agente; human = tu 1-5)
node calibration.mjs add --slug "promos/black-friday" \
  --judge '{"brand-voice":4,"ux-clarity":5,"content-seo-quality":4,"simplicity-scope":3}' \
  --self 4 --human 3 --note "copy genérico en el hero"

# ver la calibración acumulada (error abs medio judge↔human; ✓ si ≤0.5)
node calibration.mjs stats
```

- Dataset append-only `calibration.jsonl` (local, gitignored — no se versiona).
- `stats` reporta el error abs medio judge↔human y self↔human, y lista las divergencias ≥1.
- Si el judge diverge sistemático del humano → ajustá la rúbrica o el umbral. Esa es la mejora del propio eval.

## Por qué evidencia obligatoria

`feedback_no_mentir_pedir_help`: no se declara un gate verde sin la salida del comando / link / verify-grep que lo prueba. Un gate "passed" sin `evidence` es prosa, no un veredicto.
