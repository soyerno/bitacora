import type { Chapter } from "../types";

/**
 * Capítulo 5 — Emociones y estados de ánimo.
 * Emociones como predisposiciones a la acción, los cuatro estados de ánimo
 * básicos y la reconstrucción lingüística.
 */
export const cap5: Chapter = {
  slug: "emociones",
  title: "Emociones y estados de ánimo",
  subtitle: "Desde dónde actuás",
  description:
    "Las emociones no son ruido que interrumpe la razón: son predisposiciones a la acción. Distinguir emoción de estado de ánimo, mapear los cuatro ánimos básicos y aprender a leerlos.",
  icon: "🌊",
  lessons: [
    {
      id: "emocion-vs-animo",
      title: "Emoción y estado de ánimo",
      description:
        "La emoción tiene causa y fecha; el estado de ánimo es el clima desde el que vivís sin darte cuenta.",
      exercises: [
        {
          kind: "choice",
          question: "¿Qué es una emoción, para la mirada ontológica?",
          options: [
            "Una debilidad que hay que controlar",
            "Una predisposición para la acción: cada emoción abre ciertas acciones y cierra otras",
            "Un fenómeno puramente químico sin relación con la conducta",
            "Un adorno de la personalidad",
          ],
          correct: 1,
          explain:
            "Desde el miedo huimos o nos paralizamos; desde el entusiasmo emprendemos; desde la ternura cuidamos. La emoción no es lo contrario de la acción: es su plataforma de despegue. Por eso importa tanto saber desde cuál estás actuando.",
        },
        {
          kind: "match",
          prompt: "Uní cada característica con «emoción» o «estado de ánimo».",
          pairs: [
            { left: "Tiene un evento gatillo identificable", right: "Emoción (me enojé cuando leí ese mail)" },
            { left: "Es el trasfondo desde el que se vive, sin causa puntual", right: "Estado de ánimo (vivo en la resignación)" },
            { left: "Dura relativamente poco, sigue al evento", right: "Emoción" },
            { left: "Tiñe todo lo que se observa y se hace por semanas o años", right: "Estado de ánimo" },
          ],
          explain:
            "La emoción es figura (aparece ante algo); el ánimo es fondo (te acompaña a todos lados). Uno «tiene» emociones, pero a los estados de ánimo más bien «los habita» — o ellos te habitan a vos.",
        },
        {
          kind: "classify",
          prompt: "¿Emoción puntual o estado de ánimo de fondo? Clasificá.",
          categories: ["Emoción (con gatillo)", "Estado de ánimo (trasfondo)"],
          items: [
            { text: "Bronca al leer una respuesta irónica en el chat", cat: 0 },
            { text: "Hace meses que todo el trabajo «da lo mismo»", cat: 1 },
            { text: "Susto cuando el monitor de producción se puso rojo", cat: 0 },
            { text: "Un entusiasmo de fondo con el que arranca cada semana", cat: 1 },
            { text: "Alegría al recibir la noticia del ascenso", cat: 0 },
            { text: "Desconfianza permanente hacia «los de arriba», venga lo que venga", cat: 1 },
          ],
          explain:
            "El «da lo mismo» crónico, el entusiasmo de base y la desconfianza permanente no responden a un evento: son el clima. Los otros tres tienen fecha, hora y gatillo. El coaching trabaja distinto con cada uno.",
        },
        {
          kind: "truefalse",
          statement:
            "Los estados de ánimo afectan lo que consideramos posible: el mismo hecho se ve distinto desde el entusiasmo que desde la resignación.",
          correct: true,
          explain:
            "El ánimo es un lente sobre lo posible. La misma propuesta es «una oportunidad» desde la ambición y «otra cosa que va a fallar» desde la resignación. Por eso los ánimos no son un tema «blando»: definen qué futuro puede ver una persona o un equipo.",
        },
        {
          kind: "reflect",
          prompt:
            "¿En qué estado de ánimo dirías que viviste el último mes? No la emoción de hoy: el clima de fondo. Escribilo con tus palabras.",
          placeholder: "Mi clima de fondo fue…",
          insight:
            "Ahora preguntate: ¿qué acciones te facilitó ese ánimo y cuáles te bloqueó? ¿Qué conversaciones no tuviste, qué proyectos no arrancaste, «por cómo venías»? El primer paso con un estado de ánimo no es cambiarlo: es verlo. Un ánimo observado ya no gobierna igual que un ánimo invisible.",
        },
      ],
    },
    {
      id: "cuatro-animos",
      title: "Los cuatro ánimos básicos",
      description:
        "Resentimiento, aceptación, resignación y ambición: la grilla de facticidad y posibilidad.",
      exercises: [
        {
          kind: "choice",
          question:
            "La grilla de los ánimos cruza dos ejes: cómo me relaciono con lo que no puedo cambiar (facticidad) y con lo que sí podría cambiar (posibilidad). ¿Qué par corresponde a la facticidad?",
          options: [
            "Ambición y resignación",
            "Resentimiento (me opongo a lo inmodificable) y aceptación/paz (lo declaro cerrado)",
            "Alegría y tristeza",
            "Miedo y coraje",
          ],
          correct: 1,
          explain:
            "Frente a lo que ya no puede cambiarse (el pasado, lo perdido, lo que otro decidió) hay dos posturas: oponerse —resentimiento— o declararlo cerrado y vivir en paz — aceptación. Frente a lo que podría cambiar: verlo cerrado —resignación— o verlo abierto — ambición.",
        },
        {
          kind: "match",
          prompt: "Uní cada estado de ánimo con su conversación interna típica.",
          pairs: [
            { left: "Resentimiento", right: "«Esto que me hicieron no debería haber pasado; alguien me lo debe»" },
            { left: "Aceptación / paz", right: "«Esto pasó, no lo puedo cambiar; elijo no vivir en guerra con eso»" },
            { left: "Resignación", right: "«Para qué intentar, si acá nada va a cambiar»" },
            { left: "Ambición", right: "«Acá hay un espacio: veo posibilidades y voy a por ellas»" },
          ],
          explain:
            "Los cuatro son interpretaciones sobre la facticidad y la posibilidad — por eso son trabajables desde el lenguaje: cada ánimo lleva dentro un juicio que se puede examinar, fundar o desafiar.",
        },
        {
          kind: "classify",
          prompt: "¿Resignación o ambición? Escuchá el juicio de posibilidad en cada frase.",
          categories: ["Resignación (posibilidad cerrada)", "Ambición (posibilidad abierta)"],
          items: [
            { text: "«En esta empresa las cosas siempre fueron así»", cat: 0 },
            { text: "«Nadie logró automatizar esto todavía — ahí hay una oportunidad»", cat: 1 },
            { text: "«¿Para qué voy a proponer nada, si nunca escuchan?»", cat: 0 },
            { text: "«Si aprendo este stack, en un año puedo liderar ese tipo de proyectos»", cat: 1 },
            { text: "«Ya está, a mi edad no se cambia de carrera»", cat: 0 },
          ],
          explain:
            "La resignación se disfraza de realismo: «así son las cosas». Su marca es tratar juicios de imposibilidad como afirmaciones de hecho. La ambición hace el juicio opuesto sobre el mismo mundo — y por eso ve espacios donde la resignación ve paredes.",
        },
        {
          kind: "truefalse",
          statement:
            "El resentimiento suele crecer donde hubo promesas incumplidas sin reclamo, o límites no declarados.",
          correct: true,
          explain:
            "Conecta con los capítulos anteriores: el resentido carga una conversación pendiente — un reclamo que no hizo, un «no» que no dijo, una expectativa que nunca convirtió en pedido. Por eso una salida del resentimiento es lingüística: tener por fin esa conversación (o declarar el perdón y cerrar).",
        },
        {
          kind: "choice",
          question:
            "Un equipo vive en resignación: «para qué estimar, si siempre nos cambian las prioridades». Como coach, ¿cuál es el movimiento ontológico?",
          options: [
            "Darles un discurso motivacional con música épica",
            "Confirmarles que tienen razón y que no hay nada que hacer",
            "Tratar la resignación como un juicio de imposibilidad y examinarlo: ¿qué hechos lo fundan? ¿es tan total como parece? ¿qué sí está en nuestras manos?",
            "Cambiar a todos los integrantes del equipo",
          ],
          correct: 2,
          explain:
            "La resignación se desarma con el mismo rigor que cualquier juicio: dominio, hechos, contraejemplos. Casi siempre aparece un espacio de posibilidad real («las prioridades cambian, pero el 60% del sprint sobrevive — trabajemos sobre ese 60%») que la resignación global tapaba.",
        },
        {
          kind: "reflect",
          prompt:
            "Ubicate en la grilla: ¿hay algo inmodificable de tu pasado con lo que seguís en guerra (resentimiento)? ¿Hay algo modificable que diste por imposible (resignación)? Nombrá uno de cada uno.",
          placeholder: "Sigo en guerra con… / Di por imposible…",
          insight:
            "Para lo primero, la pregunta es: ¿qué te falta declarar para cerrar — un reclamo, un perdón, un duelo? Para lo segundo: ¿qué evidencia real tenés de la imposibilidad, y cuándo la revisaste por última vez? La grilla no te pide optimismo: te pide poner cada cosa en su casillero correcto. La guerra contra lo inmodificable y el cierre de lo modificable son los dos grandes ladrones de vida.",
        },
      ],
    },
    {
      id: "reconstruccion",
      title: "Leer y reconstruir emociones",
      description:
        "Toda emoción lleva dentro un juicio. Aprender a leerlo convierte la emoción en información.",
      exercises: [
        {
          kind: "match",
          prompt: "Uní cada emoción con el juicio que la habita.",
          pairs: [
            { left: "Miedo", right: "«Juzgo que algo que valoro está amenazado»" },
            { left: "Enojo", right: "«Juzgo que alguien transgredió algo que considero legítimo»" },
            { left: "Tristeza", right: "«Juzgo que perdí algo que valoraba»" },
            { left: "Culpa", right: "«Juzgo que yo transgredí mis propios estándares»" },
            { left: "Gratitud", right: "«Juzgo que recibí algo valioso que no me era debido»" },
          ],
          explain:
            "Esta es la reconstrucción lingüística: cada emoción es reconstruible como un juicio + una historia. No reduce la emoción a palabras — la vuelve legible, y lo legible se puede examinar.",
        },
        {
          kind: "choice",
          question:
            "Sentís un enojo fuerte con un colega. Reconstruís: «juzgo que transgredió un acuerdo». Al revisar, descubrís que ese acuerdo… nunca se conversó: era una expectativa tuya. ¿Qué pasa con el enojo?",
          options: [
            "Nada: el enojo siempre tiene razón",
            "Suele transformarse: sin transgresión real, el enojo pierde su fundamento y aparece otra cosa — quizás un pedido por hacer",
            "Se convierte automáticamente en alegría",
            "Hay que reprimirlo con fuerza de voluntad",
          ],
          correct: 1,
          explain:
            "El enojo era real, pero su juicio estaba infundado: no hubo promesa, hubo expectativa silenciosa. Visto esto, la energía del enojo suele mudar a algo más útil: hacer el pedido que faltó. No es represión — es precisión.",
        },
        {
          kind: "truefalse",
          statement:
            "Decirle a alguien (o a uno mismo) «no deberías sentir eso» es una intervención efectiva sobre las emociones.",
          correct: false,
          explain:
            "Las emociones no obedecen órdenes; negarlas solo las manda a operar desde la sombra. El camino ontológico es otro: legitimar la emoción (está, y por algo está), leer su juicio, examinar el juicio. Se trabaja con la emoción, no contra ella.",
        },
        {
          kind: "classify",
          prompt: "¿Qué hace cada respuesta con la emoción? Clasificá.",
          categories: ["La escucha y la lee", "La niega o la tapa"],
          items: [
            { text: "«Estoy con miedo por la demo. ¿Qué juzgo amenazado? Mi imagen de experto»", cat: 0 },
            { text: "«Acá no pasa nada, sigamos» (con el estómago cerrado)", cat: 1 },
            { text: "«Noto bronca. ¿Qué acuerdo siento transgredido y existió realmente?»", cat: 0 },
            { text: "«Los profesionales no se ponen tristes por un proyecto»", cat: 1 },
            { text: "«Esta culpa, ¿qué estándar mío toqué? ¿Sigue siendo mi estándar?»", cat: 0 },
          ],
          explain:
            "Leer la emoción no es regodearse en ella: es extraerle la información que trae y decidir con ella. Taparla no la elimina — la deja gobernando sin supervisión, que es la peor configuración posible.",
        },
        {
          kind: "reflect",
          prompt:
            "Elegí la emoción más intensa que sentiste esta semana. Reconstruíla: ¿qué sentí? ¿ante qué evento? ¿qué juicio la habita? ¿ese juicio resiste los filtros del capítulo 3?",
          placeholder: "Sentí… cuando… / El juicio: … / ¿Fundado?: …",
          insight:
            "Si el juicio resultó fundado, tu emoción era una mensajera precisa: la acción que pide (un reclamo, un límite, un duelo, un agradecimiento) probablemente esté pendiente. Si resultó infundado, ya sentiste cómo la emoción afloja al perder su historia. En ambos casos ganaste lo mismo: dejaste de estar dentro de la emoción y pasaste a estar en conversación con ella.",
        },
      ],
    },
  ],
};
