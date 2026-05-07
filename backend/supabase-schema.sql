-- =========================================================================
-- xxxotic v1 — Supabase Postgres schema
-- =========================================================================
-- Run this in the Supabase SQL editor as the project's postgres owner.
-- Idempotent where reasonable: drops existing policies and triggers before
-- recreating them.
-- =========================================================================

-- Required extensions
create extension if not exists "pgcrypto";

-- =========================================================================
-- updated_at trigger helper
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- 1. profiles
--    Base record for every authenticated user. Mirrors auth.users.id.
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patron', 'dancer', 'owner', 'admin')),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 2. patron_profiles
-- =========================================================================
create table if not exists public.patron_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  city text,
  state text,
  interests text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_patron_profiles_updated_at on public.patron_profiles;
create trigger trg_patron_profiles_updated_at
  before update on public.patron_profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 3. dancer_profiles
-- =========================================================================
create table if not exists public.dancer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  slug text unique not null,
  stage_name text,
  bio text,
  city text,
  state text,
  location_label text,
  services text[] default '{}',
  offerings text[] default '{}',
  availability jsonb not null default '{}'::jsonb,
  venue_appearances jsonb not null default '[]'::jsonb,
  rating numeric,
  rating_count integer not null default 0,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_dancer_profiles_updated_at on public.dancer_profiles;
create trigger trg_dancer_profiles_updated_at
  before update on public.dancer_profiles
  for each row execute function public.set_updated_at();

create index if not exists idx_dancer_profiles_public on public.dancer_profiles(is_public);
create index if not exists idx_dancer_profiles_city on public.dancer_profiles(city);

-- =========================================================================
-- 4. owner_profiles
-- =========================================================================
create table if not exists public.owner_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  club_name text not null,
  business_address text not null,
  business_phone text not null,
  business_email text not null,
  selected_plan text check (selected_plan in ('starter', 'growth', 'premium')),
  website_or_instagram text,
  inquiry_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_owner_profiles_updated_at on public.owner_profiles;
create trigger trg_owner_profiles_updated_at
  before update on public.owner_profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 5. venues
-- =========================================================================
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  city text not null,
  state text not null,
  address text,
  instagram_url text,
  website_url text,
  map_query text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_venues_updated_at on public.venues;
create trigger trg_venues_updated_at
  before update on public.venues
  for each row execute function public.set_updated_at();

create index if not exists idx_venues_featured on public.venues(is_featured);
create index if not exists idx_venues_owner on public.venues(owner_id);

