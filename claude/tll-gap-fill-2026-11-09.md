# Claude Code prompt: close the Prototype 3.4 gaps (9 Nov 2026)

Run this AFTER claude/tll-cc-blockers-2026-11-09.md has been handed back and Nancy has published it. Paste into Claude Code with the Webflow MCP connected to the That Layover Life site. Put the prototype next to it: claude/TLL Site Prototype 3.4.dc.html (open any screen with `?screen=<id>`; ids are given per packet below).

You are working on thatlayover.life (Webflow). Read these first and follow them: claude/tll-build-principles-2026-10-31.md, claude/tll-privacy-guardrails-2026-10-19.md, claude/tll-p0-recheck-<latest>.md, and this file. Site contracts that hold throughout: do not touch the nav or footer components except where a packet names the exact link; all counts bind to tllStates or the Stories collection, never hardcoded; type stays Playfair Display 800 headlines, IBM Plex Sans Condensed body, JetBrains Mono eyebrows; US spelling; no em dashes anywhere, including placeholders; never use "ship", "ships", "ledger", "no filler" or "truth over polish" in copy. Work in Webflow drafts, keep a change log of every element touched, verify each packet in a browser at 1280 and 390 px before moving on, and stop before publishing: Nancy publishes.

Source of truth for copy and layout is the prototype screen named in each packet. Copy is verbatim from the prototype unless this file says otherwise. Where the prototype shows a prototype-only control (VIEW AS chips, "PROTOTYPE · ALL SCREENS", sample numbers) leave it out.

## 0. Decisions Nancy has made (do not ask again)

- Ko-fi product URL for the €9 Paw Passport field guide: ____________ (Nancy fills in; if blank, stop at packet 6 and ask)
- Newsletter name: ____________ (Gate Change / Window Seat / Long Way Round; if blank, keep "The Layover Letter")
- Spotlight and Awards footer links: [ ] remove from footer [ ] build the pages (packets 17 and 18)
- Submit v4: [ ] build now (packet 21) [ ] defer, leave the live form
- /gallery: [ ] keep the URL [ ] 301 to /the-layover-lounge

If a box is unticked, treat it as "ask Nancy" and skip that packet; do not guess.

## Phase B: cheap fixes on live pages (do all of these first, one change log section per page)

### 1. /stories (`?screen=stories`)
- H1 count binds to the Stories collection count in words; today it reads "Six stories" against 60 items.
- Region pills: add Asia and Oceania (prototype order: Everywhere, Europe, Africa, Americas, Asia, Oceania, Antarctica). Keep the Thailand stub out of the list (blocker 6 should already have drafted it; confirm).
- Check: pills filter, count matches visible cards.

### 2. /share-photos (`?screen=sharephotos`)
- Replace the seven default Webflow labels ("Form Label · This is some text inside of a div block") with the prototype's 01 YOUR PHOTO / 02 THE STORY / 03 YOUR CREDIT / 04 THREE PROMISES copy. Promises stay three separate boxes, never pre-ticked.
- Check: no label reads "Form Label"; form submits to the same endpoint as before.

### 3. /submit (live long form, until Submit v4 is decided)
- Placeholders: remove "#TheTripLedger" from the hashtag example; replace with a hashtag that passes the word list. Remove any other banned word in placeholders or helper text (search the page for "ledger", "ship").
- Check: page text contains none of the banned words.

### 4. /for-expats (`?screen=forexpats`)
- Location Expert form: two inputs are both `name=field`; give the second ("Where you already write") its own name so submissions do not overwrite each other.
- Check: submit a test entry in the Webflow form test mode; both values arrive.

### 5. /faq (`?screen=faq`)
- Add the sixth prototype entry "Who reads my submission?" with its answer ("Nancy. An AI tool flags typos and em dashes first; a human makes every decision."). Keep the live affiliate-links entry; the page then has seven.

### 6. /the-paw-passport guide block (`?screen=paw`, lower half)
- Complete the sales block: IN THE GUIDE ticks, price line "€9 PDF · V1.0 · INCL. 25% MOMS · FREE UPDATES WHEN THE RULES CHANGE", the Regulation (EU) 2026/131 note, the "Not legal or veterinary advice" line. Buy button uses the URL from section 0, opens in a new tab. The homepage "Get the guide · €9" link points at the same URL (blocker 5 may already have done this; confirm, do not duplicate).
- Remove the leftover "ships" string from the page script.

