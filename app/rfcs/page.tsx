import type { Metadata } from "next";
import { getRfcs } from "@/lib/feeds";
import PageShell from "@/components/PageShell";
import Card, {
  CardDescription,
  CardMeta,
  CardTitle,
} from "@/components/Card";
import Pill from "@/components/Pill";

export const metadata: Metadata = {
  title: "RFCs · Erno × MODO",
  description: "Request for Comments técnicos de MODO.",
};

export default async function RfcsPage() {
  const rfcs = await getRfcs();
  return (
    <PageShell title="RFCs" intro={`${rfcs.length} documentos.`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {rfcs.map((r) => (
          <Card key={r.slug} href={r.repo_url}>
            <CardMeta>
              <Pill>RFC-{r.number}</Pill>
              {r.status && <span className="capitalize">{r.status}</span>}
              {r.area && <span>· {r.area}</span>}
            </CardMeta>
            <CardTitle>{r.title}</CardTitle>
            <CardDescription>{r.summary}</CardDescription>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
