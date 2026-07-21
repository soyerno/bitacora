import { Arrow, ArrowDefs, Box, Frame } from "./primitives";

/** El loop de autoconfirmación de una creencia. */
export default function DiagramLoopCreencia() {
  return (
    <Frame label="El loop que autoconfirma una creencia" viewBox="0 0 560 300">
      <ArrowDefs id="cre-a" />
      <Box x={45} y={30} w={205} h={62} label="Creencia" sub="«esto no se puede / yo no soy…»" accent />
      <Box x={310} y={30} w={205} h={62} label="Filtro" sub="solo veo lo que la confirma" />
      <Box x={310} y={195} w={205} h={62} label="Acción" sub="ni lo intento (o lo saboteo)" />
      <Box x={45} y={195} w={205} h={62} label="Resultado" sub="no pasa nada nuevo" />
      <Arrow d="M252 61 L 308 61" markerId="cre-a" />
      <Arrow d="M412 94 L 412 193" markerId="cre-a" />
      <Arrow d="M308 226 L 252 226" markerId="cre-a" />
      <Arrow d="M147 193 L 147 94" markerId="cre-a" label="«¿viste? tenía razón»" lx={147} ly={150} />
      <text x={280} y={148} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--muted)">
        la creencia fabrica su propia evidencia
      </text>
    </Frame>
  );
}
