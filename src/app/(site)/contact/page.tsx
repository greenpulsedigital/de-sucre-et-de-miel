import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { ContactForm } from '@/components/forms'
import { JsonLd } from '@/components/JsonLd'
import { getSettings } from '@/lib/data'
import { telHref } from '@/lib/format'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { WHATSAPP_URL } from '@/lib/site'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Contacter l’atelier dans la Drôme',
  description: 'Une question sur nos tartes alpines, nos pains d’épices ou la livraison ? Écrivez à l’atelier de Montboucher-sur-Jabron ou appelez-nous. Réservé aux pros.',
  path: '/contact',
})

export default async function ContactPage() {
  const s = await getSettings()
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Contact', path: '/contact' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Contact' }]} />
      <section className="section !pt-8">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader as="h1" title="Contacter l’atelier" />
            <address className="mt-8 space-y-1 not-italic text-lg">
              {s.address && <p>{s.address}</p>}
              <p>{[s.postalCode, s.city].filter(Boolean).join(' ')}</p>
              {s.phone && <p><a className="font-semibold text-cocoa underline" href={telHref(s.phone)}>{s.phone}</a></p>}
              {s.email && <p><a className="text-cocoa underline" href={`mailto:${s.email}`}>{s.email}</a></p>}
            </address>
            {s.pickupInfo && (<><h2 className="mt-10 !text-2xl">Livraison</h2><p className="mt-3 whitespace-pre-line">{s.pickupInfo}</p></>)}
            <div className="mt-8"><a className="btn btn-primary" href={WHATSAPP_URL} rel="noopener noreferrer" target="_blank">WhatsApp<span className="sr-only"> (s’ouvre dans un nouvel onglet)</span></a></div>
          </div>
          <div>
            <h2 className="!text-3xl">Nous écrire</h2>
            <div className="mt-6"><ContactForm /></div>
          </div>
        </div>
      </section>
    </>
  )
}
