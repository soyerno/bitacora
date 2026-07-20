# Tasks: bitacora-mcp

> Estimaciones "con IA" — asume Claude Code + skills MODO + audit-iterate loop. Total acumulado: ~55-70 horas.
> Convención: `[ ]` pendiente, `[~]` en curso, `[x]` done con evidencia inline (SHA / PR / test name).

## Phase W1 · Repo Bootstrap + Vercel Setup + DNS

- [ ] **1.1 — Crear repo `SoyErnoModo/bitacora-mcp` privado, init main branch.**
  - Files: repo metadata.
  - Spec coverage: implícito (precondición).
  - DoD: repo existe en GitHub, branch `main` creada, vacío con `README.md` placeholder.
  - Est: 15min.

- [ ] **1.2 — Scaffold TypeScript baseline.**
  - Files: `package.json`, `tsconfig.json`, `.gitignore`, `.npmrc`, `pnpm-workspace.yaml` (no).
  - Spec coverage: implícito.
  - DoD: `pnpm install` corre limpio. `tsc --noEmit` pasa con `target: ES2022`, `module: NodeNext`, `strict: true`.
  - Est: 30min.

- [ ] **1.3 — Pinear deps load-bearing en `package.json`.**
  - Files: `package.json`, `pnpm-lock.yaml`.
  - Spec coverage: auth#9 (no DIY crypto), mcp-tools#1.
  - DoD: `@modelcontextprotocol/sdk@^1`, `jose@^5`, `oauth4webapi@^3`, `zod@^3`, `isomorphic-dompurify@^2`, `marked@^14`, `@vercel/kv@^2`, `botid@latest`, `ajv@^8`. Dev: `vitest`, `@vitest/coverage-v8`, `msw`, `tsx`, `eslint`, `@types/node`.
  - Est: 30min.

- [ ] **1.4 — Crear Vercel project privado linked al repo.**
  - Files: `vercel.ts`.
  - Spec coverage: security#1 (HTTPS), security#2 (headers).
  - DoD: `vercel.ts` exporta config tipada con `framework: null`, regions, headers (HSTS, CSP `default-src 'none'`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), redirect http→https. `vercel link` corrió, project visible en dashboard.
  - Est: 1h.

- [ ] **1.5 — Configurar Vercel KV namespace.**
  - Files: env vars (no commit), `lib/cache/kv.ts` (stub).
  - Spec coverage: content-pipeline#2, security#3, security#4.
  - DoD: KV namespace creado en Vercel dashboard, `KV_URL` y `KV_REST_API_TOKEN` agregadas como env vars en Vercel. `lib/cache/kv.ts` exporta cliente tipado vía `@vercel/kv`. Conexión validada con ping de prueba.
  - Est: 45min.

- [ ] **1.6 — DNS: CNAME `bitacora.konsor.com.ar` → `cname.vercel-dns.com`.**
  - Files: ninguno (cambio externo). Documentar en `README.md`.
  - Spec coverage: auth#1 (manifest accesible bajo dominio).
  - DoD: `dig bitacora.konsor.com.ar` resuelve al edge Vercel. Vercel dashboard muestra dominio `Verified` con TLS válido. `curl -I https://bitacora.konsor.com.ar/` responde 200/404.
  - Est: 30min.

- [ ] **1.7 — Crear GitHub OAuth App "Bitácora MCP".**
  - Files: env vars `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` en Vercel. Documentar en `README.md`.
  - Spec coverage: auth#4 (callback).
  - DoD: app creada en GitHub Settings → Developer settings → OAuth Apps. Callback URL `https://bitacora.konsor.com.ar/oauth/callback`. Credenciales en Vercel env (encrypted). No en repo.
  - Est: 20min.

- [ ] **1.8 — Generar JWT signing secret + WEBHOOK_SECRET.**
  - Files: env vars en Vercel.
  - Spec coverage: auth#5 (token issuance), auth#9 (secret discipline).
  - DoD: `JWT_HS256_SECRET` (32 bytes random base64), `WEBHOOK_SECRET` (32 bytes random) generados con `openssl rand -base64 32` y agregados a Vercel env. Doc cómo rotar.
  - Est: 15min.

