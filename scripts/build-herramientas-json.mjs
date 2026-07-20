#!/usr/bin/env node
/**
 * Build herramientas.json from the legacy static public/herramientas/index.html.
 *
 * The legacy page renders inline <div class="tool-item"> nodes grouped by
 * <div class="tool-category"> with an <h3 class="tool-category-name">. We parse
 * those nodes with regex + JSDOM-free DOM-ish primitives (small, deterministic
 * data) and emit a JSON feed consumable by app/herramientas/page.tsx.
 *
 * Run: node scripts/build-herramientas-json.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
// Archival source — preserved in scripts/legacy/ so the extractor can be re-run
// if the JSON drifts. After Next migration, the canonical edit path is the JSON
// itself (public/herramientas/herramientas.json).
const SRC = join(ROOT, "scripts", "legacy", "herramientas-source.html");
const OUT = join(ROOT, "public", "herramientas", "herramientas.json");

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (s) =>
  decodeEntities(
    s
      .replace(/<a\s+[^>]*?href="([^"]+)"[^>]*>.*?<\/a>/gs, (_, href) => "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );

const extractAttr = (tag, attr) => {
  const m = tag.match(new RegExp(`\\b${attr}="([^"]*)"`));
  return m ? decodeEntities(m[1]) : null;
};

function parseToolItem(html) {
  // Tool name: <div class="tool-name">…<code>NAME</code>…(badges/links)…</div>
  const nameBlockMatch = html.match(
    /<div class="tool-name">([\s\S]*?)<\/div>\s*(?:<div class="tool-desc">|$)/,
  );
  if (!nameBlockMatch) return null;
  const nameBlock = nameBlockMatch[1];

  const codeMatch = nameBlock.match(/<code>([^<]+)<\/code>/);
  if (!codeMatch) return null;
  const name = decodeEntities(codeMatch[1]).trim();

  // Download link (.skill ZIP) — normalize "../skills/foo.zip" → "/skills/foo.zip"
  const downloadMatch = nameBlock.match(
    /<a[^>]+class="download-badge"[^>]+href="([^"]+)"/,
  );
  let downloadHref = downloadMatch ? decodeEntities(downloadMatch[1]) : null;
  if (downloadHref && downloadHref.startsWith("../")) {
    downloadHref = "/" + downloadHref.replace(/^\.\.\//, "");
  }

  // External github/marketplace link
  const externalMatch = nameBlock.match(
    /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>\s*<span[^>]*class="tool-meta-tag external"/,
  );
  const externalHref = externalMatch ? decodeEntities(externalMatch[1]) : null;

  // Tags: mcp / plugin / external
  const tags = [];
  const tagMatches = nameBlock.matchAll(
    /<span[^>]+class="tool-meta-tag\s+([a-z]+)"[^>]*>/g,
  );
  for (const t of tagMatches) {
    if (t[1] !== "external") tags.push(t[1]); // external is link presence, not a tag
  }

  // Description block
  const descMatch = html.match(
    /<div class="tool-desc">([\s\S]*?)<\/div>\s*<\/div>?\s*$/,
  );
  // Fallback — match first tool-desc after tool-name
  const descMatch2 =
    descMatch ?? html.match(/<div class="tool-desc">([\s\S]*?)<\/div>/);
  let description = "";
  if (descMatch2) {
    // Strip <a> tags but preserve link hrefs as inline references? Keep just text.
    description = decodeEntities(
      descMatch2[1]
        .replace(/<a[^>]*>(.*?)<\/a>/gs, "$1")
        .replace(/<code>(.*?)<\/code>/gs, "`$1`")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }

  return {
    name,
    description,
    download: downloadHref,
    external: externalHref,
    tags: tags.length ? tags : undefined,
  };
}

function parseCategories(html) {
  const categories = [];
  // Each category: <div class="tool-category" ...> ... </div> (greedy until matching close)
  // Strategy: find all <h3 class="tool-category-name"> headers and slice between them.
  const headerRegex =
    /<div class="tool-category"[^>]*>\s*<h3 class="tool-category-name">([^<]+)<\/h3>/g;
  const headers = [];
  let m;
  while ((m = headerRegex.exec(html)) !== null) {
    headers.push({ name: decodeEntities(m[1]).trim(), start: m.index, headerEnd: m.index + m[0].length });
  }
  if (!headers.length) return categories;
  // Compute slice bounds: each category runs from its headerEnd to the next category's start.
  for (let i = 0; i < headers.length; i++) {
    const sliceStart = headers[i].headerEnd;
    const sliceEnd = i + 1 < headers.length ? headers[i + 1].start : html.length;
    const slice = html.slice(sliceStart, sliceEnd);
    // Inside, parse tool-item nodes.
    const tools = [];
    const itemRegex = /<div class="tool-item"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="tool-item"|<\/div>)/g;
    let it;
    while ((it = itemRegex.exec(slice)) !== null) {
      // Reconstruct full item html for parseToolItem (it expects the open <div>).
      const itemHtml = `<div class="tool-item">${it[1]}</div>`;
      const parsed = parseToolItem(itemHtml);
      if (parsed) tools.push(parsed);
    }
    categories.push({
      id: headers[i].name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: headers[i].name,
      tools,
    });
  }
  return categories;
}

async function main() {
  const html = await readFile(SRC, "utf8");
  const categories = parseCategories(html);
  const totalTools = categories.reduce((acc, c) => acc + c.tools.length, 0);

  const feed = {
    _meta: {
      generated: new Date().toISOString().slice(0, 10),
      source: "public/herramientas/index.html",
      total_tools: totalTools,
      total_categories: categories.length,
      notes:
        "Extraído de la página legacy con scripts/build-herramientas-json.mjs. Editar el HTML fuente, no este JSON.",
    },
    categories,
  };

  await writeFile(OUT, JSON.stringify(feed, null, 2) + "\n", "utf8");
  console.log(
    `OK · ${categories.length} categorías · ${totalTools} herramientas → ${OUT.replace(ROOT + "/", "")}`,
  );
  for (const c of categories) {
    console.log(`  · ${c.name} (${c.tools.length})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
