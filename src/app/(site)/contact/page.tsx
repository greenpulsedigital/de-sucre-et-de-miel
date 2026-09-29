import { Breadcrumb, ContactActions, SectionHeader } from '@/components/blocks'
import { ContactForm } from '@/components/forms'
import { JsonLd } from '@/components/JsonLd'
import { getSettings } from '@/lib/data'
import { telHref } from '@/lib/format'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'Contact — pâtisserie à Montboucher-sur-Jabron',
  description: 'Adresse, téléphone, horaires et retrait de la pâtisserie De Sucre & de Miel à Montboucher-sur-Jabron (Drôme).',
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
            <SectionHeader as="h1" title="Contact" />
            <address className="mt-8 space-y-1 not-italic text-lg">
              {s.address && <p>{s.address}</p>}
              <p>{[s.postalCode, s.city].filter(Boolean).join(' ')}</p>
              {s.phone && <p><a className="font-semibold text-cocoa underline" href={telHref(s.phone)}>{s.phone}</a></p>}
              {s.email && <p><a className="text-cocoa underline" href={`mailto:${s.email}`}>{s.email}</a></p>}
            </address>
            {(s.hours?.length ?? 0) > 0 && (
              <>
                <h2 className="mt-10 !text-2xl">Horaires</h2>
                <dl className="mt-3 space-y-1">
                  {s.hours!.map((h) => (
                    <div key={h.id} className="flex gap-4"><dt className="min-w-32 font-semibold text-cocoa">{h.days}</dt><dd>{h.time}</dd></div>
                  ))}
                </dl>
              </>
            )}
            {s.pickupInfo && (<><h2 className="mt-10 !text-2xl">Retrait et zone</h2><p className="mt-3 whitespace-pre-line">{s.pickupInfo}</p></>)}
            <div className="mt-8"><ContactActions s={s} /></div>
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
