# Proposal: bitacora-mcp — Bitácora erno-modo como app nativa Claude

## Intent

Hoy la bitácora erno-modo (`https://soyernomodo.github.io/erno-modo`) es un sitio estático GitHub Pages con decks, RFCs, R&D articles, skills y posts. Consumirla desde Claude requiere fetch manual de URLs, sin contexto cross-device, sin identidad, sin scope por dev.

Queremos convertirla en una **app nativa Claude**: un Remote MCP server con OAuth que cualquier cliente Claude (web, desktop, mobile, Code) pueda registrar como connector. Un solo login = perfil compartido cross-device + tools tipadas para leer/buscar contenido.

Encaja con la visión documentada en `reference_bitacora_developer_ingestion_profile`: bitácora-per-dev como perfil de ingesta para el human-clone del proyecto modo-govern (SPEC-110/111/118 PULL/adapter pattern). El MCP **es** ese endpoint de ingesta — con auth real, scopeado por user.

## Scope

### In Scope
- Remote MCP server HTTP/SSE deployado en Vercel Functions (Fluid Compute, default 300s timeout).
- OAuth 2.1 con GitHub como provider (vos sos owner del repo erno-modo → GitHub es identidad natural).
- 6 tools MVP:
  - `read_post(slug)` — devuelve markdown/HTML de un post.
  - `search(query, type?)` — full-text search sobre decks/RFCs/skills/posts.
  - `list_decks(filter?)` — lista decks desde `decks.json`.
  - `list_rfcs(filter?)` — lista RFCs desde `rfcs.json`.
  - `list_skills(filter?)` — lista skills desde `skills.json`.
  - `get_ingest_profile(format?)` — devuelve perfil de ingesta del user autenticado (formato compatible modo-govern SPEC-110).
- Resources MCP: `bitacora://decks/`, `bitacora://rfcs/`, `bitacora://skills/`, `bitacora://posts/`.
- **Single-tenant MVP**: solo `@SoyErnoModo` (Hernán). Identidad por `sub` del GitHub OAuth token. Multi-tenant queda diferido a Fase 2.
- Caching layer (Vercel KV o in-memory) sobre raw GitHub fetches para evitar rate limits.
- Manifest público en `/.well-known/mcp.json` + `/oauth/authorize` + `/oauth/token` + `/oauth/register` (RFC 7591 dynamic registration).
- Registro como custom connector en Claude.ai.
- Documentación de instalación en `erno-modo/rd/bitacora-mcp.html` (R&D article publicado).

### Out of Scope
- Editar contenido desde Claude (write tools tipo `create_post`, `update_deck`). MVP es read-only.
- Voice/audio playback de posts.
- Sync bidireccional con CMS externos (Storyblok, Notion, etc.).
- Auth con providers no-GitHub (Google, Sign in with Vercel, etc.) — Fase 2.
- Multi-tenant. Fase 2 cuando se incorporen más devs MODO.
- Integración con modo-govern human-clone runtime. Este MCP **expone** el perfil; el clone lo **consume** en proyecto aparte.

## Approach

**Stack canónico**:
- TypeScript + `@modelcontextprotocol/sdk` con HTTP/SSE transport.
- Deploy Vercel Functions (Fluid Compute reusa instancias, cold-start mínimo).
- OAuth: implementar el subset RFC 7591 + 8252 + 7636 (PKCE) que Claude.ai requiere para custom connectors. Backing provider = GitHub OAuth App.
- Contenido source: fetch desde `https://soyernomodo.github.io/erno-modo/{decks,rfcs,skills}.json` + posts crudos del repo `soyernomodo/erno-modo`. Cache 5min en Vercel KV.
- Identidad: token GitHub OAuth → `sub` = GitHub user ID → lookup en `bitacora-mcp/profiles/<sub>.json` (committed al repo). MVP whitelist solo `@SoyErnoModo`.

**Flow OAuth**:
1. Claude.ai descubre `/.well-known/mcp.json` → encuentra `oauth.authorization_endpoint`.
2. Browser pop-up → `/oauth/authorize` → redirect a GitHub OAuth.
3. GitHub callback → MCP server emite token propio con `sub=<github_user_id>`.
4. Claude.ai usa token en `Authorization: Bearer` en cada request HTTP/SSE.
5. Server resuelve `sub` → perfil → scopea respuestas.

**Repo nuevo**: `SoyErnoModo/bitacora-mcp` **privado**. Independiente de erno-modo (que es Astro/HTML estático). Se conecta via fetch HTTPS sin compartir build.

