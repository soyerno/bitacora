# Capacitación · Coding con una flota de agentes

> **Harness = agentes.** Curso activo: abrís Claude Code, seguís cada lección, los gates te dicen si está bien. No es un manual para leer y guardar — es una metodología para correr.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## De dónde sale esto

Esta metodología la forjé en un **proyecto propio, fuera de MODO** —una app real construida enteramente con Claude Code y una flota de agentes—. No es teoría: cada principio acá salió de un PR real, un merge que casi sale mal, un gate que atajó un bug, o una lección que tuve que destilar para no re-aprenderla. Los ejemplos del curso son de ese proyecto, anonimizado.

El producto es lo de menos. Lo transferible es **el método**: cómo conducir agentes para construir software real sin perder el control, la calidad ni la honestidad. Aplica a cualquier repo —un front MODO, un side project, este mismo repo— donde codeés con un agente.

> La prueba de fuego: este mismo curso, y las mejoras de la bitácora donde está publicado, se hicieron con esta metodología. Si funciona, lo estás leyendo.

## Para quién

Cualquiera que codee con un agente (Claude Code) y quiera dejar de improvisar: que el agente piense antes de codear, toque solo lo necesario, no te mienta sobre lo que hizo, y deje el repo más sano que como lo encontró. No necesitás saber de mascotas ni de Firebase — los ejemplos son concretos pero las ideas son generales.

## Qué vas a saber hacer al terminar

1. Imponer los 4 principios de coding-con-agentes (Karpathy) y la regla de honestidad, con un "test del senior" verificable.
2. Tratar el contexto como memoria de trabajo: file-memory durable, destilación de aprendizajes, compresión de salida sin tocar el copy de usuario.
3. Escribir una propuesta OpenSpec **antes** de codear features nuevas, breaking changes, arquitectura o seguridad.
4. Aislar cada feature en su worktree + branch + PR off `main` fresco, sin pisar trabajo de otra sesión.
5. Conducir una oficina de agentes especializados (CEO/PO/PM + un roster de specialists) y paralelizar sin colisiones.
6. Destilar conocimiento durable en skills reusables (y meta-skills que generan skills).
7. Cablear features detrás de feature flags con el contrato "OFF ⇒ no se ve ni se alcanza nada".
8. Montar un harness de gates (pre-commit, size-gate, parity, release-on-merge) que no te deja mergear basura.
9. Operar un pipeline de PRs honesto (Pain/Purpose/How, metadata, no perder trabajo, sincronizar con `main` antes de mergear).
10. Cerrar el loop de ejecución por objetivos: criterios verificables, iterar hasta cumplirlos, y reportar los resultados como son.

## Las 5 piezas y cómo encajan (sin pisarse)

Antes del learning path, el modelo mental. Cinco piezas que se confunden todo el tiempo. La clave: **cada una es dueña de una capa distinta** —por eso no se pisan—.

| Pieza | Qué es (una línea) | De qué es dueña | Lección |
|---|---|---|---|
| **Rol** | Una *función* de conducción: decidir / priorizar / custodiar el proceso | El **qué**, el **por qué** y el **proceso** | [04](04-oficina-agentes.md) |
| **Agente** | Una *entidad* con system-prompt + tools acotadas (`front`, `back`, …) | Un **dominio** de ejecución (backend, UI, infra…) | [04](04-oficina-agentes.md) |
| **Skill** | Conocimiento durable reusable que el agente carga on-demand | El **cómo** hacer bien algo (diseño, voz, convención de framework) | [05](05-skills.md) |
| **Memoria** | Un *hecho* durable ("el feed ordena por cercanía") | Lo que **ya sabemos** y no hay que re-aprender | [01](01-contexto-memoria.md) |
| **Loop** | El motor de cadencia: criterios → iterar → verificar → reportar | El **cuándo parar** (ejecución por objetivos) | [10](10-loop-objetivos.md) |

Cómo se enganchan en una corrida real:

