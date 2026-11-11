# Launch blockers close-out: change log for Nancy's approval (11 November 2026)

Source: your priorities doc of 11 November 2026 ("Tier 1: P0 fix prompt, then one merged pass") and the P0 prompt of 9 November 2026 (`claude/tll-cc-blockers-2026-11-09.md`).

Status, updated 11 November 2026 after your "Approve P1 to P5, cut both": **built and on the test site (that-layover-life.webflow.io). www is untouched.** What was built, what was not, and one correction to the first version of this log are in Part 6 at the end. Parts 1 to 5 are the check of www as published on 11 November 2026 at 14:06 UTC (task 3d68e41b, layers 16.55.0), as you approved them. Nothing goes to www without your word.

## Short answer

- Of the ten items, **3 are closed, 3 are closed for a visitor but still wrong in the page code** (what search engines and audits read), and **4 are open**.
- Three of the four open ones wait on you, not on a build: the Ko-fi link, the consent test from Copenhagen, and keep or cut on the Sunday letter.
- The fourth is /submit. Another session has already repaired it in Webflow; it is not on the test site yet.
- I can fix five small things now (P1 to P5). Two more depend on a decision from you (P6, P7).

## Part 1. The ten items

Checked on 11 November 2026 between 14:15 and 14:35 UTC. "In a browser" means a clean, signed-out browser with scripts running, at 1440 and 390 wide. "In the page code" means the page as Webflow serves it, before any script runs.

| # | Item | Today | Evidence |
|---|---|---|---|
| 1 | Paw Passport guide: Ko-fi link and price | **Open. Waits on you.** | /the-paw-passport: the guide block says "What happened at the border at 11pm with a Samoyed in the back is the part you pay for." There is no price, no button and no Ko-fi link anywhere on the page. Home: the button "Get the guide · €9" is in the page and hidden, with no link behind it. The only Ko-fi link on the site is the tip jar on /support. The wiring is ready and needs one thing: the product link. |
| 2 | Footer "Cookie settings" | **Both reports are true. Works as built, with one gap.** | The link is `href="#"` and carries `data-tll-cookie-prefs`. A script catches the click and asks Google to reopen its consent message. Clicked from this Mac: no error, the page does not jump, and nothing opens. Correction (see Part 6): this Mac counts as Europe for Google, so that click should have reopened the message, and it did not in my automated browser. Outside the EEA, the UK and Switzerland Google has no message at all, so a visitor in the US clicks it and sees nothing happen either. Fix for that part: P5. Whether the message opens for a real visitor in Europe is step 4 in Part 3. |
| 3 | First-visit consent in Europe | **Half checked. One part only you can see.** | Correction (see Part 6): this Mac is in Europe as far as Google is concerned, so I ran the first half myself. Before any choice, nothing from Google Analytics, Google ads or Ahrefs loads, and no tracking cookie is set. That part passes. But in my automated browser Google's consent message never appeared, so there was nothing to click. It needs your eyes in a normal browser: Part 3, step 4. |
| 4 | Footer numbers | **Right for a visitor. Wrong in the page code.** | In a browser: "54 countries in our stories · 57 stories · 9 travelers · 1 pet". In the page code, on every page: "87 countries in our stories · 6 stories · 1 traveler · 1 pet". The label already reads "countries in our stories", so the page code is claiming 87, which is not true of the stories. The trust and conversion session has this (its item 1: the numbers come from the Site stats item, and travelers become 6 by your rule D1). I do not touch it. |
| 5 | Home "Layover guides" row, /layovers, /marathon-diaries | **Closed.** | /layovers answers 200 and shows the Copenhagen and Sofia guides. The home row shows both cards, and in a browser they open /layovers/cph-copenhagen-6h and /layovers/sof-sofia-3h (both 200). /marathon-diaries answers 404 ("page not found"). That is correct today: all five marathon diaries are drafts, none is live, and no page on the site links to /marathon-diaries. A list page comes back when a diary does. Small leftovers are in Part 4. |
| 6 | Magnus "35 kg places" | **Right for a visitor. Wrong in the page code. Cause found.** | In a browser, both places read "35 kg · 14 places". In the page code they read "Magnus · Samoyed · 35 kg ·  places" and "Samoyed · 35 kg ·  places · advisory capacity". Cause: the word "places" is typed into the page inside a hidden wrapper, and a script fetches the number from Magnus's pet page and then un-hides it. Anything that reads the page without running scripts (search engines, link previews, an audit tool) gets the word with no number. A visitor would see the same if the fetch of his page failed. Fix: P1. |
| 7 | "The Layover Letter", Sundays at 09:00 | **Open. Your decision: keep or cut.** | The promise appears in seven places, listed in Part 2 under P6. /stories already says it the careful way: "No schedule we'd break. It lands when a story earns it." |
| 8 | Marathon diary details, /visits pages, Thailand stub | **Closed.** | All 404: /marathon-diaries/copenhagen-marathon-2026-recap, /marathon-diaries/tokyo-marathon-2027-prerace, /visits, /visits/nancy-carleton-luxembourg-city-2026, /stories/the-art-of-wellbeing-thailand-luxury-health-destination-2026. None is in sitemap.xml (138 addresses read). In the CMS the two diaries, the one Visits item and the stub are drafts. /bookmarks, /comments, /photo-submissions, /press-applications and /pet-notes are 404 too. The Designer password on the six templates is still your step (Part 3). |
| 9 | Promises the site cannot keep | **Open. Most are with the trust and conversion session. Three are for me, two for you.** | Full list in Part 5. |
| 10 | /submit placeholder text | **Open on www and on the test site. Already repaired in Webflow by another session, not published yet.** | Details below the table. |

