# 00 · Prerrequisitos

> Harness: `modo-frontend-onboarding`, `github-packages-auth`

Antes de tocar un solo archivo de infra, verificá que tenés todo lo que la plataforma necesita. Esta lección es el pre-flight check. Salir sin un tick en cada ítem = bloquearte más adelante.

---

## Herramientas locales

```bash
# Node — tiene que ser 22.x
node -v          # esperado: v22.x.x

# pnpm — package manager estándar del workspace
pnpm -v          # esperado: 9.x o superior

# gh CLI — para crear PRs y verificar repos
gh --version

# sops — para encriptar parameters/ (lo usás en lección 02)
sops --version   # si falta: brew install sops
```

- [ ] `node -v` muestra v22.x (`nvm use 22.22.2` si tenés nvm)
- [ ] `pnpm -v` responde sin error
- [ ] `gh --version` responde sin error
- [ ] `sops --version` responde sin error

---

## Auth a GitHub: org `playsistemico`

```bash
# Verificar auth actual
gh auth status

# Si no muestra playsistemico entre las orgs, reautenticá con el scope correcto
gh auth login --scopes "read:org,repo,read:packages"
```

Verificar que podés ver el org:

```bash
gh repo list playsistemico --limit 5
```

- [ ] `gh auth status` muestra autenticación activa
- [ ] `gh repo list playsistemico` devuelve repos (no "not found" ni 404)

---

## `~/.npmrc` con GitHub Packages

Para instalar paquetes `@playsistemico` localmente necesitás un token de GH con `read:packages`.

```
# ~/.npmrc — mínimo necesario
@playsistemico:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<TU_TOKEN_GH_read:packages>
```

> **Importante**: el token va en `~/.npmrc` local (no en el repo). El repo usa `${NODE_AUTH_TOKEN}` como variable. Si encontrás un token hardcodeado y commiteado en `.npmrc` del repo → **parar**, avisar, rotar el token y scrubear el history.

Verificar que la autenticación funciona:

```bash
export NODE_AUTH_TOKEN="$(grep -m1 'npm.pkg.github.com/:_authToken=' ~/.npmrc | sed 's/.*_authToken=//')"
npm view @playsistemico/modo-landing-web-ui-lib --registry https://npm.pkg.github.com/
```

- [ ] `~/.npmrc` tiene `_authToken=` con un token real (no placeholder)
- [ ] El `npm view` devuelve metadata del paquete (no 401 ni 403)

Si necesitás ayuda con el token: usá el skill `github-packages-auth` (`/github-packages-auth`).

---

## Repo destino en `playsistemico`

El repo tiene que existir antes de pushear cualquier PR de infra. Verificá:

```bash
gh repo view playsistemico/<nombre-de-tu-repo>
```

Si devuelve `Could not resolve to a Repository` → el repo no existe. Tenés que abrirlo vía ticket JSM (lección [01 · Tickets JSM](01-tickets-jsm.md), ticket #1 HD-1404). **No crear el repo a mano** — el proceso pasa por devops para que queden los permisos correctos.

- [ ] `gh repo view playsistemico/<tu-repo>` devuelve el repo (no 404)

---

## Repo molde: `promos-hub-site`

Las lecciones 02–04 clonan archivos de `promos-hub-site`. Necesitás tenerlo disponible local (no hace falta que sea el working directory):

```bash
gh repo clone playsistemico/promos-hub-site /tmp/promos-hub-site -- --depth=1
ls /tmp/promos-hub-site/helm/ /tmp/promos-hub-site/.github/workflows/
```

- [ ] El clone respondió sin error
- [ ] Ves `values.yaml` y `namespace.yaml` en `helm/`
- [ ] Ves al menos `ci.yaml`, `cd.yaml`, `ssm.yaml` en `.github/workflows/`

> `promos-hub-site` es el molde canónico de un front MODO en k8s (Next 15, subdominio + subpath, vivo en producción). Lo que no sepás si hacer, mirá cómo lo hace promos.

---

## Decisiones previas (antes de arrancar las lecciones)

Antes de tocar un archivo, respondé estas preguntas. Si alguna no la sabés, preguntale al lead del squad — no asumas defaults silenciosos.

| Pregunta | Por qué importa |
|----------|----------------|
| ¿Cuál es el `PROJECT_NAME`? (kebab-case, único) | Define namespace k8s, path en SSM (`/<name>/<env>/`), nombre en Datadog |
| ¿Subdominio dedicado o embebido bajo un path? | Define `exposeName` vs `assetPrefix` + rewrites |
| ¿El framework es Next 15/16 server-rendered? | La infra asume `next start` en puerto `3000`. Vite/SPA no funciona sin migrar primero |
| ¿Quién es el aprobador del ticket JSM? | Obligatorio para el ticket de provisioning — no se inventa |
| ¿Cuál es el canal de Slack para notificar CI/CD? | El `channel:` en `ci.yaml` y `production.yaml` — `TODO(devops)` si no lo sabés |

- [ ] `PROJECT_NAME` definido y verificado que sea único
- [ ] Tipo de exposición elegido (subdominio vs path)
- [ ] El repo corre `next start` y bindea `:3000` (verificar local)

---

## Checklist de salida

- [ ] Node 22, pnpm, gh CLI y sops instalados
- [ ] Auth a `playsistemico` confirmada
- [ ] `~/.npmrc` con token GH Packages funcional
- [ ] Repo destino existe en `playsistemico`
- [ ] `promos-hub-site` clonado en `/tmp/promos-hub-site`
- [ ] Decisiones de `PROJECT_NAME` + tipo de exposición tomadas

> Siguiente: [01 · Tickets JSM](01-tickets-jsm.md)
