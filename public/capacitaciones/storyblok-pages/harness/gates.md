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
TDD ──► Gates (3 en paralelo) ──► Barrier ──► Deploy (solo si todos passed)
                                     │
                            failed > 0 → status: "blocked" (fix + re-correr)
```

- **TDD** corre primero (gate liviano, local).
- **Gates** (code-review+SDD ‖ perf+CSP ‖ a11y+SEO) corren en `parallel()` — barrier natural.
- **Barrier** consolida. Si algún `passed:false` → `status: "blocked"` con findings + evidencia. NO deploy.
- **Deploy** solo **prepara** el comando alpha (no lo dispara sin confirmación). Prod siempre fuera.

## Por qué evidencia obligatoria

`feedback_no_mentir_pedir_help`: no se declara un gate verde sin la salida del comando / link / verify-grep que lo prueba. Un gate "passed" sin `evidence` es prosa, no un veredicto.
