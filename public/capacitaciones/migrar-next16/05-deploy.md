# 05 · Deploy — Alpha a playsistemico

> Objetivo: disparar el primer deploy de la migración a QA y verificar que el pod levanta.

---

## ci-alpha — el workflow de QA

modo-landing tiene `.github/workflows/ci-alpha.yaml` con `workflow_dispatch` que acepta cualquier `ref`. Cuando termina exitoso, dispara automático `Frontend CD` que deploya a QA.

```bash
gh workflow run ci-alpha.yaml \
  --repo playsistemico/modo-landing \
  --ref feat/COENXT-XXX-nextjs-12-to-16-migration \
  -f environment=qa
```

> **Nota**: el `headBranch` que muestra el CD run aparece como `main` porque el workflow `cd.yaml` está en main, pero el deploy usa el artifact del builder alpha contra la branch indicada. Es el comportamiento esperado.

---

## Stop-the-line si en QA se cumple alguna de estas

No mergear el sub-PR a integration si:

- LCP empeora >200ms respecto al baseline.
- Sentry error rate >2× el baseline.
- Bundle crece >10% acumulado.
- Storyblok ISR no revalida (páginas CMS desactualizadas).
- Deep links iOS/Android no resuelven.
- El pod no queda Ready (probe fallando — revisar basePath en el probe config).

---

## Rollback strategy

| Nivel | Acción | ETA |
|-------|--------|-----|
| Sub-PR en integration | `git revert <squash-commit>` + push → ci-alpha redeploya QA | <10 min |
| Integration en main | `git revert <merge-commit>` en main → CD redeploya develop/QA | <10 min |
| Producción | `helm rollback modo-landing-prod <prev-revision>` | <5 min |

---

## Para el deploy completo a playsistemico (infra MODO EKS)

La migración produce un build que la infra arrancar con `next start`. El setup completo de infra (SOPS, SSM, Helm, ingress ALB, tickets JSM) está en el curso dedicado:

> Ver **[Curso: Deploy a playsistemico](https://soyernomodo.github.io/erno-modo/capacitaciones/deploy-playsistemico/)** para el workflow completo de infra MODO EKS.

Ese curso cubre:
- Clonar la infra de `promos-hub-site` como base.
- Configurar parámetros en SSM por ambiente.
- Tickets JSM para apertura de subdominio y certificado.
- Configurar los probes de liveness/readiness al `basePath` correcto.
- Pipeline CD: develop → QA → preprod → prod.

---

## Checklist de salida

- [ ] ci-alpha disparado contra la branch de la migración
- [ ] Deploy QA exitoso — pod Ready
- [ ] Smoke en QA URL: `GET /<basePath>` = 200
- [ ] No hay regresos de LCP, error rate ni bundle size
- [ ] Deep links y rewrites verificados
- [ ] Sub-PR mergeado a integration (squash)

> Curso completo de deploy: [deploy-playsistemico](https://soyernomodo.github.io/erno-modo/capacitaciones/deploy-playsistemico/)
>
> Volver al [inicio](#intro) o hacer el [Lab integrador](exercises/README.md).
