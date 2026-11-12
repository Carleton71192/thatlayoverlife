# /travelers role badges and Founding 100: Step 0 and draft change log

For Nancy. 12 November 2026. Read only: nothing was written to Webflow or Memberstack, nothing was published, no git commit. Your prompt: claude/tll-travelers-role-badges-founding100-prompt-2026-11-12.md.

Where the evidence comes from:
- [R1] the page reader (Webflow element and settings reads, the published HTML of the 09:51 UTC www publish, a Playwright render at 1440 and 375 with every non-GET request blocked). The travelers code is byte for byte the same in the 11:03 UTC publish.
- [R2] the fields reader (Memberstack get calls, Webflow CMS reads, the published HTML).
- [C] checked again by me for this report: the repo files named, and plain GET requests to www on 12 Nov.

Members are described by role only: the founder (you), member A, member B, member C (the member who holds Nº 002).

## 1. Short version

1. All eight fields you named exist in Memberstack, but `is-expat`, `is-creator`, `is-press`, `lives-*` and `roles` are left over from an old editor and nothing reads them. The page runs on the "Live there", "Make things" and Press switches (`list-expats`, `list-creators`, `list-press`).
2. The card badge is a typed CMS field. "TRAVELER" is written in by page code when that field is empty, on 6 of 8 cards.
3. `location-expert` and `founding-number` do not exist. I propose both below, for your approval.
4. tllStates is each member's own private map, so it cannot count anything across the site. Site-wide numbers come from the "Site stats" CMS item that the Worker updates every 30 minutes. The Founding count would go there.
5. The strip and the chips do not disagree because of a bug. They count different things: 6 travelers with a live story, and 8 public profiles.
6. Settle four things before building: where the founding number lives; how Location Expert fits with the automatic "Local Expert: [City]"; whether unverified press shows CREATOR; and whether the "Your name here." tile comes back, after you retired it on 29 Oct.
7. Some steps can go ahead now (badges, labels, legend, stamp, meta). Others wait on data that does not exist yet: the expat "since {year}" line, press outlets and the Location Expert badge.
8. The stats strip sits in the shared footer, so I only propose that change. The /press-rules link stays plain text until that page has real content.

## 2. Step 0 answers

### 2.1 What each part is bound to today

| Part | Bound to today | Evidence |
|---|---|---|
| Card badge (.tv-label b2d39169 in card link 75833cff) | The Contributors plain-text field "Badge label" (`badge-label`, help text "Editor only ... FOUNDER · EDITOR or FOUNDING 02"). Two items have it filled: the founder ("FOUNDER · EDITOR") and member C ("FOUNDING 02"). When it is empty, the page script tv-v2-js (embed d8735ad4) writes "TRAVELER" (6 of 8 cards). It is static text inside the card link, with no hover of its own. The Option fields "Badge" and "Traveler Category" are not bound | [R1 §3], [R2 §2] |
| Card caption under the name | "One line" (`one-line`). "Fun Title" is bound nowhere on /travelers | [R1 §3] |
| Filter chips (embed d8735ad4) | Typed: Everyone, Live there, Make things, Press, Pets. The counts come from hidden marker spans on each card (data-tv-on = expats / creators / press), which show or hide with the CMS switches `list-expats`, `list-creators`, `list-press`. The site layer tll-travelers-fix-v1 renames Everyone to "People" (line 120), hides the Pets chip (CSS) and counts people only (counts(), line 99). On www: People · 8, Live there · 2, Make things · 1, Press · 1 | [R1 §3], [C] src/site-layers/tll-travelers-fix-v1.js lines 99 to 105 and 120 |
| Press chip | Counts `list-press` alone. `press-verified` is empty on every Contributors item, yet Press shows 1 (member A) | [R2 §2] |
| Top filter bar (Block f437e09a) | Static typed links, not bound: "All travelers" /travelers, "Expats · Location Experts" /for-expats, "Press · The Pros" /for-press, "Pet travelers" /the-paw-passport, "Creators & affiliates" /creators. The last one is hidden by tll-drafted-v1 because /creators is a draft and answers 301 to /travelers, so 4 pills show | [R1 §3]; screenshot page/www-mobile-first.png |
| Stats strip | Lives in the shared footer component "TLL Site Footer" (983b976f), not on the page. The four numbers are empty in the published HTML and the label reads "traveler". The footer script tll-live-counts-v3.3 fills them in the browser: 54 / 57 / 6 travelers / 1 pet. It is not bound to the Site stats item, although the comment in src/site-stats.js says "which the footer binds to" | [R1 §3], [R2 §3], [C] src/site-stats.js lines 1 to 5 |
| Open-slot card | Embed 4cd74f9a ("OPEN SLOT / Your name here.") is hidden by the layer (CSS line 45). The layer puts its own tile in its place, with copy that changes with the pressed filter (TILE map, lines 30 to 36). On Everyone the tile reads "WRITE FOR TLL / Pitch your layover." This follows your 29 Oct decision to retire the open-slot signals (layer header lines 1 to 8) | [R1 §3], [C] layer lines 1 to 8, 30 to 36, 45 |
| Order | The CMS sorts by name. tv-v2-js shuffles with a seed from the UTC date, so every visitor sees the same order for one day | [R1 §3] |
| Meta | Description ends "Sorted by recent bylines." The JSON-LD CollectionPage description in the head ends the same way | [R1 §3] |

