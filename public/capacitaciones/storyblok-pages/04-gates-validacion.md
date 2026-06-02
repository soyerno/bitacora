# 04 · Gates de validación

> Objetivo: la página/blok pasa los 4 gates antes de cualquier deploy. Un gate rojo bloquea. Sin "ya lo arreglo después".

Esta lección es la que el Workflow [`harness/page-builder.workflow.js`](harness/page-builder.workflow.js) corre en paralelo. Acá lo hacés a mano para entender cada uno. Criterio completo en [`harness/gates.md`](harness/gates.md).

## Gate 1 · TDD red→green

Ya cubierto en la [lección 03](03-tdd-red-green.md). Criterio: test escrito primero, `pnpm test` verde, sin snapshots, cada scenario de la spec con su `it`.

```bash
pnpm test
```

## Gate 2 · Code review + SDD

**Harness:** `guardia` (review paralelo multi-subagente) + SonarCloud MCP + `sdd-verify`.

```
/guardia            # review completo del PR (Sonar, tests, React, security, CI, bundle)
```

Criterio:
- SonarCloud Quality Gate: **0 new smells, 0 hotspots, ≤3% duplicación**.
- Sin `console.log/error/warn` en código de prod.
- Sin hex hardcodeado (tokens del design system).
- Tipos en todos los props.
- `sdd-verify`: implementación matchea spec + tasks tildadas.

> Sonar corre en olas: un fix puede activar otra regla. No declares "done" sin esperar el scan completo.

## Gate 3 · Performance + CSP

**Harness:** `chrome-devtools` (`lighthouse_audit`) + `frontend-security-checklist` (Layer 3, CSP post-deploy).

### Performance
```
# con chrome-devtools MCP, contra la ruta local o el alpha:
lighthouse_audit  → LCP, CLS, TBT
```
Criterio: LCP y CLS dentro de umbral. **Trampa modo-landing:** los bloks se rinden con `dynamic({ ssr:false })` ([`[[...slug]].jsx`](../../../) `DynamicCMSComponent`). Si tu blok es el LCP (hero), el `ssr:false` lo empeora — evaluá `priority`/SSR para el hero. No metas imágenes pesadas sin AVIF/`quality` ajustado.

### CSP
```
/modo-security-csp   # o frontend-security-checklist Layer 3
```
Criterio: CSP/security headers OK contra el edge live. Si tu blok carga assets de un dominio nuevo (CDN, fonts, media), agregalo a la directiva CSP correcta en `next.config.js`. Ojo con `data:`/`media-src` si usás Lottie/Remotion.

> Si tocaste `next.config.js` CSP o `headers()`, validá con Layer 3 contra el ambiente después del deploy.

## Gate 4 · a11y + SEO/GEO

**Harness:** `modo-seo-geo-audit` + checklist WCAG.

### a11y
Criterio: sin barreras WCAG. Imágenes con `alt` descriptivo (**nunca `alt=""`**), roles correctos, foco navegable, contraste con tokens MODO.

### SEO/GEO
```
/modo-seo-geo-audit
```
Criterio:
- `content.seo[0]` con title/description → lo rinde `CMSSEO`.
- JSON-LD válido (Rich Results). El catch-all ya inyecta breadcrumb + FAQ (de `SectionCollapsible`) + structured data extra. Si tu página es de un tipo nuevo (Service, Collection), seguí el patrón de `buildExtraStructuredData` en [`[[...slug]].jsx`](../../../).
- **URL-as-state**: si la página tiene filtros/categorías, cada estado debe ser una URL compartible e indexable.

## Orden recomendado

```
1. TDD          (local, rápido)         → pnpm test
2. Code review  (PR)                    → /guardia
3. a11y + SEO   (local/PR)              → /modo-seo-geo-audit
4. Perf + CSP   (contra alpha, lección 05) → lighthouse + Layer 3
```

Perf y CSP rinden mejor contra un ambiente desplegado → se cierran junto con el deploy alpha de la lección 05.

## Atajo: todos en paralelo

```
/modo-landing-page-builder    # corre el Workflow: gates en paralelo + barrier pre-deploy
```

## Checklist de salida

- [ ] `pnpm test` verde (TDD)
- [ ] `/guardia` + Sonar Quality Gate verde · `sdd-verify` OK
- [ ] Lighthouse dentro de umbral · CSP/headers OK
- [ ] a11y sin barreras · JSON-LD válido · SEO ok

> Siguiente: [05 · Deploy alpha a playsistemico](05-deploy-alpha-playsistemico.md)
