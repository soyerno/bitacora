"use client";

import { useState } from "react";
import { PERFILES, type PerfilRiesgo } from "@/lib/inversiones";
import PerfilInversor from "./PerfilInversor";
import SimuladorCartera from "./SimuladorCartera";

/**
 * Isla client de /inversiones: conecta el quiz de perfil con el simulador
 * (la asignación sugerida del perfil se aplica como estado del simulador).
 */
export default function InversionesTool() {
  const [asignacion, setAsignacion] = useState<Record<string, number>>({
    ...PERFILES[1].asignacion, // arranca en el preset moderado
  });
  const [perfilAplicado, setPerfilAplicado] = useState<PerfilRiesgo | null>(null);

  const aplicarPerfil = (nueva: Record<string, number>, perfil: PerfilRiesgo) => {
    setAsignacion(nueva);
    setPerfilAplicado(perfil);
    document
      .getElementById("simulador")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cambiarClase = (id: string, valor: number) => {
    setAsignacion((prev) => ({ ...prev, [id]: valor }));
    setPerfilAplicado(null); // al editar a mano deja de ser el preset del perfil
  };

  return (
    <>
      <section id="perfil" className="scroll-mt-20">
        <h2 className="mb-1 font-display text-xl font-bold text-ink">
          Paso 2 · Conocé tu perfil de riesgo
        </h2>
        <p className="mb-5 max-w-3xl text-sm text-muted">
          Cinco preguntas para saber cuánta volatilidad tolerás de verdad. El
          resultado sugiere una asignación de partida que podés llevar al
          simulador y ajustar.
        </p>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <PerfilInversor onAplicar={aplicarPerfil} />
        </div>
      </section>

      <section id="simulador" className="scroll-mt-20">
        <h2 className="mb-1 font-display text-xl font-bold text-ink">
          Paso 3 · Simulá tu cartera diversificada
        </h2>
        <p className="mb-5 max-w-3xl text-sm text-muted">
          Repartí 100% entre clases de activos y mirá cómo cambian el retorno
          esperado, el riesgo y la proyección a largo plazo.
          {perfilAplicado && (
            <span className="ml-1 font-medium text-accent-ink">
              Asignación aplicada: perfil {perfilAplicado.nombre.toLowerCase()}.
            </span>
          )}
        </p>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <SimuladorCartera asignacion={asignacion} onChange={cambiarClase} />
        </div>
      </section>
    </>
  );
}
