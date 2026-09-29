// Limiteur en mémoire (fenêtre glissante). Suffisant pour une instance unique ;
// à remplacer par un store partagé si le site passe en multi-instances.
const hits = new Map<string, number[]>()

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  return true
}
