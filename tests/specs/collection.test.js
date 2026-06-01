/* @vitest-environment happy-dom */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadAsset, resetMODO } from '../helpers/load-asset.js';

/* Mounts the same DOM contract that decks/index.html and rfcs/index.html use,
 * then drives MODO.createCollection with a deterministic fixture so we can
 * assert on filter/search/sort/clear behavior without depending on the manifests.
 */
function mount(name) {
  document.body.innerHTML = `
    <section data-collection="${name}">
      <input data-search type="search" />
      <select data-sort>
        <option value="recent" selected>Recientes</option>
        <option value="oldest">Antiguos</option>
      </select>
      <div data-tabs role="tablist"></div>
      <div data-chips role="group"></div>
      <span data-result-count>—</span>
      <button data-clear hidden>Limpiar filtros</button>
      <div data-list></div>
      <div data-empty hidden>nada</div>
    </section>
  `;
}

function makeOpts(items) {
  return {
    name: 'decks',
    items,
    stages: ['draft', 'rfc', 'completo'],
    labels: { frontend: 'Frontend', ai: 'AI' },
    getTopics: (it) => it.topics || [],
    noun: 'decks',
    searchHaystack: (it) => `${it.title} ${it.desc || ''}`,
    sortFn: (mode) => (a, b) => {
      const dir = mode === 'oldest' ? 1 : -1;
      return dir * a.date.localeCompare(b.date);
    },
    itemTpl: (it) => `<article data-id="${it.id}">${it.title}</article>`
  };
}

const FIXTURE = [
  { id: 'a', title: 'Alpha frontend deck', date: '2026-05-01', status: 'draft', topics: ['frontend'] },
  { id: 'b', title: 'Beta promo deck', date: '2026-04-15', status: 'completo', topics: ['frontend', 'ai'] },
  { id: 'c', title: 'Gamma AI deck', date: '2026-03-10', status: 'completo', topics: ['ai'] },
  { id: 'd', title: 'Delta frontend', date: '2026-02-20', status: 'draft', topics: ['frontend'] }
];

