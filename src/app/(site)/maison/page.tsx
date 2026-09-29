import { Photo } from '@/components/Photo'
import { Breadcrumb, CTASection, ImageTextSection, SectionHeader } from '@/components/blocks'
import { JsonLd } from '@/components/JsonLd'
import { getSettings, media } from '@/lib/data'
import { breadcrumbSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = buildMetadata({
  title: 'La maison — l’atelier de pâtisserie',
  description: 'L’histoire, le savoir-faire et les ingrédients de De Sucre & de Miel, pâtisserie artisanale à Montboucher-sur-Jabron, dans la Drôme.',
  path: '/maison',
})

export default async function MaisonPage() {
  const s = await getSettings()
  const workshop = media(s.workshopImage)
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'La maison', path: '/maison' }])} />
      <Breadcrumb items={[{ name: 'Accueil', href: '/' }, { name: 'La maison' }]} />
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeader as="h1" eyebrow="La maison" title="Une pâtisserie faite à la main, au rythme des saisons." />
          <div className="card-img mt-10 aspect-[16/9]"><Photo media={workshop} size="wide" sizes="(min-width: 76rem) 72rem, 92vw" priority fallbackLabel="L’artisan à l’atelier" /></div>
        </div>
      </section>

      <ImageTextSection image={null} imageAlt="Les débuts de l’atelier" eyebrow="Notre histoire" title="Comment est née De Sucre & de Miel ?">
        <p data-editable>L’histoire de la maison sera racontée ici, avec les mots de l’artisan.</p>
      </ImageTextSection>

      <ImageTextSection reverse dark image={null} imageAlt="Gestes de pâtisserie" eyebrow="Notre savoir-faire" title="Faire soi-même, prendre le temps.">
        <p>Chaque création est préparée à l’atelier, en petites séries : pâtes, crèmes et garnitures sont travaillées sur place, sur commande.</p>
      </ImageTextSection>

      <ImageTextSection image={null} imageAlt="Fruits de saison" eyebrow="Nos ingrédients" title="Des produits choisis, des fruits de saison.">
        <p>Nos tartes sont préparées à l’atelier avec des fruits de saison. Le catalogue évolue donc au fil de l’année : certaines créations n’existent que quelques semaines.</p>
      </ImageTextSection>

      <ImageTextSection reverse image={null} imageAlt="La Drôme" eyebrow="Le territoire" title="Ancrée dans la Drôme.">
        <p>L’atelier est installé à Montboucher-sur-Jabron. Retrait sur place et commandes pour la Drôme et ses environs.</p>
      </ImageTextSection>

      <CTASection />
    </>
  )
}
