# That Layover Life: UX and functionality review

**Date:** 8 October 2026
**Site:** https://www.thatlayover.life (Webflow site 69d6145cf421c777840c1e25)
**Author:** Claude Code, desk review for Nancy Carleton. Read-only: nothing was staged, published or committed.

## Scope and method

This is a heuristic evaluation against Nielsen's ten heuristics plus information architecture, visual hierarchy, functionality, content clarity, mobile, conversion paths, accessibility and crawl signals. Sources: the Webflow element trees of 14 key pages and the TLL Nav v1 component, site and page custom code, the forms list, the CMS collections, the handoff ledger (STATUS.md, rows A to J), the evidence screenshots under reports/evidence, and today's Ahrefs summary (health 78, 17 errors, 74 warnings, 72 notices; new today 9 orphan pages, 4 slow pages, 1 low word count page, 1 page with no outgoing links, 1 slow server response for AI crawlers).

What could not be checked: the live site is egress-blocked from this container, so nothing was loaded in a browser. Rendered contrast, focus rings, tap targets, Memberstack behavior when signed in or out, form submissions, 301 redirects set in Site settings, and the Ahrefs per-page lists (which pages are slow or orphaned) all need a live check and are marked as such. Counts below come from the CMS: one published writer (Nancy), eight published story items in the Stories collection (the brief says seven; the difference is one item published on 6 October), one pet, 19 draft stories and 7 draft contributor records that are not live.

## Summary: the five findings that matter most

1. **Members can hit dead ends on their own pages.** The profile tile "Stories you've sent in" links to /share, which is not a page. The ledger says the /share to /submit 301 is still waiting on Nancy (I02). The account page's Newsletter card points at "#". These are the two pages a signed-in member sees first.
2. **Two different "log your countries" systems are live or staged at once.** The live map editor on /the-map (B43, B45 done) and the Map 2.0 layered embed on /map-2-preview and in the staged account section. The preview page is public, orphaned, and now noindexed. A member who finds both will not know which one counts.
3. **The signup page shows typed numbers that do not match the site.** The brand column reads "1 Travelers · 9 Countries · 6 Stories · 1 Pets" as static strings while the home and stories pages count from data. This is the trust page.
4. **Every page carries about 75 KB of inline custom code plus 15 applied scripts and two analytics tags before the content paints.** That is the most likely driver of the 4 slow pages flagged today and the mobile PageSpeed Performance 57 the ledger records (A10). Ahrefs Analytics also loads before consent while GA4 waits for it.
5. **Forms have unlabeled or duplicate field names that make submissions hard to read and inputs hard to label.** Edit profile sends 18 fields all named "field" and 5 named "Checkbox"; Share Your Story includes "Field 3", "Field 4" and "Checkbox 2"; signup and login inputs share the id "field", so label-for associations cannot work.

## Findings by severity

### Critical (blocks a visitor or a member from a goal)

**C1. Profile: "Pen or review →" tile leads to /share.**
Page: /profile (members only). What a visitor hits: the YOUR SUBMISSIONS tile ("Stories you've sent in. Drafts, pending review, published.") links to /share; no page with that slug exists in Webflow, and the 301 is in the ledger as Blocked (I02). Why it matters: it is the main writing entry point on the member's own page, and it promises drafts and review states that do not exist yet. Fix: point the tile at /submit now, and reword the copy to what is true today ("Share a story. The editor replies within 48 hours."). Effort: Quick. Who: Claude can stage; the 301 itself is Nancy in Site settings. Needs a live check first: if a /share redirect already exists, this drops to Medium.

**C2. Account: the Newsletter settings card goes nowhere.**
Page: /account. What a visitor hits: a card labeled "Newsletter. It lands when a story earns it. Manage your subscription. Preferences →" with href "#". Why it matters: a visible promise of control with no control behind it (heuristic 3, user control; heuristic 9, honest recovery). Fix: link it to /newsletter until a real preference exists, or hide the card. Effort: Quick. Who: Claude can stage.

### High (hurts conversion or trust)

**H1. Signup stat strip is hand-typed.**
Page: /signup. Evidence: the 30 September form notes record "1 Travelers · 9 Countries · 6 Stories · 1 Pets" as static strings; the CMS today has 8 published stories. Why it matters: the signup page is where a visitor decides to trust the site; a wrong count next to "Every byline a real person" undercuts the line. Fix: bind the strip to the same counts script the home page uses (tll-live-stories-v1 / tllstorycountv2) or remove the strip. Effort: Quick. Who: Claude can stage. The page also states no member benefit beyond the tagline; one line (log countries, keep a passport, share a story) would help conversion.

