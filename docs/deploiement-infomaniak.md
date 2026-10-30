# Déploiement chez Infomaniak (Hébergement Web, site Node.js, transfert par Web FTP)

Le site tourne comme un **site Node.js** de l'Hébergement Web Infomaniak : un serveur Next.js + Payload toujours actif, une base SQLite et des photos sur le disque de l'hébergement. **Aucun terminal n'est nécessaire** : tout se fait dans le Manager et le Web FTP.

## Principe

| Élément | Où | Persistant ? |
|---|---|---|
| Code | dossier du site, envoyé en ZIP par le Web FTP | remplacé à chaque déploiement |
| Base `payload.db` | `../data/payload.db`, **à côté** du dossier du site | oui |
| Photos et pièces jointes | `../data/media/` | oui |
| Secrets | fichier `.env` dans le dossier du site, créé dans le Web FTP | oui (jamais dans Git ni dans le ZIP) |

À chaque build, le site :
1. applique les **migrations** de la base (`src/migrations/`) ;
2. lance `init:prod` : si la base est **vide**, il charge les données de démarrage (catégories, 12 produits, photos) ; s'il n'y a **aucun compte**, il crée l'administrateur. Une base déjà remplie n'est jamais modifiée ;
3. compile le site.

---

## 1. Préparer l'archive (sur le Mac)

Commiter les changements, puis :

```bash
pnpm package:infomaniak
```

L'archive `desucreetdemiel-site.zip` est créée sur le **Bureau**. Elle contient le code commité uniquement : ni `node_modules`, ni `.env`, ni base, ni photos envoyées, ni tests.

## 2. Créer le site dans le Manager

1. Hébergement Web → **Ajouter** → projet avec technologies avancées → **Node.js**.
2. Version de Node.js : **22 (LTS)**.
3. Domaine : `desucreetdemiel.fr` ; ajouter aussi `www.desucreetdemiel.fr` (le site redirige `www` vers le domaine sans `www`).
4. Méthode **Personnalisée**, source : **archive ZIP** → envoyer `desucreetdemiel-site.zip`.
5. Activer le **certificat SSL** (Let's Encrypt) sur les deux domaines.

## 3. Créer le dossier des données (Web FTP)

Dans le Web FTP, **à côté** du dossier du site (dans le dossier parent), créer :

```
data/
└── media/
```

## 4. Créer le fichier `.env` (Web FTP)

Dans le dossier du site (celui qui contient `package.json`), créer un fichier `.env` :

```bash
NODE_ENV=production
DB_MIGRATIONS=1
NEXT_PUBLIC_SITE_URL=https://desucreetdemiel.fr
PAYLOAD_SECRET=…                      # longue chaîne aléatoire (64 caractères), ex. : openssl rand -hex 32
DATABASE_URL=file:../data/payload.db
MEDIA_DIR=../data/media

# Compte administrateur, créé au premier build
ADMIN_EMAIL=…
ADMIN_PASSWORD=…

# Email (boîte contact@ Infomaniak)
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=465
SMTP_USER=contact@desucreetdemiel.fr
SMTP_PASS=…
MAIL_FROM="De Sucre & de Miel <contact@desucreetdemiel.fr>"
MAIL_TO=contact@desucreetdemiel.fr
```

- Ne **pas** mettre `SITE_NOINDEX` en production (à réserver à un site de recette).
- Une fois l'administrateur créé, retirer `ADMIN_EMAIL` et `ADMIN_PASSWORD` du fichier.
- Si le Web FTP le permet, restreindre les droits du fichier `.env` (600).

## 5. Réglages Node.js du site

Manager → site → **Gérer les paramètres avancés** → onglet **Node.js** :

| Champ | Valeur |
|---|---|
| Dossier d'exécution | `./` (dossier qui contient `package.json`) |
| Commande de build | `NODE_ENV=development npx --yes pnpm@11.23.0 install --frozen-lockfile && npx --yes pnpm@11.23.0 init:prod && npx --yes pnpm@11.23.0 build` |
| Commande de lancement | `npm start` |
| Port d'écoute | celui proposé par le Manager (Next.js lit la variable `PORT`) |

`NODE_ENV=development` ne concerne que l'installation : il garantit que les outils de build (Tailwind, TypeScript, tsx) sont installés. L'initialisation, le build et le serveur tournent en production.

## 6. Premier lancement

1. Lancer le **build** depuis le Manager et suivre la console : on doit voir `Migrated: …_initial`, `Base vide : chargement des données de démarrage`, `Compte admin créé`, puis la compilation.
2. **Démarrer** le site.
3. Vérifier : `https://desucreetdemiel.fr`, `/admin` (connexion avec ADMIN_EMAIL), `/robots.txt`, `/sitemap.xml`.
4. Envoyer un message de test depuis `/contact` pour valider l'email.

## 7. Mettre à jour le site

1. Commiter, puis `pnpm package:infomaniak` sur le Mac.
2. Web FTP : dans le dossier du site, remplacer le code par le contenu du nouveau ZIP (**sans toucher à `.env`** ni au dossier `data` à côté).
3. Manager : relancer le **build**, puis **redémarrer**.

La base et les photos ne bougent pas. Les migrations éventuelles s'appliquent toutes seules. La console doit afficher `Base existante (… produits) : aucune donnée modifiée`.

## 8. Modifier une collection Payload

Après un changement de champ ou de collection, en local :

```bash
pnpm payload migrate:create nom-du-changement
```

Commiter le fichier généré dans `src/migrations/` : il sera appliqué au prochain build.

## 9. Sauvegardes

- Vérifier dans le Manager que les **sauvegardes automatiques** de l'hébergement couvrent le dossier `data`.
- Avant chaque mise à jour importante : télécharger `data/payload.db` par le Web FTP.

## 10. Dépannage

- **Le site ne démarre pas** : console d'exécution du tableau de bord. Vérifier le port et le `.env`.
- **« missing secret key »** : `PAYLOAD_SECRET` absent du `.env`.
- **« no such table »** : `DB_MIGRATIONS=1` absent du `.env`.
- **Photos absentes** : vérifier `MEDIA_DIR=../data/media` et que le dossier existe.
- **Liens en `localhost`** : `NEXT_PUBLIC_SITE_URL` doit être présent dans `.env` **avant** le build.
- **Erreur de mémoire au build** : relancer le build ; si elle persiste, contacter le support Infomaniak.
