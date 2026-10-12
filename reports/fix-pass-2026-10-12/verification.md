# Fix pass, 12 Oct 2026: verification of the 18 items

Read-only check from Webflow data (Data and Designer APIs, CMS, page and site code). This container cannot load the live site, so "live" means what the published Webflow data will render. Full evidence, element ids and proposed fixes per item: `verification-detail/A.md` (items 1, 3, 8, 11, 12), `B.md` (2, 9, 10, 13, 14), `C.md` (4, 5, 6), `D.md` (7, 15, 16, 17, 18).

Status at verification, before any edit today:

| # | Item | Found | Key evidence | Fix route |
|---|---|---|---|---|
| 1 | /destinations /detail_ links (BLOCKER) | Partly fixed (S43 script staged), raw links still /detail_ | Card 37e35a86, tiles 02ac7fa8 / d363da1c stored `collectionPage → detail_*` | API: set link to `{mode: collectionPage}` (current item), same as working Countries cards |
| 2 | /for-expats (BLOCKER) | Partly fixed (Example text gone, labels connected) | Flag link → /stories; FIND = #; 4 placeholder desks visible; finder reads a hidden /travelers card; apply anchor only exists via JS | API: links, hide desks, DOM id; finder script selector edit |
| 3 | href="#" and money buttons (BLOCKER) | Partly fixed | /support Ko-fi buttons 0744a87c / d46a4f20 still visible on #, plus "Coming soon", "Price TBC", Ko-fi cancel note; Paw Passport still shows €9, price meta, "everyone who bought it". Home: no # links in data (only the footer cookie link, which is wired). | API: hide until Ko-fi/Gumroad URLs exist |
| 4 | Counts (BLOCKER) | Still broken | No single source. "0/2490 of 249" = three unspaced nodes in home embed 438ddfc8. Map rule says Nancy 85 (Lived + Stayed), 87 only with 2 layover-only countries; Magnus 14 on the map vs 13 in CMS (Denmark). Two scripts write the viewer's own count over the footer's 87. /pets types 22. | Nancy decides rule and public source; API: markup fix, delete two writer scripts, /pets text; footer needs Nancy present |
| 5 | /submit (BLOCKER) | Still broken | Whole form behind a Memberstack members-only block; 10 required inputs (+5 for email sign-up); "Pre-launch" is on /signup, not /submit; "shelf"/"ledger" copy | Restructure needs a change log Nancy approves and a Designer step for the Memberstack gate; small text edits by API |
| 6 | Home first screen (BLOCKER) | Still broken | Four hero buttons (embed 13326a8e); "real names" in lede; "The shelf." in embed 94ce12c0 and caption in 8d306efc; search success text was newsletter copy; protected "Free to join. We're not a gym." is not on the site verbatim | API for buttons, lede, search states; Nancy picks free line and shelf rename |
| 7 | Measurement (BLOCKER) | Partly fixed | G-T1K83PRL1R once, consent-gated (CookieConsent), Webflow GA4 field empty; no other GA id on the site; no events; no Consent Mode; no Search Console tag. Second GA4 property exists only in GA (under Lub Bub). | Nancy: GA Admin, Search Console (DNS), OK for events in existing site footer vs new script |
| 8 | Hosted line and AD SLOT | Still broken | Hosted box 578a8d42 is in every story's HTML, shown by script when Disclosure starts "Hosted"; ad aside e1115818 hidden by CSS only. La Paz Disclosure empty, so never shown. Stories is at 60 fields, so no Hosted switch can be added. | API: hide ad aside; Nancy in Designer: conditional visibility "Disclosure is set" on the hosted box |
| 9 | "Currently in" → home base | Partly fixed | /edit-profile already "Home base"; Contributors template block d3e97d53 bound to currently-in (Nancy: "Currently in Copenhagen, Denmark · filing weekly"), hidden by CSS only; /travelers "Denmark · now" | API: hide block, "home base" on /travelers; Nancy: clear the CMS line |
| 10 | EXIF GPS on /share-photos | Still broken | Plain Webflow form, file input, no processing; page promises "We strip EXIF" | Options for Nancy (canvas re-encode, Uploadcare, Worker, or editor process); remove the false promise now |
| 11 | Footer guides | Still broken (pages are drafts, so 404) | Both have DRAFT boxes, noindex, "THE LEDGER", "Draft, not yet checked", Copenhagen has €9 and a source label mismatch | Nancy checks answers; then API edits and draft off |
| 12 | /faq paid-tier line | Still broken | String 3c2a38a0…5a3c + the same text in the page FAQ JSON-LD | Nancy picks wording (the proposed line mentions Ko-fi, which is being removed) |
| 13 | Banned-word sweep | Still broken | 32 static or SEO hits plus 4 scripts (ship on /travelers, /terms, /spotlight; shelf, ledger, counted by hand) | API for non-legal static text; legal pages, CMS stories, nav and footer need Nancy |
| 14 | São Paulo tilde | Still broken | Pantanal seo-description "Sao Paulo" | API |
| 15 | og:image and og:type | Fitz Roy duplicate already fixed (S40); og:type still "website" on stories | Stories Template head has no og:type | API: add og:type article to template head |
| 16 | Sitemap | Partly fixed (/profile already out) | map-2-preview, 191 Destinations items incl. tanzania, 5 Collections items still in | API item/page flags (live after a full publish); Nancy in Designer: template-level Sitemap off |
| 17 | /pillars/* | Partly fixed (client-side filter only) | List filters Status only; script hides other pillars; no noindex; counts 26/1/1/0/0 | Nancy in Designer: filter Pillar = Current Pillar; decide noindex all or thin four |
| 18 | Story hero Eager | Still broken | Stories hero 8ab51244 and Countries hero e1e1be5d expose no loading setting through the API | Nancy in Designer: Load Eager on both |

What was changed after this check is in `report-back.md` (the table the fix-pass prompt asks for).
