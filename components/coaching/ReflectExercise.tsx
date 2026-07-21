"use client";

import { useState } from "react";
import type { ReflectExercise as ReflectData } from "@/lib/coaching/types";

/**
 * Ejercicio de reflexión: pregunta abierta para pensar de verdad. No hay
 * respuesta correcta — al enviar se revela el insight que trabaja sobre lo
 * escrito. El texto se guarda en el progreso local del usuario.
 */
export default function ReflectExercise({
  exercise,
  savedText,
  onAnswered,
}: {
  exercise: ReflectData;
  savedText?: string;
  onAnswered: (text: string) => void;
}) {
  const [text, setText] = useState(savedText ?? "");
  const [sent, setSent] = useState(false);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
        Para pensar ✍️
      </p>
      <h2 className="mt-1 font-display text-lg font-bold leading-snug text-ink">
        {exercise.prompt}
      </h2>
      <textarea
        value={text}
        readOnly={sent}
        onChange={(e) => setText(e.target.value)}
        placeholder={exercise.placeholder ?? "Escribí acá, para vos…"}
        rows={5}
        className="mt-4 w-full rounded-xl border border-border bg-surface p-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <p className="mt-1 text-xs text-muted">
        Esto queda solo en tu navegador — es tu cuaderno, no un examen.
      </p>
      {!sent && (
        <button
          type="button"
          disabled={text.trim().length < 3}
          onClick={() => {
            setSent(true);
            onAnswered(text.trim());
          }}
          className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8"
        >
          Listo, lo escribí
        </button>
      )}
    </div>
  );
}