- [ ] **1.9 — Configurar `AUTHORIZED_GITHUB_ID` env var con el ID numérico de `@SoyErnoModo`.**
  - Files: env var.
  - Spec coverage: auth#4 (rejected sub), auth#7 (sub ≠ authorized).
  - DoD: env var seteada en Vercel con el numeric ID (no login). Doc cómo obtenerla: `curl https://api.github.com/users/SoyErnoModo | jq .id`.
  - Est: 10min.

- [ ] **1.10 — Crear `data/owner-profile.json` + `data/authorized-subs.json`.**
  - Files: `data/owner-profile.json`, `data/authorized-subs.json`.
  - Spec coverage: ingest-profile#2 (identity), auth#4 (rejected sub).
  - DoD: profile.json con `display_name`, `bio`, `pronouns`, `timezone`, `roles[]`, `voice`, `behavioral_rules[]` seeds. authorized-subs.json `[{sub, login: "SoyErnoModo"}]`. Sin secretos.
  - Est: 1h.

## Phase W2 · OAuth Foundation

- [ ] **2.1 RED — `lib/auth/jwt.ts` test: signAccessToken/verifyAccessToken.**
  - Files: `tests/unit/auth/jwt.test.ts`.
  - Spec coverage: auth#5.
  - DoD: tests cubren happy path (sign → verify → claims correctas), expired token rechazado, wrong-secret token rechazado, malformed token rechazado. Tests RED (no implementation).
  - Est: 45min.

- [ ] **2.2 GREEN — `lib/auth/jwt.ts` implementación con `jose`.**
  - Files: `lib/auth/jwt.ts`.
  - Spec coverage: auth#5, auth#7.
  - DoD: `signAccessToken(claims)` → JWT HS256. `verifyAccessToken(jwt)` → claims tipadas o throw. Claims schema matches design.md. Tests W2.1 verde. Cero `console.log`.
  - Est: 1h.

- [ ] **2.3 RED — `lib/auth/pkce.ts` test: verifier match/mismatch.**
  - Files: `tests/unit/auth/pkce.test.ts`.
  - Spec coverage: auth#3, auth#5.
  - DoD: tests cubren S256 match (verifier hashed → challenge igual), mismatch rechazado, plain method rechazado, missing verifier rechazado. RED.
  - Est: 30min.

- [ ] **2.4 GREEN — `lib/auth/pkce.ts` con `oauth4webapi.calculatePKCECodeChallenge`.**
  - Files: `lib/auth/pkce.ts`.
  - Spec coverage: auth#3, auth#5.
  - DoD: `verifyPKCE(verifier, challenge, method)` → bool. Tests W2.3 verde.
  - Est: 45min.

- [ ] **2.5 — `lib/auth/sub-gate.ts` con allowlist desde `data/authorized-subs.json`.**
  - Files: `lib/auth/sub-gate.ts`, `tests/unit/auth/sub-gate.test.ts`.
  - Spec coverage: auth#7, auth#4.
  - DoD: `assertAuthorizedSub(sub)` lanza `AccessDeniedError` si sub no está en allowlist. Tests cubren happy + reject + empty allowlist (fail-closed).
  - Est: 45min.

- [ ] **2.6 — `lib/auth/refresh-tokens.ts` con family tracking + rotation + reuse detection.**
  - Files: `lib/auth/refresh-tokens.ts`, `tests/unit/auth/refresh-tokens.test.ts`.
  - Spec coverage: auth#6.
  - DoD: `issueRefreshToken`, `rotateRefreshToken`, `detectReuse`. Stored hashed. Reuse de token rotado → revoke family entera. Tests cubren happy, rotation, reuse detection, expiry. KV mockeado in-memory.
  - Est: 2h.

- [ ] **2.7 — `lib/auth/github.ts`: code → access_token → user lookup.**
  - Files: `lib/auth/github.ts`, `tests/unit/auth/github.test.ts`.
  - Spec coverage: auth#4.
  - DoD: `exchangeGitHubCode(code)` → `{access_token}`. `fetchGitHubUser(token)` → `{id, login}`. Errores upstream propagados con shape estable. Tests usan `msw` para mockear GitHub.
  - Est: 1h.

- [ ] **2.8 — `api/.well-known/mcp.json.ts` handler.**
  - Files: `api/.well-known/mcp.json.ts`, `tests/integration/well-known.test.ts`.
  - Spec coverage: auth#1, mcp-tools#1.
  - DoD: GET responde 200 con manifest JSON: `authorization_endpoint`, `token_endpoint`, `registration_endpoint`, `code_challenge_methods_supported: ["S256"]`, `mcp_version`. Cache-Control public 300s. Sin user data. Tests integration verde.
  - Est: 45min.

