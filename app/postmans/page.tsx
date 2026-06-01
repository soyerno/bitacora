import type { Metadata } from "next";
import { getPostmans } from "@/lib/feeds";
import { toAbsoluteHref } from "@/lib/url";
import PageShell from "@/components/PageShell";
import Card, {
  CardDescription,
  CardMeta,
  CardTitle,
} from "@/components/Card";
import Pill from "@/components/Pill";

export const metadata: Metadata = {
  title: "Postmans · Erno × MODO",
  description: "Colecciones Postman de APIs MODO.",
};

export default async function PostmansPage() {
  const postmans = await getPostmans();
  return (
    <PageShell title="Postmans" intro={`${postmans.length} colecciones.`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {postmans.map((p) => (
          <Card key={p.id} href={toAbsoluteHref(p.url)}>
            <CardMeta>
              {p.env && <Pill>{p.env}</Pill>}
              {p.category && <span>{p.category}</span>}
              {p.status && <span className="capitalize">· {p.status}</span>}
            </CardMeta>
            <CardTitle>{p.title}</CardTitle>
            <CardDescription>{p.desc}</CardDescription>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
