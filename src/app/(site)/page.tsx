import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { CTASection, CategoryCard, ImageTextSection, InstagramGrid, ProductGrid, SectionHeader, Testimonial } from '@/components/blocks'
import { getCategories, getProducts, getSettings, getTestimonials, getArticles, media } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'
import { dateFr } from '@/lib/format'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'De Sucre & de Miel — Pâtisserie artisanale dans la Drôme',
  description: 'Pâtisserie artisanale à Montboucher-sur-Jabron : tartes, gâteaux, entremets et créations sur mesure pour vos occasions. Commande sur demande.',
  path: '/',
})

export default async function HomePage() {
  const [settings, categories, featured, testimonials, articles] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true }),
    getTestimonials(),
    getArticles(1),
  ])
  const hero = media(settings.heroImage)
  const latest = articles[0]

  return (
    <>
      {/* HERO : une image forte, pas de slider, pas de vidéo */}
      <section className="on-dark relative isolate flex min-h-[min(85svh,52rem)] items-end overflow-hidden bg-cocoa">
        <div className="absolute inset-0 -z-10">
          <Photo media={hero} size="wide" sizes="100vw" priority fallbackLabel="Une tarte artisanale sur un plan de travail en bois" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/10 md:bg-gradient-to-r md:from-charcoal/80 md:via-charcoal/40 md:to-transparent" />
        <div className="container-x pb-14 pt-32 md:pb-24">
          <div className="max-w-xl">
            <p className="eyebrow" style={{ color: 'var(--color-honey-light)' }}>Montboucher-sur-Jabron · Drôme</p>
            <h1 className="mt-3" style={{ color: '#fff' }}>De Sucre &amp; de Miel</h1>
            <p className="mt-2 font-display text-2xl text-cream md:text-3xl">Pâtisserie artisanale dans la Drôme</p>
            <p className="mt-5 max-w-md text-lg text-cream/95">Des créations gourmandes imaginées et réalisées avec passion.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/creations" className="btn btn-secondary">Découvrir les créations</Link>
              <Link href="/commander" className="btn btn-primary">Commander</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CRÉATIONS SIGNATURE */}
      <section className="section">
        <div className="container-x">
          <SectionHeader title="Les créations" subtitle="Des pâtisseries imaginées au fil des saisons et réalisées à l’atelier." />
          {categories.length > 0 && (
            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
              {categories.map((c) => (
                <li key={c.id}><CategoryCard category={c} /></li>
              ))}
            </ul>
          )}
          <div className="mt-14">
            <ProductGrid products={featured.slice(0, 6)} />
          </div>
          <p className="mt-12"><Link href="/creations" className="btn btn-secondary">Voir toutes les créations</Link></p>
        </div>
      </section>

      {/* SAVOIR-FAIRE */}
      <ImageTextSection
        image={media(settings.workshopImage)}
        imageAlt="L’atelier de pâtisserie"
        eyebrow="Notre savoir-faire"
        title="Derrière chaque création, il y a du temps, des gestes et des produits soigneusement choisis."
      >
        <ul className="list-disc space-y-1 pl-5">
          <li>Fabrication artisanale, à l’atelier</li>
          <li>Produits de saison</li>
          <li>Petites séries</li>
        </ul>
        <p className="!mt-6"><Link href="/maison" className="btn btn-secondary">Découvrir la maison</Link></p>
      </ImageTextSection>

      {/* SAISON / ACTUALITÉ */}
      {latest && (
        <section className="section bg-cream-deep">
          <div className="container-x grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow mb-3">À la une</p>
              <h2>{latest.title}</h2>
              <p className="mt-3 text-sm text-charcoal/80">{dateFr(latest.publishedAt)}</p>
              <p className="mt-4 text-lg">{latest.excerpt}</p>
              <p className="mt-6"><Link href={`/actualites/${latest.slug}`} className="btn btn-secondary">Lire l’article</Link></p>
            </div>
            <div className="card-img aspect-[4/3]"><Photo media={media(latest.coverImage)} sizes="(min-width: 48rem) 40vw, 92vw" fallbackLabel={latest.title} /></div>
          </div>
        </section>
      )}

      {/* CRÉATIONS SUR MESURE */}
      <ImageTextSection
        reverse
        image={media(categories.find((c) => c.slug === 'creations-sur-mesure')?.image)}
        imageAlt="Création sur mesure"
        eyebrow="Créations sur mesure"
        title="Un anniversaire, un mariage, une réception : une création unique."
      >
        <p>Racontez-nous l’occasion, le nombre de personnes, vos envies. Nous imaginons la pièce avec vous et confirmons sa faisabilité.</p>
        <p className="!mt-6 flex flex-wrap gap-3">
          <Link href="/evenements" className="btn btn-secondary">Événements</Link>
          <Link href="/professionnels" className="btn btn-secondary">Professionnels</Link>
        </p>
      </ImageTextSection>

      {/* AVIS : uniquement de vrais avis */}
      {testimonials.length > 0 && (
        <section className="section bg-cream-deep">
          <div className="container-x">
            <SectionHeader title="Ils en parlent" />
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => <li key={t.id}><Testimonial t={t} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <InstagramGrid settings={settings} />

      <CTASection />
    </>
  )
}
