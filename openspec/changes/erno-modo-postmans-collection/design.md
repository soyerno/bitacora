# Design: erno-modo postmans collection + footer refactor

## Architecture

Cuatro colecciones con la misma estructura canónica:

```
<root>/
  index.html                    home con explore-grid (4 cards) y featured
  decks/
    index.html · decks.json
  rfcs/
    index.html · rfcs.json
  herramientas/
    index.html                  (catálogo curado en HTML, no JSON)
  postmans/                     ← NUEVO
    index.html · postmans.json
  assets/
    collection.js               controlador genérico (no toca)
    common.js                   STATUS_LABELS (agrega 'local','qa','prod')
    nav-counts.js               targets cross-page (agrega postmans)
    styles.css                  status-badge colors (agrega local/qa/prod si falta)
```

## Data shape — `postmans/postmans.json`

```json
{
  "_meta": {
    "generated": "2026-05-20",
    "source": "URLs de prueba que uso para abrir pantallas con query strings",
    "notes": "MVP con seed de promos. Cada item es una URL parametrizada que abre una pantalla específica en modo.com.ar (o ambiente)."
  },
  "postmans": [
    {
      "id": "promos-detalle-merchant-bank",
      "title": "Promos · detalle de promo por merchant + bank",
      "desc": "Deep link al PDP de una promo con merchantId y bankId. Útil para validar branding del banco, copy del comercio y CTA.",
      "url": "https://modo.com.ar/promos?merchantId=<MERCHANT>&bankId=<BANK>",
      "env": "prod",
      "status": "prod",
      "category": "promos",
      "tags": ["promos", "deeplink"],
      "date": "2026-05-20",
      "params": [
        { "key": "merchantId", "example": "carrefour", "required": true },
        { "key": "bankId", "example": "santander", "required": true }
      ]
    },
    ...
  ]
}
```

### Campos canónicos
- `id` (string, kebab-case): unique slug
- `title` (string): título corto
- `desc` (string): descripción breve
- `url` (string): URL parametrizada (placeholders `<NAME>` para visibilidad)
- `env` (`prod` | `qa` | `develop` | `local`): ambiente target
- `status` (`local` | `qa` | `prod`): tab de filtro (=== env por convención en MVP)
- `category` (`promos` | `comercios` | `banks` | `sdk` | `home` | `other`): chip de filtro
- `tags` (string[]): extra search haystack
- `date` (YYYY-MM-DD): última actualización
- `params` (opcional): documenta los query strings que la URL acepta

## Stages por colección (workflow real)

| Colección | Stages (en `MODO.createCollection`) | Footer legend |
|---|---|---|
| Decks | `['draft', 'rfc', 'completo']` | `Draft → RFC → Completo` |
| RFCs | `['draft', 'rfc', 'completo', 'archivado']` | `Draft → RFC → Completo → Archivado` |
| Herramientas | n/a (no usa stages) | `MODO · AI · Externo` (rótulos descriptivos, no flujo temporal) |
| Postmans | `['local', 'qa', 'prod']` | `Local → QA → Prod` |

## CSS — status badges para postmans

`styles.css` ya tiene `.status-badge.draft`, `.rfc`, `.completo`, `.archivado`, `.urgent`. Faltan `.local`, `.qa`, `.prod`. Estrategia:

```css
/* Reusar paleta existente con nuevos selectores. */
.status-badge.local    { background: var(--draft-bg); color: var(--draft-fg); }
.status-badge.qa       { background: var(--rfc-bg);   color: var(--rfc-fg); }
.status-badge.prod     { background: var(--done-bg);  color: var(--done-fg); }
```

Trade-off: comparten tokens con draft/rfc/completo (no se distinguen visualmente entre colecciones). Es aceptable porque el contexto de la página ya indica de qué colección se trata. Si más adelante se quiere diferenciación, se introducen tokens dedicados `--env-local-bg`, etc.

## Footer pattern

Home (`index.html`): sin `workflow-legend`. Footer queda con sólo el `<div>Generados con … repo …</div>`.

Cada colección reemplaza el contenido de `.workflow-legend` con la legend que le corresponde:

```html
<!-- decks/index.html (sin cambios) -->
<div class="workflow-legend">
  <strong>Workflow:</strong>
  <span class="status-badge draft">Draft</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge rfc">RFC</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge completo">Completo</span>
</div>

<!-- rfcs/index.html -->
<div class="workflow-legend">
  <strong>Workflow:</strong>
  <span class="status-badge draft">Draft</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge rfc">RFC</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge completo">Completo</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge archivado">Archivado</span>
</div>

<!-- herramientas/index.html -->
<div class="workflow-legend">
  <strong>Agrupamiento:</strong>
  <span class="status-badge completo">MODO</span>
  <span class="workflow-arrow">·</span>
  <span class="status-badge rfc">AI</span>
  <span class="workflow-arrow">·</span>
  <span class="status-badge draft">Externo</span>
</div>

<!-- postmans/index.html -->
<div class="workflow-legend">
  <strong>Ambiente:</strong>
  <span class="status-badge local">Local</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge qa">QA</span>
  <span class="workflow-arrow">→</span>
  <span class="status-badge prod">Prod</span>
</div>
```

## Nav-counts integration

`assets/nav-counts.js` agrega:
```js
{ id: 'nav-count-postmans', url: BASE + 'postmans/postmans.json', key: 'postmans' }
```

## Explore grid (home)

`index.html` pasa de 3 a 4 `.explore-card`. Cada card mantiene el patrón eyebrow + title + desc + foot. Postmans:

```html
<a class="explore-card" href="postmans/">
  <span class="explore-card-eyebrow">Colección 3</span>
  <span class="explore-card-title">Postmans</span>
  <span class="explore-card-desc">Configuraciones de URLs de prueba que abren pantallas con query strings. Útil para QA de deep links, validar branding por banco y reproducir bugs reportados.</span>
  <span class="explore-card-foot">
    <span><span id="explore-count-postmans">…</span> postmans</span>
    <span class="explore-card-cta">Abrir →</span>
  </span>
</a>
```

Y se renumeran las cards: Decks = Colección 1, RFCs = Colección 2, Postmans = Colección 3, Herramientas pasa a ser "Stack" igual que hoy (no era una "colección" numerada, era un catálogo curado).

## Tradeoffs

| Decisión | Pro | Contra |
|---|---|---|
| Reusar tokens CSS draft/rfc/completo para local/qa/prod | Menos código, ship rápido | Visualmente no se distinguen entre colecciones |
| `status` === `env` en MVP | UX simple | Si más adelante un postman puede tener status independiente del env (ej: "deprecado en prod"), hay que separar |
| Card de Postmans = "Colección 3" | Consistente con decks/rfcs numerados | Renumera el orden de las cards en home (decks=1, rfcs=2, postmans=3) — pequeño visual diff |
| Postmans como seed con 2-3 items reales | El catálogo arranca útil | El proyecto del autor sigue TBD hasta confirmarlo |
