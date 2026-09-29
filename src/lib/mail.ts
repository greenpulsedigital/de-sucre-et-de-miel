import nodemailer, { type Transporter } from 'nodemailer'

const clean = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.MAIL_TO)

let transporter: Transporter | null = null
const getTransporter = () =>
  (transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  }))

/** Email texte brut uniquement : aucune donnée utilisateur n'est interprétée comme du HTML. */
export async function sendMail(opts: { to: string; subject: string; text: string; replyTo?: string }) {
  if (!mailConfigured()) return false
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_TO,
    to: opts.to,
    subject: clean(opts.subject),
    text: opts.text,
    replyTo: opts.replyTo ? clean(opts.replyTo) : undefined,
  })
  return true
}
