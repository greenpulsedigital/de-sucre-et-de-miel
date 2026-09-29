import type { TextField } from 'payload'

export const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (from: string): TextField => ({
  name: 'slug',
  type: 'text',
  label: 'Adresse (slug)',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Généré automatiquement depuis le nom si laissé vide.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return toSlug(value)
        const source = data?.[from]
        return typeof source === 'string' ? toSlug(source) : value
      },
    ],
  },
})