```
HUMANO
  │  otorga el mandato + aprueba lo irreversible (merge/deploy/gasto)
  ▼
ROL de conducción   (CEO decide · PO prioriza · PM custodia el proceso)
  │  un AGENTE puede JUGAR un rol — el rol es la función, el agente la entidad
  │  delega trabajo de dominio
  ▼
AGENTE especialista   (front, back, ux, infra…)
  │  al ejecutar, carga lo que necesita:
  ├─ SKILL    → el "cómo" (diseñar on-brand, voz de marca, API del framework)
  └─ MEMORIA  → el "qué ya sabemos" (hechos durables, gotchas, falsos positivos)
  │  y todo corre dentro del…
  ▼
LOOP por objetivos   (criterios verificables → iterar → verificar → reportar honesto)
```

**Por qué no se pisan** — hay dos tipos de colisión y cada uno tiene su defensa:

1. **Colisión de responsabilidades** — cada pieza manda en su capa: el *rol* decide, el *agente* ejecuta, la *skill* aporta el cómo, la *memoria* el qué-ya-sabemos, el *loop* el cuándo-parar. Un agente no fija la prioridad (eso es del PO); una skill no guarda hechos (eso es memoria); el loop no construye (eso es el agente). Si dos piezas pelean por la misma decisión, una está mal ubicada.
2. **Colisión de archivos** — dos agentes en paralelo editando el mismo archivo se pisan. La defensa es física: cada uno en su **worktree** ([Lección 03](03-worktrees.md)), y lo que solapa pasa por un agente de **integración** antes de mergear ([04](04-oficina-agentes.md) · [08](08-pipeline-prs.md)).

> **Ojo con "loop"** — el curso usa la palabra en dos capas distintas: el **loop por objetivos** ([10](10-loop-objetivos.md)) es el ciclo metodológico (criterios → iterar → verificar); el **loop-runner** de la oficina ([04](04-oficina-agentes.md)) es el tablero que dispara jobs/loops. Mismo nombre, cosas distintas.

El resto del curso es cada pieza en detalle. Volvé a esta tabla cuando te pierdas.

## Learning path

| # | Lección | Qué cubre |
|---|---------|-----------|
| 00 | [Mentalidad](00-mentalidad.md) | Los 4 principios · honestidad sobre lo generado · el test del senior |
| 01 | [Contexto = memoria](01-contexto-memoria.md) | File-memory durable · destilar aprendizajes · caveman (comprimir salida, jamás UI) |
| 02 | [Spec-Driven con OpenSpec](02-openspec.md) | La propuesta antes de codear · specs vivas · cuándo SDD y cuándo no |
| 03 | [Worktree por feature](03-worktrees.md) | Aislamiento · branch off `main` fresco · PR · los gotchas que duelen |
| 04 | [La oficina de agentes](04-oficina-agentes.md) | Roster especializado · CEO/PO/PM · delegación · paralelismo · loop-runner |
| 05 | [Destilar skills](05-skills.md) | Skill = conocimiento durable reusable · las meta-skills `distill-*` |
| 06 | [Feature flags](06-feature-flags.md) | El contrato OFF ⇒ nada · las 4 capas · los checks y sus puntos ciegos |
| 07 | [Harness de gates](07-gates.md) | Pre-commit scoped · component-size-gate · AI-parity · release-on-merge |
| 08 | [Pipeline de PRs](08-pipeline-prs.md) | Pain/Purpose/How · metadata · no perder trabajo · sync antes de mergear |
| 09 | [Seguridad por defecto](09-seguridad.md) | Prompt-injection · rules por SDK · AI access gate · PII/consent |
| 10 | [Loop por objetivos](10-loop-objetivos.md) | Criterios verificables · iterar hasta cumplir · medir el producto, no el prompt |
| 11 | [El stack ordenado](11-stack-herramientas.md) | Qué capa tocar y cuándo · escalá solo cuando hace falta · recursos Anthropic |
| 🧪 | [Lab integrador](exercises/README.md) | Una feature chica end-to-end con la metodología completa |

> Empezá por [00 · Mentalidad](00-mentalidad.md).
