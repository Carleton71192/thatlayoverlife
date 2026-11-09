# Claude Code prompt: the sponsor and contributor deal (designer, sponsor, pro-blogger readiness)

Paste into Claude Code with the Webflow MCP, Memberstack MCP and Google Drive access (TLL brand kit folder). Run after claude/tll-p0-fix-prompt-2026-11-09.md and claude/tll-investor-readiness-build-prompt-2026-11-09.md, because the media kit numbers come from the /ops dashboard built there. The design items overlap with claude/tll-design-review-2026-11-09.md; where they overlap, this prompt wins on scope and that one wins on specifics.

You are making thatlayover.life (Webflow, Memberstack, Cloudflare) credible to three professional readers: a designer deciding whether to contribute photos, a sponsor (hotel chain, tourism board, agency planner) deciding whether to buy, and a professional travel blogger deciding whether to publish here. Each is asking "is this a serious operation?" in their own dialect. Read claude/tll-build-principles-2026-10-31.md, claude/tll-privacy-guardrails-2026-10-19.md and claude/tll-value-playbook-storm-2026-10-29.md first and follow them. Site contracts: nav and footer components untouched; counts bind to tllStates; type is Playfair Display 800 / IBM Plex Sans Condensed / JetBrains Mono; US spelling; never use "ship", "ledger", "no filler" or "truth over polish". Voice: the best-traveled friend in the group chat who is also a comedy writer; full sentences in body copy, punch only in headlines, buttons and eyebrows. Work in Webflow drafts, keep a change log, and stop before publishing: Nancy publishes, and she approves every price and every term before it goes live.

Five workstreams, in order. Each has a definition of done.

## 1. Write the deal once

Today the contributor deal is worded six ways on six pages (/submit, /faq, /editorial-charter, /community-guidelines, /terms, /for-affiliates). Pick one truth and bind it.

- Create a single CMS collection "Site facts" with fields for: review timing, response times (editorial, takedown, press, partnership), rights statement, byline and link policy, AI-assistance rule, photo-use rule, pay statement, age minimum, publish behavior (live on pass, editor reads after). Every page that states any of these pulls from the collection. No hardcoded versions remain.
- Current values to seed (Nancy confirms): stories publish the moment they pass the submission rules and the editor reads every one after; editorial reply within 48 hours; takedowns and safety within 4 hours; press within 3 business days; contributors keep copyright and grant TLL a non-exclusive license to publish and promote; byline links to the contributor's own site with a do-follow author link plus up to two in-story links the author controls; AI may suggest grammar and structure and add tags and reading time, never rewrite, and the author writes headline, excerpt and quotes; photos are cleaned up, never altered; unpaid for now, with the perks listed; 16+.
- Done when: a grep of the published site finds each fact stated in one wording only, and the Site facts collection is the only source.

## 2. The contributor page, before the login wall

/submit is the main conversion URL and currently a login wall. Pro bloggers need the deal before they sign up.

