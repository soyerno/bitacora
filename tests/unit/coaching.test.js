import { describe, expect, it } from "vitest";
import {
  PROGRAMA,
  flatLessonKeys,
  getChapter,
  getLesson,
  isUnlocked,
  nextLessonKey,
  totalExercises,
  totalLessons,
} from "@/lib/coaching/programa";
import { nextStreak } from "@/lib/coaching/progress";

describe("programa de coaching — integridad del contenido", () => {
  it("tiene capítulos con slugs únicos y lecciones con ids únicos", () => {
    const slugs = PROGRAMA.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of PROGRAMA) {
      const ids = c.lessons.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(c.lessons.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("cada lección tiene al menos 4 ejercicios, una reflexión y una tarjeta de teoría", () => {
    for (const c of PROGRAMA) {
      for (const l of c.lessons) {
        const answerable = l.exercises.filter((e) => e.kind !== "concept");
        expect(answerable.length, `${c.slug}/${l.id}`).toBeGreaterThanOrEqual(4);
        const reflects = l.exercises.filter((e) => e.kind === "reflect");
        expect(reflects.length, `${c.slug}/${l.id} sin reflexión`).toBeGreaterThanOrEqual(1);
        const concepts = l.exercises.filter((e) => e.kind === "concept");
        expect(concepts.length, `${c.slug}/${l.id} sin teoría`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("las tarjetas de teoría tienen título, cuerpo y diagramas válidos", () => {
    const DIAGRAM_IDS = [
      "oar",
      "actos",
      "escalera",
      "grilla-animos",
      "ciclo-promesa",
      "escucha",
      "quiebre",
      "valores",
      "loop-creencia",
    ];
    const used = new Set();
    for (const c of PROGRAMA) {
      for (const l of c.lessons) {
        for (const e of l.exercises) {
          if (e.kind !== "concept") continue;
          const where = `${c.slug}/${l.id}`;
          expect(e.title.length, where).toBeGreaterThan(0);
          expect(e.body.length, where).toBeGreaterThan(100);
          if (e.diagram) {
            expect(DIAGRAM_IDS, `${where}: diagrama desconocido`).toContain(e.diagram);
            used.add(e.diagram);
          }
        }
      }
    }
    // Todos los diagramas del registro se usan en algún capítulo.
    expect([...used].sort()).toEqual([...DIAGRAM_IDS].sort());
  });

  it("los ejercicios choice tienen índice correcto en rango y explicación", () => {
    for (const c of PROGRAMA) {
      for (const l of c.lessons) {
        for (const e of l.exercises) {
          const where = `${c.slug}/${l.id}`;
          if (e.kind === "choice") {
            expect(e.options.length, where).toBeGreaterThanOrEqual(2);
            expect(e.correct, where).toBeGreaterThanOrEqual(0);
            expect(e.correct, where).toBeLessThan(e.options.length);
            expect(e.explain.length, where).toBeGreaterThan(0);
          }
          if (e.kind === "truefalse") {
            expect(typeof e.correct, where).toBe("boolean");
            expect(e.explain.length, where).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("los classify usan ambas categorías y cats válidas; los match tienen pares únicos", () => {
    for (const c of PROGRAMA) {
      for (const l of c.lessons) {
        for (const e of l.exercises) {
          const where = `${c.slug}/${l.id}`;
          if (e.kind === "classify") {
            expect(e.categories.length, where).toBe(2);
            const cats = new Set(e.items.map((it) => it.cat));
            for (const it of e.items) expect([0, 1], where).toContain(it.cat);
            expect(cats.size, `${where}: classify trivial`).toBe(2);
          }
          if (e.kind === "match") {
            expect(e.pairs.length, where).toBeGreaterThanOrEqual(3);
            const lefts = e.pairs.map((p) => p.left);
            const rights = e.pairs.map((p) => p.right);
            expect(new Set(lefts).size, where).toBe(lefts.length);
            expect(new Set(rights).size, where).toBe(rights.length);
          }
          if (e.kind === "reflect") {
            expect(e.insight.length, where).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("los helpers de navegación funcionan sobre el orden global", () => {
    const keys = flatLessonKeys();
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.length).toBe(totalLessons());
    expect(totalExercises()).toBeGreaterThan(keys.length);

    // Sin progreso: solo la primera lección desbloqueada.
    const [first, second] = keys.map((k) => k.split("/"));
    expect(isUnlocked([], first[0], first[1])).toBe(true);
    expect(isUnlocked([], second[0], second[1])).toBe(false);
    expect(nextLessonKey([])).toBe(keys[0]);

    // Con la primera hecha: se abre la segunda, y next apunta ahí.
    expect(isUnlocked([keys[0]], second[0], second[1])).toBe(true);
    expect(nextLessonKey([keys[0]])).toBe(keys[1]);

    // Programa completo: no hay próxima.
    expect(nextLessonKey(keys)).toBeUndefined();
  });

  it("incluye las lecciones de hechos/interpretación y de culpa/perdón", () => {
    expect(getLesson("juicios", "hechos-interpretacion")?.lesson.title).toBe(
      "Hechos e interpretación",
    );
    expect(getLesson("emociones", "culpa-perdon")?.lesson.title).toBe(
      "La culpa y el perdón",
    );
  });

  it("incluye el capítulo de valores y creencias, después de emociones", () => {
    const chapter = getChapter("valores-creencias");
    expect(chapter?.lessons.map((l) => l.id)).toEqual([
      "valores",
      "sistema-creencias",
      "transformar-creencias",
    ]);
    const slugs = PROGRAMA.map((c) => c.slug);
    expect(slugs.indexOf("valores-creencias")).toBe(slugs.indexOf("emociones") + 1);
    expect(slugs.indexOf("valores-creencias")).toBeLessThan(slugs.indexOf("escucha"));
  });

  it("getChapter y getLesson resuelven slugs reales y rechazan inexistentes", () => {
    expect(getChapter(PROGRAMA[0].slug)).toBe(PROGRAMA[0]);
    expect(getChapter("no-existe")).toBeUndefined();
    const found = getLesson(PROGRAMA[0].slug, PROGRAMA[0].lessons[0].id);
    expect(found?.lesson).toBe(PROGRAMA[0].lessons[0]);
    expect(getLesson(PROGRAMA[0].slug, "nope")).toBeUndefined();
  });
});

describe("racha de días", () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  it("arranca en 1 la primera vez y no re-cuenta el mismo día", () => {
    expect(nextStreak({ count: 0, last: null })).toEqual({ count: 1, last: today });
    expect(nextStreak({ count: 3, last: today })).toEqual({ count: 3, last: today });
  });

  it("suma si la última fue ayer y reinicia si hubo un hueco", () => {
    expect(nextStreak({ count: 3, last: yesterday })).toEqual({ count: 4, last: today });
    expect(nextStreak({ count: 9, last: "2020-01-01" })).toEqual({ count: 1, last: today });
  });
});
