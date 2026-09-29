import type { CollectionConfig } from 'payload'
import { revalidateSite } from '@/lib/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Avis', plural: 'Avis clients' },
  admin: { useAsTitle: 'firstName', defaultColumns: ['firstName', 'rating', 'published'], group: 'Contenu' },
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()], afterDelete: [() => revalidateSite()] },
  fields: [
    { name: 'firstName', type: 'text', label: 'Prénom', required: true },
    { name: 'quote', type: 'textarea', label: 'Avis', required: true },
    { name: 'rating', type: 'number', label: 'Note', min: 1, max: 5, defaultValue: 5, required: true },
    {
      name: 'source',
      type: 'select',
      label: 'Source',
      defaultValue: 'direct',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Recueilli directement', value: 'direct' },
      ],
    },
    { name: 'published', type: 'checkbox', label: 'Visible sur le site', defaultValue: true },
  ],
}
