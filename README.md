# modo-decks

Presentaciones HTML internas + catálogo de RFCs de modo-landing.

- Decks generados con la skill `modo-deck` (Claude Code)
- Branding MODO: verde #008859, Red Hat Display + Quicksand, layout 16:9
- Navegacion por teclado (← →, j/k, espacio, Home, End)
- Exportables a PDF (tecla P)
- Reacciones y comentarios por deck via Giscus (tecla `c` o botón 💬)

## Decks

11 presentaciones HTML versionadas en `decks/`. Workflow: draft → rfc → completo. Ver `index.html` para el listado completo y filtros.

Destacados:
- [Next 12 → 16 · Stack consolidation](decks/completo/nextjs-12-to-16-consolidation.html)
- [/comercios MVP shipped](decks/completo/comercios-mvp.html)
- [MODO for Agents · Pagos agénticos](decks/completo/modo-for-agents.html)
- [SEO Sprint 0 · Staging leaks](decks/completo/seo-sprint0.html)

## RFCs

18 documentos técnicos vivos en Google Drive, deduplicados y catalogados en `rfcs/rfcs.json` (consumible por agentes sin parsear HTML). El landing los renderiza con filtros por estado (rfc / completo / archivado).

La saga "Migración modo-landing" colapsa 14 versiones en una sola entrada (la v6 más reciente), con las versiones intermedias accesibles desde el toggle "+ N versiones anteriores".

## Live

https://soyernomodo.github.io/modo-decks/

El index trae búsqueda full-text, filtros por tema/área, tabs por status, sort por recencia, y theme toggle (auto / claro / oscuro) con persistencia en `localStorage`.

## Reacciones y comentarios (Giscus)

Cada deck tiene un drawer derecho con reacciones (👍 ❤️ 🚀) y comentarios via [Giscus](https://giscus.app). La data vive en las Discussions de este repo (categoría **Announcements**), no hay backend externo.

**UX:**
- Botón 💬 en la nav floating o tecla `c` → abre el drawer.
- Iframe **lazy-loaded** — solo carga al primer toggle, no afecta perf del deck.
- `Esc` o `c` lo cierra. Print/PDF lo oculta automáticamente.

**Thread por deck:**

`data-mapping="specific"` + `data-term=<slug>` (slug = basename del archivo sin `.html`). Cuando un deck se promueve `draft → rfc → completo` con `git mv`, el thread sigue al slug — no se pierde el hilo de feedback aunque cambie el path.

**Cómo se cablea:**

El snippet ya está en el template del skill `modo-deck` (`~/.claude/skills/modo-deck/assets/template.html`), así que cualquier deck nuevo lo incluye automáticamente. `publish-deck.sh` rechaza el upload si encuentra `{{DECK_SLUG}}` sin resolver (evita que dos decks compartan thread).

Para retrofittear un deck publicado que no lo tenga (idempotente — si ya tiene Giscus, skip):

```bash
~/.claude/skills/modo-deck/scripts/add-giscus.py decks/<estado>/<slug>.html
```

**Config (one-time, ya hecha):**
- Discussions habilitadas en este repo
- App [giscus](https://github.com/apps/giscus) instalada con acceso a `SoyErnoModo/modo-decks`
- Pages source: `main` branch, root (CDN cachea con `max-age=600`)

**Kill switch por deck:** borrar el `<aside id="deck-reactions">`, el `<script>` que lo controla, y el botón `#toggle-comments` del HTML.

## Voz / comms

Los decks y RFCs son propuestas que buscan feedback y aprobación, no anuncian implementación. Cada cierre lista los equipos que deben opinar antes de avanzar.

## Estructura

```
.
├── index.html          # Landing con decks + catálogo de RFCs
├── decks/
│   ├── draft/          # Decks en construcción
│   ├── rfc/            # Decks circulando para feedback
│   └── completo/       # Decks shipped
├── rfcs/
│   └── rfcs.json       # Catálogo curado de RFCs (data source del index.html)
└── README.md
```
