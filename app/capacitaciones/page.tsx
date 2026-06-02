import type { Metadata } from "next";
import { getCapacitaciones, type Capacitacion } from "@/lib/feeds";
import { toAbsoluteHref } from "@/lib/url";
import PageShell from "@/components/PageShell";
import Card, {
  CardDescription,
  CardFooter,
  CardMeta,
  CardTitle,
} from "@/components/Card";
import Pill from "@/components/Pill";
import CapacitacionesHero from "@/components/CapacitacionesHero";

export const metadata: Metadata = {
  title: "Capacitaciones · Erno × MODO",
  description:
    "Cursos interactivos Claude-Code donde los agentes y skills MODO son el harness: Storyblok, deploy a playsistemico, Next 16, SEO/GEO, Tailwind y tickets JSM.",
};

function CapacitacionCard({ curso }: { curso: Capacitacion }) {
  return (
    <Card href={toAbsoluteHref(curso.href)}>
      <CardMeta>
        {curso.status && (
          <Pill>
            <span className="capitalize">{curso.status}</span>
          </Pill>
        )}
        {curso.featured && <Pill variant="featured">Empezá acá</Pill>}
      </CardMeta>
      <CardTitle>{curso.title}</CardTitle>
      <CardDescription>{curso.desc}</CardDescription>
      <CardFooter>
        {[curso.audience, curso.lessons ? `${curso.lessons} lecciones` : null]
          .filter(Boolean)
          .join(" · ")}
      </CardFooter>
    </Card>
  );
}

export default async function CapacitacionesPage() {
  const cursos = await getCapacitaciones();
  const featured = cursos.filter((c) => c.featured);
  const rest = cursos.filter((c) => !c.featured);
  const totalLessons = cursos.reduce((acc, c) => acc + (c.lessons ?? 0), 0);

  return (
    <PageShell
      title="Capacitaciones"
      intro="Cursos interactivos que se hacen con Claude Code abierto: vos seguís, los skills MODO orquestan, los gates te dicen si está bien. Progreso y checklists se guardan solos."
      meta={`${cursos.length} cursos · ${totalLessons} lecciones · los agentes son el harness`}
    >
      <div className="mb-10 grid items-center gap-6 sm:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Los agentes son el harness
          </h2>
          <p className="mt-2 text-sm text-muted">
            No son manuales para leer. Cada lección delega a un skill MODO
            (SDD, TDD, deploy, SEO, CSP…) y los gates verifican el resultado
            antes de avanzar.
          </p>
        </div>
        <CapacitacionesHero />
      </div>

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Empezá por acá
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CapacitacionCard key={c.id} curso={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        {featured.length > 0 && (
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Todos los cursos
          </h2>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((c) => (
            <CapacitacionCard key={c.id} curso={c} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
