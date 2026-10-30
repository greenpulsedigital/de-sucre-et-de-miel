import Image from 'next/image'
import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { Hero } from '@/components/Hero'
import { SmoothScroll } from '@/components/SmoothScroll'
import { WordReveal } from '@/components/WordReveal'
import { CTASection, InstagramGrid, ProductGrid, SectionHeader, Testimonial } from '@/components/blocks'
import { getProducts, getSettings, getTestimonials, media } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Tartes alpines artisanales pour professionnels | De Sucre & de Miel',
  absoluteTitle: true,
  description: 'Fabricant artisanal de tartes alpines à la confiture et de pains d’épices dans la Drôme. Fournisseur pour professionnels partout en France.',
  path: '/',
})

export default async function HomePage() {
  const [settings, featured, testimonials] = await Promise.all([
    getSettings(),
    getProducts(),
    getTestimonials(),
  ])
  const sizePhoto = media((featured.find((p) => p.slug === 'tarte-abricot') ?? featured[0])?.images?.[0]?.image)
  const quotePhoto = media(featured.find((p) => p.slug?.startsWith('pain-d-epices'))?.images?.[0]?.image)

  return (
    <>
      <SmoothScroll />

      {/* HERO : titre fort sur fond crème + tarte au citron qui tourne au défilement */}
      <Hero
        eyebrow="Vente uniquement aux professionnels"
        title="Tartes alpines et pains d’épices artisanaux pour les professionnels"
        lead="Neuf recettes en trois tailles, plus des pains d’épices. Fabriquées à la main par William Frachisse, livrées dans toute la France."
        ctas={
          <>
            <Link href="/professionnels" className="btn btn-primary">Demander les tarifs pro</Link>
            <Link href="/creations" className="btn btn-secondary">Voir la gamme</Link>
          </>
        }
        visual={<Image src="/images/Tarte-citron.webp" alt="Tarte au citron artisanale, vue du dessus" width={1024} height={1024} sizes="(min-width: 48rem) 35rem, 22rem" priority className="h-full w-full object-contain" />}
      />

      {/* BANDEAU */}
      <section aria-label="En bref" className="bg-honey font-display text-lg font-bold text-charcoal md:text-xl">
        <div className="container-x flex flex-wrap justify-between gap-x-8 gap-y-1 py-4 md:py-5">
          <span>9 tartes</span><span>3 tailles</span><span>3 pains d’épices</span><span>Livraison partout en France</span><span>B2B uniquement</span>
        </div>
      </section>

      {/* GAMME */}
      <section id="gamme" className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-12">
            <WordReveal text="La gamme, en un coup d’œil." className="max-w-3xl" />
            <p className="max-w-md text-lg">Myrtille, abricot, framboise, fraise, citron, chocolat, praline, mendiant et noix : <Link href="/creations/tartes-alpines" className="underline">nos neuf tartes alpines</Link>, chacune en 28, 24 et 14 cm. Et trois <Link href="/creations/pains-d-epices" className="underline">pains d’épices artisanaux</Link>.</p>
          </div>
          <div className="mt-10 md:mt-14"><ProductGrid products={featured} /></div>
          <p className="mt-10"><Link href="/creations" className="btn btn-secondary">Voir tous les produits</Link></p>
        </div>
      </section>

      {/* TAILLES */}
      <section className="section bg-cream-deep">
        <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <WordReveal text="Trois tailles pour chaque comptoir." />
            <p className="mt-5 max-w-lg text-lg">La grande pour la vitrine et la découpe, la moyenne pour le rayon, la petite pour la vente à l’unité. Le même goût, à l’échelle de votre clientèle.</p>
          </div>
          <ul className="flex items-end justify-between gap-3 md:gap-6">
            {[{ cm: 28, g: 550 }, { cm: 24, g: 400 }, { cm: 14, g: 100 }].map((f) => (
              <li key={f.cm} className="flex flex-col items-center gap-3 text-center" style={{ flex: `${f.cm} 1 0` }}>
                <div className="aspect-square w-full"><Photo media={sizePhoto} size="card" fit="contain" className="!p-0" sizes="(min-width: 48rem) 15rem, 30vw" fallbackLabel={`Tarte ${f.cm} cm`} /></div>
                <p className="font-display text-lg font-bold leading-tight text-charcoal md:text-2xl">{f.cm} cm<br /><span className="font-sans text-sm font-medium md:text-base">{f.g} g</span></p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVENDEURS */}
      <section className="section">
        <div className="container-x">
          <WordReveal text="Pour ceux qui vendent, hébergent, régalent." className="max-w-3xl" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              { n: '01', t: 'Épiceries', d: 'Une gamme régionale prête à mettre en rayon, en 14, 24 ou 28 cm.' },
              { n: '02', t: 'Primeurs', d: 'Le complément naturel d’un étal de fruits : myrtille, abricot, fraise.' },
              { n: '03', t: 'Gîtes', d: 'Pour le petit déjeuner, la table d’hôtes ou la vente à vos hôtes.' },
              { n: '04', t: 'Commerces de terroir', d: 'Boutiques de producteurs, fermes, comptoirs de montagne.' },
            ].map((c) => (
              <li key={c.n} className="reveal flex min-h-64 flex-col justify-between rounded-3xl border-2 border-charcoal bg-white p-7">
                <span className="font-display text-5xl font-extrabold text-coral" aria-hidden="true">{c.n}</span>
                <div><h3 className="!text-2xl">{c.t}</h3><p className="mt-2">{c.d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CITATION */}
      <section className="on-dark section bg-charcoal text-cream">
        <div className="container-x grid items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#2a221b] md:aspect-auto md:h-[26rem]">
            <Photo media={quotePhoto ?? media(settings.workshopImage)} size="wide" sizes="(min-width: 48rem) 40vw, 92vw" fallbackLabel="Pain d’épices artisanal" />
          </div>
          <div>
            <p className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">« Un clin d’œil à mon enfance. »</p>
            <p className="mt-6 max-w-xl text-lg text-cream/90 md:text-xl">Pâtissier-boulanger natif des Hautes-Alpes, William Frachisse fabrique chaque tarte et chaque pain d’épices dans le respect des traditions, en gardant la curiosité de nouvelles saveurs.</p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-honey">William Frachisse · Fondateur</p>
            <p className="mt-6"><Link href="/maison" className="btn btn-secondary">Découvrir la maison</Link></p>
          </div>
        </div>
      </section>

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
