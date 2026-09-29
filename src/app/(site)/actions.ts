'use server'

import { headers } from 'next/headers'
import { getClient } from '@/lib/payload'
import { KIND_LABEL, MAX_UPLOAD, schemas, sniffImage, type FormState, type Kind } from '@/lib/forms'
import { rateLimit } from '@/lib/ratelimit'
import { mailConfigured, sendMail } from '@/lib/mail'

const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as const

async function handle(kind: Kind, fd: FormData): Promise<FormState> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'

  // Anti-spam : champ piège invisible. On simule un succès pour ne rien apprendre au robot.
  if (String(fd.get('website') ?? '').length > 0) return { ok: true }

  if (!rateLimit(`${kind}:${ip}`)) {
    return { ok: false, message: 'Trop de demandes en peu de temps. Réessayez dans quelques minutes ou appelez-nous.' }
  }

  const raw: Record<string, string> = {}
  for (const [k, v] of fd.entries()) if (typeof v === 'string' && !k.startsWith('$ACTION')) raw[k] = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')

  const parsed = schemas[kind].safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '_')
      errors[key] ??= issue.message
    }
    return { ok: false, errors, values: raw, message: 'Certains champs demandent votre attention.' }
  }
  const data = parsed.data as Record<string, string | number>

  // Pièce jointe facultative (événements)
  let attachmentId: number | undefined
  const file = fd.get('inspiration')
  const payload = await getClient()
  if (kind === 'event' && file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD) return { ok: false, errors: { inspiration: 'Image trop lourde (5 Mo maximum).' }, values: raw, message: 'Certains champs demandent votre attention.' }
    const buf = Buffer.from(await file.arrayBuffer())
    const mime = sniffImage(buf)
    if (!mime) return { ok: false, errors: { inspiration: 'Format accepté : JPEG, PNG ou WebP.' }, values: raw, message: 'Certains champs demandent votre attention.' }
    const doc = await payload.create({
      collection: 'request-files',
      data: {},
      file: { data: buf, mimetype: mime, name: `inspiration-${Date.now()}.${ext[mime]}`, size: buf.length },
    })
    attachmentId = doc.id
  }

  const who = `${data.firstName} ${data.lastName}`
  const summary = `${KIND_LABEL[kind]} — ${who}`
  const { firstName, lastName, email, phone, message, date, ...details } = data
  let productId: number | undefined
  if (kind === 'order') {
    const p = await payload.find({ collection: 'products', where: { slug: { equals: String(data.creation) } }, limit: 1, depth: 0 })
    productId = p.docs[0]?.id
  }

  await payload.create({
    collection: 'requests',
    data: {
      summary,
      kind,
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      desiredDate: date ? new Date(String(date)).toISOString() : undefined,
      message: message ? String(message) : undefined,
      details,
      product: productId,
      attachment: attachmentId,
    },
  })

  if (mailConfigured()) {
    const lines = [`${KIND_LABEL[kind]}`, '', `Nom : ${who}`, `Email : ${email}`, `Téléphone : ${phone || '—'}`, date ? `Date souhaitée : ${date}` : '', ...Object.entries(details).map(([k, v]) => `${k} : ${v || '—'}`), '', 'Message :', String(message || '—'), attachmentId ? '\n(Une photo d’inspiration est jointe à la demande dans l’administration.)' : ''].filter((l) => l !== undefined)
    try {
      await sendMail({ to: process.env.MAIL_TO!, subject: `[Site] ${summary}`, text: lines.join('\n'), replyTo: String(email) })
      await sendMail({
        to: String(email),
        subject: 'Nous avons bien reçu votre demande — De Sucre & de Miel',
        text: `Bonjour ${firstName},\n\nMerci, votre demande est bien arrivée à l’atelier. Nous vérifions la disponibilité et revenons vers vous rapidement pour la confirmer.\n\nÀ très vite,\nDe Sucre & de Miel`,
      })
    } catch (e) {
      // La demande est déjà enregistrée dans l'admin : l'email n'est qu'une notification.
      console.error('[mail] envoi impossible', e)
    }
  }

  return { ok: true }
}

export async function submitOrder(_: FormState, fd: FormData) { return handle('order', fd) }
export async function submitEvent(_: FormState, fd: FormData) { return handle('event', fd) }
export async function submitPro(_: FormState, fd: FormData) { return handle('pro', fd) }
export async function submitContact(_: FormState, fd: FormData) { return handle('contact', fd) }
