# Cutover — Fase 5 SDD

> **Branch source:** `feat/nextjs-16-migration` · **PR:** #49
> Este runbook ejecuta el cutover de GitHub Pages (estático, basePath `/erno-modo`) → Vercel (Next.js 16 root). **Cada paso outward requiere tu decisión activa** — el runbook no improvisa nada load-bearing.

## Decisiones que necesito antes de arrancar

| Decisión | Default conservador | Cuándo confirmás |
|---|---|---|
| Cuenta Vercel | tu personal (free) o un team MODO | antes del paso 1 |
| Dominio | `erno-modo.vercel.app` (free) vs custom (`bitacora.modo.com.ar` u otro) | antes del paso 5 |
| Destino del GH Pages viejo | reemplazar con stubs de redirect (recomendado: preserva SEO) vs disable directo | antes del paso 7 |
| Token org del feed | rotear/setear `ORG_FEED_TOKEN` en Vercel | antes del paso 4 |

## Paso 1 — Conectar Vercel al repo

```bash
# Local: instalar CLI (si no la tenés)
brew install vercel-cli || pnpm add -g vercel
vercel login   # tu cuenta
vercel link    # asocia este dir a un proyecto Vercel (responde a las prompts:
               #   project = erno-modo, team = <el que elijas>, scope = personal/team)
```

Resultado: queda un `.vercel/` local (gitignoreado) con el `projectId` + `orgId`.

## Paso 2 — Preview de la branch antes de mergear

```bash
vercel                          # deploy preview de la branch actual (NO prod)
# → URL temporal *.vercel.app
# Verificar manual:
#   - / renderea con counts reales
#   - /decks, /rfcs, /rd, /skills, /proyectos, /postmans, /bitacora, /herramientas → 200
#   - /decks/completo/<algún>.html → 200 (artefacto estático)
#   - /ingest.json → manifest con consent + attribution + sections
#   - /api/feed/decks → 200 con items
#   - /opengraph-image → image/png
```

Si algo está mal, fix en la branch y `vercel` de nuevo.

## Paso 3 — Configurar env vars en Vercel

En **Vercel → Project → Settings → Environment Variables** (production + preview):

```
NEXT_PUBLIC_BASE_URL = <dominio final>           # ej. https://erno-modo.vercel.app
ORG_FEED_TOKEN       = <generar uno fuerte>      # ej. openssl rand -hex 32
```

`ORG_FEED_TOKEN` lo necesita el adapter `ingest-bitacora` (Govern-side, futuro) para acceder a feeds `org`. Sin esta var, `/api/feed/*` solo devuelve items `public`.

## Paso 4 — Mergear PR #49 a main

```bash
gh pr merge 49 --repo SoyErnoModo/erno-modo --squash
```

Vercel detecta el push a `main` y deploya producción automáticamente.

## Paso 5 — Dominio (opcional, si elegís custom)

En Vercel → Project → Settings → Domains:
1. Agregar `bitacora.modo.com.ar` (o el que sea).
2. Vercel da un registro DNS (CNAME o A record).
3. Coordinar con CloudOps MODO para el DNS — **TODO(devops)** del lado MODO si el dominio es modo.com.ar.

Tras el DNS propagado: `NEXT_PUBLIC_BASE_URL` se actualiza al dominio final, redeploy.

## Paso 6 — Smoke prod

```bash
DOMAIN=https://<dominio-final>
for path in / /decks /rfcs /rd /skills /proyectos /postmans /bitacora /herramientas /ingest.json /opengraph-image; do
  printf "%-25s %s\n" "$path" "$(curl -s -o /dev/null -w '%{http_code}' $DOMAIN$path)"
done
# Esperar 200 en todos. /opengraph-image = 200 image/png.
# Smoke feed sin/con token:
curl -s $DOMAIN/api/feed/decks | jq '._meta'
curl -s -H "Authorization: Bearer $ORG_FEED_TOKEN" $DOMAIN/api/feed/rfcs | jq '._meta'
```

## Paso 7 — GH Pages viejo

**Opción A (recomendada): redirect stubs** — preserva SEO + links externos siguen funcionando.