Screenshots of the page as it is now, 1440 and 375 wide (2x): page/www-desktop-first.png, page/www-desktop-full.png, page/www-mobile-first.png, page/www-mobile-full.png in the work folder. Nothing has been built, so there are no "after" screenshots yet.

### 2.2 The eight Memberstack fields (exact keys)

All 83 custom fields are PRIVATE. Memberstack fields have no type: every value is a string, so rules like "integer, 1 to 100, unique" cannot be enforced there [R2 §1]. The full list is in fields/ms-custom-fields.tsv [C].

| Key in your prompt | Exists | Label | Members with a value (of 8) | Who can set it today | Read by /travelers |
|---|---|---|---|---|---|
| `is-expat` | yes | "Directory: Expat (opt-in)" | 1 (founder) | Nobody: its old editor never starts on /edit-profile | no |
| `is-creator` | yes | "Directory: Creator (opt-in)" | 0 set to true | Nobody | no |
| `is-press` | yes | "Directory: Press (opt-in)" | 1 (founder) | Nobody | no |
| `press-verified` | yes, admin-only | "Verified press (editor sets)" | 0 | Editor | no. The CMS has its own `press-verified` (plain text), and nothing copies one to the other |
| `lives-country` | yes | "Lives in (country)" | 1 (founder) | Nobody | no, never copied to the CMS |
| `lives-city` | yes | "Lives in (city, optional)" | 1 (founder) | Nobody | no |
| `lives-years` | yes | "Abroad since / years" | 1 (founder) | Nobody | no |
| `roles` | yes | "Roles (creator / press)" | 0 | Nobody | no |

What actually drives the page: `list-expats` ("Live there" on /edit-profile), `list-creators` ("Make things"), `list-press`. Members set these, and the Worker copies them to the CMS (src/profile-sync.js FIELD_MAP) [R2 §2]; [C] the /edit-profile switch labels in src/pages/edit-profile/live-2026-10-27/after/4080e4be.html.

Missing:
- `location-expert`: no field in Memberstack or the CMS.
- `founding-number`: no field anywhere.
- Pets have no Memberstack custom field. They live in member JSON `pets` and in the Pets collection.
- No "show home base" switch. Your expat hub answer G puts "Show home base" in Phase 3.

The two stores already disagree:
- Memberstack has `list-expats` true for 2 members; the CMS has it for 3. The extra one is member B, whose item is not on the page.
- The founder has `list-creators` and `list-press` "true" in Memberstack but empty in the CMS [R2 §2].
- Badges will follow the CMS, so these need resyncing once before the badges go live.

### 2.3 Other things the prompt assumes that are not true today

1. **"Every count comes from tllStates."** That cannot work. tllStates is one member's private map record (member JSON, shape {v:2, travelers, states}; src/map-merge.js lines 3 to 8), also read from that browser's localStorage. Site-wide numbers come from two places:
   - the Site stats CMS item (stories 57, travelers 6, pets 1, countries 54, counted 2026-11-11T15:00:58Z), which the Worker's 30-minute job writes (src/site-stats.js);
   - the footer browser script tll-live-counts-v3.3.

   [R1 §5], [R2 §3], [C] src/site-stats.js, src/map-merge.js. I read your rule as "counts are computed from live data, never typed", which is also the city guides rule 5.
2. **"Bound to Memberstack."** The cards never read Memberstack. They render from the Contributors CMS list (filter: Visibility = Public, limit 100). With Memberstack blocked, all 8 cards and the pet card still rendered [R1 §1].
3. **Can a role be read on a public page without exposing member data?** Yes, if it goes through the CMS and carries only what the badge says:
   - A browser can read only the signed-in member's own Memberstack data. Reading anyone else's needs the admin key, which must never be in a page.
   - A role can be shown as a hidden marker that Webflow outputs only when a switch is on (the way expats, creators and press work today). The page then shows only "yes" for that role.
   - Fields that are not bound on the page are not public.
   - Two cautions:
     - The CMS `press-verified` is free text ("who verified and when"). It must be used as a condition only, never written into the page as a value.
     - Do not copy `lives-city` or `desks` "now" values to the page, because a desk marked "now" is where someone is at the moment.
