import type { Product } from '@/payload-types'

export const priceText = (p: Pick<Product, 'price' | 'priceLabel'>) =>
  p.priceLabel || (typeof p.price === 'number' ? `${p.price.toLocaleString('fr-FR')} €` : null)

export const dateFr = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
