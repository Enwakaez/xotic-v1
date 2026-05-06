# xxxotic — Landing Page (v1)

Marketing site for **xxxotic**, a barbershop platform for barbers, shop owners, and clients.
Dark-themed, responsive single-page site inspired by modern SaaS/barber-app marketing layouts.

Repo: <https://github.com/Enwakaez/xotic-v1>

---

## Stack

- **HTML5** — semantic, single `index.html`
- **CSS3** — custom properties, grid + flexbox, clamp-based fluid typography, no frameworks
- **Vanilla JavaScript** — zero dependencies
- **Google Fonts** — `Montserrat` (display/body) + `Pacifico` (script brand mark)

No build step. Open `index.html` directly or serve with any static host.

---

## Run locally

```bash
# clone
git clone https://github.com/Enwakaez/xotic-v1.git
cd xotic-v1

# option 1: open the file directly
start index.html          # Windows
open index.html           # macOS

# option 2: serve (any static server works)
python -m http.server 8080
# then visit http://localhost:8080
```

---

## Project structure

```
xotic-v1/
├── index.html              # markup: nav, hero, audience sections, steps, stats, carousel, footer
├── css/
│   └── styles.css          # design tokens, layout, components, responsive breakpoints
├── js/
│   └── main.js             # nav toggle, dropdown, smooth-scroll, count-up stats, carousel
└── README.md
```

---

## Architecture diagram

```
                   ┌────────────────────────────────────────────────┐
                   │                   Browser                       │
                   │                                                 │
                   │   ┌──────────────────────────────────────────┐  │
                   │   │             index.html                    │ │
                   │   │  ┌────────────┐    ┌──────────────────┐   │ │
                   │   │  │ <header>   │    │ <main class=home>│   │ │
                   │   │  │ global-nav │    │  ┌─────────────┐ │   │ │
                   │   │  │ + dropdown │    │  │ Hero        │ │   │ │
                   │   │  └────┬───────┘    │  ├─────────────┤ │   │ │
                   │   │       │            │  │ For Barbers │ │   │ │
                   │   │       │            │  ├─────────────┤ │   │ │
                   │   │       │            │  │ For Owners  │ │   │ │
                   │   │       │            │  ├─────────────┤ │   │ │
                   │   │       │            │  │ For Clients │ │   │ │
                   │   │       │            │  ├─────────────┤ │   │ │
                   │   │       │            │  │ 3 Steps     │ │   │ │
                   │   │       │            │  ├─────────────┤ │   │ │
                   │   │       │            │  │ Stat Grid   │ │   │ │
                   │   │       │            │  ├─────────────┤ │   │ │
                   │   │       │            │  │ Carousel    │ │   │ │
                   │   │       │            │  └─────────────┘ │   │ │
                   │   │       │            └──────────────────┘   │ │
                   │   │       │            ┌──────────────────┐   │ │
                   │   │       └───────────▶│  <footer>         │   │ │
                   │   │                    └──────────────────┘   │ │
                   │   └────────┬──────────────────┬───────────────┘ │
                   │            │                  │                 │
                   │            ▼                  ▼                 │
                   │   ┌────────────────┐  ┌─────────────────┐       │
                   │   │  styles.css    │  │    main.js      │       │
                   │   │ • tokens       │  │ • nav toggle    │       │
                   │   │ • layout grid  │  │ • dropdown      │       │
                   │   │ • components   │  │ • smooth-scroll │       │
                   │   │ • responsive   │  │ • count-up IO   │       │
                   │   └────────────────┘  │ • carousel loop │       │
                   │                       └─────────────────┘       │
                   │                                                 │
                   │   External: fonts.googleapis.com (Montserrat,   │
                   │             Pacifico)                           │
                   └────────────────────────────────────────────────┘
```

### Data flow (stats count-up)

```
scroll ──▶ IntersectionObserver ──▶ stat enters viewport
                                         │
                                         ▼
                               requestAnimationFrame loop
                                         │
                          ease-out cubic ── updates textContent
                                         │
                                         ▼
                              final value rendered (e.g. "8M")
```

---

## Sections

| Section       | Component                     | Notes                                              |
|---------------|-------------------------------|----------------------------------------------------|
| Header        | `.global-nav`                 | Sticky, blurred background, centered brand mark    |
| Hero          | `.hero`                       | Headline + CTA, video placeholder with play button |
| For Barbers   | `.audience` + `.pill-green`   | Dual phone mockups (CSS), green accent             |
| For Owners    | `.audience` + `.pill-purple`  | Purple accent, reversed layout                     |
| For Clients   | `.audience` + `.pill-pink`    | Pink / orange gradient accent                      |
| 3 Easy Steps  | `.steps`                      | Numbered cards: download, profile, start           |
| Stat Grid     | `.stat-grid`                  | Animated count-up numbers                          |
| Carousel      | `.carousel`                   | Auto-rotating testimonials, manual controls        |
| Footer        | `.footer`                     | 4-column layout, app store buttons, socials        |

---

## Design tokens

Defined in `:root` in [css/styles.css](css/styles.css):

- Background: `#000` with layered radial gradients for the "camo" effect
- Accents: lime green, purple, pink→orange — mapped to audience sections
- Type scale: `clamp()` fluid sizing for display headings
- Radii: `14px` (buttons/inputs), `22px` (cards/video)

---

## Responsive breakpoints

- `≥ 961px` — full three-zone nav, two-column audience sections, three-column stat grid
- `≤ 960px` — hamburger nav, stacked sections, two-column stat grid, stacked footer
- `≤ 560px` — single-column everything, stacked phone mockups

---

## Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`)
- `aria-label` on icon-only buttons and social links
- `aria-expanded` state on dropdown and mobile toggle
- Focus-visible outlines preserved (no `outline: none` overrides)
- Carousel controls are real `<button>` elements with labels
- Respects `prefers-reduced-motion` implicitly (count-up uses short duration)

---

## Notes on assets

Phone screenshots and hero video are rendered as pure CSS placeholders
(gradients + abstract shapes). Drop real imagery into an `assets/` folder
and swap the `.screen-*` / `.video-placeholder` classes when available.

---

## License

Copyright © xxxotic Inc. All rights reserved.