- [ ] **2.9 — `api/oauth/register.ts` RFC 7591 dynamic registration.**
  - Files: `api/oauth/register.ts`, `tests/integration/oauth-register.test.ts`.
  - Spec coverage: auth#2.
  - DoD: POST con `client_name` + `redirect_uris` → 201 + `client_id` + `client_secret`. Rechaza redirect_uri no-HTTPS (excepto `http://localhost`). Persiste registration en KV. Tests cubren happy + invalid_redirect_uri.
  - Est: 1h.

- [ ] **2.10 — `api/oauth/authorize.ts` con session storage + GitHub redirect.**
  - Files: `api/oauth/authorize.ts`, `tests/integration/oauth-authorize.test.ts`.
  - Spec coverage: auth#3.
  - DoD: GET valida `client_id`, `redirect_uri`, `code_challenge` (S256), `state`, `scope`. Persiste sesión en KV con TTL 600s keyed por server-state. Redirige a GitHub authorize. Rechaza sin `code_challenge`. Tests verde.
  - Est: 1h 30min.

- [ ] **2.11 — `api/oauth/callback.ts` con sub-gate + MCP code emission.**
  - Files: `api/oauth/callback.ts`, `tests/integration/oauth-callback.test.ts`.
  - Spec coverage: auth#4.
  - DoD: GET valida `state` contra sesión, intercambia code con GitHub, lookup `/user`, llama `assertAuthorizedSub`. Si OK: emite MCP auth_code, redirige a `client_redirect_uri?code&state`. Si reject: redirige con `error=access_denied`. Log evento `oauth.login.rejected` o `oauth.login.success`. Tests cubren happy, rejected sub, state mismatch.
  - Est: 2h.

- [ ] **2.12 — `api/oauth/token.ts` con PKCE verify + JWT issuance + refresh rotation.**
  - Files: `api/oauth/token.ts`, `tests/integration/oauth-token.test.ts`.
  - Spec coverage: auth#5, auth#6.
  - DoD: POST `grant_type=authorization_code` → verifica PKCE, emite JWT + refresh_token. POST `grant_type=refresh_token` → rota refresh, emite nuevo par. Code single-use enforced. Reuse de refresh → revoke family + 400. Tests cubren los 4 escenarios spec.
  - Est: 2h.

- [ ] **2.13 — Bearer middleware `lib/auth/bearer.ts` validando JWT + sub-gate.**
  - Files: `lib/auth/bearer.ts`, `tests/unit/auth/bearer.test.ts`.
  - Spec coverage: auth#7.
  - DoD: middleware lee `Authorization: Bearer <jwt>`, verifica firma + exp + iss + aud, llama sub-gate. 401 si missing/expired/invalid, 403 si sub no autorizado. `WWW-Authenticate` header en 401. Tests cubren los 3 escenarios.
  - Est: 1h.

## Phase W3 · MCP Server + Tools + Resources

- [ ] **3.1 — `lib/mcp/server.ts` con SDK + tool/resource registration scaffold.**
  - Files: `lib/mcp/server.ts`.
  - Spec coverage: mcp-tools#1, mcp-tools#7.
  - DoD: instancia `McpServer` del SDK, registra los 6 tool handlers y 4 resource roots desde imports. Export `createServer()` factory.
  - Est: 1h.

- [ ] **3.2 — `api/mcp.ts` HTTP/SSE handler + bearer middleware mount.**
  - Files: `api/mcp.ts`, `tests/integration/mcp-handler.test.ts`.
  - Spec coverage: auth#7, mcp-tools#1.
  - DoD: handler corre bearer middleware → si OK delega al MCP SDK transport. Sin bearer → 401. Test integration verifica los dos paths.
  - Est: 1h.

- [ ] **3.3 — `lib/schemas/tool-inputs.ts` con zod schemas para los 6 tools.**
  - Files: `lib/schemas/tool-inputs.ts`, `tests/unit/schemas/tool-inputs.test.ts`.
  - Spec coverage: mcp-tools#2-#6 (todas).
  - DoD: schemas zod matchean design.md. Tests cubren happy + invalid_input para cada uno (incluyendo path-traversal en `read_post.slug`, empty query en `search`).
  - Est: 1h.

