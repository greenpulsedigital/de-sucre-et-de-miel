/** Crée le compte admin au premier démarrage depuis ADMIN_EMAIL / ADMIN_PASSWORD (secrets d'hébergement ou .env). */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
const payload = await getPayload({ config })
const users = await payload.find({ collection: 'users', limit: 1 })
if (!users.totalDocs && email && password) {
  await payload.create({ collection: 'users', data: { email, password } })
  console.log('Compte admin créé.')
}
process.exit(0)
