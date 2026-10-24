'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { finePointer, reducedMotion, watchReducedMotion } from '@/lib/motion'
import { MaskedWords } from '@/components/MaskedWords'

type Props = {
  eyebrow: string
  title: string
  lead: string
  ctas: ReactNode
  photo: ReactNode
}

/**
 * Hero d'accueil. Rendu statique complet côté serveur ; l'intro GSAP ne s'exécute qu'après hydratation
 * et seulement sans prefers-reduced-motion. La parallaxe suit la souris (pas le tactile).
 */
export function Hero({ eyebrow, title, lead, ctas, photo }: Props) {
  const root = useRef<HTMLElement>(null)
  const arch = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    const archEl = arch.current
    const frameEl = frame.current
    if (!el || !archEl || !frameEl) return

    const start = (): (() => void) | undefined => {
      if (reducedMotion()) return

      const words = el.querySelectorAll<HTMLElement>('[data-word]')
      const intro = el.querySelectorAll<HTMLElement>('[data-intro]')
      const targets = [archEl, frameEl, ...Array.from(words), ...Array.from(intro)]

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(archEl, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out' }, 0)
        .fromTo(frameEl, { scale: 1.22 }, { scale: 1.06, duration: 2.2, ease: 'power2.out' }, 0)
        .fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.25)
        .fromTo(intro, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.7)

      const pointerCleanups: Array<() => void> = []
      if (finePointer()) {
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
          xTo(nx * -24)
          yTo(ny * -16)
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
        pointerCleanups.push(() => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', reset)
          window.removeEventListener('blur', reset)
          cancelAnimationFrame(raf)
        })
      }

      return () => {
        pointerCleanups.forEach((fn) => fn())
        tl.kill()
        gsap.killTweensOf(targets)
        // Retour à l'état final (rendu statique) : aucun style inline d'animation ne reste.
        gsap.set(targets, { clearProps: 'all' })
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
      <div className="container-x grid items-end gap-10 pt-14 md:min-h-[44rem] md:grid-cols-2 md:gap-16 md:pt-0">
        <div className="flex flex-col gap-6 pb-4 md:gap-8 md:self-center md:py-20">
          <p data-intro className="eyebrow">{eyebrow}</p>
          <h1 aria-label={title} className="!text-[clamp(2.75rem,5.2vw,5.5rem)]">
            <MaskedWords text={title} />
          </h1>
          <p data-intro className="max-w-xl text-lg text-charcoal md:text-xl">{lead}</p>
          <div data-intro className="flex flex-wrap gap-4">{ctas}</div>
        </div>
        <div
          ref={arch}
          className="mx-auto h-[26rem] w-full max-w-[22rem] overflow-hidden rounded-t-[999px] md:mx-0 md:h-[41rem] md:max-w-[35rem] md:justify-self-end"
        >
          <div ref={frame} className="h-full w-full will-change-transform">{photo}</div>
        </div>
      </div>
    </section>
  )
}
