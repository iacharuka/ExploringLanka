**Project Overview**
- **Name:** ExploringLanka
- **Location:** /Users/ishankacharuka/Desktop/2026project/Danushka aiya's project/Untitled
- **Purpose:** Static brochure-style travel website for private tours, transfers, and safaris in Sri Lanka. You're replacing or rebuilding this because the current design is old and you'd like a fresh, modern site.

**Technology Stack**
- **Frontend:** Static HTML, CSS, JavaScript (no build system)
- **Styling:** Plain CSS files in [css/](css/) (theme tokens in [css/modern-theme.css](css/modern-theme.css))
- **Scripts:** [js/components.js](js/components.js) (component loader), [js/script.js](js/script.js) (UI interactions)
- **Assets:** images and icons in [assets/images/](assets/images/) and [assets/icons/](assets/icons/)
- **Components:** shared fragments in [components/navbar.html](components/navbar.html) and [components/footer.html](components/footer.html)

**Key Pages (content inventory)**
- [index.html](index.html) — Home / hero / destinations masonry / packages / testimonials / blog snippets
- [about.html](about.html) — About page
- [tours.html](tours.html) — Tours listing
- [tour-details.html](tour-details.html) — Tour detail (uses shared header/footer)
- [custom-tour.html](custom-tour.html) — Custom tour form / info
- [transfers.html](transfers.html) — Airport transfers
- [fleet.html](fleet.html) — Vehicle fleet
- [contact.html](contact.html) — Contact / enquiry
- [feet.html](feet.html) — (exists in repo — verify purpose before migrating)
- [README.md](README.md) — repository notes

**CSS Files**
- [css/app.css](css/app.css) — Main theme and layout variables (container widths, header height, base tokens)
- [css/modern-theme.css](css/modern-theme.css) — Design tokens and visual refinements added during recent updates
- [css/home-travel.css](css/home-travel.css) — Home/hero overrides and responsive tweaks
- [css/style.css](css/style.css) — Legacy/other styles (review for overlaps)

**JavaScript Files**
- [js/components.js](js/components.js) — Fetches and injects `navbar` and `footer` components, initializes mobile menu
- [js/script.js](js/script.js) — Booking modal, form handlers, hero carousel, toasts, wishlist, small UX behaviors

**Components & Patterns**
- Shared header/footer loaded via DOM fetch + DOMParser in `js/components.js` to keep pages DRY.
- Hero carousel uses background-image slides in `index.html` and manual dot controls.
- Booking modal present in `index.html` and wired to `.book-now-btn` buttons.

**Assets Inventory (images)**
- exploringlanka-logo-cropped.png
- exploringlanka-logo.png
- hero-1.png
- hero-2.png
- hero-3.png
- hero-4.png
- hero-5.png
- vehicle1.jpg
- vehicle2.jpg
- vehicle3.jpg
- vehicle4.jpg
- vehicle5.png
- vehicle6.jpg
- vehicle7.jpg
- vehicle8.png
- destinations/ (directory present — contains extra destination imagery)

**Noted Issues / Observations**
- Several remote fonts and Unsplash images were used originally; previewing over `file://` makes some transfer sizes zero. Use a local dev server to preview accurately (recommended: `python -m http.server 8000`).
- Some pages still reference remote images — consider consolidating all imagery under `assets/images/`.
- Accessibility improvements were added (focus outlines), but run an audit (Lighthouse) for color contrast, headings order, and form labels.
- `feet.html` filename looks unusual; verify if it's required or a stray file.

**Migration Recommendations for New Site**
- Adopt a modern workflow: choose a static site generator (Next.js, Astro, Eleventy) or a simple component-based static build (Vite + plain HTML templates) depending on skillset.
- Convert shared fragments into templating includes (partials) in your chosen framework.
- Replace Google Fonts remote links with a well-defined font strategy (self-host webfonts or retain Google Fonts with fallback stack).
- Create an `assets/manifest.json` listing image alt text, license, and intended destination to simplify content migration.
- Standardize CSS: move tokens from `css/modern-theme.css` into a single `tokens.css` or a preprocessor (Sass/PostCSS) if adopting a build step.
- Optimize images (WebP, AVIF fallbacks) and generate multiple sizes for responsive `srcset`.

**Suggested New Structure**
- /src/
  - /pages/ (home, about, tours, contact...)
  - /components/ (header, footer, hero, card)
  - /styles/ (tokens.css, layout.css, components.css)
  - /assets/ (images, icons, fonts)
- /public/ (built static output)

**Migration Checklist**
- [ ] Choose framework and scaffold repo
- [ ] Audit and copy all content from current `index.html` and other pages
- [ ] Create component partials (header, footer, card, modal)
- [ ] Migrate and optimize images; update image references
- [ ] Recreate interactive behaviors in `js/` or framework components
- [ ] Run Lighthouse accessibility & performance audits
- [ ] Setup deployment (Netlify, Vercel, or static host)

**Commands to preview locally (recommended)**
```bash
# From project root
python -m http.server 8000
# Then open http://localhost:8000/index.html
```

**Where I saved this summary**
- `/Users/ishankacharuka/Desktop/2026project/Danushka aiya's project/Untitled/WEBSITE_SUMMARY.md`

**Next steps I can take**
- Create a content CSV/JSON export of page texts and image references to accelerate migration.
- Scaffold a new starter repo (static site generator) and port the homepage as a first component.
- Run an automated image optimization pass and list recommended replacements.

If you want, I can also:
- Scaffold a new repo (Astro/Next/Eleventy) and port the `index.html` to a reusable component.
- Produce a CSV of all image paths + alt texts extracted from the HTML.

