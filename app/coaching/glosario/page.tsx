import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { PROGRAMA } from "@/lib/coaching/programa";
import { GLOSARIO, glossaryByChapter } from "@/lib/coaching/glosario";

export const metadata: Metadata = {
  title: "Glosario · Coaching Ontológico",
  description:
    "Las distinciones del coaching ontológico en un solo lugar: observador, actos lingüísticos, juicios, promesas, emociones, valores, creencias, escucha y quiebres.",
};

export default function GlosarioPage() {
  const groups = glossaryByChapter(PROGRAMA);

  return (
    <PageShell
      title="Glosario de distinciones 📖"
      intro="Consulta rápida de los términos del programa, agrupados por el capítulo donde se trabajan. Si alguno no te suena, esa es la lección que te conviene repasar."
      meta={`${GLOSARIO.length} distinciones · ${groups.length} capítulos`}
      maxWidth="max-w-3xl"
    >
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link href="/coaching" className="text-sm font-medium text-accent hover:underline">
          ← Volver al programa
        </Link>
        <nav aria-label="Saltar a capítulo" className="flex flex-wrap gap-2 text-xs">
          {groups.map(({ chapter }) => (
            <a
              key={chapter.slug}
              href={`#${chapter.slug}`}
              className="rounded-full border border-border bg-surface px-2.5 py-1 text-muted transition-colors hover:border-accent hover:text-ink"
            >
              {chapter.icon} {chapter.title}
            </a>
          ))}
        </nav>
      </div>

      <div className="grid gap-8">
        {groups.map(({ chapter, terms }) => (
          <section key={chapter.slug} id={chapter.slug} className="scroll-mt-20">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">
                <span aria-hidden>{chapter.icon}</span> {chapter.title}
              </h2>
              <Link
                href={`/coaching/${chapter.slug}`}
                className="shrink-0 text-xs font-medium text-accent hover:underline"
              >
                Ir al capítulo →
              </Link>
            </div>
            <dl className="grid gap-3">
              {terms.map((t) => (
                <div key={t.term} className="rounded-xl border border-border bg-surface p-4">
                  <dt className="font-display font-bold text-ink">{t.term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{t.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
