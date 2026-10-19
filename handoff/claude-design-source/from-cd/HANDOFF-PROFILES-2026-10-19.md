# HANDOFF TO CLAUDE CODE · Profiles · 19 October 2026

Scope: everything about a member's page. Public profile, edit profile, sign-up, Travelers list, pursuits, and the counts those pages show. Supersedes Packet 2.7 in `HANDOFF-TO-CODE-2026-10-19.md`; everything else in that file stands.

Design source: `TLL Site Prototype 3.2.dc.html`, screens **Public profile v2**, **Edit profile v2**, **Travelers v2** (open the file, use the nav; the prototype bar on Profile v2 switches Jay thin / Nancy full). Pursuits: `TLL Pursuit Hub.dc.html`, screen **Profile pursuits**. Counts: `uploads/COUNT-RULES.md`. Rules: `CLAUDE.md`.

Build as unpublished edits. Nancy publishes. Never touch Memberstack blocks, legal wording, or a member's own text. US spelling, no em dashes, no exclamation marks. Never: filed, ship, ledger, "the shelf", "counted by hand", "real names", "Currently in".

---

## 0 · Decisions already made (do not re-ask)
- A profile is **public the moment a member signs up**, story or no story. Thin is normal.
- Submission needs **no approval and no email to Nancy**. Editor reviews after (morning review skill).
- **Counts are never typed.** Every number on a profile comes from the member's saved map. Bios carry no counts (soft warning only; the member may keep it).
- Default contact is the **relay form**; email shown only when the member picks it. Nancy picks "Show my email" for herself.
- **Home base shows. Current location never does.** No field for it anywhere.
- One label per Travelers card. The old triad (Founder · Expat · Lifer) is retired.
- Jay's slug is `jay-carleton`. Nancy's is `nancy-carleton`. Profile URLs stay at `/contributors/{slug}`.

## 1 · Live bugs to fix first (no new fields)
| # | Bug | Fix |
|---|---|---|
| P1 | New member's profile is not public until a story is approved | Memberstack `member.created` webhook → create Contributors item (name, slug from name with collision suffix, photo if given, `visibility` = public) → publish. Target: live within 60 s of sign-up. |
| P2 | /submit emails Nancy and holds the story | Remove the notification and the hold. Publish on rules pass (Packet 2.3). Writer gets the copy email. |
| P3 | Profile shows "0 countries" / "no links shared yet" / empty boxes | Template conditions: every section hides when empty (see §3 states). |
| P4 | Jay's avatar is the wide salt-flat shot cropped to a sliver | Use the tight crop (`images/jay.jpg` in the prototype); render the profile photo field at 1:1 with `object-position: center`. |
| P5 | Travelers list shows Nancy only, triad labels, three sections of open desks | Rebuild per §5. |
| P6 | Typed counts in bios and profile fields ("88 countries") | Hide the typed fields; bind to the map (§4). Keep the data until Nancy confirms, then delete the fields. |

## 2 · CMS fields

### Contributors (existing collection)
Add:
- `one-line` · plain text, 90 chars · the line under the name. Not a job title.
- `home-base` · plain text · "Copenhagen, Denmark". Shown. Never a "current location".
- `from-lived` · plain text, up to 5 ISO2 codes comma separated · rendered as circle flags. Not a count.
- `languages` · plain text, comma separated.
- `credit-mode` · option: full / first / pen · drives every byline.
- `pen-name` · plain text · shown when credit-mode = pen. Real name stays on the member record, never rendered.
- `contact-mode` · option: relay / instagram / email / off · default relay.
- `public-email` · email · rendered only when contact-mode = email, written as `name [at] domain` in text plus a real `mailto:`.
- `visibility` · option: public / unlisted / off · default public. Unlisted = `noindex`, reachable by link. Off = 404 for visitors; bylines still render.
- `share-ranges` · switch (exists) · shows "80-something" instead of 87.
- `links` · one link field per platform, each with an on/off switch: `link-instagram`, `link-youtube`, `link-website`, `link-tiktok`, `link-substack`, `link-strava`, `link-alltrails`, `link-komoot`, `link-garmin`, `link-beli` + matching `show-*` switches. (Webflow has no repeater; ten pairs is the honest shape.)
- `pursuits` · multi-ref Pursuits (new collection, see Pursuit Hub handoff) · opt-in per hub.
- `badge` · plain text · one label, editor-set only ("FOUNDER · EDITOR", "FOUNDING 02"). Members cannot edit it.
- `map-snapshot` · plain text (JSON) · written by the map editor on every save: `{"countries":87,"antarctica":true,"places":88,"layovers":6,"savedAt":"2026-10-19T14:02:00Z"}`. The public profile reads this; nothing else.
- `crew` · multi-ref Contributors · mutual links (both sides must hold the reference before either renders).
Keep: `slug`, `name`, `photo`, `bio`, directory switches (`expats`, `creators`, `press`, `press-verified`), `member-id`.
Retire after backfill: any typed `countries-count`, `continents-count`, `stories-count`.