- [ ] **3.4 — `lib/mcp/tools/read-post.ts`.**
  - Files: `lib/mcp/tools/read-post.ts`, `tests/unit/tools/read-post.test.ts`.
  - Spec coverage: mcp-tools#2.
  - DoD: tool function recibe slug, valida zod, fetch via content cache, sanitiza, devuelve `{content, title, type, published_at, source_url}`. Happy + not_found + invalid_input cubiertos. RED-GREEN.
  - Est: 1h 30min.

- [ ] **3.5 — `lib/mcp/tools/search.ts` con ranking simple por substring match.**
  - Files: `lib/mcp/tools/search.ts`, `tests/unit/tools/search.test.ts`.
  - Spec coverage: mcp-tools#3, mcp-tools#6 (truncation).
  - DoD: itera sobre catálogo (manifests cacheados), filtra por type + match en title/description/tags, scorea por position+frequency, ordena desc, cap limit 100. Tests cubren ranking, type filter, empty query reject, limit cap, truncation cuando payload > 1 MiB.
  - Est: 2h.

- [ ] **3.6 — `lib/mcp/tools/list-decks.ts`, `list-rfcs.ts`, `list-skills.ts`.**
  - Files: 3 archivos + `tests/unit/tools/list-{decks,rfcs,skills}.test.ts`.
  - Spec coverage: mcp-tools#4.
  - DoD: cada tool carga su manifest, aplica filter (tag/state/since), valida filter strict (unknown field → invalid_input), devuelve array tipado. Tests cubren los 4 escenarios spec.
  - Est: 2h.

- [ ] **3.7 — `lib/mcp/resources.ts` con los 4 resource roots.**
  - Files: `lib/mcp/resources.ts`, `tests/integration/mcp-resources.test.ts`.
  - Spec coverage: mcp-tools#7.
  - DoD: `resources/list` devuelve los 4 roots. `resources/read` sobre `bitacora://<type>/<slug>` resuelve a content cache + sanitiza + responde con `mimeType` correcto. Tests integration verde.
  - Est: 1h 30min.

## Phase W4 · Content Pipeline + Cache + Sanitize

- [ ] **4.1 — `lib/cache/content-cache.ts` con get/set + TTL 300s.**
  - Files: `lib/cache/content-cache.ts`, `tests/unit/cache/content-cache.test.ts`.
  - Spec coverage: content-pipeline#2.
  - DoD: API tipada `getCached<T>(key)`, `setCached(key, value, ttl)`. Key schema matches design.md. Tests cubren cache hit, expiry, miss.
  - Est: 1h.

- [ ] **4.2 — `lib/content/fetchers.ts` con `fetchManifest` + `fetchPost`.**
  - Files: `lib/content/fetchers.ts`, `tests/unit/content/fetchers.test.ts`.
  - Spec coverage: content-pipeline#1.
  - DoD: fetch desde GitHub Pages, fallback raw.githubusercontent.com si Pages stale (>5min lag). Parse JSON validado con zod. Errores 5xx propagados. Tests usan msw mock.
  - Est: 1h 30min.

- [ ] **4.3 — Stale-on-fail wrapper sobre fetchers.**
  - Files: `lib/content/fetchers.ts` (mismo), `tests/unit/content/stale-on-fail.test.ts`.
  - Spec coverage: content-pipeline#1 (scenarios 2 y 3).
  - DoD: si upstream falla, devuelve cache + `stale: true` en metadata. Si no hay cache → `upstream_unavailable`. Log entry on fallback.
  - Est: 45min.

- [ ] **4.4 — `lib/content/sanitize.ts` con `isomorphic-dompurify`.**
  - Files: `lib/content/sanitize.ts`, `tests/unit/content/sanitize.test.ts`.
  - Spec coverage: content-pipeline#3, content-pipeline#4.
  - DoD: `sanitizeHTML(html)` strip script tags, on* attrs, javascript: URIs. Allowlist estricta. Tests cubren XSS vectors clásicos (script tag, onerror img, javascript href, data URI svg).
  - Est: 1h 30min.

- [ ] **4.5 — Prompt-injection detector en sanitize.ts.**
  - Files: `lib/content/sanitize.ts` (mismo), `tests/unit/content/prompt-injection.test.ts`.
  - Spec coverage: content-pipeline#3 (scenario 4).
  - DoD: regex matches `ignore previous instructions`, `system prompt:`, `<|im_start|>`, `### Instruction`. Devuelve `{content, prompt_injection_detected, patterns_matched[]}`. Tests cubren detect + no-detect.
  - Est: 45min.

