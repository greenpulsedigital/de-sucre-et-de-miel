import type { Article, Media, Product, SiteSetting } from '@/payload-types'
import { SITE } from './site'

const abs = (u?: string | null) => (u ? (u.startsWith('http') ? u : `${SITE.url}${u}`) : undefined)

export function websiteSchema() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, inLanguage: 'fr-FR', publisher: { '@id': `${SITE.url}/#organization` } }
}

export function organizationSchema(s: SiteSetting) {
  const sameAs = s.instagramUrl ? [s.instagramUrl] : undefined
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Bakery'],
    // Atelier de fabrication : pas de vente au comptoir, d'où l'absence d'horaires d'ouverture.
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/images/logo.webp`,
    description: 'Fabricant artisanal de tartes alpines et de pains d’épices à Montboucher-sur-Jabron (Drôme), vendus uniquement aux professionnels et livrés dans toute la France.',
    founder: { '@type': 'Person', name: 'William Frachisse' },
    telephone: s.phone || undefined,
    email: s.email || undefined,
    sameAs,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address || undefined,
      postalCode: s.postalCode || undefined,
      addressLocality: s.city || 'Montboucher-sur-Jabron',
      addressRegion: 'Auvergne-Rhône-Alpes',
      addressCountry: 'FR',
    },
    areaServed: { '@type': 'Country', name: 'France' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Épiceries, primeurs, gîtes, commerces de terroir' },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
  }
}

/**
 * Fiche produit. Vente B2B sans prix public : pas d'offre tant qu'aucun prix n'est saisi dans l'admin
 * (jamais de prix, d'avis ni de note inventés pour obtenir un résultat enrichi).
 */
export function productSchema(p: Product, images: Media[], opts: { category?: string; available: boolean }) {
  const url = `${SITE.url}/creations/${p.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: images.map((m) => abs(m.sizes?.wide?.url || m.url)).filter(Boolean),
    url,
    category: opts.category,
    brand: { '@type': 'Brand', name: SITE.name },
    manufacturer: { '@id': `${SITE.url}/#organization` },
    ...(typeof p.price === 'number'
      ? { offers: { '@type': 'Offer', priceCurrency: 'EUR', price: p.price, availability: `https://schema.org/${opts.available ? 'InStock' : 'OutOfStock'}`, url } }
      : {}),
  }
}

/** Liste des produits d'une page catalogue ou catégorie, dans l'ordre affiché. */
export function itemListSchema(name: string, products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE.url}/creations/${p.slug}` })),
  }
}

export function articleSchema(a: Article, cover: Media | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    image: cover ? abs(cover.sizes?.wide?.url || cover.url) : undefined,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.url}/actualites/${a.slug}`,
  }
}