4. **"Right now the strip says 1 traveler."**
   - That was the typed fallback until 11 Nov (handoff/CHANGE-LOG-P0-CLOSEOUT-2026-11-11.md row 4).
   - Today the strip shows 6 once its script runs. Without JavaScript, or before the script runs, it shows no numbers.
   - The chips say 8 because they count published Public profiles. The strip counts writers with at least one live story (your 11 Nov rule). Of the 8 cards, 3 have no live story, and 1 writer has no card because their Visibility is unset (member B, the same member whose CMS Live there is on): 8 − 3 + 1 = 6 [R1 §4]; [C] Stories read per contributor, and src/site-stats.js computeStats counts every live profile not set to Off that wrote a live story.
5. **"FOUNDING 02" and the Founding 100 elsewhere.** Today the only founding numbers are typed text:
   - `badge-label` "FOUNDING 02" on member C's item;
   - the home page: the chapter eyebrow "06 · The first 100" (shown once; a second "The first 100" sits only in a code comment) and the typed roster "Founding 01", "Founding 02", "Founding 03 · Pet" [C: GET www home on 12 Nov].

   The sentence "First 100 get a founding badge." was cut from home on 11 Nov (handoff/WEBFLOW-LOCK.md line 362). /signup, /about, /faq, /for-press and /editorial-charter carry no Founding wording [C].
6. **The Contributors collection is at Webflow's 60-field limit.** Any new CMS field there means retiring one first (src/profile-sync.js line 76; [R2 §2]). The Site stats collection has 7 fields, so it has room.
7. **/press-rules does not exist.** It returns 404 on www [C] and on the test site. No page slug contains "rule" (96 pages) [R1 §8]. Your /for-press prompt (claude/tll-for-press-rebuild-press-desk-prompt-2026-11-12.md, Step 4) also creates /press-rules, with the badge rules, thresholds, removal and appeal.
8. **The fun title is editor-only in practice.** It is not in the Worker's FIELD_MAP and its /edit-profile input is hidden by CSS, so members cannot set it. Only the founder's listed item has one [R1 §3], [R2 §2].
9. **There is no outlet field.** "Up to two outlet names from confirmed bylines" has nothing to read. The /for-press prompt proposes `outlets`.
10. **There is no year source for the expat subline on the page.** `lives-years` is set only for the founder and is never copied. `desks` (which holds years) is empty on every CMS item [R2 §2].
11. **The Pets chip is hidden.** Pets now sit in their own "Travel companions" block under the people (layer item 4). The "Pets" label in Step 3 means bringing the chip back as a jump to that block [C] layer lines 9 to 12.

## 3. Draft change log, Steps 1 to 7

How each row is built:
- **WF**: a Webflow Designer change (element, binding or condition).
- **Embed**: a change to a page embed or the page code on /travelers.
- **Layer**: a site layer change, meaning a code change in src/site-layers (travelers chunk), rebuilt with build-site-layers-v16.py, pinned, registered and published.
- **CMS**: a CMS item or schema change.
- **Worker**: a Worker code change. You deploy it.

Copy rules:
- Copy in quotation marks with no mark is your own wording from the prompt.
- Every line I wrote is marked DRAFT.
- Badge words in capitals are yours.

Nothing here is applied until you approve it. Footer, nav and "Tell the editor" are proposal only.

### Step 1: Role badge bound to data

Your rules, in your order:
1. `is-expat` → ⌂ EXPAT · {lives-country}
2. `location-expert` → ⌂ LOCATION EXPERT · {lives-country}
3. `is-creator` → ✎ CREATOR
4. `is-press` AND `press-verified` → ◆ PRESS ✓. `is-press` without `press-verified` → CREATOR.
5. Pet profiles → 🐾 PET
6. Nancy keeps FOUNDER · EDITOR.
7. No role, no badge. Never "Traveler".
8. At most two, priority: team, Press ✓, Location Expert, Expat, Creator.

Proposed data behind each rule (question 1 asks you to confirm): Expat = CMS `list-expats` ("Live there"); Creator = CMS `list-creators`; Press = CMS `list-press` plus CMS `press-verified` filled; team = `badge-label` filled; country = the part of `home-base` after the last comma (question 5).

What the 8 cards would show with today's data:
- Founder: FOUNDER · EDITOR plus EXPAT · {country}.
- Member A: EXPAT · {country} plus CREATOR. Member A has Press on but no verification, so the press rule gives CREATOR, which is already there.
- Member C: the Nº 002 stamp, no badge.
- The other 5: no badge.

So 6 of 8 cards would carry no badge.

