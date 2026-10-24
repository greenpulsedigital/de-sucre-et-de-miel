import type { ReactNode } from 'react'
import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Mentions légales',
  description: 'Mentions légales du site desucreetdemiel.fr, édité par WILLY PATISS (De Sucre & de Miel).',
  path: '/mentions-legales',
})

const MAIL = 'contact@desucreetdemiel.fr'
const H = ({ children }: { children: ReactNode }) => <h2 className="!mt-10 !text-2xl">{children}</h2>

export default function LegalPage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Mentions légales' }]} />
      <section className="section !pt-8">
        <div className="container-x max-w-3xl">
          <SectionHeader as="h1" title="Mentions légales" />
          <div className="prose-tight mt-8">
            <p className="text-sm italic">Dernière mise à jour : 21 octobre 2026</p>
            <p>Les présentes mentions légales sont établies conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN). Elles précisent l’identité des intervenants du site desucreetdemiel.fr.</p>

            <H>1. Éditeur du site</H>
            <p>Le site desucreetdemiel.fr est édité par la société WILLY PATISS :</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Dénomination</strong> : WILLY PATISS</li>
              <li><strong>Forme juridique</strong> : société par actions simplifiée (SAS) au capital de 2 000 €</li>
              <li><strong>Siège social</strong> : 130b, ZA de Fontgrave, 26740 Montboucher-sur-Jabron, France</li>
              <li><strong>Immatriculation</strong> : RCS Romans, n° 823 679 550 (SIREN)</li>
              <li><strong>Numéro de TVA intracommunautaire</strong> : FR37 823 679 550</li>
              <li><strong>Téléphone</strong> : <a href="tel:+33677235888">+33 6 77 23 58 88</a></li>
              <li><strong>E-mail</strong> : <a href={`mailto:${MAIL}`}>{MAIL}</a></li>
            </ul>

            <H>2. Directeur de la publication</H>
            <p>Le directeur de la publication est William Frachisse, Président de la société WILLY PATISS.</p>

            <H>3. Hébergement</H>
            <p>Le site est hébergé par :</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Dénomination</strong> : Infomaniak Network SA</li>
              <li><strong>Siège social</strong> : Rue Eugène Marziano 25, 1227 Les Acacias (Genève), Suisse</li>
            </ul>

            <H>4. Propriété intellectuelle</H>
            <p>L’ensemble des contenus du site (textes, photographies, visuels, logos, marques et autres éléments graphiques) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans l’autorisation écrite préalable de WILLY PATISS est interdite, sauf dans les cas prévus par la loi.</p>

            <H>5. Responsabilité</H>
            <p>Les informations publiées sur ce site sont fournies à titre indicatif. WILLY PATISS s’efforce de les maintenir exactes et à jour, sans pouvoir garantir l’absence d’erreurs ou d’omissions. WILLY PATISS ne saurait être tenue responsable des dommages directs ou indirects résultant de l’utilisation du site ou de l’impossibilité d’y accéder, sauf en cas de faute prouvée.</p>

            <H>6. Liens hypertextes</H>
            <p>Le site peut contenir des liens vers d’autres sites. WILLY PATISS n’exerce aucun contrôle sur leur contenu et décline toute responsabilité à cet égard.</p>

            <H>7. Données personnelles et cookies</H>
            <p>Les informations relatives au traitement de vos données personnelles et à l’utilisation des cookies figurent dans la <a href="/confidentialite">politique de confidentialité</a> du site.</p>

            <H>8. Crédits</H>
            <p>Conception et réalisation : Green Pulse Digital.</p>

            <H>9. Droit applicable</H>
            <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.</p>
          </div>
        </div>
      </section>
    </>
  )
}
