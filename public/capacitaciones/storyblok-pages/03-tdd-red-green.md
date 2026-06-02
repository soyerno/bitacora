# 03 · TDD red→green

> Objetivo: el blok tiene un test que falla primero (red), pasa con la implementación mínima (green) y queda verde tras refactor. **Gate TDD.**

## Harness

- `test-driven-development` — disciplina red→green→refactor.

## La regla del equipo

- **TDD obligatorio** cuando hay lógica condicional, reglas o cálculos (`if`, `map` con variantes, validaciones). Test primero.
- **Test-after** aceptable para delegación trivial (un adaptador que solo pasa props). Pero el test **siempre existe**.
- **Sin snapshots.** El equipo quiere eliminar los Jest snapshots. Usá RTL semántico (`getByRole`, `getByText`) o Playwright. No propongas `toMatchSnapshot`.

## El ciclo

```
RED    → escribí un test que falle (la feature no existe todavía)
GREEN  → mínimo código para que pase
REFACTOR → mejorá sin romper; el test queda verde
```

**Nunca saltees el red.** Si el test pasa en la primera corrida, no está probando nada nuevo.

## Para un blok CMS

Un blok adaptador fino (solo pasa props) → test-after liviano: que rinde el contenido esperado. Un blok con lógica (mapea variantes, condiciona por `data`, arma listas) → TDD real.

### RED — test primero (RTL semántico)

`src/CMS/components/CMSMiBlok/CMSMiBlok.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import CMSMiBlok from './index';

describe('CMSMiBlok', () => {
  it('renderiza el título que viene de Storyblok', () => {
    const data = { component: 'MiBlok', _uid: '1', _editable: '', title: 'Black Friday' };
    render(<CMSMiBlok data={data} />);
    expect(screen.getByText('Black Friday')).toBeInTheDocument();
  });

  it('muestra el CTA solo cuando hay ctaUrl', () => {
    const data = { component: 'MiBlok', _uid: '2', _editable: '', title: 'X', ctaUrl: '/promos' };
    render(<CMSMiBlok data={data} />);
    expect(screen.getByRole('link', { name: /promos/i })).toHaveAttribute('href', '/promos');
  });
});
```

Corré y mirá fallar:
```bash
npx jest src/CMS/components/CMSMiBlok --watch
# o, por el passthrough de pnpm (ojo, "pnpm test -- --testPathPattern" se come el flag):
pnpm test:specific -t "CMSMiBlok"
```

> Trampa de flags: `pnpm test -- --testPathPattern=` no pasa bien el flag. Usá `npx jest <path>` o `pnpm test:specific`.

### GREEN — implementación mínima

El blok de la lección 02. Lo justo para que los dos tests pasen. Nada más.

### REFACTOR

Extraé un `useMemo` si mapeás listas (como hace `CMSHeroPrimary` con `pills`), limpiá nombres. Los tests siguen verdes.

## Deriva los casos de la spec

Los scenarios GIVEN/WHEN/THEN de tu `spec-delta.md` (lección 01) son tus casos de test. Un scenario = al menos un `it(...)`. Si un scenario no tiene test, el gate SDD de la lección 04 lo marca.

## Qué NO testear (no infles coverage)

- Adaptadores 1:1 sin transformación (cubierto por el render test).
- Que React renderice (eso lo prueba React).
- Snapshots (prohibidos).

## Checklist de salida

- [ ] Test escrito **antes** de la implementación, visto fallar (red)
- [ ] Implementación mínima → verde
- [ ] RTL semántico (`getByRole`/`getByText`), **sin snapshots**
- [ ] Cada scenario de la spec tiene su `it(...)`
- [ ] `pnpm test` verde

> Siguiente: [04 · Gates de validación](04-gates-validacion.md)
