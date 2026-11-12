# Build prompt: /for-press rebuild, creator badge, "Rest of the trip" tag and the Press Desk

Received from Nancy in the cloud session on 12 Nov 2026. Saved as given. Note from the session: the source it names (claude/tll-for-press-storm-2026-11-12.md) was not in the repo when this was saved; the companion it names (claude/tll-travelers-role-badges-build-prompt-2026-11-12.md) is saved here as claude/tll-travelers-role-badges-founding100-prompt-2026-11-12.md.

Source: claude/tll-for-press-storm-2026-11-12.md (decisions confirmed by Nancy, 12 Nov 2026). Works alongside: claude/tll-travelers-role-badges-build-prompt-2026-11-12.md (same Memberstack fields; run that one first or reconcile field names in Step 0).

Decisions used (Nancy can change any before pasting):

* No "whole press list" promise. The page leads with "Get found. File the rest. Find the doors."
* "Rest of the trip" is a tag on normal stories, not a new story type. Outbound links to other publications are allowed and encouraged.
* Press Desk resource hub is public and indexed from day one.
* Creators and influencers can register. Creator badge needs 5,000+ followers or subscribers on one channel and 2%+ engagement, shown by an insights screenshot under 30 days old.
* Seed tourism boards: VisitDenmark, Visit Faroe Islands, Visit Norway.
* Not in this build: opportunity board, media directory, source finder, any outreach.

You are working on That Layover Life (thatlayover.life), built on Webflow with Memberstack. Task: rebuild /for-press so it delivers value to press travelers and creators today, with zero members, add a Creator badge with a minimum audience, add a "Rest of the trip" story tag, and build a public Press Desk resource hub.

## Rules

* Work in Webflow drafts only. Nothing is published until Nancy approves your change log.
* Apply the Emil Kowalski design skill, the Taste Skill and the Impeccable design skill to every visual decision.
* Keep every page slug, CMS collection, field name, form name and data-carrying class. Don't rename existing Memberstack fields. Propose any new field or collection in the change log before creating it.
* Nav, footer and the "Tell the editor" button are shared components: don't touch them. If a change is needed there, list it as a proposal.
* Copy rules: US spelling, no em dashes, never use the word "ships." Lines marked DRAFT are Nancy's to approve. Never invent facts, members, partners, counts or quotes.
* Never claim tourism boards or partners trust, use or work with TLL. There are none yet.
* Never show anyone's current location or exact travel dates. Month and region only.
* Every count comes from tllStates. Never type in a number the site calculates.
* Never publish a public email address for a PR, tourism board or member. Contact goes through the existing relay.

## Step 0: Check before building

1. Open /for-press at desktop and 375px. Screenshot the current state.
2. Confirm these Memberstack fields exist and report anything missing: `is-press`, `press-verified`, `is-creator`, `roles`, plus any existing outlet or links fields on /edit-profile.
3. Confirm how the current "Register as a Press Traveler" button and the PR trip form are wired (form name, where submissions go).
4. Confirm the Stories CMS collection's tag or category field and whether a disclosure field already exists.
5. Report before going further.

## Step 1: Remove what can't be backed

* Remove "A disclosure standard that tourism boards trust" and its card.
* Remove "One form, the whole press list" and any line saying trips go to "every" Press Traveler.
* If any count of Press Travelers appears, bind it to tllStates or remove it.

## Step 2: First screen with two doors

Both audiences must see their door on the first screen at 1440x900 and 390x844, without scrolling.

* Eyebrow: "For press & creators"
* H1 (DRAFT): "Your bylines live elsewhere. The rest of the trip lives here."
* Sub (DRAFT): "A free profile PRs and editors can actually read, a home for the stories your editor cut, and the doors to the next trip."
* Three short rows: Get found · File the rest · Find the doors, each one sentence, each linking to its section below.
* Two buttons: "I make travel media" (to registration) and "I host travel media" (anchors to the PR section).
* The three disclosure rules stay, directly below the first screen, unchanged.

## Step 3: Registration (press and creators)

One sign-up, two badges. Everyone joins as a traveler first.

Copy block "Which badge fits you" (DRAFT):

