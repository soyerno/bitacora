// SOLUCIÓN DE REFERENCIA — src/CMS/components/CMSSectionPromoBanner/CMSSectionPromoBanner.test.tsx
//
// RTL semántico, sin snapshots. Cada scenario de la spec = un it().

import { render, screen } from '@testing-library/react';
import CMSSectionPromoBanner from './index';
import { ICMSSectionPromoBanner } from './types';

const base: ICMSSectionPromoBanner = {
  component: 'SectionPromoBanner',
  _uid: 'lab-1',
  _editable: '',
  title: 'Black Friday',
};

describe('CMSSectionPromoBanner', () => {
  it('renderiza título y subtítulo de Storyblok', () => {
    render(<CMSSectionPromoBanner data={{ ...base, subtitle: 'Hasta 40% off' }} />);
    expect(screen.getByRole('heading', { name: 'Black Friday' })).toBeInTheDocument();
    expect(screen.getByText('Hasta 40% off')).toBeInTheDocument();
  });

  it('renderiza la lista de beneficios', () => {
    render(
      <CMSSectionPromoBanner
        data={{ ...base, items: [{ text: 'Envío gratis' }, { text: 'Cuotas sin interés' }] }}
      />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Cuotas sin interés')).toBeInTheDocument();
  });

  it('muestra el CTA cuando hay ctaUrl', () => {
    render(<CMSSectionPromoBanner data={{ ...base, ctaText: 'Ver promos', ctaUrl: '/promos' }} />);
    expect(screen.getByRole('link', { name: 'Ver promos' })).toHaveAttribute('href', '/promos');
  });

  it('NO muestra el CTA cuando falta ctaUrl', () => {
    render(<CMSSectionPromoBanner data={base} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
