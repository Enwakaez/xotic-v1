# NEXT_PROMPT.md — Next planned activity

The xxxotic marketing site is built out (17 pages, full nav, full footer,
forms, carousel, map). It is **not yet production-ready**. The next
activity is a combined **Browser QA pass + form-backend wiring** so the
site is verified across breakpoints and starts capturing real submissions.

Copy the prompt below and hand it to the next coding session.

---

## Prompt

```
You're picking up the xxxotic v1 static marketing site (vanilla HTML/CSS/JS,
no build step, deploying to GoDaddy static hosting). The site has 17 HTML
pages all sharing a single nav and footer. Read AGENTS.md and ASSETS.md
first for full context.

Your job has two parts. Do them in order.

==========================================
PART 1 — Browser QA pass + visual polish
==========================================

Start a local server and walk every page. From the project root:

    python -m http.server 3000
    # then open http://localhost:3000

For each page in the site map (AGENTS.md), check:

  1. Top nav: every link goes where it should. The FEATURES dropdown opens
     on hover, on click, on Enter/Space, and on ArrowDown. It closes on
     Escape and on outside click. Tab order is sane.

  2. Footer: every link works. The xxxotic logo in the footer brand block
     links to index.html. Social icons should look intentional (currently
     plain text glyphs — flag any that look broken).

  3. Hero / page hero: heading does not overflow at 320px width. CTA
     buttons have visible focus rings.

  4. Forms (for-dancers, for-club-owners, for-patrons, signup,
     brand-ambassador):
       - Submit empty → required fields turn red, no success.
       - Bad email format → email field flagged.
       - Bad phone format (e.g. "abc") → phone flagged.
       - Valid submit → success banner appears, fields reset.
       - signup.html?role=owner shows owner-only fields and marks them
         required.
       - signup.html?role=dancer / ?role=patron hide owner-only fields.

  5. Carousel on index.html: auto-rotates, prev/next work, dots match the
     active slide, ArrowLeft/Right keyboard navigation works, hover
     pauses auto-rotation.

  6. Locations map: default Atlanta search loads; typing a city in the
     search box and submitting reloads the iframe.

  7. Help page: FAQ accordion opens/closes. "Get Help" button opens a new
     tab with a search for the National Human Trafficking Hotline.

  8. Responsive: at 360px, 768px, and 1280px:
       - No horizontal scroll.
       - Mobile hamburger appears <= 960px and toggles the menu.
       - Feature/pricing/role/blog/venue/team/download grids stack
         appropriately (3-col → 2-col → 1-col).
       - Heading clamps don't overflow.

  9. Console: no errors on any page.

Document every issue you find as a numbered list. Then fix them one by one.
Common categories of fix:
   - Broken or wrong links → update href.
   - Visual overflow on small screens → add clamp() or media-query
     overrides in css/styles.css.
   - JS errors → check js/main.js (the script is defensive — every feature
     guards on element existence).
   - Footer social icons looking janky → replace the text glyphs ("YT",
     "X", "FB", "IG", "TT") with proper inline SVG logos in the footer of
     every page (there are 17 footers — write a small node script or use
     a sed-equivalent search/replace if needed).
   - feature-icon Unicode glyphs rendering inconsistently → consider
     replacing with inline SVG in a follow-up pass; not blocking.

==========================================
PART 2 — Wire forms to a real backend
==========================================

Every form on the site is currently static — submissions are validated
client-side and shown a success message, but no data goes anywhere.

Recommended provider: **Formspree** (formspree.io). Free tier supports
multiple forms and email forwarding without a backend. Alternative:
Netlify Forms if you decide to host on Netlify instead of GoDaddy.

Implementation plan if using Formspree:

  1. Get a Formspree form endpoint for each form (or one shared endpoint
     with a hidden _subject field per form). Endpoints look like
     https://formspree.io/f/abcdwxyz.

  2. For each <form class="static-form" data-form="…"> across the site:
       - Add `action="<formspree-endpoint>"` and `method="POST"`.
       - Add a hidden input `<input type="hidden" name="_subject"
         value="xxxotic — <form name>">` so emails are labeled.
       - Add a hidden input `<input type="hidden" name="_form_source"
         value="<page>">` so you know which page submitted.
       - Add `<input type="text" name="_gotcha" tabindex="-1"
         autocomplete="off" style="display:none">` — Formspree's
         honeypot spam field.

  3. Update js/main.js:
       - Detect forms that have an `action` attribute. For those, after
         client-side validation passes, submit via fetch() instead of the
         current preventDefault → success-message flow.
       - On a successful POST, show the existing .form-success element.
       - On error, show an inline error message (add a sibling .form-error
         element to each form for this).
       - Keep client-side validation regardless — it's a UX improvement
         and prevents wasted Formspree submissions.

  4. Update each form's "this isn't connected to a backend yet" notice:
       - Remove the .form-note message OR replace it with a privacy note
         (e.g. "We'll only use your info to follow up about xxxotic.
         See our Privacy Policy.")

  5. Verify in browser:
       - Submit each form with valid data, confirm an email arrives at
         the configured Formspree address.
       - Submit invalid data, confirm validation still blocks before any
         network request.
       - Check the network tab — only one POST per submit.

==========================================
Deliverables
==========================================

When done, report back with:
  - A bullet list of every QA issue you found, and how you fixed it.
  - Confirmation that all 17 pages pass the QA checklist above.
  - Confirmation that all 5 forms POST to Formspree successfully.
  - A diff summary (files touched).
  - Updates to AGENTS.md (move items from "Remaining Work" → "Done So
    Far", add a new dated entry to the session log).
  - A new NEXT_PROMPT.md for the next activity. Likely candidates:
      (a) Replace placeholder imagery (dancers + page heroes).
      (b) Add web analytics (GA4 or Plausible).
      (c) Verify Atlanta venue Instagram handles + replace placeholders.
      (d) Deploy to GoDaddy.

==========================================
Out of scope for this session
==========================================
  - Replacing imagery (separate session)
  - Verifying Atlanta venue Instagram handles (needs human research)
  - Legal review of terms.html / privacy.html (needs an attorney)
  - Replacing placeholder pricing values (needs stakeholder input)
  - Changing the design system or page structure
```

---

## Why this is the right next step

1. **Browser QA before anything else.** Every other improvement (imagery,
   analytics, deploy) assumes the site already works. Without a QA pass,
   you'll find broken things later when the cost to fix is higher.

2. **Form wiring is the single biggest functional gap.** The site looks
   complete but won't actually capture leads, ambassador applications,
   owner inquiries, or signups. Until forms work, every visit is wasted.

3. **Both can be done in one session.** Formspree integration is roughly
   a 30-minute job once endpoints exist; QA is the bigger chunk but
   completes naturally as you click through every page during fixing.

4. **Everything else has external dependencies** (real images, verified
   handles, attorney review, stakeholder pricing). The next dev session
   should focus on what can be done entirely in code.

---

## After this is done

The follow-up prompt should likely be **imagery replacement** —
specifically the six dancer cards on `dancers.html` (currently the same
Unsplash placeholder repeated) and a hero image on each audience page.
That's the next-most-visible quality gap once forms work.
