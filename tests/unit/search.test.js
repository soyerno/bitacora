import { describe, it, expect } from 'vitest';
import { SEARCH_TYPE_LABEL } from '@/lib/search';

describe('lib/search', () => {
  it('tiene una etiqueta para cada tipo de hit', () => {
    expect(Object.keys(SEARCH_TYPE_LABEL).sort()).toEqual([
      'deck',
      'rd',
      'rfc',
      'skill',
    ]);
    for (const label of Object.values(SEARCH_TYPE_LABEL)) {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    }
  });
});