### Item 10 in detail: what is wrong on /submit

A signed-out visitor never sees it: the form is removed from the page until you sign in. A signed-in member sees it on step 3 of 3. Search engines see it in the page code. Picture of step 3 as www serves it: `src/pages/submit/live-2026-11-11/p0-closeout/submit-step3-www-before.png`.

1. The block that asks who you are (name, email, Instagram) has no real words in it:
   - its heading reads "This is some text inside of a div block."
   - each of the three fields is labeled "Form Label" and then "This is some text inside of a div block."
   - each of the three help lines reads "This is some text inside of a div block."
   - that is the sentence 7 times and "Form Label" 3 times.
2. "Example Text" shows as the gray hint inside five boxes a member can reach: "When did you travel?", the disclosure line, name, email and Instagram.
3. Two fields are still named "Field 5" behind the scenes: "When did you travel?" on the story form and "Title" on the link-only form. Nobody sees the name, and the Worker reads the fields by exactly that name, so it must not be renamed without the Worker. No change proposed.
4. Not placeholder text, but on the same step: one heading reads "Your credit and links& affiliation".

Where it stands: someone has already fixed point 1 in Webflow since the www publish (no line in the lock log; most likely the cloud copy session, whose open item this is). Read at 14:25 UTC: the labels now say "Name", "Email" and "Instagram", the heading and the three help lines are hidden, and the "When did you travel?" field is now named "trip-when", which the Worker also accepts. On the test site only the three "Form Label" words are gone so far, because the rest was written after the last test publish (14:12 UTC). I did not take this item and I will not write those elements. I check it on the next test publish. Point 2 is my P4. Point 4 belongs to the session that has the /submit text.

## Part 2. Proposed fixes

Each one is staged, published to the test site only, checked at 390 and 1440, and shown to you before www.

### P1. Home: the Magnus line reads right without scripts

- Where: home page, two blocks of page code: the Magnus photo caption in chapter 04, and the third line of the founding roster in chapter 06.
- Before, in the page code: "Magnus · Samoyed · 35 kg ·  places" and "Samoyed · 35 kg ·  places · advisory capacity".
- After, in the page code: "Magnus · Samoyed · 35 kg" and "Samoyed · 35 kg · advisory capacity". The script adds " · 14 places" as one piece, number and word together, once it has the number from his pet page.
- What a visitor sees: no change. "35 kg · 14 places", and the number still comes from his page.
- Rollback: the two blocks as they are today (copies saved before the write).

### P2. /account: two lines that still say "reviews within 48 hours"

These two are not on the trust and conversion session's list, and they say the opposite order to the wording you chose there (a human reads first).

| Where on /account | Before | After |
|---|---|---|
| The "Stories published." card | A human reviews every submission within 48 hours. Your byline stays yours. | A human reads every story before it goes live, usually within 48 hours. Your byline stays yours. |
| The empty "No stories yet." box | Share your first story. A human reviews it within 48 hours. | Share your first story. A human reads it before it goes live, usually within 48 hours. |

Text only. No Memberstack element is touched. Same hold as that session's lines: this goes to www only together with the Worker change that saves submissions as drafts.

### P3. Home: the three descriptions search engines read

These sit in the page head as structured data. A visitor never sees them; Google does.