### Pets (existing)
Add `shared-with` · multi-ref Contributors (Magnus shows on Jay's page too).

### Stories (per Packet 2.1)
`author` (ref), `co-travelers` (multi-ref), `pets` (multi-ref). Profiles read these.

## 3 · Public profile template · `/contributors/{slug}`
Reference: Prototype 3.2 → Public profile v2. Measure 1120, pad `clamp(40px,7vh,80px) max(20px,6vw)`, spacing scale 20 / 40 / 80.

Section order and conditions:
1. **Hero.** Photo 4:5 (initials on ink if none), one editor badge top-left when `badge` set. Eyebrow `TRAVELER · {SLUG}`. H1 Playfair 800, last name in italic rose. `one-line` under it when set. Meta row: `HOME-BASE` · `ON TLL SINCE {year of created}` · flags from `from-lived` (hide the group when empty). Stats strip from `map-snapshot`: `{countries} +AQ` COUNTRIES (the `+AQ` only when `antarctica` true), `{places} / 249` PLACES, `{n}` STORY/STORIES, `+{layovers}` LAYOVERS (hide when 0). With `share-ranges` on: "80-something". If `map-snapshot` is empty: show STORIES only; no zeros.
2. **Buttons.** Get in touch (per contact-mode; hidden when off), one outline button per link with its switch on, "Edit profile →" for the owner only. Links open in a new tab, `rel="noopener"`. Under the row: one line explaining the contact path ("Opens their chosen channel or the relay form. Nobody's email is shown until they reply." / "Email shown by their choice.").
3. **About.** `bio` as paragraphs. Hidden when empty.
4. **Stories by {First}, or with {First}.** Collection list: Stories where `author` = current OR `co-travelers` contains current, newest first. Cards: 4:3 hero image (ink + place name if none), country eyebrow, "· WITH {FIRST}" when the member is a co-traveler, title, pillar · read time. Heading meta "{n} STORIES · NEWEST FIRST". Empty: dashed box "{First} has not written one yet." and, for the owner only, "Write your first →". Visitors see the box, not the button.
5. **Travels with.** Pets where `owner` = current OR `shared-with` contains current. Ink card, Samoyed line, "{n} places" from the pet's own count. Hidden when none.
6. **Where {First} has been.** Map embed, public mode, read-only, from the member's saved map. Meta "FROM THE MAP · UPDATED WHEN {FIRST} SAVES IT". Hidden when no map saved.
7. **Footer line.** "Hosted or gifted travel is labeled at the top of every story" · "Report this profile" (mailto editor with slug prefilled).

`visibility`: public → indexed; unlisted → `<meta name="robots" content="noindex">`; off → redirect visitors to /travelers, owner still sees it with a banner.

Structured data: `Person` with `name` (per credit-mode), `url`, `image`, `homeLocation` = home-base, `sameAs` = links that are on. No email in the JSON-LD.

Nested-list limit: Webflow allows one nested collection list per page. Stories is the nested list; Pets and flags render from the member item's own fields (flags from `from-lived`, pets via a second collection list filtered by reference, which is allowed at page level).

## 4 · Counts · one function, three places
Reference: `uploads/COUNT-RULES.md`, Account v5 `count()`.
- The map editor writes `map-snapshot` on every successful save (and only then; "Last saved" moves with it).
- Public profile, Travelers card and /account read the same snapshot. No page computes its own.
- Rules: Countries = Lived or Stayed minus Antarctica; "+ Antarctica" suffix when ticked. Places = the same set with Antarctica, of 249. Layovers beside, never inside. UN 193 beside, never replacing. Pets own count.
- Visitor view of the country number: **show it** (Nancy, 19 Oct, pending her final word in Packet 3.5). `share-ranges` softens it to a range.

## 5 · /travelers (Travelers v2)
Reference: Prototype 3.2 → Travelers v2.
- One collection list of Contributors where `visibility` = public, **shuffled** (Webflow random sort, re-seeded daily), never ranked, never paid.
- Card: photo 4:5 (initials if none), one label top-left (`badge` if set, else `TRAVELER`), `PET` tag for pet cards (Pets collection merged in or a second list; if two lists, pets go after people), name, one-line, home-base + flags, two stats from `map-snapshot` (COUNTRIES, STORIES).
- Filters: Everyone · Live there (`expats`) · Make things (`creators`) · Press (`press`) · Pets. Filter via `?list=` and client-side show/hide on the same page; counts per filter in the chip label. No new pages.
- One open-slot card, copy changes per filter (see prototype `tvVals` OPEN map).
- Footer line: "Shuffled, never ranked, never paid · Where they know, not where they are" and "PR teams: share a press trip →" to /for-press.
- Headline cycles verbs (are / live / photograph / were) per the 3.1 ruling.

## 6 · /edit-profile (Edit profile v2)
Reference: Prototype 3.2 → Edit profile v2. Memberstack-gated. Left column form, right column sticky preview card (stacks under 900px).
- **Saves as you type.** Debounced PATCH to the Contributors item (Memberstack custom fields → Webflow CMS sync, or a small Worker). Status line "SAVED n S AGO · LIVE" / "ALL CHANGES SAVE AS YOU TYPE". No Publish button, no Save button.
- Section nav chips 01 WHO · 02 ABOUT · 03 LINKS · 04 CREW · 05 PETS · 06 CONTACT · 07 LISTS · 08 WHO SEES, dot turns teal when the section has content. Anchors, not steps.
- 01 Who: photo (change), Name, Shown as (full / first / pen + pen-name input), One line (90 max, counter), Home base, From and has lived in (flag chips, type a country + Enter, max 5), Languages (chips + Enter).
- 02 About: bio textarea. If it matches `/\b\d{2,3}\s+(countries|places)\b/i`, show the soft note "That looks like a country count… Keep it if you like." Never block.
- 03 Links: one row per platform, URL input + ON/OFF switch. Off = saved, hidden.
- 04 Crew: linked members and pets, UNLINK, invite by name/@handle (creates a pending reference; renders only when mutual). "Not on TLL yet? Name them in the story byline instead."
- 05 Pets: link to /my-pets; count from the pet's own map.
- 06 Contact: Relay form / Instagram DM / Show my email / No contact, one explanation line each.
- 07 Lists: three switches for /expats /creators /press with "learn more" links; press shows "VERIFIED · {editor}, {date}" or "REVIEWED WITHIN 48 HOURS" (directory applications keep the 48-hour line).
- 08 Who sees: Public / Unlisted / Off, plus "Show ranges instead of exact counts".
- Preview card on the right mirrors name (per credit-mode), one line, flags, stats from the snapshot, link count, contact state. "View as visitor" opens the public URL.
- No fields for: country count, continent count, story count, current location, Trip Ledger. All removed.

## 7 · Your pursuits (Edit profile · 05B)
Reference: `TLL Pursuit Hub.dc.html` → Profile pursuits. Ships with the Pursuit Hub; build the fields now so the section can be added without a migration.
- One switch per Pursuits item (Dog Travel, Trekking, Marathons, Foodie). ON adds the reference to `pursuits` and expands a links panel for that hub.
- Per-hub links reuse the `link-*` fields; the hub shows only the platforms relevant to it (dog: instagram, youtube, strava, komoot; trek: alltrails, strava, komoot, garmin, instagram, youtube; marathons: strava, garmin, instagram, youtube; foodie: beli, instagram, youtube).
- Hub card shows photo, name, home-base, platform lettermarks (AT, ST, GA, KO, BE, IG, YT) until official logos are supplied. "Home base shows. Where you are right now never does."

## 8 · Sign-up flow (Memberstack)
- Minimum age 16 (checkbox, ruling 2026-09-28). No phone, no address.
- Fields at sign-up: name, email, password, photo (optional), one line (optional). Everything else later on /edit-profile.
- After sign-up: land on /account with the banner "Your page is live at /contributors/{slug}. Add a line or a photo whenever." Three doors (trip / photo / map) as in Account v4.
- Email: one welcome with the profile link and the /submit link. No "pending approval" wording anywhere.

## 9 · Copy table (final)
| Where | Copy |
|---|---|
| Profile, no stories (visitor) | {First} has not written one yet. |
| Profile, no stories (owner) | {First} has not written one yet. · Write your first → |
| Profile contact note, relay | Opens their chosen channel or the relay form. Nobody's email is shown until they reply. |
| Profile contact note, email | Email shown by their choice. |
| Profile map meta | FROM THE MAP · UPDATED WHEN {FIRST} SAVES IT |
| Profile footer | HOSTED OR GIFTED TRAVEL IS LABELED AT THE TOP OF EVERY STORY · REPORT THIS PROFILE |
| Edit profile intro | Your page is public from the day you sign up. Everything saves as you type. Leave anything blank; a short profile is a normal profile. |
| Bio count note | That looks like a country count in your bio. It will go out of date; the live number already sits next to your name. Keep it if you like. |
| Pen name note | Your real name stays on file with the editor and is never shown. Every byline is still a real person. |
| Travelers intro | Every member has a page from the day they sign up. Filter by what they can help with: a city they live in, work they make, or a press card. |
| Travelers footer | SHUFFLED, NEVER RANKED, NEVER PAID · WHERE THEY KNOW, NOT WHERE THEY ARE |
| Travelers open slot (Everyone) | Your name here. Sign up and your page is live, story or no story. One story gets you a byline that stays yours. · Join the Travelers → |
| Account banner after sign-up | Your page is live at /contributors/{slug}. Add a line or a photo whenever. |

## 10 · Backfill
- Nancy: `one-line` "Founder and editor. Abroad since 2018, speaks English, Danish and Portuguese.", `home-base` "Copenhagen, Denmark", `from-lived` us,br,vn,dk, `languages` English, Danish, Portuguese, `contact-mode` email, `public-email` her choice, `badge` "FOUNDER · EDITOR", links instagram + youtube + thebrandcollective.co on. Bio: move any count out of the text.
- Jay: `one-line` "Seven marathons on seven continents. Never crosses the line first." (from his live page), `home-base` "Copenhagen, Denmark", `from-lived` us,br,vn,dk, `badge` "FOUNDING 02", `contact-mode` relay, no links. `author` on "Even Brave Boys Get Scared"; `co-travelers` on Patagonia, Antarctica, Camino, Seven continents if he agrees.
- Magnus: `shared-with` Jay.
- Every other member: `visibility` public, `contact-mode` relay, `credit-mode` full. Nothing else guessed.

## 11 · Needs Nancy before code
- Packet 3.5: visitors see the country number (recommended) or not.
- The `map-snapshot` JSON field vs. five number fields. JSON is one write and one read; five fields are filterable in Webflow. Recommend JSON unless she wants to sort Travelers by count (she has said never ranked, so JSON).
- Keep or delete the old typed count fields after backfill.

## 12 · Verification
For each of Jay (thin) and Nancy (full), at desktop and 390px: section order, every hide-when-empty condition, byline per credit-mode (full / first / pen), contact button per mode, visibility per setting, link targets open in a new tab, focus order through the edit form, autosave status line, counts equal to the map editor's own numbers after a save. List every difference from the prototype and what was done about it in STATUS.
