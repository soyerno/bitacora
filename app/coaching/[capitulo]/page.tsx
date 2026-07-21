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
    exerciseCount: l.exercises.filter((e) => e.kind !== "concept").length,
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

      {chapter.readings.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Para profundizar 📚
          </h2>
          <ul className="grid gap-3">
            {chapter.readings.map((r) => (
              <li key={r.title} className="rounded-xl border border-border bg-surface p-4">
                <p className="font-display font-bold text-ink">
                  {r.title} <span className="font-sans text-sm font-normal text-muted">— {r.author}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{r.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
