import type { Metadata } from "next";
import { getDecks, type Deck } from "@/lib/feeds";
import { toAbsoluteHref } from "@/lib/url";
import PageShell from "@/components/PageShell";
import Card, {
  CardDescription,
  CardFooter,
  CardMeta,
  CardTitle,
} from "@/components/Card";
import Pill from "@/components/Pill";

export const metadata: Metadata = {
  title: "Decks · Erno × MODO",
  description: "Presentaciones branded MODO — pitches, RFCs visuales y demos.",
};

function DeckCard({ deck }: { deck: Deck }) {
  return (
    <Card href={toAbsoluteHref(deck.href)}>
      <CardMeta>
        {deck.status && (
          <Pill>
            <span className="capitalize">{deck.status}</span>
          </Pill>
        )}
        {deck.featured && <Pill variant="featured">Destacado</Pill>}
      </CardMeta>
      <CardTitle>{deck.title}</CardTitle>
      <CardDescription>{deck.desc}</CardDescription>
      <CardFooter>
        {[deck.audience, deck.date, deck.slides ? `${deck.slides} slides` : null]
          .filter(Boolean)
          .join(" · ")}
      </CardFooter>
    </Card>
  );
}

export default async function DecksPage() {
  const decks = await getDecks();
  const featured = decks.filter((d) => d.featured);
  const rest = decks.filter((d) => !d.featured);

  return (
    <PageShell
      title="Decks"
      intro={`${decks.length} presentaciones publicadas.`}
    >
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Destacados
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <DeckCard key={d.id} deck={d} />
            ))}
          </div>
        </section>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((d) => (
          <DeckCard key={d.id} deck={d} />
        ))}
      </div>
    </PageShell>
  );
}