**H2. Two country-logging systems.**
Pages: /the-map (live editor, published 7 October), /map-2-preview (public, noindex staged today, orphan per Ahrefs), and the staged "My map" section on /account that embeds Map 2.0 (commit 7b4a88d, unpublished). Why it matters: once the account section publishes, a member will see one map on /account and another on /the-map, with different pin rules and share bars. Jay's first-login feedback (B43) shows new members already struggle to find the one way in. Fix: decide the cut-over date, keep one editor reachable from account, profile and map, and keep the other behind noindex until then. Effort: Big. Who: Nancy decides; Claude stages.

**H3. Page weight and script load.**
All pages. Evidence: site head custom code 48.9 KB, site footer 25.7 KB, 15 applied site scripts (map, reader notes, saved shelf, avatar and others load on pages that do not use them), GA4 and Ahrefs Analytics in the head, Google Fonts, d3 and world-atlas via jsDelivr. Ahrefs flagged 4 slow pages and 1 slow server response for AI crawlers today. Why it matters: mobile Performance 57 (A10) on a photo-led site; the hero is the first thing a visitor waits for. Fix: move page-specific scripts (map, reader notes, saved shelf, avatar) off the site level onto the pages that use them; defer the Ahrefs tag until after consent; collapse the older style layers (tll-craft-polish, tll-proto-type-v1, tll-consistency-v1) that v9 chrome now overrides. Effort: Medium. Who: Claude can stage the script moves; Nancy approves which old layers retire. Needs a live Lighthouse run to confirm which 4 pages are slow.

**H4. Forms with unreadable or unlabeled fields.**
Pages: /edit-profile (18 inputs named "field", 5 named "Checkbox"), /submit (fields "Field 3", "Field 4", "Checkbox 2", plus a 35-field form on one page), /signup and /login (all inputs id "field"). Why it matters: Webflow inbox submissions arrive as "field, field, field", so a story or profile change cannot be read without the page open; duplicate ids break label-for and screen-reader naming (WCAG 1.3.1, 4.1.1). Fix: give each input a unique id and a named inputName; keep every data-ms-* attribute untouched (rule A15). Effort: Medium. Who: Claude can stage; Nancy confirms the Memberstack form still saves.

**H5. Search on home and on Stories do not share a parameter.**
Pages: / and /stories. Evidence: the home "Library search" form submits GET to /stories with the input named "Search the library"; the Stories page search input is named "q" and the clear link points at /stories. Why it matters: a search typed on the home page may land on /stories with no query applied. Fix: rename the home input to "q" (inputName only). Effort: Quick. Who: Claude can stage. Needs a live check to confirm the mismatch.

### Medium (friction)

**M1. Page header pushes the title below the first screen on phones.**
Pages: every page except home and story pages. Evidence: reports/evidence/v9-b/departures-v2-stories-390.png and -about-390.png show the Ink header (wordmark, eyebrow, "The Library", one-liner) taking the first 210 px before the Playfair H1 begins. Nancy already found the v1 board too busy and picked option 2 (J11). Why it matters: on a 390 px phone the H1 and lede arrive after a scroll; the one-liner repeats the H1's job. Fix: drop the one-liner on phones, or let the header collapse to eyebrow plus title. Effort: Quick. Who: Claude can stage.

**M2. Mobile nav menu set needs a live check.**
Evidence: the nav component holds Stories, Destinations, Paw Passport, About, Share your story, Log in, Sign up, and the member avatar; Travelers is hidden. B00 records the phone Log in link was hidden by two style rules and fixed; the fixture render (design-2026-09-30/v9-nav-open.png) shows a menu without Paw Passport or About. Fix: confirm on a phone that all five links and Log in appear under MENU. Effort: Quick. Who: Nancy on a phone, or Claude after publish with verify-live.

**M3. Newsletter forms without consent copy, one with target _blank.**
Pages: /stories (bottom form, method GET, target _blank), /newsletter. Evidence: form notes 30 September: no consent sentence, no privacy link, no double opt-in mention. Why it matters: a GDPR-facing site from Copenhagen should say what the email is for; target _blank on a Webflow form can open a blank tab on submit. Fix: one line under the field ("One email when a story lands. Unsubscribe in one click.") with the privacy link; remove target _blank. Effort: Quick. Who: Claude can stage.

