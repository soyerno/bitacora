// SOLUCIÓN DE REFERENCIA — src/CMS/components/CMSSectionPromoBanner/types.ts
// (vive en modo-landing; acá es material del lab)

import { IDefaultFields } from '../../types';

export interface IPromoItem {
  text: string;
}

export interface ICMSSectionPromoBanner extends IDefaultFields {
  title: string;
  subtitle?: string;
  items?: IPromoItem[];
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'primary' | 'secondary';
}
