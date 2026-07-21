import type { ComponentType } from "react";
import type { DiagramId } from "@/lib/coaching/types";
import DiagramOAR from "./DiagramOAR";
import DiagramActos from "./DiagramActos";
import DiagramEscalera from "./DiagramEscalera";
import DiagramGrilla from "./DiagramGrilla";
import DiagramCiclo from "./DiagramCiclo";
import DiagramEscucha from "./DiagramEscucha";
import DiagramQuiebre from "./DiagramQuiebre";
import DiagramValores from "./DiagramValores";
import DiagramLoopCreencia from "./DiagramLoopCreencia";

/** Registro id → componente SVG, para referenciar diagramas desde el contenido. */
const DIAGRAMS: Record<DiagramId, ComponentType> = {
  oar: DiagramOAR,
  actos: DiagramActos,
  escalera: DiagramEscalera,
  "grilla-animos": DiagramGrilla,
  "ciclo-promesa": DiagramCiclo,
  escucha: DiagramEscucha,
  quiebre: DiagramQuiebre,
  valores: DiagramValores,
  "loop-creencia": DiagramLoopCreencia,
};

export default function Diagram({ id }: { id: DiagramId }) {
  const Comp = DIAGRAMS[id];
  return <Comp />;
}
