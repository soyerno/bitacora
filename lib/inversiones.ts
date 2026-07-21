/**
 * Datos de la herramienta de inversiones (/inversiones): contenido educativo,
 * clases de activos con supuestos ilustrativos, perfiles de riesgo, quiz y
 * checklist de broker. Todo es material educativo — NO asesoramiento financiero.
 */

export interface AssetClass {
  id: string;
  nombre: string;
  descripcion: string;
  /** Retorno anual esperado ilustrativo (% nominal). */
  retorno: number;
  /** Volatilidad anual aproximada (% desvío estándar). */
  volatilidad: number;
  /** CSS var de la paleta de data-viz (validada CVD claro/oscuro). */
  colorVar: string;
}

/** El orden del array define slots adyacentes en la barra apilada (validados). */
export const ASSET_CLASSES: AssetClass[] = [
  {
    id: "efectivo",
    nombre: "Efectivo / money market",
    descripcion: "Cuentas remuneradas, FCI de liquidez. Bajo retorno, disponible ya.",
    retorno: 3.5,
    volatilidad: 1,
    colorVar: "--viz-1",
  },
  {
    id: "bonos",
    nombre: "Bonos / renta fija",
    descripcion: "Deuda soberana y corporativa. Flujo predecible, riesgo medio-bajo.",
    retorno: 5,
    volatilidad: 7,
    colorVar: "--viz-2",
  },
  {
    id: "acciones-int",
    nombre: "Acciones globales (ETFs)",
    descripcion: "Índices diversificados tipo S&P 500 o mundo. Motor de largo plazo.",
    retorno: 8,
    volatilidad: 16,
    colorVar: "--viz-3",
  },
  {
    id: "acciones-loc",
    nombre: "Acciones locales / CEDEARs",
    descripcion: "Empresas puntuales o mercado local. Más retorno potencial, más ruido.",
    retorno: 10,
    volatilidad: 30,
    colorVar: "--viz-4",
  },
  {
    id: "inmuebles",
    nombre: "Inmobiliario (REITs / FCI)",
    descripcion: "Real estate vía instrumentos líquidos. Renta + apreciación.",
    retorno: 7,
    volatilidad: 15,
    colorVar: "--viz-5",
  },
  {
    id: "cripto",
    nombre: "Cripto",
    descripcion: "Activo especulativo de altísima volatilidad. Solo plata que podés perder.",
    retorno: 15,
    volatilidad: 60,
    colorVar: "--viz-6",
  },
];

export type PerfilId = "conservador" | "moderado" | "agresivo";

export interface PerfilRiesgo {
  id: PerfilId;
  nombre: string;
  descripcion: string;
  /** assetId → % (suma 100). */
  asignacion: Record<string, number>;
}

export const PERFILES: PerfilRiesgo[] = [
  {
    id: "conservador",
    nombre: "Conservador",
    descripcion:
      "Priorizás no perder sobre ganar. Horizonte corto o poca tolerancia a ver la cartera en rojo: mayoría de renta fija y liquidez.",
    asignacion: {
      efectivo: 20,
      bonos: 50,
      "acciones-int": 15,
      "acciones-loc": 5,
      inmuebles: 10,
      cripto: 0,
    },
  },
  {
    id: "moderado",
    nombre: "Moderado",
    descripcion:
      "Equilibrio: aceptás caídas transitorias a cambio de crecimiento real. Mitad crecimiento, mitad estabilidad.",
    asignacion: {
      efectivo: 10,
      bonos: 30,
      "acciones-int": 30,
      "acciones-loc": 10,
      inmuebles: 15,
      cripto: 5,
    },
  },
  {
    id: "agresivo",
    nombre: "Agresivo",
    descripcion:
      "Horizonte largo y estómago para la volatilidad. Mayoría en renta variable; la renta fija es solo amortiguador.",
    asignacion: {
      efectivo: 5,
      bonos: 15,
      "acciones-int": 40,
      "acciones-loc": 15,
      inmuebles: 15,
      cripto: 10,
    },
  },
];

export interface QuizPregunta {
  pregunta: string;
  opciones: { texto: string; puntos: number }[];
}

