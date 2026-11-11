# TLL Run 1 (launch blockers and Search Console): recheck, 11 November 2026

## Short version (for Nancy)

1. **Is the site safe to promote? No, not yet.** Four reasons: a member's photo sent today would go public before anyone looks at it; children with clear faces are on public pages (the Ghana photo is in the page code of 19 of the 139 sitemap pages, and two Vietnam "Noodle Week" gallery photos are on 1 story page); nobody has yet seen the cookie message appear for a visitor in Europe; and private details from the marathon diary can still be read in the public code repository.
2. This describes www as it was between 17:25 and 17:47 UTC on 11 November, after your 17:07 publish. This check changed nothing on the site.
3. **Closed on www:** the Sunday 09:00 letter promise is gone. The typed "87 countries" and "35 kg places" are gone. "Cookie settings" opens the cookie page outside Europe, with no error. The Thailand stub, both marathon diaries and every member-data address answer "not found". The sitemap now has /layovers and no hidden page.
4. **Open, small text or settings:** "More landing weekly." on home; /terms still promises a "weekly digest" and an AI first read; three contributor pages sit in the sitemap while telling Google not to list them; /layovers has no canonical tag (the fix is staged, not live); the cookie link still reads "#" in the page code.
5. **Open, needs a build:** the EU guide cannot be bought. The only Ko-fi link on the site is the tip jar on /support.
6. **Only you can do these, most urgent first:**
   - (a) Deploy the Worker that holds member photos for your review. This is the real lock, and the answer cannot be yes without it. Its review passed at about 17:50 UTC, so this can be done now: one command on your Mac; steps are in handoff/PHOTO-HOLD-2026-11-11.md.
   - (b) Decide the two questions about children's faces: replace the Ghana photo everywhere, and take the two Vietnam "Noodle Week" photos out of that story's gallery (claude/tll-lounge-audit-2026-11-11.md, "Decide first" 2 and 3).
   - (c) In the Designer, switch off "start checked" on the two consent boxes on /share-photos.
   - (d) Run the 10-step cookie check from your Mac in Copenhagen (about 8 minutes), and the AdSense clicks if no message shows.
   - (e) Decide about the public code repository and the four story lines in the privacy sweep.
   - (f) Send the Ko-fi product link and price, and paste the Search Console verification id into Webflow yourself (no tool a session has can set it).
   - (g) Free one CMS collection for "Guides". The site is at Webflow's cap of 40. Suggested: rename the empty "Bookmarks" collection.
   - (h) Lock the member-data templates in the Designer (four or five, 2 minutes each), and be present for the two footer changes.
7. Not run: Lighthouse and axe. Not possible from this machine, which is in the United States: anything about what a visitor in Denmark gets.
8. The change log to approve line by line is claude/tll-run1-build-plan-2026-11-11.md.

## About this pass

Session: cloud Claude Code session_01GTTttGvX2VTwovAB2g1cLf, prompt claude/tll-run1-launch-blockers-prompt-2026-11-11.md. READ ONLY: no Webflow write, no publish, no CMS change, no DNS change, no form sent. Three readers rechecked every item between 16:00 and 16:55 UTC. An independent verifier re-ran their work and found that www was republished at 17:07:23 UTC while it was checking, so every "www now" statement had gone stale. This file is the corrected version: every "www now" cell below was checked again between 17:25 and 17:47 UTC, after that publish. Times taken from the shared lock log are that session's own estimates and run a few minutes ahead of this machine's clock. Where a fact is carried from a reader or the verifier and was not re-run, the cell says so.

| State | What it is | Stamp |
| --- | --- | --- |
| www | https://www.thatlayover.life, what visitors get | Published 11 Nov 2026 17:07:23 UTC (task 854f1234, on Nancy's word "Hold that one line back, then publish www"). Site code 16.58.0, pin 3066315b. All 139 sitemap pages carry this stamp and this pin |
| Test copy | https://that-layover-life.webflow.io | Same publish, same stamp, same pin. Same pages. Two differences by design: its robots file closes it to search engines, and Google's consent tool never answers on that address, so consent, analytics and ads cannot be tried there |
| Designer | What is staged in Webflow and not yet on www | Webflow reported "last updated 17:07:32 UTC" at 17:30 UTC. Since then, by the lock log: the /layovers page head code (a canonical tag, og:url and a share image, staged about 17:40 UTC); site code 16.59.0 in the site header, which carries the page half of the photo hold (staged since 17:47 UTC and seen there in Webflow by the independent checker; release caac45af, rollback 16.58.0; www still runs 16.58.0); and the home "Layover guides" row, which is mid-rebuild. Because of that row, no www publish should run until it is finished |

Nancy's two answers are taken as final: the Sunday letter is cut, and the Copenhagen marathon diary is a draft. Still not known: the Ko-fi product link and price, and the Search Console verification id.

## Limits (read first)

