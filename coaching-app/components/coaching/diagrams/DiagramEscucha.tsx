import { Arrow, ArrowDefs, Box, Caption, Frame } from "./primitives";

/** La brecha estructural entre lo dicho y lo escuchado. */
export default function DiagramEscucha() {
  return (
    <Frame label="La brecha entre lo dicho y lo escuchado" viewBox="0 0 560 260">
      <ArrowDefs id="escu-a" />
      <Box x={25} y={70} w={185} h={64} label="Lo que digo" sub="orador: mi inquietud" />
      <Box x={350} y={70} w={185} h={64} label="Lo que escucho" sub="oyente: oigo + interpreto" accent />
      <Arrow
        d="M212 102 L 348 102"
        markerId="escu-a"
        dashed
        label="la brecha estructural"
        lx={280}
        ly={90}
      />
      <Box x={350} y={180} w={185} h={48} label="Mi filtro" sub="historia, juicios, inquietudes" />
      <Arrow d="M442 178 L 442 138" markerId="escu-a" muted />
      <Caption x={280} y={245} text="Escuchar = oír + interpretar · la brecha no se elimina: se verifica" />
    </Frame>
  );
}
