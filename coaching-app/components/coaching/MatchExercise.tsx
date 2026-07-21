"use client";

import { useMemo, useState } from "react";
import type { MatchExercise as MatchData } from "@/lib/coaching/types";

/** Hash simple y estable para desordenar la columna derecha sin Math.random
 *  (determinístico → mismo orden en SSR y cliente, sin hydration mismatch). */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Ejercicio de unir pares (concepto ↔ definición), interacción Duolingo:
 * tocás uno de la izquierda, uno de la derecha; si coinciden quedan fijados,
 * si no cuenta como error y podés reintentar. Termina al unir todos.
 */
export default function MatchExercise({
  exercise,
  onAnswered,
}: {
  exercise: MatchData;
  onAnswered: (correct: boolean) => void;
}) {
  const rights = useMemo(
    () => [...exercise.pairs.map((p) => p.right)].sort((a, b) => hash(a) - hash(b)),
    [exercise.pairs],
  );
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongRight, setWrongRight] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = matched.size === exercise.pairs.length;

  function pickRight(right: string) {
    if (selLeft === null || matched.has(right)) return;
    if (exercise.pairs[selLeft].right === right) {
      const next = new Set(matched).add(right);
      setMatched(next);
      setSelLeft(null);
      setWrongRight(null);
      if (next.size === exercise.pairs.length) onAnswered(mistakes === 0);
    } else {
      setMistakes((m) => m + 1);
      setWrongRight(right);
    }
  }

  const btn = "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors";

  return (
    <div>
      <h2 className="font-display text-lg font-bold leading-snug text-ink">
        {exercise.prompt}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          {exercise.pairs.map((p, i) => {
            const isMatched = matched.has(p.right);
            return (
              <button
                key={p.left}
                type="button"
                disabled={isMatched || done}
                onClick={() => setSelLeft(i)}
                className={`${btn} ${
                  isMatched
                    ? "border-accent bg-accent-light text-muted opacity-60"
                    : selLeft === i
                      ? "border-accent bg-accent-light font-medium text-ink"
                      : "border-border bg-surface text-ink hover:border-accent"
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="grid content-start gap-2">
          {rights.map((right) => {
            const isMatched = matched.has(right);
            return (
              <button
                key={right}
                type="button"
                disabled={isMatched || done}
                onClick={() => pickRight(right)}
                className={`${btn} ${
                  isMatched
                    ? "border-accent bg-accent-light text-muted opacity-60"
                    : wrongRight === right
                      ? "border-error bg-error-light text-ink"
                      : "border-border bg-surface text-ink hover:border-accent"
                }`}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {!done && (
        <p className="mt-4 text-xs text-muted">
          {selLeft === null
            ? "Elegí un concepto de la izquierda y uní con su par de la derecha."
            : `Uniendo: «${exercise.pairs[selLeft].left}» — elegí su par.`}
          {mistakes > 0 && ` · ${mistakes} ${mistakes === 1 ? "error" : "errores"}`}
        </p>
      )}
    </div>
  );
}
