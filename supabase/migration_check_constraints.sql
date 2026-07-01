-- ============================================================
-- MyLocavio — Contraintes de validation serveur (montants positifs)
-- ============================================================
-- Contexte (audit) : les formulaires valident désormais côté client que les
-- loyers/charges/dépôts de garantie sont positifs, mais rien ne l'imposait
-- côté base de données. N'importe quel appel direct à l'API Supabase
-- (hors interface) pouvait donc insérer des montants négatifs.
--
-- Ce script est ADDITIF (ajout de contraintes, aucune donnée supprimée ou
-- modifiée) mais peut ÉCHOUER s'il existe déjà des lignes en violation
-- (montant négatif) — dans ce cas, corriger ces lignes avant de relancer.
-- Idempotent : peut être exécuté plusieurs fois sans erreur si une
-- contrainte existe déjà (PostgreSQL ne supporte pas
-- "ADD CONSTRAINT IF NOT EXISTS", d'où le bloc DO ci-dessous).
-- À FAIRE VALIDER ET EXÉCUTER PAR MELISSA.
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'biens_loyer_positive') then
    alter table public.biens add constraint biens_loyer_positive check (loyer >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'biens_charges_positive') then
    alter table public.biens add constraint biens_charges_positive check (charges >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'biens_depot_garantie_positive') then
    alter table public.biens add constraint biens_depot_garantie_positive check (depot_garantie is null or depot_garantie >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'biens_surface_positive') then
    alter table public.biens add constraint biens_surface_positive check (surface is null or surface > 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'baux_loyer_positive') then
    alter table public.baux add constraint baux_loyer_positive check (loyer >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'baux_charges_positive') then
    alter table public.baux add constraint baux_charges_positive check (charges >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'baux_depot_garantie_positive') then
    alter table public.baux add constraint baux_depot_garantie_positive check (depot_garantie is null or depot_garantie >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'baux_dates_coherentes') then
    alter table public.baux add constraint baux_dates_coherentes check (date_fin is null or date_fin > date_debut);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'quittances_loyer_positive') then
    alter table public.quittances add constraint quittances_loyer_positive check (loyer >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'quittances_charges_positive') then
    alter table public.quittances add constraint quittances_charges_positive check (charges >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'relances_montant_positive') then
    alter table public.relances add constraint relances_montant_positive check (montant >= 0);
  end if;
end $$;
