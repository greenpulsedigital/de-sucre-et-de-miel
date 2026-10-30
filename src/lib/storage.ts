import path from 'node:path'

/**
 * Dossier des fichiers envoyés (photos publiques et pièces jointes privées dans `private/`).
 * En production, hors du dossier de code (MEDIA_DIR, absolu ou relatif au dossier d'exécution, ex. `../data/media`)
 * pour survivre aux redéploiements.
 */
export const MEDIA_DIR = process.env.MEDIA_DIR ? path.resolve(process.env.MEDIA_DIR) : 'media'
