# AGENTS.md — Project Context & Session Log

**Last Updated:** 2026-05-05  
**Project:** xxxotic v1 (Nightlife Entertainment Platform)  
**Repository:** https://github.com/Enwakaez/xotic-v1  
**Current Branch:** feature/xotic-init

---

## Project Overview

**xxxotic** is a marketing/booking platform for nightlife entertainment venues. The project consists of a responsive, dark-themed static website built with vanilla HTML, CSS, and JavaScript.

**Purpose:** Provide a central hub for dancers to showcase their services, for club owners to manage bookings, and for patrons to discover and book entertainment.

**Status:** Early-stage v1 MVP landing page + dancer catalog

---

## What This Project Does

### Core Functionality
- **Landing Page** (`index.html`) — Marketing site with hero, audience-specific sections (dancers, club owners, patrons), pricing info, carousel, and footer
- **Dancer Catalog** (`dancers.html`) — Browse featured performers, view offerings, and book shows
- **Responsive Design** — Mobile-first, works from 560px to desktop widths
- **Interactive Elements** — Nav dropdown, mobile hamburger toggle, smooth scroll, count-up stat animations, auto-rotating carousel

### Key Sections
| Page | Sections | Purpose |
|------|----------|---------|
| `index.html` | Hero, For Dancers, For Owners, For Patrons, 3 Steps, Stats, Carousel, Footer | Convince visitors to sign up |
| `dancers.html` | Roster grid with 6+ dancer cards | Browse performers, view profiles & offerings, book |

---

## How It Works

```
USER VISITS SITE
    │
    ├─ index.html (landing page)
    │  ├─ Global nav + dropdown
    │  ├─ Hero video (CSS placeholder)
    │  ├─ Audience-specific sections (pills, mockups, CTAs)
    │  ├─ Stats (count-up animation via IntersectionObserver)
    │  ├─ Carousel (testimonials, auto-rotate)
    │  └─ Footer (links, store buttons, socials)
    │
    └─ dancers.html (catalog)
       ├─ Nav (same as index)
       ├─ Hero intro ("MEET THE ROSTER")
       ├─ Dancer grid (6 cards: Daisy, Tina, Onyx, Icy, Star, Lucy)
       │  └─ Each card: photo, name, rating, tag, offerings list, bio, BOOK button
       └─ Footer (same as index)

INTERACTIONS
─ Nav dropdown: click → toggle visibility
─ Mobile toggle: click → show/hide mobile menu
─ Stats: scroll into view → animate count-up (0 → final value)
─ Carousel: auto-rotate every 5s OR click prev/next → jump to slide
- Book button: click → (placeholder, no backend yet)
```

---

## Project Structure

```
xotic-v1/
├── index.html                # Landing page (14,877 bytes)
├── dancers.html              # Dancer roster/catalog (10,204 bytes)
├── css/
│   └── styles.css            # All styling, design tokens, responsive breakpoints
├── js/
│   └── main.js               # Nav logic, carousel, count-up animations
├── README.md                 # Project documentation
├── AGENTS.md                 # THIS FILE — AI context & session log
├── .git/                     # Git repository
├── .claude/                  # Claude Code project config
└── .gitkeep                  # Git placeholder
```

### File Details

| File | Size | Purpose |
|------|------|---------|
| `index.html` | 14.9 KB | Main landing page, semantic HTML5 |
| `dancers.html` | 10.2 KB | Dancer roster grid, reuses nav/footer from index |
| `css/styles.css` | ~3 KB | Design tokens, layout (grid/flexbox), responsive, animations |
| `js/main.js` | ~2 KB | Nav toggle, dropdown, smooth scroll, IntersectionObserver for stats, carousel logic |
| `README.md` | 8.8 KB | Architecture diagram, stack info, local setup |

---

## Technology Stack

- **HTML5** — Semantic markup, no build tools
- **CSS3** — Custom properties (CSS vars), Grid + Flexbox, `clamp()` for fluid typography, animations
- **JavaScript (Vanilla)** — Zero dependencies, no frameworks
- **Google Fonts** — Montserrat (body/display) + Pacifico (brand mark)
- **Hosting** — Static site (any HTTP server works; python -m http.server for local dev)

