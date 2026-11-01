# Phase 3 usability audit, items 3 to 10 (1 November 2026)

Read-only audit from the saved code. Nothing on the site, in Webflow or in the repo was changed; this file is the only thing written.

**What this was read from**

- Live site code saved 31 October: `scratchpad/p0-1031/before/` (site head and footer, home, stories, story template, map, contact, support, my-passport) and `scratchpad/p0-1031/after/site-head.html` (the current head, with the consent block).
- The nav and footer markup: `src/pages/heroes-2026-10-29/fixtures/*.html`. Their `build_fixtures.py` says the body is the live Webflow tree of 29 October but the nav and footer come from the 13 October export. `src/components/footer/HANDOFF-NOTE-2026-10-20.md` records nav edits after that export (The Map and Expats links added) and a footer rework that stopped partway. So the nav and footer lists below are the 13 October state, and the live components can only be confirmed in the Designer.
- Home: the 20 saved embeds in `src/pages/home/live-2026-10-28/embeds/` and `src/pages/home/live-2026-10-29/founders-a0d1cd97-after.html`.
- Page code: `src/pages/the-map/v3/passport-embed.src.html`, `src/pages/the-map/live-2026-10-25/APPLY-LOG.md`, `src/pages/submit/live-2026-10-29/` (the live form export of 13 October, the page head and footer), `src/pages/submit/v5/` (not live, per its own change log), `src/pages/auth/`, `src/pages/share-photos/`, `src/pages/country/v3/live-footer-after.html`, `src/seo/live-2026-10-28/contributors-template-code-footer.html`, `src/pages/travelers/after-2026-10-20/tv-head-d8735ad4.html`, `src/pages/creators/live-2026-11-01/`, `src/pages/destinations/v3/ds3-destinations.js`, `src/pages/heroes-2026-10-29/code/for-expats-*.html`, the 13 October export of `/the-paw-passport`, and `map-2.0/dist/tll-map-layers.js` for the sample-map note.
- 32 layer files in `src/site-layers/` (the built bundles skipped), and the cover and story layers in `src/design/magazine-2026-10/`.
- `docs/tll-site-user-flow-2026-10-31.md`, `docs/tll-phase0-change-log-2026-11.md`, `docs/expat-pets-ux-2026-10-31.md`, `docs/redesign-plan-2026-10-31.md`, `docs/copy-audit-2026-10-31/copy-sheet.csv` (1,512 rows), `docs/phase2-design-inventory-2026-11.md` and `docs/phase2-a11y-audit-2026-11.md` (for the form-label counts, cited where used).

**Status words:** Live (on the site), Staged (built, shows with a preview link, not published), Draft (a Webflow page not published), Designer (lives only in the Webflow Designer, not in the saved code).

**One caveat that touches items 5 and 6:** the page header band (status line, page title, one-liner on every page except home and stories) comes from `src/site-layers/tll-v9-departures-v2.js`, which its own header says is a registered Webflow hosted script. It is not in the saved 31 October site head or in the v16 bundle list, and the fixtures could not show it because it draws at run time. The copy sheet treats its lines as live. Whether it still runs is a Designer check (Site settings, Custom code, Scripts).

---

## 3. No promises without the thing

Every card, button and link in the saved home, stories, story, map, support, contact, for-expats and paw-passport code and the layers that lands nowhere, says "open slot" or "coming soon", shows an empty list, or looks clickable and is not. 33 rows.

