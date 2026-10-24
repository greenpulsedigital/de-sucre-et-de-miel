'use server'

import { headers } from 'next/headers'
import { getClient } from '@/lib/payload'
import { KIND_LABEL, schemas, type FormState, type Kind } from '@/lib/forms'
import { rateLimit } from '@/lib/ratelimit'
import { mailConfigured, sendMail } from '@/lib/mail'

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

  const payload = await getClient()
  const who = `${data.firstName} ${data.lastName}`
  const summary = `${KIND_LABEL[kind]} — ${who}`
  const { firstName, lastName, email, phone, message, date, ...details } = data
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
    },
  })

  if (mailConfigured()) {
    const lines = [`${KIND_LABEL[kind]}`, '', `Nom : ${who}`, `Email : ${email}`, `Téléphone : ${phone || '—'}`, date ? `Date souhaitée : ${date}` : '', ...Object.entries(details).map(([k, v]) => `${k} : ${v || '—'}`), '', 'Message :', String(message || '—')].filter((l) => l !== undefined)
    try {
      await sendMail({ to: process.env.MAIL_TO!, subject: `[Site] ${summary}`, text: lines.join('\n'), replyTo: String(email) })
      await sendMail({
        to: String(email),
        subject: 'Nous avons bien reçu votre demande — De Sucre & de Miel',
        text: `Bonjour ${firstName},\n\nMerci, votre demande est bien arrivée à l’atelier. Nous revenons vers vous rapidement avec nos conditions professionnelles (tarifs, minimums, livraison).\n\nÀ très vite,\nDe Sucre & de Miel`,
      })
    } catch (e) {
      // La demande est déjà enregistrée dans l'admin : l'email n'est qu'une notification.
      console.error('[mail] envoi impossible', e)
    }
  }

  return { ok: true }
}

export async function submitPro(_: FormState, fd: FormData) { return handle('pro', fd) }
export async function submitContact(_: FormState, fd: FormData) { return handle('contact', fd) }
