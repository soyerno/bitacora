# Capacitación · Deploy de un frontend MODO a playsistemico (EKS)

> **Harness = agentes.** Este no es un manual para leer y guardar. Es un curso que se hace **con Claude Code abierto**, donde cada paso lo guía y verifica un skill MODO. Vos seguís, Claude orquesta, los gates te dicen si está bien.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## Para quién

Dev frontend que necesita llevar un repo al org `playsistemico` y desplegarlo en EKS bajo `subdominio.modo.com.ar`. Asumís que ya sabés desarrollar con Next 15/16 y pnpm; lo que aprendés acá es **la capa de plataforma**: cómo funciona la infra compartida de MODO y qué archivos la enchufan.

Caso canónico que atraviesa todo el curso: **aprendeatumodo** (COENXT-308, 7 PRs).

## Qué vas a saber hacer al terminar

1. Verificar que un repo cumple los prerrequisitos para ser desplegable.
2. Abrir los 6 tickets JSM canónicos en el orden correcto, sin bloquearte.
3. Clonar promos-hub y armar los 6 PRs de infra (catalog → helm → parameters → ci → cd → docker).
4. Configurar subdominio, `basePath`/`assetPrefix` y probes correctamente.
5. Lanzar el primer deploy a develop, verificar el pod `Ready` y hacer smoke test.
6. Pasar el gate de prod (GRC/OFFSEC) antes de promover a producción.

## Cómo funciona la plataforma (mapa mental)

```
tu código (Next 15/16, puerto 3000)
        │
        ▼
Dockerfile  ──  FROM modo-base:<ver>-node22
                ENTRYPOINT entrypoint.sh
        │
        ▼
entrypoint.sh  ──  AWS SSM get-parameters-by-path
                   → export NEXT_PUBLIC_* al proceso
                   → exec pnpm start
        │
        ▼
ci-ms.yaml@v1  ──  lint + test + build imagen + push a ECR
        │
        ▼
cd-ms.yaml@v1  ──  aplica helm/values.yaml con el chart compartido
                   un namespace por proyecto-env
        │
        ▼
Istio ingress  ──  exposeName: "<sub>"
                   dnsAliasRecord.enabled: true
                   → <sub>.{env}.modo.com.ar (o <sub>.modo.com.ar en prod)
```

Lo que el repo **no** trae: el Helm chart (es compartido), la lógica de CI/CD (workflows reusables en `playsistemico/workflows`), la creación de DNS/ALB (la hace la plataforma a partir de `values.yaml`).

## Learning path

| # | Lección | Skill harness | Gate que toca |
|---|---------|---------------|---------------|
| 00 | [Prerrequisitos](00-prerequisitos.md) | `modo-frontend-onboarding`, `github-packages-auth` | — |
| 01 | [Tickets JSM](01-tickets-jsm.md) | `modo-jsm-ticket` | — |
| 02 | [PRs de infra](02-infra-prs.md) | `modo-frontend-onboarding`, `modo-frontend-deploy` | — |
| 03 | [Subdominio + basePath](03-subdominio-basepath.md) | `modo-frontend-deploy` | DNS / Istio |
| 04 | [Deploy + verify](04-deploy-verify.md) | `modo-frontend-deploy`, `modo-landing-smoke-test` | probes + FQDN |
| 05 | [Gate de prod](05-gate-prod.md) | `modo-jsm-ticket` | GRC / OFFSEC |
| 🧪 | [Lab: publicar un front](exercises/README.md) | todos | los 6 |

## Atajo: el agente orquestador

Si ya entendés el flujo y querés que un agente lo maneje punta a punta:

```
/modo-frontend-deploy
```

Triple-layer skill (skill + agent + slash command) que recorre el runbook canónico paso a paso: audita el estado actual, crea los archivos de infra en un worktree, te guía por los tickets JSM y te deja con los PRs listos para mergear.

## Reglas del equipo que el curso respeta

- **Sin `console.log/error/warn`** en prod.
- **Sin tokens hardcodeados** — `.npmrc` usa `${NODE_AUTH_TOKEN}`, nunca un `ghp_…` literal.
- **Un solo lockfile** (pnpm). Si hay varios, convergé antes de pushear.
- **Commits**: `type(COENXT-XXX): Subject` — scope = Jira.
- **No inventar**: ownership, aprobador, KMS ARNs, channel IDs de Slack → preguntar o `TODO(devops)`.
- **No claim sin verify**: antes de declarar "deploy listo", verificar pod `Ready` + FQDN responde.

> Empezá por [00 · Prerrequisitos](00-prerequisitos.md).
