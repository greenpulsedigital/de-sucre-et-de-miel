import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Photo } from '@/components/Photo'
import { Breadcrumb, FlavorBadge, ProductGrid, SectionHeader, sizesText } from '@/components/blocks'
import { CategoryContent } from '@/components/CategoryContent'
import { JsonLd } from '@/components/JsonLd'
import { ALLERGENS } from '@/collections/Products'
import { category, getCategories, getCategoryBySlug, getProductBySlug, getProducts, media } from '@/lib/data'
import { isAvailable } from '@/lib/availability'
import { priceText, dateFr } from '@/lib/format'
import { breadcrumbSchema, itemListSchema, productSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import type { Media } from '@/payload-types'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()])
  return [...cats, ...products].map((x) => ({ slug: x.slug! }))
}

/** Titres SEO des catégories (la page « Tartes alpines » est la page pilier du site). Sinon : nom de la catégorie. */
const CATEGORY_SEO: Record<string, { title: string; h1: string; description: string }> = {
  'tartes-alpines': {
    title: 'Tarte alpine artisanale : fabricant, 9 recettes en 3 tailles',
    h1: 'Tartes alpines artisanales',
    description: 'Tartes alpines à la confiture faites main dans la Drôme : myrtille, abricot, framboise, citron, noix… En 28, 24 et 14 cm, pour les pros de toute la France.',
  },
  'pains-d-epices': {
    title: 'Fabricant de pain d’épices artisanal pour professionnels',
    h1: 'Pains d’épices artisanaux',
    description: 'Pains d’épices artisanaux nature, orange et figue, faits main dans la Drôme. Pour épiceries fines, gîtes et commerces : livraison en France, tarifs sur demande.',
  },
}

/** « Tarte myrtille artisanale », « Pain d’épices orange artisanal ». */
const artisanal = (name: string) => `${name} ${name.startsWith('Tarte') ? 'artisanale' : 'artisanal'}`

