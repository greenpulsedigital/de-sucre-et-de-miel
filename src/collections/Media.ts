import type { CollectionConfig } from 'payload'
import { revalidateSite } from '@/lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photos' },
  admin: { useAsTitle: 'alt', group: 'Contenu' },
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()], afterDelete: [() => revalidateSite()] },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'wide', width: 1600, withoutEnlargement: true },
    ],
    adminThumbnail: 'card',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      required: true,
      admin: { description: 'Décrit la photo pour les lecteurs d’écran et Google (obligatoire).' },
    },
  ],
}
