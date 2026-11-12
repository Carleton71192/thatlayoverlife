# City guides and the Local Expert bench: Step 0 report

For Nancy. 12 November 2026. Look-only audit: nothing on the site, in Memberstack, Notion, Drive, the repo or Cloudflare was changed, published or deployed.

## Short version

1. Nothing for city pages exists yet. /copenhagen, /cities, /airports and /cph all answer 404. Today's Copenhagen guide is one Layovers item, live since 23 Sep, with 28 facts and no source on any of them.
2. The site is at 40 of 40 collections. The plan needs 7 new ones. I propose 4 renames of empty collections (yours to do in the Designer) and fitting the rest into collections that already exist. Cost: $0.
3. Stories and Contributors are full (60 of 60 fields), so the story tags go on Story extras.
4. Votes cannot live in the CMS or in KV. They need a small free Cloudflare D1 database that you create and deploy from your Mac.
5. /copenhagen at the root works, but only as one hand-built page per city. A CMS template cannot sit at the root.
6. Flows v2 (money question, live-then-flag, Notion "TLL Flags") is not built, and its prompt is not in the repo. Member picks depend on it.
7. Four of the seven background documents are missing, including build principles v1.1, which holds the stand-in photo rule.
8. Copenhagen has 1 member with "Live there" switched on: you. "Picked by N locals" and the expert bench start at one person.
9. The canvas differs from the prompt, your 12 Nov decisions or the site in 18 places (URLs, "Still good", autoplay clip, CPH status box and others). Section 5 lists them.
10. 18 questions at the end. The 7 marked "before Phase 1" are the ones that block work.

About the request "Deploy the worker": I did not deploy. This step is look-only, and this session has no Cloudflare login (no ~/.wrangler; ~/.config/.wrangler holds only logs and metrics, and its 12 Nov 10:37 UTC log shows `wrangler whoami` answering "You are not" logged in; no Cloudflare variables; checked 12 Nov). A deploy of today's repo would also put the photo hold live, which you asked to release only on your word (handoff/CHANGE-LOG-FIELD-5-2026-11-12.md line 30). The Worker code in the repo has not changed since that note: src/index.js, src/intake.js and wrangler.toml are identical at e2ba55e and at today's HEAD d6bfb74 (git diff, 12 Nov).

## How to read the evidence

Six readers looked at the site on 12 Nov. Their findings.md files could not be saved (the harness refused the writes), so their full reports exist only as returned text. I cite them by name:

- [webflow]: Webflow MCP reads and live pages. Working files: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/webflow/notes-schema.md (every field of all 40 collections), pages-list.txt, html/ (27 pages, the sitemap and webflow.com/pricing).
- [members-server]: Memberstack reads, the Worker source and four live Worker GETs. Working file: .../cities/members-server/intake-9c66514.js.
- [docs-design]: background documents and the design canvas. Working files: .../cities/docs-design/canvas/.
- [cph-content]: Copenhagen facts, Nancy's three Notion guides, stories and members. Working files: .../cities/cph-content/html/ and stories/.
- [slugs]: URL clashes, redirects and root-page options. Report: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs-final.md.
- [events]: Copenhagen event sources. Report: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-events-final.md.
- [pricing]: my own read of the saved copy of https://webflow.com/pricing (fetched 12 Nov), .../cities/webflow/html/pricing.html.

"Inferred" marks what I concluded rather than read.

## 1. What exists, item by item (prompt "How to work", point 1)

### 1a. The /layovers template, its collection and fields
- Hub page /layovers (page 6af30dd790b8264ba30602cb) is published. Its one list renders 2 cards, and the card links are set by script because the link block serves href "#" [webflow].
- Template page "Layovers Template", page 6a0b29deafd5d6fd115e444a, published [webflow].
- Collection Layovers, id 6a0b29cdafd5d6fd115e3d24, 7 items, 18 custom fields [webflow]:
  - Required: city (Plain text), airport-code (Plain text), country (Reference to Destinations), time-window (Option: 3h, 6h, 9h, 12h+), hero-image (Image), walk-through (Rich text), practical (Rich text), last-updated (Date), author (Reference to Contributors), seo-title, seo-description.
  - Optional: quick-answers, cab-cost, metro-option, best-in-airport-food (all Plain text), map-url (Link), difficulty (Option), photo-gallery (Multi-image).
- Template SEO today [webflow]: og:type "website"; JSON-LD (Article plus BreadcrumbList) lives in the template head code; the Article has no author and no datePublished; each guide serves two og:image tags; the breadcrumb's second step, /pillars/layover-guides, answers 200 but is not in the sitemap.

### 1b. Duplicate layover slugs
- Copenhagen exists twice [webflow, cph-content]:
  - cph-copenhagen-6h, item 6a0d456a52226bf74e926bcd: published 23 Sep 2026, in the sitemap.
  - copenhagen-cph-6-hour-layover, item 6a0cc4edbc899c771bd0c0cc: draft, never published, not archived; the URL answers 404. It has older facts (metro 30 DKK, 13 min, against 36 DKK, 14 min on the live page).
- The sitemap (139 URLs) holds only the published one, so "remove duplicate layover slugs from the sitemap" is already true today [webflow, slugs]. What is left is deciding what to do with the draft item.
- A third near-duplicate: the draft static page /copenhagen-stopover (page 6abbdbbadcc11e6928b4481c, title "The Copenhagen stopover, with or without a dog"), 404 today [webflow, slugs].
- The other layover items: sof-sofia-3h is live; ams-amsterdam-6h, doh-doha-9h, ist-istanbul-9h and nrt-tokyo-12h are archived drafts [webflow].