/** /creations/[slug] sert à la fois les catégories (tartes, gateaux…) et les fiches produit. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategoryBySlug(slug)
  if (cat) {
    const seo = CATEGORY_SEO[cat.slug!]
    const first = (await getProducts({ categoryId: cat.id }))[0]
    return buildMetadata({
      title: seo?.title ?? `${cat.name} pour professionnels`,
      absoluteTitle: Boolean(seo),
      description: seo?.description ?? (cat.description || `${cat.name} de l’atelier De Sucre & de Miel, vendues aux professionnels.`),
      path: `/creations/${cat.slug}`,
      image: media(cat.image)?.alt?.startsWith('Photo provisoire') ? media(first?.images?.[0]?.image) : media(cat.image),
    })
  }
  const p = await getProductBySlug(slug)
  if (!p) return {}
  const name = artisanal(p.name)
  return buildMetadata({
    title: `${name} | Fournisseur professionnel`,
    absoluteTitle: true,
    description: `${name} ${p.name.startsWith('Tarte') ? 'fabriquée' : 'fabriqué'} à la main dans la Drôme, ${sizesText(p)}. Pour épiceries, primeurs et gîtes : livraison en France, tarifs pro sur demande.`,
    path: `/creations/${p.slug}`,
    image: media(p.images?.[0]?.image),
  })
}

export default async function CreationSlugPage({ params }: Props) {
  const { slug } = await params

  const cat = await getCategoryBySlug(slug)
  if (cat) {
    const products = await getProducts({ categoryId: cat.id })
    return (
      <>
        <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Nos produits', path: '/creations' }, { name: cat.name, path: `/creations/${cat.slug}` }])} />
        <JsonLd data={itemListSchema(cat.name, products)} />
        <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Nos produits', href: '/creations' }, { name: cat.name }]} />
        <section className="section !pt-8">
          <div className="container-x">
            <SectionHeader as="h1" title={CATEGORY_SEO[cat.slug!]?.h1 ?? cat.name} subtitle={cat.description ?? undefined} />
            <div className="mt-12"><ProductGrid products={products} /></div>
            <CategoryContent slug={cat.slug!} products={products} />
          </div>
        </section>
      </>
    )
  }

  const p = await getProductBySlug(slug)
  if (!p) notFound()

  const c = category(p.category)
  const images = (p.images ?? []).map((i) => media(i.image)).filter((m): m is Media => Boolean(m))
  const available = isAvailable(p)
  const price = priceText(p)
  const allergens = (p.allergens ?? []).map((a) => ALLERGENS.find((x) => x.value === a)?.label ?? a)
  const related = c ? (await getProducts({ categoryId: c.id })).filter((x) => x.id !== p.id).slice(0, 3) : []

  return (
    <>
      <JsonLd data={productSchema(p, images, { category: c?.name, available })} />
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Nos produits', path: '/creations' }, ...(c ? [{ name: c.name, path: `/creations/${c.slug}` }] : []), { name: p.name, path: `/creations/${p.slug}` }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Nos produits', href: '/creations' }, ...(c ? [{ name: c.name, href: `/creations/${c.slug}` }] : []), { name: p.name }]} />

      <article className="section !pt-8">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <div className="card-img relative aspect-[4/3]">
              <FlavorBadge slug={p.slug} className="h-16 w-16 md:bottom-5 md:right-5 md:h-20 md:w-20" />
              <Photo media={images[0]} size="wide" fit="contain" sizes="(min-width: 64rem) 55vw, 92vw" priority fallbackLabel={p.name} />
            </div>
            {images.length > 1 && (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {images.slice(1).map((m) => (
                  <li key={m.id} className="card-img aspect-[4/3]"><Photo media={m} fit="contain" sizes="20vw" /></li>
                ))}
              </ul>
            )}
          </div>

          <div>
            {c && <p className="eyebrow mb-2"><Link href={`/creations/${c.slug}`} className="no-underline hover:underline">{c.name}</Link></p>}
            <h1 className="!text-4xl md:!text-5xl">{p.name}</h1>
            {price && <p className="mt-3 text-xl font-semibold text-cocoa">{price}</p>}
            <p className="mt-1 text-sm text-charcoal">Vente réservée aux professionnels, livraison dans toute la France. Tarifs sur demande.</p>

            <p className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${available ? 'bg-sage-deep text-charcoal' : 'bg-cream-deep text-cocoa'}`}>
              {available ? 'Disponible' : 'Actuellement indisponible'}
              {p.seasonal && p.availableFrom && p.availableUntil && ` · du ${dateFr(p.availableFrom)} au ${dateFr(p.availableUntil)}`}
            </p>

            <p className="mt-6 text-lg">{p.description}</p>

            <dl className="mt-8 space-y-5 border-t border-cocoa/15 pt-6">
              {p.ingredients && (<div><dt className="font-semibold text-cocoa">Composition</dt><dd className="mt-1">{p.ingredients}</dd></div>)}
              {allergens.length > 0 && (<div><dt className="font-semibold text-cocoa">Allergènes</dt><dd className="mt-1">{allergens.join(', ')}</dd></div>)}
              {(p.formats?.length ?? 0) > 0 && (
                <div><dt className="font-semibold text-cocoa">Formats</dt><dd className="mt-1">{p.formats!.map((f) => f.label).join('  /  ')}</dd></div>
              )}
            </dl>

            <div className="mt-8">
              {available ? (
                <Link href={`/professionnels?tarte=${p.slug}`} className="btn btn-primary">Demander les tarifs pro</Link>
              ) : (
                <Link href="/contact" className="btn btn-secondary">Nous écrire pour la prochaine saison</Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-cream-deep">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2>Dans la même gamme</h2>
              {c && <Link href={`/creations/${c.slug}`} className="font-semibold text-cocoa underline">Voir la gamme « {c.name} »</Link>}
            </div>
            <div className="mt-10"><ProductGrid products={related} /></div>
          </div>
        </section>
      )}
    </>
  )
}
