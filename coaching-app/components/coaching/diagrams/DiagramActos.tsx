import { Arrow, ArrowDefs, Box, Frame } from "./primitives";

/** Mapa de los actos lingüísticos básicos. */
export default function DiagramActos() {
  return (
    <Frame label="Mapa de los actos lingüísticos" viewBox="0 0 560 260">
      <ArrowDefs id="actos-a" muted />
      <Box x={185} y={12} w={190} h={46} label="Actos lingüísticos" sub="hablar es actuar" accent />
      <Arrow d="M240 58 L 165 96" markerId="actos-a" muted />
      <Arrow d="M320 58 L 395 96" markerId="actos-a" muted />
      <Arrow d="M235 58 C 150 110, 150 140, 158 176" markerId="actos-a" muted />
      <Arrow d="M325 58 C 410 110, 410 140, 402 176" markerId="actos-a" muted />
      <Box x={55} y={100} w={210} h={56} label="Afirmaciones" sub="verificables: verdaderas o falsas" />
      <Box x={295} y={100} w={210} h={56} label="Declaraciones" sub="crean realidad; válidas o inválidas" />
      <Box x={55} y={180} w={210} h={56} label="Juicios" sub="opiniones: fundadas o infundadas" />
      <Box x={295} y={180} w={210} h={56} label="Promesas" sub="pedido u oferta + aceptación" />
    </Frame>
  );
}
