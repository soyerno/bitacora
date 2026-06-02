// SOLUCIÓN DE REFERENCIA — src/CMS/components/CMSSectionPromoBanner/index.tsx
//
// Adaptador fino: data de Storyblok → UI con tokens del design system.
// NOTA: las clases de color (bg-sdk-*) son ilustrativas — usá los tokens REALES
// definidos en tailwind.config.js de modo-landing. Nunca hex hardcodeado.
// Si existe un componente de @playsistemico/modo-ui-lib-web que encaje, preferilo
// sobre este <section> propio.

import React, { useMemo } from 'react';
import { ICMSSectionPromoBanner } from './types';

interface Props {
  data: ICMSSectionPromoBanner;
}

const VARIANT_CLASS: Record<NonNullable<ICMSSectionPromoBanner['variant']>, string> = {
  primary: 'bg-sdk-primary text-sdk-on-primary',
  secondary: 'bg-sdk-secondary text-sdk-on-secondary',
};

export default function CMSSectionPromoBanner({ data }: Readonly<Props>) {
  const { title, subtitle, items, ctaText, ctaUrl, variant = 'primary' } = data;

  const itemList = useMemo(
    () => (items ?? []).map((item, i) => <li key={`${item.text}-${i}`}>{item.text}</li>),
    [items]
  );

  return (
    <section className={`cms-promo-banner ${VARIANT_CLASS[variant]}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {itemList.length > 0 && <ul>{itemList}</ul>}
      {ctaUrl && (
        <a href={ctaUrl} className="cms-promo-banner__cta">
          {ctaText ?? 'Ver más'}
        </a>
      )}
    </section>
  );
}
