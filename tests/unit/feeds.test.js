import { describe, it, expect } from 'vitest';
import {
  getDecks,
  getFeaturedDecks,
  getRd,
  getSectionCount,
  getHerramientas,
  getCapacitaciones,
} from '@/lib/feeds';

// Tests de integración contra los feeds JSON reales del repo (deterministas:
// los datos están commiteados). Validan la LÓGICA de feeds.ts, no la forma del
// JSON (eso lo cubre tests/specs/data-integrity).
describe('lib/feeds', () => {
  it('getDecks devuelve un array no vacío', async () => {
    const decks = await getDecks();
    expect(Array.isArray(decks)).toBe(true);
    expect(decks.length).toBeGreaterThan(0);
  });

  it('getFeaturedDecks respeta el límite, todos featured, urgentes primero', async () => {
    const out = await getFeaturedDecks(3);
    expect(out.length).toBeLessThanOrEqual(3);
    expect(out.every((d) => d.featured)).toBe(true);
    // invariante de orden: una vez que aparece un no-urgente, no hay urgentes después
    const firstNonUrgent = out.findIndex((d) => !d.urgent);
    if (firstNonUrgent !== -1) {
      expect(out.slice(firstNonUrgent).some((d) => d.urgent)).toBe(false);
    }
  });

  it('getRd lee la key `items`, no `rd` (gotcha documentado en feeds.ts)', async () => {
    const rd = await getRd();
    expect(Array.isArray(rd)).toBe(true);
    // Si leyera la key equivocada (`rd`) readFeed devolvería [] → length 0.
    expect(rd.length).toBeGreaterThan(0);
  });

  it('getSectionCount suma los tools para herramientas (feed agrupado)', async () => {
    const cats = await getHerramientas();
    const sumTools = cats.reduce((acc, c) => acc + c.tools.length, 0);
    const count = await getSectionCount({ type: 'herramientas', key: 'categories' });
    expect(count).toBe(sumTools);
    // hay más tools que categorías (el count NO es el de categorías)
    expect(count).toBeGreaterThan(cats.length);
  });

  it('getCapacitaciones devuelve un array no vacío', async () => {
    const caps = await getCapacitaciones();
    expect(Array.isArray(caps)).toBe(true);
    expect(caps.length).toBeGreaterThan(0);
  });
});