### 1c. Stories, Countries, and any Places or Events collection
- Stories, id 6a0b29eddc14f1444e935760: 63 items (57 in the sitemap), 60 of 60 custom fields, 3 references and 5 multi-references. It has a city field (Plain text, filled on 3 of 63), no place field and no duration field [webflow].
  - Copenhagen in stories: 16 published and 4 draft stories mention Copenhagen or Denmark; 1 published story is set in Denmark (sort-sol-black-sun-denmark); none is set in Copenhagen itself [cph-content].
- Two country collections exist side by side [webflow, slugs]:
  - Destinations, id 6a0b29c702602326705dcfb1, 198 items. Layovers, Marathons, Magnus Diary, Visits, Pets and others point here.
  - Countries, id 6a8afbd98e907b41c4da109b, 197 items, 52 fields, no image and no city field. This is the live country hub (/countries/denmark). Stories.countries, Resources, Expat Groups and Directory point here.
  - 13 slugs exist in only one of the two (for example turkiye against turkey) [slugs].
- /countries/denmark (item 6a8afc5dbbe4ec84f69815fe) shows both layover cards (Copenhagen and Sofia, href "#"), 4 resource rows and 1 directory row; lists are filtered in the browser by script, not by Webflow [webflow, cph-content].
- No Places, Events, Cities or Media collection exists [webflow].
  - Naming trap: the older Worker folder calls Destinations "PLACES_COLLECTION" and serves it at GET /places (worker/wrangler.toml line 21) [slugs]. That folder (tll-worker) was never deployed as far as the lock log shows [members-server].
- Patterns already on the site that the build can reuse [webflow]:
  - Freshness: Resources (checked-on, checked-by) and Countries (advisory-checked, fcdo-reviewed, data-checked).
  - Index threshold set by the Worker: Pursuits.indexable (6 live stories from 3 writers plus an intro). Countries already serves only 49 of 197 items in the sitemap.
  - Expert-like records: Pros (0 items) with link-rel switches; Directory (1 item) with knows (countries) and tags.

### 1d. Expat profile fields already live in Memberstack
App app_cmpdpi625001s0slnhgz17hgs, 83 custom fields, all private; the API does not return field types [members-server].

| The prompt asks for | What exists | Where |
|---|---|---|
| "I live abroad" | is-expat; list-expats (the "Live there" switch on /travelers) | Memberstack; list-expats also copied to Contributors |
| Home base | home-base, lives-country, lives-city, lives-years | Memberstack; home-base also on Contributors |
| "Places I know well" | knows (free text, 160 characters) inside the desks JSON on Contributors, up to 20 country entries; a separate older Memberstack field knows ("countries + years") | Webflow Contributors.desks; Memberstack |
| Interests | tags, "Interest tags (max 5)", from the Interest Tags collection (26 tags) | Memberstack; Directory.tags |
| Links | 7 link fields with on/off switches, 13 URL fields, links-shown | Memberstack; URLs copied to Contributors |
| Show home base, open to coffee | showHomeBase and coffee in Worker KV (album:<id>) | Worker KV |

Missing for this build: cities known at city level, specialties (up to 3), Local Expert status and "since" date, the followed-link switch, a business flag [members-server].

Members: 8 (one free plan, "Traveler"), member cap 1,000 [members-server]. Members with "Live there" on and a Denmark home base: 1, your own profile (Webflow copy of profiles) [cph-content].

