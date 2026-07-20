import type { Metadata } from "next";
import { getProyectos } from "@/lib/feeds";
import PageShell from "@/components/PageShell";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "Proyectos · Erno × MODO",
  description: "Repos y contribuciones por categoría.",
};

export default async function ProyectosPage() {
  const categories = await getProyectos();
  return (
    <PageShell title="Proyectos" intro={`${categories.length} categorías.`}>
      <div className="space-y-10">
        {categories.map((cat) => (
          <section key={cat.id}>
            <div className="mb-4">
              <h2 className="font-display text-xl font-bold text-ink">{cat.name}</h2>
              {cat.desc && <p className="text-sm text-muted">{cat.desc}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.projects.map((p) => (
                <Card key={p.repo} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-ink">
                      {p.repo}
                    </span>
                    {p.language && (
                      <span className="text-xs text-muted">{p.language}</span>
                    )}
                  </div>
                  {p.summary && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{p.summary}</p>
                  )}
                  <div className="mt-3 flex gap-3 text-xs text-muted">
                    {p.merged != null && <span>{p.merged} merged</span>}
                    {p.open != null && <span>{p.open} open</span>}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
