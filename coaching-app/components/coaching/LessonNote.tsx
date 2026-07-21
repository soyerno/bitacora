"use client";

import { useState } from "react";
import { useCoachingProgress } from "@/lib/coaching/progress";

/**
 * Editor de la nota personal de una lección. Se usa en la pantalla de cierre
 * y en el cuaderno (/coaching/notas). La nota vive en localStorage junto al
 * resto del progreso; vaciarla la borra del cuaderno.
 *
 * `draft` arranca en null (= "sin ediciones"): mientras sea null se muestra
 * lo persistido, así el valor aparece solo cuando el storage carga, sin
 * efectos ni riesgo de pisar la nota guardada.
 */
export default function LessonNote({
  noteKey,
  compact = false,
}: {
  /** Clave `capitulo/leccion`. */
  noteKey: string;
  /** Versión compacta para el cuaderno (sin encabezado). */
  compact?: boolean;
}) {
  const { progress, saveNote } = useCoachingProgress();
  const saved = progress.notes[noteKey] ?? "";
  const [draft, setDraft] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const value = draft ?? saved;
  const dirty = draft !== null && draft !== saved;

  return (
    <div className={compact ? "" : "mt-8 rounded-xl border border-border bg-surface p-4 text-left"}>
      {!compact && (
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
          Mis notas de esta lección 📓
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => {
          setDraft(e.target.value);
          setJustSaved(false);
        }}
        placeholder="¿Qué te llevás? ¿Qué distinción querés recordar? ¿Qué vas a probar esta semana?"
        rows={compact ? 3 : 4}
        className="mt-2 w-full rounded-lg border border-border bg-bg p-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            saveNote(noteKey, value);
            setDraft(null);
            setJustSaved(true);
          }}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Guardar nota
        </button>
        <span className="text-xs text-muted" role="status">
          {justSaved ? "Guardada ✓" : dirty ? "Sin guardar" : saved ? "Guardada en tu cuaderno" : ""}
        </span>
      </div>
    </div>
  );
}
