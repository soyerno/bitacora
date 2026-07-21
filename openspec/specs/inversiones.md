# Inversiones Tool Specification

## Overview

`/inversiones` es una herramienta educativa interactiva: módulos de conceptos,
quiz de perfil de riesgo, simulador de cartera diversificada y checklist de
broker. Todo el contenido y la lógica de cálculo viven en `lib/inversiones.ts`;
esta spec cubre la integridad de esos datos y la matemática del simulador.
El contenido es educativo — NUNCA debe presentarse como asesoramiento
financiero (la página lleva disclaimer explícito).

Source files:
- `lib/inversiones.ts` — clases de activos, perfiles, quiz, checklist, módulos, `perfilPorScore`, `proyectar`, `nivelRiesgo`.
- `app/inversiones/page.tsx` + `components/inversiones/*` — UI.

---

## SPEC-INV-001 — Integridad de perfiles y asignaciones

### Requirements

- Cada perfil (`conservador`, `moderado`, `agresivo`) MUST tener una asignación cuya suma sea exactamente 100.
- Cada key de asignación MUST referenciar un `id` existente en `ASSET_CLASSES`.
- Los perfiles MUST estar ordenados de menor a mayor riesgo (volatilidad ponderada creciente).

### Scenarios

#### Scenario: Toda asignación de perfil suma 100 sobre activos conocidos

```
For each perfil in PERFILES:
  Given su asignación
  Then la suma de porcentajes MUST ser 100
  And cada assetId MUST existir en ASSET_CLASSES
```

#### Scenario: El riesgo crece de conservador a agresivo

```
Given la volatilidad ponderada de cada perfil
Then vol(conservador) < vol(moderado) < vol(agresivo)
```

---

## SPEC-INV-002 — Quiz y mapeo de score a perfil

### Requirements

- El quiz MUST tener 5 preguntas, cada una con exactamente los puntajes {1, 2, 3}.
- `perfilPorScore` MUST cubrir todo el rango alcanzable (5–15) sin huecos: ≤8 conservador, 9–12 moderado, ≥13 agresivo.

### Scenarios

#### Scenario: Bordes del mapeo score → perfil

```
Given los scores 5, 8, 9, 12, 13, 15
Then perfilPorScore devuelve conservador, conservador, moderado, moderado, agresivo, agresivo
```

---

## SPEC-INV-003 — Proyección compuesta

### Requirements

- `proyectar(inicial, aporte, anios, retorno)` MUST devolver `anios + 1` puntos con el índice 0 igual al monto inicial.
- Con retorno 0%, el valor a N años MUST ser `inicial + aporte * 12 * N` (solo acumula aportes).
- Con retorno positivo y aportes ≥ 0, la serie MUST ser monótona no decreciente y superar lo aportado.
- La serie MUST tener piso 0 (un escenario pesimista extremo no produce valores negativos).

### Scenarios

#### Scenario: Retorno cero acumula exactamente los aportes

```
Given proyectar(1000, 100, 10, 0)
Then serie[0] = 1000
And serie[10] = 1000 + 100 * 12 * 10
```

#### Scenario: El interés compuesto supera a los aportes

```
Given proyectar(1000, 100, 20, 8)
Then serie es monótona creciente
And serie[20] > 1000 + 100 * 12 * 20
```

---

## SPEC-INV-004 — Checklist y paleta

### Requirements

- Los `id` de items de `BROKER_CHECKLIST` MUST ser únicos (son keys de persistencia en localStorage).
- Cada clase de activo MUST usar un slot único de la paleta validada (`--viz-1`..`--viz-6`), en orden de array = orden de slots (el orden adyacente es el mecanismo de seguridad CVD).
