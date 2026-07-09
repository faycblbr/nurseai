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
STRIPE_SECRET_KEY=ta_cle_stripe_quand_le_paiement_est_pret
STRIPE_WEBHOOK_SECRET=ton_webhook_stripe_quand_pret
```

La clé `SUPABASE_SERVICE_ROLE_KEY` doit rester serveur uniquement. Elle ne doit jamais être utilisée dans un composant client.

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
