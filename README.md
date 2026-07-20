# erno-bitacora

**Erno × bitacora** — mis contribuciones a bitacora-landing. Decks HTML, catálogo de RFCs, stack de herramientas en Claude Code y skills custom descargables.

El contenido vive en `decks/`, `rfcs/rfcs.json`, `herramientas/` y `skills/`; este README describe **cómo funciona el sistema**, no qué hay (eso se ve en el [landing](https://soyernobitacora.github.io/erno-bitacora/)).

- Decks generados con la skill `bitacora-deck` (Claude Code, vive en `~/.claude/skills/`)
- Branding: verde bitacora #008859, Red Hat Display + Quicksand, layout 16:9
- Navegación por teclado dentro de cada deck (← →, j/k, espacio, Home, End) + export PDF (tecla P)
- Reacciones y comentarios por deck via Giscus (tecla `c` o botón 💬)
- Skills custom bitacora empaquetadas como ZIPs en `skills/`, regeneradas a diario por el skill `erno-bitacora-sync-all`

Los decks y RFCs son **propuestas** que buscan feedback, no anuncios de implementación. Cada cierre lista los equipos que deben opinar antes de avanzar.

## Live

https://soyernobitacora.github.io/erno-bitacora/

4 páginas con header alineado al ancho del contenido y breadcrumbs:

- `/` — home: destacados + widget GitHub + accesos a cada colección
- `/decks/` — catálogo de decks (búsqueda + tabs por status + chips por tema + sort)
- `/rfcs/` — catálogo de RFCs (tabs por status + chips por área + saga de versiones colapsada)
- `/herramientas/` — stack en Claude Code (tools agrupadas en 8 categorías + búsqueda + badges `↓ .skill` para descargar)

Theme toggle (auto / claro / oscuro) persiste en `localStorage`. Desde cualquier deck individual hay un pill verde top-left ("← Erno × bitacora / Decks") que vuelve al sitio.

## Navegación

Todas las páginas del sitio comparten el mismo header (wordmark + nav + theme toggle) y footer (workflow legend + repo link), envueltos en `<div class="container">` con `max-width: 960px` para que se alineen con el `<main>`. Las líneas de border siguen full-width.

Cada subpágina abre con un breadcrumb de dos niveles:

```
Erno × bitacora  /  Decks
```

El primer link vuelve a la home (`../`); el segundo está marcado `aria-current="page"`.

Desde cualquier deck individual (`/decks/<estado>/*.html`) hay un pill fijo top-left en verde bitacora:

```
← Erno × bitacora  /  Decks
```

Inyectado de forma idempotente en los 11 decks. Backdrop-blur sobre fondo translúcido para que funcione en cualquier slide. Se oculta automáticamente en `@media print`.

Cada página tiene también un `<a class="skip-link">` (oculto hasta `:focus`) para saltar el header con teclado.

## Home — widget GitHub

Entre "Destacados" y "Explorar" hay un widget que muestra mi presencia pública en GitHub. Tres piezas:

1. **Avatar + perfil** — `<img src="https://github.com/SoyErnobitacora.png">` (GitHub sirve el avatar de cualquier user en esa URL sin auth). Bajo el avatar: nombre, handle clickeable y bio corta.
2. **Stats** — fetch a `https://api.github.com/users/SoyErnobitacora` sin token (60 req/hora por IP, alcanza). Muestra `public_repos · followers · siguiendo`. Si falla (rate-limit o offline) cae a un link plano al perfil.
3. **Gráfico de contribuciones último año** — SVG embebido de `https://ghchart.rshah.org/008859/SoyErnobitacora`. El primer segmento del path es el color override en hex sin `#`, así el gráfico queda en verde bitacora. En dark mode se le aplica `mix-blend-mode: screen` para integrarse al fondo.

El widget es resiliente: si `api.github.com` está down, el resto de la página igual carga; si `ghchart.rshah.org` está down, queda el `alt` text del `<img>`.

## Skills descargables (custom bitacora)

Las herramientas con el badge `↓ .skill` en `/herramientas/` son skills custom que se distribuyen como ZIPs en `skills/`. Cada ZIP contiene una carpeta `<name>.skill/` con `SKILL.md` + assets. Manifest curado en [`skills/skills.json`](skills/skills.json) (consumible por agentes).

Instalar un skill:

```bash
curl -L -o /tmp/bitacora-deck.zip https://soyernobitacora.github.io/erno-bitacora/skills/bitacora-deck.zip
unzip /tmp/bitacora-deck.zip -d ~/.claude/skills/
mv ~/.claude/skills/bitacora-deck.skill ~/.claude/skills/bitacora-deck
```

(El `mv` es porque Claude Code espera la carpeta sin extensión `.skill`.)

## erno-bitacora-sync-all

Skill local (`~/.claude/skills/erno-bitacora-sync-all/`) que mantiene el sitio en sync con el filesystem real:

1. Re-empaqueta las skills custom bitacora si su contenido cambió (hash sha256)
2. Regenera `skills/skills.json` con tamaños + hashes nuevos
3. Revalida `decks/decks.json` contra el filesystem (slide counts)
4. Commitea + pushea solo si hay diffs

**Manual:**
```bash
python3 ~/.claude/skills/erno-bitacora-sync-all/scripts/sync.py
# o desde Claude Code:
/erno-bitacora-sync-all
```

**Cron diario a las 18:00** (LaunchAgent en macOS):
```bash
~/.claude/skills/erno-bitacora-sync-all/scripts/install-cron.sh
```

Crea `~/Library/LaunchAgents/com.ernobitacora.sync.plist` con `StartCalendarInterval Hour=18`. Logs en `~/.claude/skills/erno-bitacora-sync-all/sync.{out,err}.log`. Idempotente: si nada cambió, no hay commit.

## Cómo se publica un deck

Con la skill `bitacora-deck` instalada localmente:

1. Generar el HTML con Claude Code (la skill arma el deck respetando branding + snippet de Giscus + back-link pill).
2. Publicar:
   ```bash
   ~/.claude/skills/bitacora-deck/scripts/publish-deck.sh <preview.html> <slug> <draft|rfc|completo>
   ```
   El script rechaza el upload si encuentra `{{PLACEHOLDER}}` sin resolver.
3. Sumar entrada a `decks/decks.json` (data source del catálogo) y commit + push a `main`. Pages publica en ~30s. El cron de `erno-bitacora-sync-all` también lo va a recalcular esa noche.

Promover entre estados:
```bash
~/.claude/skills/bitacora-deck/scripts/promote-deck.sh <slug> <from> <to>
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
- App [giscus](https://github.com/apps/giscus) instalada con acceso a `SoyErnobitacora/erno-bitacora`
- Pages source: `main` branch, root (CDN cachea con `max-age=600`)

**Kill switch por deck:** borrar el `<aside id="deck-reactions">`, el `<script>` que lo controla, y el botón `#toggle-comments` del HTML.

## Estructura

```
.
├── index.html               # Home (slim): featured + GH widget + nav a colecciones
├── assets/
│   ├── styles.css           # Tokens + componentes compartidos (Erno × bitacora)
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
│   └── <name>.zip           # Bundle de cada skill custom bitacora
├── openspec/
│   ├── config.yaml          # Reglas SDD (Spec-Driven Development)
│   ├── specs/               # Una capability por archivo (Given/When/Then)
│   └── changes/             # Carpeta por cambio: proposal + design + tasks
├── tests/
│   ├── helpers/             # load-asset.js + setup.js (Storage polyfill)
│   └── specs/               # *.test.js — drift + DOM + controller + theme
├── package.json             # devDeps: vitest + happy-dom
├── vitest.config.js
└── README.md
```

## Specs + tests

El sitio tiene specs en `openspec/specs/` (formato Given/When/Then, palabras RFC 2119) y un suite Vitest en `tests/specs/` que las valida. 5 capabilities especificadas, 57 tests cubriendo data integrity, DOM contracts y el controller `bitacora.createCollection`.

```bash
pnpm install         # primera vez
pnpm test            # corre el suite completo (vitest run)
pnpm test:watch      # bitacora watch
```

Workflow TDD para agregar comportamiento nuevo:

1. **Spec** — agregá un escenario Given/When/Then a la capability en `openspec/specs/<capability>.md`.
2. **Red** — escribí el test en `tests/specs/<capability>.test.js` y confirmá que falla (`pnpm test`).
3. **Green** — implementá la mínima cantidad de código para que pase. No refactores en este paso.
4. **Refactor** — si el código necesita limpieza, hacelo ahora con los tests en verde.

Los manifests (`decks/decks.json`, `rfcs/rfcs.json`, `skills/skills.json`) tienen tests de drift: si renombrás un ZIP, rotás un slug, o cambia el sha256 sin sincronizar el manifest, `pnpm test` lo detecta antes del merge. El cron de `erno-bitacora-sync-all` regenera los manifests; este suite verifica que el output sea consistente con disco.

CI (`.github/workflows/test.yml`) corre el suite en cada PR y push a `main`.

## Cómo sumar contenido

- **Deck nuevo**: ver "Cómo se publica un deck" arriba. Después sumá entrada a `decks/decks.json`.
- **RFC nuevo**: agregar entrada a `rfcs/rfcs.json` (campos: `number`, `slug`, `title`, `summary`, `status`, `area`, `date`, `drive_url` o `repo_url`).
- **Herramienta nueva**: editar `herramientas/index.html`, sumar un `<div class="tool-item" data-tool>...</div>` en la categoría correspondiente. Si es custom y querés que sea descargable, agregala a la lista `CUSTOM_SKILLS` en `~/.claude/skills/erno-bitacora-sync-all/scripts/sync.py` y corré el sync.

## Branding

El wordmark del header es de tres piezas:

- `Erno` — Quicksand 700, ink color (negro o blanco según tema)
- `×` — Quicksand 500, muted (gris)
- `bitacora` — Quicksand 700, verde #008859 (variable `--accent`)

En decks individuales el back-link pill replica el orden: "← Erno × bitacora / Decks", verde bitacora sobre fondo blanco translúcido con backdrop-blur.

## Theme toggle

Cicla por tres estados: `auto` → `claro` → `oscuro` → `auto`. Persiste en `localStorage` con la key `bitacora-decks-theme` (se conserva la key vieja para no resetear preferencias después del rebrand).

Implementación en dos partes para evitar el flash de tema incorrecto:

1. **Pre-paint inline en `<head>`** de cada página — lee `localStorage` y setea `data-theme` en el `<html>` antes del primer render.
2. **Wiring en `assets/common.js`** — maneja el click del botón, cicla el state, persiste.

El CSS usa `:root[data-theme="dark"]` (forzado por el usuario) y `:root[data-theme="auto"] { @media (prefers-color-scheme: dark) }` (cae al sistema). El widget GitHub adapta el gráfico con `mix-blend-mode: screen` cuando está en oscuro.

## Anatomía del CSS

```
assets/styles.css
├── :root              tokens (color, font, shadows) — claro
├── [data-theme=dark]  override completo de tokens
├── [data-theme=auto]  override condicionado a prefers-color-scheme
├── .skip-link         a11y
├── header / footer    border full-width
├── .container         max-width: 960px; padding: 0 48px
├── .wordmark          three-piece typographic logo
├── .nav               tabs pills con aria-current
├── .theme-toggle      pill con 3 íconos (auto/light/dark) que muestra uno a la vez
├── .featured-*        cards del row 'Destacados' en la home
├── .explore-*         cards del row 'Explorar' en la home
├── .gh-widget         widget GitHub (home)
├── .filter-bar / .tabs / .chips / .item-row    catálogos (decks + RFCs)
├── .tool-* / .download-badge                   herramientas
├── .breadcrumb        subpáginas
└── @media             responsive (860px tablet, 640px mobile)
```

Solo dos JS:

- `assets/common.js` — theme toggle + helpers compartidos (escapeHTML, STATUS_LABELS).
- `assets/collection.js` — controller declarativo de search/sort/filter/empty/clear. Lo usan tanto `/decks/` como `/rfcs/`.