- Rebuild /submit (logged out) as a landing page: H1 in brand voice, then the deal in plain language as six short blocks (what you keep, where your links go, how editing works, the AI rule, when it goes live, what you get). Then "Join free and submit" (filled rose) and "Log in" (outlined ink). The form itself stays behind login.
- Add "What you get" as a real list: do-follow author page with Person schema and your social links; a featured slot rotation; a mention in the newsletter when it exists; the press-trip board; photo cleanup; an editor who reads everything. Nothing promised that is not built; mark anything not yet live as "coming" with no date.
- Republishing: contributors may republish their story on their own site after 7 days with a canonical link to TLL, or ask for the canonical to point to their site if they published first. Implement a per-story canonical field in the CMS and explain the rule on this page.
- Contributor pages (/contributors/*): full bio, home base (city level only, per privacy guardrails), countries count, social and site links the contributor switched on, story list, "Human edited" mark on each story, Person schema with sameAs. Noindex contributor pages with zero stories.
- Done when: a logged-out visitor can read the complete deal on /submit without clicking, and a contributor page passes the Rich Results test as Person.

## 3. The sponsor kit: /for-brands, /for-press and the media kit

Sponsors need audience, proof and a menu within two minutes.

- /for-brands rebuild, in this order: one-line positioning ("Travel stories people read to the end, by people who actually went"), audience proof bound to the /ops dashboard (members, countries covered, stories, read-complete rate, newsletter size when it exists, plus the two segments nobody else packages: expats and people who travel with pets), three offers with starting prices (Nancy sets the numbers; use placeholders marked NANCY until she does): Sponsored story, Trip Kit placement, Press-trip coverage. Then the rules we do not bend: sponsor named and linked in a new tab, editorial control stays with TLL, receipts shown on every sponsored story, no political or off-brand placements. Then one worked example (see below), then a contact block with the partnership response time from Site facts.
- Sponsored story example: build one story in the CMS under a clearly fictional brand (invent a hotel name that does not exist; check it) marked "Example" in the eyebrow and noindexed, showing the "Reklame for [sponsor]" label, the receipts block with disclosure, and the in-story Trip Kit slot. Link it from /for-brands as "See how a sponsored story looks."
- Media kit: a downloadable PDF generated from the brand kit in Google Drive (Playfair, Plex, Mono; ink and cream; rose accent), 6 to 8 pages: who we are, the three pillars, audience (bound numbers exported at build time with the date stamped), segments, the three offers, the rules, two or three story examples with cover images, contact. Also a web version at /media-kit (noindex until Nancy says otherwise). Regenerate the PDF when the dashboard numbers move by more than 10%.
- /for-press: publish the /press draft as a real press room: short bio, two approved photos of Nancy (she chooses), logo files, boilerplate paragraph, story angles (expat life, pet travel, layovers, the human-edited model), recent coverage when it exists, press-trip sign-up (the existing gated flow, moved below the public content), and the press response time from Site facts. Repoint the footer "For press" link if needed. /press-kit and /media as 301s to /for-press.
- Done when: a planner can find audience, offers and rules on /for-brands in under two minutes without logging in, the example story renders the sponsor label correctly, and the media kit PDF opens from /for-brands.

## 4. Treat photos as content (the designer's test)

- Layover Lounge (/gallery): tiles at a real size (minimum 320px wide in a responsive grid), click opens the story-page lightbox with full-resolution image, caption, place label and a credit that links to the contributor page. Replace "NC" credits with full names.
- Story template: captioned photos in the flow every 4 to 6 paragraphs from the existing CMS image fields; figcaption in JetBrains Mono with place and credit; one full-bleed image per story at the opener with the washi place label; pull quotes in Playfair italic. Body column 560px at 18px (the design review's measure fix).
- Photo submission (/share-photos): show the contributor what they get (credit, link, size we display, where it appears), and a checkbox for "May TLL use this in sponsored or promotional contexts" defaulting to off.
- Done when: a Lounge photo can be clicked, read at full size, and its credit leads to the photographer's page.

## 5. Make the receipts the brand (all three readers)

- Receipts strip on story cards and in library search results: edited by, sources count, disclosure state (Self-funded, Hosted, Sponsored by X), last updated. Compact, JetBrains Mono, one line.
- "Human edited" mark: a small ink badge in Mono on every story card and story page, linking to the editorial charter.
- Article schema on every story with author, datePublished, dateModified, publisher, image and the sources as citations; sponsored stories carry `sponsor` in the schema and a visible label.
- Done when: a sponsored, a hosted and a self-funded story each show the correct strip on card, page and schema.

## Accessibility and consistency gate for every page touched

One button set (filled rose, outlined ink, text link with arrow, square corners), spec fonts only, labels on every form field, 4.5:1 contrast, keyboard focus visible, no scroll-reveal longer than 300ms, checked at 390px before 1440px with a screenshot in the change log.

## Hand back

Write claude/tll-sponsor-contributor-recheck-<date>.md with: the Site facts collection contents, screenshots of /submit (logged out), /for-brands, /for-press, /media-kit and the example sponsored story at 390px and 1440px, Rich Results screenshots for a contributor page and a story, the list of pages whose wording was replaced by bound facts, and the change log of every Webflow element and setting touched. List every NANCY placeholder still open (prices, photos, the fictional brand name, canonical rule confirmation).

## Out of scope

Payments to contributors, a self-serve sponsor booking flow, a newsletter platform, Trustpilot. These wait for the funnel data from the investor-readiness prompt.
