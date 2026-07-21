"use client";

import Link from "next/link";
import { useCoachingProgress } from "@/lib/coaching/progress";

export interface MapChapter {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  lessonKeys: string[];
}

/**
 * Mapa del programa: un card por capítulo con anillo de progreso y estado.
 * El capítulo donde vive la próxima lección pendiente se marca como actual.
 */
export default function ProgramMap({ chapters }: { chapters: MapChapter[] }) {
  const { progress, ready } = useCoachingProgress();
  const allKeys = chapters.flatMap((c) => c.lessonKeys);
  const nextKey = allKeys.find((k) => !progress.done.includes(k));

  return (
    <ol className="grid gap-4">
      {chapters.map((chapter, i) => {
        const doneCount = chapter.lessonKeys.filter((k) =>
          progress.done.includes(k),
        ).length;
        const total = chapter.lessonKeys.length;
        const complete = doneCount === total;
        const isCurrent = ready && nextKey !== undefined && chapter.lessonKeys.includes(nextKey);
        const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

        return (
          <li key={chapter.slug}>
            <Link
              href={`/coaching/${chapter.slug}`}
              className={`flex items-center gap-4 rounded-xl border bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:border-accent ${
                isCurrent ? "border-accent" : "border-border"
              }`}
            >
              <span
                aria-hidden
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl ${
                  complete ? "bg-accent-light" : "bg-bg"
                }`}
              >
                {chapter.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Capítulo {i + 1}
                  {complete && " · completado ✓"}
                  {isCurrent && !complete && " · estás acá"}
                </span>
                <span className="block font-display text-lg font-bold text-ink">
                  {chapter.title}
                </span>
                <span className="block truncate text-sm text-muted">{chapter.subtitle}</span>
                <span className="mt-2 flex items-center gap-2">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                    <span
                      className="block h-full rounded-full bg-accent transition-[width] duration-300"
                      style={{ width: `${ready ? pct : 0}%` }}
                    />
                  </span>
                  <span className="text-xs tabular-nums text-muted">
                    {ready ? doneCount : 0}/{total}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
