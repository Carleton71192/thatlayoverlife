# TLL growth build: DESIGN stage proposal

12 October 2026 · Stage 1 of 3 (DESIGN, then EDIT, then IMPLEMENT) · Prompt: "That Layover Life: growth build (readers, writers, revenue)"

**Status: proposals only.** Nothing was changed on Webflow, Memberstack or any other service, and nothing was published. Live data was read only (Webflow CMS collections, their schemas, and the Stories list) so the designs use real field names and real story titles. EDIT starts only when you approve this.

## The artboards

The prompt asks for five sets of artboards. Each one is a self-contained HTML file in this folder. Open it in a browser. "Hide review notes" shows the page the way a visitor would see it.

| # | File | What it shows |
|---|---|---|
| 1 | `artboard-01-home.html` | Home at 1440 x 900 and 390 x 844, with the fold and "one scroll" lines drawn in |
| 2 | `artboard-02-submit.html` | /submit on a phone: the fork, steps 1 to 3, More options open, Sign in to send, the sent and error states. Desktop step 2 with the step rail |
| 3 | `artboard-03-story-end.html` | The end of a story: byline, Report this story, Trip kit, the guide card, newsletter, supporter line, more stories. Also the hosted label at the top of a story and on its card |
| 4 | `artboard-04-expats-copenhagen.html` | The first City Hub, Copenhagen, at 1440 and 390 |
| 5 | `artboard-05-profile-badges.html` | Profile header with badges, the three badge rules, directory tag, and the private progress nudge on /account |

How to read them: a purple number is a review note, listed beside each frame. A purple dotted value (for example **N**) is bound to the CMS or computed. Nothing in it is typed. A purple striped box is something that gets built but stays hidden until its content or URL exists. Photos are stand-ins from the prototype folder. Story bodies are drawn as grey lines so no story text is invented.

## What is already done, so this stage does not redo it

The fix pass (STATUS S43 to S55, published 12 October 13:39 UTC) already covers part of the prompt:

