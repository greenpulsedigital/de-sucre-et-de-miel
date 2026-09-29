# De Sucre & de Miel

Site vitrine + catalogue + demandes de commande (PRD V2). Next.js 16 · Tailwind 4 · Payload CMS 3 (SQLite).

```bash
pnpm install
cp .env.example .env        # renseigner PAYLOAD_SECRET (openssl rand -hex 32)
pnpm seed                   # données d'exemple + compte admin (identifiants écrits dans .env)
pnpm dev                    # site: http://localhost:3000 — admin: /admin
pnpm build && pnpm test:e2e # tests Playwright + axe (WCAG 2.1 AA)
```

## Avant mise en ligne
- Remplacer les photos provisoires (admin > Photos, Réglages du site) et les 6 créations d'exemple.
- Renseigner coordonnées, horaires, adresse (Réglages du site) et compléter les mentions légales.
- Rédiger « Notre histoire » (`src/app/(site)/maison/page.tsx`).
- Configurer SMTP (`.env`) ; sans SMTP, les demandes restent visibles dans admin > Demandes.
- Ajouter de vrais avis (aucun avis fictif n'est affiché) et la sélection Instagram.
- Persistance : `payload.db` et `media/` doivent être sur un volume sauvegardé.
