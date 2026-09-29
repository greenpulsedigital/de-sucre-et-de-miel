import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Politique de confidentialité', description: 'Données collectées via les formulaires du site De Sucre & de Miel et vos droits.', path: '/confidentialite' })

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Confidentialité' }]} />
      <section className="section !pt-8">
        <div className="container-x max-w-3xl">
          <SectionHeader as="h1" title="Politique de confidentialité" />
          <div className="prose-tight mt-8">
            <h2 className="!text-2xl">Données collectées</h2>
            <p>Uniquement ce qui est nécessaire pour traiter votre demande : identité, email, téléphone, date et détails de la commande ou de l’événement, message et, si vous en ajoutez une, une photo d’inspiration. Aucun compte client n’est requis.</p>
            <h2 className="!text-2xl">Finalité et base légale</h2>
            <p>Répondre à votre demande (exécution de mesures précontractuelles). Vos données ne sont ni revendues ni utilisées à des fins publicitaires.</p>
            <h2 className="!text-2xl">Durée de conservation</h2>
            <p>Vos données sont conservées le temps nécessaire au traitement de la demande, puis au plus 3 ans après le dernier contact.</p>
            <h2 className="!text-2xl">Cookies et mesure d’audience</h2>
            <p>Le site n’utilise aucun cookie publicitaire ni traceur tiers. La mesure d’audience, si elle est activée, est anonyme et sans cookie.</p>
            <h2 className="!text-2xl">Vos droits</h2>
            <p>Accès, rectification, effacement, opposition : écrivez-nous via la page <a href="/contact">contact</a>. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>
          </div>
        </div>
      </section>
    </>
  )
}
