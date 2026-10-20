# Change log for approval: Packet C, profiles (20 October 2026, prototype 3.2 Profile v2, Travelers v2, Edit profile v2)

Source: HANDOFF-PROFILES-2026-10-19.md (sections 0 to 12), the three v3.2 screens in handoff/claude-design-source/v3.2-screens/, COUNT-RULES.md, STANDING-RULINGS.md and the README update of 19 October (the /travelers contrast note). Nothing in this log is built. Counts bind to tllStates through the map snapshot; nothing typed. Never touch data-ms-* elements, Memberstack blocks, legal wording or a member's own text. Publish only on your word.

Today, for the record:
- The public profile template (6a0b29c8a7b1840afe9390ab, /contributors/{slug}) has four sections: a dark hero with the photo, badges, the name and a stat strip that prints the typed Country count (Jay's reads 0), then "Trust me with a flight delay because…" and "One strong opinion", then "Find them elsewhere" with eleven platform rows (LinkedIn to Press kit, the empty ones still listed), then "Stories by this traveler". The byline link on stories went to the contributor page in Packet A.
- /travelers (6a0e0632ef1e4948167e827c) is five script-built sections: The founder (Nancy's card), the roster of luggage-tag cards (the avatar was added on 20 October, S95), The location experts with "Lisbon desk open" and "Claim your city", The Pros · Press with "First press byline, open" and "Apply as press", Travel companions with Magnus, then the "Your spot is still empty" band. The filter chips are 11px and the card meta is grey on dark at about 3:1.
- /edit-profile (6a0df371cd5b09ac504421ae) is one Memberstack form: name, fun title, home base, two bios, the typed counts (countries, cities, states, national parks, continents marathoned), eleven link fields, four "available for" switches, a newsletter switch, and "Designations · apply, a human reviews within 48h" (Location Expert, Press, Blog on the Wire). It saves on a button. Signed out it shows "Sign in to tell us who you are."
- Contributors already has the Profile v2 fields from 19 October (S86): one-line, home-base (named Location), from-and-lived-in, languages, credit-mode, pen-name, contact-mode, Public email, visibility, share-ranges, map-snapshot, crew, badge-label, the ten platform links and links-shown. The typed fields are still there: country-count, cities-count, states-count, continents-marathoned, published-count, visited-countries, currently-in, fun-title, pronouns, trust-me-quote, strong-opinion, traveler-category. Pets has shared-with. There is no Pursuits collection.
- The member webhook route exists in the repo (src/profile-sync.js, "member.created and member.updated") but is not deployed, and its field map still copies the typed counts.
- No page writes map-snapshot yet. The /account one-count function (S94) reads tllStates in the browser; the public profile cannot read tllStates, so a visitor today sees the typed snapshot or nothing.

## C1 Counts: one snapshot, three readers

| # | Change |
|---|---|
| C1.1 | The map editor (/the-map) writes map-snapshot on every successful save, and only then: `{"countries":n,"antarctica":true|false,"places":n,"layovers":n,"storiesBy":n,"savedAt":"ISO"}` using the S94 count function (places are Lived or Stayed with Antarctica counted; countries the same set without it; layovers airside only). The write goes through a new Worker route `POST /map-snapshot` on the approved Cloudflare Worker (Memberstack token verified server-side, the member's own item only, 30 writes per member per hour); the browser never holds a Webflow token. |
| C1.2 | The public profile, the Travelers card and /account read that snapshot. No page computes its own number. Empty snapshot: the profile shows STORIES only, never a zero. |
| C1.3 | share-ranges on: "80-something" instead of 87, "+ Antarctica" kept. |
| C1.4 | The typed count fields (country-count, cities-count, states-count, continents-marathoned, published-count, visited-countries) stop rendering anywhere. The data stays until you say delete (open question 3). |

## C2 Public profile template (/contributors/{slug})

| # | Change |
|---|---|
| C2.1 | Hero: photo 4:5 at 1:1 crop with `object-position: center` (fixes Jay's salt-flat sliver, P4; initials on ink when no photo), one editor badge top-left from badge-label when set, eyebrow `TRAVELER · {SLUG}`, H1 Playfair 800 with the last name in italic rose, one-line under it when set. Meta row: home base · `ON TLL SINCE {year of Member since}` · circle flags from from-and-lived-in (group hidden when empty). |
| C2.2 | Stat strip from map-snapshot: `{countries} +AQ` COUNTRIES (the +AQ only when antarctica is true), `{places} / 249` PLACES, `{n}` STORY or STORIES (from the Stories list, see C2.5), `+{layovers}` LAYOVERS hidden at 0. Visitors see the country number (your 19 October lean, open question 1). |
| C2.3 | Buttons: Get in touch per contact-mode (Relay opens the relay form, Instagram opens the DM, Email shows `name [at] domain` in text plus a real mailto, Off hides the button); one outline button per link that is filled and switched on in links-shown (empty links-shown means every filled link shows, as the field help says); "Edit profile →" for the owner only (Memberstack id matches). Links open in a new tab with rel="noopener". Under the row one line: "Opens their chosen channel or the relay form. Nobody's email is shown until they reply." or "Email shown by their choice." |
| C2.4 | About: Bio long as paragraphs, hidden when empty. The "Trust me with a flight delay" and "One strong opinion" blocks leave the template (the fields stay). |
| C2.5 | "Stories by {First}, or with {First}": the nested list of Stories where Contributor is the current member or Human co-travelers contains them, newest first. Card: 4:3 hero (ink and the place name when none), country eyebrow, "· WITH {FIRST}" when the member is a co-traveler, title, pillar · read time. Meta "{n} STORIES · NEWEST FIRST". Empty: a dashed box "{First} has not written one yet." plus "Write your first →" for the owner only. Webflow allows one nested list per page; this is it. |
| C2.6 | "Travels with": Pets where Owner is the member or Shared with contains them (a page-level list filtered by reference). Ink card, the pet's line, "{n} places" from the pet's own count. Hidden when none. |
| C2.7 | "Where {First} has been": the map in public mode, read only, from the member's saved map, with the meta "FROM THE MAP · UPDATED WHEN {FIRST} SAVES IT". Hidden when no snapshot. Depends on a public read of the member's map (C1.1 writes the snapshot; the map itself needs the /the-map page to accept `?member={slug}&embed=1` and read a published copy). If that public read is not ready in this packet, the section stays hidden and the home dashboard keeps the story-coverage map (Packet B deviation). |
| C2.8 | Footer line: "HOSTED OR GIFTED TRAVEL IS LABELED AT THE TOP OF EVERY STORY · REPORT THIS PROFILE" (mailto to the editor with the slug prefilled). The "Find them elsewhere" platform list with its empty rows is gone. |
| C2.9 | visibility: Public indexed; Unlisted adds `<meta name="robots" content="noindex">`; Off redirects visitors to /travelers while the owner still sees the page with a banner. Bylines render in every case. |
| C2.10 | Person JSON-LD in the template head: name per credit-mode, url, image, homeLocation from home base, sameAs from the links that are on. No email. |
| C2.11 | Every byline on the site reads credit-mode: Full, First, or Pen name (real name never rendered). The story template sign-off and author row from Packet A follow it. |

## C3 /travelers (Travelers v2)

| # | Change |
|---|---|
| C3.1 | One collection list of Contributors where visibility is Public, shuffled (Webflow random sort, re-seeded daily), never ranked, never paid. The five hand-built sections (founder, experts, press, companions, the empty band) go. |
| C3.2 | Card on cream: photo 4:5 (initials when none), one label top-left (badge-label when set, else TRAVELER), name, one-line, home base plus flags, two numbers from map-snapshot (COUNTRIES, STORIES; hidden when the snapshot is empty). Pets from the Pets collection (Is public on) after the people, each with a PET tag and "{n} places". |
| C3.3 | Filters as chips with counts in the label: Everyone · Live there · Make things · Press · Pets, driven by the directory switches (expats, creators, press) and `?list=`, client-side show and hide on the same page. No new pages. |
| C3.4 | One open-slot card whose copy changes per filter (Everyone: "Your name here. Sign up and your page is live, story or no story. One story gets you a byline that stays yours. · Join the Travelers →"; the other four from the prototype's open map). |
| C3.5 | Intro: "Every member has a page from the day they sign up. Filter by what they can help with: a city they live in, work they make, or a press card." Headline cycles are / live / photograph / were. Footer line "SHUFFLED, NEVER RANKED, NEVER PAID · WHERE THEY KNOW, NOT WHERE THEY ARE" and "PR TEAMS: SHARE A PRESS TRIP →" to /for-press. |
| C3.6 | Contrast and floors per the README note: cream surface, meta #6B6660 (5.8:1), body #3a3a3a, 12px floor, 44px chips. |

## C4 /edit-profile (Edit profile v2)

| # | Change |
|---|---|
| C4.1 | Memberstack-gated two-column page: the form on the left, a sticky preview card on the right (stacked under 900px). Intro: "Your page is public from the day you sign up. Everything saves as you type. Leave anything blank; a short profile is a normal profile." |
| C4.2 | Saves as you type: a debounced write through the Worker (the deployed member-updated route, field map rewritten to the Profile v2 fields, typed counts dropped) to the member's Contributors item, then the item is published. Status line "SAVED n S AGO · LIVE" or "ALL CHANGES SAVE AS YOU TYPE". No Save button. The Memberstack form itself keeps its data-ms-* fields; new fields are added beside them, not inside existing Memberstack blocks. |
| C4.3 | Section chips 01 WHO · 02 ABOUT · 03 LINKS · 04 CREW · 05 PETS · 06 CONTACT · 07 LISTS · 08 WHO SEES, anchors with a teal dot when the section has content. |
| C4.4 | 01 Who: photo, name, Shown as (full, first, pen plus pen name with the note "Your real name stays on file with the editor and is never shown. Every byline is still a real person."), one line (90 max with a counter), home base, From and has lived in (country chips, type and Enter, max 5), languages (chips). |
| C4.5 | 02 About: bio. If it matches two or three digits before "countries" or "places", the soft note "That looks like a country count in your bio. It will go out of date; the live number already sits next to your name. Keep it if you like." Never blocks. |
| C4.6 | 03 Links: one row per platform (instagram, youtube, website, tiktok, substack, strava, alltrails, komoot, garmin, beli), URL plus ON or OFF; off is saved and hidden (links-shown). LinkedIn, X, Threads, Vimeo and Press kit stay as fields but leave the form. |
| C4.7 | 04 Crew: linked members (crew, renders only when mutual), UNLINK, invite by name; "Not on TLL yet? Name them in the story byline instead." 05 Pets: link to /my-pets. 06 Contact: Relay form, Instagram DM, Show my email, No contact, one line each. 07 Lists: three switches for /expats, /creators, /press with "learn more"; press shows "VERIFIED · {editor}, {date}" or "REVIEWED WITHIN 48 HOURS" (directory applications keep the 48-hour line). 08 Who sees: Public, Unlisted, Off, plus "Show ranges instead of exact counts". |
| C4.8 | Gone from the form: country count, cities, states, national parks, continents marathoned, fun title, current location, the four "available for" switches and "Blog on the Wire". The preview card mirrors name per credit-mode, one line, flags, snapshot numbers, link count and contact state; "View as visitor" opens the public URL. |

## C5 Live bugs closed by this packet

| # | Change |
|---|---|
| C5.1 | P1: the member.created webhook creates the Contributors item (name, slug from the name with a collision suffix, photo if given, visibility Public, contact-mode Relay, credit-mode Full) and publishes it, so a profile is live within a minute of sign-up. Needs the Worker deployed and the Memberstack webhook pointed at it (your clicks, with the PROFILE_HOOK_TOKEN secret you set). |
| C5.2 | P3: every profile section hides when empty; no "0 countries", no "no links shared yet". |
| C5.3 | P4, P5, P6 as in C2.1, C3 and C1.4. P2 (submit holds the story) is Packet D. |

## C6 CMS and backfill

| # | Change |
|---|---|
| C6.1 | Rename the Contributors field Location to Home base (slug home-base stays). No new Contributors fields: the 19 October set covers Profile v2 (crew carries the mutual links; pursuits waits for C7). |
| C6.2 | Backfill Nancy: one-line, home base, from-and-lived-in us,br,vn,dk, languages, contact-mode Email with the public email you choose, badge-label FOUNDER · EDITOR, links-shown instagram,youtube,website; the "88 countries" and "464 cities" lines move out of Bio long into the live numbers. Jay: one-line "Seven marathons on seven continents. Never crosses the line first.", home base, flags, badge-label FOUNDING 02, contact Relay; Human co-travelers on Patagonia, Antarctica, Camino and Seven continents if he agrees. Magnus: shared-with Jay. Barzy, Chesney: visibility Public, contact Relay, credit Full, nothing else guessed. |
| C6.3 | Profile v2 fields that Memberstack must also hold (so sign-up and the form can write them): one-line, home-base, from-and-lived-in, languages, credit-mode, pen-name, contact-mode, visibility, share-ranges, links-shown, and the four new link URLs. Created in Memberstack as custom fields (your click, or the MCP). |

## C7 Pursuits (fields now, pages later)

| # | Change |
|---|---|
| C7.1 | A Pursuits collection (Dog Travel, Trekking, Marathons, Foodie) and a Contributors multi-reference `pursuits`, opt-in per hub. The edit form gets section 05B with one switch per pursuit and the per-hub link rows (dog: instagram, youtube, strava, komoot; trek: alltrails, strava, komoot, garmin, instagram, youtube; marathons: strava, garmin, instagram, youtube; foodie: beli, instagram, youtube). Hub pages are not in this packet. Contributors is at 50 custom fields; this adds one. |

## C8 Sign-up (Memberstack, your clicks)

| # | Change |
|---|---|
| C8.1 | Sign-up fields: name, email, password, photo (optional), one line (optional), minimum age 16 checkbox. No phone, no address. After sign-up land on /account with the banner "Your page is live at /contributors/{slug}. Add a line or a photo whenever." One welcome email with the profile link and the /submit link; no "pending approval" wording. The Memberstack form changes are yours; I write the banner and the account copy. |

## Test report with this packet

Jay (thin) and Nancy (full) at 1440 and 390: section order, every hide-when-empty condition, byline per credit-mode, contact button per mode, visibility per setting, link targets, focus order through the form, the autosave status line, and the counts on the profile, the Travelers card and /account all equal to the map editor's own numbers after one save. Every difference from the prototype listed in STATUS.

## Open for you

1. Visitors see the country number (recommended) or only members do.
2. The snapshot as one JSON field (recommended, one write and one read) or five number fields.
3. Delete the typed count fields after the backfill, or keep them hidden.
4. Your public email for the Email contact mode, and whether Barzy's and Chesney's profiles stay Public before they reply to the consent note.
5. C2.7: build the public map read in this packet, or hide the section until Packet D.

Reply with the line numbers to approve or change. Packet D (Submit v4) gets its own log after this one.
