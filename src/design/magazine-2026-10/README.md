# Magazine system, Tier 1 (26 October 2026)

Direction A with the stamp, from handoff/CREATIVE-DIRECTION-2026-10-26.md. Nancy, 26 Oct: "A, tier 1. Need budget for the shoot." Nothing here is live.

- `type/specimens.html` sets our real headlines in four faces: today's Playfair, and three free candidates (Newsreader, Fraunces, Instrument Serif) with their text faces. Screenshots beside it. The commercial shortlist (Tiempos Headline, Reckless, GT Sectra, Canela, Editorial New) needs a trial or a license before it can be shown; Newsreader is the free face closest to that family.
- `stamp/stamp.svg` is the brand device: title around the top, coordinates around the bottom, place and date inside, the monogram. Vector, recolors with currentColor, rough edge by SVG filter (drop it under 64px). `stamp/test.html` shows it at 320 to 32px on cream, ink, a photo and in rose.
- `cover/template.html` is the home page as a magazine cover, phone and desktop, with a font switcher in the corner (prototype only). `build.py` inlines the stamp per story and Nancy's map, and writes `cover.html` (CDN photos, Google Fonts) and `cover-local.html` (offline). `shots/` has both widths in each face. Checks: no overflow, 44px targets, axe clean at 390 and 1280.
- `render.mjs` renders the specimens and the stamp sheet.

Open: Nancy picks the display face; the shoot waits for budget (the hero stays Curaçao until then).
