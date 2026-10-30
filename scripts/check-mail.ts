/**
 * Teste la connexion SMTP (chiffrement + identifiants) sans envoyer d'email : `pnpm mail:check`.
 * N'affiche jamais le mot de passe.
 */
import 'dotenv/config'
import { mailConfigured, verifyMail } from '../src/lib/mail'

if (!mailConfigured()) {
  console.error('SMTP non configuré : renseignez SMTP_HOST et MAIL_TO dans .env')
  process.exit(1)
}

try {
  await verifyMail()
  console.log(`Connexion SMTP chiffrée OK : ${process.env.SMTP_USER} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 465}`)
} catch (e) {
  console.error('Connexion SMTP impossible :', e instanceof Error ? e.message : e)
  process.exit(1)
}
