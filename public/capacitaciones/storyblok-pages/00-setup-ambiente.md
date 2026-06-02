# 00 · Setup de ambiente

> Objetivo: modo-landing corriendo en `localhost`, autenticado a GitHub Packages, leyendo Storyblok. Sin esto, nada de lo que sigue funciona.

## Harness

- `modo-team-onboarding` — si recién te sumás al ecosistema MODO con Claude Code, corré el onboarding para tener skills/MCPs/memoria al día.
- `github-packages-auth` — inyecta el token de GH Packages cuando corrés `pnpm install/build`.

## 1. Prerrequisitos

| Qué | Versión | Cómo |
|-----|---------|------|
| Node | 22.22.2 | `nvm use 22.22.2` |
| Package manager | pnpm | `corepack enable && corepack prepare pnpm@latest --activate` |
| Token GH Packages | `read:packages` | en `~/.npmrc` (abajo) |

> modo-landing es **Next.js 12** con TypeScript loose (`strict: false`). El dev server corre `node server.js`, no `next dev` pelado.

## 2. `.npmrc` para `@playsistemico`

Las libs internas (incluida `@playsistemico/modo-ui-lib-web`, el design system) viven en GitHub Packages. Necesitás un token con `read:packages`:

```
//npm.pkg.github.com/:_authToken=<TU_TOKEN>
@playsistemico:registry=https://npm.pkg.github.com/
```

El skill `github-packages-auth` lo inyecta automáticamente al correr pnpm. Manual:

```bash
export NODE_AUTH_TOKEN="$(grep -m1 'npm.pkg.github.com/:_authToken=' ~/.npmrc | sed 's/.*_authToken=//')"
```

## 3. Instalar + variables

```bash
cd modo-landing
pnpm install
cp .env.example .env.local   # completá con valores reales (no inventes)
```

Grupos de vars en `.env.example`. Para **Storyblok** te importan:

| Var | Para qué |
|-----|----------|
| `STORYBLOK_API_KEY` | token de lectura del space (Content Delivery API) |
| `ISR_REVALIDATE_TOKEN` | revalidación de ISR (cuando aplica) |

> El cliente Storyblok se inicializa en [`src/CMS/config.ts`](../../../) con `region: 'eu'`. **Verificá el region/space que te asignen**: si tu token es de un space en otra región, ajustá. El código productivo hoy usa `eu`; confirmá antes de autorar para no pegarle a un space equivocado.

## 4. Levantar

```bash
pnpm dev      # node server.js → http://localhost:3000
```

Abrí una ruta CMS conocida (ej. `/bancos`) para confirmar que trae contenido de Storyblok.

## 5. Paridad con CI (importante)

`pnpm dev` **no lintea**. Antes de pushear, reproducí lo que corre el Frontend CI:

```bash
pnpm lint      # ESLint
pnpm build     # lint + next build → /dist
pnpm test      # Jest
```

Si `pnpm build` pasa local, el CI de build casi seguro pasa. Esto te evita el ciclo push→falla→fix.

## Checklist de salida

- [ ] `node -v` → 22.22.2
- [ ] `pnpm install` sin errores de auth (`@playsistemico` resuelve)
- [ ] `.env.local` con `STORYBLOK_API_KEY` real + region confirmado
- [ ] `pnpm dev` levanta y una ruta CMS trae contenido
- [ ] `pnpm build` verde local

> Siguiente: [01 · Diseño: SDD + design system](01-diseno-sdd-design-system.md)
