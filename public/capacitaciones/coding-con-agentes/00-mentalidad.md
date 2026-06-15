# 00 · Mentalidad — los 4 principios + honestidad

> Objetivo: antes de tocar una línea con un agente, instalar la mentalidad que separa "el agente escupió código" de "el agente resolvió el problema". Cuatro principios + una regla de honestidad, todos verificables.

---

## Por qué esto va primero

Un agente codea rápido. Eso es el problema, no la solución. Sin una mentalidad impuesta, un agente te entrega features que nadie pidió, abstracciones de un solo uso, manejo de errores especulativo, y un "listo" que no verificó. La velocidad sin criterio es deuda que entra más rápido.

Estos principios salieron de [Andrej Karpathy](https://karpathy.ai/) sobre coding con agentes y los endurecí construyendo Firulapp. En el repo viven en `AGENTS.md` —el archivo que el agente carga en **cada** sesión—. Esa es la jugada clave: la mentalidad no se pide por mensaje, se cablea en el contexto permanente.

---

## Principio 1 — Pensar antes de codear

Explicitá los supuestos. Si algo es ambiguo, **preguntá o presentá las interpretaciones — no elijas en silencio**. Nombrá la confusión en vez de avanzar a ciegas. Proponé la alternativa más simple cuando exista.

```
❌ Usuario: "mejorá el feed"
   Agente: *reescribe 400 líneas de ranking*

✅ Usuario: "mejorá el feed"
   Agente: "¿'Mejorar' = ordenarlo por cercanía+recencia, o
            agregar más contenido? Son dos cambios distintos.
            Arranco por el ranking si confirmás."
```

> **Caso Firulapp**: el pedido "mejorá el feed vs TikTok/IG" era ambiguo. En vez de copiar watch-time (la señal de ellos), explicité que *nuestra* señal es proximidad + urgencia (reunir mascotas perdidas). Ese supuesto, nombrado en voz alta, cambió todo el diseño.

---

## Principio 2 — Simplicidad primero

El mínimo código que resuelve **el problema pedido**. Nada especulativo: sin features no pedidas, sin abstracciones de un solo uso, sin manejo de errores ni configurabilidad que nadie pidió.

```
❌ "Por las dudas, le agrego un sistema de plugins configurable."
✅ "Resuelve el caso de hoy. Si mañana hace falta extenderlo, lo extendemos."
```

El olfato: si un senior mirara el diff, ¿lo llamaría **sobre-complicado**? Si la respuesta es "puede que sí", simplificá.

---

## Principio 3 — Cambios quirúrgicos

Tocá solo lo necesario. No refactorices código que funciona, no "mejores" el formato o los comentarios ajenos, respetá el estilo existente. **Cada línea cambiada debe atender el pedido.** Señalá dead code sin borrarlo (salvo que tu cambio lo huérfane).

```bash
# Antes de declarar done, mirá tu propio diff con ojo de revisor:
git diff --stat
# ¿Hay archivos tocados que no tienen que ver con el pedido? Revertilos.
```

> **Caso Firulapp**: una auditoría marcó `useMemo`/`useCallback` como "faltantes" en varios componentes. Falso positivo: el repo tiene `reactCompiler: true` —memoizar a mano es ruido—. Verificar el contexto antes de "mejorar" evitó un diff inútil de 14 archivos.

---

## Principio 4 — Ejecución por objetivos

Convertí la tarea en **criterios de éxito verificables** y un loop hasta cumplirlos (correr la app, Storybook, los tests). "Que funcione" es criterio débil; definí qué es *funcionar*.

```
❌ Criterio: "el botón anda"
✅ Criterio: "click en 'Lo vi' → POST /api/avisos 200 →
              el dueño ve la notificación en /inicio/avisos →
              test e2e saw-it-notify verde"
```

Esto es la columna vertebral del [loop por objetivos (Lección 10)](10-loop-objetivos.md). Sin criterios verificables, el agente no sabe cuándo parar y vos no sabés si terminó.

---

## La regla de honestidad

> **Reportá los resultados como son.** Si un test falla, decilo con la salida. Si salteaste un paso, decilo. No declares "hecho" sin verificar.

Es la regla que más fácil se viola y la que más caro sale. Un agente entrenado para complacer tiende a decir "listo, funciona" porque suena bien. La metodología lo prohíbe: **no hay "done" sin verify**.

```
❌ "Listo, agregué los tests y pasan todos."
✅ "Corrí `pnpm test`: 1198 pasan, 2 fallan en MissedDoseSweep
    (timezone). Los pego acá. ¿Los arreglo o era esperado?"
```

> **Caso Firulapp**: la consola de loops de la oficina dispara jobs reales — pero sin `APP_URL` + `CRON_SECRET` no dispara nada. En vez de venderla como "automatización lista", el gate quedó documentado honesto: "no dispara hasta que el owner configure las creds". El usuario sabe exactamente qué tiene y qué falta.

---

## El test del senior (cómo se verifica la mentalidad)

Antes de dar por cerrado un cambio, pasalo por estas cuatro preguntas. Si alguna da "no", todavía no está:

- [ ] **¿Entendí el pedido?** ¿Hay un supuesto ambiguo que no nombré?
- [ ] **¿Es lo más simple?** ¿Un senior llamaría a esto sobre-complicado?
- [ ] **¿El diff es quirúrgico?** ¿Toda línea tocada atiende el pedido?
- [ ] **¿Lo verifiqué?** ¿Tengo la salida de un test/app/comando que lo prueba?

---

## Cómo cablear esto con tu agente

No repitas estos principios en cada prompt. Ponelos donde el agente los lee siempre:

```
# En la raíz del repo
AGENTS.md          # principios + convenciones del proyecto
CLAUDE.md          # @AGENTS.md (importa los principios)
```

Así el principio "pensar antes de codear" no es un favor que pedís — es el piso desde el que el agente arranca cada sesión.

---

## Checklist de salida

- [ ] `AGENTS.md` (o equivalente) en el repo con los 4 principios + honestidad
- [ ] `CLAUDE.md` importa `AGENTS.md` (o los principios viven donde el agente los carga siempre)
- [ ] Sabés enunciar el "test del senior" de memoria
- [ ] Entendés por qué "que funcione" es un criterio débil
- [ ] Te queda claro que no hay "done" sin verify

> Siguiente: [01 · Contexto = memoria de trabajo](01-contexto-memoria.md)
