# 04 · La oficina de agentes

> Objetivo: dejar de usar un agente generalista para todo y armar una **oficina**: agentes especializados con un system-prompt y herramientas acotadas, tres roles de conducción (CEO/PO/PM), y un loop-runner que los corre en paralelo sin colisiones.

---

## Por qué especializar

Un agente generalista carga en su contexto un poco de todo y mucho de nada. Un agente especializado tiene:

- **Un system-prompt enfocado** — sabe que es "backend del proyecto" y carga las convenciones de backend, no las de branding.
- **Herramientas acotadas** — el agente de PM no escribe código (solo lee + bash); el de frontend no toca firestore.rules.
- **Un dominio claro** — sabés a quién delegarle qué, y dos especialistas distintos no se pisan.

El resultado: más señal por token, y paralelismo real (cada uno en lo suyo).

---

## El roster (20 agentes especializados)

En el proyecto viven en `.claude/agents/`. Agrupados por capa:

| Capa | Agentes | Hace |
|------|---------|------|
| **Conducción** | `ceo`, `po`, `pm` | Decide, prioriza, custodia el proceso |
| **Construcción** | `back`, `front`, `mobile` | Código de dominio, UI, app nativa |
| **Experiencia** | `ux`, `branding` | Usabilidad/a11y, fidelidad de marca |
| **Plataforma** | `infra`, `release`, `geo` | Deploy, CI/CD, mapas/ubicación |
| **IA / conectividad** | `mcp`, `parity` | Server MCP, paridad asistente↔features |
| **Seguridad** | `security`, `cyber` | Defensa (rules/PII) y red-team ofensivo |
| **Datos / contenido** | `data`, `docs`, `marketing` | Analytics, docs/specs, SEO/growth |
| **Calidad / flags** | `flags`, `coach` | Contrato de flags, mejora a los otros agentes |

No hace falta tener 20. La idea es: **un agente por preocupación que se repite**.

---

## Los tres roles de conducción

> **Rol ≠ agente.** Un *rol* es una **función** (decidir, priorizar, custodiar el proceso). Un *agente* es la **entidad** que la ejecuta (un system-prompt + tools). El `ceo`, el `po` y el `pm` son agentes que *juegan* un rol de conducción —igual que `front` es un agente que juega el rol de construir UI—. No te confundas el sombrero con la persona que lo usa.

El humano no microgestiona 20 agentes. Conduce a través de tres roles:

- **`ceo`** — toma las riendas EN NOMBRE del humano, pero solo dentro de un mandato que el humano otorga y puede revocar. Decide el próximo movimiento de mayor palanca contra el North Star. **Nunca cruza una acción irreversible** (merge/deploy/gasto/borrado/publicar a prod) sin OK explícito.
- **`po`** — dueño del **qué** y el **por qué**. Escribe la propuesta OpenSpec, parte el trabajo en historias verificables, ata cada una al North Star.
- **`pm`** — guardián del **proceso**: que todo PR tenga milestone + labels + assignee + la sección que lo ata a un hito real. Mantiene el roadmap en sync.

> El PO decide el valor; el PM custodia que el proceso no se rompa; el CEO conduce dentro del mandato. El humano otorga el mandato y aprueba lo irreversible.

---

## Delegación y paralelismo

La jugada que más acelera: lanzar agentes independientes **en paralelo**, en una sola tanda.

```
Tarea: 3 mejoras al feed que no se tocan entre sí
 ├─ front  → autoplay de video muted-en-vista
 ├─ front  → prefetch de imágenes + threshold de scroll
 └─ data   → social-proof por popularidad
(las tres a la vez; cada una en su worktree → sin colisiones)
```

> **Caso real**: tres mejoras del feed (#515/#516/#513) se construyeron con tres agentes en paralelo. Condición para que no exploten: trabajo que **no comparte archivos**. Si comparten, un agente de integración chequea el solape antes de mergear.

Para ahorrar contexto en sesiones largas, hay subagentes comprimidos (estilo `cavecrew`): un *investigator* que solo localiza código, un *builder* de 1-2 archivos, un *reviewer* de diff. Su salida vuelve comprimida → el contexto principal dura más.

---

## El pipeline de PRs (los 4 agentes que no pierden trabajo)

Para abrir/revisar/auditar/mergear sin colisiones:

```
pr-creator     → abre el PR (descripción, metadata, labels)
pr-review      → revisa correctitud + simplificación
pr-auditor     → audita seguridad/calidad
pr-integration → EL CORAZÓN: chequea solape de archivos entre PRs
                 y SINCRONIZA la branch con main ANTES de mergear
```

> El paso que salva: `pr-integration` sincroniza con `main` antes de mergear. Saltearlo = revert silencioso (mergeás sobre un `main` viejo y borrás lo que entró en el medio). Ver [Lección 08](08-pipeline-prs.md).

---

## La oficina viva (loop-runner)

Los agentes y los loops se ven en un tablero —la "oficina"— donde cada loop es un lane con play/pausa/completar/rounds. La oficina es además un **loop-runner**: dispara jobs de la app (cron) y loops de agentes (spawn headless), todo desde una interfaz, no desde teatro hardcodeado.

> No confundas este **loop-runner** (el tablero que dispara jobs) con el **loop por objetivos** ([Lección 10](10-loop-objetivos.md)), que es el ciclo metodológico de criterios → iterar → verificar. Mismo nombre, capas distintas — ver el [mapa de las 5 piezas](#intro).

> Regla de honestidad acá también: si un disparo necesita credenciales que no están (`APP_URL`/`CRON_SECRET`), la oficina lo dice —no finge que disparó—.

---

## Checklist de salida

- [ ] Tenés un agente por preocupación que se repite (no un generalista para todo)
- [ ] Cada agente: system-prompt enfocado + herramientas acotadas a su dominio
- [ ] Existen los tres roles de conducción (decidir / priorizar / custodiar proceso)
- [ ] El CEO (o el agente conductor) no cruza acciones irreversibles sin OK del humano
- [ ] Paralelizás solo trabajo que no comparte archivos; lo que solapa pasa por integración
- [ ] La branch se sincroniza con `main` antes de mergear (no revert silencioso)
- [ ] Los disparos de la oficina son honestos sobre lo que pueden y no pueden hacer

> Siguiente: [05 · Destilar skills](05-skills.md)