* Press ✓: "Name your outlet and link two published pieces on the outlet's own site. The editor checks them."
* Creator ✓: "5,000+ followers or subscribers on one channel, with 2%+ engagement. Send an insights screenshot from the last 30 days. The editor checks it."
* Not there yet? "Join as a traveler. Post stories, use the Press Desk, tag your Rest of the trip. Your badge comes when your numbers do."

Propose these Memberstack fields (all opt-in to show publicly unless noted):

* `outlets` (repeatable: name, URL)
* `recent-clips` (two: title, outlet, date, URL)
* `beats` (fixed list: adventure, food, luxury, budget, family, pets, running and races, wildlife and photography, culture, LGBTQ+, accessible travel, sustainability, expat life, layovers)
* `doesnt-cover` (short text)
* `audience-markets` (top three countries)
* `languages`
* `notice-period` (2 weeks / 4 weeks / 6+ weeks)
* `assignment-style` ("Usually commissioned before the trip" / "Usually after" / "Varies")
* `portfolio-links` (Muck Rack, Authory, Journo Portfolio, outlet author page)
* `association` (SATW, NATJA, BGTW, IFWTWA, other, with member page link)
* `creator-channel` (platform + URL), `creator-followers` (integer), `creator-engagement` (percent), `creator-verified`, `creator-verified-on` (date)
* `hosted-travel-policy` ("Can accept hosted travel" / "Paid or self-funded only"), private by default
* Private only, never public: dietary, access, health notes; travel windows (month and region only)

Badge logic (match the role badges prompt):

* `is-press` AND `press-verified` → ◆ PRESS ✓
* `is-creator` AND `creator-verified` AND `creator-followers` ≥ 5000 → ✎ CREATOR ✓
* `is-creator` without verification → ✎ CREATOR (outline, no check)
* Profile shows the follower count with "verified on {date}" so each PR applies their own bar.

## Step 4: Editor verification queue

Build a queue Nancy can work through (Webflow CMS collection or Memberstack data table, your recommendation in the change log):

* Columns: member, badge requested, evidence links or screenshot, submitted on, status (pending / approved / declined), reason, verified on, re-check due (12 months after approval).
* Approving sets `press-verified` or `creator-verified` and the date. Declining sends the member the reason through the existing email flow.
* Screenshots are stored privately and deleted 30 days after a decision.
* Create a draft /press-rules page: what each badge means, the thresholds, why a badge can be removed, how to appeal. If the role badges build already created /press-rules, extend it.

## Step 5: "Rest of the trip" tag on stories

* Add a tag "Rest of the trip" to the Stories collection (propose the field change).
* New optional story fields, visible in the submission flow only when the tag is on: `commissioned-outlet`, `commissioned-url`, `commissioned-date`, plus a repeatable `other-coverage` (outlet, URL) for any other pieces from the same trip.
* Required question when the tag is on: "Does your outlet own this material?" Options: "No, it's mine" / "Not sure" / "Yes". "Yes" blocks submission with the line (DRAFT): "Then it stays with them. Tell us the part that didn't make the edit instead." "Not sure" shows a short note to check the contract and holds the story as a draft.
* Rule shown at filing: "Never republish the commissioned piece. Publish after it runs."
* On the story page, under the disclosure line: "The commissioned piece: {outlet}, {date} →" linking out (normal link, no nofollow), plus the other coverage links. Outbound links to other publications are welcome.
* Story card gets a small "Rest of the trip" label.
* TLL never promises any PR or host that a story will appear.

## Step 6: The Press Desk (public resource hub)

Create /press-desk (indexed) and link it from /for-press ("Find the doors"). Build each table as a CMS collection with `source-url` and `last-checked` on every row. Show "Last checked {date}" on every row. Do not add a row you can't source.

Tables and seed rows:

