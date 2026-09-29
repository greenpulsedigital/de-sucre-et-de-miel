import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { getSettings } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Mentions légales', description: 'Mentions légales du site De Sucre & de Miel.', path: '/mentions-legales' })

export default async function LegalPage() {
  const s = await getSettings()
  return (
    <>
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Mentions légales' }]} />
      <section className="section !pt-8">
        <div className="container-x max-w-3xl">
          <SectionHeader as="h1" title="Mentions légales" />
          <div className="prose-tight mt-8">
            <h2 className="!text-2xl">Éditeur du site</h2>
            <p>De Sucre &amp; de Miel — [forme juridique et raison sociale à compléter] — SIRET [à compléter]<br />{[s.address, s.postalCode, s.city].filter(Boolean).join(', ')}<br />{s.email}{s.phone ? ` · ${s.phone}` : ''}</p>
            <p>Directeur de la publication : [à compléter]</p>
            <h2 className="!text-2xl">Hébergement</h2>
            <p>[Nom, adresse et contact de l’hébergeur à compléter]</p>
            <h2 className="!text-2xl">Conception</h2>
            <p>GreenPulse Digital</p>
            <h2 className="!text-2xl">Propriété intellectuelle</h2>
            <p>Les photographies et textes du site sont la propriété de De Sucre &amp; de Miel. Toute reproduction sans autorisation est interdite.</p>
            <h2 className="!text-2xl">Allergènes</h2>
            <p>Les créations sont préparées dans un atelier manipulant gluten, œufs, lait et fruits à coque. Les allergènes principaux sont indiqués sur chaque fiche ; en cas d’allergie, précisez-le lors de votre demande.</p>
          </div>
        </div>
      </section>
    </>
  )
}
