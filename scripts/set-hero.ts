import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const doc = await payload.create({
  collection: 'media',
  data: { alt: 'Tarte artisanale aux fruits rouges en croisillons posée sur une roche, face à un lac de montagne et aux sommets alpins' },
  filePath: 'scripts/hero.webp',
})
await payload.updateGlobal({ slug: 'site-settings', data: { heroImage: doc.id } })
console.log('hero ok', doc.id)
process.exit(0)
