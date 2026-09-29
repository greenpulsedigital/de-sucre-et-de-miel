import Link from 'next/link'
import { getSettings } from '@/lib/data'
import { NAV, SITE } from '@/lib/site'
import { telHref } from '@/lib/format'

export async function Footer() {
  const s = await getSettings()
  return (
    <footer className="on-dark bg-cocoa text-cream">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl text-white">{SITE.name}</p>
          <p className="mt-3 text-cream/85">{SITE.tagline}. Créations faites à l’atelier, sur commande.</p>
        </div>
        <nav aria-label="Pied de page" className="md:col-span-1">
          <p className="mb-3 font-semibold text-white">Explorer</p>
          <ul className="space-y-2">
            {[...NAV, { href: '/commander', label: 'Commander' }, { href: '/contact', label: 'Contact' }].map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-cream/90 hover:text-white">{i.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-1">
          <p className="mb-3 font-semibold text-white">L’atelier</p>
          <address className="space-y-1 not-italic text-cream/90">
            {s.address && <p>{s.address}</p>}
            <p>{[s.postalCode, s.city].filter(Boolean).join(' ')}</p>
            {s.phone && (
              <p>
                <a href={telHref(s.phone)} className="text-cream hover:text-white">{s.phone}</a>
              </p>
            )}
            {s.email && (
              <p>
                <a href={`mailto:${s.email}`} className="text-cream hover:text-white">{s.email}</a>
              </p>
            )}
          </address>
        </div>
        <div className="md:col-span-1">
          <p className="mb-3 font-semibold text-white">Suivre l’atelier</p>
          {s.instagramUrl ? (
            <a href={s.instagramUrl} rel="noopener noreferrer" className="text-cream hover:text-white">Instagram</a>
          ) : (
            <p className="text-cream/70">Bientôt sur Instagram</p>
          )}
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-cream/80">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <ul className="flex gap-5">
            <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
