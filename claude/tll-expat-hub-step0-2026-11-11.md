# Step 0 report: "Your move, step by step" expat hub

For Nancy. Written 11 November 2026. Based on three read-only looks made between 15:55 and 16:45 UTC, an independent check of the draft made between 16:53 and 17:25 UTC, and one re-read of the public page after today's 17:07 UTC publish.

Nothing was changed for this report: no Webflow write, no publish, no CMS or Memberstack change, no form sent, no outreach.

How to read it: "Verified" means read today from the live site, the test copy, Webflow or Memberstack. "Inferred" means a conclusion drawn from those facts and not tested. Members are counted, never named.

## Short version

1. **Your picture of /for-expats is right, with three exceptions.** The search stays on the page (it does not send people to /travelers). Denmark already has four checked resources. The relay form is gone.
2. **The CMS is full.** The site holds 40 collections and 40 is Webflow's cap, so the six new collections in the prompt cannot be created as written. Two of them already exist: Resources (4 items) and Expat Groups (empty). The whole Denmark launch can be built on those two with no new collection.
3. **Sixteen collections hold 0 items.** Eight of them are not used by any code I could find and are candidates to let go if you want room. Your Run 1 prompt's Guides collection needs one slot. Photos needs none.
4. **The relay form behind "Ask a local" does not exist.** It came off /contact under your 9 November blocker prompt and has been gone from www since 10 November. A small new form is the fix.
5. **Two lines on the Location Expert cards promise things that do not exist:** questions that reach an expert "through TLL", and a Location Expert label "on your profile and every byline".
6. **One fix landed while this was being written.** Since the 17:07 UTC publish today (site code 16.58.0), the application form sends the name and the links as two separate answers. Before that, every application lost its name. The group form still has no working labels, and both forms still show "Example text".
7. **The member fields the prompt names are an older set.** The site runs on the "Live there" switch and the home base field. "Open to coffee" exists only in the 31 October preview.
8. **Much of Phase 1 already exists** from the 31 October build, behind a preview flag. It shows nothing today because nothing is behind it yet: 0 Living Library cards, 0 series stories.
9. **Not confirmed: filtering a list by "current Move Guide".** It needs you in the Designer, or one test on a draft page. With Denmark built as a normal page it is not needed at launch.
10. **Cost:** $0 so far, $0 planned.

What I need from you: answers to the questions below. Nothing is built until you approve the change-log table in section 7.

## Questions for you, in one message

Answer by number or letter. Where a recommendation is given, "yes" is enough.

### Your nine

**1. The hero line: "Moved abroad? Start here." with the eight-years line moved to Give back, or keep the eight-years line as the hero?**
- Recommended: "Moved abroad? Start here." On both screen sizes the current hero speaks to people who already live there, and a newcomer cannot tell the page is for them.

**2. Slug for the country guides: /move/[country] or /moving-to/[country]?**
- Recommended: /move/[country], a mild lean. Both are free: no page, collection or folder uses either, all four test addresses are 404 on www and on the test copy, and the redirect list you imported on 9 November has no row for either. /move is shorter and your prompt's links already use it.

**3. Launch scope: Denmark only, or also a Global guide plus Brazil or the US?**
- Recommended: Denmark only. The CMS is full, every checked resource on the site is for Denmark, and no member has a home base in Brazil or the US. Global items can sit on /for-expats without a Global guide.

**4. Expats worth following: members only, or members plus outside creators who say yes?**
- Recommended: members only at launch. Members fit in the existing Directory collection. Outside creators need a home that does not exist yet. The list starts at zero either way: the one Directory item has "is creator" off.

**5. Which Copenhagen groups are alive enough for the seed list?**
- No finding answers this; I need your names. Expat Groups is empty. Two of the four Denmark resources are in fact groups (InterNations, and the Facebook group Expats in Copenhagen), last checked 28 September.

**6. Living Library cards: visible to logged-out visitors with no contact details, or members only?**
- Recommended: visible to everyone, no contact details. That is how the staged cards already behave ("Get in touch" sends a logged-out visitor to log in). 0 cards exist today.

**7. Do you want the private "My move" checklist for members?**
- Recommended: decide after Denmark is live. It is technically possible (member data already holds the map the same way), but there are 8 members and no checklist items yet.

**8. Who owns the quarterly re-check: you, City Hosts, or a paid helper?**
- Recommended: you, for Denmark at launch, about 30 to 40 rows a quarter. City Hosts do not exist yet and a paid helper breaks the $0 rule. Revisit when a second country opens.

**9. The Ko-fi URL and price for the international moving guide, and the Paw Passport guide URL.**
- Only you have these. The same answers serve the Guides item in your Run 1 prompt.

### Seven more the findings force

**A. The collection cap. The site is at 40 of 40, so the six new collections cannot be created. OK to build the hub on the two that already exist (Resources and Expat Groups, both extended), with /move/denmark as a normal page and no new collection?**
- Recommended: yes. If you would rather have Move Guides as its own collection from day one, name one empty collection to let go. The safest candidates are Bookmarks, Comments and Trip Bundles; the full list is in section 3. Guides, from your Run 1 prompt, needs one slot whatever you answer here.

**B. The relay form does not exist. For "Ask a local" (Phase 3), OK to build one small new Webflow form that lands in your inbox, with two hidden fields (the country and the chosen expert)?**
- Recommended: yes. The other route is changing "Tell the editor", which sits in the shared footer. Until the form exists, nothing on the new pages will say that messages go through TLL.

**C. Two card lines promise things that do not exist. When the Location Expert cards move to /for-expats/apply, what happens to "Reader questions about your patch come to you through TLL, never straight to your inbox" and "The Location Expert label on your profile and every byline"?**
- Recommended: hold both lines back and put them back in Phase 3, when the "Ask a local" form and a Location Expert field make them true. The other choices are to keep them as they are or to reword them yourself.

**D. "How many members live there" cannot come from tllStates. OK to use the count of members who switched "Live there" on (Denmark 1, Thailand 1 today), and to use that switch plus home base as the source for local experts, in place of the older is-expat and lives-country fields the prompt names?**
- Recommended: yes to both. tllStates is each member's private map. It marks places a member has lived, past or present, so it cannot say who lives somewhere now.

**E. The Location Expert form has two names: "Location Expert application" in Webflow and "location-expert" in the published page. Which one is the form name to keep?**
- Recommended: "Location Expert application", the one you see in Webflow's form list.

**F. Publishing order. After Phase 1 the overview shows eight step cards with almost nothing behind them until the Denmark guide exists. OK to stage Phase 1 and publish the new overview together with the Denmark guide, while the form fixes go live as soon as you approve them?**
- Recommended: yes. The group form's missing labels are a fault today and should not wait for the guide.