| # | Where | What it says | Where it goes today | State | Phase 0 layer (16.48.x) | Do |
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
| 12 | `/awards` (footer "The Layover Awards") | Page header "Members nominate. The editor picks. NOMINATIONS OPEN", status "DECEMBER"; a Memberstack nomination form in the page head | The awards page is live; the nominations template is a draft (user-flow doc) | Phase 0: noindex. The footer link stays | Hide the footer link until December, or change the one-liner to "Nominations open in December, get notified" with the letter form |
| 13 | `/creators` (reached by the footer "For affiliates" through the Phase 0 forward from `/for-affiliates`) | Empty state "Nobody has switched on 'I'm a creator' yet." (`src/pages/creators/live-2026-11-01/README.md`: the API refused to change it) | A list that can be empty, no button | Phase 0: noindex. The 301 `/for-affiliates` to `/creators` still needs adding in Site settings | Give the empty state a button ("Switch on Make things" to `/edit-profile`). Designer edit |
| 14 | `/for-expats`, live 13 October body (`fixtures/for-expats.html`) | "Become a Location Expert", "Find an expat group", "ALL COUNTRIES BY FLAG →", "+ Your city is not listed? Any city, any country. Claim it.", "Claim your desk →" | Five anchors with no `href` in the saved tree (the page footer code sets `#tll-expert-apply` and `#tll-groups` at run time) | Live. Looks clickable; without JS nothing happens | The staged expat rework (`tll-expat-v1.js`, `?preview=expat`) replaces the whole landing | Publish the rework. Until then set the hrefs in the Designer |
| 15 | `/for-expats`, live body | "LISTED SO FAR: No groups listed yet. The first one goes here." | A list with nothing in it | Live | Staged rework leaves out anything with no content | Publish the rework, or hide the block until one group exists |
| 16 | `/for-expats`, staged rework (`tll-expat-v1.js`) | "Add the places you've lived" | `/the-map?mark=lived` | Staged. The map does not preselect Lived yet (expat-pets doc, decision 11) | n/a | Make `?mark=lived` open the Quick log on LIVED before publishing, or drop the parameter |
| 17 | `/the-paw-passport`, 13 October export | Card "EU Pet Passport: What it is, who issues it, and how long it takes." | No link in the export | Live, Designer | The pet rework (`tll-pet-passport-v1.js`, `?preview=pets`) rebuilds the landing and hides "Buy the EU pet guide" until the link is filled | Hide the card, or make it "Guide coming, get notified" with the Paw waitlist. The page needs the Regulation (EU) 2026/131 check first |
| 18 | `/the-paw-passport`, 13 October export | Card "Large-dog-friendly hotels: Real 'large' means over 25kg welcome, verified." | No link | Live, Designer. Nothing on the site verifies hotels; the closest real thing is the "Pet-friendly or pet-tolerant?" note under stories (`tll-series-v1.js`, staged) | Not touched | Hide until the first five pet notes exist, then link the notes list on the reworked landing |
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
| 30 | `/support` (`support-head.html`) | Layover Club card with a "soon" eyebrow style `[data-tll-club="soon"]`, price line and fine print hidden "until the Club price is set"; two Ko-fi buttons | `https://ko-fi.com/thatlayoverlife` (wired 19 Oct) | Live. The Club text itself is Designer | Not touched | The buttons are real. The Club is "coming": keep the "soon" label and add an email line, or point "Join" at the Ko-fi tier once a price exists |
| 31 | Footer | "Copenhagen stopover" and "EES and ETIAS on a layover" | `/copenhagen-stopover`, `/ees-etias-layover`, both drafts (user-flow doc), so 404 | Live links to pages that do not exist (13 October footer; Packet A row A2.8 planned to drop them) | Not touched: nav and footer wait for a session together | Remove the two links, or publish the pages |
| 32 | Footer | "Cookie preferences" `href="#"` | Reopens Google's consent message (the Phase 0 head block catches any link reading "Cookie preferences") | Live | Handled | Done |
| 33 | Profiles | Link rows still pointing at `#` | Hidden by the site head parity script | Live | n/a | Done |

**Already handled by the Phase 0 layer or its companions:** rows 1 to 3 (run time only), 5, 8, 9, 11 (noindex), 12 (noindex), 13 (noindex), 21, 27, 29, 32, 33. **Remaining:** rows 4, 10, 14 to 20, 22, 30, 31, plus the Designer text behind rows 1 to 3 and 11 to 13.

**The one pattern to reuse:** "Coming soon, get notified" with an email field already exists twice: the home expats line pointing at the Sunday letter form (`tll-redesign-p0-v1.js`) and the Paw waitlist card (`tll-paw-v1.js`). Rows 4, 5, 12, 17 and 30 should use one of those two, not a third form.

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
| (20 Oct note) The Map | `/the-map` | Added after Travelers per the handoff note; not in the export. Confirm in the Designer |
| (20 Oct note) Expats | `/for-expats` | Same |

Not in the nav: `/the-map` (unless the 20 Oct edit is live), `/newsletter`, `/travel-wire`, `/pets`, `/gallery`, `/support`.

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

Below the links: "Every byline a real person.", the three live counts (stories, countries, pets) and "Run by humans, supervised by one Samoyed".

### The checks asked for

