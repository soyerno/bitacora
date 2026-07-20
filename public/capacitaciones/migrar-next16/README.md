# Capacitación · Migrar un frontend a Next.js 16 (Pages Router)

> **Harness = agentes.** Curso activo: abrís Claude Code, seguís cada lección, los gates te dicen si está bien. No es un manual para leer y guardar.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## Para quién

Dev frontend que llega con un proyecto existente —Vite SPA, Next 12/13, u otro— y necesita llevarlo a **Next.js 16 server-rendered** (Pages Router, `next start`) listo para la infra MODO en EKS.

Casos reales que guían el contenido:

- **modo-landing** — Next 12 → 16, stacked sub-PRs, 175 suites verdes.
- **aprendeatumodo** — Vite 5 → Next 16, basePath, Storyblok runtime.
- **erno-modo** — static HTML monolítico → Next 16 App Router.

## Qué vas a saber hacer al terminar

1. Diagnosticar de dónde partís (Vite / Next viejo / otro) y elegir la estrategia correcta.
2. Armar un integration branch con sub-PRs apilados sin romper CI.
3. Navegar los breaking changes de cada step (12→13, 13→14, 14→15, 15→16).
4. Manejar `next/image` moderno, runtime env (`NEXT_PUBLIC_*`), basePath y rewrites.
5. Verificar el contrato: `pnpm build` verde + smoke `curl :3000/<basePath> = 200`.
6. Disparar un deploy alpha a playsistemico.

## Learning path

| # | Lección | Qué cubre |
|---|---------|-----------|
| 00 | [Assessment](00-assessment.md) | Qué tenés hoy · Decidir target · Un solo lockfile |
| 01 | [Estrategia](01-estrategia.md) | Integration branch · Pages Router coexistence · EKS · basePath · runtime env |
| 02 | [Breaking changes](02-breaking-changes.md) | Step 12→13, 13→14, 14→15, 15→16 · image · link · Turbopack |
| 03 | [Routing + data](03-routing-data.md) | getServerSideProps · getStaticProps · ISR · catch-all · rewrites |
| 04 | [Build + test + smoke](04-build-test-smoke.md) | pnpm build verde · contrato curl · Jest mocks · policy no-snapshots |
| 05 | [Deploy](05-deploy.md) | ci-alpha · link al curso deploy-playsistemico |
| 🧪 | [Lab integrador](exercises/README.md) | Migrar una page de ejemplo end-to-end |

> Empezá por [00 · Assessment](00-assessment.md).
