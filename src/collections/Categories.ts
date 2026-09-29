import type { CollectionConfig } from 'payload'
import { revalidateSite } from '@/lib/revalidate'
import { slugField } from '@/lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order', 'published'], group: 'Catalogue' },
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()], afterDelete: [() => revalidateSite()] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', label: 'Nom', required: true },
    slugField('name'),
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Image' },
    { name: 'order', type: 'number', label: 'Ordre d’affichage', defaultValue: 0 },
    { name: 'published', type: 'checkbox', label: 'Publiée', defaultValue: true },
  ],
}
