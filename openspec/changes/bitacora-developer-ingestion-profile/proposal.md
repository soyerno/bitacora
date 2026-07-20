# Proposal: bitácora como perfil de ingesta por developer

## Why

Hoy la bitácora (`erno-modo`) es el sitio personal de un ingeniero — decks, RFCs,
R&D, proyectos, skills. La visión es escalarla a **una bitácora por developer en
MODO**, donde cada una funciona como **perfil de ingesta estructurado** del trabajo,
historial y conocimiento org de ese ingeniero. Ese perfil alimenta el modelo de
**MODO Govern** (human-clone / knowledge graph) para representar y clonar el
conocimiento de cada persona, y habilitar colaboración asistida idea→producción
con esos clones.

La bitácora ya emite feeds JSON limpios por sección. Eso la convierte en la fuente
de ingesta **más curada y máquina-legible** de las 11 que lista SPEC-110 — no texto
crudo, sino conocimiento ya estructurado por su autor.

> Nota: las referencias a SPEC-109/110/111/118 son del README de modo-govern. No
> verifiqué su implementación real — el contrato se valida en discovery (Fase 1).

## What

Diseñar (SDD, no construir todavía) el sistema **bitácora-como-perfil-de-ingesta**:

1. **Template por developer** — la bitácora Next 16 (output de la migración
   `feat/nextjs-16-migration`) se parametriza para que cada dev instancie la suya
   (repo/deploy propio, perfil por config). Ownership descentralizado.
2. **Contrato de ingesta** — los feeds JSON de cada bitácora son el contrato estable
   que MODO Govern consume vía **PULL** (adapter SPEC-118). Versión + schema + índice
   discoverable por bitácora.
3. **Modelo de atribución y privacidad** — qué expone cada dev (público vs
   org-only vs privado), consentimiento explícito (SPEC-111 + página Consent), y
   atribución preservada cuando el clon usa el conocimiento.
4. **Federación / knowledge graph** — MODO Govern agrega los feeds de todas las
   bitácoras en el grafo de conocimiento org (SPEC-109).

## Scope

### In scope (este change = diseño)
- `proposal.md` / `design.md` / `tasks.md`: el diseño completo del sistema.
- Definición del **manifest de ingesta** por bitácora (`ingest.json`): versión,
  developer, secciones, visibilidad, timestamps, schema de cada feed.
- Contrato PULL: cómo MODO Govern descubre y consume cada bitácora.
- Modelo de visibilidad/consent por item y por sección.
- Plan de parametrización del template (qué es config vs contenido).

### Out of scope (otros changes)
- Implementar el adapter en MODO Govern (vive en ese repo, SPEC-118).
- Multi-tenant auth (se descartó: modelo template-por-dev, no app única).
- Re-escribir los artefactos HTML existentes (siguen como estáticos).
- El deploy a Vercel de la primera bitácora (Fase 5 de la migración, aparte).

## Decisiones tomadas (locked)

- **Tenancy**: template por dev (repo/deploy c/u). NO app multi-tenant única.
- **Dirección de datos**: MODO Govern hace **PULL** de los feeds. La bitácora no
  conoce a Govern (desacople — la bitácora sigue siendo un sitio autónomo).
- **Fuente de verdad del contenido**: cada dev, en su repo. Govern federa, no posee.
- **Próximo entregable**: este SDD. Construcción del adapter + parametrización van después.

## Open questions — resueltas en Discovery (Fase 1, specs reales)
- ✅ **¿ingest.json emitido o inferido?** → Emitido por la bitácora (manifest declarativo
  evita que Govern hardcodee keys; ver gotcha `rd.json`→`items`).
- ✅ **¿Govern poolea o webhook?** → **PULL/poll** (SPEC-110: workers incrementales
  `since last_sync_at`, `ingestion_runs` con cursor). No webhook.
- ✅ **¿Consentimiento dónde?** → **Govern-side** (`consent_records`, SPEC-111),
  granular + reversible + RTBF. El manifest solo lleva un hint/default.
- 🟡 **¿Visibilidad org-only?** → Govern redacta PII/secrets siempre (SPEC-118 redactor);
  el feed `org` igual necesita no ser público (token en fetch o feed separado). Definir
  en Fase 4 — el sitio es público en Vercel, el feed `org` no puede serlo.

## ⚠️ Bloqueante descubierto
SPEC-110/111/118 están en status **Draft** (no implementados en Govern). El adapter
`ingest-bitacora` (Fase 5) NO se puede construir hasta que Govern los shipee. Lo
construible ahora sin Govern: el lado bitácora (manifest `ingest.json` + content_hash
en feeds + parametrización del template). Eso es independiente y vale por sí solo.
