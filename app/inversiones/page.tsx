import type { Metadata } from "next";
import { MODULOS } from "@/lib/inversiones";
import PageShell from "@/components/PageShell";
import InversionesTool from "@/components/inversiones/InversionesTool";
import BrokerChecklist from "@/components/inversiones/BrokerChecklist";

export const metadata: Metadata = {
  title: "Inversiones · Erno × MODO",
  description:
    "Herramienta interactiva para aprender a invertir: fundamentos, quiz de perfil de riesgo, simulador de cartera diversificada y checklist para elegir broker.",
};

export default function InversionesPage() {
  const intro = (
    <>
      Un recorrido en 4 pasos para arrancar a invertir con criterio: entender
      los fundamentos, conocer tu perfil de riesgo, simular una cartera
      diversificada y elegir un broker con checklist en mano.
    </>
  );

  const meta = (
    <>
      Material educativo con supuestos ilustrativos — no es asesoramiento
      financiero ni recomendación de compra de ningún activo o broker.
    </>
  );

  return (
    <PageShell title="Aprender a invertir" intro={intro} meta={meta}>
      <div className="flex flex-col gap-12">
        <section id="aprender" className="scroll-mt-20">
          <h2 className="mb-1 font-display text-xl font-bold text-ink">
            Paso 1 · Los conceptos que importan
          </h2>
          <p className="mb-5 max-w-3xl text-sm text-muted">
            Cinco módulos cortos, en orden. Con esto cubrís el 90% de lo que
            necesitás saber antes de poner un peso.
          </p>
          <div className="flex flex-col gap-3">
            {MODULOS.map((m) => (
              <details
                key={m.id}
                className="group rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] open:pb-6"
              >
                <summary className="cursor-pointer list-none font-display text-base font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 inline-block text-muted transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {m.titulo}
                </summary>
                <p className="mt-3 max-w-3xl text-sm text-ink-soft">{m.intro}</p>
                <ul className="mt-3 flex max-w-3xl list-disc flex-col gap-2 pl-5 text-sm text-ink-soft">
                  {m.puntos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <InversionesTool />

        <section id="broker" className="scroll-mt-20">
          <h2 className="mb-1 font-display text-xl font-bold text-ink">
            Paso 4 · Elegí tu broker con checklist
          </h2>
          <p className="mb-5 max-w-3xl text-sm text-muted">
            Antes de abrir cuenta, pasá cada candidato por estos filtros:
            regulación primero, costos después. El progreso queda guardado en
            este dispositivo para que retomes la comparación cuando quieras.
          </p>
          <BrokerChecklist />
        </section>

        <p className="rounded-xl border border-dashed border-border bg-surface p-4 text-xs text-muted">
          ⚠️ Todo el contenido de esta página es educativo. Los retornos y
          volatilidades son supuestos ilustrativos de largo plazo y no
          constituyen asesoramiento financiero, legal ni impositivo. Antes de
          invertir, verificá la regulación de tu broker (CNV en Argentina,
          SEC/FINRA en EE.UU.) y considerá consultar a un asesor matriculado.
        </p>
      </div>
    </PageShell>
  );
}
