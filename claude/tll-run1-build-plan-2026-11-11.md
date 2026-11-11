# TLL Run 1: change log of proposals for what is still open (11 November 2026)

Companion to claude/tll-p0-recheck-2026-11-11.md. Prompt: claude/tll-run1-launch-blockers-prompt-2026-11-11.md.

## Short version (for Nancy)

- **Nothing in this file has been applied.** It is the list of proposed changes for everything Run 1 still has open, in your prompt's order. Every row has a code (C1, F1a, G0 and so on). Reply with the codes you approve, for example "C1 to C4 yes, P3 no, G0 yes".
- It was rewritten after your 17:07 UTC publish. That publish closed the Sunday promise, the typed 87, "35 kg places" and the cookie link outside Europe, so every step about those is gone from this plan.
- **The Guides collection cannot simply be created.** The site is at Webflow's cap of 40 collections. The smallest way through is row G0: you rename the empty "Bookmarks" collection to "Guides" in the Designer (about one minute), and the session rebuilds its fields. Nothing is lost: it has 0 items and nothing on the site uses it.
- **Two things outrank everything here** and are not Run 1 builds: the photo hold (handoff/PHOTO-HOLD-2026-11-11.md) and the cookie check from your Mac in Copenhagen (part 7).
- What can be staged today without you, and what waits on you, is in part 9.
- Every "before" below was read on www or in the Designer today and checked again on www after the 17:07 publish. Every proposed line a visitor would read follows the house rules.

## 1. At a glance

| Prompt item | Still open on www | Needs a build | Waits on Nancy | Can be staged today |
| --- | --- | --- | --- | --- |
| 1 Consent | The European message is unproven; small gaps in the policy text; acceptance line 1 as worded cannot be met | Text rows only (2.1) | AdSense clicks, Copenhagen check, approval of the rows, the reworded line | No (the rows need her approval) |
| 2 Cookie settings link | Europe unproven; the page code still says href "#" | Three edits (2.2) | Step 9 of the Copenhagen check; present for the footer | No |
| 3 Marathon diary and sweep | Her prose; the public repository | None on the site | Rewrite or leave as draft; hits 1 to 4; the repository | Sitemap flags on the drafts (row S5) |
| 4 Member data | The photo path; two ticked boxes; template locks | None in this plan (the photo hold is built elsewhere) | Worker deploy, Designer clicks (part 8) | No |
| 5 Guides | Everything | Collection fields, two items, card, home link, GA4 line (2.5, parts 3 to 5) | Row G0, Ko-fi link, price, cover image, five small choices | Repo work; one hidden link |
| 6 Thailand stub | Nothing | None | Nothing | Optional sitemap flag (row S4) |
| 7 Search Console | Verification id; three sitemap rows; /layovers canonical | Sitemap flags, one head tag (2.7) | The id, or yes to DNS | Yes (rows S1 to S5) |
| 8 Counts | Label wording; her own number | Footer labels (2.8) | Wording; decisions E1 to E4; present for the footer | No |
| 9 Newsletter | One line | One line in one embed (row W1) | Nothing (already approved) | Yes |

## 2. The change log of proposals, in the prompt's order

Columns: row code, page, element, before, after, why. Ids are Webflow element or item ids unless stated.

### 2.1 Item 1: consent

Chosen approach: (b), Google's certified message with Consent Mode v2. Reasons are in the recheck. No change to the consent code is needed. The rows below only make the two policy pages match what loads.

