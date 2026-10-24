/** Vrai si l'utilisateur demande moins de mouvement. Côté serveur, toujours faux (le rendu statique reste complet). */
export function reducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Appelle `cb` à chaque changement de prefers-reduced-motion pendant que la page est ouverte. Retourne le désabonnement. */
export function watchReducedMotion(cb: () => void): () => void {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

/** Vrai pour une souris ou un trackpad : les effets au pointeur sont réservés à ces appareils. */
export function finePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
