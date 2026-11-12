# Trust and conversion fixes: change log for Nancy's approval (11 November 2026)

Source: your prompt of 11 November 2026, saved as `claude/tll-trust-conversion-fixes-prompt-2026-11-11.md`.

Status, 11 November 2026 about 14:40 UTC: **you approved A1, B1, C, D1 and E1, and the build is staged in Webflow (Part 6 at the end). Nothing is published by this session and nothing is on www.** What still waits for you is listed in Part 6.

Original status, kept for the record: nothing below was written to Webflow when this was first sent; everything then was read only.

The funding sheet for you to confirm is `handoff/funding-backfill-2026-11-11.csv` (63 rows, no Webflow write behind it).

---

## Part 1. Five decisions I need before I build

These came out of checking the prompt against the site. The first two change what the copy is allowed to say.

### Decision A. The site publishes first today. The copy you chose says a human reads first.

- Since 13:28 UTC on 11 November 2026 the Worker's instant set-up is live (item W4, your request of 31 October). A story sent from /submit is published at once, in the writer's words.
- The next-morning check is not running. Its runs of 9, 10 and 11 November stopped at the first step, and no report exists.
- So "A human reads every story before it goes live" (D1, READ-FIRST) would not be true on the day it goes up. Today nothing reads a story before it is live, and nothing reads it the morning after either.

Pick one:

- **A1 (my recommendation): keep READ-FIRST and make the flow match.** One Worker change: stories and link-only cards from /submit are saved as drafts for you instead of going live, and the thank-you message says "It's with the editor" instead of where it is live. Photos for the Lounge are a separate question; I would leave them as they are unless you say otherwise. I prepare the change and the tests; the Worker deploy waits for your word. The READ-FIRST copy (Part 3, section B) goes to www only together with that deploy.
- **A2: keep instant publishing and use the PUBLISH-FIRST line** from your section 2.2 everywhere instead. Then the next-morning check has to be fixed first, or "The editor reads every one within 48 hours" is not true either.

### Decision B. The AI first read is not running, and "It never writes a word" has two exceptions on the site

- The first read (D2 = YES) is not happening today. The story check that uses AI needs an Anthropic key that is not set on the Worker, and the morning review task is stuck (see A).
- Five stories show AI-written text, labeled as such: "Summary by AI, from the story." in the short version box, and "Links found by AI web search for the places in this story." They are the five stories not written by you (Jay, Barzy Adam, Chesney Lish, Luke Luby, Roberta Bianchi).
- Your AI1 line says "It never writes a word", and AI3 says "Not to write." A reader who has seen those summary boxes can call that false.

Pick one:

- **B1 (my recommendation): one small wording change, yours to edit.** AI1: "It never writes a word of your story, and a human makes every call. Where a short summary or a list of links was made by AI, the page says so." AI3: "Not to write stories." The rest of AI1 to AI3 as you wrote them. And the first read gets switched on before www (it needs the key, which is yours to add), or the lines wait until it is.
- **B2: your wording exactly as written**, and I remove the five AI summaries and AI link lists instead (those boxes would then be empty on five stories until someone writes them).

### Decision C. Stories is full: 60 of 60 fields

Webflow allows 60 fields per collection and Stories has 60. Three new fields (funding, funding partner, correction note) do not fit. My proposal uses what is already there:

| Your field | How I would do it | Why it is safe |
|---|---|---|
| `funding` (option) | Delete the "Commissioned" switch, then add "Funding" in its place | The switch is off on all 63 stories, so nothing is lost. Its help text is one of the places that says "Charter rule 08". |
| `funding_partner` (text) | Reuse the existing "Sponsor name" field, renamed "Funding partner" | Empty on all 63 stories. The "Reklame" label at the top of a story already reads this field. |
| `correction_note` (text) | Delete "Audio version URL", then add "Correction note" | Empty on all 63 stories. I check that nothing on the story page reads it before deleting. |

One more thing on "required": if Funding is required from day one, Webflow refuses any new story that arrives without it, and /submit does not ask the question yet. So I would add it as optional, fill it for every story (after you confirm the sheet), and make it required in the same change that adds the question to /submit. That last step is a follow-up; say if you want it in this pass.

### Decision D. "Travelers" in the footer: 9 or 6

