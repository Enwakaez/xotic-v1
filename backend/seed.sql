-- =========================================================================
-- xxxotic v1 — Seed data
-- =========================================================================
-- Run AFTER supabase-schema.sql has been applied.
--
-- IMPORTANT:
--   Auth users (sample_dancer@example.com, sample_patron@example.com) must
--   be created via the Supabase dashboard, the Auth admin API, or by
--   running the signup form in the app. They CANNOT be inserted directly
--   into auth.users from this script. See docs/testing-users.md.
--
--   After auth users exist, the matching profile rows below should be
--   inserted. Each block is wrapped in a guard that runs only if the auth
--   user already exists, so the script is safe to re-run.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. Featured Atlanta venues (public, no owner attached for MVP)
-- -------------------------------------------------------------------------
insert into public.venues (name, city, state, address, instagram_url, map_query, is_featured)
values
  ('Magic City',   'Atlanta', 'GA', null, 'https://www.instagram.com/magiccityatlanta/',  'Magic City Atlanta',           true),
  ('Pin Ups',      'Atlanta', 'GA', null, 'https://www.instagram.com/club_pinupsatl/',    'Pin Ups Atlanta',              true),
  ('Blue Flame',   'Atlanta', 'GA', null, 'https://www.instagram.com/BlueFlameLounge',    'Blue Flame Lounge Atlanta',    true),
  ('Strokers',     'Atlanta', 'GA', null, 'https://www.instagram.com/strokersclub',       'Strokers Club Atlanta',        true),
  ('Onyx Atlanta', 'Atlanta', 'GA', null, 'https://www.instagram.com/onyx_atlanta',       'Onyx Atlanta',                 true)
on conflict do nothing;

-- -------------------------------------------------------------------------
-- 2. sample_dancer  (auth user must exist first)
-- -------------------------------------------------------------------------
do $$
declare
  v_uid uuid;
begin
  select id into v_uid from auth.users where email = 'sample_dancer@example.com';
  if v_uid is null then
    raise notice 'sample_dancer@example.com is not in auth.users; create it via the Supabase dashboard first.';
    return;
  end if;

  insert into public.profiles (id, role, first_name, last_name, phone, email)
  values (v_uid, 'dancer', 'Sample', 'Dancer', '555-000-0001', 'sample_dancer@example.com')
  on conflict (id) do nothing;

  insert into public.dancer_profiles (
    id, slug, stage_name, bio, city, state, location_label,
    services, offerings, availability, is_public
  ) values (
    v_uid,
    'sample-dancer',
    'Sample Dancer',
    'Demo dancer profile used for QA and walkthroughs of the xxxotic platform.',
    'Atlanta',
    'GA',
    'Atlanta, GA',
    array['VIP booking', 'Private bottle service', 'Event appearances'],
    array['Floor shows', 'Group bookings', 'Venue appearances'],
    jsonb_build_object(
      'friday',   '9 PM - 2 AM',
      'saturday', '9 PM - 2 AM'
    ),
    true
  )
  on conflict (id) do nothing;
end $$;

-- -------------------------------------------------------------------------
-- 3. sample_patron  (auth user must exist first)
-- -------------------------------------------------------------------------
do $$
declare
  v_uid uuid;
begin
  select id into v_uid from auth.users where email = 'sample_patron@example.com';
  if v_uid is null then
    raise notice 'sample_patron@example.com is not in auth.users; create it via the Supabase dashboard first.';
    return;
  end if;

  insert into public.profiles (id, role, first_name, last_name, phone, email)
  values (v_uid, 'patron', 'Sample', 'Patron', '555-000-0002', 'sample_patron@example.com')
  on conflict (id) do nothing;

  insert into public.patron_profiles (id, city, state, interests)
  values (
    v_uid,
    'Atlanta',
    'GA',
    array['nightlife', 'VIP sections', 'bottle service']
  )
  on conflict (id) do nothing;
end $$;
