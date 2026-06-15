# 08 · Pipeline de PRs

> Objetivo: que cada PR cuente su historia (el por qué antes del qué), traiga su metadata, y se mergee sin perder trabajo ni revertir en silencio lo que entró a `main` mientras tanto.

---

## La descripción: Pain / Purpose / How

Todo PR abre con tres secciones, en este orden:

```markdown
## Dolor
El rail "Servicios cerca tuyo" abría el mapa centrado en el USUARIO,
no en el servicio. El usuario tocaba un veterinario y el mapa no lo mostraba.

## Para qué
Cerrar el embudo: ver un servicio → tocarlo → verlo en el mapa.
Sin esto, el rail no lleva a ningún lado.

## Cómo
Deep-link `?poiId=&poiType=` (igual que el directorio) en vez de setear
estado React antes de `router.push` (que se pierde porque /mapa remonta).
```

El **por qué antes del qué**: un revisor que entiende el Dolor lee el diff con contexto. Un PR que arranca con "cambié `onOpenServiceOnMap`" obliga a reconstruir el motivo desde el código.

---

## La metadata (lo que `pr-lint` exige)

Cada PR trae, no negociable:

- **milestone** = la fase del roadmap a la que pertenece.
- **labels** = `tipo:` (feat/fix/...) + `área:` (feed/admin/security/...).
- **assignee**.
- una sección **🏁 Hito** que lo ata a un hito real del producto.

> **Caso Firulapp**: auditamos el historial completo —479 PRs— y los retrofiteamos a 479/479 con milestone + labels + assignee + título Conventional + las secciones con 🏁 Hito. La metadata no es burocracia: es lo que hace navegable el roadmap meses después.

Los commits siguen Conventional Commits (`commit-lint`); el merge a `main` dispara el release ([Lección 07](07-gates.md)).

---

## Los 4 agentes del pipeline

```
pr-creator      → abre el PR: Pain/Purpose/How + metadata + labels
pr-review       → correctitud + simplificación (¿se puede más simple?)
pr-auditor      → seguridad + calidad (rules, PII, deps)
pr-integration  → EL CORAZÓN ↓
```

### Por qué `pr-integration` es el corazón

Hace dos cosas que, salteadas, pierden trabajo:

1. **Detecta solape de archivos** entre PRs en vuelo. Dos PRs que tocan `jobs.ts` no se mergean a ciegas.
2. **Sincroniza la branch con `main` ANTES de mergear.**

> **Trampa del revert silencioso**: si mergeás una branch basada en un `main` viejo sin sincronizar, el merge "gana" sobre lo que entró a `main` en el medio —lo borrás sin que nadie lo note—. Sincronizar (rebase/merge de `main` a tu branch) antes del merge final lo evita. Es la causa raíz #1 de trabajo perdido en paralelo.

---

## Mergear: estrategia y gotchas

```bash
gh pr merge <n> --squash          # squash = 1 commit limpio por PR
# desde un worktree, SIN --delete-branch (falla "main is used by worktree")
git push origin --delete feat/x   # borrar la rama remota aparte
```

> **Gotcha que cierra PRs por accidente**: borrar la rama remota de un PR **no mergeado** lo **cierra**. Antes de borrar cualquier rama, verificá `state:MERGED`. Si se cerró solo, dejá un `gh pr comment` con el motivo —para no perder la traza de por qué murió—.

`--admin` (saltear checks) lo bloquea el classifier sin OK explícito de bypass: no es para uso casual.

---

## La regla que abraza todo: no perder trabajo

Todo cambio cierra con su PR. Nada queda suelto en el working tree. Mergeás en orden seguro (si un PR depende de otro, completás la metadata para que no se pisen). Y nunca cruzás el merge final —acción irreversible— sin el OK del humano cuando el mandato lo pide.

---

## Checklist de salida

- [ ] El PR abre con Dolor / Para qué / Cómo (el por qué antes del qué)
- [ ] Metadata completa: milestone + labels (tipo+área) + assignee + 🏁 Hito
- [ ] Título y commits en Conventional Commits (pasan `commit-lint`/`pr-lint`)
- [ ] La branch se sincroniza con `main` antes del merge (no revert silencioso)
- [ ] Solape de archivos chequeado entre PRs en vuelo
- [ ] Verificás `state:MERGED` antes de borrar cualquier rama remota
- [ ] Si un PR se cierra (mergeado o no), queda un comentario con el motivo

> Siguiente: [09 · Seguridad por defecto](09-seguridad.md)
