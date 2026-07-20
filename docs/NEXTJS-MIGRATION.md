# Migración bitácora → Next.js 16 (App Router)

> **Branch:** `feat/nextjs-16-migration` · **Autor:** Hernán De Souza · Sr AI Engineer
> Estado: Fases 0–4 completas + completion sweep 2026-05-28. Fase 5 (deploy) preparada,
> **pendiente de decisiones outward**.

## Qué se hizo (Fases 0–4)

| Fase | Resultado |
|---|---|
| 0 | Scaffold Next 16.2.6 + React 19 + Tailwind v4 (App Router, TS strict, Turbopack). `next build` verde. |
| 1 | Content layer `lib/feeds.ts` — lee los feeds JSON existentes server-side. Misma fuente de verdad. |
| 2 | Chrome branded (Header + nav + ThemeToggle auto/claro/oscuro + Footer + anti-FOUC) + 6 páginas de sección RSC (decks, rfcs, rd, skills, proyectos, postmans). |
| 3 | 34 HTML autocontenidos + assets → `public/` (Vercel los sirve en su misma ruta; links relativos preservados). Feeds → `public/<sección>/`. Scripts del repo re-apuntados. |
| 4 | Features dinámicas: `/api/search` (server-side cross-feed), `/buscar` (client), OG dinámica branded, `@vercel/analytics`. |
| 4.5 | **Completion sweep (2026-05-28)**: nav consolidado en `<Header>` con dropdown "Publicaciones" (visible: Home/Bitácora/Proyectos/Herramientas · dropdown: Decks/RFCs/Postmans/R&D). Nuevas rutas `/bitacora` (lista de digests) y `/herramientas` (75 tools · 8 categorías, feed `public/herramientas/herramientas.json`). Eliminados los `public/<sección>/index.html` legacy (Next routes los reemplazan). |
| 4.6 | **Refactor sweep (2026-05-28)**: componentes compartidos `<PageShell>`, `<Card>` + `<CardTitle>`/`<CardDescription>`/`<CardMeta>`/`<CardFooter>`, `<Pill>` (3 variants). Helpers `lib/url.ts` (`isExternal`, `isStaticAsset`, `toAbsoluteHref`) y `lib/search.ts` (`SearchHit` + labels). 10 listing pages refactored, −52 LOC neto. `<Card>` auto-routea Link/`<a>`/`<article>` según href (interno vs externo vs static asset). `bitacora` y `herramientas` agregadas a `config.sections` → home grid las muestra. `getSectionCount()` suma children correctamente (herramientas → 75 tools, no 8 cats). Standardizado `rel="noopener noreferrer"` en todos los links externos. |

Smoke local (`next start`): index con counts reales, `/decks` 200, artefacto
estático `/decks/completo/*.html` 200, `/api/search` 55 hits, `/opengraph-image`
image/png 200.

## Arquitectura

- **Páginas de sección**: Server Components que leen los feeds JSON. Reemplazan
  los `index.html` + `collection.js`/`nav-counts.js` client-side viejos.
- **Artefactos** (decks/RFCs/R&D HTML autocontenidos): quedan como estáticos en
  `public/`. El pipeline del skill `modo-deck` (genera HTML standalone) **no cambia**
  — solo cambia el directorio destino (ver cutover).
- **`herramientas/`**: ahora con feed `public/herramientas/herramientas.json` + RSC en `app/herramientas/page.tsx`. Source HTML archival en `scripts/legacy/herramientas-source.html`; extractor reproducible vía `node scripts/build-herramientas-json.mjs`. Canonical edit path: editar el JSON directo (el HTML legacy es solo archival).
- **`/bitacora`**: lista los digest dated del feed `public/bitacora/bitacora.json`. Cada item enlaza al artefacto autocontenido `public/bitacora/<slug>.html` (no se tocan).

## Fase 5 — Cutover (PENDIENTE, requiere decisiones)

Pasos outward que NO se ejecutaron (necesitan tu cuenta/decisión):

1. **Vercel project**: conectar `SoyErnoModo/erno-modo` a Vercel. Framework
   autodetectado (Next). Sin `vercel.json` necesario. → decisión: ¿bajo qué cuenta Vercel?
2. **Dominio**: `*.vercel.app` default vs custom (`bitacora.modo.com.ar` u otro).
   → decisión pendiente.
3. **URLs canónicas/OG/permalinks**: hay refs absolutas `https://soyernomodo.github.io/erno-modo/...`
   en `public/rd/*.html`, `public/bitacora/*.html` y en `rd.json`. Apuntan a la
   ubicación GH Pages vieja. Al fijar el dominio nuevo, reemplazar
   `https://soyernomodo.github.io/erno-modo/` → `https://<dominio-nuevo>/`.
   (Las URLs `github.com/SoyErnoModo/erno-modo/...` NO se tocan.)
4. **GitHub Pages viejo**: decidir 301 → dominio nuevo, o mantener con `<link rel=canonical>`.
5. **Scripts de SKILLs** (fuera de este repo, en `~/.claude/skills/`): re-apuntar al
   directorio `public/` AL momento del cutover (no antes, para no romper el sitio
   estático que sigue vivo en `main`):
   - `erno-modo-sync-all/scripts/sync.py` → escribe en `decks/`, `rd/`, etc.
   - `daily-bitacora` → escribe en `bitacora/`.
   - `modo-deck` publish scripts → publican en `decks/<estado>/`.
   Todos deben pasar a `public/<sección>/`.

## Gaps honestos

- **Analytics**: `@vercel/analytics` solo reporta corriendo en Vercel. Off-Vercel es no-op.
- ~~**Section index.html viejos**~~ → **eliminados** en sweep 2026-05-28. Las rutas Next ahora son la única superficie de listado. El source HTML de herramientas se mudó a `scripts/legacy/herramientas-source.html` para que el extractor pueda re-ejecutarse si hace falta.
- **Paridad visual**: el chrome es fiel-pero-limpio (mismo branding, dark toggle,
  fuentes), no un port pixel-perfect del HTML/JS estático. Sin Giscus ni bionic-CSS
  portados a las páginas de listado (los decks individuales los mantienen embebidos).
- **No deployado**: Fases 0–4 viven solo en el branch. Nada en producción todavía.