**G. Two staged switches decide whether step 6 and the Living Library can ever show anyone: "Open to coffee with newcomers" and "Show home base". Both exist only in the 31 October preview. OK to plan for both going public in Phase 3?**
- Recommended: yes. Until "Show home base" is public, expert cards should show country only. Home base shows on every profile today, although your rule says only when a member switches it on.

Three small jobs only you can do in Webflow, when the time comes: create a page folder named for-expats (Phase 1, section 7 row 28) and later one named move (Phase 2); add three choices to the Resources "Type" list (Phase 2, section 3); and tell me the plan name shown under Site settings, Plans.

## 1. What /for-expats is today

Page id 6a3e5c68993a0f9ad19ee39d. The screenshots and the inventory were taken between 16:05 and 16:20 UTC from the 14:06 UTC publish. www was published again at 17:07:23 UTC with site code 16.58.0. I re-read the public page after that: the same eight sections are served (two more are added by site code, as before), and the only change found on this page is the form fix in section 5.

### Top to bottom, as a visitor sees it

| # | Section | What shows | Honest or empty |
|---|---|---|---|
| 1 | Hero | "FOR EXPATS · THE LOCATION EXPERTS", "Eight years somewhere beats eight days everywhere.", two buttons: "Become a Location Expert" and "Find an expat group". A photo of Sort Sol from a travel story | The second button leads to the group form, where zero groups are listed |
| 2 | Search | "JUST MOVED? START HERE", "Find the expats in your country.", a country box and FIND | Works, but reports every country as "DESK OPEN" (see below) |
| 3 | "The experts so far." | No expert cards. One tile: "Your city is not listed? Claim it." | Empty |
| 4 | Expats map | "Where our expats call home." Two countries filled: Denmark 1, Thailand 1 | True, but 1,152 px tall on a laptop for two people |
| 5 | "From the stories" | Montenegro, La Paz, Ghana | Travel stories, not life abroad. Typed into code, not chosen from the CMS |
| 6 | What a Location Expert does | Three numbered cards | Recruitment. Card 03 promises the relay (question C) |
| 7 | What you get | Three check cards | Recruitment. The first promises a label nothing holds (question C) |
| 8 | "Claim your desk." | The Location Expert form | "Example text" in 2 boxes |
| 9 | "Run a group? List it." | "No groups listed yet. The first one goes here." and the group form | Empty. "Example text" in all 5 boxes |
| 10 | "Bring the local truth." | A third button to the form | Third call to apply |

Screenshots (phone 390 and laptop 1440). They live in this session's working folder, not in the repo, because the full-page images show the two public map cards as the site serves them, with one member's public display name visible.

- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/for-expats-390-full.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/for-expats-390-fold.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/for-expats-1440-full.png
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/for-expats-1440-fold.png
- Search results: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/finder-result-denmark-1440.png and /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/finder-result-portugal-1440.png
- The staged 31 October version: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/staged-preview-expat-1440-full.png and /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page/staged-preview-expat-390-full.png

### Where the prompt's description is out of date

| The prompt says | What is there today | Verdict |
|---|---|---|
| A search that sends people off to /travelers | The search stays on the page and opens a result panel. Only its fallback link, used when scripts are off, goes to /travelers | Out of date |
| Someone who has just moved gets no resources at all | Typing Denmark shows four checked resources (InterNations, Copenhagen Expats, Expats in Copenhagen, International House Copenhagen), last checked 28 Sep 2026. Every other country shows none, and nothing shows without searching | Partly out of date |
| "Get in touch" goes through the existing relay form | There is no relay form. It was removed in the Designer on 9 Nov (your blocker prompt, item 6) and has been off www since the publish of 10 Nov, about 08:45 UTC. /contact and /support are email links only | Out of date |
| Filter experts by `is-expat` and `lives-country` | Those are the 30 Sep fields, filled for 1 member. The live switch is `list-expats` ("Live there" on /edit-profile), and the place comes from `home-base` | Out of date |
| "Open to coffee / answering questions" fields | Not Memberstack fields. One coffee switch exists, only in the staged preview, saved in the Worker's storage | Out of date |
| Create Expat Resources and Expat Groups | Resources (4 items) and Expat Groups (0 items) already exist and feed this page's search and the country pages | Out of date |
| Counts come from tllStates | tllStates is each member's private map. It holds a "lived" mark per country, past or present. 5 of 8 members have a map saved and 2 mark Denmark as lived. So it could say "have lived in", never "live there now", and only by reading every member's private data. The site already has an opt-in count for "live there now" (question D) | Needs a different source |
| An empty "The experts so far" section | True. The cause is a broken lookup, not missing people: the page script looks for a card style that /travelers no longer uses. The same fault makes the search say "No expert in Denmark yet" while the map two sections lower shows you in Denmark | Right, with a cause |
| A full-screen map with two pins | Two countries filled. Taller than one laptop screen (1,152 px); on a phone the map itself is 175 px | Close |
| A 7-field application form | Seven boxes plus a checkbox. One box ("Where you are from") is added by site code, not built in Webflow | Close |
| Both forms still show "Example text" | Application form: 2 of 7 boxes. Group form: all 5 | Right |
| Hero button, empty sections, three travel stories, recruitment cards, third call to apply | All as described | Right |

### On the page and not in the prompt (verified)

- Five hidden blocks in the Designer: a "Find your people" pills block, and four placeholder cards reading "DESK OPEN" for Portugal, Germany, Singapore and Mexico. They are not in the published page.
- Two hidden collection lists (Resources and Expat Groups) that the search reads.
- The search panel prints "DESK OPEN" and "A human reviews within 48 hours" for every country.
- The page's structured data description is recruitment copy and uses the verb your prompt bans.
- A staged section from the 31 October build ("Your homes count too.") appears with the preview flag on.
- No sideways scroll at 390 px.

### The first screen, judged as three people

| Reader | Phone (390) | Laptop (1440) |
|---|---|---|
| Newcomer | Sees a slogan about staying eight years and a button that is not for them. The search is below the first screen | "Just moved? Start here" is visible, but the box it points to is cut off |
| Settled expat | Clear: they want me to become a Location Expert | Same |
| Advertiser | Reads as a page recruiting writers. Nothing to sponsor | Same |

Neither size passes your test that all three understand the page on the first screen. This is one reader's judgment of the screenshots, not a measurement.

## 2. Earlier expat build pieces: where each one stands

Live = on www today. Staged = built, visible only with the preview flag or as a draft page. Built, not deployed = code is in the repo but not in the site's released code. Missing = not built.

