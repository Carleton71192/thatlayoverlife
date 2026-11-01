## Phase 1, speed and photos (added 1 Nov, staged, nothing published, Worker not deployed)

Change log: docs/tll-phase1-change-log-2026-11.md. Monday summary: docs/monday-summary-2026-11-02.md

- [ ] Allow www.thatlayover.life (and cdn.jsdelivr.net, cdn.prod.website-files.com, res.cloudinary.com) under this environment's Network access, so Lighthouse and axe can run before and after
- [ ] Deploy the Worker first (npx wrangler deploy), then say go for the publish of site layers 16.50.0 (registered and applied, waiting on a publish)
- [ ] Approve the /account Download everything strings: "Your copy is on its way.", "Download your photos", "Save part N of K", "Part N of K is ready to save.", "N photos in K parts."
- [ ] After the publish, on the subdomain first: home, a story page, /travelers, /the-map, and one Download everything with more than 25 photos on an iPhone
- [ ] A session for the fonts (Site settings) and the home page footer scripts (Turnstile, GSAP)
- [ ] Home page head: the pre-consent AdSense tag is removed and staged; it goes with the same publish

## Phase 2, design system and accessibility (added 1 Nov, audit only, nothing changed)

Docs: docs/phase2-design-inventory-2026-11.md, docs/phase2-a11y-audit-2026-11.md

- [ ] One cream: #FAF7F2 (the spec) or #F7F1E8 (the code and the Designer today)
- [ ] The rose for small text: headline-sized only, or #C8325B becomes the one text rose (the spec's two roses fail contrast on cream for small text)
- [ ] Primary button color: rose #D63859 with white (proposed) or teal with ink
- [ ] The magazine face: Newsreader (chosen 26 Oct) or Playfair (the spec)
- [ ] The wordmark: Syne in the wordmark only, per the spec, or keep the current faces
- [ ] A Designer session for the fonts, the variables, the eyebrow classes, the 1,050 inline-* classes and the template-kit leftovers
- [ ] Designer fixes from the accessibility audit: a main landmark on 7 pages, the footer h4 titles, the 84 shared field ids, the newsletter email label, the 9 to 11px classes to 12px

## Phase 3, usability (added 1 Nov, audit only, nothing changed)

Docs: docs/phase3-usability-audit-2026-11.md, docs/usability-test-script-2026-11.md (a 20-minute script for three people). Nav and footer variant: design/nav-footer-variant-2026-11/after-390.png and after-1440.png

- [ ] The review truth: "stories go live when sent and are read after" (the 19 Oct decision) or "within 48 hours"; one line everywhere
- [ ] The support promise: "A human writes back, usually the same day", plus one response-times line (editorial 48h, takedowns and safety 4h, press 3 business days)
- [ ] The newsletter name: the Sunday letter, Newsletter, or the dispatch; capture only until it has gone out two weeks running
- [ ] The member primary action in the nav: "My map" (the variant) or "Share your story" (today)
- [ ] Footer drops: the two draft guides, Spotlight, Awards (until December)
- [ ] A Designer readback of the nav and footer as they stand (the saved record is the 13 Oct export plus the 20 Oct note)
- [ ] Which label is live on /the-map for the member edit link ("Edit my destinations" or "Edit your countries on the map")
- [ ] Run the usability test with three people and send me the notes
