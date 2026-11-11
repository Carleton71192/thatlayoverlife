# TLL trust and conversion fixes: Claude Code prompt (11 November 2026)

Source: claude/tll-cro-editorial-audit-2026-11-11.md (live read of thatlayover.life on 11 Nov 2026). Covers action plan items 1 to 13 and 15. Items 14 and 16 (/for-press restructure, nav test) are design work and are left for a later prompt.

## Task: make the site keep its own rules

You are working on the That Layover Life site (thatlayover.life). The editorial charter makes public promises: every number is real, disclosure sits at the top of every story, empty slots say so honestly, corrections are public. The live site breaks several of these. Fix them as listed below.

Rules for all writing: no em dashes, US spelling, never use the word "ships". Keep Nancy's voice: plain, dry, someone talking.

### How to work
1. For every string, search the whole codebase: Webflow exports, custom code embeds, JS that swaps text at runtime, CMS seed files, meta tags, structured data, and i18n/translation files. Change every source so they agree. Match curly and straight apostrophes.
2. Translated versions: change the English only and add the line to the translation queue. Do not machine-translate.
3. **Merge with the 10 Nov voice-fix prompt** (claude/tll-copy-voice-fix-prompt-2026-11-10.md). If that pass has already landed, edit from its new text. Where both prompts touch the same line, this prompt wins for **R2** (charter rule 1) and **X2** (/for-press review line). The resolved text is in section 2.
4. Check every edited page at 390px and 1440px. No overflow, no orphan words. If new copy breaks a layout, report it. Do not shorten the copy yourself.
5. Do not touch contributor story titles, excerpts or bodies.
6. Stage the release. Do not publish. Report: files changed, strings replaced, strings not found, CMS fields added, anything you could not verify, and the release number. Nancy publishes.

## 0. Decisions (Nancy fills these in before pasting)

- **D1. Review model:** `READ-FIRST` (default). A human reads every story before it goes live, usually within 48 hours. (Alternative: `PUBLISH-FIRST`, where stories go live when they pass the automated rules and the editor reads them after. If you choose this, see the note in 2.2.)
- **D2. Is the AI first read in use?** `YES` (default, because the Terms describe it). If `NO`, delete the AI first-read wording from /terms and skip 2.3.
- **D3. What "87 countries" means:** `COUNTRIES NANCY HAS VISITED` (default). Alternative: `COUNTRIES WITH STORIES`, which must then be a live count.
- **D4. Editor credential line** (/about and the charter): "Nancy spent years in broadcast news at NBC affiliate KGW in Portland, where she won a Regional Emmy as casting director on the Great Toy Drive." Edit this wording if needed. It goes live exactly as written here.

## 1. Make every number true (charter rule 5)

1.1 **Bind the counters to live data.** Footer, /about, and any other place that shows "6 stories", "1 traveler" or "1 pet":
- stories = count of published items in the Stories collection (exclude drafts, noindex examples, and link-only cards if they are stored separately, and report which you excluded)
- travelers = count of public contributor profiles with at least one published story
- pets = count of public pet profiles

If the counter is hardcoded and the platform can't bind it, compute it at build time, or with a small script that reads the CMS. Report which method you used. On 11 Nov the live listing showed 57 story cards and six bylines (Nancy Carleton, Jay Carleton, Roberta Bianchi, Luke Luby, Barzy Adam, Chesney Lish). Use that as a sanity check, not as a hardcoded value.

1.2 **/stories headline.**
- Old: "Six stories, all worth the *detour*."
- New: "{count} stories, all worth the *detour*." (bound to the same live count, italic on *detour* kept)

1.3 **"87 countries."** Per D3:
- `COUNTRIES NANCY HAS VISITED`: label it "87 countries Nancy has been to". Move it out of the site-stats row (stories / travelers / pets) and into the /about bio.
- `COUNTRIES WITH STORIES`: bind it to the count of distinct countries on published stories, and label it "countries with stories".