| Piece | Status | Evidence |
|---|---|---|
| Expat profile fields in Memberstack | Live, in two generations | 83 custom fields. Old set: `is-expat`, `lives-country`, `lives-city`, `lives-years` (1 member). Current set: `list-expats` (2 members on), `home-base`, `from-place`, `from-and-lived-in`, `knows`, `languages`, `tags`. No `location-expert`, no city host, no coffee or questions field |
| /edit-profile inputs for them | Live | Page 6a0df371cd5b09ac504421ae, section "07 · The directories": the "Live there" switch, "Add a place you lived", contact choice, visibility. The older editor is still in the page code but never shows. Signed-in view not seen |
| "Your moves" profile section (show home base, open to coffee, My moves, Moved back) | Staged | Site code tll-expat-v1, preview flag only |
| Home base shown only when switched on | Not enforced live | Home base shows on every profile today. The switch exists only in the staged preview (question G) |
| "What is public, what is not" box | Missing | Only in a 12 Oct design file. On no live page |
| /travelers Expats tab | Live, as a filter chip named "Live there" | Page 6a0e0632ef1e4948167e827c. Chip counts: People 8, Live there 2. The address /travelers?list=expats opens with that chip already pressed (verified on www and the test copy). Not built from the 12 Oct plan: filters by country, city, interest or language; a report link on cards |
| /expats directory page (30 Sep) | Staged | Draft page 6abd0c6e7cf398d2a5c5d71d, 404 on www |
| Expat map source | Live since 11 Nov 13:28 UTC | Worker route /expats-map. Rule: `list-expats` on, visibility Public, a home base that resolves to a country. Answer today: Denmark 1, Thailand 1 |
| "The experts so far" block | Live and empty | Broken lookup, see section 1 |
| Copenhagen City Hub | Missing | No collection, /city-hubs/copenhagen is 404. Design file only. A draft page /copenhagen-stopover exists (6abbdbbadcc11e6928b4481c) |
| City Hosts | Missing | No field, badge, form or page |
| Meetups collection | Missing | Not among the 40 collections. No Events collection either |
| Living Library | Staged; its data route is live; 0 cards | Worker route /living-library answers with an empty list. The exact rule in the code: coffee switch on, `list-expats` on, visibility Public or not set at all, the profile is not a draft, and the member joined at least 14 days ago. Note the difference from the map, which needs visibility set to Public |
| The three story series | Partly staged | The First Friend (6ae629ad8179b1a6ac4344f2), The Partner Who Moved Too (6ae629ad8179b1a6ac4344f4) and Moving Back (6ae629ad8179b1a6ac4344f6) exist as draft Theme items, never published. 0 stories in each. The series rows are staged |
| Relay form | Missing | Removed in the Designer on 9 Nov, off www since the publish of 10 Nov. 0 mentions of "relay" on /contact. No Webflow form of that kind among the 12 form names. Still pointing at it: the profile note "Opens their chosen platform or the relay form.", the "Relay" contact choice (6 of 10 live profiles), one member's `contact-relay-on` |
| Location Expert badge | Missing as data, promised in copy | The page says "The Location Expert label on your profile and every byline." No field holds it (question C) |
| Directory collection 6abcd638b10dc7b4930f6410 | Live, 1 hand-made item | The Memberstack sync into it was never built. Used by the country page block "The people who live it." |
| Expat Groups collection 6abcd6371aa0f0654773a56e | Live, empty | The group form does not feed it. A listing is created by hand |
| Resources collection 6abcd637bff19cda8e2426c5 | Live, 4 items | All Denmark, all checked 28 Sep 2026 |
| Lived-in count, My moves, milestone badges, Move pros label | Staged | Preview flag only |
| Worker routes from 31 Oct | Live | /expats-map, /living-library and /series all answer |
| Fix for the Location Expert form's two box names | Live since 11 Nov 17:07 UTC | Site code 16.58.0. Checked in a browser on www after the publish by the session that published it: the two boxes read name-or-pen-name and published-links, and no "Field" key is collected. No test application was sent |

Counts today (verified unless marked): 8 members; 2 have "Live there" on; 2 show as expats on the site (Denmark 1, Thailand 1); 7 of 8 have a home base typed in; 0 are shown as open to coffee (inferred to be 0 switched on, since the switch is only offered in the preview); 0 stories in each series. Creators, three different numbers: the Memberstack creators switch is on for 2 members, /travelers shows "Make things · 1", and the one Directory item has "is creator" off.

## 3. CMS limits, and create versus extend

### The numbers

| Limit | Cap | Today | Fits |
|---|---|---|---|
| Collections | 40 | 40 | No room for even one |
| Items on the site | 10,000 or 20,000, by plan | 801 | Yes |
| Fields in one collection | 60 | Stories 60 and Contributors 60 are full. Countries 52. Resources 9. Expat Groups 8 | Stories and Contributors cannot take another field |
| Reference fields in one collection | 10 | Most used is Stories with 8 | Yes |

How sure this is:
- The count of 40 is verified. Two separate audits read the collection list today and both got 40.
- The cap of 40 comes from Webflow's published plan limits, read through search summaries, because Webflow's own help pages do not open from this session. Those summaries say the merged "Premium" site plan has 40 collections and 20,000 items, so no ordinary plan raises the cap. A 31 October note in the lock log already treats 40 as the cap.
- The plan name cannot be read through the tools. Nobody has recorded Webflow refusing a 41st collection, because nobody has tried, and nobody should try on the live site.

### What today's prompts ask for, and where each stands

| Prompt | Collections asked for | Where it stands |
|---|---|---|
| This one (expat hub) | 6: Move Guides, Move Steps, Expat Resources, Expat Groups, Events, Expat Creators | 0 new for a Denmark-only launch (below). 1 new, Move Guides, when a second country opens |
| Layover Lounge everywhere | 1: Photos | 0 new. Solved by extending the empty "Photo submissions" collection; the Lounge audit asks you to rename it Photos |
| Run 1, launch blockers | 1: Guides | 1 new. Nothing existing fits, so one empty collection has to go first |
| Also in the repo today | 2: a "Verified large-dog stays" collection (STORM build prompt v2) and a corrections log (trust and conversion fixes) | Not looked at here. Same limit applies |

So the day's real need is one freed slot for Guides, and a second only if you want Move Guides as a collection now.

### The six in this prompt: which can reuse what

