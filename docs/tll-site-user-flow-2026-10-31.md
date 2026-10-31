# That Layover Life: every page and how people move through it (31 Oct 2026)

For Nancy to share with Claude when planning the cleanup. It covers every page in Webflow today (89 pages and CMS templates), where people arrive, what each page asks them to do next, and what is broken, staged or missing.

**Status words used here**

| Word | Meaning |
|---|---|
| Live | On the site now |
| Staged | Built, but shows only with a preview link or after the next publish Nancy approves |
| Draft | A Webflow page not published |
| Internal | A CMS template that only feeds other pages and sends readers away |

Site version: site layers 16.47.0 is live. 16.48.0 (Phase 0 fixes) is staged, not published.

---

## 1. The one journey that matters

Visitor, then the first stamp on their own map, then a story or photo, then they come back.

```
Arrive (search, social, LinkedIn, QR, a friend's profile)
  -> Home / a story / a country page / a profile
  -> "Start your free map" (story end card, home cover, join links)
  -> /signup (Memberstack)
  -> /account?welcome=1: home country -> countries with Lived / Stayed / Layover -> one photo -> passport reveal   [staged]
  -> /the-map (the full map; Quick log)
  -> /edit-profile (who you are, places lived, pursuits, stamps, collections, album settings)
  -> /submit (a story) or /share-photos (photos)
  -> comes back for: the weekly cover, What's new prompts, On this day [staged], Passport Wrapped [spec only]
```

Today's gaps on this path:
- The welcome steps are staged, not live.
- The sample map does not carry a visitor's taps into sign-up.
- /submit is one long form.
- A visitor gets no "first stamp" moment.

---

## 2. Pages by purpose

### Front door

| Page | Who | What it is for | Main next step | Status and notes |
|---|---|---|---|---|
| `/` Home | Everyone | Weekly cover story, the value section ("What do you collect?"), story shelf, people strip | Read the cover story; Join free | **Live.** Pursuit links in the value row went to 404 hubs; staged to open library searches. The shelf note "06 stories" is staged to count the cards it shows. The cover credit becomes "Photo: Name" and the place. |
| `/stories` Library | Readers | Every story, filter chips, search | Open a story | **Live.** Search is staged to match words inside stories (Kilimanjaro, Toubkal, Patagonia, whale sharks), and its phone width is fixed in staging. Series chips appear when stories join a series. |
| `/stories/<slug>` Story (template) | Readers | The story, trip facts box, share row, keep reading, reader notes, the ask | Next story; Join free; share | **Live.** The false "Reklame for the traveler" label is staged off. Staged: Next story card, join card, "In this story", hero cap, series boxes, Trip Kit, pet note. |
| `/countries` and `/countries/<slug>` | Readers planning or remembering | A country hub with its stories | A story; Been here / Want to go | **Live.** Recommended: a 301 from /countries to /destinations, set in Webflow. |
| `/destinations` and `/destinations/<slug>` | Readers | Destinations list and pages | A story | **Live.** Overlaps with /countries; Nancy to choose one. |
| `/travel-wire` | Readers | Travel news feed | A story | Live |
| `/pillars/<slug>` | Readers | Stories by editorial pillar | A story | Live |
| `/collections/<slug>` | Readers | Themed sets of stories ("travel vibes") | A story | Live, noindex |
| `/themes/<slug>` | Readers | Theme pages (Desert Glow, Salty Air…), plus the 8 new series themes | A story | Live; the new series themes are drafts |
| `/layovers/<slug>` | Readers | Layover guides (7 items) | A story | Live |
| `/national-parks`, `/states`, `/subdivisions` templates | Readers | Map and pet records for US parks and regions | Back to the map | Live templates |

### People

