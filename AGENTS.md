# AGENTS.md — Project Context & Session Log

**Last Updated:** 2026-05-07
**Project:** xxxotic v1 (Nightlife Platform — Marketing + Registration MVP)
**Repository:** https://github.com/Enwakaez/xotic-v1
**Current Branch:** feature/xotic-init

---

## Project Overview

**xxxotic** is a nightlife marketplace and coordination platform connecting
**dancers**, **club / lounge owners**, and **patrons**. The repo now ships
a registration / booking MVP on top of the marketing site, backed by
**Supabase** (Postgres + Auth + Storage). Vanilla HTML/CSS/JS, no build
step, deployable as a static bundle on GoDaddy.

**Status:** Marketing site + functional Auth + role-based dashboards +
public dancer profile + booking flow + edit-profile + Supabase-backed
inquiries + live featured-venues feed. Defensive degradation everywhere
when Supabase isn't yet configured.

---

## Site Map

```
xotic-v1/
|-- index.html                 # Landing
|-- dancers.html               # Roster (links to dancer-profile.html?id=...)
|-- dancer-profile.html        # Public dancer profile + booking form
|-- signup.html                # Role-aware signup -> Supabase Auth + profiles
|-- login.html                 # Email + password login
|-- dashboard.html             # Role-routed dashboard
|-- edit-profile.html          # Role-routed profile editor
|-- for-dancers.html           # Marketing + dancer inquiry form
|-- for-club-owners.html       # Marketing + owner inquiry form
|-- for-patrons.html           # Marketing + patron waitlist form
|-- pricing.html               # Owner plans (signup.html?role=owner&plan=...)
|-- locations.html             # Atlanta map + static cards + live Supabase feed
|-- help.html                  # Site help, FAQ, safety/HT resources
|-- download.html              # iOS / Android (waitlist for now)
|-- store.html                 # Apparel / Event Drops / Digital Products
|-- blog.html                  # Why each user group needs xxxotic
|-- payment-processing.html    # Planned payments feature page
|-- about.html                 # June / Wes / Peggy
|-- brand-ambassador.html      # Marketing + ambassador application
|-- terms.html                 # Draft Terms of Service
|-- privacy.html               # Draft Privacy Policy
|-- css/styles.css             # Single stylesheet (v1.2 additions appended)
|-- js/
|   |-- config.js              # Supabase URL + anon key + global client
|   |-- api.js                 # DB helpers (profiles, dancers, bookings, ...)
|   |-- auth.js                # Auth + signup helpers + config banner
|   `-- main.js                # Nav, dropdown, carousel, forms, maps
|-- backend/
|   |-- supabase-schema.sql    # Full schema + RLS + triggers
|   |-- seed.sql               # Featured venues + sample profile rows
|   `-- README.md              # Supabase walk-through
|-- docs/
|   `-- testing-users.md       # sample_dancer + sample_patron walkthrough
|-- assets/img/                # Empty — placeholder
|-- ASSETS.md
|-- README.md
|-- AGENTS.md                  # THIS FILE
`-- NEXT_PROMPT.md
```

---

## Done So Far

### Marketing site polish (Phase 1)
- [x] Store page: ACCESSORIES card removed, layout rebalanced to 3 cards
- [x] Homepage 3-step copy updated: dancers add photos+availability+location;
      owners set up venue details; patrons "name, phone number, and email"
      (no photo)
- [x] Atlanta venue Instagram handles wired everywhere
      (homepage carousel + locations cards):
      - Magic City -> @magiccityatlanta
      - Pin Ups -> @club_pinupsatl
      - Blue Flame -> @BlueFlameLounge
      - Strokers -> @strokersclub
      - Onyx Atlanta -> @onyx_atlanta
- [x] Roster BOOK buttons -> `dancer-profile.html?id={daisy|tina|onyx|icy|star|lucy}`
- [x] All "Official handle pending" placeholders gone

### Backend (Phase 2-3)
- [x] `backend/supabase-schema.sql` — 9 tables, indexes, updated_at
      triggers, RLS policies for every role
- [x] `backend/seed.sql` — featured venues + guarded blocks for the
      sample_dancer / sample_patron profile rows
- [x] `backend/README.md` — full Supabase walkthrough
- [x] `docs/testing-users.md` — three ways to create the sample auth users

### JS app layer (Phase 2/4)
- [x] `js/config.js` — SUPABASE_URL + SUPABASE_ANON_KEY placeholders;
      auto-creates client when configured
- [x] `js/api.js` — wrappers for profile, patron/dancer/owner profile,
      venues, dancer venues, booking_requests, inquiries, audit_events
- [x] `js/auth.js` — getSession, getCurrentUser, requireSession,
      signIn, signOut, signUpWithProfile (role-aware signup that creates
      auth user + base profile + role-specific row), slug generator,
      renderConfigBanner
