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
const email = z.string().trim().min(1, 'L’email est obligatoire.').max(160).pipe(z.email('Indiquez un email valide.'))
const phone = z
  .string()
  .trim()
  .min(1, 'Le téléphone est obligatoire.')
  .regex(/^[+\d][\d\s().-]{7,20}$/, 'Indiquez un numéro de téléphone valide.')
const futureDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Indiquez une date valide.')
  .refine((d) => d >= new Date().toISOString().slice(0, 10), 'La date ne peut pas être passée.')
const int = (label: string, min: number, max: number) =>
  z.coerce.number({ error: `${label} : indiquez un nombre.` }).int(`${label} : nombre entier attendu.`).min(min, `${label} : minimum ${min}.`).max(max, `${label} : maximum ${max}.`)

const identity = { lastName: req('Le nom', 80), firstName: req('Le prénom', 80), email, phone }

export const schemas = {
  order: z.object({
    ...identity,
    creation: req('La création'),
    quantity: int('La quantité', 1, 200),
    format: opt(80),
    date: futureDate,
    personalization: opt(600),
    message: opt(1500),
  }),
  event: z.object({
    ...identity,
    eventType: z.enum(['anniversaire', 'mariage', 'bapteme', 'reception', 'entreprise', 'autre'], { error: 'Choisissez un type d’événement.' }),
    date: futureDate,
    guests: int('Le nombre de personnes', 1, 1000),
    creationType: opt(120),
    budget: opt(60),
    message: opt(1500),
  }),
  pro: z.object({
    company: req('L’établissement', 120),
    lastName: req('Le nom', 80),
    firstName: req('Le prénom', 80),
    email,
    phone,
    proType: z.enum(['restaurant', 'hotel', 'entreprise', 'evenement', 'autre'], { error: 'Choisissez un type de structure.' }),
    volume: opt(120),
    frequency: opt(120),
    message: req('Le message', 1500),
  }),
  contact: z.object({
    lastName: req('Le nom', 80),
    firstName: req('Le prénom', 80),
    email,
    phone: opt(30),
    message: req('Le message', 1500),
  }),
} as const

export type Kind = keyof typeof schemas

export const KIND_LABEL: Record<Kind, string> = {
  order: 'Demande de commande',
  event: 'Demande événementielle',
  pro: 'Demande professionnelle',
  contact: 'Message',
}

export const EVENT_TYPES = [
  { value: 'anniversaire', label: 'Anniversaire' },
  { value: 'mariage', label: 'Mariage' },
  { value: 'bapteme', label: 'Baptême' },
  { value: 'reception', label: 'Réception' },
  { value: 'entreprise', label: 'Événement d’entreprise' },
  { value: 'autre', label: 'Autre' },
]

export const PRO_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel', label: 'Hôtel' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'evenement', label: 'Événement professionnel' },
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
