import { Breadcrumb, ProductGrid, SectionHeader } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import Link from 'next/link'
import { getCategories, getProducts } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Nos produits — tartes alpines et pains d’épices',
  description: 'Tartes alpines (myrtille, abricot, framboise, chocolat, citron, fraise, praline, mendiant, noix) en 28, 24 et 14 cm, et pains d’épices nature, orange et figue, pour les professionnels.',
  path: '/creations',
})

export default async function CreationsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Nos produits', path: '/creations' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Nos produits' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" title="Nos produits" subtitle="Neuf tartes alpines en 28 cm (550 g), 24 cm (400 g) et 14 cm (100 g), et trois pains d’épices (nature, orange, figue). Vente réservée aux professionnels, livraison dans toute la France." />
          <nav aria-label="Gammes" className="mt-8">
            <ul className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <li key={c.id}><Link href={`/creations/${c.slug}`} className="btn btn-secondary !min-h-11 !py-2">{c.name}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="mt-12"><ProductGrid products={products} /></div>
        </div>
      </section>
    </>
  )
}
