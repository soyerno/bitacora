"use client";

import { useState } from "react";

export interface Proyeccion {
  /** Un punto por año, índice = año (0..horizonte). */
  aportado: number[];
  pesimista: number[];
  esperado: number[];
  optimista: number[];
}

const W = 720;
const H = 300;
const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

const fmtCompact = new Intl.NumberFormat("es-AR", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fmtFull = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

function ticksY(max: number): number[] {
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = 0; v <= max; v += step) out.push(v);
  return out;
}

/**
 * Proyección de crecimiento compuesto: línea esperada + banda de escenarios
 * (pesimista–optimista) + línea de referencia de lo aportado. Hover con
 * crosshair y tooltip por año.
 */
export default function ProyeccionChart({ data }: { data: Proyeccion }) {
  const [hover, setHover] = useState<number | null>(null);

  const anios = data.esperado.length - 1;
  const yMax = Math.max(...data.optimista, ...data.aportado) * 1.05 || 1;
  const x = (year: number) =>
    PAD.left + (year / anios) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    H - PAD.bottom - (v / yMax) * (H - PAD.top - PAD.bottom);

  const path = (serie: number[]) =>
    serie.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const banda =
    path(data.optimista) +
    " " +
    data.pesimista
      .map((v, i, arr) => {
        const j = arr.length - 1 - i;
        return `L${x(j)},${y(arr[j])}`;
      })
      .join(" ") +
    " Z";

  const xStep = anios > 24 ? 5 : anios > 12 ? 2 : 1;
  const xTicks: number[] = [];
  for (let a = 0; a <= anios; a += xStep) xTicks.push(a);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const year = Math.round(((px - PAD.left) / (W - PAD.left - PAD.right)) * anios);
    setHover(year >= 0 && year <= anios ? year : null);
  };

  const tooltipLeft = hover !== null && x(hover) > W * 0.62;

  return (
    <figure className="m-0">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ background: "var(--viz-1)" }} />
          Valor esperado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-4 rounded-sm" style={{ background: "var(--viz-band)" }} />
          Rango pesimista–optimista
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-0 w-4 border-t-2 border-dashed"
            style={{ borderColor: "var(--muted)" }}
          />
          Total aportado
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Proyección a ${anios} años: valor esperado ${fmtFull.format(data.esperado[anios])}, aportado ${fmtFull.format(data.aportado[anios])}`}
        className="w-full select-none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {ticksY(yMax).map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(t) + 3.5}
              textAnchor="end"
              fontSize={11}
              fill="var(--muted)"
            >
              {fmtCompact.format(t)}
            </text>
          </g>
        ))}
        {xTicks.map((a) => (
          <text
            key={a}
            x={x(a)}
            y={H - PAD.bottom + 18}
            textAnchor="middle"
            fontSize={11}
            fill="var(--muted)"
          >
            {a === 0 ? "hoy" : `${a}a`}
          </text>
        ))}

        <path d={banda} fill="var(--viz-band)" stroke="none" />
        <path
          d={path(data.aportado)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <path
          d={path(data.esperado)}
          fill="none"
          stroke="var(--viz-1)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--muted)"
              strokeWidth={1}
            />
            <circle
              cx={x(hover)}
              cy={y(data.esperado[hover])}
              r={4}
              fill="var(--viz-1)"
              stroke="var(--surface)"
              strokeWidth={2}
            />
            <g
              transform={`translate(${tooltipLeft ? x(hover) - 188 : x(hover) + 12}, ${PAD.top + 4})`}
            >
              <rect
                width={176}
                height={78}
                rx={8}
                fill="var(--surface)"
                stroke="var(--border)"
              />
              <text x={12} y={18} fontSize={11} fontWeight={700} fill="var(--ink)">
                {hover === 0 ? "Hoy" : `Año ${hover}`}
              </text>
              <text x={12} y={34} fontSize={11} fill="var(--ink)">
                Esperado: {fmtFull.format(data.esperado[hover])}
              </text>
              <text x={12} y={49} fontSize={11} fill="var(--muted)">
                Rango: {fmtCompact.format(data.pesimista[hover])} –{" "}
                {fmtCompact.format(data.optimista[hover])}
              </text>
              <text x={12} y={64} fontSize={11} fill="var(--muted)">
                Aportado: {fmtFull.format(data.aportado[hover])}
              </text>
            </g>
          </g>
        )}

        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={H - PAD.bottom}
          y2={H - PAD.bottom}
          stroke="var(--border)"
          strokeWidth={1}
        />
      </svg>
    </figure>
  );
}
