import { Arrow, ArrowDefs, Box, Caption, Frame } from "./primitives";

/** Valores declarados vs valores practicados: la brecha se lee en la agenda. */
export default function DiagramValores() {
  return (
    <Frame label="Valores declarados y valores practicados" viewBox="0 0 560 250">
      <ArrowDefs id="val-a" />
      <Box x={25} y={60} w={215} h={70} label="Valores declarados" sub="lo que digo que me importa" />
      <Box x={320} y={60} w={215} h={70} label="Valores practicados" sub="lo que mis acciones muestran" accent />
      <Arrow
        d="M242 95 L 318 95"
        markerId="val-a"
        dashed
        label="la brecha"
        lx={280}
        ly={83}
      />
      <Box x={320} y={165} w={215} h={50} label="La evidencia" sub="agenda · decisiones · billetera" />
      <Arrow d="M427 163 L 427 133" markerId="val-a" muted />
      <Caption x={280} y={240} text="El valor real no se declama: se lee en dónde ponés tiempo, foco y recursos" />
    </Frame>
  );
}
