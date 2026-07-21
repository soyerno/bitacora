"use client";

import { useState } from "react";
import Link from "next/link";
import type { Exercise } from "@/lib/coaching/types";
import { XP_LESSON_BONUS, XP_PER_EXERCISE, lessonKey } from "@/lib/coaching/types";
import { useCoachingProgress } from "@/lib/coaching/progress";
import ConceptSlide from "./ConceptSlide";
import OptionsExercise from "./OptionsExercise";
import ClassifyExercise from "./ClassifyExercise";
import MatchExercise from "./MatchExercise";
import ReflectExercise from "./ReflectExercise";
import ExerciseFeedback from "./ExerciseFeedback";
import LessonComplete from "./LessonComplete";

/**
 * Orquestador de una lección estilo Duolingo: barra de progreso arriba,
 * un ejercicio por pantalla, feedback con explicación al comprobar, y
 * pantalla de cierre con XP. El progreso se persiste en localStorage.
 */
export default function LessonPlayer({
  chapterSlug,
  lessonId,
  exercises,
  chapterHref,
  nextHref,
}: {
  chapterSlug: string;
  lessonId: string;
  exercises: Exercise[];
  chapterHref: string;
  nextHref: string | null;
}) {
  const { progress, completeLesson, saveReflection, isDone } = useCoachingProgress();
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; explain: string } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const exercise = exercises[idx];
  const isLast = idx === exercises.length - 1;
  // Las tarjetas de teoría no cuentan para aciertos ni XP: solo lo ejercitado.
  const answerable = exercises.filter((e) => e.kind !== "concept").length;

  function handleAnswered(correct: boolean, explain: string) {
    if (correct) setCorrectCount((c) => c + 1);
    setFeedback({ correct, explain });
  }

  function handleContinue() {
    if (isLast) {
      const alreadyDone = isDone(chapterSlug, lessonId);
      setXpEarned(alreadyDone ? 0 : answerable * XP_PER_EXERCISE + XP_LESSON_BONUS);
      completeLesson(chapterSlug, lessonId, answerable);
      setFinished(true);
    } else {
      setFeedback(null);
      setIdx((i) => i + 1);
    }
  }

  if (finished) {
    return (
      <LessonComplete
        xpEarned={xpEarned}
        correctCount={correctCount}
        total={answerable}
        chapterHref={chapterHref}
        nextHref={nextHref}
      />
    );
  }

  const pct = ((idx + (feedback ? 1 : 0)) / exercises.length) * 100;
  const reflectKey = `${lessonKey(chapterSlug, lessonId)}/${idx}`;

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Link
          href={chapterHref}
          aria-label="Salir de la lección"
          className="text-xl text-muted transition-colors hover:text-ink"
        >
          ✕
        </Link>
        <div
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-3 flex-1 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted">
          {idx + 1}/{exercises.length}
        </span>
      </div>

      {exercise.kind === "concept" && (
        <ConceptSlide key={idx} card={exercise} onContinue={handleContinue} />
      )}
      {exercise.kind === "choice" && (
        <OptionsExercise
          key={idx}
          question={exercise.question}
          options={exercise.options}
          correct={exercise.correct}
          onAnswered={(ok) => handleAnswered(ok, exercise.explain)}
        />
      )}
      {exercise.kind === "truefalse" && (
        <OptionsExercise
          key={idx}
          question={exercise.statement}
          options={["Verdadero", "Falso"]}
          correct={exercise.correct ? 0 : 1}
          onAnswered={(ok) => handleAnswered(ok, exercise.explain)}
        />
      )}
      {exercise.kind === "classify" && (
        <ClassifyExercise
          key={idx}
          exercise={exercise}
          onAnswered={(ok) => handleAnswered(ok, exercise.explain)}
        />
      )}
      {exercise.kind === "match" && (
        <MatchExercise
          key={idx}
          exercise={exercise}
          onAnswered={(ok) =>
            handleAnswered(ok, exercise.explain ?? "Todos los pares unidos. Seguimos.")
          }
        />
      )}
      {exercise.kind === "reflect" && (
        <ReflectExercise
          key={idx}
          exercise={exercise}
          savedText={progress.reflections[reflectKey]}
          onAnswered={(text) => {
            saveReflection(reflectKey, text);
            handleAnswered(true, exercise.insight);
          }}
        />
      )}

      {feedback && (
        <ExerciseFeedback
          correct={feedback.correct}
          explain={feedback.explain}
          isLast={isLast}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
