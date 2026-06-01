import type { Metadata } from "next";
import { getRd } from "@/lib/feeds";
import { toAbsoluteHref } from "@/lib/url";
import PageShell from "@/components/PageShell";
import Card, {
  CardDescription,
  CardMeta,
  CardTitle,
} from "@/components/Card";
import Pill from "@/components/Pill";

export const metadata: Metadata = {
  title: "R&D · Erno × MODO",
  description: "Artículos de investigación y desarrollo.",
};

export default async function RdPage() {
  const items = await getRd();
  return (
    <PageShell title="R&D" intro={`${items.length} artículos.`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((r) => (
          <Card key={r.slug} href={r.href ? toAbsoluteHref(r.href) : undefined}>
            <CardMeta>
              <Pill>R&amp;D-{r.number}</Pill>
              {r.status && <span className="capitalize">{r.status}</span>}
              {r.reading_minutes && <span>· {r.reading_minutes} min</span>}
            </CardMeta>
            <CardTitle>{r.title}</CardTitle>
            <CardDescription>{r.summary}</CardDescription>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
