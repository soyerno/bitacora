# Auth Specification

## Purpose

Defines OAuth 2.1 authentication for the bitácora MCP server. The server SHALL act as an OAuth 2.1 authorization server using GitHub as the upstream identity provider. Single-tenant MVP — only the user with GitHub login `SoyErnoModo` is authorized; all other authenticated subjects MUST be rejected.

Compliance targets: RFC 6749 (OAuth 2.0 core), RFC 7591 (Dynamic Client Registration), RFC 8252 (OAuth for native apps), RFC 7636 (PKCE), RFC 8414 (Authorization Server Metadata).

## Requirements

### Requirement: OAuth Discovery Manifest

The server MUST expose a discovery manifest at `https://bitacora.konsor.com.ar/.well-known/mcp.json` describing OAuth endpoints, supported scopes, supported PKCE methods, and tool/resource catalog references.

#### Scenario: Discovery manifest returns valid JSON

- GIVEN an unauthenticated HTTP GET to `/.well-known/mcp.json`
- WHEN the server responds
- THEN the response status MUST be 200
- AND the response Content-Type MUST be `application/json`
- AND the body MUST include `authorization_endpoint`, `token_endpoint`, `registration_endpoint`, `code_challenge_methods_supported` (containing at minimum `S256`), and `mcp_version`

#### Scenario: Discovery manifest is publicly cacheable

- GIVEN the discovery manifest is requested
- WHEN the server responds
- THEN the response MUST include a `Cache-Control` header allowing public caching for at least 300 seconds
- AND the response MUST NOT include any user-specific data

### Requirement: Dynamic Client Registration

The server SHALL support dynamic client registration per RFC 7591 so Claude clients can register without manual provisioning.

#### Scenario: Claude client registers successfully

- GIVEN a Claude client POSTs to `/oauth/register` with a valid `client_name` and `redirect_uris`
- WHEN the server processes the request
- THEN the response status MUST be 201
- AND the body MUST include a generated `client_id` and `client_secret` (or `client_id` only for public clients)
- AND the redirect URIs MUST be persisted against the issued `client_id`

#### Scenario: Registration rejects invalid redirect URI

- GIVEN a client POSTs to `/oauth/register` with a `redirect_uris` array containing a non-HTTPS URI other than `http://localhost`
- WHEN the server validates the request
- THEN the response status MUST be 400
- AND the body MUST include `error: "invalid_redirect_uri"`

### Requirement: PKCE-Protected Authorization Code Flow

The server MUST require PKCE (RFC 7636) with `code_challenge_method=S256` for every authorization request. Implicit flow MUST NOT be supported.

#### Scenario: Authorization request without PKCE is rejected

- GIVEN a client GETs `/oauth/authorize` without a `code_challenge` parameter
- WHEN the server validates the request
- THEN the response MUST redirect to the client's redirect URI with `error=invalid_request` and `error_description` referencing missing PKCE
- AND no authorization session MUST be created

#### Scenario: Authorization redirects to GitHub

- GIVEN a valid `/oauth/authorize` request with `client_id`, `redirect_uri`, `code_challenge`, `code_challenge_method=S256`, `state`, and `scope`
- WHEN the server processes the request
- THEN the server MUST persist the authorization session keyed by `state` with TTL ≤ 600 seconds
- AND the user MUST be redirected to GitHub's OAuth authorize endpoint with the server's GitHub `client_id` and a server-generated `state`

### Requirement: GitHub Callback Exchange

The server MUST handle the GitHub OAuth callback at `/oauth/callback`, exchange the GitHub code for a GitHub access token, fetch the GitHub user identity, and emit a server-issued authorization code bound to the original client session.

#### Scenario: Authorized user receives MCP authorization code

- GIVEN GitHub redirects to `/oauth/callback` with a valid `code` and matching `state`
- WHEN the server exchanges the code with GitHub and fetches `/user`
- AND the returned GitHub login equals `SoyErnoModo`
- THEN the server MUST issue an MCP authorization code bound to the original client session
- AND the user MUST be redirected to the client's `redirect_uri` with the MCP `code` and the original client `state`

#### Scenario: Unauthorized GitHub user is rejected

- GIVEN GitHub redirects to `/oauth/callback` with a valid `code`
- WHEN the GitHub login is not `SoyErnoModo`
- THEN the server MUST NOT issue an MCP authorization code
- AND the user MUST be redirected to the client's `redirect_uri` with `error=access_denied`
- AND a security log entry MUST be recorded with the rejected GitHub login and timestamp