describe('SPEC-DECKS-003 — createCollection controller', () => {
  beforeEach(() => {
    mount('decks');
    resetMODO();
    loadAsset('assets/common.js');
    loadAsset('assets/collection.js');
  });

  afterEach(() => resetMODO());

  it('initial render lists all items and shows total count', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const list = document.querySelector('[data-list]');
    expect(list.querySelectorAll('article')).toHaveLength(4);
    expect(document.querySelector('[data-result-count]').textContent).toBe('4 decks');
    expect(document.querySelector('[data-clear]').hidden).toBe(true);
    expect(document.querySelector('[data-empty]').hidden).toBe(true);
  });

  it('renders one tab per stage plus a "Todos" tab with correct counts', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const tabs = Array.from(document.querySelectorAll('[data-tabs] .tab'));
    expect(tabs.map(t => t.dataset.stage)).toEqual(['all', 'draft', 'rfc', 'completo']);
    expect(tabs.find(t => t.dataset.stage === 'all').textContent).toContain('4');
    expect(tabs.find(t => t.dataset.stage === 'draft').textContent).toContain('2');
    expect(tabs.find(t => t.dataset.stage === 'rfc').textContent).toContain('0');
    expect(tabs.find(t => t.dataset.stage === 'completo').textContent).toContain('2');
  });

  it('disables tabs whose stage has count 0', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const rfcTab = document.querySelector('[data-tabs] .tab[data-stage="rfc"]');
    expect(rfcTab.hasAttribute('disabled')).toBe(true);
  });

  it('clicking a stage tab filters the list and updates the counter', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    document.querySelector('[data-tabs] .tab[data-stage="draft"]').click();
    expect(document.querySelectorAll('[data-list] article')).toHaveLength(2);
    expect(document.querySelector('[data-result-count]').textContent).toBe('2 de 4 decks');
    expect(document.querySelector('[data-clear]').hidden).toBe(false);
  });

  it('search filters case-insensitively against the haystack', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const input = document.querySelector('[data-search]');
    input.value = '  PROMO  ';
    input.dispatchEvent(new Event('input'));
    expect(document.querySelectorAll('[data-list] article')).toHaveLength(1);
    expect(document.querySelector('[data-list] article').dataset.id).toBe('b');
  });

  it('multiple chips are OR-combined', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const chips = Array.from(document.querySelectorAll('[data-chips] .chip'));
    expect(chips.map(c => c.dataset.topic).sort()).toEqual(['ai', 'frontend']);
    chips.find(c => c.dataset.topic === 'ai').click();
    expect(document.querySelectorAll('[data-list] article')).toHaveLength(2);
  });

  it('clear button resets every filter', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const search = document.querySelector('[data-search]');
    search.value = 'frontend';
    search.dispatchEvent(new Event('input'));
    document.querySelector('[data-tabs] .tab[data-stage="completo"]').click();
    document.querySelector('[data-chips] .chip[data-topic="ai"]').click();
    expect(document.querySelector('[data-clear]').hidden).toBe(false);

    document.querySelector('[data-clear]').click();
    expect(search.value).toBe('');
    expect(document.querySelectorAll('[data-list] article')).toHaveLength(4);
    expect(document.querySelector('[data-tabs] .tab[data-stage="all"]').getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('[data-clear]').hidden).toBe(true);
  });

  it('shows the empty state when no items match', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const input = document.querySelector('[data-search]');
    input.value = 'zzznotfound';
    input.dispatchEvent(new Event('input'));
    expect(document.querySelector('[data-empty]').hidden).toBe(false);
    expect(document.querySelector('[data-list]').hidden).toBe(true);
  });

  it('arrow-key navigation skips disabled tabs', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const tabs = Array.from(document.querySelectorAll('[data-tabs] .tab'));
    const draftTab = tabs.find(t => t.dataset.stage === 'draft');
    draftTab.focus();
    draftTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    // From "draft" the next non-disabled tab is "completo" (rfc is disabled)
    expect(document.activeElement.dataset.stage).toBe('completo');
  });

  it('sort change reorders the list', () => {
    globalThis.MODO.createCollection(makeOpts(FIXTURE));
    const sort = document.querySelector('[data-sort]');
    sort.value = 'oldest';
    sort.dispatchEvent(new Event('change'));
    const ids = Array.from(document.querySelectorAll('[data-list] article')).map(a => a.dataset.id);
    expect(ids).toEqual(['d', 'c', 'b', 'a']);
  });
});

describe('SPEC-RFCS-003 — versions toggle (saga collapse)', () => {
  beforeEach(() => {
    mount('decks');
    resetMODO();
    loadAsset('assets/common.js');
    loadAsset('assets/collection.js');
  });

  afterEach(() => resetMODO());

  it('clicking the toggle opens/closes the panel and rewrites the prefix', () => {
    const opts = makeOpts([
      { id: 'a', title: 'A', date: '2026-05-01', status: 'draft', topics: ['frontend'] }
    ]);
    // Override the item template to include a versions toggle + target panel
    opts.itemTpl = (it) =>
      `<article data-id="${it.id}">
        <button class="versions-toggle" data-target="ver-${it.id}" data-open="false">+ Ver versiones</button>
        <div id="ver-${it.id}" class="versions">…</div>
      </article>`;
    globalThis.MODO.createCollection(opts);

    const btn = document.querySelector('.versions-toggle');
    const panel = document.getElementById('ver-a');
    expect(panel.classList.contains('open')).toBe(false);

    btn.click();
    expect(panel.classList.contains('open')).toBe(true);
    expect(btn.textContent.startsWith('− ')).toBe(true);

    btn.click();
    expect(panel.classList.contains('open')).toBe(false);
    expect(btn.textContent.startsWith('+ ')).toBe(true);
  });
});
