"use client";

import { useState } from "react";
import { ASSET_CLASSES } from "@/lib/inversiones";
import AsignacionEditor from "./AsignacionEditor";
import ProyeccionChart, { type Proyeccion } from "./ProyeccionChart";

/** Serie anual de crecimiento compuesto con aportes mensuales. */
function proyectar(
  inicial: number,
  aporteMensual: number,
  anios: number,
  retornoAnual: number,
): number[] {
  const mensual = (1 + retornoAnual / 100) ** (1 / 12) - 1;
  const serie = [inicial];
  let v = inicial;
  for (let a = 1; a <= anios; a++) {
    for (let m = 0; m < 12; m++) v = v * (1 + mensual) + aporteMensual;
    serie.push(Math.max(0, v));
  }
  return serie;
}

function nivelRiesgo(vol: number): string {
  if (vol < 5) return "bajo";
  if (vol < 12) return "medio";
  if (vol < 20) return "alto";
  return "muy alto";
}

const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/**
 * Simulador de cartera: asignación editable → retorno/volatilidad ponderados
 * y proyección compuesta con escenarios ilustrativos (esperado ± vol/2).
 */
export default function SimuladorCartera({
  asignacion,
  onChange,
}: {
  asignacion: Record<string, number>;
  onChange: (id: string, valor: number) => void;
}) {
  const [inicial, setInicial] = useState(1000);
  const [aporte, setAporte] = useState(100);
  const [anios, setAnios] = useState(20);

  const total = ASSET_CLASSES.reduce((s, a) => s + (asignacion[a.id] ?? 0), 0);
  const peso = (id: string) => (total > 0 ? (asignacion[id] ?? 0) / total : 0);
  const retorno = ASSET_CLASSES.reduce((s, a) => s + peso(a.id) * a.retorno, 0);
  const vol = ASSET_CLASSES.reduce((s, a) => s + peso(a.id) * a.volatilidad, 0);

  const data: Proyeccion = {
    aportado: Array.from({ length: anios + 1 }, (_, a) => inicial + aporte * 12 * a),
    pesimista: proyectar(inicial, aporte, anios, retorno - vol / 2),
    esperado: proyectar(inicial, aporte, anios, retorno),
    optimista: proyectar(inicial, aporte, anios, retorno + vol / 2),
  };
  const finalEsperado = data.esperado[anios];
  const finalAportado = data.aportado[anios];

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-ink";

  return (
    <div className="flex flex-col gap-6">
      <AsignacionEditor asignacion={asignacion} onChange={onChange} />

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Monto inicial ($)
          <input
            type="number"
            min={0}
            value={inicial}
            onChange={(e) => setInicial(Math.max(0, Number(e.target.value)))}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Aporte mensual ($)
          <input
            type="number"
            min={0}
            value={aporte}
            onChange={(e) => setAporte(Math.max(0, Number(e.target.value)))}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Horizonte: {anios} {anios === 1 ? "año" : "años"}
          <input
            type="range"
            min={1}
            max={40}
            value={anios}
            onChange={(e) => setAnios(Number(e.target.value))}
            className="h-8 w-full accent-[var(--accent)]"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Retorno anual esperado</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {retorno.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Volatilidad aproximada</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            ~{vol.toFixed(0)}%{" "}
            <span className="text-sm font-medium text-muted">
              (riesgo {nivelRiesgo(vol)})
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Valor esperado a {anios} años</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            ${fmt.format(finalEsperado)}
          </p>
          <p className="text-xs text-muted">
            aportando ${fmt.format(finalAportado)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <ProyeccionChart data={data} />
      </div>

      <details className="text-xs text-muted">
        <summary className="cursor-pointer font-medium">
          Ver datos de la proyección (tabla)
        </summary>
        <table className="mt-2 w-full text-left tabular-nums">
          <thead>
            <tr className="border-b border-border">
              <th className="py-1 pr-2 font-medium">Año</th>
              <th className="py-1 pr-2 font-medium">Aportado</th>
              <th className="py-1 pr-2 font-medium">Pesimista</th>
              <th className="py-1 pr-2 font-medium">Esperado</th>
              <th className="py-1 font-medium">Optimista</th>
            </tr>
          </thead>
          <tbody>
            {data.esperado.map((_, a) => (
              <tr key={a} className="border-b border-border/50">
                <td className="py-1 pr-2">{a}</td>
                <td className="py-1 pr-2">${fmt.format(data.aportado[a])}</td>
                <td className="py-1 pr-2">${fmt.format(data.pesimista[a])}</td>
                <td className="py-1 pr-2">${fmt.format(data.esperado[a])}</td>
                <td className="py-1">${fmt.format(data.optimista[a])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <p className="text-xs text-muted">
        Los retornos y volatilidades por clase son supuestos ilustrativos de
        largo plazo, no predicciones. La volatilidad de la cartera es una
        aproximación ponderada (en la práctica la diversificación la reduce por
        correlaciones). Escenarios: esperado ± volatilidad/2 anual.
      </p>
    </div>
  );
}