| # | Page or element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 1.1 | /travelers, card badge .tv-label b2d39169 | Bound to `badge-label`; "TRAVELER" written in when empty (6 of 8) | Shows `badge-label` only when it is a team label. Nothing when empty. The empty box is hidden | Embed: remove the 'TRAVELER' fallback in tv-v2-js people(). Layer: hide an empty label | The label keeps its padding when empty unless it is hidden. Check that the card does not change height between cards with and without a badge |
| 1.2 | /travelers, card link 75833cff, new hidden markers | Markers for expats, creators, press, ranges | Two more: data-tv-on="pressok" (shown when CMS `press-verified` is set) and data-tv-on="locexp" (shown when the new Location Expert field is on, row 1.5) | WF: two spans with conditional visibility, like the existing four. No value is written into the page | tv-v2-js counts markers per filter key. The new keys are not filter keys, but this must be checked so they do not change any chip count. Search reads card text: badge words become searchable (for example "press") |
| 1.3 | /travelers, role badges on the card | None | Up to two badges after any team label, in your priority order, built from the markers. Expat and Location Expert add " · {country}" from `home-base`. If no country can be read, just "EXPAT" (DRAFT fallback). Unverified press shows CREATOR, if that rule stands (question 4) | Layer: new item in the travelers chunk, or a new small layer tll-travelers-roles-v1 | Without JavaScript only the team label shows. That is the same as today, minus "TRAVELER". `home-base` is free text: "City, Country" parses, but a value with no comma could print a city as a country, so a value with no comma gets no country. The order is not enforced either: one of the 8 listed cards today has its home base written country first, so "after the last comma" would print a city where the country belongs. That member has Live there off, so no badge would show today, but the country must be checked against a country list before it prints |
| 1.4 | /travelers, Pets list cc8ba278 (Travel companions block), pet card | No badge | 🐾 PET on every pet card | WF: one static text element in the pet card (one word, not a count) | The pet search reads card text, so "pet" would match every pet card. That is harmless |
| 1.5 | Location Expert badge | None | ⌂ LOCATION EXPERT · {country}, filled. Shown only once the field exists and you set it for someone | Needs the new field (section 4, field 2). Until then nothing shows | Clash with "Local Expert: [City]" (section 5.2). The expat hub holds the Location Expert step until Phase 3, so in practice this row shows nothing now |
| 1.6 | Team badge | "FOUNDER · EDITOR" (founder), "FOUNDING 02" (member C) | "FOUNDER · EDITOR" stays. "FOUNDING 02" is replaced by the stamp (row 5.4) | No change for the founder | None |
| 1.7 | Contributors template (profile pages), hero badge | Bound to `badge-label` | Same binding. Member C's hero changes when row 5.4 clears the label | Follows 5.4 | Member C's profile hero shows no badge until the large stamp (5.3) is live. Do 5.3 and 5.4 in one publish |
| 1.8 | One-time resync before launch | Memberstack and the CMS disagree on 3 values (section 2.2) | The CMS matches each member's own switches | Worker or a CMS edit, after you approve and the members' own settings are checked | Badges reflect the CMS. Without the resync, the founder shows no CREATOR in the CMS while Memberstack says creator. The two-badge cap hides this today, but it would surface later |

### Step 2: Badge style

All specs here are DRAFT, to be checked against the Emil Kowalski, Taste and Impeccable skills before the build.

| # | Element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 2.1 | Outline badges: Expat, Creator, and Pet (pet style is a DRAFT choice; your prompt does not set it) | n/a | Icon plus uppercase word. 1px ink border, no fill. Square corners (2px). 12px mono, which matches the site's 12px type floor noted in tll-travelers-fix-v1 item 1 | Layer CSS, namespaced | Long country names on 375 wide cards: let the badge wrap to its own line rather than cut the country |
| 2.2 | Filled badges: Location Expert, Press ✓ | n/a | Same shape, ink fill, cream text, plus a 1px border of the same ink so it still reads in Windows high contrast mode, which drops background colors | Layer CSS | Contrast must be 4.5:1 or more (WCAG 2.2 AA); measured in the grayscale check |
| 2.3 | Team badge | Existing boxed style | Unchanged | none | none |
| 2.4 | Icons ⌂ ✎ ◆ ✓ 🐾 | n/a | One-color inline SVG drawn to match the glyphs, hidden from screen readers. The word carries the meaning | Layer | The 🐾 paw is a color emoji and differs on every system, so it is drawn as one-color SVG. I have not checked whether the brand mono font has ⌂ ✎ ◆; SVG avoids the question |
| 2.5 | Static, no link, no hover | The whole card is a link | Badges get no hover, no pointer change, no focus stop and no underline. They stay inside the card link | Layer CSS | The badge words become part of the card link's spoken name: for example "{name}, EXPAT {country}, CREATOR". That is acceptable, but listen to it once with a screen reader |

How a badge differs from a chip:

| | Filter chips and top bar | Role badges |
|---|---|---|
| Shape | Rounded pill (radius 999px), as in page/www-mobile-first.png and the layer's link-chip CSS | Square corners, 2px |
| Size | At least 32px tall, a tap target | About 20px tall, smaller than the name |
| Case | Chips: "Everyone · 8" with a count | Uppercase word, no count |
| Behavior | Pointer, hover border #C8325B, focus ring, pressed state | None of these |
| Place | A bar above the grid | Inside a card, between the photo and the name |