-- =========================================================================
-- 6. dancer_venues  (a dancer's appearances at a venue)
-- =========================================================================
create table if not exists public.dancer_venues (
  id uuid primary key default gen_random_uuid(),
  dancer_id uuid not null references public.dancer_profiles(id) on delete cascade,
  venue_id uuid not null references public.venues(id) on delete cascade,
  appearance_date date,
  start_time time,
  end_time time,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_dancer_venues_dancer on public.dancer_venues(dancer_id);
create index if not exists idx_dancer_venues_venue on public.dancer_venues(venue_id);

-- =========================================================================
-- 7. booking_requests
-- =========================================================================
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  patron_id uuid references public.profiles(id) on delete set null,
  dancer_id uuid not null references public.dancer_profiles(id) on delete cascade,
  venue_id uuid references public.venues(id) on delete set null,
  requested_date date,
  requested_time time,
  party_size integer,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_booking_requests_updated_at on public.booking_requests;
create trigger trg_booking_requests_updated_at
  before update on public.booking_requests
  for each row execute function public.set_updated_at();

create index if not exists idx_booking_requests_dancer on public.booking_requests(dancer_id);
create index if not exists idx_booking_requests_patron on public.booking_requests(patron_id);

-- =========================================================================
-- 8. inquiries  (non-account form submissions)
-- =========================================================================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  role text,
  name text,
  phone text,
  email text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_source on public.inquiries(source);

-- =========================================================================
-- 9. audit_events
-- =========================================================================
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_events_user on public.audit_events(user_id);

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.profiles          enable row level security;
alter table public.patron_profiles   enable row level security;
alter table public.dancer_profiles   enable row level security;
alter table public.owner_profiles    enable row level security;
alter table public.venues            enable row level security;
alter table public.dancer_venues     enable row level security;
alter table public.booking_requests  enable row level security;
alter table public.inquiries         enable row level security;
alter table public.audit_events      enable row level security;

-- ---- profiles ----
drop policy if exists profiles_self_read   on public.profiles;
drop policy if exists profiles_self_update on public.profiles;
drop policy if exists profiles_self_insert on public.profiles;

create policy profiles_self_insert on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy profiles_self_read on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- patron_profiles ----
drop policy if exists patron_self_insert on public.patron_profiles;
drop policy if exists patron_self_read   on public.patron_profiles;
drop policy if exists patron_self_update on public.patron_profiles;

create policy patron_self_insert on public.patron_profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy patron_self_read on public.patron_profiles
  for select to authenticated
  using (id = auth.uid());

create policy patron_self_update on public.patron_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- dancer_profiles ----
drop policy if exists dancer_public_read   on public.dancer_profiles;
drop policy if exists dancer_self_read     on public.dancer_profiles;
drop policy if exists dancer_self_insert   on public.dancer_profiles;
drop policy if exists dancer_self_update   on public.dancer_profiles;

-- Anyone (anon or authenticated) can read public dancer profiles.
create policy dancer_public_read on public.dancer_profiles
  for select to anon, authenticated
  using (is_public = true);

create policy dancer_self_read on public.dancer_profiles
  for select to authenticated
  using (id = auth.uid());

create policy dancer_self_insert on public.dancer_profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy dancer_self_update on public.dancer_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- owner_profiles ----
drop policy if exists owner_self_insert on public.owner_profiles;
drop policy if exists owner_self_read   on public.owner_profiles;
drop policy if exists owner_self_update on public.owner_profiles;

create policy owner_self_insert on public.owner_profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy owner_self_read on public.owner_profiles
  for select to authenticated
  using (id = auth.uid());

create policy owner_self_update on public.owner_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- venues ----
drop policy if exists venues_public_read   on public.venues;
drop policy if exists venues_owner_insert  on public.venues;
drop policy if exists venues_owner_update  on public.venues;

-- Featured venues are public; an owner can also see their own venues.
create policy venues_public_read on public.venues
  for select to anon, authenticated
  using (is_featured = true or owner_id = auth.uid());

create policy venues_owner_insert on public.venues
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy venues_owner_update on public.venues
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ---- dancer_venues ----
drop policy if exists dancer_venues_public_read on public.dancer_venues;
drop policy if exists dancer_venues_dancer_write on public.dancer_venues;

-- Public can read appearance rows that belong to a public dancer profile.
create policy dancer_venues_public_read on public.dancer_venues
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.dancer_profiles dp
      where dp.id = dancer_venues.dancer_id
        and (dp.is_public = true or dp.id = auth.uid())
    )
  );

create policy dancer_venues_dancer_write on public.dancer_venues
  for all to authenticated
  using (dancer_id = auth.uid())
  with check (dancer_id = auth.uid());

-- ---- booking_requests ----
drop policy if exists bookings_patron_insert  on public.booking_requests;
drop policy if exists bookings_party_read     on public.booking_requests;
drop policy if exists bookings_dancer_update  on public.booking_requests;
drop policy if exists bookings_patron_update  on public.booking_requests;

create policy bookings_patron_insert on public.booking_requests
  for insert to authenticated
  with check (patron_id = auth.uid());

-- A patron sees their own requests; the addressed dancer sees them too.
create policy bookings_party_read on public.booking_requests
  for select to authenticated
  using (patron_id = auth.uid() or dancer_id = auth.uid());

-- A dancer can update status (accept / decline / complete) of their incoming requests.
create policy bookings_dancer_update on public.booking_requests
  for update to authenticated
  using (dancer_id = auth.uid())
  with check (dancer_id = auth.uid());

-- A patron can cancel their own pending request.
create policy bookings_patron_update on public.booking_requests
  for update to authenticated
  using (patron_id = auth.uid())
  with check (patron_id = auth.uid());

-- ---- inquiries ----
drop policy if exists inquiries_anon_insert on public.inquiries;
drop policy if exists inquiries_auth_insert on public.inquiries;

create policy inquiries_anon_insert on public.inquiries
  for insert to anon
  with check (true);

create policy inquiries_auth_insert on public.inquiries
  for insert to authenticated
  with check (true);

-- No public select on inquiries (admins read via service role only).

-- ---- audit_events ----
drop policy if exists audit_self_insert on public.audit_events;

create policy audit_self_insert on public.audit_events
  for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);

-- No public select on audit_events.

-- =========================================================================
-- Done.
-- =========================================================================
