import { Arrow, ArrowDefs, Box, Caption, Frame } from "./primitives";

/** Modelo Observador → Acción → Resultados, con los dos loops de aprendizaje. */
export default function DiagramOAR() {
  return (
    <Frame label="Modelo observador, acción, resultados" viewBox="0 0 560 250">
      <ArrowDefs id="oar-a" />
      <Box x={20} y={60} w={155} h={60} label="Observador" sub="lo que distingo e interpreto" accent />
      <Box x={205} y={60} w={150} h={60} label="Acción" sub="lo que hago" />
      <Box x={385} y={60} w={155} h={60} label="Resultados" sub="lo que obtengo" />
      <Arrow d="M175 90 L 203 90" markerId="oar-a" />
      <Arrow d="M355 90 L 383 90" markerId="oar-a" />
      <Arrow
        d="M462 122 C 462 170, 280 170, 280 124"
        markerId="oar-a"
        label="1er orden: cambio la acción"
        lx={372}
        ly={178}
        muted
      />
      <Arrow
        d="M492 122 C 492 218, 97 218, 97 124"
        markerId="oar-a"
        label="2º orden: cambio el observador"
        lx={295}
        ly={226}
      />
      <Caption x={280} y={30} text="Si repetir «más de lo mismo» no alcanza, el loop que falta es el de abajo" />
    </Frame>
  );
}
