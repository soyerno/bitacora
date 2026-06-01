# Security Specification

## Purpose

Defines transport, request-rate, abuse-prevention, observability, and review-gate requirements for the bitácora MCP server. These requirements MUST be satisfied before the server is exposed to the public Internet under `bitacora.konsor.com.ar`.

## Requirements

### Requirement: TLS-Only Transport

All HTTP endpoints MUST be served exclusively over HTTPS. Plain HTTP requests MUST be redirected with HTTP 308 to the equivalent HTTPS URL. HSTS MUST be enabled with `max-age >= 31536000` and `includeSubDomains`.

#### Scenario: HTTP request is redirected to HTTPS

- GIVEN a request to `http://bitacora.konsor.com.ar/<any-path>`
- WHEN the server responds
- THEN the response status MUST be 308
- AND the `Location` header MUST be `https://bitacora.konsor.com.ar/<any-path>`

#### Scenario: HSTS header is set on HTTPS responses

- GIVEN any HTTPS response
- WHEN the response headers are inspected
- THEN a `Strict-Transport-Security` header MUST be present
- AND the `max-age` directive MUST be at least 31536000
- AND `includeSubDomains` MUST be included

### Requirement: Security Response Headers

Every response MUST include the following headers: `Content-Security-Policy` (with `default-src 'none'` for API responses, `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and `Permissions-Policy` with all features disabled by default.

#### Scenario: API response carries CSP

- GIVEN any JSON API response
- WHEN inspected
- THEN `Content-Security-Policy` MUST include `default-src 'none'` and `frame-ancestors 'none'`

### Requirement: Per-Subject Rate Limiting

The server MUST enforce a per-`sub` rate limit on tool invocations: 60 requests per minute and 1000 requests per hour. Exceeded limits MUST return HTTP 429 with a `Retry-After` header.

#### Scenario: Rate limit allows normal traffic

- GIVEN an authenticated user has made 30 tool invocations in the last 60 seconds
- WHEN they make the 31st invocation
- THEN the request MUST be processed normally

#### Scenario: Rate limit blocks burst traffic

- GIVEN an authenticated user has made 60 tool invocations in the last 60 seconds
- WHEN they make the 61st invocation
- THEN the response status MUST be 429
- AND the response MUST include a `Retry-After` header indicating seconds until next allowed request

#### Scenario: Unauthenticated traffic is rate-limited by IP

- GIVEN no bearer token in the request
- AND the same source IP has made 30 requests to OAuth endpoints in the last 60 seconds
- WHEN the 31st request arrives
- THEN the response status MUST be 429

### Requirement: BotID Verification on Public Endpoints

The server MUST integrate Vercel BotID on `/.well-known/mcp.json`, `/oauth/register`, and `/oauth/authorize`. Suspected non-human traffic MUST be challenged or blocked before reaching application logic.

#### Scenario: Verified human request proceeds

- GIVEN BotID classifies an incoming request as `human`
- WHEN the request reaches a BotID-protected endpoint
- THEN the request MUST be processed normally

#### Scenario: Bot traffic is blocked

- GIVEN BotID classifies an incoming request as `bot` or `suspicious`
- WHEN the request reaches a BotID-protected endpoint
- THEN the response status MUST be 403 or the BotID challenge MUST be issued
- AND the application logic MUST NOT be reached

### Requirement: Audit-Iterate Security Review Before Public Exposure

A dedicated Security Engineer subagent audit-iterate loop MUST be executed and pass with verdict ALLOW (or PRODUCTION-READY with documented gaps) before the production deployment to `bitacora.konsor.com.ar` is promoted. Findings MUST be documented in the change folder.

#### Scenario: Audit blocks public deploy

- GIVEN the deployment pipeline is configured to promote a build to production
- WHEN no audit report exists in `openspec/changes/bitacora-mcp/security-audit.md` with a non-stale ALLOW verdict
- THEN the production promotion MUST be blocked
- AND the responsible operator MUST receive a clear blocker message

#### Scenario: Audit findings are addressed before promote

- GIVEN an audit report exists with severity HIGH or CRITICAL findings
- WHEN promotion is attempted
- THEN the promotion MUST be blocked until those findings are marked resolved or accepted with explicit justification

### Requirement: No DIY Cryptography

OAuth token signing, PKCE verification, and JWT handling MUST use well-known libraries (`jose` for JWT, `oauth4webapi` for the OAuth flow). The codebase MUST NOT implement bespoke cryptographic primitives.

#### Scenario: JWT library is used for signing

- GIVEN the codebase
- WHEN inspecting JWT signing logic
- THEN it MUST import and call `jose` (or an equivalent well-known library)
- AND no manual HMAC, base64-of-signature, or hand-rolled JWS code MUST be present

### Requirement: Structured Security Logging

The server MUST emit structured logs (JSON) for all authentication events (success, failure, rejected sub, rate-limit hit, BotID block, refresh-token reuse). Logs MUST NOT include access tokens, refresh tokens, client secrets, or PKCE verifiers.

#### Scenario: Successful login produces a structured log

- GIVEN a user completes the OAuth flow successfully
- WHEN logs are inspected
- THEN a log entry of `event: "oauth.login.success"`, `sub`, `client_id`, `timestamp` MUST exist
- AND no token material MUST appear in the entry

#### Scenario: Rejected sub produces a security event

- GIVEN a non-`SoyErnoModo` GitHub user completes the GitHub-side OAuth flow
- WHEN the server rejects the user
- THEN a log entry of `event: "oauth.login.rejected"`, `github_login`, `timestamp`, `client_ip` MUST exist

### Requirement: Layer 3 CSP Validation Post-Deploy

The server's GitHub Actions deployment pipeline MUST include the `cd-validate-csp.sh` Layer 3 validator (from `frontend-security-checklist` skill) running against the live edge after each production promote. The job MUST fail the pipeline on any FAIL finding.

#### Scenario: Post-deploy CSP validation runs on prod

- GIVEN a successful production deployment
- WHEN the `cd.yaml` workflow continues
- THEN `cd-validate-csp.sh` MUST be invoked against `https://bitacora.konsor.com.ar`
- AND the job MUST fail the pipeline if any check returns FAIL
