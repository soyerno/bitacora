import type { Chapter } from "../types";

/**
 * Capítulo 7 — Quiebres y la conversación de coaching.
 * Integra todo el programa: quiebres, tipos de conversaciones y la
 * estructura de una sesión.
 */
export const cap7: Chapter = {
  slug: "quiebres",
  title: "Quiebres y conversaciones",
  subtitle: "La práctica integradora",
  description:
    "Cuando la transparencia se rompe aparece el quiebre — y con él, la oportunidad. Qué conversación abrir según el quiebre, y cómo se estructura una conversación de coaching completa.",
  icon: "🌀",
  lessons: [
    {
      id: "el-quiebre",
      title: "El quiebre como oportunidad",
      description:
        "Transparencia, quiebre y la decisión más importante: qué hacés cuando algo se rompe.",
      exercises: [
        {
          kind: "concept",
          title: "Transparencia y quiebre",
          body:
            "La mayor parte de la vida transcurre en transparencia: actuás sin deliberar. Manejás sin pensar en manejar, tipeás sin buscar las teclas, saludás sin diseñar el saludo. La deliberación consciente es la excepción, no la regla — y menos mal: sería invivible pensarlo todo.\n\nEl quiebre es la interrupción de ese fluir: el ruido en el motor, el mail inesperado, la oferta que no buscabas. Ojo con la definición: el quiebre no es el hecho — es el juicio de que ese hecho interrumpe lo que me importa. Sin algo en juego no hay quiebre, hay solo un evento. Por eso el mismo hecho es catástrofe para uno y anécdota para otro: cada observador declara sus propios quiebres y su tamaño.\n\nY acá la bifurcación que define tanto: ante el quiebre podés negarlo («no pasa nada»), mudarte a la pregunta por la culpa (semanas de «¿de quién fue?») — o hacerte cargo: declarar el quiebre, identificar qué inquietud tuya afecta y abrir las conversaciones que lo muevan. Los quiebres, además, son la puerta del aprendizaje: solo cuando algo deja de funcionar en automático podés verlo y rediseñarlo.",
          diagram: "quiebre",
          example:
            "Dos personas pierden el mismo trabajo. Una declara «se me terminó la carrera» (quiebre terminal); la otra, «era el empujón que no me animaba a darme» (quiebre-oportunidad). El hecho es idéntico; el quiebre lo escribe cada observador.",
        },
        {
          kind: "choice",
          question:
            "Manejás a casa sin pensar en manejar; de pronto, un ruido raro en el motor. Todo tu foco va ahí. En términos ontológicos, ¿qué pasó?",
          options: [
            "Un accidente mecánico sin más",
            "Se interrumpió la transparencia (el fluir no-reflexivo) y apareció un quiebre: algo que juzgo que interrumpe mis posibilidades",
            "Una emoción negativa injustificada",
            "Nada relevante para el coaching",
          ],
          correct: 1,
          explain:
            "Vivimos la mayor parte del tiempo en transparencia: actuando sin deliberar. El quiebre es la interrupción de ese fluir — y no es el hecho en sí, sino el juicio de que ese hecho afecta lo que me importa. Sin algo en juego, no hay quiebre: hay solo un ruido.",
        },
        {
          kind: "truefalse",
          statement:
            "Un quiebre es siempre algo negativo que hay que evitar.",
          correct: false,
          explain:
            "Hay quiebres negativos (el deploy falló) y positivos (me ofrecieron un puesto que no busqué — también interrumpe mi transparencia y me obliga a re-decidir). Además, los quiebres son la puerta del aprendizaje: solo cuando algo deja de funcionar en automático podemos verlo y rediseñarlo.",
        },
        {
          kind: "choice",
          question:
            "Dos personas pierden el mismo trabajo. Una lo vive como catástrofe terminal, la otra como el empujón que necesitaba. ¿Qué muestra esto sobre los quiebres?",
          options: [
            "Que una de las dos está mintiendo",
            "Que el quiebre no está en el hecho sino en la interpretación: cada observador declara su propio quiebre y su tamaño",
            "Que perder el trabajo es siempre positivo",
            "Que las emociones no influyen",
          ],
          correct: 1,
          explain:
            "El mismo hecho, dos quiebres distintos — porque el quiebre es una declaración del observador sobre cómo el hecho afecta sus posibilidades. Esto no trivializa el dolor: señala dónde hay espacio de trabajo. No podés elegir el hecho; tenés algo que decir sobre el quiebre que declarás con él.",
        },
        {
          kind: "classify",
          prompt: "Ante un quiebre, ¿la respuesta se hace cargo o lo esquiva? Clasificá.",
          categories: ["Se hace cargo del quiebre", "Lo esquiva"],
          items: [
            { text: "«Esto me rompió el plan. ¿Qué conversación tengo que abrir y con quién?»", cat: 0 },
            { text: "«No pasa nada, no pasa nada» (mientras todo indica que pasa)", cat: 1 },
            { text: "«¿De quién fue la culpa?» como única pregunta, durante semanas", cat: 1 },
            { text: "«Declaro que esto es un quiebre. ¿Qué me importa que está afectado? ¿Qué acciones abre?»", cat: 0 },
            { text: "Scrollear el teléfono hasta que el problema «se pase solo»", cat: 1 },
          ],
          explain:
            "Las dos evasiones clásicas: negar el quiebre o quedarse a vivir en la pregunta por la culpa. Hacerse cargo no es tener la solución: es declarar el quiebre, identificar qué inquietud tuya afecta y abrir las conversaciones que faltan.",
        },
        {
          kind: "reflect",
          prompt:
            "¿Cuál es tu quiebre vigente más importante — eso que interrumpió tu fluir y todavía no resolviste? Escribí: el hecho, qué cosa que te importa afecta, y qué venís haciendo con él.",
          placeholder: "El hecho: … / Afecta: … / Vengo haciendo: …",
          insight:
            "Mirá lo que «venís haciendo»: ¿es acción que se hace cargo, o alguna forma elegante de esquive (negación, culpa, postergación)? Los quiebres no resueltos no se archivan: cobran renta en forma de ánimo de fondo. La lección siguiente te da el mapa de conversaciones para moverlo.",
        },
      ],
    },
    {
      id: "conversaciones",
      title: "Las cuatro conversaciones",
      description:
        "Para cada quiebre hay una conversación — y quedarse en la equivocada es la forma más común de no salir.",
      exercises: [
        {
          kind: "concept",
          title: "El mapa de las cuatro conversaciones",
          body:
            "Frente a un quiebre, Echeverría distingue cuatro conversaciones posibles. La de juicios personales: interpreto, me quejo, asigno culpas — humana e inevitable, procesa la emoción, pero es una sala de espera: nada del mundo cambia ahí. La de coordinación de acciones: pido, ofrezco, prometo — la única que mueve el quiebre directamente. La de posibles acciones: cuando todavía no sé qué pedir, exploro con otros qué se podría hacer. Y la de posibles conversaciones: cuando «con esa persona no se puede hablar», converso sobre cómo hacer posible esa conversación — con un tercero, o con la persona misma («quiero hablarte de algo difícil, ¿cuándo te viene bien?»).\n\nEl diagnóstico exprés de cualquier problema estancado es preguntar: ¿en qué conversación está viviendo? La respuesta habitual: años en la primera. La queja fértil, repetida, compartida — y ni un pedido, ni una oferta, ni un reclamo con destinatario.\n\nLa salida no suele costar más que veinte minutos de la conversación correcta.",
          example:
            "Tres meses de retro repitiendo «el otro equipo nunca avisa los cambios de API» (juicios personales). La conversación que faltaba: «les pedimos avisar todo cambio con 48 h en este canal, ¿se comprometen?» (coordinación). Veinte minutos; problema muerto.",
        },
        {
          kind: "match",
          prompt: "Uní cada tipo de conversación con lo que hace.",
          pairs: [
            { left: "Conversación de juicios personales", right: "Interpreto y me quejo: asigno culpas, proceso la emoción — pero no cambia nada todavía" },
            { left: "Conversación para coordinar acciones", right: "Pido, ofrezco, prometo: acciones concretas para resolver el quiebre" },
            { left: "Conversación para posibles acciones", right: "Explorar/brainstormear qué se podría hacer, cuando aún no sé qué pedir" },
            { left: "Conversación para posibles conversaciones", right: "No puedo hablar con X del tema: converso sobre cómo hacer posible esa conversación" },
          ],
          explain:
            "El mapa de Echeverría. La primera es humana e inevitable, pero es una sala de espera: nada se mueve hasta pasar a alguna de las otras tres. Diagnóstico exprés de un problema estancado: ¿en cuál conversación está viviendo?",
        },
        {
          kind: "choice",
          question:
            "Hace tres meses que un equipo repite en cada retro «el otro equipo nunca nos avisa los cambios de API». Nada cambió. ¿En qué conversación están atrapados y cuál les falta?",
          options: [
            "Están en coordinación de acciones; les falta quejarse más",
            "Están en juicios personales (la queja); les falta la conversación para coordinar acciones: un pedido concreto al otro equipo",
            "Están en posibles conversaciones; les falta silencio",
            "No están en ninguna conversación",
          ],
          correct: 1,
          explain:
            "Tres meses de queja fértil en retro y cero pedidos al equipo de al lado: el caso típico. La salida cuesta una conversación de veinte minutos: «les pedimos avisar todo cambio de API con 48 h en este canal, ¿pueden comprometerse?». La queja procesaba la emoción; el pedido procesa el quiebre.",
        },
        {
          kind: "classify",
          prompt: "¿Qué conversación es? Clasificá cada frase.",
          categories: ["Juicios personales (queja)", "Coordinación de acciones"],
          items: [
            { text: "«Es un desconsiderado, siempre lo mismo»", cat: 0 },
            { text: "«¿Podés avisarme por chat si vas a llegar después de las 10?»", cat: 1 },
            { text: "«Nadie valora lo que hago acá»", cat: 0 },
            { text: "«Ofrezco encargarme del release si vos tomás el soporte esta semana»", cat: 1 },
            { text: "«Este proceso es un desastre y a nadie le importa»", cat: 0 },
          ],
          explain:
            "Escuchá la gramática: la queja está hecha de juicios sin destinatario comprometido; la coordinación está hecha de pedidos y ofertas con oyente, condiciones y tiempo. Mismo malestar de fondo — actos lingüísticos opuestos.",
        },
        {
          kind: "truefalse",
          statement:
            "Cuando la conversación directa con alguien parece imposible («con mi jefe no se puede hablar»), no queda nada por hacer.",
          correct: false,
          explain:
            "Queda la conversación para posibles conversaciones: examinar qué juicio me frena («va a tomárselo mal» — ¿fundado?), diseñar condiciones (momento, canal, encuadre) o conversar primero sobre cómo conversamos («quiero hablarte de algo y no sé cómo; ¿cuándo te viene bien?»). «No se puede hablar» es casi siempre un juicio, no un hecho.",
        },
        {
          kind: "reflect",
          prompt:
            "Volvé al quiebre que escribiste en la lección anterior. ¿En qué conversación está viviendo hoy? ¿Cuál es la conversación que le falta, y con quién?",
          placeholder: "Hoy está en… / Le falta la conversación de… con…",
          insight:
            "Si estaba en la queja (propia o interna), ya sabés que ahí no se resuelve: la queja no tiene destinatario que pueda prometerte algo. Diseñá la conversación faltante con las piezas del programa: hechos verificables, juicios fundados, un pedido completo o una declaración — y el cuerpo y ánimo para decirla. Eso es pasar de padecer el quiebre a procesarlo.",
        },
      ],
    },
    {
      id: "sesion-coaching",
      title: "La conversación de coaching",
      description:
        "Todo el programa junto: cómo se estructura una conversación ontológica, para acompañar a otros o para autocoachearte.",
      exercises: [
        {
          kind: "concept",
          title: "La conversación de coaching: el arco completo",
          body:
            "Una conversación de coaching no es una charla con consejos: es un arco con cinco momentos. Primero, generar contexto y confianza: acordar tema, permiso y confidencialidad — sin confianza no hay apertura, y sin permiso no hay coaching. Segundo, escuchar el quiebre: el coachee cuenta; el coach indaga hechos, juicios, emociones e inquietudes (todo el arsenal de los capítulos anteriores). Tercero — el corazón —, intervenir en el observador: distinguir hecho de juicio, examinar fundamentos, leer la emoción, desafiar el juicio maestro. Si este momento no ocurre, lo que sigue es decoración. Cuarto, diseñar acciones: del observador ensanchado salen pedidos, declaraciones, conversaciones pendientes. Quinto, cierre: el coachee declara qué se lleva y qué va a hacer, con plazo.\n\nLa tentación permanente del coach es el consejo: «yo veo clarísimo lo que tenés que hacer». Esa claridad es un juicio de su observador — y dictarla resuelve el problema de hoy dejando intacto al observador que lo va a regenerar mañana.\n\nY el uso más frecuente de todo esto no es con un coach profesional: es el autocoaching. Las mismas preguntas, aplicadas a tus propios quiebres. Las reflexiones que escribiste a lo largo del programa fueron exactamente eso.",
          example:
            "Coachee: «no me dan los proyectos grandes». Coach (sin aconsejar): «¿qué hechos tenés? ¿qué juicio armaste con eso? ¿está fundado? ¿qué pediste explícitamente alguna vez?» → aparece que nunca hubo pedido, solo espera resentida. La acción sale sola.",
        },
        {
          kind: "match",
          prompt: "Uní cada momento de una conversación de coaching con lo que ocurre.",
          pairs: [
            { left: "1 · Generar contexto y confianza", right: "Acordar tema, permiso y confidencialidad: sin confianza no hay apertura" },
            { left: "2 · Escuchar el quiebre", right: "El coachee cuenta; el coach indaga hechos, juicios, emociones e inquietudes" },
            { left: "3 · Intervenir en el observador", right: "Distinguir hecho de juicio, fundar, leer la emoción: se ensancha la mirada" },
            { left: "4 · Diseñar acciones", right: "Del nuevo observador salen acciones: pedidos, declaraciones, conversaciones" },
            { left: "5 · Cierre y compromiso", right: "El coachee declara qué se lleva y qué va a hacer, con plazo" },
          ],
          explain:
            "No es una receta rígida sino un arco: confianza → escucha → trabajo sobre el observador → acción → compromiso. El corazón es el tercer momento: si el observador no se movió, las «acciones diseñadas» serán más de lo mismo.",
        },
        {
          kind: "choice",
          question:
            "En medio de la sesión, el coach «ve clarísimo» lo que el coachee tendría que hacer. ¿Qué hace un coach ontológico con esa claridad?",
          options: [
            "La dicta inmediatamente como instrucción",
            "La sostiene como hipótesis y sigue indagando: su claridad es un juicio de su observador, y el aprendizaje que vale es el del coachee",
            "Termina la sesión: ya está resuelto",
            "Se la guarda para siempre sin usarla",
          ],
          correct: 1,
          explain:
            "La tentación del consejo es la trampa del oficio: resuelve el problema de hoy y deja intacto al observador que lo va a regenerar mañana. El coach puede ofrecer su mirada — como juicio, pidiendo permiso, después de indagar — pero el veredicto y la acción son del coachee.",
        },
        {
          kind: "truefalse",
          statement:
            "El coaching ontológico también puede practicarse sobre uno mismo: usar las distinciones para examinar los propios quiebres, juicios y conversaciones pendientes.",
          correct: true,
          explain:
            "Es el uso más frecuente: autocoaching. Ante un quiebre propio: ¿qué hechos hay y qué juicios les monté? ¿están fundados? ¿qué emoción me tiene y qué juicio la habita? ¿qué conversación falta? Las reflexiones que escribiste en este programa son exactamente eso.",
        },
        {
          kind: "choice",
          question:
            "Un amigo te cuenta: «me quieren dar un puesto de líder, pero yo no sirvo para liderar gente». Con todo el programa encima, ¿cuál es tu mejor primera intervención?",
          options: [
            "«¡Dale que sí, vos podés!»",
            "«Tenés razón, liderar no es para cualquiera»",
            "«¿Qué hechos te llevan a ese juicio? ¿En qué dominios te pasó? ¿Y buscaste evidencia de lo contrario?»",
            "«Cambiemos de tema, es incómodo»",
          ],
          correct: 2,
          explain:
            "Ni arenga (opone un juicio a otro sin fundamentos) ni confirmación. La intervención ontológica trata «no sirvo para liderar» como lo que es: un juicio con historia, dominio y — quizás — poca evidencia. Las preguntas devuelven al amigo la autoría de su evaluación, y con ella, la posibilidad de revisarla.",
        },
        {
          kind: "classify",
          prompt: "Repaso final — ¿qué acto lingüístico es cada frase?",
          categories: ["Afirmación o hecho", "Juicio, declaración o acto de coordinación"],
          items: [
            { text: "«La reunión empezó a las 9:12»", cat: 0 },
            { text: "«Declaro cerrada esta etapa de mi carrera»", cat: 1 },
            { text: "«Te pido la propuesta para el jueves a las 10»", cat: 1 },
            { text: "«El equipo cerró 14 tickets este sprint»", cat: 0 },
            { text: "«Juzgo que estamos listos para el lanzamiento, por estas tres razones»", cat: 1 },
            { text: "«Prometo avisarte si el plazo entra en riesgo»", cat: 1 },
          ],
          explain:
            "Si distinguiste todo, el programa hizo su trabajo: ya no escuchás frases — escuchás actos. Hechos verificables por un lado; juicios, declaraciones, pedidos y promesas por el otro, cada uno con sus propias reglas de juego.",
        },
        {
          kind: "reflect",
          prompt:
            "Cierre del programa. Escribí tu declaración de cambio: «A partir de hoy, en el dominio de …, me comprometo a …». Elegí algo pequeño y real, con quién y para cuándo.",
          placeholder: "A partir de hoy, en…, me comprometo a… — primera acción: … antes del …",
          insight:
            "Acabás de hacer una declaración + una promesa — los dos actos que fundan futuros. Todo el programa cabe en esta práctica: observar tus interpretaciones, fundarlas, leer tus emociones, y convertir lo que te importa en conversaciones y compromisos. El coaching ontológico no se sabe: se practica. Tu declaración de recién es la práctica empezando.",
        },
      ],
    },
  ],
};
