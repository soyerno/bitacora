"use client";

/**
 * Progreso del programa de coaching — persistido en localStorage, mismo
 * espíritu que el tema (`modo-decks-theme`): sin backend, el browser es la DB.
 *
 * Implementado como external store (useSyncExternalStore): localStorage es la
 * fuente de verdad, un CustomEvent notifica a todos los componentes montados
 * y el evento `storage` sincroniza entre pestañas. La racha se calcula al
 * completar una lección: hoy ya contaba → igual; ayer fue la última → +1;
 * hubo un hueco → arranca en 1.
 */

import { useCallback, useSyncExternalStore } from "react";
import { XP_LESSON_BONUS, XP_PER_EXERCISE, lessonKey } from "./types";

const STORAGE_KEY = "modo-coaching-progress-v1";
const CHANGE_EVENT = "coaching-progress";

export interface CoachingProgress {
  xp: number;
  /** Claves `capitulo/leccion` de lecciones completadas. */
  done: string[];
  /** Respuestas de ejercicios de reflexión, por clave `capitulo/leccion/idx`. */
  reflections: Record<string, string>;
  /** Notas libres del usuario sobre lo visto, por clave `capitulo/leccion`. */
  notes: Record<string, string>;
  streak: { count: number; last: string | null };
}

const EMPTY: CoachingProgress = {
  xp: 0,
  done: [],
  reflections: {},
  notes: {},
  streak: { count: 0, last: null },
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(iso: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10) === iso;
}

export function loadProgress(): CoachingProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<CoachingProgress>;
    return {
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      done: Array.isArray(parsed.done) ? parsed.done.filter((d) => typeof d === "string") : [],
      reflections:
        parsed.reflections && typeof parsed.reflections === "object"
          ? (parsed.reflections as Record<string, string>)
          : {},
      notes:
        parsed.notes && typeof parsed.notes === "object"
          ? (parsed.notes as Record<string, string>)
          : {},
      streak:
        parsed.streak && typeof parsed.streak.count === "number"
          ? { count: parsed.streak.count, last: parsed.streak.last ?? null }
          : { count: 0, last: null },
    };
  } catch {
    return EMPTY;
  }
}

/** Racha resultante de completar una lección hoy. */
export function nextStreak(streak: CoachingProgress["streak"]): CoachingProgress["streak"] {
  const today = todayISO();
  if (streak.last === today) return streak;
  if (streak.last && isYesterday(streak.last)) return { count: streak.count + 1, last: today };
  return { count: 1, last: today };
}

// ── External store: snapshot cacheado + invalidación por evento ──────────────

let snapshot: CoachingProgress = EMPTY;
let loaded = false;

function getSnapshot(): CoachingProgress {
  if (!loaded) {
    snapshot = loadProgress();
    loaded = true;
  }
  return snapshot;
}

function getServerSnapshot(): CoachingProgress {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  const handler = () => {
    loaded = false; // el próximo getSnapshot re-lee localStorage
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/** Aplica una mutación sobre el estado persistido. `null` = no-op. */
function mutate(fn: (prev: CoachingProgress) => CoachingProgress | null) {
  const next = fn(getSnapshot());
  if (!next) return;
  snapshot = next;
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage lleno o bloqueado: el progreso de la sesión sigue en memoria
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Hook de progreso. En SSR e hidratación devuelve EMPTY (`ready: false`);
 * en el cliente, el estado real de localStorage.
 */
export function useCoachingProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const completeLesson = useCallback(
    (chapterSlug: string, lessonId: string, exerciseCount: number) => {
      mutate((prev) => {
        const key = lessonKey(chapterSlug, lessonId);
        if (prev.done.includes(key)) return null; // repaso: no re-otorga XP
        return {
          ...prev,
          xp: prev.xp + exerciseCount * XP_PER_EXERCISE + XP_LESSON_BONUS,
          done: [...prev.done, key],
          streak: nextStreak(prev.streak),
        };
      });
    },
    [],
  );

  const saveReflection = useCallback((key: string, text: string) => {
    mutate((prev) => ({
      ...prev,
      reflections: { ...prev.reflections, [key]: text },
    }));
  }, []);

  const saveNote = useCallback((key: string, text: string) => {
    mutate((prev) => {
      const notes = { ...prev.notes };
      if (text.trim()) notes[key] = text;
      else delete notes[key]; // nota vaciada → se elimina del cuaderno
      return { ...prev, notes };
    });
  }, []);

  const isDone = useCallback(
    (chapterSlug: string, lessonId: string) =>
      progress.done.includes(lessonKey(chapterSlug, lessonId)),
    [progress.done],
  );

  return { progress, ready, completeLesson, saveReflection, saveNote, isDone };
}