| Before | After |
|---|---|
| A community travel magazine. Every byline a real person, every submission reviewed by a human within 48 hours. Based in Copenhagen, Denmark. | A community travel magazine. Every byline a real person, every story read by a human before it goes live. Based in Copenhagen, Denmark. |
| A library of travel stories, written by the people who actually got on the plane. Edited lightly, reviewed by a human within 48 hours. Every byline a real person. | A library of travel stories, written by the people who actually got on the plane. Edited lightly, read by a human before it goes live. Every byline a real person. |
| That Layover Life publishes travel stories from named travelers (Magnus 🐻‍❄️ Waffles included). Reviewed by a human within 48 hours, free to read. | That Layover Life publishes travel stories from named travelers (Magnus 🐻‍❄️ Waffles included). Read by a human before they go live, free to read. |

Same hold for www as P2. The same kind of line is in the structured data of /about and /submit; those pages are with the trust and conversion session, so I pass the two lines to it instead of writing them.

### P4. "Example Text" out of the form boxes on /submit and /share-photos

- Where: five boxes on /submit (When did you travel?, disclosure line, name, email, Instagram) and five on /share-photos.
- Before: the gray hint inside each box reads "Example Text".
- After: no hint. The boxes are empty, and the label and help line above and below each one stay as they are.
- How: Webflow's tools cannot change that hint, so it is a few lines of script that clear it, the same way the "Tell the editor" box already does it. No new words, no field renamed, nothing a member typed is touched.
- Rollback: remove the script lines.

### P5. "Cookie settings" does something outside Europe

