CHECK RESULT: /for-press Step 0 report and draft change log, verified 12 Nov 2026

I worked read only. I wrote nothing to Webflow, Memberstack, the repo or git, published nothing, submitted no form, and created no account. Webflow reads used session ses_3Kwnmbq2KBuy8jwu3YowGgTfeNg with agent_id opus-5.5|claude-code|qvtmk. My working files are in /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/chk/. This includes fp375.png, my own screenshot of the live page at 375.

Hosts this machine could not reach (I did not read them): www.visitdenmark.com, visitfaroeislands.com, www.visitnorway.com, www.destinationbc.ca, www.visitpasadena.com, www.exploresquamish.com, www.visitcountydurham.org, www.tourismkelowna.com, www.quebec-cite.com, travelwriting.substack.com, satw.org and bgtw.org. curl got "CONNECT tunnel failed, response 403" and WebFetch got "getaddrinfo ENOTFOUND". www.ftc.gov answered curl with HTTP 404. So I could open none of the eight-plus seed-row URLs. For nine Table 1 rows, plus Talking Travel Writing, I compared the report's quoted text with search-index summaries from WebSearch. Those are not page reads, and every seed row stays unverified.

Overall: 32 claims re-checked. 25 were confirmed as written. 7 were wrong or incomplete, and two DRAFT lines broke the email rule. Section A is the corrected full text. Section B lists every correction with its evidence.

================================================================
A. CORRECTED FULL TEXT
================================================================

STEP 0 REPORT AND DRAFT CHANGE LOG: /for-press rebuild, Creator badge, "Rest of the trip" tag, Press Desk
For Nancy. Prepared 12 Nov 2026, checked the same day. Read only throughout: I wrote nothing to Webflow, Memberstack, the repo or git, and published nothing. Sources: the build prompt (/home/user/thatlayoverlife/claude/tll-for-press-rebuild-press-desk-prompt-2026-11-12.md), the role badges prompt (/home/user/thatlayoverlife/claude/tll-travelers-role-badges-founding100-prompt-2026-11-12.md), two audits and two research passes from today, and repo files cited inline.

SHORT VERSION
1. /for-press works today, but it still promises a "press list" that does not exist. Six lines need to change. There is no call to action on the first screen at 1440, 390 or 375.
2. The "tourism boards trust" line was already replaced on 11 Nov. Four other "list" promises remain and need the same fix.
3. The fields the prompts use (is-press, is-creator) exist, but nothing writes them. The live /edit-profile writes list-press and list-creators. Both prompts should read the same keys.
4. The Stories collection is full (60 of 60 fields), and so is Contributors. Rest of the trip goes in as a Themes item, and the commissioned fields go in Story extras.
5. The eight Press Desk tables fit in one collection, but there is no free slot for it. You must free one in the Designer. I recommend deleting the empty "Comments" collection.
6. I recommend a Memberstack data table for the verification queue, with screenshots in a Cloudflare KV store that deletes them automatically 30 days after your decision. Cost: $0.
7. No Press Desk row could be verified today, because this machine's network blocked every outside source. Zero rows are ready to publish. All 42 rows listed in section 5 stay in draft with a flag.
8. Three things the prompt assumes do not exist yet: the "existing relay", the "existing email flow" and a US/UK "Ad" label.
9. tllStates cannot supply counts, because it is each member's private map record. Counts should come from the Worker's Site stats job.
10. There are 18 open questions at the end, each with a recommendation. Six of them block parts of the build.

----------------------------------------------------------------
(1) STEP 0 ANSWERS

Step 0.1. /for-press at desktop, 390px and 375px, with screenshots
- Screenshots are at deviceScaleFactor 2 in /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/forpress/page/:
  - for-press-1440-firstscreen.png
  - for-press-1440-full.png
  - for-press-375-firstscreen.png
  - for-press-375-full.png
- Page: Webflow page 6a3e5c68288bde39aeeed7de, slug for-press, last updated 2026-11-11T14:54:50Z. https://www.thatlayover.life/for-press and https://that-layover-life.webflow.io/for-press both say "Last Published: Thu Nov 12 2026 11:03:16 GMT", and their body text is identical.
- 1440x900 first screen: the eyebrow "PRESS TRIPS · THE PROS", the H1 "Disclosure at the top, never buried.", the sub, the three rule cards and the top of "What the Press label gets you". There is no call to action. "Register as a Press Traveler →" starts at 1024px and the PR form at 1682px, both below the fold.
- 375x812 first screen: the eyebrow, H1, sub, rule 01 and half of rule 02. The shared "Tell the editor" pill shrinks to a dot that covers the first letter of the rule 02 heading. The pill is a shared component, so I can only propose a fix (see section 7).
- 390x844: no screenshot yet. Measured: the H1 wraps to 2 lines, the register link starts at 1681px and the form at 2350px, so there is no call to action on the first screen at this size either. The before and after screenshots at 390 are part of the build.

Step 0.2. Memberstack fields
App app_cmpdpi625001s0slnhgz17hgs, LIVE, 8 members, 83 custom fields, all with visibility PRIVATE (getCustomFields, getMembersCount).

| Key | Exists | Label (Memberstack) | Note |
|---|---|---|---|
| is-press | yes | "Directory: Press (opt-in)" | Nothing on the live site writes it. Its old editor (script tll-edit-dir-v1) is still in the page. Its mount [data-tll-edit="dir-app"] appears only inside that script's own query, not as an element in the published /edit-profile HTML, so the editor renders nothing. |
| press-verified | yes | "Verified press (editor sets)" | restrictToAdmin true. One of only 3 admin-only fields. |
| is-creator | yes | "Directory: Creator (opt-in)" | Same as is-press: nothing live writes it. |
| roles | yes | "Roles (creator / press)" | Written only by the dead editor. |

What the live /edit-profile writes instead:
- list-press (the "Press" switch) and list-creators (the "Make things" switch). The Worker copies both to Contributors (/home/user/thatlayoverlife/src/profile-sync.js, FIELD_MAP lines 72 to 73, SWITCH_FIELDS line 95).

Existing outlet and links fields:
- affiliation ("outlet / agency")
- roles-press ("Press beats", free text)
- press-sent (date)
- available-for-press
- makes
- monetization
- regions
- languages
- partners (a JSON field for the store and partner links; since 10 Nov it also holds the one portfolio link, src/profile-sync.js lines 237 to 242)
- the URLs: personal-website-url, substack-url, youtube-url, tiktok-url, instagram-url, vimeo-url, linkedin-url, twitter-x-url, strava-url, alltrails-url, komoot-url, garmin-url and beli-url
- the link-* / link-*-on pairs
- links-shown

The Press panel on /edit-profile has three inputs: outlet, role and one "proof" URL. Those three values go to the Webflow CMS (Press applications), not to Memberstack.

Missing compared with this prompt:
- outlets, recent-clips, beats (only the free-text roles-press exists)
- doesnt-cover, audience-markets, notice-period, assignment-style
- portfolio-links (only the single portfolio link inside partners exists), association
- creator-channel, creator-followers, creator-engagement, creator-verified, creator-verified-on
- hosted-travel-policy
- any dietary, access, health or travel-window field

Also missing, for the role badges prompt: location-expert and founding-number.

Step 0.3. How the button and the PR form are wired

"Register as a Press Traveler →"
- A plain Webflow Link, element 1af45b78-ab19-b7db-15ed-8fdec8206139, href "/edit-profile". It has no custom attributes, so no Memberstack attributes, and no plan.
- Memberstack has one plan only, "Traveler" (pln_traveler-l97086o): free, ACTIVE, 8 members. Its after-signup redirect is "/".
- On /edit-profile, "Send for review" posts {outlet, role, proof} with the member's token to the Worker at POST /press/apply (/home/user/thatlayoverlife/src/press-apply.js; routed in /home/user/thatlayoverlife/src/index.js line 70).
- The Worker saves a draft item in the CMS collection "Press applications" (6ae1e636cd32722d8a175cb3). The page itself then writes press-sent to the member from the browser through Memberstack (script part G, src/pages/edit-profile/live-2026-10-28/after/new-js-g.html line 33). The Worker does not write press-sent.
- Nothing is emailed. The file header says "nothing is emailed yet (STATUS S130 is the email item)", and handoff/STATUS.md line 311 lists S130 as open.
- Press applications holds 0 items.