**M4. Elements that look clickable but are links without href.**
Pages: /signup and /login ("Continue with Google", a Link with data-ms-auth-provider and no href), /the-map (fullscreen link, no href), /account ("Email and password" card, href "#", data-ms-modal). Why it matters: an anchor without href is not in the tab order; the J02 script only adds tabindex to role=button. Fix: give these role="button" and tabindex="0" or make them real buttons; Memberstack reads the data attribute either way. Effort: Quick. Who: Claude can stage; needs a live keyboard pass.

**M5. /countries forwards with a meta refresh and a script, not a 301.**
Page: /countries. Evidence: page head has canonical to /destinations, meta refresh 0, and location.replace. Why it matters: crawlers still see a 200 page that forwards; Ahrefs will keep counting it, and the 2 October crawl already listed canonical-to-redirect warnings on www pages. Fix: the Site settings 301 Nancy set a reminder for; then remove the meta refresh. Effort: Quick. Who: Nancy in Site settings.

**M6. Orphan and thin pages.**
Ahrefs reports 9 orphan pages and 1 low word count page today; /map-2-preview is the likely new one (noindex now staged, page tree is one div plus one embed). Member-only pages (/my-passport, /edit-profile, /my-pets) and /spotlight, /pets and /newsletter are likely candidates. Fix: pull the orphan list from Ahrefs Site Audit, then either link each from a sensible parent or noindex it. Effort: Medium. Who: Claude can prepare the list; Nancy approves.

**M7. Heading order.**
/submit and /profile each hold two H1s (one per member state); /contact places the relay H2 after three H3 door titles; /about has 13 headings with an H2 then H3 run from an older section. Why it matters: screen-reader users navigate by headings; two H1s read as two pages. Fix: make the second H1 an H2 with the same style class. Effort: Quick. Who: Claude can stage.

### Low (polish)

**L1.** Home carries a hidden story-hero block (tll-shero, visibility off) whose CTA links to a draft story (/stories/sofia-88-bulgaria-plum-brandy). Not rendered, but a dead link waiting to be switched on. Remove or repoint.
**L2.** Stale href custom attributes sit on links whose settings point elsewhere (home and account "/share" vs /submit; map "/my-passport" vs /account; profile "/u/me" vs /edit-profile). Webflow renders the settings link, but the stale attributes confuse the next audit. Clean them.
**L3.** Footer stats line still reads a typed "6 stories" (B41). Bind or remove.
**L5.** 7 draft contributor records named "Expat Placeholder · Tokyo" and similar sit in the CMS. Not live, but delete before anyone publishes the collection by accident.
**L7.** Focus ring, reduced motion and skip link are in the v9 chrome layer (J03, J04, J09) and published 6 October; the ledger still owes the live contrast crops (A16, J05). Needs a live check, not a change.

## Prototype parity (STATUS rows B00 to B46)

