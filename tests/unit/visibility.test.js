import { describe, it, expect } from 'vitest';
import {
  effectiveVisibility,
  filterByVisibility,
  allowedLevels,
} from '@/lib/visibility';

describe('lib/visibility', () => {
  it('effectiveVisibility hereda el default de la sección si el item no declara', () => {
    expect(effectiveVisibility({}, 'org')).toBe('org');
    expect(effectiveVisibility({ visibility: 'public' }, 'org')).toBe('public');
  });

  it('allowedLevels gatea org detrás del token', () => {
    expect(allowedLevels(false)).toEqual(['public']);
    expect(allowedLevels(true)).toEqual(['public', 'org']);
  });

  describe('filterByVisibility', () => {
    const items = [
      { id: 'a', visibility: 'public' },
      { id: 'b', visibility: 'org' },
      { id: 'c', visibility: 'private' },
      { id: 'd' }, // sin visibility → hereda el default
    ];

    it('un caller public-only ve solo public (+ default si es public)', () => {
      const out = filterByVisibility(items, ['public'], 'public');
      expect(out.map((i) => i.id)).toEqual(['a', 'd']);
    });

    it('un caller con token ve public+org, nunca private', () => {
      const out = filterByVisibility(items, ['public', 'org'], 'org');
      expect(out.map((i) => i.id).sort()).toEqual(['a', 'b', 'd']);
    });

    it('private NUNCA se filtra, aunque se lo pida explícito (contrato)', () => {
      const out = filterByVisibility(items, ['public', 'org', 'private'], 'public');
      expect(out.find((i) => i.id === 'c')).toBeUndefined();
    });

    it('un item que hereda default private queda fuera', () => {
      const out = filterByVisibility([{ id: 'x' }], ['public', 'org'], 'private');
      expect(out).toEqual([]);
    });
  });
});
