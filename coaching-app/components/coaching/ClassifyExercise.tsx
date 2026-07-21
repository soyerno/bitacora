"use client";

import { useState } from "react";
import type { ClassifyExercise as ClassifyData } from "@/lib/coaching/types";

/**
 * Ejercicio de clasificación: cada item se asigna a una de dos categorías
 * (ej. hecho vs juicio). Al comprobar marca ✓/✗ por item; es correcto solo
 * si todos quedaron bien clasificados.
 */
export default function ClassifyExercise({
  exercise,
  onAnswered,
}: {
  exercise: ClassifyData;
  onAnswered: (correct: boolean) => void;
}) {
  const [answers, setAnswers] = useState<(0 | 1 | null)[]>(
    exercise.items.map(() => null),
  );
  const [checked, setChecked] = useState(false);

  const allAssigned = answers.every((a) => a !== null);

  function catButtonClasses(itemIdx: number, cat: 0 | 1): string {
    const chosen = answers[itemIdx] === cat;
    const base = "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors";
    if (!checked) {
      return `${base} ${
        chosen
          ? "border-accent bg-accent-light text-ink"
          : "border-border bg-surface text-muted hover:border-accent hover:text-ink"
      }`;
    }
    if (!chosen) return `${base} border-border bg-surface text-muted opacity-50`;
    const right = exercise.items[itemIdx].cat === cat;
    return `${base} ${right ? "border-accent bg-accent-light text-ink" : "border-error bg-error-light text-ink"}`;
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold leading-snug text-ink">
        {exercise.prompt}
      </h2>
      <div className="mt-4 grid gap-3">
        {exercise.items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-3"
          >
            <p className="text-sm text-ink">
              {checked && (
                <span className={answers[i] === item.cat ? "text-accent" : "text-error"}>
                  {answers[i] === item.cat ? "✓ " : "✗ "}
                </span>
              )}
              {item.text}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {([0, 1] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  disabled={checked}
                  onClick={() =>
                    setAnswers((prev) => prev.map((a, j) => (j === i ? cat : a)))
                  }
                  className={catButtonClasses(i, cat)}
                >
                  {exercise.categories[cat]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!checked && (
        <button
          type="button"
          disabled={!allAssigned}
          onClick={() => {
            setChecked(true);
            onAnswered(answers.every((a, i) => a === exercise.items[i].cat));
          }}
          className="mt-6 w-full rounded-xl bg-accent px-4 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8"
        >
          Comprobar
        </button>
      )}
    </div>
  );
}
