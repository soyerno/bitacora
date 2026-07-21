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
    "Las emociones no son ruido que interrumpe la razón: son predisposiciones a la acción. Distinguir emoción de estado de ánimo, mapear los cuatro ánimos básicos, aprender a leerlos — y trabajar la culpa y el perdón.",
  icon: "🌊",
  lessons: [
    {
      id: "emocion-vs-animo",
      title: "Emoción y estado de ánimo",
      description:
        "La emoción tiene causa y fecha; el estado de ánimo es el clima desde el que vivís sin darte cuenta.",
      exercises: [
        {
          kind: "concept",
          title: "Las emociones son predisposiciones a la acción",
          body:
            "La tradición racionalista trató a las emociones como ruido: interferencias a controlar para poder pensar bien. La mirada ontológica las rehabilita: cada emoción es una predisposición a la acción. Desde el miedo, huimos o nos paralizamos; desde el enojo, confrontamos; desde el entusiasmo, emprendemos; desde la ternura, cuidamos. La emoción no es lo contrario de la acción — es su plataforma de despegue.\n\nDistinguimos dos fenómenos. La emoción tiene gatillo y fecha: algo pasó (leí ese mail, sonó esa alarma) y algo se movió en mí; cuando el evento se procesa, la emoción sigue su curso. El estado de ánimo, en cambio, no responde a ningún evento: es el clima de fondo desde el que vivís — semanas, meses, años — y tiñe todo lo que ves y hacés sin que lo notes.\n\nLa pregunta práctica de esta lección: ¿desde qué emoción — y desde qué clima — estás actuando? Porque el mismo plan, ejecutado desde la resignación o desde el entusiasmo, no es el mismo plan.",
          example:
            "Emoción: bronca al leer una respuesta irónica en el chat (gatillo claro, se disipa en horas). Estado de ánimo: hace seis meses que todo el trabajo «da lo mismo» (sin gatillo puntual — es el aire que respirás).",
        },
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
          kind: "concept",
          title: "La grilla de los cuatro ánimos",
          body:
            "Echeverría propone un mapa de dos ejes. Primer eje: ¿esto puede cambiarse? La facticidad es lo que ya no puede cambiar (el pasado, lo perdido, lo que otro decidió); la posibilidad es lo que todavía está abierto. Segundo eje: ¿cómo me paro frente a eso — me cierro o me abro?\n\nDel cruce salen los cuatro estados de ánimo básicos. Frente a la facticidad: el resentimiento (vivo en guerra con lo que no puede cambiar: «no debería haber pasado, alguien me lo debe») o la aceptación/paz (declaro el pasado cerrado y dejo de pagarle renta). Frente a la posibilidad: la resignación (trato lo cambiable como si fuera inmutable: «para qué intentar») o la ambición (veo espacio y voy).\n\nLo liberador de la grilla: los cuatro ánimos son interpretaciones — juicios sobre qué es facticidad y qué es posibilidad. Y los juicios, ya sabés: se examinan, se fundan, se revisan. Los dos grandes ladrones de vida son clasificar mal: pelear contra lo inmodificable y dar por cerrado lo modificable.",
          diagram: "grilla-animos",
          example:
            "«Me reestructuraron el equipo» (facticidad). Resentimiento: seis meses de «fue una injusticia» en cada almuerzo. Aceptación: «pasó y no depende de mí; ¿qué sí depende de mí ahora?» — mismo hecho, dos vidas distintas.",
        },
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
          kind: "concept",
          title: "Reconstrucción lingüística: leer la emoción",
          body:
            "Toda emoción lleva dentro un juicio — una historia sobre lo que pasó y lo que significa. El miedo juzga que algo que valoro está amenazado. El enojo, que alguien transgredió algo legítimo. La tristeza, que perdí algo que valoraba. La culpa, que yo transgredí mis propios estándares. La gratitud, que recibí algo valioso que no me era debido.\n\nReconstruir una emoción es hacerle decir su juicio: «siento X porque juzgo que Y». No para reducirla a palabras — para volverla legible. Porque una vez legible, el juicio se puede examinar con los filtros del capítulo 3: ¿está fundado? ¿la amenaza es real? ¿la transgresión existió — o era una expectativa mía que nunca convertí en pedido?\n\nDos destinos posibles: si el juicio está fundado, la emoción era una mensajera precisa y te señala una acción pendiente (un reclamo, un límite, un duelo, un gracias). Si está infundado, la emoción afloja sola al perder su historia. En ambos casos ganaste: dejaste de estar dentro de la emoción y pasaste a estar en conversación con ella. Lo que nunca funciona es el tercer camino: «no debería sentir esto» — las emociones no obedecen órdenes; negadas, gobiernan desde la sombra.",
          example:
            "«Estoy furioso con Leo» → reconstrucción: «juzgo que transgredió nuestro acuerdo de avisarme antes de tocar producción» → chequeo: ¿acordamos eso alguna vez… o yo lo daba por obvio? Si nunca se acordó, lo que hay no es una transgresión: es un pedido que debo.",
        },
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
    {
      id: "culpa-perdon",
      title: "La culpa y el perdón",
      description:
        "La culpa como juez interno, la responsabilidad que repara, y el perdón — al otro y a uno mismo — como declaración que libera el futuro.",
      exercises: [
        {
          kind: "concept",
          title: "La culpa: el juicio que te hacés a vos",
          body:
            "La culpa es la emoción que aparece cuando juzgás que vos transgrediste tus propios estándares: hiciste algo que «no se hace», o no hiciste algo que «debías». Como toda emoción, trae información valiosa — señala que algo que te importa fue tocado, y que fuiste vos.\n\nPero la culpa tiene dos modos muy distintos. La culpa que paraliza rumia en círculos: «soy terrible», «no tengo perdón» — un juicio de identidad que te deja mirando el pasado, castigándote sin reparar nada. La responsabilidad, en cambio, mira la acción y el futuro: «hice X, produjo este daño, ¿qué reparo y qué hago distinto?». Fijate la diferencia gramatical: la culpa dice «soy»; la responsabilidad dice «hice».\n\nEl movimiento ontológico ante la culpa es el mismo que con toda emoción: leer su juicio. ¿Qué estándar mío transgredí? ¿Sigue siendo mi estándar, o es una voz heredada que nunca examiné? Si la transgresión es real, la culpa pide dos actos concretos: reparar el daño y — como vas a ver — pedir perdón.",
          example:
            "Culpa que paraliza: tres semanas sin dormir por haber gritado en la reunión, evitando a todos. Responsabilidad: «grité, estuvo fuera de lugar, dañó la confianza» → disculpa concreta al equipo + decidir qué hacer la próxima vez que la presión suba.",
        },
        {
          kind: "classify",
          prompt: "¿Culpa que paraliza o responsabilidad que repara? Escuchá la gramática.",
          categories: ["Culpa que paraliza", "Responsabilidad que repara"],
          items: [
            { text: "«Soy un desastre como madre/padre, no tengo remedio»", cat: 0 },
            { text: "«Ayer no lo escuché; hoy le voy a preguntar cómo está y a pedirle disculpas»", cat: 1 },
            { text: "«No merezco que me perdonen» (repetido por años, sin hablar con el afectado)", cat: 0 },
            { text: "«Rompí el build por no correr los tests: lo aviso, lo arreglo y agrego el hook»", cat: 1 },
            { text: "Rumiar la escena cada noche sin contárselo nunca a nadie", cat: 0 },
          ],
          explain:
            "La culpa paralizante es curiosamente cómoda: castigarse en privado no exige la conversación incómoda de reparar en público. La responsabilidad va al hecho, al daño y a la acción siguiente. El test: ¿tu culpa produjo alguna reparación para el otro — o solo sufrimiento para vos?",
        },
        {
          kind: "concept",
          title: "El perdón: una declaración, no un sentimiento",
          body:
            "Esperar «sentir» el perdón es esperar algo que casi nunca llega solo. En la mirada ontológica, el perdón es una declaración: un acto que hacés con la autoridad de tu propia vida. «Te perdono» declara: suelto el resentimiento como organizador de mi relación con vos; el hecho queda en el pasado, pero dejo de cobrarlo en el presente.\n\nTres aclaraciones que cambian todo. Perdonar no es olvidar ni decir que estuvo bien: el daño fue real y tu juicio sobre él puede seguir intacto. Perdonar no exige reconciliarse: podés perdonar y también declarar «no quiero esta persona cerca» — son declaraciones independientes. Y el perdón es unilateral: no necesita que el otro lo pida, lo merezca ni se entere. Por eso siempre está disponible.\n\n¿Y a quién libera? Primero a vos. El resentimiento es veneno de largo plazo: te ata al que te dañó, le entrega la administración de tu ánimo y te tiene releyendo el pasado. La declaración de perdón no le regala nada al otro — te devuelve el timón a vos.",
          example:
            "Un padre ausente que jamás pidió perdón. La hija, ya adulta, declara: «te perdono — no porque estuvo bien, sino porque no quiero seguir organizando mi vida alrededor de esa deuda». El padre ni se entera. La que duerme distinta es ella.",
        },
        {
          kind: "truefalse",
          statement: "Para perdonar a alguien hace falta que primero pida perdón y demuestre que cambió.",
          correct: false,
          explain:
            "Ese es el malentendido que deja a tanta gente presa: condicionar el propio perdón a un acto del otro que quizás nunca llegue. El perdón ontológico es unilateral — una declaración sobre tu relación con el pasado, no un certificado de buena conducta del otro. Reconciliarse sí requiere a los dos; perdonar, solo a vos.",
        },
        {
          kind: "choice",
          question: "¿Cuál de estas es una disculpa completa — un pedido de perdón bien hecho?",
          options: [
            "«Perdón si te ofendiste» (el problema es tu sensibilidad)",
            "«Perdón, pero vos también…» (disculpa con contraataque)",
            "«Bueno, ya está, no fue para tanto» (minimizar)",
            "«Llegué una hora tarde y te dejé esperando sin avisar. Me imagino la bronca. Te pido perdón — y la próxima te aviso apenas sepa que no llego»",
          ],
          correct: 3,
          explain:
            "Anatomía de la disculpa completa: nombrar el hecho concreto (sin «si...»), reconocer el daño al otro, pedir perdón explícitamente y comprometer una conducta futura. «Perdón si te ofendiste» es la anti-disculpa: convierte tu transgresión en un problema de la sensibilidad ajena.",
        },
        {
          kind: "match",
          prompt: "Uní cada acto del territorio culpa-perdón con lo que hace.",
          pairs: [
            { left: "Resentimiento", right: "Me ata al pasado y le entrega mi ánimo a quien me dañó" },
            { left: "Declarar «te perdono»", right: "Suelto la deuda; recupero el timón — no necesita al otro" },
            { left: "Pedir perdón", right: "Reconozco hecho y daño, y compremeto conducta futura" },
            { left: "Perdonarme a mí", right: "Paso de «soy terrible» a «hice, reparo, aprendo»" },
            { left: "Reconciliación", right: "Reabrir la relación: requiere a los dos, y es opcional" },
          ],
          explain:
            "Cinco actos distintos que solemos fundir en uno. Separarlos es lo que vuelve el territorio transitable: podés perdonar sin reconciliarte, pedir perdón sin esperar absolución, y perdonarte sin negar el daño.",
        },
        {
          kind: "choice",
          question:
            "«No puedo perdonarme lo que hice» — dice alguien que hace años repara y jamás reincidió. ¿Qué diría la mirada ontológica?",
          options: [
            "Que tiene razón: hay cosas imperdonables por definición",
            "Que el auto-castigo eterno ya no es responsabilidad: es un juicio de identidad congelado — y el auto-perdón es una declaración que está en su autoridad hacer",
            "Que debería simplemente olvidar lo que pasó",
            "Que espere a que la culpa se vaya sola",
          ],
          correct: 1,
          explain:
            "Reparó, aprendió, no reincidió: la deuda con el otro está trabajada. Lo que queda es la deuda con el juez interno — y ese juez cobra en identidad («soy imperdonable»), no en hechos. El auto-perdón declara: «hice aquello, lo reparé, y dejo de ser el castigado a perpetuidad». Sin esa declaración, ninguna cantidad de reparación alcanza jamás.",
        },
        {
          kind: "reflect",
          prompt:
            "Inventario del territorio: ¿a quién le debés un pedido de perdón (hecho concreto + daño)? ¿A quién te conviene perdonar — aunque no lo pida? ¿Y hay algo que te venís cobrando a vos mismo hace demasiado?",
          placeholder: "Debo un perdón a… por… / Me haría bien perdonar a… / Me vengo cobrando…",
          insight:
            "Tres deudas distintas, tres actos distintos: una disculpa completa (hecho + daño + compromiso), una declaración de perdón (unilateral, tuya, hoy si querés) y un auto-perdón (pasar de «soy» a «hice, reparé, aprendí»). Ninguna requiere que el otro coopere. Elegí la más madura de las tres — la que ya sabés que te toca — y ponele fecha. El resentimiento y la culpa crónica cobran interés compuesto; el perdón lo corta de un solo acto.",
        },
      ],
    },
  ],
};
