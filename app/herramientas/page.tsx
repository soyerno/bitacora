import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getHerramientas } from "@/lib/feeds";
import PageShell from "@/components/PageShell";
import Pill, { type PillVariant } from "@/components/Pill";

export const metadata: Metadata = {
  title: "Herramientas · Erno × MODO",
  description:
    "Catálogo de skills, MCPs, plugins y herramientas que uso en MODO — descargables y referenciados.",
};

const TAG_LABEL: Record<string, string> = { mcp: "MCP", plugin: "plugin" };
const TAG_VARIANT: Record<string, PillVariant> = {
  mcp: "solid",
  plugin: "outline",
};

function renderDescription(desc: string): ReactNode {
  return desc.split(/(`[^`]+`)/g).map((p, i) =>
    /^`[^`]+`$/.test(p) ? (
      <code key={i} className="rounded bg-bg/60 px-1 py-0.5 font-mono text-[0.85em]">
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export default async function HerramientasPage() {
  const categories = await getHerramientas();
  const total = categories.reduce((acc, c) => acc + c.tools.length, 0);

  const intro = (
    <>
      Skills MODO, MCPs, plugins y herramientas externas que uso en el día a día.
      Las skills MODO se descargan como ZIP — instalar en{" "}
      <code className="rounded bg-surface px-1 py-0.5 font-mono text-[0.85em]">
        ~/.claude/skills/
      </code>
      .
    </>
  );

  const meta = (
    <>
      {total} herramientas · {categories.length} categorías · datos crudos en{" "}
      <a
        href="/herramientas/herramientas.json"
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors hover:text-accent"
      >
        herramientas.json
      </a>
    </>
  );

  return (
    <PageShell title="Herramientas" intro={intro} meta={meta}>
      <div className="flex flex-col gap-10">
        {categories.map((cat) => (
          <section key={cat.id}>
            <h2 className="mb-4 font-display text-xl font-bold text-ink">
              {cat.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.tools.map((t) => (
                <article
                  key={`${cat.id}-${t.name}`}
                  className="flex flex-col rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="font-mono text-sm font-semibold text-ink">
                      {t.name}
                    </code>
                    {t.tags?.map((tag) => (
                      <Pill
                        key={tag}
                        variant={TAG_VARIANT[tag] ?? "outline"}
                        className="uppercase tracking-wide"
                      >
                        {TAG_LABEL[tag] ?? tag}
                      </Pill>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {renderDescription(t.description)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
                    {t.download && (
                      <a
                        href={t.download}
                        download
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-accent-ink transition-colors hover:border-accent hover:bg-accent-light"
                      >
                        ↓ .skill
                      </a>
                    )}
                    {t.external && (
                      <a
                        href={t.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent-ink"
                      >
                        github ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-muted">
            Sin herramientas en el feed. Correr{" "}
            <code className="rounded bg-bg/60 px-1 py-0.5 font-mono">
              node scripts/build-herramientas-json.mjs
            </code>{" "}
            para generar.
          </p>
        )}
      </div>
    </PageShell>
  );
}
