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

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const cat = category(product.category)
  const img = media(product.images?.[0]?.image)
  const price = priceText(product)
  return (
    <article className="card-link reveal">
      <Link href={`/creations/${product.slug}`} className="block no-underline">
        <div className="card-img aspect-[4/3]">
          <Photo media={img} size="card" sizes="(min-width: 64rem) 24rem, (min-width: 40rem) 45vw, 92vw" priority={priority} fallbackLabel={product.name} />
        </div>
        <div className="mt-4">
          {cat && <p className="eyebrow">{cat.name}</p>}
          <h3 className="mt-1 text-cocoa">{product.name}</h3>
          <p className="mt-1 text-charcoal/85">{product.excerpt}</p>
          {price && <p className="mt-2 font-semibold text-cocoa">{price}</p>}
        </div>
      </Link>
    </article>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <p className="text-charcoal">Les créations arrivent bientôt. En attendant, écrivez-nous pour une demande sur mesure.</p>
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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

export function ImageTextSection({ image, imageAlt, eyebrow, title, children, reverse, dark }: { image: Media | null; imageAlt?: string; eyebrow?: string; title: ReactNode; children: ReactNode; reverse?: boolean; dark?: boolean }) {
  return (
    <section className={`section ${dark ? 'on-dark bg-cocoa text-cream' : ''}`}>
      <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={`reveal aspect-[4/5] overflow-hidden rounded-sm md:aspect-[5/6] ${reverse ? 'md:order-2' : ''}`}>
          <Photo media={image} size="wide" sizes="(min-width: 48rem) 45vw, 92vw" fallbackLabel={imageAlt} />
        </div>
        <div className="reveal">
          {eyebrow && <p className="eyebrow mb-3" style={dark ? { color: 'var(--color-honey-light)' } : undefined}>{eyebrow}</p>}
          <h2 style={dark ? { color: '#fff' } : undefined}>{title}</h2>
          <div className="prose-tight mt-5 text-lg">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function CTASection({ title = 'Une envie, une occasion ?', text = 'Dites-nous ce que vous imaginez. Nous vérifions la disponibilité et revenons vers vous.', primary = { href: '/commander', label: 'Commander' }, secondary }: { title?: string; text?: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="on-dark bg-cocoa">
      <div className="container-x section text-center">
        <h2 className="mx-auto max-w-2xl" style={{ color: '#fff' }}>{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-cream/90">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={primary.href} className="btn btn-primary">{primary.label}</Link>
          {secondary && <Link href={secondary.href} className="btn btn-secondary">{secondary.label}</Link>}
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

export function ContactActions({ s }: { s: SiteSetting }) {
  return (
    <div className="flex flex-wrap gap-3">
      {s.phone && <a className="btn btn-primary" href={telHref(s.phone)}>Appeler</a>}
      {s.email && <a className="btn btn-secondary" href={`mailto:${s.email}`}>Écrire un email</a>}
      {s.mapsUrl && <a className="btn btn-secondary" href={s.mapsUrl} rel="noopener noreferrer">Itinéraire</a>}
    </div>
  )
}