PR trip form
- Webflow form "Press trip" (data-name "press-trip"), element e3528c03-9e19-1354-0262-c4cc8f2e825d. Action empty, Turnstile on.
- It is registered 3 times, once per domain: 6ab15a529857f957ac26b5a6, 6ab15a519857f957ac26b46c and 6ab15a519857f957ac26b332. sendEmailConfirmation is false on all three.
- Fields: organization*, email*, destination-dates*, covered, pitch*, disclosure-accepted*.
- Submissions go to the Webflow form inbox only. No layer, Worker route or CMS write handles them: the page's tll-press-form-v1 is CSS only. All three registrations have 0 submissions.
- Not readable with the allowed tools: whether Webflow emails you on a new submission.
- The CMS collection "Press Trips" (6abcd638b10dc7b4930f6440, 0 items) is not fed by this form.

Step 0.4. Stories tag or category field, and disclosure fields
Stories collection 6a0b29eddc14f1444e935760: 63 items, 61 with status Published, and 60 custom fields plus name and slug. That is the 60-field cap, so no field can be added. The repo notes agree: handoff/CHANGE-LOG-TRUST-CONVERSION-2026-11-11.md, "Decision C. Stories is full: 60 of 60 fields".

Tag and category fields:
- theme: MultiReference to Themes, help text "Tag with one or more themes. Drives Stories feed filter." Themes has 13 items, 5 of them published.
- region: Option.
- pillar-2: Reference to Pillars.
- status: Option (Draft, In Review, Published).

Disclosure fields already exist:
- disclosure (PlainText)
- funding (Option: Self-funded, Hosted by, Gifted by, Sponsored by, Commissioned by TLL). It is set on 0 of 63 items. The backfill sheet is handoff/funding-backfill-2026-11-11.csv.
- sponsor-name-2, labeled "Funding partner" (PlainText)
- sponsor-url (Link)

Two API limits matter here:
- Neither the API nor this session's tools can add an option to an existing Option field. The update-field operation accepts only isRequired, displayName and helpText (raw.githubusercontent.com/webflow/openapi-spec/main/openapi/v2.yml, around line 33711; the session's update_collection_field tool takes the same three).
- The tools cannot rename or delete a collection.

----------------------------------------------------------------
(2) FIELD RECONCILIATION WITH THE /TRAVELERS ROLE BADGES PROMPT

Both prompts must read the same keys and use one badge function. Here is the conflict and my proposal.

A. The opt-in keys
The prompts read is-press and is-creator. The live site writes list-press and list-creators, and only those reach the public Contributors CMS.
- Proposal: the opt-in is (list-press OR is-press) and (list-creators OR is-creator).
- New writes go to list-* only. is-* stays as a legacy key: never renamed, never deleted.
- The expat badge in the other prompt has the same problem (is-expat versus the live list-expats; claude/tll-expat-hub-step0-2026-11-11.md line 152).

B. One badge function, used by /travelers cards and the profile page
- FOUNDER · EDITOR: team. Stays as it is.
- ◆ PRESS ✓: press opt-in AND press-verified is not empty. Filled.
- ✎ CREATOR ✓: creator opt-in AND creator-verified AND creator-followers ≥ 5000. Filled. This badge is new in this prompt.
- ⌂ LOCATION EXPERT · {lives-country}: location-expert, from the other prompt. Filled.
- ⌂ EXPAT · {lives-country}: expat opt-in. Outline.
- ✎ CREATOR: creator opt-in without verification. Outline, no check.
- Priority for the two-badge maximum (proposal): team, Press ✓, Creator ✓, Location Expert, Expat, Creator.

Conflict to settle (open question 2):
- The role badges prompt says: "If is-press is set without press-verified, show CREATOR instead."
- This prompt says an unverified creator gets the outline CREATOR, and says nothing about unverified press.
- My recommendation: unverified press shows no press badge, and shows ✎ CREATOR only if the creator opt-in is also on. Otherwise a journalist who never said they make content would be labeled a creator.

C. Where the public badge data comes from
- Every Memberstack custom field is PRIVATE. A visitor's browser cannot read another member's fields, so the cards must render from the Contributors CMS, which the Worker syncs (profile-sync.js).
- Contributors is also full at 60 fields. Its partners field help text says so: "One field because the collection is at Webflow's 60-field limit".
- Contributors already has list-press, list-creators and press-verified (PlainText), and an editor-only badge-label (PlainText).
- Contributors has no room for creator-verified, creator-followers or creator-verified-on, which the profile needs ("verified on {date}").
- Options are in open question 3. My recommendation: you delete one unused Contributors field in the Designer, and the session adds one Worker-written, editor-only PlainText field "verified-roles". It would hold, for example, "creator|2026-11-20|12400|Instagram", and the layer parses it. One candidate to delete is "Currently In (retired)" (currently-in), whose help text says it was retired on 31 Oct 2026 and must stay empty. The session first checks that it is empty on every item.

D. Other overlaps
- Founding 100 ("Founding 100: {n} claimed") and this prompt's opted-in Press and Creator count both depend on "tllStates". That cannot work as written (section 7). Both counts should come from the Worker's Site stats job.
- The role badges legend (its Step 6) must add Creator ✓. DRAFT legend line: "⌂ Lives there · ✎ Makes things · ◆ Press, bylines checked by the editor · ✎✓ Creator, audience checked by the editor · 🐾 Pets · Nº = one of the Founding 100. Filled badge = checked by TLL."
- One /press-rules page serves both builds (section 7).
- Press card subline, from the other prompt: "up to two outlet names from confirmed bylines". That needs the new outlets field from this prompt, so the outlet names should come from the same data.

----------------------------------------------------------------
(3) WHERE EVERYTHING SHOULD LIVE (40-COLLECTION CAP)

3a. The eight Press Desk tables: one collection, not eight
- The site has exactly 40 collections (get_collection_list, today). Eight new collections would need eight freed slots, which is not realistic.

Recommendation: one collection, "Press Desk rows", slug press-desk-rows, with these fields:
- name (built in): board, outlet, service or market
- slug (built in)
- desk-table (Option, required). It must be created with all 8 options at once, because the API cannot add options later: Tourism board media doors; Can I take a hosted trip; Where press trips get posted; Source-request services; Portfolio tools; Associations; Newsletters; Disclosure by market.
- url (Link): the page the row points to
- source-url (Link, required)
- last-checked (DateTime, required). Shown as "Last checked {date}".
- country (PlainText): used for the country filter
- row-type (PlainText): used for the type filter, for example "creator program", "journalist program", "free for journalists"
- states (PlainText): "what the source states", in the source's own words where it can be quoted
- asks-for (PlainText): clips, assignment letter, notice period, creator minimums. Table 1.
- price-model (PlainText): tables 4, 5 and 6
- copy-paste-line (PlainText): table 8
- check-flag (Option, created complete: ok, unconfirmed, blocked, missing). Editor-only. Only "ok" rows are published.
- sort-order (Number)

How /press-desk shows it: eight Collection Lists on the page, each filtered by desk-table. The country and type filters need a small layer, because Webflow has no native filter control.

Not checked: Webflow's limit on Collection Lists per page. The Webflow documentation hosts were blocked today.

Getting the slot. The tools cannot rename or delete a collection, so you have to act in the Designer. Pick one (open question 4):
- (Recommended) Delete the empty "Comments" collection (6a0cbdad98d2bd496b67c132). It has 0 items, and no Worker code or wrangler.toml setting points at it. The only repo mention is the page list src/pages/pages-2026-10-26.txt. The Memberstack table story_comments already does that job (0 records). Deleting the collection also deletes its template page "Comments Template" (detail_comments, 6a0cbdae98d2bd496b67c14b). Before you delete it, the session confirms that no Designer Collection List is bound to Comments. The session then creates "Press Desk rows" with the exact name and slug, so nothing needs renaming.
- Rename "Press Mentions" (6a0b29ee116b2fe274ef96c6, 0 items, no code) to "Press Desk rows" in the Designer, and change its collection slug to press-desk-rows. The session then adds the fields above and sets the old required fields (publication, logo, link, date) to not required. Cost: you lose a future "as seen in" collection.
- Not recommended:
  - Press Trips: its draft /press-trips page is bound to it, and the opportunity board is explicitly "not in this build".
  - Partners: you will need it once real partners exist.
  - Bookmarks and Photo submissions: already promised to Guides and Photos.
  - Expat Groups: held for the expat hub.

