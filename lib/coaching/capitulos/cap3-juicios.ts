import type { Chapter } from "../types";

/**
 * Capítulo 3 — Juicios: la opinión que te tiene.
 * Distinguir juicios de afirmaciones, fundarlos con rigor y detectar los
 * juicios maestros que gobiernan la identidad.
 */
export const cap3: Chapter = {
  slug: "juicios",
  title: "Juicios: la opinión que te tiene",
  subtitle: "Fundar en vez de sentenciar",
  description:
    "Los juicios no describen el mundo: te describen a vos. Cómo distinguirlos de los hechos, cómo fundarlos para que sirvan, y qué hacer con los juicios que tenés sobre vos mismo.",
  icon: "⚖️",
  lessons: [
    {
      id: "juicio-vs-hecho",
      title: "El juicio no vive en el mundo",
      description:
        "«Es un desastre» dice menos del otro que de quien lo dice: el juicio habla del observador.",
      exercises: [
        {
          kind: "choice",
          question: "«María es impuntual». ¿Qué es esta frase?",
          options: [
            "Una afirmación: o es verdad o es mentira",
            "Un juicio: una interpretación del observador a partir de ciertos hechos, que podría ser fundada o infundada",
            "Una declaración inválida",
            "Un hecho científico",
          ],
          correct: 1,
          explain:
            "Los hechos serían: «María llegó 15 minutos tarde el lunes y 20 el jueves». «Es impuntual» es una generalización que hace el observador — otro observador, con otros estándares, podría no hacerla. El juicio puede ser útil, pero es tuyo, no del mundo.",
        },
        {
          kind: "classify",
          prompt: "¿Hecho (afirmación) o juicio? La distinción madre del coaching.",
          categories: ["Hecho", "Juicio"],
          items: [
            { text: "«El PR estuvo 6 días sin review»", cat: 0 },
            { text: "«En este equipo nadie colabora»", cat: 1 },
            { text: "«Presentó el informe con 3 cifras erróneas»", cat: 0 },
            { text: "«Es un descuidado»", cat: 1 },
            { text: "«Me respondió el mail en 10 minutos»", cat: 0 },
            { text: "«Es la persona más comprometida del equipo»", cat: 1 },
          ],
          explain:
            "Ojo: los juicios positivos también son juicios. «La más comprometida» es tan interpretación como «descuidado». El problema no es tener juicios (son inevitables y necesarios) sino no distinguirlos de los hechos.",
        },
        {
          kind: "truefalse",
          statement: "Vivir sin emitir juicios es posible y deseable.",
          correct: false,
          explain:
            "Imposible y además indeseable: los juicios orientan la acción («este puente es seguro», «esta persona es confiable») y sin ellos no podríamos decidir nada. El objetivo no es eliminarlos: es saber que son juicios, tenerlos fundados y revisarlos cuando la evidencia cambia.",
        },
        {
          kind: "choice",
          question:
            "¿Por qué se dice que el juicio habla más del observador que de lo observado?",
          options: [
            "Porque los observadores siempre mienten",
            "Porque el juicio revela los estándares, la historia y las inquietudes de quien juzga: frente a los mismos hechos, otro observador juzga distinto",
            "Porque lo observado no existe",
            "Porque los juicios son siempre negativos",
          ],
          correct: 1,
          explain:
            "Si digo «este código es un desastre», estoy mostrando mis estándares de calidad, mi historia con el código y qué me importa. Otro dev diría «es razonable para un MVP». Los hechos son compartibles; el juicio lleva mi firma.",
        },
        {
          kind: "truefalse",
          statement:
            "Cuando alguien me critica, la ontología del lenguaje sugiere recordar que recibí un juicio de ese observador — no una verdad sobre mí.",
          correct: true,
          explain:
            "Un juicio ajeno es información sobre cómo me ve ese observador desde sus estándares. Puedo examinarlo: ¿tiene fundamentos? ¿me sirve? ¿le doy autoridad a esta persona en este dominio? Eso es muy distinto de tragarlo como veredicto o rechazarlo sin mirar.",
        },
        {
          kind: "reflect",
          prompt:
            "Escribí un juicio fuerte que tengas sobre alguien de tu entorno (positivo o negativo). Después anotá: ¿qué hechos concretos lo sostienen?",
          placeholder: "Juicio: «X es …» / Hechos: …",
          insight:
            "¿Costó encontrar hechos? Los juicios suelen vivir sueltos, desconectados de su evidencia, y desde ahí gobiernan cómo tratamos a la gente. Si encontraste 2-3 hechos sólidos, tu juicio está fundado (por ahora, en ese dominio). Si no encontraste casi nada… el juicio te estaba teniendo a vos.",
        },
      ],
    },
    {
      id: "fundar-juicios",
      title: "Fundar un juicio",
      description:
        "Los cinco pasos para que una opinión sea algo más que un prejuicio con buena prensa.",
      exercises: [
        {
          kind: "match",
          prompt: "Uní cada condición para fundar un juicio con su pregunta clave.",
          pairs: [
            { left: "¿Para qué juzgo?", right: "Qué acción futura me importa — el juicio se emite por o para algo" },
            { left: "¿En qué dominio?", right: "Acotar: ¿impuntual en reuniones internas? ¿o «impuntual en la vida»?" },
            { left: "¿Con qué estándares?", right: "Contra qué vara comparo, y si esa vara es compartida" },
            { left: "¿Con qué hechos?", right: "Afirmaciones verificables que sostienen el juicio" },
            { left: "¿Busqué lo contrario?", right: "Intenté fundar el juicio opuesto, para no ver solo lo que confirma el mío" },
          ],
          explain:
            "Un juicio fundado tiene propósito, dominio acotado, estándares explícitos, hechos que lo sostienen y sobrevivió al intento de fundar el juicio contrario. La mayoría de nuestros juicios cotidianos no pasan ni el segundo filtro.",
        },
        {
          kind: "choice",
          question:
            "«Pedro es desorganizado». Para acotarlo a un dominio, ¿cuál de estas versiones es la más rigurosa?",
          options: [
            "«Pedro es desorganizado en todo»",
            "«Pedro es desorganizado, como toda su familia»",
            "«En la gestión de sus branches y PRs de los últimos dos meses, veo a Pedro desorganizado: 4 PRs abandonados y 3 sin descripción»",
            "«Pedro me da la sensación de caos»",
          ],
          correct: 2,
          explain:
            "Dominio acotado (branches y PRs), ventana temporal (dos meses) y hechos (4 y 3). Ese juicio se puede conversar, refutar o usar para pedir un cambio. «Desorganizado en todo» es una sentencia de identidad: no abre ninguna acción, solo condena.",
        },
        {
          kind: "truefalse",
          statement:
            "Si un juicio está bien fundado hoy, queda fundado para siempre.",
          correct: false,
          explain:
            "Los juicios tienen fecha de vencimiento: se fundan en hechos pasados, y los hechos nuevos pueden desmentirlos. «Confiable» se funda entrega a entrega; «impuntual» puede quedar viejo tras seis meses de puntualidad. Revisar juicios ante evidencia nueva es higiene del observador.",
        },
        {
          kind: "classify",
          prompt: "¿Juicio fundado o infundado? Evaluá el proceso, no la conclusión.",
          categories: ["Con señas de estar fundado", "Infundado (por ahora)"],
          items: [
            { text: "«No le confiaría el cliente: en las últimas 3 demos llegó sin preparar el entorno» (busqué contraejemplos: hubo 1 demo impecable)", cat: 0 },
            { text: "«Es mal profesional, se le nota en la cara»", cat: 1 },
            { text: "«Para tareas de urgencia confío en ella: resolvió los últimos 4 incidentes en menos de 1 hora»", cat: 0 },
            { text: "«Este framework es malísimo» (lo usé una vez, media hora, hace 3 años)", cat: 1 },
          ],
          explain:
            "Fundar no garantiza tener razón: garantiza que tu opinión tiene propósito, dominio, hechos y resistió el contraejemplo. «Se le nota en la cara» y «lo usé media hora» son prejuicios haciéndose pasar por evaluaciones.",
        },
        {
          kind: "choice",
          question:
            "¿Cuál es el mayor riesgo práctico de tratar juicios infundados como verdades?",
          options: [
            "Quedar mal en las discusiones",
            "Tomamos decisiones grandes (contratar, despedir, casarnos, pelearnos) sobre interpretaciones que nunca examinamos",
            "Usar demasiadas palabras",
            "No hay riesgo real",
          ],
          correct: 1,
          explain:
            "Los juicios son el software con el que decidimos. Si están infundados y no lo sabemos, decidimos con datos corruptos y encima defendemos esas decisiones con la energía de quien defiende «la verdad». El costo se paga en relaciones, carreras y equipos.",
        },
        {
          kind: "reflect",
          prompt:
            "Tomá una decisión importante que estés por tomar (o que tomaste hace poco). ¿Sobre qué juicios se apoya? Elegí el más importante y pasale los cinco filtros: para qué, dominio, estándares, hechos, contraejemplo.",
          placeholder: "Decisión: … / Juicio clave: … / Filtros: …",
          insight:
            "Si el juicio clave pasó los cinco filtros, tu decisión pisa firme. Si tambaleó en alguno —típicamente en «hechos» o en «busqué lo contrario»— no significa que la decisión esté mal: significa que ahora sabés exactamente qué conversación o qué dato te falta antes de decidir. Eso es un observador más riguroso en acción.",
        },
      ],
    },
    {
      id: "juicios-maestros",
      title: "Juicios maestros e identidad",
      description:
        "Los juicios que tenés sobre vos mismo funcionan como sentencias: el coaching los trata como lo que son — juicios.",
      exercises: [
        {
          kind: "choice",
          question:
            "«No sirvo para hablar en público». Ontológicamente, ¿qué es esta frase?",
          options: [
            "Una afirmación verificable sobre una incapacidad",
            "Un juicio sobre uno mismo que, tratado como verdad, funciona como sentencia: cierra la práctica y el aprendizaje",
            "Una declaración válida de renuncia",
            "Un hecho genético",
          ],
          correct: 1,
          explain:
            "Es un juicio — probablemente fundado en algunas malas experiencias — congelado en identidad. Tratado como hecho, produce su propia confirmación: no practico porque «no sirvo», y como no practico, sigo sin servir. El coaching lo devuelve a su estatus de juicio: revisable, con dominio y fecha.",
        },
        {
          kind: "truefalse",
          statement:
            "Los juicios maestros (los que tenemos sobre nosotros mismos y sobre cómo es la vida) suelen operar sin que los notemos, como si fueran el paisaje.",
          correct: true,
          explain:
            "«Soy malo para los números», «no se puede confiar en la gente», «pedir ayuda es debilidad». No los vemos como opiniones: los vemos como «cómo son las cosas». Por eso son maestros: gobiernan sin ser cuestionados. El trabajo profundo del coaching es traerlos a la luz.",
        },
        {
          kind: "classify",
          prompt:
            "¿Cómo suena un juicio maestro «disuelto»? Clasificá las reformulaciones.",
          categories: ["Sentencia de identidad (cierra)", "Juicio revisable (abre)"],
          items: [
            { text: "«Soy un desastre con la plata»", cat: 0 },
            { text: "«Hasta hoy no aprendí a administrar mi plata; es un dominio donde soy principiante»", cat: 1 },
            { text: "«Yo soy así, no cambio más»", cat: 0 },
            { text: "«Vengo actuando así hace años; me pregunto qué lo sostiene»", cat: 1 },
            { text: "«Nadie me va a tomar en serio»", cat: 0 },
            { text: "«Juzgo que en este entorno me cuesta hacerme escuchar; quiero examinar qué hago yo ahí»", cat: 1 },
          ],
          explain:
            "El movimiento es siempre el mismo: de «soy X» (esencia inmodificable) a «juzgo X sobre mí en tal dominio, sostenido en tal historia» (interpretación revisable). El contenido puede seguir siendo duro; lo que cambia es que ahora hay una puerta.",
        },
        {
          kind: "choice",
          question:
            "En una sesión, el coachee dice: «soy una persona insegura». ¿Cuál es la intervención más ontológica del coach?",
          options: [
            "«No digas eso, vos podés con todo»",
            "«¿En qué situaciones concretas te observás inseguro? ¿Y en cuáles no?» — devolver el juicio a dominios y hechos",
            "«Sí, se nota que sos inseguro»",
            "Cambiar de tema para no incomodar",
          ],
          correct: 1,
          explain:
            "Ni contradecir el juicio (sería pelear opinión contra opinión) ni confirmarlo. El coach lo desagrega: ¿dónde sí, dónde no, desde cuándo, con qué hechos? Casi siempre aparecen dominios enteros donde la «inseguridad» no existe — y la sentencia global se convierte en un mapa trabajable.",
        },
        {
          kind: "reflect",
          prompt:
            "Completá con honestidad: «Yo soy …» — con el primer juicio negativo sobre vos mismo que te venga. Después reescribilo como juicio revisable: dominio, hechos, desde cuándo.",
          placeholder: "Soy… → En el dominio de…, desde…, me observo…",
          insight:
            "Sentí la diferencia entre las dos frases. La primera es una celda; la segunda, un diagnóstico. Nada del pasado cambió al reescribirla — cambió el observador: donde había una esencia ahora hay una historia, y las historias, a diferencia de las esencias, admiten capítulos nuevos.",
        },
      ],
    },
  ],
};