- [ ] **4.6 — `lib/content/markdown.ts`: HTML↔markdown round-trips.**
  - Files: `lib/content/markdown.ts`, `tests/unit/content/markdown.test.ts`.
  - Spec coverage: content-pipeline#4.
  - DoD: `htmlToMarkdown` via turndown, `markdownToHtml` via marked. Sanitize aplicado post-conversion. Tests verifican idempotencia para inputs simples.
  - Est: 1h.

- [ ] **4.7 — `api/internal/cache-invalidate.ts` con HMAC verify.**
  - Files: `api/internal/cache-invalidate.ts`, `tests/integration/cache-invalidate.test.ts`.
  - Spec coverage: content-pipeline#2 (scenario 3).
  - DoD: POST con `X-Webhook-Signature` HMAC-SHA256 de body con `WEBHOOK_SECRET`. Valida constant-time. Borra cache keys del payload. 401 sin firma o firma inválida. Tests cubren happy + invalid_signature.
  - Est: 1h.

## Phase W5 · Rate-Limit + BotID + Security Headers

- [ ] **5.1 — `lib/ratelimit/sliding-window.ts` con sorted-set en KV.**
  - Files: `lib/ratelimit/sliding-window.ts`, `tests/unit/ratelimit/sliding-window.test.ts`.
  - Spec coverage: security#3.
  - DoD: `checkRateLimit(key, window_seconds, limit)` → `{allowed, retry_after}`. Implementa ZADD + ZREMRANGEBYSCORE + ZCOUNT con KV. Tests verifican límite respetado, cleanup de entries viejas, retry_after correcto.
  - Est: 2h.

- [ ] **5.2 — Wire rate-limit en bearer middleware (per-sub) y en OAuth endpoints (per-IP).**
  - Files: `lib/auth/bearer.ts` (modify), `api/oauth/*.ts` (modify each), `tests/integration/rate-limit.test.ts`.
  - Spec coverage: security#3.
  - DoD: 60/min + 1000/h per sub. 30/min per IP en OAuth público. 429 + `Retry-After` cuando excede. Tests integration con KV in-memory.
  - Est: 1h 30min.

- [ ] **5.3 — `lib/botid/middleware.ts` con Vercel BotID.**
  - Files: `lib/botid/middleware.ts`, `tests/integration/botid.test.ts`.
  - Spec coverage: security#4.
  - DoD: middleware llama BotID, si `bot` o `suspicious` → 403 antes de app logic. Wire en `/.well-known/mcp.json`, `/oauth/register`, `/oauth/authorize`. Tests mockean BotID verdict.
  - Est: 1h 30min.

- [ ] **5.4 — Security headers en `vercel.ts` (validar config existente W1.4).**
  - Files: `vercel.ts` (refine), `tests/integration/security-headers.test.ts`.
  - Spec coverage: security#1, security#2.
  - DoD: HSTS max-age ≥ 31536000 + includeSubDomains, CSP `default-src 'none'` + `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy` con features off. Tests integration validan cada header.
  - Est: 45min.

- [ ] **5.5 — `lib/logging/security-events.ts` structured JSON logging.**
  - Files: `lib/logging/security-events.ts`, `tests/unit/logging/security-events.test.ts`.
  - Spec coverage: security#7.
  - DoD: `logSecurityEvent({event, ...metadata})` emite JSON a stdout. Lint rule banneando log de tokens. Tests verifican que tokens nunca aparecen en logs.
  - Est: 45min.

## Phase W6 · Ingest Profile + Voice/Rules Loader + Schema

- [ ] **6.1 — `lib/schemas/profile.v1.0.0.json` JSON Schema.**
  - Files: `lib/schemas/profile.v1.0.0.json`, `tests/contract/profile-schema.test.ts`.
  - Spec coverage: ingest-profile#1, ingest-profile#2-#7.
  - DoD: JSON Schema Draft 2020-12 cubriendo `schema_version`, `identity`, `voice`, `behavioral_rules[]`, `artifacts.{decks,rfcs,skills,posts}[]`, `generated_at`, `source_commit`, `cache_freshness_seconds`. Tests `ajv` validan ejemplos válidos + rechazan ejemplos malformados.
  - Est: 1h 30min.

