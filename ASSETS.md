# ASSETS.md — Image Sources & Replacement Plan

This document tracks every external image used across the xxxotic site.
Static hosting on GoDaddy means we'd ideally bundle local copies of images
under `assets/img/` before launch. Until then, we're using a small number of
neutral, royalty-free placeholders.

---

## Current image usage

| Page          | Element                  | Source                                    | Status                                 |
|---------------|--------------------------|-------------------------------------------|----------------------------------------|
| dancers.html  | All 6 dancer photos      | Unsplash photo `1547153760-18fc86324498` | Placeholder. Same image repeated.      |
| index.html    | Hero video               | Pexels video `16476271` by Yashar Basir | Local MP4 in `assets/video/`.       |
| index.html    | Hero video poster        | Pexels video thumbnail `16476271`       | Local poster in `assets/img/`.       |
| index.html    | Phone mockups            | Pure CSS placeholders (no image)          | Local CSS only.                        |
| download.html | App icons                | Inline SVG                                | Original brand glyphs.                 |
| download.html | Google Play colors       | Inline SVG                                | Generic colored geometric SVG.         |
| All pages     | Footer social icons      | Inline SVG                                | Placeholder account links pending.     |

All other pages use color, type, and CSS-only visual elements — no
external image dependencies.

---

## Hero video source

- **File:** `assets/video/hero-bottle-service-loop.mp4`
- **Poster:** `assets/img/hero-bottle-service-poster.jpg`
- **Title:** DJ performing in the night club
- **Creator:** Yashar Basir
- **Source:** https://www.pexels.com/video/dj-performing-in-the-night-club-16476271/
- **Poster source:** Pexels video thumbnail for video `16476271`
- **License:** Pexels License, https://www.pexels.com/license/
- **License note:** Pexels photos and videos can be downloaded and used for
  free, including commercial website/app use. Attribution is not required,
  and modification is allowed.
- **Date accessed:** 2026-05-07
- **Attribution requirement:** None required by Pexels; credit documented
  here for asset tracking.
- **Optimization note:** The local MP4 is an 18-second 720p Pexels
  download, served locally as decorative homepage marketing media with no
  browser controls. The selected file is under 10 MB. No WebM was generated
  because no local video transcoder (`ffmpeg`, `HandBrakeCLI`, or
  equivalent) was available in the workspace.
- **Selection note:** This clip was selected by the project owner. It is a
  legally clean nightclub / DJ performance scene with crowd energy,
  lighting, and nightlife context. It is not Atlanta-specific venue footage
  and does not show literal bottle girls delivering service to a club
  section.

---

## Image sourcing rules

1. **No copyrighted images** unless we have explicit, documented license.
2. **No explicit adult imagery** — premium nightlife / app-marketplace
   appropriate only.
3. **Prefer royalty-free or public press images** when we need stock
   imagery (Unsplash, Pexels, Pixabay).
4. **Verify before using real venue photos** — request permission from
   each venue or use only verified press kits.

---

## Replacement plan before launch

- [ ] Replace all six dancer card images on `dancers.html` with real
      performer photos under signed model release, or commission a stylized
      brand-shoot to use across the roster.
- [ ] Add hero/feature imagery to `for-dancers.html`, `for-club-owners.html`,
      and `for-patrons.html` (currently CSS-only).
- [ ] Add venue images to `locations.html` venue cards (Magic City, Blue
      Flame, Onyx Atlanta, Pin Ups, Strokers) — only after confirming
      permission from each venue.
- [ ] Add three editorial images to `blog.html` cards.
- [ ] Add a brand image / merch render to `store.html`.
- [ ] Add team headshots to `about.html` for June, Wes, and Peggy.
- [ ] Add platform/feature screenshots to `payment-processing.html`.

When local assets are added, drop them in `assets/img/<page>/` and update
the `src` in the relevant HTML.

---

## Map embeds

`locations.html` embeds Google Maps via the public, key-less embed URL:

```
https://www.google.com/maps?q=<query>&output=embed
```

This is rate-limited but doesn't require an API key, which keeps any
private key out of the static site. If we move to a higher-volume embed
or interactive Maps JS API, we'll need a server-side proxy (or environment
variable on a hosted backend) to keep the key out of the client.

---

## Social icons

Footer social buttons now use inline SVG logos for YouTube, X, Facebook,
Instagram, and TikTok. The account URLs still need verified xxxotic social
profiles; until then they point to `#` and are labeled `(coming soon)`.
