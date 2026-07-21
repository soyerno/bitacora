"use client";

import type { ConceptCard } from "@/lib/coaching/types";
import Diagram from "./diagrams";

/**
 * Tarjeta de teoría dentro de una lección: explica la distinción antes de
 * ejercitarla — con diagrama y ejemplo opcionales. No se "responde": se lee
 * y se continúa (el aprendizaje se verifica en los ejercicios que siguen).
 */
export default function ConceptSlide({
  card,
  onContinue,
}: {
  card: ConceptCard;
  onContinue: () => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
        Concepto 💡
      </p>
      <h2 className="mt-1 font-display text-lg font-bold leading-snug text-ink">
        {card.title}
      </h2>
      <div className="mt-3 space-y-3">
        {card.body.split("\n\n").map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink-soft">
            {para}
          </p>
        ))}
      </div>
      {card.diagram && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4">
          <Diagram id={card.diagram} />
        </div>
      )}
      {card.example && (
        <div className="mt-4 rounded-xl border-l-4 border-accent bg-accent-light p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Ejemplo
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{card.example}</p>
        </div>
      )}
      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full rounded-xl bg-accent px-4 py-2.5 font-display font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
      >
        Entendido, sigamos
      </button>
    </div>
  );
}
