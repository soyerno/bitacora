# 10 · Loop de ejecución por objetivos

> Objetivo: cerrar la metodología con el motor que la mueve —convertir la tarea en criterios verificables, iterar hasta cumplirlos, medir el **producto** (no el prompt), y reportar honesto—. Es el [Principio 4 de la Lección 00](00-mentalidad.md) llevado a su forma operativa.

---

## Definir "funcionar" antes de arrancar

"Que funcione" no es un criterio: es una sensación. El loop arranca convirtiendo el pedido en criterios de éxito **verificables** —cosas que podés correr y mirar—:

```
Pedido:  "que el botón 'Lo vi' avise al dueño"

Criterios verificables:
  □ click → POST /api/avisos devuelve 200
  □ el dueño ve la notificación en /inicio/avisos
  □ el test e2e saw-it-notify pasa en verde
  □ no rompe el feed (las alertas siguen intercalando)
```

Con criterios así, el agente sabe cuándo parar y vos sabés si terminó. Sin ellos, "listo" es una opinión.

---

## El loop

```
1. definir criterios verificables
2. construir el mínimo que los cumple   ← Principio 2 (simplicidad)
3. correr la app / Storybook / los tests
4. ¿cumple los criterios?
     no → arreglar, volver a 3
     sí → seguir
5. reportar los resultados como son      ← honestidad
6. destilar el aprendizaje durable        ← Lección 01 (memoria)
```

`/loop` automatiza la cadencia: corrés un prompt en intervalo o auto-pautado, e iterás hasta cumplir. Este mismo curso se construyó así —un loop auto-pautado, ≥10 iteraciones, cada lección commiteada— y la honestidad lo gobierna: si una lección no estaba lista, la iteración lo decía.

---

## firu-ux muerde TODO el frontend

Regla dura: **toda solución de frontend pasa por la crítica del agente de UX antes de cerrarla**.

```
construir → firu-ux critica → arreglar → iterar → recién ahí se cierra
```

> **Caso Firulapp**: el primer intento del deep-link "Servicios cerca tuyo" estaba mal; `firu-ux` lo cazó antes del PR. El agente que construye y el que critica la usabilidad **no son el mismo** —el constructor está enamorado de su solución—.

---

## Medir el producto, no el prompt

El cambio de mentalidad más importante para conducir agentes:

> Vos coordinás y evaluás el **producto** (el entregable). El agente absorbe la sub-especificación y se **auto-evalúa**. No medís qué tan lindo fue el prompt —medís si el entregable cumple—.

Hay un loop de evaluación del entregable: señales automáticas de git + auto-score del agente + tu veredicto 1-5 + calibración (¿el auto-score del agente coincidió con tu veredicto?). Cuando divergen, ahí está el aprendizaje.

```
deliver-eval:  git diff/tests (auto) + self-score (agente) + verdict 1-5 (vos)
               → calibración: ¿el agente sabe cuán bien lo hizo?
```

---

## La honestidad cierra el loop

Volvemos a donde empezamos ([Lección 00](00-mentalidad.md)): **no hay "done" sin verify, y los resultados se reportan como son.**

```
❌ "Listo, el curso está completo y pulido."
✅ "10 lecciones + lab escritas y commiteadas. Generé el index.html:
    13 lecciones, 48KB. check:visibility pasa. Falta tu OK para
    abrir el PR — el merge a main lo dejo para cuando lo apruebes."
```

Un loop que miente sobre su estado no converge: itera sobre una realidad falsa. La honestidad no es una cortesía —es lo que hace que el loop llegue a algún lado—.

---

## Checklist de salida

- [ ] Convertís cada pedido en criterios de éxito verificables antes de codear
- [ ] Iterás contra esos criterios corriendo la app/tests, no a ojo
- [ ] Todo frontend pasa por la crítica de UX antes de cerrarse
- [ ] Medís el entregable (el producto), no la calidad del prompt
- [ ] Usás calibración: ¿el auto-score del agente coincide con tu veredicto?
- [ ] Reportás los resultados como son; no declarás "done" sin verify
- [ ] Al cerrar, destilás el aprendizaje durable a memoria ([Lección 01](01-contexto-memoria.md))

> Cerraste la teoría. Ahora corré el [🧪 Lab integrador](exercises/README.md): una feature chica end-to-end con la metodología completa.
