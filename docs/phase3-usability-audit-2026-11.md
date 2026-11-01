# Phase 3 usability audit, items 3 to 10 (1 November 2026)

Read-only audit from the saved code. Nothing on the site, in Webflow or in the repo was changed; this file is the only thing written.

**What this was read from**

- Live site code saved 31 October: `scratchpad/p0-1031/before/` (site head and footer, home, stories, story template, map, contact, support, my-passport) and `scratchpad/p0-1031/after/site-head.html` (the current head, with the consent block).
- The nav and footer markup: `src/pages/heroes-2026-10-29/fixtures/*.html`. Their `build_fixtures.py` says the body is the live Webflow tree of 29 October but the nav and footer come from the 13 October export. `src/components/footer/HANDOFF-NOTE-2026-10-20.md` records nav edits made in Webflow after that export (The Map link placed after Travelers, an Expats link after it) and a footer rework that stopped partway. The site was published again on 31 October (16.48.3), so the saved record says those two nav links are live. The nav list below is the 13 October export plus that note; the footer list is the 13 October export. A Designer readback is the only way to see either component as it stands.
- Home: the 20 saved embeds in `src/pages/home/live-2026-10-28/embeds/` and `src/pages/home/live-2026-10-29/founders-a0d1cd97-after.html`.
- Page code: `src/pages/the-map/v3/passport-embed.src.html`, `src/pages/the-map/live-2026-10-25/APPLY-LOG.md`, `src/pages/submit/live-2026-10-29/` (the live form export of 13 October, the page head and footer), `src/pages/submit/v5/` (not live, per its own change log), `src/pages/auth/`, `src/pages/share-photos/`, `src/pages/country/v3/live-footer-after.html`, `src/seo/live-2026-10-28/contributors-template-code-footer.html`, `src/pages/travelers/after-2026-10-20/tv-head-d8735ad4.html`, `src/pages/creators/live-2026-11-01/`, `src/pages/destinations/v3/ds3-destinations.js`, `src/pages/heroes-2026-10-29/code/for-expats-*.html`, the 13 October export of `/the-paw-passport`, and `map-2.0/dist/tll-map-layers.js` for the sample-map note.
- The 13 October Webflow export, `handoff/claude-design-source/webflow-export-2026-10-13/pages/` (18 pages: about, account, contact, destinations, edit-profile, index, login, my-passport, my-pets, newsletter, share-photos, signup, stories, submit, support, the-map, the-paw-passport, travelers). It is the only saved body for /contact, /support, /newsletter, /my-pets, /signup, /login, /account, /share-photos and /destinations. Anything changed in the Designer after 13 October is not in it.
- `handoff/STATUS.md` rows J10 and J11 (the page header band, built 6 October, removed 8 October).
- 28 layer files named in this file, out of the 64 `tll-*.js` layer files in `src/site-layers/` (the folder holds 87 `.js`: those 64, the 16 built bundles `tll-site-layers-v*.js` and 7 older `tllflags*` and `tllinlinephotos*` files; plus 19 `.html` style files and 15 build scripts, none of them read as layers). Two of the named layers live outside that folder: `src/pages/contributors-template/after-2026-10-20/tll-pf5-profile-v1.js` and `src/pages/share-photos/v3/tll-photos-form-v1.js`. Also the cover and story layers in `src/design/magazine-2026-10/`.
- `docs/tll-site-user-flow-2026-10-31.md`, `docs/tll-phase0-change-log-2026-11.md`, `docs/expat-pets-ux-2026-10-31.md`, `docs/redesign-plan-2026-10-31.md`, `docs/copy-audit-2026-10-31/copy-sheet.csv` (1,512 rows), `docs/phase2-design-inventory-2026-11.md` and `docs/phase2-a11y-audit-2026-11.md` (for the form-label counts, cited where used).

**Status words:** Live (on the site), Staged (built, shows with a preview link, not published), Draft (a Webflow page not published), Designer (lives only in the Webflow Designer, not in the saved code), Export (in the 13 October export, so Designer markup as of that date).

**Where Phase 0 stands:** live. `docs/tll-phase0-change-log-2026-11.md`, "Nancy's answers (31 Oct, late)": "Approved. Published as site layers 16.48.3 with the staged head, page code and CMS changes." The user-flow doc, written earlier on 31 October, still says 16.48.0 is staged; it is out of date on that point. One fix found after the publish is staged, not live: the home page head still loaded the AdSense tag before consent (change log, "Found after publishing (1 Nov, staged, not yet live)"). Every "Handled" in item 3 means handled by the live 16.48.3 layer unless the row says otherwise.

**The page header band is not on the site.** `src/site-layers/tll-v9-departures-v2.js` (status line, page title, one-liner on every page except home and stories) was published on 8 October and removed the same afternoon: `handoff/STATUS.md` row J11 records Nancy on the /stories header, "I prefer the look without these subsections", after which "The whole page header block (tll-v9-departures-v2 ...) is removed from the site head; read-back byte-identical ... no 'departures' left." The hosted-script route "was deleted (confirmed gone from the registry, never applied)". `scratchpad/p0-1031/before/site-head.html` and `after/site-head.html` contain zero occurrences of "departures". The copy sheet still lists that file as the source of TLL-0054, 0082, 0093, 0094, 0095, 0096 and others; those rows are not live. Nothing in items 5, 6, 7 or 9 below quotes the band as today's copy.

---

## 3. No promises without the thing

Every card, button and link in the saved home, stories, story, map, support, contact, for-expats, travelers and paw-passport code and the layers that lands nowhere, says "open slot" or "coming soon", shows an empty list, or looks clickable and is not. 36 rows.