```bash
# 1. Generar los stubs apuntando al dominio nuevo
node scripts/generate-redirects.mjs $DOMAIN
# → genera gh-pages-redirects/ con 26+ HTML stubs (meta-refresh + canonical)

# 2. En un checkout limpio del repo, en una branch dedicada:
git fetch origin
git checkout -b gh-pages-301 origin/main
# 3. Reemplazar todo el contenido legacy con los stubs (preservando estructura)
rm -rf decks rfcs rd proyectos postmans bitacora herramientas assets skills 2>/dev/null
cp -r gh-pages-redirects/* .
rm -rf gh-pages-redirects
git add -A && git commit -m "chore(pages): redirect stubs → $DOMAIN"
git push origin gh-pages-301

# 4. En GitHub → repo Settings → Pages → Source = `gh-pages-301` branch root.
# Aplicar. Esperar 1-2 min al rebuild de GH Pages.

# 5. Smoke de redirects:
for path in /erno-modo/ /erno-modo/decks/ /erno-modo/decks/completo/comercios-mvp.html; do
  curl -sI "https://soyernomodo.github.io$path" | grep -E "(refresh|canonical)" || echo "FALLA $path"
done
```

**Opción B: disable GH Pages directo** — más simple, rompe SEO + links externos viejos. NO recomendada salvo que el tráfico viejo sea cero.

```
Settings → Pages → Source = None
```

## Paso 8 — Re-apuntar SKILL scripts (post-cutover)

Estos viven **fuera del repo**, en `~/.claude/skills/`. Updates AL momento del cutover, no antes (sino rompen el flow del sitio estático que ya no existe pero podría usarse desde el branch viejo).

| Skill | Archivo | Cambio | Verificación |
|---|---|---|---|
| `erno-modo-sync-all` | `scripts/sync.py` | `decks/` → `public/decks/`, `rd/` → `public/rd/`, idem todas las secciones | dry-run + diff |
| `daily-bitacora` | template + writer | escribir a `public/bitacora/<YYYY-MM-DD>.html` y a `public/bitacora/bitacora.json` | dry-run |
| `modo-deck` | `scripts/publish-deck.sh` | output `decks/<estado>/<slug>.html` → `public/decks/<estado>/<slug>.html` | publish dummy |

Buscar y reemplazar canónico (cada skill por separado, leer cambios antes de commitear):

```bash
for skill in erno-modo-sync-all daily-bitacora modo-deck; do
  rg -n "decks/|rfcs/|rd/|skills/|proyectos/|postmans/|bitacora/|herramientas/|assets/" \
     ~/.claude/skills/$skill/ | grep -v node_modules
done
```

## Paso 9 — Actualizar URLs canónicas viejas en contenido

Hay refs absolutas `https://soyernomodo.github.io/erno-modo/...` en `public/rd/*.html`, `public/bitacora/*.html` y en `rd.json`. Reemplazar por el dominio nuevo:

```bash
# DRY RUN primero
rg -l "https://soyernomodo.github.io/erno-modo/" public/ | head
# Replace
rg -l "https://soyernomodo.github.io/erno-modo/" public/ | \
  xargs sed -i '' "s|https://soyernomodo.github.io/erno-modo/|$DOMAIN/|g"
# git diff antes de commitear. Ojo: NO tocar URLs github.com/SoyErnoModo/erno-modo (esas se quedan).
```

Verificar:
```bash
rg "github.io/erno-modo" public/   # → 0 matches esperado
rg "github.com/SoyErnoModo/erno-modo" public/ | wc -l   # → debe seguir igual que antes
```

## Paso 10 — Marcar Fase 5 done en el SDD

`openspec/changes/bitacora-developer-ingestion-profile/tasks.md` → tildar Fase 5.
Commit + push. PR #49 cierra el ciclo de la migración.

## ⚠️ Gaps post-cutover (separar en changes propios)

- **Adapter `ingest-bitacora` lado Govern** — sigue **gated** (SPEC-110/111/118 status Draft en modo-govern).
- **Per-item content_hash en feeds** — pending al generator (sync.py/modo-deck) que escriba `content_hash` por item.
- **CI workflow de Vercel** — un GitHub Action que dispare el preview deploy por PR (opcional, Vercel ya lo hace via integración).
- **Cron `update-contributions.yml`** — sigue escribiendo a `public/assets/` (Fase 3 lo dejó re-apuntado). Confirmar que corre OK post-merge en main.