| Screen | Status | Most important open item, in Nancy's words from the ledger |
|---|---|---|
| B00 Global nav | Partial | "Left: the rest of the screen 00 nav check with Nancy." |
| B01 Home | Partial | "Left: shelf photo cards (design-spec note), the map headline logged-in variant, the writer count and shelf count bound to data." |
| B02 Stories index | Partial | "Most read = OPEN SLOT until the read counter exists." |
| B03 Story detail | Partial | Been here / Want to go live; Sponsored box shows only when Disclosure starts with "Hosted". Live check owed. |
| B04 Travelers | Partial | "2.0 Cream hero staged unpublished… awaiting Nancy's go." |
| B05 Paw Passport hub | Partial | "Ko-fi button disabled with the Coming soon note" (I10, price and link waiting on Nancy). |
| B06 About | Partial | Published; facts row and founder bio live. Live check owed after v9 type. |
| B07 Pen a Tale | Partial | Three steps live; Write/Link fork live; Platform and Gated fields blocked at the 60-field cap (C10). |
| B08 Travel Wire | Partial | "no blogs on the wire yet" (honest open slots). |
| B09 Editor desk | Partial | "Nancy creates the admin-assigned Editor plan in Memberstack and its id goes into EDITOR_PLANS." |
| B10 Country page | Partial | "Quick answers as an honest OPEN SLOT (no answers exist yet)." |
| B11 Public profile | Partial | Template now bound to CMS; "Find {name} elsewhere" block reads older URL fields (C15). |
| B12 Edit profile | Partial | Memberstack form untouched; designation cards link to Apply mailtos. |
| B13 Spotlight | Partial | "Staged 29 Sep 2026, not published (awaiting Nancy's go)." |
| B14 FAQ | Partial | "FAQPage schema in the page head to be checked for the same two words." |
| B15 Support + Layover Club | Partial | "Price TBC, Ko-fi buttons rendered but disabled… until Nancy sends the Ko-fi link." |
| B16 For expats | Partial | "groups and resources columns show honest empty states, no data source exists yet." |
| B17 For press | Partial | "the 'Person schema included' clause left out until verified." |
| B18 For affiliates | Partial | "no amber text class exists on the site yet." |
| B19 My pets | Partial | Staged, awaiting Nancy's go; shared pet across two members is B44. |
| B20 Public Paw Passport | Partial | "hardcoded badges… hidden (no data behind them)." |
| B21 Pets index | Partial | "the roster is still a static card, not a CMS list." |
| B22 The Map (chrome) | Partial | "Awaiting her screenshot" of the preview after the dist fix (8 Oct). |
| B23 Editorial charter | Partial | "Needs Nancy: approve the rule" 08 (I11). |
| B24 Community guidelines | Partial | Staged, awaiting Nancy's go. |
| B25 Privacy + Terms | Partial | "legal wording is Nancy's call." |
| B26 Forgot password | Partial | Submit keeps its current label, not "Send the magic link". |
| B27 Contact | Partial | Door emoji icons: "a design call for Nancy." |
| B28 Cookies | Partial | "live check after publish that the preferences link reopens the CookieConsent panel." |
| B29 Share photos | Partial | Staged; EXIF line kept true to what the form does. |
| B30 Story share card / OG | Blocked | "Blocked on Nancy deciding whether that service is wanted now." |
| B31 Style guide | N/A | Reference only. |
| B32 Directory boards | N/A | Reference only. |
| B33 Answer guides | Partial | "DRAFT banner… kept until Nancy checks" (D07). |
| B34 Layover Awards | Partial | "the Award Nominations collection is not written automatically yet." |
| B35 For brands | Partial | "the screen's Denmark hero photo is not used." |
| B36 404 | Partial | "live check after publish that an unknown URL serves it." |
| B37 Login + Sign up | Partial | Consent block done; stat strip still typed (H1 above). |
| B38 Account | Partial | "WRITTEN and SNAPPED still have no per-member source." |
| B39 The Layover Lounge | Partial | "All frames currently by Nancy"; Japan tile OPEN SLOT. |
| B40 Destinations | Partial | "Left for Nancy: the real 301 in Site settings." |
| B41 Global footer | Partial | "Not changed: the footer stats line (6 stories…)." |
| B42 Map: new member pre-filled | Done | "Verify: Jay logs out, logs in fresh, sees 0." |
| B43 Map: how to log countries | Done | Published 7 Oct; empty state, click a country, "Log a country". |
| B44 Shared pet across two members | Open (Blocked on build) | "Needs a shared record (Memberstack data table or the Pets collection) with co-owners." |
| B45 Map: Lived vs Visited | Done | Pin shape by depth plus legend, published 7 Oct. |
| B46 Travel companions | Open (future build) | "Design and consent rules to be written before build." |

Totals: Done 3, Partial 39, Blocked 1, N/A 2, Open 2 (of 47 rows B00 to B46).

## Roadmap

**This week (quick, Claude stages, Nancy approves each):**
- C1 and C2: repoint the profile submissions tile to /submit and the account Newsletter card to /newsletter; reword both to what exists.
- H1: bind or remove the signup stat strip.
- H5: rename the home search input to q.
- M3: consent line on both newsletter forms; drop target _blank.
- M7 and L1 to L3: second H1s to H2, remove the hidden draft-story block, clear stale href attributes, bind the footer count.
- Nancy: set the /countries and /share 301s in Site settings (M5, I02), then confirm on a phone that MENU shows all five links plus Log in (M2).

**Next two weeks:**
- H4: unique ids and named fields on edit-profile, submit, signup and login, with a signed-in save test after publish.
- M4: keyboard reach for the Google buttons, the map fullscreen link and the account modal card; then one manual keyboard pass on the five core routes (J02 owes this).
- H3 part one: move page-only scripts off the site level; gate Ahrefs Analytics behind consent; run Lighthouse on the 4 pages Ahrefs flags.
- M6: pull the orphan list from Ahrefs and decide link or noindex per page.

**This month:**
- H2: pick the cut-over from the live map editor to Map 2.0, publish one entry point from account, profile and map, retire the other.
- H3 part two: retire the pre-v9 style layers the chrome now overrides, and re-measure mobile Performance.
- Parity: clear the "awaiting Nancy's go" queue in one sitting (B04, B13 to B21, B23 to B29) so the staged pages stop drifting from live; then the decisions only Nancy can make (I05, I10, I11, I14 before public travel profiles go live).
