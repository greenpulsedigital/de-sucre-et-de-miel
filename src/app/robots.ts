import type { MetadataRoute } from 'next'
import { NOINDEX, SITE } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }, sitemap: `${SITE.url}/sitemap.xml` }
}
