import type { CSSProperties } from 'react'

/**
 * Découpe un titre en mots masqués pour l'animation. Le titre parent porte `aria-label` avec le texte
 * complet ; les mots visuels sont cachés aux lecteurs d'écran. Sans JavaScript, tout reste visible.
 * `wordClass` : classe CSS d'animation appliquée à chaque mot (intro du hero, révélation au défilement).
 * Pas de directive 'use client' : markup serveur, réutilisable.
 */
export function MaskedWords({ text, wordClass = 'inline-block' }: { text: string; wordClass?: string }) {
  const words = text.split(' ')
  return (
    <span aria-hidden="true">
      {words.map((word, i) => (
        <span key={`${i}-${word}`}>
          {/* clip-path, pas overflow-hidden : overflow crée un conteneur de défilement qui fausse view() */}
          <span className="inline-block -my-[0.14em] py-[0.14em] align-top [clip-path:inset(0)]">
            <span data-word className={`inline-block ${wordClass}`} style={{ '--i': i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}
