"use client";

import { useState } from "react";
import { BROKER_CHECKLIST } from "@/lib/inversiones";

const KEY = "bitacora-inversiones-broker-checklist";

function leerGuardado(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

const TOTAL = BROKER_CHECKLIST.reduce((s, g) => s + g.items.length, 0);

/**
 * Checklist interactiva para evaluar un broker antes de abrir cuenta.
 * El progreso persiste en localStorage (por dispositivo).
 */
export default function BrokerChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(leerGuardado);

  const marcados = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((marcados / TOTAL) * 100);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const reset = () => {
    setChecked({});
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-bg"
          role="progressbar"
          aria-valuenow={marcados}
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-label="Progreso de la checklist"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className="whitespace-nowrap text-xs font-medium text-muted"
          suppressHydrationWarning
        >
          {marcados} / {TOTAL}
        </span>
        {marcados > 0 && (
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-border px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent-ink"
          >
            Reiniciar
          </button>
        )}
      </div>

      {marcados === TOTAL && (
        <p className="rounded-lg bg-accent-light px-4 py-2 text-sm font-medium text-accent-ink">
          ✓ Checklist completa: este broker pasó todos los filtros. Empezá con
          un monto chico para probar el ciclo completo.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {BROKER_CHECKLIST.map((grupo) => (
          <fieldset
            key={grupo.grupo}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <legend className="px-1 text-sm font-semibold text-ink">
              {grupo.grupo}
            </legend>
            <ul className="mt-1 flex flex-col gap-2">
              {grupo.items.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      suppressHydrationWarning
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    />
                    <span
                      className={checked[item.id] ? "text-muted line-through" : ""}
                    >
                      {item.texto}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
