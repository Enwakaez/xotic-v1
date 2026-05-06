# AGENTS.md — Project Context & Session Log

**Last Updated:** 2026-05-06
**Project:** xxxotic v1 (Nightlife Entertainment Platform)
**Repository:** https://github.com/Enwakaez/xotic-v1
**Current Branch:** feature/xotic-init

---

## Project Overview

**xxxotic** is a nightlife marketplace and coordination platform connecting
**dancers**, **club / lounge owners**, and **patrons**. The MVP is a
dark-themed, responsive, static marketing site built with vanilla HTML, CSS,
and JavaScript — no build step, no framework, ready for static hosting on
GoDaddy.

**Status:** Full MVP marketing site (17 HTML pages) — landing + audience
pages, sign-up flow, pricing, locations w/ map, help + safety, blog,
payment processing, about, brand ambassador, store, download, terms, and
privacy. Functional but not production-ready (see [Remaining Work](#remaining-work)).

---

## Site Map

```
xotic-v1/
|-- index.html                 # Landing
|-- dancers.html               # Roster
|-- for-dancers.html           # Audience: dancers
|-- for-club-owners.html       # Audience: owners
|-- for-patrons.html           # Audience: patrons
|-- signup.html                # Universal sign-up (role from ?role=…)
|-- pricing.html               # Owner plans (placeholder pricing)
|-- locations.html             # Atlanta map + venue grid
|-- help.html                  # Site help, FAQ, safety/HT resources
|-- download.html              # iOS / Android (waitlist for now)
|-- store.html                 # Merch — coming soon
|-- blog.html                  # Why each user group needs xxxotic
|-- payment-processing.html    # Planned payments feature page
|-- about.html                 # June / Wes / Peggy
|-- brand-ambassador.html      # Ambassador application
|-- terms.html                 # Draft Terms of Service
|-- privacy.html               # Draft Privacy Policy
|-- css/styles.css             # Single stylesheet (v1.1 additions appended)
|-- js/main.js                 # Single script
|-- assets/img/                # Local image directory (empty — placeholder)
|-- ASSETS.md                  # Image source notes & replacement plan
|-- README.md                  # Original README (architecture diagram)
|-- AGENTS.md                  # THIS FILE
|-- NEXT_PROMPT.md             # Prompt for the next planned activity
```

---

## Done So Far

### Site infrastructure
- [x] 15 new HTML pages created (full site map above)
- [x] `index.html` and `dancers.html` updated to share the new nav + footer
- [x] Section IDs corrected on `index.html` (`for-barbers` → `for-dancers`,
      `for-clients` → `for-patrons`)
- [x] Header brand mark + footer brand mark both link to `index.html`
- [x] Footer rebalanced (removed Careers / Reviews / New Releases / Case
      Studies / Tax Prep / Service & Policy Calculators)

### Navigation
- [x] Top nav identical on every page
- [x] FEATURES dropdown supports hover, click, and keyboard
      (Enter / Space / arrows / Escape)
- [x] FEATURES dropdown items: For Dancers, For Club Owners, For Patrons,
      Meet the Roster, Payment Processing
- [x] Active nav highlighted by `data-page` / `data-nav` matching
- [x] Mobile hamburger menu working

### CTAs / button destinations
- [x] START TODAY / START FREE → `signup.html` (or `?role=…` variant)
- [x] HOW DANCERS WORKS → `for-dancers.html`
- [x] HOW OWNERS MANAGE → `for-club-owners.html`
- [x] HOW CLIENTS BOOK → `for-patrons.html`
- [x] App Store / Google Play buttons → `download.html` (placeholder
      destination); `APP_STORE_URL` / `GOOGLE_PLAY_URL` constants live at
      the top of `js/main.js` and rewrite every `[data-store]` element
      site-wide once real URLs are set
- [x] Footer Brand Ambassador / About / Blog / Store / Pricing / Terms /
      Privacy / Help / Locations / Download all route to real pages

### Carousel
- [x] Replaced barber Instagram handles with Atlanta venues
      (Magic City, Blue Flame, Onyx Atlanta, Pin Ups, Strokers)
- [x] Each venue tagged "Official handle pending" until verified
- [x] Auto-rotate, prev/next, indicator dots, ArrowLeft/Right keyboard,
      pause-on-hover

### Forms (static, validated)
- [x] Dancer application form on `for-dancers.html`
- [x] Owner inquiry form on `for-club-owners.html`
- [x] Patron waitlist on `for-patrons.html`
- [x] Universal sign-up on `signup.html` (owner-only fields toggle on
      `?role=owner`)
- [x] Ambassador application on `brand-ambassador.html`
- [x] Required fields, email + phone format checks, invalid-state styling,
      success message, fields reset on success
- [x] Visible "this isn't connected to a backend yet" notice on every form

### Pricing
- [x] Three owner-focused tiers: Starter $99/mo, Growth $249/mo (featured),
      Premium $499/mo
- [x] Visible "temporary for MVP planning" note

### Locations / map
- [x] Google Maps key-less embed (default: Atlanta nightlife)
- [x] City/state search input updates the iframe `src`
- [x] Featured venue cards (Magic City, Blue Flame, Onyx Atlanta, Pin Ups,
      Strokers) with per-venue "View on Map" links
- [x] All venue handles intentionally marked "Official handle pending"

### Help & safety
- [x] How to use the website (top-nav guide)
- [x] Where each role should start
- [x] FAQ accordion (`<details>` / `<summary>`)
- [x] Safety / human-trafficking section with warning signs, how to seek
      help, and a "Get Help" button that opens a search for the National
      Human Trafficking Hotline (so users always reach the most current
      verified contact info)

### Legal
- [x] Full draft Terms of Service (20 numbered sections)
- [x] Full draft Privacy Policy (16 numbered sections)
- [x] Both pages carry visible "have a qualified attorney review" notes

### CSS / accessibility
- [x] v1.1 styles appended for: page hero, feature grid, pricing cards,
      forms, FAQ, safety callout, map, venue grid, blog cards, download,
      team, legal docs, focus states, responsive overrides
- [x] `aria-expanded`, `aria-haspopup`, `role="menu"` on dropdown
- [x] Visible focus states on every interactive element
- [x] Required `alt` text on images, `aria-label` on icon buttons

### Docs
- [x] `ASSETS.md` documenting every external image and a per-page
      replacement plan
- [x] `assets/img/` directory created
- [x] `AGENTS.md` updated with full session log

---

## Remaining Work

Grouped by what kind of input each item needs.

### A. Concrete dev work (no external dependencies)
These can be implemented immediately by an AI/human developer in the repo.

- [ ] **Browser QA pass** — open every page at desktop / tablet / mobile
      breakpoints, click every link, submit every form, exercise the
      carousel + dropdown + map, fix anything visibly broken.
      *(This is the next planned activity — see `NEXT_PROMPT.md`.)*
- [ ] **Wire forms to a real backend** — Formspree, Netlify Forms, or a
      custom endpoint. Until this is done, no submissions reach anyone.
- [ ] **Add web analytics** — Google Analytics 4, Plausible, or Fathom
      snippet site-wide.
- [ ] **Add real social-icon SVGs** in the footer (currently text glyphs
      "YT / X / FB / IG / TT" — see [Issue: A.4](#issues)).
- [ ] **Replace dancer roster placeholder photos** — same Unsplash image
      is repeated 6 times on `dancers.html`.
- [ ] **Add hero / feature imagery** to `for-dancers.html`,
      `for-club-owners.html`, `for-patrons.html`, `blog.html`,
      `store.html`, `payment-processing.html`, and `about.html` (team
      headshots) — see `ASSETS.md`.

### B. Stakeholder / research input
These need someone (June, Wes, or Peggy) to confirm or supply values.

- [ ] **Atlanta venue Instagram / website handles** — verify and replace
      every "Official handle pending" on `index.html` (carousel) and
      `locations.html` (venue cards).
- [ ] **App Store / Google Play URLs** — once apps are published, set
      `APP_STORE_URL` and `GOOGLE_PLAY_URL` at the top of `js/main.js`.
- [ ] **Pricing values** — confirm or replace $99 / $249 / $499.
- [ ] **xxxotic social media URLs** — footer icons currently route to `#`.
- [ ] **Mailing address** for `terms.html` / `privacy.html`.
- [ ] **National Human Trafficking Hotline** — current "Get Help" button
      opens a search; replace with a verified hotline number/URL if
      desired.
- [ ] **Real venue permission** before using venue photography on
      `locations.html`.
- [ ] **Real performer permission + signed model release** before using
      named performer photography on `dancers.html`.

### C. External services / governance
- [ ] **Legal review** of `terms.html` and `privacy.html`.
- [ ] **Set up form backend account** (Formspree free plan or Netlify
      Forms — pick one before A.2).
- [ ] **Set up analytics account** before A.3.
- [ ] **Deploy to GoDaddy** static hosting.
- [ ] **DNS + SSL** — confirm the domain is pointed at GoDaddy hosting
      with a valid certificate.

### Issues
<a id="issues"></a>

1. **A.4** — The five footer social icons currently render as plain text
   ("YT", "X", "FB", "IG", "TT") inside the existing styled circles. Looks
   janky vs. the polish of the rest of the footer. Swap to inline SVG
   logos before launch.
2. The carousel indicator dots dim/bright transition relies on the
   `is-active` class on the dot inside the *active* slide; verify this
   visually in a browser since it depends on element ordering and isn't
   covered by automated tests.
3. The `feature-icon` Unicode glyphs render with mixed widths across OSes.
   In a polish pass, replace with consistent inline SVGs.

---

## Tech Stack

- HTML5 (semantic, no build step)
- CSS3 (custom properties, grid + flexbox, `clamp()` typography, no
  framework)
- Vanilla JavaScript, zero dependencies
- Google Fonts: Montserrat + Pacifico
- Maps: public Google Maps embed URL (no API key)

---

## Session Log

### 2026-05-06 — Full marketing site build

- **Updated** `index.html`:
  - Section IDs `for-barbers` / `for-clients` → `for-dancers` / `for-patrons`
  - Hero "START TODAY" → `signup.html`; store chips → `download.html`
  - "HOW … WORKS" CTAs → respective audience pages
  - Both "START FREE" buttons → `signup.html`
  - Carousel → Atlanta venues with "Official handle pending"
  - Footer rebalanced; removed Careers / Reviews / New Releases / Case
    Studies / Tax Prep / Service & Policy Calculators
  - Header + footer logos now link to `index.html`
- **Updated** `dancers.html`: matching nav + footer, BOOK buttons go to
  `signup.html?role=patron`, added closing CTA section.
- **Created**: `for-dancers.html`, `for-club-owners.html`, `for-patrons.html`,
  `signup.html`, `pricing.html`, `locations.html`, `help.html`,
  `download.html`, `store.html`, `blog.html`, `payment-processing.html`,
  `about.html`, `brand-ambassador.html`, `terms.html`, `privacy.html`.
- **Rewrote** `js/main.js` with: store URL constants, active-nav highlight,
  keyboard-accessible dropdown, carousel (with dots, keyboard, pause on
  hover), signup role selector w/ owner-only fields, static-form validation
  + success messaging, locations map search, "Get Help" button.
- **Extended** `css/styles.css` with v1.1 component styles (page hero,
  feature grid, pricing, forms, FAQ, safety callout, map, venue grid, blog,
  download, team, legal, focus states, responsive overrides).
- **Created** `ASSETS.md` documenting image sources and a replacement plan.
- **Created** `assets/img/` directory.
- **Created** `NEXT_PROMPT.md` for the upcoming Browser QA + form-backend
  activity.

### 2026-05-05 — Earlier session

- Started Python HTTP server for local dev
- Added Lucy dancer card to `dancers.html`
- Created original AGENTS.md

---

## Suggested commit message

```
Build out functional xxxotic marketing site pages and navigation
```

---

## Instructions for Agents

> After every meaningful session in this project, update this file:
> 1. Update **Last Updated** at the top.
> 2. Move items from **Remaining Work** to **Done So Far** as they ship.
> 3. Add a dated session-log entry with files changed + summary.
> 4. Update placeholders / next-steps if priorities shifted.
> 5. If the next planned activity changes, rewrite `NEXT_PROMPT.md`.
> 6. Commit with a concise message describing the work.
