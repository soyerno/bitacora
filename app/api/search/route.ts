import { NextResponse } from "next/server";
import { getDecks, getRfcs, getRd, getSkills } from "@/lib/feeds";
import { toAbsoluteHref } from "@/lib/url";
import type { SearchHit } from "@/lib/search";

export const dynamic = "force-dynamic";

const norm = (s: string) => s.toLowerCase();

/** Búsqueda server-side cross-feed. GET /api/search?q=<term> */
export async function GET(req: Request) {
  const q = norm(new URL(req.url).searchParams.get("q")?.trim() ?? "");
  if (!q) return NextResponse.json({ hits: [] satisfies SearchHit[] });

  const [decks, rfcs, rd, skills] = await Promise.all([
    getDecks(),
    getRfcs(),
    getRd(),
    getSkills(),
  ]);

  const has = (...fields: (string | undefined)[]) =>
    fields.some((f) => f && norm(f).includes(q));

  const hits: SearchHit[] = [
    ...decks
      .filter((d) => has(d.title, d.desc, (d.topics ?? []).join(" ")))
      .map((d) => ({
        type: "deck" as const,
        title: d.title,
        desc: d.desc,
        href: toAbsoluteHref(d.href),
      })),
    ...rfcs
      .filter((r) => has(r.title, r.summary, (r.tags ?? []).join(" ")))
      .map((r) => ({ type: "rfc" as const, title: r.title, desc: r.summary, href: r.repo_url ?? "/rfcs" })),
    ...rd
      .filter((r) => has(r.title, r.summary, (r.tags ?? []).join(" ")))
      .map((r) => ({
        type: "rd" as const,
        title: r.title,
        desc: r.summary,
        href: r.href ? toAbsoluteHref(r.href) : "/rd",
      })),
    ...skills
      .filter((s) => has(s.name, s.description))
      .map((s) => ({ type: "skill" as const, title: s.name, desc: s.description, href: "/skills" })),
  ];

  return NextResponse.json({ hits });
}