| Row | Page | Element | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| C1 | /cookies (page 6a89d2fde90b577397cb4611) | Paragraph 8b31a0ec-caf6-2af2-f885-28aaf88958e2 | Consent runs through Google's consent message, certified for the IAB Transparency and Consent Framework, with Google Consent Mode. In the EEA, the UK and Switzerland nothing optional runs until you choose: analytics and advertising both wait for your yes. Where those rules do not apply, Google does not show the message and analytics and ads run by default. Everything the site stores is below, by category. | Consent runs through Google's consent message, certified for the IAB Transparency and Consent Framework, with Google Consent Mode. The message itself comes from Google and loads first on every page; it can make one request to Google's ad domain before you choose. In the EEA, the UK and Switzerland nothing else optional runs until you choose: analytics and advertising both wait for your yes. Where those rules do not apply, Google does not show the message and analytics and ads run by default. Everything the site stores is below, by category. | The consent tool loads before a choice and can make one request to pagead2.googlesyndication.com. The purpose of that request is not stated, because it is not documented |
| C2 | /cookies | Paragraph 8b31a0ec-caf6-2af2-f885-28aaf88958e6 | Necessary. FCCDCF and FCNEC (Google) remember your consent choice for up to 13 months, so we do not ask on every visit. _ms-mid (Memberstack) keeps you signed in for as long as you stay signed in. Cloudflare, which serves our own API, may set _cfuvid for the length of your visit; it carries no personal data. These cannot be switched off. | Necessary. Google's consent tool sets FCCDCF (up to 13 months) and may set FCNEC (up to 12 months) when a page loads, before you choose: it needs them to ask and to remember your answer, so we do not ask on every visit. _ms-mid (Memberstack) keeps you signed in for as long as you stay signed in, and Memberstack keeps a session id in your browser's storage. Cloudflare, which delivers this site for our host Webflow and runs our own API, sets _cfuvid for the length of your visit to tell people from bots; it carries no personal data. These cannot be switched off. | _cfuvid comes with every page, not only the API. Measured lifetimes: 390 and 365 days. FCCDCF is set before the consent answer; FCNEC came after it on www from outside Europe and without any answer on the test copy, so "may". Confirm the FCNEC and session id wording against Google's and Memberstack's own lists before publishing |
| C3 | /cookies | Paragraph 8b31a0ec-caf6-2af2-f885-28aaf88958f2 | Advertising. Google AdSense runs on story, library and country pages, and only after you say yes to advertising. Google may then set __gads and __gpi (up to 13 months) and __eoi (six months) to limit how often you see an ad and to measure it, and IDE on doubleclick.net (13 months) only if you also allow personalized ads. None of these is set without your yes. | Advertising. Google AdSense runs on story, library and country pages, and its script loads only after you allow storage on your device in the consent message. Google may then set __gads and __gpi (up to 13 months) and __eoi (six months) to limit how often you see an ad and to measure it, and IDE on doubleclick.net (13 months) only if you also allow personalized ads. Ad requests go to googlesyndication.com, doubleclick.net and adtrafficquality.google. None of these cookies is set without your yes. | Matches the gate in the code (purpose 1) and the hosts that load. If row K1 is approved, the first sentence stays as it is today |
| C4 | /cookies | Paragraph 8b31a0ec-caf6-2af2-f885-28aaf88958f4 | Cookie settings in the footer reopens Google's consent message, where each purpose is listed and can be switched on or off. Your browser's site settings show every cookie stored for this site. | Cookie settings in the footer reopens Google's consent message in the EEA, the UK and Switzerland, where each purpose is listed and can be switched on or off. Elsewhere there is no message to reopen, so the link opens this page. On a phone, tap Legal in the footer to find it. Your browser's site settings show every cookie stored for this site. | True on www since the 17:07 publish (10 of 10 clicks outside Europe open /cookies). The European half waits for step 9 of the Copenhagen check |
| P1 | /privacy (page 6a0f0846441306de87ab07cd) | Paragraph 91da74f3-d449-21c3-b5e4-b762e5568458 | Effective: 20 May 2026 · Last updated: 28 October 2026 | Effective: 20 May 2026 · Last updated: the date these rows go live | The text was rewritten on 9 November and published on 10 November; the date still says October |
| P2 | /privacy | List item 91da74f3-d449-21c3-b5e4-b762e5568462 | We use Google Analytics to understand what works, only with your consent. | We use Google Analytics and Ahrefs to understand what works, and Google AdSense to help pay for the magazine. In the EEA, the UK and Switzerland all three wait for your consent. | The short version does not mention ads |
| P3 | /privacy | List item 91da74f3-d449-21c3-b5e4-b762e5568466 (Nancy's decision, legal wording) | We will never sell your data. Not to advertisers. Not to data brokers. Not to anyone. | We never sell your data. Not to advertisers. Not to data brokers. Not to anyone. Ads on story pages come from Google, which uses its own cookies only as section 3 describes. | Google's own US message on this site is titled "Do Not Sell or Share My Personal Information"; the absolute line and that link sit badly together for a US reader. Same question for "We don't sell your data. Never." (strong 91da74f3-d449-21c3-b5e4-b762e55684e9) and the CCPA line (paragraph 91da74f3-d449-21c3-b5e4-b762e55684f8) |
| P4 | /privacy | Paragraph 38c12766-cf97-bfad-61bd-d9cfe648aa8f, last sentence | If you say no, you may still see ads, just not ones based on your browsing. | If you refuse everything, no ad script loads at all. If you allow storage but not personalization, you may still see ads, just not ones based on your browsing. | With "reject all" the site loads no ad script (simulation) |
| P5 | /privacy | Paragraph 91da74f3-d449-21c3-b5e4-b762e55684d2, from "Besides the list below" | ...Cloudflare runs our own API for profiles, stamps and the travel wire, with no cookie beyond a visit-length one; Google Funding Choices shows the consent message; Google AdSense serves ads only after your yes; Ahrefs Web Analytics counts page views only after your yes; Cloudinary stores member photo uploads with location data removed; jsDelivr, cdnjs and Google Fonts serve site scripts and type without cookies; Cloudflare Turnstile checks forms for bots; Ko-fi is reached only when you click a Ko-fi link. | ...Cloudflare delivers the site for Webflow and runs our own API for profiles, stamps and the travel wire, with no cookie beyond a visit-length one; Google Funding Choices shows the consent message and loads on every page; Google AdSense serves ads only after your yes, through googlesyndication.com, doubleclick.net and adtrafficquality.google; Ahrefs Web Analytics counts page views only after your yes; Cloudinary stores member photo uploads with location data removed; jsDelivr, cdnjs, Statically, Amazon CloudFront, Google Hosted Libraries and Google Fonts serve site scripts and type without cookies; OpenFreeMap serves the map tiles on your account map; Cloudflare Turnstile, loaded with Memberstack on every page, checks for bots; a profile that features a video, a track or a post loads that player from YouTube, Spotify, Apple, X, TikTok or Twitch; Ko-fi is reached only when you click a Ko-fi link. | Matches the hosts that load (CloudFront and Google Hosted Libraries seen again today; the others carried from the consent reader's request lists). fonts.bunny.net is left out on purpose: it loads on the test copy only, never on www. Check on one live profile whether players load on view or on click before publishing that clause |
| P6 | /privacy | Paragraph 91da74f3-d449-21c3-b5e4-b762e55684ce | You can change your cookie choices anytime by clicking Cookie settings in the footer. | In the EEA, the UK and Switzerland you can change your cookie choices anytime by clicking Cookie settings in the footer. Elsewhere the same link opens the Cookie policy. | Same as C4; true on www since the 17:07 publish |
| P7 | /privacy | List item 91da74f3-d449-21c3-b5e4-b762e55684c0 (hold until the guide is on sale) | Financial information (TLL is free; no card data passes through us) | Financial information (TLL is free to read and join; guides are paid for on Ko-fi, so no card data passes through us) | Only when item 5 goes live |
| K1 | Site head code (optional, only with Nancy's yes: it touches the consent script) | `<script id="tll-consent-v3">`, function fromTC | The ad script loads whenever purpose 1 (storage) is allowed | The ad script loads only when purpose 1 and purpose 2 are allowed (by consent or by legitimate interest). The Consent Mode signals stay mapped as Google defines them; only the script-loading condition tightens. The exact line is written after reading how the tll:consent event carries its detail to the ads code | "Storage yes, advertising no" would then load no ad script. Inferred, not tested: Google's tag reads the same consent string and limits what it serves, so this is tidiness, not a legal gap |

Parties that load and are not named on /privacy today: Google Hosted Libraries (ajax.googleapis.com), Statically, OpenFreeMap, Amazon CloudFront (Webflow's own script host), the profile players, and the two extra ad hosts. Row P5 adds them. The prompt's seven (Cloudflare, Google Analytics, AdSense, Ko-fi, Ahrefs, Webflow, Memberstack) are all named already.

Not proposed: removing the stand-in CookieConsent object (other scripts read it), the unused #cc-main CSS, or the out of date comment in the same block. Harmless.

### 2.2 Item 2: footer "Cookie settings" link (footer proposal 1 of 2, Nancy present)

What is already true on www: outside Europe the click opens /cookies with no console error (site code 16.58.0 carries the close-out work). What is left is the link's own address in the page code, which still reads "#".

Component "TLL Site Footer" 710ff458-c06e-d602-a663-e5e88ca1456b, link element 710ff458-c06e-d602-a663-e5e88ca145bb (`a[data-tll-cookie-prefs]`).

| Row | Page | Element | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| F1a | Every page (footer component) | The link's Link settings | URL "#" | Page: Cookies (/cookies) | With scripts off the link goes somewhere true. Also needed for item 5's "no href="#" on home and /the-paw-passport": this link is on both |
| F1b | Every page (footer component) | The same element, Custom attributes | href="#" | Attribute removed | Left in place it can still print "#" over the link setting |
| F1c | Site footer custom code (not the footer component, not the consent script) | The first script in the block, the one with no id, whose function wire() selects `[data-tll-cookie-prefs], a[href^="javascript:"]` | `a.setAttribute('href','#');` inside that wire() | That one line removed; nothing else in the script changes | The script sets the href back to "#" at page ready and at load, so F1a and F1b alone change nothing for a visitor with scripts on. Careful: the same text appears a second time further down, in the story "Copy link" script. That second one must stay |
| L1 | Repo site code (optional; next site code release) | tll-p0-closeout-v1 | Sends the click to /cookies only once Google's tool has answered "European rules do not apply" | Also sends the click to /cookies when no consent tool has loaded at click time | A visitor whose browser blocks Google's consent tool (an ad blocker) clicks and nothing opens. Read from the code, not tested |

How the click works today, so nobody is surprised: two scripts cancel the click (the footer wire() script and a listener in the site head). With scripts on, the link never moves the visitor by itself; the site code does. After F1a to F1c a visitor gets: in Europe the click reopens Google's message; outside Europe it opens /cookies; with scripts off it opens /cookies.

Waits on Nancy: be present for F1a and F1b (her clicks are in part 8); step 9 of the Copenhagen check; whether two taps on a phone (the "Legal" heading, then the link) is acceptable for withdrawing consent.

### 2.3 Item 3: marathon diary and the sweep

No row on the site. Both diaries are drafts and answer 404. Nancy's prose is not edited.

- Nancy: supply a rewrite of the recap (it is then applied exactly, to item 6a16a04aa8d1d5f4ec9bc44d in Marathons 6a0b29e90328ffc0e30375ac), or leave it a draft. The line by line suggestions from 9 November stand.
- Nancy: decide sweep hits 1 to 4 (recheck, privacy sweep table). Nothing is edited without her words.
- Session: row S5 (sitemap flag off on the five Marathons drafts), so a later republish does not put one in the sitemap by accident.
- Reported, outside the prompt's list, needs her decision before any work: the code repository is public and holds the diary's private details in six tracked files. Suggested order: (1) a small public repository with only the built site code and the search index, and the registered script and the code pins moved to it; (2) the main repository made private; (3) a decision on removing the files from history; (4) a removal request to jsDelivr for the one file that was fetched. Step 2 before step 1 would break the site code on every page.

### 2.4 Item 4: member data

No member-data address serves a page and none is in the sitemap. /my-passport is a 301 to /the-map. Three things are still open. None is a build in this plan; all three are Nancy's.

| Row | Page | Element | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| M1 | Worker and site code (the photo hold, built by this session, in review) | Member photo path from /share-photos | A member photo is published at once, with the member's name in its address, and shown on /gallery | Photos are saved as drafts for Nancy, with no name in the address; nothing reaches /gallery until she approves | The page promises a person looks first. Takes effect with the Worker deploy on Nancy's Mac or with the next site code release, after the log says "photo hold review passed". Steps and undo: handoff/PHOTO-HOLD-2026-11-11.md |
| M2 | /share-photos (page 6a0dfca3f9fa5b751d154257) | The two checkboxes "On our Instagram and LinkedIn" (field syndication-social) and "On the homepage" (field syndication-rotation) | Served already ticked | Served unticked | A tick the member did not make is not consent. Only the Designer has the switch (part 8) |
| M3 | CMS template pages | Visits, Comments, Press applications and Pet Notes templates, and Bookmarks if row G0 is not taken | No lock; the only protection is that the collection has no live item | Draft switch on (or a password) | Removes the question for good. The tools cannot set a page password, and the log says the API refused to draft a template page, so these are Designer clicks (part 8) |

One decision, because two plans disagree: the Lounge plan builds Photos by extending the empty Photo submissions collection, and a locked template would get in its way. Suggested: leave the Photo submissions template to the Lounge decision, and keep this rule for every session until then: no item is published into Photo submissions, Visits, Comments, Press applications or Pet Notes by anyone.

### 2.5 Item 5: guides (built for more than one guide), rewritten around the collection cap

**The cap.** The site holds 40 CMS collections, which is Webflow's limit. Nobody can create a 41st. The tools a session has can create a collection and add, relabel or delete fields, but they cannot delete or rename a collection: only Nancy can, in the Designer.

**The smallest workable choice: row G0, rename "Bookmarks" to "Guides".**

Why Bookmarks, out of the 16 collections that hold 0 items:

- It is empty, no other collection points at it, and nothing in the repo's site code, the Worker's code or the Worker's settings mentions it (checked today).
- Its four fields (Contributor, Story, Saved at, Private notes) have never been written to and suit nothing else.
- Its template is one of the member-data templates item 4 wants closed anyway, so this closes one of them for good.
- A rename keeps the site at 40 the whole time, so no other session can take the freed place by accident. Today's three prompts together asked for eight new collections.

Other empty collections that also have nothing pointing at them, if she would rather keep Bookmarks: Comments, Partners, Press Mentions, Press Trips, Award Nominations. Not candidates, because something is wired to them: Photo submissions (the Photos plan), Pros, Pursuit stamps, Collection items, Story extras, Pet Notes and Press applications (the Worker), Trip Bundles (a list on the story template), Expat Groups (held for the expat hub), Submissions (not checked, so left alone).

Not checked, and worth one look in the Designer before the rename: whether any page element is still bound to Bookmarks. The 26 October page export shows only its own template page.

If Nancy prefers a fresh collection over a rename: she deletes one named empty collection in the Designer and the session creates "Guides" at once (a scope line goes in the lock log first so no other session takes the place). Same result, new ids, one moment at 39.

If Nancy wants the guide on sale before she decides: the prepared script-built button (tll-kofi-v1) needs only the Ko-fi link and the price and one site code release. The cost: the price is typed in code, the page code has no real link with scripts off, and it is a single guide, not the structure for several. Offered as a stopgap only.

| Row | Page | Element | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| G0 | CMS (Nancy, in the Designer) | Collection "Bookmarks" 6a0cbdad8dfcb5ee54bdf739, template page 6a0cbdad8dfcb5ee54bdf73f | Name "Bookmarks", address /bookmarks, 0 items | Name "Guides", address /guides | The cap. Her clicks are in part 8 |
| G1 | CMS, Guides | Fields | Contributor (6f9ab351d82881d8ed4429213f2077dd), Story (3a6eb1bda0135c9ce9a9df30c25d25f5), Saved at (c1f6db0e28254c1d0223dd7f51b72a5c), Private notes (e31e0809fb86549baa195e41dd8502b4) | Those four deleted; the 12 fields in part 3 added, in that order; schema read back and field ids recorded here | The prompt's field list. Deleting is safe only because the collection is empty; it cannot be undone |
| G2 | Guides template page | Page head code and body | Empty template, no robots tag | A robots noindex tag in the head code; a plain page that shows the same card and a link back to /the-paw-passport#guide. Every Guides item's sitemap flag off | The collection brings a template, so /guides/{slug} would answer 200 once an item is live. If Nancy would rather have /guides/* answer 404, she switches the template to Draft with her other template clicks |
| G3 | CMS, Guides | Two items, both created as drafts | None | **EU guide:** name "The EU pet travel guide" (the home page's own words), slug eu-pet-travel-guide, region EU, format PDF, division paw-passport, status "coming soon", version "1.0", last verified 28 September 2026, currency EUR, price 9, short description "Crossing borders with a dog, without the part where you cry at a checkpoint." Checkout URL, cover image and species line empty until Nancy supplies them. **Moving guide:** division tll, status "coming soon", no price, no URL, region International and format PDF as placeholders, short description "The paperwork, in the order it happens.", working name "The moving guide" | The prompt asks for both. Version, date and price are read from the page's own hidden text and need Nancy's confirmation. Three locks keep the EU guide unbuyable until her link and price are in: the item is a draft; its status is "coming soon"; and the button renders only when Status is "live" and Checkout URL is set |
| G4 | /the-paw-passport (page 6a3e5e3ed36c8c6a1df1d12e) | New collection list, wrapped as a component "Guide cards", inside container 9176a84c-484a-5686-37c6-353f321f9458, directly after the two-card grid d608f887-b6f8-37af-37af-3df5c8ffde52 (the container's children in order: eyebrow, h2, intro, that grid, hidden block 61fd4512, fine print 7c38ab65) | The guide block has no price, no button and no link | The card in part 4, one per item. Filter: Status is not "hidden" and Division is "paw-passport". Empty state hidden, so an empty list shows nothing | The prompt's guide card. The list must never publish unfiltered; if the tools refuse the filter (another session was refused a list filter twice today), the list is not published and the filter is set with Designer clicks |
| G5 | /the-paw-passport | Five pre-built hidden elements: 3e8ba920-6a74-de48-4a7b-84116c125cf5 ("€9"), 99bfa206-2dd7-8ad6-96da-b91bc4a5367c (the version and tax line), 89499c2b-3a7e-bc05-5bd4-14612ea0dc80 (a button that is not a link), 6e3b1e70-3e41-8d96-8239-78908f34a833 (the "coming soon" line), 61fd4512-494f-98d1-a0b3-56aaab540d62 (typed fine print) | In the page, visibility off | Left hidden now; removed in the same change log once the card is live | So no typed price or date can drift. The empty second section 3e165852-15be-2798-e749-f8a4694d54a3 stays as it is |
| G6 | Home (page 69d6145df421c777840c1e46) | Embed a4c1009d-e6d8-85a7-3e6a-57f2177aa0b7, the hidden guide link. Three sessions wrote this embed today: read it fresh | `<a class="h3-btn h3-btn-ink" data-h3-kofi hidden href="#" rel="noopener" target="_blank">Get the guide · €9</a>` followed by `<span class="h3-note" data-h3-kofi-note hidden>On Ko-fi</span>` | Route A (recommended): `<a class="h3-btn h3-btn-ink" data-h3-guide hidden href="/the-paw-passport#guide">Get the guide →</a>`, same tab, no price typed on home, the note span removed. The `hidden` attribute comes off at go-live (row G10). Route B: straight to Ko-fi through the prepared tll-kofi-v1 code, one click fewer for the buyer, but the link and "€9" are then typed in a second place | The line above it promises "The EU pet travel guide. Read it before the ferry, not in the queue." with no way to get it, and this is one of the two href="#" left on home. Acceptance 3 says the checkout "opens from" the homepage; if Nancy reads that literally she wants B |
| G7 | Home | Embed 9992aa7f-e698-af4a-8942-a71611d1386c, the "Moving guides" card | In a browser it is a non-link with a "Coming soon" tag (the page code still has a link to /for-expats; a script turns it off) | No change now | It already meets acceptance 3. When the Guide cards list is placed on /for-expats (filter Division is "tll"), the card can point at "/for-expats#guides". That page is under the expat hub prompt's look-only step |
| G8 | Site footer custom code | `<script id="tll-ga4-events-v1">`, the one line that sends guide_checkout_click (it appears once) | Sends the event with link_domain only, when a link inside #guide or inside an element marked data-tll-paw-guide leaves the site | First looks for the card: `var g=up(a,function(x){return x.hasAttribute&&x.hasAttribute('data-tll-guide-card');});` and, when g is found and the link leaves the site, sends `tllEv('guide_checkout_click',{region:(g.getAttribute('data-guide-region')||'').toLowerCase(),division:g.getAttribute('data-guide-division')||'',guide:g.getAttribute('data-guide-slug')||'',link_domain:h});`. Otherwise the existing line runs unchanged | The prompt asks for the guide's region and division. This script and not a new one, because the card sits inside #guide, which the old rule already matches, so a second listener would count each click twice. tllEv sends only when gtag exists and analytics consent is on, so the event is "after consent only". It never sends the address or a query string. Stage it together with the card: it cannot be tried without one |
| G9 | Repo site code (next release) | tll-division-v1 | revenue_click is tagged with the page's division ("tll" on home, even for a Paw Passport guide) and is queued before consent | Reads data-guide-division from the card when present, and goes through the same consent check as tllEv | The standing brief asks every revenue surface to carry its division. Decide in the same change whether one checkout click should send three events (guide_checkout_click, kofi_click, revenue_click) or one. The two script-built buy buttons (tll-kofi-v1 and tll-pet-passport-v1) stay switched off, or the page shows two buttons |
| G10 | CMS and home (go-live, after Nancy's link, price and approval) | EU guide item; home link from G6; row P7 | Draft, "coming soon", no link, no price; home link hidden | Checkout URL and Price set, Status "live", item published; `hidden` off the home link; row P7 staged; site publish on her word | Acceptance 3 |
| G11 | Google Analytics admin (Nancy or an admin, later) | Custom dimensions | None | "region" and "guide" registered as event-scoped custom dimensions | So the new values show in reports |

Checks after G4 to G10, logged out, at 1440 and 390, on both pages: the card shows cover, title, region, "Last verified September 2026 · v1.0" and the price; the button's href is the product link with target="_blank" and rel="noopener"; the moving guide shows "Coming soon" and is not a link; no href="#" left on either page (needs F1a to F1c too); the event carries region "eu" and division "paw-passport" with a stand-in consent tool, and nothing is sent when analytics is refused. This machine cannot open ko-fi.com, so Nancy clicks through to the checkout once.

Three things to verify in the Designer before relying on them, each with a fallback:

- The button's link bound to the Checkout URL field. The tools could not bind a link to the current item on the layover cards today; if this binding is refused too, it is two Designer clicks (Link settings, Get URL from Guides, Checkout URL). A script-filled href is not acceptable here: the page code would carry href="#".
- Option fields (Region, Division) bound to custom attributes. If not possible, add two plain text helper fields or read the values from the card's visible text.
- The Division filter as a component setting. If not possible, copy the list per page and set the filter on each; the classes are shared either way.

What can be staged without row G0 (no collection needed): the home link's href in G6 while it stays hidden; the repo work for G9 and the card's CSS and price formatter with tests; the field list in part 3 as a ready request; the two items' values in G3 as a ready request; the G8 line as a ready edit. What cannot: G1 to G5 and G8 itself.

Typed number to settle with decision E4: /the-paw-passport says "13 countries" three times; home and the pet page show 14.

### 2.6 Item 6: Thailand stub

Closed. Nothing to build. Optional and harmless: row S4 (sitemap flag off on the stub draft), and unticking "Featured in the library" on the three draft stories that have it on (6a16a048ddcf8666bf6eaf34, 6a0d44ca5133ed0ecea08d33, 6a0d44ca5133ed0ecea08d30), so none takes the lead place by surprise when it is published. To keep the lead card strictly editor-picked with no automatic fallback, keep one live story ticked at all times (a rule for the editor); no code change proposed.

### 2.7 Item 7: Search Console and the sitemap

**Who can set the verification id.** Route A needs only the id. No tool a session has can read or write Webflow's "Google Site Verification" field: the sites tool can only list sites, read a site and publish; the pages tool sets titles, descriptions and share images; nothing reaches Site settings. Reading the site today returned no such field either. The only thing a session could do is paste a tag into custom code, which the prompt forbids. So Nancy pastes the id herself in Site settings, SEO, and a session can then confirm from outside that the tag is served after the publish. Whether an id already sits in that field unpublished cannot be read. Her steps are in part 6.

Route B (a DNS TXT record) only with her explicit yes in the session; it also covers the bare domain. The DNS list is recorded before and after.

robots.txt on www is one line pointing to the sitemap and blocks nothing. No change. Supermetrics: not set up, as instructed.

**Sitemap corrections.** Checked after the 17:07 publish: 139 addresses, all answer 200, none is noindex in its page code, /layovers is in, and none of the prompt's removal list is there (no member-data address, /map-2-preview, /profile, /collections, /corrections, Thailand stub or marathon diary). What is left:

| Row | Page | Element | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| S1 | Three live contributor profiles with no published story | Contributors 6a0b29c7a7b1840afe9390a5, items 6ae323584689182a2265ccc4, 6ae33eaa0a497974856d7d86, 6ae323584689182a2265ccc0 | Sitemap flag on | Sitemap flag off | The site code marks such profiles "noindex, follow" after scripts run (rendered again today: exactly these three of the nine). Search Console would report "Submitted URL marked noindex". Switch each back on when its first story publishes |
| S2 | Seven staged contributor items that are not live | Contributors items 6af475b898ad12c34fca4356, 6ad5f2344ded27f4aa01efe3, and five placeholder items 6a0e0b633e617e14f22248a5, 6a0e0b633e617e14f22248a3, 6a0e0b633e617e14f22248a1, 6a0e0b633e617e14f222489f, 6a0e0b633e617e14f222489d | Sitemap flag on (read 17:30 UTC) | Sitemap flag off | Each would be one more case if it goes live with no story |
| S3 | /layovers (page 6af30dd790b8264ba30602cb) | Page head code | In the sitemap since 17:07. No canonical tag, in the page code or after scripts | A self canonical and og:url in the page head code: https://www.thatlayover.life/layovers | Every other sitemap page has a correct self canonical (138 of 139 checked today). Already on this session's /layovers list; do it once |
| S4 | Thailand stub draft | Stories item 6ae32ce61ed3557855012cb8 | Sitemap flag on | Sitemap flag off | Second guard; matters only if it is republished |
| S5 | Five Marathons drafts | Items 6a16a04aa8d1d5f4ec9bc44d, 6a0d45971ff3d99429290f4b, 6a2645a665b8c83fff8a314e, 6a0d45971ff3d99429290f4e, 6a0cc5317e83888edcfbd1ff | Sitemap flag on | Sitemap flag off | Same |
| S6 | New Guides items, when they exist | Guides collection | n/a | Sitemap flag off | The template is noindex (row G2) |

Tool: the sitemap tool (one item, or up to 100 items at once; one call for static pages). Flags are staged and take effect at the next publish. It has no control for collection templates, folders or utility pages.

Leave alone: /corrections (noindex and out of the sitemap, as intended); robots.txt; the sitemap's content type (application/rss+xml is Webflow's own, low risk); the auto-generated sitemap switch in Site settings.

After the publish that carries S1, re-read https://www.thatlayover.life/sitemap.xml: expect 136 addresses if nothing else was published in between (139 minus the three profiles), each answering 200 with no noindex after scripts.

### 2.8 Item 8: counts (footer proposal 2 of 2, Nancy present)

Already true on www: no typed "87", no "35 kg places". The footer numbers are filled by a script from the sitemap and the /stories cards. What is left is the wording and a source that works with scripts off.

Component "TLL Site Footer", counts embed 22cd9a12-d8a7-92f8-1728-3266cfaff924 (the trust and conversion session rewrote it today; read it fresh).

| Row | Page | Element | Before (page code, then what a visitor sees) | After | Why |
| --- | --- | --- | --- | --- | --- |
| N1 | Every page (footer) | Stories number and label | An empty number beside "stories"; a visitor sees "57 stories" | "57 stories published", the number bound to Site stats "stories" | An accurate label; a number in the page code before any script runs |
| N2 | Every page (footer) | Travelers number and label | An empty number beside "travelers"; a visitor sees "6 travelers" | "6 travelers with a story", bound to Site stats "travelers" | Says what is counted |
| N3 | Every page (footer) | Pets number and label | An empty number beside "pet"; a visitor sees "1 pet" | "1 pet with a passport", bound to Site stats "pets" | Says what is counted |
| N4 | Every page (footer) | Countries number and label | An empty number beside "countries in our stories"; a visitor sees "54 countries in our stories" | Option 1: "54 countries covered by our stories". Option 2, more exact: "54 places in our stories". Bound to Site stats "countries" | The 54 includes Antarctica, Kosovo, Aruba and Curaçao; the count rules say "countries" only for the Countries rule and "places" otherwise |

- Full line, option 1: "54 countries covered by our stories · 57 stories published · 6 travelers with a story · 1 pet with a passport".
- Source: the prompt says "bind each number to tllStates". That cannot be done: tllStates is one member's saved map and does not exist for a signed-out visitor. The site-wide source that already exists is the Site stats item (collection 6ae602821fa37291336b5680, item 6ae602fb1fa37291336b8715), which the Worker rewrites. It read 57, 6, 1, 54 at 17:30 UTC.
- Binding: a one-item collection list inside the footer, sourced from Site stats, so the page code carries the four numbers before any script runs. The script stays as a second check. Until this is done, a visitor with scripts off sees four labels and no numbers.
- Singular and plural: the footer script already switches "pet" and "pets". With scripts off a bound number beside a fixed label cannot do that. If Nancy wants the scripts-off line to read right for any number, the label-first form does it: "Stories published: 57 · Travelers with a story: 6 · Pets with a passport: 1 · Countries covered by our stories: 54".

Home chapter label and map band: nothing typed, no change proposed. The map's counting logic is not changed.

Nancy's decisions E1 to E4 (recheck, counts section) come first. After them, and only then, one row each for: the three "13 countries" on /the-paw-passport; the hidden /the-map explainer numbers "87" and "108"; the hidden "88" on the editor's own page; the /submit example title that contains "Country 88".

Reported only, not in the prompt's list: the story coverage number misses Croatia, Bosnia and Herzegovina, and Singapore because three place lines do not resolve to a country. The fix belongs in two places that must agree: the footer script (footer component, Nancy present) and the Worker's alias table (deploy on her word). The number would move from 54 to 57.

### 2.9 Item 9: the newsletter promise

Nancy's answer is "cut". The six Sunday lines are gone from www. One line is left.

| Row | Page | Element | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| W1 | Home (page 69d6145df421c777840c1e46) | Embed 94ce12c0-56fc-4b10-fa9f-14da000634c7, the line under the story row (class h3-shelf-more) | More landing weekly. | More on the way. | It promises a weekly rhythm nobody keeps. Already approved under "cut both". This session holds that embed for the layover row work, so it writes the three words in the same pass, one writer at a time |

The prompt asks for two capture-line options. The approved one is live: "One story, when it's worth it. Lounge wine optional." with "No schedule we'd break. Unsubscribe anytime." A second to compare, from her own /stories and /account wording: "It lands when a story earns it. Unsubscribe anytime."

Not this run: the "weekly digest" and the AI first-read sentence on /terms (the trust and conversion session's page, waiting for Nancy); the middle of the round stamp and the "What founders get" label (the close-out session's two open questions for her). Not checked by anyone yet: whether a welcome email in Webflow form notifications, Memberstack or Mailchimp still promises Sundays.

## 3. Guides collection fields (proposal; nothing created)

After row G0 the collection is named "Guides", address "guides".

| Prompt field | Webflow field | Slug | Type | Required | Notes |
| --- | --- | --- | --- | --- | --- |
| Title | Name (built in) | name | Plain text | yes | "The EU pet travel guide" |
| (built in) | Slug | slug | Plain text | yes | eu-pet-travel-guide; also the GA4 "guide" value |
| Region | Region | region | Option: EU, UK, US, International | yes | Shown on the card; lowercased for GA4 |
| Species covered | Species covered | species-covered | Plain text | no | One line, as the guide itself states it |
| Format | Format | format | Option: PDF | yes | More options later |
| Price | Price | price | Number | no | Empty on coming-soon items. Numbers made through the tools are whole numbers on this site; a price such as 9.50 needs the field set to decimal in the Designer |
| Currency | Currency | currency | Option: EUR, USD, GBP, DKK | no | ISO code; the card shows "€9" |
| Checkout URL | Checkout URL | checkout-url | Link | no | Help text: "Where the buyer pays. Ko-fi today; any checkout platform later. Product link, never a profile link." |
| Version number | Version | version | Plain text | no | "1.0". Text, so 1.10 does not become 1.1 |
| "Last verified" date | Last verified | last-verified | Date | no | The card prints month and year |
| Short description | Short description | short-description | Plain text | no | One line, 160 characters |
| Cover image | Cover image | cover-image | Image | no | Portrait 4:5; alt text set on the image |
| Division | Division | division | Option: tll, paw-passport | yes | The exact strings from the standing brief |
| Status | Status | status | Option: live, coming soon, hidden | yes | Drives the list filter and the button |

Choice lists cannot be edited by the tools once created, only in the Designer, so the options above are worth a look before G1 runs.

Only with Nancy's yes, not in the prompt: "Price note" (plain text) for a tax line such as the hidden "incl. 25% moms". Ko-fi is not a merchant of record, so how tax is shown is her call.

Checked and ruled out as a home for guides: Resources (a list of outside links with one required country), Layovers (the free city guides), Magnus Diary, Trip Bundles, Partners. None has price, currency, version or checkout fields. No existing component is a guide card (11 components read).

Name clash to know: the home page already has a row called "Layover guides" (the Layovers collection). Editors will see both names in the CMS.

## 4. Guide card design (proposal)

Form: a collection list styled once and wrapped as a component "Guide cards".

Structure per item:

```
article.tll-gcard  [data-tll-guide-card] [data-guide-slug={Slug}] [data-guide-region={Region}] [data-guide-division={Division}]
  img.tll-gcard-cover            {Cover image}, 4:5, alt from the asset
  div.tll-gcard-body
    p.tll-gcard-ey               "Paid guide · {Region} · {Format}"
    h3.tll-gcard-title           {Name}
    p.tll-gcard-desc             {Short description}
    p.tll-gcard-meta             "Last verified {Last verified, month year} · v{Version}"
    p.tll-gcard-species          {Species covered}            (hidden when empty)
  div.tll-gcard-buy
    p.tll-gcard-price            "{Currency} {Price}", upgraded to "€9" by script
    a.tll-btn.tll-btn-primary    live only
    p.tll-gcard-note             live only
    span.tll-gcard-soon          coming soon only
```

Text of each part:

- Eyebrow: "Paid guide · EU · PDF". This is the commercial label the standing brief requires on every revenue surface.
- Meta: "Last verified September 2026 · v1.0".
- Price, shown in full: bound as currency then number ("EUR 9") so it reads right with scripts off; a few lines of script format it with the browser's own currency formatter to "€9". No price is typed anywhere.
- Button: one of the two options in part 5, followed by `<span class="tll-sr">(opens in a new tab)</span>`, visually hidden with the site's existing clip pattern (the one behind .h3-sr).
- Small line under the button: "Secure checkout, in a new tab." No platform name, so it survives a move away from Ko-fi.
- Coming soon: the words "Coming soon" in a span. No href, no role="button", no aria-disabled, no tabindex, no hover change. Same look as the home "Coming soon" tag (ink #0A0B14, cream text, JetBrains Mono, uppercase).

Button rules: rendered only when Status is "live" and Checkout URL is set (two conditional visibility rules on the link); href is the Checkout URL field; target="_blank"; rel="noopener"; at least 44 px high at both widths.

Type and color (measured on the page by the money reader; the contrast figures were not re-run):

- Title: Playfair Display 800, 22 to 28 px, ink #0A0B14.
- Body: IBM Plex Sans Condensed 16 px, #3A3A3A on white (11.4 to 1). The page's classes declare "DM Sans"; the site maps that name to the IBM Plex Sans Condensed files.
- Eyebrow and meta: JetBrains Mono 12 px, uppercase, 1.5 px tracking. Teal #067A79 on white is 5.2 to 1; muted #6B6660 on white is 5.7 to 1.
- Button: white on #C8325B (5.2 to 1). The site's primary rose rgb(214,56,89) passes AA at 4.6 to 1 with little room; #C8325B is the safer pick and is the color the prepared Ko-fi code already uses.
- Focus: 3 px ink outline, 2 px offset, plus the 6 px teal ring the home page already uses.
- Motion: border color to rose on hover, 150 ms ease; button scale .97 on press; none under prefers-reduced-motion; none on coming-soon cards.

Placement: full width of the 1232 px container on /the-paw-passport, directly after the two-card grid. White card, 1 px #E0DACE border, 12 px radius, 24 px padding, to match the light card beside it. At 1440: cover 160 px on the left, text in the middle, price and button on the right. At 390: stacked, cover on top, button full width.

## 5. Button copy: two options

1. "Get the guide · €9" (matches the hidden home link and the prepared code)
2. "Pack the guide · €9"

The price in the label is filled from the CMS item, never typed. Both are followed by the visually hidden "(opens in a new tab)". On the home page under route A the link reads "Get the guide →" with no price. Recommendation: option 1, so the home link and the card say the same thing.

## 6. Search Console: Nancy's steps

Before verification (route A):

1. Go to https://search.google.com/search-console, "Add property", choose "URL prefix", enter https://www.thatlayover.life/ and continue.
2. Choose the verification method "HTML tag". Copy only the string inside content="" (the id), not the whole tag.
3. Webflow, Site settings, SEO, "Google Site Verification": paste the id, save. Then publish (or say the word), and click "Verify" in Search Console.

A session can check step 3 from outside: after the publish, the home page code must contain one google-site-verification tag. Today it contains none.

Three click steps after verification:

1. **Submit the sitemap.** Search Console, "Sitemaps", type sitemap.xml, "Submit". Best done after rows S1 to S5 are live, so the three profile pages are not reported.
2. **Request indexing.** Paste each address into the inspection bar at the top, then "Request indexing": the homepage, https://www.thatlayover.life/the-paw-passport, and the five strongest stories. There is a daily limit on these requests (general knowledge, not checked today); seven should fit in one day. Which five is Nancy's pick; if she wants a rule, the five story pages with the most views in Google Analytics over the last 28 days.
3. **Link the property to Google Analytics.** Google Analytics, Admin, Product links, Search Console links, "Link", choose the property and the web stream.

Carried from 9 November and possible once the property exists: "Removals", new request, for the three dead addresses (the Thailand stub, the Copenhagen recap, the Tokyo page). The sitemap no longer lists them.

A URL-prefix property covers https://www only. Route B (a domain property through a DNS TXT record) covers the bare domain too and needs her explicit yes.

## 7. The Copenhagen consent check, and the AdSense clicks

This machine is in the United States, so none of this can be run from here. It needs Nancy's Mac in Copenhagen. About 8 minutes. It replaces the 9 November version.

1. Chrome, new Incognito window. Cmd+Option+I. Network tab: tick "Preserve log" and "Disable cache".
2. Load https://www.thatlayover.life/ and wait 20 seconds. Click nothing.
3. Expect a Google dialog with "Consent", "Do not consent" (if enabled) and "Manage options". If none appears, load https://www.thatlayover.life/?fc=alwaysshow&fctype=gdpr in a new Incognito window. No dialog there either means the message is not published for the site: do the AdSense clicks below, then start again.
4. Still before clicking, type in the Network filter, one at a time: googletagmanager, google-analytics, doubleclick, ahrefs. Each must show 0 rows. Then fundingchoices: rows are expected. Then googlesyndication: 0 or 1 row, and if there is one its address must contain fcd=true (that is the consent tool's own request; the file name in it changes from load to load). Any googlesyndication row without fcd=true is a fail. Rows for fonts.googleapis.com, fonts.gstatic.com and ajax.googleapis.com are expected: they are the site's type files.
5. Application tab, Cookies, https://www.thatlayover.life: expect _cfuvid and FCCDCF, possibly FCNEC. Fail if _ga, _ga_T1K83PRL1R, __gads, __gpi or __eoi is there. Please note whether FCNEC is there: it settles one open line in the cookie policy (row C2).
6. Console tab, paste `__tcfapi('ping',2,console.log)`. Expect gdprApplies: true and displayStatus: "visible".
7. Click "Do not consent". Open /stories/vietnam-ninja-duckies. Repeat step 4: still 0 rows for the four filters, and no googlesyndication row without fcd=true.
8. New Incognito window, load home, click "Consent". Expect googletagmanager.com/gtag/js, analytics.ahrefs.com/analytics.js and a collect row. Open the story: adsbygoogle.js?client=ca-pub-7257230007536660 appears within about 5 seconds.
9. Footer, "Cookie settings" (at phone width tap "Legal" first). The dialog must reopen. The Console must not show "googlefc.showRevocationMessage is not a function".
10. Repeat steps 2 to 5 at 390 wide (device toolbar) or on a phone in a private tab.

Send the Network list for any step that fails.

The AdSense clicks, only Nancy can do them. Labels as known; Google renames these screens, so match by meaning:

1. https://adsense.google.com, left menu, "Privacy & messaging".
2. Card "European regulations", click "Manage" (it reads "Create message" or "Get started" if none exists).
3. Find a message whose status is "Published" and whose sites include thatlayover.life. If there is none: open the draft (or "Create message"), tick thatlayover.life under sites (privacy policy address https://www.thatlayover.life/privacy if asked), switch on "Do not consent" so refusing takes one click, then "Publish".
4. Same area, "Settings" (gear): find "Consent mode", switch it on for advertising purposes and for analytics purposes, save. It read "not configured" on 9 November.
5. Card "US state regulations": a message is live for the site. Keep or unpublish. If kept, /privacy needs the line in row P3.
6. Card "Ad blocking recovery": confirm no message is on unless wanted.
7. Do not create a second European message and do not switch on any other consent tool. Then run the check above.

## 8. Nancy's Designer clicks

Menu labels are from general Webflow knowledge and could not be checked from this machine. Each takes effect only after a publish.

**A. Untick the two consent boxes (row M2).** Open /share-photos in the Designer. Click the checkbox beside "On our Instagram and LinkedIn". In Element settings (the cog, or the D key), switch "Start checked" off. Do the same for "On the homepage".

**B. Rename Bookmarks to Guides (row G0).** CMS panel, hover "Bookmarks", click the cog. Collection name: Guides. Collection URL: guides. If a singular name is asked for: Guide. Save. Then tell the session, which does G1 onward.

**C. Lock the member-data templates (row M3).** Pages panel, scroll to "CMS Collection pages". Hover "Visits Template", click the cog. Switch "Draft" on (two templates are already drafts, so this route works and leaves no password to keep), or under "Access control" choose Password. Save. Repeat for Comments, Press applications and Pet Notes, and for Bookmarks only if row G0 is not taken. Suggested extra: Directory.

**D. The footer link (rows F1a and F1b), with a session present.** Select "Cookie settings" in the footer. Element settings, Link settings, Page, Cookies. Then, in Custom attributes on the same element, delete the href row. The session does F1c in the site footer code in the same sitting.

**E. Search Console id (part 6, step 3).** Site settings, SEO, "Google Site Verification".

## 9. What can be staged today without Nancy, and what waits on her

### Can be staged today without Nancy

Each is still listed in the change log she approves before a publish.

1. **W1:** "More on the way." in home embed 94ce12c0. Already approved under "cut both".
2. **S1, S2, S4, S5:** the sitemap flags (three live profiles, seven staged contributor items, the stub draft, five Marathons drafts). No visitor sees a change; the prompt's item 7 asks for exactly this.
3. **S3:** the /layovers canonical and og:url in the page head code.
4. **G6, first half:** the hidden home guide link's href from "#" to "/the-paw-passport#guide", still hidden. No visible change; it removes one of the two href="#" on home and suits both routes.
5. **Repo only, no Webflow write, no release, no deploy:** the Guide card CSS and price formatter with tests; the tll-division-v1 change (G9); the blocked-consent-tool fallback (L1); the Guides field list (part 3), the two items' values (G3) and the GA4 line (G8) as ready requests.
6. **Read only:** Lighthouse and axe "before" runs on the homepage, /the-paw-passport and /stories/vietnam-ninja-duckies.

Two cautions. First, rows 2 to 4 are invisible to a visitor, but under the prompt's rule they still need her tick before the next www publish; once staged, they hold www for every session until she gives it. Second, no site code release and no Worker deploy from the repo until the lock log says "photo hold review passed", so the repo work in row 5 stays unreleased until then.

### Waits on Nancy (most useful first)

1. **The photo hold:** the Worker deploy on her Mac once the log says "photo hold review passed" (row M1).
2. **The two ticked boxes** on /share-photos (row M2, part 8 A).
3. **The Copenhagen consent check** and, if no message shows, the AdSense clicks (part 7).
4. **Privacy:** what to do about the public repository; sweep hits 1 to 4; the recap rewrite or leave it a draft.
5. **Row G0:** rename Bookmarks to Guides, or name another empty collection, or choose the stopgap.
6. **Ko-fi:** the product link for the EU guide (ko-fi.com/s/ and some letters, never the profile); the final price (the hidden text says €9); whether a tax line is shown; a cover image (portrait, 4:5); the species line; the moving guide's title.
7. **Search Console id** (part 6), or yes to the DNS route.
8. **Template locks** (row M3, part 8 C), and the Photo submissions decision in 2.4.
9. **The two footer proposals:** be present for F1a to F1c; pick the count wording (N4 option 1 or 2, number-first or label-first).
10. **Approvals and small choices:** text rows C1 to C4 and P1 to P7, with the wording decision in P3; row K1 yes or no; the reworded acceptance line 1; home link route A or B; button copy 1 or 2; whether /guides/* is a noindex page or a draft template; sitemap rows S1 to S5.
11. **Her own number and "places":** decisions E1 to E4.
12. Later, in Google Analytics admin: custom dimensions "region" and "guide" (row G11).

## 10. Already done or held: do not redo

Done and live on www since 17:07 UTC. Do not redo, rewrite or "fix again":

- The six letter lines, the Magnus line, the footer's four empty numbers, the home structured data descriptions, the two /account lines, the /stories label (handoff/CHANGE-LOG-P0-CLOSEOUT-2026-11-11.md).
- Site code 16.58.0 in the site header (release 3066315bf6155033298bb13a239133fdb44bdf7f; rollback is 16.57.0, release b612f924952355813836e3a918176d4c2d98df84). Do not re-apply 16.55.0, 16.56.x or 16.57.0 over it.
- The outside-Europe cookie link behavior and the "Example Text" clearing on /submit and /share-photos (tll-p0-closeout-v1).
- The AI first-read sentences are held back on /editorial-charter, /faq and /submit on Nancy's word. They go back only when the morning review is running again, and that is the trust and conversion session's call.

Done earlier, still holding. Do not repeat:

- The diaries, the Visits item and the Thailand stub are drafts. Do not publish, archive or delete them.
- The /stories featured place (tll-lib-lead-v1) and the "Featured in the library" switch.
- /cookies and /privacy were rewritten on 9 November. Change only the rows in 2.1.
- The 13 redirects (always import the combined file).

Held by another piece of work or by Nancy:

- Footer component: Nancy present, and only the two proposals here. The counts embed 22cd9a12 and the "Corrections" link are the trust and conversion session's.
- /terms, /corrections, /editorial-charter, /faq, the Stories collection fields: the trust and conversion session.
- Home embed 94ce12c0 and the layover row: this session's own open block; one writer at a time.
- /for-expats: the expat hub prompt, look-only until Nancy approves its table.
- /gallery, /share-photos, the Photo submissions collection and the Lounge deck: the Lounge work and the photo hold. No field is added to Photo submissions and it is not renamed before the Worker with the hold is deployed.

Never in this run:

- No second consent UI, no return of the old cookieconsent library, no edit to `<script id="tll-consent-v3">` beyond row K1 with Nancy's yes.
- No invented Ko-fi address, no profile link standing in for a product link, no unhiding of the pre-built elements with a typed price.
- No Search Console meta tag pasted into custom code. No DNS change without her yes in the session.
- No collection created, renamed or deleted without the lock log and her decision.
- No item published into a member-data collection, Photo submissions included.
- No www publish without her word; none while another session's line says a staged change waits for her look.
- No change to how the map counts places. No typed count anywhere.
- No further fetch of a commit-pinned repository file that holds private details.
- No Supermetrics setup. No account created, no payment detail entered, nothing sent.
- No edit to Nancy's prose in any story or diary.

## 11. Order of work, with the check after each

1. The photo hold goes live (review passes, then Nancy's deploy). Check: the Worker's /lounge address answers with "held":true.
2. Nancy's Copenhagen check and AdSense clicks. Check: the 10 steps pass, or the Network list comes back.
3. Lighthouse and axe "before" on the three pages.
4. Stage part 9 rows 1 to 4. Check: read each back; a test copy publish; the hidden link's href; the staged sitemap flags.
5. With Nancy's approvals: the policy rows (2.1); the footer proposals with her present (2.2 and 2.8). Check: /cookies and /privacy text on the test copy; the cookie link's href in the page code and after scripts; the footer numbers with scripts off.
6. With row G0: fields, items as drafts, the template, the card, the GA4 line (G1 to G9). Check: the list in 2.5, on the test copy for layout and links, and against www with a stand-in consent tool for the event.
7. With the Ko-fi link and price: go-live (G10) and row P7. Check: acceptance 3, by Nancy clicking through once.
8. With the Search Console id: part 6. Check: acceptance 5, the tag served on the home page, then her three click steps.
9. Lighthouse and axe "after"; the recheck table updated; one line in the lock log and in handoff/STATUS.md.

## 12. Rules for the build pass

1. Staging only. Each write: read the element first, compare it with the "before" here, write, read back. For HtmlEmbeds and the site head or footer code, replace only the named line and keep every other byte (the embed overwrite protocol in the lock log).
2. Write a scope line in handoff/WEBFLOW-LOCK.md before the first write, and a "write complete" line after. On a 429 or a multiplayer conflict wait 30 seconds and retry, one call at a time.
3. Change log (page, element, before, after, why) approved by Nancy before anything publishes. Nancy publishes, or says the word. Publishes at least 75 seconds apart.
4. A www publish carries everything staged by every session. At 17:30 UTC, as far as Webflow's last-updated stamp shows, nothing was staged beyond what www already has. A row staged before Nancy has approved it holds www for everyone, so say so in the lock log when staging one.
5. Footer and nav components only with Nancy present. This run allows exactly two footer changes: 2.2 and 2.8.
6. No site code release and no Worker deploy from the repo HEAD until the lock log says "photo hold review passed".
7. The site is at 40 of 40 collections. Nobody creates one. Guides starts only after row G0.
8. Google's consent tool does not answer on the webflow.io address, so nothing that depends on consent or Google Analytics can be tried on the test copy. Use a stand-in consent tool in a test browser against www, and Nancy's Copenhagen check.
9. Lighthouse and axe on the homepage, /the-paw-passport and one story (/stories/vietnam-ninja-duckies) before the first write and after the last one. They have not been run in any pass today.
