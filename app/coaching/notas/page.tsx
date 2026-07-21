import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Notebook, { type NotebookChapter } from "@/components/coaching/Notebook";
import { PROGRAMA } from "@/lib/coaching/programa";

export const metadata: Metadata = {
  title: "Mi cuaderno · Coaching Ontológico",
  description:
    "Tus notas y reflexiones del programa de coaching ontológico, agrupadas por capítulo y lección. Todo se guarda en tu navegador.",
};

export default function NotasPage() {
  const chapters: NotebookChapter[] = PROGRAMA.map((c) => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    lessons: c.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      reflects: l.exercises
        .map((e, idx) => (e.kind === "reflect" ? { idx, prompt: e.prompt } : null))
        .filter((r): r is { idx: number; prompt: string } => r !== null),
    })),
  }));

  return (
    <PageShell
      title="Mi cuaderno 📓"
      intro="Tus reflexiones escritas y tus notas por lección, en un solo lugar. Es tu registro personal del recorrido — vive únicamente en tu navegador."
      meta="Notas editables · reflexiones de cada lección · privado (localStorage)"
      maxWidth="max-w-3xl"
    >
      <div className="mb-6">
        <Link href="/coaching" className="text-sm font-medium text-accent hover:underline">
          ← Volver al programa
        </Link>
      </div>
      <Notebook chapters={chapters} />
    </PageShell>
  );
}
