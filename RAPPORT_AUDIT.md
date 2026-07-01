# Rapport d'audit MyLocavio — session du 01/07/2026

Branche : `claude/mylocavio-audit-improvements-74qgek` (6 commits, non mergée sur `main`).
Ce rapport couvre l'audit technique/sécurité, la veille concurrentielle et les améliorations produit réalisées en autonomie. **Aucune clé n'a été exposée, aucune donnée supprimée, aucun déploiement production déclenché.**

---

## 0. Priorité absolue — thème visuel

Le dernier commit sur `main` avant cette session (`8f3e325`, puis mergé en `1a5d92d`) avait basculé **toutes** les pages vers un thème sombre (`#0A0E1A`), à l'encontre de l'identité voulue. C'est la première chose corrigée : fond blanc, accent `#2A9FD6`, police Inter, style flat/minimal restaurés sur les 22 fichiers concernés (pages, Sidebar, Logo, landing page). Vérifié visuellement (captures d'écran) sur connexion, inscription, dashboard landing, pages légales.

En reconvertissant, plusieurs bugs visuels introduits par le thème sombre ont été corrigés au passage : texte de bouton devenu illisible (texte sombre sur fond bleu/orange au lieu de blanc), placeholders invisibles (`placeholder-white` sur fond clair), contrastes de badges insuffisants, états `hover` qui éclaircissaient au survol au lieu d'assombrir.

---

## 1. Ce qui a été corrigé / amélioré (avec commits)

| # | Sujet | Commit |
|---|---|---|
| 1 | Thème clair rétabli + bug de build Vercel (voir §2) | `48a6abd` |
| 2 | Défense en profondeur API quittances PDF + bug upsert quittances + dead code BailPDF | `7aeafc2` |
| 3 | Pages légales, contact, export RGPD, demande de suppression de compte, 404/SEO | `df32b91` |
| 4 | **Bug critique** : création de bail cassée en production + validations formulaires | `ff95fcc` |
| 5 | Accessibilité formulaires (labels), petite optim requêtes | `59cc83b` |
| 6 | Messages d'erreur utilisateur en français, gestion confirmation email | `d84e817` |

### Détail des correctifs les plus importants

- **Bug critique création de bail (`ff95fcc`)** : le formulaire `baux/nouveau` insérait des colonnes `loyer_hc` et `duree_mois` qui n'existent pas dans le schéma Supabase (la colonne réelle s'appelle `loyer`, et `duree_mois` n'existe pas du tout). **Chaque tentative de création de bail échouait donc en production** avec une erreur PostgREST "column does not exist". Corrigé.
- **Cause probable du 404 Vercel** : `next build` échouait (exit code 1) car la page `/etats-des-lieux/nouveau` instanciait le client Supabase pendant le pré-rendu statique, sans variables d'environnement disponibles à cette étape. Ajout de `export const dynamic = "force-dynamic"` sur le layout du dashboard (les pages du tableau de bord ne doivent de toute façon jamais être mises en cache statiquement, puisqu'elles affichent des données propres à chaque utilisateur). Le build passe maintenant systématiquement (`npm run build` testé à répétition, exit 0).
- **Bug upsert quittances** : `genererQuittancesDuMois` utilisait `onConflict: "bien_id,locataire_id,mois"`, qui ne correspond à aucune contrainte unique réelle (`unique(locataire_id, mois)` dans le schéma). La génération mensuelle de quittances aurait échoué. Corrigé.
- **Défense en profondeur** : la route `api/quittances/[id]/pdf` ne vérifiait pas explicitement la propriété du document (elle reposait uniquement sur les RLS, qui sont bien configurées, mais sans double vérification comme le font les 2 autres routes PDF). Alignée sur le même pattern.
- **Validations ajoutées** (client + proposition serveur) : montants positifs (loyer, charges, dépôt de garantie), cohérence des dates de bail (`date_fin > date_debut`), durée du bail mobilité (1 à 10 mois) — avec messages d'erreur en français.
- **Accessibilité** : labels de formulaire désormais associés programmatiquement (`htmlFor`/`id`) sur biens (nouveau/modifier), baux/nouveau, révision IRL, ajout de locataire — ils n'étaient reliés que visuellement, un lecteur d'écran ne les annonçait pas. `aria-label` ajouté sur les interrupteurs de notifications.
- **Nouvelles pages** : Mentions légales, CGU, Politique de confidentialité (RGPD), Contact (fonctionnel, écrit dans une table `contact_messages`), 404 personnalisée, `robots.ts`/`sitemap.ts`, métadonnées enrichies (Open Graph, Twitter card, `theme-color`).
- **RGPD dans Paramètres** : export JSON de toutes les données utilisateur (biens, locataires, baux, quittances, relances, états des lieux), et demande de suppression de compte (écrit dans `account_deletion_requests` — la suppression réelle nécessite la clé `service_role`, jamais exposée côté client, voir §4).
- **Bandeau cookies** conforme CNIL (informatif : seuls des cookies strictement nécessaires sont utilisés, pas de tracking tiers — donc pas de consentement à recueillir légalement, mais transparence affichée).
- **Messages d'erreur** : plus aucun message technique brut (Postgres/Supabase, parfois en anglais) affiché à l'utilisateur — remplacés par des messages français non techniques (`src/lib/errors.ts`).
- **Inscription** : gère désormais le cas où la confirmation d'e-mail est activée sur le projet Supabase (l'ancien code redirigeait silencieusement vers `/dashboard`, qui renvoyait aussitôt vers `/connexion` sans explication).

