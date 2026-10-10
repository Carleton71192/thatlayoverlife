# Claude Code prompt: TLL site prototype 3.0 homepage

Context: That Layover Life (Webflow site 69d6145cf421c777840c1e25). Rebuild the homepage from the prototype. Keep live story content and Memberstack login untouched. Do not change anything outside the homepage in this pass.

Files in this folder
- TLL Site Prototype 3.0.dc.html: the source of truth. Open in a browser (needs support.js and image-slot.js beside it, images/ folder beside it). Homepage = the home screen.
- TLL Account v3.dc.html: account page reference (tabs, inline forms, edit profile at top). Read only for now.
- tll-system.css: shared stylesheet. Use its tokens and classes for every section; no one-off styles.
- Homepage 3.0 feedback 2026-10-09.md: Nancy's decisions and final copy.
- images/: every photo the prototype uses (magnus-holi-side.jpg is the Chapter 05 image).

Task
1. Rebuild the homepage sections in this order: hero (four actions: Read the stories, Send your trip, Send a photo, Build your map) / Klarna intro + pillar filter chips / pinned sideways story shelf / Search it / Chapter 02 contributor block with luggage tag / Chapter 03 passport stamps / Chapter 04 map "THE MAP, WITH RECEIPTS" / Chapter 05 Paw Passport / Chapter 06 Layover Lounge / Chapter 07 newsletter.
2. Shelf: bind to live Stories collection (first 8, newest first), rotate the starting story daily as on the live site, pillar chips filter it. Keep each card linking to its live story URL.
3. Use the exact copy in the prototype and feedback file. No em dashes. No invented facts.
4. No ticket strip at the top of pages. No boarding pass. No "Handle with opinions".
5. Dates: "19 September 2026" format. Teal text on light = #067A79; small rose text on light = #C8325B.
6. SEO/AEO/accessibility: one h1 (hero), h2 per chapter, descriptive alt text on every image, aria-pressed on filter chips, labelled search input, visible focus states, 4.5:1 text contrast, Organization + WebSite (with SearchAction) JSON-LD, unique title and meta description, canonical URL. Keep "library" in nav and title, not as a homepage section label.
7. Keep Memberstack attributes and existing login/account links exactly as live.
8. Publish to both custom domains and the webflow.io subdomain, then report what changed and anything you could not match.

Open points for Nancy
- "reply within 48 hours" in the contributor paragraph was changed to "review it within 48 hours" (kit rule). Confirm.
- "actually" appears once in the Klarna paragraph. Confirm.
- Slug flips /share and /gallery still pending her 301s.
