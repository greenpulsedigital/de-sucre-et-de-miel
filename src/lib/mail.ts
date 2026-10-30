import nodemailer, { type Transporter } from 'nodemailer'

const clean = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.MAIL_TO)

/**
 * SMTP chiffré de bout en bout (Infomaniak : mail.infomaniak.com, 465 en SSL ou 587 en STARTTLS).
 * TLS est exigé dans les deux cas : sans chiffrement, l'envoi échoue au lieu de transmettre le mot de passe en clair.
 */
let transporter: Transporter | null = null
const getTransporter = () => {
  const port = Number(process.env.SMTP_PORT || 465)
  return (transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: true,
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  }))
}

/** Vérifie la connexion et l'authentification SMTP, sans rien envoyer. */
export const verifyMail = () => getTransporter().verify()

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
