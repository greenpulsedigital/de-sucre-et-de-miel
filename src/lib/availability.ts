import type { Product } from '@/payload-types'

/** Une création saisonnière n'est proposée que dans sa fenêtre de disponibilité. */
export function isAvailable(p: Pick<Product, 'seasonal' | 'availableFrom' | 'availableUntil'>, now = new Date()) {
  if (!p.seasonal) return true
  const from = p.availableFrom ? new Date(p.availableFrom) : null
  const until = p.availableUntil ? new Date(p.availableUntil) : null
  if (until) until.setHours(23, 59, 59, 999)
  if (from && now < from) return false
  if (until && now > until) return false
  return true
}
