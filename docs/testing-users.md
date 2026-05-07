# docs/testing-users.md — Sample users for QA

Two sample accounts back the demo flows on `dancer-profile.html`,
`dashboard.html`, and the search/browse experience for patrons.

> **Important:** Supabase auth users live in `auth.users` and are
> created through the Supabase dashboard, the auth admin API, or the app's
> signup form. They cannot be inserted with plain SQL. The seed script
> (`backend/seed.sql`) only creates the matching profile rows after the
> auth users exist.

---

## Test users

| Email                          | Role   | Use for                                   |
| ------------------------------ | ------ | ----------------------------------------- |
| `sample_dancer@example.com`    | dancer | Public dancer profile + bookings inbox    |
| `sample_patron@example.com`    | patron | Browsing, searching, sending booking req. |

Pick a strong dev-only password and keep it out of source control. A
suggested local convention:

```
xxxoticDev2026!
```

Do **not** reuse this password in production or anywhere it overlaps
with personal credentials.

---

## How to create them

Pick the path that matches how you want to bootstrap the project.

### Option A — Supabase dashboard (easiest)

1. Open your Supabase project.
2. Authentication -> Users -> "Add user" -> "Create new user".
3. Email: `sample_dancer@example.com`.
   Password: your dev password.
   Auto-confirm: **on** (so you can log in without an email round-trip).
4. Repeat for `sample_patron@example.com`.
5. Run `backend/seed.sql` again. The `do $$ ... $$` blocks now find the
   matching auth users and insert the profile + role-specific rows.

### Option B — Sign up through the app

1. Make sure `js/config.js` has real Supabase URL + anon key.
2. Open `signup.html?role=dancer`. Create the account using
   `sample_dancer@example.com`.
3. Open `signup.html?role=patron`. Create the account using
   `sample_patron@example.com`.
4. (Optional) Run `backend/seed.sql` to upgrade the auto-created sample
   dancer profile with the canonical demo bio / services / availability.

### Option C — Auth admin API (CI / scripts)

```bash
curl -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sample_dancer@example.com",
    "password": "<your-dev-password>",
    "email_confirm": true,
    "user_metadata": { "role": "dancer" }
  }'
```

> Use the **service role** key for admin endpoints. Never put the service
> role key into the browser, into git, or into `js/config.js`.

---

## What the sample profiles contain

After the auth users exist and `backend/seed.sql` has been re-run:

`profiles` has two rows:

```
sample_dancer  -> role=dancer, first_name=Sample, last_name=Dancer, ...
sample_patron  -> role=patron, first_name=Sample, last_name=Patron, ...
```

`dancer_profiles` has:

```
id              = sample_dancer.id
slug            = sample-dancer
stage_name      = Sample Dancer
city / state    = Atlanta / GA
services        = [VIP booking, Private bottle service, Event appearances]
offerings       = [Floor shows, Group bookings, Venue appearances]
availability    = { "friday": "9 PM - 2 AM", "saturday": "9 PM - 2 AM" }
is_public       = true
```

`patron_profiles` has:

```
id              = sample_patron.id
city / state    = Atlanta / GA
interests       = [nightlife, VIP sections, bottle service]
```

---

## Verifying

After creation, check:

- [ ] `dancer-profile.html?slug=sample-dancer` renders the demo dancer.
- [ ] Logging in as `sample_dancer` and visiting `dashboard.html` shows
      the dancer view with public profile, copy-link, visibility toggle,
      and inbound booking inbox.
- [ ] Logging in as `sample_patron` and visiting
      `dancer-profile.html?slug=sample-dancer` shows a booking form.
- [ ] Submitting that form creates a row in `booking_requests` that the
      sample dancer can see in their dashboard.

---

## Cleanup

Delete sample users from the Supabase dashboard (Auth -> Users) when
they're no longer needed. The `on delete cascade` on `profiles` removes
the linked patron / dancer rows automatically.
