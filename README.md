# modo-decks

Sistema de publicación de presentaciones HTML, catálogo de RFCs y stack de herramientas de modo-landing. El contenido vive en `decks/`, `rfcs/rfcs.json` y `herramientas/`; este README describe **cómo funciona el sistema**, no qué decks / RFCs / herramientas hay (eso se ve en el [landing](https://soyernomodo.github.io/modo-decks/)).

- Decks generados con la skill privada `modo-deck` (Claude Code, vive en `~/.claude/skills/`)
- Branding MODO: verde #008859, Red Hat Display + Quicksand, layout 16:9
- Navegación por teclado dentro de cada deck (← →, j/k, espacio, Home, End) + export PDF (tecla P)
- Reacciones y comentarios por deck via Giscus (tecla `c` o botón 💬)

Los decks y RFCs son **propuestas** que buscan feedback, no anuncios de implementación. Cada cierre lista los equipos que deben opinar antes de avanzar.

## Live

https://soyernomodo.github.io/modo-decks/

4 páginas con nav y breadcrumbs compartidos:

- `/` — home: destacados + accesos a cada colección
- `/decks/` — catálogo de decks (búsqueda + tabs por status + chips por tema + sort)
- `/rfcs/` — catálogo de RFCs (tabs por status + chips por área + saga de versiones colapsada)
- `/herramientas/` — stack en Claude Code (tools agrupadas en categorías + búsqueda)

Theme toggle (auto / claro / oscuro) persiste en `localStorage`. Desde cualquier deck individual hay un pill verde top-left ("← MODO presentaciones / Decks") que vuelve al sitio.

## Cómo se publica un deck

Con la skill `modo-deck` instalada localmente:

1. Generar el HTML con Claude Code (la skill arma el deck respetando branding + snippet de Giscus + back-link pill).
2. Publicar:
   ```bash
   ~/.claude/skills/modo-deck/scripts/publish-deck.sh <preview.html> <slug> <draft|rfc|completo>
   ```
   El script rechaza el upload si encuentra `{{PLACEHOLDER}}` sin resolver.
3. Sumar entrada a `decks/decks.json` (data source del catálogo) y commit + push a `main`. Pages publica en ~30s.

Promover entre estados:
```bash
~/.claude/skills/modo-deck/scripts/promote-deck.sh <slug> <from> <to>
```

## RFCs

Catálogo curado en `rfcs/rfcs.json` (formato consumible por agentes y por el landing sin parsear HTML). Los RFCs viven en Google Drive o GitHub — el JSON solo guarda metadata + link.

## Reacciones y comentarios (Giscus)

Cada deck tiene un drawer derecho con reacciones (👍 ❤️ 🚀) y comentarios via [Giscus](https://giscus.app). La data vive en las Discussions de este repo (categoría **Announcements**), no hay backend externo.

**UX:**
- Botón 💬 en la nav floating o tecla `c` → abre el drawer.
- Iframe **lazy-loaded** — solo carga al primer toggle, no afecta perf del deck.
- `Esc` o `c` lo cierra. Print/PDF lo oculta automáticamente.

**Thread por deck:**

`data-mapping="specific"` + `data-term=<slug>` (slug = basename del archivo sin `.html`). Cuando un deck se promueve `draft → rfc → completo` con `git mv`, el thread sigue al slug — no se pierde el hilo de feedback aunque cambie el path.

**Cómo se cablea:**

El snippet ya está en el template de la skill `modo-deck` (`~/.claude/skills/modo-deck/assets/template.html`), así que cualquier deck nuevo lo incluye automáticamente. `publish-deck.sh` rechaza el upload si encuentra `{{DECK_SLUG}}` sin resolver (evita que dos decks compartan thread por accidente).

Para retrofittear un deck publicado que no lo tenga (idempotente — si ya tiene Giscus, skip):

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

- **Deck nuevo**: ver "Cómo se publica un deck" arriba. Después sumá entrada a `decks/decks.json`.
- **RFC nuevo**: agregar entrada a `rfcs/rfcs.json` (campos: `number`, `slug`, `title`, `summary`, `status`, `area`, `date`, `drive_url` o `repo_url`).
- **Herramienta nueva**: editar `herramientas/index.html`, sumar un `<div class="tool-item" data-tool>...</div>` en la categoría correspondiente.
