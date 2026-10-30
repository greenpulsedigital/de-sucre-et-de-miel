# Plan SEO — De Sucre & de Miel

> Site : desucreetdemiel.fr · Atelier : Montboucher-sur-Jabron (Drôme) · Vente **B2B uniquement**
> Rédigé le 30 octobre 2026, à partir du code du site (Next.js + Payload).

---

## 1. Objectif

Faire trouver l'atelier par **les professionnels qui cherchent un fournisseur** de tartes et de pains d'épices artisanaux : épiceries fines, primeurs, gîtes et chambres d'hôtes, commerces de terroir, boulangeries sans pâtissier, cafés.

Le site ne vend pas en ligne : **la conversion, c'est une demande de tarifs pro** (formulaire `/professionnels` ou `/contact`, WhatsApp, téléphone).

| Indicateur | Point de départ | Cible à 6 mois |
|---|---|---|
| Demandes de tarifs reçues via le site | à mesurer | ≥ 8 / mois |
| Clics organiques (Search Console) | à mesurer | × 3 |
| Requêtes « fournisseur » en top 10 | 0 (à vérifier) | ≥ 15 |
| Pages indexées / pages utiles | à mesurer | 100 % |

---

## 2. Cibles et intentions de recherche

Le particulier qui cherche « recette tarte myrtille » n'est **pas** la cible. On vise des requêtes d'acheteur professionnel.

| Intention | Exemples de requêtes | Page qui doit répondre |
|---|---|---|
| Trouver un fournisseur | fournisseur tarte artisanale, grossiste tarte aux fruits, fournisseur pâtisserie épicerie fine | `/professionnels` |
| Produit précis | tarte myrtille artisanale professionnel, pain d'épices artisanal revendeur, pain d'épices figue | fiches `/creations/[produit]` |
| Gamme | tartes alpines, tarte aux fruits grande taille 28 cm, tarte de montagne | `/creations`, catégories |
| Local | pâtissier Drôme, tartes artisanales Montélimar, fournisseur gîte Drôme provençale | accueil, `/maison`, `/contact` |
| Marque / confiance | De Sucre et de Miel, William Frachisse | accueil, `/maison` |

⚠️ **Volumes à valider** avec un outil de mots-clés (Search Console après 4 à 6 semaines, puis un outil comme Semrush, Ahrefs ou OpenSEO). Les requêtes ci-dessus sont des hypothèses de départ.

---

## 3. État actuel (constaté dans le code)

### Déjà en place ✅
- Titre, description, URL canonique, Open Graph et Twitter sur chaque page (`src/lib/seo.ts`).
- `sitemap.xml` dynamique (pages, catégories, produits) et `robots.txt` qui bloque `/admin` et `/api`.
- Données structurées : `WebSite`, `Organization` + `Bakery` (adresse, fondateur, zone desservie, audience B2B), `BreadcrumbList`, `Product`.
- `<html lang="fr">`, gabarit de titre `%s | De Sucre & de Miel`.
- Images servies par `next/image` (WebP/AVIF, tailles adaptées), textes alternatifs renseignés.
- Rendu serveur (le contenu est lisible sans JavaScript).

### À corriger 🔧

