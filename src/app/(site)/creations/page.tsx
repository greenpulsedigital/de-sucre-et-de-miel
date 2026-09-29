import Link from 'next/link'
import { Breadcrumb, CategoryCard, ProductGrid, SectionHeader } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import { getCategories, getProducts } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Les créations — tartes, gâteaux, entremets',
  description: 'Toutes les créations de l’atelier De Sucre & de Miel : tartes, gâteaux, entremets, petites gourmandises et pièces sur mesure, dans la Drôme.',
  path: '/creations',
})

export default async function CreationsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Créations', path: '/creations' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Créations' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" title="Les créations" subtitle="Des pâtisseries imaginées au fil des saisons et réalisées à l’atelier." />
          {categories.length > 0 && (
            <nav aria-label="Catégories" className="mt-8">
              <ul className="flex flex-wrap gap-3">
                {categories.map((c) => (
                  <li key={c.id}><Link href={`/creations/${c.slug}`} className="btn btn-secondary !min-h-11 !py-2">{c.name}</Link></li>
                ))}
              </ul>
            </nav>
          )}
          <div className="mt-12"><ProductGrid products={products} /></div>
        </div>
      </section>
    </>
  )
}
