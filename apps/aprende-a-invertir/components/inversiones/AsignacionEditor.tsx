"use client";

import { ASSET_CLASSES } from "@/lib/inversiones";

/**
 * Editor de asignación por clase de activo: barra apilada (composición) +
 * un slider por clase con etiqueta directa de %. Los colores vienen de la
 * paleta --viz-* validada; las etiquetas visibles cubren la regla de relief.
 */
export default function AsignacionEditor({
  asignacion,
  onChange,
}: {
  asignacion: Record<string, number>;
  onChange: (id: string, valor: number) => void;
}) {
  const total = ASSET_CLASSES.reduce(
    (acc, a) => acc + (asignacion[a.id] ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex h-8 w-full gap-0.5 overflow-hidden rounded-lg"
        role="img"
        aria-label={`Composición de la cartera: ${ASSET_CLASSES.filter((a) => (asignacion[a.id] ?? 0) > 0)
          .map((a) => `${a.nombre} ${asignacion[a.id]}%`)
          .join(", ")}`}
      >
        {total > 0 ? (
          ASSET_CLASSES.filter((a) => (asignacion[a.id] ?? 0) > 0).map((a) => (
            <div
              key={a.id}
              className="h-full rounded-[3px] transition-[flex-grow] duration-200"
              style={{
                flexGrow: asignacion[a.id],
                flexBasis: 0,
                background: `var(${a.colorVar})`,
              }}
              title={`${a.nombre}: ${asignacion[a.id]}%`}
            />
          ))
        ) : (
          <div className="h-full w-full rounded-[3px] border border-dashed border-border" />
        )}
      </div>

      <ul className="flex flex-col gap-2.5">
        {ASSET_CLASSES.map((a) => {
          const valor = asignacion[a.id] ?? 0;
          return (
            <li key={a.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span className="flex w-44 items-center gap-2 sm:w-56">
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ background: `var(${a.colorVar})` }}
                />
                <span
                  className="truncate text-sm text-ink"
                  title={`${a.nombre} — ${a.descripcion} Retorno ilustrativo ${a.retorno}% anual, volatilidad ~${a.volatilidad}%.`}
                >
                  {a.nombre}
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={valor}
                onChange={(e) => onChange(a.id, Number(e.target.value))}
                aria-label={`Porcentaje en ${a.nombre}`}
                className="w-full accent-[var(--accent)]"
              />
              <span className="w-12 text-right font-mono text-sm tabular-nums text-ink">
                {valor}%
              </span>
            </li>
          );
        })}
      </ul>

      <p
        className={`text-xs ${total === 100 ? "text-muted" : "font-medium text-[var(--viz-2)]"}`}
        role="status"
      >
        Total: {total}%
        {total !== 100 &&
          " — la proyección normaliza a 100%, pero conviene que la suma dé exacto."}
      </p>
    </div>
  );
}