### 1e. The server function from Flows v2, and its status
- The only deployed server function is the Worker tll-travel-wire (live version 4ff59e28, deployed 12 Nov 09:28 UTC) [members-server]. This must be "the same one Flows v2 uses" (inferred: no other function exists).
- Its store: one KV namespace (WIRE_KV). No D1, R2, Durable Objects or Queues. One cron, every 30 minutes [members-server].
- Flows v2 itself is not built: no money question, no live-then-flag, no held-from-feeds state, no Notion call and no auto-checks for affiliate links or codes. Since 11 Nov, stories and link-outs are saved as drafts "In Review", which is the opposite of live-then-flag [members-server].
- Votes, "Crew Approved", "Closed or changed" and flags: none exist anywhere (no route, key, field or table) [members-server].
- Helpful pieces that exist: GET /link-preview (fetches a link's title, image and description, the "paste a link" step of a pick), member-token checks on every POST route, and rate limits [members-server].
- Live photo path today: a photo sent on /submit is created as a published Photo submissions item at once; the hold that fixes this is in the repo but not deployed [members-server].

### 1f. Webflow plan limits
The plan name is not returned by the API [webflow]. The figures below match Premium on the pricing page (40 collections) [pricing]; inferred that the site is on Premium or the older CMS plan.

| Limit | Site today | Limit and source |
|---|---|---|
| CMS collections | 40 | 40 on Premium; 100 on Team [pricing] |
| CMS items | 801, drafts and archived included | 20,000 on Premium [pricing] |
| Fields per collection | Stories 60, Contributors 60, Countries 52, Pets 40 | 60 below Team (search summary [webflow]); 100 on Team [pricing] |
| Reference fields per collection | Stories 8 (the most) | 10 below Team (search summary [webflow]); 20 on Team [pricing] |
| Static pages | 56 (32 published, 24 drafts) | 300 on Premium [pricing, slugs] |
| Items per collection list | up to 4 rendered today | 100 without pagination (search summary [webflow]) |
| Nested lists | not used | sources disagree; check in the Designer [webflow] |
| Filter a list by "current item" | not used | only on a template page, and only on a field that points at that template's collection [webflow] |
| Localization | none | Localize add-on, $9 or $29 a month [pricing]; not needed |
| CMS API | not measured | 120 requests a minute on Premium [pricing] |
| Redirect API | not available | 403 "not_enterprise_plan_site"; a CSV import replaces the whole table [slugs] |

### 1g. What the Layover Lounge stores per photo
- /gallery: 17 hard-coded tiles, each with only an image URL, a credit (initials plus place) and a region. No city, place, date, member or story link. None is from Denmark [webflow, cph-content].
- Photo submissions (id 6ad0840f0b87155745bb156d): 0 items, 36 fields; it has country and city as text, consents and moderation, but no place, no source type, no AI flag and no clip field [webflow].
- The Lounge plan adds 21 fields and reaches 57 of 60, or 51 after deleting the 6 never-written fields, which you approved (Lounge answer R2) (claude/tll-lounge-audit-2026-11-11.md section 6; claude/tll-lounge-answers-2026-11-12.md).

## 2. What is missing

1. Cities, Facts, Places, Picks, Experts, Events and Media structures (none exists) [webflow].
2. Any source or "last checked" date on the 28 Copenhagen facts [cph-content].
3. Official sources for CPH facts: none could be reached from this session (cph.dk, nyidanmark.dk, travel-europe.europa.eu and others blocked) [cph-content].
4. Facts that look out of date: "US, UK and EU passports walk in" (EES now applies), no ETIAS line; on the Sofia guide, "not Schengen" and prices in leva (inferred out of date: Bulgaria joined Schengen fully on 1 Jan 2025 and adopted the euro on 1 Jan 2026, per the reader's knowledge, not checked against a source) [cph-content, webflow].
5. The Flows v2 pipeline and its prompt file [members-server].
6. A vote store (D1) and a Notion integration [members-server].
7. City-level "cities I know well", specialties, expert status [members-server].
8. All 12 measurement events (0 of 12 exist; 30 other events exist) [members-server].
9. Copenhagen photos and clips: 0 Lounge photos from Denmark [cph-content].
10. A "Report this" form and a reasons email (DSA Art. 16 and 17), which the Flows v2 whiteboard puts in its Phase 6 [docs-design].
11. Four background documents (section 6).

## 3. The data model at 40 collections

### 3a. Slots

Today: 40 of 40 collections, 16 empty [webflow]. Of the 16:
- Already promised: Bookmarks to Guides (launch answer G0) and Photo submissions to Photos (Lounge answer 4).
- Held by the expat hub: Expat Groups (expat answer A).
- Written by the Worker: Pet Notes, Story extras, Press applications, Collection items, Pursuit stamps, Pros [webflow; claude/tll-run1-build-plan-2026-11-11.md line 107].
- Empty with no binding or plan found (7): Comments, Press Mentions, Partners, Trip Bundles, Submissions, Award Nominations, Press Trips [webflow].
  - Caveat: the Run 1 plan says Trip Bundles has a list on the story template (line 107); the API cannot show bindings, so this needs one look in the Designer [webflow].
  - Submissions, Award Nominations and Press Trips each have a draft page (/editors-desk, /awards, /press-trips), and the last two have Webflow forms, so they are the last choices (claude/tll-expat-hub-step0-2026-11-11.md lines 261 to 264).
  - Comments is doubly free: member comments already have a Memberstack data table, story_comments (0 records) [members-server].

The tools can add and delete fields but cannot rename or delete a collection, and could not set a template page to draft (claude/tll-run1-build-plan-2026-11-11.md lines 90 and 96). So each repurpose below needs you in the Designer: collection name, collection URL, and the template page's Draft switch where noted. About one minute each (same steps as row G0, build plan line 340).

### 3b. Where each piece lives (recommended, Option A)

Field types are Webflow's names. "Worker" means the field is written by tll-travel-wire, never typed.

**Cities: repurpose Comments.** You rename it "Cities", collection URL "cities", and set its template page to Draft (the public page is the static /copenhagen, section 4). The 7 Comments fields are deleted.
- country: Reference to Countries (the live country hub; see question 13)
- airport-codes: Plain text ("CPH")
- h1-line, intro: Plain text
- hero-clip, hero-photo-1, hero-photo-2: Reference to Photos
- 7 tabs (under-3h, 3-to-6h, 6-to-12h, overnight, stopover, week, moving), each with verdict (Plain text), why (Plain text), steps (Rich text), link (Link): 28 fields. Tab labels are fixed in the page, not stored.
- expat-hub-link: Link (/move/denmark under expat answer 2)
- itineraries: Multi-reference to Layovers
- started-by: Reference to Contributors
- index-state: Option (Draft, Live noindex, Indexed), Worker
- page-owner: Plain text; next-check: Date; local-checkers, stand-ins-left: Number, Worker
- seo-title, seo-description: Plain text (copied to the static page by API, because static page SEO does not read the CMS [slugs])
- Total 45 custom fields, 6 references. Cost $0.

**Facts: repurpose Trip Bundles** (after the Designer check above; if it is bound, use Submissions). Rename "Facts", URL "facts", template Draft.
- city: Reference to Cities
- topic: Option (Entry, Transit, Getting to town, Bags, Lounges, Power and wifi, Pets, Status). "Getting to town" is not in the prompt's list, but the live page and the canvas both have that card (question 16).
- text: Plain text; source-url: Link; source-name: Plain text
- source-type: Option (Official, Press, Secondary, Weak)
- last-checked: Date; checked-by: Plain text (same as Resources)
- tier: Option (Weekly, Monthly, Quarterly); state: Option (OK, Being rechecked); due: Date, Worker; order: Number
- 12 custom fields, 1 reference. Cost $0.

**Places: repurpose Press Mentions.** Rename "Places", URL "places", template published (place pages live at /places/[slug]).
- city: Reference to Cities; country: Reference to Countries (the place-links add-on asks for it)
- type: Option (Eat, Drink, Bakery, Sight, Sauna, Stay, Shop, Service); zone: Option (Airside, In town, Day trip); terminal: Plain text
- minutes-from-gate: Number; opened: Date
- maps-url, official-site, instagram-url, tripadvisor-url, yelp-url, gyg-url: Link; google-place-id: Plain text; links-checked: Date. The place-links add-on's seven are country, maps-url, tripadvisor-url, yelp-url, gyg-url, google-place-id and links-checked (claude/tll-place-links-affiliate-prompt-2026-11-12.md line 42, which types maps_url as generated text); official-site and instagram-url come from this prompt's Places row.
- photo: Reference to Photos
- mentions, locals, crew-approved, closed-votes: Number, Worker
- status: Option (Live, Needs recheck, Removed); has-page: Switch, Worker (on at 2 mentions; off means noindex and out of the sitemap, as Countries does today)
- filter-tags: Plain text (brunch, street food, vegan; question 17)
- 23 custom fields, 3 references. Cost $0.

**Picks: repurpose Partners.** Rename "Picks", URL "picks", template Draft (picks show on city and place pages only).
- place: Reference to Places; city: Reference to Cities (a static page can filter on it)
- contributor: Reference to Contributors. Not the Memberstack id: the prompt's "member (Memberstack ID)" would put a private key in a public item. The Worker maps member to profile through its owner map [members-server].
- line: Plain text; source-url: Link; source-site: Plain text; photo: Reference to Photos
- vouch-only: Switch ("I vouch for this", no post of their own)
- money: Option (Self-funded, Sponsored, Hosted, Affiliate, Gift or code); brand-name: Plain text; brand-url: Link
- crew-approved, closed: Number, Worker, copied from the vote store
- status: Option (Live, Held from feeds, Needs recheck, Removed); created: Date
- 15 custom fields, 4 references. Cost $0.

**Experts: no collection.** Split across what exists:
- Memberstack, new text fields: specialties (up to 3 tag slugs from the member's own tags) and cities-known (city slugs). Two admin-only fields like club-supporter: expert-followed-link and business-account (yours alone). Reused: is-expat, list-expats, home-base, lives-years, tags, one-line, personal-website-url, instagram-url, visibility, credit-mode, pen-name [members-server].
- Directory (id 6abcd638b10dc7b4930f6410, 27 fields, 1 item), new fields: cities-known (Multi-reference to Cities), specialties (Multi-reference to Interest Tags), expert-status (Option: Member, Local Expert), expert-since (Date), live-picks (Number), followed-link (Switch), business (Switch), site-url (Link). 27 to 35 fields, 3 to 5 references. Status and dates are Worker-written, never member-writable. Cost $0.
- Alternative: Pros (0 items) already has their-site, trusted (ugc nofollow) and paid-or-hosted (sponsored). I prefer Directory because it already mirrors member profiles with city and tags (inferred fit).

**Events: extend Resources** (id 6abcd637bff19cda8e2426c5, 9 fields, 4 items). The expat hub already plans "events as Resources rows" (expat change log v2 section 5).
- Reused: type (Option, already has "Events"), url (the link), host (listed by), country (Reference to Countries, required), status.
- New: city (Reference to Cities), starts (Date), ends (Date), area (Plain text), minutes-from-airport (Number), badge (Option: Official, Community, Paid), language (Plain text, "In English").
- 9 to 16 fields, 1 to 2 references. Events are created and deleted by the weekly pull. Cost $0.
- Watch: /countries/denmark renders Resources rows filtered by script [webflow]; events must be kept off country pages by type.

**Media: extend Photos** (the renamed Photo submissions), in the same schema pass as the Lounge build.
- New: kind (Option: Photo, Clip), clip-url (Link, the member's own post), photo-source (Option: Member, TLL, Press library, Stock), city (Reference to Cities), places (Multi-reference to Places), ai-label (Switch).
- Reused: contributor-credit (credit text), contributor-profile (Reference to Contributors, the public link to the member, as on Picks), photo, caption. This build reads and writes no member id in Photos: the existing uploader-member-id field stays the Lounge build's internal field, is never bound to a page, and the member lookup stays in the Worker. Reason: the prompt says per-member data must not live in public CMS fields (prompt line 70), and the Photo submissions template page (6ad084100b87155745bb1573) is published today, held only by noindex and a redirect in its head code (claude/tll-lounge-audit-2026-11-11.md line 431).
- "Stand-in" is not stored: it is any photo whose source is not Member (inferred simplest rule).
- Fields: 51 after the R2 deletions, plus 6 = 57 of 60. References: 4 in the Lounge plan, plus 2 = 6. Cost $0: clips are link-outs, nothing is uploaded or stored.

**Stories additions: on Story extras**, because Stories is full [webflow]. Story extras (id 6ad997935f308b0209d358b8) is the one-to-one side collection made for exactly this.
- New: cities (Multi-reference to Cities), places (Multi-reference to Places), duration (Option: Hours, Overnight, Stopover, A week or more, Moving).
- 32 to 35 fields, 1 to 3 references. No Stories field is renamed.
- Why here: a place page can then list "Story extras whose places contain this place", which Webflow allows on the Places template [webflow]; the list shows the story's title and image through Story extras' story reference (inferred, check in the Designer).
- Itineraries stay in Layovers, plus: city-page (Reference to Cities), stops (Multi-reference to Places), stop-times (Plain text). 18 to 21 fields. Whether a multi-reference keeps its order on the page is not verified.

**Votes and per-member data: Cloudflare D1, behind the Worker.**
- Tables: votes (member_id, item_id, kind, created_at; one row per member per item) and picks-by-member for "My picks". Counts are copied to the Number fields above by the 30-minute cron [members-server].
- Why not the CMS: anything in a CMS field can end up in public page source, and the prompt forbids it. Why not KV: 1,000 writes a day on the free plan, already shared with the Wire, rate limits and metrics; no atomic counter; 1 write a second per key [members-server]. Why not member JSON: a member's own browser can write it [members-server].
- Steps that need you: create the database (one command), then deploy from your Mac.
- Cost: $0 on the free plan (5 million rows read and 100,000 rows written a day; limits from the reader's knowledge, not re-checked, because developers.cloudflare.com was blocked) [members-server].

**Notion "TLL Flags":** a Notion integration token as a Worker secret, one API call per row. No fee [members-server]. The database schema is unknown until the Flows v2 prompt is found [docs-design].

### 3c. Slot count after

| | Collections | Empty and unclaimed |
|---|---|---|
| Today | 40 | 7 (Comments, Press Mentions, Partners, Trip Bundles, Submissions, Award Nominations, Press Trips) |
| After Guides and Photos | 40 | 7 |
| After Option A (Cities, Facts, Places, Picks) | 40 | 3 (Submissions, Award Nominations, Press Trips) |
| After Option B (Cities, Places, Picks) | 40 | 4 (adds Trip Bundles) |

Nothing is created or deleted, so the site never drops to 39 and no other session can take a slot by accident (build plan line 105).

### 3d. The real trade the cap forces: Facts

- **Option A (recommended): Facts get their own collection** (Trip Bundles renamed). Facts have their own cycle (tier, due date, "Being rechecked", a draft and a Notion row on every change), and Copenhagen alone has 28. Keeping them apart from Resources keeps country pages and the /move/denmark lists clean. Leaves 3 spare slots, all with a draft page or form attached.
- **Option B: Facts become Resources rows** too (type "Fact", plus topic, text, source-type, tier, state fields: Resources grows to about 21 fields). Saves one slot for a later build. Costs: three kinds of rows in one collection, every list filtered by type, and the expat hub's Resources plan and this build editing the same collection at the same time.
- A Worker-only variant (Events or Facts in D1, shown by script) saves slots too, but the content would be missing from the page source, which breaks the no-JavaScript rule for the tabs and weakens Event and FAQ markup (inferred). Not recommended.

### 3e. Cost at today's usage

| Line | Price | Needed? |
|---|---|---|
| Webflow, current plan | unchanged (Premium is listed at $25 a month billed yearly [pricing]; your plan name is not readable) | yes, no change |
| Webflow Team, to get 100 collections | $2,500 a month, annual contract [pricing] | no |
| Cloudflare Workers and D1, free plan | $0 [members-server, limits unverified today] | yes |
| Workers Paid, only if Cloudflare starts enforcing the 10 ms CPU limit (the 30-minute run used 107 to 114 ms on 11 Nov) | $5 a month minimum (search summary [slugs]) | not now; watch |
| Notion API | $0 [members-server] | yes |
| Cloudflare R2 (file storage) | not needed: no uploads in this build | no |
| GuideDanmark events API | one-time DKK 5,000 excluding VAT (VisitDenmark page, via search) [events] | no |
| Google Places ID resolver (place-links add-on) | ID-only calls are free but need a Google Cloud billing account (claude/tll-place-links-affiliate-prompt-2026-11-12.md lines 44 and 93) | your call, later |
| Webflow Localize | $9 or $29 a month [pricing] | no |

Item count after Copenhagen (inferred estimate): 801 today plus about 1 city, 30 facts, 110 to 120 places, 110 to 150 picks, up to 40 events at a time and some photos, so roughly 1,150 of 20,000.

## 4. URL plan

The fixed point: a CMS template page always has two segments (/collection/item). It can never sit at the root. Only a static page or a redirect can answer at /copenhagen [slugs]. A published page and a redirect cannot share one path [slugs].

| Option | What Webflow needs | Good | Costs |
|---|---|---|---|
| **/copenhagen (decided 12 Nov)** | One static page per city, fed by its Cities item; the page's lists filtered to that city in the Designer. Cities template set to Draft. | Your decision; clean root URL | Each new city needs a page made (the API can duplicate a page; re-pointing the list filters is a Designer job, not verified) and its SEO fields synced by API. 56 of 300 static pages used [slugs, pricing] |
| /cities/copenhagen | The Cities template page, published. No folder. | Fully automatic Phase 5; one template | Reverses your decision; /copenhagen would only be a redirect |
| /airports/cph (canvas) | An "Airports" collection template, or a folder "airports" with one page per airport | Matches the canvas | Airport-first, against your 12 Nov decision; a folder cannot share a URL with a collection [slugs] |

Recommendation: keep /copenhagen as decided. Phase 5 still creates the draft Cities item and the Notion row automatically (the prompt's own wording); the static page is made when you approve the row. The airport is a section of the page at /copenhagen#airport.

- **Itineraries "under" the hub:** a page at the root cannot have child pages unless a folder of the same name exists, which is probably not allowed next to a page (not verified) [slugs]. So the 6-hour guide keeps its URL, /layovers/cph-copenhagen-6h, and its breadcrumb points to /copenhagen. No redirect needed. (Inferred safest; it has been indexed since September.)
- **A cross-cutting Webflow catch:** a list on a static page cannot filter by "current item". Each city page's lists are filtered to a fixed city, set once in the Designer [webflow].
- **Lists over 100 items:** Copenhagen may reach 110 to 120 places; a list shows 100 without pagination [webflow, cph-content]. Places show by tab and type, so no single list should reach 100 (inferred).

Redirects that would follow (listed, none applied). Imports must carry all 14 existing rows, because a CSV import replaces the table [slugs]:

| From | To | Why |
|---|---|---|
| /copenhagen-stopover | /copenhagen | Draft page on the same topic; a draft slug can take a redirect [slugs] |
| /layovers/copenhagen-cph-6-hour-layover | /copenhagen | Only if the draft item is deleted; it was never published, so optional |
| /cph | /copenhagen | Optional short link |
| /cities/copenhagen | /copenhagen | Only if the Cities template is ever published |
| /airports/cph | /copenhagen | Optional; the canvas URL was never live (404 today) |

Not redirected: /layovers/cph-copenhagen-6h (stays as the itinerary), /countries/denmark and /destinations/denmark (they link to /copenhagen).

Reserved slugs: the [slugs] report has a 9-group list (every path in use, Webflow and system paths, account and member words, admin and Worker words, legal pages, content hubs such as cities, places, picks, experts, airports, guides, photos, all country and state slugs, and ambiguous city names such as portland, santiago, valencia). No city slug clashes with a live path today; /copenhagen, /sofia, /istanbul, /tokyo and /singapore all answer 404 [slugs].

## 5. Conflicts and overlaps

### 5a. With the expat hub build
1. **Where "Moving here" goes.** The canvas uses /expats/copenhagen [docs-design]; your expat answer 2 put country guides at /move/[country], Denmark only. /expats is also a held draft slug [slugs]. Proposal: the tab links /move/denmark.
2. **Two names for experts.** The expat build keeps "Location Expert application" (expat answer E) and the 11 Nov prompt proposes an editor-only location-expert field [docs-design]. This prompt grants "Local Expert" automatically, with no editor. Two names and two rules for overlapping people (question 9).
3. **Two contribution rules.** Your expat note on answer 4 lets expats add to the country guide's lists, with a person reviewing before anything shows (expat change log v2 section 5). This prompt's picks go live at once and are flagged later. Proposal: keep both, by kind: places and picks live-then-flag; resources and groups reviewed first (question 11).
4. **Resources is shared.** Both builds add fields to Resources (the expat build a "lives there" switch, this one event fields). One combined change table.
5. **The Danish Diaries.** Expat answer 5 names it as a seed group; the expat change log finds it is one person's video account; this prompt forbids using "The Danish Diaries" Notion page because the picks belong to someone else (prompt line 79). It may be the same person (inferred). It was not opened [cph-content].
6. **Counts that point at one person.** With 1 "Live there" member in Denmark, "Picked by 1 local" or "1 expat keeps this page honest" names you. The expat change log already proposes hiding such labels until a count you set (section 5).

### 5b. With the Lounge build
1. Media lives in Photos, so this build waits for the Lounge's order: your Worker deploy with the photo hold, then your rename (Lounge answers, "What the build waits for").
2. Field room: 57 of 60 after both plans (section 3b). Any extra Lounge row of photos costs one field (Lounge audit section 6), so room is nearly gone.
3. Member strips: the canvas shows a public strip with an "Add yours" tile; the prompt says strips are member-only and hide when empty [docs-design].

### 5c. With the Guides plan
1. Bookmarks becomes Guides at /guides (paid guides, "Get the guide"). "City guide" is this build's working name. Two kinds of "guide" on one site (inferred risk of confusion). Proposal: call these "city pages" in nav and copy.
2. The slug "guides" is taken by the Guides collection.

### 5d. With the place-links add-on
- It adds 7 fields to Places (included above) and waits for Places. It refers to "claude/tll-city-guides-expert-bench-build-prompt-2026-11-12.md", a file name that does not exist; the add-on's own line 3 says that base prompt is saved as claude/tll-city-guides-local-experts-prompt-2026-11-12.md, this prompt.

### 5e. The canvas against the prompt, the decisions or the site (most serious first) [docs-design]
1. URLs /airports/cph, /airports/cph/6-hours, /places/..., /expats/copenhagen, a collection named "Airports" and an "Airports" nav item. Decided: /copenhagen, "Cities", city first. /airports/cph/6-hours cannot exist under a root page (section 4).
2. "Still good" in six places: four on the page board (a "2 still-good votes" line in section 04 and three vote buttons in section 07) and two on Under the hood. Decided: "Crew Approved".
3. Tabs are script buttons with no anchors and no URL per tab; the prompt needs real links that work without JavaScript. Under the hood says 5 tabs, the page and the prompt say 7.
4. "MEMBER CLIP ... muted autoplay" and uploaded clips. Decided: no uploads; a poster that loads the outside player on tap after consent.
5. "CPH status: normal operations" chip. Prompt: live status for US airports only.
6. "New" window: the page's section 04 lede says "the last 90 days" and then "older than six months"; Under the hood and the prompt say 180 days; the jump link reads "New this month".
7. A pick still shown with "2 closed votes". Prompt: 3 votes hide it.
8. Pick cards show "Nancy · Sept 2026" and Map, Website, Reviews links; the local truth rows show no credit. Prompt card: name, photo, "from [site name]", one line, "Read more on [site]", plus "Picked by N locals", the badge, the Business label.
9. Type filters (bakeries, brunch, street food, vegan) are not drawn, and three of them are not Places types (question 17).
10. Typed counts: "3 expats keep this page honest", "3 local checkers", vote numbers, "Mentions 6 places", "Mentioned in 4 TLL stories". Prompt rule 5: counts from live data only.
11. Fact cards with generic sources, one with no source and one with neither source nor date; "ETIAS date: verify" and "[VERIFY TIME]" visible.
12. Event cards with no link and no Paid example; "owned by Expat groups". Decided: pulled from sources you approve, each with source and link.
13. Bracketed placeholders (Overnight tab, sections 04, 05, 09) and open-slot cards ("Your CPH layover goes here", "Add yours"). Prompt rule 6: none in public.
14. Type and buttons: the canvas loads Syne 800 as a Google web font for the wordmark; Brand Kit v2.6 line 970 says Syne lives only inside the wordmark artwork and is not loaded as a web font. The canvas uses teal fill with ink text and rose fill with dark text. Build principles v1 says teal fill, ink text; Brand Kit v2.6 line 997 says #D63859 fill, white label, one filled button per group. The two rules disagree (question 7).
15. Text at 11px: the "Opened [month]" label in section 04 (rose Mono 11px). v1 section 8: 12px minimum. The saved canvas transcript does not record sizes for the reel labels or the STAND-IN pill, so those are not confirmed.
16. Trip kit says "We earn a commission..." but carries no per-link "Affiliate" label, which the place-links add-on requires (line 55).
17. No phone board (390 wide) and no states beyond tab selection (no signed-out, empty, loading, error, vote pressed).
18. "Done when" asks for the hero, the four cards and the first tab within one scroll at 390x844. The drawn order puts the member strip and the jump bar between the cards and the tabs; on a phone that is unlikely to fit (inferred). The strip being member-only helps.

What the site cannot do as drawn or written, beyond the canvas:
- Rotating picks per session, "Picked by N locals" grouping and bench depth ("12 locals on food") need script or Worker-written fields; without JavaScript the order is fixed (inferred).
- "Changing a Notion row applies it within a minute": the Worker's cron runs every 30 minutes [members-server]; a one-minute path needs a Notion webhook to the Worker (inferred, not verified).
- "Mentioned in N stories" cannot be counted by Webflow; the Worker writes it, as it does for Pursuits today [webflow].

## 6. The background documents

| Document the prompt names | Found? | Where, and what it means for the build |
|---|---|---|
| tll-build-principles-2026-10-31.md (v1.1) | v1 only | Drive "01 TLL Build Principles v1 (Oct 2026)", id 1vSKv-HBzkk-UzOb3iUXuRMhEQUhURfvzh5zWAMbgAFY. v1 has no section 13 and no stand-in rule; its section 5 says "Member photos first, no stock" [docs-design]. Until v1.1 arrives, stand-in photos have no written basis. |
| tll-user-flows-v2-build-prompt-2026-11-11.md | No (its whiteboard yes) | Whiteboard "TLL User Flows v2", https://claude.ai/artifact/6aCwEHTKgehA6yqyeEEysD, plus your 11 Nov answers in Notion (money question wording approved; new-account age 7 days; "Notion + email queue") [docs-design]. Phase numbers, the TLL Flags schema and the server details are unknown. |
| tll-ground-rules-storm-2026-11-11.md | No | Only a Notion task names it; its two open questions are "AI images (label or ban)" and "humor pieces" [docs-design]. The AI answer decides how Media's ai-label is used. |
| tll-layover-guides-top10-storm-2026-11-12.md | Yes, under another title | Claude Doc "Layover Guides: The World's 10 Busiest Airports", https://claude.ai/artifact/89jAQVX6FReaVeMtzLhVwg [docs-design]. The cph-content reader searched Drive and Notion and missed it, so the two readers disagree; docs-design found it in the artifact list. It defines the source tags (Official, Press, Secondary-pro, Weak, Verify) but has no Copenhagen entry and no per-fact date. CPH facts need fresh research. |
| tll-expats-step-by-step-build-prompt-2026-11-11.md | Yes, under another name (inferred) | /home/user/thatlayoverlife/claude/tll-expat-hub-step-by-step-prompt-2026-11-11.md [docs-design] |
| tll-expat-build-prompt-2026-10-12.md | Yes, inside a larger doc | reports/fix-pass-2026-10-12/sources/tll-community-strategy-expats-creators-press.md lines 133 to 212 [docs-design]. Its fixed interest list has 12 items; the Interest Tags collection has 26 (question 18). |
| tll-privacy-guardrails-2026-10-19.md | No | Not in the repo, Drive, Notion or the artifact list. Readable substitutes: build principles v1 section 10 and the 31 Oct expat value prompt rules 1 to 5 [docs-design]. |

Why so many are missing: the Drive build kit index says copies live in the Claude project "That Layover Life" (paths starting claude/), which this session cannot read; claude/README.md line 12 already lists two of them as "Referenced but not in the repo" [docs-design].

## 7. Risks

### Privacy
1. **Your three Notion guides carry private details.** Kind and count only [cph-content]:
   - The Epic Guide (61 named places): a friend's private home as a sauna spot (2), a friend family's name on a beach pick (1), a private Google Sheet link (1).
   - A Creative's Guide (55): your street name (3), lines that locate your home (7), a flight booking code (1), flight numbers with times (2), a guest's first name with her habits (15 mentions), your work schedule (2), your car and kayaks (4).
   - Vikings & Vagabonds (36 Copenhagen, 17 rest of Denmark, about 34 Sweden and Norway): your street (1), two private rentals named by host (about 8 mentions), 7 booking and access codes, 6 phone numbers, a business email, friends' and family details, and a possible minor named about 7 times.
   - Rule for seeding: the place, the type and your one line only; no date finer than the month (inferred safest).
2. **"Never where anyone is now" against "live at once".** A traveler's pick or photo posted on the day shows where they are. The canvas itself promises "nothing posted while the person is still there" [docs-design]. Proposal: for members whose home base is not that city, show picks and media without a date until a delay passes, or only after they mark the trip done (question 15, inferred rule).
3. **Member ids in public items.** Picks use a Contributors reference, not the Memberstack id (section 3b). Directory already holds member-id and contact fields, and its template page (6abcd638b10dc7b4930f6416) is published, not a draft; it must be checked in logged-out page source before expert cards read from it (inferred risk; the page source was not checked).
4. **Small numbers identify people** (section 5a item 6).
5. **The live photo path** still publishes a /submit photo at once until your Worker deploy [members-server].

### Money
- Target $0 holds with Option A. Paid lines appear only if you choose them: Team plan $2,500 a month, Workers Paid $5 a month, GuideDanmark DKK 5,000 once, a Google Cloud billing account (section 3e).

### Webflow limits
- 40 of 40 collections; every slot after Option A has something attached [webflow].
- Stories and Contributors full; Photos 57 of 60 after both plans [webflow; Lounge audit].
- One static page per city; 244 more fit under 300 [slugs, pricing].
- No redirect API; each import must include every existing row [slugs].
- Lists cap at 100 items; nested list limits unverified [webflow].
- 20,000 items: about 56 to 66 cities at Copenhagen's size would reach it, before photos (inferred: 291 to 341 items a city from the estimate in 3e, against 19,199 items left).
- The tools cannot rename collections or draft templates; those steps are yours.

### Memberstack limits
- Member cap 1,000 on the current app (memberCountLimit); 8 used [members-server]. "As large as possible" will meet it. The price of a larger plan was not read.
- Field types are not returned by the API; all values are text [members-server].
- Whether the count of 8 is the live or the sandbox environment could not be confirmed (getMemberstackEnvironment failed) [members-server].

### Cloudflare
- The 30-minute run used 107 to 114 ms of CPU on 11 Nov against a stated 10 ms free limit; Cloudflare did not stop it. Vote counting and the weekly fact and event jobs add to it [members-server].
- KV's 1,000 daily writes are already shared; votes must not go there [members-server].

### Legal and source terms
- Event pulls: Danish database protection (ophavsretsloven section 71) covers systematic copying; Tivoli forbids reproduction without written permission; KultuNaut needs a written agreement; Facebook bars automated collection. A written yes from each source is needed before the weekly pull [events].
- Copenhagen Media Center photos (stand-ins) may be used only to promote Copenhagen, with the photographer credited [events].
- Money labels follow Markedsføringsloven section 6, stk. 4, as cited on the Flows v2 whiteboard [docs-design].

### Content and search
- The current CPH page is indexed. Under the approved threshold (checked facts plus two stories or one Local Expert), /copenhagen would start noindex: 0 stories are set in Copenhagen [cph-content], and the only possible Local Expert today is you (inferred). If you count as the first Local Expert, the page can be indexed once facts are checked.
- Facts that look stale (section 2, item 4).

## 8. Questions for you, in one message

Before Phase 1 (these block work):

1. **Which collections do I build in?** a) Option A: you rename Comments to Cities, Press Mentions to Places, Partners to Picks, Trip Bundles to Facts (after one look that nothing is bound to Trip Bundles); b) Option B: three renames, and Facts go into Resources. Recommended: a.
2. **Flows v2 is not built. How do picks go live?** a) Copenhagen launches with your seeded picks only, member picks wait for the Flows v2 pipeline; b) member picks go to "In Review" drafts for now, like stories; c) build the Flows v2 pipeline first as Phase 0. Recommended: a, then c. Please also send the Flows v2 prompt file.
3. **The missing documents.** Please send build principles v1.1 (sections 5, 6 and 13), the Flows v2 prompt, the ground rules STORM and the privacy guardrails. Until v1.1 arrives, I use no stand-in photos. Recommended: yes.
4. **Root pages.** Confirm: /copenhagen is a hand-built static page fed by its Cities item, the Cities template stays Draft, and later cities get their page when you approve them in Notion. Recommended: yes.
5. **Votes.** May I plan a free Cloudflare D1 database for votes and "My picks" (you create it with one command and deploy from your Mac)? Recommended: yes.
6. **Facts sources.** This session cannot reach cph.dk, nyidanmark.dk, travel-europe.europa.eu, m.dk, dsb.dk or foedevarestyrelsen.dk. a) allow those hosts for the session; b) you check the sources yourself. Recommended: a.
7. **Buttons.** Build principles v1 says teal fill with ink text; Brand Kit v2.6 says #D63859 fill with a white label. Which one? Recommended: whichever v1.1 section 6 says; if it says nothing, Brand Kit v2.6, the newer document.

