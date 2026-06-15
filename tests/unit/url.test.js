import { describe, it, expect } from 'vitest';
import { isExternal, isStaticAsset, toAbsoluteHref } from '@/lib/url';

describe('lib/url', () => {
  describe('isExternal', () => {
    it('es true para http/https', () => {
      expect(isExternal('https://x.com')).toBe(true);
      expect(isExternal('http://x.com/a')).toBe(true);
    });
    it('es false para rutas relativas', () => {
      expect(isExternal('/foo')).toBe(false);
      expect(isExternal('foo/bar.html')).toBe(false);
      expect(isExternal('./a')).toBe(false);
    });
  });

  describe('isStaticAsset', () => {
    it('es true para relativo con extensión', () => {
      expect(isStaticAsset('decks/x.html')).toBe(true);
      expect(isStaticAsset('/a/b.json')).toBe(true);
    });
    it('es true aunque tenga query string', () => {
      expect(isStaticAsset('a/b.html?v=1')).toBe(true);
    });
    it('es false para externo aunque tenga extensión', () => {
      expect(isStaticAsset('https://x.com/a.html')).toBe(false);
    });
    it('es false para relativo sin extensión', () => {
      expect(isStaticAsset('/foo/bar')).toBe(false);
    });
  });

  describe('toAbsoluteHref', () => {
    it('deja pasar las URLs externas tal cual', () => {
      expect(toAbsoluteHref('https://x.com/a')).toBe('https://x.com/a');
    });
    it('normaliza ./ y / iniciales a una ruta pública absoluta', () => {
      expect(toAbsoluteHref('./foo/bar.html')).toBe('/foo/bar.html');
      expect(toAbsoluteHref('foo/bar.html')).toBe('/foo/bar.html');
      expect(toAbsoluteHref('/foo')).toBe('/foo');
    });
  });
});
