import type { Chapter } from "./types";

/**
 * Glosario de distinciones del programa — consulta rápida, agrupada por el
 * capítulo donde cada término se trabaja. `chapter` referencia el slug.
 */
export interface GlossaryTerm {
  term: string;
  def: string;
  chapter: string;
}

export const GLOSARIO: GlossaryTerm[] = [
  // ── El observador ──────────────────────────────────────────────────────
  {
    term: "Coaching ontológico",
    def: "Disciplina que trabaja sobre el modo de ser de la persona (su forma de interpretar, juzgar y emocionarse) y no solo sobre su conducta. Cambiando el observador, cambian las acciones posibles.",
    chapter: "el-observador",
  },
  {
    term: "Observador",
    def: "La forma particular en que cada persona distingue e interpreta el mundo, moldeada por su historia, sus juicios y sus emociones. No vemos las cosas como son: las vemos como somos.",
    chapter: "el-observador",
  },
  {
    term: "Aprendizaje de primer orden",
    def: "Cambiar la acción para mejorar el resultado, sin tocar la mirada: practicar más, probar otra técnica. Útil, hasta que «más de lo mismo» deja de alcanzar.",
    chapter: "el-observador",
  },
  {
    term: "Aprendizaje de segundo orden",
    def: "Cambiar el observador que soy: revisar la interpretación desde la que actúo, para que aparezcan acciones antes invisibles. El territorio propio del coaching.",
    chapter: "el-observador",
  },
  {
    term: "Enemigos del aprendizaje",
    def: "Actitudes que bloquean el aprender: el «ya lo sé», no poder declarar ignorancia, los juicios de incapacidad («yo no soy de los que…»), el «no tengo tiempo» crónico y no tolerar la torpeza del principiante.",
    chapter: "el-observador",
  },
  // ── El lenguaje ────────────────────────────────────────────────────────
  {
    term: "Acto lingüístico",
    def: "Unidad básica del hablar entendido como acción: afirmaciones, declaraciones, juicios, pedidos, ofertas y promesas. Cada acto compromete algo distinto y se juega con reglas distintas.",
    chapter: "lenguaje-generativo",
  },
  {
    term: "Afirmación",
    def: "Descripción comprometida con la evidencia: cualquier observador con las mismas distinciones puede verificarla (verdadera o falsa). «El informe tiene 12 páginas». La palabra sigue al mundo.",
    chapter: "lenguaje-generativo",
  },
  {
    term: "Declaración",
    def: "Acto que genera una realidad nueva al ser dicho: «renuncio», «acepto», «basta». No es verdadera ni falsa sino válida o inválida, según la autoridad de quien declara. El mundo sigue a la palabra.",
    chapter: "lenguaje-generativo",
  },
  {
    term: "Declaraciones fundamentales",
    def: "Las cinco declaraciones que sostienen una vida: el «no» (dignidad), el «no sé» (aprendizaje), el «perdón» (cierre del pasado), el «gracias» (vínculo) y el «te quiero» (relación).",
    chapter: "lenguaje-generativo",
  },
  // ── Juicios ────────────────────────────────────────────────────────────
  {
    term: "Hecho vs interpretación",
    def: "El hecho es lo que una cámara habría grabado; la interpretación es el sentido que el observador le agrega. Distinguirlos permite revisar la historia cuando la historia sale cara.",
    chapter: "juicios",
  },
  {
    term: "Escalera de inferencias",
    def: "El recorrido automático de hechos → selección de datos → interpretación → conclusión y acción. Se sube en milisegundos, y las conclusiones filtran qué datos se ven después (loop reflexivo).",
    chapter: "juicios",
  },
  {
    term: "Juicio",
    def: "Interpretación que hace un observador («impuntual», «confiable»). No es verdadero/falso sino fundado/infundado. Habla tanto del juzgado como de los estándares de quien juzga.",
    chapter: "juicios",
  },
  {
    term: "Fundar un juicio",
    def: "Pasarlo por cinco filtros: ¿para qué juzgo?, ¿en qué dominio?, ¿con qué estándares?, ¿con qué hechos?, ¿intenté fundar el juicio contrario?",
    chapter: "juicios",
  },
  {
    term: "Juicio maestro",
    def: "Juicio sobre uno mismo o sobre la vida, congelado como verdad («no sirvo para…», «no se puede confiar»), que gobierna qué intentamos y qué evitamos — sin ser visto como juicio.",
    chapter: "juicios",
  },
  // ── Coordinación ───────────────────────────────────────────────────────
  {
    term: "Pedido",
    def: "Acto que abre coordinación: orador que se hace cargo + oyente determinado + condiciones de satisfacción + plazo + trasfondo compartido. Si falta una pieza, es solo un deseo flotando.",
    chapter: "coordinar-acciones",
  },
  {
    term: "Condiciones de satisfacción",
    def: "Lo que contaría, observablemente, como pedido cumplido. Sin ellas, cada parte imagina un resultado distinto y el conflicto queda sembrado.",
    chapter: "coordinar-acciones",
  },
  {
    term: "Promesa",
    def: "Pedido u oferta + aceptación. Vive un ciclo de cuatro fases: creación, negociación, realización y evaluación/cierre. La confianza se construye cerrando bien esos ciclos.",
    chapter: "coordinar-acciones",
  },
  {
    term: "Impecabilidad",
    def: "No es infalibilidad: es hacerse cargo del compromiso en todas sus fases — incluyendo avisar a tiempo y renegociar cuando la promesa entra en riesgo.",
    chapter: "coordinar-acciones",
  },
  {
    term: "Reclamo productivo",
    def: "Respuesta al incumplimiento en cinco pasos: afirmar el hecho, verificar la promesa, declarar el daño, pedir reparación y recomponer a futuro. Cero adjetivos sobre la persona.",
    chapter: "coordinar-acciones",
  },
  // ── Emociones ──────────────────────────────────────────────────────────
  {
    term: "Emoción",
    def: "Predisposición para la acción con gatillo identificable: algo pasó y algo se movió. Cada emoción abre ciertas acciones y cierra otras.",
    chapter: "emociones",
  },
  {
    term: "Estado de ánimo",
    def: "El clima emocional de fondo, sin evento gatillo, desde el que se vive por semanas o años. Tiñe lo que se observa y define qué futuro se puede ver.",
    chapter: "emociones",
  },
  {
    term: "Grilla de los cuatro ánimos",
    def: "Cruce de facticidad/posibilidad con oposición/apertura: resentimiento, aceptación (paz), resignación y ambición. Los cuatro son juicios — por eso se pueden trabajar.",
    chapter: "emociones",
  },
  {
    term: "Reconstrucción lingüística",
    def: "Hacerle decir a la emoción su juicio: «siento X porque juzgo que Y». Vuelve legible la emoción y permite examinar si su historia está fundada.",
    chapter: "emociones",
  },
  {
    term: "Culpa vs responsabilidad",
    def: "La culpa que paraliza dice «soy» (identidad) y rumia el pasado; la responsabilidad dice «hice» (acción), repara el daño y decide qué hacer distinto.",
    chapter: "emociones",
  },
  {
    term: "Perdón",
    def: "Declaración unilateral que suelta el resentimiento como organizador de la relación con el pasado. No es olvidar, no exige reconciliación ni requiere que el otro lo pida.",
    chapter: "emociones",
  },
  // ── Valores y creencias ────────────────────────────────────────────────
  {
    term: "Valor",
    def: "Aquello que importa al punto de ordenar decisiones. Se lee en las acciones sostenidas (agenda, decisiones, recursos) y en las emociones que se disparan cuando se lo toca.",
    chapter: "valores-creencias",
  },
  {
    term: "Valores declarados vs practicados",
    def: "Lo que digo que me importa vs lo que mis acciones muestran. La brecha entre ambos no es motivo de vergüenza: es el mapa del próximo trabajo.",
    chapter: "valores-creencias",
  },
  {
    term: "Creencia",
    def: "Juicio congelado como verdad («pedir es molestar»), tejido en red con otros y vivido como «así es el mundo». Puede ser habilitante (abre acción) o limitante (la cierra).",
    chapter: "valores-creencias",
  },
  {
    term: "Loop de autoconfirmación",
    def: "La creencia filtra la evidencia, decide qué se intenta, y el resultado la «confirma»: fabrica su propia evidencia sin tocar nunca el mundo.",
    chapter: "valores-creencias",
  },
  {
    term: "Creencia puente",
    def: "Reemplazo honesto y fundado de una creencia limitante — no la afirmación grandiosa, sino la que tu propio sistema puede sostener: «soy principiante y esto se entrena».",
    chapter: "valores-creencias",
  },
  {
    term: "Experimento chico",
    def: "Acción acotada, de bajo riesgo, con fecha y registro del resultado real. El único formato que le mete al sistema de creencias datos que su filtro no fabricó.",
    chapter: "valores-creencias",
  },
  // ── Escucha ────────────────────────────────────────────────────────────
  {
    term: "Escuchar",
    def: "Oír + interpretar. El sentido no viaja en las palabras: lo construye el oyente desde su historia. Entre lo dicho y lo escuchado hay una brecha estructural, que se gestiona verificando.",
    chapter: "escucha",
  },
  {
    term: "Indagación",
    def: "Preguntar para comprender el observador del otro (sus juicios, inquietudes, emociones), no para confirmar la propia hipótesis. Su enemiga: la pseudo-pregunta que ya trae la respuesta.",
    chapter: "escucha",
  },
  {
    term: "Inquietud",
    def: "Aquello que le importa al que habla y lo mueve a hablar; el trasfondo del decir. El escuchar profundo pregunta por ella: ¿de qué te estás ocupando al decirme esto?",
    chapter: "escucha",
  },
  {
    term: "Disposiciones corporales",
    def: "Cuatro modos básicos de habitar el cuerpo — resolución, apertura, estabilidad, flexibilidad — que facilitan (o bloquean) distintas acciones y conversaciones.",
    chapter: "escucha",
  },
  // ── Quiebres ───────────────────────────────────────────────────────────
  {
    term: "Transparencia",
    def: "El fluir no-reflexivo de la acción cotidiana: actuar sin deliberar. La mayor parte de la vida ocurre ahí.",
    chapter: "quiebres",
  },
  {
    term: "Quiebre",
    def: "Interrupción de la transparencia: el juicio de que un hecho afecta lo que me importa. No está en el hecho sino en el observador que lo declara — y es la puerta del aprendizaje.",
    chapter: "quiebres",
  },
  {
    term: "Las cuatro conversaciones",
    def: "Juicios personales (la queja, que procesa emoción pero no mueve nada), coordinación de acciones (pedidos y promesas), posibles acciones (explorar) y posibles conversaciones (habilitar la charla que hoy parece imposible).",
    chapter: "quiebres",
  },
  {
    term: "Autocoaching",
    def: "Aplicarse las distinciones a uno mismo ante un quiebre: ¿qué hechos hay?, ¿qué juicios les monté?, ¿qué emoción me tiene?, ¿qué conversación falta?",
    chapter: "quiebres",
  },
];

/** Términos agrupados por capítulo, en el orden del programa. */
export function glossaryByChapter(chapters: Chapter[]): {
  chapter: Chapter;
  terms: GlossaryTerm[];
}[] {
  return chapters
    .map((chapter) => ({
      chapter,
      terms: GLOSARIO.filter((t) => t.chapter === chapter.slug),
    }))
    .filter((g) => g.terms.length > 0);
}
