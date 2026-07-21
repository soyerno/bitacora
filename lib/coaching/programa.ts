import type { Chapter, Lesson } from "./types";
import { cap1 } from "./capitulos/cap1-observador";
import { cap2 } from "./capitulos/cap2-lenguaje";
import { cap3 } from "./capitulos/cap3-juicios";
import { cap4 } from "./capitulos/cap4-promesas";
import { cap5 } from "./capitulos/cap5-emociones";
import { cap6 } from "./capitulos/cap6-escucha";
import { cap7 } from "./capitulos/cap7-quiebres";

/**
 * El programa completo, en orden pedagógico: del observador (fundamento) a
 * los actos lingüísticos, y de ahí a emociones, escucha y la práctica.
 */
export const PROGRAMA: Chapter[] = [cap1, cap2, cap3, cap4, cap5, cap6, cap7];

export const PROGRAMA_TITLE = "Coaching Ontológico";
export const PROGRAMA_TAGLINE =
  "Un camino interactivo por la ontología del lenguaje: el observador, los actos lingüísticos, las emociones y la práctica de conversar mejor.";

export function getChapter(slug: string): Chapter | undefined {
  return PROGRAMA.find((c) => c.slug === slug);
}

export function getLesson(
  chapterSlug: string,
  lessonId: string,
): { chapter: Chapter; lesson: Lesson } | undefined {
  const chapter = getChapter(chapterSlug);
  const lesson = chapter?.lessons.find((l) => l.id === lessonId);
  return chapter && lesson ? { chapter, lesson } : undefined;
}

export function totalLessons(): number {
  return PROGRAMA.reduce((acc, c) => acc + c.lessons.length, 0);
}

/** Ejercicios respondibles (las tarjetas de teoría no cuentan). */
export function totalExercises(): number {
  return PROGRAMA.reduce(
    (acc, c) =>
      acc +
      c.lessons.reduce(
        (a, l) => a + l.exercises.filter((e) => e.kind !== "concept").length,
        0,
      ),
    0,
  );
}

/**
 * Orden global plano de lecciones — define el desbloqueo estilo Duolingo:
 * una lección se habilita cuando todas las anteriores están completas.
 */
export function flatLessonKeys(): string[] {
  return PROGRAMA.flatMap((c) => c.lessons.map((l) => `${c.slug}/${l.id}`));
}

/** Siguiente lección no completada (o undefined si el programa terminó). */
export function nextLessonKey(done: string[]): string | undefined {
  return flatLessonKeys().find((k) => !done.includes(k));
}

/** ¿Está desbloqueada la lección? (todas las anteriores en el orden global, hechas) */
export function isUnlocked(done: string[], chapterSlug: string, lessonId: string): boolean {
  const keys = flatLessonKeys();
  const idx = keys.indexOf(`${chapterSlug}/${lessonId}`);
  if (idx <= 0) return idx === 0;
  return keys.slice(0, idx).every((k) => done.includes(k));
}