- [ ] **6.2 — `lib/voice/profile-loader.ts` cargando overrides desde `data/owner-profile.json`.**
  - Files: `lib/voice/profile-loader.ts`, `tests/unit/voice/profile-loader.test.ts`.
  - Spec coverage: ingest-profile#3, ingest-profile#4.
  - DoD: lee owner-profile.json al startup, merge con GitHub `/user` payload (display_name fallback). Tests cubren happy + missing-field defaults.
  - Est: 1h.

- [ ] **6.3 — `lib/mcp/tools/get-ingest-profile.ts` JSON format.**
  - Files: `lib/mcp/tools/get-ingest-profile.ts`, `tests/unit/tools/get-ingest-profile.test.ts`.
  - Spec coverage: ingest-profile (todas).
  - DoD: construye profile mergeando identity + voice + behavioral_rules + artifacts catalog + provenance. Valida output contra JSON Schema antes de devolver. Tests cubren identity populated, artifacts complete, provenance fresh.
  - Est: 2h.

- [ ] **6.4 — Markdown rendering del profile.**
  - Files: `lib/mcp/tools/get-ingest-profile.ts` (extend), `tests/unit/tools/profile-markdown.test.ts`.
  - Spec coverage: ingest-profile#7.
  - DoD: `format: "markdown"` devuelve markdown estructurado con secciones en orden: Identity → Voice → Behavioral Rules → Artifacts → Provenance. Sin script tags. Tests verifican secciones presentes y orden.
  - Est: 1h 30min.

- [ ] **6.5 — Source-commit lookup helper.**
  - Files: `lib/content/fetchers.ts` (extend), `tests/unit/content/source-commit.test.ts`.
  - Spec coverage: ingest-profile#7.
  - DoD: `getLatestSourceCommit()` fetch `https://api.github.com/repos/SoyErnoModo/erno-modo/commits/main` → `sha`. Cached 60s. Tests con msw mock.
  - Est: 45min.

## Phase W7 · Testing Consolidation

- [ ] **7.1 — Vitest config + coverage thresholds.**
  - Files: `vitest.config.ts`, `package.json` (scripts).
  - Spec coverage: implícito (calidad).
  - DoD: `pnpm test` corre unit + integration + contract. Coverage threshold 80% statements/branches. CI falla si baja.
  - Est: 30min.

- [ ] **7.2 — Suite unit consolidada — verificar todas las tasks RED/GREEN cerradas.**
  - Files: revisar `tests/unit/**`.
  - Spec coverage: todas las requirements.
  - DoD: `pnpm test:unit` verde. Coverage report muestra archivos load-bearing >90%.
  - Est: 1h.

- [ ] **7.3 — Suite integration consolidada — flow OAuth full + invocación de cada tool.**
  - Files: `tests/integration/oauth-full-flow.test.ts`, `tests/integration/tools-invocation.test.ts`.
  - Spec coverage: auth#3-#6, mcp-tools#2-#7.
  - DoD: test simula register → authorize → callback (rejected sub case) → callback (happy case) → token → list-tools → call cada tool. Verde. Usa `vercel dev` local con KV mock.
  - Est: 3h.

- [ ] **7.4 — Suite contract — profile output contra JSON Schema.**
  - Files: `tests/contract/profile-output.test.ts`.
  - Spec coverage: ingest-profile#1, ingest-profile#6.
  - DoD: invoca `get_ingest_profile` con mocks, valida output contra `profile.v1.0.0.json` con ajv. Falla si missing required field o type mismatch.
  - Est: 45min.

- [ ] **7.5 — Tests de prompt-injection patterns end-to-end.**
  - Files: `tests/integration/prompt-injection.test.ts`.
  - Spec coverage: content-pipeline#3 (scenario 4).
  - DoD: inyecta content con patterns conocidos, invoca `read_post`, verifica `prompt_injection_detected: true` y `patterns_matched[]`. Content sigue siendo devuelto (no silenciado).
  - Est: 45min.

- [ ] **7.6 — Tests de single-tenant defense-in-depth.**
  - Files: `tests/integration/sub-gate-defense.test.ts`.
  - Spec coverage: auth#4, auth#7.
  - DoD: 3 tests separados: (a) callback rechaza login no-autorizado, (b) bearer rechaza JWT con sub manipulado, (c) tool handler rechaza si context.sub bypassed. Cada uno aisla la capa que defiende.
  - Est: 1h.

## Phase W8 · CI/CD Pipeline + Audit-Gate + Layer 3 CSP