1.4 Report any other number on the site that is typed in by hand (Magnus's country count, marathon count, Destinations country count). Do not change them. Just list them with where they appear.

## 2. One story about how review works

2.1 **The line to use everywhere (D1 = READ-FIRST):**
> A human reads every story before it goes live, usually within 48 hours.

Apply it in all of these places, adapted only for grammar:

| # | Page | Old | New |
|---|---|---|---|
| RV1 | /editorial-charter, rule 3 heading | Published in 48 hours, edited lightly | Read by a human within 48 hours, then published. Edited lightly. |
| RV2 | /faq, "What is That Layover Life?" | Stories publish the moment they pass the submission rules … an editor in Copenhagen reads every one after. | Stories go live after the editor in Copenhagen reads them, usually within 48 hours. |
| RV3 | /terms, editorial review | (keep the "publish-or-revise decision within 48 hours" sentence) | No change, but confirm it matches. |
| RV4 | /submit subhead | About 10 fields total. Reviewed by a human, usually within 48 hours. Phone photos welcome. | See 4.1 for the full line |
| RV5 | /for-press (voice-fix X2, resolved) | 48-hour human review: one editor, no committee, publication decisions with reasons attached. | One editor reads it before it goes live, within 48 hours, and tells you why, either way. |
| RV6 | /about meta description | …reviewed by a human within 48 hours… | …read by a human before it goes live… |

Also search for "48 hours", "48-hour", "reads every", "reviewed within" and "publish the moment" sitewide (including /contact and /destinations), and bring every hit into line. List each one in your report.

2.2 If D1 = PUBLISH-FIRST, use this instead: "Stories go live when they pass the submission rules. The editor reads every one within 48 hours and fixes or pulls anything that breaks the charter." Then remove "before it goes live" from /for-press and /about. Make sure the submit flow actually behaves the way the copy says, and report it if it doesn't.

2.3 **AI disclosure (D2 = YES).** This resolves voice-fix R2.

| # | Page | Old | New |
|---|---|---|---|
| AI1 | /editorial-charter, rule 1 body | Every story carries a real byline from a person who actually went. No chatbot drafts, no filled-in fiction, no stock itineraries dressed up as memory. | Every story carries a real byline from a person who actually went. If a chatbot wrote it or the trip didn't happen, it doesn't run. We do use an AI tool for a first read that flags facts to check and rule problems. It never writes a word, and a human makes every call. |
| AI2 | /submit, agreement area, below "No AI-generated writing." | (none) | Add: "An AI tool gives your story a first read for facts to check. A human makes every decision." |
| AI3 | /faq | (new question under About TLL) | **Q: Do you use AI?** A: Not to write. Every story is written by the person who took the trip. We use an AI tool for a first read that flags facts to check and charter problems. Nancy reads every story and makes every call. |
| AI4 | /terms, Editorial Charter summary | the sentence quoting the charter as "AI is a tool for editing, not a co-author. The byline is human." | Remove the quote marks and the attribution to the charter. Keep it as a Terms statement: "AI is a tool for editing, not a co-author. The byline is human." |

If D2 = NO, delete "an AI-assisted first read for factual flags and Editorial Charter alignment" from /terms, skip AI1 to AI3, and use voice-fix R2 as written.

## 3. Fix the charter's integrity

3.1 **The rule 08 chip.** Stories show "Commissioned by TLL · Charter rule 08", but the live charter has seven rules. Replace that chip with the funding label from 3.3, so no story links to a rule number that doesn't exist. Search for "rule 08", "Rule 08", "rule-08" and "#rule-8" everywhere, including CMS fields and templates.

3.2 **The /terms charter summary.** /terms says the charter "boils down to" five points, two of which ("Named travelers. Specific places at specific times." and "We don't punch down.") are not charter rules. Replace that whole summary with:
> The Editorial Charter sets the publishing rules. Read all seven at /editorial-charter. If these Terms and the Charter ever disagree on editorial matters, the Charter wins.

Flag this line in your report as a **legal-adjacent change for Nancy to approve** before publish.

3.3 **Funding label on every story (charter rule 4).**
- Add a required CMS option field `funding` to Stories with these values: Self-funded / Hosted by {name} / Gifted by {name} / Sponsored by {name} / Commissioned by TLL. Add a text field `funding_partner` for the name.
- On the story template, show the label directly above the first paragraph, not in the end block. Format: small mono chip linking to /editorial-charter#rule-4 (add the anchor if it is missing). Sponsored reads "Reklame · Sponsored by {name}".
- On /stories cards, show the same label in one short line.
- **Backfill:** set every existing story to "Self-funded" as a draft value. Set Nancy's founder-written stories that currently carry "Commissioned by TLL" to "Commissioned by TLL · Self-funded". Do not publish the backfill. Export a CSV of story title / byline / backfilled value for Nancy to confirm, and flag any story that mentions hosted, comped, gifted, press trip, sponsor or "thanks to" in its body.
- Remove the end-of-story "Disclosure" heading if it only holds the process note. Move that note under "Last updated".

3.4 **"Reklame" alone.** Everywhere a sponsored label appears (/for-brands, the story template, the example story), use "Reklame · Sponsored by {name}". On /terms, change "All paid placements disclosed inline" to "All paid placements are disclosed at the top of the story." Flag the /terms change for Nancy's approval.

3.5 **Version and date the charter.** Under the charter title, add: "Version 1.1 · Updated {publish date}". Add a short "Changes" line at the bottom: "1.1: Clarified when review happens and how we use AI. Added funding labels to every story."

3.6 **Rule headings.** Mark each charter rule title up as a real heading (h2 or h3) with an id (`rule-1` to `rule-7`) so chips and other pages can deep-link. Use one numbering style throughout (Arabic 1 to 7).

## 4. Contributor and reader copy

4.1 **/submit subhead.** First count the fields that are truly required. Then:
- Old: "About 10 fields total. Reviewed by a human, usually within 48 hours. Phone photos welcome."
- New: "{N} required fields, the rest optional. A human reads it before it goes live, usually within 48 hours. Phone photos welcome."
- If more than 12 fields are required, do not change the copy. Report the list of required fields instead.
- If optional groups (sensory anchors, pull quote, reader question, hashtags, companions, shout-outs, syndication) are not already collapsed, report which ones could sit behind an "Add more detail" toggle. Do not build the toggle in this pass.
- Also report whether a logged-out visitor can fill the form and lose their text when they hit submit.

4.2 **Homepage hero.** Keep "Find your next *somewhere*." and the current subhead. Add one line between them (or directly under the subhead if the layout needs it):
> True trip stories from the people who actually went. Every byline a real person, every hosted trip labeled at the top.

Use the hero body style, not a new size. Check it at 390px. If the hero now pushes both CTA buttons below the first screen on mobile, report it.

4.3 **/for-press unsupported claims.**

| # | Old | New |
|---|---|---|
| P1 | A disclosure standard tourism boards trust | A disclosure standard written so a compliance team can say yes |
| P2 | …risk-averse partners say yes to TLL bylines (the full sentence) | Read all seven rules in two minutes → (link to /editorial-charter) |

Search the site for any other claim that partners, boards or brands already trust or use TLL, and report each one. /for-brands correctly says "None yet". Leave it.

4.4 **Editor credentials (D4).**
- /about, "Who is writing this": add the D4 line as its own short paragraph, directly after the line about where Nancy is from.
- /editorial-charter: add a two-line block at the bottom, titled "Who edits": "Nancy Carleton edits every story. {D4 line} Stories Nancy writes herself are self-edited, so she checks names, dates and prices against her own records and receipts before they run."

## 5. Empty states and dead ends (charter rule 5: honest placeholders)

5.1 **Layover guides on the homepage** currently shows "No items found." Do this:
- Add the theme "Layover Guides" to these published stories if they don't have it: "The Layover Was the Vacation" and "Bali, Indonesia: Extended Layover Edition". Report any other published story whose title or body is about a layover, so Nancy can tag it.
- If the section then has at least two items, show them.
- If it has fewer than two, replace "No items found." with: "COMING SOON · Layover guides are being written. The first one is a 40-day layover in Dubai." Link that line to /submit with the label "Got a layover worth a guide? →".
- Apply the same rule to the /stories "Guides" filter: never show an empty result without that message.

5.2 **Story template, empty blocks.** Hide each of these when its CMS field is empty (conditional visibility, not display:none on a block with text left in it): "Keep reading", "Traveled with", "Last updated". When "Last updated" has no date, show nothing.

5.3 **Reading time.** Label the bare number on story pages and cards: "{n} min read".

5.4 **Region filters on /stories.** Add "Asia" and "Oceania" to the Place row, mapped to the existing region field. Check that Laos, Bali, Nepal and New Zealand stories appear under them.

5.5 **Dates on cards.** Show the traveled date (month and year) on /stories cards if the field exists. If it doesn't, report how many stories have no date. Do not invent dates.

5.6 **Search.** Run 5 test searches on /stories ("Patagonia", "whale sharks", "EV", "Bali", "marathon"). Report whether each returns results or shows "That search did not run." Do not change search code in this pass, just report.

## 6. Corrections log (charter rule 7)

6.1 Create /corrections, linked from the charter's rule 7 and the footer Legal group. Title: "Corrections". Intro: "When we get something wrong, we fix it on the story and log it here." List items come from a new CMS collection (date, story link, what changed). Empty state: "No corrections yet. If you spot one, tell us at hello@thatlayover.life."

6.2 Add an optional `correction_note` field to Stories. When it is filled, show it above "Last updated" as: "Correction, {date}: {note}".

6.3 Set /corrections to noindex until it has its first entry. Report it so Nancy can flip it.

## 7. Done when

- No page shows a number that doesn't match the CMS (or is labeled as a personal stat).
- Searching the codebase for "publish the moment", "rule 08", "Six stories" and "partners say yes" returns nothing.
- All six review-timing places use the same model.
- AI use is described the same way on the charter, /submit, /faq and /terms.
- Every story has a funding label above paragraph one (backfill staged, not published).
- No empty heading, empty date or "No items found." is visible on the homepage, /stories or any story page.
- Everything is staged, not published, and the report lists what Nancy has to approve: the /terms changes, the funding backfill CSV, the /corrections noindex, and any layout breaks.
