import { Box, Caption, Frame } from "./primitives";

/** Grilla de estados de ánimo básicos: facticidad × posibilidad. */
export default function DiagramGrilla() {
  return (
    <Frame label="Grilla de los cuatro estados de ánimo" viewBox="0 0 560 290">
      <text x={225} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
        Facticidad
      </text>
      <text x={225} y={55} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
        lo que no puedo cambiar
      </text>
      <text x={440} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
        Posibilidad
      </text>
      <text x={440} y={55} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
        lo que sí podría cambiar
      </text>
      <text x={60} y={105} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--muted)">
        Me cierro
      </text>
      <text x={60} y={200} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--muted)">
        Me abro
      </text>
      <Box x={120} y={70} w={210} h={70} label="Resentimiento" sub="«esto no debería haber pasado»" />
      <Box x={335} y={70} w={210} h={70} label="Resignación" sub="«para qué, nada va a cambiar»" />
      <Box x={120} y={165} w={210} h={70} label="Aceptación / paz" sub="«pasó; elijo cerrarlo»" accent />
      <Box x={335} y={165} w={210} h={70} label="Ambición" sub="«acá veo espacio para actuar»" accent />
      <Caption x={330} y={272} text="Los cuatro son juicios — por eso se pueden examinar y trabajar" />
    </Frame>
  );
}