The grayscale check plan:
1. A test page or a ?preview flag that shows one card for each badge: team, Press ✓, Location Expert, Expat, Creator, Pet, the Nº stamp, plus a card with no badge. Live data has no Location Expert, Press ✓ or stamp yet, so the test page is needed.
2. Playwright screenshots at 1440 and 375 with `filter: grayscale(1)` on the page. Also screenshots with forced colors (high contrast) emulated. Non-GET requests are blocked as usual.
3. Pass when:
   - outline, filled and boxed badges look different by shape and fill alone;
   - every icon has a different outline;
   - badge text measures 4.5:1 or more against its own background in grayscale;
   - outline borders measure 3:1 or more against the card (WCAG 1.4.11);
   - no badge looks like a chip when the screenshots sit side by side.
4. Before and after screenshots at both widths go into the change log.

### Step 3: One name per role

| # | Element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 3.1 | /travelers chips (embed d8735ad4) | Typed "Everyone, Live there, Make things, Press, Pets"; the layer renames Everyone to "People" and hides Pets | "Everyone · Lives there · Creators · Press · Pets" | Embed: label text. Layer: stop the "People" rename (line 120) and show the Pets chip again, which jumps to the Travel companions block (goPets already exists) | Old links keep working: ?list= accepts all, live-there, expats, make-things, creators, press and pets today; add "lives-there". The expat hub uses /travelers?list=expats (expat hub change log line 30). The layer's TILE copy names the /edit-profile switches ("Switch on Live there", "Switch on Make things"). Those stay true only while the switches keep those names (question 13) |
| 3.2 | /travelers top filter bar f437e09a | "All travelers", "Expats · Location Experts", "Press · The Pros", "Pet travelers", "Creators & affiliates" (hidden) | "Everyone", "Lives there", "Creators", "Press", "Pets" | WF: text only, links kept unless you choose otherwise (question 14) | The same word now does two different things: the "Lives there" pill opens /for-expats while the "Lives there" chip filters the grid. "Creators" points at /creators, which redirects to /travelers and is hidden by tll-drafted-v1, so it stays hidden unless pointed at /travelers?list=creators |
| 3.3 | Labels to remove | "The Pros", "Make things", "& affiliates", "Location Experts" in the visible filters | Gone through 3.1 and 3.2 | as above | The old hidden chips f7d9e4aa still hold "Location Experts" but are not published. Left alone |

### Step 4: Card sublines and fun titles

| # | Element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 4.1 | Expat subline "{lives-city or lives-country} since {year}" | None | **Held.** There is no year on the page and no switch to turn it on (section 2.3 items 3 and 10). Proposed for when the Phase 3 "Show home base" switch exists, reading city or country only from `home-base` and the year from a "since" year the member sets with that switch. Never read from a desk marked "now" | Later: CMS plus Worker | Showing `lives-city` or anything from a desk marked "now" would break the never-current-location rule |
| 4.2 | Creator "Makes photos · video · words" | Page footer script tll-trav-makes-v1, from `makes`, shown only with the creators marker | Unchanged | none | none |
| 4.3 | Press outlets, up to two | None | **Held** until the /for-press build adds `outlets` and verified bylines | Later | none now |
| 4.4 | Fun title as the caption under the name | Not bound. The caption is "One line" | `fun-title` shown under the name when filled. Never in the badge slot | WF: bind a text element to `fun-title`, hidden when empty | Today only the founder's listed card has one, so the others stay as they are. Whether "One line" stays is question 7 |

### Step 5: Founding 100

| # | Element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 5.1 | New field `founding-number` | None | See section 4, field 1. You set 1 (founder) and 2 (member C) | CMS (recommended) or Memberstack admin-only | A number set twice. The Worker checks for duplicates (5.5) |
| 5.2 | Card photo corner | None | "Nº 002" stamp, separate from the badges, only when the number is set | WF: text element bound to the number with an "is set" condition, placed over the photo. Layer: pad to three digits | Without JavaScript the stamp reads "Nº 2". It must sit clear of the initials on cards with no photo |
| 5.3 | Contributors template (profile) | Hero badge from `badge-label` | A large "Nº 002" on the profile | WF on the template 6a0b29c8a7b1840afe9390ab | Every profile uses this template. Check one with no number set |
| 5.4 | Member C's `badge-label` | "FOUNDING 02" | Empty | CMS edit, same publish as 5.2 and 5.3 | See 1.7 |
| 5.5 | Site stats collection 6ae602821fa37291336b5680, and src/site-stats.js | Stories, travelers, pets, countries | Plus `founding-claimed` and `founding-next` (section 4, fields 3 and 4). runSiteStats counts the numbers set on live Contributors. It writes `founding-next` as the highest number used so far plus one, and never lowers it, so a number is never handed out twice. It reports duplicates | CMS schema plus Worker. You deploy | The counts lag up to 30 minutes behind your edit, and the publish adds a little more |
| 5.6 | /travelers, line near the tile | None | "Founding 100: {n} claimed". At 100: "Founding 100: closed" | WF: a one-item collection list of Site stats, bound and server-rendered, with conditions on the number. Works without JavaScript | A fourth list on the page. Webflow allows far more, but confirm on the plan. If the Site stats item is ever unpublished, the line disappears, which is the honest result |
| 5.7 | /travelers action tile (layer TILE, Everyone) | "WRITE FOR TLL / Pitch your layover. / We edit lightly and keep your byline. Your card here comes with it." | "Your name here. Nº {next} is still open." When closed, the line is removed and the pitch tile stays as it is | Layer: read {next} from the list in 5.6 | This brings back the "Your name here." wording you retired on 29 Oct (question 8). The other filters' tiles stay as they are |
| 5.8 | Home roster (outside /travelers) | Typed "Founding 01", "Founding 02", "Founding 03 · Pet" | Not changed in this build | Question 9 | "Founding 03 · Pet" conflicts with "number earned with a first published story" |

