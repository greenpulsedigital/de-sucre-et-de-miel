'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/** Menu mobile : <details> natif, refermé à chaque navigation (sinon il recouvre la nouvelle page). */
export function MobileMenu({ items }: { items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])

  return (
    <details className="group relative" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary
        className="flex h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-cocoa px-3 text-sm font-semibold text-cocoa [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Fermer</span>
      </summary>
      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-0 top-[5.5rem] z-40 max-h-[calc(100dvh-5.5rem)] overflow-y-auto border-t border-cocoa/10 bg-cream px-5 pb-8 pt-4 shadow-lg md:top-[7.5rem] md:max-h-[calc(100dvh-7.5rem)]"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href} className="border-b border-cocoa/10">
              <Link href={item.href} onClick={() => setOpen(false)} className="block py-4 font-display text-xl text-cocoa no-underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  )
}
