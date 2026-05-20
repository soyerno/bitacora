# erno-modo

**Erno × MODO** — mis contribuciones a modo-landing. Decks HTML, catálogo de RFCs, stack de herramientas en Claude Code y skills custom descargables.

El contenido vive en `decks/`, `rfcs/rfcs.json`, `herramientas/` y `skills/`; este README describe **cómo funciona el sistema**, no qué hay (eso se ve en el [landing](https://soyernomodo.github.io/erno-modo/)).

- Decks generados con la skill `modo-deck` (Claude Code, vive en `~/.claude/skills/`)
- Branding: verde MODO #008859, Red Hat Display + Quicksand, layout 16:9
- Navegación por teclado dentro de cada deck (← →, j/k, espacio, Home, End) + export PDF (tecla P)
- Reacciones y comentarios por deck via Giscus (tecla `c` o botón 💬)
- Skills custom MODO empaquetadas como ZIPs en `skills/`, regeneradas a diario por el skill `erno-modo-sync-all`

Los decks y RFCs son **propuestas** que buscan feedback, no anuncios de implementación. Cada cierre lista los equipos que deben opinar antes de avanzar.

## Live

https://soyernomodo.github.io/erno-modo/

4 páginas con header alineado al ancho del contenido y breadcrumbs:

- `/` — home: destacados + widget GitHub + accesos a cada colección
- `/decks/` — catálogo de decks (búsqueda + tabs por status + chips por tema + sort)
- `/rfcs/` — catálogo de RFCs (tabs por status + chips por área + saga de versiones colapsada)
- `/herramientas/` — stack en Claude Code (tools agrupadas en 8 categorías + búsqueda + badges `↓ .skill` para descargar)

Theme toggle (auto / claro / oscuro) persiste en `localStorage`. Desde cualquier deck individual hay un pill verde top-left ("← Erno × MODO / Decks") que vuelve al sitio.

## Skills descargables (custom MODO)

Las herramientas con el badge `↓ .skill` en `/herramientas/` son skills custom que se distribuyen como ZIPs en `skills/`. Cada ZIP contiene una carpeta `<name>.skill/` con `SKILL.md` + assets. Manifest curado en [`skills/skills.json`](skills/skills.json) (consumible por agentes).

Instalar un skill:

```bash
curl -L -o /tmp/modo-deck.zip https://soyernomodo.github.io/erno-modo/skills/modo-deck.zip
unzip /tmp/modo-deck.zip -d ~/.claude/skills/
mv ~/.claude/skills/modo-deck.skill ~/.claude/skills/modo-deck
```

(El `mv` es porque Claude Code espera la carpeta sin extensión `.skill`.)

## erno-modo-sync-all

Skill local (`~/.claude/skills/erno-modo-sync-all/`) que mantiene el sitio en sync con el filesystem real:

1. Re-empaqueta las skills custom MODO si su contenido cambió (hash sha256)
2. Regenera `skills/skills.json` con tamaños + hashes nuevos
3. Revalida `decks/decks.json` contra el filesystem (slide counts)
4. Commitea + pushea solo si hay diffs

**Manual:**
```bash
python3 ~/.claude/skills/erno-modo-sync-all/scripts/sync.py
# o desde Claude Code:
/erno-modo-sync-all
```

**Cron diario a las 18:00** (LaunchAgent en macOS):
```bash
~/.claude/skills/erno-modo-sync-all/scripts/install-cron.sh
```

Crea `~/Library/LaunchAgents/com.ernomodo.sync.plist` con `StartCalendarInterval Hour=18`. Logs en `~/.claude/skills/erno-modo-sync-all/sync.{out,err}.log`. Idempotente: si nada cambió, no hay commit.

## Cómo se publica un deck

Con la skill `modo-deck` instalada localmente:

1. Generar el HTML con Claude Code (la skill arma el deck respetando branding + snippet de Giscus + back-link pill).
2. Publicar:
   ```bash
   ~/.claude/skills/modo-deck/scripts/publish-deck.sh <preview.html> <slug> <draft|rfc|completo>
   ```
   El script rechaza el upload si encuentra `{{PLACEHOLDER}}` sin resolver.
3. Sumar entrada a `decks/decks.json` (data source del catálogo) y commit + push a `main`. Pages publica en ~30s. El cron de `erno-modo-sync-all` también lo va a recalcular esa noche.

Promover entre estados:
```bash
~/.claude/skills/modo-deck/scripts/promote-deck.sh <slug> <from> <to>
```

## RFCs

Catálogo curado en `rfcs/rfcs.json` (formato consumible por agentes y por el landing sin parsear HTML). Los RFCs viven en Google Drive (`drive_url`) o GitHub (`repo_url`) — el JSON solo guarda metadata + link.

## Reacciones y comentarios (Giscus)

Cada deck tiene un drawer derecho con reacciones (👍 ❤️ 🚀) y comentarios via [Giscus](https://giscus.app). La data vive en las Discussions de este repo (categoría **Announcements**), no hay backend externo.

**UX:**
- Botón 💬 en la nav floating o tecla `c` → abre el drawer.
- Iframe **lazy-loaded** — solo carga al primer toggle, no afecta perf del deck.
- `Esc` o `c` lo cierra. Print/PDF lo oculta automáticamente.

**Thread por deck:**

`data-mapping="specific"` + `data-term=<slug>` (slug = basename del archivo sin `.html`). Cuando un deck se promueve `draft → rfc → completo` con `git mv`, el thread sigue al slug — no se pierde el hilo de feedback.

**Config (one-time, ya hecha):**
- Discussions habilitadas en el repo
- App [giscus](https://github.com/apps/giscus) instalada con acceso a `SoyErnoModo/erno-modo`
- Pages source: `main` branch, root (CDN cachea con `max-age=600`)

**Kill switch por deck:** borrar el `<aside id="deck-reactions">`, el `<script>` que lo controla, y el botón `#toggle-comments` del HTML.

## Estructura

```
.
├── index.html               # Home (slim): featured + GH widget + nav a colecciones
├── assets/
│   ├── styles.css           # Tokens + componentes compartidos (Erno × MODO)
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
├── skills/
│   ├── skills.json          # Manifest de skills custom descargables
│   └── <name>.zip           # Bundle de cada skill custom MODO
└── README.md
```

## Cómo sumar contenido

- **Deck nuevo**: ver "Cómo se publica un deck" arriba. Después sumá entrada a `decks/decks.json`.
- **RFC nuevo**: agregar entrada a `rfcs/rfcs.json` (campos: `number`, `slug`, `title`, `summary`, `status`, `area`, `date`, `drive_url` o `repo_url`).
- **Herramienta nueva**: editar `herramientas/index.html`, sumar un `<div class="tool-item" data-tool>...</div>` en la categoría correspondiente. Si es custom y querés que sea descargable, agregala a la lista `CUSTOM_SKILLS` en `~/.claude/skills/erno-modo-sync-all/scripts/sync.py` y corré el sync.

## Branding

El wordmark del header es de tres piezas:

- `Erno` — Quicksand 700, ink color (negro o blanco según tema)
- `×` — Quicksand 500, muted (gris)
- `MODO` — Quicksand 700, verde #008859 (variable `--accent`)

En decks individuales el back-link pill replica el orden: "← Erno × MODO / Decks", verde MODO sobre fondo blanco translúcido con backdrop-blur.
