/**
 * Découpe un titre en mots masqués pour l'animation. Le titre parent porte `aria-label` avec le texte
 * complet ; les mots visuels sont cachés aux lecteurs d'écran. Sans JavaScript, tout reste visible.
 * Pas de directive 'use client' : markup serveur, réutilisable par les composants clients.
 */
export function MaskedWords({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span aria-hidden="true">
      {words.map((word, i) => (
        <span key={`${i}-${word}`}>
          <span className="inline-block -my-[0.14em] overflow-hidden py-[0.14em] align-top">
            <span data-word className="inline-block">{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  )
}
