/* @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

function resolveContent(rel) {
  const inPublic = resolve(repoRoot, 'public', rel);
  if (existsSync(inPublic)) return inPublic;
  return resolve(repoRoot, rel);
}

function loadJSON(rel) {
  return JSON.parse(readFileSync(resolveContent(rel), 'utf8'));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// ── rd.json ──────────────────────────────────────────────────────────────────

describe('SPEC-RD-001 — rd.json top-level shape', () => {
  const doc = loadJSON('rd/rd.json');

  it('has _meta with ISO generated date', () => {
    expect(doc).toHaveProperty('_meta');
    expect(doc._meta.generated).toMatch(ISO_DATE);
  });

  it('has non-empty items array', () => {
    expect(Array.isArray(doc.items)).toBe(true);
    expect(doc.items.length).toBeGreaterThan(0);
  });
});

describe('SPEC-RD-002 — rd.json entry fields', () => {
  const items = loadJSON('rd/rd.json').items;

  it('every entry has required fields', () => {
    for (const item of items) {
      expect(typeof item.slug).toBe('string');
      expect(item.slug.length).toBeGreaterThan(0);
      expect(typeof item.title).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(item.date).toMatch(ISO_DATE);
    }
  });

  it('slugs are unique', () => {
    const slugs = items.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every href resolves on disk (relative to rd/)', () => {
    for (const item of items) {
      const p = resolveContent(`rd/${item.href}`);
      expect(existsSync(p), `missing file for rd "${item.slug}": rd/${item.href}`).toBe(true);
    }
  });
});

// ── capacitaciones.json ───────────────────────────────────────────────────────

describe('SPEC-CAP-001 — capacitaciones.json top-level shape', () => {
  const doc = loadJSON('capacitaciones/capacitaciones.json');

  it('has _meta with ISO generated date', () => {
    expect(doc).toHaveProperty('_meta');
    expect(doc._meta.generated).toMatch(ISO_DATE);
  });

  it('has non-empty capacitaciones array', () => {
    expect(Array.isArray(doc.capacitaciones)).toBe(true);
    expect(doc.capacitaciones.length).toBeGreaterThan(0);
  });
});

describe('SPEC-CAP-002 — capacitaciones.json entry fields', () => {
  const items = loadJSON('capacitaciones/capacitaciones.json').capacitaciones;

  it('every entry has required fields', () => {
    for (const item of items) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(typeof item.title).toBe('string');
      expect(typeof item.href).toBe('string');
    }
  });

  it('ids are unique', () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every href resolves on disk (relative to public/)', () => {
    for (const item of items) {
      const p = resolveContent(item.href);
      expect(existsSync(p), `missing file for capacitacion "${item.id}": ${item.href}`).toBe(true);
    }
  });
});

// ── herramientas.json ─────────────────────────────────────────────────────────

describe('SPEC-HERR-001 — herramientas.json top-level shape', () => {
  const doc = loadJSON('herramientas/herramientas.json');

  it('has _meta with ISO generated date', () => {
    expect(doc).toHaveProperty('_meta');
    expect(doc._meta.generated).toMatch(ISO_DATE);
  });

  it('has non-empty categories array', () => {
    expect(Array.isArray(doc.categories)).toBe(true);
    expect(doc.categories.length).toBeGreaterThan(0);
  });
});

describe('SPEC-HERR-002 — herramientas.json entry fields', () => {
  const doc = loadJSON('herramientas/herramientas.json');

  it('every category has id, name, and tools array', () => {
    for (const cat of doc.categories) {
      expect(typeof cat.id).toBe('string');
      expect(typeof cat.name).toBe('string');
      expect(Array.isArray(cat.tools)).toBe(true);
    }
  });

  it('category ids are unique', () => {
    const ids = doc.categories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every tool with a local download path resolves on disk', () => {
    for (const cat of doc.categories) {
      for (const tool of cat.tools) {
        if (!tool.download) continue;
        if (!tool.download.startsWith('/')) continue; // skip external URLs
        const rel = tool.download.replace(/^\//, '');
        const p = resolveContent(rel);
        expect(existsSync(p), `missing download for tool "${tool.name}": ${tool.download}`).toBe(true);
      }
    }
  });
});

// ── postmans.json ─────────────────────────────────────────────────────────────

describe('SPEC-POST-001 — postmans.json top-level shape', () => {
  const doc = loadJSON('postmans/postmans.json');

  it('has _meta with ISO generated date', () => {
    expect(doc).toHaveProperty('_meta');
    expect(doc._meta.generated).toMatch(ISO_DATE);
  });

  it('has non-empty postmans array', () => {
    expect(Array.isArray(doc.postmans)).toBe(true);
    expect(doc.postmans.length).toBeGreaterThan(0);
  });
});

describe('SPEC-POST-002 — postmans.json entry fields', () => {
  const items = loadJSON('postmans/postmans.json').postmans;

  it('every entry has required fields', () => {
    for (const item of items) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(typeof item.title).toBe('string');
      expect(typeof item.url).toBe('string');
      expect(item.url.length).toBeGreaterThan(0);
    }
  });

  it('ids are unique', () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── proyectos.json ────────────────────────────────────────────────────────────

describe('SPEC-PROY-001 — proyectos.json top-level shape', () => {
  const doc = loadJSON('proyectos/proyectos.json');

  // proyectos.json uses generated_at (not _meta) — verified against live file
  it('has generated_at ISO date', () => {
    expect(typeof doc.generated_at).toBe('string');
    expect(doc.generated_at).toMatch(ISO_DATE);
  });

  it('has non-empty projects array', () => {
    expect(Array.isArray(doc.projects)).toBe(true);
    expect(doc.projects.length).toBeGreaterThan(0);
  });

  it('has non-empty categories array', () => {
    expect(Array.isArray(doc.categories)).toBe(true);
    expect(doc.categories.length).toBeGreaterThan(0);
  });
});

describe('SPEC-PROY-002 — proyectos.json entry fields', () => {
  const items = loadJSON('proyectos/proyectos.json').projects;

  it('every entry has repo and category', () => {
    for (const item of items) {
      expect(typeof item.repo).toBe('string');
      expect(item.repo.length).toBeGreaterThan(0);
      expect(typeof item.category).toBe('string');
      expect(item.category.length).toBeGreaterThan(0);
    }
  });

  it('repo values are unique', () => {
    const repos = items.map((i) => i.repo);
    expect(new Set(repos).size).toBe(repos.length);
  });
});
