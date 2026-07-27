# GiardDesign — reference build (adRespect recruitment task)

Reference implementation of the giarddesign landing page from the adRespect
recruitment task. Built as a comparison baseline — **not the submitted work**.

## Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript** + **Vite**
- **Tailwind CSS v4** — design tokens in `@theme` (`src/style.css`), custom
  `container-page` / `container-narrow` utilities
- **Macy.js** — masonry gallery (hard requirement from the design notes)
- Fonts self-hosted via **Fontsource**: Montserrat 400/500 (headings),
  Inter 400 / 500-italic (body, heading accents)

## Features

- Hero section as a slider (text out-in swap + image crossfade, swipe support,
  `aria-live` announcements)
- Header with an "Oferta" dropdown, slide-out search and a fullscreen mobile
  menu (Esc, click-outside, focus return, scroll lock)
- Offer cards with lift hover and arrow slide
- Full-bleed masonry gallery with fade-out + "Rozwiń" lazy expansion and a
  native `<dialog>` lightbox (free focus trap, ←/→, counter, backdrop close)
- Scroll-reveal via a custom `v-reveal` directive (single shared
  IntersectionObserver; mask variant observes the clipping parent), staggered
  delays, full `prefers-reduced-motion` support
- Mobile-first: 375 / 768 / 1440, no horizontal scroll anywhere

## Architecture

Full architecture notes (per-file responsibilities, data flows, design
decisions) live in [ARCHITEKTURA.md](./ARCHITEKTURA.md) (Polish).

## Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check + production build
```

## Production checklist (conscious trade-offs)

- **CSR only, no prerender** — crawlers see an empty `<div id="app">` until JS
  runs. Acceptable for a recruitment task; for production add `vite-ssg` or a
  post-build Puppeteer snapshot of the single route.
- **After a domain is assigned:** set absolute URLs in `og:image`/`twitter:image`,
  add `<link rel="canonical">` + `og:url`, add `public/sitemap.xml` and a
  `Sitemap:` line in `robots.txt`, and fill in the LocalBusiness JSON-LD with
  real address/phone (never placeholder data).
- **Security headers:** `public/_headers` covers Netlify; on Vercel copy the same
  set into `vercel.json` (`headers` key).
- **Macy.js** is unmaintained (2022) — kept because the task requires a masonry
  library; a production rebuild could use CSS columns/grid instead (a CSS
  fallback ships already: `.masonry-fallback`).

## Credits

Design © adRespect.pl — created as part of their recruitment process.
Reference screenshots for comparison: `research/reference-screens/`.
