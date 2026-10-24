import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import { getArticles, media } from '@/lib/data'
import { dateFr } from '@/lib/format'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Actualités de l’atelier',
  description: 'Nouvelles tartes, saison, revendeurs et coulisses de l’atelier De Sucre & de Miel.',
  path: '/actualites',
})

export default async function NewsPage() {
  const articles = await getArticles(50)
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Actualités', path: '/actualites' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Actualités' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" title="Actualités" subtitle="Nouvelles tartes, saison, coulisses de l’atelier." />
          {articles.length === 0 ? (
            <p className="mt-10">Pas encore d’actualité. Revenez bientôt.</p>
          ) : (
            <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.id} className="card-link reveal">
                  <Link href={`/actualites/${a.slug}`} className="block no-underline">
                    <div className="card-img aspect-[4/3]"><Photo media={media(a.coverImage)} sizes="(min-width: 64rem) 24rem, 92vw" fallbackLabel={a.title} /></div>
                    <p className="mt-4 text-sm text-charcoal"><time dateTime={a.publishedAt}>{dateFr(a.publishedAt)}</time></p>
                    <h2 className="!text-2xl">{a.title}</h2>
                    <p className="mt-2">{a.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
