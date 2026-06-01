import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { config } from "@/bitacora.config";
import { getSectionCount } from "@/lib/feeds";

export const dynamic = "force-dynamic";

/**
 * Manifest de ingesta discoverable — GET /ingest.json
 * Contrato que MODO Govern (adapter ingest-bitacora, SPEC-118) consume vía PULL.
 * El `consent` es un HINT; la autoridad real vive en Govern (consent_records, SPEC-111).
 */
async function sectionHash(feed: string): Promise<string | null> {
  try {
    const raw = await readFile(join(process.cwd(), "public", feed), "utf8");
    return createHash("sha256").update(raw).digest("hex").slice(0, 16);
  } catch {
    return null;
  }
}

export async function GET() {
  const sections = await Promise.all(
    config.sections
      .filter((s) => s.visibility !== "private")
      .map(async (s) => ({
        type: s.type,
        feed: s.feed,
        key: s.key,
        count: await getSectionCount(s),
        visibility: s.visibility,
        content_hash: await sectionHash(s.feed),
      })),
  );

  return NextResponse.json({
    schema_version: "1.0",
    developer: config.developer,
    generated_at: new Date().toISOString(),
    base_url: config.baseUrl,
    sections,
    // Consent declarado por el dev (hint). Autoridad real Govern-side (SPEC-111).
    consent: {
      ...config.consent,
      authority: "modo-govern:consent_records",
      hint: true,
    },
    // Contrato de atribución: Govern debe taggear cada nota ingestada con esto.
    attribution: {
      developer_id: config.developer.id,
      base_url: config.baseUrl,
      notice:
        "Cada item ingestado preserva developer_id + URL fuente. Atribución obligatoria en outputs derivados (SPEC-111).",
    },
  });
}