### Step 6: Legend

| # | Element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 6.1 | /travelers, one line above the grid | None | "⌂ Lives there · ✎ Makes things · ◆ Press, bylines checked by the editor · 🐾 Pets · Nº = one of the Founding 100. Filled badge = checked by TLL." | WF: static text with the same SVG icons. Works without JavaScript | It uses "Makes things" while the chip says "Creators". That is your wording, but you may want one name (question 13). It has no Location Expert entry, though "Filled badge = checked by TLL" covers it. At 375 wide it runs to about three lines |
| 6.2 | The link on "checked" | None | Plain text until /press-rules has real content. Then a link, added in the same publish that makes that page live | Section 5.4 | The word "checked" appears twice in the line. Which one carries the link is question 15 |
| 6.3 | /press-rules (new page) | 404 | Built as a Webflow draft, which is not served. Not published until it holds the badge rules from the /for-press build, Step 4 | WF: new draft page | A draft page is not public, so no placeholder reaches visitors |

### Step 7: Fix the counts

| # | Element | Before | After | How | What could break |
|---|---|---|---|---|---|
| 7.1 | Chip counts | Computed in the browser from the cards on the page | Unchanged rule (recommended): a chip count must match the cards it filters, and these numbers are computed, not typed. Press counts only verified press if you choose that (question 4) | Layer, only if question 4 changes it | If chips were bound to Site stats instead, they could disagree with the grid for up to 30 minutes after any edit |
| 7.2 | Stats strip (shared footer 983b976f, embed 22cd9a12, tll-live-counts-v3.3) | Empty numbers in the HTML, filled by script (6 travelers); label "traveler" | **Proposal only**, as a shared component: bind the four numbers to the Site stats item so they show without JavaScript, and print "travelers" with the s. Keep the definition you chose on 11 Nov | WF on the footer component, with your approval | Changes every page that uses the footer. Check home, /signup and /about, which show the same numbers |
| 7.3 | Why 6 and 8 differ | Two definitions (section 2.3 item 4) | Your choice (question 10) | Depends | none |
| 7.4 | /travelers meta description | "The Travelers. Nomads on the road, expats with a postcode they defend, press on assignment, and readers who just signed up. Sorted by recent bylines." | "The Travelers. Nomads on the road, expats with a postcode they defend, press on assignment, and readers who just signed up. In random order, reshuffled daily." The new ending is DRAFT; 158 characters | WF page settings | Search listings change. The page stays indexed. "Reshuffled daily" is true: the order is seeded by the UTC date |
| 7.5 | JSON-LD CollectionPage description in the page head | "The Travelers. Nomads on the road, expats with a postcode they defend, press travelers on assignment, and the friends who signed up to read. Sorted by recent bylines." It differs from the meta description in the middle, not only at the end | Same new ending as 7.4 (DRAFT). Whether the middle should also match 7.4 is yours to say | Embed (page head code) | Keep the canonical and og:url lines in that head code as they are |

## 4. New fields for your approval

