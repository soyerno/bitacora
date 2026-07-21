"use client";

import { useState } from "react";

/**
 * Ejercicio de opciones únicas — cubre `choice` (multiple choice) y
 * `truefalse` (dos opciones fijas). Al comprobar pinta la correcta en verde
 * y la elegida errónea en rojo, y avisa al player con `onAnswered`.
 */
export default function OptionsExercise({
  question,
  options,
  correct,
  onAnswered,
}: {
  question: string;
  options: string[];
  correct: number;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  function optionClasses(i: number): string {
    const base =
      "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors";
    if (!checked) {
      return `${base} ${
        selected === i
          ? "border-accent bg-accent-light text-ink font-medium"
          : "border-border bg-surface text-ink hover:border-accent"
      }`;
    }
    if (i === correct) return `${base} border-accent bg-accent-light font-medium text-ink`;
    if (i === selected) return `${base} border-error bg-error-light text-ink`;
    return `${base} border-border bg-surface text-muted opacity-60`;
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold leading-snug text-ink">{question}</h2>
      <div className="mt-4 grid gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            disabled={checked}
            onClick={() => setSelected(i)}
            className={optionClasses(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      {!checked && (
        <button
          type="button"
          disabled={selected === null}
          onClick={() => {
            setChecked(true);
            onAnswered(selected === correct);
          }}
          className="mt-6 w-full rounded-xl bg-accent px-4 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8"
        >
          Comprobar
        </button>
      )}
    </div>
  );
}
