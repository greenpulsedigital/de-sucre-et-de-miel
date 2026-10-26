import type { MetadataRoute } from 'next'
import { getCategories, getProducts } from '@/lib/data'
import { SITE } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, products] = await Promise.all([getCategories(), getProducts()])
  const fixed = ['', '/creations', '/maison', '/professionnels', '/contact', '/mentions-legales', '/confidentialite']
  return [
    ...fixed.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...cats.map((c) => ({ url: `${SITE.url}/creations/${c.slug}`, lastModified: c.updatedAt, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE.url}/creations/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
  ]
}
