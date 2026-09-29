import Link from 'next/link'
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
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-cocoa no-underline md:text-2xl">
          {SITE.name}
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.97rem] font-medium text-charcoal no-underline hover:text-honey-deep hover:underline">
              {item.label}
            </Link>
          ))}
          <Link href="/commander" className="btn btn-primary !min-h-11 !py-2">
            Commander
          </Link>
        </nav>

        {/* Navigation mobile sans JavaScript : <details> natif */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/commander" className="btn btn-primary !min-h-11 !px-4 !py-2 !text-[0.95rem]">
            Commander
          </Link>
          <details className="group relative">
            <summary
              className="flex h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-cocoa px-3 text-sm font-semibold text-cocoa [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Fermer</span>
            </summary>
            <nav
              aria-label="Navigation mobile"
              className="fixed inset-x-0 top-[4.5rem] z-40 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-cocoa/10 bg-cream px-5 pb-8 pt-4 shadow-lg"
            >
              <ul className="flex flex-col">
                {[{ href: '/', label: 'Accueil' }, ...NAV, { href: '/contact', label: 'Contact' }].map((item) => (
                  <li key={item.href} className="border-b border-cocoa/10">
                    <Link href={item.href} className="block py-4 font-display text-xl text-cocoa no-underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