| Page | Who | What it is for | Main next step | Status and notes |
|---|---|---|---|---|
| `/travelers` | Readers, members | Directory of members, with filter chips | A profile | Live |
| `/contributors/<slug>` Profile | Readers | Stamp strip, flags, stories, pets, crew, collections, album, links | Follow their stories; start your own map | **Live.** The continent album is live. Staged: home base hidden unless switched on, "Countries lived in", My moves, milestones, noindex on empty profiles, relay contact buttons removed. |
| `/profile` | Members | Legacy profile page | `/account` | Live; check whether still needed |
| `/pets` "Pets We Travel With" | Readers | Pet directory | A pet page | Live |
| `/pets/<slug>` | Readers | The pet's Paw Passport | Owner profile; the pet's stories | **Live** template. The staged Paw Passport adds stamps, firsts, counter, slide show, Forever traveler and privacy. |
| `/spotlight` | Readers | Featured members | A profile | Live; staged noindex until it has content |
| `/creators` | Creators | Creator directory | A profile | Live; staged noindex. Recommended 301 from /for-affiliates to /creators. |
| `/expats` | Expats | Expat directory | A profile | Draft; /for-expats is the live page |
| `/press` | Journalists | Press directory | A profile | Draft |
| `/directory/<slug>`, `/expat-groups/<slug>`, `/resources/<slug>`, `/interest-tags/<slug>` | Expats | Directory records | Back to /for-expats | Live templates; check each is needed |

### Audiences

| Page | Who | What it is for | Main next step | Status and notes |
|---|---|---|---|---|
| `/for-expats` | People who moved abroad | Expat landing: the expats map, people who live there | Add the places you've lived | **Live.** Staged rework: hero, three promises, three series rows, Living Library, Paw Passport link, Layover Club line. |
| `/the-paw-passport` | Pet owners | Pet division landing, EU guide block | Start your pet's passport; waitlist | **Live.** The guide's Buy button is hidden until Nancy gives the Ko-fi URL and confirms the guide was checked against Regulation (EU) 2026/131. Staged: rework, waitlist and QR landing (trademark gate). |
| `/pursuits/<slug>` | Marathoners, trekkers, foodies, pet travelers, work travelers | Pursuit hubs | Add a stamp; read the hub's stories | Live template. Hub items are drafts or unpublished, so /pursuits/foodie, /marathons and /trekking answer 404. Noindex until 6 stories, 3 writers and an intro. Work trips hub staged. |
| `/marathon-diaries/<slug>` | Readers | Nancy's marathon diary | Next diary entry | Live; Nancy's words, untouched |
| `/paw-passport/<slug>` | Readers | Magnus Diary entries | Magnus's pet page | Live |
| `/for-press`, `/press-trips` | Journalists, hosts | Press info; hosted trips board | Apply | /for-press live, /press-trips draft |
| `/for-brands`, `/for-affiliates`, `/partners/<slug>` | Brands | How paid work works | Contact | Live |
| `/awards` and `/award-nominations` | Readers | The Layover Awards | Nominate | /awards live (staged noindex); nominations template draft |
| `/copenhagen-stopover`, `/ees-etias-layover` | Readers | Practical guides | A story | Drafts |

### Members (signed in)

| Page | What it is for | Main next step | Status and notes |
|---|---|---|---|
| `/signup`, `/login`, `/forgot-password` | Memberstack sign-in | `/account` | Live |
| `/account` | Overview: profile checklist, What's new, crew inbox, Download everything, investor metrics (owner only) | Map; profile; submit | **Live.** Staged: welcome steps, On this day. |
| `/edit-profile` | Who you are, places lived, links, lists, pursuits (05B), collections (05C), stamps, album count model (05D), Your moves (05E, staged), crew | Save; see profile | Live |
| `/the-map` | The member's map: Lived / Stayed / Layover / Want, Quick log, sample map for visitors | Share; edit profile | **Live.** "Open full screen" opened an empty panel; staged hidden. "Edit my destinations" staged for members only. |
| `/my-pets` | Add and edit pets | Pet page | **Live.** Staged: Passport details editor. |
| `/my-passport` | Old page that forwards to /the-map | none | Live, but its HTML still holds personal details. Staged as a draft; needs a 301 to /the-map before publishing. |
| `/submit` | Share a story (autosave, captions, gallery, pets, series fields) | Status: draft, sent, live | **Live.** Not yet split into steps; HEIC conversion missing. |
| `/share-photos` | Send photos | Thanks | Live |
| `/editors-desk` | Nancy's review desk | none | Draft |

