# Pending Webflow change: the story page in the magazine system (26 October 2026)

Nancy, 26 Oct: "Build and start the story page", after the council's third review. The cloud session built and tested this offline; it is NOT applied, because the Mac session holds the Webflow lock (taken 16:00 UTC for /edit-profile U1 to U14). Apply when the lock is released, or when Nancy says so.

## What it is

One block of page head code for the Stories template (page 6a0b29eedc14f1444e935766): `src/design/magazine-2026-10/story-build/tll-mag-story-v1.html`. It holds a Google Fonts link (Newsreader and Inter Tight), one style block `tll-mag-story-v1` and one script `tll-mag-story-js-v1`. It loads after the template's existing head code (tll-v9-j13-v1) and before the footer code (tll-st3-story-v1), and overrides both.

- The type: Newsreader for the headline, deck, reading text, section headings, pull quote and the heads of the boxes; Inter Tight for everything else. Playfair, Plex Condensed and the monospace go from this page (the monospace survives inside the stamp).
- The head: breadcrumb, the place and pillar in rose, the headline (52px on a phone, up to 80px on desktop), the excerpt as the deck in Newsreader, then the byline (the bound author row, moved up from the body by the script) with place, date and reading time. Then the photo, 4:5 on phones and 3:2 on desktop, with the stamp on it top right and a caption line under it: the hero caption field when set, and "Photo {author}".
- The reading column: Newsreader 19px, line height 1.6, a drop cap on the first paragraph, headings at 28 and 24px, links underlined in rose. The pull quote is a rose rule on the left, no box. The short version, Quick answers and links card keep their boxes with a Newsreader head. Share buttons squared.
- After the story: the same type everywhere, labels in Inter Tight, rose on links and focus rings, the related cards' headlines in Newsreader.
- Restyle only. No element removed, no binding changed, no data-* hook renamed. The script makes three DOM moves: the hero image is wrapped in a `figure.tll-mg-fig` (its data-tll-parallax attribute stays on the image), the author row `.st3-author` is appended to `.tll-story-hero-content`, and the stamp `span.tll-mg-stamp` is appended to the figure. The hero caption element is hidden, not removed. Rose and teal tokens of the st3 block are untouched where they are not visible.
- The stamp reads the byline location (first part, uppercased, 16 characters at most), the date from the author row, and the pillar for the bottom arc ("BY THE PEOPLE WHO WENT" when there is no pillar). No count, nothing invented.

## How it was tested

The sandbox cannot reach the site, so `story-build/fixture.py` builds a stand-in: the template's element tree as read from Webflow on 26 Oct (`src/pages/stories-template/tree-2026-10-26.json`), filled from the Spain story's CMS item, wrapped in the export's CSS, today's site head and footer code, and the template's head and footer code. `story-build/shots.mjs` screenshots it before and after the layer at 390 and 1280 (`story-build/shots/`). Results after: no horizontal overflow, axe clean on the article for contrast, target size, alt text, link names and heading order at both widths, no page errors from the layer (the only console error is the cookie banner library, which the sandbox blocks). The stand-in is structurally faithful; the live page may differ in details the tree does not carry (CMS conditional visibility, the flag image in the meta row). First check on the subdomain before the custom domains.

## Steps to apply

1. Read the page's current head code with `get_page_freeform_code` and compare it with `src/pages/stories-template/head-2026-10-26-before.html` (to be saved at apply time). Stop if it differs from what the layer was tested against.
2. Append the contents of `tll-mag-story-v1.html` to the end of the head code with `set_page_freeform_code` (location head). Do not touch the footer code.
3. Read back and confirm the head ends with the layer byte for byte.
4. Publish to the webflow.io subdomain only. Nancy checks a contributor's story (/stories/spain-madrid-wedding-ibiza) and one of hers on her phone.
5. On her say-so, publish to the custom domains. Note the writes in handoff/WEBFLOW-LOCK.md.

## Known limits, for the build list

- The photo's focal point: a portrait hero on a phone crops to the middle of the image. A CMS field for the focal point is on the list from the council (cover and story page both need it).
- The breadcrumb's third link and the share "X" button are under 44px on the live page already; the layer fixes the first two breadcrumb links only. The "Tell the editor" and email links in the feedback block are also pre-existing small targets.
- Google Fonts is loaded per page here. When the cover ships, the font link moves to the site head and this block drops its own.
