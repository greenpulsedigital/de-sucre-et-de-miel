import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { OrderForm } from '@/components/forms'
import { getProducts } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Commander une pâtisserie artisanale',
  description: 'Choisissez une création, indiquez la date et vos envies : l’atelier vérifie la disponibilité et confirme votre commande. Pas de paiement en ligne.',
  path: '/commander',
})

export const dynamic = 'force-dynamic' // lit ?creation= pour présélectionner la fiche produit

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ creation?: string }> }) {
  const [{ creation }, products] = await Promise.all([searchParams, getProducts()])
  return (
    <>
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Commander' }]} />
      <section className="section !pt-8">
        <div className="container-x max-w-3xl">
          <SectionHeader as="h1" title="Commander" subtitle="Découvrir, choisir, demander, confirmer. Nous vérifions la disponibilité et vous confirmons la commande : aucun paiement en ligne." />
          <div className="mt-10">
            <OrderForm
              preselected={creation}
              products={products.map((p) => ({ slug: p.slug!, name: p.name, formats: (p.formats ?? []).map((f) => f.label) }))}
            />
          </div>
        </div>
      </section>
    </>
  )
}
