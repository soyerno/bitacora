import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CoachingStats from "@/components/coaching/CoachingStats";
import ProgramMap, { type MapChapter } from "@/components/coaching/ProgramMap";
import {
  PROGRAMA,
  PROGRAMA_TAGLINE,
  PROGRAMA_TITLE,
  totalExercises,
  totalLessons,
} from "@/lib/coaching/programa";

export const metadata: Metadata = {
  title: "Coaching Ontológico · Erno × MODO",
  description:
    "Programa interactivo estilo Duolingo para aprender coaching ontológico: el observador, actos lingüísticos, juicios, promesas, emociones, escucha y quiebres — con ejercicios y reflexiones.",
};

export default function CoachingPage() {
  const chapters: MapChapter[] = PROGRAMA.map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    icon: c.icon,
    lessonKeys: c.lessons.map((l) => `${c.slug}/${l.id}`),
  }));

  return (
    <PageShell
      title={PROGRAMA_TITLE}
      intro={PROGRAMA_TAGLINE}
      meta={`${PROGRAMA.length} capítulos · ${totalLessons()} lecciones · ${totalExercises()} ejercicios · progreso, XP y racha se guardan en tu navegador`}
      maxWidth="max-w-3xl"
    >
      <div className="mb-4">
        <CoachingStats totalLessons={totalLessons()} />
      </div>

      <div className="mb-8 text-right">
        <Link
          href="/coaching/notas"
          className="text-sm font-medium text-accent hover:underline"
        >
          Mi cuaderno de notas 📓 →
        </Link>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        <p>
          <strong className="text-ink">Cómo funciona:</strong> las lecciones se
          desbloquean en orden, como en Duolingo. Cada una mezcla ejercicios de
          opción múltiple, verdadero/falso, clasificar, unir pares y reflexiones
          escritas — porque el coaching ontológico no se memoriza: se piensa. Una
          lección por día alcanza.
        </p>
      </div>

      <ProgramMap chapters={chapters} />
    </PageShell>
  );
}
