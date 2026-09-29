import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Photo } from '@/components/Photo'
import { Breadcrumb, ProductGrid, SectionHeader } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import { ALLERGENS } from '@/collections/Products'
import { category, getCategories, getCategoryBySlug, getProductBySlug, getProducts, media } from '@/lib/data'
import { isAvailable } from '@/lib/availability'
import { priceText, dateFr } from '@/lib/format'
import { breadcrumbSchema, productSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import type { Media } from '@/payload-types'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()])
  return [...cats, ...products].map((x) => ({ slug: x.slug! }))
}

/** /creations/[slug] sert à la fois les catégories (tartes, gateaux…) et les fiches produit. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategoryBySlug(slug)
  if (cat) {
    return buildMetadata({
      title: `${cat.name} artisanales dans la Drôme`,
      description: cat.description || `${cat.name} faites à l’atelier De Sucre & de Miel, Montboucher-sur-Jabron.`,
      path: `/creations/${cat.slug}`,
      image: media(cat.image),
    })
  }
  const p = await getProductBySlug(slug)
  if (!p) return {}
  return buildMetadata({
    title: p.name,
    description: p.excerpt,
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
        <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Créations', path: '/creations' }, { name: cat.name, path: `/creations/${cat.slug}` }])} />
        <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Créations', href: '/creations' }, { name: cat.name }]} />
        <section className="section !pt-8">
          <div className="container-x">
            <SectionHeader as="h1" title={cat.name} subtitle={cat.description ?? undefined} />
            <div className="mt-12"><ProductGrid products={products} /></div>
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
      <JsonLd data={productSchema(p, images)} />
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Créations', path: '/creations' }, ...(c ? [{ name: c.name, path: `/creations/${c.slug}` }] : []), { name: p.name, path: `/creations/${p.slug}` }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Créations', href: '/creations' }, ...(c ? [{ name: c.name, href: `/creations/${c.slug}` }] : []), { name: p.name }]} />

      <article className="section !pt-8">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <div className="card-img aspect-[4/3]">
              <Photo media={images[0]} size="wide" sizes="(min-width: 64rem) 55vw, 92vw" priority fallbackLabel={p.name} />
            </div>
            {images.length > 1 && (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {images.slice(1).map((m) => (
                  <li key={m.id} className="card-img aspect-[4/3]"><Photo media={m} sizes="20vw" /></li>
                ))}
              </ul>
            )}
          </div>

          <div>
            {c && <p className="eyebrow mb-2"><Link href={`/creations/${c.slug}`} className="no-underline hover:underline">{c.name}</Link></p>}
            <h1 className="!text-4xl md:!text-5xl">{p.name}</h1>
            {price && <p className="mt-3 text-xl font-semibold text-cocoa">{price}</p>}
            <p className="mt-1 text-sm text-charcoal">Prix indicatif, confirmé lors de votre demande.</p>

            <p className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${available ? 'bg-emerald-100 text-emerald-900' : 'bg-cream-deep text-cocoa'}`}>
              {available ? 'Disponible' : 'Actuellement indisponible'}
              {p.seasonal && p.availableFrom && p.availableUntil && ` · du ${dateFr(p.availableFrom)} au ${dateFr(p.availableUntil)}`}
            </p>

            <p className="mt-6 text-lg">{p.description}</p>

            <dl className="mt-8 space-y-5 border-t border-cocoa/15 pt-6">
              {p.ingredients && (<div><dt className="font-semibold text-cocoa">Composition</dt><dd className="mt-1">{p.ingredients}</dd></div>)}
              {allergens.length > 0 && (<div><dt className="font-semibold text-cocoa">Allergènes</dt><dd className="mt-1">{allergens.join(', ')}</dd></div>)}
              {(p.formats?.length ?? 0) > 0 && (
                <div><dt className="font-semibold text-cocoa">Formats</dt><dd className="mt-1">{p.formats!.map((f) => f.label).join(' · ')}</dd></div>
              )}
            </dl>

            <div className="mt-8">
              {available ? (
                <Link href={`/commander?creation=${p.slug}`} className="btn btn-primary">Demander ce produit</Link>
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
            <h2>Dans la même catégorie</h2>
            <div className="mt-10"><ProductGrid products={related} /></div>
          </div>
        </section>
      )}
    </>
  )
}
