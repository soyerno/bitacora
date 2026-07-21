import type { Chapter } from "../types";

/**
 * Capítulo 6 — Escucha y corporalidad.
 * Oír vs escuchar, verificación de la escucha e indagación, y el cuerpo
 * como dominio del observador.
 */
export const cap6: Chapter = {
  slug: "escucha",
  title: "Escucha y corporalidad",
  subtitle: "El lado receptor del lenguaje",
  description:
    "Hablamos para ser escuchados, pero el que escucha construye su propia versión. Escuchar = percibir + interpretar, cómo verificar la brecha, y qué dice el cuerpo mientras tanto.",
  icon: "👂",
  lessons: [
    {
      id: "oir-vs-escuchar",
      title: "Oír no es escuchar",
      description:
        "El oír es biológico; el escuchar es interpretativo. Entre lo que dije y lo que entendiste hay una brecha estructural.",
      exercises: [
        {
          kind: "concept",
          title: "Escuchar = oír + interpretar",
          body:
            "Oír es biología: ondas sonoras, tímpano, señal. Escuchar es otra cosa: a lo oído le agregás sentido — para qué me lo dice, qué implica, qué quiere de mí. Y ese sentido no viene en las palabras: lo pone el oyente, desde su historia, sus juicios y sus inquietudes.\n\nLa consecuencia es incómoda pero liberadora: no existe la transmisión directa de sentido. Entre lo que dije y lo que escuchaste hay una brecha estructural — no un defecto tuyo ni mío, sino la condición de toda conversación. Dos personas oyen la misma frase y escuchan cosas distintas, siempre.\n\nQuien no ve la brecha vive frustrado: «¡pero si fui clarísimo!». Quien la ve, la gestiona: verifica («¿qué te llevás como acordado?»), pregunta, resume. Diez segundos de verificación ahorran días de retrabajo — y años de «yo pensé que…».",
          diagram: "escucha",
          example:
            "El jefe dice «necesito esto pronto». Oyente A escucha «hoy antes de las 18 o hay problema». Oyente B escucha «esta semana estaría bien». Ninguno escuchó lo dicho: «pronto» no tiene fecha — cada uno la puso de su bolsillo.",
        },
        {
          kind: "choice",
          question: "Para la ontología del lenguaje, ¿qué es escuchar?",
          options: [
            "Registrar sonidos con el oído",
            "Percibir + interpretar: al oír, el observador construye sentido desde su historia, sus juicios y sus inquietudes",
            "Repetir textualmente lo que el otro dijo",
            "Estar callado mientras el otro habla",
          ],
          correct: 1,
          explain:
            "Escuchar es un acto activo del observador: a lo oído le agregás interpretación — para qué me lo dice, qué implica, qué le importa. Dos personas oyen la misma frase y escuchan cosas distintas. No es un defecto: es la estructura del escuchar.",
        },
        {
          kind: "truefalse",
          statement:
            "Si fui claro al hablar, el otro necesariamente escuchó lo que quise decir.",
          correct: false,
          explain:
            "No existe la transmisión directa de sentido: el otro interpreta desde su observador. La brecha entre lo dicho y lo escuchado es estructural — no se elimina, se gestiona: verificando, preguntando, resumiendo. «Yo fui claro» es la ilusión favorita del orador.",
        },
        {
          kind: "classify",
          prompt:
            "El jefe dice: «necesito ese informe pronto». ¿Qué es cada reacción: lo oído o una interpretación agregada?",
          categories: ["Lo dicho (oído)", "Interpretación del oyente"],
          items: [
            { text: "Pidió el informe", cat: 0 },
            { text: "«Pronto» = hoy antes de las 18", cat: 1 },
            { text: "Está enojado conmigo", cat: 1 },
            { text: "Usó la palabra «pronto»", cat: 0 },
            { text: "Piensa que soy lento", cat: 1 },
          ],
          explain:
            "«Pronto» no tiene fecha: el oyente le puso una. Y «está enojado» o «piensa que soy lento» son historias fabricadas enteramente por el que escucha. Gran parte del sufrimiento laboral vive en esta columna derecha — y casi nunca se verifica.",
        },
        {
          kind: "choice",
          question:
            "¿Cuál es la herramienta más simple para achicar la brecha entre lo dicho y lo escuchado?",
          options: [
            "Hablar más fuerte y más lento",
            "Verificar: «a ver si te entendí: lo que necesitás es X para Y, ¿es así?»",
            "Mandar todo por escrito y no hablar nunca",
            "Suponer que el otro entiende igual que yo",
          ],
          correct: 1,
          explain:
            "La verificación de escucha parece burocrática y es lo contrario: 10 segundos que ahorran días de retrabajo. En la respuesta del otro («no, en realidad…») aparece la brecha que ninguno de los dos sabía que existía.",
        },
        {
          kind: "reflect",
          prompt:
            "Recordá un malentendido reciente que te haya costado tiempo o un disgusto. ¿Qué escuchaste vos (o el otro) que no era lo que se había dicho?",
          placeholder: "Se dijo… / Se escuchó… / Costó…",
          insight:
            "Reconstruí el momento exacto donde la interpretación se separó de lo dicho: casi siempre hay una palabra ambigua («pronto», «después», «mejoralo») que cada uno llenó con su propio contenido, y ninguno verificó. La pregunta que hubiera evitado todo suele ser de una línea. Esa pregunta barata es la que la próxima vez vas a hacer.",
        },
      ],
    },
    {
      id: "indagar",
      title: "Indagar y verificar",
      description:
        "El coach escucha con preguntas: indagación que abre al otro en vez de confirmar lo que ya pensabas.",
      exercises: [
        {
          kind: "concept",
          title: "Indagar: preguntar para comprender, no para ganar",
          body:
            "La escucha pasiva (callarse mientras el otro habla) no alcanza: podés estar en silencio y aun así escuchar solo tu propio veredicto. La escucha activa se hace con movimientos concretos: verificar («entiendo que lo que te preocupa es el plazo, ¿es así?»), pedir concreción («¿me das un ejemplo?»), reflejar la emoción («te escucho con bronca, ¿la hay?») e indagar por la inquietud de fondo («¿qué está en juego para vos en esto?»).\n\nIndagar es preguntar para comprender el observador del otro — no para confirmar tu hipótesis ni para empujar tu consejo. Su enemiga es la pseudo-pregunta: «¿no te parece que deberías…?» ya trae la respuesta puesta; es una opinión disfrazada, y el otro lo nota siempre.\n\nDetrás de todo hablar hay una inquietud: algo que a la persona le importa y la mueve a hablar. El escuchar profundo no se queda en las palabras — pregunta por eso: ¿de qué te estás ocupando al contarme esto?",
          example:
            "«El deploy me da miedo» — respuesta que empuja: «¿no te parece que estás exagerando?». Indagación: «¿qué es lo que más te preocupa que pase?» → aparece la inquietud real: «no quiero volver a ser el que rompió producción». Otra conversación.",
        },
        {
          kind: "choice",
          question: "¿Qué es indagar, en el sentido ontológico?",
          options: [
            "Interrogar al otro hasta que confiese",
            "Hacer preguntas para comprender mejor el observador del otro: sus juicios, inquietudes y emociones — no para confirmar mi hipótesis",
            "Buscar datos en internet",
            "Dar consejos en forma de pregunta",
          ],
          correct: 1,
          explain:
            "La indagación genuina explora el mundo interpretativo del otro con curiosidad real. Su enemiga es la pseudo-pregunta que ya trae la respuesta («¿no te parece que deberías…?»), que es un consejo disfrazado.",
        },
        {
          kind: "classify",
          prompt: "¿Indagación genuina o pregunta que empuja? Clasificá.",
          categories: ["Indaga (abre al otro)", "Empuja (trae mi agenda)"],
          items: [
            { text: "«¿Qué es lo que más te preocupa de este cambio?»", cat: 0 },
            { text: "«¿No te parece que estás exagerando?»", cat: 1 },
            { text: "«Cuando decís que “no da para más”, ¿qué querés decir exactamente?»", cat: 0 },
            { text: "«¿Ya probaste hacerlo como te dije yo?»", cat: 1 },
            { text: "«¿Qué te impidió decírselo directamente?»", cat: 0 },
            { text: "«¿Vas a seguir así toda la vida?»", cat: 1 },
          ],
          explain:
            "Las genuinas piden información que no tenés y le dan al otro espacio para descubrirse. Las que empujan ya saben la respuesta «correcta»: juzgan con forma de pregunta. El otro nota la diferencia siempre, aunque no la nombre.",
        },
        {
          kind: "truefalse",
          statement:
            "Escuchar bien incluye escuchar lo que el otro no dice: sus inquietudes de fondo, no solo sus palabras.",
          correct: true,
          explain:
            "Detrás de todo hablar hay una inquietud: algo que a la persona le importa y la mueve a hablar. «El deploy me da miedo» puede traer la inquietud «no quiero ser el que rompa producción otra vez». El escuchar profundo pregunta por el trasfondo: ¿qué te importa acá? ¿de qué te estás ocupando al decirme esto?",
        },
        {
          kind: "match",
          prompt: "Uní cada movimiento de escucha activa con su ejemplo.",
          pairs: [
            { left: "Verificar", right: "«Entiendo que lo que te preocupa es el plazo, ¿es así?»" },
            { left: "Indagar por la inquietud", right: "«¿Qué es lo que está en juego para vos en esto?»" },
            { left: "Pedir concreción", right: "«¿Me das un ejemplo de una vez que haya pasado?»" },
            { left: "Reflejar la emoción", right: "«Te escucho con bronca cuando contás esto, ¿la hay?»" },
          ],
          explain:
            "Cuatro movimientos que convierten el silencio pasivo en escucha activa. Ninguno opina ni aconseja: todos le devuelven al otro su propio material, más nítido. Eso es escuchar como acto — no como pausa entre mis intervenciones.",
        },
        {
          kind: "choice",
          question:
            "En una conversación difícil, notás que mientras el otro habla vos ya estás preparando tu respuesta. ¿Qué está pasando con tu escucha?",
          options: [
            "Nada: es multitasking eficiente",
            "Dejaste de escuchar: tu atención está en tu defensa, y el otro pasó a ser el intervalo entre tus argumentos",
            "Es la única forma posible de conversar",
            "Estás escuchando doble",
          ],
          correct: 1,
          explain:
            "Es el modo debate: oigo para rebatir, no para comprender. La señal corporal es clara (tensión, apuro por interrumpir). El antídoto es volver deliberadamente al otro: ¿qué me está queriendo decir? ¿qué le importa? Responder se puede después — comprender solo se puede ahora.",
        },
        {
          kind: "reflect",
          prompt:
            "Elegí a alguien que «ya sabés cómo es» (esa persona que escuchás en piloto automático). ¿Qué juicios tuyos filtran todo lo que dice antes de que llegue a vos?",
          placeholder: "Con X ya doy por sentado que… / entonces cuando habla yo escucho…",
          insight:
            "A las personas que más tratamos las escuchamos menos: el juicio previo («ya sé lo que va a decir») reemplaza la escucha real. El experimento propuesto: en la próxima conversación con esa persona, suspender el veredicto por diez minutos y escucharla como si fuera la primera vez — verificando e indagando. Lo que aparezca ahí te va a decir cuánto de «cómo es» era en realidad «cómo la escucho».",
        },
      ],
    },
    {
      id: "corporalidad",
      title: "El cuerpo del observador",
      description:
        "Lenguaje, emoción y cuerpo se implican mutuamente: no hay cambio de observador sin cuerpo que lo sostenga.",
      exercises: [
        {
          kind: "concept",
          title: "El observador también es un cuerpo",
          body:
            "Lenguaje, emoción y cuerpo forman un sistema: cada emoción tiene su corporalidad (el miedo encoge, el entusiasmo expande), cada postura predispone ciertos ánimos, y ningún cambio de observador se sostiene si el cuerpo sigue ensayando el patrón viejo. No podés sostener entusiasmo desplomado en la silla, ni declarar un límite con voz que pide permiso.\n\nDel trabajo de corporalidad (Newfield y otros) tomamos cuatro disposiciones básicas: resolución (ir hacia: decidir, confrontar), apertura (recibir: escuchar sin defenderse), estabilidad (sostener: mantener la palabra bajo presión) y flexibilidad (adaptar: soltar el plan, jugar con lo inesperado). Nadie vive en una sola; la pregunta útil es cuál tenés sobreentrenada y cuál casi no visitás — ahí está el borde de tu repertorio.\n\nY un dato práctico: el cuerpo llega antes que el discurso. El otro lee tu disposición corporal antes de procesar tu primera frase. Preparar una conversación importante incluye preparar el cuerpo: respiración, postura, tono.",
          example:
            "Misma frase — «necesito que hablemos de lo que pasó» — dicha con mandíbula tensa y volumen en alza (el otro escucha ataque) o con respiración baja y cuerpo abierto (el otro escucha invitación). Las palabras eran idénticas.",
        },
        {
          kind: "choice",
          question:
            "La coherencia cuerpo–emoción–lenguaje significa que:",
          options: [
            "Hay que mantener siempre una postura firme y erguida",
            "Los tres dominios se implican: cada emoción tiene su corporalidad, cada postura predispone ciertos ánimos, y un cambio profundo requiere a los tres",
            "El cuerpo es irrelevante para el coaching",
            "Solo importa lo que se dice con palabras",
          ],
          correct: 1,
          explain:
            "No podés sostener entusiasmo con cuerpo desplomado, ni declarar un límite con voz que pide perdón. Cuerpo, emoción y lenguaje forman un sistema: intervenir uno mueve a los otros. Por eso el coaching ontológico observa cómo el coachee habita su cuerpo, no solo qué dice.",
        },
        {
          kind: "match",
          prompt: "Uní cada disposición corporal con lo que facilita.",
          pairs: [
            { left: "Resolución", right: "Ir hacia: declarar, decidir, confrontar lo que hay que confrontar" },
            { left: "Apertura", right: "Recibir: escuchar sin defenderse, considerar lo nuevo" },
            { left: "Estabilidad", right: "Sostener: mantener la posición y la palabra bajo presión" },
            { left: "Flexibilidad", right: "Adaptar: soltar el plan, jugar con lo inesperado" },
          ],
          explain:
            "Cuatro disposiciones corporales básicas (del trabajo de Newfield/CFA sobre corporalidad). Nadie vive en una sola: la pregunta útil es cuál tenés sobre-desarrollada y cuál casi no visitás — ahí suele estar el límite de tu repertorio de acción.",
        },
        {
          kind: "truefalse",
          statement:
            "Para dar una conversación difícil alcanza con preparar las palabras; el estado corporal en que llego no afecta el resultado.",
          correct: false,
          explain:
            "Las mismas palabras dichas con mandíbula tensa y respiración corta producen otra conversación. El cuerpo llega antes que el discurso: el otro lee tu disposición antes de procesar tu primera frase. Preparar una conversación incluye preparar el cuerpo: respiración, postura, tono.",
        },
        {
          kind: "classify",
          prompt: "¿Qué domina en cada escena: apertura o cierre corporal?",
          categories: ["Apertura", "Cierre / defensa"],
          items: [
            { text: "Recibís feedback mirando al otro, respiración baja y suelta", cat: 0 },
            { text: "Brazos cruzados, mandíbula apretada, «sí, sí, ya sé» antes de que termine", cat: 1 },
            { text: "Anotás lo que el otro señala y preguntás por un ejemplo", cat: 0 },
            { text: "Respondés a cada frase antes del punto, subiendo el volumen", cat: 1 },
          ],
          explain:
            "El cuerpo delata la escucha: se puede decir «te escucho» con un cuerpo que grita «defensa». La buena noticia es que también funciona al revés: aflojar hombros y respiración muchas veces abre una escucha que la voluntad sola no lograba.",
        },
        {
          kind: "reflect",
          prompt:
            "Pensá en la conversación más importante que tenés pendiente. ¿Con qué cuerpo la venís imaginando (tensión, apuro, encogimiento)? ¿Qué disposición necesitarías: resolución, apertura, estabilidad o flexibilidad?",
          placeholder: "La conversación: … / Mi cuerpo hoy: … / Necesito llegar en: …",
          insight:
            "Ya diseñaste el contenido en capítulos anteriores (pedido, reclamo, declaración). Ahora tenés la otra mitad: el cuerpo con el que vas a decirlo. Antes de esa conversación: dos minutos de respiración lenta, pies apoyados, hombros sueltos, y una frase interna que te ponga en la disposición elegida. No es esoterismo — es que el observador también es un cuerpo, y se entrena.",
        },
      ],
    },
  ],
};
