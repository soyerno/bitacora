# 02 · PRs de infra

> Harness: `modo-frontend-onboarding`, `modo-frontend-deploy` (`/modo-frontend-deploy`)

Esta lección crea los 6 PRs de infra que enchufan tu repo a la plataforma compartida. El patrón es **clonar promos-hub-site** ajustando los valores per-project, y abrir un PR por concern (sin overlap de archivos). Así cada PR es reviewable en paralelo y su rollback es aislado.

---

## Qué aporta el repo vs qué es compartido

La plataforma MODO funciona porque **separó la responsabilidad**. Tu repo aporta la config declarativa; la plataforma trae la lógica.

| Tu repo aporta | La plataforma trae |
|----------------|--------------------|
| `helm/values.yaml` + `helm/namespace.yaml` | Helm chart compartido v1.15.3 (vía `cd-ms.yaml@v1`) |
| `.github/workflows/ci.yaml` (solo llama) | `playsistemico/workflows/ci-ms.yaml@v1` |
| `.github/workflows/cd.yaml` (solo llama) | `playsistemico/workflows/cd-ms.yaml@v1` |
| `parameters/<env>/*.yaml` (cifrados SOPS) | Workflow `ssm-sops.yaml@v1` → AWS SSM |
| `Dockerfile` + `entrypoint.sh` | Imagen base `modo-base:<ver>-node22` |
| `catalog/global.yaml` | Workflow `catalog@v1` → service catalog |

> No copiés el chart. No copiés los workflows reusables. Tu repo solo llama — la lógica vive en `playsistemico/workflows`.

---

## Los 6 PRs y sus archivos (sin overlap)

| PR | Branch sugerida | Archivos | Nota |
|----|----------------|----------|------|
| catalog | `feat/infra-catalog` | `catalog/global.yaml` + `catalog.yaml` workflow | Provisiona el service catalog |
| helm | `feat/infra-helm` | `helm/values.yaml` + `helm/namespace.yaml` | Probes a `/<basePath>` si hay basePath |
| parameters | `feat/infra-parameters` | `.sops.yaml` + `parameters/<env>/configurations.yaml` + `parameters/<env>/secrets.yaml` | Necesita ARNs KMS de devops |
| ci | `feat/infra-ci` | `.github/workflows/ci.yaml` + `pr.yaml` + `sonar-project.properties` | Necesita secrets de org |
| cd | `feat/infra-cd` | `.github/workflows/cd.yaml` + `production.yaml` | — |
| docker | `feat/infra-docker` | `Dockerfile` + `entrypoint.sh` + `.dockerignore` + `.npmrc` | `chmod +x entrypoint.sh` antes del commit |

> **Sin overlap** = cada archivo aparece en exactamente un PR. Así podés mergear o revertir un PR sin tocar los demás.

---

## Receta de creación (paso a paso)

### 1. Scaffold de todos los archivos en una branch local

Primero creás todos los archivos en una sola branch (no se pushea; es solo la fuente):

```bash
# Asegurate de estar en un worktree dedicado
git worktree add /tmp/<repo>-infra -b feat/infra-scaffold origin/main
cd /tmp/<repo>-infra

# Copiá los archivos de promos-hub y ajustá los valores per-project
# (ver tabla de sustituciones abajo)
cp /tmp/promos-hub-site/Dockerfile .
cp /tmp/promos-hub-site/entrypoint.sh . && chmod +x entrypoint.sh
cp /tmp/promos-hub-site/.dockerignore .
cp /tmp/promos-hub-site/.npmrc .
cp -r /tmp/promos-hub-site/helm .
cp /tmp/promos-hub-site/.sops.yaml .
cp -r /tmp/promos-hub-site/parameters .
cp -r /tmp/promos-hub-site/catalog .
cp -r /tmp/promos-hub-site/.github .

# Ajustá los valores per-project (ver tabla abajo)
# Commitear en la branch scaffold (fuente para las slices)
git add -A && git commit -m "chore(COENXT-XXX): scaffold infra EKS (clon promos-hub)"
INFRA_SHA=$(git rev-parse HEAD)
echo "INFRA_SHA=$INFRA_SHA"
```

### 2. Tabla de sustituciones promos → tu proyecto

| Campo | Valor promos-hub | Reemplazar por |
|-------|-----------------|----------------|
| `app.name` en `values.yaml` | `"promos-hub-site"` | `"<tu-project-name>"` |
| `exposeName` en `values.yaml` | `"promoshub"` | `"<tu-exposeName>"` (o quitarlo si es apex/basePath) |
| `containerPort` + probes | `3000` | `3000` para Next 15/16 (no cambiar si usás el default) |
| `PROJECT_NAME` en `namespace.yaml` | `promos-hub-site` | `<tu-project-name>` |
| `channel:` en `ci.yaml` | `"C04FCA0BG6S"` | `TODO(devops)` — pedíselo al squad |
| `extra-content:` en `ci.yaml` | `"loaderNextImage/ dist/"` | Solo `"dist/"` si no tenés loader custom |
| KMS ARNs en `.sops.yaml` | ARNs de promos | `TODO(devops)` — pedíselos a DevOps |
| `parameters/<env>/` contenido | Vars de promos | Vars de tu proyecto (limpiarlas antes de cifrar) |

