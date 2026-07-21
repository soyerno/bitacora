import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import ChapterPath, { type PathLesson } from "@/components/coaching/ChapterPath";
import { PROGRAMA, flatLessonKeys, getChapter } from "@/lib/coaching/programa";

export function generateStaticParams() {
  return PROGRAMA.map((c) => ({ capitulo: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ capitulo: string }>;
}): Promise<Metadata> {
  const { capitulo } = await params;
  const chapter = getChapter(capitulo);
  if (!chapter) return {};
  return {
    title: `${chapter.title} · Coaching Ontológico`,
    description: chapter.description,
  };
}

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ capitulo: string }>;
}) {
  const { capitulo } = await params;
  const chapter = getChapter(capitulo);
  if (!chapter) notFound();

  const index = PROGRAMA.findIndex((c) => c.slug === chapter.slug);
  const lessons: PathLesson[] = chapter.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    exerciseCount: l.exercises.length,
  }));

  return (
    <PageShell
      title={
        <>
          <span aria-hidden>{chapter.icon}</span> {chapter.title}
        </>
      }
      intro={chapter.description}
      meta={`Capítulo ${index + 1} de ${PROGRAMA.length} · ${chapter.subtitle}`}
      maxWidth="max-w-3xl"
    >
      <div className="mb-6">
        <Link href="/coaching" className="text-sm font-medium text-accent hover:underline">
          ← Volver al programa
        </Link>
      </div>
      <ChapterPath
        chapterSlug={chapter.slug}
        lessons={lessons}
        allKeys={flatLessonKeys()}
      />
    </PageShell>
  );
}
