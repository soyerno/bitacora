"use client";

/**
 * Banner de resultado al pie del ejercicio (estilo Duolingo): verde si fue
 * correcto, rojo si no, siempre con la explicación pedagógica y el botón
 * para continuar. La explicación es el corazón: acá se aprende.
 */
export default function ExerciseFeedback({
  correct,
  explain,
  isLast,
  onContinue,
}: {
  correct: boolean;
  explain: string;
  isLast: boolean;
  onContinue: () => void;
}) {
  return (
    <div
      role="status"
      className={`mt-6 rounded-xl border p-4 ${
        correct ? "border-accent bg-accent-light" : "border-error bg-error-light"
      }`}
    >
      <p className={`font-display font-bold ${correct ? "text-accent" : "text-error"}`}>
        {correct ? "¡Correcto!" : "No exactamente…"}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink">{explain}</p>
      <button
        type="button"
        autoFocus
        onClick={onContinue}
        className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
      >
        {isLast ? "Terminar lección" : "Continuar"}
      </button>
    </div>
  );
}