| # | Field | Where and type | Who can edit | Where it shows | Notes |
|---|---|---|---|---|---|
| 1 | `founding-number` | **Recommended:** a Number field on Contributors (whole numbers 1 to 100). **As your prompt asks:** a Memberstack custom field with restrictToAdmin on, like `press-verified` | You only. Members cannot write CMS fields: /profile/save accepts only the MEMBER_WRITABLE list and refuses anything else | Card stamp on /travelers, large on the profile, and counted in Site stats | The CMS has no room until one field is retired. Candidate: `currently-in` (help text "Retired 31 Oct"; it appears only in the private-fields list in src/export.js line 54; its template bindings still need checking). A Memberstack field cannot be typed or unique, nothing copies it to the CMS today, and the page can only read the CMS. That is why I recommend the CMS. Uniqueness is checked by the Worker (5.5) |
| 2 | `location-expert` | Switch on Contributors, or Memberstack admin-only, same choice as field 1 | You only | ⌂ LOCATION EXPERT · {country}, filled, on /travelers and the profile | Needs a second retired CMS slot. `cities-count`, `states-count` and `published-count` are candidates, each to be checked first. I suggest it waits for the expat hub's Phase 3 approval step (section 5.2) |
| 3 | `founding-claimed` | Number on Site stats | The Worker only | "Founding 100: {n} claimed", "Founding 100: closed" | Site stats has 7 fields, so there is room |
| 4 | `founding-next` | Number on Site stats | The Worker only, never lowered | "Nº {next} is still open." | Keeps a number from being reused if a member leaves |
| 5 | Not a new field: the "pressok" marker | Condition on the existing CMS `press-verified` | You (CMS) | Decides ◆ PRESS ✓ | Two `press-verified` fields exist (Memberstack admin-only, and CMS text) and they are never synced. I propose the CMS one is the one that counts, since the page reads the CMS |

Also needed but owned by other builds:
- `outlets` (/for-press prompt) for the press subline.
- "Show home base" (expat hub Phase 3) for the expat subline.
- A new draft page: /press-rules.

## 5. Conflicts to settle

### 5.1 The "Live there" switch (expat hub)
- The expat hub treats the "Live there" switch (`list-expats`) plus home base as the source (answers file line 15, D). That switch already drives the expats map and /travelers?list=expats.
- This prompt's Expat badge reads `is-expat` and `lives-country`. Only the founder has those set, and nothing edits or copies them.
- Proposal: the Expat badge reads `list-expats`, and the country comes from `home-base`.
- The names differ: your chip says "Lives there", but the /edit-profile switch, the map line the expat hub corrected (change log row 14) and the action tile all say "Live there". Pick one (question 13).

### 5.2 Location Expert vs "Local Expert: [City]"
- **This prompt:** Location Expert is a yes/no field that only you set, country-level, shown as a filled badge ("checked by TLL").
- **The city guides prompt (line 106):** "Local Expert: [City]" is granted automatically at 5 live picks with photos plus a linked account, and dropped below 5. "Nancy is not a gate" (line 21).
- **The expat hub:** keeps the form name "Location Expert application" (answer E), and moves the approval step and the label to Phase 3 (change log lines 353 to 355).
- One yes/no field cannot serve both.
- How they can fit:
  - "Location Expert" is your checked, country-level status. It comes from the application form, shows filled on /travelers and on the profile, and is stored in `location-expert`.
  - "Local Expert: [City]" is earned per city from picks. It shows on picks and the profile, as the city guides prompt says, and is stored with the picks, not in `location-expert`.
  - On /travelers, a member with both shows only the Location Expert badge, so no country or city is said twice.
- The two names are one word apart, and readers will mix them up. You may want to rename one (question 3).
- The /travelers hero lede already says "Find a local expert", while no member holds either status today (page/www-mobile-first.png).

### 5.3 Founding 100 wording already live
- Home: "The first 100" and the typed roster "Founding 01 / 02 / 03 · Pet".
- /travelers: "FOUNDING 02" as member C's badge.
- Both are typed numbers, which your count rule forbids.
- A pet holding 03 conflicts with "earned with a first published story", because pets have no stories and no `founding-number`.
- This build fixes /travelers only. Home is question 9.

### 5.4 /press-rules placeholder vs honest states
- Your prompt says to make a draft placeholder if the page is missing.
- The house rule (city guides prompt rule 6: "No placeholders in public") means the link must not lead to an empty page.
- A Webflow draft is not served (404 on www, like /press today), so a draft page by itself is safe.
- The risk is the link: a link to a draft is a link to a 404.
- Proposal: "checked" stays plain text, and the draft page is built. The /for-press build writes the rules into that same page (its Step 4 says to extend it if it exists). The link and the page go live in one publish.
- Other options: point "checked" at /editorial-charter for now. But that page does not explain badge checks: its only matching rule is disclosure of hosted trips and press credentials [C]. Or drop the link.

### 5.5 Unverified press shows CREATOR
- This prompt shows CREATOR for `is-press` without `press-verified`.
- The /for-press prompt gives CREATOR for `is-creator` without verification, and only says that badge logic must match.
- Showing CREATOR to someone who did not switch on Make things labels them as something they did not choose (question 4).

### 5.6 The 29 Oct open-slot decision
- tll-travelers-fix-v1 exists because you agreed to retire the open-slot signals (layer header lines 1 to 8, src/site-layers/build-site-layers-v16.py line 52).
- Step 5 brings back "Your name here." (question 8).

