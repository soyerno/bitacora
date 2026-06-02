# 05 · Deploy alpha a playsistemico

> Objetivo: tu cambio corriendo en un ambiente alpha (develop/qa/preprod) de la infra MODO, listo para verificar perf+CSP contra el edge.

## Harness

- `modo-frontend-deploy` — ejecuta el runbook de publicación k8s paso a paso.
- `modo-frontend-onboarding` — solo si el front es **nuevo** en playsistemico (no es el caso de modo-landing, que ya está montado).

## modo-landing ya está en la plataforma

modo-landing ya tiene su infra (helm, parameters SOPS, workflows reusables de `playsistemico/workflows`). Para una página/blok nuevo **no** abrís tickets de provisioning ni tocás helm. Solo disparás un alpha.

> Si alguna vez subís un front **nuevo** a playsistemico, ahí sí aplica `modo-frontend-onboarding` (6 tickets JSM canónicos, helm/catalog/parameters clonando promos-hub). Está fuera del alcance de esta capacitación.

## El deploy alpha

Es un workflow manual: [`.github/workflows/ci-alpha.yaml`](../../../). `workflow_dispatch` con un input `environment`:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [develop, qa, preprod]
jobs:
  ci:
    uses: playsistemico/workflows/.github/workflows/ci-ms.yaml@v1
    with:
      alpha: true
      node-version: '22'
```

Dispararlo desde tu rama:

```bash
# desde la rama del PR, elegí el ambiente
gh workflow run ci-alpha.yaml -f environment=develop --ref <tu-rama>

# seguir la corrida
gh run list --workflow=ci-alpha.yaml --limit 3
gh run watch <run-id>
```

> El flujo normal de modo-landing: push a `main` auto-deploya a develop+QA. Preprod y prod son workflows manuales. El **alpha** te deja probar tu rama sin mergear.

## Cómo se configura el runtime (contexto)

No lo tocás para una página, pero saber cómo funciona evita sustos:

1. **Imagen** = `modo-base:<ver>-node22` + tu código, arranca con `entrypoint.sh` (`exec` para que SIGTERM llegue a node).
2. **Config runtime** = SOPS (`parameters/<env>/*.yaml`) → workflow `ssm-sops.yaml` → AWS SSM → `entrypoint.sh` la baja al boot. Acá viven `STORYBLOK_API_KEY` y demás por ambiente.
3. **Deploy** = workflows reusables `ci-ms.yaml`/`cd-ms.yaml` que traen el Helm chart compartido. Tu repo solo aporta `helm/values.yaml`.

Detalle completo: [`docs/runbook-publish-modo-frontend-k8s.md`](../../../) en modo-landing + skill `modo-frontend-deploy`.

## Verificá en el alpha

Una vez desplegado, cerrá los gates que rinden mejor contra el edge (lección 04):

```bash
# smoke de la ruta
curl -fsS -o /dev/null -w '%{http_code}\n' https://<alpha-host>/<tu-slug>   # 200

# perf + CSP contra el ambiente
lighthouse_audit  https://<alpha-host>/<tu-slug>
/modo-security-csp https://<alpha-host>
```

El skill `modo-landing-smoke-test` valida rutas clave por ambiente y compara prod vs preprod si necesitás cazar regresiones.

## ⚠️ Prod NO

Esta capacitación llega hasta alpha. Promover a prod es decisión del equipo + gate GRC (`modo-stakeholder-gate`, ticket OFFSEC). **Nunca dispares prod desde el curso.**

## Checklist de salida

- [ ] `ci-alpha.yaml` disparado en develop/qa/preprod desde tu rama
- [ ] Run verde
- [ ] Smoke 200 en tu ruta
- [ ] Perf + CSP cerrados contra el alpha

> Cerraste el flujo. Ahora hacé el [🧪 Lab](exercises/README.md) para fijarlo, o dejá que el agente lo orqueste con `/modo-landing-page-builder`.
