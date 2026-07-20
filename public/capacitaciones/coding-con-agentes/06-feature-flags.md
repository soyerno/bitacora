# 06 · Feature flags — OFF ⇒ no se ve ni se alcanza nada

> Objetivo: cablear features detrás de un flag de runtime con un contrato estricto —una feature apagada no deja **ningún** rastro visible ni alcanzable— y montar los checks que lo prueban (con sus puntos ciegos).

---

## El contrato

> **Feature OFF ⇒ no se ve ni se alcanza nada.** Ni una entrada de menú, ni una ruta que cargue, ni un componente que renderice, ni un endpoint que responda. Cero rastro.

Por qué tan estricto: con un agente shippeando features a medio hacer detrás de flags, el riesgo no es que algo no funcione —es que algo **a medias** se filtre a usuarios—. Una entrada de menú que lleva a una página rota, un endpoint que responde con datos de una feature no anunciada. El flag tiene que ser un interruptor real, no una sugerencia.

---

## Las 4 capas que hay que gatear

Una feature toca el sistema en cuatro niveles. Las cuatro se gatean o el contrato se rompe:

```
1. NAV / entrypoints   ← entradas de menú, botones, deep-links, sidebar
2. RUTAS / páginas     ← la página redirige/404 si el flag está OFF
3. COMPONENTES UI      ← no renderizan nada de la feature
4. API / server        ← el endpoint rechaza si el flag está OFF
```

> **Trampa típica**: gatean la UI (capas 1-3) y se olvidan del endpoint (capa 4). La feature "no se ve" pero **se alcanza** con un `curl`. El contrato dice las cuatro.

---

## Los checks que lo prueban

Dos checks corren en el `validate` y gatean el merge:

- **`check:feature-coverage`** — cada flag declarado tiene código que lo cita. Un flag sin citas = feature fantasma (declarada, nunca cableada).
- **`check:feature-citations`** — el código gateado referencia el flag correcto. Detecta gating contra el flag equivocado.

```bash
npm run check:feature-coverage   # ¿todo flag tiene quién lo use?
npm run check:feature-citations  # ¿el código gateado cita el flag correcto?
```

---

## Los puntos ciegos (importantísimo)

Los checks estáticos prueban que **las citas existen**, no que **el runtime se comporta**. Lo que NO atrapan:

- Una ruta registrada pero **no gateada** (la cita existe en otro lado, el check pasa, la página igual carga con el flag OFF).
- Un endpoint que cita el flag en un comentario pero no lo evalúa.
- Gating del lado del cliente solamente (capa 3) con el server (capa 4) abierto.

> Por eso el contrato es la fuente de verdad, no el check. El check es una red, no una prueba. Verificá el comportamiento real: con el flag OFF, ¿la ruta 404ea? ¿el endpoint rechaza? ¿el menú no muestra la entrada?

---

## Patrones de gating

```ts
// Capa 2 — gate a nivel ruta/layout (server-side, el más fuerte)
if (!isFeatureEnabled('zoonosis')) notFound();

// Capa 1 — entrada de nav condicional
{isFeatureEnabled('zoonosis') && <NavItem href="/zoonosis">Zoonosis</NavItem>}

// Capa 4 — endpoint
if (!isFeatureEnabled('zoonosis')) return new Response(null, { status: 404 });
```

Un flag puede tener `defaultEnabled: true` (una feature que ya es parte del producto) o `false` (en construcción / vision). El default es parte del contrato.

> **Caso real**: features enteras —`zoonosis`, `walks`, `twoFactorAuth`, `ads`, `marketplace`— se construyeron 0→completa **detrás de su flag OFF**, sin filtrarse a usuarios. Cuando estaban listas, el admin prendía el flag. El gate `sharedCare` sobre toda la ficha médica resultó intencional (flag = paraguas "Salud y cuidado"), no un bug —verificar el diseño antes de "arreglar" un gate—.

---

## Gotcha de citations

> Al agregar una ruta nueva de una feature gateada, **registrala** en la lista de rutas del flag (ej. `lostFound.routes`) o el `check:feature-citations` no la ve. El coverage se mide por prefijo de ruta.

---

## Checklist de salida

- [ ] Cada feature en construcción vive detrás de un flag
- [ ] Las 4 capas gateadas: nav, ruta, componentes, API
- [ ] Con el flag OFF verificaste el runtime real: ruta 404ea, endpoint rechaza, nav vacío
- [ ] `check:feature-coverage` y `check:feature-citations` pasan en el `validate`
- [ ] Entendés que el check es una red, no una prueba (los puntos ciegos)
- [ ] Rutas nuevas registradas en la lista del flag (para citations)
- [ ] El `defaultEnabled` del flag refleja si la feature ya es parte del producto

> Siguiente: [07 · Harness de gates](07-gates.md)