- This machine is in the United States for Cloudflare and for Google (the trace address answers loc=US, colo=IAD; Google's consent tool answers "European rules do not apply"). Nothing here proves what a visitor in Denmark gets. Every line marked "location" needs Nancy's Mac in Copenhagen.
- The bare domain thatlayover.life could not be tested: the session's network refuses it. Webflow reports it published together with www at 17:07.
- Google Analytics, DoubleClick and Ko-fi hosts are also refused by the session's network, so requests to them are recorded as attempted, not answered.
- Lighthouse and axe were NOT run. Nothing was built, so there is no "after" to compare. Acceptance 8 is open.
- No signed-in view was looked at.
- The 57 live stories were swept by pattern search plus a read of every candidate line (156 candidates), not read end to end. Sweep hit 1 was read again after the 17:07 publish; hits 2 to 11 were not re-read after it. The lock log shows no story edit in that publish.
- Five files the prompt and the logs refer to are not in the repo on this branch: handoff/PREPUBLISH-CHECK-2026-11-11.md, claude/tll-privacy-guardrails-2026-10-19.md, claude/tll-build-principles-2026-10-31.md, claude/tll-claude-code-direction-2026-11-11.md and claude/tll-status-and-priorities-2026-11-11.md. The privacy sweep used the prompt's own three classes.

Status words: closed; open; waits on Nancy; location (needs her Mac in Copenhagen).

## Recheck table: the nine prompt items

| # | Item | Status on www now | Evidence (17:25 to 17:47 UTC unless stated) | What is left, and who |
| --- | --- | --- | --- | --- |
| 1 | Consent before ads and analytics | Site code: closed. Google Analytics, Ahrefs and the ad script are held until Google's consent tool reports an answer. Consent message for a visitor in Europe: waits on Nancy (location); nobody has seen it appear. The prompt's wording ("nothing from fundingchoicesmessages or pagead2 before a choice, no FCCDCF or FCNEC") cannot be met as written under approach (b), see the reworded line under acceptance 1. /cookies and /privacy: "Advertising. Not running yet." is gone; the list of parties has small gaps (open) | 10 first-visit loads (5 pages at 1440 and 390), 1,473 requests. In all 10: no googletagmanager, Ahrefs, ad script or DoubleClick request ahead of the consent answer; gtag/js and Ahrefs start in the same step as the answer; no request for the old cookieconsent library. Before the answer, every load requested fundingchoicesmessages.google.com, fonts.googleapis.com, fonts.gstatic.com and ajax.googleapis.com. Carried, not re-run: the simulation with a stand-in consent tool answering "European rules apply" (14 scenarios, consent reader): before a choice only the consent loader runs; after "reject all" nothing loads. The site head and footer code have not changed since (same bytes before and after the 17:07 publish, verifier) | Nancy: the AdSense clicks and the Copenhagen check (build plan, part 7); accept the reworded acceptance line 1; approve text rows C1 to C4 and P1 to P7. No change to the consent code is needed |
| 2 | Footer "Cookie settings" | Outside Europe: closed. The click opens /cookies; on /cookies it scrolls to the top. In Europe: waits on Nancy (location). In the page code the link still reads href "#" (open, footer proposal 1 of 2) | 10 of 10 clicks (5 pages, 1440 and 390, real www, nothing injected): the address after the click is /cookies, the page is at the top, and no "googlefc" line is printed to the console. At 390 the link is hidden until the footer heading "Legal" is tapped | Nancy: step 9 of the Copenhagen check; be present for the footer change (three edits, build plan rows F1a to F1c) |
| 3 | Marathon diary privacy and the sweep | Closed on the site: both diary addresses and /marathon-diaries answer 404; no page carries the text. Sweep: open, waits on Nancy (her prose). Open and serious: the diary's private details are public through the code repository | 404 on both hosts for the three addresses. Page code of all 139 sitemap pages searched for the details the prompt lists in its item 3: zero matches for the child's name, both street names, the floor and the old country count. The banned L-word appears only in code (class and file names), never in text a visitor sees. The everyday word for a railed platform outside a window appears in four stories, all about places abroad. Repository: six tracked files still hold the diary's details (count re-run at 17:39) | Nancy: rewrite the recap or leave it a draft; decide sweep hits 1 to 4; decide about the repository. Session: nothing on the site |
| 4 | Member data off the public site | Addresses: closed. /visits, the one Visits item address from the prompt, /bookmarks, /comments, /photo-submissions, /press-applications and /pet-notes all answer 404; none is in the sitemap. /my-passport answers 301 to /the-map (not 404: Nancy imported that redirect on 10 November). **Open, a member-data risk: the member photo path.** A photo sent on /share-photos today is created as a published item at once, with the member's name in the item name and web address, and shown on /gallery. The hold is built, its review passed at about 17:50 UTC, and it is not live yet. Also open: two consent boxes on /share-photos are served already ticked; the templates have no permanent lock | Status codes on both hosts. Photo path: the site code live on www (release 3066315b) has no hold line and still hands photos to the Worker; the Worker's /lounge address answers `{"photos":[]}` without `"held":true`, so the Worker with the hold is not deployed (same answer at 17:47); the live Worker's code (commit af5de76, src/intake.js lines 173, 215 and 226) creates each photo as a published item named after the member. Nothing is exposed today: Photo submissions holds 0 items (read 17:30). Boxes: page code of /share-photos has 6 checkboxes, 2 with "checked" (the social one and the homepage one). Templates: only Submissions and Award Nominations are drafts (verifier) | Nancy: deploy the Worker (the review has passed; handoff/PHOTO-HOLD-2026-11-11.md). That deploy is the real lock and is required before the answer can be yes. A www publish once the home row is finished carries the page half (site code 16.59.0), which is a stopgap for the normal form path only. Also Nancy: untick the two boxes in the Designer; lock the templates (build plan, part 8). One decision: the Photo submissions template (see the section below) |
| 5 | Guides buyable | Open, waits on Nancy. No Guides collection exists and none can be created: the site is at Webflow's cap of 40. /guides is 404. The guide block on /the-paw-passport has no price, no button and no link. Home "Get the guide · €9" is in the page, hidden, with href "#". The only Ko-fi links on the site are the two tip jar links on /support | Rendered at 1440 and 390: the #guide block has 0 links and 0 buttons; no Ko-fi link on home or /the-paw-passport. Home "Moving guides" card is a non-link with a "Coming soon" tag. Carried: 40 collections (verifier about 17:15, lock log 17:30); the GA4 script already sends guide_checkout_click with the link's domain only | Nancy: Ko-fi product link, final price, the collection choice (suggested: rename "Bookmarks"), a cover image. Session: everything else, staged (build plan, 2.5) |
| 6 | Thailand stub and the featured slot | Closed. The address is 404. /stories shows 57 cards and none is the stub. The featured slot is editor-picked | Rendered at 1440 and 390: 57 cards, the lead card is the Pompeii story (the one live story with "Featured in the library" on). Carried: the stub item is a draft, never published (verifier) | Nobody. Optional: switch the stub's sitemap flag off |
| 7 | Search Console | Verification id: waits on Nancy. No google-site-verification tag on any of the 139 pages. robots.txt: closed (one line pointing to the sitemap, blocks nothing). Sitemap: 139 addresses, all answer 200, none is noindex in its page code, /layovers is in. Open: three contributor pages become "noindex, follow" after scripts run; /layovers has no canonical tag on www (the fix was staged at about 17:40 UTC and waits for a publish) | All 139 addresses fetched. None of the prompt's removal list is in the sitemap (no member-data address, /map-2-preview, /profile, /collections, /corrections, Thailand stub or diary). The 9 contributor pages rendered: the same 3 carry "noindex, follow" after scripts, and they are the three item ids in plan row S1. No tool a session has can read or set the verification field (tool list read today: the sites tool can only list, read and publish) | Nancy: create the property and paste the id (route A), or say yes to DNS (route B). Session: stage the sitemap rows (build plan, 2.7) |
| 8 | Counts | Closed: the typed "87" is gone from the footer page code, and "35 kg places" is gone (a visitor reads "35 kg · 14 places"). Footer in a browser: 54 countries in our stories · 57 stories · 6 travelers · 1 pet. Home chapter label: "6 STORIES HERE · 57 PUBLISHED SO FAR". Home map band: "NANCY'S MAP: 89 COUNTRIES + ANTARCTICA · 3 LAYOVERS BESIDE · 90 OF 249 PLACES". Open: the label wording (footer proposal 2 of 2); her own number (87 or 89); with scripts off the footer shows four labels and no numbers | Page code of 139 pages: "87 countr" 0 times. Rendered at 1440 and 390: the strings above. Site stats item read 17:30: stories 57, travelers 6, pets 1, countries 54 (last counted 15:00 UTC). Carried: none of these numbers comes from tllStates for a signed-out visitor; tllStates is one member's own map and cannot give site totals (money reader) | Nancy: pick the label wording; decisions E1 to E4 on her own number and on "places"; be present for the footer |
| 9 | Newsletter promise | Closed for the Sunday 09:00 promise: gone from home, /stories and /account. Open: "More landing weekly." under the home story row. Also open, outside this item: /terms names a "weekly digest" that does not exist | Rendered home at both widths: no "Sunday" and no "09:00"; the block reads "THE LAYOVER LETTER". Page code of 139 pages: "09:00" 0 times. "Sunday" still appears on 58 pages; in every context sampled it is story text, a photo caption or one airport tip, never the letter. "More landing weekly." is in the home page code at every width, but a visitor sees it only at 390x844, 768x1024, 1280x720 and 1440x780. It is hidden at 1440x900 and 1920x1080, where the story row is in its pinned mode. Still open; plan row W1 stands. Not checked: any welcome email in Webflow forms, Memberstack or Mailchimp | Session: "More on the way." in home embed 94ce12c0 (already approved under "cut both"). Nancy: nothing more for this item |

## Recheck table: the eight acceptance checks

| # | Check | Status on www now | Evidence | What is left, and who |
| --- | --- | --- | --- | --- |
| 1 | No Google requests or cookies before a consent choice; Cookie settings opens the panel (Danish IP) | Waits on Nancy (location). As worded it cannot pass under approach (b): Google's consent tool is itself a Google request and sets a Google cookie, and the site's type files also come from Google | From this machine: before the consent answer, every load requested the consent tool, Google Fonts (fonts.googleapis.com and fonts.gstatic.com) and Google's hosted font loader (ajax.googleapis.com); the only cookies at that moment were _cfuvid and FCCDCF. From Copenhagen, automated (close-out session's Mac, lock log): nothing gated loaded before a choice, and no message was drawn in two tries | Nancy: the Copenhagen check, and accept this reworded line: "Before a choice, the only Google traffic is the consent tool (fundingchoicesmessages.google.com, plus at most one request marked fcd=true on pagead2.googlesyndication.com), the type files (fonts.googleapis.com, fonts.gstatic.com) and the font loader (ajax.googleapis.com). The only cookies are _cfuvid, FCCDCF and possibly FCNEC. No Google Analytics, Tag Manager, DoubleClick or Ahrefs request and no _ga cookie until a choice is made. Cookie settings reopens the message in Europe and opens /cookies elsewhere." The other way to pass is to host the type files and the font loader on the site itself, which is a build of its own and is not proposed in this run |
| 2 | /visits/* and /my-passport do not return 200; the sitemap lists only indexable pages | First half passes (404 and 301). Second half open: three contributor pages become noindex after scripts | 139 addresses fetched; 9 contributor pages rendered | Session: stage three sitemap flags (plan row S1). Then a publish on Nancy's word |
| 3 | Ko-fi checkout opens from /the-paw-passport and the homepage; the card shows price, version and last verified; the moving guide shows "Coming soon" | Open. Only the last clause is true today | No product link exists anywhere on the site, in the repo or in the handoff notes | Nancy: link, price, the collection choice. Then the session builds |
| 4 | Thailand stub gone from /stories; featured slot editor-picked | Passes | Item 6 row | Nobody |
| 5 | Verification id in Webflow's SEO settings (or the TXT record in DNS) | Not done | No verification tag served on any page | Nancy |
| 6 | Footer, homepage and map counts agree and come from tllStates; "35 kg places" gone | "35 kg places" is gone. The rest is not met as written and cannot be: 54 (countries the stories cover), 57 (stories), and 89 and 90 (Nancy's own map) are different measures and will never be equal, and site totals cannot come from one member's map | Item 8 row and the "places" section below | Nancy: decisions E1 to E4, and what "agree" should mean |
| 7 | No regressions | Passes at 1440 and 390 | /contact: no relay element, no form, one mailto. /support H1 "Six doors. Pick yours." visible, 342 by 81 px at 390. New Orleans story: no "Reklame" in any text or pseudo-element. Search: the input is visible at 390 (235 by 44 px, inside the screen). Typing alone does not filter (57 cards stay); pressing Enter goes to /stories?q=Kilimanjaro and one card shows, the Kilimanjaro story. Not observed: what Google itself would draw inside an ad slot for a Danish visitor | Nobody |
| 8 | Lighthouse and axe on the homepage, /the-paw-passport and one story, before and after | Not run | None | Session: run both before the build pass starts and again after it, and put the numbers in the change log |

## Change log for this pass

No Webflow element, CMS item, script or setting was touched. Proposed changes, each with page, element, before, after and why, are in claude/tll-run1-build-plan-2026-11-11.md and wait for Nancy's approval.

One side effect, disclosed: to prove that a file in the public repository can be fetched by anyone, one reader made a single request to jsDelivr for one commit-pinned file. jsDelivr keeps commit-pinned files once requested, so that one file may stay there even after the repository is made private. No further request of that kind was made. Removal needs a request to jsDelivr.

## Consent: the approach chosen, and why

Chosen: ONE approach, (b). Google's certified consent message (Funding Choices, IAB TCF, cmpId 300) is the only consent UI, wired to Google Consent Mode v2. It is what the site already runs. The decision was first logged on 31 October and restated on 9 November.

Why:

1. Google requires a Google-certified consent platform that works with the IAB framework to serve AdSense ads to visitors in the EEA and the UK (since 16 January 2024) and Switzerland (since 31 July 2024). Without one those visitors get limited ads at most.
2. TLL's own banner was the open source cookieconsent library. It is not certified: no IAB registration, no consent string. Said plainly: approach (a) would not meet the AdSense requirement.
3. (b) is already built, and the site code gates correctly in simulation. (a) would mean rebuilding and losing ad eligibility in Europe.
4. The cost of (b): Google's files load and a Google cookie is set before the choice, and the dialog is Google's design, with "Consent", "Do not consent" and "Manage options" over the IAB purposes. The prompt's three named categories (Necessary, Analytics, Advertising) exist only as the site's mapping, not as buttons. Any certified platform behaves the same way with its own script and cookie; only the vendor changes.

Both are not running: no request for the old library in 1,473 requests today. Harmless leftovers in the site head: a stand-in object named CookieConsent (kept so older calls still work), unused #cc-main CSS, and one out of date comment.

How it is built (read from the Designer site head by the consent reader; the same bytes are served on www):

- `<script id="tll-consent-v3">` is the first script in the site head. It sets the Consent Mode v2 defaults before any Google tag: ad_storage, ad_user_data, ad_personalization and analytics_storage denied; functionality_storage and security_storage granted; wait_for_update 2000; ads_data_redaction on. Worldwide, not per region.
- It then loads Google's consent tool, waits up to 15 seconds for an answer, and on a choice (or on "European rules do not apply") sends the consent update and fires the site event tll:consent.
- Mapping from IAB purposes: analytics = purposes 1 and 8; ad storage = purpose 1; ad user data = 1 and 7; personalized ads = 3 and 4. Outside Europe everything is granted.
- Google Analytics (G-T1K83PRL1R) and Ahrefs are injected only inside that update, when analytics is allowed. The ad script (pub-7257230007536660) loads only after tll:consent with ads allowed, and only on /stories, /stories/* and /countries/*.

What was measured:

| Where | Before the consent answer | After the consent answer |
| --- | --- | --- |
| www, real Google, this machine (outside Europe, so Google answers by itself 0.8 to 1.8 s after load and no visitor choice is involved). 10 loads today after the 17:07 publish | Requests: the consent tool's files, fonts.googleapis.com, fonts.gstatic.com, ajax.googleapis.com. Cookies: _cfuvid and FCCDCF (FCCDCF was present at the moment of the answer in 10 of 10). No request to pagead2.googlesyndication.com in any of the 10 | In the same step: gtag/js and Ahrefs. Then the _ga cookies. One request to pagead2.googlesyndication.com marked fcd=true, 0.7 to 1.3 s after the answer (10 of 10). FCNEC 1.3 to 2.1 s after the answer (10 of 10). The ad script and DoubleClick on /stories and the story only |
| Test copy, real Google (verifier, 6 loads, before the 17:07 publish; the consent code is the same bytes) | No answer ever arrives on this address. Within 12 s: the fcd=true request in 2 of 6 loads, FCCDCF in 3 of 6, FCNEC in 2 of 6. So Google's tool does not wait for an answer before making that request or setting those cookies | Nothing: analytics and ads never load there |
| www, stand-in tool answering "European rules apply" (simulation, consent reader, not re-run) | Only the consent loader; cookie _cfuvid only | Accept all: Google Analytics, Ahrefs, the ad script on the story. Reject all: nothing. Storage plus measurement only: Google Analytics, Ahrefs, and also the ad script. Storage only: the ad script only |

Notes on that table:

- The fcd=true request is made by Google's own consent tool. The file it asks for changes from load to load (seen today: google_top_exp.js, osd.js, lidar.js, show_companion_ad.js, adsbygoogle.js and rum.js). What it is for is not documented anywhere this pass could read; it looks like an ad blocker check, and that is a guess.
- Whether that request, FCCDCF and FCNEC happen before a choice for a visitor in Europe is not proven. The test copy result says they do not wait for an answer. Step 4 and step 5 of the Copenhagen check settle it.
- One gap in the site's own mapping (simulation): the ad script loads whenever purpose 1 (storage) is allowed, even when every advertising purpose is refused. A one-line tightening is offered in the build plan (row K1). It touches the consent script, so it needs Nancy's yes.
- Earlier logs say "no console error" on the footer link. Before the 17:07 publish that was true of uncaught errors only: Google's code printed a caught error on every click outside Europe. After the publish no such line is printed (10 of 10 clicks).

Cannot be concluded from this machine (location): whether Google's European message appears for a visitor in Denmark at all; whether "Cookie settings" reopens it there; acceptance 1. One strong hint that the message may not be published for the site (consent reader, verified facts, inferred conclusion): a forced preview of the European message drew nothing, while the same preview switch drew the US state message; and the close-out session saw no message from Copenhagen in two automated tries. If that is right, a visitor in Europe stays on "denied" forever: legally safe, but no analytics and no ads from Europe, and "Cookie settings" has nothing to open. The AdSense clicks in the build plan (part 7) fix it.

## Member data: the photo path, the two ticked boxes and the template locks

In plain words: every member-data address answers "not found" today, and nothing of a member's is exposed. But three things keep item 4 from being closed.

1. **The photo path (most serious, hold in progress).** Since the Worker deploy of 11 November 13:28 UTC, a photo a member sends on /share-photos is saved as a published item straight away and shown on /gallery within minutes, with the member's name in the item's name and web address. The page tells the member a person looks first. No photo has gone through: the collection is empty. The fix is built and tested in this repo, and its independent review passed at about 17:50 UTC (lock log). It has two parts, and they do not do the same job. The Worker half is the real lock: photos are saved as drafts, with no name in the address. It is required before the answer can be yes, because the Worker that is live today still publishes any photo a signed-in member sends to it directly, whatever the page does. The page half (site code 16.59.0: the page stops handing photos to the Worker) is a stopgap for the normal form path only. Neither was live on www at 17:47 UTC. The page half is staged in the site header (since 17:47 UTC; www still runs 16.58.0) and goes live with the next www publish, which waits for the home row rebuild to finish. The Worker half needs Nancy's Mac and can be done now. Until one of them is live, this session watches the Worker's answer and will set any member photo that appears back to draft. Full notes: handoff/PHOTO-HOLD-2026-11-11.md.
2. **Two consent boxes served already ticked** on /share-photos: "On our Instagram and LinkedIn" and "On the homepage". A tick the member did not make proves nothing. Only the Designer has the switch ("start checked"). Until then the Worker with the hold records no social permission at all.
3. **The templates have no permanent lock.** Protection today is only "no live item in the collection". Whether a live item would serve a public page at once is inferred, and the evidence is mixed: seven other collections with live items answer 404 on their item addresses, while Visits did serve a page on 9 November. A Designer lock (password or the Draft switch) removes the question. The tools a session has cannot set a page password, and the log says the API refused to draft a template page.

One decision for Nancy, because two plans disagree. The lock log says Photos will be built by extending the empty Photo submissions collection. A locked template would get in the way of that. Suggested: lock the other templates now (Visits, Comments, Press applications, Pet Notes, and Bookmarks unless it becomes Guides) and let the Photo submissions template follow the Lounge decision. Until then the rule for that collection stays: no photo item is published by anyone.

Also on public pages today, and a reason of its own in the answer below: children with clear faces. The Lounge audit found this and checked it again after the 17:07 publish (claude/tll-lounge-audit-2026-11-11.md, "Decide first" 2 and 3). Counted by the independent checker after that publish: the Ghana photo is in the page code of 19 of the 139 sitemap pages (home, /gallery, /stories, five story pages, /countries/ghana, /destinations and nine profile pages), and two Vietnam "Noodle Week" gallery photos are on 1 story page. The checker counted pages and did not open the images; the faces are as the audit describes. Nancy's to decide.

## Counts: what "places" means on the map (for Nancy's decision; nothing changed)

In plain words (the logic was read by the money reader and matches the count rules note of 19 October; the numbers on screen were read again after the 17:07 publish):

- The list of things a member can tick has 250 entries: the 249 ISO country codes plus Kosovo. The 249 ISO codes include territories (Faroe Islands, Aruba, Curaçao, New Caledonia, Bermuda and so on) and Antarctica.
- A place counts when any person on the account marked it Lived or Stayed.
- A place marked Layover only never counts toward the total. Layovers are shown beside it.
- Pets never count toward the member's numbers. Each pet has its own count.
- "Places" is every counted entry, Antarctica included.
- "Countries" is the same set without Antarctica. Territories and Kosovo stay in.
- The counter divides by 249 while the list has 250 entries. Someone who ticked everything would read "250 of 249".

Nancy's saved map today, by that rule: 90 places = 89 countries + Antarctica. The 89 = 84 UN member states plus the Faroe Islands, Curaçao, Aruba, New Caledonia and Kosovo. Three layover-only places are not counted. Magnus has 15 places on the map (Denmark included); home shows 14 for him, as does his pet page; /the-paw-passport types "13 countries" three times.

Why 87 does not appear: no rule in the code gives 87 from this map. By the rule it is 89. UN members only is 84. UN members plus Kosovo is 85. To read 87, two entries have to come off her saved map, or the rule has to drop two named territories.

Where the numbers on screen come from:

- Footer (54 countries, 57 stories, 6 travelers, 1 pet): the footer script counts the sitemap and the /stories cards. It is site coverage, not anyone's travel.
- Home chapter label "6 STORIES HERE · 57 PUBLISHED SO FAR": the 6 is the number of cards the row shows; the 57 is the same total as the footer. Nothing typed.
- Home map band "NANCY'S MAP: 89 COUNTRIES + ANTARCTICA · 3 LAYOVERS BESIDE · 90 OF 249 PLACES": her saved map through the Worker. A signed-in member sees their own line from their own tllStates.
- /the-map signed out: a sample traveler, labeled "SAMPLE MAP" (30 of 249). "Countries 89 / 90 of 249" is what Nancy sees signed in (inferred from the code; no login was used).

So the footer and the map can never "agree": 54 is story coverage, 89 and 90 are one person's travel. And the footer totals cannot come from tllStates, which is one member's map. The right single source for the footer is the Site stats item the Worker already writes (57, 6, 1, 54 today).

Decisions for Nancy:

- E1. Is her number 87 or 89? If 87, which two entries come off her map? (The count rules note already flags New Caledonia as unconfirmed.)
- E2. Do territories count as "countries" in the Countries line, or only as places?
- E3. "of 249" with a 250-entry list: change to "of 250", or leave one entry out of the denominator?
- E4. Magnus: does home (Denmark) count? 15 on the map, 14 on home, 13 typed three times on /the-paw-passport.

Also found: the story coverage number is low by three. Three story place lines do not resolve to any country (one joins two countries with "and", one is a route "A to B", one is a US city and state), so Croatia, Bosnia and Herzegovina, and Singapore are missing from the 54. With them it would be 57. The Worker uses the same table and has the same gap. The 54 also includes Antarctica, Kosovo, Aruba and Curaçao, which is why "places" is offered as a label option.

## Privacy sweep hits (live stories and pages; nothing edited)

Every line flagged on 9 November was still live and unchanged when the privacy reader swept (16:00 to 16:55 UTC). Hit 1 was read again after the 17:07 publish and is still live. No new high-risk hit. No Danish street name, floor, "from my window" line or named small child of the household in any live story. Suggested neutral replacements for hits 1 to 4 were written on 9 November (claude/tll-p0-recheck-2026-11-09.md). Paraphrased here on purpose: no name and no private detail is copied.

| # | Story slug | Class | What the line does (paraphrase, no names) | Confidence it breaks the guardrail |
| --- | --- | --- | --- | --- |
| 1 | sort-sol-black-sun-denmark | Future travel plan | Says the couple will sign up for a named Danish city marathon next year, which fixes where they will be on a known race date | High |
| 2 | luxembourg-schengen-road-trip | Companion's whereabouts | Names a friend by first name, the small town abroad where she lives, her profession, and her dog's name and age; the town is also in the route stops field | Medium to high |
| 3 | ghana-easter-everyone-wears-white | Companion's whereabouts | Names the family that keeps the dog at home while the couple is away | Medium |
| 4 | patagonia-w-trek-christmas-new-year | Companion's whereabouts | The same family named again, back home with the dog | Medium |
| 5 | antarctica-marathon (also marathon-on-all-7-continents, /about and two card excerpts) | Home-locating | A walk to a named travel company's office in the home city; a marathon run inside the apartment | Low to medium (city level only) |
| 6 | kilimanjaro-someone-was-already-awake | Companion's whereabouts | One trek-mate described by where she lives and what she teaches, another by profession, a third wished a happy birthday on a dated day | Low |
| 7 | texas-hill-country-boot-scootin-eclipse | Companion's identity | In-laws named in full, the editor's birth-family surname, two grandparents by first name, a named city garden | Low to medium (past event) |
| 8 | vietnam-ninja-duckies | Child | An unnamed eight-year-old neighbor during the 2021 quarantine | Low (unnamed, past, abroad) |
| 9 | ghana-easter-everyone-wears-white | Child | Another guest's toddler named by first name with an approximate age | Low |
| 10 | amsterdam-stroopwafel-time, chile-santiago-chilean-kazakh-wedding, sao-paulo-first-nfl-game-brazil, ghana-easter-everyone-wears-white | Named "son" | The Chile story says he is an adult, so not a named child. Listed so nobody flags it again | Low |
| 11 | croatia-te-amo-velho-birthday-week | Personal data | An age at a dated birthday gives a birth year | Low |

Not hits: every other "2027" line is a public race, eclipse or carnival date with no statement that the author will attend. The sort-sol story's "next weekend" line is dated September 2026 and is past.

Static pages: /about, /privacy, /terms and the home structured data give Copenhagen, Denmark at city level only. The pet page says "Home base: Copenhagen, Denmark". Three of the nine contributor pages in the sitemap carry a member-chosen home place in their structured data (place name only; low). /the-map, /travelers, /gallery and /the-paw-passport: no future-plan or live-whereabouts wording found. The private editor-note fields do not appear in any served story page.

## The diary's private details are public through the code repository

The GitHub repository that serves the site code is public. It has to be today, because jsDelivr serves the site code and the search index from it, and jsDelivr only serves public repositories. Six tracked files in it contain the diary's private details, two of them full CMS exports of the diaries (count re-run at 17:39 UTC: still six). One of them was fetched from jsDelivr and from GitHub's raw address without signing in (privacy reader). The repository name is visible in the page source of every page on the site. The six paths were handed to the main session and are not listed here, because this file goes into the same repository. Also in the repository, not audited further: 10 non-site email addresses in tracked text files (count only), and CMS export folders that may hold member records.

This is outside the prompt's list, so it is reported and nothing was done. The safe order, if Nancy wants it closed: first move code delivery to a small public repository that holds only the built site code and the search index; then make the main repository private; then decide whether to remove the six files from history; then ask jsDelivr to remove the one file that was fetched. Making the repository private first would break the site code on every page.

Not checkable from here: Google's index or cache of the old diary addresses (needs Search Console).

## Is the site safe to promote?

**www as it is right now (17:47 UTC, 11 November): No.**

Reasons, most serious first:

1. **Member photos would go public unreviewed.** The first photo a member sends on /share-photos is published at once with the member's name in its address, while the page promises a person looks first. Promoting the site is exactly what brings that first photo. The hold is built and reviewed, and it is not live. The Worker deploy on Nancy's Mac is the real lock and is required before the answer can be yes. The next www publish with site code 16.59.0 (staged) is a stopgap for the normal form path only.
2. **Children with clear faces are on public pages.** Nancy's rule is no recognizable children's faces on public pages. The Ghana photo is in the page code of 19 of the 139 sitemap pages (home, /gallery, /stories, five story pages, /countries/ghana, /destinations and nine profile pages). Two Vietnam "Noodle Week" gallery photos are on 1 story page. Promoting the site sends new visitors to those pages, the home page first. The questions and the suggested fix are in claude/tll-lounge-audit-2026-11-11.md, "Decide first" 2 and 3.
3. **Consent in Europe is unproven.** The site's own code holds analytics and ads until a choice, which is the part that matters legally, and it passes. But nobody has yet seen Google's message appear for a visitor in Denmark, and nobody has seen "Cookie settings" reopen it there. If the message is not published, European visitors are never asked, never counted and never shown ads.
4. **The diary's private details are public** through the code repository, and one story line still states a future plan (sweep hit 1). This is the same kind of leak item 3 was written to close.
5. **Two consent boxes on /share-photos are served already ticked.**
6. Smaller, and quick to close: "More landing weekly." on home; /terms still names a "weekly digest" and says every submission gets an AI-assisted first read (the same claim Nancy held back on three other pages today because that first read is not running); the member-data templates have no permanent lock.

It also cannot take money yet. That is a growth blocker, not a safety one.

What the 17:07 publish already closed, so it is no longer a reason: the Sunday 09:00 promise, the typed "87 countries", "35 kg places", the footer link outside Europe, and /layovers missing from the sitemap. The AI first-read sentences are gone from /editorial-charter, /faq and /submit.

What would turn the answer to yes: the Worker with the photo hold deployed and checked (the www publish with site code 16.59.0 alone is not enough) and the two boxes unticked; the children's faces dealt with as Nancy decides (the Ghana photo on 19 pages and the two Vietnam gallery photos; claude/tll-lounge-audit-2026-11-11.md, "Decide first" 2 and 3); the Copenhagen check passed (the message appears, nothing gated loads before a choice, "Cookie settings" reopens it); Nancy's decisions on the repository and on sweep hits 1 to 4 carried out; and the small lines in reason 6 corrected. That is the list as known at 17:47 UTC. It is not a promise that nothing else will turn up: no signed-in view was checked, and Lighthouse and axe were not run.

## Corrections to earlier notes

- /my-passport answers 301 to /the-map, not 404 (the prompt's item 4 is out of date; acceptance 2 still holds).
- "Cookie settings: no console error" (9 and 11 November logs) was true of uncaught errors only until the 17:07 publish. Since that publish no error line is printed at all outside Europe.
- The earlier draft of this recheck said that on www one request to pagead2.googlesyndication.com and the cookies FCCDCF and FCNEC all come before any choice. Measured again: on www from this machine that request comes after the consent answer every time (18 of 18 loads between the verifier and this pass), and FCNEC came after it in all 10 loads where cookie timing was recorded; only FCCDCF is there before it. That they do not wait for an answer is shown on the test copy only.
- The earlier draft said the fcd=true file is named adsbygoogle.js "about one load in ten". No rate can be given; the file name simply varies.
- The acceptance line 1 rewording in the earlier draft left out Google Fonts and ajax.googleapis.com, which are requested before the consent answer on every load. They are in the line now.
- The footer link change from "#" to "/cookies" needs three edits to have any effect, not the one field the close-out log names. Two scripts cancel the click today (the footer script and the head script), so with scripts on the link never moves the visitor by itself; the site code does.
- Which task made the test copy publish stamped 14:57 UTC is not settled between the logs. It no longer matters: both addresses now carry the 17:07:23 publish.
- A cloud machine is outside Europe for Google; Nancy's Mac is inside. Both notes in the logs are right about their own machine.
- Seven staged contributor items that are not live have their sitemap flag on (read 17:30 UTC), not one as the first draft said and not six as the verifier counted.

## Found on the way, nothing done

1. /terms still says each submission goes through "an AI-assisted first read". Nancy held that claim back on /editorial-charter, /faq and /submit at 17:07 because the first read is not running. /terms was not in that list. It is the trust and conversion session's page.
2. Google Fonts and Google's hosted font loader are requested before the consent answer on every page (they set no cookie in these runs). Hosting the type files on the site itself would remove three Google hosts from every first visit. A court in Germany ruled against a site over Google Fonts in 2022 (general knowledge, not checked today). Reported for a later run.
3. fonts.bunny.net is requested on the test copy on every load and never on www: not in 10 signed-out loads today, and not on /login with the sign-in form on screen. Inferred source: Memberstack's test mode on the webflow.io address. So it is not added to the /privacy list.
4. Every page carries placeholder="Example Text" in its page code on the site-wide "Tell the editor" box. A script rewrites it; with scripts off it shows.
5. Existing copy on /privacy, /terms, /support and /contact uses four words that contain the letter run the house rules ban (the word for a paid plan on /privacy, and the words for owning, partnering and belonging on the others). None is in a proposed row. Listed for Nancy.
6. /collections/{slug} answers 200 with noindex (5 live palette items, not member data, not in the sitemap). /profile and /corrections answer 200 with noindex and are not in the sitemap. All three are as intended.
7. The home structured data lists a Substack address under sameAs.
8. The site code sends revenue_click on any Ko-fi link with the page's division ("tll" on home, even for a Paw Passport guide), and that event is queued before consent and would be sent if consent is given later on the same page view. Events sent through tllEv are dropped instead. A Ko-fi checkout click would also fire kofi_click from the same script, so one click gives two or three events.
9. On the test copy Google Analytics never loads, so test visits are never counted and no GA4 event can be tried there.
10. The home line "The EU pet travel guide. Read it before the ferry, not in the queue." promises a guide with no way to get it.
11. The sitemap is served as application/rss+xml (Webflow's doing; low risk).
12. All five Marathons drafts and the stub draft still have their sitemap flag on; it only matters if one is republished.
13. Typed leftovers a visitor does not see: the /the-map explainer "87 Already logged" and "108 Still to go" (hidden; a script rewrites the first to 89), a hidden "88" on the editor's own page, and the /submit example title that contains "Country 88".
14. The small label "What founders get" still shows under the chapter 06 buttons on home, with the sentence it introduced cut. It is the close-out session's open question for Nancy.
15. Two script-built buy buttons for the EU guide exist in the repo, both switched off by an empty link (tll-pet-passport-v1.js and tll-kofi-v1.js). They must stay off once the CMS card exists, or the page would show two buttons.

## What was not run or not verified

- Lighthouse and axe: not run, on any page, in any pass today.
- Anything from a Danish or other European address: the consent message, the footer link in Europe, acceptance 1.
- The bare domain thatlayover.life.
- Any signed-in view.
- The AdSense "Privacy & messaging" settings and the Search Console field in Webflow: no tool can read them.
- The "Featured in the library" flags on draft stories, the contrast figures in the card design and the 37-page Ko-fi link search: carried from the money reader, not re-run. The Ko-fi result was re-checked on home, /the-paw-passport and /support only.
- Welcome emails in Webflow forms, Memberstack or Mailchimp.

## Evidence files (session scratchpad, not in the repo)

- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/run1/rewrite/consent-www.json (10 first-visit loads after the 17:07 publish: every request with its time, the cookie timeline, the consent answer, the footer link click)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/run1/rewrite/content-www.json and /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/run1/rewrite/extra-www.json (footer, Magnus line, links, guide block, /stories and its search, regression checks, contributor robots tags by item id, at 1440 and 390)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/run1/rewrite/consent.cjs, content.cjs, extra.cjs, scan.py and summ.py in the same folder (the scripts)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/run1/verify/evidence-summary.txt (the verifier's measurements)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/run1/result-recheck-consent.md, result-recheck-privacy.md and result-recheck-money.md in the same folder (the three readers' raw reports, written before the 17:07 publish)

Privacy handling: the page mirrors and address lists made for this pass were deleted after use. No member name, email or handle is in this file. The marathon diary's private details are not quoted.
