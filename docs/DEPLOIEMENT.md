# Déploiement public de NurseAI

Objectif: passer de `localhost:3000` à une URL utilisable par n'importe qui.

## 1. Créer le dépôt GitHub

Depuis le dossier du projet, pousse le code sur GitHub. Vercel se connectera à ce dépôt pour construire l'app automatiquement.

Important: ne mets jamais `.env.local` sur GitHub. Les clés restent dans Vercel.

## 2. Déployer sur Vercel

1. Va sur Vercel.
2. Clique sur `Add New Project`.
3. Choisis le repo NurseAI.
4. Framework: Next.js.
5. Build command: `npm run build`.
6. Output: laisse Vercel gérer automatiquement.

## 3. Variables d'environnement Vercel

Dans Vercel > Project Settings > Environment Variables, ajoute:

```text
NEXT_PUBLIC_APP_URL=https://ton-url-vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://qthwnzzyjqdcgdphjjvn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_cle_publique_supabase
SUPABASE_SERVICE_ROLE_KEY=ta_cle_secrete_supabase
OPENAI_API_KEY=ta_cle_openai_quand_l_ia_est_prete
OPENAI_MODEL=gpt-4.1-mini
AI_MONTHLY_QUOTA=100
STRIPE_SECRET_KEY=ta_cle_stripe_quand_le_paiement_est_pret
STRIPE_PRICE_ID=price_xxxxxxxxx
STRIPE_WEBHOOK_SECRET=ton_webhook_stripe_quand_pret
APPLE_BUNDLE_ID=webfabricpro.NurseAI
APPLE_PREMIUM_PRODUCT_ID=premium_monthly
```

La clé `SUPABASE_SERVICE_ROLE_KEY` doit rester serveur uniquement. Elle ne doit jamais être utilisée dans un composant client.

Les clés `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` et `STRIPE_WEBHOOK_SECRET` doivent aussi rester dans Vercel. Ne les mets jamais dans GitHub, dans le code, dans une page, ou dans un composant React client.

## 3.2. Activer Stripe: essai 30 jours puis 7 €/mois

1. Va sur Stripe Dashboard.
2. Crée un produit: `NurseAI Premium`.
3. Ajoute un prix récurrent:
   - Montant: `7`
   - Devise: `EUR`
   - Période: `mensuelle`
4. Copie l'identifiant du prix. Il commence par `price_`.
5. Dans Vercel > Environment Variables, ajoute:

```text
STRIPE_PRICE_ID=price_xxxxxxxxx
```

6. Toujours dans Stripe, crée un webhook:

```text
Endpoint URL:
https://ton-url-vercel.app/api/stripe/webhook
```

7. Sélectionne ces événements:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_failed
```

8. Copie le secret du webhook. Il commence par `whsec_`.
9. Dans Vercel, ajoute:

```text
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx
```

10. Redéploie Vercel.

L'essai gratuit de 30 jours est créé par le code au moment du passage dans Stripe Checkout. Le paiement démarre ensuite automatiquement à 7 €/mois si l'utilisateur ne résilie pas.

## 3.3. Activer OpenAI

1. Va sur la plateforme OpenAI.
2. Crée une clé API serveur.
3. Dans Vercel, ajoute:

```text
OPENAI_API_KEY=sk-xxxxxxxxx
OPENAI_MODEL=gpt-4.1-mini
AI_MONTHLY_QUOTA=100
```

4. Redéploie Vercel.

L'application n'appelle jamais OpenAI depuis le navigateur. Les générations passent par `/api/ai/generate`, qui vérifie la connexion, l'abonnement Stripe et le quota.

## 3.1. Région Europe

Le fichier `vercel.json` force les fonctions serveur Vercel en Europe, région Paris:

```json
{
  "regions": ["cdg1"]
}
```

Sur le plan Hobby, Vercel accepte une seule région de fonctions. Paris (`cdg1`) est le meilleur choix pour des utilisateurs français.

Supabase doit aussi être en Europe. Dans Supabase, vérifie la région du projet dans les paramètres du projet. Si le projet actuel n'est pas en Europe, crée un nouveau projet Supabase en:

```text
Europe / Central EU (Frankfurt)
```

ou en région spécifique:

```text
West EU (Paris) eu-west-3
Central EU (Frankfurt) eu-central-1
West EU (Ireland) eu-west-1
```

Ensuite il faut relancer les migrations SQL dans ce nouveau projet et remplacer les variables Vercel par les nouvelles clés Supabase.

## 4. Configurer Supabase Auth

Dans Supabase > Authentication > URL Configuration:

```text
Site URL: https://ton-url-vercel.app
Redirect URLs:
https://ton-url-vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Garde `localhost` pour continuer à tester sur ton Mac.

