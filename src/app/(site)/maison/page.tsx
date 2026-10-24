import Image from 'next/image'
import { Carousel, type Slide } from '@/components/Carousel'
import { Breadcrumb, CTASection, ImageTextSection, SectionHeader } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

const ATELIER: Slide[] = [
  { src: '/images/atelier/tartes-au-four.webp', alt: 'Tartes en croisillons tout juste sorties du four, sur du papier de cuisson' },
  { src: '/images/atelier/pate-pliage.webp', alt: 'Les mains du pâtissier plient une pâte étalée sur le plan de travail, en noir et blanc' },
  { src: '/images/atelier/pate-decoupe.webp', alt: 'Les mains du pâtissier découpent la pâte à l’aide d’un cercle en inox, en noir et blanc' },
  { src: '/images/atelier/atelier.webp', alt: 'Le laboratoire de l’atelier : plans de travail en inox, pétrin et réfrigérateurs' },
]

const VALEURS = [
  { t: 'Des produits authentiques', d: 'Nos tartes incarnent l’essence des produits locaux : fraîcheur, qualité et engagement envers notre communauté.' },
  { t: 'Une conservation soignée', d: 'Nous préservons la fraîcheur et la saveur de chaque tarte aux fruits et pain d’épices grâce à des techniques de conservation adaptées.' },
  { t: 'Livraison dans toute la France', d: 'Nous livrons nos créations partout en France, directement à votre commerce ou à votre établissement.' },
]

export const metadata = buildMetadata({
  title: 'La maison — William Frachisse, pâtissier-boulanger',
  description: 'William Frachisse, pâtissier-boulanger natif des Hautes-Alpes, fabrique des tartes aux fruits et des pains d’épices artisanaux pour les professionnels, livrés dans toute la France.',
  path: '/maison',
})

export default async function MaisonPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'La maison', path: '/maison' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'La maison' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" eyebrow="La maison" title="Des tartes alpines et des pains d’épices, faits main." className="!max-w-4xl [&_h1]:!text-[clamp(2.25rem,4.2vw,4rem)]" />
          <div className="card-img mt-10 aspect-[16/9]"><Image src="/images/maison-hero.webp" alt="Une tarte aux fruits rouges en croisillons posée sur un linge, à côté d’un pot de confiture, face aux sommets alpins au lever du soleil" width={2500} height={1414} quality={90} sizes="(min-width: 76rem) 72rem, 92vw" priority className="h-full w-full object-cover" /></div>
        </div>
      </section>

      <ImageTextSection image={null} staticImage="/images/william.webp" imagePosition="100% 50%" imageAlt="William Frachisse, pâtissier-boulanger, sort une plaque de tartes du four" eyebrow="Notre histoire" title="« Un clin d’œil à mon enfance »">
        <p>Je suis William Frachisse, pâtissier-boulanger, natif des Hautes-Alpes. Mon parcours commence au cœur des Alpes, là où les saveurs sont simples et les traditions culinaires vivantes.</p>
        <p>Guidé par l’héritage familial, j’ai pris la tête de deux entreprises et découvert les subtilités du métier, tout en restant fidèle aux valeurs de mon enfance.</p>
      </ImageTextSection>

      <ImageTextSection reverse dark slot={<Carousel label="Dans l’atelier" slides={ATELIER} />} image={null} imageAlt="Tartes aux fruits et pains d’épices" eyebrow="Une nouvelle aventure gourmande" title="De Sucre &amp; de Miel : tartes aux fruits et pains d’épices.">
        <p>Chaque création porte un clin d’œil à mon enfance et aux souvenirs gustatifs qui ont façonné mon amour de la pâtisserie artisanale. C’est le fruit d’un savoir-faire méticuleux, attaché aux traditions et ouvert à de nouvelles saveurs.</p>
        <p>Je vous invite à embarquer avec nous et à proposer mes créations à vos clients.</p>
      </ImageTextSection>

      <section className="section">
        <div className="container-x">
          <SectionHeader title="Un partenaire B2B de confiance" subtitle="Excellence, fiabilité et passion : les trois piliers de notre collaboration avec les épiceries, primeurs et gîtes." />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {VALEURS.map((v) => (
              <li key={v.t} className="reveal rounded-sm bg-white p-6"><h3 className="!text-xl text-cocoa">{v.t}</h3><p className="mt-2">{v.d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  )
}
