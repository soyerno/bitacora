# Capacitación · Coding con una flota de agentes

> **Harness = agentes.** Curso activo: abrís Claude Code, seguís cada lección, los gates te dicen si está bien. No es un manual para leer y guardar — es una metodología para correr.
>
> Autor: Hernán De Souza · Sr AI Engineer · MODO

---

## De dónde sale esto

Esta metodología la forjé construyendo **Firulapp** —una app comunitaria para dueños de mascotas en Buenos Aires (feed social + Lost & Found con IA)— enteramente con Claude Code y una flota de agentes. No es teoría: cada principio acá salió de un PR real, un merge que casi sale mal, un gate que atajó un bug, o una lección que tuve que destilar para no re-aprenderla.

El producto es lo de menos. Lo transferible es **el método**: cómo conducir agentes para construir software real sin perder el control, la calidad ni la honestidad. Aplica a cualquier repo —Firulapp, un front MODO, tu side project— donde codeés con un agente.

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
| 🧪 | [Lab integrador](exercises/README.md) | Una feature chica end-to-end con la metodología completa |

> Empezá por [00 · Mentalidad](00-mentalidad.md).
