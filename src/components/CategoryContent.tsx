import Link from 'next/link'
import type { Product } from '@/payload-types'
import { sizesText } from './blocks'

/**
 * Texte éditorial des pages catégorie, affiché sous la grille de produits.
 * « Tartes alpines » est la page pilier du site. Uniquement des faits confirmés
 * (atelier, fondateur, gamme, formats, livraison) : rien d'inventé sur la conservation, les prix ou les minimums.
 */
export function CategoryContent({ slug, products }: { slug: string; products: Product[] }) {
  if (slug === 'tartes-alpines') return <TartesAlpines products={products} />
  if (slug === 'pains-d-epices') return <PainsDEpices products={products} />
  return null
}

function RecipeLinks({ products }: { products: Product[] }) {
  return (
    <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <Link href={`/creations/${p.slug}`} className="font-semibold text-cocoa underline">{p.name}</Link>
          <span className="whitespace-nowrap text-charcoal"> · {sizesText(p)}</span>
        </li>
      ))}
    </ul>
  )
}

function ProBlock() {
  return (
    <>
      <h2 className="mt-14 !text-3xl">Pour les revendeurs</h2>
      <ul className="mt-5 list-disc space-y-2 pl-5 text-lg">
        <li>Vente réservée aux professionnels : épiceries fines, primeurs, boulangeries, hôtels, gîtes et commerces de produits régionaux.</li>
        <li>Livraison dans toute la France, directement à votre commerce ou à votre établissement.</li>
        <li>Tarifs, minimums de commande, conditionnement et modalités de livraison communiqués sur demande.</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/professionnels" className="btn btn-primary">Demander les tarifs pro</Link>
        <Link href="/contact" className="btn btn-secondary">Contacter l’atelier</Link>
      </div>
    </>
  )
}

function TartesAlpines({ products }: { products: Product[] }) {
  return (
    <div className="mt-20 max-w-3xl space-y-5 text-lg">
      <h2 className="!text-3xl">La tarte alpine, une recette de montagne faite main</h2>
      <p>Nos tartes alpines sont fabriquées à la main par William Frachisse, pâtissier-boulanger natif des Hautes-Alpes, dans notre atelier de Montboucher-sur-Jabron, dans la Drôme. Ce sont les recettes de son enfance en montagne, préparées dans le respect des traditions.</p>
      <p>Les tartes aux fruits (myrtille, abricot, framboise, fraise et citron) sont des tartes à la confiture coiffées de croisillons de pâte. Le chocolat, la praline, le mendiant et la noix complètent la gamme pour varier l’offre en rayon.</p>

      <h2 className="!pt-9 !text-3xl">Neuf recettes, trois tailles</h2>
      <p>Chaque tarte alpine existe en 28 cm (550 g) pour la vitrine et la découpe, en 24 cm (400 g) pour le rayon, et en 14 cm (100 g) pour la vente à l’unité.</p>
      <RecipeLinks products={products} />

      <ProBlock />
      <p className="!mt-8">Vous cherchez aussi un fabricant de pain d’épices ? Découvrez nos <Link href="/creations/pains-d-epices" className="underline">pains d’épices artisanaux</Link>, à proposer à côté des tartes.</p>
    </div>
  )
}

function PainsDEpices({ products }: { products: Product[] }) {
  return (
    <div className="mt-20 max-w-3xl space-y-5 text-lg">
      <h2 className="!text-3xl">Des pains d’épices artisanaux pour votre rayon</h2>
      <p>Nos pains d’épices sont fabriqués à la main dans notre atelier de Montboucher-sur-Jabron, dans la Drôme, par William Frachisse, le pâtissier qui prépare aussi nos <Link href="/creations/tartes-alpines" className="underline">tartes alpines</Link>. Trois parfums sont disponibles :</p>
      <RecipeLinks products={products} />
      <ProBlock />
    </div>
  )
}
