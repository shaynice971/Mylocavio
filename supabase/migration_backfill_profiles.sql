-- ============================================================
-- MyLocavio — Rattrapage des profils manquants (cause racine du bug
-- "impossible d'ajouter un bien")
-- ============================================================
-- Contexte (audit) : toutes les tables applicatives (biens, locataires,
-- baux, quittances, documents, relances, etats_des_lieux...) référencent
-- `public.profiles(id)` en clé étrangère. Un profil n'est créé que par le
-- trigger `on_auth_user_created` au moment de l'INSERT dans `auth.users`.
--
-- Si un compte a été créé AVANT que ce trigger n'existe (ou n'ait été
-- correctement appliqué), ou si le trigger a échoué silencieusement pour
-- une raison quelconque, ce compte n'a PAS de ligne dans `public.profiles`.
-- Toute tentative d'ajouter un bien (ou un locataire, un bail, etc.) pour
-- ce compte échoue alors avec :
--   ERROR: insert or update on table "biens" violates foreign key
--   constraint "biens_user_id_fkey"
--   DETAIL: Key is not present in table "profiles".
-- (reproduit et confirmé sur une instance PostgreSQL 16 de test, cf.
-- RAPPORT_AUDIT.md section BUG 2)
--
-- Ce script est ADDITIF : il ne fait qu'INSÉRER les profils manquants,
-- sans jamais toucher aux profils ou comptes existants. Sûr à exécuter
-- à tout moment, y compris plusieurs fois (idempotent).
-- ============================================================

insert into public.profiles (id, prenom, nom)
select
  u.id,
  u.raw_user_meta_data->>'prenom',
  u.raw_user_meta_data->>'nom'
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
