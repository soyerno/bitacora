/* @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

function parse(rel) {
  // Happy-dom fires async stylesheet/script fetches on <link>/<script src=> nodes
  // and then leaks unhandled rejections once the test window is torn down. We
  // strip those tags before parsing — the DOM contract under test does not
  // depend on them.
  const html = readFileSync(resolve(repoRoot, rel), 'utf8')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc;
}

const REQUIRED_HOOKS = [
  '[data-search]',
  '[data-sort]',
  '[data-tabs]',
  '[data-chips]',
  '[data-list]',
  '[data-empty]',
  '[data-result-count]',
  '[data-clear]'
];

describe('SPEC-DECKS-002 — decks/index.html DOM contract', () => {
  const doc = parse('decks/index.html');

  it('contains exactly one [data-collection="decks"] scope', () => {
    expect(doc.querySelectorAll('[data-collection="decks"]')).toHaveLength(1);
  });

  it.each(REQUIRED_HOOKS)('contains %s under the decks scope', (sel) => {
    const scope = doc.querySelector('[data-collection="decks"]');
    expect(scope.querySelector(sel)).not.toBeNull();
  });
});

describe('SPEC-RFCS-002 — rfcs/index.html DOM contract', () => {
  const doc = parse('rfcs/index.html');

  it('contains exactly one [data-collection="rfcs"] scope', () => {
    expect(doc.querySelectorAll('[data-collection="rfcs"]')).toHaveLength(1);
  });

  it.each(REQUIRED_HOOKS)('contains %s under the rfcs scope', (sel) => {
    const scope = doc.querySelector('[data-collection="rfcs"]');
    expect(scope.querySelector(sel)).not.toBeNull();
  });

  it('passes stages including "archivado" to createCollection', () => {
    const html = readFileSync(resolve(repoRoot, 'rfcs/index.html'), 'utf8');
    expect(html).toMatch(/stages:\s*\[\s*['"]draft['"]\s*,\s*['"]rfc['"]\s*,\s*['"]completo['"]\s*,\s*['"]archivado['"]\s*\]/);
  });
});