| Collection in the prompt | Can it reuse an existing one | Smallest workable answer |
|---|---|---|
| Expat Groups | Yes. It already exists (6abcd6371aa0f0654773a56e), empty | Extend it. It has name, city, country, link, a private contact email and a status of In review, Live or Declined. Add six fields: type, what it is good for, free or paid, how to join, language, last checked. Keep Status in place of a new "approved" switch. 8 fields become 14 of 60 |
| Expat Resources | Yes. It already exists as Resources (6abcd637bff19cda8e2426c5), 4 items | Extend it. It has name, URL, type, host, note, country, checked on, checked by and status. Fields to add are listed below |
| Move Steps | Yes, as rows in Resources | A step is an official link with an order number. Mark those rows with kind "Checklist step" |
| Events | Yes, as rows in Resources, for launch | The launch seed is one or two events. Mark those rows with kind "Event". Give Events its own collection later, if a slot is free and events become regular |
| Expat Creators | Partly. Members: yes, through Directory (6abcd638b10dc7b4930f6410), which already has "is creator", lives in, city and links | Phase 3, and it waits for your answer to question 4. Outside creators have no home today. If you want them, the smallest home is again a row in Resources with kind "Creator" (inferred, not designed yet) |
| Move Guides | No. Nothing existing can become it. Countries has 8 free fields, but its pages live at /countries/, not /move/ | For Denmark only: no collection. /move/denmark is a normal page and the guide's own text (intro, first stop, owner, last full check) is typed on it. Create the collection when a second country opens and a slot is free |

### The smallest workable data model

Two collections, both already on the site, no slug or field renamed.

**Resources** becomes the one table for resources, checklist steps and (at launch) events. About 12 new fields, 9 becoming about 21 of 60:

| New field | Type | What it is for |
|---|---|---|
| Kind | Choice: Resource, Checklist step, Event | Tells the three kinds of row apart. The 4 rows there today become "Resource" |
| Need | Choice: the ten needs in your prompt | Step 4, resources by need |
| Step | Choice: the steps in your prompt, plus Moving back | Which step a row belongs to |
| Global | Switch | For items that apply everywhere. Country stops being required, which the tools can change |
| Sort order | Number | Checklist order, and Official and Community before Paid and Partner. Webflow cannot sort by a choice list's order, so a number does it |
| Source name | Plain text | The office or organizer behind a step, for the "last checked" line |
| Affiliate | Switch | Adds the sponsored link marking and the "Paid" or "Partner" badge |
| Start date | Date | Events only |
| Organizer | Plain text | Events only |
| Event type | Choice: Official welcome, Community, TLL meetup | Events only |
| Free or paid | Choice | Events only |
| City | Plain text | Events, and resources that are for one city |

Kept as they are: Name, URL, Type, Host, Note (the "why it helps" line), Country, Country name, Checked on, Checked by, Status.

**Expat Groups** gets the six fields listed above.

Four things to know before saying yes:

1. **Choice lists are a one-time decision for my tools.** They can create a choice field with its list, but cannot edit a list afterwards. So you approve every list before it is created, and the three new Type choices (Community, Paid, Partner) are added by you in the CMS settings, about a minute.
2. **Two existing blocks read every Live row in Resources**: the resources block on /countries/denmark and the search on /for-expats. Checklist steps and events stored as Resources rows would show up in both as if they were resources. The fix belongs in the same change: those lists get one more filter line, "Kind is Resource" (inferred that the tools can set it, since those lists already filter on Status), or the two scripts learn to skip the other kinds.
3. **A normal page at /move/denmark needs a page folder named move.** My tools can place a page in a folder but have no action that creates one (inferred from the tool list; the Designer tool was not checked). If a Move Guides collection with the slug move comes later, that folder has to go first, and the template page takes over the same address.
4. **The script-side matching the country pages use today stops working quietly once a collection passes 100 live items**, because each list loads 100 at most. Denmark alone is about 30 to 40 rows. Before a third or fourth country, the lists should filter natively on the country name, which the tools can set.

### The 16 collections that hold 0 items

"What it was for" is read from each collection's name and fields, so it is inferred. "Used by code" means its id appears in the Worker's settings or code in the repo, or a live page reads it (verified by search).

**Eight that no code uses: candidates you could let go**

| Collection | What it was for | Notes |
|---|---|---|
| Bookmarks | Members saving a story, with private notes | Named as removable in an earlier note. Serves no page |
| Comments | Reader comments on stories, with approve and flag switches | Named as removable in an earlier note. Points only at itself (reply to a comment) |
| Trip Bundles | Grouping several stories from one trip under a trip code | Named as removable in an earlier note |
| Press Mentions | "As seen in": publication, logo, pull quote, link, date | 5 fields. Quick to rebuild if you want it back |
| Partners | A sponsor list: type (tourism board, airline, hotel, gear), status, logo, disclosure terms | 4 fields. You may want it when the partner slot fills |
| Submissions | Your private pipeline for incoming stories: stage, format, how it came in, note to self | Template page is a draft |
| Award Nominations | Nominations for the layover awards: category, place, why, status, year | A Webflow form named "Award nomination" exists and a draft awards page exists, so this is a live plan. Not a first choice |
| Press Trips | A board of press trips: destination, dates, host, deadline, apply link | A Webflow form named "Press trip" exists. Not a first choice |

Suggested order if you need room: Bookmarks, Comments, Trip Bundles first; then Press Mentions, Partners, Submissions; Award Nominations and Press Trips last.

**Eight that are in use or spoken for: keep**

| Collection | What it is for | Why it stays |
|---|---|---|
| Expat Groups | This hub's groups directory | Read by the /for-expats search; extended in this plan |
| Photo submissions | Member photos | Becomes Photos in the Lounge build; the Worker writes to it |
| Story extras | Extra story fields, because Stories is full at 60. Holds the series fields (First Friend, Partner, Moving Back) | The Worker writes to it |
| Pet Notes | Notes on pet-friendly stays | The Worker writes to it |
| Press applications | Press sign-ups | The Worker writes to it |
| Collection items | Members' own collections (the 11 categories exist) | The Worker writes to it |
| Pursuit stamps | Members' stamps for pursuits | The Worker writes to it |
| Pros | The pros directory (Move pros among them) | The Worker writes to it |

Before any delete, still to check (not done in Step 0): whether any page has a list or a binding on the collection, and whether Webflow lets it go while one exists. No other collection points at any of the first eight (verified from the 40 schemas). Deleting is your decision and your click; I will not delete a collection.

Also worth knowing: States, National Parks and Subdivisions hold 219 items between them, every one a draft that was never published. They are not empty, so they are not on the list above, and whether the map still needs them was not checked. Destinations (198) and Countries (197) are two country lists; Resources, Expat Groups and Directory point at Countries.

## 4. Does "Move Guide is Current Move Guide" filtering work

Short answer: not confirmed. It probably works in the Designer, it has never been used on this site, and the tools I work through may not be able to set it. With Denmark as a normal page (section 3) the question does not arise at launch.

