import type { CollectionConfig } from 'payload'

// Photos d'inspiration jointes aux demandes : jamais publiques.
export const RequestFiles: CollectionConfig = {
  slug: 'request-files',
  labels: { singular: 'Inspiration jointe', plural: 'Inspirations jointes' },
  admin: { group: 'Demandes' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: 'media/private',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [],
}
