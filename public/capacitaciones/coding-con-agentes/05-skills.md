# 05 · Destilar skills

> Objetivo: convertir conocimiento que se repite —diseño, voz, convenciones de framework, un patrón de calidad— en **skills**: paquetes de conocimiento durable que el agente carga on-demand y aplica por defecto, en vez de re-derivarlo (mal) cada vez.

---

## Skill vs memoria vs agente (vs rol vs loop)

Cinco cosas distintas, fácil de confundir. El [mapa de las 5 piezas](#intro) las cruza entero; acá las separás por **qué son** y **cuándo entran en juego**:

| | Qué es | Cuándo entra |
|---|---|---|
| **Rol** | Una *función* de conducción (decidir / priorizar / custodiar) | Cuando hay que decidir el qué, el por qué o cuidar el proceso |
| **Agente** | Una *entidad* con system-prompt + tools acotadas ("front") | Cuando delegás trabajo de ese dominio |
| **Skill** | Un *procedimiento/criterio* reusable ("cómo diseñar on-brand") | Cuando la tarea matchea su `description` |
| **Memoria** | Un *hecho* ("el feed ordena por cercanía") | Cuando es relevante a lo que estás por hacer |
| **Loop** | El *motor de cadencia* (criterios → iterar → verificar) | Mientras se ejecuta, hasta cumplir los criterios |

La distinción que más se equivoca: una **skill** es el *cómo* (un procedimiento), una **memoria** es el *qué* (un hecho). No metas hechos en una skill ni procedimientos en memoria.

Una skill no es documentación para leer: es un **gate de comportamiento**. "Antes de escribir copy de UI, cargá `app-voz`" hace que el copy salga en voz de marca por defecto, sin que lo pidas.

---

## Anatomía de una skill

Una carpeta con un `SKILL.md` (front-matter con `name` + `description` que decide el trigger) y los archivos de apoyo (checklists, tablas, ejemplos):

```
.claude/skills/app-design/
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

## Las skills del proyecto

```
app-design          # diseño fiel al Design System (empieza por BRAND_CHECKLIST)
app-ux              # mobile-first, usuario 40+, simple/no abrumar
app-voz             # voz y tono (voseo Rioplatense)
app-component       # autor de componentes (atomic design)
app-next16          # convenciones de ESTE Next.js modificado
app-feature-flags   # cablear/auditar features detrás de flags
```

Cada una encapsula un dominio donde el agente, sin ella, deriva mal:
sin `app-next16` escribe APIs de un Next.js que no es éste; sin `app-voz` el copy sale robótico.

> **Caso load-bearing**: el repo corre un Next.js 16 + React 19 + Tailwind v4 modificado, con APIs que difieren del training data del modelo. La skill `app-next16` impone una regla dura: **leé los docs locales antes de escribir código de framework**. Sin eso, el agente shippea código de memoria stale.

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

> Las skills de calidad del proyecto —`precommit-quality-harness`, `component-size-gate`, `feature-flag-wiring`, `prompt-injection-hardening`, `release-on-merge`, `worktree-per-feature`— se destilaron de la app de producción y son **framework-agnósticas**: las llevás a otro repo y siguen valiendo.

---

## Checklist de salida

- [ ] Distinguís skill (procedimiento reusable) de memoria (hecho) y de agente (rol)
- [ ] Tus skills tienen `description` que dispara en el momento correcto
- [ ] Cada skill trae no-negociables + un checklist pass/fail (no "tené criterio")
- [ ] Apuntás a la fuente de verdad en runtime, no a copies que se pudren
- [ ] Usás meta-skills (`distill-*`) para onboardear dominios nuevos con la estructura correcta
- [ ] Destilás patrones que se repiten, no one-offs

> Siguiente: [06 · Feature flags](06-feature-flags.md)
