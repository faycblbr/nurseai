# NurseAI

Assistant IA premium pour étudiants infirmiers francophones.

## Stack

- Next.js App Router
- TypeScript strict
- TailwindCSS v3
- Supabase Auth, PostgreSQL, Storage, RLS
- OpenAI API via une couche serveur centralisée
- Stripe Checkout: essai 30 jours puis abonnement 7 €/mois

## Démarrage

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Mise en ligne

Le guide complet est dans [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md).

Résumé:

1. Pousser le projet sur GitHub.
2. Importer le repo dans Vercel.
3. Ajouter les variables d'environnement de production.
4. Ajouter l'URL Vercel dans Supabase Auth.
5. Vérifier `/api/health`.

## Architecture

```text
app/                 Routes Next.js
components/          Design system et layout applicatif
config/              Navigation et référentiels produit
features/            Domaines métier
lib/                 Utilitaires, env, validations, clients
server/              Code serveur seulement
supabase/migrations/ Schéma SQL et RLS
```

## Principes CTO

- Aucune clé sensible côté client.
- RLS activée dès la première migration.
- Paiement et IA appelés uniquement depuis des routes serveur.
- Webhook Stripe signé avant mise à jour de l'abonnement Supabase.
- Prompts IA versionnés.
- Sorties IA en Markdown pour édition et export.
- UI mobile-first, rapide, dense et quotidienne.
