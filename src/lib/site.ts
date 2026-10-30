/** Domaine canonique (sans www). En production, jamais de localhost même si NEXT_PUBLIC_SITE_URL manque. */
const PROD_URL = 'https://desucreetdemiel.fr'

export const SITE = {
  name: 'De Sucre & de Miel',
  tagline: 'Tartes alpines artisanales pour les professionnels',
  url: (process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? PROD_URL : 'http://localhost:3000')).replace(/\/$/, ''),
  locale: 'fr_FR',
}

/** Hors indexation : SITE_NOINDEX posé à la main, ou prévisualisation Vercel (automatique). */
export const NOINDEX = Boolean(process.env.SITE_NOINDEX) || process.env.VERCEL_ENV === 'preview'

export const WHATSAPP_URL = 'https://wa.me/33677235888'

export const NAV = [
  { href: '/creations', label: 'Nos produits' },
  { href: '/maison', label: 'La maison' },
  { href: '/professionnels', label: 'Devenir revendeur' },
] as const
