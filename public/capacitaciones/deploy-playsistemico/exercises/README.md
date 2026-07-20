# Lab · Publicar un front de ejemplo end-to-end (dry-run)

> Harness: todos (`modo-frontend-onboarding`, `modo-frontend-deploy`, `modo-jsm-ticket`, `frontend-security-checklist`, `modo-landing-smoke-test`)

Este lab integra todo lo que viste en las 5 lecciones en un ejercicio continuo. El objetivo es que hagás el flujo completo de punta a punta **en modo dry-run** — es decir, creando los archivos reales y abriendo los tickets, pero desplegando a `develop` solamente (no llegás a prod en el lab).

Usá como proyecto de práctica: **`mi-front-modo`** (nombre de fantasía; en un proyecto real sería el nombre del producto).

---

## Contexto del escenario

Tenés un repo Next 15 con la app básica ya funcionando en local. El repo existe en `playsistemico/mi-front-modo` (lo creamos en el paso 1). El front va a vivir en `mifront.modo.com.ar` (subdominio dedicado). No tiene basePath.

---

## Paso 0 · Pre-flight check

Antes de arrancar, verificá que tenés todo lo de la [lección 00](../00-prerequisitos.md):

```bash
node -v && pnpm -v && gh --version && sops --version
gh repo list playsistemico --limit 3
npm view @playsistemico/modo-landing-web-ui-lib --registry https://npm.pkg.github.com/ 2>/dev/null | head -2
```

- [ ] Todas las herramientas responden sin error
- [ ] GitHub Packages auth funciona

---

## Paso 1 · Ticket #1 (simulado)

En un proyecto real abrirías el ticket HD-1404. Para el lab, asumimos que el repo ya existe. Verificar:

```bash
gh repo view playsistemico/mi-front-modo 2>/dev/null || echo "repo no existe — en prod abrirías HD-1404"
```

Anotá el orden correcto de los 6 tickets sin mirar la lección 01:

```
Ticket #1: _______________________  sd/rt: ___ / ___
Ticket #2: _______________________  sd/rt: ___ / ___
Ticket #3: _______________________  sd/rt: ___ / ___
Ticket #4: _______________________  (cuándo abre): _______________
Ticket #5: _______________________  (cuándo abre): _______________
Ticket #6: _______________________  (cuándo abre): _______________
```

- [ ] Podés nombrar los 6 tickets y su orden sin mirar las notas

---

## Paso 2 · Auditoría del repo

Antes de crear archivos, auditá el estado:

```bash
R=<ruta-a-mi-front-modo>
echo "Dockerfile:";    ls $R/Dockerfile 2>/dev/null    || echo "FALTA"
echo "entrypoint.sh:"; ls $R/entrypoint.sh 2>/dev/null || echo "FALTA"
echo ".npmrc:";        grep -l 'NODE_AUTH_TOKEN' $R/.npmrc 2>/dev/null || echo "FALTA o token hardcodeado"
echo "helm/:";         ls $R/helm/values.yaml 2>/dev/null || echo "FALTA"
echo ".sops.yaml:";    ls $R/.sops.yaml 2>/dev/null    || echo "FALTA"
echo "workflows:";     ls $R/.github/workflows/ci.yaml 2>/dev/null || echo "FALTAN"
echo "PAT leak:";      grep -rn 'ghp_[A-Za-z0-9]' $R/.npmrc 2>/dev/null && echo "⚠️ TOKEN HARDCODEADO" || echo "limpio"
```

- [ ] Gap-list anotada: qué archivos faltan

---

## Paso 3 · Scaffold de infra (clon promos-hub)

En un worktree dedicado:

```bash
git worktree add /tmp/mi-front-infra -b feat/infra-scaffold origin/main
cd /tmp/mi-front-infra

# Clonar los archivos de promos-hub
cp /tmp/promos-hub-site/Dockerfile .
cp /tmp/promos-hub-site/entrypoint.sh . && chmod +x entrypoint.sh
cp /tmp/promos-hub-site/.dockerignore .
cp /tmp/promos-hub-site/.npmrc .
cp -r /tmp/promos-hub-site/helm .
cp /tmp/promos-hub-site/.sops.yaml .
cp -r /tmp/promos-hub-site/parameters .
cp -r /tmp/promos-hub-site/catalog .
cp -r /tmp/promos-hub-site/.github .
```

