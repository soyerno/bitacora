# 02 · Spec-Driven Development con OpenSpec

> Objetivo: escribir la propuesta **antes** de codear cuando el cambio lo amerita —features nuevas, breaking changes, arquitectura, seguridad— y dejar specs vivas que sobreviven al PR. Y saber cuándo NO hacerlo.

---

## Por qué specs antes de código

Con un agente que codea rápido, el cuello de botella no es escribir código: es **acordar qué se va a construir**. OpenSpec invierte el orden: primero una propuesta con criterios de aceptación verificables, recién después el código. El agente no arranca a tocar archivos hasta que la propuesta está aprobada.

Beneficio concreto: el desacuerdo aparece en la propuesta (barata de cambiar), no en 600 líneas de diff (caras de cambiar).

---

## Cuándo SÍ y cuándo NO

Esta es la decisión que más se equivoca. SDD no es para todo.

| Creá una propuesta para… | Salteá la propuesta para… |
|---|---|
| Features o funcionalidad nueva | Bug fixes (restaurás comportamiento esperado) |
| Breaking changes (API, schema) | Typos, formato, comentarios |
| Cambios de arquitectura o patrones | Updates de deps no-breaking |
| Performance que cambia comportamiento | Cambios de config |
| Patrones de seguridad | Cambios quirúrgicos obvios |

> Si dudás, mirá la columna derecha: ¿es un fix que devuelve el comportamiento esperado? Entonces no necesita spec, necesita el [worktree + PR (Lección 03)](03-worktrees.md) y listo.

---

## La estructura

Dos carpetas: propuestas vivas y specs archivadas.

```
openspec/
  changes/<change-id>/      # propuesta EN VUELO (verb-led: add-, update-, remove-, refactor-)
    proposal.md             # problema → propuesta → por qué
    tasks.md                # una task por escenario verificable
    design.md               # (solo si hace falta justificar decisiones)
    specs/<capability>/spec.md   # los deltas
  specs/<capability>/spec.md # spec VIVA (lo que el sistema YA hace)
```

El `change-id` es kebab-case, verb-led: `add-walk-rewards`, `update-feed-ranking`, `refactor-dashboard`.

---

## La spec: RFC 2119 + Given/When/Then

Los requirements usan lenguaje normativo (**SHALL / MUST / SHALL NOT**) y cada uno trae al menos un escenario verificable:

```markdown
## ADDED Requirements

### Requirement: Zone-Based Lost-Pet Alert Trigger
When a `perdido` case is created, the system SHALL notify users whose active
alert zone contains the case location. The system SHALL exclude the reporter
from recipients and SHALL NOT disclose the reporter's phone number.

#### Scenario: Lost pet inside a user's zone notifies them
- **WHEN** a lost case is created at a point inside a user's alert zone
- **THEN** that user receives an alert leading with breed, color, location and time
- **AND** the reporter is excluded and their phone is not disclosed
```

Por qué importa el `#### Scenario:`: **es el criterio de aceptación**. Mapea 1:1 a un test. "El sistema notifica" no es verificable; "WHEN caso dentro de la zona THEN el usuario recibe el alerta" sí —lo escribís como test y sabés cuándo está hecho.

> **Caso Firulapp**: el ejemplo de arriba es real (capability `lost-found`). Cada escenario se convirtió en un test del trigger de alertas por zona. La spec vive en `openspec/specs/lost-found/spec.md` y describe lo que el sistema YA hace —no lo que algún día haría—.

---

## El workflow de tres etapas

```
1. CREAR    openspec/changes/add-X/  →  proposal + tasks + deltas
            openspec validate add-X --strict   ← debe pasar
            (esperar aprobación — NO codear todavía)

2. APLICAR  codear contra las tasks, tachándolas a medida que pasan
            (acá entra el worktree + los agentes + los gates)

3. ARCHIVAR cuando está deployado: el delta se fusiona a la spec viva
            openspec/specs/<capability>/spec.md  ←  fuente de verdad actualizada
```

La etapa 3 es la que la gente saltea y por la que las specs se pudren. Si no archivás, la spec viva miente. La regla: **una feature no está terminada hasta que su delta está fusionado a la spec viva.**

---

## Roadmap e inventario

Dos documentos de navegación, no de detalle:

- `openspec/ROADMAP.md` — qué viene y en qué fase.
- `openspec/FEATURE_INVENTORY.md` — qué capabilities existen y su estado.

Atan cada propuesta a un objetivo del producto. El agente los consulta para no proponer algo que ya existe o que contradice la dirección.

---

## Checklist de salida

- [ ] Sabés decidir SDD-sí vs SDD-no (¿feature/breaking/arquitectura/seguridad, o fix/typo/dep/config?)
- [ ] Tu propuesta tiene `proposal.md` + `tasks.md` + deltas por capability
- [ ] Cada requirement usa RFC 2119 (SHALL/MUST) y trae ≥1 `#### Scenario:`
- [ ] Cada escenario es verificable (mapea a un test)
- [ ] `openspec validate <change-id> --strict` pasa
- [ ] No empezaste a codear hasta tener la propuesta aprobada
- [ ] Tenés claro que archivar (fusionar el delta a la spec viva) es parte de "terminar"

> Siguiente: [03 · Worktree por feature](03-worktrees.md)
