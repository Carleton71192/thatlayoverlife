# Magazine system, Tier 1 (26 October 2026)

Direction A with the stamp, from handoff/CREATIVE-DIRECTION-2026-10-26.md. Nancy, 26 Oct: "A, tier 1. Need budget for the shoot." Nothing here is live.

- `type/specimens.html` sets our real headlines in four faces: today's Playfair, and three free candidates (Newsreader, Fraunces, Instrument Serif) with their text faces. Screenshots beside it. The commercial shortlist (Tiempos Headline, Reckless, GT Sectra, Canela, Editorial New) needs a trial or a license before it can be shown; Newsreader is the free face closest to that family.
- `stamp/stamp.svg` is the brand device: title around the top, coordinates around the bottom, place and date inside, the monogram. Vector, recolors with currentColor, rough edge by SVG filter (drop it under 64px). `stamp/test.html` shows it at 320 to 32px on cream, ink, a photo and in rose.
- `cover/template.html` is the home page as a magazine cover, phone and desktop, with a font switcher in the corner (prototype only). `build.py` inlines the stamp per story and Nancy's map, and writes `cover.html` (CDN photos, Google Fonts) and `cover-local.html` (offline). `shots/` has both widths in each face. Checks: no overflow, 44px targets, axe clean at 390 and 1280.
- `render.mjs` renders the specimens and the stamp sheet.

- `story/template.html` is the story page in the same system, built from `story/ghana.json` (the Ghana story as the CMS holds it, read 26 Oct, untouched) by `story/build.py`: kicker, headline, deck, byline with place, date and reading time, the stamp, the hero with caption and credit, the reading column in Newsreader at 19px with a drop cap, the pull quote beside it on desktop, Quick answers, the sign-off, the reader question with one button, three more stories, the masthead line.

Decided 26 Oct: Newsreader (Nancy: "I like candidate 1"). Open: the shoot waits for budget (the hero stays Curaçao until then).
