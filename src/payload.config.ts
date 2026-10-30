import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { fr } from '@payloadcms/translations/languages/fr'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Articles } from './collections/Articles'
import { Testimonials } from './collections/Testimonials'
import { Requests } from './collections/Requests'
import { RequestFiles } from './collections/RequestFiles'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vercel : le disque du déploiement est en lecture seule. À l'exécution (pas au build ni au seed),
 * la base embarquée est copiée dans /tmp. Démo uniquement : les écritures ne sont pas persistantes.
 */
function databaseUrl() {
  const url = process.env.DATABASE_URL || 'file:./payload.db'
  const runtime = process.env.VERCEL && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build'
  if (!runtime || !url.startsWith('file:')) return url
  const src = path.resolve(url.slice('file:'.length))
  const dest = '/tmp/payload.db'
  if (!fs.existsSync(dest) && fs.existsSync(src)) fs.copyFileSync(src, dest)
  return `file:${dest}`
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — De Sucre & de Miel' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Products, Categories, Media, Articles, Testimonials, Requests, RequestFiles, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: databaseUrl() },
    push: process.env.NODE_ENV !== 'production',
    // Production Infomaniak (DB_MIGRATIONS=1) : schéma créé et mis à jour par les migrations, appliquées au build
    // et au démarrage. Sans ce drapeau (dev, démos Vercel/Fly), la base reste gérée par push, comme avant.
    // Après un changement de collection : `pnpm payload migrate:create <nom>`.
    prodMigrations: process.env.DB_MIGRATIONS ? migrations : undefined,
    transactionOptions: {},
  }),
  sharp,
})
