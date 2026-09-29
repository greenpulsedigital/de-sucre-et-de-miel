import Link from 'next/link'
import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { EventForm } from '@/components/forms'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Événements — gâteaux d’anniversaire, mariage, baptême',
  description: 'Gâteau d’anniversaire, pièce de mariage, baptême, réception : une création unique réalisée à l’atelier dans la Drôme. Demandez votre devis.',
  path: '/evenements',
})

const EVENTS = [
  { id: 'anniversaire', title: 'Anniversaire', text: 'Un gâteau à la taille de la tablée, personnalisé selon l’âge, les goûts et le thème.', examples: 'Gâteau décoré, entremets, assortiment de petites pièces' },
  { id: 'mariage', title: 'Mariage', text: 'Pièce principale et desserts pour accompagner la journée, pensés avec vous.', examples: 'Pièce montée, wedding cake, buffet de desserts' },
  { id: 'bapteme', title: 'Baptême', text: 'Des douceurs délicates pour la célébration en famille.', examples: 'Gâteau décoré, petites gourmandises, dragées maison' },
  { id: 'reception', title: 'Réception', text: 'Pour un repas de famille, une fête ou un cocktail : des desserts faciles à partager.', examples: 'Tartes, verrines, mignardises' },
  { id: 'entreprise', title: 'Entreprise', text: 'Séminaire, inauguration, cadeau clients : des créations à votre image.', examples: 'Plateaux gourmands, pièces personnalisées' },
]

export default function EventsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Événements', path: '/evenements' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Événements' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" title="Votre événement mérite une création unique." subtitle="Décrivez-nous l’occasion : nous vous répondons avec une proposition adaptée." />
          <p className="mt-8"><a href="#demande" className="btn btn-primary">Faire une demande</a></p>
        </div>
      </section>

      <section className="pb-16">
        <ul className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e) => (
            <li key={e.id} id={e.id} className="reveal rounded-sm bg-white p-7">
              <h2 className="!text-2xl">{e.title}</h2>
              <p className="mt-3">{e.text}</p>
              <p className="mt-3 text-sm text-charcoal"><span className="font-semibold text-cocoa">Exemples : </span>{e.examples}</p>
              <p className="mt-5"><Link href="#demande" className="font-semibold text-cocoa underline">Demander pour un {e.title.toLowerCase()}</Link></p>
            </li>
          ))}
        </ul>
      </section>

      <section id="demande" className="section bg-cream-deep scroll-mt-24">
        <div className="container-x max-w-3xl">
          <h2>Demande événementielle</h2>
          <p className="mb-8 mt-3 text-lg">Nous étudions chaque demande et confirmons la faisabilité avant tout engagement.</p>
          <EventForm />
        </div>
      </section>
    </>
  )
}
