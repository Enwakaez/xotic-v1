# Backend — Supabase setup

This folder contains everything needed to bring up the xxxotic v1 backend.
The MVP backend is **Supabase** (Postgres + Auth + Storage). The static
GoDaddy frontend talks to Supabase directly via the JS SDK.

---

## 1. Create a Supabase project

1. Sign up at https://supabase.com.
2. Create a new project. Pick a region close to your users.
3. Save your project URL and the **anon public key** (Settings → API).
   - The anon key is safe to ship in browser code.
   - The **service role** key is **not safe** for the browser. Do not
     paste it into `js/config.js`, do not commit it, do not share it.

---

## 2. Apply the schema

In the Supabase dashboard:

1. Open the SQL editor.
2. Paste the contents of `supabase-schema.sql` and run it.
3. Confirm RLS is enabled on every table (Database → Tables → click each).

The script is idempotent and can be re-run safely.

---

## 3. Seed data

`seed.sql` inserts the five featured Atlanta venues and the rows that back
the sample dancer / patron profiles.

> **Auth users are created separately** — see `docs/testing-users.md`.
> The seed script will skip the sample profile blocks until the matching
> rows exist in `auth.users`.

Once the auth users exist:

1. Open the SQL editor.
2. Paste `seed.sql` and run it.
3. The script logs a notice if the sample auth users haven't been created
   yet.

---

## 4. Wire the frontend

1. Open `js/config.js`.
2. Replace:
   ```js
   const SUPABASE_URL = "REPLACE_WITH_SUPABASE_URL";
   const SUPABASE_ANON_KEY = "REPLACE_WITH_SUPABASE_ANON_KEY";
   ```
   with your real values.
3. Reload the site. Signup, login, dashboard, and dancer-profile pages now
   talk to your Supabase project.

When `js/config.js` still holds the placeholders, the auth-aware pages
display a clear "Backend not configured" banner and disable submission so
nothing is silently lost.

---

## 5. Storage (for future profile / venue images)

Create three buckets in Supabase Storage. Public read, authenticated write:

- `dancer-photos`
- `venue-photos`
- `event-photos`

Add per-bucket policies once image upload is implemented in a later
phase. Image upload is intentionally **not** part of this MVP.

---

## 6. Schema reference (high level)

| Table              | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `profiles`         | Base account row, one per auth user, with role + contact fields     |
| `patron_profiles`  | Patron-specific extension (city, state, interests)                  |
| `dancer_profiles`  | Public-facing dancer details (slug, bio, services, availability…)   |
| `owner_profiles`   | Club owner business details + selected pricing plan                 |
| `venues`           | Clubs and lounges. Featured rows are public.                        |
| `dancer_venues`    | Many-to-many: which dancer appears at which venue, when             |
| `booking_requests` | Patron-initiated booking requests sent to a dancer                  |
| `inquiries`        | Generic non-account form submissions (waitlist, owner, ambassador…) |
| `audit_events`     | Lightweight event log (signup, profile_publish, booking_create…)    |

Every table has Row Level Security enabled. See `supabase-schema.sql` for
the full policy set; the short version:

- Users read/write **their own** rows.
- Public dancer profiles and featured venues are readable by anonymous
  clients.
- Booking requests are only visible to the patron who sent them and the
  dancer who received them.
- Inquiries can be inserted by anyone (anon or authenticated) but never
  read from the browser. Read them from the dashboard or via the service
  role key.

---

## 7. Local development checklist

- [ ] Project created
- [ ] `supabase-schema.sql` applied
- [ ] Featured venues seeded
- [ ] `sample_dancer@example.com` auth user created
- [ ] `sample_patron@example.com` auth user created
- [ ] `seed.sql` re-run (now creates the matching profile rows)
- [ ] `js/config.js` updated with real URL + anon key
- [ ] Tested: `signup.html`, `login.html`, `dashboard.html`,
      `dancer-profile.html?slug=sample-dancer`

---

## 8. Production hardening (later)

- Email confirmations on by default; tune your Supabase Auth email
  templates before launch.
- Add a custom SMTP provider so emails come from your domain.
- Rotate the anon key if it leaks.
- Add an `admin` role policy set on `inquiries` and `audit_events` once
  you have an admin UI.
