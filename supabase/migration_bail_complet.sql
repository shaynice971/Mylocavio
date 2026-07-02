-- ============================================================
-- MyLocavio — Champs additionnels pour le contrat de bail complet
-- (conforme décret n°2015-587 du 29 mai 2015, annexe 1 / loi n°89-462)
-- ============================================================
-- Contexte : le contrat de bail généré doit couvrir les 10 rubriques
-- obligatoires du contrat-type "logement nu". Plusieurs informations
-- nécessaires n'existaient pas encore en base. Ce script est ADDITIF
-- (uniquement des ALTER TABLE ... ADD COLUMN IF NOT EXISTS) : aucune
-- colonne existante n'est modifiée ou supprimée, aucune donnée touchée.
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

-- ── Bailleur (profil) : domicile, nécessaire pour la désignation des parties.
alter table public.profiles add column if not exists adresse text;
alter table public.profiles add column if not exists code_postal text;
alter table public.profiles add column if not exists ville text;

-- ── Bien : caractéristiques persistantes du logement (indépendantes du bail).
alter table public.biens add column if not exists type_habitat text
  check (type_habitat in ('individuel', 'collectif'));
alter table public.biens add column if not exists regime_juridique text
  check (regime_juridique in ('copropriete', 'monopropriete'));
alter table public.biens add column if not exists dpe_classe text
  check (dpe_classe in ('A', 'B', 'C', 'D', 'E', 'F', 'G'));
alter table public.biens add column if not exists annexes text; -- cave, parking, jardin...
alter table public.biens add column if not exists equipements text; -- équipement du logement
alter table public.biens add column if not exists equipements_communs text; -- locaux/équipements à usage commun
alter table public.biens add column if not exists chauffage_type text
  check (chauffage_type in ('individuel', 'collectif'));
alter table public.biens add column if not exists eau_chaude_type text
  check (eau_chaude_type in ('individuel', 'collectif'));
alter table public.biens add column if not exists acces_technologies text; -- fibre, etc.

-- ── Bail : informations propres à ce contrat précis.
alter table public.baux add column if not exists mandataire_nom text;
alter table public.baux add column if not exists mandataire_adresse text;
alter table public.baux add column if not exists irl_trimestre_reference text; -- ex. "2e trimestre 2026"
alter table public.baux add column if not exists irl_valeur_reference numeric(8,2);
alter table public.baux add column if not exists dernier_loyer_precedent numeric(10,2); -- si vacance < 18 mois
alter table public.baux add column if not exists charges_type text
  check (charges_type in ('provisions', 'forfait')) default 'provisions';
alter table public.baux add column if not exists travaux_bailleur text; -- travaux depuis dernier contrat
alter table public.baux add column if not exists travaux_amelioration text; -- travaux d'amélioration décidés
alter table public.baux add column if not exists honoraires_locataire numeric(10,2);
alter table public.baux add column if not exists honoraires_bailleur numeric(10,2);
alter table public.baux add column if not exists colocataires_supplementaires text; -- noms des colocataires solidaires additionnels
alter table public.baux add column if not exists conditions_particulieres text;

comment on column public.baux.colocataires_supplementaires is
  'Noms des colocataires solidaires additionnels (au-delà du locataire principal enregistré). Champ texte libre : MyLocavio ne modélise pas encore la colocation de façon relationnelle.';
