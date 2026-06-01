import type { Metadata } from "next";
import { getBitacora } from "@/lib/feeds";
import PageShell from "@/components/PageShell";
import Card, { CardMeta, CardTitle } from "@/components/Card";
import Pill from "@/components/Pill";

export const metadata: Metadata = {
  title: "Bitácora · Erno × MODO",
  description:
    "Digest diario de aprendizajes — TLDR + historias por feature/lección del día. Voz rioplatense, claridad pedagógica estilo Karpathy.",
};

const intro =
  "Digest diario de aprendizajes — una historia por feature o lección del día. TLDR arriba, voz rioplatense con claridad pedagógica estilo Karpathy. La idea es la del LLM Wiki Pattern: escribir lo aprendido para no tener que re-aprenderlo.";

export default async function BitacoraPage() {
  const items = await getBitacora();
  const meta = (
    <>
      {items.length} {items.length === 1 ? "entrada" : "entradas"} · datos crudos en{" "}
      <a
        href="/bitacora/bitacora.json"
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors hover:text-accent"
      >
        bitacora.json
      </a>
    </>
  );

  return (
    <PageShell title="Bitácora" intro={intro} meta={meta}>
      <div className="flex flex-col gap-4">
        {items.map((entry) => (
          <Card key={entry.slug} href={`/bitacora/${entry.slug}.html`}>
            <CardMeta>
              <Pill>
                <time dateTime={entry.date}>{entry.date}</time>
              </Pill>
              {entry.stories?.length ? (
                <span>
                  · {entry.stories.length}{" "}
                  {entry.stories.length === 1 ? "historia" : "historias"}
                </span>
              ) : null}
            </CardMeta>
            <CardTitle size="xl">{entry.title}</CardTitle>
            <p className="mt-2 text-sm text-muted">{entry.tldr}</p>
            {entry.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.tags.slice(0, 6).map((t) => (
                  <Pill key={t} variant="outline">
                    {t}
                  </Pill>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-muted">
            Sin entradas todavía.
          </p>
        )}
      </div>
    </PageShell>
  );
}
