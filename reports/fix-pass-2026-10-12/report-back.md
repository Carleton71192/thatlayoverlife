# Fix pass report-back, 12 Oct 2026

Every change below is an unpublished edit; one full site publish by Nancy makes them live (the sitemap needs a full publish). Evidence for every item: `verification.md` and `verification-detail/`. Before/after copies of every code block: `applied/`. Running STATUS rows S43 and S47 to S53.

## 1. What changed

| # | Item | Change | Where | How Nancy checks after publish |
|---|---|---|---|---|
| 1 | /destinations links | Story card and both country tile links set to "current item" (they stored the template path) | /destinations, elements 37e35a86, 02ac7fa8, d363da1c; page script fallback stays | Denmark, Brazil, France tiles open their own pages; view source has no /detail_ |
| 2 | /for-expats | "All countries by flag" → /destinations; FIND falls back to /travelers; four placeholder desks hidden; apply section has a real anchor; finder reads your visible /travelers card; /travelers search reads ?country= | /for-expats elements + tll-expats-js-v1; /travelers tll-trav-search-js | Type Denmark in the finder: you appear as the expert; no "DESK OPEN" cards; "Claim it" jumps to the form |
| 3 | Dead buttons | /support: Ko-fi buttons, "Coming soon", "Price TBC", Ko-fi note hidden. Paw Passport: €9, price meta, "everyone who bought it" hidden | /support, /the-paw-passport | No href="#" button on either page; club section still there |
| 4 | Counts (partial) | "0/2490 of 249" text bug fixed; two scripts that wrote the visitor's own count over your 87 removed; /pets typed "22" removed | Home embed 438ddfc8, home footer code, Contributors footer code, /pets | Home passport reads "0/249"; logged in, the footer and other profiles keep their numbers |
| 5 | /submit (partial) | "Pre-launch" off /signup; "shelf" and "ledger" copy out; "Link a story you already published" | /signup, /submit strings | Text only; the restructure waits on the change log |
| 6 | Home first screen | Free line "Free to join. We're not a gym. No card, no paywall."; two buttons "Read the stories →" and "Build your free map"; "real names" out of the lede; "The shelf." → "The reading list." (eyebrow, hints, caption); search states no longer use newsletter copy | Home embeds 13326a8e, 94ce12c0, 8d306efc; lede and search strings | At 390x844 and 1440x900: free line and both buttons visible without scrolling |
| 7 | Measurement (partial) | Six consent-gated GA4 events in the existing site footer block; no other GA id found on the site | Site footer code (tll-ga4-events-v1) | GA4 DebugView: Accept all → events arrive; Reject all → nothing |
| 8 | Ad slot (partial) | "AD SLOT · IN-ARTICLE" aside removed from story HTML | Stories Template e1115818 | View source of a story: no "AD SLOT" |
| 9 | Current location | Profile "Currently in" line out of the HTML and cleared in the CMS; /travelers "Denmark · home base" | Contributors Template d3e97d53, CMS, /travelers | Your profile and /travelers show no current location |
| 10 | EXIF (partial) | Untrue "We strip EXIF" promises removed | /share-photos | Copy only promises what happens |
| 13 | Banned words | 35 lines on 13 pages (static text, SEO, OG), plus the guides' "THE LEDGER" → "THE RECEIPTS" | see `applied/banned-words-log.md` | Spot-check /stories, /about, /spotlight, /account |
| 14 | São Paulo | Tilde in the Pantanal search description | Stories CMS | Page description in a share preview |
| 15 | og:type | `og:type article` added to story pages (Fitz Roy duplicate was already gone) | Stories Template head | Facebook Sharing Debugger: which og:type it reads |
| 16 | Sitemap | map-2-preview, 191 Destinations items (incl. Tanzania), 5 Collections items, 3 thin pillars excluded | Sitemap flags | /sitemap.xml after the full publish |
| 17 | Pillars (partial) | Thin pillar pages (fewer than 3 stories) get noindex, except Stories From the Road and Paw Passport | Pillars Template footer script | View source of /pillars/travel-logistics: robots noindex |

