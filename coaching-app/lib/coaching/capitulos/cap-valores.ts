import type { Chapter } from "../types";

/**
 * Capítulo — Valores y creencias.
 * Qué te importa (valores), qué creés posible (sistema de creencias) y la
 * caja de herramientas para transformar las creencias que quedaron chicas.
 * Se ubica después de Emociones: usa juicios (cap 3) y emociones (cap 5)
 * como insumos.
 */
export const capValores: Chapter = {
  slug: "valores-creencias",
  title: "Valores y creencias",
  subtitle: "Tu brújula y tus anteojos",
  description:
    "Lo que te importa y lo que creés posible definen tu mundo: mapear tus valores reales (no los declamados), ver el sistema de creencias que te tiene, y un juego de herramientas concreto para transformar las que te quedaron chicas.",
  icon: "🧭",
  readings: [
    {
      title: "Maestría personal",
      author: "Oscar Anzorena",
      note: "El camino del desarrollo personal desde la mirada ontológica: valores, modelos mentales y aprendizaje transformacional.",
    },
    {
      title: "Metamanagement (Tomo 1: Principios)",
      author: "Fredy Kofman",
      note: "Los capítulos sobre modelos mentales y valores: cómo las creencias filtran lo que vemos y cómo trabajarlas en equipo.",
    },
    {
      title: "La quinta disciplina",
      author: "Peter Senge",
      note: "Modelos mentales como disciplina: hacer visibles las creencias que gobiernan decisiones, con herramientas de indagación.",
    },
  ],
  lessons: [
    {
      id: "valores",
      title: "Valores: la brújula",
      description:
        "Los valores no son un póster en la pared: son lo que tu agenda, tus decisiones y tus emociones ya vienen mostrando.",
      exercises: [
        {
          kind: "concept",
          title: "Los valores: lo que de verdad te importa",
          body:
            "Un valor es aquello que te importa al punto de ordenar tus decisiones: honestidad, libertad, familia, aprendizaje, seguridad, reconocimiento, servicio. Ontológicamente funcionan como declaraciones fundantes — «esto es lo que cuenta para mí» — y como el criterio silencioso detrás de cada elección que hacés.\n\nPero hay una trampa: casi todos tenemos dos juegos de valores. Los declarados (lo que decimos que nos importa) y los practicados (lo que nuestras acciones muestran). «La familia es lo primero» dicho por alguien que hace tres años no llega a cenar un martes: la brecha no lo hace mentiroso — lo hace humano, y la brecha es exactamente el material de trabajo.\n\n¿Cómo se detectan los valores reales? Dos lecturas. La externa: agenda, decisiones y billetera — dónde ponés tiempo, foco y recursos cuando nadie te mira. La interna: tus emociones (capítulo 5) son detectores de valores — te indigna lo que toca un valor tuyo, te enorgullece lo que lo honra, te duele lo que lo traiciona. La bronca y el orgullo son tu brújula hablando.",
          diagram: "valores",
          example:
            "Dice que su valor central es «aprender». Evidencia: hace dos años no lee nada nuevo, esquiva los proyectos desconocidos y elige siempre la tarea que ya domina. Su valor practicado hoy es «seguridad» — dato valiosísimo, no para castigarse: para decidir con los ojos abiertos.",
        },
        {
          kind: "choice",
          question: "Desde la mirada ontológica, ¿dónde se leen los valores reales de una persona?",
          options: [
            "En lo que dice en las entrevistas y en su bio",
            "En sus intenciones profundas, aunque nunca se concreten",
            "En sus acciones sostenidas: agenda, decisiones, recursos — y en las emociones que se le disparan",
            "En los tests de personalidad que haya hecho",
          ],
          correct: 2,
          explain:
            "Las declaraciones de valores son fáciles y gratis; las acciones cuestan. Por eso el valor real se lee en lo que hacés sostenidamente y en lo que te conmueve (indignación, orgullo, dolor). La brecha entre lo declarado y lo practicado no es motivo de vergüenza: es el mapa de tu próximo trabajo.",
        },
        {
          kind: "classify",
          prompt: "¿El valor se está practicando, o está solo declarado (brecha)?",
          categories: ["Valor practicado", "Declarado con brecha"],
          items: [
            { text: "«Valoro la salud» — entrena 3 veces por semana hace un año", cat: 0 },
            { text: "«La familia primero» — tercer año seguido cancelando las vacaciones", cat: 1 },
            { text: "«Me importa la honestidad» — dio el feedback incómodo aunque le costó el ascenso", cat: 0 },
            { text: "«Valoro aprender» — presupuesto de cursos sin usar desde 2024", cat: 1 },
            { text: "«Valoro el descanso» — apaga notificaciones a las 19 y no responde hasta las 9", cat: 0 },
            { text: "«Mi equipo es mi prioridad» — reagendó las 1:1 cuatro semanas seguidas", cat: 1 },
          ],
          explain:
            "En todos los casos la vara es la misma: conducta sostenida y verificable (capítulo 2: ¡afirmaciones!). Notá que la brecha no se juzga con adjetivos sino con hechos — y así formulada, se puede trabajar: o cierro la brecha con acciones, o reviso honestamente qué valor estoy eligiendo de verdad.",
        },
        {
          kind: "match",
          prompt: "Tus emociones son detectores de valores. Uní cada señal con el valor tocado.",
          pairs: [
            { left: "Indignación cuando descubren una mentira", right: "Honestidad" },
            { left: "Ahogo cuando me controlan cada paso", right: "Libertad / autonomía" },
            { left: "Herida cuando mi aporte pasa inadvertido", right: "Reconocimiento" },
            { left: "Ansiedad fuerte ante lo incierto", right: "Seguridad" },
            { left: "Culpa al faltar a la cena prometida", right: "Familia / palabra dada" },
          ],
          explain:
            "Donde hay emoción intensa hay un valor en juego — es la reconstrucción lingüística del capítulo 5 aplicada a la brújula. La próxima vez que algo te indigne o te enorgullezca desproporcionadamente, preguntate: ¿qué valor mío está hablando acá?",
        },
        {
          kind: "truefalse",
          statement:
            "Sentir un conflicto entre dos valores (por ejemplo, desafío profesional vs estabilidad familiar) es señal de que algo anda mal en vos.",
          correct: false,
          explain:
            "Los dilemas difíciles de la vida casi nunca son «bien vs mal» — son valor contra valor: dos bienes que no caben juntos en esta decisión. Sentir el tirón es señal de que ambos te importan de verdad. Lo que sí trae problemas es no nombrar el conflicto y decidir por deriva, dejando que gane el valor que grita más fuerte ese día.",
        },
        {
          kind: "choice",
          question:
            "Le ofrecen un puesto soñado en otra ciudad: crecimiento enorme, pero lejos de sus padres mayores. Lleva semanas paralizada. ¿Cuál es el movimiento ontológico?",
          options: [
            "Decidir rápido para dejar de sufrir",
            "Hacer una lista de pros y contras económicos",
            "Nombrar los dos valores en conflicto (crecimiento y cuidado familiar), reconocer que ambos son legítimos, y elegir consciente cuál ordena esta etapa — declarándolo",
            "Esperar a que la situación se resuelva sola",
          ],
          correct: 2,
          explain:
            "La parálisis suele venir de tratar el dilema como si tuviera una respuesta «correcta» oculta. No la tiene: hay dos valores legítimos compitiendo. El movimiento es nombrarlos, elegir cuál manda en esta etapa (no para siempre) y declarar la elección — con el costo asumido en vez de negado. Elegir con los ojos abiertos duele distinto que perder por deriva.",
        },
        {
          kind: "reflect",
          prompt:
            "Detectá tus valores con las dos lecturas: ¿qué te indignó o enorgulleció fuerte en el último mes (lectura interna)? ¿A qué le diste tiempo y recursos reales (lectura externa)? Nombrá tus 3 valores más activos — los practicados, no los del póster.",
          placeholder: "Me indignó/enorgulleció… → valor: … / Mi agenda muestra… / Mis 3: …",
          insight:
            "Compará tu lista con la que hubieras escrito de memoria («mis valores son…»): casi siempre difieren, y esa diferencia es oro. No para castigarte — para decidir: ¿cierro la brecha acercando mi agenda a lo que declaro, o actualizo honestamente mi declaración? Ambas son legítimas. Lo único caro es seguir viviendo en la brecha sin verla.",
        },
      ],
    },
    {
      id: "sistema-creencias",
      title: "El sistema de creencias",
      description:
        "Las creencias son los anteojos que no ves: una red de juicios congelados como «así es el mundo» — que fabrica su propia evidencia.",
      exercises: [
        {
          kind: "concept",
          title: "Los anteojos que no sabés que tenés puestos",
          body:
            "Una creencia es un juicio que se congeló como verdad: «pedir ayuda es molestar», «la gente falla si no la controlás», «sin sufrimiento no hay logro», «yo no soy creativo». No las vivís como opiniones — las vivís como el mundo. Y no vienen solas: forman un sistema, una red donde unas sostienen a otras, tejida con lo que heredaste de tu familia, tu cultura, tu época, y con generalizaciones de experiencias intensas (a veces una sola, vivida a los ocho años, legislando tu vida a los cuarenta).\n\nLo decisivo es cómo se mantienen: por el loop de autoconfirmación. La creencia filtra qué evidencia ves (escalera de inferencias), el filtro define qué acciones tomás o evitás, la acción produce resultados que — oh, casualidad — confirman la creencia. «No sirvo para vender» → ni lo intento → no vendo nada → «¿viste? no sirvo». La creencia fabricó su propia evidencia sin tocar nunca el mundo.\n\nDos aclaraciones importantes. Primera: hay creencias habilitantes («puedo aprender lo que necesite», «el error es información») — el objetivo no es vivir sin creencias sino elegirlas mejor. Segunda: las limitantes no son estupidez — casi siempre fueron soluciones inteligentes a un problema que ya no existe. «No confíes» protegió a un chico; hoy aísla a un adulto. Merecen gratitud… y jubilación.",
          diagram: "loop-creencia",
          example:
            "«Si muestro que no sé, me descartan» — nacida en una primera oficina hostil hace 15 años. Hoy le impide hacer preguntas, la hace llegar agotada de fingir, y como nunca pregunta, nunca comprueba que su equipo actual celebraría sus preguntas. El loop, intacto desde 2011.",
        },
        {
          kind: "choice",
          question: "¿Cómo se forma típicamente una creencia limitante?",
          options: [
            "Por un defecto de nacimiento en la forma de pensar",
            "Por generalización de experiencias intensas + voces heredadas (familia, cultura), congeladas después como «así es el mundo»",
            "Por leer demasiados libros",
            "Al azar, sin ninguna historia detrás",
          ],
          correct: 1,
          explain:
            "Toda creencia tiene biografía: una experiencia que dolió, una frase repetida en casa, una regla del ambiente donde creciste. Fue una conclusión razonable en su contexto — el problema es que el cartel quedó puesto cuando el contexto cambió. Por eso la primera pregunta transformadora es histórica: ¿cuándo y dónde aprendí esto?",
        },
        {
          kind: "classify",
          prompt: "¿Creencia habilitante o limitante? Escuchá qué abre y qué cierra cada una.",
          categories: ["Habilitante (abre acción)", "Limitante (cierra acción)"],
          items: [
            { text: "«Puedo aprender lo que necesite, con tiempo y práctica»", cat: 0 },
            { text: "«Si pido ayuda, molesto»", cat: 1 },
            { text: "«El error es información para la próxima»", cat: 0 },
            { text: "«Mostrarse vulnerable es peligroso»", cat: 1 },
            { text: "«Si no sale perfecto, mejor no mostrarlo»", cat: 1 },
            { text: "«Un desacuerdo bien conversado mejora la relación»", cat: 0 },
          ],
          explain:
            "El test no es si la creencia es «positiva» o «negativa» sino qué hace con tu repertorio: la habilitante ensancha lo que intentás; la limitante lo achica. Ojo: una creencia limitante puede sonar prudente y adulta («mejor no mostrarlo») — su costo se mide en lo que dejás de hacer, no en cómo suena.",
        },
        {
          kind: "match",
          prompt: "Toda creencia limitante cobra un precio. Uní cada una con su costo típico.",
          pairs: [
            { left: "«Pedir es molestar»", right: "Sobrecarga crónica y resentimiento silencioso" },
            { left: "«La gente falla si no la controlás»", right: "Micromanagement y equipos que no crecen" },
            { left: "«Sin sufrimiento no hay logro»", right: "Burnout — y desprecio por lo que sale fácil" },
            { left: "«No soy creativo»", right: "Ideas que mueren sin ser ofrecidas" },
            { left: "«Si muestro que no sé, me descartan»", right: "Preguntas no hechas; aprendizaje congelado" },
          ],
          explain:
            "Las creencias no son inofensivas: cada una factura en acciones no tomadas, vínculos empobrecidos y energía gastada en protegerse. Hacer visible el costo es la palanca número uno de la transformación — nadie suelta una creencia por «incorrecta»; la suelta cuando ve lo que le está cobrando.",
        },
        {
          kind: "truefalse",
          statement:
            "Si una creencia tiene años de evidencia acumulada a su favor, entonces ya no es una creencia: es un hecho.",
          correct: false,
          explain:
            "Esa «evidencia» es sospechosa: el loop la fabricó. La creencia filtró qué viste, decidió qué intentaste y qué no, e interpretó cada resultado a su favor. Años de evidencia filtrada no equivalen a un hecho — equivalen a un filtro viejo. El test honesto es otro: ¿qué pasaría si actuara distinto? Y eso solo se responde actuando.",
        },
        {
          kind: "choice",
          question:
            "Si las creencias limitantes salen tan caras, ¿por qué las sostenemos durante décadas?",
          options: [
            "Por simple falta de inteligencia",
            "Porque siempre son 100% ciertas",
            "Porque pagan un beneficio oculto: protegen de un riesgo temido, sostienen una identidad conocida o mantienen una pertenencia",
            "Porque es imposible cambiarlas",
          ],
          correct: 2,
          explain:
            "Toda creencia que sobrevive está pagando algo: «no intento» me protege del fracaso; «soy el que sabe» me da identidad; «acá todos pensamos así» me da tribu. La transformación honesta no ignora ese beneficio — lo nombra y pregunta: ¿puedo conseguir esta protección de una forma que no me cueste tanto?",
        },
        {
          kind: "reflect",
          prompt:
            "Elegí UNA creencia limitante tuya (si dudás, buscá tus «yo no soy…», «no se puede…», «la gente es…»). Escribí: ¿de quién o de qué experiencia la heredaste? ¿De qué te protege hoy? ¿Qué te está cobrando?",
          placeholder: "Mi creencia: … / La aprendí de… / Me protege de… / Me cuesta…",
          insight:
            "Acabás de hacer visible el sistema completo: origen, beneficio y costo. Fijate si al escribir el origen apareció una escena o una voz concreta — es lo habitual, y es revelador: eso que vivías como «el mundo» tiene autor, fecha y lugar. Guardá esta creencia: en la próxima lección la pasás por la caja de herramientas de transformación, paso a paso.",
        },
      ],
    },
    {
      id: "transformar-creencias",
      title: "Transformar creencias: la caja de herramientas",
      description:
        "Cinco herramientas encadenadas para jubilar una creencia limitante: detectar, examinar, facturar, rediseñar y practicar con experimentos.",
      exercises: [
        {
          kind: "concept",
          title: "Las cinco herramientas, encadenadas",
          body:
            "Transformar una creencia no es taparla con frases positivas: es un proceso con herramientas concretas, que encadena todo lo que ya practicaste en el programa.\n\n1 · Detectar: cazarla en tu lenguaje. Las señales: «siempre», «nunca», «yo soy así», «no se puede», «la gente es…». Cuando aparecen, hay una creencia hablando en tu nombre. 2 · Examinar: llevarla al tribunal del juicio (capítulo 3) — ¿qué hechos la fundan? ¿en qué dominio vale de verdad? ¿busqué contraevidencia? 3 · Facturar: hacer el balance — ¿qué me da sostenerla (protección, identidad, pertenencia)? ¿qué me cobra (acciones, vínculos, energía)? ¿La sigo eligiendo a este precio? 4 · Rediseñar: escribir una creencia puente — no la afirmación grandiosa que tu sistema va a escupir («¡soy un orador brillante!») sino la creencia honesta y fundada que sí podés sostener: «hablar en público se aprende; con práctica, mejoro». 5 · Practicar: la única evidencia que convence al sistema es la experiencia nueva. Experimentos chicos, con fecha y condiciones de satisfacción (¡capítulo 4!): «esta semana hago una pregunta en la reunión del jueves». Registrás qué pasó, y cada resultado alimenta la creencia nueva.\n\nEl principio de fondo: las creencias no se derrotan discutiendo — se reemplazan actuando. El loop se rompe por la acción, porque la acción es lo único que trae datos que el filtro viejo no fabricó.",
          example:
            "Creencia: «si delego, sale mal». Detectada en «acá el único que…». Examinada: 2 hechos viejos, 0 contraejemplos buscados. Factura: protege de sustos, cuesta 60 horas semanales. Puente: «delegando con condiciones claras, la mayoría de las cosas salen». Experimento: delegar el reporte del lunes con condiciones de satisfacción escritas — y mirar el resultado real.",
        },
        {
          kind: "match",
          prompt: "Uní cada herramienta con la pregunta que la activa.",
          pairs: [
            { left: "1 · Detectar", right: "¿Dónde dije «siempre», «nunca», «yo soy así», «no se puede»?" },
            { left: "2 · Examinar", right: "¿Qué hechos la fundan, en qué dominio, y busqué lo contrario?" },
            { left: "3 · Facturar", right: "¿Qué me da sostenerla y qué me está cobrando?" },
            { left: "4 · Rediseñar", right: "¿Cuál es la creencia honesta y fundada que sí puedo sostener?" },
            { left: "5 · Practicar", right: "¿Qué experimento chico, con fecha, me trae evidencia nueva?" },
          ],
          explain:
            "Cinco preguntas que podés hacerte solo, en un cuaderno, en 20 minutos — o acompañando a otro como coach. El orden importa: rediseñar sin examinar produce afirmaciones huecas; practicar sin facturar se abandona a la primera incomodidad, porque el beneficio oculto sigue mandando.",
        },
        {
          kind: "choice",
          question:
            "Para «no sirvo para hablar en público», ¿cuál es una buena creencia puente (herramienta 4)?",
          options: [
            "«Soy un orador nato y brillante» (repetido cada mañana frente al espejo)",
            "«Hablar en público es una habilidad que se entrena; hoy soy principiante y con práctica mejoro»",
            "«Da igual, hablar en público está sobrevalorado»",
            "«Nunca más voy a exponerme a esa situación»",
          ],
          correct: 1,
          explain:
            "La creencia puente tiene que pasar tu propio detector de mentiras: «soy brillante» es rechazada al instante porque tu sistema tiene evidencia en contra. «Soy principiante y se entrena» es honesta, está fundada (las habilidades se entrenan — hay evidencia universal) y abre acción. Las otras dos opciones son la misma creencia vieja con disfraz: evitación con argumento.",
        },
        {
          kind: "classify",
          prompt:
            "Herramienta 5: ¿el movimiento genera evidencia nueva, o deja todo igual con apariencia de avance?",
          categories: ["Experimento (evidencia nueva)", "Deja todo igual"],
          items: [
            { text: "Hacer UNA pregunta en la reunión del jueves y anotar qué pasó de verdad", cat: 0 },
            { text: "Leer el cuarto libro sobre confianza sin cambiar ninguna conducta", cat: 1 },
            { text: "Delegar una tarea chica con condiciones de satisfacción y revisar el resultado", cat: 0 },
            { text: "Esperar a «sentirme seguro» para empezar", cat: 1 },
            { text: "Pedir a alguien de confianza que registre si lo que temo ocurre de verdad", cat: 0 },
            { text: "Prometerte que «el año que viene sí» por quinto año consecutivo", cat: 1 },
          ],
          explain:
            "El criterio: ¿este movimiento puede sorprenderme — traer un dato que mi filtro no fabricó? Leer, esperar y prometer son rumia con buena prensa: la creencia queda intacta. El experimento chico, con fecha y registro, es el único formato que le mete datos frescos al sistema.",
        },
        {
          kind: "truefalse",
          statement:
            "Para transformar una creencia limitante alcanza con repetir afirmaciones positivas con suficiente convicción.",
          correct: false,
          explain:
            "El sistema de creencias no es tonto: rechaza las afirmaciones que contradicen su evidencia (y hasta se refuerza — «ni yo me lo creo»). Lo que sí lo actualiza es la experiencia nueva interpretada: actuar distinto en chico, registrar lo que realmente pasó, y dejar que los datos frescos funden la creencia puente. Cambio de creencias sin cambio de conducta es decoración.",
        },
        {
          kind: "choice",
          question:
            "Diseñá el experimento: la creencia es «si digo que no, me van a dejar de lado». ¿Cuál es el mejor primer experimento?",
          options: [
            "Decir que no a todo durante un mes, para probar de una vez",
            "No decir que no nunca más, por las dudas",
            "Elegir UN pedido de bajo riesgo esta semana, declinarlo con honestidad («esta semana no puedo tomarlo»), y registrar qué pasa de verdad con la relación",
            "Preguntarle a todo el mundo si lo dejarían de lado hipotéticamente",
          ],
          correct: 2,
          explain:
            "Anatomía del buen experimento: chico (un pedido, no todos), de bajo riesgo (elegido a propósito), concreto (esta semana, frase preparada) y con registro del resultado real. El «no a todo por un mes» es el error clásico: apuesta máxima, primer roce doloroso, y la creencia vieja vuelve con intereses: «¿viste que tenía razón?».",
        },
        {
          kind: "reflect",
          prompt:
            "Tomá la creencia que trabajaste en la lección anterior y pasala por las 5 herramientas, por escrito: 1) ¿en qué frases tuyas vive? 2) ¿qué hechos/contraevidencia? 3) ¿beneficio y costo? 4) tu creencia puente honesta. 5) UN experimento chico con fecha de esta semana.",
          placeholder: "1 Vive en: … / 2 Hechos: … / 3 Me da…, me cuesta… / 4 Puente: … / 5 Experimento: … el día …",
          insight:
            "Lo que tenés adelante es un plan de transformación completo — no inspiración: ingeniería. El punto 5 es el único que cambia algo: los otros cuatro preparan el terreno para que el experimento ocurra y para que su resultado se interprete a favor de la creencia nueva. Cuando lo hagas, volvé a esta nota (quedó guardada en tu cuaderno) y anotá qué pasó de verdad: esa anotación es la primera evidencia del sistema nuevo.",
        },
      ],
    },
  ],
};