export const QUIZ: QuizPregunta[] = [
  {
    pregunta: "¿Cuándo vas a necesitar esta plata?",
    opciones: [
      { texto: "En menos de 2 años", puntos: 1 },
      { texto: "Entre 2 y 5 años", puntos: 2 },
      { texto: "En más de 5 años", puntos: 3 },
    ],
  },
  {
    pregunta: "Tu cartera cae 20% en un mes. ¿Qué hacés?",
    opciones: [
      { texto: "Vendo todo antes de que siga bajando", puntos: 1 },
      { texto: "No toco nada y espero que se recupere", puntos: 2 },
      { texto: "Aprovecho a comprar más barato", puntos: 3 },
    ],
  },
  {
    pregunta: "¿Cuánta experiencia tenés invirtiendo?",
    opciones: [
      { texto: "Ninguna, arranco de cero", puntos: 1 },
      { texto: "Plazo fijo, FCI o dólar — nada bursátil", puntos: 2 },
      { texto: "Ya operé acciones, bonos o ETFs", puntos: 3 },
    ],
  },
  {
    pregunta: "¿Tenés fondo de emergencia (3–6 meses de gastos)?",
    opciones: [
      { texto: "No, invertiría todo lo que tengo", puntos: 1 },
      { texto: "Tengo algo, pero no llega a 3 meses", puntos: 2 },
      { texto: "Sí, cubierto y aparte de lo que invierto", puntos: 3 },
    ],
  },
  {
    pregunta: "¿Cuál es tu objetivo principal?",
    opciones: [
      { texto: "Preservar: que la inflación no me licúe", puntos: 1 },
      { texto: "Crecer de a poco sin sobresaltos", puntos: 2 },
      { texto: "Maximizar el capital a largo plazo", puntos: 3 },
    ],
  },
];

/** Score total del quiz (5–15) → perfil. */
export function perfilPorScore(score: number): PerfilRiesgo {
  if (score <= 8) return PERFILES[0];
  if (score <= 12) return PERFILES[1];
  return PERFILES[2];
}

export interface ChecklistGrupo {
  grupo: string;
  items: { id: string; texto: string }[];
}

export const BROKER_CHECKLIST: ChecklistGrupo[] = [
  {
    grupo: "Regulación y seguridad",
    items: [
      { id: "reg-cnv", texto: "Está regulado (ALyC registrada en CNV, o SEC/FINRA si es del exterior)" },
      { id: "reg-custodia", texto: "La custodia está segregada (Caja de Valores / SIPC): tus activos no son del broker" },
      { id: "reg-2fa", texto: "Ofrece segundo factor de autenticación (2FA) y avisos de operaciones" },
      { id: "reg-historial", texto: "Tiene años de historial y reputación verificable (no promesas de retorno garantizado)" },
    ],
  },
  {
    grupo: "Costos",
    items: [
      { id: "cost-operar", texto: "Conocés la comisión por compra/venta de cada instrumento" },
      { id: "cost-mant", texto: "Sabés si cobra mantenimiento de cuenta o inactividad" },
      { id: "cost-retiro", texto: "Sabés cuánto cuesta depositar, retirar y convertir moneda" },
      { id: "cost-spread", texto: "Comparaste precios de compra/venta con otro broker (spread oculto)" },
    ],
  },
  {
    grupo: "Productos y mercados",
    items: [
      { id: "prod-clases", texto: "Ofrece las clases de activos que buscás (bonos, ETFs, CEDEARs, FCI…)" },
      { id: "prod-moneda", texto: "Permite operar en las monedas que necesitás (pesos y dólares)" },
      { id: "prod-fci", texto: "Tiene FCI o money market para la liquidez que no está invertida" },
    ],
  },
  {
    grupo: "Operativa y soporte",
    items: [
      { id: "op-apertura", texto: "La apertura de cuenta es 100% online y sin costo" },
      { id: "op-app", texto: "Probaste la app/plataforma y entendés cómo se opera" },
      { id: "op-plazos", texto: "Conocés los plazos de acreditación de depósitos y retiros" },
      { id: "op-soporte", texto: "Tiene canal de soporte que responde (probalo antes de transferir)" },
    ],
  },
  {
    grupo: "Impuestos y reportes",
    items: [
      { id: "imp-resumen", texto: "Entrega resumen anual de tenencias y resultados para tus impuestos" },
      { id: "imp-retenciones", texto: "Sabés qué retenciones aplica y qué te toca declarar a vos" },
    ],
  },
];

export interface Modulo {
  id: string;
  titulo: string;
  intro: string;
  puntos: string[];
}

