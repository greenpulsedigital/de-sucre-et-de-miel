import { z } from 'zod'

export type FormState = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

const req = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} est obligatoire.`).max(max, `${label} est trop long.`)
const opt = (max = 120) => z.string().trim().max(max, 'Texte trop long.').optional().default('')
/** SIRET : 14 chiffres (espaces tolérés), clé de Luhn valide. Exception : La Poste (SIREN 356 000 000), dont les SIRET sont aussi valides si la somme des chiffres est multiple de 5. */
export const normalizeSiret = (v: string) => v.replace(/[\s.\-]/g, '')
export function isValidSiret(raw: string) {
  const s = normalizeSiret(raw)
  if (!/^\d{14}$/.test(s)) return false
  if (s.startsWith('356000000') && [...s].reduce((a, d) => a + Number(d), 0) % 5 === 0) return true
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let d = Number(s[13 - i])
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}
const siret = z
  .string()
  .trim()
  .min(1, 'Le numéro de SIRET est obligatoire.')
  .refine((v) => /^\d{14}$/.test(normalizeSiret(v)), 'Le SIRET comporte 14 chiffres.')
  .refine(isValidSiret, 'Ce numéro de SIRET n’est pas valide : vérifiez-le.')
  .transform(normalizeSiret)
const email = z.string().trim().min(1, 'L’email est obligatoire.').max(160).pipe(z.email('Indiquez un email valide.'))
const phone = z
  .string()
  .trim()
  .min(1, 'Le téléphone est obligatoire.')
  .regex(/^[+\d][\d\s().-]{7,20}$/, 'Indiquez un numéro de téléphone valide.')

export const schemas = {
  pro: z.object({
    siret,
    company: req('L’établissement', 120),
    lastName: req('Le nom', 80),
    firstName: req('Le prénom', 80),
    email,
    phone,
    proType: z.enum(['epicerie', 'primeur', 'gite', 'hotel-restaurant', 'producteurs', 'autre'], { error: 'Choisissez un type de structure.' }),
    interest: opt(300),
    volume: opt(120),
    frequency: opt(120),
    message: req('Le message', 1500),
  }),
  contact: z.object({
    siret,
    lastName: req('Le nom', 80),
    firstName: req('Le prénom', 80),
    email,
    phone: opt(30),
    message: req('Le message', 1500),
  }),
} as const

export type Kind = keyof typeof schemas

export const KIND_LABEL: Record<Kind, string> = {
  pro: 'Demande revendeur',
  contact: 'Message',
}

export const PRO_TYPES = [
  { value: 'epicerie', label: 'Épicerie / épicerie fine' },
  { value: 'primeur', label: 'Primeur' },
  { value: 'gite', label: 'Gîte / chambres d’hôtes' },
  { value: 'hotel-restaurant', label: 'Hôtel / restaurant' },
  { value: 'producteurs', label: 'Boutique de producteurs / magasin de terroir' },
  { value: 'autre', label: 'Autre commerce' },
]

// Type MIME contrôlé sur le contenu réel (signature), pas sur le nom ou l'en-tête envoyé.
export function sniffImage(buf: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  return null
}
export const MAX_UPLOAD = 5 * 1024 * 1024
