-- ============================================================
-- MyLocavio — Correction "permission denied for table ..."
-- ============================================================
-- Cause racine confirmée : supabase/schema.sql ne contenait aucune
-- instruction GRANT. Sur Supabase, quand une table est créée via l'éditeur
-- SQL (au lieu de l'interface Table Editor), les rôles "anon" et
-- "authenticated" n'obtiennent AUTOMATIQUEMENT AUCUN droit de base
-- (SELECT/INSERT/UPDATE/DELETE) sur cette table, même si RLS est activé et
-- que des policies existent. Les policies RLS et les GRANT sont deux
-- mécanismes DIFFÉRENTS et COMPLÉMENTAIRES : RLS filtre QUELLES LIGNES sont
-- visibles/modifiables, GRANT autorise ou non l'ACCÈS À LA TABLE elle-même.
-- Sans GRANT, Postgres refuse la requête avant même de regarder les
-- policies, avec l'erreur "permission denied for table biens".
--
-- Ce script est ADDITIF et SANS RISQUE : il ne fait qu'ajouter des droits
-- d'accès, il ne touche à aucune donnée, aucune table, aucune policy
-- existante. Il peut être exécuté plusieurs fois sans problème (idempotent).
-- ============================================================

-- 1) Droit d'utiliser le schéma public (normalement déjà présent par défaut
--    sur Supabase, mais sans risque de le répéter).
grant usage on schema public to anon, authenticated;

-- 2) Droits de base sur toutes les tables applicatives pour les utilisateurs
--    connectés. Les policies RLS restent seules responsables de restreindre
--    l'accès aux données de CHAQUE utilisateur à ses propres lignes.
grant select, insert, update, delete on table public.profiles           to authenticated;
grant select, insert, update, delete on table public.biens              to authenticated;
grant select, insert, update, delete on table public.locataires         to authenticated;
grant select, insert, update, delete on table public.baux               to authenticated;
grant select, insert, update, delete on table public.quittances         to authenticated;
grant select, insert, update, delete on table public.documents          to authenticated;
grant select, insert, update, delete on table public.relances           to authenticated;
grant select, insert, update, delete on table public.etats_des_lieux    to authenticated;
grant select, insert, update, delete on table public.account_deletion_requests to authenticated;

-- 3) Table de contact : formulaire public, un visiteur non connecté doit
--    pouvoir envoyer un message (le rôle "anon" correspond à un visiteur
--    non authentifié). Cohérent avec la policy RLS déjà en place qui
--    n'autorise que l'INSERT pour anon/authenticated, jamais la lecture.
grant insert on table public.contact_messages to anon, authenticated;
grant select on table public.contact_messages to authenticated;

-- 4) Pour que les PROCHAINES tables créées par le même utilisateur SQL
--    obtiennent automatiquement ces mêmes droits sans avoir à y repenser à
--    chaque fois (ne s'applique qu'aux tables créées après ce script).
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
