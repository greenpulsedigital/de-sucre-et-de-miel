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
    { name: 'Tartes alpines', description: 'Neuf recettes de tartes alpines, en trois tailles, pour les professionnels.' },
    { name: 'Pains d’épices', description: 'Pains d’épices artisanaux : nature, orange et figue.' },
  ]
  const catId: Record<string, number> = {}
  for (const [order, c] of cats.entries()) {
    const slug = toSlug(c.name)
    const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
    catId[slug] = found.docs[0]?.id ?? (await payload.create({ collection: 'categories', data: { ...c, slug, order, published: true, image: await makeMedia(`Photo provisoire — ${c.name}`) } })).id
  }

  // Gamme : 9 recettes × 3 tailles. Composition et allergènes à renseigner dans l'admin (non inventés ici).
  const SIZES = ['28 cm · 550 g', '24 cm · 400 g', '14 cm · 100 g']
  const recettes = ['Myrtille', 'Abricot', 'Framboise', 'Chocolat', 'Citron', 'Fraise', 'Praline', 'Mendiant', 'Noix']
  const products: { name: string; cat: string; excerpt: string; description: string; formats: string[] }[] = recettes.map((r) => ({
    cat: 'tartes-alpines',
    formats: SIZES,
    name: `Tarte ${r.toLowerCase()}`,
    excerpt: `Tarte alpine ${r.toLowerCase()} artisanale, en 28, 24 et 14 cm.`,
    description: `Tarte alpine ${r.toLowerCase()}, fabriquée à l’atelier et vendue aux professionnels. Disponible en trois tailles : 28 cm (550 g), 24 cm (400 g) et 14 cm (100 g).`,
  }))
  for (const [parfum, g] of [['nature', 350], ['orange', 380], ['figue', 380]] as const) {
    products.push({
      name: `Pain d’épices ${parfum}`,
      cat: 'pains-d-epices',
      formats: [`${g} g`],
      excerpt: `Pain d’épices artisanal ${parfum}, ${g} g.`,
      description: `Pain d’épices ${parfum} artisanal, fabriqué à l’atelier et vendu aux professionnels. Format unique : ${g} g.`,
    })
  }
  // Nettoyage des anciennes données d'exemple (gâteaux, entremets, etc.)
  const keep = new Set(products.map((p) => toSlug(p.name)))
  const old = await payload.find({ collection: 'products', limit: 200, depth: 0 })
  for (const d of old.docs) if (!keep.has(d.slug!)) await payload.delete({ collection: 'products', id: d.id })
  const oldCats = await payload.find({ collection: 'categories', limit: 50, depth: 0 })
  for (const d of oldCats.docs) if (!(d.slug! in catId)) await payload.delete({ collection: 'categories', id: d.id })

  // Vraies photos (scripts/photos/*.webp) : la 1re est l'image principale. Sans fichier : aplat provisoire.
  const PHOTOS: Record<string, string[]> = {
    'tarte-myrtille': ['myrtille', 'myrtille-14cm'], 'tarte-abricot': ['abricot'], 'tarte-framboise': ['framboise'], 'tarte-chocolat': ['chocolat'],
    'tarte-citron': ['citron'], 'tarte-fraise': ['fraise'], 'tarte-praline': ['praline'], 'tarte-mendiant': ['mendiant'], 'tarte-noix': ['noix'],
    'pain-d-epices-nature': ['pain-d-epices'], 'pain-d-epices-orange': ['pain-d-epices'], 'pain-d-epices-figue': ['pain-d-epices'],
  }
  // Les photos du dépôt font foi : on remplace la version stockée (une seule fois par fichier et par exécution).
  const uploaded = new Map<string, number>()
  const staleMedia: number[] = [] // supprimées à la fin : encore rattachées aux produits pendant la mise à jour
  const realPhoto = async (file: string, alt: string) => {
    const key = `${file}|${alt}`
    if (uploaded.has(key)) return uploaded.get(key)!
    const found = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 10 })
    staleMedia.push(...found.docs.map((d) => d.id))
    const id = (await payload.create({ collection: 'media', data: { alt }, filePath: `scripts/photos/${file}.webp` })).id
    uploaded.set(key, id)
    return id
  }
  const photosFor = async (slug: string, name: string) => {
    const files = PHOTOS[slug]
    if (!files) return [{ image: await makeMedia(`Photo provisoire — ${name}`) }]
    const out: { image: number }[] = []
    for (const [i, f] of files.entries()) out.push({ image: await realPhoto(f, `${name}${i ? ` — vue ${i + 1}` : ''}`) })
    return out
  }

  for (const [order, p] of products.entries()) {
    const slug = toSlug(p.name)
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1 })
    if (found.docs[0]) {
      if (PHOTOS[slug]) await payload.update({ collection: 'products', id: found.docs[0].id, data: { images: await photosFor(slug, p.name) } })
      continue
    }
    await payload.create({
      collection: 'products',
      data: {
        name: p.name, slug, category: catId[p.cat], excerpt: p.excerpt, description: p.description,
        formats: p.formats.map((label) => ({ label })),
        images: await photosFor(slug, p.name), featured: true, published: true, seasonal: false, order,
      },
    })
  }

  for (const id of staleMedia) await payload.delete({ collection: 'media', id })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      city: 'Montboucher-sur-Jabron',
      // Coordonnées provisoires : à remplacer dans l'admin avant la mise en ligne.
      phone: '+33 6 77 23 58 88',
      email: 'contact@desucreetdemiel.fr',
      address: '130b, ZA de Fontgrave',
      postalCode: '26740',
      pickupInfo: 'Vente réservée aux professionnels. Livraison dans toute la France.',
      heroImage: fs.existsSync('scripts/hero.webp')
        ? (await payload.create({ collection: 'media', data: { alt: 'Illustration : tarte aux fruits rouges en croisillons sur une planche de bois, posée sur un rocher en montagne, avec une coupelle de baies au lever du soleil' }, filePath: 'scripts/hero.webp' })).id
        : await makeMedia('Photo provisoire — accueil'),
      workshopImage: await makeMedia('Photo provisoire — atelier'),
    },
  })

  fs.rmSync(tmp, { recursive: true, force: true })
  console.log('Seed terminé.')
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