export const MODULOS: Modulo[] = [
  {
    id: "base",
    titulo: "1 · Antes de invertir: la base",
    intro:
      "Invertir es el último paso, no el primero. Sin esta base, cualquier caída del mercado te obliga a vender en el peor momento.",
    puntos: [
      "Armá un fondo de emergencia de 3–6 meses de gastos en algo líquido (money market, cuenta remunerada) antes de invertir un peso.",
      "Cancelá primero las deudas caras (tarjeta, préstamos personales): ningún activo rinde consistentemente más que esos intereses.",
      "Definí objetivo y horizonte: no es lo mismo el anticipo de un depto en 3 años que la jubilación en 30. El horizonte determina cuánto riesgo podés tomar.",
      "Riesgo y retorno van juntos: si algo promete mucho retorno sin riesgo, es una estafa. La pregunta correcta es cuánta caída tolerás sin vender.",
      "El interés compuesto necesita tiempo: empezar hoy con poco le gana a empezar en 5 años con mucho. La inflación es interés compuesto en contra.",
    ],
  },
  {
    id: "diversificar",
    titulo: "2 · Diversificar: no todo en la misma canasta",
    intro:
      "Diversificar no es tener 10 acciones tech: es combinar activos que no se mueven juntos, para que ninguna crisis puntual te hunda la cartera.",
    puntos: [
      "Diversificá por clase de activo: efectivo, bonos, acciones, inmobiliario. Cuando las acciones caen, los bonos suelen amortiguar.",
      "Diversificá por geografía y moneda: no dependas solo de la economía y la moneda de tu país.",
      "Los ETFs de índice son diversificación instantánea: un solo instrumento con cientos de empresas y comisiones bajas.",
      "Diversificá en el tiempo (DCA): aportá un monto fijo todos los meses en vez de todo de golpe — comprás más caro y más barato, promediando el precio.",
      "Regla práctica: lo que necesitás en menos de 2 años no va a renta variable; lo que no tocás por más de 10 puede ir mayormente a acciones.",
    ],
  },
  {
    id: "broker",
    titulo: "3 · Cómo elegir y contratar un broker",
    intro:
      "El broker es el intermediario regulado que ejecuta tus órdenes y custodia tus activos. Elegirlo bien es una decisión de seguridad primero y de costos después.",
    puntos: [
      "Verificá la regulación: en Argentina debe ser una ALyC registrada ante la CNV (podés buscarla en el sitio de la CNV); en EE.UU., estar registrado en SEC/FINRA con seguro SIPC.",
      "Tus activos deben estar custodiados a tu nombre en una entidad separada (Caja de Valores): si el broker quiebra, tus títulos siguen siendo tuyos.",
      "Compará comisiones totales: apertura, compra/venta, mantenimiento, retiros y conversión de moneda. Comisiones bajas componen a tu favor durante décadas.",
      "El proceso típico: elegís broker → apertura online con DNI y validación → transferís fondos desde una cuenta a tu nombre → comprás tu primer instrumento. Suele demorar 1–2 días.",
      "Empezá con un monto chico para probar todo el ciclo (depositar, comprar, vender, retirar) antes de mover capital en serio.",
      "Usá la checklist interactiva de abajo para comparar candidatos punto por punto.",
    ],
  },
  {
    id: "mantener",
    titulo: "4 · Mantener la inversión en el tiempo",
    intro:
      "La rentabilidad de largo plazo se define menos por qué comprás y más por cómo te comportás: aportar siempre, rebalancear a veces, vender casi nunca.",
    puntos: [
      "Automatizá aportes periódicos: un monto fijo por mes, idealmente el mismo día que cobrás. La constancia le gana al timing.",
      "Rebalanceá una vez al año (o cuando una clase se desvía más de 5 puntos de su objetivo): vendé lo que subió de más y comprá lo que quedó atrás. Es comprar barato y vender caro con reglas.",
      "No mires la cartera todos los días: la volatilidad diaria es ruido. Una revisión mensual o trimestral alcanza.",
      "Vendé por razones de tesis (cambió tu horizonte, el activo dejó de cumplir su rol), nunca por pánico de una caída.",
      "A medida que se acerca tu objetivo, bajá el riesgo gradualmente: rotá de acciones hacia bonos y liquidez.",
    ],
  },
  {
    id: "errores",
    titulo: "5 · Errores comunes (y caros)",
    intro:
      "Casi todos los errores de inversión son de comportamiento, no de análisis. Reconocerlos de antemano es la mejor defensa.",
    puntos: [
      "Intentar adivinar el mercado: los mejores días suelen venir pegados a los peores; estar afuera esos días destruye el retorno de décadas.",
      "Comprar por FOMO lo que ya subió 300% y está en todos lados: a esa altura, el que entra tarde es la liquidez del que sale.",
      "Concentrar todo en un solo activo, empresa o moneda — incluida la propia.",
      "Usar apalancamiento (deuda para invertir) sin entender que multiplica pérdidas igual que ganancias.",
      "Ignorar comisiones e impuestos: 2% anual de costos se come ~40% del capital final en 30 años.",
      "Vender en pánico en la caída y volver a comprar cuando 'se calmó' (más caro): es la forma más eficiente de perder plata que existe.",
    ],
  },
];
