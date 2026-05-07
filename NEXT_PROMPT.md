# NEXT_PROMPT.md — Next planned activity

The registration / booking MVP is built. Code is in place for signup,
login, dashboards, public dancer profile, booking flow, edit-profile,
and Supabase-backed inquiries. The single remaining blocker is **a real
Supabase project**: until URL + anon key are pasted into `js/config.js`
and the schema is applied, every auth-aware page shows a "Backend not
configured" banner and disables submission.

The next session should bring up Supabase, paste credentials, run
end-to-end QA, and (in parallel) start replacing the placeholder
imagery.

Copy the prompt below and hand it to the next coding session.

---

## Prompt

```
You're picking up xxxotic v1 (vanilla HTML/CSS/JS marketing site +
Supabase MVP, deploying to GoDaddy). Read AGENTS.md, README.md, and
backend/README.md first.

Current state:
  - 21 HTML pages all return 200 on http://localhost:3000.
  - js/config.js, js/api.js, js/auth.js wire signup, login, dashboard,
    dancer-profile, edit-profile, and the inquiries table.
  - backend/supabase-schema.sql defines 9 tables with full RLS.
  - backend/seed.sql seeds featured Atlanta venues and the
    sample_dancer / sample_patron profile rows (after their auth users
    exist).
  - js/config.js still holds REPLACE_WITH_... placeholders, so every
    auth-aware page is gated behind a "Backend not configured" banner.

Do these in order.

==========================================
PART 1 — Stand up the Supabase project
==========================================

1. Create a new Supabase project. Save URL + anon key + service-role
   key in your password manager. Do NOT commit any of them.

2. In the Supabase SQL editor, paste and run
   backend/supabase-schema.sql. Confirm RLS is enabled on every table.

3. Paste and run backend/seed.sql. The featured venues should appear
   in the venues table; the sample-profile blocks will log a notice
   because the auth users don't exist yet.

4. Create the two sample auth users via the Supabase dashboard
   (Auth -> Users -> Add user) using the emails from
   docs/testing-users.md. Auto-confirm them so you can log in without
   email round-trips.

5. Re-run backend/seed.sql. Confirm the sample profile + role rows
   are now created.

6. Open js/config.js and paste in the real SUPABASE_URL + anon key.
   The config banner should disappear from every page.

==========================================
PART 2 — End-to-end QA
==========================================

Run python -m http.server 3000 from the repo root. For each scenario,
exercise the UI in a real browser and log any issues.

Scenarios:

  1. Sign up as a NEW patron at signup.html?role=patron. Confirm the
     dashboard renders the patron view with search + booking history.

  2. Sign up as a NEW dancer at signup.html?role=dancer. Confirm the
     dashboard shows copy-link, public toggle (off by default), and
     the profile-completeness checklist. Toggle public ON.

  3. Sign up as a NEW owner at signup.html?role=owner&plan=growth.
     Confirm the plan banner shows "Growth ($249/mo)" before submit
     and that the dashboard reflects the chosen plan.

  4. Edit profile for each role at edit-profile.html. Confirm changes
     persist after a hard reload.

  5. Log in as sample_patron. Visit dancer-profile.html?slug=sample-dancer.
     Submit a booking request. Confirm the patron's dashboard shows it
     under "Your Booking Requests" and sample_dancer's dashboard shows
     it as inbound. Accept it from the dancer side and confirm the
     status pill updates in both views.

  6. Test the share button on dancer-profile.html (Web Share or
     clipboard fallback).

  7. Test the locations page: search a different city, click "View on
     Map" on each venue card, confirm the iframe updates in-place,
     confirm Instagram links open in a new tab.

  8. Submit one inquiry from each of for-dancers, for-club-owners,
     for-patrons, brand-ambassador. Confirm rows land in the
     inquiries table.

  9. Mobile: re-run scenarios 1, 5, and 7 at 360px width.

For each issue found, document it (file + line + repro) before fixing.
After fixes, re-run the affected scenario.

==========================================
PART 3 — Imagery replacement (parallel work)
==========================================

ASSETS.md has the full plan. The biggest visual gaps:

  - dancers.html: six dancer cards all use the same Unsplash placeholder.
    Either commission a brand shoot or use distinct, licensed,
    nightlife-appropriate images. Do not use explicit imagery.

  - for-dancers.html / for-club-owners.html / for-patrons.html: hero
    illustrations or photos for each audience page.

  - blog.html, store.html, payment-processing.html, about.html: at
    least a hero image per page; about.html needs three team headshots
    for June, Wes, and Peggy.

Save local copies under assets/img/<page>/ and update each <img src>
in the HTML. Add license / source notes to ASSETS.md.

==========================================
Deliverables
==========================================

When done, report back with:
  - Whether each QA scenario passed or failed.
  - A list of bugs found + commit links to their fixes.
  - The image files added (paths + sources).
  - Updates to AGENTS.md (move completed items, add a new dated
    session-log entry).
  - A new NEXT_PROMPT.md. Likely candidates for the session after
    this one: web analytics + photo upload via Supabase Storage,
    or GoDaddy deploy + DNS / SSL.

==========================================
Out of scope for this session
==========================================
  - Adding a payment provider (Stripe / Square). Payment processing
    page stays informational.
  - Building admin tooling for inquiries; read them through the
    Supabase dashboard for now.
  - Migrating off Formspree (the inquiry handler already prefers
    Supabase; Formspree is the explicit fallback).
  - Legal review (separate engagement with an attorney).
```

---

## Why this is the right next step

1. **The MVP is code-complete but unverified.** Every Phase 1-12 item
   from the prior prompt is built; only Phase 13 (live QA) and Phase 14
   (post-session updates) require a working Supabase project to
   exercise.
2. **Imagery is the biggest visual quality gap.** Dancers.html ships
   with the same Unsplash placeholder six times — it's the most obvious
   "this isn't real" tell.
3. **Both can be done in one session.** Bringing up Supabase is a
   30-minute click-through. End-to-end QA is the bigger chunk but
   completes naturally as you walk every flow. Imagery can run in
   parallel with QA waits.

---

## After this is done

The follow-up prompt should likely be **GoDaddy deploy + DNS / SSL**,
plus turning on web analytics. By then the site will have:

- A live Supabase project,
- Verified registration / booking flows,
- Real imagery,
- An analytics snippet ready to drop in.

That's everything you need to make the public launch.