- [x] Updated `js/main.js`: inquiry forms now insert into the
      `inquiries` table when Supabase is configured, fall back to
      Formspree otherwise

### Auth + dashboards (Phase 4-5)
- [x] `signup.html` — role-aware required fields, password + confirm,
      `?role=` and `?plan=` URL params, plan banner, Supabase signup
      via `auth.signUpWithProfile`, redirect to dashboard
- [x] `login.html` — email + password, redirects to dashboard,
      auto-bounces logged-in users straight through
- [x] `dashboard.html` — role-routed shell with patron / dancer / owner
      views. Patron view has search + browse + booking history. Dancer
      view has copy-link, public toggle, profile-completeness checklist,
      and inbound booking inbox with accept/decline actions. Owner view
      shows venue info + selected plan.

### Profiles + booking (Phase 6-7)
- [x] `dancer-profile.html` — fetches public dancer by slug or id,
      static placeholder fallback for the 6 roster dancers, Web Share
      API + clipboard fallback, full booking form with role-aware gating
      (logged out / wrong role / patron)
- [x] `edit-profile.html` — role-routed editor: patron (city/state/
      interests), dancer (stage name, bio, services, offerings,
      availability JSON, venue appearances, public toggle), owner
      (club name, business address/phone/email, website, plan,
      inquiry message)

### Locations (Phase 8)
- [x] Live Supabase feed of featured venues with static cards as
      fallback; "View on Map" buttons update the iframe in-place

### Pricing (Phase 9)
- [x] Already had `signup.html?role=owner&plan=...` CTAs; signup now
      reads and stores `selected_plan` in `owner_profiles`

### Inquiry backend (Phase 10)
- [x] All four inquiry pages (for-dancers, for-club-owners, for-patrons,
      brand-ambassador) load `js/config.js` + `js/api.js`; main.js
      submits to `inquiries` table when configured, Formspree otherwise

### CSS (Phase 11/12)
- [x] v1.2 styles appended: config banner, plan banner, store 3-grid,
      dashboard header / cards / checklist / search results, booking
      list + status pills, info grid, profile sections, booking gate,
      venue social link, role badges, role-card selected state

### Docs (Phase 11)
- [x] README.md rewritten: overview, MVP capabilities, tech stack, local
      setup, Supabase setup, Mermaid architecture diagram, all data
      flows (registration, login, dashboard, booking, sharing, owner,
      inquiries), project structure, data model table, GoDaddy
      deployment, security notes, legal notes, remaining work

### QA (Phase 13, partial)
- [x] All 21 HTML pages return 200 over `python -m http.server 3000`
- [x] CSS, JS, backend SQL, and docs files all serve 200
- [x] No "ACCESSORIES" copy left in `store.html`
- [x] No "Official handle pending" copy left in `index.html` or
      `locations.html`
- [x] No "Patrons: ... photo" copy left in `index.html`
- [x] Roster shows 6 `dancer-profile.html?id=` links
- [x] All 5 Atlanta IG handles render in the carousel
- [x] All 4 inquiry pages load Supabase scripts
- [x] `signup.html` loads Supabase scripts
- [ ] **Manual browser QA** — pending real Supabase project (see below)

---

## Remaining Work

### A. Concrete dev work
- [ ] Verify the full registration flow against a live Supabase project:
      sign up as patron, dancer, and owner; confirm rows in `profiles`
      + role-specific tables; confirm dashboard renders.
- [ ] Verify booking end-to-end: sample_patron books sample_dancer,
      both dashboards reflect the request, dancer accepts/declines.
- [ ] Replace dancer roster placeholder photos and add hero / feature
      imagery (see `ASSETS.md`).
- [ ] Add web analytics (GA4, Plausible, or Fathom).
- [ ] Profile / venue photo upload via Supabase Storage (the schema is
      ready; add UI + bucket policies).

### B. Stakeholder / research input
- [ ] **App Store / Google Play URLs** — set `APP_STORE_URL` and
      `GOOGLE_PLAY_URL` at the top of `js/main.js` once published.
- [ ] **Pricing values** — confirm or replace $99 / $249 / $499.
- [ ] **xxxotic social media URLs** — footer SVG icons currently route
      to `#`.
- [ ] **Mailing address** for `terms.html` / `privacy.html`.
- [ ] **National Human Trafficking Hotline** — current "Get Help"
      button opens a search; replace with a verified hotline number/URL
      if desired.
- [ ] **Real venue partnership confirmations** before using venue
      photography on `locations.html`.
- [ ] **Real performer permission + signed model release** before using
      named performer photography on `dancers.html`.

### C. External services / governance
- [ ] **Create the Supabase project** and apply
      `backend/supabase-schema.sql` and `backend/seed.sql`.
