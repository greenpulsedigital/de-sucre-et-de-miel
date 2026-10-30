# Déploiement chez Infomaniak (Hébergement Web, site Node.js, code depuis GitHub)

Le site tourne comme un **site Node.js** de l'Hébergement Web Infomaniak : un serveur Next.js + Payload toujours actif, une base SQLite et des photos sur le disque de l'hébergement. **Aucun terminal n'est nécessaire** : le code vient du dépôt GitHub privé `greenpulsedigital/de-sucre-et-de-miel` (branche `main`), le reste se fait dans le Manager et le Web FTP.

## Principe

| Élément | Où | Persistant ? |
|---|---|---|
| Code | dossier du site, cloné depuis GitHub (`main`) | mis à jour par `git pull` à chaque build |
| Base `payload.db` | `../data/payload.db`, **à côté** du dossier du site | oui |
| Photos et pièces jointes | `../data/media/` | oui |
| Secrets | fichier `.env` dans le dossier du site, créé dans le Web FTP | oui (jamais dans Git ni dans le ZIP) |

À chaque build, le site :
1. applique les **migrations** de la base (`src/migrations/`) ;
2. lance `init:prod` : si la base est **vide**, il charge les données de démarrage (catégories, 12 produits, photos) ; s'il n'y a **aucun compte**, il crée l'administrateur. Une base déjà remplie n'est jamais modifiée ;
3. compile le site.

---

## 1. Jeton d'accès GitHub (lecture seule)

Le dépôt est privé : Infomaniak a besoin d'un jeton pour le cloner.

1. GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token.
2. Resource owner : `greenpulsedigital` ; Repository access : **Only select repositories** → `de-sucre-et-de-miel`.
3. Permissions : **Contents : Read-only** (rien d'autre). Expiration : 1 an (noter la date de renouvellement).
4. Copier le jeton : il ne sera plus affiché.

URL à donner à Infomaniak (le jeton tient lieu de mot de passe) :

```
https://x-access-token:<JETON>@github.com/greenpulsedigital/de-sucre-et-de-miel.git
```

Ne jamais coller cette URL ailleurs que dans le Manager : elle donne accès au code.

> Sans Git, une archive reste possible : `pnpm package:infomaniak` crée `desucreetdemiel-site.zip` sur le Bureau.

## 2. Créer le site dans le Manager

1. Hébergement Web → **Ajouter** → projet avec technologies avancées → **Node.js**.
2. Version de Node.js : **22 (LTS)**.
3. Domaine : `desucreetdemiel.fr` ; ajouter aussi `www.desucreetdemiel.fr` (le site redirige `www` vers le domaine sans `www`).
4. Méthode **Personnalisée**, source : **dépôt Git privé** → l'URL avec jeton de l'étape 1, branche `main`.
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
| Commande de build | `git pull && NODE_ENV=development npx --yes pnpm@11.23.0 install --frozen-lockfile && npx --yes pnpm@11.23.0 init:prod && npx --yes pnpm@11.23.0 build` |
| Commande de lancement | `npm start` |
| Port d'écoute | celui proposé par le Manager (Next.js lit la variable `PORT`) |

`NODE_ENV=development` ne concerne que l'installation : il garantit que les outils de build (Tailwind, TypeScript, tsx) sont installés. L'initialisation, le build et le serveur tournent en production.

## 6. Premier lancement

1. Lancer le **build** depuis le Manager et suivre la console : on doit voir `Migrated: …_initial`, `Base vide : chargement des données de démarrage`, `Compte admin créé`, puis la compilation.
2. **Démarrer** le site.
3. Vérifier : `https://desucreetdemiel.fr`, `/admin` (connexion avec ADMIN_EMAIL), `/robots.txt`, `/sitemap.xml`.
4. Envoyer un message de test depuis `/contact` pour valider l'email.

## 7. Mettre à jour le site

1. Fusionner les changements dans `main` sur GitHub.
2. Manager : relancer le **build** (il commence par `git pull`), puis **redémarrer**.

`.env` et le dossier `data` ne sont jamais touchés (ils ne sont pas dans Git).

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
- **`git pull` refusé (authentication failed)** : jeton expiré ou révoqué ; en créer un nouveau et mettre à jour l'URL du dépôt dans le Manager.
- **Erreur de mémoire au build** : relancer le build ; si elle persiste, contacter le support Infomaniak.