The footer shows 9 travelers. That is every public profile. Your rule in 1.1 is "public profiles with at least one published story", which is 6 today (you, Jay, Roberta Bianchi, Luke Luby, Barzy Adam, Chesney Lish). Mariam, Fiona and Zain have profiles and no live story.

- **D1 (my recommendation): your rule, 6.** It needs the count changed in two places that must agree: the footer script and the Worker's 30-minute count. The Worker part waits for your deploy word.
- **D2: keep 9** and leave the code alone. The number is true for "people with a public profile".

### Decision E. Corrections: a new collection, or the stories themselves

The site has 40 collections, which is the limit on Webflow's Business plan (I could not see the plan from here). A 41st may be refused.

- **E1 (my recommendation): no new collection.** /corrections lists the stories whose "Correction note" is filled, with the date from "Last updated" and a link to the story. You write a correction once, on the story, and it appears in both places. Nothing to keep in step.
- **E2: a new Corrections collection** as written (date, story link, what changed). I try to create it; if Webflow refuses, I fall back to E1 and tell you.

---

## Part 2. Where the prompt is older than the site

Checked on the test site on 11 November 2026. No work needed unless noted.

| Prompt | What is true now |
|---|---|
| 1.1 Footer shows "6 stories", "1 traveler", "1 pet" | In a browser the footer reads **54 countries in our stories, 57 stories, 9 travelers, 1 pet**. A script in the footer counts the live site on each visit. Method: a small script that reads the sitemap and /stories, plus the Worker's 30-minute count written to the "Site stats" item (57, 9, 1, 54 at 13:30 UTC). What is still wrong: the page as Webflow serves it, before the script runs, carries the old typed numbers (87, 6, 1, 1). That is what search engines and the audit read. Fix is item 1 below. |
| 1.1 What was left out of the story count | 57 = the published Stories items. Left out: 6 drafts. Five are yours (two unfinished pieces, plus the Tokyo, Accra and Magnus goats pieces), and one is Zain's link-only card. No link-only card is live, and I found no noindex example among the live 57. |
| 1.2 /stories headline "Six stories" | Already reads "57 stories, all worth the *detour*." from the same live count. "Six stories" survives only as a comment in one layer file; I remove the words in item 12. |
| 1.3 "87 countries" | No page shows 87 after the scripts run. The footer says "54 countries in our stories" (live). /about says "The country count stands at 89 plus Antarctica" from your own map. Your profile field says 88. So I would **not** type "87 countries Nancy has been to" anywhere: it is not your number today, and a typed number goes out of date. The only 87 left is the typed fallback in the footer (item 1). |
| 3.1 Stories show "Commissioned by TLL · Charter rule 08" | No reader sees it. The chip is in the template of all 57 stories but stays hidden unless the Commissioned switch is on, and it is on for none. The words are still in the page code and in the field's help text, so item 9 removes them. |
| 3.3 "founder-written stories that currently carry Commissioned by TLL" | None do (see above). So no story gets "Commissioned by TLL · Self-funded". All 63 are proposed as Self-funded, with two flags (see the sheet). |
| 4.1 Logged-out visitor losing text | Cannot happen. Signed out, /submit shows "Sign in to write your trip." and the form is not on the page at all. |
| 5.1 Home "Layover guides" shows "No items found." | Fixed on the test site: the row lists the Copenhagen and Sofia guides from the Layovers collection. It does not use story themes, and there is no "Layover Guides" theme in the Themes collection (the five themes are Salty Air, Wild Routes, Alpine Escape, Desert Glow, Sunset Mode). So I add no theme to the two stories. The two card links are being fixed by another session with your Designer clicks; I leave them alone. With two guides showing, the "COMING SOON" line is not needed. The /stories "Layover guides" chip opens /layovers, which has the same two guides. |
| 5.3 Reading time on story pages | Story pages already say "9 min read". The bare number is only on the /stories cards and the "Keep reading" cards (item 14). |
| 5.4 Asia and Oceania chips | Already there, with Middle East. Asia shows 11 stories including Laos ("The Slowest Race in Vientiane"), Bali and Nepal ("Dal Bhat Power, 24 Hour"). Oceania shows New Zealand. |
| 5.6 Search | All five ran; none showed "That search did not run." Results in Part 4. |

---

## Part 3. The changes, numbered

How each one is built: **Webflow** = a write through the API, staged. **Layers** = site layers source, one new release (16.56.0) registered in place of the one in the header at that moment (16.55.0 since about 14:05 UTC on 11 November 2026, from the Lounge postcards session). **Worker** = code prepared, deploy on your word. **Designer** = I try the API first; if Webflow will not take it, it is a few clicks for you and I write them out.

