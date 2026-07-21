import type { Chapter } from "../types";

/**
 * Capítulo 4 — Coordinar acciones.
 * Pedidos, ofertas y promesas: el ciclo de la promesa y el reclamo productivo.
 */
export const cap4: Chapter = {
  slug: "coordinar-acciones",
  title: "Coordinar acciones",
  subtitle: "Pedidos, ofertas y promesas",
  description:
    "Casi todo lo que falla en los equipos falla acá: pedidos difusos, promesas que nadie hizo pero todos esperan, reclamos que llegan como reproches. La mecánica fina de comprometerse.",
  icon: "🤝",
  readings: [
    {
      title: "Conversaciones para la acción",
      author: "Fernando Flores",
      note: "El ciclo de la promesa y la coordinación de acciones, por quien lo llevó del seminario filosófico a las organizaciones.",
    },
    {
      title: "Ontología del Lenguaje",
      author: "Rafael Echeverría",
      note: "Los capítulos sobre pedidos, ofertas y promesas — y el juicio de confiabilidad que se construye cumpliéndolas.",
    },
    {
      title: "Metamanagement (Tomo 2: Aplicaciones)",
      author: "Fredy Kofman",
      note: "Pedidos, promesas, reclamos productivos y disculpas efectivas en el día a día de un equipo, paso a paso.",
    },
  ],
  lessons: [
    {
      id: "pedidos",
      title: "Anatomía de un pedido",
      description:
        "Orador, oyente, condiciones de satisfacción y plazo: los pedidos incompletos fabrican los malentendidos.",
      exercises: [
        {
          kind: "concept",
          title: "El pedido: la herramienta más subestimada",
          body:
            "Casi todo lo que lográs en la vida lo lográs con otros — y la pieza que conecta tu necesidad con la acción de otro es el pedido. Un pedido completo tiene anatomía precisa: un orador que se hace cargo («yo te pido», no «se necesita»), un oyente determinado (una persona con nombre, no «alguien debería»), condiciones de satisfacción observables (¿qué contaría exactamente como cumplido?), un plazo (sin «para cuándo» no hay incumplimiento posible) y un trasfondo compartido (¿entendemos lo mismo por «pronto», por «revisar», por «mejorarlo»?).\n\nCuando falta una pieza, no hay pedido: hay una expresión de deseo flotando en el aire. Y como nadie la aceptó, nadie la incumple — pero vos igual te resentís cuando no ocurre.\n\nDetrás del no-pedir suele haber juicios maestros: «pedir es molestar», «pedir es quedar débil», «deberían darse cuenta solos». El costo es triple: te sobrecargás, resentís, y privás al otro de la chance de ayudarte.",
          example:
            "Difuso: «estaría bueno documentar esto». Completo: «Ana, ¿podés escribir el README de este módulo — instalación y los 3 endpoints — para el jueves a las 15?». El primero es un anhelo; el segundo, coordinación.",
        },
        {
          kind: "match",
          prompt: "Uní cada elemento de un pedido bien hecho con su pregunta.",
          pairs: [
            { left: "Orador comprometido", right: "¿Quién pide? (no «se necesita», sino «yo te pido»)" },
            { left: "Oyente determinado", right: "¿A quién exactamente? («alguien debería» no obliga a nadie)" },
            { left: "Condiciones de satisfacción", right: "¿Qué, concretamente, contaría como cumplido?" },
            { left: "Plazo", right: "¿Para cuándo? (sin tiempo no hay incumplimiento posible)" },
            { left: "Trasfondo de obviedad compartido", right: "¿Ambos entendemos lo mismo por las palabras usadas?" },
          ],
          explain:
            "Un pedido sin oyente es una expresión de deseo; sin condiciones de satisfacción, una apuesta a la telepatía; sin plazo, un «alguna vez» que no compromete. La mayoría de los «me falló» empieza en un pedido que nunca se terminó de hacer.",
        },
        {
          kind: "choice",
          question:
            "En la daily alguien dice: «estaría bueno que alguien mire el bug de login». Tres días después, nadie lo miró. ¿Qué pasó?",
          options: [
            "El equipo es irresponsable",
            "Nunca hubo pedido: no hubo oyente determinado, ni condiciones, ni plazo — solo un deseo flotando",
            "El bug era imposible de resolver",
            "Faltó una herramienta de tickets",
          ],
          correct: 1,
          explain:
            "«Estaría bueno que alguien…» no compromete a nadie. Compará con: «Ana, ¿podés reproducir el bug de login y comentarlo en el ticket antes del jueves?». Mismo contenido, otro acto lingüístico — y otra probabilidad de que ocurra.",
        },
        {
          kind: "classify",
          prompt: "¿Pedido completo o pedido difuso? Clasificá.",
          categories: ["Pedido completo", "Difuso: falta algo esencial"],
          items: [
            { text: "«¿Me revisás el PR 142 hoy antes de las 17, mirando sobre todo el manejo de errores?»", cat: 0 },
            { text: "«Habría que documentar mejor esto»", cat: 1 },
            { text: "«Cuando puedas, dale una mirada al informe»", cat: 1 },
            { text: "«Luis, ¿me mandás el CSV de ventas de junio mañana antes del mediodía?»", cat: 0 },
            { text: "«Necesitamos más compromiso con la calidad»", cat: 1 },
          ],
          explain:
            "«Cuando puedas», «habría que» y «necesitamos más X» no tienen oyente, condiciones ni plazo. No son pedidos: son expresiones de anhelo. Nadie los incumple porque nadie los aceptó.",
        },
        {
          kind: "truefalse",
          statement:
            "Si el otro no me entendió, la responsabilidad es enteramente suya: yo dije lo que había que decir.",
          correct: false,
          explain:
            "El pedido vive en la escucha del otro, no en mi emisión. Chequear qué entendió («¿qué te llevás como acordado?») es parte de pedir bien. «Yo lo dije» es consuelo de orador; la coordinación exitosa se mide en la interpretación compartida.",
        },
        {
          kind: "choice",
          question:
            "¿Por qué a muchas personas les cuesta tanto pedir?",
          options: [
            "Porque pedir es de mala educación",
            "Por juicios maestros: «pedir es molestar», «pedir es deber un favor», «si pido, quedo débil o incompetente»",
            "Porque los pedidos son gramaticalmente complejos",
            "Porque nunca hay nada para pedir",
          ],
          correct: 1,
          explain:
            "Detrás del no-pedir suele haber juicios del capítulo anterior. El costo es enorme: quien no pide se sobrecarga, resiente («deberían darse cuenta») y priva al otro de la chance de ayudar. Pedir es un acto de coordinación, no de mendicidad.",
        },
        {
          kind: "reflect",
          prompt:
            "Pensá en algo que necesitás hace semanas y no pediste (ayuda, un recurso, un cambio de conducta de alguien). Escribí el pedido completo: a quién, qué exactamente, para cuándo.",
          placeholder: "Le pido a… que… antes de…",
          insight:
            "Ya tenés el pedido redactado — lo que queda es decidir si lo hacés. Si algo se resiste adentro, escuchá ese freno: ahí hay un juicio («va a pensar que…», «no corresponde…»). El pedido escrito y no dicho te muestra con precisión cuál es tu verdadero obstáculo, y no es gramatical.",
        },
      ],
    },
    {
      id: "promesas",
      title: "Promesas y el ciclo del compromiso",
      description:
        "Una promesa une dos actos: alguien pide u ofrece, alguien acepta. Después empieza la parte difícil.",
      exercises: [
        {
          kind: "concept",
          title: "El ciclo de la promesa",
          body:
            "Una promesa nace cuando un pedido (o una oferta) encuentra una aceptación. Sin aceptación explícita no hay promesa — hay una expectativa unilateral, que es la materia prima de la mayoría de los conflictos: «yo pensé que ibas a…» / «yo nunca dije que…».\n\nEl compromiso vive un ciclo de cuatro fases, y las cuatro fallan seguido: en la creación, pedidos difusos; en la negociación, el «sí» automático de quien no chequeó su agenda (frente a un pedido siempre tenés cuatro respuestas honrosas: aceptar, declinar, contraofertar o pedir tiempo para responder); en la realización, desaparecer en silencio cuando el compromiso entra en riesgo; en la evaluación, no cerrar nunca — ni «recibido, gracias» ni reclamo.\n\nLa confianza — tuya, de un equipo, de una marca — no se construye con intenciones: se construye con ciclos de promesa bien cerrados, uno tras otro. Impecabilidad no es infalibilidad; es hacerse cargo en cada fase.",
          diagram: "ciclo-promesa",
          example:
            "El miércoles ves que no llegás con la entrega del viernes. Impecable: avisás el miércoles y renegociás. Fatal: entregás tarde el lunes «pidiendo mil disculpas». El problema de agenda era gratis; el silencio convirtió el problema en desconfianza.",
        },
        {
          kind: "choice",
          question: "¿Cuándo nace exactamente una promesa?",
          options: [
            "Cuando alguien hace un pedido",
            "Cuando el oyente acepta el pedido (o el orador acepta la oferta): pedido u oferta + aceptación",
            "Cuando se firma un contrato escrito",
            "Cuando el trabajo se termina",
          ],
          correct: 1,
          explain:
            "Promesa = pedido/oferta + declaración de aceptación. Sin aceptación explícita no hay promesa — hay expectativa unilateral. Cuántos conflictos vienen de promesas que uno cree que existen y el otro nunca hizo.",
        },
        {
          kind: "match",
          prompt: "Uní cada fase del ciclo de la promesa con lo que pasa en ella.",
          pairs: [
            { left: "Creación", right: "Pedido u oferta: se articulan condiciones y plazo" },
            { left: "Negociación", right: "El otro acepta, declina, contra-ofrece o pide aplazar la respuesta" },
            { left: "Realización", right: "Se ejecuta lo prometido (y se avisa a tiempo si peligra)" },
            { left: "Evaluación y cierre", right: "Quien pidió declara satisfacción (o reclama); el ciclo se cierra" },
          ],
          explain:
            "El ciclo tiene cuatro fases y las cuatro fallan seguido: pedidos difusos (creación), aceptar sin evaluar capacidad (negociación), desaparecer ante el problema (realización) y no declarar nunca «recibido, gracias» (cierre).",
        },
        {
          kind: "truefalse",
          statement:
            "Frente a un pedido, las únicas respuestas legítimas son «sí» o el silencio.",
          correct: false,
          explain:
            "Hay al menos cuatro respuestas honrosas: aceptar, declinar, contra-ofrecer («el jueves no, el viernes sí») o comprometerse a responder luego («te confirmo a las 15»). El silencio y el «sí» automático son las respuestas que destruyen confianza — el «no» honesto la construye.",
        },
        {
          kind: "choice",
          question:
            "Prometiste entregar el viernes. El miércoles ves que no llegás. ¿Qué exige la impecabilidad del compromiso?",
          options: [
            "Trabajar en silencio y entregar tarde pidiendo perdón después",
            "Avisar recién el viernes a última hora",
            "Avisar el miércoles mismo, renegociar plazo o alcance, y hacerme cargo de los costos que mi cambio genera al otro",
            "No decir nada: quizás el otro se olvidó",
          ],
          correct: 2,
          explain:
            "Impecabilidad no es infalibilidad: es hacerse cargo. Renegociar a tiempo preserva la confianza porque le da al otro la chance de reorganizarse. El silencio hasta el final convierte un problema de agenda en un problema de confiabilidad — mucho más caro.",
        },
        {
          kind: "classify",
          prompt: "¿Construye o destruye confianza? Clasificá cada conducta.",
          categories: ["Construye confianza", "Destruye confianza"],
          items: [
            { text: "Decir «no puedo tomar esto ahora» al recibir el pedido", cat: 0 },
            { text: "Decir «sí» a todo y cumplir la mitad", cat: 1 },
            { text: "Avisar apenas un compromiso entra en riesgo", cat: 0 },
            { text: "Prometer sin chequear la propia agenda", cat: 1 },
            { text: "Renegociar plazo antes del vencimiento", cat: 0 },
            { text: "Dar por sobreentendido que «obvio que no llegaba»", cat: 1 },
          ],
          explain:
            "La confianza se funda en juicios de sinceridad, competencia y confiabilidad — y se alimenta de la gestión de promesas, no de las intenciones. El «sí» fácil es el gran destructor silencioso: cada incumplimiento cotiza.",
        },
        {
          kind: "reflect",
          prompt:
            "Hacé tu inventario de promesas: anotá 3 compromisos que tenés vigentes con otros. Para cada uno: ¿está claro qué y para cuándo? ¿Está en riesgo? ¿Lo sabe el otro?",
          placeholder: "1. Prometí… a… para… — estado: …",
          insight:
            "Ese incomodo que quizás sentiste al listar es información: las promesas vagas o en riesgo silencioso son deuda de confianza acumulando interés. Una conversación de renegociación de cinco minutos hoy vale más que la mejor disculpa del mes que viene. Tu identidad pública —«confiable» o no— se está escribiendo en ese inventario.",
        },
      ],
    },
    {
      id: "reclamos",
      title: "El reclamo productivo",
      description:
        "Cuando una promesa se incumple, hay dos caminos: el reproche que envenena o el reclamo que repara.",
      exercises: [
        {
          kind: "concept",
          title: "Reclamo productivo vs reproche",
          body:
            "Cuando una promesa se incumple, tenés tres opciones: tragarte el incumplimiento (y fabricar resentimiento), reprochar («sos un irresponsable» — un juicio a la identidad que invita a la defensa) o reclamar productivamente.\n\nEl reclamo productivo es pura técnica de este programa, en cinco pasos: afirmar el hecho («acordamos X para el viernes; hoy es martes y no lo recibí»), verificar la promesa («¿coincidís en que ese era el acuerdo?»), declarar el daño («me dejó sin insumo para el reporte»), pedir reparación («¿podés mandarlo mañana antes de las 12?») y recomponer a futuro («¿qué acordamos para que no se repita?»). Cero adjetivos sobre la persona; todo sobre la promesa.\n\nReclamar bien es un acto de cuidado del vínculo: el incumplimiento no reclamado no desaparece — se entierra, fermenta y reaparece como juicio silencioso que gobierna la relación desde las sombras.",
          example:
            "Reproche: «como siempre, no se puede contar con vos» (generaliza, ataca, escala). Reclamo: «quedamos en revisar esto juntos ayer y no apareciste; me trabó el avance. ¿Podemos hoy a las 15? ¿Y qué hacemos distinto la próxima?» (repara).",
        },
        {
          kind: "choice",
          question:
            "¿Qué diferencia a un reclamo productivo de un reproche?",
          options: [
            "El volumen de voz",
            "El reclamo se apoya en una promesa incumplida verificable y busca reparar y recomponer la coordinación; el reproche descarga un juicio sobre la persona",
            "El reclamo se hace por escrito",
            "Nada: son sinónimos",
          ],
          correct: 1,
          explain:
            "«Quedamos en X para el viernes y no ocurrió: ¿qué pasó y cómo lo reparamos?» es un reclamo. «Sos un irresponsable» es un reproche: ataca la identidad, invita a la defensa y deja la coordinación peor que antes.",
        },
        {
          kind: "match",
          prompt: "Uní cada paso del reclamo productivo con su formulación.",
          pairs: [
            { left: "1 · Afirmar el hecho", right: "«Acordamos la entrega el viernes 10; hoy es martes 14 y no la recibí»" },
            { left: "2 · Verificar la promesa", right: "«¿Coincidís en que ese era el acuerdo?»" },
            { left: "3 · Declarar el daño", right: "«Esto me dejó sin insumo para el reporte del lunes»" },
            { left: "4 · Pedir reparación", right: "«Te pido la entrega mañana antes de las 12, ¿podés?»" },
            { left: "5 · Recomponer a futuro", right: "«¿Qué acordamos para que esto no se repita?»" },
          ],
          explain:
            "Fijate que el reclamo es puro capítulo anterior: afirmaciones (hechos), verificación de la promesa, declaración del daño y un pedido nuevo. Cero adjetivos sobre la persona. Por eso repara en vez de escalar.",
        },
        {
          kind: "truefalse",
          statement:
            "Si no reclamo los incumplimientos, soy más buena onda y la relación se conserva mejor.",
          correct: false,
          explain:
            "El incumplimiento no reclamado no desaparece: se transforma en resentimiento y en un juicio silencioso («con este no se puede contar») que gobierna la relación desde las sombras. El reclamo bien hecho es un acto de cuidado del vínculo, no de agresión.",
        },
        {
          kind: "classify",
          prompt: "¿Reclamo productivo o reproche? Clasificá las frases.",
          categories: ["Reclamo productivo", "Reproche"],
          items: [
            { text: "«Quedamos en revisar esto juntos ayer y no apareciste. Me trabó el avance. ¿Podemos hacerlo hoy a las 15?»", cat: 0 },
            { text: "«Como siempre, no se puede contar con vos»", cat: 1 },
            { text: "«Otra vez lo mismo, sos un desastre»", cat: 1 },
            { text: "«El acuerdo era avisar antes de pushear a main. Se pusheó sin aviso y rompió el build. ¿Qué acordamos de acá en más?»", cat: 0 },
          ],
          explain:
            "«Como siempre» y «sos un desastre» generalizan y atacan identidad — invitan a defenderse, no a reparar. Los reclamos citan la promesa, el hecho, el daño y piden algo concreto. Son incómodos de hacer, pero dejan la relación más fuerte.",
        },
        {
          kind: "choice",
          question:
            "Alguien descubre que vive resentido con un colega «que siempre lo deja colgado». Revisando, nota que nunca le hizo un pedido claro ni un reclamo. ¿Qué muestra el caso?",
          options: [
            "Que el colega es efectivamente el culpable de todo",
            "Que el resentimiento suele crecer donde faltaron los actos lingüísticos: pedidos no hechos, promesas supuestas, reclamos tragados",
            "Que hay que evitar trabajar con otras personas",
            "Que el resentimiento es un fenómeno químico inevitable",
          ],
          correct: 1,
          explain:
            "El resentimiento es muchas veces conversaciones que no ocurrieron, fermentadas. La pregunta ontológica ante el rencor es: ¿qué pedido no hice? ¿qué reclamo me debo? Recuperar esos actos pendientes suele disolver lo que años de queja interna no tocaron.",
        },
        {
          kind: "reflect",
          prompt:
            "¿Con quién tenés un incumplimiento sin reclamar (o un reclamo hecho como reproche que salió mal)? Redactá el reclamo productivo en los 5 pasos: hecho, verificación, daño, reparación, futuro.",
          placeholder: "Hecho: … / ¿Coincidimos?: … / Daño: … / Pido: … / A futuro: …",
          insight:
            "Notá lo que pasó al redactarlo: probablemente la carga emocional bajó y apareció una conversación posible donde antes había solo bronca o evitación. Esa es la potencia de la estructura — no te pide dejar de sentir; te da una forma para que lo que sentís produzca reparación en vez de escalada.",
        },
      ],
    },
  ],
};