| Prompt item | State today |
|---|---|
| Free line in the hero, two hero buttons | Live: "Free to join. We're not a gym. No card, no paywall." (your choice B), "Read the stories →", "Build your free map" |
| Banned phrases off the home page | Live: the hero subhead and the old Chapter 01 name are gone; the chapter is "The reading list." |
| Search separated from newsletter states | Live |
| "Pre-launch" off /signup; "Link a story you already published" wording | Live |
| og:type article on stories | Live (Webflow's default "website" tag still prints beside it) |
| Visible ad-slot text | Removed from story HTML |
| Placeholder desks and dead FIND on /for-expats | Desks hidden; FIND goes to /travelers |
| Sitemap: /profile, collections, thin pillars | Excluded |
| "Currently in" | Removed; "home base" only |
| /submit restructure | Not done. Waits on `reports/fix-pass-2026-10-12/submit-change-log.md`, which artboard 2 now draws |

## Rules this design follows, and the conflicts it settles

| Topic | What the prompt says | What later decisions say | What the design does |
|---|---|---|---|
| Free line | "Free, forever. No card, no paywall." | You chose B on 12 October | Keeps B verbatim |
| Expat page | /expats with Denmark as the first country | GTM plan "settled overlaps": one reusable City Hub collection, first item Copenhagen | Draws /expats/copenhagen (Question 15) |
| Count source | Bind to tllStates | Your decision 6: the public source is the map's published copy (owner-record.json) | Every public count reads the map's record; nothing typed, denominator 249 |
| Open slots | No visible placeholders | DESIGN-SPEC v9 allowed one open slot per grid | No open slot anywhere; an invite line instead |
| Newsletter name | One name everywhere | You turned down the first name; three options are open | Placeholder `[Newsletter name]` (Question 6) |
| Money buttons | Working buy button and Ko-fi line | No Ko-fi URLs yet | Built and hidden until the URLs exist; no price shows before then |
| Stories fields | (none) | Stories CMS is at its 60-field cap | No new Stories field. Trip kit, prompts and hub links live in separate collections that point at Stories |
| Shared components | Propose only | Nav, footer and "Tell the editor" need you present | Drawn as proposals, marked as such |

The Emil Kowalski, Taste and Impeccable skills were not available in this session. Their principles are applied from the brand kit and DESIGN-SPEC v9 instead: one primary action per block, restraint over decoration, motion limited to 150 ms color and border changes plus a 0.97 press scale, and every effect switched off under reduced motion. The brand kit wins wherever they would differ.

## Artboard 1: Home

**Goal from the prompt:** within one screen a first-time visitor learns that TLL is free, that they get a profile, stories and a map, and that expat guides exist. They can start reading, build a map or contribute in one click.

| Order | Section | Content and binding | Change from live |
|---|---|---|---|
| 1 | Hero | Photo (live asset), eyebrow, H1 "Find your next *somewhere.*", tagline "Trips that can't wait for payday.", free line B, two buttons | Tagline moves into the hero and replaces the lede "Real places and real opinions…" (Kit v2.1: "real" in the H1 only) |
| 2 | "What you get, free" strip | Three link cards: Stories (/stories), Your map and passport (/the-map), Expat guides (Copenhagen hub, built hidden until Phase 4). Right-aligned note: "No paywall now, no paywall later." | New |
| 3 | Chapter 01 · The reading list | Pillar chips, then a **native Stories collection list**: Published, newest first by Published date, fixed order, 4 cards on desktop and 2 on phones, "All stories →" | Today these are typed cards inside an embed (9 cards while more than 20 stories are live) with a daily rotation. Both go |
| 4 | Interlude photo | Montenegro, framing as approved | Unchanged |
| 5 | Chapter 02 · The map, with receipts | Map 2.0 embed showing your record as the example, captioned "Example: the editor's map". Your count out of 249 and Magnus's count, both bound. "Build your free map" | Merges old Chapter 03 (passport counter) into old Chapter 04 (map). The visitor's own "0/249" counter goes |
| 6 | Chapter 03 · Write for TLL | "You went. Write it down." Contributor paragraph (one clause trimmed). "No account needed to start…" Then the **monthly prompt card**: theme, one-line brief, close date, "Write it here", "Link a story you already published", and a "Send a photo" text link | Prompt module is new. The two contribution buttons become these two |
| 7 | Chapter 04 · Paw Passport | Existing copy and the bound Magnus count, plus a **guide card** hidden until the Ko-fi product URL exists | Guide card new |
| 8 | Chapter 05 · The Layover Lounge | Short strip: five photos, "See the Lounge →", "Send a photo" | Shortened. "doing the maths" becomes "doing the math" (US spelling) |
| 9 | Chapter 06 · Newsletter | `[Newsletter name]` eyebrow, "Your inbox deserves better than *deals.*", the same form, "Send It →" | Name placeholder only |
| 10 | Footer (proposal, you present) | Counts through `data-tll-count` from the map's record; one supporter line | Proposal |

**Acceptance check on the mockup:** at 390 x 844 the free line and both buttons sit above the fold, and the first story card starts before the "one scroll" line (1688 px). At 1440 x 900 the free line and both buttons are above the fold, and the first story row starts before 1800 px. EDIT repeats this check against the live hero height.

## Artboard 2: /submit

The flow the submit change log describes, drawn screen by screen.

| Screen | What the writer does | Required |
|---|---|---|
| A · Fork | Picks "Write it here" or "Link a story you already published" (equal weight). The open prompt shows above them | none |
| B · Step 1, Place and date | Country; city, airport or region; month and year; "This is for [prompt]" box (ticked when arriving from a prompt) | Country |
| C · Step 2, Headline, story, photo | Headline, story with a live word count and reading time, one photo | Headline, Story, Photo |
| D · Step 3, Byline and consent | Byline (name, pen name, anonymous); the disclosure question; More options; the filing line ("We will file it under Europe, about 2 min read"); consent | Disclosure answer, Consent |
| E · Sign in to send | Shown only to logged-out writers: "Continue with Google", then email, password and "I am 16 or older." The existing Memberstack form, moved by you in the Designer | Google: one click |
| F · Sent / error | On-voice states replacing Webflow's defaults | none |

**Six required story inputs:** Country, Headline, Story, Photo, the disclosure answer, Consent. That is inside the prompt's limit of seven. The disclosure question is required with no default answer, so a hosted trip cannot slip through on a pre-ticked "No" (Question 7). With Google, sign-in adds one click. With email it adds email, password and the 16+ box (Question 8).

Other details: the draft saves on the device through the existing autosave, and a "Draft saved" status is announced politely to screen readers. Region comes from the country and reading time from the word count (230 words a minute). More options groups every other field into three collapsed groups, and shout-out links keep their labels and rel="sponsored". On desktop a step rail lets the writer go back, and a "What we want" panel gives a one-screen brief with three live stories as examples.

## Artboard 3: Story end, and the hosted label

Order after the story body:

1. Sign-off (CMS), then the byline card (existing), then a meta line: "Filed [date] · Trip [month year]". The trip value comes from the existing trip-when field, and the row hides when it is empty.
2. **Report this story**: a small link that opens the editor contact with the reason and story address filled in (Question 13).
3. **Trip kit**: eyebrow "Trip kit", heading "For a trip like this one", the prompt's disclosure sentence word for word ("We earn a commission if you book through these links. It never changes what we recommend."), then rows of category, partner, one-line note, a "Reklamelink" tag and the link (rel="sponsored noopener"). Hidden when the story has no rows.
4. **Guide card** (Paw Passport and Magnus stories only): a Trip kit row of category "Our guide". Hidden until the Ko-fi URL exists.
5. **Newsletter block**: same form and protected lines as the home page, plus "The next story like this one, when it is ready. Twice a month at most."
6. **Supporter line**: "Keep TLL free. Buy Magnus a treat on Ko-fi. It unlocks nothing except our gratitude." (your /faq line B wording). Hidden until the Ko-fi URL exists. Never a pop-up.
7. More stories (existing).

**Top of a hosted or sponsored story:** an ink box with a "Reklame · Hosted" or "Reklame · Sponsored" tag and the Disclosure field's text. It shows only when Disclosure is set. That needs the Designer step already on your list (conditional visibility on the hosted box, element 578a8d42). The same value puts a "Hosted" chip on the story's card wherever cards appear. No new Stories field.

No tracker loads before consent: Trip kit links are plain links, and the consent-gated `affiliate_click` event is already in the site footer.

## Artboard 4: Copenhagen City Hub

URL `/expats/copenhagen` (a City Hubs collection template; EDIT confirms no static page already uses /expats). Sections:

1. Departures header (TLL CPH · TO Copenhagen · STOP The first 90 days · STATUS Lived in, dated).
2. Hero: "Copenhagen, from people who *live here.*", a one-line promise, "Last verified [date] by [name]", and an on-page contents list.
3. **01 The first 90 days**: address and CPR number, MitID, health insurance card, bank account and NemKonto, moving money in, tax card, Digital Post. Each row links the official page (lifeindenmark.borger.dk, mitid.dk, skat.dk, International House Copenhagen) and carries "Checked [date] by [name]". The notes are left as brackets for you to write and check, so no rule is invented. The Money row is the one labeled affiliate row (Wise, per the GTM revenue table).
4. **02 How people made friends here**: stories tied to the hub (seeds: Sort Sol, the Copenhagen Marathon recap, Magnus's CPH entries). "What it costs" stays hidden until there are dated member prices.
5. **03 People who know Copenhagen**: the "What is public, what is not" box, then opt-in luggage-tag cards (today, yours), and the line "Live in Copenhagen? Add yourself to this page". No open slot.
6. **04 Where expats already gather**: Expat Groups rows (Live only), the municipality's housing-scam warning with its renting tips link, and "Suggest it".
7. **05 Only here for a layover?**: link to /layovers/cph-copenhagen-6h.
8. Partners in Copenhagen (labeled "Partner · Reklame", visually apart) and the supporter line: both hidden until they have content.

The hub stays noindex until the checklist is checked and three people have opted in. The home "Expat guides" card appears when the hub opens (Question 16).

## Artboard 5: Profile badges

Three badges, drawn as luggage labels (stamps mean countries and stickers belong to the passport page, so neither is reused):

| Badge | Earned when | Source | Shows |
|---|---|---|---|
| First Story | A published story names the profile as contributor | A hidden native Stories list on the profile holds the badge, so it renders only when a story exists. No script | Profile, directory and hub cards |
| 10 Countries | 10 countries by the counting rule (lived plus stayed, layovers apart) | The member's map record, never the typed Country count field | Your profile now; a member's own view; other public profiles once the public map store (S03) exists |
| Featured | You switch it on | Two new Contributors fields: Featured writer (switch), Featured on (date). Contributors has 54 of 60 custom fields | Profile, directory and hub cards |

Only earned badges render, and there are no grey slots. No leaderboard, and badges never change order (/travelers stays shuffled per visit). Progress toward a badge ("7 of 10") appears only on the member's own /account, because badges pull effort near a threshold and a public version would turn into a ranking.

## Phase 3 items the artboards do not draw

These need no artboard, but EDIT lists them: Article JSON-LD with the author linked to the profile, and ProfilePage JSON-LD on profiles; rel="ugc" on member website links; hero images Eager and others lazy (a Designer step already on your list); Webflow's leftover og:type "website" tag; and an **answer-page template** for layover and pet guides. That template puts the question in the H1 and the answer in the first paragraph, then the first-hand story, then "Last checked [date] by [name]" and the official source links. It reuses the guide pages being built (/copenhagen-stopover, /ees-etias-layover), so no new collection is needed.

## Data model

| Collection | New or changed | Fields | Why |
|---|---|---|---|
| Stories | **No change** (60 of 60) | none | At cap |
| Prompts | New | Name (theme), Brief (one line), Opens on, Closes on, Status | Monthly prompt on home and /submit. A list filtered to Status = Open and Closes on in the future, limit 1. It hides itself when nothing matches |
| Trip kit | New | Name, Category (eSIM, Insurance, Tours, Pet gear, Our guide), Partner, Note, Link, Stories (multi-reference), Page key (plain text for guides and hubs), Active | One component on stories, guides and hubs. The link to Stories lives here |
| City Hubs | New | Name, City, Country (reference), Promise, Hero image, Last verified on, Verified by, Stories (multi-reference), Open (switch), Noindex (switch) | The reusable hub. Copenhagen first |
| Resources | Changed | + City Hub (reference), + Order (number) | Checklist rows already have Official type, URL, Note, Checked on and Checked by |
| Expat Groups | Changed | + City Hub (reference) | Groups per hub. Contact email is never bound |
| Contributors | Changed | + Featured writer (switch), + Featured on (date) | Featured badge |
| Story form (Webflow form, not Memberstack) | Changed | + hidden "prompt" input | Shows which submissions answer the prompt |

The site has 29 collections today. With these it has 32. Check that your Webflow plan's collection limit allows that (Question 24).

## Code: what this needs, and the question about scripts

| Need | How | New script? |
|---|---|---|
| Latest stories, prompt card, Trip kit, badges, hub lists | Native collection lists and filters | No |
| Counts on home, footer and profiles | The existing readers of the map's record, plus `data-tll-count` attributes | No |
| Steps, computed region and reading time, draft through sign-in | Existing `tll-form-steps-js-v2` and the existing autosave | No (edits to existing code) |
| Send automatically once sign-in finishes | Extend `tll-form-steps-js-v2` if it can see the signed-in state after Memberstack returns | **Maybe.** If it cannot, a small new script is needed, and I will ask before writing it (Question 11) |
| 10 Countries badge, private progress | A few lines in `tll-pf3-profile-js-v1` and the account 3.0 Overview | No |
| Removing the typed reading-list cards and the daily rotation | Delete from the home embed | Removes code |

Memberstack: nothing in a `data-ms-*` block is edited. The only Memberstack-related step is moving the existing sign-in blocks on /submit, which is yours in the Designer.

## Shared components (you present)

- **TLL Site Footer:** `data-tll-count="owner-countries"` and `"owner-pets"` on the two numbers, plus a stories count, after you fix the map. Add the supporter line once the Ko-fi URL exists.
- **TLL Nav v1:** no change proposed (Question 21).
- **"Tell the editor":** add a "Report this story" reason if that is where reports go (Question 13).

## New copy, for your approval

Every new user-facing line in the artboards. Each was checked against the never-use list, US spelling, and the Kit v2.1 overuse limits.

| Where | Line |
|---|---|
| Home strip | "What you get, free" · "No paywall now, no paywall later." |
| Home strip cards | "Trips told by the people who took them, in their own photos and under their own bylines." · "Mark where you stayed and where you lived. Airport-only stops count apart, and your pets get a passport too." · "Copenhagen first: the admin checklist, the groups worth joining, and the people who live there, every line dated." |
| Home map | "Example: the editor's map" |
| Home Write for TLL | "No account needed to start. You sign in at the end, with Google or your email." · "Have a photo instead? Send a photo" |
| Prompt (placeholder until you approve) | "Layover Confessions" · "The layover that went sideways, and what it taught you. 400 to 800 words, your photos, your byline." |
| Guide card | "The EU rules for crossing borders with a dog, in the order you need them, with the stories of the times we got it wrong." · "Get the guide on Ko-fi →" |
| /submit | "Send us the trip." · "No account needed to start. Your draft saves on this device as you go." · "Where did you go?" · "We show the month and year, never the day." · "Tell it like you tell it at dinner." · "A line a friend would click. You can change it later." · "How should we credit you?" · "Did anyone pay for, host or give you any part of this trip, or pay you for links in it?" · "These are my words and my photos, and TLL can publish them with light edits." · "Send it to the editor" · "Sign in to send it." · "Your draft stays on this device while you sign in." · "It's with the editor." · "A human reviews every submission within 48 hours. If we need a detail or a better photo, we email you before anything goes live." · "That did not go through. Your draft is still here, saved on this device. Try again in a minute." · "A confession with a lesson, not a diary." |
| Story end | "For a trip like this one" · "Report this story" · "The next story like this one, when it is ready. Twice a month at most." · "Keep TLL free. Buy Magnus a treat on Ko-fi. It unlocks nothing except our gratitude." |
| Hub | "Copenhagen, from people who live here." · "The admin, in the order it bites." · "Each step links to the official page that decides it. If a rule changed after the date on the line, the official page wins." · "Ask someone who lives here." · "Groups we checked before listing." · "Before you pay a deposit: Copenhagen Municipality warns about rental scams in housing groups." |
| Badges | "Filed a first story on TLL." · "Ten countries stayed in or lived in." · "Picked by the editor for a story worth reading twice." · "Stamp the countries on your map and it updates itself." |

Protected lines appear only verbatim: "Free to join. We're not a gym.", "Your inbox deserves better than deals.", "Send It →", "Get In →", "Trips that can't wait for payday." Dates use the Copenhagen order ("30 November 2026").

## Accessibility and motion

- Targets: every button 48 px tall and every link row 44 px. Chips are 36 px tall but wider than 24 px, which meets WCAG 2.2 AA 2.5.8.
- Every input has a visible, connected label. Required fields are marked in text, not only by color. Errors list at the top and link to their fields. Focus moves to the step heading on Continue.
- The focus ring follows DESIGN-SPEC v9 (3 px ink outline plus a 6 px teal halo) and is never hidden under the fixed nav.
- Contrast uses the kit's text colors: teal text on light is #067A79, and small rose text on light is #C8325B.
- Motion: color and border transitions of 150 ms, and a 0.97 press scale. The sideways reading-list motion goes away with the fixed grid. Everything is off under reduced motion.
- The badge row is a labeled list, and the "7 of 10" meter has a text alternative.

## The three readers, screen by screen

| Screen | First-time reader | Would-be contributor | Advertiser |
|---|---|---|---|
| Home | Free, map and stories are clear in the first screen; expat guides appear when real | Prompt with a date, two clear ways in, no account to start | Labeled money rails, no ad clutter, a library that visibly grows |
| /submit | n/a | 6 required inputs, Google last, draft never lost | Disclosure asked every time, labels kept |
| Story end | One more story, then a newsletter | Byline card shows what they would get | Trip kit labeled at the point of use, Danish and US wording |
| Copenhagen hub | Dated, sourced, signed | Invite to add yourself | A separate, labeled partner block, never inside member cards |
| Badges | Signals who has written | A reason to file the first story | Featured writers to approach, never for sale |

## What could break (EDIT lists each one per row)

- Moving the Memberstack gate exposes the form to bots. Turnstile stays on.
- A Google sign-in that reloads /submit drops a chosen photo (Question 9).
- The pillar chips on home must filter the native list. The current chip script expects the typed cards.
- The /stories place chips read Region, so computed regions must match the existing values.
- Nested collection lists on the Stories Template (Traveled with, Photo placements, Trip kit) count toward Webflow's per-page list limits.
- A Disclosure text that is not a disclosure (the Seven Continents story's "Paid for by the travelers") would trigger the hosted label (Question 14).

## Questions for Nancy

Each has a recommended default. "Go with defaults" approves all of them.

1. **Home order:** hero, "What you get, free" strip, reading list, map, Write for TLL with the prompt, Paw Passport with the guide, Lounge strip, newsletter, footer? *Default: yes.*
2. **Hero lede:** replace "Real places and real opinions, shared by the people who went." with the tagline under the H1? *Default: yes.*
3. **Reading list:** native CMS list, newest first, fixed order, ending the daily rotation you asked for on 9 October? *Default: yes, as the growth prompt says.*
4. **Merge the passport chapter into the map chapter,** with your map as the example? *Default: yes.*
5. **Monthly prompt:** "Layover Confessions", the brief above, opens 1 November, closes 30 November 2026, in a new Prompts collection? *Default: yes. The card appears on 1 November and hides after the close date.*
6. **Newsletter name:** Gate Change, Window Seat or Long Way Round? *Default: Long Way Round. It is the only one that works for trains, ferries and road trips (DESIGN-SPEC v9 keeps the vocabulary mode-neutral and avoids "gate" and "seat"), and it matches "get lost on purpose".*
7. **Disclosure question on /submit** required, with no default answer (6 required inputs)? *Default: yes.*
8. **Sign-up inputs** do not count toward the seven, and Google leads? *Default: yes (same as submit change log Q2).*
9. **Photo after sign-in** if the Google sign-in reloads the page? *Default: test it first in EDIT; move the photo only if it reloads.*
10. **Hidden "prompt" input** in the story form (plain Webflow field)? *Default: yes.*
11. **Auto-send after sign-in:** extend the existing form-steps script; if that cannot work, may I add one small new script? *Default: extend the existing script, and ask you again before any new one.*
12. **Trip kit:** new collection, "Reklamelink" beside each link plus the prompt's English sentence above them, hidden until you have joined the programs and rows exist? *Default: yes. Partners: Airalo, SafetyWing, Viator via Travelpayouts. Never Telgea.*
13. **"Report this story"** goes to which form? *Default: the existing editor contact with a "Report this story" reason filled in, set up with you present because "Tell the editor" is shared.*
14. **Seven Continents Disclosure** ("Paid for by the travelers") is not a hosted disclosure: clear it so no false label shows? *Default: yes, and move the line into the story if you want to keep it.*
15. **Expat hub** as a City Hub collection at /expats/copenhagen, rather than the prompt's Denmark country page? *Default: yes (GTM settled overlap).*
16. **When the hub shows:** the home card and nav entry appear when the checklist is fully checked; the hub stays noindex until three people opt in? *Default: yes.*
17. **Checklist notes:** I draft each one-line note from the official page (STORM, linked, never Wikipedia), and you check and date each line before it shows? *Default: yes.*
18. **Wise referral** as the Money row of the checklist, labeled? *Default: yes, once you have joined.*
19. **Featured badge** via two new Contributors fields; **10 Countries** only where a computed count exists (you now, others after the public map store)? *Default: yes.*
20. **Badge progress** visible only on the member's own /account? *Default: yes.*
21. **Nav:** add a "Write" link? *Default: no nav change now; revisit after the first prompt.*
22. **Story-end newsletter promise** "Twice a month at most"? *Default: yes (matches the GTM plan's two a month).*
23. **US spelling:** "doing the maths" becomes "doing the math" in the Lounge paragraph? *Default: yes.*
24. **Collections:** 29 becomes 32 (Prompts, Trip kit, City Hubs). Does your Webflow plan allow it? *Default: proceed if the plan limit is 40; otherwise fold Prompts into Trip kit as a category.*
25. **Guide card cover:** a type-only cover (as drawn) until you have a real PDF cover image? *Default: yes.*

## What the EDIT stage will change

EDIT produces one change-log table (page, element, before, after, reason) for your approval. Nothing is applied before you approve it. In summary:

- **Home:** hero lede replaced by the tagline; new "What you get, free" strip (expat card hidden); typed reading-list cards and the rotation replaced by a native Stories list; passport and map chapters merged; Write for TLL gains the prompt card and the two buttons; guide card (hidden until the URL exists); Lounge shortened, "maths" to "math"; newsletter eyebrow placeholder.
- **/submit:** the nine rows of the submit change log (gate moved to the end by you in the Designer, three steps, More options, required flags, computed region and reading time, step names, new helper line, junk fields removed), plus the fork screen, the prompt box, the required disclosure question, the hidden prompt input, the filing line, the "What we want" panel, and the on-voice sent and error states.
- **Stories Template:** trip date row filled or hidden; Report this story link; Trip kit list; guide card; newsletter block; supporter line (hidden); hosted label driven by Disclosure (your Designer step); Article JSON-LD author linked to the profile.
- **Story cards** (/stories, home, /destinations): Hosted chip from Disclosure.
- **Contributors Template and /account:** badge row, computed stats in place of the typed count fields, ProfilePage JSON-LD, rel="ugc" on member links; private progress in the account Overview.
- **New City Hub template** /expats/copenhagen with its lists, noindex until it qualifies.
- **CMS:** three new collections (Prompts, Trip kit, City Hubs) and the new fields on Resources, Expat Groups and Contributors. No Stories field.
- **Footer and "Tell the editor":** proposals only, applied with you present.
- **Answer-page template** for layover and pet guides, on the guide pages being built.
- **Removed:** the typed reading-list cards, the rotation code, the visitor "0/249" counter on home, and Webflow's default form messages on /submit.

IMPLEMENT then makes the approved rows as unpublished edits and gives you a publish list. You publish.