| Question | Answer | Basis |
|---|---|---|
| Does Webflow support filtering a list to the current page's item | Yes | Webflow documentation, read through search summaries. Not tested here |
| Does any page on this site do it today | No. The Countries, Contributors and Pillars templates all filter in page script instead | Verified for the templates read |
| Can I set that filter through the tools | Unconfirmed, likely no. On 12 Oct the same kind of filter was logged as "Could not fix by API, needs you in the Designer" | Verified note, inferred conclusion |
| Does it work for every nested list, as the prompt asks | Not confirmed by anything I could read | The page does not need nested lists, so the plan uses none |
| What would it take to confirm | You set the filter by hand on each list (about a minute each), or you allow one test on an unpublished draft page | |

Where native filtering falls short, and the smallest alternative for each:

| Case | Finding | Smallest alternative |
|---|---|---|
| Global items mixed into a country list | One list cannot say "this country or Global, and this need" | Global items get their own list, or stay on /for-expats only |
| Official and Community before Paid and Partner | Webflow cannot sort by a choice list's order | The Sort order number field; sort by it, then by name |
| Grouping by need or by group type | No native grouping | One list per group, each with a fixed filter. About 25 to 27 lists on a country page. Webflow's current limit is reported as 40 lists per page; older pages say 20 (unverified). If 20 is the true limit, steps 4 and 5 become one list each |
| Events: upcoming only, three at most | Native. One caution (inferred): a past event may linger until Webflow refreshes the page or the next publish | |
| Hiding a heading when its list is empty | Not native | One CSS rule. No script, no library |
| Local experts (step 6), the member count (step 1), the step rail highlight, "Show all", list data for search engines | Need a small script of our own | No third-party library for any of them |

Without a Move Guides collection there is no "current Move Guide" to filter by. /move/denmark would filter each list on the existing Country name text being "Denmark". The site already filters on plain text this way and the tools can set it.

## 5. The two forms

### Location Expert application

| | |
|---|---|
| Name in the Designer and in Webflow's form list | Location Expert application |
| Name in the published page | location-expert |
| Form element | dddf0a0b-b9ec-ae3d-0bdf-bc6616448b53 |
| Webflow form records | 6ab15a519857f957ac26b473 (www, 3 submissions), 6ab15a519857f957ac26b339 (thatlayover.life without www, 0), 6ab15a529857f957ac26b5ad (test copy, 0) |
| Field names from 11 Nov 17:07 UTC on | name-or-pen-name, email, city-country, years-there, from-country, local-truth, published-links, age-and-terms |
| Field names in the 3 older submissions | Field, email, city-country, years-there, local-truth, age-and-terms; 2 of the 3 also have from-country. None has a name |

What happened with the name, in order:
1. "Your name or pen name" and "Where you already write" were both published under one name, "Field". The second answer overwrote the first, so every application arrived without a name. The Designer and Webflow's form settings showed two separate names all along; the published page did not. Why Webflow publishes it that way is still unknown.
2. At 17:07 UTC on 11 November www was published with site code 16.58.0. That code gives the two boxes their own names in the visitor's browser, on /for-expats only. From now on the name arrives as name-or-pen-name and the links as published-links.
3. The three older submissions are not changed. Their links answer stays under "Field" and they have no name. You have each applicant's email, so you can still reply.
4. The page Webflow serves still carries the old name twice; the code corrects it after the page loads. The fix was checked in a browser on www. No test application was sent, so the first application that arrives, or one test you send, is the last proof.

Faults that remain (verified):
1. "Example text" sits in the name and email boxes.
2. The checkbox has no readable label for screen readers, and its text names the Editorial Charter without linking to it.
3. "Where you are from" and the name fix both come from site code that only runs on the exact address /for-expats. On a new page neither applies unless the form is built with the right names there or the code is widened to the new address.
4. The form's name differs between the Designer and the published page (question E).

### Expat group listing

| | |
|---|---|
| Name in the Designer and in the published page | Expat group listing |
| Form element | 88e25396-1a9b-55c1-4243-5a07684b0d08 |
| Webflow form records | 6abcbdc3f2471626899bc134 (www), 6abcbdc3f2471626899bbfcb (thatlayover.life without www), 6abcbdc3f2471626899bc29d (test copy). 0 submissions on each |
| Field names to keep | group-name, city-or-area, country, group-link, email, runs-group-and-open |

Faults (verified):
1. All five boxes show "Example text".
2. None of the five boxes has a working label. A screen reader announces each one as "Example text". The checkbox has no readable label either.
3. Nothing carries a submission into the Expat Groups collection. That matches the prompt (you create the item), but the "Listed so far" box on the page is fixed text that nothing updates.

### True of both

- The country suggestions (a list of 195 countries) are built by the /for-expats page script, and only on that page. The group form's country box and "Where you are from" both use it. On a new page the suggestions vanish unless the list is rebuilt there.
- Native Webflow forms with Turnstile spam protection in the markup. No webhooks on the site. Who receives the notification emails cannot be read through the tools.
- Webflow keeps one record per form per page per domain. Inferred: a form moved to a new page gets new records, and the old submissions stay under the old ones. The form's name can stay the same; the inbox history will be split. Worth one look with you after the move.
- The floating "Tell the editor" form is separate, lives in the shared footer, and showed no faults. It is not touched.
- The site has 12 form names in all. None is a relay or a contact form.

## 6. Background docs

| Doc the prompt names | Found | Saved copy |
|---|---|---|
| claude/tll-expats-page-storm-plan-2026-11-11.md, and your doc "TLL Expats Page: STORM Research and Rebuild Plan" | Not a file in the repo. Found as your Claude Doc and read in full | /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/history/docs/tll-expats-page-storm-plan-2026-11-11_claude-doc-Pk65bCjgppWtxDMrwRQnZn.md |
| claude/tll-expat-build-prompt-2026-10-12.md | No file under that name. The prompt text is inside the doc "TLL Community Strategy: Expats, Creators and Press" (repo copy: reports/fix-pass-2026-10-12/sources/tll-community-strategy-expats-creators-press.md, lines 133 to 212) | /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/history/docs/tll-expat-build-prompt-2026-10-12_extracted-from-community-strategy.md |
| claude/tll-expat-value-build-prompt-2026-10-31.md | Google Drive, "52 Expat value build prompt (Claude Code)" | /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/history/docs/tll-expat-value-build-prompt-2026-10-31_drive-52-1QFT_k_mlWL5Wex11doyYfNLVWQ-Sv9os1UG8clpsZVI.md |
| claude/tll-prototype-4-claude-design-prompt-2026-10-13.md | No file under that name. The prompt text is inside the Claude Doc "TLL Prototype 4.0: Storm Review and Design Brief" | /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/history/docs/tll-prototype-4-claude-design-prompt-2026-10-13_extracted-from-claude-doc.md |

