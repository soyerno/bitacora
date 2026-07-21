import { Arrow, ArrowDefs, Box, Frame } from "./primitives";

/** Ciclo de la promesa: creación → negociación → realización → evaluación. */
export default function DiagramCiclo() {
  return (
    <Frame label="El ciclo de la promesa" viewBox="0 0 560 290">
      <ArrowDefs id="ciclo-a" />
      <Box x={45} y={30} w={205} h={62} label="1 · Creación" sub="pido u ofrezco, con condiciones" accent />
      <Box x={310} y={30} w={205} h={62} label="2 · Negociación" sub="acepto / declino / contraoferta" />
      <Box x={310} y={195} w={205} h={62} label="3 · Realización" sub="cumplo — o aviso a tiempo" />
      <Box x={45} y={195} w={205} h={62} label="4 · Evaluación" sub="declaro satisfacción o reclamo" />
      <Arrow d="M252 61 L 308 61" markerId="ciclo-a" />
      <Arrow d="M412 94 L 412 193" markerId="ciclo-a" />
      <Arrow d="M308 226 L 252 226" markerId="ciclo-a" />
      <Arrow d="M147 193 L 147 94" markerId="ciclo-a" />
      <text x={280} y={140} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
        El ciclo de la promesa
      </text>
      <text x={280} y={156} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
        la confianza se juega en las cuatro fases
      </text>
    </Frame>
  );
}
