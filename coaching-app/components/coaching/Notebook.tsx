"use client";

import Link from "next/link";
import { useCoachingProgress } from "@/lib/coaching/progress";
import LessonNote from "./LessonNote";

export interface NotebookChapter {
  slug: string;
  title: string;
  icon: string;
  lessons: {
    id: string;
    title: string;
    /** Prompts de los ejercicios de reflexión, con su índice dentro de la lección. */
    reflects: { idx: number; prompt: string }[];
  }[];
}

/**
 * El cuaderno: todas las notas y reflexiones del usuario, agrupadas por
 * capítulo y lección. Las lecciones aparecen cuando fueron completadas o
 * tienen contenido escrito; la nota es editable acá mismo.
 */
export default function Notebook({ chapters }: { chapters: NotebookChapter[] }) {
  const { progress, ready } = useCoachingProgress();

  const visible = chapters
    .map((c) => ({
      ...c,
      lessons: c.lessons.filter((l) => {
        const key = `${c.slug}/${l.id}`;
        return (
          progress.done.includes(key) ||
          progress.notes[key] ||
          l.reflects.some((r) => progress.reflections[`${key}/${r.idx}`])
        );
      }),
    }))
    .filter((c) => c.lessons.length > 0);

  if (ready && visible.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-4xl" aria-hidden>
          📓
        </p>
        <p className="mt-3 font-display text-lg font-bold text-ink">
          Tu cuaderno está vacío (por ahora)
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Acá se van a juntar tus reflexiones escritas y las notas que dejes al
          terminar cada lección. Todo queda solo en tu navegador.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-accent px-6 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90"
        >
          Ir al programa
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {visible.map((c) => (
        <section key={c.slug}>
          <h2 className="mb-3 font-display text-lg font-bold text-ink">
            <span aria-hidden>{c.icon}</span> {c.title}
          </h2>
          <div className="grid gap-4">
            {c.lessons.map((l) => {
              const key = `${c.slug}/${l.id}`;
              const reflections = l.reflects
                .map((r) => ({ ...r, text: progress.reflections[`${key}/${r.idx}`] }))
                .filter((r) => r.text);
              return (
                <article key={l.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-base font-bold text-ink">{l.title}</h3>
                    <Link
                      href={`/${key}`}
                      className="shrink-0 text-xs font-medium text-accent hover:underline"
                    >
                      Repasar →
                    </Link>
                  </div>
                  {reflections.length > 0 && (
                    <div className="mt-3 grid gap-3">
                      {reflections.map((r) => (
                        <blockquote key={r.idx} className="border-l-4 border-accent bg-accent-light p-3">
                          <p className="text-xs text-muted">{r.prompt}</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{r.text}</p>
                        </blockquote>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Mi nota
                    </p>
                    <LessonNote noteKey={key} compact />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
