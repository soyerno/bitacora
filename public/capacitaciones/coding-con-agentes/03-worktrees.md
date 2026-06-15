# 03 · Worktree por feature

> Objetivo: aislar cada feature/fix en su propio worktree + branch + PR, basado en `main` **fresco**, sin pisar el checkout compartido ni la branch activa de otra sesión. Y conocer los gotchas que cuestan trabajo perdido.

---

## El problema: agentes en paralelo sobre un repo

Apenas corrés más de una sesión de agente sobre el mismo repo, el checkout compartido se vuelve un campo minado:

- La sesión A edita `feed.ts`, la sesión B también → se pisan.
- Un `git checkout otra-branch` en el checkout compartido deja a la otra sesión editando archivos que ya no son los suyos.
- Basás una branch en tu `main` **local** (stale) y el diff aparece como si revirtieras el trabajo de otro.

La solución no es coordinar a mano. Es **aislar**: cada unidad de trabajo en su propio worktree.

---

## La regla

> Cada feature/fix vive en su propio **worktree + branch + PR**, basado en `origin/main` fresco. Nunca mutás el checkout compartido ni la branch activa de otra sesión. Ni un cambio de una línea queda suelto en el working tree.

```bash
# Siempre: fetch primero, basar en origin/main (no en main local stale)
git fetch origin main
git worktree add /tmp/wt-mi-feature -b feat/mi-feature origin/main
cd /tmp/wt-mi-feature
# ...trabajás acá, aislado del checkout principal...
```

Un worktree es un checkout adicional del mismo repo en otra carpeta, con su propia branch. Las sesiones no se ven entre sí. Cuando terminás, abrís el PR y limpiás el worktree.

---

## Por qué `origin/main` fresco y no `main` local

> **Trampa del falso revert**: si tu `main` local está atrás de `origin/main`, una branch basada en él va a mostrar como "borrado" todo lo que entró a `origin/main` desde tu último fetch. El PR parece un revert masivo.

```bash
# ❌ basa en main local (puede estar stale)
git worktree add /tmp/wt-x -b feat/x main

# ✅ fetch + basa en origin/main fresco
git fetch origin main
git worktree add /tmp/wt-x -b feat/x origin/main
```

> **Caso Firulapp**: `main` ya había traducido todas las rutas a español en un PR previo. Una branch basada en un árbol stale mostraba el diff como si re-inglesara las rutas —un revert falso—. Basar en `origin/main` fresco lo arregla.

---

## Gotchas de worktree (todos reales, todos cuestan trabajo)

### 1. Rutas absolutas escriben en el checkout equivocado

> Tras entrar a un worktree, un `Write`/`Edit` con ruta absoluta al **checkout principal** escribe en `main`, no en el worktree. Usá siempre el prefijo del worktree.

```bash
# ❌ escribe en el checkout principal
Edit /Users/vos/repo/src/feed.ts

# ✅ escribe en el worktree
Edit /tmp/wt-mi-feature/src/feed.ts
```

### 2. Los subagentes de búsqueda ven `main` local stale

Un subagente de exploración puede leer el `main` local (desactualizado) y reportar que un archivo "no existe" o "está como untracked" cuando en `origin/main` ya está. Verificá contra `origin/main` antes de actuar sobre lo que reporta.

### 3. Mergear desde un worktree

> `gh pr merge --squash --delete-branch` falla con `"main is used by worktree"` cuando otro worktree tiene `main` tomado. El merge igual entra; lo que falla es el borrado de la branch. Borrá la rama remota a mano.

```bash
gh pr merge <n> --squash           # SIN --delete-branch desde un worktree
git push origin --delete feat/mi-feature   # borrar la rama remota aparte
```

---

## Limpiar el worktree al terminar

```bash
# desde el checkout principal (NO desde adentro del worktree)
git worktree remove /tmp/wt-mi-feature
git branch -d feat/mi-feature      # si ya mergeó
```

---

## La regla de oro: no perder trabajo

Todo cambio —hasta de una línea— cierra con su PR vía un worktree off `main` fresco. Nunca lo dejes suelto en un working tree ruidoso lleno de otros cambios. Si el repo ya tiene branches en vuelo, **nunca** trabajes sobre la branch activa de otra sesión: nuevo worktree, nueva branch, nuevo PR.

---

## Checklist de salida

- [ ] Cada feature/fix arranca con `git fetch origin main` + `git worktree add … origin/main`
- [ ] Branch verb-led (`feat/…`, `fix/…`) — una por unidad de trabajo
- [ ] Las escrituras usan el prefijo del worktree, no rutas al checkout principal
- [ ] No basás branches en `main` local stale (evitás el falso revert)
- [ ] Mergeás desde worktree sin `--delete-branch`; borrás la rama remota aparte
- [ ] Limpiás el worktree al terminar (`git worktree remove` desde el principal)
- [ ] Ningún cambio queda suelto: todo cierra con su PR

> Siguiente: [04 · La oficina de agentes](04-oficina-agentes.md)