- Before: outside the EEA, the UK and Switzerland the link does nothing when clicked.
- After: in Europe, unchanged (Google's message reopens). Everywhere else, the click opens /cookies, which lists what the site stores and already says that Google shows no message where those rules do not apply.
- Two parts. (a) Three lines in the consent script: when Google has answered that its rules do not apply, go to /cookies. I can stage this. (b) The link itself changes from "#" to "/cookies", so it also works with scripts off. That is one field in the footer, so I make it only with you present, or you make it: Designer, footer, select "Cookie settings", Link settings, Page, Cookies.
- This touches the consent script, so I change nothing else in it, and the check in Part 3, step 4 still decides whether consent is right.

### P6. Only if you say "cut" on the Sunday letter (item 7)

If you keep the promise, nothing changes and the first letter is due the next Sunday at 09:00. If you cut it, these are the seven places, with wording borrowed from your own /stories block:

| # | Where | Before | After |
|---|---|---|---|
| a | Home, chapter 07, the line under the headline | One story. Sunday morning. Lounge wine optional. | One story, when it's worth it. Lounge wine optional. |
| b | Home, chapter 07, the small line under the email box | Sundays at 09:00 Copenhagen time. Unsubscribe anytime. | No schedule we'd break. Unsubscribe anytime. |
| c | Home, the message after signing up | You're in. One story, every Sunday, 09:00 Copenhagen time. | You're in. One story, when it's worth it. |
| d | Home, the round stamp on chapter 07 (site layers) | The stamp reads THE LAYOVER LETTER with SUNDAY and 09:00 CPH | The same stamp without SUNDAY and 09:00 CPH |
| e | Home, the line under the "coming soon" cards (site layers) | Guides, visa dates and city hubs are on the way. Get the Sunday letter and hear when they open → | Guides, visa dates and city hubs are on the way. Get the letter and hear when they open → |
| f | /stories, the label over the sign-up box | THE WEEKLY LAYOVER | THE LAYOVER LETTER |
| g | Home, under the story row | More landing weekly. | More on the way. |

Unchanged either way: the name "The Layover Letter", the headline "Your inbox deserves better than deals.", the "Newsletter" tab on /account, and the "OK to include in the TLL newsletter" tick on /submit. Lines d and e are in the site layers, so they go out with the next layers release, after the trust and conversion session's 16.56.0. Line g is about stories, not the letter; say if you want it left alone.

### P7. Only if you say "cut" on the founding badge (item 9)

Home, chapter 06 says "First 100 get a founding badge." Today the badge is a field somebody fills by hand. On /travelers only you ("FOUNDER · EDITOR") and Jay ("FOUNDING 02") have one. The six other travelers listed there have none, and nothing gives a number to a new writer.

- Cut: "The rebooked flight. The night on the gate floor. The best meal of your life in someone's kitchen. Write it. First 100 get a founding badge." becomes the same lines ending at "Write it." The chapter label "06 · The first 100" stays.
- Keep: I set the badge on the travelers already there, in the order they joined, after you confirm the order. Giving a number to each new writer is a Worker change and its own change log.

My recommendation: cut the sentence now, and bring it back when the badge is given without anyone having to remember.

## Part 3. Only Nancy can do

1. **Ko-fi.** Paste the product link for the guide (it looks like ko-fi.com/s/ and some letters, not the profile link), and confirm the price is €9 and whether the small line should say "incl. 25% moms". I do the rest: the button on /the-paw-passport, the button on home, a test publish.
2. **Designer password on the six member-data templates.** Pages panel, then the cog beside each of these: Visits, Bookmarks, Comments, Photo submissions, Press applications, Pet notes. Set Password, save. None of them serves a page today; this closes them for good.
3. **AdSense.** Privacy and messaging: check the European regulations message is on, and switch on Consent Mode support (it read "not configured" on 9 November 2026).
4. **The consent test, from Copenhagen (about five minutes).**
   1. Chrome, new incognito window. Press Cmd+Option+I, open the Network tab, tick "Preserve log".
   2. Load https://www.thatlayover.life/ and wait for Google's consent message. Click nothing.
   3. Type "google" in the Network filter, then "ahrefs". Fine to see: fundingchoicesmessages.google.com, the font addresses (fonts.googleapis.com, fonts.gstatic.com, ajax.googleapis.com) and one "osd.js" line. A fail is any of: googletagmanager, google-analytics, adsbygoogle.js, doubleclick, analytics.ahrefs.com.
   4. Click "Consent". Now googletagmanager and google-analytics should appear.
   5. Scroll to the footer and click "Cookie settings". The message should open again. If any step fails, send me the Network list.
5. **The Sunday letter: keep or cut** (P6).
6. **The founding badge: keep or cut** (P7).
7. **The footer numbers.** You already answered this one for the trust and conversion session (travelers by your rule, 6). Nothing more unless its write is refused by Webflow; then it is four numbers to blank in the Designer and it will write out the clicks.
8. **Reply times on /contact and /support.** These are promises too. Keep each one only if it is true every week: "Everything reaches one human, usually the same day." (/contact, also in its search description), "A human will write back, usually the same day." (/support), "We fix factual notes within 24 hours." (/support), "A different editor reviews. Within 14 days." (/support; there is one editor today). Tell me which to change and I add them to this log with wording for your yes.
9. **Carried from 9 November 2026, still yours:** the privacy edits to the Copenhagen marathon recap (your prose, list in `claude/tll-p0-recheck-2026-11-09.md`), and Search Console removal of the three dead addresses (the stub and the two diaries). The sitemap no longer lists them, so that can be done now.

## Part 4. Found on the way (not in the ten, nothing done)

- /layovers is missing from www's sitemap.xml (the two guides are in it), and the page has no canonical address or share image. The test site check session found the same. Nobody has taken it. I can add it to this log if you want it.
- /the-paw-passport says "13 countries" three times, typed. Magnus's own page lists 14. If the guide itself was written from 13, the first line may be right and the other two wrong. Your call on the number; then it should come from his page, as it does on home.
- The footer in the page code still lists three links a visitor does not see: The Layover Awards, Spotlight, For creators. Footer changes need you present.
- /share-photos signed in: still nobody has sent a real photo through the repaired form.

## Part 5. Item 9 in full: where each promise appears today

**"48 hours" for stories.** With the trust and conversion session (its items RV1 to RV6 and item 4, staged, on hold for www until the Worker change): /editorial-charter rule 3, /faq, /submit (subhead, sign-in gate, link-only form, search description), /for-press, /about (search description), /stories, every story page, /destinations. Not on its list, proposed here: /account (P2), home structured data (P3). Passed to it: one line each in the structured data of /about and /submit.

**"48 hours" for applications and listings, left as they are** (they are about press cards, expert applications and group listings, not stories): /for-press (three lines), /for-expats (four lines), /travelers press tile, /edit-profile press line. They hold only if someone answers within two days.

**"First 100 get a founding badge."** Home chapter 06, one sentence, plus the roster "Founding 01, 02, 03 · Pet". Decision in P7.

**"Every door replies in 48 hours."** These words are not on www today. The closest are "One editor reads every word in Copenhagen · Reply in 48 hours" on /submit (left as it is by the trust and conversion session, because it agrees with reading first) and the "same day" lines on /contact and /support (Part 3, step 8).

**/terms.** "a publish-or-revise decision within 48 hours": with you, as that session's item 8.

## For the build (notes for sessions, not for Nancy)

- P1: home page 69d6145df421c777840c1e46, HtmlEmbeds a4c1009d (figcaption and script h3-mag-js) and a0d1cd97 (roster). Read both from Webflow first; a4c1009d was rewritten by the copy pass on 11 November 2026 (`src/pages/home/live-2026-11-11/embeds/a4c1009d.after.html`). Script change: empty `[data-h3-mag-wrap]` in the markup; on success set each wrap's text to ' · ' + n + (n === 1 ? ' place' : ' places') and un-hide.
- P2: /account, two Paragraph elements (classes tll-pickin-card-body inside the card with data-tll-mod="stories", and tll-account-empty-body). The page footer code holds a COPY table that rewrites older strings to "Reviewed by a human within 48 hours..."; check whether any of its patterns still match before leaving it.
- P3: home page head, JSON-LD: Organization description, WebSite description, WebPage description.
- P4: clear placeholder when it equals "Example Text" or "Example text" on #wf-form-Story-submission and the /share-photos form. File inputs carry it too and never show it. Preferred home: the layers (submit and share-photos chunks), in the release after 16.56.0; tll-submit-ux-v1.js has another session's uncommitted edit, so ask before touching it.
- P5: site head consent script, function reopen(); keep the last TCF answer and branch on gdprApplies === false. Footer link a[data-tll-cookie-prefs] is in the TLL Site Footer component.
- P6 a to c: home HtmlEmbed c0c4bf75 and the form's success block; f: /stories, the tll-eyebrow-rose text in section tll-library-newsletter; g: home story row embed (h3-shelf-more); d and e: site layers (core letter stamp; chunks home.js and map.js line tll-soon-line).
- /submit contributor block as read from Webflow at 14:25 UTC: fieldset 990be92f, legend block 26eddbfb hidden, labels f3eb05d3 "Name", 8af1d8bf "Email", 746a6b03 "Instagram", help blocks 3aaca6b9, 339dac4f, fdfe577c hidden, trip-when input 4245d48c named "trip-when". The Worker reads `fields['Field 5'] || fields['trip-when']` (src/intake.js line 104), so the rename is safe. A second, hidden trip-when label bc7df393 holds a required input "Field 4"; hidden elements are not served.
- Tools used for the check are in the session scratchpad; the headless browser blocked analytics and ad requests so the check left no visits in the numbers.

## Part 6. Build record (11 November 2026, after "Approve P1 to P5, cut both")

On the test site since 14:52 UTC (publish task fcc32f7f, test address only). www still serves the 14:06 UTC publish.

### Done and checked on the test site, at 390 and 1440

| Item | What you see on that-layover-life.webflow.io | Checked |
|---|---|---|
| P1 | Home, chapters 04 and 06: "35 kg · 14 places". In the page code: "Magnus · Samoyed · 35 kg", no stray "places". | Page code compared with the saved copies, character for character. |
| P2 | /account: "A human reads every story before it goes live, usually within 48 hours. Your byline stays yours." and "Share your first story. A human reads it before it goes live, usually within 48 hours." | In the page code. Not looked at signed in. |
| P3 | Home: the three descriptions for search engines now say "read by a human before it goes live". | The whole block matches the saved copy; only those three lines differ from www. |
| P4 | /submit and /share-photos: no "Example Text" in any box. Real hints such as "Sofia, Doha, somewhere unspellable" are still there. | In a browser with the form un-hidden. Not looked at signed in. |
| P5, part a | The new code stands aside in Europe: with it running against www's real consent tool, "Cookie settings" behaves exactly as before. | 7 tests for the logic, and a private run against www. The outside-Europe path cannot be clicked from this Mac. |
| P6 a, b, c | Home, chapter 07: "One story, when it's worth it. Lounge wine optional." / "No schedule we'd break. Unsubscribe anytime." / after signing up: "You're in. One story, when it's worth it." | Page code and browser. |
| P6 d | The stamp on chapter 07 no longer says SUNDAY or 09:00 CPH. | Browser. See the note below. |
| P6 e | "Guides, visa dates and city hubs are on the way. Get the letter and hear when they open →" | Browser. |
| P6 f | /stories: the label over the sign-up box reads "THE LAYOVER LETTER". | Page code and browser. |
| P7 | Home, chapter 06 ends at "Write it." The badge sentence is gone. | Page code and browser. |

Also on the test site, from other sessions: /submit step 3 now has real labels (Name, Email, Instagram) and none of the placeholder sentences.

No sideways scroll, no repeated ids, no script errors, no failed layer file on home, /stories, /submit or /share-photos. Site layers are 16.57.0 (364 tests pass).

Pictures: `src/pages/home/live-2026-11-11/p0-closeout/shots/`. Before and after copies of the three home blocks and the search-engine block are beside them.

### Not done

- **P5, part b, the footer link itself** (from "#" to "/cookies"). The footer needs you present. Two clicks in the Designer: footer, select "Cookie settings", Link settings, Page, Cookies.
- **P6 g, "More landing weekly."** It sits inside the largest block of code on the home page (31,635 characters), which the copy session still has open. Rewriting that block from here risked undoing its work for three words. It is still on the test site and on www. It goes in when that block is free, or tell me to take it now.

### Three things for your eyes

1. **The stamp.** With SUNDAY and 09:00 CPH gone, the middle of the round stamp holds only a small "TLL". Picture: `shots/home-1440-ch07.png`. If it looks bare, the first design of this stamp had "ONE STORY · NO DEALS"; say the word and I put that in the middle.
2. **"WHAT FOUNDERS GET".** This small label sits under the two buttons in chapter 06, above the roster. With the badge sentence gone it promises something it does not name. Picture: `shots/home-390-ch06.png`. I left it, because it was not in what you approved. Cut it, or keep it?
3. **Google's consent message may not be showing in Europe.** See the correction below.

### Correction to the first version of this log

I wrote that this machine is outside Europe. That was wrong: it was true of the cloud session's machine on 9 November 2026, not of your Mac in Copenhagen. From here Google answers that European rules apply. So I could run the first half of the consent test, in an automated browser:

- Before any choice: no Google Analytics, no Google ads, no Ahrefs. Only fonts and Google's own consent files load. Cookies: Cloudflare's and Google's consent cookie, nothing else. Consent is set to "denied" by default. **This is the part that matters legally, and it passes.**
- But **no consent message appeared**, in two tries, one with an ordinary browser signature and a 15 second wait. Picture: `shots/www-first-visit-no-consent-message.jpg`. With no message nobody in Europe can say yes, so analytics and ads would stay off for every European visitor, and "Cookie settings" has nothing to reopen.
- I cannot tell from here whether Google simply hides the message from automated browsers, or whether it is not showing for anyone. That is why step 4 in Part 3 is now the most useful five minutes on this list: open www in a private window and see whether the message comes up at all. If it does not, the place to look is AdSense, Privacy and messaging: is the European regulations message published for thatlayover.life (Part 3, step 3).

### Before www

- P2 and P3 say a human reads every story before it goes live. That became true at about 14:39 UTC, when the Worker change that saves new stories as drafts was deployed by the trust and conversion session. Its other caution stands: its staged copy says an AI tool gives each story a first read, and that read has to be running.
- A www publish carries everything staged by every session, not only this log.
- Rollback for this log: site layers back to 16.56.0 in the header; the three home blocks and the search-engine block from `p0-closeout/before/`; the two /account lines, the /stories label and the sign-up message from the "Before" columns above.

### For the build (sessions)

- Home 69d6145df421c777840c1e46: HtmlEmbeds a4c1009d, a0d1cd97, c0c4bf75 (settings key code), success block 3ab123c7 (settings key text; set_text is refused), page JSON-LD through the schema markup action. /account 6a0d5c23c57426a9c563e8de: paragraphs 148fc877-086d-5622-a83d-de293c9a76ee and ...7707. /stories 69d61469f421c777840c204d: span 2a4d384b-bbeb-eaf7-7cce-2edaf3976c0b.
- Layers 16.57.0: source commit 64ae219, release commit b612f924952355813836e3a918176d4c2d98df84 on layers-release, core sha384-bTVDCJd5sduxgUn6lW43ELg7NfYoQZhWLYeEW4X7Nto94lx3Lz4h+pIFKIOmW7fF. New layer src/site-layers/tll-p0-closeout-v1.js (site chunk), test test/p0-closeout-layer.test.js. It holds the trust and conversion cover fix d7f9298.
- Google's consent tool does not load on the webflow.io address (no __tcfapi there), so anything that depends on it can only be exercised on www.
- Found, not changed: the site head carries a COPY table that rewrites old sentences into "Reviewed by a human within 48 hours..." wording; its patterns no longer match the new copy, so it does nothing today, but it is stale. The home structured data still uses "filed" and "files" in three descriptions and links /pillars/layover-guides.
