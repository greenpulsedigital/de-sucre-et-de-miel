export const SITE = {
  name: 'De Sucre & de Miel',
  tagline: 'Tartes alpines artisanales pour les professionnels',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'fr_FR',
}

export const WHATSAPP_URL = 'https://wa.me/33677235888'

export const NAV = [
  { href: '/creations', label: 'Nos produits' },
  { href: '/maison', label: 'La maison' },
  { href: '/professionnels', label: 'Devenir revendeur' },
  { href: '/actualites', label: 'Actualités' },
] as const
