import type { Metadata } from "next";
import { getSkills } from "@/lib/feeds";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Skills · Erno × MODO",
  description: "Skills MODO para Claude Code — descargables como ZIP.",
};

export default async function SkillsPage() {
  const skills = await getSkills();
  return (
    <PageShell title="Skills" intro={`${skills.length} skills para Claude Code.`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <article
            key={s.name}
            className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
          >
            <h2 className="font-display text-base font-bold text-ink">{s.name}</h2>
            <p className="mt-1 line-clamp-3 text-sm text-muted">{s.description}</p>
            <div className="mt-auto flex items-center justify-between pt-4">
              {s.size_kb != null && (
                <span className="text-xs text-muted">{s.size_kb} kb</span>
              )}
              <a
                href={`/skills/${s.filename}`}
                download
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-accent-ink transition-colors hover:border-accent hover:bg-accent-light"
              >
                Descargar ZIP
              </a>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
