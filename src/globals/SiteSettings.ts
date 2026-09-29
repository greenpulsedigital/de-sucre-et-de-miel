import type { GlobalConfig } from 'payload'
import { revalidateSite } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Réglages du site',
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateSite()] },
  fields: [
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'address', type: 'text', label: 'Adresse' },
    { name: 'postalCode', type: 'text', label: 'Code postal' },
    { name: 'city', type: 'text', label: 'Ville', defaultValue: 'Montboucher-sur-Jabron' },
    { name: 'pickupInfo', type: 'textarea', label: 'Retrait et zone géographique' },
    {
      name: 'hours',
      type: 'array',
      label: 'Horaires',
      fields: [
        { name: 'days', type: 'text', label: 'Jours', required: true },
        { name: 'time', type: 'text', label: 'Horaires', required: true },
      ],
    },
    { name: 'instagramUrl', type: 'text', label: 'Lien Instagram' },
    { name: 'mapsUrl', type: 'text', label: 'Lien itinéraire (Google Maps / OSM)' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Photo d’accueil (hero)' },
    { name: 'workshopImage', type: 'upload', relationTo: 'media', label: 'Photo de l’atelier' },
    {
      name: 'instagramPosts',
      type: 'array',
      label: 'Sélection Instagram (« Les coulisses de l’atelier »)',
      maxRows: 6,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', type: 'text', label: 'Lien de la publication' },
      ],
    },
  ],
}
