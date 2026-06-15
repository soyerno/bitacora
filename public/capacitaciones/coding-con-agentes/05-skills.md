# 05 · Destilar skills

> Objetivo: convertir conocimiento que se repite —diseño, voz, convenciones de framework, un patrón de calidad— en **skills**: paquetes de conocimiento durable que el agente carga on-demand y aplica por defecto, en vez de re-derivarlo (mal) cada vez.

---

## Skill vs memoria vs agente

Tres cosas distintas, fácil de confundir:

| | Qué es | Cuándo se carga |
|---|---|---|
| **Memoria** | Un hecho ("el feed ordena por cercanía") | Cuando es relevante a lo que estás por hacer |
| **Agente** | Un rol con tools acotadas ("firu-front") | Cuando delegás trabajo de ese dominio |
| **Skill** | Un procedimiento/criterio reusable ("cómo diseñar on-brand") | Cuando la tarea matchea su `description` |

Una skill no es documentación para leer: es un **gate de comportamiento**. "Antes de escribir copy de UI, cargá `firulapp-voz`" hace que el copy salga en voz de marca por defecto, sin que lo pidas.

---

## Anatomía de una skill

Una carpeta con un `SKILL.md` (front-matter con `name` + `description` que decide el trigger) y los archivos de apoyo (checklists, tablas, ejemplos):

```
.claude/skills/firulapp-design/
  SKILL.md              # qué es + cuándo dispara + cómo aplicar
  BRAND_CHECKLIST.md    # pass/fail verificable
  tokens.md             # fuente de verdad de colores/tipos
```

Lo que hace buena a una skill (no un README disfrazado):

1. **No-negociables load-bearing** — las reglas que si se rompen, rompen la marca/el sistema.
2. **Un checklist pass/fail** — verificable, no "tené buen gusto".
3. **Pares "decí esto, no esto"** — ejemplos concretos del antes/después.
4. **Fuente de verdad en runtime** — apuntá a dónde viven los tokens reales, no los copies.

---

## Las skills de Firulapp

```
firulapp-design          # diseño fiel al Design System (empieza por BRAND_CHECKLIST)
firulapp-ux              # mobile-first, usuario 40+, simple/no abrumar
firulapp-voz             # voz y tono (voseo Rioplatense)
firulapp-component       # autor de componentes (atomic design)
firulapp-next16          # convenciones de ESTE Next.js modificado
firulapp-feature-flags   # cablear/auditar features detrás de flags
```

Cada una encapsula un dominio donde el agente, sin ella, deriva mal:
sin `firulapp-next16` escribe APIs de un Next.js que no es éste; sin `firulapp-voz` el copy sale robótico.

> **Caso load-bearing**: el repo corre un Next.js 16 + React 19 + Tailwind v4 modificado, con APIs que difieren del training data del modelo. La skill `firulapp-next16` impone una regla dura: **leé los docs locales antes de escribir código de framework**. Sin eso, el agente shippea código de memoria stale.

---

## Las meta-skills: skills que generan skills

Lo más potente: skills que te enseñan **cómo destilar una skill**. En vez de escribir cada `<proyecto>-design` a mano, una meta-skill te da la estructura:

```
distill-design-system-skill        # cómo autorar un <proyecto>-design
distill-brand-voice-skill          # cómo autorar un <proyecto>-voice
distill-framework-conventions-skill# cómo autorar un <proyecto>-<framework>
distill-ux-a11y-layer-skill        # cómo autorar la capa UX/a11y
```

Onboardás un producto nuevo → corrés la meta-skill → sale la skill específica con la estructura correcta (no-negociables, checklist, say-this-not-that). El conocimiento sobre **cómo** capturar conocimiento también es durable.

---

## Cuándo destilar (y cuándo no)

Destilá cuando:
- Un patrón/criterio **se repite** y el agente lo re-deriva (a veces mal) cada vez.
- Aparece **drift**: el copy sale robótico, la UI se va de marca, el código usa APIs viejas.
- Cerrás trabajo no trivial y el aprendizaje **aplica a futuro**, no solo a este PR.

No destiles un one-off. Una skill de un solo uso es la versión skill de una abstracción especulativa ([Lección 00, Principio 2](00-mentalidad.md)).

> Las skills de calidad de Firulapp —`precommit-quality-harness`, `component-size-gate`, `feature-flag-wiring`, `prompt-injection-hardening`, `release-on-merge`, `worktree-per-feature`— se destilaron de la app de producción y son **framework-agnósticas**: las llevás a otro repo y siguen valiendo.

---

## Checklist de salida

- [ ] Distinguís skill (procedimiento reusable) de memoria (hecho) y de agente (rol)
- [ ] Tus skills tienen `description` que dispara en el momento correcto
- [ ] Cada skill trae no-negociables + un checklist pass/fail (no "tené criterio")
- [ ] Apuntás a la fuente de verdad en runtime, no a copies que se pudren
- [ ] Usás meta-skills (`distill-*`) para onboardear dominios nuevos con la estructura correcta
- [ ] Destilás patrones que se repiten, no one-offs

> Siguiente: [06 · Feature flags](06-feature-flags.md)
