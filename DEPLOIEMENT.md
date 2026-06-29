# Déploiement sur Vercel

## Étapes

1. Aller sur [vercel.com](https://vercel.com) → "Add New Project"
2. Importer le repo GitHub `shaynice971/mylocavio`
3. Framework: Next.js (détecté automatiquement)
4. Ajouter les variables d'environnement suivantes dans Vercel → Settings → Environment Variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Cliquer "Deploy"

## Variables d'environnement requises

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |

## Domaine personnalisé

Dans Vercel → Settings → Domains → ajouter votre domaine.

## Après déploiement

Dans Supabase → Authentication → URL Configuration :
- Site URL : `https://votre-domaine.vercel.app`
- Redirect URLs : `https://votre-domaine.vercel.app/**`
