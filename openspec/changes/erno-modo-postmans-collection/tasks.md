# Tasks: erno-modo postmans collection + footer refactor

Orden TDD-first: cada task termina con verificación visual en browser (sitio estático, no hay tests automatizados).

## T1 · postmans/postmans.json (seed)

**Output**: archivo JSON con 3 items reales de URLs de promos + 1 placeholder para el proyecto del autor.

**Acceptance**:
- JSON válido (parseable).
- `_meta.generated` = `2026-05-20`.
- Schema cumple `design.md` (id, title, desc, url, env, status, category, tags, date, params).
- Al menos un item por status (local, qa, prod).

## T2 · postmans/index.html

**Output**: página de listado replicando el patrón de `rfcs/index.html`.

**Acceptance**:
- Head + body + scripts idénticos al patrón (theme toggle, common.js, collection.js, nav-counts.js, deck-bionic).
- `data-collection="postmans"`.
- `stages=['local','qa','prod']`.
- `getTopics` devuelve `[item.category]`.
- `itemTpl` muestra título, desc, badge de status, chips de category, botón "abrir →" con `target="_blank"`.
- Footer con `workflow-legend` específica de postmans (Local → QA → Prod).
- Nav top incluye Postmans con `aria-current="page"`.

## T3 · assets/common.js — agregar STATUS_LABELS

**Output**: append a `MODO.STATUS_LABELS`:
```js
local: 'Local',
qa: 'QA',
prod: 'Prod'
```

**Acceptance**: no rompe los labels existentes; los nuevos aparecen en tabs de postmans.

## T4 · assets/styles.css — badges local/qa/prod

**Output**: 3 selectores nuevos reusando tokens existentes.

**Acceptance**:
- `.status-badge.local`, `.status-badge.qa`, `.status-badge.prod` definidos.
- No tocan otros selectores.
- Visual verificado: el badge se ve consistente con los de draft/rfc/completo.

## T5 · assets/nav-counts.js — agregar target postmans

**Output**: agregar entry al array `targets`.

**Acceptance**:
- `#nav-count-postmans` se popula en home, decks, rfcs, herramientas, postmans.
- No rompe nav-count-decks / nav-count-rfcs.

## T6 · index.html (home) — remover workflow-legend + agregar 4ª card + nav

**Output**:
1. Borrar `<div class="workflow-legend">…</div>` del footer.
2. Agregar 4ª card "Postmans" en `.explore-grid`.
3. Agregar `<a href="postmans/">Postmans <span class="nav-count" id="nav-count-postmans">·</span></a>` al `<nav class="nav">`.
4. Renumerar eyebrows: Decks = "Colección 1", RFCs = "Colección 2", Postmans = "Colección 3", Herramientas = "Stack" (sin cambio).
5. Actualizar el script de explore-count para incluir postmans.

**Acceptance**:
- Home renderiza sin error.
- Footer queda con sólo el div de "Generados con …".
- 4 cards visibles en explore-grid.
- Nav muestra 5 entries (Home · Decks · RFCs · Postmans · Herramientas).

## T7 · decks/index.html — nav update

**Output**: agregar Postmans entre RFCs y Herramientas en el nav. Footer NO cambia (Draft → RFC → Completo es correcto para decks).

**Acceptance**: nav consistente con home; footer intacto.

## T8 · rfcs/index.html — nav update + footer update

**Output**:
1. Agregar Postmans en nav.
2. Cambiar footer `workflow-legend` para incluir Archivado (`Draft → RFC → Completo → Archivado`).

**Acceptance**: nav + footer reflejan el flujo real de RFCs (rfcs.json incluye items con status="archivado").

## T9 · herramientas/index.html — nav update + footer update

**Output**:
1. Agregar Postmans en nav.
2. Cambiar footer `workflow-legend` a "Agrupamiento: MODO · AI · Externo" (rótulos descriptivos, no temporal).

**Acceptance**: nav + footer reflejan el agrupamiento del catálogo (no pretende ser un workflow temporal).

## T10 · Visual verify en browser

**Output**: abrir las 5 páginas y verificar:
- Layout no roto en viewport desktop (1280) ni mobile (375).
- Theme toggle funciona en las 4 páginas.
- Nav-count-postmans muestra el número correcto.
- Click en card de Postmans desde home navega a `postmans/`.
- Click en un item postman abre URL en pestaña nueva.

**Acceptance**: todo funciona; capturas opcionales para PR.

## T11 · Commit + push + PR

**Output**:
- `export PATH="/opt/homebrew/bin:$PATH"` antes de commit firmado.
- Un commit por task agrupable (puede ser uno sólo si la suite es atómica):
  - `feat(BITACORA): postmans collection + footer refactor por collection`
- Push a `feat/postmans-collection`.
- PR con descripción que linkea a `openspec/changes/erno-modo-postmans-collection/`.

**Acceptance**: PR abierto, CI verde, ready for review.

## T12 · Post-merge (después de aprobación)

- Squash merge a main.
- GitHub Action de erno-modo regenera `decks.json` / `rfcs.json` / `skills.json` (postmans.json es nuevo y no entra al sync automático todavía — manual hasta que tenga un sync script en R19).
