import type { ReactNode } from 'react'
import { Breadcrumb, SectionHeader } from '@/components/blocks'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Politique de confidentialité',
  description: 'Données personnelles collectées par WILLY PATISS (De Sucre & de Miel), finalités, durées de conservation et vos droits.',
  path: '/confidentialite',
})

const MAIL = 'contact@desucreetdemiel.fr'

const H = ({ children }: { children: ReactNode }) => <h2 className="!mt-10 !text-2xl">{children}</h2>
const Table = ({ head, rows }: { head: [string, string]; rows: [string, string][] }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-left text-base">
      <thead><tr>{head.map((h) => <th key={h} scope="col" className="border-b-2 border-charcoal px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
      <tbody>{rows.map(([a, b]) => <tr key={a}><td className="border-b border-charcoal/20 px-3 py-3 align-top">{a}</td><td className="border-b border-charcoal/20 px-3 py-3 align-top">{b}</td></tr>)}</tbody>
    </table>
  </div>
)

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'Confidentialité' }]} />
      <section className="section !pt-8">
        <div className="container-x max-w-3xl">
          <SectionHeader as="h1" title="Politique de confidentialité" />
          <div className="prose-tight mt-8">
            <p className="text-sm italic">Dernière mise à jour : 21 octobre 2026</p>
            <p>La société WILLY PATISS (ci-après « nous ») attache une grande importance à la protection de vos données personnelles. La présente politique explique quelles données nous collectons lorsque vous visitez le site desucreetdemiel.fr ou que vous nous contactez, pourquoi nous les utilisons, combien de temps nous les conservons et quels sont vos droits.</p>
            <p>Elle est établie conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée (loi « Informatique et Libertés »).</p>

            <H>1. Responsable du traitement</H>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Dénomination</strong> : WILLY PATISS</li>
              <li><strong>Forme juridique</strong> : société par actions simplifiée (SAS)</li>
              <li><strong>Siège social</strong> : 130b, ZA de Fontgrave, 26740 Montboucher-sur-Jabron, France</li>
              <li><strong>Immatriculation</strong> : RCS Romans, n° 823 679 550 (SIREN)</li>
              <li><strong>Représentée par</strong> : son Président</li>
              <li><strong>Contact</strong> : <a href={`mailto:${MAIL}`}>{MAIL}</a>, <a href="tel:+33677235888">+33 6 77 23 58 88</a></li>
            </ul>

            <H>2. Données collectées</H>
            <p>Selon les moyens que vous utilisez pour nous contacter ou naviguer sur le site, nous pouvons collecter :</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>des données d’identification et de contact</strong> : nom, prénom, fonction, nom de votre entreprise, numéro de SIRET, adresse e-mail et numéro de téléphone, transmis via le formulaire de contact, une demande de devis, un e-mail ou un appel ;</li>
              <li><strong>des données liées à la relation commerciale</strong> : demandes de devis, commandes, informations de livraison et de facturation, échanges avec notre service commercial ;</li>
              <li><strong>des données de navigation</strong> : adresse IP, date et heure de connexion, pages consultées, type de navigateur, enregistrées automatiquement par le serveur qui héberge le site ;</li>
              <li><strong>des cookies strictement nécessaires</strong> : voir la section 7.</li>
            </ul>
            <p>Nous vous demandons de ne pas transmettre via le site de données sensibles au sens de l’article 9 du RGPD (origine, opinions, santé, etc.).</p>

            <H>3. Finalités et bases légales</H>
            <Table
              head={['Finalité', 'Base légale']}
              rows={[
                ['Répondre à vos demandes de contact, d’information ou de devis', 'Mesures précontractuelles pour les demandes de devis, intérêt légitime pour les autres demandes (art. 6.1.b et 6.1.f RGPD)'],
                ['Vérifier votre statut de professionnel (numéro de SIRET), la vente étant réservée aux professionnels', 'Intérêt légitime (art. 6.1.f RGPD)'],
                ['Gérer la relation client : commandes, livraisons, facturation, service après-vente', 'Exécution du contrat (art. 6.1.b RGPD)'],
                ['Respecter nos obligations comptables et fiscales', 'Obligation légale (art. 6.1.c RGPD)'],
                ['Prospection commerciale auprès de professionnels', 'Intérêt légitime (art. 6.1.f RGPD), avec possibilité de vous opposer à tout moment'],
                ['Sécurité du site et prévention des fraudes', 'Intérêt légitime (art. 6.1.f RGPD)'],
              ]}
            />

            <H>4. Destinataires des données</H>
            <p>Vos données sont destinées :</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>au personnel habilité de WILLY PATISS, dans la limite de ce dont il a besoin ;</li>
              <li>à nos prestataires techniques, qui n’agissent que sur nos instructions (sous-traitants), notamment l’hébergeur du site, Infomaniak Network SA, et [autres prestataires le cas échéant : e-mailing, logiciel de facturation, expert-comptable, maintenance du site] ;</li>
              <li>aux autorités compétentes, lorsque la loi l’exige.</li>
            </ul>
            <p>Le site est hébergé par Infomaniak Network SA, dont le siège social est situé Rue Eugène Marziano 25, 1227 Les Acacias (Genève), Suisse. Infomaniak intervient en qualité de sous-traitant et stocke les données dans ses centres de données situés en Suisse.</p>
            <p>Nous ne vendons ni ne louons vos données personnelles.</p>

            <H>5. Transferts hors de l’Union européenne</H>
            <p>Les données hébergées par Infomaniak sont stockées en Suisse. La Suisse bénéficie d’une décision d’adéquation de la Commission européenne : ce transfert ne nécessite donc pas de garanties supplémentaires. Si un autre prestataire situé hors de l’Union européenne ou de la Suisse devait traiter vos données, nous encadrerions ce transfert par les garanties prévues par le RGPD, notamment les clauses contractuelles types de la Commission européenne.</p>

            <H>6. Durées de conservation</H>
            <Table
              head={['Données', 'Durée de conservation']}
              rows={[
                ['Demandes de contact ou de devis non suivies d’une commande', '3 ans à compter du dernier contact'],
                ['Données des clients', 'Durée de la relation commerciale, puis 5 ans à compter de sa fin'],
                ['Factures et pièces comptables', '10 ans (article L. 123-22 du Code de commerce)'],
                ['Données de prospection', '3 ans à compter du dernier contact, ou jusqu’à votre opposition'],
                ['Données de navigation (journaux du serveur)', '12 mois maximum'],
              ]}
            />

            <H>7. Cookies et traceurs</H>
            <p>Un cookie est un petit fichier déposé sur votre terminal lors de la consultation d’un site. Le site n’utilise que des cookies strictement nécessaires à son fonctionnement, qui ne nécessitent pas votre consentement. Nous n’utilisons ni outil de mesure d’audience, ni service tiers déposant des cookies.</p>
            <p>Vous pouvez à tout moment gérer les cookies depuis les paramètres de votre navigateur. Pour en savoir plus, consultez le site de la CNIL : <a href="https://www.cnil.fr" rel="noopener noreferrer">www.cnil.fr</a>.</p>

            <H>8. Vos droits</H>
            <p>Dans les conditions prévues par le RGPD et la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>droit d’accès</strong> : obtenir une copie des données que nous détenons vous concernant ;</li>
              <li><strong>droit de rectification</strong> : faire corriger des données inexactes ou incomplètes ;</li>
              <li><strong>droit à l’effacement</strong> : demander la suppression de vos données, dans les cas prévus par la loi ;</li>
              <li><strong>droit à la limitation</strong> du traitement ;</li>
              <li><strong>droit d’opposition</strong>, notamment à la prospection commerciale, à tout moment ;</li>
              <li><strong>droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine, lorsque le traitement repose sur le consentement ou sur un contrat ;</li>
              <li><strong>droit de retirer votre consentement</strong> à tout moment, sans effet sur la licéité des traitements passés ;</li>
              <li><strong>droit de formuler des directives</strong> sur le sort de vos données après votre décès.</li>
            </ul>
            <p>Pour exercer ces droits, écrivez-nous à <a href={`mailto:${MAIL}`}>{MAIL}</a> ou par courrier à l’adresse de notre siège social. En cas de doute raisonnable sur votre identité, nous pourrons vous demander un justificatif. Nous vous répondons dans un délai d’un mois, prolongeable de deux mois pour les demandes complexes.</p>
            <p>Vous pouvez aussi introduire une réclamation auprès de la Commission nationale de l’informatique et des libertés (CNIL) : 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, <a href="https://www.cnil.fr" rel="noopener noreferrer">www.cnil.fr</a>.</p>

            <H>9. Sécurité</H>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre la perte, l’accès non autorisé, la modification ou la divulgation, notamment en limitant l’accès aux seules personnes habilitées et en sécurisant les échanges.</p>

            <H>10. Liens vers d’autres sites</H>
            <p>Le site peut contenir des liens vers des sites tiers. Cette politique ne s’applique pas à ces sites : nous vous invitons à consulter leurs propres politiques de confidentialité.</p>

            <H>11. Mineurs</H>
            <p>Le site s’adresse en priorité à des professionnels. Nous ne collectons pas sciemment de données concernant des mineurs.</p>

            <H>12. Modifications</H>
            <p>Nous pouvons mettre à jour la présente politique de confidentialité. La date de dernière mise à jour figure en haut de cette page.</p>

            <H>13. Nous contacter</H>
            <p>Pour toute question relative à la protection de vos données : <a href={`mailto:${MAIL}`}>{MAIL}</a>, ou par courrier à WILLY PATISS, 130b, ZA de Fontgrave, 26740 Montboucher-sur-Jabron, France.</p>
          </div>
        </div>
      </section>
    </>
  )
}
