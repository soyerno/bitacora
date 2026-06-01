import Link from "next/link";
import { getSectionCount } from "@/lib/feeds";
import { config } from "@/bitacora.config";
import GitHubWidget from "@/components/GitHubWidget";
import FeaturedDecks from "@/components/FeaturedDecks";

export default async function Home() {
  const { developer, sections } = config;
  const counts = await Promise.all(sections.map((s) => getSectionCount(s)));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-display text-4xl font-bold text-ink">
          {config.siteTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {developer.name} · {developer.role} @ MODO — decks, RFCs, R&amp;D y
          herramientas.
        </p>
      </header>

      <FeaturedDecks />

      <GitHubWidget />

      <section aria-labelledby="explore-label">
        <p
          id="explore-label"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted"
        >
          Explorar
        </p>
        <nav
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Secciones"
        >
          {sections.map((s, i) => (
            <Link
              key={s.type}
              href={s.href}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-colors hover:border-accent"
            >
              {s.eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {s.eyebrow}
                </span>
              )}
              <span className="mt-1 font-display text-lg font-bold text-ink group-hover:text-accent">
                {s.label}
              </span>
              {s.description && (
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {s.description}
                </p>
              )}
              <span className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                <span className="tabular-nums">
                  {counts[i]} {s.countSuffix ?? ""}
                </span>
                <span className="font-medium text-accent transition-transform group-hover:translate-x-0.5">
                  Abrir →
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