### 7. /editorial-charter (`?screen=charter`, anchor `paid-work`)
- Add the Rule 08 section "Paid work, in plain view" (A to F) with "CLIENTS SO FAR: NONE. THIS LINE UPDATES THE DAY THAT CHANGES." The prototype marks it DRAFT, NANCY TO APPROVE: build it in draft, flag in the change log, do not publish text Nancy has not read.
- /for-brands: make "WHAT IS NEVER FOR SALE" link to /editorial-charter#paid-work.

### 8. /support (`?screen=support`)
- Add the DATA door "Export my data · SENT WITHIN ONE MONTH" as a mailto with subject EXPORT. Keep the six-door layout: swap in for whichever of the current six Nancy names in the change log; if she has not, add it as a seventh and flag it.

## Phase C: feature packets on existing pages (in this order)

Paw Passport comes first. Nancy prefers the prototype to what is live, so packets 9 and 10 are a rebuild from the prototype, section by section, not a patch of the live page: anything on the live hub, pet page or My pets form that the prototype does not have (the 1-2-3 steps, "3 Years", the logistics cards, the live species list) is removed, and the live layout is not a constraint. Keep the live CMS slugs and the Magnus item; everything else follows the design.

### 9. /the-paw-passport hub (`?screen=paw`)
- Upper half: H1 "Scroll. Melt. Repeat.", sub verbatim, species filters (ALL / DOGS / CATS / SMALL & BRAVE / BIRDS & REPTILES), photo wall with Magnus's tile ("SAMOYED · 13 COUNTRIES · 35 KG", count from CMS) and six OPEN SLOT tiles, dark ADD YOURS tile to /my-pets, footer line "MORE PETS AS THEY REGISTER · SHUFFLED, NEVER RANKED" + "Add your bestie →".
- Lower half: the guide sales block as built in Phase B packet 6 sits here; do not duplicate it.
- Check: filters work with one pet; an empty species shows "No {species} registered yet. The slots below are waiting."

### 10. /pets/{slug} and /my-pets (`?screen=pawpassport`, `?screen=mypets`)
- Pet page: eyebrow "PAW PASSPORT · SAMOYED · 35 KG", stats row (13 COUNTRIES / 1 TRANSATLANTIC FLIGHT / 35 KG OF OPINION, from CMS), "↗ Share Magnus's card" (hooks into the share cards packet), bio, "SUPERVISED BY Nancy Carleton →", country flags, THE SCENES, STORIES FEATURING MAGNUS, FOLLOW MAGNUS with the empty state "No accounts linked yet. The human adds them from My Pets.", THE PACK with six slots, "← ALL THE PETS".
- My pets: form "NEW PET · REGISTRATION" exactly as the prototype: NAME, SPECIES · BREED OPTIONAL with the prototype's four species, EU PET PASSPORT Yes / Not yet, COUNTRIES CROSSED TOGETHER as a country search with Enter to add (not a comma field), THEIR OWN ACCOUNTS link rows hidden until switched on, THE SCENES eight opt-in tiles with Drop a photo slots, THE PACK invite row ("PENDING REQUESTS STAY HIDDEN · A FRIEND CAN LEAVE THE PACK ANYTIME"). New CMS fields (scenes, pack, eu-passport, transatlantic-flights) listed in the change log for Nancy to add; bind once they exist.
- Check: /pets/magnus-waffles matches the prototype screen at 1280 and 390 px; the registration form submits with an empty scenes set.

### 11. Story template (`?screen=story`)
- Add THE RECORD block (the prototype calls it a ledger; do not use that word in the UI): SUBMITTED BY / EDITED BY / TRIP / PUBLISHED / LAST UPDATED / WHAT IT COST / SOURCES / DISCLOSURE, each bound to a CMS field; missing values render "Contributor to add". Add the "EDITED {date} · WHAT CHANGED" line bound to the CMS updated date. New CMS fields needed: cost, sources, what-changed. List them in the change log; Nancy adds the fields, you bind them.
- Add the swear toggle (AS WRITTEN / FUDGE MODE) only if a CMS field `swear-count` exists; otherwise skip and note it.
- Check: /stories/kilimanjaro-someone-was-already-awake shows the block with "Contributor to add" where fields are empty.

