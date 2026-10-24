import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { ProForm } from '@/components/forms'
import { JsonLd } from '@/components/JsonLd'
import { getProductBySlug } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Devenir revendeur — tartes alpines pour épiceries, primeurs, gîtes',
  description: 'Vente en B2B uniquement : tartes aux fruits et pains d’épices artisanaux pour épiceries, primeurs, gîtes et commerces de terroir. Trois tailles, neuf recettes. Demandez nos conditions.',
  path: '/professionnels',
})

export const dynamic = 'force-dynamic' // lit ?tarte= pour préremplir la demande

const SEGMENTS = [
  { t: 'Épiceries', d: 'Une gamme de tartes régionales à mettre en rayon, en formats 14, 24 ou 28 cm.' },
  { t: 'Primeurs', d: 'Le complément idéal d’un étal de fruits : myrtille, abricot, framboise, fraise…' },
  { t: 'Gîtes et hébergements', d: 'Des tartes pour le petit déjeuner, la table d’hôtes ou la vente à vos hôtes.' },
  { t: 'Commerces de terroir', d: 'Boutiques de producteurs, fermes, offices de tourisme, comptoirs de montagne.' },
]

const FORMATS = [
  { size: '28 cm', weight: '550 g' },
  { size: '24 cm', weight: '400 g' },
  { size: '14 cm', weight: '100 g' },
]

export default async function ProsPage({ searchParams }: { searchParams: Promise<{ tarte?: string }> }) {
  const { tarte } = await searchParams
  const product = tarte ? await getProductBySlug(tarte) : null
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Devenir revendeur', path: '/professionnels' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Devenir revendeur' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" title="Nos tartes alpines, pour votre commerce." subtitle="Nous vendons uniquement aux professionnels et livrons dans toute la France. Dites-nous qui vous êtes et ce dont vous avez besoin : nous revenons vers vous avec nos tarifs, minimums et modalités de livraison." />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((s) => (
              <li key={s.t} className="reveal rounded-sm bg-white p-6"><h2 className="!text-xl">{s.t}</h2><p className="mt-2">{s.d}</p></li>
            ))}
          </ul>
          <h2 className="mt-14 !text-2xl">Trois tailles pour chaque recette</h2>
          <ul className="mt-5 flex flex-wrap gap-4">
            {FORMATS.map((f) => (
              <li key={f.size} className="rounded-sm border border-cocoa/15 bg-white px-6 py-4"><span className="font-display text-2xl text-cocoa">{f.size}</span><span className="ml-3 text-charcoal">{f.weight}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section bg-cream-deep">
        <div className="container-x max-w-3xl">
          <h2>Demander nos conditions</h2>
          <div className="mt-8"><ProForm interest={product?.name} /></div>
        </div>
      </section>
    </>
  )
}