- **Is `/destinations` reachable?** Yes, from the nav (Destinations) and the footer (Discover). The in-page forward sends `/countries` to `/destinations` (Phase 0), so both addresses land there.
- **Does the footer "Destinations" link go to `/stories#by-place`?** No. It goes to `/destinations`. `/stories#by-place` was the Packet A plan (A2.2 and A9.1 in `handoff/CHANGE-LOG-PACKET-A-2026-10-19.md`) for a "By place" view that was never built: no saved `/stories` code (`stories-head.html`, `stories-footer.html`, `src/pages/stories/v3/`, the Phase 0 and series layers) defines a `by-place` id. Leave the link on `/destinations` until a By place row exists on `/stories`.
- **Where is `/newsletter` linked from?** Only the footer contact row ("Newsletter"). The home letter band, the `/stories` newsletter block and the home expats "Get the Sunday letter" line are forms on the page, not links to `/newsletter`. Nothing in the nav.
- **Where is `/travel-wire` linked from?** Only the footer ("The Travel Wire"). The 13 October `/stories` tree also carries pillar links (`/pillars/layover-guides`, `/pillars/paw-passport`, `/pillars/travel-logistics`, `/pillars/cultural-intelligence`, `/pillars/stories-from-the-road`) and a `/travel-wire` link in the page body.
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

From the saved code and the copy sheet. A pattern search of `current_text` (48 hours, review, goes live, approval, reply, newsletter, Sunday, weekly, no card) matched 31 of the 1,512 rows, 13 of them about review timing. A second pass by page (Contact, Support) and by the words letter, newsletter, inbox and subscribe found 6 support rows and 7 newsletter rows. Every row is cited by id below.

### Review timing

| Page | Exact string | Which truth it states | Source |
|---|---|---|---|
| Site-wide (head copy swap) | "Reviewed by a human within 48 hours. Free, and your byline stays yours." | A: reviewed before it goes live, within 48 hours | `before/site-head.html`; TLL-0032 |
| Site-wide (head copy swap) | "Reviewed within 48 hours, edited lightly." | A | `before/site-head.html`; TLL-0033 |
| Site-wide (head copy swap) | "A human reviews every photo before it goes up." | A, photos | `before/site-head.html`; TLL-0034 |
| `/submit`, live form | "One editor reads every word in Copenhagen · Reply in 48 hours" | A (and a reply promise) | `form-story-export-2026-10-13.html` |
| `/submit`, live form, Body hint | "Autosaves every 20 seconds. Drafts wait on your account." | Drafts, not timing | same file |
| `/submit`, page header one-liner | "Reviewed within 48 hours by a human." Status "DRAFT SAVES ITSELF" | A | `tll-v9-departures-v2.js`; TLL-0082 |
| `/submit`, 29 Oct hints | "A human reviews it within 48 hours" and "A human looks within 48 hours" | A | `tll-submit-ux-v1.js`; TLL-1259 |
| `/submit` and `/share-photos`, success box | "Saved. It goes live as soon as the editor sets it up." | C: live later, when the editor acts. The same layer's header says the Worker publishes at once | `tll-intake-v1.js`; TLL-1292 |
| `/submit` v5 (not live) | "Goes live when you send." | B: live on send, read after | `src/pages/submit/v5/submit-v5.html`; TLL-1157 |
| `/submit` v5 (not live) | "No waiting for approval. The editor reads it after and can correct or pull it under the Charter. You get an email copy." | B | same; TLL-1158 |
| `/submit` v5 (not live) | "Passes the rules, goes live. Your voice stays yours." | B | same; TLL-1046 |
| Country pages, reader empty state | "Nothing from the readers yet. The first submission gets the slot, reviewed by a human within 48 hours." | A | `src/pages/country/v3/live-footer-after.html`; TLL-1023 |
| `/travelers`, press card | "Switch on Press. An editor reviews within 48 hours, and hosted trips stay labeled at the top of every story." | A, for press applications | `tll-travelers-fix-v1.js`; TLL-0984 (and TLL-0960 in the 20 Oct head) |
| `/edit-profile`, press tag | "Reviewed within 48 hours" | A, press | `src/pages/edit-profile/live-2026-10-28/after/4080e4be.html`; TLL-0798 |
| `/for-expats`, application success | "Got it. A human reads every application, usually within 48 hours, and replies by email either way." | A, applications | `fixtures/for-expats.html` |
| `/for-expats`, groups success | "Got it. A human will look, usually within 48 hours. We will email you when it is live, or if we have a question." | A, groups | same |
| `/spotlight` tile, `/travelers` tile, home cover | "We edit lightly and keep your byline." | No timing | `tll-open-slots-v1.js`, `tll-travelers-fix-v1.js`, `tll-mag-cover-v1.html` |
| Phase 0 proposal, not applied | "It goes live when you press send, and Nancy checks it after." | B | `docs/tll-phase0-change-log-2026-11.md` section 7 |

Three truths are live at once: A (reviewed first, 48 hours) in 11 places, C (editor sets it up) in the intake success box, and the Worker's behavior, which is B. Nancy's 19 October decision, as the Phase 0 log records it, is B.

### Support reply time

