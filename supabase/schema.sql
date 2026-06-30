-- ============================================================
-- MyLocavio — Schéma base de données
-- À exécuter dans Supabase : SQL Editor → New query → Run
-- ============================================================

-- Profils utilisateurs (lié à auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  prenom text,
  nom text,
  telephone text,
  plan text not null default 'gratuit' check (plan in ('gratuit', 'essentiel', 'pro', 'expert')),
  created_at timestamptz default now()
);

-- Biens immobiliers
create table if not exists public.biens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  adresse text not null,
  complement_adresse text,
  code_postal text not null,
  ville text not null,
  type text not null check (type in ('appartement', 'maison', 'studio', 'autre')),
  surface numeric(6,2),
  nb_pieces integer,
  loyer numeric(10,2) not null,
  charges numeric(10,2) default 0,
  depot_garantie numeric(10,2),
  statut text not null default 'loue' check (statut in ('loue', 'vacant', 'travaux')),
  created_at timestamptz default now()
);

-- Locataires
create table if not exists public.locataires (
  id uuid primary key default gen_random_uuid(),
  bien_id uuid references public.biens(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prenom text not null,
  nom text not null,
  email text,
  telephone text,
  date_entree date not null,
  date_sortie date,
  actif boolean default true,
  created_at timestamptz default now()
);

-- Baux
create table if not exists public.baux (
  id uuid primary key default gen_random_uuid(),
  bien_id uuid references public.biens(id) on delete cascade not null,
  locataire_id uuid references public.locataires(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('vide', 'meuble', 'mobilite')),
  date_debut date not null,
  date_fin date,
  loyer numeric(10,2) not null,
  charges numeric(10,2) default 0,
  depot_garantie numeric(10,2),
  pdf_url text,
  created_at timestamptz default now()
);

-- Quittances de loyer
create table if not exists public.quittances (
  id uuid primary key default gen_random_uuid(),
  bien_id uuid references public.biens(id) on delete cascade not null,
  locataire_id uuid references public.locataires(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mois date not null, -- premier jour du mois concerné
  loyer numeric(10,2) not null,
  charges numeric(10,2) default 0,
  total numeric(10,2) generated always as (loyer + charges) stored,
  statut text not null default 'generee' check (statut in ('generee', 'envoyee', 'payee')),
  pdf_url text,
  created_at timestamptz default now(),
  unique(locataire_id, mois)
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  bien_id uuid references public.biens(id) on delete set null,
  locataire_id uuid references public.locataires(id) on delete set null,
  type text not null check (type in ('avenant', 'conge_bailleur', 'conge_locataire', 'etat_des_lieux_entree', 'etat_des_lieux_sortie', 'autre')),
  nom text not null,
  pdf_url text,
  created_at timestamptz default now()
);

-- Relances loyers impayés
create table if not exists public.relances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  bien_id uuid references public.biens(id) on delete cascade not null,
  locataire_id uuid references public.locataires(id) on delete cascade not null,
  montant numeric(10,2) not null,
  mois date not null,
  nb_jours_retard integer default 0,
  statut text not null default 'en_retard' check (statut in ('en_retard', 'relance', 'regle')),
  date_relance timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.biens enable row level security;
alter table public.locataires enable row level security;
alter table public.baux enable row level security;
alter table public.quittances enable row level security;
alter table public.documents enable row level security;
alter table public.relances enable row level security;

-- Policies : chaque utilisateur ne voit que ses propres données

create policy "profiles: own data" on public.profiles
  for all using (auth.uid() = id);

create policy "biens: own data" on public.biens
  for all using (auth.uid() = user_id);

create policy "locataires: own data" on public.locataires
  for all using (auth.uid() = user_id);

create policy "baux: own data" on public.baux
  for all using (auth.uid() = user_id);

create policy "quittances: own data" on public.quittances
  for all using (auth.uid() = user_id);

create policy "documents: own data" on public.documents
  for all using (auth.uid() = user_id);

create policy "relances: own data" on public.relances
  for all using (auth.uid() = user_id);

-- ============================================================
-- Trigger : créer automatiquement un profil à l'inscription
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, prenom, nom)
  values (
    new.id,
    new.raw_user_meta_data->>'prenom',
    new.raw_user_meta_data->>'nom'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- À exécuter dans Supabase SQL Editor pour activer les états des lieux
-- ============================================================

create table if not exists public.etats_des_lieux (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  bien_id uuid references public.biens(id) on delete cascade not null,
  locataire_id uuid references public.locataires(id) on delete set null,
  type text not null check (type in ('entree', 'sortie')),
  date_etat date not null default current_date,
  pieces jsonb default '[]',
  observations text,
  created_at timestamptz default now()
);

alter table public.etats_des_lieux enable row level security;
create policy "etats_des_lieux: own data" on public.etats_des_lieux
  for all using (auth.uid() = user_id);
