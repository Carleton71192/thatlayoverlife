# Change log for approval: Beta ready (20 October 2026)

Source: Nancy's brief BETA-READY-2026-10-20.md ("This comes before the other packets"). It runs before the 3.4 packets B to F in handoff/claude-design-source/send-2026-10-20/. Nothing in this log is built. Publish only on your word, to both custom domains and the subdomain.

Goal from the brief: a stranger from Upwork signs up, builds a map, publishes a story with their own photo and reports a problem, end to end, on the live site, without help.

## Where each beta step stands today (checked on the live site, 20 October 2026, about 11:00 UTC)

| Step | Today | What blocks it |
|---|---|---|
| 1 Sign up / log in | Works. /signup has Continue with Google, email and password, the terms box and "I am 16 or older". The profile page is ready for a thin profile (Packet C, live since 10:45 UTC: name, photo or initials, ON TLL SINCE, no zeros). | The profile only appears at sign-up once the member webhook is deployed (root Worker tll-travel-wire, S105) and Memberstack points at it. Until then a new member has no /contributors page. |
| 2 Edit profile | Built and live (S104): photo, name, one line, home base, flags, languages, bio, ten links, contact, lists, visibility, saves as you type to the member record. | Changes reach the public profile only through the Worker (POST /profile/save, S105). Not deployed. The photo button uses Memberstack's own upload when the page offers it, otherwise it sends the member to /account. |
| 3 The map | Logging works on the map itself. The Stamp it list was broken (your Angola report) and is fixed and live (S106). The map no longer takes the page scroll (S106). The profile reads its numbers from the map snapshot. | The snapshot reaches the profile only through the Worker (POST /map-snapshot). No "Last saved" line on /the-map (it is on /account). Most numbers on /the-map are not live, see B3. |
| 4 Submit | /submit still sends stories in as drafts for review (S72: Jay's story waited as a draft). The writer-led flow that publishes on passing the rules is in the repo (worker/ route POST /publish with the rules check, src/pages/submit/v2/) but it is not on the page and the submit Worker is not deployed. | Submit Worker deploy and its secrets, the page swap, and the Stories collection is at the 60-field cap (S89). |
| 5 Commissioned label | Missing. No `commissioned` field on Stories. | The 60-field cap: one empty field must go first. |
| 6 Tell the editor | Live on every page (S92): note, optional email and the page URL. It is a Webflow form, so a note lands in Webflow Forms and in the form notification email. | Confirm the notification address is the editor inbox (your setting). |
| 7 Morning review | Not running. The skill text exists (SKILL-tll-morning-review.md). | A schedule, an output channel, and the hold fields (the 60-field cap again). |

Must not be broken, today:
- Nav and footer: no 404s (all 36 links on the home page answer 200; all 101 sitemap pages answer 200).
- The 404 page has two buttons (Read the library, Open the map), not three, and its footer prints typed numbers ("87 countries in our stories · 6 stories · 1 traveler · 1 pet") because the counts script does not run there.
- "Within 48 hours" still sits on the story path: the story template's closing line on all 53 stories, 6 country pages, both pillar pages, /stories, /about, /faq (twice) and /terms. Application pages (/for-expats) keep it, as the rulings allow.
- "Your name on this shelf?" on the two pillar pages.
- "Walked" as a counting rule still shows on /the-map in Designer text and the logbook ("parks people have actually walked", "File a park you have walked", "Parks walked").
- 12px floor and 44px targets: the new profile, /travelers and the map picker pass at 390. Submit, sign-up and the map page need the same check during the build.

## Changes (numbered for your reply)

### B1 Deploys that unlock steps 1 to 4 (your clicks, with my step list)
| # | Change |
|---|---|
| B1.1 | Root Worker tll-travel-wire (member webhook, /profile/save, /map-snapshot): you set PROFILE_HOOK_TOKEN, WEBFLOW_TOKEN (CMS write) and MEMBERSTACK_KEY with `npx wrangler secret put`, then `npx wrangler deploy`. In Memberstack, one webhook for member.created and member.updated to /hooks/member-updated?token=… I then put the Worker address in data-worker on /edit-profile (root embed 2801598c) and /the-map (holder fff74b1d), test with a throwaway member, and remove it. |
| B1.2 | Submit Worker (worker/): same pattern, its own secrets (the README lists them). I then swap /submit to the writer-led form (src/pages/submit/v2/) with its data-worker set. |
| B1.3 | The webhook reads the sign-up first name from the Memberstack field `first-name` (the /signup form's field); I confirm the key on a test sign-up before inviting testers. |

### B2 Submit v4, minimum version (step 4)
| # | Change |
|---|---|
| B2.1 | /submit becomes the writer-led form with only the beta fields: headline, place (country from the Countries list, city), body (rich text), own hero photo (Cloudinary upload, adjust-only), rights tick, Charter tick, affiliate declaration. Editor's notes and photo adjust wait for Packet E. |
| B2.2 | Publishes the moment it passes the rules the Worker already checks: 300 words or more, a photo, a place, links resolve, rights and Charter ticked. The story then shows in /stories and on the writer's profile (Packet C list). |
| B2.3 | Email copy to the writer (text and the live link). The Worker today notifies you through the site form; a copy to the writer needs a sending service. Open question 1. |
| B2.4 | Make room on Stories (60-field cap): delete ten empty legacy fields (the ai-* and counter fields listed in S89). Data in them is empty; I list each one with its item count before deleting, for your yes. |

### B3 /the-map: every number live (your note: "Everything on this page needs to live calculate")
Today: live are the hero counter, the Countries card, the Stamp it tiles and list, the logbook tabs and the share card. Not live: the cards for cities, airports, US parks, parks everywhere, ports, UNESCO, landmarks, the wonders lists, volcanoes, spa towns, Danish heritage and auroras; the four rulebooks; Lines and extremes; the explainer cards 87 and 108. They read files built once from your Places Been export of 7 October, so every visitor and every member sees your pins.
| # | Change |
|---|---|
| B3.1 | Countries, places, layovers, continents: from the member's saved map (tllStates), the same count function as /account. |
| B3.2 | Rulebooks: computed from tllStates. ISO codes plus Kosovo of 249, UN members of 193 (list already in map-2.0/source/member-states.json), UN plus observers of 195. Your saved map today gives 84 of 193 UN members (COUNT-RULES.md). |
| B3.3 | Cities, airports and parks: from the member's logbook (tllLog and tllParks, already saved on the account by the logbook on the same page). The Places Been files stop feeding any card. |
| B3.4 | Lines and extremes, computed from the countries in the saved map and labeled "by country": continents of 7, hemispheres of 4, equator and prime meridian crossed when the map holds countries on both sides, furthest north, south, east and west country. Arctic and Antarctic circles, tropics and time zones need place coordinates the map does not hold; they leave the page until a member can log a place with coordinates. The subtitle "Computed from pin coordinates, so it updates itself" goes. |
| B3.5 | Lists with no member data source (UNESCO, landmarks, the wonders lists, volcanoes, spa towns, Danish heritage, auroras, marathons, mountains, Magnus as a pin layer): hidden for everyone until each has a way to log it. Your Places Been pins stay in the repo for later. |
| B3.6 | Explainer cards: "Already logged" and "Still to go" come from the saved map for members; visitors see your published snapshot numbers (from S102's map-snapshot) instead of the typed 87 and 108. "1,273 World Heritage sites" stays (a world total with its source). |
| B3.7 | Visitors' example map: today it is a copy of your map saved in a file on 7 October. It becomes your live map: the map-snapshot route also stores the site owner's country states as a public read, and the visitor view reads that. Open question 2. |
| B3.8 | "Last saved {date}" and "Refresh from my account" above the map for members (COUNT-RULES.md section 7). |
| B3.9 | Load time: start the globe only when it is near the screen, load layer files only when a layer is switched on, and use the built-in plain base map instead of the OpenFreeMap dark tiles (the biggest download; the countries are drawn from our own shapes either way). Open question 3. |
| B3.10 | Copy: "parks people have actually walked", "File a park you have walked", "Parks walked" and "the parks you walked" change per the 19 October ruling to "parks people have been inside", "Add a park you have been inside", "Parks" and "the parks you have been inside". |

### B4 Commissioned label (step 5)
| # | Change |
|---|---|
| B4.1 | New Stories switch `commissioned` (after B2.4 makes room). When on: "Commissioned by TLL" above the byline on the story page and in the card meta on /stories, the home rail and the profile list. Charter rule 08 applies (flat fee, verdict never bought); the label links to the Charter. |

### B5 Tell the editor and morning review (steps 6 and 7)
| # | Change |
|---|---|
| B5.1 | Tell the editor: I send one test note from a story page and confirm it reaches the inbox you name with the page URL. No build change. |
| B5.2 | Morning review: a scheduled task at 07:30 Copenhagen time that reads the Stories, Contributors and Pets items published in the last 24 hours and writes the morning message in the skill's format. Hold is the default for severity 1 to 3: the item goes to draft and the writer note is drafted, never sent without you. Output channel: open question 4. It runs while this Mac is awake; a cloud schedule is the later step. |
| B5.3 | Hold fields on Stories (hold-reason, hold-date, review-status, removal-rule) after B2.4, plus the Charter hold page ("This story is paused while the editor checks one thing. Back soon, or the writer has it.") so a held URL never 404s. |

### B6 Must-not-break fixes
| # | Change |
|---|---|
| B6.1 | 404 page: third button "Back to the gate" (home), the 3.4 copy ("This page missed its connection."), and the footer counts script running there so the numbers are live, not 87 · 6 · 1 · 1. |
| B6.2 | The story-path "within 48 hours" lines become the rules-based line from the 10 October ruling: "Stories publish the moment they pass the submission rules. The editor reads every one after." On the story template, country pages, pillar pages, /stories, /about and /faq. /terms is legal wording: I leave it and list the sentence for you. |
| B6.3 | Pillar pages: "Your name on this shelf?" becomes "Your name on this list?". |
| B6.4 | /stories: the count line equals the cards shown (today 53 items in the list); I check it after B2 goes live with a test story and remove the test story. |
| B6.5 | 390px pass on sign-up, edit profile, the map, submit and Tell the editor: 12px text, 44px targets, no sideways scroll. |

## Not in this packet (from the brief's "can wait")
Share cards, Expats v2 and desks, Travelers v3, the motion pass, video, Lounge, Wire, awards, Club, guide sales. The 3.4 packet waits until beta is done; its UAE ruling is already on your profile (us, br, vn, ae, dk).

## Test report with this packet
Your beta script, run by me on a fresh browser profile at 390 and 1440 with a throwaway member (deleted after): sign up, add a photo and three countries, build the map and save, check the profile numbers, submit a 300-word story with a photo, find it in /stories and on the profile, send one Tell the editor note, repeat on a second browser. Every step's record listed (Memberstack member, CMS story, map save, inbox note). Then your own run on a fresh phone.

## Open for you
1. Email copy to the writer: a sending service on the Worker (for example Resend or Postmark, one more secret), or the writer gets the copy on screen and by Memberstack's own email only.
2. Visitors' example map: your live map public (recommended, it is the showcase), or keep the 7 October copy.
3. Base map: drop the OpenFreeMap dark tiles for speed (recommended), or keep them and only lazy-load.
4. Morning review output: email draft to you (Gmail), a Slack message, or a file in review-log/ only.
5. The editor inbox address for Tell the editor notes.
6. /terms "publish-or-revise decision within 48 hours": your wording to keep or change.

Reply with the line numbers to approve or change.