## 5. Vérifier que le déploiement est vivant

Après le déploiement, ouvre:

```text
https://ton-url-vercel.app/api/health
```

Tu dois voir:

```json
{
  "status": "ok",
  "app": "NurseAI"
}
```

## 6. Vérifier le parcours utilisateur

Teste dans cet ordre:

1. Page d'accueil publique `/`.
2. Inscription.
3. Confirmation email si activée dans Supabase.
4. Connexion.
5. Dashboard sans fausse data.
6. Paramètres, puis activation du mode sombre.
7. Export RGPD.
8. Démarche de soins, fiches, doses, quiz, agenda.

## 7. Avant App Store / Play Store

Pour publier en stores, il faudra ensuite:

1. Stabiliser l'app web en production.
2. Ajouter PWA icons et splash screens.
3. Emballer l'app avec Capacitor ou React Native wrapper.
4. Ajouter un compte Apple Developer et Google Play Console.
5. Fournir confidentialité, support, conditions, captures d'écran et catégorie.
6. Vérifier que l'IA médicale reste présentée comme aide pédagogique, pas comme dispositif médical.

## 8. App Store: abonnement Apple obligatoire sur iPhone

Sur iPhone, un abonnement numérique doit passer par l'achat intégré Apple, pas par Stripe. Stripe reste utile pour le web, mais l'app iOS devra utiliser StoreKit.

### 8.1. Créer l'app dans App Store Connect

1. Va dans App Store Connect.
2. Clique sur `My Apps` puis `+`.
3. Choisis `New App`.
4. Remplis:
   - Nom: `NurseAI`
   - Plateforme: `iOS`
   - Bundle ID: `webfabricpro.NurseAI`
   - SKU: `nurseai-ios`
   - Langue principale: `Français`

Si le Bundle ID n'existe pas encore, crée-le d'abord dans Apple Developer > Certificates, Identifiers & Profiles > Identifiers.

### 8.2. Créer l'abonnement

Dans App Store Connect > NurseAI > Subscriptions:

1. Crée un groupe d'abonnements: `NurseAI Premium`.
2. Crée un abonnement auto-renouvelable:
   - Product ID: `premium_monthly`
   - Nom: `NurseAI Premium mensuel`
   - Prix: `7,00 € / mois`
3. Ajoute une offre d'introduction:
   - Type: `Free Trial`
   - Durée: `1 month`

Le `Product ID` doit rester exactement `premium_monthly`, sauf si tu changes aussi `APPLE_PREMIUM_PRODUCT_ID` dans Vercel et dans Xcode.

### 8.3. Synchroniser l'accès Premium

Le principe cible:

1. L'utilisateur crée son compte NurseAI.
2. Sur iPhone, l'app déclenche l'achat Apple avec StoreKit.
3. Apple valide l'essai gratuit d'un mois.
4. Le serveur NurseAI vérifie la transaction Apple.
5. Supabase met l'utilisateur en Premium.

Ne jamais débloquer le Premium uniquement depuis l'iPhone sans vérification serveur. Sinon quelqu'un pourrait modifier l'app ou simuler un achat.

### 8.4. Variables Apple serveur

Quand l'app et l'abonnement existent dans App Store Connect, ajoute ensuite dans Vercel:

```text
APPLE_BUNDLE_ID=webfabricpro.NurseAI
APPLE_PREMIUM_PRODUCT_ID=premium_monthly
APPLE_APP_STORE_CONNECT_ISSUER_ID=...
APPLE_APP_STORE_CONNECT_KEY_ID=...
APPLE_APP_STORE_CONNECT_PRIVATE_KEY=...
```

Les trois dernières valeurs viennent d'App Store Connect > Users and Access > Integrations > App Store Connect API.

### 8.5. Migration Supabase pour Apple

Avant d'activer StoreKit, lance dans Supabase SQL Editor le fichier:

```text
supabase/migrations/003_multiplatform_billing.sql
```

Cette migration ajoute les colonnes nécessaires pour suivre un abonnement Apple sans casser Stripe.
