import { MaskedWords } from '@/components/MaskedWords'

type Props = { text: string; className?: string }

/**
 * Titre de section révélé mot à mot au défilement, en CSS (animation-timeline: view()).
 * Serveur uniquement : pas de JavaScript, et le titre reste visible sans support de l'animation.
 */
export function WordReveal({ text, className }: Props) {
  return (
    <h2 aria-label={text} className={className}>
      <MaskedWords text={text} wordClass="scroll-word" />
    </h2>
  )
}
