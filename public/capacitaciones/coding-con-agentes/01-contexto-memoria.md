# 01 · Contexto = memoria de trabajo

> Objetivo: dejar de tratar la ventana de contexto como un cajón infinito y empezar a administrarla como lo que es —memoria de trabajo finita—. Cargar lo justo, destilar lo durable, comprimir la salida sin tocar el copy de usuario.

---

## La idea de Karpathy (Software 3.0)

La ventana de contexto del agente es **RAM, no disco**. Es cara, finita, y todo lo que metés adentro compite por atención. Un contexto lleno de basura produce respuestas peores que uno chico y curado. La regla:

> Cargá el contexto con lo justo para la tarea de hoy. Lo durable va a memoria persistente; lo de esta conversación, se va con ella.

Esto tiene dos consecuencias prácticas: **(a)** lo que el agente necesita saber siempre, va en archivos que se cargan siempre; **(b)** lo que aprendés y querés conservar, lo destilás a memoria de archivo —no confiás en que "se acuerde".

---

## Dos memorias: la que se carga siempre y la que se recuerda

### Memoria de proyecto (se carga siempre)

`AGENTS.md` / `CLAUDE.md` en la raíz: principios, convenciones, stack, gates. El agente los lee en cada sesión. Es el piso. Si una convención no está acá, no existe para el agente.

```
CLAUDE.md          # @AGENTS.md → importa todo
AGENTS.md          # principios + cómo trabajamos + skills + harness
```

### Memoria de archivo (se recuerda por relevancia)

Un índice + un archivo por hecho. Cada archivo = **un hecho** con frontmatter para decidir relevancia al recuperar:

```markdown
---
name: feed-geo-recency-ranking
description: por qué el feed ordena por cercanía×recencia y no por watch-time
metadata:
  type: project
---

El feed de Firulapp ordena por proximidad + urgencia (North Star = reunir
mascotas), no por watch-time como TikTok. Ver [[nearby-services-map-deeplink]].
```

Un `MEMORY.md` índice (una línea por memoria) es lo único que entra en contexto cada sesión. El cuerpo se recupera solo cuando es relevante.

> **Caso Firulapp**: el índice tiene ~70 memorias —cada feature, cada gotcha de merge, cada falso positivo descartado—. Antes de construir algo "nuevo", el agente busca si ya lo resolvimos. Evita re-aprender lo aprendido (que es lo más caro que hay).

---

## Destilar: el ritual de cierre

Al cerrar trabajo no trivial, **destilá el aprendizaje durable** a la memoria. No el qué (eso está en el código y el git log), sino el **por qué no-obvio** y el **cómo aplicarlo**:

```
❌ Memoria: "Arreglé el bug del feed." (el git log ya lo dice)
✅ Memoria: "El feed salía siempre igual = Math.random sin semilla
            congelado en el WebView de larga vida. Fix: seeded shuffle
            (mulberry32) + contador de rotación por mount. GOTCHA: el
            WebView no re-monta, por eso el random quedaba pegado."
```

Y **podá**: si una memoria resultó falsa, borrala. Si quedó vieja, actualizala. La memoria que miente es peor que la que falta.

> Una memoria recuperada refleja lo que era verdad **cuando se escribió**. Si nombra un archivo, función o flag, verificá que siga existiendo antes de recomendarlo.

---

## Caveman: comprimir la salida, jamás el copy de usuario

`caveman` comprime **cómo el agente te habla** (prosa de salida) para ahorrar tokens. No toca el razonamiento ni la calidad técnica:

```
❌ "Sure! I'd be happy to help. The issue is likely caused by..."
✅ "Bug in auth middleware. Token expiry uses < not <=. Fix:"
```

> **Trampa de marca (load-bearing)**: caveman aplica a la conversación con vos. **JAMÁS** al copy que la app le muestra al usuario. Las strings de UI, notificaciones y empty states van en voz de marca completa y natural —nunca telegráficas—. Comprimir el copy de usuario rompe la marca. Mantené esa frontera explícita en `AGENTS.md`.

---

## Qué NO guardar en memoria

No dupliques lo que el repo ya registra:

- Estructura del código → está en el código.
- Fixes pasados → están en el git log.
- Convenciones → están en `CLAUDE.md`.

Si te piden "acordate de esto" y es una de esas, preguntá **qué fue lo no-obvio** y guardá eso.

---

## Checklist de salida

- [ ] `AGENTS.md`/`CLAUDE.md` con principios + convenciones + stack (se cargan siempre)
- [ ] Un índice de memoria (`MEMORY.md`) con una línea por hecho durable
- [ ] Un archivo por hecho, con frontmatter (`description` = para recuperar por relevancia)
- [ ] Ritual de cierre: al terminar trabajo no trivial, destilás el por-qué no-obvio
- [ ] Memorias podadas (las falsas se borran, las viejas se actualizan)
- [ ] Frontera de caveman explícita: comprime tu salida, nunca el copy de usuario

> Siguiente: [02 · Spec-Driven con OpenSpec](02-openspec.md)
