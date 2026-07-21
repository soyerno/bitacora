"use client";

import Link from "next/link";
import { useCoachingProgress } from "@/lib/coaching/progress";

export interface PathLesson {
  id: string;
  title: string;
  description: string;
  exerciseCount: number;
}

/**
 * Camino de lecciones de un capítulo (los "nodos" de Duolingo): completadas
 * con ✓, la siguiente resaltada como actual, las demás bloqueadas hasta
 * completar las anteriores. `allKeys` trae el orden global del programa.
 */
export default function ChapterPath({
  chapterSlug,
  lessons,
  allKeys,
}: {
  chapterSlug: string;
  lessons: PathLesson[];
  allKeys: string[];
}) {
  const { progress, ready } = useCoachingProgress();

  function stateOf(lessonId: string): "done" | "current" | "locked" {
    const key = `${chapterSlug}/${lessonId}`;
    if (progress.done.includes(key)) return "done";
    const idx = allKeys.indexOf(key);
    const prevDone = allKeys.slice(0, idx).every((k) => progress.done.includes(k));
    return prevDone ? "current" : "locked";
  }

  return (
    <ol className="relative ml-5 border-l-2 border-border">
      {lessons.map((lesson, i) => {
        const state = ready ? stateOf(lesson.id) : i === 0 ? "current" : "locked";
        const locked = state === "locked";
        const node = (
          <div
            className={`rounded-xl border p-4 transition-colors ${
              locked
                ? "border-border bg-surface opacity-60"
                : state === "done"
                  ? "border-border bg-surface hover:border-accent"
                  : "border-accent bg-accent-light shadow-[var(--shadow-card)] hover:opacity-90"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Lección {i + 1} · {lesson.exerciseCount} ejercicios
              {state === "done" && " · completada"}
            </p>
            <h3 className="mt-0.5 font-display text-base font-bold text-ink">
              {lesson.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{lesson.description}</p>
            {!locked && (
              <p className="mt-2 text-sm font-medium text-accent">
                {state === "done" ? "Repasar →" : "Empezar →"}
              </p>
            )}
          </div>
        );

        return (
          <li key={lesson.id} className="relative mb-4 pl-8 last:mb-0">
            <span
              aria-hidden
              className={`absolute -left-[19px] top-4 grid h-9 w-9 place-items-center rounded-full border-2 font-display text-sm font-bold ${
                state === "done"
                  ? "border-accent bg-accent text-white"
                  : state === "current"
                    ? "border-accent bg-surface text-accent"
                    : "border-border bg-surface text-muted"
              }`}
            >
              {state === "done" ? "✓" : state === "locked" ? "🔒" : i + 1}
            </span>
            {locked ? (
              node
            ) : (
              <Link href={`/${chapterSlug}/${lesson.id}`} className="block">
                {node}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