> **ARNs de KMS**: no copies los de promos. Son por-repo. Pedíselos a DevOps o copiá los de un repo hermano que tu squad ya tenga. El `.sops.yaml` sin ARNs reales no puede cifrar — dejá `TODO(devops)` y el PR de parameters se revisará con ARNs pendientes.

### 3. Abrir cada PR como slice del scaffold

Para cada PR, creás una branch desde `main` del repo destino, le aplicás solo los archivos que le corresponden del scaffold, y abrís el PR:

```bash
# Ejemplo para el PR de helm
git checkout -b feat/infra-helm origin/main
git checkout $INFRA_SHA -- helm/
git add helm/ && git commit -m "chore(COENXT-XXX): infra helm (values + namespace)"
git push origin feat/infra-helm
gh pr create --repo playsistemico/<repo> \
  --base main \
  --head feat/infra-helm \
  --title "chore(COENXT-XXX): infra helm (values + namespace)" \
  --body "PR 2/6 de infra. Aporta helm/values.yaml + helm/namespace.yaml clonando promos-hub.
  Pendiente: confirmar containerPort y probes con el squad."
```

Repetir para cada uno de los 6 PRs, cambiando los paths y el mensaje.

---

## Trap del retarget (si mergean antes de tiempo)

Los 6 PRs de infra targetean `main`. Si alguien mergea el PR de migración base y GitHub tiene *delete-branch-on-merge* activo, los PRs pueden quedar sin base. Opciones:

- **(a) Retargetear** los 6 PRs a `main` después del merge: `gh pr edit <N> --base main`. OJO: no rebasa, solo cambia el ref; el diff puede verse inflado.
- **(b) Serializar**: mergear la migración, rebasar las branches de infra sobre `main`, recién abrir los PRs. Diff limpio pero más lento.
- **(c) Desactivar delete-on-merge** para el PR base.

Elegí la opción que tenga sentido para tu flujo. El rollback de infra es siempre aislado por concern.

---

## Anatomía del repo desplegable (inventario)

Al final de esta lección tu repo tiene que tener todos estos archivos. Si falta alguno, el deploy falla silencioso o no enchufa:

```
repo/
├── Dockerfile                         # FROM modo-base:<ver>-node22
├── entrypoint.sh                      # baja config de SSM + exec pnpm start
├── .dockerignore
├── .npmrc                             # ${NODE_AUTH_TOKEN} — nunca hardcodeado
├── helm/
│   ├── values.yaml                    # subdominio, probes, recursos, autoscaling
│   └── namespace.yaml                 # <project>-<env> + istio-injection: enabled
├── .sops.yaml                         # reglas KMS por env
├── parameters/
│   ├── develop/{configurations,secrets}.yaml    # SOPS-cifrados
│   ├── qa/{configurations,secrets}.yaml
│   ├── preprod/{configurations,secrets}.yaml
│   └── production/{configurations,secrets}.yaml
├── catalog/
│   └── global.yaml
└── .github/workflows/
    ├── ci.yaml        # → ci-ms.yaml@v1
    ├── pr.yaml        # → pr-ms.yaml@v1
    ├── cd.yaml        # → cd-ms.yaml@v1 (develop/qa/preprod)
    ├── production.yaml # → cd-ms.yaml@v1 (prod, manual)
    ├── ssm.yaml       # → ssm-sops.yaml@v1
    └── catalog.yaml   # → catalog@v1
```

---

## Checklist de salida

- [ ] Branch scaffold creada con todos los archivos (valores per-project aplicados)
- [ ] `app.name` en `values.yaml` = `<tu-project-name>` (único)
- [ ] `containerPort` y probes apuntan al puerto correcto (`:3000` para Next)
- [ ] `.npmrc` usa `${NODE_AUTH_TOKEN}` — no hay `ghp_…` literal
- [ ] `entrypoint.sh` tiene `chmod +x` aplicado
- [ ] KMS ARNs en `.sops.yaml`: tienen valor real o están marcados `TODO(devops)`
- [ ] 6 PRs abiertos en `playsistemico/<repo>` con branches sin overlap
- [ ] Cuerpo de cada PR dice qué archivos toca y si tiene dependencia de otro PR o de devops

> Siguiente: [03 · Subdominio + basePath](03-subdominio-basepath.md)
