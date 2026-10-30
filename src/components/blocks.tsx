import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Category, Media, Product, Testimonial, SiteSetting } from '@/payload-types'
import { Photo } from './Photo'
import { category, media } from '@/lib/data'
import { priceText, telHref } from '@/lib/format'

export function SectionHeader({ eyebrow, title, subtitle, as: Tag = 'h2', className = '' }: { eyebrow?: string; title: string; subtitle?: string; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag>{title}</Tag>
      {subtitle && <p className="mt-4 text-lg text-charcoal/85">{subtitle}</p>}
    </div>
  )
}

export function Breadcrumb({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="container-x pt-6 text-sm text-charcoal">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="hover:text-cocoa">{it.name}</Link> : <span aria-current="page" className="text-cocoa">{it.name}</span>}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Fond de tuile par recette (repris du logo : tons doux, texte charbon > 12:1). */
const TILE_BG: Record<string, string> = {
  'tarte-myrtille': '#d9d3e6', 'tarte-abricot': '#f6d9b4', 'tarte-framboise': '#ebcfd3', 'tarte-fraise': '#f5cfc8',
  'tarte-citron': '#f7ebb0', 'tarte-chocolat': '#e4d3c6', 'tarte-praline': '#f2cbd6', 'tarte-mendiant': '#e9dec8', 'tarte-noix': '#eadcc0',
}
export const tileBg = (slug?: string | null) => (slug && TILE_BG[slug]) || '#e5dccb'

/** « 28 · 24 · 14 cm » pour les tartes, « 350 g » pour un pain d'épices. */
export function sizesText(p: Pick<Product, 'formats'>) {
  const labels = (p.formats ?? []).map((f) => f.label)
  const cm = labels.map((l) => l.match(/^(\d+) cm/)?.[1])
  return cm.length > 0 && cm.every(Boolean) ? `${cm.join(' · ')} cm` : labels.join(' · ')
}

/** Illustrations des parfums de pain d'épices : les trois partagent la même photo, la pastille les distingue. */
const FLAVOR_ICONS: Record<string, ReactNode> = {
  'pain-d-epices-orange': (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <circle cx="24" cy="27" r="16" fill="#f0912f" />
      <circle cx="24" cy="27" r="16" fill="none" stroke="#c96a12" strokeWidth="1.5" />
      <circle cx="18" cy="22" r="1" fill="#f9b968" /><circle cx="29" cy="31" r="1" fill="#f9b968" /><circle cx="20" cy="33" r="1" fill="#f9b968" /><circle cx="30" cy="21" r="1" fill="#f9b968" />
      <ellipse cx="17.5" cy="21" rx="4" ry="2.5" fill="#fbc98a" opacity=".7" transform="rotate(-35 17.5 21)" />
      <path d="M24 11.5v-3" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 10c3-4.5 8.5-5 11-3.5-1.5 4-6.5 5.5-11 3.5Z" fill="#5f9a54" />
    </svg>
  ),
  'pain-d-epices-figue': (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <path d="M24 9c2 0 3 2 3.5 4.5C34 17 39 23 39 30c0 7.5-6.7 12-15 12S9 37.5 9 30c0-7 5-13 11.5-16.5C21 11 22 9 24 9Z" fill="#7a3f6e" />
      <path d="M24 9c2 0 3 2 3.5 4.5C34 17 39 23 39 30c0 7.5-6.7 12-15 12S9 37.5 9 30c0-7 5-13 11.5-16.5C21 11 22 9 24 9Z" fill="none" stroke="#552a4c" strokeWidth="1.5" />
      <path d="M16 24c-2 3-2.5 7-1 10" stroke="#a96a9c" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M24 9V5" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 7c-2.5-3.5-7-4-9-2.5 1.5 3.5 5.5 4.5 9 2.5Z" fill="#5f9a54" />
    </svg>
  ),
}

/** Pastille illustrée du parfum (orange, figue), décorative : le nom du produit l'énonce déjà. */
export function FlavorBadge({ slug, className = '' }: { slug?: string | null; className?: string }) {
  const icon = slug && FLAVOR_ICONS[slug]
  if (!icon) return null
  return <span aria-hidden="true" className={`absolute bottom-3 right-3 z-10 drop-shadow-sm ${className}`}>{icon}</span>
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const img = media(product.images?.[0]?.image)
  const price = priceText(product)
  return (
    <article className="reveal h-full">
      <Link href={`/creations/${product.slug}`} className="flex h-full flex-col overflow-hidden rounded-[1.75rem] no-underline transition-transform duration-200 hover:-translate-y-1" style={{ background: tileBg(product.slug) }}>
        <div className="relative aspect-[6/5]">
          <FlavorBadge slug={product.slug} className="h-11 w-11 md:bottom-5 md:right-5 md:h-14 md:w-14" />
          <Photo media={img} size="card" fit={product.slug?.startsWith('pain-d-epices') ? 'cover' : 'contain'} sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 45vw, 46vw" priority={priority} fallbackLabel={product.name} />
        </div>
        <div className="mt-auto px-4 pb-5 pt-4 md:px-8 md:pb-8">
          <h3 className="!text-lg text-charcoal md:!text-3xl">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-charcoal md:text-base">{[sizesText(product), price].filter(Boolean).join(' · ')}</p>
        </div>
      </Link>
    </article>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <p className="text-charcoal">Les tartes arrivent bientôt. Écrivez-nous pour connaître la gamme.</p>
  return (
    <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}

export function CategoryCard({ category: c }: { category: Category }) {
  return (
    <Link href={`/creations/${c.slug}`} className="card-link group relative block aspect-[4/5] overflow-hidden rounded-sm no-underline">
      <div className="card-img absolute inset-0"><Photo media={media(c.image)} sizes="(min-width: 64rem) 20vw, 45vw" fallbackLabel={c.name} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />
      <span className="absolute inset-x-4 bottom-4 font-display text-xl text-white">{c.name}</span>
    </Link>
  )
}

export function ImageTextSection({ slot, image, staticImage, imagePosition = '50% 50%', imageAlt, eyebrow, title, children, reverse, dark }: { slot?: ReactNode; image: Media | null; staticImage?: string; imagePosition?: string; imageAlt?: string; eyebrow?: string; title: ReactNode; children: ReactNode; reverse?: boolean; dark?: boolean }) {
  return (
    <section className={`section ${dark ? 'on-dark bg-cocoa text-cream' : ''}`}>
      <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {slot ? (
          <div className={`reveal ${reverse ? 'md:order-2' : ''}`}>{slot}</div>
        ) : (
        <div className={`reveal aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-[5/6] ${reverse ? 'md:order-2' : ''}`}>
          {staticImage ? (
            <Image src={staticImage} alt={imageAlt ?? ''} width={1463} height={1462} sizes="(min-width: 48rem) 45vw, 92vw" className="h-full w-full object-cover" style={{ objectPosition: imagePosition }} />
          ) : (
            <Photo media={image} size="wide" sizes="(min-width: 48rem) 45vw, 92vw" fallbackLabel={imageAlt} />
          )}
        </div>
        )}
        <div className="reveal">
          {eyebrow && <p className="eyebrow mb-3" style={dark ? { color: 'var(--color-honey-light)' } : undefined}>{eyebrow}</p>}
          <h2 style={dark ? { color: '#fff' } : undefined}>{title}</h2>
          <div className="prose-tight mt-5 text-lg">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function CTASection({ title = 'Parlons de votre rayon.', text = 'Épicerie, primeur, gîte, commerce de terroir : indiquez votre activité, vos volumes et votre lieu. Nous revenons vers vous avec nos tarifs, minimums et modalités de livraison.', primary = { href: '/professionnels', label: 'Demander les tarifs pro' }, secondary }: { title?: string; text?: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="bg-honey text-charcoal">
      <div className="container-x section grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <h2>{title}</h2>
        <div>
          <p className="text-lg md:text-xl">{text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={primary.href} className="btn btn-dark">{primary.label}</Link>
            {secondary && <Link href={secondary.href} className="btn btn-secondary">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Testimonial({ t }: { t: Testimonial }) {
  return (
    <figure className="rounded-sm bg-white p-6 shadow-[0_1px_0_rgba(80,56,43,.1)]">
      <div aria-label={`${t.rating} étoiles sur 5`} role="img" className="text-honey-deep" style={{ letterSpacing: '0.15em' }}>
        {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
      </div>
      <blockquote className="mt-3 text-lg text-charcoal">« {t.quote} »</blockquote>
      <figcaption className="mt-4 font-semibold text-cocoa">— {t.firstName}</figcaption>
    </figure>
  )
}

export function InstagramGrid({ settings }: { settings: SiteSetting }) {
  const posts = settings.instagramPosts ?? []
  if (!posts.length) return null
  return (
    <section className="section bg-cream-deep">
      <div className="container-x">
        <SectionHeader title="Les coulisses de l’atelier" subtitle="Quelques images choisies, à retrouver sur Instagram." />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {posts.map((p) => {
            const m = media(p.image)
            const inner = <div className="card-img aspect-square"><Photo media={m} sizes="(min-width: 64rem) 12rem, 45vw" /></div>
            return (
              <li key={p.id} className="card-link">
                {p.url || settings.instagramUrl ? (
                  <a href={p.url || settings.instagramUrl!} rel="noopener noreferrer" aria-label={`${m?.alt ?? 'Publication'} — voir sur Instagram`}>{inner}</a>
                ) : inner}
              </li>
            )
          })}
        </ul>
        {settings.instagramUrl && (
          <p className="mt-8"><a href={settings.instagramUrl} rel="noopener noreferrer" className="btn btn-secondary">Voir Instagram</a></p>
        )}
      </div>
    </section>
  )
}
