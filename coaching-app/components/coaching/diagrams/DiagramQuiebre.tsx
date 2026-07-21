import { Arrow, ArrowDefs, Box, Caption, Frame } from "./primitives";

/** Del fluir transparente al quiebre, y las dos salidas posibles. */
export default function DiagramQuiebre() {
  return (
    <Frame label="Transparencia, quiebre y sus dos salidas" viewBox="0 0 560 280">
      <ArrowDefs id="qui-a" />
      <Box x={30} y={40} w={175} h={60} label="Transparencia" sub="fluyo sin deliberar" />
      <Box x={330} y={40} w={175} h={60} label="Quiebre" sub="algo interrumpe lo que me importa" accent />
      <Arrow d="M207 70 L 328 70" markerId="qui-a" label="lo declaro yo" lx={268} ly={58} />
      <Arrow d="M375 102 C 300 150, 200 160, 165 188" markerId="qui-a" dashed muted />
      <Arrow d="M440 102 L 440 186" markerId="qui-a" />
      <Box x={45} y={190} w={215} h={62} label="Queja crónica" sub="juicios sin destinatario · nada cambia" />
      <Box x={320} y={190} w={215} h={62} label="Conversaciones que mueven" sub="pedidos, reclamos, declaraciones" accent />
      <Caption x={280} y={272} text="El quiebre no elige la salida: la elegís vos" />
    </Frame>
  );
}
