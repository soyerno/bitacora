"use client";

import { useCoachingProgress } from "@/lib/coaching/progress";

/** Marcador estilo Duolingo: XP, racha de días y lecciones completadas. */
export default function CoachingStats({ totalLessons }: { totalLessons: number }) {
  const { progress, ready } = useCoachingProgress();
  const stats = [
    { label: "XP", value: ready ? String(progress.xp) : "—", icon: "⚡" },
    {
      label: "Racha",
      value: ready ? `${progress.streak.count} ${progress.streak.count === 1 ? "día" : "días"}` : "—",
      icon: "🔥",
    },
    {
      label: "Lecciones",
      value: ready ? `${progress.done.length}/${totalLessons}` : `0/${totalLessons}`,
      icon: "📗",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-center"
        >
          <p className="text-lg" aria-hidden>
            {s.icon}
          </p>
          <p className="font-display text-lg font-bold tabular-nums text-ink">{s.value}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