| Page | Exact string | Truth | Source |
|---|---|---|---|
| `/support`, header | "A human reads every message." Status "HUMAN ON DUTY" | No time | `tll-v9-departures-v2.js`; TLL-0093, 0094 |
| `/contact`, header | "A human reads this. Usually with coffee." Status "RETURN TO SENDER" | No time | same; TLL-0095, 0096 |
| `/faq`, header | "Short answers. Longer ones by email." | No time | same |
| `/submit`, live form | "Reply in 48 hours" | 48 hours | `form-story-export-2026-10-13.html` |
| `/for-expats` | "usually within 48 hours, and replies by email either way" | 48 hours | `fixtures/for-expats.html` |
| `/contact?relay=` | "Members choose how to be reached. Use the links on their profile, or write to us at hello@thatlayover.life." | No time | `tll-phase0-v1.js`; TLL-0945 |
| `/contact` body and form | Designer only | Unknown | copy audit README, limit 2 |

### Newsletter schedule

| Page | Exact string | Truth | Source |
|---|---|---|---|
| Home, letter band | "One story. Sunday morning. Lounge wine optional." | Weekly, Sunday | `c0c4bf75.html`; TLL-0214 |
| Home, letter band | "Sundays at 09:00 Copenhagen time. Unsubscribe anytime." | Weekly, Sunday, 09:00 | same; TLL-0215 |
| Home, expats line | "Get the Sunday letter and hear when they open →" | Sunday | `tll-redesign-p0-v1.js` |
| `/submit` v5 (not live) | "OK for the Sunday letter" | Sunday | `submit-v5.html`; TLL-1117 |
| `/submit`, live form | Syndication checkbox labeled with its field name, "syndication-newsletter" | A bug: the label is the field name | `form-story-export-2026-10-13.html` |
| `/newsletter` page | Button "Send me the first one" | There is no first one yet | `docs/phase2-a11y-audit-2026-11.md` section 1 |
| `/stories`, newsletter block | Designer; the a11y audit saw a headline with the rose word "worth it" | Unknown | Designer |
| `/stories` header | "{N} stories, all first-hand. More landing weekly." | Stories, not the letter | `tll-v9-departures-v2.js`; TLL-0054 |

### The one line per truth

- **Review:** "Your story goes live when you send it. Nancy reads it after and may fix typos or pull it under the Charter." Photos: "Your photos go live when you send them. A human looks after." Use it in the site-head swaps, the live form's "One editor reads every word" line, the `/submit` header, the 29 October hints, the country empty state and the intake success box ("It is live. Nancy reads it after."). Press, expert and group applications are different: they are approved from the next-day report (`tll-intake-v1.js` header), so their line is "A human reads every application and replies by email, usually the next day." Nancy to confirm the 19 October decision applies to photos and link-outs too.
- **Support:** "A human answers within 48 hours." One line on `/contact`, `/support`, the `/faq` header and the Tell the editor card. The `/submit` form's "Reply in 48 hours" moves to this meaning (a reply to a question), not a review promise.
- **Newsletter:** "The Layover Letter is on its way. Leave your email and you get the first one." Capture only, no day, no time, until a letter has gone out two weeks running. Then "Sundays, 9 a.m. Copenhagen time" can come back.

---

## 6. Purpose and audience in the first screen

Rule used: the first screen must say what the page is for and who it is for without scrolling. "First screen" is the hero plus the page header band, where that band still runs (see the caveat at the top). Lines are under 15 words, one joke or one fact at most, no more.