---

## 2. Failles trouvées et leur statut

| Faille | Gravité | Statut |
|---|---|---|
| Thème sombre déployé par erreur sur `main` | Élevée (produit) | ✅ Corrigée |
| Build Vercel cassé (`next build` exit 1) → 404 probable | Critique | ✅ Corrigée |
| Création de bail impossible (colonnes inexistantes) | Critique | ✅ Corrigée |
| Génération de quittances mensuelle cassée (upsert invalide) | Élevée | ✅ Corrigée |
| Route PDF quittances sans double vérification de propriété | Faible (RLS déjà protégeait) | ✅ Corrigée |
| `.gitignore` n'excluait pas `.env` (seulement `.env*.local`) | Moyenne (préventif) | ✅ Corrigée |
| Exemple `.env.example` suggérant des clés Stripe **live** | Faible | ✅ Corrigée (passé en `sk_test_`) |
| Clés Stripe live "précédemment exposées" | **À vérifier en priorité** | ⚠️ Voir ci-dessous |
| RLS : pas de vérification que les FK (bien_id, locataire_id) appartiennent au même utilisateur à l'insertion | Faible (lecture déjà protégée) | 📋 Migration prête, à valider (`migration_hardening_rls.sql`) |
| Pas de contrainte serveur sur montants positifs / cohérence des dates | Faible | 📋 Migration prête, à valider (`migration_check_constraints.sql`) |
| Dépendances npm : 4 vulnérabilités **hautes** + 1 modérée (Next.js) | Élevée | ⚠️ Non corrigée — voir §4 |
| Contraste texte `#2A9FD6` sur fond blanc : 3,07:1 (AA exige 4,5:1 pour texte normal) | Faible/Moyenne | ⚠️ Signalée, décision design à prendre |
| Formulaires baux/révision IRL sans labels associés (accessibilité) | Faible | ✅ Corrigée |

### ⚠️ Clés Stripe — priorité absolue signalée

J'ai passé en revue **tout l'historique git** (tous les commits, tous les diffs) à la recherche de clés `sk_live_`, `pk_live_`, `whsec_`, ou de tout secret Supabase — **aucune clé réelle n'a été trouvée dans le dépôt**, ni dans les commits actuels ni passés. Seul `.env.example` contenait des valeurs `sk_live_...` de type placeholder (jamais une vraie clé), corrigées en `sk_test_...` par prudence.

**Cependant, je n'ai aucun accès aux dashboards Stripe ou Vercel** dans cet environnement. Si des clés ont été exposées ailleurs (capture d'écran partagée, collée dans un chat, variable d'environnement Vercel visible publiquement, etc.), je ne peux pas le vérifier depuis ce contexte. **Action requise de Melissa en priorité** : vérifier directement dans le dashboard Stripe qu'aucune clé live n'a fuité, et les régénérer par précaution si le moindre doute existe. De plus, **Stripe n'est pas du tout intégré dans le code actuel** (aucune dépendance `stripe` dans `package.json`, aucune route de paiement, aucun webhook) — le bouton "Changer de plan" dans Paramètres ne fait rien. Il n'y a donc aujourd'hui aucun webhook Stripe à auditer.

---

## 3. Veille concurrentielle

