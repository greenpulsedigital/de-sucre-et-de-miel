import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const before = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
const doc = await payload.create({
  collection: 'media',
  data: { alt: 'Tarte aux fruits rouges en croisillons posée sur un linge, à côté d’un pot de confiture, face aux sommets alpins au lever du soleil' },
  filePath: 'scripts/hero.webp',
})
await payload.updateGlobal({ slug: 'site-settings', data: { heroImage: doc.id } })
if (typeof before.heroImage === 'number') await payload.delete({ collection: 'media', id: before.heroImage })
console.log('hero ok', doc.id)
process.exit(0)