3b. The verification queue: a Memberstack data table (recommended), not the CMS
Proposed table badge_requests. The field types are from the getDataTables fieldCounts:
- member (MEMBER_REFERENCE)
- badge (TEXT_FILTERABLE: press | creator)
- evidence_links (TEXT: up to two clip URLs plus outlet names, or the channel URL)
- claimed_followers (NUMBER)
- claimed_engagement (DECIMAL)
- screenshot_key (TEXT: a pointer only, never the image)
- submitted_on (DATE)
- status (TEXT_FILTERABLE: pending | approved | declined)
- reason (TEXT)
- decided_on (DATE)
- verified_on (DATE)
- recheck_due (DATE: approval plus 12 months)

Rules: create AUTHENTICATED, read AUTHENTICATED_OWN, update ADMIN_ONLY, delete ADMIN_ONLY. Three of these are proven on this site: story_comments uses ADMIN_ONLY for update, and saved_stories and the member trips table both use AUTHENTICATED_OWN for read (the trips table has 15 records). No table on the site uses ADMIN_ONLY for delete yet: story_comments uses AUTHENTICATED_OWN for delete.

Why the Memberstack table:
- It is private by rule. A CMS item can be published by mistake, and the Press applications template page "detail_press-applications" is not a draft (audit 2).
- It uses no collection slot.
- The member can read their own row on /edit-profile, which shows the status and the decline reason with no email (see "email" in section 7).
- It keeps member data in one place.

Costs and limits:
- Approving does not set press-verified or creator-verified by itself. The Worker's existing 30-minute cron (wrangler.toml line 7) would read rows that changed to approved or declined. For approved rows it sets press-verified, or creator-verified, creator-verified-on and creator-followers, through the Memberstack admin key. The existing sync then updates Contributors.
- You work the queue in the Memberstack dashboard, not in the Webflow CMS.
- The data table quota on your Memberstack plan is not verified, because the Memberstack docs were blocked today.

The CMS alternative:
- Extend "Press applications", which is already wired to /press/apply and has 7 custom fields plus name and slug. It would need badge-requested (Option, created complete), status (Option), reason, verified-on and recheck-due.
- The member cannot see their own row without a new Worker read route, and the risk of publishing by mistake stays.

Screenshots, kept private and deleted 30 days after a decision, at $0:
- Store them in a Cloudflare Workers KV namespace.
- On upload, the Worker writes the image under a random key with expirationTtl 90 days, as a safety net if you never decide. On your decision, it rewrites the key with `expiration` set to the decision date plus 30 days. Sources: cloudflare-docs kv/api/write-key-value-pairs.mdx (expiration, expirationTtl); kv/platform/limits.mdx (free tier: 1 GB stored, 25 MiB per value, 1,000 writes per day). Not re-checked today.
- Viewing: only through an owner-only Worker route, with no public URL.
- Limits: images only, a size cap of about 5 MB, and location data (EXIF) stripped.
- I recommend a new namespace (for example EVIDENCE_KV) rather than the Travel Wire's WIRE_KV, so wire code can never list evidence. It is free, but it needs a wrangler.toml change and your deploy.
- Rejected:
  - R2: needs a subscription checkout, and its lifecycle rules delete by object age, not by decision date.
  - Cloudinary: needs a new authenticated preset, and its API secret in the Worker for deletion.
  - Memberstack: data tables have no file type.

3c. "Rest of the trip" on Stories (only add, never rename)
- Stories is full, so no Stories field can be added at all.
- The tag: a new Themes item, name "Rest of the trip", slug rest-of-the-trip, in the existing theme MultiReference. That needs no field change.
  - /home/user/thatlayoverlife/src/intake.js lines 299 to 301 already turn a form field theme-<slug>=true into a Themes reference.
  - The /submit form's five theme checkboxes are hard-coded (theme-alpine-escape, theme-desert-glow, theme-salty-air, theme-sunset-mode, theme-wild-routes), so a sixth checkbox, theme-rest-of-the-trip, is needed.

The commissioned fields go in "Story extras" (6ad997935f308b0209d358b8). It is empty and has 32 custom fields (room for 28 more), including a Story reference. Its ID is already in wrangler.toml line 39. Exact new fields:

| Field slug | Type | Notes |
|---|---|---|
| commissioned-outlet | PlainText | |
| commissioned-url | Link | |
| commissioned-date | DateTime | Shown as month and year only |
| other-coverage-1-outlet | PlainText | |
| other-coverage-1-url | Link | |
| other-coverage-2-outlet | PlainText | |
| other-coverage-2-url | Link | |
| other-coverage-3-outlet | PlainText | |
| other-coverage-3-url | Link | |
| outlet-owns-material | Option, created complete | "No, it's mine", "Not sure", "Yes" |

Webflow has no repeatable field type, so I propose three fixed pairs. The alternative is one PlainText field with "outlet | URL" lines parsed by the layer (open question 16).

The story template shows these through a Collection List of Story extras filtered to the current story. The Story extras template stays noindex, with its redirect (handoff/NEXT-SESSION-2026-10-21.md line 99).

----------------------------------------------------------------
(4) DRAFT CHANGE LOG, STEPS 1 TO 8
Copy marks:
- [DRAFT] = a line I wrote, for your approval.
- [Nancy] = your own line from the prompt. Some of these were marked DRAFT there; they are still yours to approve.
- Unmarked copy is existing live text.

Every row is a Webflow draft change or staged code. Nothing is published before you approve. Each row gives the element, then before, after, how it is built, and what could break.

STEP 1. Remove what cannot be backed
1.1 Middle card of "What the Press label gets you". String 1af45b78-ab19-b7db-15ed-8fdec8206129.
- Before: "A disclosure standard written so a compliance team can say yes. Read all seven rules in two minutes →". The "tourism boards trust" line it replaced has been gone since 11 Nov (handoff/CHANGE-LOG-TRUST-CONVERSION-2026-11-11.md item 17).
- After: either keep the card as it is (recommended: it makes no partner claim and links to /editorial-charter), or remove the card as the prompt says (open question 8).
- How: an element edit in the Designer draft.
- What could break: the three-card grid becomes two cards. "seven rules" is checked: /editorial-charter has seven numbered rules today. Its rule 3 reads "Read by a human within 48 hours, then published", so it is tied to open question 7.

1.2 H2 e3528c03-9e19-1354-0262-c4cc8f2e823e (class tllpr-h2; its text node is e3528c03-...-823d).
- Before: "One form, the whole press list."
- After: "Hosting travel media?" [Nancy].
- How: a text edit; the class is kept.
- What could break: nothing known.

1.3 Paragraph e3528c03-9e19-1354-0262-c4cc8f2e8240 (class tllpr-sub).
- Before: "Submit a hosted trip once and every registered Press Traveler who opted in receives it. It only goes to travelers who asked for press trips. Nobody's inbox gets scraped."
- After: "Tell us about the trip. A human reads every one and replies either way." [DRAFT]
- How: a text edit.
- What could break: nothing known.

1.4 Note block e3528c03-9e19-1354-0262-c4cc8f2e8265 (class tllpr-note).
- Before: "Goes to opted-in Press Travelers only. A human reviews every trip within 48 hours. Your details are used only to reply about this trip."
- After: "A human reads every trip. Your details are used only to reply about this trip." [DRAFT] Whether to keep the 48 hours depends on open question 7.
- How: a text edit.
- What could break: nothing known.

1.5 Success block e3528c03-9e19-1354-0262-c4cc8f2e825f (text node e3528c03-...-8260).
- Before: "Received. An editor reads it within 48 hours and, if it passes, shares it with the opted-in press list. You get a reply either way."
- After: "Got it. A human reads every trip within 48 hours and replies either way." [Nancy]. Depends on open question 7.
- How: a text edit. This is a hidden state, so it is checked in the draft by forcing it visible.
- What could break: the promise relies on Webflow notifying you, which is not verified (section 7).

