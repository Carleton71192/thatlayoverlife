# Monday summary for Nancy (written Sunday 1 Nov 2026, for Monday 2 Nov)

Everything from the weekend in one place. Nothing was published after 16.49.0 and nothing was sent, deleted or paid for. The site is as you left it on Saturday evening, plus the staged work below, which goes live only when you say so.

## What is live right now

- **Site layers 16.49.0** (published Saturday): Phase 0 fix-and-protect, plus the "what a story looks like here" block on /submit, the story-end line and the empty-search line.
- **Site head:** the certified Google consent message with Consent Mode. GA4, Ahrefs and ads load only after a choice.
- **Thailand stub:** unpublished by you.
- **Worker:** the version you last deployed. None of the new routes (series, work trips, Living Library, pets, travel style, album settings, the new export) exist on the live Worker until you run `npx wrangler deploy`.

## What is staged (built, tested offline, not live)

| Item | Where to look | Goes live when |
|---|---|---|
| Phase 1 core and chunks (site layers 16.50.0) | registered in Webflow and applied to the header, waiting on a publish | you say go after the Worker deploy |
| Home page head without the pre-consent AdSense tag | Webflow page settings, home | the same publish |
| Work trips hub, stamps switch, Free Evening series | /edit-profile?preview=worktrips, /work-trips (Worker) | Worker deploy plus publish |
| Expat rework, Living Library, My moves | /for-expats?preview=expat | Worker deploy plus publish |
| Pet passport pages, /my-pets editor | /the-paw-passport?preview=pets | Worker deploy plus publish |
| Welcome flow with the travel-style question, Next story, join card | /account?welcome=1&preview=ux | Worker deploy plus publish |
| Download everything, two-step copy for iPhone | /account (the card is styled; screenshots in scratchpad/shots-1031) | Worker deploy first, then publish |
| Bubbly icon set v2 | design/icons-2026-10-31-v2-bubbly/index.png | your pick |
| Copy sheet, 523 proposed lines | docs/copy-audit-2026-10-31/copy-sheet.csv | your marks, after Phase 1 passes its gate |
| Nav and footer variant | design/nav-footer-variant-2026-11/after-390.png and after-1440.png | a session together |

## The order on Monday, if you have an hour

1. **Allow the site in the Claude environment's Network access** (www.thatlayover.life, and if possible cdn.jsdelivr.net, cdn.prod.website-files.com, res.cloudinary.com). Until then no Lighthouse, no axe, no live screenshots, and the Phase 1 speed gate cannot be measured.
2. **Phase 0 follow-ups you planned:** the Designer edit on the Visits, Bookmarks, Comments, Photo submissions and Press applications templates; the three 301s (/my-passport to /the-map, /countries to /destinations, /for-affiliates to /creators); AdSense Consent Mode support; the Ko-fi URL and the EU guide check.
3. **Deploy the Worker** (`npx wrangler deploy` in the Worker folder). Deploy before the publish: the old export button keeps working against the new Worker, but the new one needs the new routes.
4. **Say go for the Phase 1 publish.** One publish makes 16.50.0 and the home head change live. The work trips, expat, pets and welcome-flow layers stay behind their preview switches until you approve each one.
5. **After the publish, on the subdomain first:** open the home page, a story page, /travelers, /the-map, and run one Download everything from /account on an iPhone.

## Decisions, shortest first

**Phase 1 (speed and photos)**
- Approve the /account card strings: "Your copy is on its way.", "Download your photos", "Save part N of K", "Part N of K is ready to save.", "N photos in K parts."
- A session for the fonts (Site settings) and the home page footer scripts (Turnstile, GSAP), since both need the live page.

**Phase 2 (design system)**
- One cream: the spec says #FAF7F2, the code and the Designer use #F7F1E8.
- The rose for small text: the spec's two roses fail contrast on cream for small text. Either rose text stays headline-sized only, or #C8325B (which the newest layers already use) becomes the one text rose.
- The primary button color: rose #D63859 with white (proposed) or teal with ink.
- The magazine face: Newsreader (chosen 26 Oct) or Playfair (the spec).
- The wordmark: Syne in the wordmark only, per the spec, or keep the current faces.

**Phase 3 (usability)**
- The review truth: "stories go live when sent and are read after" (the 19 Oct decision) or "within 48 hours". One line everywhere.
- The support promise: "A human writes back, usually the same day", plus one response-times line (editorial 48h, takedowns and safety 4h, press 3 business days).
- The newsletter name: the Sunday letter, Newsletter, or the dispatch. Capture only until it has gone out two weeks running.
- The member primary action in the nav: "My map" (the variant) or "Share your story" (today).
- Footer drops: the two draft guides, Spotlight, Awards (until December).
- How many countries the site counts: the map says 249, the old passport 195, Destinations 193.
- Visited (the map) or Stayed (every other page).

**Voice and icons**
- Pick the icon set: bubbly, thin, or both (bubbly for badges, pins, Paw Passport and share cards; thin for chips and buttons).
- Any bubbly icons to redraw. The weakest are the bridge, the labyrinth, the gate floor and the postcard.

## What the reviewers flagged (fixed, for the record)

- The first Download everything design would have failed on the Worker's free plan (10 ms CPU, 50 requests per request). Redesigned: the Worker sends a records zip, the browser fetches photos in parts through a proxy, one tap per part.
- The script split had dropped the ads pause from the home page. The ads layer now sits in the core.
- The cover build had switched Auto ads off. Reverted.
- The home page head still loaded AdSense before any consent choice. Removed, staged.

## Still open from earlier lists

Everything on the Notion page "TLL: everything waiting on Nancy (31 Oct)" still stands. The new sections at the bottom of that page carry the items above as tick boxes.

## Where the details are

- Phase 1: docs/tll-phase1-change-log-2026-11.md and docs/phase1-inventories-2026-11.md
- Phase 2: docs/phase2-design-inventory-2026-11.md and docs/phase2-a11y-audit-2026-11.md
- Phase 3: docs/phase3-usability-audit-2026-11.md and docs/usability-test-script-2026-11.md (a 20-minute script for three people)
- Phase 0: docs/tll-phase0-change-log-2026-11.md
- Every Webflow write: handoff/WEBFLOW-LOCK.md
