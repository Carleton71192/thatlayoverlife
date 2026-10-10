# Profile and Map 3.0: proposed changes for the public traveler profile, /profile and /the-map (for Nancy's approval)

Sources:
- handoff/claude-design-source/v3/: TLL Site Prototype 3.0 (screens `profile` and `map`, plus the `publicLinks`, `psVals`, `edLoad`, `edToggle`, `ED_SAMPLE` and `ED_LIVED` data in the script), tll-system.css, PROMPT.md, updates-10c/UPDATES.md (homepage interludes only, so nothing here for these pages), audit-2026-10-09.md, ../STANDING-RULINGS.md (Nancy's profile facts).
- The prototype's `map` screen opens with `<dc-import name="TLL Map Page">`. That component is not in the v3 folder, so the top of the map screen (map canvas and share bar) could not be compared. The prototype's own comment says "The map and share bar above are unchanged", so this proposal treats the live map and share bar as the 3.0 version and only adds what sits below them (Passport 2.0).
- The live Contributors Template (6a0b29c8a7b1840afe9390ab, /contributors/{slug}), the Profile page (69d61469f421c777840c204e, /profile) and The Map (6a0df81df4016d4f78cfb22a, /the-map), read on 10 October 2026: element trees, page head and footer code, applied page scripts, JSON-LD, SEO and OG settings, the Contributors collection schema (6a0b29c7a7b1840afe9390a5) and its 8 items.
- handoff/STATUS.md rows B11, B12, B22, B42 to B48, S01, S05, S08, S16, S17, S19, S20, S32, J14, J15; reports/copy-pass/2026-10-09-tll-copy-pass.md (sections 4, 6 and the Contributors template); reports/fix-first/item1-map-counter.md; map-2.0/CURRENT-EMBED.md and PHASE-5-NOTES.md.

Read only. Nothing has been changed in Webflow, nothing has been published, and Memberstack has not been touched.

## How it gets built

- **Same method as homepage 3.0 and Stories 3.0.** New HTML embeds go in, plus one namespaced style block per page: `p3-` on the Contributors Template, `pr3-` on /profile and `m3-` on /the-map. They use the tll-system.css tokens, copied in the same way home3.css copied them. tll-system.css is not loaded as a file.
- **Old parts are hidden, never deleted.** Every element ID, data-* attribute, form name, input name and CMS binding stays. The seven hidden legacy sections on the Contributors Template stay hidden.
- **Profile content stays bound to the CMS.** Nothing a contributor wrote is typed into an embed. The prototype's Nancy text (trust line, opinion, links, stories, flags, counts) is sample data and is not copied (open point 13).
- **No new Contributors fields.** Counted on 10 Oct: 54 custom fields plus Name and Slug. Everything below uses fields that already exist, the Directory item the profile already reads ([data-tll-dir]), the /stories shelf, or the map's own record. Anything that would need a new field is an open point.
- **The map engine is not rewritten.** The footer editor (`tll-map-redesign` block, about 22,800 characters, quickCount, `__tllMapApply`, `__tllPush`, the B42, B43, B45, B47 and B48 fixes), the head sync, the public view, Map 2.0 (embed 682054d4) and the four page scripts stay as they are. The 3.0 look on /the-map comes from one CSS block and one small page script that only reads.
- **tllStates and tllStatesAt are written only by the map.** Nothing proposed here writes either key. The Passport 2.0 section reads the record and opens the existing editor when a country is tapped. The public profile never reads the viewer's record to show someone else's numbers (row P5 fixes a live bug where it does).
- **One counting rule.** Total = Lived + Stayed for the member's own (non-pet) travelers, layovers counted apart, denominator 249. Every count below is computed at run time with the same rule as the editor's `tllOwnN`. No count is typed.
- **Motion (Emil rules):**
  - Hover and press only. Link rows, story cards, chips and stamps get a 150ms ease-out border or color change and scale(.97) on press.
  - The live link-row lift (translateY(-1px)) and story-card lift (translateY(-3px)) are replaced by the color change plus press scale.
  - The prototype's stamp "drop" animation (scale 1.9 to 1, 420ms, on toggle) and the 1.3s count-up on the big passport number are not brought over.
  - Hover effects only under `@media (hover: hover) and (pointer: fine)`.
  - With prefers-reduced-motion, all transitions are off and the tag and stamp tilts flatten to 0deg.
- **Draft first.** Each page is built on the staging branch or a draft duplicate, and the live pages change only after Nancy says yes.
- **Not touched:**
  - TLL Nav v1, TLL Site Footer, the feedback button.
  - Any Memberstack data-ms-* block: on /profile the members and non-members sections (data-ms-content) and the Sign out link (data-ms-action="logout").
  - Contributors CMS items and slugs (copy fixes in Nancy's own item are open points, not edits).
  - The site head and footer code, the 15 site scripts, and the map page's head code.

## Must survive (added 28 September to 10 October)

| What | Where it lives | How the proposal keeps it |
|---|---|---|
| Kosovo, Northern Cyprus, Somaliland codes | Page script tllmapidsv1 1.0.0 (header): sets ids 900, 901, 902 on the drawn shapes and moves an old "undefined" entry to 900 | Kept and loaded first, as today. Passport 2.0 reads country ids from the drawn shapes after it runs, and names 900 to 902 itself, so a raw "900" is never printed (S32 open item) |
| Member editor and its fixes | /the-map footer `tll-map-redesign`: no seeding for new members (B42), empty-state line and click-to-log (B43), depth pins (B45), #edit opens the editor (B47), `tll:states` event on every save (B48), quickCount "n / 249" (S01) | Not edited. The m3 block restyles it with CSS. Passport 2.0 listens for `tll:states` and `storage`, as the share layer does |
| tllStates sync | /the-map head: `__tllPush`, pull, tllStatesOwner guard (B42) | Not edited |
| Map 2.0 | Embed 682054d4 before the hidden #tll-map-canvas, logging from the map (S05, B22 phase 6) | Not edited. The hidden canvas keeps data-visited; the old SVG it draws is still what the editor and tllmapfillv2 wait for |
| Signed-out counter | Head `tll-map-invite-v1` and `tll-map-invite-js-v1`: counter hidden, "Start your own map →" (S17) | Kept. Passport 2.0 follows the same rule for visitors |
| Page scripts | tllmapembedv1 (header), tllmapaddv2 (opens the editor from ?add=), tllmapfillv2 (repaints from tllStates) | All kept. Passport 2.0 opens the editor through ?add= / #edit, which tllmapaddv2 and the footer already handle |
| Share card, logbook, clusters, full screen | Embeds c5140aff (tll-share-v1), 338a14b5 (logbook), 89bf7e91 (clusters v2), d298fd06 (full screen) | Kept in place. Restyled with m3 tokens only where they print text |
| Public profile v2 | Template head `tll-prof-v2`, `tll-prof-dir-v1`, J14 tag `tll-v9-j14-profile-v1` + wrapper script; footer `tll-prof-v2-js` (links from CMS, stories from the shelf), `tll-prof-dir-js-v1` (Directory badges, links, contact, report) | All kept. The p3 block loads after them and only restyles. Row P5 switches off one footer binder without editing it |
| Profile link fix | /profile head script: points "View public profile" at /contributors/{custom-slug} (read-only Memberstack call) | Kept |
| Edit my destinations tile | /profile tile 57db657d → /the-map#edit (B47) | Kept; its three placeholder strings are hidden (row R1) |

## Public profile (Contributors Template): section by section

What the prototype shows, in order:
1. A cream luggage tag on a light page: grommet, dashed stitch, "PROPERTY OF · TLL TRAVELER", 84px avatar with a rose ring, chips "THE FOUNDER", "EXPAT", "LIFER", the name in Playfair 800, a mono line "AMERICAN · ABROAD SINCE 2018 · LIVES IN DENMARK · SPEAKS ENGLISH, DANISH, PORTUGUESE", and "FROM · HAS LIVED IN" circle flags (US, Denmark · now, Brazil, Vietnam).
2. A stat row in teal on light: "87 COUNTRIES", "5 STORIES FILED", "7 CONTINENTS", "2026 SINCE".
3. "TRUST ME WITH A FLIGHT DELAY BECAUSE…" in a paper box, italic.
4. "ONE STRONG OPINION" in an ink box.
5. "FIND NANCY ELSEWHERE": link rows with a round badge (WEB, IG, YT, LINK), label, URL and ↗, or "No links shared yet.".
6. "FILED BY NANCY": a two-column grid of story cards with a photo, "{COUNTRY} · {MINS}" and the title.
7. The disclosure line in a paper box.

| # | Section | Change | Live parts kept |
|---|---|---|---|
| P1 | Page frame | The hero section loses its Ink band on screen: page background Cream, one 900px column, side gutter 28px (16px under 480px). CSS only. The other sections (voice, links, filed) drop their own band colors so the page reads as one sheet, as in the prototype. | Article 70cb4393…12f0, sections a37e380c (hero, still `tll-section-dark` in the Designer), a60244e1 (voice), 679f66cb (links), d6d70363 (filed) |
| P2 | Luggage tag | J14 already draws the tag. Brought to the prototype: padding 30px 30px 28px 78px, grommet 24px in, stitch at 58px, avatar 84px with a 3px rose ring (live is 160px), name clamp(34px, 4.2vw, 64px). The -0.6deg tilt stays (flat with reduced motion). | Hero grid 35cc87b8 [data-tll-prof="hero-grid"], avatar da6cc4ae (bound to Photo), h1 273602c7 (bound to Name), `.tll-prof-tagwrap` |
| P3 | Chips | Prototype chips: Badge (rose tint, #C8325B text), Directory flags such as Expat (grey), Fun title (amber tint, #8A5A12 text for contrast). Traveler Category is hidden when it says the same as Badge (both say "Founder" on Nancy's item today, so the chip row reads "Founder Founder"). The prototype's "LIFER" chip has no source (tier names are still open, I06) and is not added (open point 3). | Badges 1f1e68fd with badge-role d43c78ec (Badge), badge-cat 713f32d4 (Traveler Category), badge-fun de60566d (Fun title), badge-dir added by tll-prof-dir-js-v1 |
| P4 | Mono line under the name | One mono line in #6B6660, built from what exists: Location (home-base), then "Lives in {country} since {year}" and "Knows {city}" from the Directory item when the member has switched the expat directory on, then pronouns. The "Currently in" line is hidden on screen (J15 rule; Nancy's item reads "Currently in Copenhagen, Denmark · filing weekly"). "AMERICAN" and "SPEAKS ENGLISH, DANISH, PORTUGUESE" are only shown if the Directory item carries them; nothing is typed (open point 2). | meta d3e97d53 (Currently In, hidden, not deleted), home 39317524 (Location), pronouns 6335e1b2, dir-hero 714bdfb4 with dir-lives, dir-tags-label, dir-tags |
| P5 | Stats | Prototype type: Playfair 800 23px in #067A79, mono 10px labels, one row of four under the tag (two by two under 480px). Labels stay live: "Countries", "Stories filed", "Continents marathoned", "Since" (the prototype's bare "CONTINENTS" would read as continents visited). **Bug fix:** the footer binder `__tllProfStats` overwrites the Countries and Continents numbers with the viewer's own tllStates, counting every key, layovers included. Any signed-in visitor sees their own count on someone else's profile. A one-line head script sets `window.__tllProfStats=1` before the footer runs, so that binder exits on its first line without being edited. The new p3 script then shows: the owner's computed total (Lived + Stayed, own travelers, layovers apart) only when the signed-in viewer's Memberstack id equals the item's Member ID; everyone else sees the bound Country count. Which number is the public one is open point 1. | Stats acc0c900 [data-tll-prof="stats"], n-countries 80cbda6d (Country count), n-stories acffcc4a (counted from the shelf by tll-prof-v2-js), n-continents 1290ec7d (Continents marathoned), n-since 7ca6421b (Member since → year), the footer binder (switched off, not deleted) |
| P6 | Trust me | Prototype box: paper #FDF9F3, 1px #E0DACE border, mono teal label, the answer in 15px italic #3a3a3a (live is Playfair 22px). Text stays bound to Trust Me Quote; the card still hides when the field is empty. | Voice card 3e1a350b [data-tll-field="trust"], label 1baa018d "Trust me with a flight delay because…", trust 2e026b27 |
| P7 | One strong opinion | Prototype ink box: #0A0B14, mono rose label in #F0507A (about 5.6:1 on Ink), Playfair 800 19px in Cream. The two cards stack instead of sitting side by side. | Voice card b13c9c1f [data-tll-field="opinion"], label 647b51dc, opinion 1db8c773 (Strong Opinion) |
| P8 | Find {First} elsewhere | The h2 keeps its tag and text ("Find {First} elsewhere", written by tll-prof-v2-js) and takes the prototype's mono teal label style. Each row gets the prototype's 36px Ink badge with a teal code (LI, SUB, IG, STRAVA, WEB, YT, TT, X, THR, VIM, KIT) from a CSS rule per [data-tll-link] value, plus a teal ↗. Rows stay real links (the prototype's clickable divs are not copied). "No links shared yet." keeps its dashed box. Nancy's item has no link URLs yet, so her page shows the empty state until she fills them (open point 12). | h2 d33565f8, links-list 3005666f with 11 bound rows [data-tll-link], dir-links 84c48f2e, links-empty 0316edf7, URL-to-href logic in tll-prof-v2-js |
| P9 | Get in touch and Report | Not in the prototype. Kept under the links, restyled with p3 tokens: Ink pill button, mono note, "Report this profile" mailto. Still hidden unless the Directory item allows contact. | dir-contact 613a57ed, dir-src DynamoWrapper c9efcd7a, tll-prof-dir-js-v1 |
| P10 | Filed by {First} | Prototype cards: two columns (one under 600px), 105px photo on the left, mono teal "{BYLINE LOCATION} · {N} MIN", Playfair title 15px (the prototype's 13px is under the 15px body floor, J06). A small p3 script reads the same /stories shelf that tll-prof-v2-js already fetched (browser cache) and adds each card's photo with alt="" (the title is the link text), width and height set, loading="lazy". The h2 keeps "Filed by {First}". "No stories filed yet." stays. | filed-title 76ab6247, filed-list 8c0ffe5f, filed-empty 02bb3e01, `.tll-prof-story` cards built by tll-prof-v2-js |
| P11 | Disclosure | Prototype paper box around the existing line. Copy is identical to the prototype, so no text change. | disclosure b6a63edb |
| P12 | Old sections | Stay hidden, as on 29 Sep (B11). Nothing is removed. | 70cb4393…1232 (old hero), ce003350 (receipts and progress), 987bf70b, 70cb4393…1278 (link stack), 70cb4393…1288 (long bio), 8b81c1d5 (LinkedIn-style block), 70cb4393…12af (story cards), 70cb4393…12c2 (pets), 70cb4393…12ef (contact doors) |
| P13 | Style and scripts | `<style id="tll-p3-profile-v1">` and the one-line guard `<script id="tll-p3-profile-guard-v1">` at the end of the template head, after tll-v9-j14-profile-js-v1. `<script id="tll-p3-profile-js-v1">` at the end of the template footer (owner count, chip de-duplication, Currently In hide, story photos). All three are on the template, not site scripts (the site is at 15). | All existing head and footer blocks |

Proposed changes on the public profile: 13.

## /profile (the member's own page): section by section

The prototype has no screen for /profile. Its `profile` screen is the public page above. /profile is noindex and members-only, so this proposal only brings it onto the same tokens and fixes what is broken, without changing what it does.

| # | Section | Change | Live parts kept |
|---|---|---|---|
| R1 | Edit my destinations tile | The tile still shows "This is some text inside of a div block." three times (the same Webflow placeholder fixed on /account in S31). Hide the three placeholder blocks. The tile keeps "Edit my destinations." and its line. | Tile link 57db657d → /the-map#edit, strings 31e867d9, dbf42b11, a58e917a (their blocks hidden, not deleted) |
| R2 | Paw Passport tile | "Microchip + EU passport stored privately." breaks the A09 rule. Proposed: "Log the countries you crossed together. EU pet passport details stay private." | Tile 3546d9b1…bcab → /my-pets |
| R3 | Need a hand card | "Twelve answered questions, six routed help cards." is a typed count (the FAQ has seven items, B14). Proposed: "Answers, and help for story corrections, takedowns, account deletion and appeals. A real human at hello@thatlayover.life." | Secondary card 3546d9b1…bcd4, FAQ and Support links |
| R4 | Share your profile card | The typed "your-slug" is replaced on screen with the member's own slug by the existing head script's lookup (same read-only Memberstack call, no new field), so the line reads thatlayover.life/contributors/{their slug}. Copy per the 9 Oct copy pass ("works like a Linktree page you can hand to anyone"). | Card 3546d9b1…bce6, "View public profile →" (fixed by the existing head script) |
| R5 | Style block | `<style id="tll-pr3-profile-v1">` in the page head after the canonical: Playfair 800 titles, mono teal eyebrows (#067A79 on light), tiles on Cream with a 1px #E0DACE border, 150ms color change on hover and scale(.97) on press, 3px focus rings. The emoji tile icons stay. | Hero sections bc85 and bc95 (data-ms-content kept), tiles section bcc3, secondary bce8, logout bcec (data-ms-action kept) |

Proposed changes on /profile: 5.

## The Map: section by section

What the prototype shows, in order:
1. "TLL Map Page" (not in the folder; treated as the live hero, Map 2.0 and share bar).
2. Passport 2.0 on Ink: mono teal "YOUR PASSPORT · {SAMPLE DATA or YOUR MAP · FROM TLLSTATES}", a very large count with a rose "/193", "UN STATES · {N} TO GO · {N} LIVED IN".
3. "Stamp it, *or list it.*" and the line "The map above stays exactly how you know it. Down here are the same countries as a wall of stamps, or a plain list you can scan in ten seconds."
4. Five region tiles (Africa, Americas, Asia, Europe, Oceania) with done / total and a bar.
5. A sticky control bar: STAMPS / LIST VIEW, "Find a country or capital", region chips, ALL / BEEN / NOT YET, "{N} SHOWN".
6. Loading, error and no-match lines.
7. Stamps view: per region, a sticky region name, "{N} / {N} STAMPED", and tilted stamp buttons (flag, ISO3, name, "LIVED ★", "STAMPED ✓" or "+ STAMP IT").
8. List view: letter dividers, a tick box, country, region, capital and a BEEN / LIVED / NOT YET tag.

| # | Section | Change | Live parts kept |
|---|---|---|---|
| M1 | Hero | Kept as live (the prototype's map top was not delivered). m3 type only: eyebrow mono #00C9C8 on Ink, H1 at the J11 scale. The counter keeps the "n / 249" format the editor writes. Copy changes from the 9 Oct copy pass are open point 6. | Hero c84d785f…793b, h1 …792d, OPEN FULL SCREEN 3f87bdc0, counter …7939 (.tll-map-hero-counter, hidden for visitors), "Start your own map →" |
| M2 | Map and share bar | Not touched. | Map 2.0 682054d4, #tll-map-canvas …793c (hidden, data-visited kept), legend …7946 (hidden by CSS), full screen d298fd06, share c5140aff, clusters 89bf7e91 |
| M3 | Old legend and typed lists | The block with "Lived / visited · Layover only · Magnus was here", "Recently lit" (Bulgaria 3 stories, Montenegro 2, Ghana 2, Sweden 1) and "By continent" (35, 19, 14, 9, 6, 5, which add up to 88) is hidden. Every number in it is typed, and Map 2.0 already draws the legend. The region counts come back computed in M5. | Section bba1ef04…6b93 and its children (hidden, not deleted) |
| M4 | Passport 2.0, top | New HtmlEmbed directly after the share bar, `<section id="tll-passport" aria-labelledby="tll-passport-h">`. Changes from the prototype: <br>- Eyebrow "YOUR PASSPORT" (the "SAMPLE DATA" and "FROM TLLSTATES" labels are dropped: one is fake data, the other is an internal name). <br>- The big number is the member's total (Lived + Stayed, own travelers) and the rose figure is "/249", not "/193". <br>- The line reads "COUNTRIES AND TERRITORIES · {249 minus total} TO GO · {N} LIVED IN · {N} LAYOVERS, COUNTED APART". <br>- No count-up animation. <br>- h2 "Stamp it, *or list it.*" (rose italic on "or list it."). <br>- Line: "The map above stays how you know it. Down here are the same countries as a wall of stamps, or a plain list you can scan." ("in ten seconds" is a claim nobody has measured, open point 9.) | Reads tllStates only; never writes it |
| M5 | Region tiles | Five tiles as in the prototype, done / total per region, counted with the same rule. Totals come from the 249 shapes the map draws, grouped with the continent table already used on the profile (the binder's CONT list), with Antarctica added as a sixth tile so the tiles add up to 249. The bar keeps a thin #26324D track only because it is the prototype's design (open point 10). | None (new) |
| M6 | Control bar | Sticky under the nav (top 64px; 0 when the nav is not sticky), Cream #FDF9F3. View switch is a real two-button group with aria-pressed (the prototype's role=tab spans are not copied). Search input with a visible label "Find a country" (placeholder "Country or ISO code", since no capital data is loaded, M8). Region chips and status chips are buttons with aria-pressed, 44px tall. Status chips: All, Been, Layover, Not yet ("Been" = Lived or Stayed). "{N} SHOWN" keeps role=status. Under 760px the chip rows scroll sideways with an edge fade instead of wrapping to 150px. | None (new) |
| M7 | Stamps view | Prototype stamps on Cream: sticky region name in Playfair (not sticky under 760px), "{N} / {N} STAMPED" in #067A79, stamp 116px by 132px (three per row on a phone), circle flag, ISO3, name, tag. Depth shown by shape and text, never color alone: Lived = 3px double ring and "LIVED ★", Stayed = 2px border and "STAMPED ✓", Layover = dashed border and "LAYOVER", Not yet = dashed #c9bfae and "+ STAMP IT". Ink colors #067A79 and #C8325B on Cream only. Tilt stays static (no motion), 0deg with reduced motion. **A tap does not write.** Each stamp is a button labeled "Log or change {country}" that opens the existing editor on that country (?add={id}, handled by tllmapaddv2, or the footer's own open-on-country from B43). When the editor saves, the `tll:states` event re-renders the passport. One-tap stamping is open point 5. | Editor panel, tllmapaddv2, `tll:states` |
| M8 | List view | A real `<table>` with a caption, column headers and the letter dividers as row headers: Country (flag and name), Region, Depth. The prototype's Capital column is left out because the map's country data has no capitals and the prototype fetched them from world-countries@5 (open point 8). Each row's Depth cell is the same "Log or change" button as M7. | None (new) |
| M8b | Loading, error, no match | "Unpacking 249 countries and territories…" (prototype said 193), "Couldn't load the atlas. Refresh and it usually behaves." (role=alert), "No country matches that. Check the spelling, *or the filters.*" (role=status). All three are the prototype's own lines apart from the number. | None (new) |
| M9 | Signed-out visitors | The prototype fills the passport with 62 sample countries and 4 "lived" ones for visitors. Not used. Visitors see the h2, one line "Sign in and your countries show up here as stamps or a list." and "Start your own map →" (/signup, same label as the hero invite). Whether visitors should instead see Nancy's own record, as Map 2.0 does, is open point 4. | `html.tll-map-public` class from the head, tll-map-invite-v1 |
| M10 | Explainer cards | "87 Already logged" and "108 Still to go" are typed (and 108 is 195 minus 87, the old base). For members the p3 script writes the member's total and 249 minus it, with the copy-pass lines ("Every country painted rose is a trip that happened." / "The cream ones. Every one is a conversation at 9am in someone's kitchen that has not happened yet."). For visitors the two cards are hidden, like the hero counter. The third card ("1,273 World Heritage sites … across 173 countries") is kept, but the number needs a dated source (open point 7). | Explainer grid …795e and its three cards (strings …7949, …7950, …7957 kept, text set on screen only), logbook 338a14b5, CTA row …7963 |
| M11 | Editor panel restyle | CSS only on the footer editor's own ids: panel in Cream with Ink text, IBM Plex Sans Condensed instead of Inter, mono labels, 44px tap targets on rows and buttons, Rose save button with Ink text, 3px focus rings. A small read-only script gives the close "×" (#tllX, a span today, J01) role=button, tabindex=0, aria-label "Close" and Enter/Space handling, and relabels the visible word "Visited" to "Stayed" so it matches Map 2.0 and /account (the stored value stays "visited"; open point 11). | #tllT, #tllQ, #tllL, #tllC, #tllSave, #tllX, #tllLegend, #tllDepth, #tllEmpty, all editor logic |
| M12 | Headings | The page has a single heading today (the h1). Added: a visually hidden h2 "The map" in the map section, the Passport h2 (M4), h3 per region in the stamps view, and h2 on the three explainer cards (Already logged, Still to go, World Heritage sites) through the embed, not by retagging Designer elements. | h1 …792d |
| M13 | Style and scripts | `<style id="tll-m3-map-v1">` at the end of the page footer, after `tll-map-redesign`, so its rules win by load order rather than by stacking important flags. The passport markup and `tll-m3-passport-js-v1` live in the new embed (M4), so no page script slot is used and the head code is untouched. | tllmapidsv1, tllmapembedv1, tllmapaddv2, tllmapfillv2, all head and footer code |

Proposed changes on The Map: 14 (M1 to M13, with M8b counted on its own).

## SEO, AEO and accessibility

- **Headings.**
  - Public profile: one h1 (the name). The voice labels are h2 today, as are "Find {First} elsewhere" and "Filed by {First}", and they stay h2.
  - The stats use h3 for the stories number and h4 for all four labels, with no h3 above them. Changing the tag in the Designer would change element types, so this pass keeps them and only flags it (open point 14).
  - The Map: one h1, new h2s and h3s as in row M12.
  - /profile: unchanged (one h1 per Memberstack state).
- **Structured data.**
  - Public profile: the page carries two graphs. Page settings hold Person + BreadcrumbList; the template head holds ProfilePage (mainEntity Person) + a second BreadcrumbList. Proposal: one graph. Keep the head's ProfilePage, point its mainEntity at the page-level Person's @id (…#person), and clear the head's duplicate BreadcrumbList. Add `sameAs` to the Person from the bound link URLs that are filled (LinkedIn, Instagram, YouTube and so on), written by the p3 script only for links that exist, never typed.
  - The Person's alternateName is bound to Fun title, which is "87-and-counting" for Nancy (open point 3).
  - The Map: WebPage + BreadcrumbList stay. The passport is member-only content and adds nothing to the schema.
  - /profile: ProfilePage + BreadcrumbList stay; the page is noindex.
- **Metadata.**
  - Contributors Template OG title is static ("Contributor profile · That Layover Life") while the SEO title is bound. Proposal: bind OG title to "{Name} · Traveler profile · That Layover Life" and OG description to Bio short, as the SEO fields already are. og:image is already bound to Photo in the head code.
  - The Map: titles and canonical stay. The OG title "The Lifer chase, visualized" is in open point 6.
- **Images.**
  - Avatar keeps its bound alt (Nancy's says "Nancy Carleton").
  - Story photos added in P10 get alt="" because the title is the link text.
  - Passport flags are decorative (aria-hidden); each stamp's accessible name is "Log or change {country}, {depth}".
- **Contrast.**
  - Teal text on light is #067A79, small rose text on light is #C8325B, rose on Ink is #F0507A, muted text is #6B6660 on light and #9496AC on dark.
  - The prototype's amber chip text #b8791f on its tint is about 3:1 at 10.5px; it becomes #8A5A12.
  - Not-yet stamp text #8F8473 on Cream is about 3.3:1; it becomes #6B6660.
- **Focus and controls.**
  - Visible 3px focus rings, Ink on light and Teal on dark (J03).
  - Every new control is an <a> or a <button> (J01); chips and view switches use aria-pressed; tap targets at least 44px (J06).
  - The search input gets a visible label, not only a placeholder.
  - The passport list is a real table, so a screen reader can move by row and column. This also answers the audit's request for a non-canvas alternative to the map (audit-2026-10-09, accessibility).
- **Privacy.** The profile never shows "Currently in" (J15), the owner's map count is shown only to the owner, and the passport is members-only. Nothing shows a date, a city of residence beyond what the member put in Location, or an unpublished trip.
- **Motion.** prefers-reduced-motion turns off all transitions and flattens the tag and stamp tilts.

## Open points (Nancy)

1. **Which country number is public on a profile.** Your Country count field says 87 (you confirmed 87 on 10 Oct, S20). The map, with the one counting rule, says 85 of 249 (5 Lived, 80 Stayed, 2 layovers apart). A public profile cannot read your map record, so it can only show the CMS number until the Worker profile sync (B12, built, not switched on) writes the computed total into the field on every save. Switching that on needs a Memberstack webhook, which is a Memberstack change. [Default: show the bound Country count to visitors and the computed total to you when you view your own profile; switch on the Worker sync only after you approve the webhook.]
2. **"AMERICAN · ABROAD SINCE 2018 · SPEAKS ENGLISH, DANISH, PORTUGUESE" and the "FROM · HAS LIVED IN" flags.** The facts are yours (STANDING-RULINGS), but there is no Contributors field for nationality, languages or places lived, and the profile must not type them. "Lives in" and "since" already come from your Directory item. Languages exist in the edit-profile directory form but are not read by the profile yet. Places lived could come from the Lived entries on your map, but only through the same sync as point 1. [Default: show Location plus the Directory "Lives in {country} since {year} · Knows {city}"; read Languages from the Directory item if it is synced; leave the flags out until the sync exists; no new Contributors field.]
3. **Chips and the fun title.** The prototype shows "LIFER", which has no source (tier names are still open, I06). Your Fun title is "87-and-counting", a typed count that also lands in the Person schema as alternateName. [Default: no LIFER chip; you change Fun title in the CMS to words without a number, for example "The Lifer" once tiers are settled; the template is not changed for it.]
4. **What a signed-out visitor sees in the passport.** The prototype fills it with 62 sample countries. Map 2.0 shows visitors your own record as the showcase. [Default: visitors get the short sign-in line and "Start your own map →", no sample data and no record.]
5. **One-tap stamping.** The prototype stamps a country with one tap. Doing that live means the passport writes tllStates, which today only the map editor and Map 2.0 do. [Default: a tap opens the existing editor on that country, and the passport re-renders when the editor saves; one-tap stamping later, through the editor's own `__tllMapApply` and `__tllPush`, after a separate test.]
6. **Map hero copy (from the 9 Oct copy pass, not yet approved).** Eyebrow "THE MAP · THE LIFER CHASE, VISUALIZED" uses house jargon; the lede says "Rose is where you have been" to a visitor looking at your map; the OG title repeats "The Lifer chase". [Default: eyebrow "THE MAP · EVERY COUNTRY, COUNTED"; lede "Rose is where we have been, the pins are the countries with a story behind them, and the counter is the honest total. Hover for a name, click a pin for the story, and sign in to paint your own."; OG title "The Map · Every country, one map".]
7. **"1,273 World Heritage sites … across 173 countries".** Live today, with no date or source on the page. UNESCO's list changes every July. [Default: keep the card, and you or I check the current UNESCO total before the 3.0 publish; the card then says "as of July {year}" and links to whc.unesco.org/en/list.]
8. **Capitals in the list view.** The prototype loads capitals from a public country file (world-countries@5) that only covers the 193 UN members, so it has no Kosovo, Northern Cyprus, Somaliland or territories. [Default: no Capital column; search by name and ISO code; capitals later from a small JSON file in the repo that covers all 249.]
9. **"a plain list you can scan in ten seconds".** Nobody has timed it. [Default: "a plain list you can scan."]
10. **Bars with tracks.** The region tiles and stamps headers use a filled bar on a grey track, as in the prototype. [Default: keep them as designed, 3px and 4px thin, with the number always printed beside the bar so the bar is never the only signal.]
11. **"Visited" or "Stayed".** The old editor says Visited, Map 2.0 and /account say Stayed, and the profile tile on /profile says "Lived, Visited or Layover". [Default: "Stayed" everywhere on screen, including the /profile tile line; the stored value stays "visited" so nothing in tllStates changes.]
12. **Your links.** Your Contributors item has no link URLs, so your public profile says "No links shared yet." The prototype shows thatlayover.life, Instagram @nancycarleton, YouTube @nancycarleton and linktr.ee/nancycarleton. [Default: you fill Instagram URL, YouTube URL and Personal site URL in the CMS or on /edit-profile; nothing typed into the template; WhatsApp and email never shown.]
13. **Prototype sample data, not used:**
    - The "NC" avatar placeholder, "87 COUNTRIES", "5 STORIES FILED", "7 CONTINENTS", "2026 SINCE".
    - The trust line "…I have turned an 87-country head start into a habit of staying calm in airports." (your CMS line is different: "Apparently, when adventure relies on a charged battery, I become someone who plans.").
    - The opinion "Layovers are not dead time. They are the cheapest country you will ever visit." (your CMS opinion is about budget travel evangelism).
    - The four default link rows and the four placeholder story cards.
    - The 62 SAMPLE DATA countries and the four "lived" ones (Denmark, Brazil, Vietnam, US) in the passport, and the "/193 UN STATES" base.

    Please confirm that none of these should appear. [Default: none appear; every value comes from the CMS, the shelf or the member's own map.]
14. **Stats headings.** The four stat labels are h4 and the stories number is h3, with no h3 above them, which breaks the heading outline. Fixing it means a Designer step (new text blocks bound to the same fields, old headings hidden). [Default: leave as is in this pass; do it in the same Designer session as the story page's Traveled with step (S34).]
15. **Copy in your own Contributors item (not template copy).**
    - Currently In: "Currently in Copenhagen, Denmark · filing weekly" (J15, and "filing weekly" is a schedule promise). Row P4 hides it on screen.
    - Bio short: "87 countries, 7 continents marathoned" (typed counts).
    - Bio long: "On a Google Sheet that Jay calls the Trip Ledger" (banned word), typed counts (87, 464, 212, 97), and plans (Tokyo Marathon, Ironman in Tallinn, Romania at Halloween). Bio long is not shown on the 3.0 page (its section stays hidden), but it is still in the CMS.

    [Default: you clear Currently In and edit Bio short to drop the numbers, for example "Founder of That Layover Life. Copenhagen-based American expat. Travels with a Samoyed named Magnus 🐻‍❄️."; Bio long stays hidden and untouched until you rewrite it.]
16. **Chesney Lish and Barzy Adam.** Both items are drafts and cannot publish without Photo, Location and Country count (required fields, B11). The 3.0 template is built so their pages work with only those three filled. [Default: no change; their profiles go live when you send the photos and details.]
17. **Outside these pages.**
    - The map head's public view still carries a typed list of four story pins. It only draws on the hidden old SVG, so visitors do not see it. [Default: leave the head code alone; it goes when the legacy map pieces are retired after your sign-off (S05).]
    - The prototype nav (MENU button, logged-in states) is not part of this proposal. TLL Nav v1, TLL Site Footer and Memberstack stay as they are.