- [ ] **Create sample auth users** per `docs/testing-users.md`.
- [ ] **Paste real Supabase URL + anon key into `js/config.js`.**
- [ ] **Legal review** of `terms.html` and `privacy.html`.
- [ ] **Set up form-mail forwarding** in Supabase (or webhook -> email).
- [ ] **Add Storage buckets**: `dancer-photos`, `venue-photos`,
      `event-photos` with appropriate policies.
- [ ] **Deploy to GoDaddy** static hosting.
- [ ] **DNS + SSL** — confirm domain points at GoDaddy hosting with a
      valid certificate.

### Issues
- The `feature-icon` Unicode glyphs render with mixed widths across
  OSes. Replace with consistent inline SVGs in a polish pass.
- Footer social SVGs are in place but the links still point to `#`
  until verified xxxotic social URLs are supplied.

---

## Tech Stack

- HTML5 (semantic, no build step)
- CSS3 (custom properties, grid + flexbox, `clamp()` typography, no
  framework)
- Vanilla JavaScript, zero npm dependencies
- Supabase (Postgres + Auth + Storage), loaded via `@supabase/supabase-js@2`
  CDN script
- Google Fonts: Montserrat + Pacifico
- Maps: public Google Maps embed URL (no API key)

---

## Session Log

### 2026-05-07 — Registration / booking MVP

- **Created** `js/config.js`, `js/api.js`, `js/auth.js` for the Supabase
  integration. `auth.signUpWithProfile` performs the full role-aware
  signup in one call (auth user -> base profile -> role profile).
- **Created** `backend/supabase-schema.sql` with 9 tables, RLS policies
  for every role, and an `updated_at` trigger function.
- **Created** `backend/seed.sql` with featured Atlanta venues and
  guarded sample-profile inserts.
- **Created** `backend/README.md` and `docs/testing-users.md`.
- **Created** `login.html`, `dashboard.html` (role-routed),
  `dancer-profile.html` (slug + id lookup, Web Share, booking form),
  `edit-profile.html` (per role).
- **Updated** `signup.html` to be Supabase-backed: role-aware fields,
  password + confirm, plan capture (`?plan=`), success redirect.
- **Updated** `js/main.js` so the static-form handler submits inquiries
  to Supabase when configured, with Formspree as fallback.
- **Updated** `for-dancers.html`, `for-club-owners.html`,
  `for-patrons.html`, `brand-ambassador.html` to load Supabase + config
  + api scripts.
- **Updated** `locations.html`: replaced "Official handle pending" with
  real Atlanta IG links, switched "View on Map" anchors to
  `data-map-query` buttons that update the iframe in-place, added live
  Supabase featured-venues feed (with the static cards as fallback).
- **Updated** `index.html`: carousel now shows real Atlanta IG handles;
  homepage 3-step "CREATE YOUR PROFILE" copy updated for dancers/owners
  /patrons.
- **Updated** `dancers.html`: 6 BOOK buttons now link to
  `dancer-profile.html?id={daisy|tina|onyx|icy|star|lucy}`.
- **Updated** `store.html`: removed ACCESSORIES card, switched grid to
  `feature-grid feature-grid-3` for a balanced 3-up layout.
- **Updated** `css/styles.css` with v1.2 styles: config-banner,
  plan-banner, dashboard layout, booking pills, info grid, profile
  sections, booking gate, role-badge variants, store 3-grid override,
  venue social link.
- **Updated** `README.md` with full Mermaid diagram, every data flow,
  project structure, data model, GoDaddy deploy notes, and security
  guidance.
- **Verified** via `http://localhost:3000`: all 21 HTML pages return
  200; CSS/JS/backend assets serve; no leftover "ACCESSORIES",
  "Official handle pending", or "Patrons: ... photo" copy; 5 Atlanta
  IG handles render in carousel; 6 dancer-profile links on roster;
  all 5 forms (signup + 4 inquiries) load Supabase scripts.
- **Blocked**: Manual browser QA against a live Supabase project
  hasn't been run because no Supabase credentials are wired yet.

### 2026-05-06 — Full marketing site build + QA polish

- 15 new HTML pages, shared nav/footer, 5 Formspree-ready forms, SVG
  social icons, mobile drawer, carousel polish, full v1.1 CSS pass,
  drafts of Terms + Privacy. (See prior session log entry.)

### 2026-05-05 — Earlier session

- Added Lucy dancer card; created original AGENTS.md.

---

## Suggested commit message

```
Build registration backend, role dashboards, and booking MVP
```

---

## Instructions for Agents

> After every meaningful session in this project:
> 1. Update **Last Updated** at the top.
> 2. Move items from **Remaining Work** to **Done So Far** as they ship.
> 3. Add a dated session-log entry with files changed + summary.
> 4. Update placeholders / next-steps if priorities shifted.
> 5. If the next planned activity changes, rewrite `NEXT_PROMPT.md`.
> 6. Commit with a concise message describing the work.