### 5.7 Out of scope, noted
- The layer's Press tile still says "An editor reviews within 48 hours" (layer line 33). On 11 Nov other "within 48 hours" promises were removed from home, /about and /submit (handoff/WEBFLOW-LOCK.md lines 347 and 362).
- No change in this build unless you add it.

## 6. Open questions for Nancy

1. **Which switches make the badges?**
   - (a) `list-expats`, `list-creators`, `list-press`, the ones members use now;
   - (b) the old `is-*` fields, which would need an editor first.
   - Recommend (a).
2. **Where does the founding number live?**
   - (a) a Number field in the CMS, retiring `currently-in`;
   - (b) Memberstack admin-only plus a new Worker copy into the CMS;
   - (c) keep typing it into `badge-label`.
   - Recommend (a).
3. **Location Expert and Local Expert:**
   - (a) two statuses as in 5.2, with Location Expert held until the expat hub's Phase 3;
   - (b) one automatic status for both;
   - (c) one status, always checked by you.
   - Recommend (a), and consider renaming one of them.
4. **Press without verification:**
   - (a) CREATOR, as written;
   - (b) no press badge, and CREATOR only if Make things is on.
   - Recommend (b). Also: should the Press chip count only verified press? Recommend yes; today that is 0.
5. **Expat country:**
   - (a) from `home-base`, after the last comma;
   - (b) from `lives-country`, which needs an editor and a copy step;
   - (c) from desks.
   - Recommend (a).
6. **Expat "since {year}" line:**
   - (a) hold until the Phase 3 "Show home base" switch;
   - (b) build now from desks, skipping any desk marked "now". `desks` is empty on every CMS item, so nothing would show yet.
   - Recommend (a).
7. **Fun title:**
   - (a) under the name, with "One line" kept below it;
   - (b) replaces "One line" when set;
   - (c) profile only.
   - Recommend (a). Members cannot set it today; should they be able to?
8. **The "Your name here." tile:**
   - (a) on Everyone only, with the founding line;
   - (b) keep the 29 Oct pitch tile and add only "Founding 100: {n} claimed".
   - Recommend (a), as your prompt asks.
9. **Home roster "Founding 03 · Pet":**
   - (a) pets are not numbered;
   - (b) pets get numbers too, which needs a Pets field.
   - Recommend (a). Have the roster read the numbers later.
10. **6 travelers vs 8 people:**
    - (a) keep both, since they count different things;
    - (b) change Site stats to count public profiles;
    - (c) list only writers on /travelers.
    - Recommend (a). Also check the one writer whose profile visibility is unset.
11. **Stats strip in the footer:**
    - (a) approve binding it to Site stats so the numbers show without JavaScript;
    - (b) leave it.
    - Recommend (a), as its own approval.
12. **/press-rules:**
    - (a) plain text until the page has content;
    - (b) link to /editorial-charter for now;
    - (c) drop the link.
    - Recommend (a).
13. **One name per role, everywhere:**
    - (a) rename the /edit-profile switches and tile copy to "Lives there" and "Creators" (field keys unchanged);
    - (b) keep the switch names "Live there" and "Make things".
    - Recommend (a). The legend's "Makes things" would then become "Creators".
14. **Top filter bar links:**
    - (a) keep sending to /for-expats, /for-press, /the-paw-passport, with "Creators" pointed at /travelers?list=creators;
    - (b) make every pill filter this page, like the chips;
    - (c) remove the top bar on /travelers.
    - Recommend (a).
15. **Which "checked" in the legend links to /press-rules:**
    - (a) "bylines checked by the editor";
    - (b) "checked by TLL".
    - Recommend (b), since it covers both filled badges.
16. **Location Expert and Expat on one card:**
    - (a) show only Location Expert;
    - (b) show both.
    - Recommend (a), so the country is not said twice.

What I could not do here:
- I made no Webflow element reads of my own. Element ids and bindings come from [R1].
- No "after" screenshots exist, because nothing is built.
- I did not test whether Memberstack refuses a member's own write to an admin-only field [R2 §4].

## 7. Second check (12 Nov, read only)

Re-checked against live data by a second reader: the badge binding (Webflow element settings: .tv-label b2d39169 text is bound to Contributors "Badge label"); the 8 Memberstack keys and their labels, all 83 fields PRIVATE, 3 admin-only; the value counts in section 2.2 on all 8 members; the Contributors schema (60 custom fields) and Site stats (5 custom fields plus name and slug); the Site stats item (57, 6, 1, 54); the 6 versus 8 cause; /press-rules 404 on www and the test site, no page slug with "rule"; chips, labels and footer numbers in a Playwright render at 375 with non-GET requests blocked; the meta description text and its 158-character replacement; the cited lines in the layer, src/site-stats.js, src/map-merge.js, src/profile-sync.js, src/export.js and the related prompts. Corrections made: the home "first 100" wording count, a country removed from one example, the year source for the expat line, the home base order risk, the JSON-LD description text, and member B named as the uncarded writer.