Missing:
- None of the four exists as a file under its claude/ name. Inferred, not verified: the 12 Oct and 13 Oct texts found inside the larger docs are the same as the standalone files in your Claude project.
- Named by those prompts and found nowhere: tll-privacy-guardrails-2026-10-19.md (the 31 Oct prompt says it wins any conflict), tll-paper-trail-build-prompt-2026-10-28.md, tll-visa-tracker-storm-2026-10-28.md.

Two things from the docs that matter for Phase 1:
- The "What is public, what is not" box has no fixed wording in the 12 Oct prompt, only a spec: what a listing shows, that it is opt-in and removable in one click, and that current whereabouts are never shown. The one drafted version (a 12 Oct design file) includes "Messages go through TLL", which promises the relay that is gone. New wording is drafted in section 7.
- The privacy rules stand as the prompt lists them. Two more from the same docs apply here: a new member's contact stays hidden until you approve them or they have a first story, and homes are never shown as future plans.

## 7. Phase 1: the change log, first draft, corrected

This is a draft for your approval, not a record of anything done. Every line a visitor would read that I wrote is marked DRAFT. Lines taken from your prompt are marked DRAFT (prompt). Lines reused from the 31 October staged build are marked DRAFT (staged). Existing copy that stays is quoted without a mark. No draft line contains a typed count.

Four findings shape the table:
- Most of items 5, 6 and 8 of the new page (Living Library strip, series rows, Layover Club line, the "Add the places you've lived" link) already exist as staged code from 31 October. I propose reusing that code and retiring its "Your homes count too." block, not building a second version.
- With today's content, several new modules would show nothing: Living Library (0 cards), series rows (0 stories), move guides row (0 guides), partner slot (empty). Under your honest-states rule they do not render. The page after Phase 1 is therefore short: hero with picker, chips, step cards, a thin map strip, give back.
- Rows 14, 15, 17, 18 and 25 are changes to site code, not to Webflow. That code runs on every page, so each needs a code release as well as a publish, and a re-check of /stories, /travelers, /the-map and /about afterwards.
- Phase 1 changes no CMS collection, no CMS field and no Memberstack key. One data key is retired, and row 29 says which.

