/** Vrai si l'utilisateur demande moins de mouvement. Côté serveur, toujours faux (le rendu statique reste complet). */
export function reducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Vrai pour une souris ou un trackpad : les effets au pointeur sont réservés à ces appareils. */
export function finePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
