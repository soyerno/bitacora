# 04 · Deploy + verify

> Harness: `modo-frontend-deploy`, `modo-landing-smoke-test` · SOPS→SSM + probes

Esta lección arranca el primer deploy a develop y lo verifica. No declarás "deploy listo" hasta tener pod `Ready` + FQDN responde + smoke curl 200. Un claim sin verify no sirve.

---

## El flujo de un deploy k8s MODO

```
1. push a main (código)
      │
      ▼
   ci.yaml  → ci-ms.yaml@v1
      │  lint + test + SonarCloud + docker build + push a ECR
      ▼
   imagen tagueada en el registry (tag = SHA del commit)

2. push parámetros (parameters/**)
      │
      ▼
   ssm.yaml  → ssm-sops.yaml@v1
      │  descifra con KMS, pushea a AWS SSM Parameter Store
      ▼
   /<PROJECT_NAME>/<ENVIRONMENT>/<KEY>  en SSM

3. deploy manual (cd.yaml workflow_dispatch)
      │
      ▼
   cd.yaml  → cd-ms.yaml@v1
      │  trae el Helm chart compartido, aplica values.yaml
      ▼
   pod levanta → entrypoint.sh baja config de SSM → exec pnpm start
      │
      ▼
   probes (liveness + readiness) verifican /:3000 o /<basePath>:3000
      │  pod queda Ready
      ▼
   FQDN disponible: <sub>.develop.modo.com.ar
```

---

## `entrypoint.sh` — la pieza no obvia

El container **no lee `.env`**. Baja la config de AWS SSM al arrancar:

```bash
#!/bin/bash
set -e

TMP_ENV=/tmp/parameters.env
TMP_JSON=/tmp/parameters.json

[[ -z "${PROJECT_NAME}" || -z "${ENVIRONMENT}" ]] && exit 127;

echo "Getting parameters from /${PROJECT_NAME}/${ENVIRONMENT}/"
aws ssm get-parameters-by-path --path "/$PROJECT_NAME/$ENVIRONMENT/" \
  --region us-east-1 --with-decryption | jq -r '.Parameters' > ${TMP_JSON}

jq -r 'map("export " + (.Name | split("/") | .[-1]) + "=" + (.Value | @sh)) | join("\n")' \
  ${TMP_JSON} | grep -v '^$' > ${TMP_ENV}

[[ "$(stat -c %s ${TMP_ENV})" == "0" ]] && exit 127;
eval $(cat ${TMP_ENV})
rm -f ${TMP_JSON} ${TMP_ENV}

cd /app && exec pnpm start
```

Puntos clave:
- Sale con código `127` si `PROJECT_NAME` o `ENVIRONMENT` están vacíos, o si SSM devuelve vacío. Falla rápido, no arranca con config a medias.
- `exec pnpm start` (no `pnpm start` solo) — el `exec` reemplaza el proceso bash por node, propagando correctamente `SIGTERM` cuando k8s mata el pod.
- `PROJECT_NAME` y `ENVIRONMENT` los inyecta el chart Helm como env vars del pod (el `envs.enabled: true` en `values.yaml`).

> **Trampa de `exec`**: si el `entrypoint.sh` usa `pnpm start` sin `exec`, el proceso node queda como hijo del bash. Cuando k8s manda SIGTERM para un rolling update, el bash lo ignora y el pod no cierra limpio → timeout de terminación + pod forzado a matar. Con `exec`, node recibe el SIGTERM directamente.

---

## SOPS → SSM: cómo llegan las variables al pod

```
parameters/<env>/configurations.yaml  (texto plano, NUNCA commiteado)
      │  sops --encrypt con la KMS del env
      ▼
parameters/<env>/configurations.yaml  (cifrado, commiteado en el repo)
      │  push a main toca parameters/** → dispara ssm.yaml
      ▼
workflow ssm-sops.yaml@v1
      │  descifra con KMS, pushea a SSM Parameter Store
      ▼
AWS SSM  /<PROJECT_NAME>/<ENVIRONMENT>/<KEY>
      │  pod arranca, entrypoint.sh get-parameters-by-path --with-decryption
      ▼
process.env.<KEY>  dentro del container
```

Para editar parámetros después del primer deploy:

```bash
# sops abre el editor, descifra y recifra automáticamente
sops parameters/qa/configurations.yaml

# commit + push de parameters/** dispara ssm.yaml
git add parameters/ && git commit -m "chore(COENXT-XXX): bump QA config"
git push
```

