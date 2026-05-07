# NEXT_PROMPT.md — Next planned activity

The xxxotic marketing site has received a QA polish pass and the forms are
now Formspree-ready in code. The remaining blocker is external: real
Formspree endpoint IDs must be created and added before submissions can be
verified end to end.

Copy the prompt below and hand it to the next coding session.

---

## Prompt

```
You're picking up the xxxotic v1 static marketing site (vanilla HTML/CSS/JS,
no build step, deploying to GoDaddy static hosting). Read AGENTS.md and
ASSETS.md first.

Current state:
  - 17 HTML pages all return 200 on http://localhost:3000.
  - Homepage hero media uses a local Pexels MP4 DJ / nightclub clip with
    local poster.
  - Footer social text glyphs were replaced with inline SVG logos.
  - Mobile nav now uses a generated drawer from js/main.js.
  - All 5 lead forms have Formspree metadata fields:
      _subject, _form_source, _gotcha.
  - js/main.js has a FORMSPREE_ENDPOINTS object at the top.
  - Real Formspree endpoint IDs are still missing, so no form submissions
    reach anyone yet.

Do these in order.

==========================================
PART 1 — Configure and verify Formspree
==========================================

1. In Formspree, create either:
   - one endpoint per form, or
   - one shared endpoint for all forms.

2. Add the endpoint URLs to FORMSPREE_ENDPOINTS in js/main.js:

   dancer-apply
   owner-inquiry
   patron-waitlist
   signup
   ambassador

3. Start the local server:

   python -m http.server 3000

4. In a real browser, submit each form with valid test data:
   - for-dancers.html
   - for-club-owners.html
   - for-patrons.html
   - signup.html
   - brand-ambassador.html

5. Confirm:
   - invalid required fields are blocked before any network request
   - invalid email is blocked
   - invalid phone is blocked
   - valid submit sends exactly one POST
   - Formspree receives the submission
   - the page shows the success message
   - fields reset after success
   - signup.html?role=owner shows and requires owner-only fields
   - signup.html?role=dancer and signup.html?role=patron hide owner-only fields

==========================================
PART 2 — Manual Browser QA
==========================================

Walk every page at 360px, 768px, and 1280px.

Check:
  - no horizontal scroll
  - nav links work
  - FEATURES dropdown works by hover, click, Enter/Space, ArrowDown, Escape
  - mobile hamburger opens one clean drawer and dropdown expansion does not
    overlap secondary links
  - footer links work and SVG social icons look intentional
  - headings do not overflow at 320px/360px
  - carousel auto-rotates, prev/next work, dots match active slide, keyboard
    arrows work, and hover pauses rotation
  - locations map search reloads the iframe
  - help FAQ opens/closes
  - Get Help opens a new search tab for the National Human Trafficking Hotline
  - console has no errors

Fix any issue you find.

==========================================
PART 3 — Docs
==========================================

When done:
  - Update AGENTS.md:
      - move "Wire forms to a real backend" to Done So Far
      - move "Browser QA pass" to Done So Far if all pages pass
      - add a dated session-log entry
  - Update NEXT_PROMPT.md for the next activity.

Likely next activity after this:
  - Replace placeholder imagery on dancers.html and add hero/feature imagery
    to the audience and content pages.

Out of scope:
  - Legal review
  - Pricing changes
  - Verified Atlanta venue handles
  - Production deployment
```

---

## Why this is the next step

Form submission is the biggest remaining functional gap, but it requires
real Formspree endpoint IDs from the project account. Once that is verified,
the next most visible quality gap is placeholder imagery.