- [ ] **8.1 — `.github/workflows/ci.yml` con lint + typecheck + test + audit.**
  - Files: `.github/workflows/ci.yml`.
  - Spec coverage: implícito (gate de calidad).
  - DoD: workflow corre en cada PR: pnpm install --frozen-lockfile, lint, tsc --noEmit, vitest, `pnpm audit` con allowlist documentada. Falla en cualquier step.
  - Est: 1h.

- [ ] **8.2 — `.github/workflows/cd.yml` job `preview` para deploys staging.**
  - Files: `.github/workflows/cd.yml`.
  - Spec coverage: security#1 (TLS).
  - DoD: en push a main → vercel deploy --target=staging. URL preview comentada en commit. Smoke test básico (`curl /.well-known/mcp.json` retorna 200).
  - Est: 1h.

- [ ] **8.3 — `.github/workflows/cd.yml` job `audit-gate` requiriendo `security-audit.md` ALLOW.**
  - Files: `.github/workflows/cd.yml` (extend).
  - Spec coverage: security#5.
  - DoD: en tag `v*`: verifica que `openspec/changes/bitacora-mcp/security-audit.md` existe + contiene `Verdict: ALLOW` (o `PRODUCTION-READY`) + tiene mtime ≤ 30 días. Falla pipeline si no.
  - Est: 45min.

- [ ] **8.4 — `.github/workflows/cd.yml` job `prod` con vercel deploy --prod.**
  - Files: `.github/workflows/cd.yml` (extend).
  - Spec coverage: implícito.
  - DoD: depende de audit-gate. Vercel deploy --prod con token. Healthcheck post-deploy.
  - Est: 30min.

- [ ] **8.5 — `.github/workflows/cd.yml` job `validate-csp` Layer 3 post-deploy.**
  - Files: `.github/workflows/cd.yml` (extend), copy de `cd-validate-csp.sh` skill drop-in.
  - Spec coverage: security#8.
  - DoD: corre `cd-validate-csp.sh https://bitacora.konsor.com.ar`. Falla pipeline si algún check returns FAIL. WARN tolerado pero reportado.
  - Est: 45min.

- [ ] **8.6 — `.github/workflows/security-audit.yml` scheduled + manual.**
  - Files: `.github/workflows/security-audit.yml`.
  - Spec coverage: security#5.
  - DoD: workflow_dispatch + cron mensual. Documenta cómo invocar audit-iterate Security Engineer subagent + dónde commit el report. No corre el agent automáticamente — workflow es checklist + reminder.
  - Est: 30min.

## Phase W9 · E2E + R&D Article + Archive SDD

- [ ] **9.1 — Audit-iterate Security Engineer subagent loop.**
  - Files: `openspec/changes/bitacora-mcp/security-audit.md`.
  - Spec coverage: security#5.
  - DoD: invocar subagent con prompt "auditá `lib/auth/*`, `api/oauth/*`, sanitize, rate-limit. Sé brutal. No praise. Verdict ALLOW/DENY". Iterar hasta verdict ALLOW. Findings + verdict commit en `security-audit.md`. Gaps honest documentados.
  - Est: 4h (incluye iteraciones).

- [ ] **9.2 — Registrar custom connector en Claude.ai contra preview URL.**
  - Files: `README.md` (runbook).
  - Spec coverage: auth#1-#6 end-to-end.
  - DoD: Claude.ai web → Settings → Connectors → Add → URL `https://bitacora-mcp-stg.konsor.com.ar`. Flow OAuth completo. Tool listing aparece. Cada tool ejecutado con happy + error case. Screenshots o video.
  - Est: 2h.

- [ ] **9.3 — E2E manual: sub-gate verification.**
  - Files: `openspec/changes/bitacora-mcp/e2e-evidence.md`.
  - Spec coverage: auth#4.
  - DoD: login con un usuario GitHub que NO sea `SoyErnoModo` → redirect con `error=access_denied`. Captura del log de seguridad mostrando entry rejected. Evidence commit.
  - Est: 45min.

- [ ] **9.4 — Test cross-device: mismo connector en Claude web + desktop + mobile + Code.**
  - Files: `openspec/changes/bitacora-mcp/e2e-evidence.md` (extend).
  - Spec coverage: criterio de éxito #5 del proposal.
  - DoD: login una vez en web, verificar token persistido por device, identity `sub` constante. Documentar comportamiento real (puede que cada device requiera login propio — verificar y documentar).
  - Est: 1h.