### A. Numbers

**1. Footer numbers true in the page itself.** Webflow, maybe Designer.
- Before: the served page says 87 / 6 / 1 / 1 until the script replaces them.
- After: the four numbers come from the "Site stats" item (a one-item list inside the footer), so the page carries 54 / 57 / 9 (or 6) / 1 before any script runs. The script stays as a second check.
- If the footer list cannot be made through the API: I blank the four typed numbers instead, so the row shows nothing until the script fills it. Rollback: the old text.

**2. Travelers count by your rule** (only with Decision D1). Layers and Worker. Footer script and Worker count both change to "public profiles with a published story".

### B. One story about review (wording below is for READ-FIRST; with Decision A2 every line takes your 2.2 sentence instead)

**3. The six places in your table.** Webflow.

| # | Where | Before | After |
|---|---|---|---|
| RV1 | /editorial-charter, rule 3 | Published in 48 hours, edited lightly. | Read by a human within 48 hours, then published. Edited lightly. |
| RV2 | /faq, "What is That Layover Life?" (page text and the FAQ structured data) | Stories publish the moment they pass the submission rules, and an editor in Copenhagen reads every one after. | Stories go live after the editor in Copenhagen reads them, usually within 48 hours. |
| RV3 | /terms, editorial review | (the three-step sentence ending "a publish-or-revise decision within 48 hours") | No change. It matches READ-FIRST. Under A2 it would not match, and that is a Terms change for you. |
| RV4 | /submit subhead | About 10 fields total. Reviewed by a human, usually within 48 hours. Phone photos welcome. | 9 required fields, the rest optional. A human reads it before it goes live, usually within 48 hours. Phone photos welcome. (See item 15 for the 9.) |
| RV5 | /for-press | One editor reviews it within 48 hours and tells you why, either way. (the voice pass text, already staged) | One editor reads it before it goes live, within 48 hours, and tells you why, either way. |
| RV6 | /about, social description | A community travel magazine. Named travelers, dated trips, reviewed by a human within 48 hours. | A community travel magazine. Named travelers, dated trips, read by a human before it goes live. |

**4. The other hits from the sitewide search.** Webflow, and Layers for the last two. Each of these says publish-first, or "reviews", today.