Revisá el diff en Actions **antes de mergear** — el workflow muestra qué cambia en SSM en texto plano (solo en el diff del workflow, no en el repo).

---

## Secretos vs configuraciones

- `configurations.yaml` — config no sensible: URLs de BFFs, feature flags, keys públicas de Amplitude/Datadog (`NEXT_PUBLIC_*`).
- `secrets.yaml` — sensible: tokens privados, credenciales de servicios.

Ambos terminan en SSM y se mergean en `process.env`. La separación es para claridad y para saber qué rotar cuando hay un leak.

---

## Ejecutar el primer deploy

### Paso 1 · Push del código (dispara CI)

```bash
# Mergear el PR de docker + el de ci
# Push a main dispara ci.yaml automáticamente
gh run watch  # seguir el Actions run en tiempo real
```

Verificar en Actions que CI terminó verde. El último step muestra la imagen tagueada:

```
✓  Build and push Docker image
   Image: <registry>/<repo>:<SHA>
```

### Paso 2 · Push de parameters (dispara SSM)

```bash
# Mergear el PR de parameters
# (Después de que devops confirmó los ARNs KMS y los parámetros están cifrados)
git push origin feat/infra-parameters  # si no está mergeado aún
```

Verificar el run de `ssm.yaml` en Actions. Debería mostrar los keys que se crearon en SSM.

### Paso 3 · Deploy manual a develop

En GitHub Actions → `cd.yaml` → "Run workflow":
- `environment`: `develop`
- `version`: dejar vacío (usa la última imagen)

O por CLI:

```bash
gh workflow run cd.yaml \
  --repo playsistemico/<repo> \
  --field environment=develop
```

### Paso 4 · Verificar el pod

```bash
# TODO(devops): necesitás acceso al cluster o pedirle a CloudOps que verifique
# El pod tiene que aparecer como Running con READY 1/1

# Si tenés acceso:
kubectl get pods -n <project-name>-develop
# Esperado:
# NAME                              READY   STATUS    RESTARTS   AGE
# <project>-deploy-abc123-xyz       1/1     Running   0          2m
```

Si el pod queda en `CrashLoopBackOff` o `0/1` por más de 2 minutos, revisá los logs:

```bash
kubectl logs <pod-name> -n <project-name>-develop
```

Los errores más frecuentes:
- `exit 127` en `entrypoint.sh` → SSM vacío. Verificar que el PR de parameters se mergeó y el run de `ssm.yaml` terminó verde.
- `ECONNREFUSED` o `Connection refused` → la app no levantó en el puerto. Verificar `containerPort` en `values.yaml` = puerto real de la app.
- `Probe failed` → las probes apuntan al path equivocado (ver [lección 03](03-subdominio-basepath.md)).

### Paso 5 · Smoke test del FQDN

```bash
# Verificar que el FQDN responde
curl -fsS -o /dev/null -w '%{http_code}\n' https://<sub>.develop.modo.com.ar/
# Esperado: 200

# Si tiene basePath:
curl -fsS -o /dev/null -w '%{http_code}\n' https://<sub>.develop.modo.com.ar/<basePath>
```

Para un smoke más completo:

```
/modo-landing-smoke-test
```

El skill verifica status codes, headers de seguridad (CSP, HSTS, X-Frame-Options), y que los assets estáticos resuelven.

---

## Flujo de promoción

Después de verificar develop:

```
develop ──► qa         (cd.yaml manual, environment=qa)
qa      ──► preprod    (cd.yaml manual, environment=preprod)
preprod ──► [GATE #5]  (lección 05)
[GATE]  ──► production (production.yaml manual, solo después del OK de GRC)
```

> No hay rollback automático — si algo falla en qa, el deploy anterior sigue corriendo hasta que deploys de nuevo. Para rollback explícito: `gh workflow run cd.yaml --field environment=qa --field version=<SHA-anterior>`.

---

## Checklist de salida

- [ ] CI verde en Actions (imagen construida y pusheada)
- [ ] `ssm.yaml` verde en Actions (parameters en SSM)
- [ ] Pod `Ready 1/1` en el namespace `<project>-develop`
- [ ] `curl https://<sub>.develop.modo.com.ar/` devuelve `200`
- [ ] Smoke test básico: assets cargan, no hay errores de CSP en consola
- [ ] Promover a qa verificando el mismo smoke en `<sub>.qa.modo.com.ar`

> Siguiente: [05 · Gate de prod](05-gate-prod.md)
