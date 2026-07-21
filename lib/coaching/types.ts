/**
 * Modelo de datos del programa de Coaching Ontológico (sección /coaching).
 * El contenido vive en lib/coaching/capitulos/*.ts; la UI en components/coaching/.
 *
 * Seis tipos de "pantalla" estilo Duolingo:
 *  - concept    → tarjeta de teoría: explica antes de ejercitar (con diagrama opcional)
 *  - choice     → multiple choice clásico
 *  - truefalse  → afirmación a validar
 *  - classify   → repartir items entre dos categorías (ej. hecho vs juicio)
 *  - match      → unir pares concepto ↔ definición
 *  - reflect    → pregunta abierta para pensar; al enviar se revela el insight
 */

/** Diagramas SVG disponibles para las tarjetas de teoría (ver components/coaching/diagrams). */
export type DiagramId =
  | "oar"
  | "actos"
  | "escalera"
  | "grilla-animos"
  | "ciclo-promesa"
  | "escucha"
  | "quiebre";

export interface ConceptCard {
  kind: "concept";
  title: string;
  /** Cuerpo didáctico; los párrafos se separan con "\n\n". */
  body: string;
  /** Ejemplo concreto, se muestra destacado bajo el cuerpo. */
  example?: string;
  diagram?: DiagramId;
}

export interface ChoiceExercise {
  kind: "choice";
  question: string;
  options: string[];
  /** Índice de la opción correcta dentro de `options`. */
  correct: number;
  explain: string;
}

export interface TrueFalseExercise {
  kind: "truefalse";
  statement: string;
  correct: boolean;
  explain: string;
}

export interface ClassifyExercise {
  kind: "classify";
  prompt: string;
  categories: [string, string];
  items: { text: string; cat: 0 | 1 }[];
  explain: string;
}

export interface MatchExercise {
  kind: "match";
  prompt: string;
  pairs: { left: string; right: string }[];
  explain?: string;
}

export interface ReflectExercise {
  kind: "reflect";
  prompt: string;
  placeholder?: string;
  /** Se muestra después de que el usuario escribe: la distinción que buscamos. */
  insight: string;
}

export type Exercise =
  | ConceptCard
  | ChoiceExercise
  | TrueFalseExercise
  | ClassifyExercise
  | MatchExercise
  | ReflectExercise;

export interface Lesson {
  /** Slug único dentro del capítulo (ej. "observador"). */
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

export interface Chapter {
  /** Slug único del capítulo, usado en la URL (ej. "el-observador"). */
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  /** Emoji identificador del capítulo en el mapa del programa. */
  icon: string;
  lessons: Lesson[];
}

/** XP otorgado por ejercicio resuelto y bonus por lección completada. */
export const XP_PER_EXERCISE = 10;
export const XP_LESSON_BONUS = 20;

/** Clave canónica de una lección para el registro de progreso. */
export function lessonKey(chapterSlug: string, lessonId: string): string {
  return `${chapterSlug}/${lessonId}`;
}
