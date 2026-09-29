import type { CollectionConfig } from 'payload'
import { revalidateSite } from '@/lib/revalidate'
import { slugField } from '@/lib/slug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Actualité', plural: 'Actualités' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt', 'published'], group: 'Contenu' },
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()], afterDelete: [() => revalidateSite()] },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', label: 'Titre', required: true },
    slugField('title'),
    { name: 'excerpt', type: 'textarea', label: 'Résumé', required: true, maxLength: 300 },
    { name: 'content', type: 'richText', label: 'Contenu', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Image de couverture' },
    { name: 'publishedAt', type: 'date', label: 'Date de publication', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'published', type: 'checkbox', label: 'Publiée', defaultValue: false },
  ],
}
