import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { SITE } from './site'

export function buildMetadata(opts: {
  title: string
  description: string
  path: string
  image?: Media | null
  type?: 'website' | 'article'
  noindex?: boolean
}): Metadata {
  const url = `${SITE.url}${opts.path}`
  const img = opts.image?.sizes?.wide?.url || opts.image?.url
  const images = img ? [{ url: img, alt: opts.image?.alt || opts.title }] : undefined
  return {
    title: opts.title,
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
    twitter: { card: images ? 'summary_large_image' : 'summary', title: opts.title, description: opts.description, images: images?.map((i) => i.url) },
  }
}