| Where | Before | After |
|---|---|---|
| /faq, "How do I get published, and do I keep my byline?" (page text and structured data) | The story publishes the moment it passes the submission rules: 300 words or more, your own photo, a place, links that work. The editor reads it after and can correct or pull it under the Charter, never rewriting your voice. | A human reads every story before it goes live, usually within 48 hours. The rules it has to pass: 300 words or more, your own photo, a place, links that work. The editor can correct it under the Charter and never rewrites your voice. **(New wording beyond your table. Please read it.)** |
| /about, "What you can do here", Share | Send a story or your photos. It publishes the moment it passes the submission rules, and your byline stays yours. | Send a story or your photos. A human reads every story before it goes live, usually within 48 hours, and your byline stays yours. |
| /stories, the "More stories on the way" block | Stories publish the moment they pass the submission rules. The editor reads every one after. Named or anonymous. The library is open. The bus is leaving. | A human reads every story before it goes live, usually within 48 hours. Named or anonymous. The library is open. The bus is leaving. |
| Every story page, the "Have a layover story like this?" block (57 pages, one template) | Stories publish the moment they pass the submission rules. The editor reads every one after. Your byline stays yours. | A human reads every story before it goes live, usually within 48 hours. Your byline stays yours. |
| /destinations, open slot card | A human reviews it within 48 hours, edited lightly. | A human reads it before it goes live, usually within 48 hours. |
| /submit, signed-out gate | A human reviews every submission within 48 hours. | A human reads every story before it goes live, usually within 48 hours. |
| /submit, search and social descriptions | Reviewed by a human within 48 hours. | Read by a human before it goes live. |
| /submit, link-only form (text under the form, its thank-you message, and the layer line that rewrites it) | A human reviews it within 48 hours. / A human looks within 48 hours, then the card goes up saying where it opens. | A human reads it before it goes live, usually within 48 hours. / A human reads it, usually within 48 hours, then the card goes up saying where it opens. |
| /submit, thank-you after a story (layer, only with Decision A1) | Says where the story is live. | It's with the editor. Nancy reads it. You'll hear back within 48 hours. (The page's own message, which is already there.) |

Left as they are, because they already agree with READ-FIRST or are about something else:
- /contact: "Reads every story before it publishes."
- /submit: "One editor reads every word in Copenhagen · Reply in 48 hours".
- /for-press: "Name your outlet, link two published pieces. A human reviews within 48 hours." (press applications), "Received. An editor reads it within 48 hours..." and "A human reviews every trip within 48 hours." (press trips, not stories).
- /for-expats: four lines about applications and group listings ("replies within 48 hours", "usually within 48 hours").
- /travelers press tile (layers): "An editor reviews within 48 hours" (applications).

### C. AI disclosure (wording depends on Decision B)

**5. AI1, /editorial-charter rule 1 body.** Webflow. From the voice pass text now staged ("...If a chatbot wrote it or the trip didn't happen, it doesn't run.") to your AI1 text.

**6. AI2, /submit.** Webflow. New line under "No AI-generated writing.": "An AI tool gives your story a first read for facts to check. A human makes every decision." This sits inside the agreement label of the story form. I add text only and touch no form field and no Memberstack attribute.

**7. AI3, /faq.** Webflow. New question under About TLL, "Do you use AI?", with your answer, in the page and in the FAQ structured data.

### D. Charter integrity

**8. /terms (legal-adjacent, your approval needed line by line).** Webflow.

| # | Before | After |
|---|---|---|
| 8a | Section 4: "All published TLL content follows the Editorial Charter, which boils down to:" and its five bullets | The Editorial Charter sets the publishing rules. Read all seven at /editorial-charter. If these Terms and the Charter ever disagree on editorial matters, the Charter wins. |
| 8b | (the bullet "AI is a tool for editing, not a co-author. The byline is human.", shown as a Charter point; there are no quote marks around it on the page today) | Kept as its own sentence in section 4, as a Terms statement: AI is a tool for editing, not a co-author. The byline is human. |
| 8c | Section 7: All paid placements disclosed inline; we don't run hidden sponsored content. | All paid placements are disclosed at the top of the story. We don't run hidden sponsored content. |

Two things for you on /terms that I do not change: it still says "Last updated: 20 May 2026" and "This is version 1" (section 13 promises 30 days' notice by email for material changes, so you decide whether these edits count and whether the date moves). And the short version at the top says "No AI-generated travel reports", which still fits.

**9. Rule 08 gone everywhere.** Webflow.
- The hidden chip link on the Stories template ("Commissioned by TLL · Charter rule 08") becomes the funding label of item 10.
- The Commissioned switch and its help text go (Decision C).
- The small script in the site code that shows "Commissioned by TLL" on cards is replaced by the funding label code (item 10).
- Not changed: older hand-over notes and design prototypes in the repo that mention rule 08. They are history, not the site. Say if you want them edited too.

**10. Funding label on every story.** Webflow, Layers, maybe Designer.
- Field: "Funding" with five values: Self-funded / Hosted by / Gifted by / Sponsored by / Commissioned by TLL. Name from "Funding partner".
- Story page: one small mono chip directly above the first paragraph, where the hidden chip sits now, linking to /editorial-charter#rule-4. It reads "Self-funded", "Hosted by {name}", "Gifted by {name}", "Reklame · Sponsored by {name}" or "Commissioned by TLL".
- /stories cards: the same label as one short line in the card's top line.
- How: the template and the card carry the two values as attributes bound to the fields, and the layers write the label. If you would rather have the label as plain bound text in the template (readable without scripts), that is a Designer step and I write out the clicks.
- No label shows on a story until its Funding value is set, so nothing false appears in between.

**11. The backfill: a sheet now, the writes after your yes.** No Webflow write yet.
- `handoff/funding-backfill-2026-11-11.csv`: title, byline, proposed value, live or draft, the disclosure line the story has today, flags.
- All 63 proposed as Self-funded. Flags: Barzy Adam's and Chesney Lish's stories (the internal note on their profiles says TLL paid for them through Upwork in September 2024, so "Commissioned by TLL" may be the true label); Jay's, Luke Luby's, Roberta Bianchi's and Zain's (not confirmed with the writer); five of yours where the body uses "hosted" or "thanks to" in passing (a wedding party, a cruise director, the Pan American Games, flight credits, a Bollywood film). None reads as a hosted or sponsored trip.
- Why I hold the writes: a value saved on a live story goes out with the next full publish by any session, test site or www. So I write them only after you confirm the sheet, not before.

**12. "Reklame" never alone.** Webflow.
- Story template: the label before the headline of a sponsored story changes from "Reklame for {name}" to "Reklame · Sponsored by {name}". No story uses it today.
- /for-brands: "If the story runs on TLL, it says Reklame at the top and names what you covered." becomes "If the story runs on TLL, it says Reklame · Sponsored by and your name at the top, and names what you covered." **(My wording. Please edit.)**
- "The example story": I found no example sponsored story on the test site or in the drafts. Tell me where it is if it exists.
- Field help texts that say "Reklame above the headline" get the new format.
- Layers: the "Six stories" comment in the count layer is reworded so the search in your section 7 comes back empty.

**13. Charter: version, real headings, one numbering style, who edits.** Webflow.
- Under the title: "Version 1.1 · Updated 11 November 2026". I change the date to the day you publish to www if it is a different day.
- Each rule title becomes a real heading (h3) with ids `rule-1` to `rule-7`. The numerals change from I to VII to 1 to 7.
- Rule 7 gets a link to /corrections.
- At the bottom, "Who edits": "Nancy Carleton edits every story. Nancy spent years in broadcast news at NBC affiliate KGW in Portland, where she won a Regional Emmy as casting director on the Great Toy Drive. Stories Nancy writes herself are self-edited, so she checks names, dates and prices against her own records and receipts before they run."
- Then "Changes": "1.1: Clarified when review happens and how we use AI. Added funding labels to every story."
- /about, "Who is writing this": the D4 line as its own short paragraph right after the paragraph that starts "I'm from Portland, Oregon".

### E. Contributor and reader copy

**14. Reading time labeled on cards.** Layers. /stories cards and "Keep reading" cards: "4" becomes "4 min read". The home rail already says "7 min"; I make it "7 min read" in the same release so all three agree.

**15. /submit subhead: N = 9.** Webflow. Marked required on the story form: country, headline, excerpt, body, region, your name, email, the main photo, and the charter tick. That is 7 text fields, 1 photo and 1 tick. Under 12, so the copy changes (RV4). If you count only what a member types (name and email come from the account), say the number you want.
- Optional groups, for your later "Add more detail" toggle (not built now): sensory anchors, pets along and pet notes, pull quote, reader question, sign-off, hashtags, co-travelers and "same trip as", the five shout-outs, the sponsored and affiliation lines, syndication, the Lounge photo. I could not sign in on the test site, so I cannot say which of these are already folded away for a member; shout-outs sit behind a tick box in the page code.

**16. Home hero line.** Layers and Webflow. One line between "Find your next *somewhere*." and the subhead, in the hero body style: "True trip stories from the people who actually went. Every byline a real person, every hosted trip labeled at the top." It goes into the cover (what visitors see) and into the plain hero underneath it. Note: the two heroes have different subheads today (cover: "Travel stories from people who left the airport. (Most of them, anyway.) Free to join."; plain: "For people who have slept on an airport floor and would do it again."). I leave both subheads alone and report whether the buttons stay on the first screen at 390.

**17. /for-press claims.** Webflow.
- P1 and P2 are one line today: "A disclosure standard tourism boards trust: the reason risk-averse partners say yes to TLL bylines." It becomes "A disclosure standard written so a compliance team can say yes" followed by the link "Read all seven rules in two minutes →" to /editorial-charter.
- Other claims that someone already trusts or uses TLL: none found on the 21 pages read. /for-brands says "None yet" and stays.

### F. Empty states

**18. Story template: three blocks.** Webflow, maybe Designer, and Layers.
- "Keep reading" and "Traveled with" are hidden today by a script when empty, with the heading text still in the page. I set them to be left out by Webflow when the story has no related stories, or no companions.
- "Last updated" shows the published date today when the field is empty. After: the row shows only when a date is set (one story has one).
- The "Disclosure" label at the end is already hidden when empty. The process note under it ("Every story carries its receipts. Something out of date? Tell the editor and the "Last updated" line changes when we fix it.") moves to sit under "Last updated", and shows with it.

**19. Dates on /stories cards.** Webflow and Layers. The field exists ("Trip when", free text). 51 of 57 live stories have one; 6 have none (Phuket and Singapore, Holy Mole, the Denmark birds, Northern Brazil, La Paz, Antarctica). 40 are a plain month and year; 11 are other shapes ("Easter", "14 days", "Summer 2024"). Writers also chose whether their date shows (the "Show traveled date" switch): of the 40, 34 said yes. I would show month and year on a card only when it is a plain month and year **and** the writer's switch is on, so 34 cards get a date. Nothing is invented. Say if you want all 40.

### G. Corrections

**20. /corrections.** Webflow, maybe Designer.
- New page, title "Corrections", intro "When we get something wrong, we fix it on the story and log it here.", empty state "No corrections yet. If you spot one, tell us at hello@thatlayover.life."
- List per Decision E. Linked from charter rule 7 and the footer Legal group.
- Set to noindex and left out of the sitemap until the first entry. **You flip it** when the first correction is in (Page settings, or tell me).

**21. Correction note on stories.** Webflow and Layers. "Correction note" field (Decision C). When filled, the story shows "Correction, {date}: {note}" above "Last updated", with the date taken from "Last updated".

### H. Release

**22. Site layers 16.56.0.** Built from the layer changes above on top of 16.55.0 (the Lounge postcards release, which holds its deck behind `?preview=lounge`), tests run, copied to the slim release branch, registered in the site header in place of 16.55.0. Rollback: 16.55.0. I check with the Lounge postcards session before building, since we share the source tree.

**23. Translation queue.** The site has one language today and no translated pages, so there is nothing to hold back. I list every changed English line in `docs/translation-queue-2026-11-11.md` for when translations exist.

---

## Part 4. Reports the prompt asked for (no change made)

**Numbers typed by hand (1.4)**
- Footer fallback: 87, 6, 1, 1 (item 1).
- /the-paw-passport: "Written from 13 countries and one transatlantic flight", "Samoyed · 13 countries", "Magnus's passport: 13 countries and counting". /about says "He has crossed into 14 countries." 13 and 14 disagree.
- /about: "Marathons: Seven, one per continent", and in the text "a marathon on every continent".
- Home and /travelers: "Seven marathons, seven continents." (Jay's one-liner), "Founding 01 / 02 / 03", "First 100 get a founding badge", "Samoyed · 35 kg".
- Your profile: country count 88 and "88-and-counting" in the CMS; /about reads 89 plus Antarctica from your map.
- /destinations: "53 countries, 57 stories" is not typed in the page; a script writes it. The footer says 54. The two count differently, as the voice pass already noted.
- Brazil's country intro still says "Two TLL stories are from Brazil so far" beside "6 stories" (already on your list from the earlier check).

**Other stories about a layover (5.1), for you to tag if a theme is ever added:** "The Layover Was the Vacation" and "Bali, Indonesia: Extended Layover Edition" (both in the title), "Patience, Iago, Patience!" (Doha, four mentions), then passing mentions in the Istanbul, Year of the Dragon, Patagonia and Ghana stories.

**Search (5.6), on /stories on the test site**

| Search | Result |
|---|---|
| Patagonia | 1 story (Patagonia, measured in Camp Italianos) |
| whale sharks | 1 story (La Paz) |
| EV | 21 stories. It matches the letters "ev" inside words such as "even" and "every", so most are not about the EV trip. |
| Bali | 2 stories (Bali, and the Lisbon story) |
| marathon | 10 stories |

None showed "That search did not run."

**Could not verify**
- Anything signed in on the test site (the /submit form as a member sees it, the folded groups).
- The plan's collection limit (Decision E).
- Whether your own stories' short version boxes were AI-assisted. Only the five labeled ones are counted in Decision B.
- 390 and 1440 checks of the new copy: these happen after the build, on the test site, and I report any line that overflows or orphans without shortening it.

---

## Part 5. What I need from you

1. Decisions A to E (a letter each is enough: for example "A1, B1, C yes, D1, E1").
2. Yes or edits on the three /terms lines (8a, 8b, 8c).
3. Yes or edits on the wording I had to write myself: the FAQ "How do I get published" answer (item 4), the /for-brands line (item 12), and the B1 lines if you pick B1.
4. The funding sheet: confirm, or mark the rows to change.
5. Your word on N = 9 for /submit.

Then I log my scope in the lock log, build in this order (fields, copy, template, page, layers), stage everything, ask the session holding the test-site publish to publish it, check every edited page at 390 and 1440, and report. www stays yours.

---

## Part 6. Built and staged (11 November 2026, after your "A1, B1, C yes, D1, E1")

Nothing here is published by this session. www is untouched. Release: **site layers 16.56.0** (release commit `e56c5ec`, source commit `408e9d2`, 354 tests pass, all 25 files checked on the CDN).

### Staged in Webflow

| Item | What is staged |
|---|---|
| 1 | Footer: the four typed numbers are gone from the page itself (the row is empty until the script fills it). Binding the row to the Site stats item is not done; see "Not done" below. |
| 2 | Travelers by your rule: the footer script (v3.3) counts the distinct bylines on /stories, 6 today. The Worker's count uses the same rule once deployed. |
| 3 | RV1, RV2, RV4 (with 9), RV5, RV6 as in the table. RV3 unchanged. |
| 4 | Every line in the table, plus three found while building: a second "publishes the moment" paragraph on /about, and the /about and /submit structured-data descriptions (spotted by another session). |
| 5, 6, 7 | AI1 and AI3 with your B1 wording, AI2 as written. |
| 9 | The "Charter rule 08" words are out of the story template chip and out of the Commissioned help text. The switch itself goes after the Worker deploy (the live Worker still writes it). |
| 10 | Funding field added (five values, not required yet). The chip on the story page and a line on the /stories card are wired to it. No story has a value yet, so no label shows anywhere until the sheet is confirmed. |
| 12 | "Reklame · Sponsored by {name}" on sponsored stories (through the layers), and in the field help texts. The /for-brands line waits for your wording. |
| 13 | Charter: version line, h3 headings with ids rule-1 to rule-7, numerals 1 to 7, the corrections link under rule 7, "Who edits", "Changes". /about: the credential paragraph. |
| 14 | Reading time. Correction to Part 2: the cards already showed "9 min" to a person; the unit was drawn by CSS, so anything reading the text saw a bare 9. The text itself now says "9 min read" on /stories cards, "Keep reading" cards and the home rail. |
| 15 | /submit subhead with 9. |
| 16 | Home hero line, in the cover and in the plain hero. |
| 17 | /for-press P1 and P2. |
| 18 | "Last updated" row shows only when the story has a date (through the layers). |
| 19 | Traveled month and year on /stories cards where the writer's switch is on and the date is a plain month and year. |
| 20 | /corrections page with title, intro and empty state; noindex and out of the sitemap; linked from the footer Legal group and charter rule 7. |
| 22 | Site layers 16.56.0 in the header in place of 16.55.0. Rollback: 16.55.0. |
| 23 | `docs/translation-queue-2026-11-11.md`. |

A correction to Part 2 as well: the /stories headline did still carry the typed word "Six" in the page itself, with a script replacing it. The page now reads "Stories, all worth the detour." and the layer puts the live count in front, so no typed number is left.

### Worker: deployed on your word ("deploy the Worker"), 11 November 2026 about 14:39 UTC

- Version `040dddfb`, from a clean copy of commit `af5de76`. Stories and link-only cards from /submit are now saved as drafts for you (status In Review) instead of going live. Photos for the Lounge still go up at once, as before. Travelers are counted by your rule at the next half-hour run.
- I deployed twice, a minute apart. The first version answered a held story in a way the /submit page still live on www would have shown as "It is live" with a dead link. The second answers so that both the old and the new page show a plain "Saved" line. No story was submitted in between that I can see.
- Checked after: the public routes answer 200 and /intake refuses a request without a sign-in, as before. Not tested: a real signed-in submission. The first story a member sends is the real test; it should appear in Webflow as a draft.
- Rollback: `npx wrangler rollback 321d3a46-050a-4502-b1e6-e844c7350d1d`.
- Until you publish www, the live site still says stories "publish the moment they pass the submission rules". That is now the untrue line, so the www publish is worth doing soon after you have looked at the test site.
- Your reading queue: new stories arrive as drafts in the Stories collection with a note at the top of "Notes to editor". Read, set Funding, publish.

### After the deploy (staged)

- The Commissioned switch is deleted, with the three hidden markers that were bound to it (on /stories, the Stories template and the Contributors template) and a second chip link that could never show.
- "Correction note" is added to Stories and wired to the story page: when it is filled, the story shows "Correction, {date}: {note}" above "Last updated" (the date comes from "Last updated").

### Waiting for your answer

1. The three /terms lines (8a, 8b, 8c). Not written.
2. The /for-brands line (item 12). Not written.
3. The funding sheet. No value is written on any story until you confirm it.
4. Wording I staged that is mine, for your eye: the FAQ answer "How do I get published", and the B1 sentences.
5. N = 9 on /submit (staged; say if you want another number).

### Not done, and why

- **The list on /corrections** (item 20): built on 12 November 2026 (the filter Webflow refused on 11 November was accepted). One card per story whose "Correction note" is filled, newest first, with "Correction, {date}" from "Last updated", the story name linked, and the note. When nothing is filled, the page shows "No corrections yet. If you spot one, tell us at hello@thatlayover.life." To log a correction: on the story, fill Correction note, set Last updated to the day of the fix, publish the story. Then delete the noindex line on /corrections and switch it into the sitemap. Staged; it needs one more test-site publish.
- **Footer bound to the Site stats item** (item 1, the fuller fix): it needs a collection list inside the footer, which is on every page. I chose the safe step (no typed numbers) and left the list for a careful pass or a few Designer clicks.
- **"Keep reading" and "Traveled with" by Webflow's own conditional visibility** (item 18): the API can only bind visibility to a switch field, not to "this list is empty". Both blocks are already hidden for readers by script when empty. Designer steps if you want it native: select the block, Settings, Conditional visibility, "Related stories is set" (or "Human co-travelers is set" / "Pet co-travelers is set").
- **The process note under "Last updated"** (item 18): not moved. The Disclosure row holds real disclosure lines on six stories, so your condition for removing it ("if it only holds the process note") is not met. The note stays where it is.
- **Story template code** still contains the old "Reklame for" wording and the published-date fallback in its own script. Readers get the new behavior from the layers; the template code can be tidied at the source in a later pass.
- **The hidden rule 08 draft on the charter page** ("Paid work never buys a verdict", marked DRAFT · EDITOR TO APPROVE) is not served and I left it alone. It is the one place the words "rule 08" still exist in Webflow. Say if you want it deleted or turned into a real rule 8.
- **390 and 1440 checks:** not possible until the staged work is on the test site. I have asked the session that holds the test-site publish.

### Checks at 390 and 1440 (test site, signed out, 11 November 2026)

The test site was published by another session with layers 16.56.0. Checked there with the app's built-in browser, which can show a 390 screen.

- **No sideways scroll** at 390 or 1440 on /editorial-charter, home, /stories, three story pages, /faq, /for-press, /about and /corrections.
- **Numbers:** footer reads 54 countries, 57 stories, 6 travelers, 1 pet. /stories reads "57 stories, all worth the detour."
- **Orphan words at 390** (reported, not shortened): charter rule 3, "Read by a human within 48 hours, then published. Edited lightly." ends with "lightly." alone on a fourth line; the version line wraps with "2026" alone on the second line. Both sit on one line at 1440.
- **/stories cards:** the 34 cards that now show a traveled date have a two-line top line at both sizes ("STORIES FROM THE ROAD · 10 MIN READ · OCTOBER 2026"). It was one line before. Nothing overlaps.
- **Home hero at 390 by 844:** the promise line sits between the headline and the subhead, and both buttons are on the first screen ("Read the cover story" ends at 697, "Join free" at 757). In 16.56.0 the promise line came out larger than the subhead, because the old style rule only reached the first paragraph under the headline. 16.56.1 gives both the same hero body style; it is staged and not on the test site yet, and it will push the buttons about 30 px lower (still inside 844). On a phone with Safari's bars showing, "Join free" was already below the fold before this change.
- **Story pages:** "Last updated" is gone where the story has no date and shows "12 October 2026" on the one story that has one. Related cards read "12 min read". The end block carries the new line.
- **/for-press:** the new charter link was bright teal on a white card, unreadable. Fixed with the site's rose link style, staged, not on the test site yet.
- **Not tested:** the funding label and the correction line with real values (no story has either yet), a signed-in submission through the new Worker, and anything signed in.

### 12 November 2026: Changes line cut back (your decision, "Cut it, ride the next publish")

www went out at 06:44 UTC with the charter, and no story has a funding value yet, so "Added funding labels to every story." was untrue live. The charter's Changes line now reads "1.1: Clarified when review happens and how we use AI." (staged; it goes live with the next www publish). The sentence comes back when the funding values from your sheet are filled in.
