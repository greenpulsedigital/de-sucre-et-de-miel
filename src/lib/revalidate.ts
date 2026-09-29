import { revalidatePath } from 'next/cache'

/** Le contenu est rendu statiquement ; toute modification dans l'admin le rafraîchit. */
export const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // hors runtime Next (script de seed) : rien à invalider
  }
}