From your prompt (it lists four open items; line 38 records the other four as answered on 12 Nov):

8. **Business accounts as experts, with a "Business" label?** Recommended: not at launch; the For Brands and "Reklame for" path is not built yet. Revisit at ten experts.
9. **Expert bar: 3 or 5 live picks with photos plus a linked account?** Phase 3 of the prompt says 5; its open item 2 records Claude's recommendation of 3. Recommended: 3. And one name: "Local Expert" for the automatic status, with the application form keeping "Location Expert application" (your answer E), or rename the form to match? Recommended: one name, "Local Expert", everywhere.
10. **Clips as link-out posters that load on tap after consent?** Recommended: yes.
11. **Copenhagen event sources.** Recommended: International House Copenhagen, the Copenhagen Libraries API and Copenhagen Visitor Service, each after a written yes; no GuideDanmark fee; Tivoli and InterNations as plain links only [events]. Also: picks live-then-flag, resources and groups reviewed first. Recommended: yes.

Can wait until the phase that needs them:

12. **"Moving here"** links to /move/denmark (your expat answer 2), not /expats/copenhagen. Recommended: yes.
13. **City's country link:** Countries (the live hub) or Destinations (where Layovers point)? Recommended: Countries.
14. **The draft Copenhagen layover item and /copenhagen-stopover:** archive the item, redirect the draft page to /copenhagen. Recommended: yes.
15. **Dates on travelers' picks and media:** month only, and shown only after the trip for members who do not live in that city. Recommended: yes.
16. **Add a "Getting to town" fact topic** (metro, taxi), which the live page and the canvas both have. Recommended: yes.
17. **Filters "brunch, street food, vegan"** are not Places types. a) launch with the 8 types only; b) add a tag field. Recommended: a.
18. **Specialties list:** the 12-item list from the 12 Oct prompt or the 26 Interest Tags already on the site? Recommended: the 26 Interest Tags, up to 3 chosen from each member's own tags.

## What I could not read

- The Webflow plan name and which collection each page list is bound to (the API does not return them) [webflow].
- help.webflow.com, developers.webflow.com, developers.cloudflare.com and every official CPH source: blocked from this session. Documentation claims marked "search summary" rest on summaries, not the pages [webflow, slugs, members-server, cph-content].
- The multi-reference item cap and current nested-list limits [webflow].
- Whether the Directory and Resources rows on /countries/denmark appear once scripts run (static HTML only) [cph-content].
- The Danish Diaries Notion page (on purpose), the private Google Sheet and a packing checklist page [cph-content].
- Form submissions on /share-photos (on purpose) [webflow].
- Whether the Memberstack count of 8 is live or sandbox [members-server].
- The four missing documents (section 6).
- The six readers' findings.md files: none could be saved, so their reports exist only as returned text.
