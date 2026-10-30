'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import gsap from 'gsap'
import { finePointer, reducedMotion, watchReducedMotion } from '@/lib/motion'
import { MaskedWords } from '@/components/MaskedWords'

type Props = {
  eyebrow: string
  title: string
  lead: string
  ctas: ReactNode
  /** Visuel détouré, sur fond transparent : il tourne sur son axe au défilement. */
  visual: ReactNode
}

/** Délai d'un élément de l'intro CSS, décalé par rang (`--i`). */
const rank = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * Hero d'accueil sur fond crème. L'intro (visuel, mots du titre, textes) et la rotation du visuel au
 * défilement sont en CSS : elles démarrent sans attendre l'hydratation et disparaissent avec
 * prefers-reduced-motion. GSAP ne gère que la parallaxe au pointeur (souris uniquement).
 */
export function Hero({ eyebrow, title, lead, ctas, visual }: Props) {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    const frameEl = frame.current
    if (!el || !frameEl) return

    const start = (): (() => void) | undefined => {
      if (reducedMotion() || !finePointer()) return

      const xTo = gsap.quickTo(frameEl, 'x', { duration: 1.2, ease: 'power3' })
      const yTo = gsap.quickTo(frameEl, 'y', { duration: 1.2, ease: 'power3' })
      let raf = 0
      let pending: PointerEvent | null = null

      // Entrées regroupées par frame d'animation : pas de travail inutile entre deux rendus.
      const apply = () => {
        raf = 0
        if (!pending) return
        const r = el.getBoundingClientRect()
        const nx = (pending.clientX - r.left) / r.width - 0.5
        const ny = (pending.clientY - r.top) / r.height - 0.5
        xTo(nx * -16)
        yTo(ny * -12)
        pending = null
      }
      const onMove = (e: PointerEvent) => {
        pending = e
        if (!raf) raf = requestAnimationFrame(apply)
      }
      const reset = () => {
        pending = null
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointermove', onMove, { passive: true })
      el.addEventListener('pointerleave', reset)
      window.addEventListener('blur', reset)

      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', reset)
        window.removeEventListener('blur', reset)
        cancelAnimationFrame(raf)
        gsap.killTweensOf(frameEl)
        gsap.set(frameEl, { clearProps: 'transform' })
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
    <section ref={root} className="overflow-hidden bg-cream">
      <div className="container-x grid items-center gap-10 py-14 md:min-h-[44rem] md:grid-cols-2 md:gap-16 md:pt-0">
        <div className="flex flex-col gap-6 pb-4 md:gap-8 md:self-center md:py-20">
          <p className="eyebrow hero-fade" style={rank(0)}>{eyebrow}</p>
          <h1 aria-label={title} className="!text-[clamp(2.5rem,4.2vw,4.5rem)]">
            <MaskedWords text={title} wordClass="hero-word" />
          </h1>
          <p className="hero-fade max-w-xl text-lg text-charcoal md:text-xl" style={rank(1)}>{lead}</p>
          <div className="hero-fade flex flex-wrap gap-4" style={rank(2)}>{ctas}</div>
        </div>
        <div className="hero-visual relative mx-auto aspect-square w-full max-w-[22rem] md:mx-0 md:max-w-[35rem] md:justify-self-end md:self-center">
          <div ref={frame} className="h-full w-full will-change-transform">
            <div className="hero-spin h-full w-full">{visual}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
