# Tasks: bitácora como perfil de ingesta por developer

> Estado: diseño. Construcción gated tras aprobación del proposal + discovery.

## Fase 1 — Discovery (validar contrato, no construir) ✅
- [x] Leer SPEC-110 + SPEC-118 → pattern canónico de adapter confirmado (edge fn `ingest-{provider}`: auth→consent→vault→fetch→markdownConverter→redactor→content_hash→source_documents→knowledge_notes→wikilinks).
- [x] PULL confirmado (workers incrementales `since last_sync_at`). No webhook. `ingestion_runs` con cursor para incremental.
- [x] Consent real (SPEC-111) = `consent_records` append-only Govern-side, tipo `clone_ingestion`, scope jsonb, signature_hash, RTBF <30d. → bloque consent del manifest es hint, NO autoridad.
- [x] `ingest.json` refinado: per-item `content_hash` + `updated_at` + `artifact_url` + `visibility` (ver design Componente 2).
- [x] ⚠️ HALLAZGO BLOQUEANTE: SPEC-110/111/118 status = Draft (no implementados). El adapter no se construye hasta que Govern los shipee. Dependencia dura registrada.

## Fase 2 — Contrato `ingest.json` 🟡 (parcial, no gated)
- [x] Schema definido (`schema_version`, developer, sections[], visibility, content_hash, consent hint). → `app/ingest.json/route.ts`.
- [x] Servido en `/ingest.json` (route handler, lee config + counts + hash por sección). Smoke OK.
- [x] Secciones `private` excluidas del manifest (filtro en el route).
- [ ] PENDING — `content_hash` + `updated_at` + `artifact_url` POR ITEM en cada feed (hoy hash es a nivel sección). Requiere tocar los generadores de feeds (sync.py/modo-deck) → cutover.
- [ ] PENDING — CI que valide shape del manifest + que un item `private` no aparezca en feed público.

## Fase 3 — Parametrización del template 🟡 (parcial, no gated)
- [x] Perfil extraído a `bitacora.config.ts` (siteTitle, developer, baseUrl, sections[], defaultVisibility).
- [x] De-hardcodeado: layout (metadata), Header (nav+brand), Footer (dev+github), index (cards+header) leen de config.
- [ ] PENDING — mecanismo de instanciación (GitHub template repo / CLI). Default propuesto: template repo.
- [ ] PENDING — README "cómo creo mi bitácora".

## Fase 4 — Privacidad/atribución ✅ (lado bitácora)
- [x] Visibilidad por item y por sección: `lib/visibility.ts` con `filterByVisibility(items, allowed, sectionDefault)`. Items sin `visibility` heredan el default de la sección.
- [x] Feed `org` token-gated: `/api/feed/[section]` (route handler con `Authorization: Bearer ORG_FEED_TOKEN`). Sin token → `public` only. Con token válido → `public + org`. `private` NUNCA. Sección `private` → 403.
- [x] Bloque consent en `ingest.json` + toggle en config: `ConsentConfig { ingestion, scope[], granted_at }` declarativo, reflejado en `/ingest.json`. Hint, no autoridad (Govern manda).
- [x] Atribución: bloque `attribution { developer_id, base_url, notice }` en `/ingest.json` — contrato para que Govern tagee cada nota ingestada.
- [x] Build check: `scripts/check-visibility.mjs` corre en `prebuild` + script `check:visibility`. Falla si un item `private` aparece en feed público. Baseline: 8 secciones, 0 leaks.

## Fase 5a — Cutover de la bitácora (lado erno-modo, gated por decisiones outward) 🟡 PREPARADO
- [x] `.env.example` con `NEXT_PUBLIC_BASE_URL` + `ORG_FEED_TOKEN`.
- [x] `scripts/generate-redirects.mjs` — genera HTML stubs (meta-refresh + canonical) para preservar SEO al apagar GH Pages.
- [x] `docs/CUTOVER.md` — runbook de 10 pasos con comandos concretos + decisiones outward enumeradas.
- [ ] **PENDING — outward**: conectar Vercel (`vercel login` + `vercel link`).
- [ ] **PENDING — decisión**: dominio final (`*.vercel.app` vs custom).
- [ ] **PENDING — outward**: setear `NEXT_PUBLIC_BASE_URL` + `ORG_FEED_TOKEN` en Vercel.
- [ ] **PENDING — outward**: mergear PR #49 a main + verify deploy prod.
- [ ] **PENDING — outward**: redirects GH Pages (branch `gh-pages-301` con los stubs).
- [ ] **PENDING — cutover**: re-apuntar SKILL scripts (`sync.py`, `daily-bitacora`, `modo-deck`) a `public/<sección>/`.

## Fase 5b — Federación (lado modo-govern, otro change/repo) — GATED
- [ ] Adapter "bitácora" en Govern (SPEC-118) que consume `ingest.json`.
- [ ] Registro de bitácoras (developer.id → base_url).
- [ ] Ingesta al knowledge graph (SPEC-109) preservando atribución.
- [ ] Probar loop end-to-end con la bitácora de Hernán como primera fuente.
- **Bloqueante**: SPEC-110/111/118 status = Draft en modo-govern. No construible hasta shipping ahí.

## Hecho
- [x] Decisiones tomadas: template-por-dev + PULL + SDD-first (proposal.md).
- [x] Diseño de los 4 componentes + trade-offs + gotchas (design.md).
- [x] Substrato técnico: bitácora migrada a Next 16 con feeds server-side (PR #49).