| # | Problème | Impact | Où |
|---|---|---|---|
| T1 | Le titre de l'accueil contient déjà la marque, et le gabarit la rajoute → « De Sucre & de Miel — … \| De Sucre & de Miel » | Titre tronqué, doublon | `src/app/(site)/page.tsx` : utiliser `title: { absolute: … }` |
| T2 | Titres des fiches produits trop courts (« Tarte myrtille ») | Ne capte pas l'intention pro | `creations/[slug]/page.tsx` |
| T3 | Descriptions des fiches produits = extrait de ~50 caractères | Extrait Google pauvre, faible taux de clic | champ `excerpt` dans Payload |
| T4 | Pas d'image Open Graph par défaut | Partages LinkedIn / WhatsApp sans visuel | ajouter `src/app/opengraph-image.(png\|tsx)` |
| T5 | Schéma `Product` sans `offers` (pas de prix public) | Avertissements dans Search Console, pas d'extrait enrichi produit | soit retirer `Product` au profit d'un `ItemList` dans la catégorie, soit ajouter `offers` avec `businessFunction: Sell` et `eligibleCustomerType: Business` |
| T6 | `articleSchema` pointe vers `/actualites/…`, route inexistante | Code mort | à brancher quand le blog existera (§ 6) |
| T7 | Sitemap : `changeFrequency: weekly` partout, pas de `lastModified` sur les pages fixes, pages légales incluses | Signaux peu fiables | ajuster `src/app/sitemap.ts` |
| T8 | Les 3 pains d'épices partagent la même photo et le même texte, à une saveur près | Risque de contenu quasi dupliqué | une photo et une description propres à chaque parfum |
| T9 | `Bakery` sans coordonnées GPS ni horaires | Moins de poids en recherche locale | ajouter `geo` et `openingHoursSpecification` (horaires de l'atelier ou de retrait) |

---

## 4. Architecture et maillage

```
/                         Accueil — « Tartes alpines artisanales pour professionnels »
├── /creations            Nos produits (toute la gamme)
│   ├── /creations/tartes-alpines        (catégorie)
│   │   └── /creations/tarte-myrtille …  (9 fiches)
│   └── /creations/pains-d-epices        (catégorie)
│       └── /creations/pain-d-epices-orange … (3 fiches)
├── /professionnels       Devenir revendeur ← PAGE DE CONVERSION PRINCIPALE
├── /maison               L'artisan, l'atelier, la fabrication
├── /contact
└── (à créer) /journal    Contenus pour professionnels (§ 6)
```

Règles de maillage :
- **Chaque fiche produit** affiche un appel à l'action vers `/professionnels` (« Recevoir les tarifs pro de cette tarte »).
- **`/professionnels`** renvoie vers les catégories et vers 3 ou 4 produits phares.
- **`/maison`** renvoie vers `/creations` et `/professionnels`.
- Ancres de lien descriptives (« nos tartes alpines en 28 cm »), jamais « cliquez ici ».

---

## 5. Optimisation page par page

| Page | Mot-clé principal | Titre proposé (≤ 60 car.) | Description proposée (≤ 155 car.) |
|---|---|---|---|
| `/` | tartes artisanales pour professionnels | Tartes alpines artisanales pour professionnels \| De Sucre & de Miel | Fournisseur de tartes aux fruits et pains d'épices faits main dans la Drôme. 9 recettes, 3 tailles, livrées partout en France. Tarifs pro sur demande. |
| `/creations` | tartes alpines | Tartes alpines et pains d'épices artisanaux — gamme pro | Myrtille, abricot, framboise, citron, noix… 9 tartes en 28, 24 et 14 cm et 3 pains d'épices, fabriqués à la main pour les commerces. |
| `/professionnels` | fournisseur tarte artisanale | Fournisseur de tartes artisanales pour épiceries et gîtes | Épiceries fines, primeurs, gîtes, cafés : référencez nos tartes alpines et pains d'épices. Minimums, conservation, livraison : demandez nos conditions. |
| `/maison` | pâtissier artisan Drôme | William Frachisse, pâtissier artisan dans la Drôme | Natif des Hautes-Alpes, William Frachisse fabrique à Montboucher-sur-Jabron des tartes aux fruits et des pains d'épices selon les recettes de son enfance. |
| `/contact` | (marque + local) | Contacter l'atelier — Montboucher-sur-Jabron (Drôme) | Une question sur la gamme, les tarifs ou la livraison ? Écrivez à l'atelier ou appelez-nous. Réponse sous 48 h. |
| Fiche tarte | tarte [fruit] artisanale | Tarte [fruit] artisanale — 28, 24 ou 14 cm, pour pros | Tarte [fruit] faite main, [ingrédient clé]. Trois tailles, conservation [X] jours. Pour épiceries, primeurs et gîtes. Demandez le tarif pro. |
| Fiche pain d'épices | pain d'épices [parfum] artisanal | Pain d'épices [parfum] artisanal au miel — revendeurs | Pain d'épices [parfum] au miel, [poids] g, fabriqué à l'atelier dans la Drôme. Idéal en épicerie fine et en gîte. Tarifs pro sur demande. |

### Contenu minimal d'une fiche produit (≈ 250 à 400 mots)
1. Description gourmande (fruit, origine si connue, pâte, texture).
2. **Bloc pro** : formats et poids, nombre de parts, conservation (DLC/DLUO), conditionnement, colisage, conseils de mise en rayon.
3. Allergènes (déjà gérés dans Payload).
4. Appel à l'action « Demander le tarif pro ».
5. 2 ou 3 produits associés.

### Images
- Nom de fichier descriptif (`tarte-myrtille-artisanale-28cm.webp`, pas `IMG_4521.webp`).
- Texte alternatif qui décrit l'image avec le produit (« Tarte myrtille artisanale en croisillons, vue du dessus »).
- **Une photo réelle par parfum** de pain d'épices (cf. T8).

---

## 6. Plan éditorial : `/journal`

Objectif : capter les requêtes d'information des professionnels et créer des liens internes vers les fiches. Rythme réaliste : **2 articles par mois** pendant 6 mois.

| # | Sujet | Requête visée | Lien vers |
|---|---|---|---|
| 1 | Quelles pâtisseries vendre en épicerie fine ? | produits épicerie fine qui se vendent | `/professionnels` |
| 2 | Proposer un petit-déjeuner maison dans son gîte sans cuisiner | petit déjeuner gîte fournisseur | pains d'épices, tartes 14 cm |
| 3 | Tarte de 28, 24 ou 14 cm : quelle taille pour quel commerce ? | taille tarte parts | `/creations` |
| 4 | Conservation des tartes aux fruits : ce qu'il faut savoir | conservation tarte aux fruits | fiches tartes |
| 5 | Le pain d'épices au miel : origine et différences | pain d'épices artisanal miel | pains d'épices |
| 6 | Les tartes alpines, une tradition des Hautes-Alpes | tarte alpine / tourte de montagne | `/maison` |
| 7 | Fiche revendeur : un primeur témoigne | (marque, confiance) | `/professionnels` |
| 8 | Calendrier des fruits : quelle tarte à quelle saison | tarte de saison | fiches tartes |

Technique : collection `articles` dans Payload, branchée sur `articleSchema` (T6), ajoutée au sitemap.

---

## 7. SEO local

1. **Fiche Google Business Profile** : catégorie « Pâtisserie » ou « Grossiste en produits alimentaires », zone desservie (France) plutôt qu'adresse publique si l'atelier ne reçoit pas de public, photos, lien vers `/professionnels`.
2. **Cohérence du nom, de l'adresse et du téléphone** (« NAP ») : identiques sur le site, Google, Instagram, PagesJaunes et les annuaires.
3. **Annuaires utiles** : Chambre de métiers de la Drôme, « Goûtez l'Ardèche / Drôme », plateformes de produits locaux, annuaires de producteurs artisanaux.
4. **Avis** : demander un avis Google à chaque nouveau revendeur satisfait (lien court dans l'e-mail de suivi).
5. **Liste des points de vente** (avec l'accord des revendeurs) : page « Où nous trouver », utile aux particuliers et crédible pour les pros.

---

## 8. Popularité (liens entrants)

- Lien depuis le site des **revendeurs** (« Nos tartes viennent de l'atelier De Sucre & de Miel »).
- Presse locale : Le Dauphiné Libéré, La Tribune Montélimar, radios locales (sujet : artisan des Hautes-Alpes installé dans la Drôme).
- Salons pros et marchés de producteurs : la page exposant inclut souvent un lien.
- Office de tourisme de Montélimar Agglomération, réseaux Gîtes de France de la Drôme.

À éviter : achat de liens, annuaires généralistes de faible qualité.

---

## 9. Technique et performance

| Action | Comment |
|---|---|
| Déclarer le site | Google Search Console + Bing Webmaster Tools, soumettre `sitemap.xml` |
| Variable de prod | `NEXT_PUBLIC_SITE_URL=https://desucreetdemiel.fr` sur Vercel (sinon canoniques et sitemap en `localhost`) |
| `SITE_NOINDEX` | **absente en production**, présente sur les prévisualisations |
| Redirections | `www` → sans `www` (ou l'inverse) en 301, HTTPS forcé |
| Core Web Vitals | LCP < 2,5 s (image du hero en `priority`, déjà le cas), CLS < 0,1, INP < 200 ms ; contrôler avec PageSpeed Insights sur mobile |
| Données structurées | Valider avec le test des résultats enrichis de Google après les corrections T5 et T9 |
| Pages 404 | Vérifier dans Search Console, rediriger en 301 les anciennes URL de l'ancien site s'il y en avait |
| IA générative | Ajouter un `llms.txt` court (qui, quoi, pour qui, contact) pour aider les assistants IA à citer correctement l'atelier |

---

## 10. Calendrier

| Semaine | Actions |
|---|---|
| S1 | Search Console, Bing, sitemap ; corrections T1, T4, T7 ; vérifier variables de prod |
| S2 | Nouveaux titres et descriptions (§ 5) ; correction T5, T9 |
| S3–S4 | Réécriture des 12 fiches produits (bloc pro) ; photos des pains d'épices (T8) |
| S4 | Fiche Google Business Profile, cohérence NAP, 3 annuaires |
| M2 | Création de `/journal` + articles 1 et 2 ; demande de liens aux revendeurs |
| M3–M6 | 2 articles par mois ; démarche presse locale ; collecte d'avis |
| Chaque mois | Bilan (§ 11) |

---

## 11. Suivi

Chaque mois, dans Search Console :
- clics, impressions, position moyenne, **par page** et **par requête** ;
- nouvelles requêtes « fournisseur / grossiste / professionnel » apparues ;
- pages non indexées et leur raison.

Dans l'admin Payload : nombre de **demandes** reçues et leur origine (ajouter un champ « Comment nous avez-vous connus ? » au formulaire si besoin).

Décision à 3 mois : renforcer les pages qui se positionnent entre la 5ᵉ et la 20ᵉ place (contenu, liens internes), plutôt que créer de nouvelles pages.
