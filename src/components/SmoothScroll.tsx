'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { reducedMotion, watchReducedMotion } from '@/lib/motion'

/**
 * Moteur de scroll lissé (Lenis), unique du site, piloté par le ticker GSAP.
 * Absent sous prefers-reduced-motion, y compris si la préférence change pendant la visite.
 * Détruit au démontage (navigation hors accueil).
 */
export function SmoothScroll() {
  useEffect(() => {
    const start = (): (() => void) | undefined => {
      if (reducedMotion()) return

      const lenis = new Lenis({ lerp: 0.1, autoRaf: false, anchors: { offset: -120 } })
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        lenis.destroy()
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

  return null
}