---

## Git History & Status

### Commits (Most Recent First)
```
f9747aa — Add dancer catalog page and update navigation links for dancers [CURRENT]
159e1fc — Revamp landing page content for nightlife focus, updating terminology and sections for dancers, club owners, and patrons.
c9488e5 — Scaffold xxxotic landing page
cd5da5f — Initialize repository
```

### Current Git Status
```
On branch: feature/xotic-init
Up to date with origin/feature/xotic-init

UNCOMMITTED CHANGES:
  Modified: dancers.html (NEW — added Lucy dancer card)
```

---

## Session Log — What I've Done So Far

### Session Start: 2026-05-05

#### 1. **Started the Website**
   - Launched Python HTTP server on port 3000
   - Command: `python -m http.server 3000`
   - URL: http://localhost:3000
   - Status: Running in background

#### 2. **Added Lucy Dancer Card**
   - **File Modified:** `dancers.html`
   - **Change:** Added new dancer card (6th in roster) with:
     - Name: LUCY
     - Rating: ★ 4.8
     - Badge: NEW
     - Tag: "Playful energy, infectious charm."
     - Offerings: Floor shows, Group bookings, Pole performances
     - Bio: "Energetic performer bringing playful charm and smooth transitions. Lucy keeps the crowd engaged with interactive performances and a genuine love for the stage."
     - Book button: BOOK LUCY
   - **Status:** Uncommitted (staged for next commit)

#### 3. **Created AGENTS.md** (THIS FILE)
   - Comprehensive AI context document
   - Includes project overview, architecture, git status, structure
   - Designed for readability by any AI platform
   - Will be updated after each query

---

## Design System

### Color Palette
- **Primary BG:** `#000` (black with radial gradients)
- **Accents:** 
  - Lime Green (`#00ff00` range) — Dancers section
  - Purple — Club Owners section
  - Pink/Orange Gradient — Patrons section
- **Type:** Montserrat (body), Pacifico (brand)

### Responsive Breakpoints
- **Desktop:** ≥ 961px (3-column layouts, full nav)
- **Tablet:** 561–960px (hamburger nav, 2-column grids)
- **Mobile:** ≤ 560px (1-column stacked layouts)

### Key Components
- `.dancer-card` — Individual performer profile card
- `.carousel` — Auto-rotating testimonial/content carousel
- `.stat-grid` — Animated counter stats
- `.audience` — Left-right layout for feature descriptions
- `.global-nav` — Sticky header with dropdown nav

---

## Next Steps (Recommended)

- [ ] Commit Lucy dancer card addition
- [ ] Test dancers.html in browser (http://localhost:3000/dancers.html)
- [ ] Connect booking buttons to backend/email flow
- [ ] Add real performer images (replace Unsplash placeholders)
- [ ] Implement payment processing (stripe/square integration)
- [ ] Deploy to staging/production
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Set up email collection for waitlist

---

## How to Use This Document

**For AI Agents:** Read sections in order:
1. **Project Overview** — Understand purpose
2. **How It Works** — Grasp architecture
3. **Project Structure** — Know file layout
4. **Session Log** — See recent changes
5. **Design System** — Understand styling patterns
6. **Next Steps** — Know what's pending

**For Humans:** Use this as a living project Bible. Update after each major session.

---

## Instructions for Agents

> **IMPORTANT:** After every query/interaction in this project, update this AGENTS.md file:
> 1. Add timestamp to session log entry
> 2. Summarize changes made (file, what changed, why)
> 3. Update git status section
> 4. Update "Next Steps" if priorities shifted
> 5. Commit changes: `git add AGENTS.md && git commit -m "Update AGENTS.md after [task description]"`

---

## Contact / Repository

- **GitHub:** https://github.com/Enwakaez/xotic-v1
- **Git User:** Enwakaez
- **Local Dev:** Run `python -m http.server 3000` from project root

---

**Note:** This document is machine-readable and designed to provide full context to any AI assistant working on this project. Keep it up to date.
