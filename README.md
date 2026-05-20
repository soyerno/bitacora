# modo-decks

Presentaciones HTML internas, catálogo de RFCs y stack de herramientas de modo-landing.

- Decks generados con la skill privada `modo-deck` (Claude Code, mantenida en `~/.claude/skills/`)
- Branding MODO: verde #008859, Red Hat Display + Quicksand, layout 16:9
- Navegación por teclado dentro de cada deck (← →, j/k, espacio, Home, End)
- Exportables a PDF (tecla P)
- Reacciones y comentarios por deck via Giscus (tecla `c` o botón 💬)

Los decks y RFCs son **propuestas** que buscan feedback y aprobación, no anuncian implementación. Cada cierre lista los equipos que deben opinar antes de avanzar.

## Live

https://soyernomodo.github.io/modo-decks/

4 páginas con nav y breadcrumbs compartidos:

- `/` — home con destacados de la semana y accesos a cada colección
- `/decks/` — catálogo de decks: búsqueda + tabs por status + chips por tema + sort
- `/rfcs/` — catálogo de RFCs: tabs por status + chips por área + saga de versiones colapsada
- `/herramientas/` — stack en Claude Code: 59 tools agrupadas en 8 categorías + búsqueda

Theme toggle (auto / claro / oscuro) persiste en `localStorage`. Desde cualquier deck individual hay un pill verde top-left ("← MODO presentaciones / Decks") que vuelve al sitio.

## Decks

11 presentaciones HTML versionadas en `decks/`. Workflow: `draft → rfc → completo` (la promoción es un `git mv` entre carpetas + update del badge en `decks/decks.json`). Catálogo en `decks/decks.json`, consumible por agentes.

Destacados:

- [Next 12 → 16 · Stack consolidation](decks/completo/nextjs-12-to-16-consolidation.html)
- [/comercios MVP shipped](decks/completo/comercios-mvp.html)
- [MODO for Agents · Pagos agénticos](decks/completo/modo-for-agents.html)
- [SEO Sprint 0 · Staging leaks](decks/completo/seo-sprint0.html)

## RFCs

19 documentos técnicos vivos en Google Drive y GitHub, curados y catalogados en `rfcs/rfcs.json` (consumible por agentes y por el landing sin parsear HTML). El catálogo en `/rfcs/` los renderiza con filtros por estado (`draft / rfc / completo / archivado`).

La saga "Migración modo-landing" colapsa 14 versiones en una sola entrada (la v6 más reciente), con las intermedias accesibles desde el toggle "+ N versiones anteriores".

## Cómo agrego un deck nuevo

Con la skill `modo-deck` instalada localmente:

1. Generar el HTML con Claude Code (la skill arma el deck respetando branding + Giscus snippet + back-link pill).
2. Publicar al repo:
   ```bash
   ~/.claude/skills/modo-deck/scripts/publish-deck.sh <preview.html> <slug> <draft|rfc|completo>
   ```
   El script rechaza el upload si encuentra `{{PLACEHOLDER}}` sin resolver.
3. Editar `decks/decks.json` (sumar la entrada) y commit + push a `main`. Pages publica en ~30s.

Promover un deck entre estados:
```bash
~/.claude/skills/modo-deck/scripts/promote-deck.sh <slug> <from> <to>
```

## Reacciones y comentarios (Giscus)

Cada deck tiene un drawer derecho con reacciones (👍 ❤️ 🚀) y comentarios via [Giscus](https://giscus.app). La data vive en las Discussions de este repo (categoría **Announcements**), no hay backend externo.

**UX:**
- Botón 💬 en la nav floating o tecla `c` → abre el drawer.
- Iframe **lazy-loaded** — solo carga al primer toggle, no afecta perf del deck.
- `Esc` o `c` lo cierra. Print/PDF lo oculta automáticamente.

**Thread por deck:**

`data-mapping="specific"` + `data-term=<slug>` (slug = basename del archivo sin `.html`). Cuando un deck se promueve `draft → rfc → completo` con `git mv`, el thread sigue al slug — no se pierde el hilo de feedback aunque cambie el path.

**Cómo se cablea:**

El snippet ya está en el template de la skill `modo-deck` (no es pública — vive en `~/.claude/skills/modo-deck/assets/template.html`), así que cualquier deck generado por ahí lo incluye automáticamente. `publish-deck.sh` rechaza el upload si encuentra `{{DECK_SLUG}}` sin resolver (evita que dos decks compartan thread por accidente).

Para retrofittear un deck ya publicado que no lo tenga (idempotente — si ya tiene Giscus, skip):

```bash
~/.claude/skills/modo-deck/scripts/add-giscus.py decks/<estado>/<slug>.html
```

**Config (one-time, ya hecha):**
- Discussions habilitadas en este repo
- App [giscus](https://github.com/apps/giscus) instalada con acceso a `SoyErnoModo/modo-decks`
- Pages source: `main` branch, root (CDN cachea con `max-age=600`)

**Kill switch por deck:** borrar el `<aside id="deck-reactions">`, el `<script>` que lo controla, y el botón `#toggle-comments` del HTML.

## Estructura

```
.
├── index.html               # Home (slim): destacados + nav a colecciones
├── assets/
│   ├── styles.css           # Tokens + componentes compartidos
│   ├── common.js            # Theme toggle + helpers compartidos
│   └── collection.js        # Controller search/filter/sort (decks + RFCs)
├── decks/
│   ├── index.html           # Catálogo de decks
│   ├── decks.json           # Data source del catálogo (consumible por agentes)
│   ├── draft/               # Decks en construcción
│   ├── rfc/                 # Decks circulando para feedback
│   └── completo/            # Decks shipped (cada uno con pill back-to-site)
├── rfcs/
│   ├── index.html           # Catálogo de RFCs
│   └── rfcs.json            # Data source curado del catálogo
├── herramientas/
│   └── index.html           # Stack en Claude Code
└── README.md
```

## Cómo sumar contenido

- **Deck nuevo**: ver "Cómo agrego un deck nuevo" arriba. Después sumá entrada a `decks/decks.json`.
- **RFC nuevo**: agregar entrada a `rfcs/rfcs.json` (campos: `number`, `slug`, `title`, `summary`, `status`, `area`, `date`, `drive_url` o `repo_url`).
- **Herramienta nueva**: editar `herramientas/index.html`, sumar un `<div class="tool-item" data-tool>...</div>` en la categoría correspondiente.
