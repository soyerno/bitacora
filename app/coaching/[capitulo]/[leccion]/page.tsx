import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonPlayer from "@/components/coaching/LessonPlayer";
import { PROGRAMA, flatLessonKeys, getLesson } from "@/lib/coaching/programa";

export function generateStaticParams() {
  return PROGRAMA.flatMap((c) =>
    c.lessons.map((l) => ({ capitulo: c.slug, leccion: l.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ capitulo: string; leccion: string }>;
}): Promise<Metadata> {
  const { capitulo, leccion } = await params;
  const found = getLesson(capitulo, leccion);
  if (!found) return {};
  return {
    title: `${found.lesson.title} · ${found.chapter.title} · Coaching Ontológico`,
    description: found.lesson.description,
  };
}

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ capitulo: string; leccion: string }>;
}) {
  const { capitulo, leccion } = await params;
  const found = getLesson(capitulo, leccion);
  if (!found) notFound();
  const { chapter, lesson } = found;

  // Próxima lección en el orden global del programa (para el CTA del cierre).
  const keys = flatLessonKeys();
  const nextKey = keys[keys.indexOf(`${chapter.slug}/${lesson.id}`) + 1];
  const nextHref = nextKey ? `/coaching/${nextKey}` : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        {chapter.icon} {chapter.title}
      </p>
      <h1 className="mb-8 font-display text-2xl font-bold text-ink">{lesson.title}</h1>
      <LessonPlayer
        chapterSlug={chapter.slug}
        lessonId={lesson.id}
        exercises={lesson.exercises}
        chapterHref={`/coaching/${chapter.slug}`}
        nextHref={nextHref}
      />
    </main>
  );
}
