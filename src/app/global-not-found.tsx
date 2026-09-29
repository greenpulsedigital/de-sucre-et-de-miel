import './(site)/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Fraunces, Inter } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = { title: 'Page introuvable | De Sucre & de Miel', robots: { index: false } }

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <main className="section">
          <div className="container-x text-center">
            <p className="eyebrow">Erreur 404</p>
            <h1 className="mt-2">Cette tartelette a filé.</h1>
            <p className="mx-auto mt-4 max-w-md text-lg">La page que vous cherchez n’est pas là où elle devrait être.</p>
            <p className="mt-8"><Link href="/creations" className="btn btn-primary">Retourner aux créations</Link></p>
          </div>
        </main>
      </body>
    </html>
  )
}
