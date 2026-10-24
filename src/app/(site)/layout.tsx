import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { getSettings } from '@/lib/data'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { SITE } from '@/lib/site'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-face-display', display: 'swap' })
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-face-sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...(process.env.SITE_NOINDEX ? { robots: { index: false, follow: false } } : {}),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: 'Tartes alpines artisanales, vendues uniquement aux professionnels (épiceries, primeurs, gîtes…). Atelier à Montboucher-sur-Jabron (Drôme).',
}

export const viewport: Viewport = { themeColor: '#f7f2e8', width: 'device-width', initialScale: 1 }

const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
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
