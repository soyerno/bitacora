import type { Chapter } from "../types";

/**
 * Capítulo 1 — El observador que sos.
 * Fundamentos: qué es el coaching ontológico, el modelo
 * observador–acción–resultados y los enemigos del aprendizaje.
 */
export const cap1: Chapter = {
  slug: "el-observador",
  title: "El observador que sos",
  subtitle: "Fundamentos del coaching ontológico",
  description:
    "Por qué dos personas ven cosas distintas frente al mismo hecho, qué significa que no vemos las cosas como son sino como somos, y qué tipo de aprendizaje transforma al observador y no solo a la acción.",
  icon: "👁️",
  readings: [
    {
      title: "Ontología del Lenguaje",
      author: "Rafael Echeverría",
      note: "El libro fundacional de la disciplina. Para este capítulo: los primeros capítulos, sobre el observador y los postulados básicos.",
    },
    {
      title: "El árbol del conocimiento",
      author: "Humberto Maturana y Francisco Varela",
      note: "La base biológica de «no vemos las cosas como son, sino como somos». Lectura más densa, pero funda todo lo demás.",
    },
    {
      title: "Metamanagement (Tomo 1: Principios)",
      author: "Fredy Kofman",
      note: "El modelo observador-acción-resultados y el aprendizaje de segundo orden aplicados al trabajo, con casos y ejercicios.",
    },
  ],
  lessons: [
    {
      id: "que-es",
      title: "Qué es el coaching ontológico",
      description:
        "La disciplina, su origen y su apuesta: no cambiar lo que hacés, cambiar el observador que sos.",
      exercises: [
        {
          kind: "concept",
          title: "Ontología: la pregunta por el ser",
          body:
            "«Ontología» viene del griego ontos (ser) y logos (estudio): la pregunta por lo que somos. El coaching ontológico nace de una síntesis entre la filosofía del lenguaje (Austin, Searle), la biología del conocimiento (Maturana) y su articulación práctica (Fernando Flores y Rafael Echeverría, autor de «Ontología del Lenguaje»).\n\nSu apuesta central: los seres humanos somos seres lingüísticos. No usamos el lenguaje solo para describir el mundo — lo usamos para crearlo. Y la forma en que interpretamos define qué acciones nos resultan posibles.\n\nPor eso esta disciplina no trabaja primero sobre lo que hacés (técnicas, hábitos, tips) sino sobre el modo de ser desde el cual hacés: tus interpretaciones, tus juicios, tus emociones. A ese modo de ser lo llamamos «el observador».",
          example:
            "Dos personas reciben el mismo feedback crítico. Una escucha «me están atacando» y se defiende; la otra escucha «me están regalando información» y pregunta más. Mismo hecho, dos observadores — y dos futuros distintos.",
        },
        {
          kind: "concept",
          title: "Qué hace (y qué no hace) un coach ontológico",
          body:
            "Conviene despejar el malentendido más común antes de empezar: el coach ontológico no es un consejero. No te dice qué hacer (eso es un consultor), no te enseña su experiencia en tu dominio (eso es un mentor), no trata patologías (eso es un terapeuta). Su trabajo es otro: acompañarte a observar tus propias interpretaciones, juicios y emociones para que vos encuentres acciones que hoy no podés ver.\n\n¿Por qué esa restricción? Porque si el coach te da la respuesta, tu observador queda intacto — y ese era el punto. El problema de hoy se resuelve, y el observador que lo generó fabrica uno igual el mes que viene. La transformación solo ocurre cuando el propio coachee ensancha su mirada.\n\nLas herramientas del coach son las de este programa: distinguir hechos de juicios, examinar fundamentos, leer emociones, detectar conversaciones faltantes — y sobre todo, preguntar. Por eso este programa sirve doble: para acompañar a otros, y para autocoachearte.",
          example:
            "Coachee: «¿vos qué harías en mi lugar?». Coach: «lo que yo haría importa poco — soy otro observador. Contame: ¿qué opciones estás viendo vos, y cuál descartaste sin examinar?». La pregunta devuelve el problema a su dueño, con la mirada ampliada.",
        },
        {
          kind: "choice",
          question:
            "«Ontología» viene del griego «ontos» (ser). ¿Por qué el coaching ontológico se llama así?",
          options: [
            "Porque estudia técnicas de comunicación efectiva",
            "Porque trabaja sobre la forma de ser de la persona, no solo sobre lo que hace",
            "Porque se basa en tests de personalidad",
            "Porque fue creado por un filósofo llamado Ontos",
          ],
          correct: 1,
          explain:
            "El coaching ontológico no apunta primero a la conducta sino al modo de ser desde el cual esa conducta surge: cómo interpretás el mundo, qué juicios cargás, desde qué emociones actuás. Cambiando el observador, cambian las acciones posibles.",
        },
        {
          kind: "truefalse",
          statement:
            "Para el coaching ontológico, el lenguaje solo sirve para describir una realidad que ya existe.",
          correct: false,
          explain:
            "Esa es justamente la idea que esta disciplina desafía. El lenguaje no solo describe: genera realidades. Cuando alguien declara «acepto», «renuncio» o «te perdono», el mundo después de esas palabras es otro. Esta idea —el lenguaje como acción— es la base de todo el programa.",
        },
        {
          kind: "match",
          prompt: "Uní cada pensador con su aporte a la tradición ontológica.",
          pairs: [
            { left: "Rafael Echeverría", right: "Escribió «Ontología del Lenguaje» y sistematizó la disciplina" },
            { left: "Fernando Flores", right: "Llevó los actos de habla a la coordinación de acciones y al trabajo" },
            { left: "Humberto Maturana", right: "Biología del conocer: no vemos las cosas como son, sino como somos" },
            { left: "John Searle y J.L. Austin", right: "Filosofía del lenguaje: hablar es actuar (actos de habla)" },
          ],
          explain:
            "El coaching ontológico es una síntesis: filosofía del lenguaje (Austin, Searle), biología del conocimiento (Maturana) y su articulación práctica (Flores, Echeverría).",
        },
        {
          kind: "choice",
          question:
            "Un coach ontológico trabaja con una persona que «no llega a sus resultados». ¿Cuál es la primera pregunta ontológica, antes que ninguna técnica?",
          options: [
            "¿Qué herramientas de productividad usás?",
            "¿Qué observador está siendo esta persona, que estas acciones le parecen las únicas posibles?",
            "¿Cuántas horas por día trabajás?",
            "¿Quién tiene la culpa de estos resultados?",
          ],
          correct: 1,
          explain:
            "Las acciones que tomamos dependen de lo que somos capaces de ver. Si alguien repite acciones que no funcionan, el coaching no le da «mejores acciones»: indaga qué interpretación del mundo hace que esas acciones parezcan las únicas disponibles.",
        },
        {
          kind: "reflect",
          prompt:
            "Pensá en un problema que tengas hace tiempo y que ya intentaste resolver varias veces sin éxito. Escribí en una frase cómo lo describís habitualmente.",
          placeholder: "Ej.: «no me alcanza el tiempo para…», «mi equipo no se compromete…»",
          insight:
            "Fijate en tu frase: ¿describe un hecho del mundo o describe tu interpretación? «No me alcanza el tiempo» parece un hecho, pero es una interpretación que oculta decisiones (prioridades, pedidos que no hacés, cosas que no soltás). El primer movimiento del coaching ontológico es ese: sospechar que el problema vive, en parte, en el observador que lo formula.",
        },
        {
          kind: "truefalse",
          statement:
            "En coaching ontológico, el coach es quien tiene las respuestas correctas y se las transmite al coachee.",
          correct: false,
          explain:
            "El coach no aconseja ni prescribe: acompaña al coachee a observar sus propias interpretaciones, juicios y emociones para que él mismo encuentre nuevas acciones. Si el coach da respuestas, el observador del coachee queda intacto — y ese era el punto.",
        },
      ],
    },
    {
      id: "modelo-oar",
      title: "Observador, acción, resultados",
      description:
        "El modelo OAR: cuando los resultados no alcanzan, podés cambiar la acción… o cambiar el observador.",
      exercises: [
        {
          kind: "concept",
          title: "El modelo OAR: dos loops de aprendizaje",
          body:
            "Los resultados que obtenés vienen de las acciones que tomás. Hasta ahí, obvio. Lo que el modelo agrega es el tercer término: las acciones que tomás dependen del observador que sos — lo que distinguís, lo que interpretás, lo que creés posible.\n\nCuando un resultado no te conforma, tenés dos loops disponibles. El de primer orden: cambiar la acción (practicar más, probar otra técnica, ajustar el plan). Funciona muchas veces. Pero cuando venís repitiendo «más de lo mismo» y nada cambia, el loop que falta es el de segundo orden: preguntarte qué interpretación tuya hace que esas acciones te parezcan las únicas disponibles.\n\nEl coaching ontológico vive en el segundo loop.",
          diagram: "oar",
          example:
            "Un líder que no delega prueba apps de productividad (primer orden) sin resultado. El día que descubre su interpretación oculta — «si delego y sale mal, quedo yo como incompetente» — puede por fin delegar (segundo orden).",
        },
        {
          kind: "choice",
          question: "Según el modelo OAR, ¿de dónde salen los resultados que obtenemos?",
          options: [
            "Directamente de la suerte y el contexto",
            "De las acciones que tomamos, que a su vez dependen del observador que somos",
            "De nuestros títulos y conocimientos acumulados",
            "De lo que los demás deciden por nosotros",
          ],
          correct: 1,
          explain:
            "Observador → Acción → Resultados. Los resultados vienen de acciones, y las acciones posibles las define el observador: lo que distinguís, lo que interpretás, lo que creés posible. El contexto influye, claro, pero el modelo ilumina la parte que depende de vos.",
        },
        {
          kind: "match",
          prompt: "Uní cada tipo de aprendizaje con su descripción.",
          pairs: [
            { left: "Aprendizaje de primer orden", right: "Cambio la acción para mejorar el resultado; el observador sigue igual" },
            { left: "Aprendizaje de segundo orden", right: "Cambio el observador que soy: veo distinto y aparecen acciones nuevas" },
            { left: "Ceguera cognitiva", right: "No sé que no sé: ni siquiera veo que hay algo por aprender" },
          ],
          explain:
            "El coaching ontológico se especializa en el segundo orden. Cuando repetir «más de lo mismo» no alcanza, lo que hay que revisar no es la acción sino la interpretación desde la que actuás.",
        },
        {
          kind: "classify",
          prompt: "¿Primer orden o segundo orden? Clasificá cada aprendizaje.",
          categories: ["Primer orden (cambia la acción)", "Segundo orden (cambia el observador)"],
          items: [
            { text: "Aprendo un atajo de teclado para escribir más rápido", cat: 0 },
            { text: "Descubro que trato los desacuerdos como ataques, y por eso evito conversaciones", cat: 1 },
            { text: "Cambio la agenda de reuniones para que duren 25 minutos", cat: 0 },
            { text: "Me doy cuenta de que pido ayuda como si fuera una derrota, y dejo de pedirla", cat: 1 },
            { text: "Practico una presentación tres veces antes de darla", cat: 0 },
          ],
          explain:
            "Los tres primeros mejoran la ejecución sin tocar la mirada. Los de segundo orden revelan una interpretación (desacuerdo=ataque, pedir=derrota) que, al hacerse visible, habilita acciones antes impensables.",
        },
        {
          kind: "truefalse",
          statement:
            "Si dos personas presencian la misma reunión, necesariamente observaron lo mismo.",
          correct: false,
          explain:
            "Cada una observa desde sus distinciones, juicios, historia y emociones. Una vio «una discusión productiva», la otra «una falta de respeto». No hay un observador neutro: hay observadores diferentes frente al mismo evento.",
        },
        {
          kind: "choice",
          question:
            "Un equipo viene fallando entregas. Ya probaron: más horas, más reuniones de seguimiento, más presión. Nada cambió. Desde el modelo OAR, ¿qué sugiere esto?",
          options: [
            "Que necesitan todavía más horas y más presión",
            "Que el problema es irresoluble",
            "Que agotaron el primer orden: toca revisar qué observador está siendo el equipo (qué interpretan sobre comprometerse, pedir, decir que no)",
            "Que hay que cambiar a las personas del equipo",
          ],
          correct: 2,
          explain:
            "«Más de lo mismo» es la marca del primer orden agotado. La pregunta de segundo orden sería, por ejemplo: ¿qué entiende este equipo por «comprometerse»? ¿Alguien puede decir «no llego» sin castigo? Ahí suele vivir el problema real.",
        },
        {
          kind: "reflect",
          prompt:
            "Elegí un resultado tuyo que te gustaría cambiar. ¿Qué acciones repetiste hasta ahora para lograrlo? Anotalas.",
          placeholder: "Resultado: … / Acciones que ya probé: …",
          insight:
            "Ahora la pregunta de segundo orden: ¿qué estás suponiendo —sobre vos, sobre los otros, sobre lo posible— que hace que justo esas acciones te parezcan las razonables? Si tus acciones ya dieron lo que podían dar, el próximo movimiento no es una acción nueva: es una interpretación nueva.",
        },
      ],
    },
    {
      id: "enemigos-aprendizaje",
      title: "Los enemigos del aprendizaje",
      description:
        "Declarar «no sé» es el acto fundacional del aprendizaje — y todo lo que solemos poner en el camino.",
      exercises: [
        {
          kind: "concept",
          title: "Los enemigos del aprendizaje",
          body:
            "Aprender exige un movimiento incómodo: declarar «no sé». Sin ese espacio vacío, no hay dónde poner lo nuevo. Y sin permiso para ser principiante — es decir, torpe por un rato — no hay práctica; sin práctica, no hay aprendizaje.\n\nEcheverría cataloga los «enemigos del aprendizaje», actitudes que lo bloquean sin que las notemos: el «ya lo sé» que cierra la escucha antes de empezar; la incapacidad de declarar ignorancia (por vergüenza o por identidad de experto); los juicios de incapacidad sobre uno mismo («a mi edad ya no», «yo no soy de los que…»); el «no tengo tiempo» crónico; y querer resultados inmediatos sin transitar la torpeza inicial.\n\nLo potente de nombrarlos es que dejan de operar en la sombra: un enemigo identificado ya es un enemigo a medio desarmar.",
          example:
            "«Yo soy malo para los idiomas» dicho a los 35 años, fundado en una experiencia del secundario. Veinte años de evidencia vieja, tratada como sentencia perpetua — típico juicio de incapacidad haciéndose pasar por dato.",
        },
        {
          kind: "choice",
          question: "Para el coaching ontológico, ¿cuál es la declaración que abre el aprendizaje?",
          options: [
            "«Yo ya sé»",
            "«No sé» — declarar ignorancia es el primer acto del aprendiz",
            "«Esto es imposible»",
            "«Siempre fui así»",
          ],
          correct: 1,
          explain:
            "Sin un «no sé» declarado no hay espacio donde el aprendizaje entre. Parece obvio, pero gran parte de los bloqueos vienen de no poder decirlo: por vergüenza, por identidad («yo soy el que sabe»), por cultura de empresa.",
        },
        {
          kind: "classify",
          prompt: "¿Facilita o bloquea el aprendizaje? Clasificá cada actitud.",
          categories: ["Facilita el aprendizaje", "Enemigo del aprendizaje"],
          items: [
            { text: "«No sé cómo hacer esto, ¿me mostrás?»", cat: 0 },
            { text: "«Esto ya lo sé» (antes de escuchar)", cat: 1 },
            { text: "«A mi edad ya no se puede aprender esto»", cat: 1 },
            { text: "«Dame la práctica, quiero intentarlo aunque salga mal»", cat: 0 },
            { text: "«No tengo tiempo para aprender» (todos los meses, hace años)", cat: 1 },
            { text: "«Quiero aprenderlo ya, sin pasar por ser principiante»", cat: 1 },
          ],
          explain:
            "Los enemigos clásicos: el «ya lo sé», la incapacidad de declarar ignorancia, los juicios de imposibilidad sobre uno mismo, el «no tengo tiempo» crónico y querer resultados sin transitar la torpeza del principiante.",
        },
        {
          kind: "truefalse",
          statement:
            "Darse permiso para ser principiante —y por lo tanto torpe— es una condición del aprendizaje profundo.",
          correct: true,
          explain:
            "Todo aprendizaje pasa por una etapa donde lo hacés mal. Quien no tolera verse torpe evita practicar, y sin práctica no hay aprendizaje. La dignidad del principiante es una emoción que el coach ayuda a habilitar.",
        },
        {
          kind: "choice",
          question:
            "Una líder senior dice: «no puedo preguntar eso en la reunión, se supone que yo debería saberlo». ¿Qué enemigo del aprendizaje está operando?",
          options: [
            "Falta de inteligencia",
            "La identidad de experta: proteger el «yo sé» le cuesta el acceso al «no sé»",
            "Falta de interés genuino",
            "Exceso de humildad",
          ],
          correct: 1,
          explain:
            "Cuanto más construiste una identidad de «la que sabe», más caro parece declarar ignorancia. El costo real es silencioso: preguntas que no se hacen, aprendizajes que no ocurren. Separar identidad de conocimiento libera el aprendizaje.",
        },
        {
          kind: "reflect",
          prompt:
            "¿Qué te gustaría aprender desde hace tiempo y venís postergando? Escribí qué te decís a vos mismo para justificar la postergación.",
          placeholder: "Quiero aprender… / Me digo que…",
          insight:
            "Releé tu justificación y buscale el enemigo: ¿es un «no tengo tiempo» (¿de verdad no hay 20 minutos por semana?), un juicio de incapacidad («no soy de los que…»), o miedo a la torpeza inicial? Nombrar el enemigo específico es el primer paso para desarmarlo — los enemigos del aprendizaje operan mejor cuando no los vemos.",
        },
        {
          kind: "truefalse",
          statement:
            "Decir «yo soy así» sobre un comportamiento propio es una descripción neutra sin consecuencias.",
          correct: false,
          explain:
            "«Yo soy así» convierte un comportamiento (modificable) en una esencia (inmodificable). Es una declaración que cierra el aprendizaje: si «soy» impuntual, no hay nada que aprender, solo algo que aceptar. El lenguaje acá no describe: sentencia.",
        },
      ],
    },
  ],
};
