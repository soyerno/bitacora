import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { config } from "@/bitacora.config";
import {
  allowedLevels,
  filterByVisibility,
  type WithVisibility,
} from "@/lib/visibility";

export const dynamic = "force-dynamic";

/**
 * Feed token-gated por sección. GET /api/feed/<section>
 *
 *   Sin token         → solo items `visibility:public`.
 *   Bearer ORG_FEED_TOKEN → `public` + `org`. NUNCA `private`.
 *
 * El source-of-truth sigue siendo `public/<section>/<section>.json` (sirve plano
 * en /<section>/<section>.json para retro-compat). Este route filtra por nivel
 * y es lo que Govern (adapter SPEC-118) debería consumir cuando hay items org.
 */
function hasOrgToken(req: NextRequest): boolean {
  const expected = process.env.ORG_FEED_TOKEN;
  if (!expected) return false; // sin env var configurada, nunca autoriza org
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] === expected;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ section: string }> },
) {
  const { section } = await ctx.params;
  const sectionCfg = config.sections.find((s) => s.type === section);
  if (!sectionCfg) {
    return NextResponse.json({ error: "section not found" }, { status: 404 });
  }
  if (sectionCfg.visibility === "private") {
    return NextResponse.json({ error: "section is private" }, { status: 403 });
  }

  let raw: string;
  try {
    raw = await readFile(join(process.cwd(), "public", sectionCfg.feed), "utf8");
  } catch {
    return NextResponse.json({ error: "feed unreadable" }, { status: 500 });
  }

  const data = JSON.parse(raw);
  const items: WithVisibility<unknown>[] = Array.isArray(data?.[sectionCfg.key])
    ? data[sectionCfg.key]
    : [];

  const allowed = allowedLevels(hasOrgToken(req));
  const filtered = filterByVisibility(items, allowed, sectionCfg.visibility);

  return NextResponse.json({
    ...data,
    [sectionCfg.key]: filtered,
    _meta: {
      ...(data._meta ?? {}),
      visibility_allowed: allowed,
      filtered_count: filtered.length,
      total_count: items.length,
    },
  });
}
