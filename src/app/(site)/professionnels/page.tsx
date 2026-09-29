import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { ProForm } from '@/components/forms'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Professionnels — desserts pour restaurants, hôtels, entreprises',
  description: 'Desserts artisanaux pour restaurants, hôtels, entreprises et événements professionnels dans la Drôme : volumes, personnalisation, livraison ou retrait.',
  path: '/professionnels',
})

const SEGMENTS = [
  { t: 'Restaurants', d: 'Desserts de carte ou de saison, en séries régulières.' },
  { t: 'Hôtels', d: 'Petits déjeuners, goûters, événements de l’établissement.' },
  { t: 'Entreprises', d: 'Cadeaux clients, séminaires, pots de départ.' },
  { t: 'Événements', d: 'Salons, inaugurations, réceptions professionnelles.' },
]

export default function ProsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Professionnels', path: '/professionnels' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Professionnels' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" title="Des créations pour les professionnels." subtitle="Volumes, fréquence, personnalisation, conditionnement, livraison ou retrait : parlons de votre besoin." />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((s) => (
              <li key={s.t} className="reveal rounded-sm bg-white p-6"><h2 className="!text-xl">{s.t}</h2><p className="mt-2">{s.d}</p></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section bg-cream-deep">
        <div className="container-x max-w-3xl">
          <h2>Parler de mon projet</h2>
          <div className="mt-8"><ProForm /></div>
        </div>
      </section>
    </>
  )
}
