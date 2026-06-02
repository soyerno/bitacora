import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Content layer — lee los feeds JSON existentes de la bitácora desde el
 * filesystem en build/request time (Server Components). Misma fuente de verdad
 * que el sitio estático: `<sección>/<sección>.json`.
 *
 * Tras la Fase 3 los feeds viven en `public/<sección>/` y siguen siendo
 * legibles vía fs (process.cwd()/public/...) y fetchables en runtime.
 */

export interface Deck {
  id: string;
  title: string;
  desc: string;
  href: string;
  status?: string;
  audience?: string;
  date?: string;
  slides?: number;
  topics?: string[];
  featured?: boolean;
  urgent?: boolean;
}

export interface Rfc {
  number: number | string;
  slug: string;
  title: string;
  summary: string;
  status?: string;
  tags?: string[];
  area?: string;
  date?: string;
  repo_url?: string;
}

export interface RdItem {
  number: number | string;
  slug: string;
  title: string;
  summary: string;
  status?: string;
  tags?: string[];
  area?: string;
  date?: string;
  href?: string;
  reading_minutes?: number;
}

export interface Skill {
  name: string;
  description: string;
  filename: string;
  sha256_prefix?: string;
  size_kb?: number;
  install_hint?: string;
}

async function readFeed<T>(section: string, key: string): Promise<T[]> {
  try {
    // Tras Fase 3 los feeds viven en public/<sección>/<sección>.json (Vercel
    // los sirve además como estáticos en /<sección>/<sección>.json).
    const raw = await readFile(join(process.cwd(), "public", section, `${section}.json`), "utf8");
    const data = JSON.parse(raw);
    const arr = data?.[key];
    return Array.isArray(arr) ? (arr as T[]) : [];
  } catch {
    return [];
  }
}

export interface ProyectoRepo {
  repo: string;
  summary?: string;
  total?: number;
  merged?: number;
  open?: number;
  closed?: number;
  language?: string;
  private?: boolean;
}

export interface ProyectoCategory {
  id: string;
  name: string;
  desc?: string;
  projects: ProyectoRepo[];
}

export interface Postman {
  id: string;
  title: string;
  desc: string;
  url: string;
  env?: string;
  status?: string;
  category?: string;
  tags?: string[];
  date?: string;
}

export interface HerramientaTool {
  name: string;
  description: string;
  download?: string | null;
  external?: string | null;
  tags?: string[];
}

export interface HerramientaCategory {
  id: string;
  name: string;
  tools: HerramientaTool[];
}

export interface BitacoraStory {
  title: string;
  summary: string;
  tags?: string[];
}

export interface BitacoraEntry {
  date: string;
  slug: string;
  title: string;
  tldr: string;
  stories: BitacoraStory[];
  tags?: string[];
  status?: string;
}

export interface Capacitacion {
  id: string;
  title: string;
  desc: string;
  href: string;
  status?: string;
  audience?: string;
  date?: string;
  lessons?: number;
  topics?: string[];
  harness?: string[];
  featured?: boolean;
}

/** Count genérico de un feed por (section, key) — para el índice template-driven. */
export async function countFeed(section: string, key: string): Promise<number> {
  return (await readFeed<unknown>(section, key)).length;
}

/**
 * Count "items" for a section in the way that makes sense on the home grid.
 * Most sections count the top-level array; `herramientas` is grouped by
 * category, so we sum each category's `tools.length` (75 tools vs 8 categories).
 */
export async function getSectionCount(
  section: { type: string; key: string },
): Promise<number> {
  if (section.type === "herramientas") {
    const cats = await getHerramientas();
    return cats.reduce((acc, c) => acc + c.tools.length, 0);
  }
  return countFeed(section.type, section.key);
}

export const getDecks = () => readFeed<Deck>("decks", "decks");

/** Top N featured decks, urgent first — used by the home "Recomendados" grid. */
export async function getFeaturedDecks(limit = 3): Promise<Deck[]> {
  const decks = await getDecks();
  return decks
    .filter((d) => d.featured)
    .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
    .slice(0, limit);
}

export const getRfcs = () => readFeed<Rfc>("rfcs", "rfcs");
export const getRd = () => readFeed<RdItem>("rd", "items"); // ⚠️ key es `items`, no `rd`
export const getSkills = () => readFeed<Skill>("skills", "skills");
export const getProyectos = () => readFeed<ProyectoCategory>("proyectos", "categories");
export const getPostmans = () => readFeed<Postman>("postmans", "postmans");
export const getBitacora = () => readFeed<BitacoraEntry>("bitacora", "items");
export const getHerramientas = () =>
  readFeed<HerramientaCategory>("herramientas", "categories");
export const getCapacitaciones = () =>
  readFeed<Capacitacion>("capacitaciones", "capacitaciones");
