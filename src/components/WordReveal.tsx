'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { reducedMotion, watchReducedMotion } from '@/lib/motion'
import { MaskedWords } from '@/components/MaskedWords'

type Props = { text: string; className?: string }

/** Titre de section révélé mot à mot quand il entre dans la vue (IntersectionObserver, sans ScrollTrigger). */
export function WordReveal({ text, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const start = (): (() => void) | undefined => {
      if (reducedMotion()) return
      const words = el.querySelectorAll<HTMLElement>('[data-word]')
      gsap.set(words, { yPercent: 110 })

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          io.disconnect()
          gsap.to(words, { yPercent: 0, duration: 1, ease: 'power3.out', stagger: 0.05 })
        },
        { rootMargin: '0px 0px -12% 0px' },
      )
      io.observe(el)

      return () => {
        io.disconnect()
        gsap.killTweensOf(words)
        gsap.set(words, { clearProps: 'all' })
      }
    }

    let stop = start()
    const off = watchReducedMotion(() => {
      stop?.()
      stop = start()
    })
    return () => {
      off()
      stop?.()
    }
  }, [])

  return (
    <h2 ref={ref} aria-label={text} className={className}>
      <MaskedWords text={text} />
    </h2>
  )
}