### Help, trust and legal

| Page | What it is for | Status and notes |
|---|---|---|
| `/about` | Who and why | Live |
| `/support` | Six ways to support TLL, The Layover Club, Ko-fi | Live. The headline was white on cream; staged ink. |
| `/contact` | Contact Nancy | Live. The member-to-member relay form is staged removed. |
| `/faq`, `/community-guidelines`, `/editorial-charter` | Rules and promises | Live. Charter to add: "No business can pay to edit or remove a pet note". |
| `/privacy`, `/terms`, `/cookies` | Legal | Live. Must be updated to match the new consent setup; draft text is in the Phase 0 change log. |
| `/newsletter` | Newsletter sign-up | Live |
| `/404` | Not found | Live; voice refresh copy proposed ("This page took a different connection.") |
| `/style-guide`, `/map-2-preview`, `/spotlight-crew`, `/spotlight-index`, `/travelers-archive` | Internal or old | Drafts |

### Internal CMS templates (never a destination; noindex, and each sends readers away)

- **Already protected:** Story extras, Collection items, Pursuit stamps, Collection categories, What's new, Pros, Site settings, Site stats, Pet notes, Trip bundles.
- **Staged in Phase 0:** Visits, Bookmarks, Comments, Photo submissions, Press applications, Photo placements.
- **Still to do:** the page bodies on these templates still render member data for anyone with the URL. To close that fully, Nancy needs to remove the bound fields in the Designer or password-protect the templates.

---

## 3. Audience paths

| Audience | Arrives at | Then | Ends at |
|---|---|---|---|
| Repeat traveler (core) | Home cover, a story, a friend's profile | Map, then first stamp | Profile with album and Slide Show |
| Expat | /for-expats, The First Friend, The Partner Who Moved Too, Moving Back | "Add the places you've lived" then the Living Library | Profile with "Countries lived in" and My moves |
| Work traveler | /pursuits/work-trips, a LinkedIn share, The Free Evening, Plus One Day | Work-trip stamp ("Back home? Good. Now tell us.") | Work trips badge; a Free Evening story |
| Pet owner | /the-paw-passport, a QR on the plush, Cats Who Travel | /my-pets, then Passport details | /pets/<slug> with firsts and stamps |
| Pursuit (runner, hiker, foodie) | Home "What do you collect?", a pursuit story | Pursuit stamps (05C) | Hub page once indexable |
| Pro (From the Pros) | Invite email | Profile, then a story with the author box | Pro badge; one link with the right rel |
| Press, brands | /for-press, /for-brands | Contact | none |

---

## 4. Where every page should lead next

| Page type | Next step |
|---|---|
| Story | Next story (same place or series), then the join card, then share |
| Country | Its stories, then "Been here", then the map |
| Profile | Their album Slide Show, then "Start your own map" |
| Audience landing | One main button (map, pet passport, stamp) |
| Member pages | Back to the map or the next unfinished profile step |
| Every empty state | One icon, one sentence of 15 words or fewer, one button |

---

## 5. What is waiting on Nancy (from all builds)

**Phase 0:**
- Approve publishing the staged Phase 0 fixes.
- The Ko-fi URL and EU guide check.
- 301s: /my-passport to /the-map, /countries to /destinations, /for-affiliates to /creators.
- Remove bound fields from the member-data templates.
- Policy text.
- The two privacy flags in stories (a child's name, a future plan).
- The Thailand stub: unpublish?

**Builds:**
- Approve the expat, pet, work-trip and UX previews.
- Run the Worker deploy (`npx wrangler deploy`).
- Pick the button color.

**Voice refresh (Phase 2):**
- Waits for Phase 1's speed gate: home layout shift under 0.1, images under 1 MB, Lighthouse mobile 50+.
