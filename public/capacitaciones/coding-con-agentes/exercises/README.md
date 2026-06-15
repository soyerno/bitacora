# Lab · Una feature chica end-to-end con la metodología completa

> Lab integrador del curso [Coding con una flota de agentes](../README.md).
>
> Duración estimada: 60-90 min con Claude Code abierto, sobre **tu propio repo**.

---

## Objetivo

Llevar una feature chica —algo que puedas terminar en una sesión— desde el pedido hasta el PR, aplicando cada pieza de la metodología en orden. No importa qué construyas; importa que pase por todos los gates.

Sugerencias de feature chica: un toggle de preferencia, un endpoint de solo-lectura, una tarjeta nueva en una lista, un filtro. Algo con UI **y** server, para tocar las capas de flags.

---

## Paso 1 — Pensar antes de codear ([Lección 00](../00-mentalidad.md))

Antes de tocar nada, escribí (en un comentario, en el chat con el agente):

- [ ] El pedido en una frase, sin ambigüedad.
- [ ] El supuesto que estás haciendo (y si es ambiguo, **nombralo** en vez de elegir en silencio).
- [ ] La alternativa más simple que resuelve el pedido.

> Si el pedido tiene dos interpretaciones, pará y presentalas. No avances a ciegas.

---

## Paso 2 — ¿SDD sí o no? ([Lección 02](../02-openspec.md))

Decidí con la tabla:

- [ ] ¿Es feature nueva / breaking / arquitectura / seguridad? → escribí una propuesta OpenSpec con `proposal.md` + `tasks.md` + ≥1 `#### Scenario:` verificable.
- [ ] ¿Es fix / typo / dep / config? → salteá la propuesta, andá directo al worktree.

Anotá tu decisión y por qué: `____________________`

---

## Paso 3 — Worktree off `main` fresco ([Lección 03](../03-worktrees.md))

```bash
git fetch origin main
git worktree add /tmp/wt-lab-feature -b feat/lab-mi-feature origin/main
cd /tmp/wt-lab-feature
```

- [ ] Basado en `origin/main` (no en `main` local stale)
- [ ] Las escrituras usan el prefijo del worktree

---

## Paso 4 — Definir criterios verificables ([Lección 10](../10-loop-objetivos.md))

Antes de construir, escribí qué es "funcionar". Ejemplo:

```
□ POST /api/mi-feature devuelve 200 con el payload válido
□ con el flag OFF, la ruta 404ea y el endpoint rechaza
□ el componente nuevo renderiza el estado vacío sin romper
□ test unit del caso de uso pasa en verde
```

- [ ] Tenés ≥3 criterios que podés **correr y mirar** (no "que ande")

---

## Paso 5 — Construir (delegando) ([Lección 04](../04-oficina-agentes.md))

- [ ] Delegás a un agente especializado del dominio (back / front / ...)
- [ ] El mínimo código que cumple los criterios (sin features no pedidas)
- [ ] Si toca frontend: pasás la solución por una **crítica de UX** y arreglás lo que marque

---

## Paso 6 — Gatear detrás del flag ([Lección 06](../06-feature-flags.md))

Si es feature nueva, las 4 capas:

- [ ] **Nav**: la entrada de menú/botón solo aparece con el flag ON
- [ ] **Ruta**: la página 404ea con el flag OFF
- [ ] **Componentes**: no renderizan nada de la feature con el flag OFF
- [ ] **API**: el endpoint rechaza con el flag OFF
- [ ] Verificaste el **runtime real** con el flag OFF (no confiaste solo en el check)

---

## Paso 7 — Correr los gates ([Lección 07](../07-gates.md))

```bash
# lo que corre tu pre-commit (ajustá a tu repo)
npm run validate     # typecheck:src + check:arch + test:unit
```

- [ ] `validate` en verde
- [ ] El archivo nuevo no dispara el size-gate (si lo dispara, partilo)
- [ ] Corriste la app y miraste el comportamiento real (no solo el check verde)

---

## Paso 8 — El PR ([Lección 08](../08-pipeline-prs.md))

- [ ] Descripción con **Dolor / Para qué / Cómo**
- [ ] Metadata: milestone + labels (tipo+área) + assignee + 🏁 Hito
- [ ] Título en Conventional Commits
- [ ] La branch sincronizada con `main` antes de proponer el merge

> El merge final es irreversible: si conducís en nombre de alguien, no lo cruces sin su OK.

---

## Paso 9 — Auto-evaluación honesta ([Lección 10](../10-loop-objetivos.md))

Cerrá con honestidad. Completá:

- [ ] **Self-score (1-5)**: ¿cuán bien cumple los criterios del Paso 4? `___`
- [ ] **Qué quedó afuera / a medias** (decilo, no lo escondas): `____________`
- [ ] **Resultados como son**: pegá la salida real de los tests/app, no "anda todo"

> Si tu self-score difiere de lo que diría un revisor senior, ahí está tu calibración para mejorar.

---

## Paso 10 — Destilar el aprendizaje ([Lección 01](../01-contexto-memoria.md))

- [ ] Si aprendiste algo no-obvio (un gotcha, un falso positivo, una trampa), escribilo a memoria —el **por qué**, no el qué—.
- [ ] Si descubriste un patrón que se repite, evaluá destilarlo en una skill ([Lección 05](../05-skills.md)).

---

## Limpiar el worktree

```bash
# desde el checkout principal (NO desde adentro del worktree)
git worktree remove /tmp/wt-lab-feature
```

---

## Checklist final del lab

- [ ] Pensé antes de codear; nombré el supuesto ambiguo
- [ ] Decidí SDD-sí/no con criterio
- [ ] Trabajé en un worktree off `main` fresco
- [ ] Definí criterios verificables ANTES de construir
- [ ] Delegué a un agente; el front pasó por crítica de UX
- [ ] Gateé las 4 capas y verifiqué el runtime con el flag OFF
- [ ] `validate` en verde; corrí la app de verdad
- [ ] PR con Pain/Purpose/How + metadata, sincronizado con `main`
- [ ] Me auto-evalué honesto (self-score + qué quedó afuera + salida real)
- [ ] Destilé el aprendizaje durable a memoria

> Volvé al [inicio del curso](../README.md). Esto no se aprende leyéndolo: se aprende corriéndolo. Repetí el loop con la próxima feature.
