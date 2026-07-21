import { Arrow, ArrowDefs, Box, Caption, Frame } from "./primitives";

/** Escalera de inferencias: de los hechos a la acción, con su loop reflexivo. */
export default function DiagramEscalera() {
  return (
    <Frame label="Escalera de inferencias" viewBox="0 0 580 310">
      <ArrowDefs id="esc-a" />
      <Box x={20} y={234} w={165} h={52} label="Hechos" sub="lo que una cámara grabaría" accent />
      <Box x={155} y={168} w={165} h={52} label="Selecciono" sub="recorto algunos datos" />
      <Box x={290} y={102} w={165} h={52} label="Interpreto" sub="les doy mi sentido e historia" />
      <Box x={415} y={36} w={165} h={52} label="Concluyo y actúo" sub="juicios, decisiones" />
      <Arrow d="M140 232 L 190 224" markerId="esc-a" />
      <Arrow d="M275 166 L 325 158" markerId="esc-a" />
      <Arrow d="M405 100 L 448 92" markerId="esc-a" />
      <Arrow
        d="M497 90 C 585 185, 430 300, 120 292"
        markerId="esc-a"
        dashed
        muted
      />
      <Caption x={330} y={305} text="El loop: lo que ya concluí filtra qué hechos veo mañana" />
      <Caption x={290} y={18} text="Subimos la escalera en milisegundos — y vivimos en el último escalón" />
    </Frame>
  );
}
