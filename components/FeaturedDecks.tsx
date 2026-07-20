import { getFeaturedDecks } from "@/lib/feeds";
import { toAbsoluteHref } from "@/lib/url";
import Card, {
  CardDescription,
  CardFooter,
  CardMeta,
  CardTitle,
} from "@/components/Card";
import Pill from "@/components/Pill";

/**
 * Home hero — top 3 featured decks, urgent first. Server component reads the
 * same feed as /decks so there is one source of truth.
 */
export default async function FeaturedDecks() {
  const featured = await getFeaturedDecks(3);
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="featured-label" className="mb-12">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="featured-label"
          className="font-display text-xl font-bold text-ink"
        >
          Recomendados esta semana
        </h2>
        <p className="text-sm text-muted">
          Storytelling afilado o decisión cercana.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((d) => (
          <Card key={d.id} href={toAbsoluteHref(d.href)}>
            <CardMeta>
              {d.status && (
                <Pill>
                  <span className="capitalize">{d.status}</span>
                </Pill>
              )}
              {d.urgent && <Pill variant="featured">Urgente</Pill>}
            </CardMeta>
            <CardTitle>{d.title}</CardTitle>
            <CardDescription>{d.desc}</CardDescription>
            <CardFooter>
              {[d.audience, d.slides ? `${d.slides} slides` : null]
                .filter(Boolean)
                .join(" · ")}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
