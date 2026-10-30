/**
 * Initialisation de la production, lancée avant chaque build (hébergement sans terminal, ex. Infomaniak + Web FTP) :
 * - base vide (aucun produit) : données de démarrage, une seule fois ;
 * - aucun compte : administrateur créé depuis ADMIN_EMAIL / ADMIN_PASSWORD.
 * Sans effet sur une base déjà remplie : les contenus modifiés dans l'admin ne sont jamais écrasés.
 */
import 'dotenv/config'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const { totalDocs } = await payload.count({ collection: 'products' })

const tsx = path.resolve('node_modules/.bin/tsx')
const run = (script: string, env: Record<string, string> = {}) =>
  execFileSync(tsx, [script], { stdio: 'inherit', env: { ...process.env, ...env } })

if (totalDocs === 0) {
  console.log('Base vide : chargement des données de démarrage.')
  run('scripts/seed.ts', { SEED_SKIP_ADMIN: '1' })
} else {
  console.log(`Base existante (${totalDocs} produits) : aucune donnée modifiée.`)
}
run('scripts/create-admin.ts')
process.exit(0)
