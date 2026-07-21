"use client";

import { useState } from "react";
import {
  QUIZ,
  perfilPorScore,
  type PerfilRiesgo,
  ASSET_CLASSES,
} from "@/lib/inversiones";
import Pill from "@/components/Pill";

/**
 * Quiz de perfil de riesgo: 5 preguntas → conservador / moderado / agresivo,
 * con asignación sugerida aplicable al simulador vía `onAplicar`.
 */
export default function PerfilInversor({
  onAplicar,
}: {
  onAplicar: (asignacion: Record<string, number>, perfil: PerfilRiesgo) => void;
}) {
  const [respuestas, setRespuestas] = useState<(number | null)[]>(
    QUIZ.map(() => null),
  );

  const completas = respuestas.every((r) => r !== null);
  const score = respuestas.reduce<number>((acc, r) => acc + (r ?? 0), 0);
  const perfil = completas ? perfilPorScore(score) : null;

  const responder = (pregunta: number, puntos: number) => {
    setRespuestas((prev) => prev.map((r, i) => (i === pregunta ? puntos : r)));
  };

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col gap-5">
        {QUIZ.map((q, qi) => (
          <li key={q.pregunta}>
            <p className="mb-2 text-sm font-semibold text-ink">
              {qi + 1}. {q.pregunta}
            </p>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap">
              {q.opciones.map((op) => {
                const activa = respuestas[qi] === op.puntos;
                return (
                  <button
                    key={op.texto}
                    type="button"
                    onClick={() => responder(qi, op.puntos)}
                    aria-pressed={activa}
                    className={`rounded-lg border px-3 py-1.5 text-left text-sm transition-colors ${
                      activa
                        ? "border-accent bg-accent-light font-medium text-accent-ink"
                        : "border-border bg-surface text-ink-soft hover:border-accent"
                    }`}
                  >
                    {op.texto}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {perfil ? (
        <div className="rounded-xl border border-accent/40 bg-accent-light/60 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill variant="featured">Tu perfil</Pill>
            <h3 className="font-display text-lg font-bold text-ink">
              {perfil.nombre}
            </h3>
            <span className="text-xs text-muted">
              ({score} / {QUIZ.length * 3} puntos)
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-soft">{perfil.descripcion}</p>
          <p className="mt-3 text-xs text-muted">
            Asignación sugerida:{" "}
            {ASSET_CLASSES.filter((a) => (perfil.asignacion[a.id] ?? 0) > 0)
              .map((a) => `${a.nombre} ${perfil.asignacion[a.id]}%`)
              .join(" · ")}
          </p>
          <button
            type="button"
            onClick={() => onAplicar({ ...perfil.asignacion }, perfil)}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Usar esta asignación en el simulador ↓
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted">
          Respondé las {QUIZ.length} preguntas para conocer tu perfil y una
          asignación sugerida.
        </p>
      )}
    </div>
  );
}
