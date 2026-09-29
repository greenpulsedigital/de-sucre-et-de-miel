import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { getSettings } from '@/lib/data'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { SITE } from '@/lib/site'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...(process.env.SITE_NOINDEX ? { robots: { index: false, follow: false } } : {}),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: 'Tartes, gâteaux, entremets et créations sur mesure, réalisés à l’atelier à Montboucher-sur-Jabron (Drôme).',
}

export const viewport: Viewport = { themeColor: '#f7f2e8', width: 'device-width', initialScale: 1 }

const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main id="contenu" tabIndex={-1}>{children}</main>
        <Footer />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema(settings)} />
        {plausible && <script defer data-domain={plausible} src="https://plausible.io/js/script.js" />}
      </body>
    </html>
  )
}
