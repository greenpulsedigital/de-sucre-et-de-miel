import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/data'
import { NAV, SITE } from '@/lib/site'
import { telHref } from '@/lib/format'

export async function Footer() {
  const s = await getSettings()
  return (
    <footer className="on-dark bg-cocoa text-cream">
      <div className="container-x grid items-start gap-10 pb-14 pt-0 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">
        <div className="md:col-span-1">
          <Image src="/images/logo-footer.webp" alt="" width={205} height={200} className="mb-5 block h-40 w-auto" />
          <p className="font-display text-2xl text-white">{SITE.name}</p>
          <p className="mt-3 text-justify text-cream/85 [hyphens:auto]" lang="fr">{SITE.tagline}. Vente uniquement aux professionnels : épiceries, primeurs, gîtes et commerces de terroir.</p>
        </div>
        <nav aria-label="Pied de page" className="md:col-span-1 md:pt-[11.25rem]">
          <p className="mb-3 font-semibold text-white">Explorer</p>
          <ul className="space-y-2">
            {[...NAV, { href: '/contact', label: 'Contact' }].map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-cream/90 hover:text-white">{i.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-1 md:pt-[11.25rem]">
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
      </div>
      <div aria-hidden="true" className="flex h-1.5">
        <span className="flex-1 bg-sage" /><span className="flex-1 bg-honey" /><span className="flex-1 bg-coral" />
      </div>
      <div>
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
