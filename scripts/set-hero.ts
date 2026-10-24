import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Illustration (non une photo du produit) : le texte alternatif le dit explicitement.
// L'ancien média hero est conservé dans l'admin (aucune suppression).
const payload = await getPayload({ config })
const doc = await payload.create({
  collection: 'media',
  data: { alt: 'Illustration : tarte aux fruits rouges en croisillons sur une planche de bois, posée sur un rocher en montagne, avec une coupelle de baies au lever du soleil' },
  filePath: 'scripts/hero-illustration.webp',
})
await payload.updateGlobal({ slug: 'site-settings', data: { heroImage: doc.id } })
console.log('hero ok', doc.id)
process.exit(0)
