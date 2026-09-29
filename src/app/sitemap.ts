import type { MetadataRoute } from 'next'
import { getArticles, getCategories, getProducts } from '@/lib/data'
import { SITE } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, products, articles] = await Promise.all([getCategories(), getProducts(), getArticles(200)])
  const fixed = ['', '/creations', '/maison', '/evenements', '/professionnels', '/actualites', '/commander', '/contact', '/mentions-legales', '/confidentialite']
  return [
    ...fixed.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...cats.map((c) => ({ url: `${SITE.url}/creations/${c.slug}`, lastModified: c.updatedAt, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE.url}/creations/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...articles.map((a) => ({ url: `${SITE.url}/actualites/${a.slug}`, lastModified: a.updatedAt, priority: 0.5 })),
  ]
}
