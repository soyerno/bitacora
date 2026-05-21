# Proposal: erno-modo postmans collection + footer refactor

## Why

La bitácora `erno-modo` tiene hoy 3 colecciones (Decks, RFCs, Herramientas) que comparten un `workflow-legend` en el footer apuntando a `Draft → RFC → Completo`. Ese flujo aplica a Decks y RFCs, pero está repetido en home y en Herramientas — donde no aplica. Además, falta una cuarta colección para guardar **configuraciones de URLs de prueba** (lo que el equipo llama informalmente "postmans") que el autor usa para abrir pantallas con query strings — por ejemplo, deep links a `/promos` con `merchantId` + `bankId`. Hoy esas URLs viven en notas personales y se pierden.

## What

Tres cambios coordinados sobre `~/Documents/Proyectos/modo/erno-modo`:

1. **Footer refactor**: la `workflow-legend` deja de vivir en el footer del home y se especializa por colección con el flujo que le corresponda.
2. **Nueva colección `postmans/`**: cuarta colección con la misma estructura que decks/rfcs (carpeta + `index.html` + JSON manifest + nav link + explore card + nav-count).
3. **Primer item de postmans**: configuración real de URL tester para promos (placeholder con ejemplos reales — el path del proyecto del autor queda como TBD hasta confirmarlo).

## Scope

### In scope
- `index.html` (home): remover `workflow-legend` del footer, agregar 4ª card en `explore-grid`, actualizar nav.
- `decks/index.html`: footer ya OK con `Draft → RFC → Completo`. Actualizar nav para incluir Postmans.
- `rfcs/index.html`: footer pasa a `Draft → RFC → Completo → Archivado` (refleja stages reales en `rfcs.json`). Actualizar nav.
- `herramientas/index.html`: footer pasa a `MODO → AI → externo` (refleja el agrupamiento real del catálogo, sin pretender ser un workflow temporal). Actualizar nav.
- `postmans/index.html` (nuevo): página de listado con tabs por status (`local`, `qa`, `prod`).
- `postmans/postmans.json` (nuevo): manifest con primer item de URL tester de promos.
- `assets/nav-counts.js`: agregar target `nav-count-postmans` que lee `postmans/postmans.json`.
- `assets/styles.css`: no requiere tokens nuevos (reusa `.status-badge`, `.workflow-legend`, `.workflow-arrow`); sí define mapping de status `local/qa/prod` → background colors si los actuales no alcanzan.

### Out of scope
- Backfill del catálogo completo de URLs de prueba del autor. El item 1 funciona como seed; el resto entra en PRs siguientes.
- Cambios en `scripts/generate-contributions-svg.mjs`.
- `tools.json` auto-generado (R19 lo cubre separadamente).
- Cualquier cambio en `modo-landing` o repos relacionados.

## Approach

- Replicar el patrón ya canónico: cada colección es `<slug>/index.html` + `<slug>/<slug>.json` + sección `data-collection="<slug>"` + `MODO.createCollection({...})`.
- Para postmans, el `itemTpl` muestra: título, descripción, badge de status (local/qa/prod), URL de prueba con botón "abrir →" que dispara `target="_blank"`.
- El JSON acepta tanto items individuales (1 URL) como agrupados (familia con varias URLs), pero el MVP arranca con 1-URL-por-item para mantener la UX simple.
- Footer rule: home no tiene `workflow-legend`. Cada colección lleva la suya con `stages` que matchean su `MODO.createCollection({ stages })`.

## Success criteria

- [ ] Home no muestra `workflow-legend` (verificable abriendo `index.html` en browser).
- [ ] Cada colección muestra su workflow específico en el footer.
- [ ] Nav top en las 4 páginas muestra: Home · Decks · RFCs · Postmans · Herramientas (4 colecciones + home).
- [ ] `postmans/postmans.json` con al menos 1 item; carga sin errores.
- [ ] `nav-count-postmans` se popula en todas las páginas.
- [ ] Explore grid en home muestra 4 cards.
- [ ] `pnpm` / lint no aplica (sitio estático), pero `decks.json` y `rfcs.json` siguen siendo válidos (no regression).

## Risks & mitigations

| Riesgo | Mitigación |
|---|---|
| Status `local/qa/prod` no tiene tokens CSS definidos hoy | Agregar mapping a `:root` en `styles.css` si falta. Reutilizar `--draft-bg` para `local`, `--rfc-bg` para `qa`, `--done-bg` para `prod` como atajo si los colores cuadran. |
| Primer item TBD genera card vacía | Incluir 2-3 example URLs reales (modo.com.ar/promos con params típicos) como seed. El path del repo del autor se completa post-merge. |
| Renombre causa link rot en decks/rfcs (caso giscus 2026-05-20) | No hay rename; sólo agregado. No aplica. |
| Footer change rompe layout en mobile | Verificar en viewport 375 antes de mergear. |

## References

- Memoria: `reference_modo_decks_pages` — workflow `gh pr merge --squash --auto` para publicar.
- Memoria: `reference_giscus_repo_rename` — no aplica acá pero sirve de recordatorio sobre link rot.
- Stack actual: `index.html` L154-167 (footer home), `assets/collection.js` (controlador genérico), `assets/nav-counts.js` (counters cross-page).
