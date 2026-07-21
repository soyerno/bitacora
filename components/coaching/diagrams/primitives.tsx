import type { ReactNode } from "react";

/**
 * Primitivas SVG compartidas por los diagramas didácticos del programa de
 * coaching. Usan los tokens de tema (var(--accent), var(--ink)…) así los
 * diagramas se adaptan solos a claro/oscuro.
 */

export function Frame({
  label,
  viewBox,
  children,
}: {
  label: string;
  viewBox: string;
  children: ReactNode;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={viewBox}
      className="mx-auto w-full max-w-lg"
      style={{ fontFamily: "var(--font-red-hat), system-ui, sans-serif" }}
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

/** Punta de flecha; darle un id único por diagrama para evitar colisiones. */
export function ArrowDefs({ id, muted }: { id: string; muted?: boolean }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill={muted ? "var(--muted)" : "var(--accent)"} />
      </marker>
    </defs>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={accent ? "var(--accent-light)" : "var(--surface)"}
        stroke={accent ? "var(--accent)" : "var(--border)"}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={sub ? cy - 4 : cy + 5}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fill="var(--ink)"
      >
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
          {sub}
        </text>
      )}
    </g>
  );
}

export function Arrow({
  d,
  markerId,
  label,
  lx,
  ly,
  dashed = false,
  muted = false,
}: {
  d: string;
  markerId: string;
  label?: string;
  lx?: number;
  ly?: number;
  dashed?: boolean;
  muted?: boolean;
}) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={muted ? "var(--muted)" : "var(--accent)"}
        strokeWidth={2}
        strokeDasharray={dashed ? "5 4" : undefined}
        markerEnd={`url(#${markerId})`}
      />
      {label && lx !== undefined && ly !== undefined && (
        <text x={lx} y={ly} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
          {label}
        </text>
      )}
    </g>
  );
}

export function Caption({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--muted)">
      {text}
    </text>
  );
}
