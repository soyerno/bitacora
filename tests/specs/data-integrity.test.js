/* @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

// Post-Next-16 migration: static assets live under public/. Probe public/ first, fall back to root.
function resolveContent(rel) {
  const inPublic = resolve(repoRoot, 'public', rel);
  if (existsSync(inPublic)) return inPublic;
  return resolve(repoRoot, rel);
}

function loadJSON(rel) {
  return JSON.parse(readFileSync(resolveContent(rel), 'utf8'));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('SPEC-DATA-001 — top-level shape', () => {
  it.each([
    ['decks/decks.json', 'decks'],
    ['rfcs/rfcs.json', 'rfcs'],
    ['skills/skills.json', 'skills']
  ])('%s contains _meta and the array key "%s"', (file, key) => {
    const doc = loadJSON(file);
    expect(doc).toHaveProperty('_meta');
    expect(doc).toHaveProperty(key);
    expect(Array.isArray(doc[key])).toBe(true);
    expect(typeof doc._meta.generated).toBe('string');
    expect(doc._meta.generated).toMatch(ISO_DATE);
  });
});

describe('SPEC-DECKS-001 — decks.json fields', () => {
  const allowedStatuses = new Set(['draft', 'rfc', 'completo']);
  const decks = loadJSON('decks/decks.json').decks;

  it('every entry has the required fields', () => {
    for (const d of decks) {
      expect(typeof d.id).toBe('string');
      expect(d.id).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      expect(typeof d.title).toBe('string');
      expect(typeof d.desc).toBe('string');
      expect(typeof d.href).toBe('string');
      expect(typeof d.audience).toBe('string');
      expect(d.date).toMatch(ISO_DATE);
      expect(Number.isInteger(d.slides) && d.slides > 0).toBe(true);
      expect(Array.isArray(d.topics)).toBe(true);
      expect(allowedStatuses.has(d.status)).toBe(true);
    }
  });

  it('ids are unique', () => {
    const ids = decks.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every href resolves on disk', () => {
    for (const d of decks) {
      const p = resolveContent(d.href);
      expect(existsSync(p), `missing file for deck "${d.id}": ${d.href}`).toBe(true);
    }
  });

  it('no deck uses the archivado status', () => {
    for (const d of decks) {
      expect(d.status).not.toBe('archivado');
    }
  });
});

describe('SPEC-RFCS-001 — rfcs.json fields', () => {
  const allowedStatuses = new Set(['draft', 'rfc', 'completo', 'archivado']);
  const rfcs = loadJSON('rfcs/rfcs.json').rfcs;

  it('every RFC carries at least one source URL', () => {
    for (const r of rfcs) {
      const hasLink = Boolean(r.drive_url || r.repo_url);
      expect(hasLink, `RFC ${r.slug} has neither drive_url nor repo_url`).toBe(true);
    }
  });

  it('slugs are unique', () => {
    const slugs = rfcs.map(r => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every status is in the allowed set', () => {
    for (const r of rfcs) {
      expect(allowedStatuses.has(r.status)).toBe(true);
    }
  });

  it('linked deck files exist when referenced', () => {
    for (const r of rfcs) {
      if (!r.deck) continue;
      const p = resolveContent(r.deck);
      expect(existsSync(p), `RFC ${r.slug} references missing deck ${r.deck}`).toBe(true);
    }
  });
});

describe('SPEC-DATA-002 — skills.json fields + on-disk hashes', () => {
  const skills = loadJSON('skills/skills.json').skills;

  it('every skill entry has the required fields', () => {
    for (const s of skills) {
      expect(typeof s.name).toBe('string');
      expect(s.name).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      expect(s.description.length).toBeGreaterThanOrEqual(10);
      expect(s.filename).toMatch(/\.zip$/);
      expect(s.sha256_prefix).toMatch(/^[0-9a-f]{16}$/);
      expect(typeof s.size_kb).toBe('number');
      expect(s.size_kb).toBeGreaterThan(0);
      expect(typeof s.install_hint).toBe('string');
    }
  });

  it('name equals filename basename without .zip', () => {
    for (const s of skills) {
      expect(s.name).toBe(basename(s.filename, '.zip'));
    }
  });

  it('every skill ZIP exists on disk', () => {
    for (const s of skills) {
      const p = resolveContent(`skills/${s.filename}`);
      expect(existsSync(p), `missing zip for skill "${s.name}": skills/${s.filename}`).toBe(true);
    }
  });

  it('sha256_prefix matches the first 16 hex chars of the on-disk zip', () => {
    for (const s of skills) {
      const p = resolveContent(`skills/${s.filename}`);
      if (!existsSync(p)) continue; // covered by previous test
      const hash = createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16);
      expect(hash, `sha256_prefix mismatch for ${s.name}`).toBe(s.sha256_prefix);
    }
  });

  it('size_kb is within 1 KB of the on-disk size', () => {
    for (const s of skills) {
      const p = resolveContent(`skills/${s.filename}`);
      if (!existsSync(p)) continue;
      const actualKb = statSync(p).size / 1024;
      expect(Math.abs(actualKb - s.size_kb)).toBeLessThan(1);
    }
  });
});

describe('SPEC-SKILLS-001 — install hints are self-sufficient', () => {
  const skills = loadJSON('skills/skills.json').skills;

  it('every install_hint references unzip + the filename + ~/.claude/skills/', () => {
    for (const s of skills) {
      expect(s.install_hint).toContain('unzip');
      expect(s.install_hint).toContain(s.filename);
      expect(s.install_hint).toContain('~/.claude/skills/');
    }
  });
});