1.6 Consent line, String eae05ca5-bf8d-aea1-e44b-3ebd1e7117d3.
- Before: "By registering as a Press Traveler you accept that partners can send you press-trip offers through TLL. Withdraw any time from Edit profile or by emailing hello@thatlayover.life."
- After: "You choose what shows on your public profile. Change it any time from Edit profile." [DRAFT]
- How: a text edit.
- What could break: nothing. No sending mechanism exists, so removing the claim loses nothing.

1.7 Page JSON-LD description. See 8.3.

1.8 Count of Press Travelers: none on the page today (window.tllStates is undefined on /for-press). No change.

STEP 2. First screen with two doors (1440x900 and 390x844)
2.1 Eyebrow e3528c03-9e19-1354-0262-c4cc8f2e8224 (class tllpr-eyebrow).
- Before: "PRESS TRIPS · THE PROS".
- After: "For press & creators" [Nancy].
- How: a text edit; the CSS keeps the uppercase.
- What could break: nothing.

2.2 H1.
- Before: "Disclosure at the top, never buried."
- After: "Your bylines live elsewhere. The rest of the trip lives here." [Nancy].
- How: a text edit.
- What could break: the current H1 is 2 lines at 390 and 3 at 375, so the longer H1 may wrap to 3 or 4 lines at 390. The type size step is checked against the first-screen budget.

2.3 Sub.
- Before: "Press travelers welcome. Hosted trips and gifted stays are welcome here. They get labeled at the top, which is where your compliance team wants them anyway."
- After: "A free profile PRs and editors can actually read, a home for the stories your editor cut, and the doors to the next trip." [Nancy].
- How: a text edit.
- What could break: nothing.