| Page | First screen today (saved) | Says what? | Says who? | Proposed line |
|---|---|---|---|---|
| `/` | H1 "Find your next somewhere." Cover: "This week's cover", "Real places and real opinions, written by the people who went. Free to join, no card, no paywall.", Read the cover story, Join free | Stories, yes. The map, no | Readers, yes. Members, no | "Stories from people who went. A free map for where you have been." |
| `/stories` | "The Library. {N} stories, all first-hand. More landing weekly." then search | Yes | Partly | "Every story here is one trip, told by the person who took it." |
| `/stories/<slug>` | Photo, title, byline. No line about the site for a visitor from search | No | No | Under the byline: "A member's trip on That Layover Life. Join free, keep your own map." |
| `/destinations` | "The Atlas. Every country by flag. Most are open slots." | Partly | No | "Every country by flag. Pick one and read who has been." |
| `/countries/<slug>` | Ink band from the Story Ref, "Facts checked, verdict ours." | Partly | No | "One country, its stories, and a Been here button for your map." |
| `/travel-wire` | "Headlines from the people who did the reporting." | Partly | No | "Travel news we read this week, each one linked to its source." |
| `/pillars/<slug>`, `/collections/<slug>`, `/themes/<slug>` | Designer only | Unknown | Unknown | "{Pillar}: the stories that fit, newest first." |
| `/layovers/<slug>` | "A guide. Sourced, dated, checked." | Partly | No | "A layover guide, by someone who had this layover." |
| `/travelers` | "Where the Travelers ... Everyone on TLL, in one place." plus faces | Yes | Partly | "The people who wrote the stories. Find one who knows your next city." |
| `/contributors/<slug>` | Name, stamps, flags. Nothing about the site | No | No | "A traveler's map and stories. Start yours free." |
| `/pets` | "Every pet here has a human who said yes." | Partly | No | "Pets with passport pages of their own. Add yours from My pets." |
| `/pets/<slug>` | Pet name, countries | Partly | No | "{Name}'s Paw Passport: stamps, firsts, and the human who carries the bags." |
| `/spotlight` | "Open slots, honestly labeled." plus one feature | No | No | "One member a month, in their words. Pitch to be next." |
| `/creators` | "Credit given, links followed." | No | No | "Members who make things. Switch on Make things to be listed." |
| `/for-expats` (live body) | "Eight years somewhere beats eight days everywhere." Become a Location Expert | Partly (contributing) | Expats who want to write | Staged line is right: "Your homes count too. Free. No card. 16+." Add "For people who moved abroad." |
| `/the-paw-passport` | "Your bestie gets a passport too." | Yes | Pet owners, yes | Keep. Staged: "Every pet deserves a passport." Add "For pets who travel and the humans who do the paperwork." |
| `/pursuits/<slug>` | 404 today; work trips staged: "Back home? Good. Now tell us." | Staged only | Staged only | "Work trips, plus the free evening. Stamp the city, tell the story." |
| `/for-press` | "Hosted trips labeled at the top. Always." | The rule, not the page | No | "For travel journalists: a profile, a Press label, hosted trips disclosed." |
| `/for-brands` | "Paid work never buys a verdict." | The rule | Brands, implied | "For brands: how paid work runs here, and what it never buys." |
| `/awards` | "Members nominate. The editor picks." | Partly | No | "The Layover Awards. Members nominate in December. No sponsor votes." |
| `/about` | "It started with a glass of wine in the lounge." Eyebrow ABOUT THAT LAYOVER LIFE | Not in the first line | No | "One editor, one Samoyed, and a free place to keep your trips." |
| `/support` | "Six doors. Pick yours." | No | No | "Six ways to keep TLL free, from one coffee to the Club." |
| `/contact` | "A human reads this. Usually with coffee." | Partly | No | "Write to Nancy. A human answers within 48 hours." |
| `/newsletter` | Form with "Send me the first one" | Partly | No | "The Layover Letter: one story, when it is ready. Leave your email." |
| `/signup` | "Your account. Free to join. Free forever." | Partly | No | "Free. No card. 16+. Your map starts in a minute." |
| `/the-map` (visitor) | "THE MAP · EVERY COUNTRY, COUNTED. Every country, ..." then the sample map | Yes | Not for a visitor | "Your countries, tapped onto one map. Free, and yours to keep." See item 9 |
| `/account` | "Your map, your stories, your pets." | Yes | Yes | Keep |
| `/edit-profile` | "Every switch starts off. You turn things on." | Yes | Yes | Keep |
| `/submit` | Fork: Write it here or Link to it; one-liner "Reviewed within 48 hours by a human." | Yes | Members | "One trip, in your words. Goes live when you send." (fixes item 5 too) |
| `/share-photos` | "Pack light. Bring the good shot." | Partly | No | "Photos from your trips, credited to you, in the Lounge." |
| `/gallery` | "Wish you were here. Most of them did." | Partly | No | "Members' photos from the gate, the trail and someone's kitchen. Send yours." |
| `/404` | "Nowhere. Rebooking you on the next page." | n/a | n/a | Copy audit's "This page took a different connection." plus one button to `/stories` |
| `/faq`, `/editorial-charter`, `/community-guidelines`, `/privacy`, `/terms`, `/cookies` | Plain one-liners ("How we work, in plain words.") | Yes | Yes | Keep. Serious pages stay serious |
| `/marathon-diaries/<slug>`, `/paw-passport/<slug>` | Nancy's words | n/a | n/a | Untouched, as asked |

