# Open Graph cards

1200x630 share cards, one per page, in the site's own kit (Ink, Cream, Rose, Teal; Playfair Display 800 headline with a rose italic accent, JetBrains Mono eyebrow, the wordmark and the URL bottom left). Photo pages use a real site photograph on the right at full color behind a soft Ink blend; pages without a photo (legal, private) use the typographic card.

- `pages.json`: one row per page (slug, Webflow page id, eyebrow, headline with `|accent|`, photo asset id, focal point).
- `template.html` + `build-og.mjs`: Playwright render. Photos and fonts live in the scratchpad (downloaded from the Webflow asset bucket and Google Fonts), not in the repo: `OG_SCRATCH=<scratchpad> PW=/opt/node22/lib/node_modules/playwright/index.mjs node scripts/og/build-og.mjs`.
- `asset-ids.json`: the Webflow asset id each card was uploaded as on 9 Oct 2026; pages point at these through `openGraph.imageAssetId`.
- Evidence: `reports/evidence/og-2026-10-09/`.

Not covered by a static card: the Stories template, which gets its hero image as og:image through the template head code.
