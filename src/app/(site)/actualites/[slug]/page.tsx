import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Photo } from '@/components/Photo'
import { Breadcrumb, CTASection } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import { getArticleBySlug, media } from '@/lib/data'
import { dateFr } from '@/lib/format'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticleBySlug((await params).slug)
  if (!a) return {}
  return buildMetadata({ title: a.title, description: a.excerpt, path: `/actualites/${a.slug}`, image: media(a.coverImage), type: 'article' })
}

export default async function ArticlePage({ params }: Props) {
  const a = await getArticleBySlug((await params).slug)
  if (!a) notFound()
  const cover = media(a.coverImage)
  return (
    <>
      <JsonLd data={articleSchema(a, cover)} />
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Actualités', path: '/actualites' }, { name: a.title, path: `/actualites/${a.slug}` }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Actualités', href: '/actualites' }, { name: a.title }]} />
      <article className="section !pt-8">
        <div className="container-x max-w-3xl">
          <p className="text-sm text-charcoal"><time dateTime={a.publishedAt}>{dateFr(a.publishedAt)}</time></p>
          <h1 className="mt-2 !text-4xl md:!text-5xl">{a.title}</h1>
          {cover && <div className="card-img mt-8 aspect-[16/10]"><Photo media={cover} size="wide" sizes="(min-width: 48rem) 48rem, 92vw" priority /></div>}
          <div className="prose-tight mt-8 text-lg"><RichText data={a.content} /></div>
        </div>
      </article>
      <CTASection />
    </>
  )
}