### 12. /travelers (`?screen=travelers`)
- Expert cards: add HOME BASE / HAS LIVED IN flag rows, ASK ME ABOUT tags, stats (COUNTRIES "n + AQ", STORIES, PLACES) bound to the member's tllStates, never typed.
- Add the open-slot cards in each section with the prototype CTAs (Join the Travelers, Claim the desk, Become a location expert, Apply as press, Submit a trip, List yourself, For brands, Register a pet) and their targets.
- Check: no card shows a hardcoded number; search still finds "Magnus".

### 13. /for-expats (`?screen=forexpats`)
- Add OPEN DESKS · 4 CITIES, PLUS YOURS (Lisbon, Berlin, Singapore, Mexico City, each "CLAIM THIS DESK →" to the apply form) and the FORMERLY OF block. Add the sticky BY COUNTRY rail only if it fits at 390 px without covering the form; otherwise leave it out and say so.

### 14. Share cards (`?screen=map`, `?screen=profile`, share modal `shr`)
- Build the share modal once as a component: styles PHOTO / MAP / STAMP / BOARDING PASS / FLAGS, formats STORY 9:16 / POST 1:1. Wire it to "Share my map" (/the-map), "Share my stats" (profile), "Share Magnus's card" (pet page). Numbers come from tllStates.
- Check: a card renders with the member's real count and no sample numbers.

### 15. /contributors/{slug} (`?screen=profile`)
- Add "Share my stats", the PLACES "n / 249" stat, and the "Where {First} has been" embedded map (public mode) with the LIVED / STAYED / LAYOVER legend and "OPEN THE FULL MAP →". Fix the Countries stat rendering 0 before script runs: show a dash until the count arrives, never 0.

### 16. /account and /edit-profile (`?screen=account`, `?screen=editprofile`)
- Add "VIEW MY PAGE ↗" to the member tab bar and "View as visitor" on edit profile. Add the YOUR EXPAT DESKS block only if Nancy approved the `expat-desks` field (CC-FINISH F1); otherwise skip and note.
- Per-story stats panel: do not build until an analytics provider is chosen; leave the empty state "Numbers show up here once the first readers land."

## Phase D: new pages (deferred per BETA-READY; build only the ones ticked in section 0)

17. Spotlight (`?screen=spotlight`) at /spotlight, or remove the footer link.
18. Layover Awards (`?screen=awards`) at /awards, or remove the footer link. Window is marked PROPOSED; confirm dates with Nancy.
19. The Layover Lounge postcard wall (`?screen=gallery`) on /gallery, with the ADD YOURS tile to /share-photos; 301 /gallery to /the-layover-lounge only if ticked.
20. Colophon (`?screen=colophon`) at /colophon, and add it to the footer Legal column (the one footer change in this file).
21. Submit v4 (`?screen=submit4`) replacing the live /submit form. Largest packet; needs autosave and publish-on-send decisions. Only if ticked.
22. Not now: Contribute hub, Answer guides (DRAFT, unchecked sources), Travel Wire RSS, Editor's desk, Junk Journal, For Affiliates page. List them in the hand-back as "designed, not built, awaiting beta" and do nothing.

## Acceptance (run before handing back)

In an incognito browser: every page in Phase B and C renders at 1280 and 390 px with no console error; no banned word appears in page text or placeholders (grep the published HTML of each touched page); no number on a touched page is hardcoded (toggle tllStates in localStorage and watch it change); the blocker fixes from the 9 Nov run have not regressed (consent, Cookie settings, /visits 404, /contact without relay form, Thailand stub gone, /support H1, New Orleans label, Kilimanjaro search). Write the results into claude/tll-gap-recheck-2026-11-<date>.md as a table (packet, pass/fail, note) and a change log of every Webflow element and CMS field touched, grouped by page.
