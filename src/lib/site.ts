export const SITE = {
  name: 'De Sucre & de Miel',
  tagline: 'Pâtisserie artisanale dans la Drôme',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'fr_FR',
}

export const NAV = [
  { href: '/creations', label: 'Créations' },
  { href: '/maison', label: 'La maison' },
  { href: '/evenements', label: 'Événements' },
  { href: '/professionnels', label: 'Professionnels' },
  { href: '/actualites', label: 'Actualités' },
] as const
