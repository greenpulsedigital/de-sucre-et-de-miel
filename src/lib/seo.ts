import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { SITE } from './site'

/** Image de partage par défaut (1200 × 630) quand la page n'a pas de photo propre. */
const DEFAULT_OG = { url: '/images/og-default.jpg', width: 1200, height: 630, alt: `${SITE.name}, tartes alpines et pains d’épices artisanaux` }

/**
 * Métadonnées d'une page. `title` reçoit le suffixe « | De Sucre & de Miel » du gabarit ;
 * `absoluteTitle: true` l'utilise tel quel (titres qui contiennent déjà la marque ou sont déjà longs).
 */
export function buildMetadata(opts: {
  title: string
  absoluteTitle?: boolean
  description: string
  path: string
  image?: Media | null
  type?: 'website' | 'article'
  noindex?: boolean
}): Metadata {
  const url = `${SITE.url}${opts.path}`
  // Les aplats provisoires du seed ne servent jamais d'image de partage.
  const photo = opts.image?.alt?.startsWith('Photo provisoire') ? null : opts.image
  const img = photo?.sizes?.wide?.url || photo?.url
  const images = img ? [{ url: img, alt: photo?.alt || opts.title }] : [DEFAULT_OG]
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: opts.type ?? 'website',
      images,
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: images.map((i) => i.url) },
  }
}