2.4 New block of three rows under the sub. Each row is a link to its section.
- "Get found": "A free profile with your outlets, beats and clips, and a badge the editor checked." [DRAFT sentence; label Nancy's] → #get-found
- "File the rest": "Publish the parts of the trip your commissioned piece left out, with a link to the original." [DRAFT sentence; label Nancy's] → #file-the-rest
- "Find the doors": "Tourism board media pages, outlet policies, associations and disclosure lines, each one sourced and dated." [DRAFT sentence; label Nancy's] → /press-desk, or #find-the-doors, which links on to /press-desk
- How: new Designer elements using existing tllpr-* classes, plus new section IDs.
- What could break: the 390x844 budget. Eyebrow, H1, sub, three rows and two buttons is tight, so the rows go to one line each at 390.

2.5 Two buttons.
- "I make travel media" [Nancy]: signed out, it opens the existing Memberstack sign-up and returns to /edit-profile#press. Signed in, it goes to /edit-profile#press.
- "I host travel media" [Nancy]: anchors to the PR section (#host).
- How: Designer links. The signed-in versus signed-out choice uses the existing Memberstack data-ms-content pattern, or a small layer.
- What could break: the Traveler plan's after-signup redirect is "/", so the return to /edit-profile#press needs a redirect setting on the button or a small layer. Tested on a test member first. The existing "Register as a Press Traveler →" link (1af45b78-...-6139) stays lower on the page, which leaves two routes to one place. I recommend keeping it, relabeled "Register as press or a creator →" [DRAFT], with its href unchanged.

2.6 The three disclosure rules: unchanged, moved to sit directly below the first screen.
- What could break: the rose "Tell the editor" dot covers rule 02's heading at 375. It is a shared component, so the fix is listed as a proposal only (section 7).

STEP 3. Registration, press and creators (/edit-profile; layer chunks/edit-profile.js plus the Worker)
3.1 Copy block "Which badge fits you", in the Directories section and mirrored on /for-press #get-found. All three lines are [Nancy]: the Press ✓ line, the Creator ✓ line and the "Not there yet?" line, exactly as in the prompt.

3.2 Press panel.
- Before: Outlet, Your role, and one "Press card or two published pieces" URL. Send for review posts to /press/apply.
- After:
  - outlets: up to 3 rows of name and URL
  - recent-clips: exactly 2 rows of title, outlet, month and URL. The help line reads "On the outlet's own site" [DRAFT].
  - beats: the fixed list of 14
  - doesnt-cover, audience-markets (top 3 countries), languages (the existing field), notice-period, assignment-style, portfolio-links and association
  - a per-field "Show on my profile" switch
- Send for review creates a badge_requests row (badge press).
- How: layer code plus a new Worker route, POST /badge/request, which checks the token, rate-limits, writes the row and keeps writing the Press applications draft until you choose (open question 5).
- What could break: /edit-profile is large and shared with the role badges and expat builds, so the WEBFLOW-LOCK log must be checked. press-sent must keep working; it is written by the page's script part G after /press/apply answers.

3.3 Creator panel, new.
- Fields: creator-channel (platform plus URL), claimed followers, claimed engagement, insights screenshot (image only, taken within the last 30 days) and a "Send for review" button.
- Helper line: "The screenshot is private. Only the editor sees it, and it is deleted 30 days after the decision." [DRAFT]
- Decline reason the editor can pick: "Your screenshot is too old. Send one from the last 30 days." [DRAFT]
- How: the layer posts a multipart request to the Worker, which saves to KV and writes the row.
- What could break: the "under 30 days" age cannot be proven from a file. The editor checks the date shown in the screenshot, so the "too old" line is a decline reason, not an automatic check.

3.4 Status line on /edit-profile, from the member's own row.
- "Pending. The editor checks every request." [DRAFT]
- "Approved {month year}." [DRAFT]
- "Not approved: {reason}" [DRAFT]
- How: the layer reads the data table with AUTHENTICATED_OWN.
- What could break: nothing known. This replaces the "email flow" that does not exist.

3.5 Badges on /travelers and the profile page. Built once, in the role badges build, using the function in section 2B. This build adds Creator ✓ and the profile line "{n} followers on {platform}, verified {month year}" [DRAFT]. Source: Contributors (section 2C).

STEP 4. Editor verification queue
4.1 The Memberstack data table badge_requests (section 3b). How: created by a session after your approval. What could break: the plan quota is unknown.

4.2 Worker cron step.
- For approved rows: set press-verified, or creator-verified, creator-verified-on and creator-followers; set recheck_due; set the screenshot expiration to the decision plus 30 days.
- For declined rows: set the screenshot expiration only.
- How: a new step in the existing 30-minute job. It needs your deploy.
- What could break: the Memberstack admin write path is new code, so it is tested on a test member first.

4.3 Re-check due. Rows past recheck_due are listed for you to re-check. A badge is not removed automatically: you decide.

4.4 Draft page /press-rules. Shared with the role badges build: whichever build runs first creates it, and the second extends it.
- Sections, each with an anchor: #press, #creator, #location-expert, #removal, #appeal.
- Draft lines:
  - "Press ✓ means the editor read two published pieces on the outlet's own site." [DRAFT]
  - "Creator ✓ means the editor saw an insights screenshot showing 5,000 or more followers or subscribers on one channel and 2% or higher engagement, from the last 30 days." [DRAFT]
  - "A badge can be removed if the work or the numbers no longer match, or if a story breaks the disclosure rules." [DRAFT]
  - "To appeal, send a note through Tell the editor with the words Badge appeal." [DRAFT]
- How: a new static page, kept as a draft and noindex until you approve.
- What could break: both builds creating it. The WEBFLOW-LOCK log entry decides who goes first.

STEP 5. "Rest of the trip" tag
5.1 Themes: a new item "Rest of the trip" (slug rest-of-the-trip).
- How: a CMS item create.
- What could break: publishing it creates /themes/rest-of-the-trip and adds a chip to the Stories feed filter (theme help text). Decide whether you want both.

5.2 /submit form "Story submission".
- Add the checkbox theme-rest-of-the-trip, labeled "Rest of the trip" [Nancy].
- When it is ticked, show:
  - commissioned-outlet, commissioned-url, commissioned-date (month and year)
  - other coverage (3 pairs)
  - the required "Does your outlet own this material?" question [Nancy], with the options "No, it's mine" / "Not sure" / "Yes" [Nancy]
  - the rule "Never republish the commissioned piece. Publish after it runs." [Nancy]
- "Yes" blocks the submit with "Then it stays with them. Tell us the part that didn't make the edit instead." [Nancy]
- "Not sure" shows "Check your contract before you send this. We keep the story as a draft until you tell us it is yours to publish." [DRAFT]
- How: the existing "Story form extras v1" inline script or the Designer. The block runs before Webflow records the form, using the same pattern as endCheck in /home/user/thatlayoverlife/src/site-layers/tll-intake-v1.js (line 33).
- What could break: the theme checkboxes are hard-coded (5 today). The new inputs change the form schema, though old submissions are kept.

5.3 Worker /intake (src/intake.js).
- Refuse the draft when outlet-owns-material is "Yes".
- When it is "Not sure", set status Draft rather than In Review.
- Create a Story extras item with the commissioned fields.
- How: Worker code; needs your deploy.
- What could break: /intake today maps none of the disclosure answers, so this is new code on a live route.

5.4 Story page, under the disclosure line.
- "The commissioned piece: {outlet}, {month year} →" [Nancy pattern], as a normal link with no nofollow.
- Under it, "More from this trip:" [DRAFT], followed by the other coverage links.
- How: a Collection List of Story extras on the story template, filtered to the current story.
- What could break: the story template is busy, so its position next to the funding chip (chunks/story.js lines 197 to 203) needs a check.

5.5 Story card label "Rest of the trip" [Nancy].
- How: a layer, or a theme-bound element on the card lists (home, stories, countries).
- What could break: the cards may not expose themes today; this needs a check.

5.6 Copy rule: no line anywhere promises a PR or host that a story will appear.

STEP 6. The Press Desk
6.1 The collection "Press Desk rows" (section 3a). It needs your Designer action first.

6.2 New page /press-desk, kept as a draft until rows pass.
- Intro: "Everything we wish someone had handed us before our first press trip. Checked by a human, dated, sourced." [Nancy]
- A jump list of the 8 tables.
- 8 Collection Lists, with "Last checked {date}" [Nancy] and a source link on every row.
- Empty state: "Rows appear here once a human has read the source." [DRAFT]
- Table 8: "Not legal advice. Rules change; check the current guidance for your market before you post." [DRAFT]
- How: a new page in the Designer, plus a filter layer for country and type.
- What could break: at 0 verified rows the page is empty. The per-page list limit is unverified. It must work at 375 (tables become stacked cards).

6.3 "Spot something out of date? Tell the editor" [Nancy].
- How: a small layer that sets #tll-note[data-open="true"] or clicks .tll-note-pill, because the modal has no outside hook (audit 1, section 7).
- What could break: if the shared component changes, the hook breaks.

6.4 /for-press "Find the doors" links to /press-desk.

STEP 7. PR and host door
7.1 Heading. See 1.2.

7.2 New fields on the "Press trip" form (existing names kept, fields added):
- support-level (select: Fully hosted / Partial or media rate / Access only / Paid assignment / Gifted) [Nancy options]
- assignment-letter-needed (select: Yes / No)
- deliverables (textarea)
- disclosure-wording (text)
- who-it-suits (text)
- response-deadline (date)
- Optional: the organization placeholder "e.g. Visit Faroe Islands" becomes "e.g. your board or agency" [DRAFT], so the form does not appear to name a board that works with TLL.
- How: Designer form edits on the draft. All three registrations update when published.
- What could break: there are 0 submissions today, so nothing is lost. Turnstile stays.

7.3 Acknowledgment.
- Kept: "I understand the story will carry a disclosure at the top and the writer keeps the verdict, including a negative one."
- Added: "TLL never guarantees coverage." [Nancy]

7.4 Success message. See 1.5.

7.5 Opted-in Press and Creator count.
- "{n} press and creators with checked badges" [DRAFT], shown only when n > 0.
- How: Site stats fields written by the Worker job (section 7, counts). Hidden at 0, which is what you will see today: Press applications has 0 items.
- What could break: until the fields exist, nothing shows. That is correct.

STEP 8. SEO, AEO and schema
8.1 /for-press title.
- Before: "For Press · Hosted and Gifted Trips, Always Disclosed · TLL".
- After: "For Press & Creators · Get Found, Disclosed · That Layover Life" [Nancy], 63 characters.

8.2 /for-press meta description.
- Before: "Credentialed, disclosed, accountable. Press travelers welcome. Every hosted or gifted trip labeled at the top of the story, never buried in a footnote."
- After: "A free profile PRs and editors can read, a home for the parts of the trip your editor cut, and sourced, dated press trip resources. Disclosure at the top." [DRAFT], 154 characters.
- og:title (today "For Press · That Layover Life"): "For Press & Creators · That Layover Life" [DRAFT].
- og:description and twitter:description (today "Credentialed, disclosed, accountable. Disclosure at the top of every story, never buried."): "Free profiles for travel journalists and creators, a home for the rest of the trip, and the doors to the next one." [DRAFT]

8.3 /for-press JSON-LD description.
- Before: "Credentialed, disclosed, accountable. Tourism-board and brand reach, a citable bylined feature with schema, disclosure-first so the trust stays intact."
- After: the same text as the meta description [DRAFT].
- What could break: the old text claims a reach that does not exist, so it must change in the same edit.

8.4 /press-desk.
- Title: "Press Trip Resources for Travel Journalists and Creators · TLL" [DRAFT], 62 characters.
- Description: "Press trip resources for travel journalists and creators: tourism board media pages, outlet policies, associations and disclosure lines. Sourced and dated." [DRAFT], 155 characters.
- Schema: CollectionPage with one ItemList per table, built by a layer from the rendered rows, because page code cannot loop over CMS lists. No FAQPage.
- What could break: crawlers read JSON-LD injected by a script less reliably.

8.5 Member profiles (Contributors template).
- ProfilePage plus Person, with sameAs set to the public portfolio and outlet author links. Only for a verified badge with public opt-in. noindex until the member sets visibility Public.
- How: template head code bound to Contributors fields.
- What could break: the template's current robots handling was not read today, so it is checked before the edit.

8.6 Stories tagged Rest of the trip.
- Article schema with an author link to the member page and a citation to the commissioned piece.
- What could break: the citation lives in Story extras, which the Stories template head cannot bind, so a layer adds it.

----------------------------------------------------------------
(5) SEED ROWS

Rows that passed research: 0. Nothing is ready to publish.
- Every outside host was refused by this machine's proxy (HTTP 403 to CONNECT, "policy denial"), or WebFetch refused it (ENOTFOUND). A second check on 12 Nov got the same result for all nine Table 1 hosts, travelwriting.substack.com, satw.org and bgtw.org.
- www.ftc.gov answered but blocked automated reads (Akamai 403 and a fake 404; curl got 404 again on the second check).
- What the researchers have is search-index summaries. They point at the right pages, but they are not page reads.
- Under the prompt's own rule ("Do not add a row you can't source"), all rows stay in draft, flagged, until the host is allowed or someone checks the page by hand.

Rows to look at, all flagged (last checked 12 Nov 2026):

Table 1, tourism board media doors (all "blocked")
- VisitDenmark: https://www.visitdenmark.com/press/work-us. Search summary: requests are reviewed case by case, weighing circulation, availability and budget, with priority to nine core markets. No hotel payment for individual press visits. Other VisitDenmark documents count 10 or 14 markets, so the count must be read on the page. No clips rule, assignment letter or follower minimum seen.
- Visit Faroe Islands: the index shows https://visitfaroeislands.com/en/toolbox/for-press-professionals/press-trips-collaborations and https://visitfaroeislands.com/en/press-professionals/press-room/for-the-press/press-trips. The path first given here (/en/press-professionals/toolbox/...) appears in neither, so the canonical path is unknown. Search summary: enquiries go to an email address and should include "copies of previous articles". The "commission letter from an editor or similar" line was not found in the second search.
- Visit Norway: https://www.visitnorway.com/media-centre/press-pr/ for "at least one month prior". The line "one or more commissions agreed upon before you travel" comes from a different page, https://www.visitnorway.com/contact/media-assistance/.
- Destination BC: https://www.destinationbc.ca/what-we-do/marketing/travel-media/. Flag: the summaries describe a program for BC tourism businesses and DMOs, not one journalists apply to. The current criteria are in the 2026 request form (https://www.destinationbc.ca/content/uploads/2026/03/North-America-Visiting-Journalist-Program-Request-Form-2026.pdf), so use that rather than the 2018 and 2023 documents.
- Visit Pasadena: https://www.visitpasadena.com/media/press-trip-request/. Search summary: 4 to 6 weeks' notice, and samples of recent travel stories from the past 3 to 6 months "sent with an email or letter". An assignment letter was not confirmed.
- Tourism Squamish: the circulation rule ("minimum circulation of 25,000") is in the PDF form https://www.exploresquamish.com/site/assets/files/20802/tourismsquamishmediavisitrequestform.pdf, not on https://www.exploresquamish.com/page/media/. The PDF's age is unknown.
- Visit County Durham: https://www.visitcountydurham.org/media-visits/. Search summary: requests "at least four weeks before the trip"; freelancers send "two recently published travel-related pieces", and a commission must be lined up. The word "cuttings" was not confirmed. This matches your prompt but is unconfirmed.
- Tourism Kelowna: https://www.tourismkelowna.com/contact/media/content-creators-influencers/guidelines/. Search summary: 10,000 followers and 2% engagement, for non-local creators; 4 to 6 weeks' notice preferred. The "no high-season requests" note was not found in the second search. This matches your prompt but is unconfirmed.
- Québec Cité: https://www.quebec-cite.com/en/medias/influencers-request. Search summary: 10,000 per network, engagement benchmarks of 3% (10k to 100k) and 1.5% (100k to 1M), and four weeks' notice. Flag: the journalists page cites a separate 200,000-reach rule.

Table 2, outlet hosted-trip policies (5 rows)
- New York Times, BBC Travel, Washington Post and Insider: "blocked". Search leads exist, but none is a page read. Source article named in the prompt: travelwriting.substack.com/p/should-we-be-paying-our-own-way-as, also "blocked".
- The BBC lead came from an unofficial mirror, so it cannot be cited. Note also that BBC Travel on bbc.com may run under BBC Studios commercial rules, not the public-service guidelines.
- CNN: "missing". No policy was found.

Table 3, where press trips get posted (6 rows)
- Press Trip Club: "missing". No trace was found, so I need your link.
- TravMedia, Press Trip Pros, Travel Massive Marketplace, IMM and the association newsletters: "blocked".

Table 4, source-request services (6 rows)
- Source of Sources, Qwoted, Featured, SourceBottle and ResponseSource: "blocked". Featured's pricing leads conflict.
- #journorequest: "unconfirmed". Its only sources are Vuelio marketing posts.

Table 5, portfolio tools (4 rows)
- Muck Rack, Authory, Journo Portfolio and Clippings.me: "blocked". Prices conflict across secondary sources.

Table 6, associations (4 rows)
- SATW, NATJA, BGTW and IFWTWA: "blocked".
- SATW's fees conflict across categories, so none can be quoted. BGTW, which your prompt says to verify on its own site, could not be opened.

Table 7, newsletters (5 rows)
- Talking Travel Writing: "blocked". Flag: the search index shows two founders (Lottie Gross and Steph Dyson), while your prompt credits one.
- Media Musings and Jill Schildhouse's newsletter: "blocked".
- Be A Travel Writer: "unconfirmed".
- WritersWeekly: "missing".

Table 8, disclosure by market (3 rows)
- US: FTC "blocked" (FTC blocks automated reads, so it needs a manual check); eCFR "blocked".
- UK: ASA/CAP and CMA "blocked". The index reports a new joint guide in October 2026, which must be read first.
- Denmark: Forbrugerombudsmanden "blocked". The word "reklamelink" was not found in any lead.

What it takes to clear the rows: allow the hosts listed in research 2's "What to do next" in this environment's network settings (your approval), or check them by hand in a normal browser.

----------------------------------------------------------------
(6) NEW FIELDS AND COLLECTIONS FOR YOUR APPROVAL (none created)

Memberstack custom fields, new. Nothing existing is renamed.
- outlets (JSON text: up to 3 {name, url})
- recent-clips (JSON text: 2 {title, outlet, month, url})
- beats (comma list from the fixed 14). The existing free-text roles-press is left untouched.
- doesnt-cover (text, 120 characters)
- audience-markets (up to 3 country codes)
- notice-period (2 weeks / 4 weeks / 6+ weeks)
- assignment-style ("Usually commissioned before the trip" / "Usually after" / "Varies")
- portfolio-links (JSON text: up to 4 URLs). The single portfolio link inside partners stays as it is.
- association (JSON text: {name, member page URL})
- creator-channel (JSON text: {platform, url})
- creator-followers (admin-only: the verified number, not the member's claim)
- creator-engagement (admin-only, percent)
- creator-verified (admin-only)
- creator-verified-on (admin-only, date)
- hosted-travel-policy (private, never synced)
- profile-shows (JSON text: which of the fields above are public)
- languages: reuse the existing field, no new one.
- The dietary, access and health notes and the travel windows: I recommend not adding them in this build (section 7).
- From the role badges prompt, for one approval with that build: location-expert (admin-only) and founding-number (admin-only, unique).
- Not verified: the Memberstack custom-field limit on your plan. There are 83 fields today, and the docs were blocked.

Memberstack data table, new: badge_requests (section 3b).

Webflow collection, new: "Press Desk rows" (section 3a). It needs your Designer action first: delete Comments, or rename Press Mentions.

Webflow fields, new:
- Story extras: commissioned-outlet, commissioned-url, commissioned-date, other-coverage-1/2/3-outlet and -url, outlet-owns-material (Option).
- Contributors: one field, verified-roles (PlainText, Worker-written). Only if you free a field; see open question 3.
- Site stats (6ae602821fa37291336b5680): press-checked-count, creators-checked-count and founding-claimed-count (Number). Site stats has 5 custom fields today (stories, travelers, pets, countries, counted-at), so all three fit.

Webflow CMS item, new: Themes "Rest of the trip".

Form fields, new:
- Press trip: support-level, assignment-letter-needed, deliverables, disclosure-wording, who-it-suits, response-deadline.
- Story submission: theme-rest-of-the-trip, commissioned-outlet, commissioned-url, commissioned-date, other-coverage-*, outlet-owns-material.

Pages, new: /press-desk, and /press-rules (shared with the role badges build).

Worker, new (needs your deploy):
- routes POST /badge/request and GET /badge/evidence/{key} (owner only)
- a cron step for decisions
- the site-stats counts
- the /intake changes
- a KV namespace EVIDENCE_KV

----------------------------------------------------------------
(7) CONFLICTS AND RISKS

Claims that cannot be backed
- On the page today:
  - "shares it with the opted-in press list" (success message)
  - "Goes to opted-in Press Travelers only" (note)
  - "partners can send you press-trip offers through TLL" (consent line)
  - "Tourism-board and brand reach" (JSON-LD)
  - "every registered Press Traveler" (sub)
  - "seven rules": now checked; /editorial-charter has seven rules.
- In the prompt itself:
  - "Contact goes through the existing relay": there is no relay. It was removed from /contact on 9 Nov (claude/tll-cc-blockers-2026-11-09.md section 6; /contact today has only mailto links). The Memberstack field contact-relay-on and the Contributors contact-mode option "Relay" (still the stated default) remain, but nothing sends.
  - "Declining sends the member the reason through the existing email flow": no email flow exists (src/press-apply.js header; STATUS S130).
  - "Reuse the per-market wording from the existing disclosure badges (US 'Ad' ... UK 'Ad')": the site has no "Ad" label anywhere. Only "Hosted by", "Gifted by", "Reklame · Sponsored by", "Reklame for" and "reklamelink" exist (/home/user/thatlayoverlife/src/site-layers/tll-trust-v1.js lines 33 to 38; tll-pros-v1.js lines 30 to 31; tll-series-v1.js lines 76 to 78). Denmark uses two wordings at once.
  - "Press Desk ... indexed from day one": with 0 sourced rows, the page would be empty.

"Every count comes from tllStates"
- tllStates is each member's own map record (places and states) in their private Memberstack JSON. Sources: src/map-merge.js line 4; claude/COUNT-RULES-2026-10-19.md section 1, "Each member's map is the only source ... only the map editor (/the-map) writes to it".
- It holds no roles and no other member's data, so it cannot count press, creators or Founding 100 numbers.
- Where site counts really come from:
  - The Worker's 30-minute job (src/site-stats.js). It counts the live CMS and writes one Site stats item (ids in wrangler.toml lines 43 to 44), which the footer binds to.
  - The matching browser script tll-live-counts (the footer today: 54 countries, 57 stories, 6 travelers, 1 pet).
- Recommendation: read the rule as "never typed, always computed by the site". Add the press, creator and Founding counts to that job, counted from Contributors (list-press plus press-verified, and so on). Show nothing at 0.

The 48-hour promise
- It appears in at least ten places on four pages, plus one profile fallback:
  - /for-press: the press label card, "A human reviews within 48 hours", the form note and the success message
  - /edit-profile: "Reviewed within 48 hours" (4 times in the HTML)
  - /travelers: "Reviewed by a human within 48 hours", "Reviewed within 48 hours, edited lightly" and "Switch on Press, an editor reviews within 48 hours"
  - /editorial-charter: rule 3, "Read by a human within 48 hours, then published"
  - the profile page shows "REVIEWED WITHIN 48 HOURS" when Press verified is empty (per the Contributors press-verified help text; not checked on a live profile)
  - /submit layers also carry "within 48 hours" lines (src/site-layers/chunks/submit.js)
- What it rests on:
  - Press applications email nobody (S130 is open).
  - Whether Webflow emails you on a "Press trip" submission could not be read. sendEmailConfirmation false controls the sender's copy; the notification setting is not in the API I could use.
  - You are one editor.
- Keeping it means checking the Webflow inbox, the CMS and the Memberstack queue every two days, including when you travel.
- Recommendation: drop the number until you confirm notifications are on, then decide (open question 7). Whatever you decide applies to every place above, the charter included.

/press-rules, shared with the /travelers build
- It does not exist today: it answers 404 on www and the test site, and list_pages shows no such slug.
- One page, one slug, with anchors for each badge. The first build to run logs it in handoff/WEBFLOW-LOCK.md, and the second only extends it.
- The role badges legend links "checked" to it, so the two copies of the thresholds must match.

Privacy of travel windows and dietary or health notes
- Where they would be stored so they are never public: Memberstack custom fields only (visibility PRIVATE). Never added to FIELD_MAP or MEMBER_WRITABLE in src/profile-sync.js, so never synced to Contributors. Never written to the queue or the CMS. Never used in a public layer.
- Health and access notes are special-category data under GDPR (TLL is in Copenhagen).
- Nothing in this build uses them: the opportunity board and outreach are out of scope.
- Recommendation: do not collect them yet. Add them with explicit consent copy when the board exists (open question 10).
- Travel windows, if they are ever added: month and region only, as the prompt says.

Other risks
- Both Stories and Contributors are at 60 fields. Any future field means deleting one.
- Option fields cannot gain options through the API, so every Option must be created complete, or edited by you in the Designer.
- Screenshots are easy to fake, so the badge text says "checked by the editor", not "audited". After the 30-day deletion only the numbers and the date remain. That is intended.
- "Engagement" is calculated differently on each platform. /press-rules needs one definition (open question 17).
- The "Tell the editor" dot covers rule 02's heading at 375. It is a shared component, so this is a proposal only: move the dot 8px lower, or under the heading line, on small screens.
- Parallel work: /edit-profile, /travelers and /press-rules are touched by other builds. Every write is logged in handoff/WEBFLOW-LOCK.md first.

Anything that needs an account or money
- Decline and reply emails: a mail service account (Resend or Postmark, possibly free tier), plus DNS records at GoDaddy beside Microsoft 365, plus an SPF change (STATUS S130). Not needed if decisions show on /edit-profile.
- Worker changes: your deploy.
- EVIDENCE_KV: free, but created in your Cloudflare account.
- Memberstack data table quota on your plan: unknown.
- Verifying the Press Trip Club row needs a Facebook account in the group.
- Travel Massive listings are paid (lead: $89 per listing). Paying is not needed to list them.
- The network allowlist change for the research hosts needs your approval.
- No R2, Cloudinary or new subscription is needed in my recommendation.

----------------------------------------------------------------
(8) OPEN QUESTIONS (options, then my recommendation). Questions marked "blocks" stop part of the build until you answer them.

1. Opt-in keys (blocks Steps 3 and 5 of both builds): read is-*, list-*, or both? Recommend: both (list-* OR is-*), writing list-* only.
2. Unverified press badge: show CREATOR (role badges prompt), show nothing, or show CREATOR only if the creator opt-in is on? Recommend: the last.
3. Public home for creator verification (blocks the Creator ✓ render): (a) you delete one unused Contributors field (candidate: the retired currently-in) and the session adds verified-roles; (b) reuse Contributors press-verified for both roles; (c) a Worker JSON endpoint read by the layer, with no CMS field. Recommend (a). Fallback (c).
4. Press Desk slot (blocks Step 6): delete Comments, rename Press Mentions, or use Press Trips. Recommend: delete Comments (and its template page) after the session confirms no list is bound to it.
5. Queue (blocks Step 4): Memberstack table or Press applications CMS. Recommend: the Memberstack table. /press/apply keeps writing its CMS draft until the table is proven, then stops.
6. Telling members the decision: on /edit-profile at $0, or by email (account plus DNS). Recommend: /edit-profile now, email later with S130.
7. The 48 hours: keep, drop the number, or "usually within two working days". Recommend: drop it until notifications are confirmed, everywhere it appears (section 7).
8. The compliance card (Step 1): keep it (it is backed by /editorial-charter, which has seven rules) or remove it as the prompt says. Recommend: keep.
9. "tllStates" counts (blocks 7.5 and Founding 100): accept Site stats from the Worker job as the source? Recommend: yes.
10. Dietary, access, health and travel windows: collect now as private fields, or defer. Recommend: defer.
11. /press-desk going live (blocks the Step 6 publish): allow the research hosts in this environment, or check by hand; publish only when table 1 has at least 3 "ok" rows. Recommend: allow the hosts, and you check ftc.gov by hand.
12. US and UK wording: add "Ad ·" before Hosted by and Gifted by on the site, or leave the site alone and quote official lines on the Press Desk only. Recommend: Press Desk only for now. Decide the site chip after the October 2026 UK guidance is read.
13. Danish copy-paste line: "Reklame for [org]" or "Reklame · Sponsored by [org]". Recommend: "Reklame for [org]", as in your prompt.
14. Press Trip Club link and a CNN source: can you send them? Without them, both rows stay out.
15. Publish the "Rest of the trip" theme page and filter chip: yes or no. Recommend: yes, because the filter is the point of a tag.
16. Other coverage: 3 fixed pairs or one text field. Recommend: 3 fixed pairs.
17. Engagement definition: the platform's own insights figure, or interactions divided by followers. Recommend: the platform's own figure, named in /press-rules.
18. 375 versus 390: the prompt uses both. Recommend: screenshot 375, 390 and 1440 for the change log.

Couldn't do in this pass:
- Read any outside source page (blocked hosts listed in research 1 and 2, and in this check).
- Read Webflow form notification settings or webhooks.
- Read Memberstack plan limits.
- Read Webflow's own limit pages.

================================================================
B. CORRECTIONS, WITH EVIDENCE
================================================================

House-rule corrections to DRAFT lines
1. 1.6 consent line DRAFT ended "...or email hello@thatlayover.life." That proposes a public email address. I removed it: "You choose what shows on your public profile. Change it any time from Edit profile." Evidence: the build prompt's Rules section says "Never publish a public email address" and "Contact goes through the existing relay".
2. 4.4 appeal DRAFT said "reply to the decision on your Edit profile page or email hello@thatlayover.life...". This also proposed a public email. It also promised a reply feature that 3.4 does not include, because 3.4 is a read-only status line. Corrected: "To appeal, send a note through Tell the editor with the words Badge appeal."
3. 3b used the table key "trip_ledger", which contains the banned word "ledger". I reworded it as "the member trips table" and added saved_stories, which uses the same AUTHENTICATED_OWN read rule (getDataTables: saved_stories readRule AUTHENTICATED_OWN).
4. Optional new DRAFT: the live Press trip form placeholder "e.g. Visit Faroe Islands" (get_form 6ab15a529857f957ac26b5a6, field organization) names a real tourism board on the PR door. I added a neutral replacement to 7.2 so the form cannot read as a board that works with TLL.
5. The rest of the scan found no em dashes, no exclamation marks, no word containing s-h-i-p, no member name or personal value, no partner or board claim, and nothing finer than month and region. Checked: every DRAFT and [Nancy] line in Steps 1 to 8, the legend line, and the three SEO strings (63, 154, 62 and 155 characters, recounted).

Fact corrections
6. Story extras field count. The report said "31 custom fields (room for 29 more)". It has 32 (room for 28). Evidence: get_collection_details 6ad997935f308b0209d358b8 lists 32 fields plus name and slug; total items 0.
7. press-sent. The report said "The Worker ... sets press-sent on the member." The Worker does not write it; the page does, from the browser, after /press/apply answers. Evidence: src/press-apply.js has no press-sent reference; src/pages/edit-profile/live-2026-10-28/after/new-js-g.html line 33 calls m.updateMember({customFields:{"press-sent":at}}).
8. 48-hour count. The report said five places. There are at least ten on four live pages, plus the profile fallback and the /submit layers. Evidence: curl of https://www.thatlayover.life/travelers ("Reviewed by a human within 48 hours", "Reviewed within 48 hours, edited lightly", "Switch on Press, an editor reviews within 48 hours"); /edit-profile HTML ("Reviewed within 48 hours" x4); /editorial-charter rule 3 heading "Read by a human within 48 hours, then published."; the Contributors press-verified help text says empty "shows REVIEWED WITHIN 48 HOURS"; src/site-layers/chunks/submit.js.
9. Blocking questions. The short version said seven; the list marks six (questions 1, 3, 4, 5, 9 and 11). Evidence: section 8 of the report.
10. Seed row total. The short version said 39 rows. Section 5 lists 42 (9 + 5 + 6 + 6 + 4 + 4 + 5 + 3), counting Table 2 by outlet and Table 8 by market. Evidence: section 5 of the report.
11. Site stats field count. The report said it was not read. It has 5 custom fields (stories, travelers, pets, countries, counted-at), so the three new Number fields fit. Evidence: get_collection_details 6ae602821fa37291336b5680.
12. Story_comments rules. The report implied ADMIN_ONLY is proven in general. On story_comments only update is ADMIN_ONLY; read is PUBLIC and delete is AUTHENTICATED_OWN. No table uses ADMIN_ONLY for delete. Evidence: getDataTables.
13. Press applications "9 fields". It has 7 custom fields plus name and slug. Evidence: get_collection_details 6ae1e636cd32722d8a175cb3.
14. Location Expert badge. The report wrote "{country}"; the role badges prompt line 31 says "{lives-country}".
15. Missing URL fields. The report listed 7 URL fields; Memberstack also has twitter-x-url, strava-url, alltrails-url, komoot-url, garmin-url and beli-url. Evidence: getCustomFields (83 keys counted).
16. Deleting Comments also deletes its template page "Comments Template" (6a0cbdae98d2bd496b67c14b). Evidence: src/pages/pages-2026-10-26.txt line 62. Also, the only repo mention of the Comments collection id is that page list.
17. 390 first screen. The report had no 390 data. Playwright at 390x844: H1 is 2 lines, the register link is at 1681px and the form at 2350px, so there is no call to action on the first screen at 390 either.
18. Sign-up return. Added to 2.5: the only plan, Traveler, has afterSignup "/", so returning to /edit-profip#press needs a redirect or a layer. Evidence: getPlans pln_traveler-l97086o redirects.afterSignup "/".
19. "seven rules" is now verified: /editorial-charter has seven rule headings before "Who edits". Evidence: curl of https://www.thatlayover.life/editorial-charter.
20. Contributors field-freeing candidate added (currently-in, "Currently In (retired)", help text "Retired 31 Oct 2026 ... Leave empty"). I did not check that it is empty on every item. Evidence: get_collection_details 6a0b29c7a7b1840afe9390a5.
21. The intake.js range is lines 299 to 301, not 300 to 301. Line 299 opens the theme block. Evidence: sed of src/intake.js.

Seed-row corrections (search-index cross-checks only, not page reads)
22. Visit Norway: the commission line comes from https://www.visitnorway.com/contact/media-assistance/, not /media-centre/press-pr/ (WebSearch summary).
23. Visit Pasadena: the summary says clips are sent "with an email or letter". The "assignment letter" in the report was not confirmed; 4 to 6 weeks' notice was (WebSearch summary).
24. Visit County Durham: the summary says "two recently published travel-related pieces" for freelancers and a commission lined up. "Cuttings" was not confirmed (WebSearch summary).
25. Tourism Kelowna: "no high-season requests" was not found; "4-6 weeks advance notice, preferred" was (WebSearch summary).
26. Tourism Squamish: the 25,000 circulation rule is in the PDF form https://www.exploresquamish.com/site/assets/files/20802/tourismsquamishmediavisitrequestform.pdf (WebSearch summary).
27. Visit Faroe Islands: the indexed paths are /en/toolbox/for-press-professionals/press-trips-collaborations and /en/press-professionals/press-room/for-the-press/press-trips, not the path in the report. "Copies of previous articles" was found; the commission letter was not (WebSearch summary).
28. Destination BC: a 2026 request form exists (https://www.destinationbc.ca/content/uploads/2026/03/North-America-Visiting-Journalist-Program-Request-Form-2026.pdf). The flag that it is for BC tourism businesses and DMOs, not journalists, is consistent (WebSearch summary).
29. Consistent with the report: VisitDenmark (nine core markets, no hotel payment; other documents list 10 or 14 markets), Québec Cité (10,000 per network, 3% and 1.5%, four weeks), Talking Travel Writing (two founders).

Claims confirmed as written (evidence)
- Webflow page 6a3e5c68288bde39aeeed7de, slug for-press, lastUpdated 2026-11-11T14:54:50Z; SEO title, description, og:title and og:description as quoted (get_page_metadata).
- Both domains show "Last Published: Thu Nov 12 2026 11:03:16 GMT" and the extracted body text is identical (curl and diff).
- No call to action on the first screen at 1440 (register link at 1024px), and the dot overlap at 375 (Playwright; scratchpad chk/fp375.png).
- 83 custom fields, all PRIVATE; 3 admin-only (club-supporter, custom-slug, press-verified); 8 members; labels of is-press, press-verified, is-creator and roles (getCustomFields, getMembersCount).
- [data-tll-edit="dir-app"] appears only inside the tll-edit-dir-v1 script, not as an element (curl of /edit-profile).
- FIELD_MAP lines 72 to 73 and SWITCH_FIELDS line 95 in src/profile-sync.js; /press/apply at src/index.js line 70; S130 at handoff/STATUS.md line 311 and open; wrangler.toml cron at line 7, STORY_EXTRAS at line 39, SITE_STATS at lines 43 to 44.
- Link 1af45b78-...-6139 is a Link with href /edit-profile and no attributes; H2 823e is tllpr-h2; sub 8240 is tllpr-sub; note 8265 is tllpr-note; eyebrow 8224 is tllpr-eyebrow; the consent String eae05ca5-... and card String ...8129 texts are as quoted (query_elements, get_attributes).
- "Press trip" registered 3 times with the IDs given, sendEmailConfirmation false, the six fields as listed, 0 submissions on each, Turnstile present, action empty (get_form, list_form_submissions, Playwright, curl).
- 40 collections (get_collection_list). Stories: 63 items, 61 with status Published, 60 custom fields plus name and slug, funding set on 0 items (a filter on all 5 option IDs returned total 0). Themes: 13 items, 5 published. Contributors: 60 custom fields, partners help text as quoted. Press applications, Press Trips, Comments, Press Mentions and Story extras: 0 items each. Press Mentions has publication, logo, link and date required.
- Data tables: story_comments 0 records; the member trips table 15 records with AUTHENTICATED_OWN read; field types available as listed (getDataTables).
- tllStates is undefined on /for-press; the footer shows 54, 57, 6 and 1 (Playwright). src/map-merge.js line 4 and claude/COUNT-RULES-2026-10-19.md line 8 say what the report quotes.
- No "Ad" label in src/site-layers; the fundLabel strings are at tll-trust-v1.js lines 33 to 38 and chunks/story.js lines 197 to 203; "Reklame for" is at tll-pros-v1.js lines 30 to 31 and tll-series-v1.js lines 76 to 78.
- /press-rules and /press-desk answer 404 on www (curl). /contact has only mailto links and no relay form (curl).
- /submit has exactly five theme checkboxes (curl).
- The update-field operation accepts only displayName, helpText and isRequired, and no collection rename or delete exists (the data_cms_tool schema in this session).