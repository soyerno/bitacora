import { describe, it, expect } from "vitest";
import {
  ASSET_CLASSES,
  PERFILES,
  QUIZ,
  BROKER_CHECKLIST,
  MODULOS,
  perfilPorScore,
  proyectar,
  nivelRiesgo,
} from "@/lib/inversiones";

// Valida openspec/specs/inversiones.md contra lib/inversiones.ts (datos y
// matemática del simulador — la UI se cubre a mano/build).

const volPonderada = (asignacion) =>
  ASSET_CLASSES.reduce(
    (s, a) => s + ((asignacion[a.id] ?? 0) / 100) * a.volatilidad,
    0,
  );

describe("SPEC-INV-001 — perfiles y asignaciones", () => {
  const assetIds = new Set(ASSET_CLASSES.map((a) => a.id));

  it.each(PERFILES.map((p) => [p.id, p]))("%s suma 100", (_id, perfil) => {
    const suma = Object.values(perfil.asignacion).reduce((a, b) => a + b, 0);
    expect(suma).toBe(100);
  });

  it("toda asignación referencia activos existentes", () => {
    for (const perfil of PERFILES) {
      for (const id of Object.keys(perfil.asignacion)) {
        expect(assetIds.has(id), `${perfil.id} → ${id}`).toBe(true);
      }
    }
  });

  it("el riesgo crece de conservador a agresivo", () => {
    const [c, m, a] = PERFILES.map((p) => volPonderada(p.asignacion));
    expect(c).toBeLessThan(m);
    expect(m).toBeLessThan(a);
  });
});

describe("SPEC-INV-002 — quiz y score → perfil", () => {
  it("5 preguntas con puntajes exactos {1,2,3}", () => {
    expect(QUIZ).toHaveLength(5);
    for (const q of QUIZ) {
      const puntos = q.opciones.map((o) => o.puntos).sort();
      expect(puntos).toEqual([1, 2, 3]);
    }
  });

  it("bordes del mapeo: 5,8→conservador · 9,12→moderado · 13,15→agresivo", () => {
    expect(perfilPorScore(5).id).toBe("conservador");
    expect(perfilPorScore(8).id).toBe("conservador");
    expect(perfilPorScore(9).id).toBe("moderado");
    expect(perfilPorScore(12).id).toBe("moderado");
    expect(perfilPorScore(13).id).toBe("agresivo");
    expect(perfilPorScore(15).id).toBe("agresivo");
  });
});

describe("SPEC-INV-003 — proyección compuesta", () => {
  it("devuelve anios+1 puntos arrancando en el monto inicial", () => {
    const serie = proyectar(1000, 100, 10, 8);
    expect(serie).toHaveLength(11);
    expect(serie[0]).toBe(1000);
  });

  it("con retorno 0% acumula exactamente los aportes", () => {
    const serie = proyectar(1000, 100, 10, 0);
    expect(serie[10]).toBeCloseTo(1000 + 100 * 12 * 10, 6);
  });

  it("con retorno positivo es monótona y supera lo aportado", () => {
    const serie = proyectar(1000, 100, 20, 8);
    for (let a = 1; a < serie.length; a++) {
      expect(serie[a]).toBeGreaterThan(serie[a - 1]);
    }
    expect(serie[20]).toBeGreaterThan(1000 + 100 * 12 * 20);
  });

  it("un escenario pesimista extremo no baja de 0", () => {
    const serie = proyectar(1000, 0, 30, -40);
    for (const v of serie) expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe("SPEC-INV-004 — checklist y paleta", () => {
  it("ids de checklist únicos (keys de localStorage)", () => {
    const ids = BROKER_CHECKLIST.flatMap((g) => g.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada clase de activo usa un slot único --viz-1..--viz-6 en orden", () => {
    const vars = ASSET_CLASSES.map((a) => a.colorVar);
    expect(vars).toEqual(vars.map((_, i) => `--viz-${i + 1}`));
  });

  it("nivelRiesgo cubre los cortes 5/12/20", () => {
    expect(nivelRiesgo(1)).toBe("bajo");
    expect(nivelRiesgo(7)).toBe("medio");
    expect(nivelRiesgo(15)).toBe("alto");
    expect(nivelRiesgo(25)).toBe("muy alto");
  });

  it("hay 5 módulos educativos con contenido", () => {
    expect(MODULOS).toHaveLength(5);
    for (const m of MODULOS) expect(m.puntos.length).toBeGreaterThanOrEqual(4);
  });
});
