import Image from 'next/image'
import Link from 'next/link'
import { MobileMenu } from '@/components/MobileMenu'
import { NAV, SITE } from '@/lib/site'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-cocoa focus:px-4 focus:py-2 focus:text-cream"
      >
        Aller au contenu
      </a>
      <div className="container-x flex h-[5.5rem] items-center md:h-[7.5rem] justify-between gap-6">
        <Link href="/" className="flex h-full items-center gap-3 font-display text-xl font-extrabold tracking-tight text-cocoa no-underline md:text-2xl">
          <Image src="/images/logo-dark.webp" alt="" width={120} height={120} priority className="h-full w-auto" />
          <span className="sr-only">{SITE.name}</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.97rem] font-medium text-charcoal no-underline hover:text-honey-deep hover:underline">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary !min-h-11 !py-2">
            Nous contacter
          </Link>
        </nav>

        {/* Navigation mobile : <details> natif, refermé à la navigation */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/professionnels" className="btn btn-primary !min-h-11 !px-4 !py-2 !text-[0.95rem]">
            Revendeur
          </Link>
          <MobileMenu items={[{ href: '/', label: 'Accueil' }, ...NAV, { href: '/contact', label: 'Contact' }]} />
        </div>
      </div>
    </header>
  )
}
