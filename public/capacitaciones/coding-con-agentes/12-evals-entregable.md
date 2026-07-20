# 12 · Evals del entregable

> Objetivo: sumar la capa que falta encima de los gates —**evals**: en vez de "¿pasa?" (binario), preguntar "¿cuán bien quedó?" (score 1-5), y **calibrar** ese score contra tu veredicto humano. Es el [deliver-eval de la Lección 10](10-loop-objetivos.md) hecho herramienta, y la capa 6.5 del [stack ordenado (Lección 11)](11-stack-herramientas.md).

---

## Gate ≠ eval

Dos cosas distintas que se confunden:

| | Pregunta | Salida | Ejemplo |
|---|---|---|---|
| **Gate** | ¿pasa? | pass / fail | el test está verde, 0 smells, CSP ok |
| **Eval** | ¿cuán bien quedó? | score + razones | "voz de marca: 4/5 — el hero suena genérico" |

Un gate verde no prueba calidad: prueba que no rompiste lo medible. Hay entregables que pasan todos los gates y igual están flojos —copy robótico, jerarquía confusa, sobre-construido—. Eso lo caza un **eval**, no un gate.

---

## La rúbrica: puntuá lo que el binario no ve

Una rúbrica son las dimensiones que importan, cada una 1-5, con un criterio de bloqueo. Ejemplo (de un harness real de páginas):

```
brand-voice          → copy en voz de marca + tokens (sin hex)
ux-clarity           → jerarquía, flujo, carga cognitiva, mobile
content-seo-quality  → calidad del contenido + completitud SEO/JSON-LD
simplicity-scope     → mínimo que resuelve, diff quirúrgico (Principio 2)
```

Cada dimensión devuelve `{ score 1-5, reasons, blocking }`. **Barrier del eval**: avanzás solo si cada dimensión ≥ 3 **Y** el promedio ≥ 4. Si no, está bloqueado —aunque los gates estén todos verdes—.

> Elegí dimensiones que el gate NO captura. No dupliques "el test pasa" como dimensión de eval: eso ya es un gate.

---

## LLM-as-judge: el que puntúa no es el que construye

El eval lo corre un **judge** independiente del constructor (el constructor está enamorado de su solución — [Lección 10](10-loop-objetivos.md)). Un judge por dimensión, en paralelo:

```
construir → gates (pass/fail) → barrier → EVAL (judge por dimensión) → barrier → avanzar
```

Para review más duro, un **panel adversarial**: varios judges con lentes distintos (riesgo, legibilidad, fiabilidad) o un dual-blind. Más jueces independientes = menos chance de que un score inflado pase.

---

## Calibración: la parte que hace que el eval valga

Un eval sin calibrar es una opinión más. **Calibrar = medir si el judge coincide con tu veredicto humano** a lo largo del tiempo:

```
deliver-eval:  judge score (auto) + self-score (agente) + tu veredicto 1-5 (humano)
               → error |judge − humano| acumulado
               → si diverge sistemático: la rúbrica o el umbral están mal
```

> La divergencia es la señal. Si el judge dice 5 y vos decís 3, no "ganó" ninguno: aprendiste que la rúbrica no está mirando lo que vos mirás. Ahí la ajustás. El eval se mejora a sí mismo con la calibración.

Registrá cada corrida en un dataset chico append-only y mirá el error medio. Cuando el judge está calibrado (error ≤ 0.5), podés confiar más en su score sin revisar todo a mano.

---

## Dónde vive en el stack

```
… → AGENTE → GATES (pass/fail, capa 6) → EVAL (score, capa 6.5) → deploy
```

El eval va **después** de los gates binarios (no tiene sentido puntuar algo que ni compila) y **antes** del paso irreversible. Es la última red antes de soltar el entregable.

> **Caso real**: el harness de creación de páginas tiene una fase `Eval` (LLM-judge con esta rúbrica + doble barrier) y un `calibration.mjs` que trackea judge↔humano. Los gates decían "pasa"; el eval agregó "¿cuán bien?". Ver el harness de la capacitación de páginas.

---

## Recursos

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — patrones de evaluación y por qué medir el resultado, no el prompt
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — verificación en tareas largas
- [Anthropic Academy](https://anthropic.skilljar.com/) — Claude Code, agent skills, subagents

---

## Checklist de salida

- [ ] Distinguís gate (pass/fail) de eval (score + razones)
- [ ] Tu rúbrica puntúa dimensiones que el gate NO captura (no las duplica)
- [ ] El judge es independiente del constructor; un judge por dimensión
- [ ] Hay un barrier de eval (umbral por dimensión + promedio) antes del paso irreversible
- [ ] Registrás judge + self-score + veredicto humano y medís la calibración
- [ ] Cuando judge y humano divergen, ajustás la rúbrica (no ignorás la señal)

> Ahora sí, cerrá con el [🧪 Lab integrador](exercises/README.md): una feature chica end-to-end con la metodología completa.