Ahora aplicar los valores per-project. Editá `helm/values.yaml` para que tenga:
- `app.name: "mi-front-modo"`
- `exposeName: "mifront"`
- `containerPort: 3000`
- Probes a `path: /`
- KMS ARNs: `TODO(devops)` en `.sops.yaml`
- `channel:` en `ci.yaml`: `TODO(devops)`

```bash
# Verificar que no quedó ningún "promos-hub" sin reemplazar
grep -r "promos-hub\|promoshub" helm/ .github/ catalog/ .sops.yaml 2>/dev/null
```

- [ ] `grep` no encuentra "promos-hub" ni "promoshub" en los archivos editados
- [ ] `.npmrc` tiene `${NODE_AUTH_TOKEN}` (no `ghp_…`)
- [ ] `chmod +x entrypoint.sh` aplicado (verificar con `ls -la entrypoint.sh`)

---

## Paso 4 · Abrir los 6 PRs

Desde la branch scaffold, crear los 6 PRs como slices sin overlap. Por cada PR:

```bash
# Ejemplo para helm
git checkout -b feat/infra-helm origin/main
git checkout feat/infra-scaffold -- helm/
git add helm/ && git commit -m "chore(COENXT-XXX): infra helm · mi-front-modo"
# En modo dry-run, verificar el diff antes de pushear:
git diff HEAD~1 --name-only
```

- [ ] 6 branches creadas, cada una con solo los archivos de su concern
- [ ] Ninguna branch tiene archivos de otra (verificar con `git diff HEAD~1 --name-only`)
- [ ] `entrypoint.sh` usa `exec pnpm start` (no `pnpm start` solo)

---

## Paso 5 · Verificar config de subdominio

Respondé sin mirar las notas:

1. ¿Qué campo en `values.yaml` define el prefijo del subdominio? `___________`
2. ¿Qué dos campos hay que habilitar para que la plataforma cree el DNS automáticamente? `___________` + `___________`
3. Si la app tuviera `basePath: /mipath`, ¿a qué path deberían apuntar las probes? `___________`
4. ¿Cuál es la diferencia entre `basePath` y `assetPrefix`? (explicar en 1 oración)

- [ ] Respondiste las 4 preguntas sin mirar la lección 03

---

## Paso 6 · Simular el deploy a develop

En modo dry-run no tenés acceso al cluster. Pero podés verificar el contrato local:

```bash
# La app levanta en el puerto correcto
pnpm build && pnpm start &
sleep 8
curl -fsS -o /dev/null -w '%{http_code}\n' http://localhost:3000/
# Esperado: 200
kill %1
```

Y verificar que `entrypoint.sh` fallaría si SSM estuviera vacío (comportamiento esperado):

```bash
# Sin PROJECT_NAME y ENVIRONMENT, debe salir 127
bash -c 'source ./entrypoint.sh' 2>/dev/null; echo "exit: $?"
# Esperado: exit: 127
```

- [ ] `curl localhost:3000` devuelve `200`
- [ ] `entrypoint.sh` sin vars de entorno devuelve exit 127

---

## Criterio de aprobado

El lab se considera aprobado cuando:

- [ ] Pre-flight check completo (paso 0)
- [ ] Los 6 tickets nombrados en orden correcto (paso 1)
- [ ] Gap-list auditada antes de crear archivos (paso 2)
- [ ] Scaffold completo sin "promos-hub" remanente (paso 3)
- [ ] 6 branches sin overlap de archivos (paso 4)
- [ ] 4 preguntas de subdominio respondidas sin notas (paso 5)
- [ ] App levanta en :3000 y entrypoint.sh falla rápido sin vars (paso 6)
- [ ] `.npmrc` sin token hardcodeado en ningún archivo staged

---

## Checklist de errores comunes para revisar

Antes de declarar el lab completo, verificar que no cayste en ninguna de estas trampas:

- [ ] No copiaste los KMS ARNs de promos — están como `TODO(devops)` o son ARNs reales del nuevo proyecto
- [ ] `exec pnpm start` (no `pnpm start` solo) en `entrypoint.sh`
- [ ] Probes apuntan a `/` (no a `/<basePath>` cuando no hay basePath)
- [ ] `containerPort` en `values.yaml` = `3000` (no `8080` de modo-landing legacy)
- [ ] `app.name` en `values.yaml` es único y en kebab-case

> Si tenés dudas de si algo está bien, invocar `/modo-frontend-deploy` — el skill audita el estado del repo y te dice qué falta con una gap-list honesta.
