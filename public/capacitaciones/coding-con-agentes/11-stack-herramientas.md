# 11 · El stack de herramientas, ordenado

> Objetivo: zoom out. Tenés contexto, skills, tools/MCP, agentes, workflows y un harness de gates. La pregunta no es "¿cuál uso?" sino **"¿qué capa toco primero y cuándo escalo a la siguiente?"**. La regla madre: lo más simple que resuelve, y subís complejidad solo cuando mejora el resultado —demostrado con evidencia, no de panza—.

---

## La regla madre

Anthropic lo dice sin vueltas: **empezá con lo más simple, subí complejidad solo cuando hace falta.**

> *"Find the simplest solution possible, and only increase complexity when needed. [...] agentic systems often trade latency and cost for better task performance."* — [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

Ordenar el stack no es "usar todo". Es una **escalera**: alcanzás la capa más barata que resuelve el problema, y subís un escalón solo cuando esa, demostrablemente, no alcanza.

---

## La escalera (barato/simple → potente/caro)

| # | Capa | Qué controla | Escalás a ella cuando… |
|---|------|--------------|------------------------|
| 1 | **Contexto + memoria** | qué entra a la ventana (RAM, no disco) | siempre — es el piso ([Lección 01](01-contexto-memoria.md)) |
| 2 | **Skill** | el *cómo* durable, on-demand | un procedimiento se repite y el agente lo re-deriva mal ([Lección 05](05-skills.md)) |
| 3 | **Tools / MCP** | la *capacidad* (qué puede tocar) | necesitás acción externa (API, DB, archivos) |
| 4 | **Agente / subagente** | *quién* actúa + aislamiento + tools acotadas | una preocupación se repite o el contexto se llena ([Lección 04](04-oficina-agentes.md)) |
| 5 | **Workflow** | control flow determinista (chain, routing, parallel) | el orden de pasos importa y no querés que el modelo improvise |
| 6 | **Harness: gates + loop + verify** | el *cuándo está hecho* (evidencia, no palabra) | tarea larga / multi-contexto / irreversible ([Lección 07](07-gates.md) · [10](10-loop-objetivos.md)) |
| 7 | **Worktree / SDD / hooks** | aislamiento físico + enforcement mecánico | trabajo en paralelo o reglas que no podés dejar a buena voluntad ([Lección 03](03-worktrees.md)) |

---

## Cómo se anidan (precedencia, no competencia)

Cada capa **envuelve** a la de adentro. Una skill no reemplaza un agente: vive *dentro* del agente. Un gate no reemplaza la skill: *verifica* lo que produjo.

```
CONTEXTO + MEMORIA              (1 — todo vive acá adentro)
  └─ SKILL                      (2 — el cómo, cargado al contexto del que actúa)
       └─ AGENTE + TOOLS/MCP    (3-4 — entidad acotada que carga skills y tiene capacidad)
            └─ WORKFLOW          (5 — orquesta varios agentes con control flow determinista)
                 └─ HARNESS      (6 — gates/loop/verify envuelven todo; cazan lo que se filtró)
                      └─ WORKTREE/SDD/HOOK   (7 — el piso físico que impide colisión)
```

---

## Orden de decisión (síntoma → capa correcta)

| Síntoma | Capa correcta | NO esto |
|---|---|---|
| "re-explico el mismo cómo cada vez" | Skill (2) | no armes un agente |
| "necesito que toque una API/DB" | Tool/MCP (3) | no lo metas en el prompt |
| "el contexto se llena / mezcla dominios" | Subagente (4) | no agrandes el prompt |
| "el orden de pasos no puede fallar" | Workflow (5) | no confíes en el modelo |
| "me dijo 'listo' y no era" | Gate/verify (6) | no le creas |
| "dos agentes se pisan archivos" | Worktree (7) | no coordines a mano |

---

## El anti-patrón: saltar escalones hacia arriba

El error más común NO es quedarse corto —es **sobre-construir**: un subagente cuando bastaba una skill, un workflow cuando bastaba un agente. Cada escalón que subís paga latencia + costo + superficie de error.

> *"When more autonomy isn't needed, the simplest pattern that works is the right one."* — [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

Subí solo cuando la capa de abajo demostrablemente no alcanza. Y "demostrablemente" significa con evidencia del harness (capa 6), no con una corazonada.

---

## Para profundizar (recursos)

Cada capa tiene un curso gratis de Anthropic y un artículo de ingeniería detrás:

- **Contexto** → [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- **Skills** → [Introduction to agent skills](https://anthropic.skilljar.com/) (Anthropic Academy)
- **Tools / MCP** → [Introduction to MCP](https://anthropic.skilljar.com/) · [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) · [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- **Subagentes** → [Introduction to subagents](https://anthropic.skilljar.com/)
- **Workflows / patrones** → [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- **Harness** → [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **Claude Code** → [Claude Code 101 / in Action](https://anthropic.skilljar.com/claude-code-in-action)

---

## Checklist de salida (el orden, como decisión)

- [ ] Antes de subir un escalón, ¿la capa de abajo demostrablemente no alcanza?
- [ ] Curaste el contexto (capa 1) antes que nada — cargás lo justo, no todo
- [ ] Destilás a skill (2) lo que se repite, antes de armar un agente
- [ ] Las tools/MCP (3) están bien definidas y acotadas, no un prompt gigante
- [ ] Armás un agente (4) solo cuando una preocupación se repite o el contexto se llena
- [ ] Usás workflow (5) solo cuando el orden de pasos no puede quedar a criterio del modelo
- [ ] Encima de todo hay un gate verificable (6): no aceptás "done" sin evidencia
- [ ] Lo que corre en paralelo está aislado (7): worktree, no coordinación a mano

> Siguiente: [12 · Evals del entregable](12-evals-entregable.md) — la capa que puntúa cuán bien quedó, no solo si pasa.