- [ ] **9.5 — R&D article `erno-modo/rd/bitacora-mcp.html` con arquitectura + flow + threat model.**
  - Files: en repo `SoyErnoModo/erno-modo`: `rd/bitacora-mcp.html`, `rd/rd.json` entry.
  - Spec coverage: success criterion del proposal.
  - DoD: artículo long-form usando skill `modo-research-article`. Incluye: tl;dr, arquitectura, OAuth flow Mermaid, threat model table, lessons learned. Voz rioplatense. Publicado vía `erno-modo-sync-all`.
  - Est: 3h.

- [ ] **9.6 — Promote a prod: tag `v1.0.0` + monitor primer 24h.**
  - Files: ninguno (op deploy).
  - Spec coverage: implícito.
  - DoD: `git tag v1.0.0 && git push origin v1.0.0`. CD pipeline corre audit-gate → prod → validate-csp. `bitacora.konsor.com.ar/.well-known/mcp.json` responde. Connector Claude.ai re-registrado contra prod URL. 24h sin alertas.
  - Est: 1h (deploy) + 24h (monitoring window).

- [ ] **9.7 — Recovery memory tras deploy prod.**
  - Files: `~/.claude/projects/-Users-hernan-desouza-Documents-Proyectos-modo-modo-landing-workspace-modo-landing/memory/reference_bitacora_mcp_deploy_recovery_2026_<MM>_<DD>.md`.
  - Spec coverage: regla global "Recovery memory tras ops destructivas".
  - DoD: memoria documentando: revoke OAuth credentials, rotate JWT secret, vercel rollback, desregistrar connector. Update MEMORY.md con entry.
  - Est: 30min.

- [ ] **9.8 — `sdd-track` final + `sdd-verify` antes de archive.**
  - Files: `tasks.md` (checkboxes), `README.md` del change folder.
  - Spec coverage: implícito (gate).
  - DoD: todas las tasks de W1-W9 marcadas `[x]` con evidencia. `sdd-verify` corrida y verdict PASS. Open questions del design.md resueltas como D-decisions o ack'd.
  - Est: 1h.

- [ ] **9.9 — `sdd-archive` el change.**
  - Files: mover `openspec/changes/bitacora-mcp/` → `openspec/archive/`.
  - Spec coverage: implícito (lifecycle).
  - DoD: deltas synced a `openspec/specs/{auth,mcp-tools,content-pipeline,security,ingest-profile}/spec.md`. Change archivado. Memoria `project_bitacora_mcp.md` cerrada como Done.
  - Est: 45min.

## Resumen por fase

| Fase | Tasks | Horas (con IA) | Focus |
|------|-------|----------------|-------|
| W1 Bootstrap | 10 | ~6h | Repo + Vercel + DNS + GitHub OAuth App + env vars |
| W2 OAuth Foundation | 13 | ~14h | jose/oauth4webapi + JWT + PKCE + 5 endpoints |
| W3 MCP Server + Tools | 7 | ~10h | SDK wiring + 6 tools + 4 resources |
| W4 Content Pipeline | 7 | ~7h | cache + fetchers + sanitize + markdown + invalidate webhook |
| W5 Security | 5 | ~6h | rate-limit + BotID + headers + structured logging |
| W6 Ingest Profile | 5 | ~7h | JSON Schema 1.0.0 + loader + tool + markdown render |
| W7 Testing Consolidation | 6 | ~7h | unit + integration + contract + injection + defense-in-depth |
| W8 CI/CD + Audit Gate | 6 | ~4h | ci.yml + cd.yml + Layer 3 CSP + security-audit workflow |
| W9 E2E + R&D + Archive | 9 | ~13h | audit-iterate + Claude.ai E2E + R&D article + promote + archive |
| **Total** | **68** | **~74h** | |

## Notas operativas

- TDD donde aplica: tasks marcadas `RED`/`GREEN` deben commitearse en ese orden visible.
- Cada batch de phase merece `sdd-track` al cierre (ritual codificado).
- W2.13 (bearer) bloquea W3 entero. W3.3 (zod schemas) bloquea W3.4+.
- W6 puede correr en paralelo con W3 una vez que W4 (cache) esté listo.
- W9.1 (audit-iterate) bloquea W9.6 (promote prod) por audit-gate en CD.
