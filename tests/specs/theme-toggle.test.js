/* @vitest-environment happy-dom */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadAsset, resetMODO } from '../helpers/load-asset.js';

describe('SPEC-THEME — Theme toggle (assets/common.js)', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.innerHTML = `
      <button id="theme-toggle" type="button"></button>
      <span id="theme-label"></span>
    `;
    localStorage.clear();
    resetMODO();
    loadAsset('assets/common.js');
    globalThis.MODO.initThemeToggle();
  });

  afterEach(() => {
    resetMODO();
  });

  describe('SPEC-THEME-001 — cycle order', () => {
    it('first click moves from auto to light', () => {
      document.documentElement.setAttribute('data-theme', 'auto');
      document.getElementById('theme-toggle').click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.getElementById('theme-label').textContent).toBe('claro');
    });

    it('light → dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.getElementById('theme-toggle').click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.getElementById('theme-label').textContent).toBe('oscuro');
    });

    it('wraps back to auto after dark', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById('theme-toggle').click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('auto');
      expect(document.getElementById('theme-label').textContent).toBe('auto');
    });

    it('treats missing data-theme as auto (next is light)', () => {
      document.documentElement.removeAttribute('data-theme');
      document.getElementById('theme-toggle').click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('SPEC-THEME-002 — persistence', () => {
    it('writes new state to localStorage on every click', () => {
      document.documentElement.setAttribute('data-theme', 'auto');
      document.getElementById('theme-toggle').click();
      expect(localStorage.getItem('modo-decks-theme')).toBe('light');
      document.getElementById('theme-toggle').click();
      expect(localStorage.getItem('modo-decks-theme')).toBe('dark');
    });

    it('swallows localStorage errors silently', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });
      document.documentElement.setAttribute('data-theme', 'auto');
      expect(() => document.getElementById('theme-toggle').click()).not.toThrow();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      spy.mockRestore();
    });
  });

  describe('SPEC-THEME-003 — idempotent init', () => {
    it('does not throw when #theme-toggle is missing', () => {
      document.body.innerHTML = '<span id="theme-label"></span>';
      resetMODO();
      loadAsset('assets/common.js');
      expect(() => globalThis.MODO.initThemeToggle()).not.toThrow();
      // After init with no toggle and no data-theme, label still reflects "auto" fallback
      expect(document.getElementById('theme-label').textContent).toBe('auto');
    });
  });

  describe('SPEC-THEME-004 — helpers', () => {
    it('escapeHTML escapes the five HTML-relevant chars', () => {
      expect(globalThis.MODO.escapeHTML('<script>alert("x&y")</script>'))
        .toBe('&lt;script&gt;alert(&quot;x&amp;y&quot;)&lt;/script&gt;');
      expect(globalThis.MODO.escapeHTML("it's")).toBe('it&#39;s');
    });

    it('escapeHTML coerces null and undefined to empty string', () => {
      expect(globalThis.MODO.escapeHTML(null)).toBe('');
      expect(globalThis.MODO.escapeHTML(undefined)).toBe('');
    });

    it('STATUS_LABELS contains the four canonical statuses', () => {
      const labels = globalThis.MODO.STATUS_LABELS;
      expect(labels.draft).toBeTruthy();
      expect(labels.rfc).toBeTruthy();
      expect(labels.completo).toBeTruthy();
      expect(labels.archivado).toBeTruthy();
    });
  });
});