1. Tourism board media doors: board, country, media page URL, what they ask for (clips, assignment letter, notice period, creator minimums), last checked.
   * Seed: VisitDenmark, Visit Faroe Islands, Visit Norway. Find each official media or press page yourself; record only what the page states. If you can't find a media page, leave the row in draft and flag it.
   * Also seed from research (verify each URL still works): Destination BC visiting journalist program (destinationbc.ca), Visit Pasadena press trip request (visitpasadena.com/media/press-trip-request/), Tourism Squamish media visit form (exploresquamish.com), Visit County Durham media visits (four weeks' notice), Tourism Kelowna creator guidelines (10,000 followers, 2% engagement), Québec Cité creator requests (10,000 per network).
2. Can I take a hosted trip? Outlet policies: outlet, policy, source, last checked. Seed only outlets with a published policy or a reliable report, and cite the source on each row: New York Times, BBC Travel, Washington Post, CNN, Insider (source: travelwriting.substack.com/p/should-we-be-paying-our-own-way-as; prefer each outlet's own ethics page where you can find it).
3. Where press trips get posted: Press Trip Club (private Facebook group), TravMedia (travmedia.com/journalists), Press Trip Pros (presstrippros.com), Travel Massive Marketplace FAM listings, IMM events (travmedia.com/imm), association newsletters.
4. Source-request services: Source of Sources, Qwoted, Featured, SourceBottle, ResponseSource, #journorequest. One line each on what it is best for.
5. Portfolio tools: Muck Rack (free for journalists), Authory (auto-imports bylines), Journo Portfolio, Clippings.me.
6. Associations: SATW (satw.org/join-us), NATJA (natja.org), BGTW (verify criteria on BGTW's own site before publishing), IFWTWA (ifwtwa.org). Dues and criteria only as stated on each site.
7. Newsletters worth the inbox: Talking Travel Writing (Lottie Gross), Media Musings (Cassandra Brooklyn), Jill Schildhouse's Media Insights and Assignments, Be A Travel Writer, WritersWeekly paying markets.
8. Disclosure by market: US, UK, Denmark, with copy-paste lines. Reuse the per-market wording from the existing disclosure badges (US "Ad" or "Hosted by [org]"; UK "Ad" before engagement; Denmark "reklame for [org]" first and "reklamelink" beside each affiliate link). Add a "Not legal advice" line.

Page structure: a one-paragraph intro (DRAFT: "Everything we wish someone had handed us before our first press trip. Checked by a human, dated, sourced."), then a jump list, then the tables with filters by country and type where useful. Add a small "Spot something out of date? Tell the editor" link that opens the existing modal.

## Step 7: PR and host door (kept small and honest)

* Heading (DRAFT): "Hosting travel media?"
* Keep the existing trip form. Add fields: support level (Fully hosted / Partial or media rate / Access only / Paid assignment / Gifted), assignment letter needed (yes/no), deliverables, required disclosure wording, who it suits, response deadline.
* Replace the success message with (DRAFT): "Got it. A human reads every trip within 48 hours and replies either way." Do not say it goes to a list.
* Show the opted-in Press and Creator count from tllStates, or nothing if it's zero.
* Required acknowledgment stays: disclosure at the top, the writer keeps the verdict, including a negative one. Add: "TLL never guarantees coverage."

## Step 8: SEO, AEO and schema

* /for-press title (about 60 characters, DRAFT): "For Press & Creators · Get Found, Disclosed · That Layover Life"; meta description 150 to 160 characters matching the new first screen.
* /press-desk: title and description built around "press trip resources for travel journalists and creators"; schema CollectionPage with ItemList for each table. No FAQPage markup.
* Member profiles with a verified badge and public opt-in: ProfilePage with Person, `sameAs` to their portfolio links and outlet author pages. Profiles stay noindex until the member switches public on.
* Stories with the "Rest of the trip" tag: Article schema with author linked to the member page and `citation` to the commissioned piece.

## Done means

* A change log listing every edit, with before and after screenshots at 1440 and 390.
* Both doors visible on the first screen at both sizes.
* No unsupported claim left on /for-press.
* A test member can request each badge, Nancy can approve or decline from the queue, and the badge renders correctly on /travelers.
* A test story tagged "Rest of the trip" shows the label, the commissioned-piece link and blocks submission when the outlet owns the material.
* /press-desk renders every table with a source and a "last checked" date on every row, and works at 375px.
* Every proposed new field and collection listed separately for Nancy's approval.
* A list of open questions for Nancy and anything you couldn't do.
