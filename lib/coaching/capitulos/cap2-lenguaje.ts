import type { Chapter } from "../types";

/**
 * Capítulo 2 — El lenguaje crea realidad.
 * Actos lingüísticos I: lenguaje generativo, afirmaciones y declaraciones.
 */
export const cap2: Chapter = {
  slug: "lenguaje-generativo",
  title: "El lenguaje crea realidad",
  subtitle: "Afirmaciones y declaraciones",
  description:
    "Hablar no es solo describir el mundo: es actuar sobre él. La diferencia entre afirmaciones (la palabra sigue al mundo) y declaraciones (el mundo sigue a la palabra), y por qué confundirlas sale caro.",
  icon: "🗣️",
  readings: [
    {
      title: "Ontología del Lenguaje",
      author: "Rafael Echeverría",
      note: "Los capítulos sobre actos lingüísticos: afirmaciones, declaraciones y las declaraciones fundamentales de la vida.",
    },
    {
      title: "Cómo hacer cosas con palabras",
      author: "J. L. Austin",
      note: "El origen filosófico de todo: las conferencias donde Austin descubre que hablar es actuar. Corto y sorprendentemente legible.",
    },
    {
      title: "Actos de habla",
      author: "John Searle",
      note: "La sistematización de la teoría de Austin. Para quien quiera el rigor filosófico detrás del mapa de actos.",
    },
  ],
  lessons: [
    {
      id: "lenguaje-accion",
      title: "El lenguaje como acción",
      description:
        "Del lenguaje descriptivo al lenguaje generativo: cuando decir algo cambia lo que hay.",
      exercises: [
        {
          kind: "concept",
          title: "Hablar es actuar",
          body:
            "Durante siglos pensamos el lenguaje como un espejo: el mundo está ahí, y las palabras lo describen. La filosofía del lenguaje del siglo XX (Austin, Searle) dio vuelta esa idea: hay frases que no describen nada — hacen cosas. «Acepto», «renuncio», «te perdono», «queda inaugurado»: después de dichas, el mundo es otro.\n\nA esas unidades las llamamos actos lingüísticos, y son sorprendentemente pocas: afirmaciones, declaraciones, juicios, y los actos que coordinan acción (pedidos, ofertas, promesas). Todo lo que decís en un día cabe en ese mapa.\n\nAprender a distinguir qué acto estás haciendo — y cuál te está haciendo el otro — es la habilidad base de todo el programa: cada acto compromete algo distinto y se juega con reglas distintas.",
          diagram: "actos",
          example:
            "«Está lloviendo» (afirmación: se verifica mirando). «Declaro el sprint cerrado» (declaración: crea un estado nuevo). «Este sprint fue flojo» (juicio: opinión a fundar). «¿Me pasás el reporte mañana?» (pedido: coordina acción).",
        },
        {
          kind: "choice",
          question:
            "Un juez dice «lo declaro inocente». ¿Qué hizo el lenguaje en ese momento?",
          options: [
            "Describió un estado mental del juez",
            "Informó algo que ya era verdad antes de decirlo",
            "Generó una realidad nueva: antes de la frase el acusado no era jurídicamente inocente; después, sí",
            "Nada: las palabras no cambian los hechos",
          ],
          correct: 2,
          explain:
            "Ese es el lenguaje generativo en estado puro. La frase no reporta el mundo: lo transforma. Lo mismo pasa con «acepto» en un casamiento, «renuncio» en un trabajo o «quedás contratado» en una entrevista.",
        },
        {
          kind: "classify",
          prompt: "¿La frase describe el mundo o lo transforma? Clasificá.",
          categories: ["Describe (reporta lo que hay)", "Genera (crea algo nuevo)"],
          items: [
            { text: "«Ayer llovió 30 mm en Buenos Aires»", cat: 0 },
            { text: "«Te pido perdón»", cat: 1 },
            { text: "«La reunión terminó a las 16:05»", cat: 0 },
            { text: "«A partir de hoy, este proyecto se llama Atlas»", cat: 1 },
            { text: "«Renuncio»", cat: 1 },
            { text: "«El servidor devolvió un error 500»", cat: 0 },
          ],
          explain:
            "Pedir perdón, bautizar un proyecto o renunciar no informan nada preexistente: crean una relación nueva, un nombre nuevo, un vínculo laboral terminado. Las otras tres reportan hechos que existían antes de ser dichos.",
        },
        {
          kind: "truefalse",
          statement:
            "Según la ontología del lenguaje, escuchar a alguien decir «no puedo» repetidamente no tiene efecto sobre lo que esa persona puede hacer.",
          correct: false,
          explain:
            "Lo que decimos —incluso a nosotros mismos— configura lo posible. Quien vive declarando «no puedo» no está describiendo su capacidad: la está fabricando. Por eso el coaching escucha con tanto cuidado las frases que alguien repite.",
        },
        {
          kind: "match",
          prompt: "Uní cada acto lingüístico básico con su definición.",
          pairs: [
            { left: "Afirmación", right: "Compromiso con la verdad: puede verificarse como verdadera o falsa" },
            { left: "Declaración", right: "Genera una realidad nueva; vale según la autoridad de quien la hace" },
            { left: "Juicio", right: "Opinión o interpretación; no es verdadero/falso sino fundado/infundado" },
            { left: "Pedido / oferta / promesa", right: "Actos que coordinan acciones futuras entre personas" },
          ],
          explain:
            "Este es el mapa de los próximos capítulos. Cada acto compromete algo distinto: la afirmación, con la evidencia; la declaración, con la validez; el juicio, con los fundamentos; la promesa, con el cumplimiento.",
        },
        {
          kind: "reflect",
          prompt:
            "Anotá tres frases que hayas dicho hoy (o esta semana) en conversaciones de trabajo o de casa. Cualquiera que recuerdes.",
          placeholder: "1. … 2. … 3. …",
          insight:
            "Miralas de nuevo: ¿cuáles describen hechos y cuáles hicieron algo — comprometieron, juzgaron, pidieron, cerraron una posibilidad? La mayoría de nuestro hablar cotidiano es acción disfrazada de descripción. Empezar a verlo es empezar a elegir qué hacés cuando hablás.",
        },
      ],
    },
    {
      id: "afirmaciones",
      title: "Afirmaciones: el mundo manda",
      description:
        "Afirmaciones verdaderas y falsas, el testigo compartido, y por qué «llegó 20 minutos tarde» no es lo mismo que «es un irresponsable».",
      exercises: [
        {
          kind: "concept",
          title: "Afirmaciones: la palabra sigue al mundo",
          body:
            "Una afirmación es una descripción que se compromete con la evidencia: «llovió 30 mm», «el deploy falló a las 3:14», «el informe tiene 12 páginas». Su prueba de fuego: cualquier observador con las mismas distinciones podría verificarla. Si no hay forma posible de constatarla, no es una afirmación — es otra cosa disfrazada.\n\nLas afirmaciones pueden ser verdaderas o falsas (una afirmación falsa sigue siendo una afirmación: se comprometió con la evidencia y perdió). Lo que no pueden ser es opiniones: «el informe es aburrido» no se verifica con ningún instrumento — eso es un juicio, y lo tratamos en el próximo capítulo.\n\n¿Por qué importa tanto la distinción? Porque los conflictos se desactivan de manera muy distinta: sobre afirmaciones se discute con datos; sobre juicios, con fundamentos. Mezclarlos es la receta del diálogo de sordos.",
          example:
            "«Juan llegó 9:40 a la reunión de 9:00» → afirmación (el calendario y los presentes la verifican). «Juan es un irresponsable» → juicio montado sobre esa afirmación. La primera se constata; el segundo se debe fundar.",
        },
        {
          kind: "choice",
          question: "¿Qué hace que una frase sea una afirmación (y no otra cosa)?",
          options: [
            "Que la diga alguien con autoridad",
            "Que pueda verificarse con evidencia: una comunidad con las mismas distinciones puede constatarla",
            "Que suene objetiva y seria",
            "Que la mayoría esté de acuerdo con ella",
          ],
          correct: 1,
          explain:
            "La afirmación se compromete con la evidencia: «llovió», «el deploy falló a las 3:14», «facturamos $2M». Cualquier observador con las distinciones necesarias puede confirmarla o refutarla. Si no hay forma posible de verificar, no es una afirmación.",
        },
        {
          kind: "classify",
          prompt: "¿Afirmación (verificable) o no? Clasificá cada frase.",
          categories: ["Afirmación verificable", "No es afirmación"],
          items: [
            { text: "«El informe tiene 12 páginas»", cat: 0 },
            { text: "«El informe es aburrido»", cat: 1 },
            { text: "«Juan llegó a las 9:40 a una reunión pautada a las 9:00»", cat: 0 },
            { text: "«Juan no se toma en serio el trabajo»", cat: 1 },
            { text: "«El equipo cerró 8 tickets esta semana»", cat: 0 },
            { text: "«El equipo podría dar mucho más»", cat: 1 },
          ],
          explain:
            "Páginas, horarios y tickets se constatan. «Aburrido», «no se lo toma en serio» y «podría dar más» son interpretaciones del observador — pueden ser valiosas, pero son otro acto lingüístico (juicios) y se tratan distinto.",
        },
        {
          kind: "truefalse",
          statement: "Una afirmación puede ser falsa y aun así seguir siendo una afirmación.",
          correct: true,
          explain:
            "«Buenos Aires es la capital de Brasil» es una afirmación: se compromete con la evidencia… y la evidencia la refuta. Falsa, pero afirmación al fin. Lo que define al acto no es acertar, es ser verificable.",
        },
        {
          kind: "choice",
          question:
            "En una retro alguien dice: «el sistema estuvo caído toda la semana». Revisan los dashboards: hubo 2 incidentes de 40 minutos. ¿Qué pasó ahí?",
          options: [
            "Nada: son formas distintas de decir lo mismo",
            "Se presentó como afirmación algo que era una exageración; al verificar contra evidencia, la afirmación resultó falsa",
            "Los dashboards están necesariamente equivocados",
            "La persona mintió a propósito",
          ],
          correct: 1,
          explain:
            "No hace falta suponer mala fe: bajo frustración, convertimos vivencias en «hechos» inflados. El valor de la distinción es práctico: ante una afirmación fuerte, pedir la evidencia. «Toda la semana» y «80 minutos» habilitan conversaciones muy distintas.",
        },
        {
          kind: "truefalse",
          statement:
            "Decir «esto es así y punto» sobre una interpretación propia es tratar un juicio como si fuera una afirmación.",
          correct: true,
          explain:
            "Es la confusión más cara de la vida cotidiana: vivir opiniones propias como hechos del mundo. Quien la comete no negocia sus interpretaciones — las defiende como defendería que el agua moja. La distinción afirmación/juicio devuelve la conversación a un lugar tratable.",
        },
        {
          kind: "reflect",
          prompt:
            "Escribí una queja que tengas sobre alguien (jefe, colega, familiar). Tal cual la dirías.",
          placeholder: "Ej.: «nunca me escucha», «siempre llega tarde», «no le importa el proyecto»",
          insight:
            "Ahora separá: ¿qué hechos verificables hay debajo de tu queja (fechas, conductas concretas, frases dichas)? ¿Y cuánto es interpretación tuya montada sobre esos hechos? Los «nunca» y «siempre» casi nunca sobreviven a este ejercicio. La queja formulada como hechos + interpretación propia se puede conversar; formulada como «verdad», solo se puede pelear.",
        },
      ],
    },
    {
      id: "declaraciones",
      title: "Declaraciones: la palabra funda mundos",
      description:
        "Las declaraciones que cambian una vida: sí, no, no sé, perdón, gracias, te quiero — y la autoridad que las hace válidas.",
      exercises: [
        {
          kind: "concept",
          title: "Declaraciones: el mundo sigue a la palabra",
          body:
            "En la declaración, la relación palabra-mundo se invierte: no describís lo que hay — generás algo que antes no había. «Lo declaro inocente», «acepto», «renuncio», «este proyecto se llama Atlas». Un instante antes, ese mundo no existía; un instante después, sí.\n\nPor eso las declaraciones no son verdaderas ni falsas: son válidas o inválidas, según la autoridad de quien declara. El juez puede declarar inocencia; el público de la tribuna, no. Y hay un dominio donde tu autoridad es total: tu propia vida. «Basta», «merezco otra cosa», «empiezo de nuevo» — nadie puede hacer esas declaraciones por vos, y nada externo obliga a hacerlas.\n\nEcheverría destaca cinco declaraciones que sostienen una vida: el «no» (funda tu dignidad), el «no sé» (abre el aprendizaje), el «perdón» (libera del pasado), el «gracias» (construye el vínculo) y el «te quiero» (funda la relación). Buena parte del sufrimiento humano vive en alguna de estas cinco, pendiente de ser dicha.",
          example:
            "Renunciar a un trabajo: durante meses «no da más» como queja interna (nada cambia). El día que dice «renuncio» ante su jefe — dos palabras, autoridad propia — el mundo es literalmente otro.",
        },
        {
          kind: "choice",
          question:
            "¿Qué determina que una declaración sea válida?",
          options: [
            "Que sea verdadera",
            "Que la autoridad o el poder de quien la hace alcance para generar lo declarado",
            "Que esté escrita y firmada",
            "Que nadie se oponga",
          ],
          correct: 1,
          explain:
            "Las declaraciones no son verdaderas o falsas: son válidas o inválidas según la autoridad de quien declara. Si el juez declara inocencia, vale; si lo declaro yo desde la tribuna, no. Hay declaraciones que solo requieren la autoridad sobre la propia vida: «renuncio», «te perdono», «basta».",
        },
        {
          kind: "match",
          prompt: "Uní cada declaración fundamental con lo que abre o cierra.",
          pairs: [
            { left: "«No»", right: "Funda mi dignidad: marca el límite de lo que estoy dispuesto a aceptar" },
            { left: "«No sé»", right: "Abre la puerta del aprendizaje" },
            { left: "«Perdón» / «te perdono»", right: "Libera del resentimiento y reabre la relación hacia el futuro" },
            { left: "«Gracias»", right: "Reconoce al otro y celebra lo recibido; construye el vínculo" },
            { left: "«Te quiero»", right: "Funda y sostiene la relación; sin decirse, la relación se seca" },
          ],
          explain:
            "Echeverría las llama declaraciones fundamentales de la vida. No informan estados internos: constituyen relaciones y posibilidades. Una vida entera cambia de forma según cuáles de estas se declaran y cuáles se callan.",
        },
        {
          kind: "truefalse",
          statement:
            "Declarar «te perdono» significa afirmar que lo que pasó estuvo bien o que ya no duele.",
          correct: false,
          explain:
            "Perdonar no reescribe el pasado ni niega el daño: es una declaración sobre el futuro. Declara que suelto el resentimiento como organizador de mi relación con el otro (o conmigo). El hecho queda; lo que cambia es qué hago yo con él de acá en adelante.",
        },
        {
          kind: "choice",
          question:
            "Alguien está hace años en un trabajo que lo hace mal, esperando «que las cosas mejoren». Desde las declaraciones, ¿qué le falta a esta situación?",
          options: [
            "Más paciencia",
            "Una declaración pendiente: nadie dijo todavía «basta» o «esto no lo acepto más» — y sin esa declaración no se abre ningún camino nuevo",
            "Un aumento de sueldo",
            "Que otra persona decida por él",
          ],
          correct: 1,
          explain:
            "Los cambios grandes de una vida empiezan casi siempre con una declaración de quiebre: «basta», «esto no va más», «merezco otra cosa». Nada externo obliga a hacerla; por eso hay vidas enteras en suspenso esperando que el mundo la haga por uno.",
        },
        {
          kind: "classify",
          prompt: "¿Afirmación o declaración? Última pasada de la distinción clave.",
          categories: ["Afirmación", "Declaración"],
          items: [
            { text: "«La daily de hoy duró 22 minutos»", cat: 0 },
            { text: "«Queda inaugurado el ciclo 2026»", cat: 1 },
            { text: "«Decidí mudarme a Córdoba»", cat: 1 },
            { text: "«El branch tiene 3 commits»", cat: 0 },
            { text: "«Desde hoy, las demos son los jueves»", cat: 1 },
          ],
          explain:
            "Truco práctico: en la afirmación, la palabra se ajusta al mundo (podés chequearla). En la declaración, el mundo se ajusta a la palabra (después de dicha, hay algo nuevo: un ciclo abierto, una decisión tomada, una regla vigente).",
        },
        {
          kind: "reflect",
          prompt:
            "De las cinco declaraciones fundamentales (no / no sé / perdón / gracias / te quiero), ¿cuál es la que más te cuesta decir? ¿A quién se la debés?",
          placeholder: "Me cuesta decir… / La tengo pendiente con…",
          insight:
            "Una declaración pendiente no es neutra: organiza silenciosamente la relación donde falta. El «no» que no decís te tiene sobrecargado; el «gracias» que no decís empobrece un vínculo que lo merece; el «perdón» que no decís mantiene una cuenta abierta. No hace falta decirla hoy — pero ya sabés que está ahí, y eso cambia al observador.",
        },
      ],
    },
  ],
};