Outside the 18 but asked today: Photo placement Plan B (S47), Pantanal jaguars plural (S48), US flags for Maine and Texas stories plus broken Vietnam, Zimbabwe and Curaçao flags (tllflagsv53 on /stories and story pages; same fix on /destinations).

## 2. Already fixed before today, or could not fix, and why

- Already fixed: Fitz Roy duplicate og:image (S40); /for-expats "Example text" and labels; /profile out of the sitemap; GA4 loads once and only after consent; /edit-profile already said "Home base"; La Paz never showed the hosted line (Disclosure empty).
- Could not fix by API, needs you in the Designer: hosted box conditional visibility (Stories is at its 60-field cap, so no Hosted switch can be added); pillar list filter "Pillar = Current Pillar"; hero images Load: Eager (no API setting); template-level sitemap off for Destinations and Collections; photo alt list (multi-image binding); the /submit Memberstack gate and Required flags.
- Blocked: three "shelf" messages in the /stories footer code and the Stories Template "on their way to the shelf" line with its matcher. The write was blocked by this session's permission check. Ready-to-paste blocks: `applied/*PROPOSED-AFTER.NOT-APPLIED.html`. Say the word and I'll apply them, or paste them in the Designer.
- Skipped by rule: "shelf" in the /login and /signup Memberstack success messages (data-ms forms are yours); /terms "doesn't ship" (legal); your bio's "Trip Ledger" (your words); site-wide footer `ledger()` strings (site code, proposal only).
- Waits on you: count rule and map fixes, Ko-fi links, newsletter name, /faq line, /submit restructure, EXIF option A upload target, guide answers, measurement clicks (GA Admin, Search Console).

## 3. Everything removed or hidden, by name

- /support: "Join on Ko-fi", "Or just leave a tip", "Coming soon · goes live with the Ko-fi page", "Cancel in one click on Ko-fi…", "Price TBC · USD 3 to 5 a month, or yearly".
- /the-paw-passport: "€9", "PDF · V1.0 · INCL. 25% MOMS · FREE UPDATES…", "…we reissue it to everyone who bought it."
- /for-expats: desks Lisbon, Berlin, Singapore, Mexico City.
- Home: hero buttons "Send your trip" and "Send a photo" (still in Chapter 02); hidden "0 of 249 places counted" duplicate; page script `__tllLiveCounts`.
- Contributors Template: "live stats binder" script; "Currently in" line.
- Stories Template: "AD SLOT · IN-ARTICLE" aside; script tllstoryinlinephotosv1 and tllflagsv52 unapplied (still registered for rollback).
- /stories: tllflagsv52 unapplied.
- /share-photos: "We strip EXIF if you pick anonymous", "(EXIF stripped, off the map)".
- /signup: "· Pre-launch".
- Sitemap: /map-2-preview, 191 /destinations/* items, 5 /collections/* items, 3 thin /pillars/*.

## 4. Every BLOCKER done, outreach can start?

**No.** Blockers 1, 2, 3 and 6 are done once published. Still open:
- 4 Counts: your map needs the five-each-way fix, then the public copy and footer wiring (footer step with you present).
- 5 /submit: needs your approval of `submit-change-log.md` and the Designer gate move.
- 7 Measurement: events are in; you still need the GA Admin cleanup and Search Console verification.
- 3 also needs your Ko-fi links before the money buttons come back (they are removed, not dead, so the blocker's "no href=#" test passes).

## 5. Outside the list (reported, not fixed)

- `marathon-on-all-7-continents` Disclosure reads "Paid for by the travelers"; the story label script probably shows a false "Reklame" label on it. Check that page.
- /for-brands and the footer link to /editorial-charter#rule-08, but rule 08 was removed (S17).
- The /share-photos form probably never delivers the files at all (plain Webflow form, not the File Upload element). One test submission confirms it.
- Ahrefs Web Analytics loads without consent (cookieless); the cookie policy should name it.
- Webflow still prints its default og:type "website" next to the new "article".
- Hosted scripts tll_saved_shelf and tll_ledger_sync can't be read from here; check them in preview for "shelf" or "ledger" text.
