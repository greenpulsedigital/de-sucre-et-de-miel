/**
 * Données de démarrage. Idempotent : ne recrée pas ce qui existe déjà.
 * Les images sont des aplats provisoires générés localement — À REMPLACER par les vraies photographies.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { toSlug } from '../src/lib/slug'

const tmp = path.resolve('media/.seed')
fs.mkdirSync(tmp, { recursive: true })

const PALETTES: [string, string][] = [
  ['#e9d8b4', '#b98a4d'], ['#f0dcc0', '#a86c4a'], ['#e6cfa0', '#7d5a3c'],
  ['#efe0c6', '#c9973e'], ['#dcc3a1', '#50382b'], ['#f3e6cf', '#9c7a52'],
]

async function placeholder(name: string, i: number) {
  const [a, b] = PALETTES[i % PALETTES.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200"><defs><radialGradient id="g" cx="30%" cy="25%" r="90%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2"/><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .12 0"/></filter></defs><rect width="1600" height="1200" fill="url(#g)"/><rect width="1600" height="1200" filter="url(#n)"/></svg>`
  const file = path.join(tmp, `${toSlug(name)}.webp`)
  await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile(file)
  return file
}

async function main() {
  const payload = await getPayload({ config })
  let n = 0
  const makeMedia = async (alt: string) => {
    const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
    if (existing.docs[0]) return existing.docs[0].id
    const doc = await payload.create({ collection: 'media', data: { alt }, filePath: await placeholder(alt, n++) })
    return doc.id
  }

  // Admin : identifiants générés et écrits dans .env (jamais affichés).
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (!users.totalDocs && !process.env.SEED_SKIP_ADMIN) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@desucredemiel.local'
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password } })
    if (!process.env.SEED_ADMIN_PASSWORD) fs.appendFileSync('.env', `\nSEED_ADMIN_EMAIL=${email}\nSEED_ADMIN_PASSWORD=${password}\n`)
    console.log('Compte admin créé — identifiants dans .env (SEED_ADMIN_*).')
  }

  const cats = [
    { name: 'Tartes', description: 'Tartes préparées à l’atelier avec des fruits de saison.' },
    { name: 'Gâteaux', description: 'Gâteaux de partage, du classique au plus créatif.' },
    { name: 'Entremets', description: 'Entremets aux textures superposées, pour les grandes tablées.' },
    { name: 'Petites gourmandises', description: 'Mignardises, choux et bouchées à picorer.' },
    { name: 'Créations sur mesure', description: 'Pièces uniques pour vos événements : imaginées avec vous.' },
  ]
  const catId: Record<string, number> = {}
  for (const [order, c] of cats.entries()) {
    const slug = toSlug(c.name)
    const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
    catId[slug] = found.docs[0]?.id ?? (await payload.create({ collection: 'categories', data: { ...c, slug, order, published: true, image: await makeMedia(`Photo provisoire — ${c.name}`) } })).id
  }

  // Créations d'EXEMPLE : à remplacer / compléter dans l'admin.
  const products = [
    { name: 'Tarte aux fruits de saison', cat: 'tartes', excerpt: 'Pâte sablée, crème d’amande et fruits du moment.', description: 'Une pâte sablée faite à l’atelier, une crème d’amande et des fruits choisis selon la saison.', ingredients: 'Farine, beurre, œufs, sucre, amandes, fruits de saison.', allergens: ['gluten', 'oeufs', 'lait', 'fruits-a-coque'], price: 24, priceLabel: 'à partir de 24 €', formats: ['4 parts', '6 parts', '8 parts'], featured: true },
    { name: 'Tarte au citron meringuée', cat: 'tartes', excerpt: 'Crème citron acidulée et meringue dorée.', description: 'Un fond sablé, une crème citron bien franche et une meringue légèrement dorée.', ingredients: 'Farine, beurre, œufs, sucre, citrons.', allergens: ['gluten', 'oeufs', 'lait'], price: 22, priceLabel: 'à partir de 22 €', formats: ['4 parts', '6 parts', '8 parts'], featured: true },
    { name: 'Gâteau chocolat', cat: 'gateaux', excerpt: 'Biscuit moelleux et ganache au chocolat.', description: 'Un biscuit moelleux, une ganache onctueuse. Personnalisable pour un anniversaire.', ingredients: 'Chocolat, beurre, œufs, sucre, farine, crème.', allergens: ['gluten', 'oeufs', 'lait'], price: 28, priceLabel: 'à partir de 28 €', formats: ['6 parts', '8 parts', '12 parts'], featured: true },
    { name: 'Entremets vanille & fruits rouges', cat: 'entremets', excerpt: 'Mousse vanille, insert fruits rouges, biscuit croustillant.', description: 'Un entremets tout en textures : croustillant, mousse légère et cœur acidulé.', ingredients: 'Crème, vanille, fruits rouges, œufs, sucre, farine.', allergens: ['gluten', 'oeufs', 'lait', 'fruits-a-coque'], price: 34, priceLabel: 'à partir de 34 €', formats: ['6 parts', '8 parts'], featured: true },
    { name: 'Assortiment de mignardises', cat: 'petites-gourmandises', excerpt: 'Petites pièces à partager, composées selon vos envies.', description: 'Un assortiment de bouchées sucrées, parfait pour un apéritif ou un dessert à picorer.', ingredients: 'Selon la composition du plateau.', allergens: ['gluten', 'oeufs', 'lait', 'fruits-a-coque'], price: undefined, priceLabel: 'sur devis', formats: ['12 pièces', '24 pièces', '36 pièces'], featured: false },
    { name: 'Pièce sur mesure', cat: 'creations-sur-mesure', excerpt: 'Une création unique, imaginée avec vous.', description: 'Anniversaire, mariage, baptême : décrivez votre idée, nous vous proposons une pièce adaptée.', ingredients: 'Selon la création.', allergens: [], price: undefined, priceLabel: 'sur devis', formats: [], featured: false },
  ]
  for (const [order, p] of products.entries()) {
    const slug = toSlug(p.name)
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1 })
    if (found.docs[0]) continue
    await payload.create({
      collection: 'products',
      data: {
        name: p.name, slug, category: catId[p.cat], excerpt: p.excerpt, description: p.description, ingredients: p.ingredients,
        allergens: p.allergens as never, price: p.price, priceLabel: p.priceLabel, formats: p.formats.map((label) => ({ label })),
        images: [{ image: await makeMedia(`Photo provisoire — ${p.name}`) }], featured: p.featured, published: true, seasonal: false, order,
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      city: 'Montboucher-sur-Jabron',
      // Coordonnées provisoires : à remplacer dans l'admin avant la mise en ligne.
      phone: '04 00 00 00 00',
      email: 'contact@example.fr',
      address: '[Adresse à renseigner]',
      postalCode: '26740',
      pickupInfo: 'Retrait à l’atelier sur rendez-vous. Livraison possible dans la Drôme selon la commande.',
      hours: [{ days: 'Mardi – samedi', time: '[à renseigner]' }],
      heroImage: fs.existsSync('scripts/hero.webp')
        ? (await payload.create({ collection: 'media', data: { alt: 'Tarte artisanale aux fruits rouges en croisillons posée sur une roche, face à un lac de montagne et aux sommets alpins' }, filePath: 'scripts/hero.webp' })).id
        : await makeMedia('Photo provisoire — accueil'),
      workshopImage: await makeMedia('Photo provisoire — atelier'),
    },
  })

  fs.rmSync(tmp, { recursive: true, force: true })
  console.log('Seed terminé.')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
