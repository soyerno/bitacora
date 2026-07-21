"use client";

import Link from "next/link";
import LessonNote from "./LessonNote";

/** Pantalla final de lección: XP ganado, aciertos, nota personal y a dónde seguir. */
export default function LessonComplete({
  xpEarned,
  correctCount,
  total,
  noteKey,
  chapterHref,
  nextHref,
}: {
  xpEarned: number;
  correctCount: number;
  total: number;
  /** Clave `capitulo/leccion` para la nota personal. */
  noteKey: string;
  chapterHref: string;
  nextHref: string | null;
}) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <div className="text-6xl" aria-hidden>
        🎉
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold text-ink">
        ¡Lección completada!
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">XP</p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">
            {xpEarned > 0 ? `+${xpEarned}` : "repaso"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Aciertos
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {correctCount}/{total}
          </p>
        </div>
      </div>
      <LessonNote noteKey={noteKey} />
      <div className="mt-6 grid gap-2">
        {nextHref && (
          <Link
            href={nextHref}
            className="rounded-xl bg-accent px-4 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90"
          >
            Siguiente lección →
          </Link>
        )}
        <Link
          href={chapterHref}
          className="rounded-xl border border-border bg-surface px-4 py-2.5 font-display font-bold text-ink transition-colors hover:border-accent"
        >
          Volver al capítulo
        </Link>
        <Link
          href="/coaching/notas"
          className="text-sm font-medium text-accent hover:underline"
        >
          Ver mi cuaderno 📓
        </Link>
      </div>
    </div>
  );
}