*(Synthèse complète également disponible séparément si besoin — voici l'essentiel)*

| Concurrent | Fonctionnalités clés | Pricing | Points forts | Points faibles |
|---|---|---|---|---|
| **Rentila** | Quittances, baux, EDL illimités (payant), signature électronique, synchro bancaire, comptabilité, IRL, assistant IA | Gratuit (1 bien) ; 4,90€/mois (2-5 biens) ; 9,90€/mois (illimité) | Interface intuitive, périmètre très large, excellent rapport qualité/prix | Support parfois lent, interface datée, synchro bancaire instable |
| **GérerSeul** | Bail multi-types, quittances, relances, gestion SCI, **aide déclaration fiscale pas à pas**, rapprochement bancaire | ~117€/an/bien (~9,75€/mois), -15% dès 3 biens | Support humain (conseillers/fiscalistes Paris), très bien noté (4,6-4,8/5) | Plus cher pour 1 seul bien, pas de vrai palier avant 3 biens |
| **BailFacile** | +70 modèles juridiques, signature illimitée incluse, EDL smartphone, espace locataire | 9,99 à 12,99€/mois/bien | Notoriété/avis très forts (4,6-4,7/5, milliers d'avis), couverture juridique complète | Pas de GLI, essai gratuit avec CB critiqué, résiliation jugée compliquée |
| **Smartloc** | Bail, quittances, IRL, **scoring locataire IA**, **GLI intégrée**, comptabilité LMNP en option | 7 à 20€/mois selon formule et nb de biens | Seul avec GLI native et scoring IA | Signature payante hors offre annuelle, interface froide, pas d'appli mobile |
| **Locat'me** | *Pas un concurrent direct* : marketplace de mise en relation locataire/propriétaire (matching), pas un outil de gestion locative | Non communiqué de façon fiable | Scoring/matching différenciant | Hors périmètre fonctionnel de MyLocavio |

**Fonctionnalités que la plupart ont et que MyLocavio n'a pas** : comptabilité/rapprochement bancaire, aide à la déclaration fiscale des revenus fonciers, signature électronique, espace locataire dédié, assurance loyers impayés (GLI), gestion multi-SCI, suivi des travaux, support humain, scoring de candidature locataire.

**3 axes de différenciation réalistes pour les primo-bailleurs (1-5 biens) :**
1. **Prix honnête et prévisible** : la plupart des concurrents facturent par bien avec des paliers qui grimpent vite, et des essais gratuits parfois perçus comme trompeurs (CB requise). Un plan gratuit réellement utilisable + un forfait simple (9€/19€ tout compris) est un vrai différenciateur.
2. **Un module fiscal ultra-simplifié** (récapitulatif micro-foncier/réel en 2 clics) : GérerSeul mise sur des conseillers humains chers et orientés pro/SCI ; personne ne fait un outil auto-guidé low-cost pour le néophyte total.
3. **Onboarding pensé pour le débutant absolu** : les avis récurrents montrent qu'aucun concurrent n'est nativement conçu pour un néophyte (interface "pro allégée" plutôt que pensée dès le départ pour un premier logement). Positionnement "Canva de la gestion locative".

---

## 4. Ce qui n'a pas pu être fait (et pourquoi)

**Accès manquant (nécessite une action de Melissa) :**
- Vérification directe des clés Stripe dans le dashboard Stripe (voir §2) — **priorité n°1 à traiter à son réveil**.
- Vérification des sauvegardes Supabase (Point-in-Time Recovery activé ou non) — accès dashboard Supabase requis.
- Vérification de la séparation des variables d'environnement dev/prod sur Vercel — accès dashboard Vercel requis.
- Vérification que la confirmation d'e-mail est bien activée dans les paramètres Auth de Supabase (le code gère maintenant les deux cas, mais je ne peux pas voir la configuration réelle du projet).
- Aucun outil de monitoring d'erreurs (Sentry ou équivalent) n'est configuré — je n'ai pas de compte/DSN à fournir ; nécessite une décision + une clé de la part de Melissa.
- Aucun service d'envoi d'e-mail transactionnel n'est configuré (pas de Resend/Postmark/SendGrid dans les dépendances) — donc **aucune notification email n'est envoyée** (quittance générée, relance envoyée, paiement) malgré les cases à cocher dans Paramètres qui le laissent penser (elles sont actuellement décoratives, non connectées). Nécessite le choix d'un fournisseur et une clé API.

**Risque trop élevé pour agir seul (listé pour décision) :**
- **Mise à jour majeure de Next.js** (14→16) pour corriger 4 vulnérabilités npm **hautes** (DoS, cache poisoning, contournement de middleware, XSS CSP). Aucun correctif non-cassant n'existe : toutes les versions 14.x sont concernées. La migration impose de changer la signature de `params`/`searchParams` (passage en `Promise`) sur une dizaine de pages, sans pouvoir la tester avec de vraies données Supabase dans cet environnement. Recommandé comme chantier dédié, testé, plutôt qu'un changement risqué en autonomie complète.
- **Durcissement RLS** (`migration_hardening_rls.sql`) et **contraintes CHECK** (`migration_check_constraints.sql`) : scripts SQL additifs préparés et prêts, mais je n'ai pas de connexion à la base Supabase réelle pour les exécuter moi-même, et une modification de policies RLS en production sans double vérification serait risquée. À exécuter par Melissa après relecture, idéalement sur un projet de test d'abord.
- **Suppression réelle de compte utilisateur** (RGPD) : j'ai implémenté la demande (table `account_deletion_requests`) mais pas l'exécution automatique, qui nécessite la clé `service_role` (jamais exposée côté client) pour appeler `auth.admin.deleteUser`. À mettre en place via une fonction serveur/tâche planifiée sécurisée, décision et configuration à faire par Melissa.
- **Contraste `#2A9FD6`** : mesuré à 3,07:1 sur fond blanc pour du texte normal (sous le seuil AA de 4,5:1), mais conforme au-dessus de 3:1 pour les gros textes/éléments d'UI. Assombrir légèrement la nuance utilisée spécifiquement pour le texte (ex. vers `#1a7aaa`/`#1a8ac4`) améliorerait l'accessibilité mais c'est un choix d'identité visuelle qui vous revient — je n'ai pas modifié la couleur de marque unilatéralement.
- **Tests interactifs complets des 8 écrans authentifiés** (dashboard, biens, quittances, relances, etc.) : impossibles sans identifiants Supabase réels dans cet environnement. J'ai vérifié par lecture de code, build TypeScript strict et lint (tous deux verts), et testé en conditions réelles ce qui l'était (pages publiques : 0 erreur console, responsive mobile/tablette sans débordement horizontal). Recommandation : un test manuel rapide de bout en bout par Melissa (créer un bien, un locataire, un bail, une quittance) validerait la remise en état.

**Non traité, hors scope de "corriger" (nécessite une décision produit) :**
- Les quittances sont générées automatiquement en masse le mois M sans confirmation qu'un paiement a réellement été reçu, alors que le texte du PDF affirme "je déclare avoir reçu la somme de...". C'est un point d'attention juridique potentiel (une quittance est censée prouver un paiement effectif) — à trancher : soit ajouter une étape de confirmation "loyer encaissé" avant génération, soit assumer ce fonctionnement en connaissance de cause.
- Les cases à cocher "Notifications" dans Paramètres et le bouton "Changer de plan" ne sont pas fonctionnels (décoratifs) — nécessitent respectivement un service email et une intégration Stripe complète.
- Les modèles "Avenant au bail / Congé bailleur / Congé locataire" dans Documents sont de simples vignettes non cliquables (pas de génération réelle).

---

## 5. Prochaines priorités suggérées — roadmap 12 semaines

**Semaines 1-2 — Fiabilisation (urgent)**
- Vérifier/régénérer les clés Stripe si doute, vérifier config Supabase Auth (confirmation email, sauvegardes), vérifier env vars Vercel dev/prod.
- Tester manuellement de bout en bout les 8 écrans avec un vrai compte (le bug de création de bail vient d'être corrigé, mais mérite une double vérification humaine).
- Exécuter (après relecture) `migration_check_constraints.sql` et évaluer `migration_hardening_rls.sql`.
- Mettre en place un outil de monitoring d'erreurs (Sentry gratuit suffit pour démarrer).

**Semaines 3-5 — Conformité et confiance**
- Compléter les mentions légales / CGU / confidentialité avec les vraies informations (SIRET, hébergement région UE Supabase, etc.) — actuellement des placeholders clairement marqués.
- Choisir un fournisseur d'e-mail transactionnel (Resend est simple et a un plan gratuit) et brancher les notifications réelles (quittance générée, relance envoyée) — attente forte du marché.
- Onboarding première connexion (check-list guidée "ajoutez votre premier bien").

**Semaines 6-9 — Différenciation produit**
- Module fiscal simplifié (récapitulatif micro-foncier en 2 clics) — axe de différenciation n°1 identifié en veille concurrentielle.
- Signature électronique des baux (a minima un partenariat/API tierce, ex. Yousign) — attendu par défaut sur le marché.
- Espace locataire en lecture seule (consulter ses quittances) — souvent cité comme un plus.

**Semaines 10-12 — Montée en gamme**
- Décision et implémentation Stripe (le pricing existe déjà côté landing page mais rien n'est branché).
- Migration Next.js 14→16 (chantier dédié et testé) pour clore les vulnérabilités npm hautes restantes.
- Évaluer une offre GLI/assurance en partenariat (différenciateur fort chez Smartloc).

---

*Rapport généré en autonomie. Toutes les modifications sont sur la branche `claude/mylocavio-audit-improvements-74qgek`, poussée sur le dépôt distant, non mergée sur `main`. `npm run build` et `npm run lint` passent tous les deux sans erreur au moment de la rédaction de ce rapport.*
