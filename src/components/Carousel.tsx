'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type Slide = { src: string; alt: string }

/** Carrousel accessible : défilement par accrochage (scroll-snap), boutons, pastilles, flèches du clavier. Pas de lecture automatique. */
export function Carousel({ slides, label, sizes = '(min-width: 48rem) 45vw, 92vw' }: { slides: Slide[]; label: string; sizes?: string }) {
  const track = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const n = (i + slides.length) % slides.length
    el.scrollTo({ left: n * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const btn = 'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-charcoal shadow transition hover:bg-white'

  return (
    <section aria-roledescription="carrousel" aria-label={label} className="relative">
      <ul
        ref={track}
        tabIndex={0}
        aria-live="polite"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
        }}
        className="flex aspect-square snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-[1.25rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <li key={s.src} className="relative h-full w-full shrink-0 snap-center">
            <div role="group" aria-roledescription="diapositive" aria-label={`${i + 1} sur ${slides.length}`} className="h-full w-full">
              <Image src={s.src} alt={s.alt} width={1400} height={1400} sizes={sizes} loading={i === 0 ? 'eager' : 'lazy'} className="h-full w-full object-cover" />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" aria-label="Photo précédente" onClick={() => go(index - 1)} className={`${btn} left-3`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" aria-label="Photo suivante" onClick={() => go(index + 1)} className={`${btn} right-3`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="mt-4 flex justify-center gap-1">
        {slides.map((s, i) => (
          <button key={s.src} type="button" aria-label={`Aller à la photo ${i + 1}`} aria-current={i === index} onClick={() => go(i)} className="flex h-11 w-7 items-center justify-center">
            <span className={`block h-2.5 rounded-full transition-all ${i === index ? 'w-6 bg-honey' : 'w-2.5 bg-cream/40'}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