| # | Where | What it says | Where it goes today | State | Phase 0 layer (live, 16.48.3) | Do |
|---|---|---|---|---|---|---|
| 1 | Home, expats block (`9992aa7f.html`) | Card "Moving guides: The paperwork, in the order it happens." | `/for-expats` (a page that has no guides) | Live. `tll-redesign-p0-v1.js` (live since 16.24.0 per `docs/redesign-plan-2026-10-31.md`) removes the href, adds a "Coming soon" tag and a line "Guides, visa dates and city hubs are on the way. Get the Sunday letter and hear when they open" linked to the letter form | Handled at run time. The Phase 0 log still lists "Relabel the home expat cards" as not done because the Designer text is unchanged | Keep the run-time fix; relabel in the Designer so no-JS readers see the same. Wire "get notified" to the letter form (done) |
| 2 | Home, expats block | Card "Visa trackers: The dates, remembered for you." | `/for-expats` | Same as row 1 | Handled | Same |
| 3 | Home, expats block | Card "Lifestyle hubs: The city, after the boxes are unpacked." | `/for-expats` | Same as row 1 | Handled | Same |
| 4 | Home, expats block | "Opening city by city, where our members live" | No link | Live. Nothing opens city by city yet | Not touched | Change to "Coming soon" or drop until the first hub exists |
| 5 | Home, Paw band (`a4c1009d.html`) | "Get the guide · €9 · On Ko-fi" | `href="#"` | Live markup, but the anchor and its note carry `hidden`, so nobody sees it | Phase 0: "Left hidden" until the Ko-fi URL and the Regulation (EU) 2026/131 check | Keep hidden. When the URL arrives, link it. Until then the band's promise line "The EU pet travel guide. No surprises at the border." still shows with no guide behind it: change to "Guide coming, get notified" with the Paw waitlist (built in `tll-paw-v1.js`, staged behind the trademark gate) |
| 6 | Home, founders band (`a0d1cd97.html`) | "Open slot · Founding 04 · Your face could be here. Window or aisle?" | `/signup` | The 29 October rebuild (`founders-a0d1cd97-after.html`) replaced it with "Pitch your layover →" | Not Phase 0, but done 29 Oct | Done |
| 7 | Home, cover people strip (`tll-mag-cover-v1.html`) | "Pitch your layover. We edit lightly and keep your byline." | `/submit` | Live (v16 bundle) | n/a | Fine. Real destination |
| 8 | Home, value row (`tll-home-value-v1.js`) | "What do you collect?" chips Food, Marathons, Trekking | `/stories?q=food`, `?q=marathon`, `?q=trek` | Live. The hubs `/pursuits/foodie`, `/marathons`, `/trekking` answer 404 (user-flow doc) | Handled: Phase 0 pointed the chips at library searches | Keep until a hub meets the 19 October rule (6 stories, 3 writers, an intro). Then link the hub |
| 9 | Home, value row | Chip "Dog travel" | `/the-paw-passport` | Live | Handled | Fine |
| 10 | Home, letter band (`c0c4bf75.html`) | "One story. Sunday morning." and "Sundays at 09:00 Copenhagen time." | An email form | Live. Whether a letter goes out on Sundays is not in the saved code | Not touched | See item 5: capture only for now, so drop the schedule until it is true |
| 11 | `/spotlight` (site head `spotlight()`) | Two cards "COMING SOON · Spotlight slot" (Lisbon, Berlin) and "OPEN SLOT · Your name here. One story gets you the feature." | `/contact` and `/submit` | `tll-open-slots-v1.js` (v16) hides the two coming-soon cards and turns the third into "Write for TLL · Pitch your layover." to `/submit` | Phase 0 added noindex on `/spotlight`. The footer link "Spotlight" stays (nav and footer wait for a session together) | Remaining: the page is one real feature (Nancy) plus one tile. Either hide the footer link until a second feature exists, or keep the page with the one tile |
| 12 | `/awards` (footer "The Layover Awards") | The body is Designer, not in the saved code; `src/seo/live-2026-10-28/awards-head-head.html` styles the hero and the Memberstack member form `[data-tll-aw=memb]` (Phase 2 inventory) but holds no copy. The "Members nominate. The editor picks. NOMINATIONS OPEN, DECEMBER" header the copy sheet lists is the removed page header band, not on the site | The awards page is live; the nominations template is a draft (user-flow doc) | Phase 0: noindex. The footer link stays | Hide the footer link until December, or give the page one line, "Nominations open in December, get notified", with the letter form. What the hero says today is a Designer readback |
| 13 | `/creators` (reached by the footer "For affiliates" through the Phase 0 forward from `/for-affiliates`) | Empty state "Nobody has switched on 'I'm a creator' yet." (`src/pages/creators/live-2026-11-01/README.md`: the API refused to change it) | A list that can be empty, no button | Phase 0: noindex. The 301 `/for-affiliates` to `/creators` still needs adding in Site settings | Give the empty state a button ("Switch on Make things" to `/edit-profile`). Designer edit |
| 14 | `/for-expats`, live 13 October body (`fixtures/for-expats.html`) | "Become a Location Expert", "Find an expat group", "ALL COUNTRIES BY FLAG →", "+ Your city is not listed? Any city, any country. Claim it.", "Claim your desk →" | Five anchors with no `href` in the saved tree. The page footer code (`src/pages/heroes-2026-10-29/code/for-expats-footer.html`) never sets an href on them (no `.href=` and no `setAttribute('href')` in the file); it builds its own links to `#tll-expert-apply` and `#tll-groups` inside the directory cards it draws | Live. The five Designer anchors stay dead with or without JS | The staged expat rework (`tll-expat-v1.js`, `?preview=expat`) replaces the whole landing | Publish the rework. Until then set the five hrefs in the Designer |
| 15 | `/for-expats`, live body | "LISTED SO FAR: No groups listed yet. The first one goes here." | A list with nothing in it | Live | Staged rework leaves out anything with no content | Publish the rework, or hide the block until one group exists |
| 16 | `/for-expats`, staged rework (`tll-expat-v1.js`) | "Add the places you've lived" | `/the-map?mark=lived` | Staged. The map does not preselect Lived yet (expat-pets doc, decision 11) | n/a | Make `?mark=lived` open the Quick log on LIVED before publishing, or drop the parameter |
| 17 | `/the-paw-passport`, 13 October export | Card "EU Pet Passport: What it is, who issues it, and how long it takes." | No link in the export | Live, Designer | The pet rework (`tll-pet-passport-v1.js`, `?preview=pets`) rebuilds the landing and hides "Buy the EU pet guide" until the link is filled | Hide the card, or make it "Guide coming, get notified" with the Paw waitlist. The page needs the Regulation (EU) 2026/131 check first |
| 18 | `/the-paw-passport`, 13 October export | Card "Large-dog-friendly hotels: Real 'large' means over 25kg welcome, verified." | No link | Live, Designer. Nothing on the site verifies hotels; the closest real thing is the "Pet-friendly or pet-tolerant?" note under stories (`tll-series-v1.js`, live in 16.48.3 and content-gated: its header says "Nothing shows until a story is tagged with a series theme", it has no preview gate, and it is in the v16 build list for /stories, story pages and /for-expats) | Not touched | Hide until the first five pet notes exist, then link the notes list on the reworked landing |
| 19 | `/the-paw-passport`, 13 October export | "Open slot · Any species, with paperwork · Awaiting a first trip" | `/my-pets` ("+ Add your pet") | Live | Not touched | Real destination; drop the "Open slot" label (Nancy retired open-slot signals on 29 Oct) |
| 20 | `/the-paw-passport`, staged | Waitlist card "Paw Passport · coming. Be first when it is ready." | Worker `POST /paw/waitlist` | Staged behind the trademark gate | n/a | This is the "Coming soon, get notified" pattern the other rows should reuse |
| 21 | `/the-map`, live tree | "OPEN FULL SCREEN →" | Opened a panel with no map | Phase 0 hides it | Handled | Done |
| 22 | `/the-map`, live tree | "Edit your countries on the map ↑" (to `/edit-profile`) and "Back to your account →" | Member pages, shown to visitors | Phase 0 hides buttons whose text is exactly "Edit my destinations". The saved map tree's label reads "Edit your countries on the map", which that match does not catch | Partly | Check which label is live; hide both for visitors |
| 23 | `/the-map`, sample map | "SAMPLE MAP. These countries belong to a made-up traveler, so you can see how the map works. None of it is a real trip." with "Start your own map →" and "Sign in" | `/signup`, `/login` | Live (25 Oct) | n/a | Real destinations. See item 9 |
| 24 | `/the-map`, passport wall | "Sign in and your countries show up here as stamps or a list. Start your own map →" | `/signup` | Live | n/a | Fine |
| 25 | `/stories` | Search with no match: "No stories match '{q}' yet. Share your story → / Clear the search", replaced by the what-a-story-is note (`tll-story-is-v1.js`) | `/submit`, `/stories` | Live | n/a | Fine. See item 8 for suggestions |
| 26 | `/stories` | Place chip with no stories: "No stories from {place} yet. Be the first. Share your story →" | `/submit` | Live | n/a | Fine |
| 27 | Story pages | "Reklame for the traveler" label built from the Disclosure line | A false label | Phase 0: reads Sponsor name and URL; shows only when both are filled | Handled | Done |
| 28 | Story pages | "Log in to save" | `/login?redirect=` | Live | n/a | Fine |
| 29 | `/contact` | Relay form "through TLL" | A form that exposed nothing but promised a relay | Phase 0 hides it; `?relay=` shows "Members choose how to be reached. Use the links on their profile, or write to us at hello@thatlayover.life." | Handled | Done. Profile buttons to the relay are hidden too |
| 30 | `/support` (`support-head.html`, export `pages/support.html`) | Layover Club card: "The Layover Club · Optional, always", "Stories stay free. This is the tip jar with a badge.", a "soon" eyebrow style `[data-tll-club="soon"]`, the price line and fine print hidden "until the Club price is set"; "Join" and the tip button | Both buttons go to `https://ko-fi.com/thatlayoverlife` since 19 Oct (the head's own comment: "both Ko-fi buttons link to ... price line and fine print stay hidden until the Club price is set"). The 13 October export predates that wiring and shows no Ko-fi href | Live. The card text is Export (Designer markup saved 13 Oct); the head holds only its CSS and that comment | Not touched | The buttons are real. The Club is "coming": keep the "soon" label and add an email line, or point "Join" at the Ko-fi tier once a price exists |
| 31 | Footer | "Copenhagen stopover" and "EES and ETIAS on a layover" | `/copenhagen-stopover`, `/ees-etias-layover`, both drafts (user-flow doc), so 404 | Live links to pages that do not exist (13 October footer; Packet A row A2.8 planned to drop them) | Not touched: nav and footer wait for a session together | Remove the two links, or publish the pages |
| 32 | Footer | "Cookie preferences" `href="#"` | Reopens Google's consent message (the Phase 0 head block catches any link reading "Cookie preferences") | Live | Handled | Done |
| 33 | Profiles | Link rows still pointing at `#` | Hidden by the site head parity script | Live | n/a | Done |
| 34 | `/stories`, place chips (`fixtures/stories.html`, the 29 Oct tree) | "All places", "Europe", "Africa", "Americas", "Antarctica" (Asia, Middle East and Oceania are added by `tll-stories-places-v1.js`) | Five `<a>` with `role="button"` and `aria-pressed` but no `href` and no `tabindex`; `tll-lib-chips-v1` (stories footer) attaches click handlers only and sets no href | Live. Looks clickable; without JS nothing happens; a keyboard never reaches them (an anchor without href is not focusable) | Not touched (the series chips in `tll-series-v1.js` are real `<button>` elements) | Make them `<button>` elements in the Designer, or give each a `href="/stories?place=..."` the chips script can intercept. Item 8's chip rows do the second |
| 35 | `/travelers`, roster cards (`fixtures/travelers.html`) | Two `<a class="tv-card">` with no `href`: the traveler card and the pet card ("PET") | They are roster templates with `data-st3-base="/contributors/"` and `/pets/`; the page head (`src/pages/travelers/after-2026-10-20/tv-head-d8735ad4.html`, lines 106 and 107) sets each card's href from its slug at run time and removes the href when a slug is missing | Live, filled by script. Not a dead link on the live page; without JS the roster is empty rather than wrong | n/a | Fine. Listed because the fixture shows them bare |
| 36 | `/support`, Club perks (export `pages/support.html`) | "✓ A Club badge on your traveler profile", "✓ Early access to the Travel Wire", "✓ A discount on the printed passport book, if and when it exists" | "Join" goes to Ko-fi (row 30). Nothing in the saved code gates the Travel Wire for anyone, so "early access" has no mechanism; no printed book exists; the badge has no field in the saved profile code | Live (Export). Three promises, one hedged | Not touched | Keep only the perks that exist on the day the price is set. Until then the card reads as a waitlist: "Join" becomes "Tell me when the Club opens" with the letter form, and the tip button stays |

**Already handled by the Phase 0 layer or its companions:** rows 1 to 3 (run time only), 5, 8, 9, 11 (noindex), 12 (noindex), 13 (noindex), 21, 27, 29, 32, 33. Row 35 needs nothing. **Remaining:** rows 4, 10, 14 to 20, 22, 30, 31, 34, 36, plus the Designer text behind rows 1 to 3 and 11 to 13.

**The one pattern to reuse:** "Coming soon, get notified" with an email field already exists twice: the home expats line pointing at the Sunday letter form (`tll-redesign-p0-v1.js`) and the Paw waitlist card (`tll-paw-v1.js`). Rows 4, 5, 12, 17, 30 and 36 should use one of those two, not a third form.

---

## 4. Findability

### The nav (13 October export; 20 October edits noted)

10 anchors in the saved nav (`fixtures/stories.html`): the wordmark, 5 links, Share your story, Log in, Sign up, and the member Account link.

| Label | Goes to | Note |
|---|---|---|
| Stories | `/stories` | |
| Destinations | `/destinations` | Reachable. B40 in `handoff/STATUS.md`: Nancy wanted Destinations in the nav |
| Travelers | `/travelers` | |
| Paw Passport | `/the-paw-passport` | |
| About | `/about` | |
| Share your story | `/submit` | Rose button; also added to the phone menu by the site head |
| Log in, Sign up | `/login`, `/signup` | |
| (20 Oct note) The Map | `/the-map` | Placed after Travelers in the nav component on 20 October (handoff note, "done by the original session before the handoff"); not in the 13 October export. The site was published again on 31 October (16.48.3), so the saved record says it is live |
| (20 Oct note) Expats | `/for-expats` | Same: added after The Map on 20 October |

Not in the nav: `/newsletter`, `/travel-wire`, `/pets`, `/gallery`, `/support`. The Map and Expats are in the nav per the saved record; only a Designer readback could show otherwise.

### The footer (13 October export, 31 anchors: 30 links and the wordmark)

| Column | Links | Where they go | Note |
|---|---|---|---|
| Navigate | Home, Stories, The Map, Travelers | `/`, `/stories`, `/the-map`, `/travelers` | |
| Discover | Destinations, The Travel Wire, Pets we travel with, The Layover Lounge, Spotlight, Contact | `/destinations`, `/travel-wire`, `/pets`, `/gallery`, `/spotlight`, `/contact` | Destinations goes to `/destinations`, not `/stories#by-place` |
| Contribute | Share your story, Share photos, For expats, For press, For affiliates | `/submit`, `/share-photos`, `/for-expats`, `/for-press`, `/for-affiliates` | `/for-affiliates` is forwarded to `/creators` by the Phase 0 layer; the 301 is pending |
| TLL | Privacy policy, Terms of service, Editorial charter, Community guidelines, Cookie preferences | `/privacy`, `/terms`, `/editorial-charter`, `/community-guidelines`, `#` | Cookie preferences reopens the consent message |
| Guides | Copenhagen stopover, EES and ETIAS on a layover, The Layover Awards | `/copenhagen-stopover`, `/ees-etias-layover`, `/awards` | The two guides are drafts (404). Awards is noindex |
| Work with us | For brands, The Layover Club, How paid work works | `/for-brands`, `/support#layover-club`, `/editorial-charter#rule-08` | Whether `#rule-08` exists is a Designer check |
| Contact row | hello@thatlayover.life, Instagram, Newsletter, LinkedIn | mailto, instagram.com, `/newsletter`, linkedin.com | |

Right after the wordmark and above the Navigate column: "Every byline a real person." and the three live counts (stories, countries, pets). At the bottom: "Run by humans, supervised by one Samoyed".

### The checks asked for

- **Is `/destinations` reachable?** Yes, from the nav (Destinations) and the footer (Discover). The in-page forward sends `/countries` to `/destinations` (Phase 0), so both addresses land there.
- **Does the footer "Destinations" link go to `/stories#by-place`?** No. It goes to `/destinations`. `/stories#by-place` was the Packet A plan (A2.2 and A9.1 in `handoff/CHANGE-LOG-PACKET-A-2026-10-19.md`) for a "By place" view that was never built: no saved `/stories` code (`stories-head.html`, `stories-footer.html`, `src/pages/stories/v3/`, the Phase 0 and series layers) defines a `by-place` id. Leave the link on `/destinations` until a By place row exists on `/stories`.
- **Where is `/newsletter` linked from?** Only the footer contact row ("Newsletter"). The home letter band, the `/stories` newsletter block and the home expats "Get the Sunday letter" line are forms on the page, not links to `/newsletter`. Nothing in the nav.
- **Where is `/travel-wire` linked from?** Only the footer ("The Travel Wire"). The `/stories` Designer tree (the 13 October state readback `reports/evidence/webflow-export-2026-10-13/state/pages/stories/tree.json` and the 29 October `src/pages/heroes-2026-10-29/trees/stories.json`) does hold five pillar links (`/pillars/layover-guides`, `/pillars/paw-passport`, `/pillars/travel-logistics`, `/pillars/cultural-intelligence`, `/pillars/stories-from-the-road`, each with `data-tll-filter`) and one body link to `/travel-wire` (`tll-fos-wire`, next to "Most read"), but both sit inside blocks hidden in the Designer (`data-tll-chiprow` and `tll-fos`, visibility off). Neither renders: the 13 October export `pages/stories.html` has no `/pillars/` href, and its only `/travel-wire` href is the footer's; the 29 October fixture is the same. So on the page a reader sees, the footer is the only way in.
- **Where are the pet pages linked from?** `/the-paw-passport`: nav, the home Paw band ("Open the Paw Passport →"), the travelers tab row ("Pet travelers"), the home value chip "Dog travel", the about page, the staged expat landing ("Moving with a pet"). `/pets`: footer only ("Pets we travel with"). `/pets/magnus-waffles`: home founders band, about, the Paw Passport page. `/my-pets`: the Paw Passport page ("+ Add your pet") and the staged hero button "Start your pet's passport". `/paw-passport/<slug>` (Magnus Diary): no inbound link in the saved code.

### Two rows for `/stories`

Both sit under the lead card and above the grid, as horizontal rails on phones (the shelf pattern from the home page), each with a mono eyebrow, a Playfair line with one italic rose word, four to six cards, and a "See all" link that opens the matching filter. A row renders only when it has three or more items; otherwise it is left out, so nobody sees an empty rail.

**Row A, "Layover guides"**

- Eyebrow: `LAYOVER GUIDES`. Line: "Six hours in the city, *not* the terminal." Sub: "What to do with a long layover, by someone who had one."
- Feed: the Layovers collection (`/layovers/<slug>`, 7 live items per the user-flow doc). Card: city, hours it needs, the writer. Read through the Worker or a hidden Webflow collection list on `/stories` (the list is the crawlable source; the layer only styles it).
- "See all" goes to the `/pillars/layover-guides` pillar until a Layovers index exists.
- Why here: the word in the site's name has no row of its own anywhere on `/stories`.

**Row B, "For the trail and the start line"**

- Eyebrow: `PURSUITS`. Line: "For the trail and the start *line*." Sub: "Marathons and treks, told by the people who finished."
- Feed, in order of preference: stories whose Theme is one of the pursuit series or pursuit themes once those exist; until then, stories whose card text or hidden country and region blocks contain marathon, trek, hike, summit or trail (the same matching the search uses). Today that is at least Antarctica Marathon, Patagonia and Kilimanjaro (the Phase 0 search index found Kilimanjaro, Toubkal and Patagonia).
- Cards carry a small tag, "Marathon" or "Trek", from the matched word.
- "See all" opens `/stories?q=marathon trek` with the chips from item 8 preset.
- Why here: the home value row already sends Marathons and Trekking to a library search; this row is where that search should land.

---

## 5. One truth everywhere

From the saved code, the 13 October export and the copy sheet. A case-insensitive substring search of `current_text` for nine patterns (48 hours, review, goes live, approval, reply, newsletter, sunday, weekly, no card) matches 34 of the 1,512 rows: TLL-0019, 0032, 0033, 0034, 0054, 0082, 0118, 0168, 0214, 0215, 0240, 0243, 0257, 0679, 0754, 0778, 0798, 0804, 0915, 0957, 0960, 0984, 1023, 1046, 1117, 1157, 1158, 1259, 1292, 1353, 1412, 1451, 1456, 1487. Five of those are "review" caught inside "preview" (TLL-0240, 0754, 0778, 1412, 1451), which leaves 29. Thirteen are about review timing: the 12 rows that contain "48 hours", "goes live" or "approval" (TLL-0032, 0033, 0082, 0798, 0960, 0984, 1023, 1046, 1157, 1158, 1259, 1292) plus TLL-0034. A second pass by page (Contact, Support) and by the words letter, newsletter, inbox and subscribe found 6 support rows and 7 newsletter rows. Every row is cited by id below. Lines the sheet does not hold (the 13 October export bodies, the for-expats fixture, the page footer code) are cited by file.

### Review timing

| Page | Exact string | Which truth it states | Source |
|---|---|---|---|
| Site-wide (head copy swap) | "Reviewed by a human within 48 hours. Free, and your byline stays yours." | A: reviewed before it goes live, within 48 hours | `before/site-head.html`; TLL-0032 |
| Site-wide (head copy swap) | "Reviewed within 48 hours, edited lightly." | A | `before/site-head.html`; TLL-0033 |
| Site-wide (head copy swap) | "A human reviews every photo before it goes up." | A, photos | `before/site-head.html`; TLL-0034 |
| `/submit`, live form | "One editor reads every word in Copenhagen · Reply in 48 hours" | A (and a reply promise) | `form-story-export-2026-10-13.html` |
| `/submit`, live form, Body hint | "Autosaves every 20 seconds. Drafts wait on your account." | Drafts, not timing | same file |
| `/submit`, 29 Oct hints | "A human reviews it within 48 hours" and "A human looks within 48 hours" | A | `tll-submit-ux-v1.js`; TLL-1259 |
| `/submit` and `/share-photos`, success box | On success: "It is live. Read it on the site →" (photos: "Your photos are in the Lounge. See them →"). Only when the Worker call fails (`x.ok` false, or the catch): "Saved. It goes live as soon as the editor sets it up." | B on success. C is the failure fallback only | `tll-intake-v1.js` lines 41 to 44; TLL-1292 is the fallback |
| `/submit` v5 (not live) | "Goes live when you send." | B: live on send, read after | `src/pages/submit/v5/submit-v5.html`; TLL-1157 |
| `/submit` v5 (not live) | "No waiting for approval. The editor reads it after and can correct or pull it under the Charter. You get an email copy." | B | same; TLL-1158 |
| `/submit` v5 (not live) | "Passes the rules, goes live. Your voice stays yours." | B | same; TLL-1046 |
| Country pages, reader empty state | "Nothing from the readers yet. The first submission gets the slot, reviewed by a human within 48 hours." | A | `src/pages/country/v3/live-footer-after.html`; TLL-1023 |
| `/travelers`, press card | "Switch on Press. An editor reviews within 48 hours, and hosted trips stay labeled at the top of every story." | A, for press applications | `tll-travelers-fix-v1.js`; TLL-0984 (and TLL-0960 in the 20 Oct head) |
| `/edit-profile`, press tag | "Reviewed within 48 hours" | A, press | `src/pages/edit-profile/live-2026-10-28/after/4080e4be.html`; TLL-0798 |
| `/for-expats`, application success | "Got it. A human reads every application, usually within 48 hours, and replies by email either way." | A, applications | `fixtures/for-expats.html` |
| `/for-expats`, groups success | "Got it. A human will look, usually within 48 hours. We will email you when it is live, or if we have a question." | A, groups | same |
| `/for-expats`, Claim your desk block | "An editor reads every application and replies within 48 hours." | A, applications | `fixtures/for-expats.html` |
| `/for-expats`, groups intro | "A human checks every listing, usually within 48 hours." | A, groups | same |
| `/for-expats`, directory card with no expert | "No expert in {place} yet. Live there? The desk is yours to claim. A human reviews within 48 hours." | A, applications | `src/pages/heroes-2026-10-29/code/for-expats-footer.html` line 53 |
| `/contact`, THE EDITOR block | "American expat. Travels with a Samoyed. Reads every story before it publishes. Real human, real reply." | A, stories | export `pages/contact.html` |
| `/my-pets`, success box | "Passport issued. Your bestie has a page now. A human checks the details before it goes public, usually within 48 hours." | A, pets | export `pages/my-pets.html` (Webflow done text) |
| `/spotlight` tile, `/travelers` tile, home cover | "We edit lightly and keep your byline." | No timing | `tll-open-slots-v1.js`, `tll-travelers-fix-v1.js`, `tll-mag-cover-v1.html` |
| Phase 0 proposal, not applied | "It goes live when you press send, and Nancy checks it after." | B | `docs/tll-phase0-change-log-2026-11.md` section 7 |

Two truths are live at once: A (reviewed first, within 48 hours) in the 15 rows marked A above (none of them the page header band, which is not on the site), and B in the intake success box ("It is live."), which is also what the Worker does. C (the editor sets it up) shows only when the intake call fails. Nancy's 19 October decision, as the Phase 0 log records it, is B.

### Support reply time

| Page | Exact string | Truth | Source |
|---|---|---|---|
| `/support`, hero | "SUPPORT · ONE HUMAN READS EVERYTHING. Six doors. Pick yours." then "Response times: editorial 48h · takedowns + safety 4h · press 3 business days" | Same day is not said here; 48h, 4h, 3 business days by kind | export `pages/support.html` |
| `/support`, Story correction door | "We fix factual notes within 24 hours" | 24 hours | same |
| `/support`, Delete my account door | "Stories, passport, and pets removed within 30 days. Offsite archive purged within 90" | 30 and 90 days | same |
| `/support`, DMCA-style takedown door | "We act within 7 days" | 7 days | same |
| `/support`, Appeal door | "A different editor reviews. Within 14 days" | 14 days | same |
| `/support`, Press inquiry and sponsored-story doors | "We respond within 3 business days" | 3 business days | same |
| `/support`, foot of the page | "Run by Nancy Carleton from Copenhagen, Denmark. A human will write back, usually the same day." | Usually the same day | same |
| `/contact`, hero | "SAY HELLO · REAL HUMAN, REAL INBOX. Three doors. Pick one. Everything reaches one human, usually the same day. Pick the door that fits." then "Response times: editorial 48h · takedowns 4h · press 3 business days" | Usually the same day; 48h, 4h, 3 business days by kind (note "takedowns 4h" here against "takedowns + safety 4h" on /support) | export `pages/contact.html` |
| `/contact`, Say hello door | "Corrections, ideas, account help, the bus that left without you. All welcome. Nancy answers personally, no autoresponder gauntlet." | A person, no time | same |
| `/contact`, relay form (hidden by Phase 0) | Done: "Sent to TLL. A human reads it, then passes it on. If they reply, it comes to the email you gave." Limit: "Three messages an hour from one browser." | No time | same |
| `/submit`, live form | "Reply in 48 hours" | 48 hours (matches "editorial 48h") | `form-story-export-2026-10-13.html` |
| `/for-expats` | "usually within 48 hours, and replies by email either way" | 48 hours | `fixtures/for-expats.html` |
| `/contact?relay=` | "Members choose how to be reached. Use the links on their profile, or write to us at hello@thatlayover.life." | No time | `tll-phase0-v1.js`; TLL-0945 |
| Tell the editor card (every page) | "Your note", "Email" | No time | `src/pages/home/live-2026-10-28/ux/note-markup.html` |
| `/faq` | Designer body, not in the saved code (the "Short answers. Longer ones by email." line the copy sheet lists is the removed header band) | Unknown | Designer |

The two pages already agree with each other: a reply usually the same day, and a response-times line by kind of request. There is no "A human answers within 48 hours" on either page, so that line (the first draft of this audit proposed it) would have added a fourth promise.

### Newsletter schedule

| Page | Exact string | Truth | Source |
|---|---|---|---|
| Home, letter band | "One story. Sunday morning. Lounge wine optional." | Weekly, Sunday | `c0c4bf75.html`; TLL-0214 |
| Home, letter band | "Sundays at 09:00 Copenhagen time. Unsubscribe anytime." | Weekly, Sunday, 09:00 | same; TLL-0215 |
| Home, expats line | "Get the Sunday letter and hear when they open →" | Sunday | `tll-redesign-p0-v1.js` |
| `/submit` v5 (not live) | "OK for the Sunday letter" | Sunday | `submit-v5.html`; TLL-1117 |
| `/submit`, live form | Syndication checkbox labeled with its field name, "syndication-newsletter" | A bug: the label is the field name | `form-story-export-2026-10-13.html` |
| `/newsletter` page | "The dispatch. The dispatch is coming. One email from Denmark when there is something worth sending: layover intel, race-week notes, EU pet paperwork, and Magnus in the back seat. Leave your address and you get the first one." Label "Your email", button "Send me the first one", done text "You are on the list. The first dispatch lands in your inbox." | Capture only, no day, no time. This page already states the truth proposed below | export `pages/newsletter.html` |
| Footer, contact row | Link "Newsletter" | A third name | `fixtures/stories.html` |
| `/stories`, newsletter block | Designer; the a11y audit saw a headline with the rose word "worth it" | Unknown | Designer |
| Home, library rail | "More landing weekly." | Stories, not the letter | `src/seo/live-2026-10-28/home/library-rail-94ce12c0.html`; TLL-0168 |

One thing, three names: "the Sunday letter" (home band and the expats line), "Newsletter" (footer and the page address), "the dispatch" (the `/newsletter` page itself). The first draft of this audit proposed "The Layover Letter", which would have been a fourth.

### The one line per truth

- **Review:** "Your story goes live when you send it. Nancy reads it after and may fix typos or pull it under the Charter." Photos: "Your photos go live when you send them. A human looks after." Use it in the site-head swaps, the live form's "One editor reads every word" line, the 29 October hints, the country empty state, the `/contact` editor block ("Reads every story before it publishes") and the `/my-pets` done text. The intake success box already says B ("It is live. Read it on the site →"); only its failure fallback needs a truer line: "Saved, but not on the site yet. Nancy will set it up by hand." Press, expert and group applications are different: they are approved from the next-day report (`tll-intake-v1.js` header), so their line is "A human reads every application and replies by email, usually the next day." That replaces the three for-expats 48-hour lines and the directory card line. Nancy to confirm the 19 October decision applies to photos and link-outs too.
- **Support:** "A human writes back, usually the same day." It is what `/support` and `/contact` already say; put it on the Tell the editor card too. Keep one response-times line, identical on both pages: "Response times: editorial 48h · takedowns and safety 4h · press 3 business days" (today /support says "takedowns + safety", /contact "takedowns"). The `/submit` form's "Reply in 48 hours" matches "editorial 48h" and can stay as a reply promise, not a review promise. `/faq` is a Designer check.
- **Newsletter:** one name, then the line `/newsletter` already uses: "{Name} is coming. One email when there is something worth sending. Leave your email and you get the first one." The home band and the expats line adopt it; the footer link takes the name. Capture only, no day, no time, until a letter has gone out two weeks running. Then "Sundays, 9 a.m. Copenhagen time" can come back. The name is Nancy's call (Needs Nancy 3).

---

## 6. Purpose and audience in the first screen

Rule used: the first screen must say what the page is for and who it is for without scrolling. "First screen" is the hero as the saved code shows it: the 29 October fixtures, the 13 October export where no newer body is saved, and the layers that redraw a hero. The page header band is not on the site (see the note at the top), so none of its lines appear here; where a page body is Designer-only, the row says so. Lines are under 15 words, one joke or one fact at most, no more.

| Page | First screen today (saved) | Says what? | Says who? | Proposed line |
|---|---|---|---|---|
| `/` | H1 "Find your next somewhere." Cover: "This week's cover", "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", Read the cover story, Join free | Stories, yes. The map, no | Readers, yes. Members, no | "Stories from people who went. A free map for where you have been." |
| `/stories` | "The Library. {N} stories, all worth the detour." then the place chips and the search (fixture; the count is live) | Yes | Partly | "Every story here is one trip, told by the person who took it." |
| `/stories/<slug>` | Photo, title, byline. No line about the site for a visitor from search | No | No | Under the byline: "A member's trip on That Layover Life. Join free, keep your own map." |
| `/destinations` | "THE ATLAS. Every story starts somewhere." then a line about every country with a story and every country still waiting for one (13 Oct export; the flag grid is drawn by `ds3-destinations.js`) | Yes | No | "Every country by flag. Pick one and read who has been." |
| `/countries/<slug>` | Designer template, not in the saved code; the page code (`country/v3/live-footer-after.html`) adds "Been to {name}?" with Been here and Want to go, and the empty states | Unknown | Unknown | "One country, its stories, and a Been here button for your map." |
| `/travel-wire` | Designer body, not in the saved code | Unknown | Unknown | "Travel news we read this week, each one linked to its source." |
| `/pillars/<slug>`, `/collections/<slug>`, `/themes/<slug>` | Designer only | Unknown | Unknown | "{Pillar}: the stories that fit, newest first." |
| `/layovers/<slug>` | Designer template, not in the saved code | Unknown | Unknown | "A layover guide, by someone who had this layover." |
| `/travelers` | "Where the Travelers ... Everyone on TLL, in one place." plus faces | Yes | Partly | "The people who wrote the stories. Find one who knows your next city." |
| `/contributors/<slug>` | Name, stamps, flags. Nothing about the site | No | No | "A traveler's map and stories. Start yours free." |
| `/pets` | Designer body, not in the saved code | Unknown | Unknown | "Pets with passport pages of their own. Add yours from My pets." |
| `/pets/<slug>` | Pet name, countries | Partly | No | "{Name}'s Paw Passport: stamps, firsts, and the human who carries the bags." |
| `/spotlight` | Designer hero, not saved. The site head's `spotlight()` draws two "COMING SOON · Spotlight slot" cards and an open-slot tile; `tll-open-slots-v1.js` hides the two and turns the tile into "Write for TLL · Pitch your layover."; then one feature (Nancy) | No | No | "One member a month, in their words. Pitch to be next." |
| `/creators` | Designer hero, not saved; the page code (`src/pages/creators/live-2026-11-01/`) adds the empty state "Nobody has switched on 'I'm a creator' yet." | No | No | "Members who make things. Switch on Make things to be listed." |
| `/for-expats` (live body) | "Eight years somewhere beats eight days everywhere." Become a Location Expert | Partly (contributing) | Expats who want to write | Staged line is right: "Your homes count too. Free. No card. 16+." Add "For people who moved abroad." |
| `/the-paw-passport` | "Your bestie gets a passport too." | Yes | Pet owners, yes | Keep. Staged: "Every pet deserves a passport." Add "For pets who travel and the humans who do the paperwork." |
| `/pursuits/<slug>` | 404 today; work trips staged: "Back home? Good. Now tell us." | Staged only | Staged only | "Work trips, plus the free evening. Stamp the city, tell the story." |
| `/for-press` | Designer body, not in the saved code (the hosted-trips rule is on the press tile of `/travelers`, a different page) | Unknown | Unknown | "For travel journalists: a profile, a Press label, hosted trips disclosed." |
| `/for-brands` | Designer body, not in the saved code; `for-brands-head-head.html` is SEO tags and CSS only | Unknown | Unknown | "For brands: how paid work runs here, and what it never buys." |
| `/awards` | Designer body, not in the saved code; `awards-head-head.html` styles the hero and the member form but holds no copy | Unknown | Unknown | "The Layover Awards. Members nominate in December. No sponsor votes." |
| `/about` | "It started with a glass of wine in the lounge." Eyebrow ABOUT THAT LAYOVER LIFE | Not in the first line | No | "One editor, one Samoyed, and a free place to keep your trips." |
| `/support` | "SUPPORT · ONE HUMAN READS EVERYTHING. Six doors. Pick yours." The six doors are help doors: Story correction or note, Delete my account, DMCA-style takedown, Appeal an editorial decision, Press inquiry, and a sponsored-story door. The Club sits below as "the tip jar with a badge" (13 Oct export) | Partly | No | "Help from one human: corrections, takedowns, appeals, press. Usually the same day." |
| `/contact` | "SAY HELLO · REAL HUMAN, REAL INBOX. Three doors. Pick one. Everything reaches one human, usually the same day." (13 Oct export) | Yes | Partly | "Write to Nancy. A human writes back, usually the same day." |
| `/newsletter` | "The dispatch. The dispatch is coming. One email from Denmark when there is something worth sending ... Leave your address and you get the first one." then "Your email" and "Send me the first one" (13 Oct export) | Yes | Partly | Keep, once the name is settled (item 5): it already states the capture-only truth |
| `/signup` | "FREE TO JOIN. Join the Travelers. Check your travel stats. Register your pet. Share your story ..." (13 Oct export) | Partly | No | "Free. No card. 16+. Your map starts in a minute." |
| `/the-map` (visitor) | "THE MAP · EVERY COUNTRY, COUNTED. Every country, on the map. Signed in, this is your map: tap a country to log it ..." then two zero counters, then the sample map (fixture) | Yes | Not for a visitor | "Your countries, tapped onto one map. Free, and yours to keep." See item 9 |
| `/account` | "YOUR ACCOUNT. Hi, Traveler. This is your corner of the library: the countries you have logged ..." (13 Oct export); visitors get "Behind the sign-in" (`account/live-2026-10-27`) | Yes | Yes | Keep |
| `/edit-profile` | "Your profile · Edit mode. Edit your profile. Saved to your account when you hit Save ..." (13 Oct export; `tll-ep-ux-v1.js` now says changes save as you type) | Yes | Yes | Keep, but the save line must match the layer (item 10 row 13) |
| `/submit` | "Two ways to file: Write it here / Link a story you already published" (13 Oct export). The "Reviewed within 48 hours by a human" one-liner the copy sheet lists was the removed header band | Yes | Members | "One trip, in your words. Goes live when you send." (fixes item 5 too) |
| `/share-photos` | Members: "The Layover Lounge. Submit your shot. Real photos from real places. No filters, no stock, no staging. If you were there, it counts." Visitors: the gate "Sign in to drop your photos." (13 Oct export; `share-photos/v3/applied/elements-readback.json`) | Yes | Partly | "Photos from your trips, credited to you, in the Lounge." |
| `/gallery` | Designer body, not in the saved code | Unknown | Unknown | "Members' photos from the gate, the trail and someone's kitchen. Send yours." |
| `/404` | Designer body, not in the saved code | n/a | n/a | The user-flow doc's proposal, "This page took a different connection.", plus one button to `/stories` |
| `/faq`, `/editorial-charter`, `/community-guidelines`, `/privacy`, `/terms`, `/cookies` | Designer bodies, not in the saved code | Unknown | Unknown | Keep what is there if it is plain; serious pages stay serious. A Designer readback decides |
| `/marathon-diaries/<slug>`, `/paw-passport/<slug>` | Nancy's words | n/a | n/a | Untouched, as asked |

Count: 34 page types checked; 28 get a proposed line, 5 keep what they have (`/the-paw-passport`, `/newsletter`, `/account`, `/edit-profile`, the faq and legal set), 1 (Nancy's diaries) is left as it is. For 13 of the 34 the first screen is a Designer body with nothing saved, so "today" is unknown there: `/countries`, `/travel-wire`, the pillar and collection templates, `/layovers`, `/pets`, `/spotlight` (hero), `/creators` (hero), `/for-press`, `/for-brands`, `/awards`, `/gallery`, `/404`, the faq and legal set.

---

## 7. Dead ends

"Dead end" means the page runs out with no next step for the person most likely to be there.

| Page type | How it ends today (saved code) | What the staged ux layer adds (`tll-ux-v1.js`, `?preview=ux`; `docs/expat-pets-ux-2026-10-31.md`) | Still a dead end for |
|---|---|---|---|
| Story | Share row, the keep-reading grid (live), reader notes, the end-of-story ask "Pitch a layover story · send one photo" with "One trip, told by the person who took it." (`tll-story-ask-v1.js`, `tll-story-is-v1.js`) | "In this story" for long stories, a Next story card (same place or series), then the join card for visitors: "Start your free map. Free. No card. 16+." Events story_read_75 and next_story_click | Nobody once published. Until then a visitor gets no join step |
| Guide (`/layovers/<slug>`, `/copenhagen-stopover`, `/ees-etias-layover`) | Designer only; the user-flow doc says the next step is "A story". The two stopover guides are drafts | Nothing | Every reader. Needs a "More layovers" row and the join card |
| Country | Stories, then "Nothing filed from here yet" or "Nothing from the readers yet. The first submission gets the slot, reviewed by a human within 48 hours." and "Not logged yet. Put yourself on the map." (members: Been here; visitors: `/login?redirect=`) | Nothing (the layer does not run on country pages) | A visitor on a country with no story: the only exits are a mailto and the login link |
| Profile | Stories list or "{First name} has not written one yet.", pets, the continent album and Slide Show (live), links. No "Start your own map" in the saved profile code (`contributors-template-code-footer.html`, `tll-pf5-profile-v1.js`) | Nothing on profiles (the expat layer adds Lived in, milestones and My moves, not a join step) | Every visitor who arrives from a friend's link. The user-flow doc names the step: "Their album Slide Show, then Start your own map" |
| Audience landing | `/for-expats` live body ends on "Bring the local truth. Claim your desk →" (no href in the saved tree); `/the-paw-passport` ends on the Magnus story card | The staged expat and pet reworks each end on one button and leave empty blocks out | Fine once published |
| Empty states | `/stories` search miss: the what-a-story-is note with "See all stories" and "Share your story". Place chip miss: "No stories from {place} yet. Be the first. Share your story →". `/creators`: "Nobody has switched on 'I'm a creator' yet." (no button). `/for-expats` groups: "No groups listed yet. The first one goes here." (no button). `/the-map` member: "Your map starts empty. Click a country to log it, or search the list." Passport wall, visitor: "Sign in and your countries show up here as stamps or a list. Start your own map →". Pet page: "The first stamp goes here after the first trip." Work trips hub (staged): "No stories in this series yet.", "No work-trip stamps shown yet." | Welcome steps on `/account?welcome=1` and for an empty map: "Your first stamp goes here. The map is one tap away." with See my map. Every empty state in the layer follows the user-flow rule (one icon, one sentence under 15 words, one button) | `/creators` and the `/for-expats` groups list: no button. Both are Designer edits |
| Errors | `/404`: Designer body, nothing saved (the "Nowhere. Rebooking you on the next page." line in the copy sheet was the removed header band). Map load error (embed): "LOADING THE MAP CODE ... The map needs JavaScript. The list of places is on the map page." Form fails: "That did not send. Try again, or email hello@thatlayover.life" (`/for-expats`), "Could not save. Try again." (story save), "Not saved. Check your connection and tap again." (Quick log), "Saved to your account. Your public page did not update yet" (`/edit-profile`). Webflow's default fail text where it was not replaced (Designer; it carries an exclamation mark, copy audit limit 9; the 13 Oct export shows it replaced on `/contact`, `/newsletter`, `/my-pets` and `/share-photos`) | Nothing | `/404` needs one button; the map error needs a link to the list it mentions; the Webflow default fail text needs replacing page by page |
| Gated pages (`/account`, `/submit`, `/share-photos`, `/my-pets` signed out) | `/account`: "Behind the sign-in" with three lines and a join button (`account/live-2026-10-27`). `/share-photos`: a gate, "· The Lounge · Sign in to drop your photos. Photos that don't need a full story. Free to share forever." with "Log in" and "Join the Travelers" (`share-photos/v3/applied/elements-readback.json`; no saved layer renames it). `/submit` and `/my-pets`: Designer | Nothing. The Phase 2 inventory proposes one gated template (cream page, three rows of what you get, Join free, "Free. No card. 16+.") | `/submit` and `/my-pets` until the template lands |

---

## 8. Search and filters on `/stories`

### What exists after the Phase 0 fix

Read from `before/stories-head.html`, `before/stories-footer.html`, `tll-phase0-v1.js`, `tll-series-v1.js`, `tll-stories-places-v1.js`, `tll-stories-noimg-v1.js`, `tll-story-is-v1.js`.

1. **Search** (`tll-lib-search-v4` in the stories footer, 9 Oct): a GET form. Submit reloads `/stories?q=`. Every word must match the card's visible text plus its hidden country, region and author blocks (accents stripped). Misses get `data-tll-q-miss`, hidden by CSS. Zero hits: the cards all come back under a note.
2. **Phase 0** (`tll-phase0-v1.js`): on phones the input keeps its width (it was 0px). With a `?q=`, the layer fetches `src/data/story-search-index.json` from jsDelivr (pinned commit) and also matches title, place, country and body words per slug. New stories match on card text until the index is rebuilt. Words of 3 letters or more only.
3. **Search UI** (`tll-lib-search-v2`, a style block in the stories head that draws the pill; `tll-lib-lead-v1`, 9 Oct, in the footer): the lead script moves the form into the filter bar and marks the first visible card as the lead; `tll-lib-search-v4` reads `?q=` and shows a Clear link while a query runs. Placeholder: "A country, a train line, a feeling" (set by `tll-s3-stories-js-v1`, 10 Oct). There is no script called `tll-lib-search-UI-v2`.
4. **Place chips** (`tll-lib-chips-v1`, 28 Sep): Designer anchors with `data-tll-place` filter by the card's hidden region text; `data-tll-sort` chips exist but the sort row is hidden in the Designer. Newest first on load. Zero cards: a dashed note, "No stories from {place} yet. Be the first. Share your story →".
5. **More places** (`tll-stories-places-v1.js`, 29 Oct): Asia, Middle East and Oceania chips added in alphabetical order.
6. **Series chips** (`tll-series-v1.js`, 31 Oct): one `<button aria-pressed>` per series that has stories, inside a `role="group"` labeled "Story series", placed above the collection list. A chip hides every `.w-dyn-item` whose `data-tll-series` is not the chosen slug (the `hidden` property). Nothing shows until a story carries a series theme.
7. **No results** (`tll-s3-stories-js-v1`, then `tll-story-is-v1.js`): the search note reads "No stories match '{q}' yet. Share your story → Clear the search", and the story-is layer replaces it with what a story is plus "See all stories".
8. **Cards without a photo** (`tll-stories-noimg-v1.js`): an ink panel with the country; the lead goes to the newest story with a photo.

### What is missing

- A search needs a page reload; a chip does not. After a reload every chip resets.
- Only `q` lives in the URL. Place and series are not in the URL, so a shared link or the back button loses them.
- Three scripts each decide "no results" on their own: search (hits 0), place chips (shown 0) and series (nothing). A search plus a chip with zero cards shows no note at all, or the wrong one ("No stories from Asia yet" when the search was the reason).
- The search hides misses with an attribute, place chips with `display:none`, series with `hidden`. They combine as AND by accident, which is right, but the lead-card marker and the zero-result notes only listen to two of the three.
- No suggestions: a miss offers "Share your story" and "Clear", never a nearby place or a related word.
- The home search ("Search a country, a layover, a feeling…") and the library search have different placeholders and the home one has no label (a11y audit, section 1).

### Design: chips, persistence, and the no-results state

**Chip rows (two rows, under the search, 44px pills, `aria-pressed`, one active per row, the first chip "All")**

| Row | Chips | Data source | Rule |
|---|---|---|---|
| Place | All, Europe, Africa, Americas, Asia, Middle East, Oceania, Antarctica, then any country with 2 or more stories | The card's hidden `data-tll-region` and `data-tll-country` blocks (Designer bindings that already exist); the country reference on the story (the Stories "Countries" multi-reference, if it was added; see the 20 Oct handoff note) | A chip renders only when it has at least one story. Country chips appear after the region chips, alphabetical, capped at 8 |
| Pursuit | All, Layovers, Marathons, Treks, Food, Work trips, Expats, Pets, then each series by name | Series: `GET /series` (slug per story, already in `tll-series-v1.js`). Pursuits: the story's Theme or pillar once pursuit themes exist; until then the same word match the search index uses (layover, marathon, trek or hike, food or market or restaurant, dog or cat or pet) on title, place and body | A chip renders only with 3 or more stories. A series chip and its parent pursuit chip (Pets and "Cats Who Travel") are both allowed; choosing the series narrows the pursuit |

**One filter function.** Replace the three hide mechanisms with one: every card gets `data-tll-hide` when it fails any of `q`, `place` or `pursuit`; CSS hides that attribute; the lead-card marker, the result line and the no-results note all read the same list. The existing scripts can stay as they are if the new layer runs last and re-applies; cleaner is to retire `tll-lib-search-v4` and `tll-lib-chips-v1` in the Designer footer once the layer is live.

**Query persistence**

- The URL is the state: `/stories?q=marathon&place=antarctica&pursuit=marathons`. Chip clicks and typing (debounced 250ms, no reload) call `history.replaceState`; Enter or the Search button calls `pushState` so the back button steps through searches.
- On load, read the URL first, then `sessionStorage` (`tllLibState`) when the URL is bare, so a reader who opens a story and comes back sees the same shelf. A visible "Clear" link appears whenever any of the three is set, and clears all three.
- The home search keeps sending `?q=`; the value row's Food, Marathons and Trekking chips send `?pursuit=food` and so on instead of a raw word, so they land on the chip, not on a text match.
- A result line in `role="status"` above the grid: "{n} stories · {place} · {pursuit}", updated on every change, so screen readers hear the count without a reload.

**No results, with suggestions (one block, three parts, under 15 words per sentence)**

1. The headline: "Nothing filed for '{q}' in {place} yet." (drop the parts that are not set).
2. Suggestions, in this order, each a 44px chip: the two place chips closest to the chosen one that have stories (closest by the region order above, then alphabetical); the two pursuit chips with the most stories; the three newest stories as small cards. For a text miss, also "Did you mean {word}?" when one word in the index is within one letter of the query (the index already holds every title, place and country).
3. Two actions: "Clear the search" and "Share your story →" (`/submit`). The story-is sentence stays underneath: "One trip, told by the person who took it."

Empty state rule from the user-flow doc applies: one sentence of 15 words or fewer and one main button; the suggestions are chips, not buttons.

---

## 9. Map as hero

### What a signed-out visitor sees on `/the-map` today

From `fixtures/the-map.html` (29 Oct tree), `tll-page-heroes-v1.js`, `tll-phase0-v1.js`, `tll-redesign-p0-v1.js`, `src/pages/the-map/live-2026-10-25/APPLY-LOG.md`, `map-2.0/dist/tll-map-layers.js` and `passport-embed.src.html`, top to bottom:

1. The dark hero: eyebrow "THE MAP · EVERY COUNTRY, COUNTED", H1 "Every country, ...", a paragraph that starts "Signed in, this is your map: tap a country to log it, and the counter is your honest total. Signed out, you see ...", a story photo behind under a deep scrim with a credit (`tll-page-heroes-v1.js`), and "OPEN FULL SCREEN →" (hidden by Phase 0).
2. The counters: "0 / 249 Places visited", "0% of the world", then "Hover for the name · Click a pin to read the story".
3. Map 2.0 with `data-tll-visitor="sample"`: a made-up traveler with 30 places and 3 layovers, and a note: "SAMPLE MAP. These countries belong to a made-up traveler, so you can see how the map works. None of it is a real trip. Start your own map → (to `/signup`) · Sign in (to `/login`)". Card badges read "· SAMPLE". The owner's record is never requested.
4. Three explainer cards: "87 Already logged" (relabeled by `tll-redesign-p0-v1.js` line 26 to "Nancy's map: {n} countries + Antarctica", with the live count), "108 Still to go. The cream. The next 108 conversations at 9am in someone's kitchen.", "1,273 World Heritage sites". Then "Add a park you have been inside →" to `/submit`.
5. The passport wall (`passport-embed`): "Your passport. Countries and territories ..." with "Sign in and your countries show up here as stamps or a list. Start your own map →", a Find a country box and the 249-country list ("Unpacking 249 countries and territories…").
6. "Back to your account →" and "Edit your countries on the map ↑" (member links; see item 3 row 22).

So the visitor's first screen is a headline, a paragraph about two states, and two zero counters. The sample map, the one thing that shows what the site does, starts a screen down, and its "Start your own map" button is the fourth call to action on the page.

### What "lead with the sample map and Start your own map" changes

1. **The map is the hero.** The dark hero collapses to one line over the map: eyebrow "THE MAP", one sentence "Your countries, tapped onto one map. Free, and yours to keep.", nothing else.
2. **The sample note becomes the hero's second line.** "This is a sample. Tap a country to try it." sits in the map's corner, and the one button on the first screen is "Start your own map" (rose, 44px) with "Sign in" as a text link. "Free. No card. 16+." under the button, as the gated template proposes.
3. **Taps carry into sign-up.** A visitor's taps on the sample are kept in the browser (`tllStates`, the same record the Quick log writes) and sent along as `/signup?next=/the-map&mark=...`; after sign-up the welcome flow (staged, `tll-ux-v1.js`) reads them as the first stamps. The expat-pets doc lists this as not done because it lives in the map page code in Webflow, which is the one place this change has to be made.
4. **Zero counters go.** "0 / 249" and "0%" are hidden for visitors (they are the sample's numbers or nobody's). Nancy's count, the World Heritage card and the park link move below the passport wall, labeled as hers (the redesign-p0 label already says so).
5. **Member links hide for visitors.** "Back to your account", "Edit your countries on the map" and the passport wall's sign-in line collapse into the one button above.
6. **The passport wall stays**, as the second screen: it is the honest list and it already has its own "Start your own map".

What it touches: the map page's Designer markup (hero, counters, links) and the page code in Webflow; the map engine needs one new mount attribute to expose the sample taps. Nothing in the Worker.

---

## 10. Forms

Every form in the saved code. "Visible labels" means a `<label>` or text next to each field, not a placeholder. "Inline errors" means a message under the field with `role="alert"` or `aria-invalid`. Counts for shared ids are from `docs/phase2-a11y-audit-2026-11.md` section 2.7, measured on the 13 October export.

| # | Form | Page | Visible labels | Inline errors | Disabled buttons without a reason | Autosave | Shows "Free. No card. 16+." |
|---|---|---|---|---|---|---|---|
| 1 | Sign up (Memberstack) | `/signup` | Yes, but at 11px (`label.tll-micro`) and two fields carry two labels; 3 of 5 fields share `id="field"` | Yes: `au3-auth.js` adds `role="alert"`, `aria-invalid`, text messages ("Enter your email address.", "Your password needs 8 characters or more.", "Tick this box to agree before you join.") | No | No | No. The header says "Free to join. Free forever." The value row and the staged expat hero say "Free, no card, 16+" |
| 2 | Log in | `/login` | Yes (11px); 2 fields share an id | Yes (same script) | No | No | n/a |
| 3 | Forgot password | `/forgot-password` | Yes | Yes (same script) | No | No | n/a |
| 4 | Share a story, Webflow form, three steps | `/submit` | Yes: 90 `<label>` elements inside 63 `.tll-pen-field` wrappers with hints, none with a `for`, and 34 of 82 fields share `id="field"` or `"checkbox"`; the syndication checkboxes are labeled with their field names ("syndication-newsletter") | No. Native `checkValidity` only (`page-footer-live.html`); no `role="alert"`, no `aria-invalid`. `tll-intake-v1.js` adds one note under the body when the last line does not end a sentence | Webflow's Turnstile keeps the submit disabled until it loads, with no text saying why (the search forms had to be detached from it) | Yes, every 20 seconds to the browser (`tllStoryDraft`) and to the member record; "Draft saved {time}" in the step bar | No (members only) |
| 5 | Link-out story | `/submit` | Yes (mono uppercase labels at 10px) | No | Same Turnstile | No | No |
| 6 | Submit v5 (prototype) | not live | Yes, with REQUIRED marks and counters | "Fix it" and "{n} to go" rules; the Send button is disabled with the reason shown ("8 to go", "0 OF 8 RULES") | No, the reason is shown | "SAVES AS YOU TYPE" | No |
| 7 | Share photos | `/share-photos` | Yes, Designer labels; 12 of 16 fields share `id="field"` or `"radio"` | Yes: `tll-photos-form-v1.js` (the page's own script; `tll-photos-form-v2.js` in the v16 bundle runs the same code with 30 photos and PNG) sets `aria-invalid` and `aria-describedby`, "Tick this one to send.", "{n} things to fix above.", file errors by name | No | No | No. The gate reads "Sign in to drop your photos." with "Log in" and "Join the Travelers" (`elements-readback.json`) |
| 8 | Contact relay form, the one form on `/contact` (`<form data-tll-form="relay">`, 13 Oct export) | `/contact`; `?relay=` shows a note instead | Yes: "Your name", "Your email · for the reply only", "Your message" (mono 10px per the a11y audit); the 4 shared `id="field"` are its name, email, message and honeypot | Webflow done and fail boxes with their own text: "Sent to TLL. A human reads it, then passes it on. If they reply, it comes to the email you gave. Nothing else is shared." and "That did not send. Try again in a minute, or write to hello@thatlayover.life and name the person you are trying to reach."; limit text "Three messages an hour from one browser" | Turnstile | No | n/a. Hidden by Phase 0 (`[data-tll-relay]{display:none}`) |
| 9 | Tell the editor | every page (footer component) | Yes, mono labels "Your note" and "Email" (`note-markup.html`); "Email, if you want a reply (optional)" is the placeholder `tll-foot-v1.html` line 37 sets on `#tll-note-email` | No (Webflow done and fail boxes only) | Turnstile | No | n/a |
| 10 | Newsletter, home letter band | `/` | No label on `#h3-news-email` (placeholder only in the 28 Oct embed; axe critical in the 13 Oct embed) | No | Turnstile | No | n/a |
| 11 | Newsletter, `/newsletter` page | `/newsletter` | No label on `input#email` (axe critical) | No | Turnstile | No | n/a |
| 12 | Newsletter, `/stories` block | `/stories` | Designer | No | Turnstile | No | n/a |
| 13 | Edit profile | `/edit-profile` | Yes; 23 of 57 fields share an id; `tll-ep-ux-v1.js` relabels some at run time | Partly: the save bar says what went wrong and offers Try again; country no-match text ("No country by that name. Try the English name or its two letter code."); no `aria-invalid` | No | Yes: "changes save as you type", "Saving", "Saved {time}" in the bottom bar | n/a |
| 14 | My pets (`<form data-tll-form="add-pet">`, 13 Oct export) | `/my-pets` | Yes: "Pet name", "Species", "Breed", "Age (years)", "Short bio", "Avatar photo", "Pet gallery (up to 5)", "Countries crossed together", "Instagram", "TikTok", "Strava", with hints ("Square crop preferred. 600x600 minimum."); 6 of 12 fields share `id="field"` | Webflow done and fail boxes only: "Passport issued. Your bestie has a page now. A human checks the details before it goes public, usually within 48 hours." and "That did not save. Check the name and species, then try again. Still stuck? Write to hello@thatlayover.life and we will add your bestie by hand." No `aria-invalid` | No (button "Create passport →") | No | n/a |
| 15 | Quick log | `/the-map` | Yes (one search, four boxes BEEN, LIVED, WANT, LAYOVER) | Yes, as text: "No country by that name. Try the local spelling or the two-letter code.", "Not saved. Check your connection and tap again." | No | Every tap saves | n/a |
| 16 | Places Been import | `/the-map` | Yes | Yes: "That does not look like a Places Been export." | No | n/a | n/a |
| 17 | Pursuit stamps (staged) | `/edit-profile` | Yes | Yes: "Pick a country.", photo upload error | Yes: 7 `.disabled=` assignments on 4 controls in `tll-stamps-v1.js` (the work-trip box, line 72; the Show switch, line 80; the Keep this one private box, line 85; the Add button, lines 89 to 92). While the Worker route is down nothing shows; the Add button disables while saving with "Adding…" or "Cleaning and uploading the photo…", the switches with no text | Saves per stamp | n/a |
| 18 | Welcome steps (staged) | `/account?welcome=1` | Yes ("Home country", "Where have you been?") | No | No | Saves the way the map saves | The join card on stories says it; the welcome does not need to |
| 19 | Travel style question (staged) | `/account` | Yes, multi-select with Skip | n/a | No | Saves on tap | n/a |
| 20 | Location Expert application | `/for-expats` | Designer (13 Oct body); success "Got it. A human reads every application, usually within 48 hours" | Unknown | Turnstile | No | No |
| 21 | Expat group form | `/for-expats` | Designer | Unknown | Turnstile | No | No |
| 22 | Awards nomination (Memberstack) | `/awards` | Mono 9px labels (Phase 2 inventory, section 5) | Teal success and rose error messages | Unknown | No | No |
| 23 | Paw waitlist (staged) | `/the-paw-passport` | Yes (email, pet name, what they want, one consent box) | "That did not go through. Try again." | No | No | n/a |
| 24 | Pet passport details (staged) | `/my-pets` | Yes | Unknown | No | Saves through the Worker | n/a |
| 25 | Library search | `/stories` | Label visually hidden ("The Library" line is hidden by the fix-first styles); placeholder set by script | n/a | Detached from Turnstile on purpose | n/a | n/a |
| 26 | Home search | `/` | No label; placeholder "Search a country, a layover, a feeling…" | n/a | Detached from Turnstile | n/a | n/a |
| 27 | Souvenir collections (layer) | `/edit-profile`, "My collections" under 04 Your crew | Yes: Add an item with collection, country (required), optional city, year, caption, photo; each collection has a "Show on my profile" switch, off until turned on | Text only: "Pick a country.", "That did not go through. Try again.", "The photo could not be uploaded. Try another, or add it without a photo."; no `aria-invalid` | 5 `.disabled=` assignments (controls disable while a save runs) | Saves per item through the Worker | n/a. Live in 16.48.3 but shows nothing until the `/collections/*` routes answer (`tll-collections-v1.js` header) |
| 28 | Report a card | `/creators`, Living Library (staged) | A mailto link, not a form | n/a | n/a | n/a | n/a |
| 29 | More links (layer) | `/edit-profile`, under Shop and partners | Yes: up to 12 links, each a type (Web link, PDF, YouTube video, X post, TikTok and more), a label and a link | None | No | Through the editor's own save (`window.TLLEP.set`), so the save bar reports it | n/a. Live (`tll-ep-linkstack-v1.js`, 29 Oct) |
| 30 | Travel companions (layer) | `/edit-profile` 04 Your crew (search a traveler, pick Partner, Family or Travel buddy, Send invite; Cancel, Leave, Share a pet); `/account` (a card per request, Accept or Not now) | Yes, as button and option text | Text only: "That did not go through. Try again in a moment.", "That did not go through. Reload and try again." | No | Each action posts at once | n/a. Live in 16.48.3 but hidden until the `/crew/*` routes answer (`tll-crew-v1.js` header) |
| 31 | Privacy and share panel (layer) | `/the-map` and `/account` | Yes, the panel's own; the embed that loads it is in the saved map code | Text only: "Could not save. Try again in a moment.", "Pick a handle: letters, numbers and dashes.", "Your browser won't share.", "Even images need a layover. Try again." | No; "Saving…" while a save runs | Writes the four `share-*` member fields on save | n/a |
| 32 | Album settings (layer) | `/edit-profile` 05D Your album (how you count continents: 7, 6 with one America, 6 with Eurasia, or the 5 Olympic rings); `/the-map` sends the per-continent counts after each map save | Yes, one labeled choice | "That did not save. Try again." | No | Nothing saved until the member picks; then "Saved. Your album now shows ..." | n/a. Live (`tll-album-settings-v1.js`, in the v16 list) |
| 33 | Story language (layer, staged) | `/submit`, step 1 of the Webflow form | Yes: "I'm writing in" (required select, pre-filled from the browser), "Let readers see a translation of my story." (on by default), and for a story not in English an optional "Got your own English version? Paste it here." | Native required only | No | Through the form's own autosave | No. Staged: `tll-submit-lang-v1.js` says "not in the published bundle until Nancy approves the change log" and it is not in the v16 build list |

33 forms or form-like controls: 25 live (4 of them read from the 13 October export or Designer-only in whole or part: rows 12, 14, 20, 21; 5 of them layer forms, rows 27 and 29 to 32, two of which show nothing until their Worker routes answer), 6 staged (rows 17, 18, 19, 23, 24, 33), 1 prototype (row 6), 1 hidden by Phase 0 (row 8). The first draft of this file counted the `/contact` relay form twice (as rows 8 and 27); the 13 October export has exactly one form on that page. "Free. No card. 16+." shows on the sign-up path nowhere today: not on `/signup`, not on the `/submit` or `/share-photos` gates. It shows in the home value row ("Free, no card, 16+."), in the staged expat hero, and in the staged story join card. The home hero says "Free, forever. No card, no paywall." and the cover says "Free to join, no card, no paywall." (four wordings, per the Phase 2 inventory).

---

## What to do first, by how many visitors it touches

1. **Every page (nav and footer):** remove the two draft guide links and the Spotlight and Awards links until those pages have content; confirm by a Designer readback that the 20 October nav edit (The Map, Expats) is what is live; fix the footer wordmark aria-label. A session with Nancy, since the components are shared.
2. **Every page (the promise lines):** apply the three one-liners from item 5. Review: in the site head swaps, the `/submit` form line, the hints, the country empty state, the for-expats lines, the `/contact` editor block, the `/my-pets` done text and the intake fallback line. Support: one response-times line on `/contact` and `/support`, "usually the same day" on the Tell the editor card. Newsletter: one name on the home band, the expats line, the footer link and `/newsletter`. Needs Nancy's confirmation first (below).
3. **Home (the most-seen page):** keep the run-time "Coming soon" on the expat tiles and change the Designer text to match; drop "Opening city by city" until a hub exists; hide the "EU pet travel guide" promise line or point it at the waitlist; add the one-line purpose under the cover.
4. **Story pages (every search visitor):** publish the staged ux layer (Next story, the join card with "Free. No card. 16+."). It is the one change that gives a cold visitor a next step.
5. **`/stories`:** the one filter function, URL state for `q`, `place` and `pursuit`, the no-results block with suggestions, the two rows (Layover guides; For the trail and the start line). A layer, no Designer work.
6. **`/signup`, `/submit`, `/share-photos` gates:** the gated template with "Free. No card. 16+." under the one button; a visible label at 14px or more on every field; `label for` once the shared ids are fixed in the Designer.
7. **`/submit` form:** inline errors (`aria-invalid`, `role="alert"`) with the au3 strings as the list; label the syndication boxes in words; say why Send is disabled while Turnstile loads.
8. **`/the-map`:** the sample map as the hero with one button, member links hidden for visitors, zero counters gone; taps carried into sign-up (map page code in Webflow).
9. **Profiles and country pages:** "Start your own map" at the end of every profile; a join step on a country with no stories.
10. **`/for-expats`, `/the-paw-passport`:** publish the staged reworks; until then set the five missing hrefs and hide the EU Pet Passport and Large-dog cards.
11. **Empty states without a button:** `/creators`, the `/for-expats` groups list, `/404`, the map load error.

## Needs Nancy

1. Confirm the review truth: stories go live when sent and are read after (the 19 October decision as the Phase 0 log records it), and whether that also covers photos and link-outs. Then the three one-liners in item 5 can go in.
2. Confirm the support promise both pages already make, "A human writes back, usually the same day", and one response-times line (editorial 48h, takedowns and safety 4h, press 3 business days), so the Tell the editor card and `/faq` can carry the same.
3. The newsletter: one name (the Sunday letter, Newsletter, or the dispatch, which is what `/newsletter` calls it), and capture only, no day or time, until it goes out two weeks running. The home band, the expats line and the footer link change on your yes; `/newsletter` already says it.
4. A Designer readback of the nav and footer: the saved record says the 20 October edit (The Map after Travelers, Expats after it) is live; and whether the footer rework reached past the READ column.
5. The footer drops: the two draft guides, Spotlight, Awards (until December), and Packet A row A2.8's longer list (Instagram, Newsletter, LinkedIn and more), which you have not answered.
6. The `/for-expats` and `/the-paw-passport` reworks: approve for publish, or set the five missing hrefs and hide the two pet cards in the Designer meanwhile.
7. Which label is live on `/the-map` for the member edit link ("Edit my destinations" or "Edit your countries on the map"), so the Phase 0 hide catches it.
8. The Ko-fi URL and the Regulation (EU) 2026/131 check (still open from Phase 0); the Club price for `/support`.
9. Designer edits only you can make: the home expat tile text, the `/creators` empty state button, the `/for-expats` groups empty state, the `/404` body, the Webflow default fail text on the forms that still carry it (the 13 October export shows `/contact`, `/newsletter`, `/my-pets` and `/share-photos` with their own), the shared `id="field"` on 84 fields across 7 form pages, the 11px labels on `/signup` and `/login`, the `/newsletter` and home letter email labels.
10. The map page code in Webflow for carrying sample taps into sign-up, and the hero change on `/the-map`.
11. The 301s still pending in Site settings: `/my-passport` to `/the-map`, `/countries` to `/destinations`, `/for-affiliates` to `/creators`.

## Limits

- The sandbox cannot reach thatlayover.life or any CDN, so nothing here was seen in a browser. Every "today" is the saved code, dated as listed at the top.
- The nav and footer are the 13 October export, dressed in the 28 and 29 October fixtures; the 20 October handoff note records the later nav edit, published with the site on 31 October, whose markup is in the Designer only.
- Saved only as the 13 October export (18 days older than the page code): the bodies of `/contact`, `/support`, `/newsletter`, `/my-pets`, `/signup`, `/login`, `/account`, `/share-photos`, `/destinations`, `/the-paw-passport` and `/submit`, with their Webflow done and fail text. Never saved: the `/faq`, `/404` and legal page bodies; the `/stories` newsletter block; the `/travel-wire`, `/pets`, `/gallery`, `/for-press`, `/for-brands`, `/awards`, `/spotlight` and `/creators` heroes; the pillar, collection, theme, country and layover templates; the Memberstack sign-up markup beyond the export; the Webflow fail text on the forms the export does not hold.
- The page header band (`tll-v9-departures-v2.js`) is not on the site (STATUS.md row J11, 8 October; zero "departures" in the saved heads). The copy sheet still lists that file as the source of TLL-0054, 0082, 0093 to 0096 and other rows; those rows are not live copy.
- The copy sheet was searched by case-insensitive substring for nine patterns (48 hours, review, goes live, approval, reply, newsletter, sunday, weekly, no card) and the 34 matches were read by hand; a wording that uses none of those words would be missed.
- Counts in this file: 36 rows in item 3; 10 nav anchors and 31 footer anchors in item 4; in item 5, 34 copy-sheet rows from the first search (29 after dropping the five "preview" hits; 13 about review timing) plus 6 support and 7 newsletter rows from the second, and 15 rows stating truth A; 34 page types in item 6 (13 with no saved first screen); 33 forms in item 10; 20 home embeds, 18 export pages and 28 layer files read.

## Critic notes (1 November, fix pass)

A second reader checked the first draft against the saved code. Where the reader was right the text above is changed; the points below record where the reader's own detail was off, so the next pass does not chase them.

- **`tll-lib-search-v2`** is a `<style>` block in `scratchpad/p0-1031/before/stories-head.html`, not a script and not in the stories footer. The footer's scripts are `tll-lib-search-v4`, `tll-lib-chips-v1`, `tll-lib-lead-v1`, `tll-s3-stories-v1` and `tll-s3-stories-js-v1` (plus the `tll-lib-chips-css-v1` and `tll-lib-fixfirst-v1` styles). The first draft's "tll-lib-search-UI-v2" was wrong either way; item 8 now names the real pieces.
- **`tll-stamps-v1.js`** has seven `.disabled=` assignments (lines 72, 80 twice, 85, 89, 91, 92), not five; they act on four controls. The first draft's "3 disabled states" was also wrong; item 10 row 17 now gives both numbers.
- **The two no-href anchors on `/travelers`** are roster card templates (`data-st3-base="/contributors/"` and `"/pets/"`) whose href the page head sets from the slug at run time (`tv-head-d8735ad4.html`, lines 106 and 107). They are not dead links on the live page; item 3 row 35 lists them with that verdict. The five place chips on `/stories` are dead without JS and are not keyboard-reachable; row 34 covers them.
- **The pillar links on `/stories`** are absent from every rendered file, as the reader said, but they are in the saved Designer trees (`reports/evidence/webflow-export-2026-10-13/state/pages/stories/tree.json` and `src/pages/heroes-2026-10-29/trees/stories.json`) inside two blocks hidden in the Designer (`data-tll-chiprow` and `tll-fos`, visibility off). Item 4 now says hidden, not live.
- **`/for-expats` has three missed 48-hour lines**, not two: the Claim your desk block, the groups intro ("A human checks every listing, usually within 48 hours.") and the directory card in the footer code. All three are in item 5 now, with the `/my-pets` done text ("A human checks the details before it goes public, usually within 48 hours."), which no reader had listed.
- **The copy-sheet pattern search** gives 34 case-insensitive substring hits, as the reader said. TLL-0019, 0118, 0257 and 0679 are real matches on "reply" and "no card", not false ones; the five false hits are "review" inside "preview" (TLL-0240, 0754, 0778, 1412, 1451). Item 5 lists all 34 ids and the 13 review-timing ids.
- **The response-times line** differs by two words between the pages: "takedowns + safety 4h" on `/support`, "takedowns 4h" on `/contact`. Noted in item 5 so the one-line fix makes them identical.
- Everything else the reader raised checked out and is fixed in place: the removed page header band, the intake success text, the relay form counted twice, the submit label count, the share-photos gate text, the series layer's status, the `/support` doors, the Club perks, the six layer forms, the layer-file count, the nav note, the footer order, the Tell the editor labels, the `/404` line's source and the redesign-p0 relabel text.
