import type { CollectionConfig } from 'payload'
import { revalidateSite } from '@/lib/revalidate'
import { slugField } from '@/lib/slug'

export const ALLERGENS = [
  { label: 'Gluten', value: 'gluten' },
  { label: 'Œufs', value: 'oeufs' },
  { label: 'Lait', value: 'lait' },
  { label: 'Fruits à coque', value: 'fruits-a-coque' },
  { label: 'Arachides', value: 'arachides' },
  { label: 'Soja', value: 'soja' },
  { label: 'Sésame', value: 'sesame' },
  { label: 'Sulfites', value: 'sulfites' },
] as const

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Création', plural: 'Créations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'published', 'seasonal', 'featured'],
    group: 'Catalogue',
  },
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()], afterDelete: [() => revalidateSite()] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', label: 'Nom', required: true },
    slugField('name'),
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Catégorie', required: true },
    {
      name: 'excerpt',
      type: 'text',
      label: 'Courte description (carte)',
      maxLength: 140,
      required: true,
    },
    { name: 'description', type: 'textarea', label: 'Description', required: true },
    { name: 'ingredients', type: 'textarea', label: 'Composition' },
    {
      name: 'allergens',
      type: 'select',
      hasMany: true,
      label: 'Allergènes',
      options: [...ALLERGENS],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Photographies (la première est l’image principale)',
      minRows: 1,
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'price', type: 'number', label: 'Prix indicatif (€)', min: 0 },
    {
      name: 'priceLabel',
      type: 'text',
      label: 'Libellé de prix',
      admin: { description: 'Ex. « à partir de 24 € » ou « sur devis ». Prioritaire sur le prix seul.' },
    },
    {
      name: 'formats',
      type: 'array',
      label: 'Formats',
      fields: [{ name: 'label', type: 'text', label: 'Format (ex. 6 parts)', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'seasonal', type: 'checkbox', label: 'Création de saison', defaultValue: false },
        { name: 'featured', type: 'checkbox', label: 'Création signature (accueil)', defaultValue: false },
        { name: 'published', type: 'checkbox', label: 'Publiée', defaultValue: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'availableFrom',
          type: 'date',
          label: 'Disponible à partir du',
          admin: { condition: (_, s) => Boolean(s?.seasonal), date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'availableUntil',
          type: 'date',
          label: 'Disponible jusqu’au',
          admin: { condition: (_, s) => Boolean(s?.seasonal), date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name: 'order', type: 'number', label: 'Ordre d’affichage', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