**Dominio**: `bitacora.konsor.com.ar` (konsor = dominio personal del owner). Vercel deployment + CNAME en konsor.com.ar DNS apuntando al edge Vercel.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `SoyErnoModo/bitacora-mcp` (repo nuevo, **privado**) | New | MCP server TypeScript + Vercel deploy |
| `soyernomodo/erno-modo/{decks,rfcs,skills}.json` | Modified | Posible enriquecimiento con campos `mcp_metadata` (tags, summary, ingest_hints) |
| `soyernomodo/erno-modo/rd/bitacora-mcp.html` | New | R&D article documentando arquitectura + setup |
| GitHub OAuth App settings | New | OAuth app dedicada "Bitácora MCP" |
| Vercel project | New | Hosting + dominio `bitacora.konsor.com.ar` (CNAME en konsor.com.ar DNS) |
| Claude.ai connectors | New | Registro como custom connector |
| `openspec/changes/bitacora-mcp/` (este repo) | New | SDD lifecycle artifacts |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Claude.ai cambia spec de custom connectors mid-build | Med | Tracking issue del MCP spec; manifest versionado |
| GitHub OAuth rate limits en token exchange | Low | Cache token + refresh; alertas en Vercel logs |
| Prompt injection vía contenido bitácora cargado en tool result | Med | Sanitización + `text-only` content type por defecto; flag explícito para HTML |
| Costo Vercel Functions runaway si bot scan endpoint | Low | BotID + rate limit por IP/sub |
| OAuth implementation security bugs | High | Audit-iterate loop con Security Engineer subagent ANTES de exponer endpoint público. No DIY crypto — usar libs probadas (`jose`, `oauth4webapi`) |
| Perfil de ingesta divergente con modo-govern SPEC-110/111/118 (Draft) | Med | Mantener shape exportable + versionar `/v1/ingest`; coordinar con owner SPEC-110 antes de freeze |
| Contenido erno-modo public → token GitHub no agrega valor si todo es público | Low | MVP: usar OAuth solo para identity + per-user profile, no para gating contenido |

## Rollback Plan

1. **Si el deploy explota**: revertir Vercel deployment al previous good (Vercel "Instant Rollback" UI o `vercel rollback`).
2. **Si OAuth tiene bug de seguridad**: revocar GitHub OAuth App credentials desde GitHub Settings → todos los tokens emitidos quedan invalid. Desregistrar connector en Claude.ai.
3. **Si arquitectura entera no funciona**: el connector es opt-in en Claude.ai → desinstalarlo del lado del user. Repo `bitacora-mcp` queda archivado. La bitácora erno-modo sigue funcionando idéntica porque este proyecto **no la modifica** (solo consume sus JSONs).
4. **Si el costo Vercel se dispara**: switch a Cloudflare Workers o Bun runtime; el código TypeScript es portable.

Cero riesgo de data loss: read-only sobre source públicos.

## Dependencies

- GitHub OAuth App registrada en cuenta personal `SoyErnoModo` (callback `https://bitacora.konsor.com.ar/oauth/callback`).
- Cuenta Vercel con proyecto privado + dominio custom configurado.
- Acceso DNS de `konsor.com.ar` para crear CNAME `bitacora` → `cname.vercel-dns.com`.
- Claude.ai con feature flag de custom connectors habilitado (GA desde 2025-11).
- `erno-modo` repo accesible (raw.githubusercontent.com).
- `@modelcontextprotocol/sdk` última versión.
- Libs OAuth: `jose` (JWT) + `oauth4webapi` (RFC 7591/8252/7636 PKCE). No DIY crypto.

## Success Criteria

- [ ] `https://bitacora.konsor.com.ar/.well-known/mcp.json` responde 200 con manifest válido + TLS válido.
- [ ] Registrar connector en Claude.ai web pidiendo el dominio funciona end-to-end (autorización GitHub → redirect → token → tool listing).
- [ ] Las 6 tools MVP responden en <500ms p95 con cache caliente.
- [ ] `get_ingest_profile()` devuelve shape compatible con modo-govern SPEC-110 PULL adapter (validado contra schema o doc explícita).
- [ ] Mismo connector accesible desde Claude desktop, mobile y Code sin re-auth (token persistido por device, identity = `sub` constante).
- [ ] Audit-iterate loop Security Engineer subagent ejecutado sobre el OAuth flow antes de exponer dominio público.
- [ ] R&D article `bitacora-mcp.html` publicado en erno-modo/rd/ con arquitectura + diagramas + ejemplos.
- [ ] Cero secrets en repo (token GitHub OAuth client_secret en Vercel env vars only, env vars pedidas no leídas — feedback_secrets_request_not_read).
- [ ] CSP enforcement en endpoint público (sigue Layer 2/3 del skill frontend-security-checklist).
