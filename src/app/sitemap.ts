import type { MetadataRoute } from 'next'
import { getCategories, getProducts } from '@/lib/data'
import { SITE } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, products] = await Promise.all([getCategories(), getProducts()])
  const fixed: [string, number][] = [['', 1], ['/creations', 0.9], ['/professionnels', 0.9], ['/maison', 0.6], ['/contact', 0.6], ['/mentions-legales', 0.1], ['/confidentialite', 0.1]]
  return [
    ...fixed.map(([p, priority]) => ({ url: `${SITE.url}${p}`, priority })),
    ...cats.map((c) => ({ url: `${SITE.url}/creations/${c.slug}`, lastModified: c.updatedAt, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE.url}/creations/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
  ]
}