| # | Page or collection | Element | Before | After | What could break |
|---|---|---|---|---|---|
| 1 | /for-expats | Hero eyebrow 9fb9e2b5…e9f0 | "FOR EXPATS · THE LOCATION EXPERTS" | "FOR PEOPLE WHO MOVED ABROAD" DRAFT | Nothing |
| 2 | /for-expats | Hero H1 9fb9e2b5…e9f2 | "Eight years somewhere beats eight days everywhere." | "Moved abroad? *Start here.*" DRAFT (prompt), pending question 1 | The H1 is what search engines read first. The old line moves to row 16 |
| 3 | /for-expats | Hero lede 9fb9e2b5…e9f4 | "You know which bus actually runs… or become the one people find." | "Free, dated and written by people who live there, so you can stop trusting a forum thread from 2014." DRAFT | Nothing |
| 4 | /for-expats | Hero buttons 4bbc2acf-2c49-71f7-86fd-9ece2f0bd708 (673bd154… and 21bce692…) | "Become a Location Expert", "Find an expat group" | Removed. The country picker (row 5) becomes the main control. Text link under it: "Add the places you've lived" DRAFT (prompt), to /the-map?mark=lived, the address the staged code already uses | /the-map does not act on "mark" yet (verified), so until it does the link opens the map as it is, without Lived selected |
| 5 | /for-expats | Search section 85a680e1-f94e-6fb7-908f-702fbc714718 (box 7770f451…, FIND 048e09f7…, country list fd10090e…) | Second section, below the first screen. "JUST MOVED? START HERE", "Find the expats in your country." Placeholder, set by the page script: "Where did you move? Try Denmark, Portugal, Japan" | Moves into the hero. Visible label: "Where are you moving, or where did you land?" DRAFT. Placeholder: "Try Denmark, Portugal, Japan" DRAFT (a cut of the existing line, since the label now asks the question). The button keeps its word, FIND, and becomes a true button, not a link to /travelers | The page script finds these parts by their markers. Moving them without updating the script in the same change breaks the search |
| 6 | /for-expats | Search result panel (page footer script tll-expats-js-v1, 9,663 characters) | Three columns for every country: "DESK OPEN", "No expert in [Country] yet", "None listed yet", "A human reviews within 48 hours". Links "CLAIM THE [COUNTRY] DESK" and "LIST IT" jump to the two forms on this page | Shows only what exists for that country: checked resources, listed groups, the country page link, and later the Move Guide. An empty column does not render. When nothing exists: "We have nothing checked for [Country] yet. Live there? Help fill this in." DRAFT, linking to Give back. The two form links point at the new pages | Links of the form /for-expats?country=Denmark must keep working. The same script builds the country suggestions (rows 29 and 33). The country pages read Resources with their own script and are not affected |
| 7 | /for-expats | Member count in the result ("how many members live there") | None | From the site's opt-in count (Worker route /expats-map), shown only when it is 1 or more. Pattern: "[N] member lives here" / "[N] members live here" DRAFT, the number always filled by the source | Your rule says counts come from tllStates. tllStates could only say "have lived in", and only by reading every member's private map. Needs your OK (question D) |
| 8 | /for-expats | Journey chips (new) | None | Four links: "Planning a move", "Just landed", "Been here a while", "Moving back" DRAFT (prompt). Each a true link with a spoken label such as "Just landed: jump to Your first week" DRAFT | "Moving back" has nothing to point at yet (0 stories, 0 resources). Proposal: that chip stays hidden until it has content |
| 9 | /for-expats | Step rail (new) | None | Sticky rail on desktop, swipe row on phones, current step marked, no animation under reduced motion. Spoken name of the rail: "Steps" DRAFT | Needs a small script of our own for the current-step mark. No library |
| 10 | /for-expats | Eight step cards (new), each an H2 with an id: pick-your-place, before-you-go, your-first-week, your-first-90-days, find-your-people, meet-a-local-expert, get-out-there, settle-in-and-give-back | None | Step names DRAFT (prompt). One line each, all DRAFT: (1) "Choose a country and see who already lives there and what they wrote about it." (2) "The visa and permit starting points, with official links and the date we last checked them." (3) "The official checklist, one line at a time, so the paperwork stops being a rumor." (4) "Housing, money, health, work, language, schools and pets, sorted by what you need this week." (5) "Groups that are open to new members, with what each one is good for and how to join." (6) "Members who live there and said yes to coffee or a question." (7) "The next few events worth leaving the apartment for." (8) "Follow the people who stayed, read their stories, and add what you wish you had known." | There are 0 Global resources today, so the cards describe content that arrives in Phase 2 (question F on publishing order) |
| 11 | /for-expats | Empty-step line on the rail (new) | None | "Live here? Help fill this in" DRAFT (prompt) | Nothing |
| 12 | /for-expats | Move guides row (new) | None | Built, renders nothing until a guide is published. Its heading when it shows: "Move guides" DRAFT (prompt) | Nothing |
| 13 | /for-expats | "The experts so far" section 9d07cbc0-7cc0-d112-38cc-7b0ce78972c8 (H2 6485e933…, grid d59def15…, tile 3fe9d130…, link e4fadf18…) and its four hidden cards (dc46d80e…, 13591898…, 75e34864…, 155da7be…) | Empty section, one "Claim it" tile, four hidden "DESK OPEN" cards | Removed | The map code attaches after this section or, when it is gone, after the element with the id tll-expert-apply. Row 16 keeps that id on Give back. So removing this section alone does not lose the map: it would sit, full size, below Give back. Rows 13, 14 and 16 go live together with the code release |
| 14 | /for-expats (site code tll-expats-map-v1, runs in the site-wide code) | Expats map | A section 1,152 px tall on a laptop, 2 countries | A thin strip beside the Living Library strip (item 5 of your page order). Returns full size at about 25 pins. Existing heading stays: "Where our expats call home." | Site code release needed. Without it the map stays full size and lands below Give back (row 13). Release order: see the note under the table |
| 15 | /for-expats (staged site code tll-expat-v1) | Living Library strip | Not public | Shuffled per visit, no contact details. Renders nothing today (0 cards). Heading and line from the staged build: "People you can borrow for coffee", "Members who said yes to coffee with newcomers. No contact details on cards, no paid places." DRAFT (staged). Link "See everyone" DRAFT (prompt) to /travelers?list=expats, which opens with "Live there" already pressed (verified) | Nobody can appear until the coffee switch is public (question G). The code's rule lets a profile through when its visibility was never set, where the map needs Public. Proposal: make the two rules the same before the strip goes public |
| 16 | /for-expats | Give back block (new). It takes over the old anchors #tll-expert-apply and #tll-groups | None | H2: "Eight years somewhere beats eight days everywhere." (existing line, if question 1 moves it). One sentence: "You know which bus runs on Sundays and which office wants the form in triplicate. Tell the next person." DRAFT. Three doors: "Become a Location Expert" to /for-expats/apply, "List your group" to /for-expats/list-a-group, "Recommend a resource" (today an email link to hello@thatlayover.life) DRAFT (prompt) | Old links to the two anchors land on the doors, one click short of the forms. Of 14 pages fetched, only /for-expats itself links to them (7 links, some written by the page script and site code). A site-wide list of such links is still owed before the build |
| 17 | /for-expats (site code tll-page-heroes-v1 and staged tll-series-v1, site-wide code) | "From the stories" band | Montenegro, La Paz, Ghana, typed into code | Removed from this page. Replaced by the series rows. Your rule from the prompt: until a series has two stories, the three series show as one combined row; with 0 stories in all three (today) nothing renders. Row labels are the staged series names, DRAFT (staged) | Site code release. The same code runs the hero photos on other pages, so those need a re-check. The combined-row rule was not found in the staged code by a quick search and would be added |
| 18 | /for-expats (same site code as row 17) | Hero photo | Sort Sol, from a travel story | Proposal: remove it on this page, so the picker sits on the first screen at 390 px | Your call. Same code release as row 17 |
| 19 | /for-expats to /for-expats/apply | "What a Location Expert does" 95467e3f-4d9f-adff-0736-a5a83cfd2b2b and "What you get" 9fb9e2b5-c453-7a9a-a512-33827431ea08 | On /for-expats, six cards | Move to /for-expats/apply. Four cards move with their copy unchanged. Two lines are your call (question C): card 03, "Reader questions about your patch come to you through TLL, never straight to your inbox. A sentence back is enough." and the first check card, "The Location Expert label on your profile and every byline. You get it by living there, which is the hard part." Recommended: hold both back until Phase 3 | Moved as they are, the page would promise a relay that was removed and a label nothing holds. Held back, "What a Location Expert does" shows two cards and "What you get" shows two |
| 20 | /for-expats to /for-expats/apply | "Claim your desk." section dddf0a0b-b9ec-ae3d-0bdf-bc6616448b5d | On /for-expats | Moves to /for-expats/apply (rows 28 to 31) | See rows 28 to 31 |
| 21 | /for-expats to /for-expats/list-a-group | Groups section 88e25396-1a9b-55c1-4243-5a07684b0d17, with the "LISTED SO FAR / No groups listed yet" box 88e25396…0cee | On /for-expats | The form moves to /for-expats/list-a-group (rows 32 to 34). The empty box is removed | See rows 32 to 34 |
| 22 | /for-expats | Closing section 9fb9e2b5-c453-7a9a-a512-33827431ea11 ("Bring the local truth.", "Claim your desk →") | Third call to apply | Removed | Nothing |
| 23 | /for-expats | Hidden pills block 2c80823d-aafd-65a3-2458-1c4cc6e090e0 | Hidden | Removed | Nothing a visitor sees |
| 24 | /for-expats | Partner slot (new) | None | Built hidden. When filled: labels "Partner" and "Reklame for [Sponsor]" DRAFT (prompt), with sponsored link marking | Nothing |
| 25 | /for-expats (staged site code tll-expat-v1) | Layover Club line | Not public | "That Layover Life stays free because readers chip in." with a link "The Layover Club" to /support#layover-club. DRAFT (staged) | Nothing. /support has that anchor (verified) |
| 26 | /for-expats | Page title, meta description, Open Graph title and description, structured data description | Title "For Expats · Local Truth From People Who Live There · TLL". Description "Living it, not passing through. Eight years somewhere beats eight days everywhere. Bring the local truth from your city, credited and disclosed." Structured data: recruitment copy with the banned verb. Open Graph title and description: not read in Step 0, to be read before any change | Title "For Expats · Your Move Abroad, Step by Step · TLL" DRAFT. Description (159 characters) "Moving abroad, or just landed? Take the move step by step: paperwork, your first week, groups, local experts and events. Free, dated, by people who live there." DRAFT. The same two lines for Open Graph and for the structured data | Search listings and link previews change. The page stays indexed. The share image is not touched |
| 27 | /for-expats | Page code: three style blocks (tll-expats-v1, tll-expats-v1-1, tll-expert-form-v1) and the footer script. The staged block "Your homes count too." (site code tll-expat-v1) | In place | Trimmed to what the new page uses; form styles go to the new pages. The staged block is retired on this page, its Living Library and series parts kept | The two hidden source lists (4d7cd252-f2c7-180a-98a6-0e83e668c34f Resources, 4fb14406-9f97-27b3-6572-056db47fedf4 Expat Groups) stay. The search needs them |
| 28 | /for-expats/apply (new page) | The page and its folder | /for-expats/apply is 404. The site has no page folder in use today | New page, staged as a draft. Title "Become a Location Expert · TLL" DRAFT. H1 "Claim your desk." (existing). The recruitment cards above the form (row 19) | The address needs a page folder named for-expats beside the page of the same name. My tools can place a page in a folder but cannot create one (inferred), so you would create it by hand. Whether Webflow allows a folder and a page to share that name is not verified. If it does not, I come back to you with two top-level addresses |
| 29 | /for-expats/apply | Form "Location Expert application" | 7 boxes and a checkbox. Two boxes are published under one name, "Field"; since 17:07 UTC on 11 Nov site code renames them in the browser, on /for-expats only. "Where you are from" is added by the same code | The form name you choose in question E, kept. Fields: name-or-pen-name, email, city-country, years-there, from-country, local-truth, published-links, age-and-terms. "Where you are from" is built into the form as from-country. One data key is retired: "Field". The three older submissions keep their links answer under "Field" and have no name; nothing is moved or deleted | (1) The rename and "Where you are from" only run on the exact address /for-expats. On the new page the form must publish the right names itself, or the code must be widened to the new address with a release. Why Webflow publishes "Field" when the Designer shows the right names is unknown, so the published test page is read first, and you send one test application. (2) New Webflow form records; the 3 older submissions stay under the old ones. (3) The country suggestions for "Where you are from" are built by the /for-expats page script and vanish here unless the list is rebuilt on this page |
| 30 | /for-expats/apply | Placeholders and labels | "Example text" in name and email. Checkbox unlabeled, Charter not linked | Name: "The name you write under" DRAFT. Email: "you@example.com" DRAFT. Checkbox readable by screen readers, text unchanged, "Editorial Charter" linked | Nothing |
| 31 | /for-expats/apply | "What is public, what is not" box (new, above the form) | None | Three lines, all DRAFT: "Public: your name or pen name, your city and country, and your stories. Never your email." / "Nothing is listed until we approve it and you switch it on. You can switch it off in one click on your profile." / "We never show where you are right now. City or country only." | Line 2 is true today through the "Live there" switch. Line 3 depends on the home base rule (question G) |
| 32 | /for-expats/list-a-group (new page) | The page | /for-expats/list-a-group is 404 | New page, staged as a draft. Title "List Your Expat Group · TLL" DRAFT. H1 "Run a group? List it." (existing) | Same folder point as row 28 |
| 33 | /for-expats/list-a-group | Form "Expat group listing" | 5 boxes with "Example text" and no working labels | Same form name, same field names (group-name, city-or-area, country, group-link, email, runs-group-and-open). Every box and the checkbox get a connected label. Placeholders, all DRAFT: group name "The name people search for"; city or area "City or area, for example Copenhagen"; country "Start typing a country"; link "https://"; email "you@example.com" | New form records (the old ones hold 0 submissions). The country box takes its suggestions from the list the /for-expats page script builds. On this page they vanish unless the list is rebuilt here, and "Start typing a country" promises them. If the list is not rebuilt, the placeholder becomes "Country" DRAFT |
| 34 | /for-expats/list-a-group | "What is public, what is not" box (new) | None | Three lines, all DRAFT: "Public: the group's name, city, country and link. Never your email." / "Nothing is listed until a person here has checked it. Email us and we take it down." / "No home addresses and no private meeting places, ever." | The 12 Oct spec says "removable in one click". A group listing has no switch, so the draft promises removal by email. Your call |
| 35 | Collections | All 40 | As they are | No collection or field is created, changed or deleted in Phase 1 | Nothing. The data model in section 3 is Phase 2 and gets its own table |

