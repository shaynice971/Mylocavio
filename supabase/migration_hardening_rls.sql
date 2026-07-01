-- ============================================================
-- MyLocavio — Durcissement optionnel des policies RLS
-- ============================================================
-- Contexte (audit sécurité) :
-- Les policies actuelles ("for all using (auth.uid() = user_id)") empêchent
-- bien un utilisateur de LIRE les données d'un autre compte : c'est le point
-- le plus important et il est déjà correctement en place.
--
-- En revanche, elles ne vérifient pas que les clés étrangères insérées
-- (bien_id, locataire_id...) appartiennent réellement à l'utilisateur qui
-- écrit la ligne. Un utilisateur authentifié pourrait ainsi, via un appel
-- direct à l'API Supabase (en dehors de l'interface normale), insérer par
-- exemple une "quittance" avec son propre user_id mais un bien_id appartenant
-- à un autre compte. Cela ne permet PAS de lire les données de l'autre
-- compte (les policies de lecture sur "biens" s'appliquent toujours), mais
-- cela reste une incohérence de données à corriger par défense en profondeur.
--
-- Ce script est ADDITIF et NE SUPPRIME AUCUNE POLICY EXISTANTE tant qu'il
-- n'est pas exécuté. Il remplace les policies existantes par des versions
-- plus strictes. À FAIRE VALIDER ET EXÉCUTER PAR MELISSA après relecture,
-- idéalement d'abord testé sur un projet Supabase de staging.
-- ============================================================

drop policy if exists "locataires: own data" on public.locataires;
create policy "locataires: own data" on public.locataires
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.biens b where b.id = bien_id and b.user_id = auth.uid())
  );

drop policy if exists "baux: own data" on public.baux;
create policy "baux: own data" on public.baux
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.biens b where b.id = bien_id and b.user_id = auth.uid())
    and exists (select 1 from public.locataires l where l.id = locataire_id and l.user_id = auth.uid())
  );

drop policy if exists "quittances: own data" on public.quittances;
create policy "quittances: own data" on public.quittances
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.biens b where b.id = bien_id and b.user_id = auth.uid())
    and exists (select 1 from public.locataires l where l.id = locataire_id and l.user_id = auth.uid())
  );

drop policy if exists "relances: own data" on public.relances;
create policy "relances: own data" on public.relances
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.biens b where b.id = bien_id and b.user_id = auth.uid())
    and exists (select 1 from public.locataires l where l.id = locataire_id and l.user_id = auth.uid())
  );

drop policy if exists "etats_des_lieux: own data" on public.etats_des_lieux;
create policy "etats_des_lieux: own data" on public.etats_des_lieux
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.biens b where b.id = bien_id and b.user_id = auth.uid())
  );