#### Scenario: State mismatch is rejected

- GIVEN GitHub redirects to `/oauth/callback` with a `state` value that does not match any persisted authorization session
- WHEN the server validates the state
- THEN the response status MUST be 400
- AND the body MUST include `error: "invalid_state"`
- AND no token MUST be issued

### Requirement: Token Issuance with PKCE Verification

The `/oauth/token` endpoint MUST exchange the MCP authorization code for an access token only when the `code_verifier` matches the originally provided `code_challenge`.

#### Scenario: Valid code exchange returns access token

- GIVEN a client POSTs to `/oauth/token` with `grant_type=authorization_code`, the MCP `code`, the matching `code_verifier`, and the registered `client_id`
- WHEN the server verifies the PKCE challenge
- THEN the response status MUST be 200
- AND the body MUST include `access_token`, `token_type=Bearer`, `expires_in`, and `refresh_token`
- AND the access token MUST be a signed JWT containing `sub=<GitHub user ID>`, `iss=https://bitacora.konsor.com.ar`, `aud=<client_id>`, and a `jti`

#### Scenario: PKCE verifier mismatch is rejected

- GIVEN a client POSTs to `/oauth/token` with a `code_verifier` that does not match the original `code_challenge`
- WHEN the server verifies PKCE
- THEN the response status MUST be 400
- AND the body MUST include `error: "invalid_grant"`
- AND the authorization code MUST be revoked

#### Scenario: Authorization code is single-use

- GIVEN an authorization code has already been redeemed once
- WHEN a client attempts to redeem the same code again
- THEN the response status MUST be 400
- AND the body MUST include `error: "invalid_grant"`
- AND any previously issued tokens for this code MUST be revoked

### Requirement: Refresh Token Rotation

When a refresh token is used, the server MUST rotate it: invalidate the old refresh token and issue a new one alongside the new access token.

#### Scenario: Refresh rotates the refresh token

- GIVEN a client POSTs to `/oauth/token` with `grant_type=refresh_token` and a valid refresh token
- WHEN the server validates and rotates
- THEN the response MUST include a new `access_token` and a new `refresh_token`
- AND the old refresh token MUST be invalidated immediately

#### Scenario: Reused refresh token triggers session revocation

- GIVEN a refresh token has already been rotated
- WHEN a client attempts to use the old refresh token
- THEN the server MUST revoke the entire token family
- AND the response status MUST be 400 with `error: "invalid_grant"`

### Requirement: Bearer Token Authorization for MCP Endpoints

Every MCP HTTP/SSE endpoint other than `/.well-known/*`, `/oauth/*` MUST require a valid `Authorization: Bearer <jwt>` header. Requests without a valid token MUST be rejected with HTTP 401.

#### Scenario: Missing bearer token is rejected

- GIVEN an HTTP request to an MCP endpoint with no `Authorization` header
- WHEN the server processes the request
- THEN the response status MUST be 401
- AND the response MUST include a `WWW-Authenticate: Bearer realm="bitacora-mcp"` header

#### Scenario: Expired token is rejected

- GIVEN a JWT access token whose `exp` claim is in the past
- WHEN the server validates the token
- THEN the response status MUST be 401
- AND the body MUST include `error: "invalid_token"`, `error_description: "token expired"`

#### Scenario: Token with sub ≠ SoyErnoModo is rejected

- GIVEN a valid JWT issued by this server with a `sub` claim that does not match the authorized GitHub user ID
- WHEN the server processes any MCP request
- THEN the response status MUST be 403
- AND no tool MUST be executed

### Requirement: Secret Storage Discipline

OAuth client secrets, GitHub OAuth App credentials, and JWT signing keys MUST be stored exclusively in Vercel encrypted environment variables. They MUST NOT appear in source files, commits, logs, or error responses.

#### Scenario: No secrets in repository

- GIVEN a fresh clone of the repository
- WHEN a search for known secret patterns is performed (e.g., `GITHUB_CLIENT_SECRET=`, JWT signing keys)
- THEN no concrete secret values MUST be found anywhere in the tree

#### Scenario: Errors do not leak secrets

- GIVEN any server error response
- WHEN the response is inspected
- THEN the response body MUST NOT contain GitHub client secrets, JWT signing keys, or full bearer tokens