### Not touched in Phase 1

- Nav, footer and the floating "Tell the editor" button. One proposal for you only: on a phone the "Tell the editor" dot sits over page content at some scroll positions, including this page's first screen.
- Memberstack and the Worker.
- The slug /for-expats and its page id. Links to the page from the nav, home, country pages, /edit-profile and others keep working.
- Both Designer form names, every field name listed in section 5, and the anchors #tll-expert-apply and #tll-groups (kept, though they land on doors).

### Site code release order

Rows 14, 15, 17, 18 and 25 change the site-wide code. That code was released twice today by other sessions and is at 16.58.0 on www. Another session has a photo hold waiting in the same code, and the lock log asks that nobody release from the current state until that review has passed. So this build's release takes the next free version number after the photo hold, is written into the lock log before it is registered, and reaches www only through a publish you ask for.

### How I would stage it (inferred, for your approval)

Several sessions are working on the site today, and a Webflow publish sends every non-draft page live at once. A half-rebuilt /for-expats could go live through someone else's publish. Two ways to avoid that: build the new overview as a separate draft page and swap it in at the end, or do the rebuild in one sitting under the lock log. The two new form pages are drafts either way.

## 8. What was not checked

- The signed-in view of /edit-profile, and how many members have the staged coffee switch on.
- Webflow's own help pages (they do not open from this session), so every Webflow limit in sections 3 and 4 is from search summaries or repo notes. The plan name is unknown.
- Redirects added in Webflow after 9 November. The list you imported that day is in the repo and has no row for /move, /moving-to or /for-expats.
- Whether Webflow allows a folder and a page that share the slug for-expats, and whether any of my tools can create a page folder.
- The current Open Graph title and description of /for-expats.
- Every link across the site that points to /for-expats#tll-expert-apply or #tll-groups (14 pages were fetched; the full list is owed).
- Whether any page still has a list or binding on the eight empty collections named as candidates in section 3.
- Whether the staged series code already has the "one combined row" rule.
- Who receives form notification emails.
- A sent application: the form fix was checked in a browser, not by sending one.

One small thing noticed along the way: Interest Tags has a live tag named "Trailing partners". Your prompt asks for "the partner who moved too", so you may want that label changed.

## 9. Where the evidence is

All in this session's working folder, not in the repo.

- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/page (screenshots and page evidence)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/history (docs, counts, field keys)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/cms (all 40 collections with fields and counts)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/expat-hub/check (the independent check's own reads)