Count: 34 page types checked; 29 get a proposed line, 4 keep what they have, 1 (Nancy's diaries) is left as it is.

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
| Errors | `/404`: "Nowhere. Rebooking you on the next page." from the header band; the body is Designer. Map load error (embed): "LOADING THE MAP CODE ... The map needs JavaScript. The list of places is on the map page." Form fails: "That did not send. Try again, or email hello@thatlayover.life" (`/for-expats`), "Could not save. Try again." (story save), "Not saved. Check your connection and tap again." (Quick log), "Saved to your account. Your public page did not update yet" (`/edit-profile`). Webflow's default fail text where it was not replaced (Designer; it carries an exclamation mark, copy audit limit 9) | Nothing | `/404` needs one button; the map error needs a link to the list it mentions; the Webflow default fail text needs replacing page by page |
| Gated pages (`/account`, `/submit`, `/share-photos`, `/my-pets` signed out) | `/account`: "Behind the sign-in" with three lines and a join button (`account/live-2026-10-27`). `/share-photos`: a gate with a preview of what you get, Join free and a ghost button. `/submit` and `/my-pets`: Designer | Nothing. The Phase 2 inventory proposes one gated template (cream page, three rows of what you get, Join free, "Free. No card. 16+.") | `/submit` and `/my-pets` until the template lands |

---

## 8. Search and filters on `/stories`

### What exists after the Phase 0 fix

Read from `before/stories-head.html`, `before/stories-footer.html`, `tll-phase0-v1.js`, `tll-series-v1.js`, `tll-stories-places-v1.js`, `tll-stories-noimg-v1.js`, `tll-story-is-v1.js`.

1. **Search** (`tll-lib-search-v4` in the stories footer, 9 Oct): a GET form. Submit reloads `/stories?q=`. Every word must match the card's visible text plus its hidden country, region and author blocks (accents stripped). Misses get `data-tll-q-miss`, hidden by CSS. Zero hits: the cards all come back under a note.
2. **Phase 0** (`tll-phase0-v1.js`): on phones the input keeps its width (it was 0px). With a `?q=`, the layer fetches `src/data/story-search-index.json` from jsDelivr (pinned commit) and also matches title, place, country and body words per slug. New stories match on card text until the index is rebuilt. Words of 3 letters or more only.
3. **Search UI** (`tll-lib-search-UI-v2`, 23 Sep; `tll-lib-lead-v1`, 9 Oct): the field is moved into the filter bar, the value is read back from `?q=`, a Clear link shows while a query runs, the first visible card becomes the lead card. Placeholder: "A country, a train line, a feeling" (set by `tll-s3-stories-js-v1`).
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

1. The page header band, if it still runs: "LEFT THE AIRPORT. The Map. Rose means been there. Blank means working on it."
2. The dark hero: eyebrow "THE MAP · EVERY COUNTRY, COUNTED", H1 "Every country, ...", a paragraph that starts "Signed in, this is your map: tap a country to log it, and the counter is your honest total. Signed out, you see ...", a story photo behind under a deep scrim with a credit (`tll-page-heroes-v1.js`), and "OPEN FULL SCREEN →" (hidden by Phase 0).
3. The counters: "0 / 249 Places visited", "0% of the world", then "Hover for the name · Click a pin to read the story".
4. Map 2.0 with `data-tll-visitor="sample"`: a made-up traveler with 30 places and 3 layovers, and a note: "SAMPLE MAP. These countries belong to a made-up traveler, so you can see how the map works. None of it is a real trip. Start your own map → (to `/signup`) · Sign in (to `/login`)". Card badges read "· SAMPLE". The owner's record is never requested.
5. Three explainer cards: "87 Already logged" (relabeled by `tll-redesign-p0-v1.js` to the live count "On Nancy's map, plus Antarctica"), "108 Still to go. The cream. The next 108 conversations at 9am in someone's kitchen.", "1,273 World Heritage sites". Then "Add a park you have been inside →" to `/submit`.
6. The passport wall (`passport-embed`): "Your passport. Countries and territories ..." with "Sign in and your countries show up here as stamps or a list. Start your own map →", a Find a country box and the 249-country list ("Unpacking 249 countries and territories…").
7. "Back to your account →" and "Edit your countries on the map ↑" (member links; see item 3 row 22).

So the visitor's first screen is a headline, a paragraph about two states, and two zero counters. The sample map, the one thing that shows what the site does, starts a screen down, and its "Start your own map" button is the fourth call to action on the page.

### What "lead with the sample map and Start your own map" changes

1. **The map is the hero.** The dark hero collapses to one line over the map: eyebrow "THE MAP", one sentence "Your countries, tapped onto one map. Free, and yours to keep.", nothing else. The page header band is skipped on this page (the departures script already skips home and stories; add the map).
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
| 4 | Share a story, Webflow form, three steps | `/submit` | Yes: 40 labels in `tll-pen-field` wrappers with hints, but none has a `for`, and 34 of 82 fields share `id="field"` or `"checkbox"`; the syndication checkboxes are labeled with their field names ("syndication-newsletter") | No. Native `checkValidity` only (`page-footer-live.html`); no `role="alert"`, no `aria-invalid`. `tll-intake-v1.js` adds one note under the body when the last line does not end a sentence | Webflow's Turnstile keeps the submit disabled until it loads, with no text saying why (the search forms had to be detached from it) | Yes, every 20 seconds to the browser (`tllStoryDraft`) and to the member record; "Draft saved {time}" in the step bar | No (members only) |
| 5 | Link-out story | `/submit` | Yes (mono uppercase labels at 10px) | No | Same Turnstile | No | No |
| 6 | Submit v5 (prototype) | not live | Yes, with REQUIRED marks and counters | "Fix it" and "{n} to go" rules; the Send button is disabled with the reason shown ("8 to go", "0 OF 8 RULES") | No, the reason is shown | "SAVES AS YOU TYPE" | No |
| 7 | Share photos | `/share-photos` | Yes, Designer labels; 12 of 16 fields share `id="field"` or `"radio"` | Yes: `tll-photos-form-v1.js` sets `aria-invalid` and `aria-describedby`, "Tick this one to send.", "{n} things to fix above.", file errors by name | No | No | Gate shows Join free; the line is not in the saved gate copy |
| 8 | Contact | `/contact` | Designer; 4 fields share `id="field"` | Unknown (Designer; Webflow default fail text likely) | Turnstile | No | n/a |
| 9 | Tell the editor | every page (footer component) | Yes, mono labels; "Email, if you want a reply (optional)" | No (Webflow done and fail boxes only) | Turnstile | No | n/a |
| 10 | Newsletter, home letter band | `/` | No label on `#h3-news-email` (placeholder only in the 28 Oct embed; axe critical in the 13 Oct embed) | No | Turnstile | No | n/a |
| 11 | Newsletter, `/newsletter` page | `/newsletter` | No label on `input#email` (axe critical) | No | Turnstile | No | n/a |
| 12 | Newsletter, `/stories` block | `/stories` | Designer | No | Turnstile | No | n/a |
| 13 | Edit profile | `/edit-profile` | Yes; 23 of 57 fields share an id; `tll-ep-ux-v1.js` relabels some at run time | Partly: the save bar says what went wrong and offers Try again; country no-match text ("No country by that name. Try the English name or its two letter code."); no `aria-invalid` | No | Yes: "changes save as you type", "Saving", "Saved {time}" in the bottom bar | n/a |
| 14 | My pets | `/my-pets` | Designer; 6 of 12 fields share `id="field"` | Unknown (Designer) | Unknown | No | n/a |
| 15 | Quick log | `/the-map` | Yes (one search, four boxes BEEN, LIVED, WANT, LAYOVER) | Yes, as text: "No country by that name. Try the local spelling or the two-letter code.", "Not saved. Check your connection and tap again." | No | Every tap saves | n/a |
| 16 | Places Been import | `/the-map` | Yes | Yes: "That does not look like a Places Been export." | No | n/a | n/a |
| 17 | Pursuit stamps (staged) | `/edit-profile` | Yes | Yes: "Pick a country.", photo upload error | Yes: 3 `disabled` states in `tll-stamps-v1.js` (while the Worker route is down nothing shows, and the save button disables while saving, with no label change) | Saves per stamp | n/a |
| 18 | Welcome steps (staged) | `/account?welcome=1` | Yes ("Home country", "Where have you been?") | No | No | Saves the way the map saves | The join card on stories says it; the welcome does not need to |
| 19 | Travel style question (staged) | `/account` | Yes, multi-select with Skip | n/a | No | Saves on tap | n/a |
| 20 | Location Expert application | `/for-expats` | Designer (13 Oct body); success "Got it. A human reads every application, usually within 48 hours" | Unknown | Turnstile | No | No |
| 21 | Expat group form | `/for-expats` | Designer | Unknown | Turnstile | No | No |
| 22 | Awards nomination (Memberstack) | `/awards` | Mono 9px labels (Phase 2 inventory, section 5) | Teal success and rose error messages | Unknown | No | No |
| 23 | Paw waitlist (staged) | `/the-paw-passport` | Yes (email, pet name, what they want, one consent box) | "That did not go through. Try again." | No | No | n/a |
| 24 | Pet passport details (staged) | `/my-pets` | Yes | Unknown | No | Saves through the Worker | n/a |
| 25 | Library search | `/stories` | Label visually hidden ("The Library" line is hidden by the fix-first styles); placeholder set by script | n/a | Detached from Turnstile on purpose | n/a | n/a |
| 26 | Home search | `/` | No label; placeholder "Search a country, a layover, a feeling…" | n/a | Detached from Turnstile | n/a | n/a |
| 27 | Relay form | `/contact?relay=` | Yes (mono 10px) | "You have sent three messages this hour" style limit text | Hidden by Phase 0 | No | n/a |
| 28 | Report a card | `/creators`, Living Library (staged) | A mailto link, not a form | n/a | n/a | n/a | n/a |

28 forms or form-like controls: 21 live (5 of them Designer-only in whole or part: rows 8, 12, 14, 20, 21), 5 staged, 1 prototype (row 6), 1 hidden by Phase 0 (row 27). "Free. No card. 16+." shows on the sign-up path nowhere today: not on `/signup`, not on the `/submit` or `/share-photos` gates. It shows in the home value row ("Free, no card, 16+."), in the staged expat hero, and in the staged story join card. The home hero says "Free, forever. No card, no paywall." and the cover says "Free to join, no card, no paywall." (four wordings, per the Phase 2 inventory).

---

## What to do first, by how many visitors it touches

1. **Every page (nav and footer):** remove the two draft guide links and the Spotlight and Awards links until those pages have content; put The Map in the nav if the 20 October edit is not live; fix the footer wordmark aria-label. A session with Nancy, since the components are shared.
2. **Every page (the promise lines):** apply the three one-liners from item 5. Review: in the site head swaps, the `/submit` form line, the `/submit` header, the hints, the country empty state and the intake success box. Support: `/contact`, `/support`, `/faq`, Tell the editor. Newsletter: the home band and `/newsletter`. Needs Nancy's confirmation first (below).
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
2. Confirm "A human answers within 48 hours" as the support promise on `/contact`, `/support`, `/faq` and Tell the editor.
3. The newsletter: capture only, no day or time, until it goes out two weeks running. The home band and `/newsletter` ("Send me the first one") change on your yes.
4. Which nav is live: the 13 October export (Stories, Destinations, Travelers, Paw Passport, About) or the 20 October edit (The Map and Expats added). And whether the footer rework reached past the READ column.
5. The footer drops: the two draft guides, Spotlight, Awards (until December), and Packet A row A2.8's longer list (Instagram, Newsletter, LinkedIn and more), which you have not answered.
6. The `/for-expats` and `/the-paw-passport` reworks: approve for publish, or set the five missing hrefs and hide the two pet cards in the Designer meanwhile.
7. Which label is live on `/the-map` for the member edit link ("Edit my destinations" or "Edit your countries on the map"), so the Phase 0 hide catches it.
8. The Ko-fi URL and the Regulation (EU) 2026/131 check (still open from Phase 0); the Club price for `/support`.
9. Designer edits only you can make: the home expat tile text, the `/creators` empty state button, the `/for-expats` groups empty state, the `/404` body, the Webflow default fail text on every form, the shared `id="field"` on 84 fields across 7 form pages, the 11px labels on `/signup` and `/login`, the `/newsletter` and home letter email labels.
10. The map page code in Webflow for carrying sample taps into sign-up, and the hero change on `/the-map`.
11. Whether `tll-v9-departures-v2` (the page header band) still runs as a registered script.
12. The 301s still pending in Site settings: `/my-passport` to `/the-map`, `/countries` to `/destinations`, `/for-affiliates` to `/creators`.

## Limits

- The sandbox cannot reach thatlayover.life or any CDN, so nothing here was seen in a browser. Every "today" is the saved code, dated as listed at the top.
- The nav and footer are the 13 October export, dressed in the 28 and 29 October fixtures; the 20 October handoff note records later edits whose final state is in the Designer only.
- Designer-only, not in the saved code: the `/contact`, `/support`, `/newsletter`, `/my-pets`, `/faq`, `/404` and legal page bodies; the Webflow success and fail text on every form; the `/stories` newsletter block; the `/the-paw-passport` body beyond the 13 October export; the pillar, collection, theme and layover templates; the Memberstack sign-up markup beyond the export; the `/submit` gate.
- The page header band (`tll-v9-departures-v2.js`) could not be confirmed live; its lines are quoted as the copy sheet quotes them.
- The copy sheet was searched by pattern (48 hours, review, goes live, approval, reply, newsletter, Sunday, weekly) and the matches were read by hand; a wording that uses none of those words would be missed.
- Counts in this file: 33 rows in item 3; 10 nav anchors and 31 footer anchors in item 4; in item 5, 31 copy-sheet rows from the first search (13 about review timing) plus 6 support and 7 newsletter rows from the second; 34 page types in item 6; 28 forms in item 10; 20 home embeds and 32 layer files read.
