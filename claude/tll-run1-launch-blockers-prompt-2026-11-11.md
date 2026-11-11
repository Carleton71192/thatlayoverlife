# Claude Code prompt: Run 1, launch blockers + Search Console (11 Nov 2026)

Saved as Nancy pasted it into the cloud session on 11 November 2026. Replaces claude/tll-p0-fix-prompt-2026-11-09.md for this run: same blockers, updated with what was fixed between 9 and 11 Nov, plus Search Console, the multi-guide shop block and the new counts bug.

## Standing brief

You are building thatlayover.life (Webflow, Memberstack, Cloudflare Worker) for Nancy Carleton. Read and follow claude/tll-build-principles-2026-10-31.md and claude/tll-privacy-guardrails-2026-10-19.md first, then claude/tll-claude-code-direction-2026-11-11.md and claude/tll-status-and-priorities-2026-11-11.md.

The business you are building for: one business, two divisions, That Layover Life (free travel community) and Paw Passport (pet division: pet travel guides for more than one region, free pet profiles, destination plush toys later). Tag every revenue surface with division "tll" or "paw-passport". Direction: stop the leaks, make money possible, then grow. Everything free today stays free forever. Every commercial block is labeled. No paid ranking.

Site contracts: nav and footer components untouched unless Nancy is present (this run allows exactly two footer changes, items 2 and 8, and both go in the change log as proposals for her to approve). Counts bind to tllStates, never typed. Type: Playfair Display 800 headlines, IBM Plex Sans Condensed body, JetBrains Mono eyebrows, Syne only in the wordmark. US spelling. No em dashes. Never any word containing s-h-i-p, never "ledger", "No filler", "Truth over polish", "real names". Apply the Emil Kowalski, Taste and Impeccable design skills to any UI you touch.

How work goes live: Webflow drafts and staging only. Change log (page, element, before, after, why) approved by Nancy before anything publishes. Nancy publishes; if she asks you to, space publishes about 75 seconds apart. Do not create accounts, enter payment details, send anything, or change DNS without Nancy's explicit yes in this session. Do nothing beyond this list; report anything else you notice.

## Goal

Make the site safe to promote and able to take money, and give Nancy a search baseline. Fix in this order. Verify each item in a browser before moving to the next.

## Before you start: ask Nancy these in one message

1. The Ko-fi product URL and final price for the EU pet travel guide (do not invent a URL).
2. The Search Console verification ID (item 7), or whether she wants the Cloudflare DNS route instead.
3. "The Layover Letter, Sundays 09:00" on the homepage: keep or cut? (The newsletter is capture-only today.)
4. Has she rewritten the Copenhagen marathon diary yet, or should it go to draft?

If she has not answered 1 or 2, do everything else and leave those two staged.

## 1. Consent before ads and analytics (legal, highest priority)

* AdSense was approved 31 Oct 2026 and Funding Choices was seen loading on first paint from Copenhagen (9 Nov). Make one consent UI run for every first-time visitor, with categories Necessary, Analytics (GA4 G-T1K83PRL1R) and Advertising (AdSense pub-7257230007536660).
* Nothing from fundingchoicesmessages.google.com, pagead2.googlesyndication.com, doubleclick.net or googletagmanager.com requests before a choice is made. GA4 loads only after Analytics is accepted; AdSense only after Advertising.
* Pick and document ONE approach: (a) TLL's own banner is the only consent UI, Google's EU message is switched off in AdSense Privacy & messaging, and the banner sets Google Consent Mode v2 signals; or (b) Google's certified EU message is the consent UI, wired to Consent Mode v2 so GA4 respects it. Do not run both. AdSense in the EEA requires a Google-certified consent platform, so if you choose (a), confirm TLL's tool is certified or say plainly that it is not.
* Update /cookies and /privacy so the processor list matches what actually loads (Cloudflare, Google Analytics, AdSense, Ko-fi, Ahrefs, Webflow, Memberstack, anything else you find). Remove "Advertising. Not running yet."
* Verify in an incognito window: first load sets no FCCDCF, FCNEC or _ga cookies and makes no Google requests until a choice is made.

## 2. Footer "Cookie settings" link (footer change 1 of 2, propose)

* `a[data-tll-cookie-prefs]` (currently href="#") must open the consent preferences panel from item 1 on every page, with no console error.

## 3. Marathon diary privacy

* /marathon-diaries/copenhagen-marathon-2026-recap still contains Asger, balcony, third floor, Vesterbrogade, Værnedamsvej, "88 countries" and "Ledger". Do not rewrite Nancy's prose. If Nancy has supplied a rewrite, apply it exactly. If not, set the item to draft and list each line with a neutral suggested replacement in the change log. A named four-year-old and the home building must not stay public.
* Search all published stories and pages for future travel plans, companions' whereabouts and home-locating details per the privacy guardrails. List hits; do not edit.

## 4. Member data off the public site

* /visits/nancy-carleton-luxembourg-city-2026 still returns 200 (noindex only). The Visits template, and Bookmarks, Comments, Photo submissions, Press applications, Pet notes and any other member-data collection, must not serve a 200 page. Disable the collection template pages or password-protect them, and remove them from the sitemap. Confirm /my-passport still returns 404.

## 5. Make the guides buyable (built for more than one guide)

Paw Passport will sell pet travel guides for more than one region (EU first; UK, US and others later). Build for that now, but publish only the EU guide.

* Create a CMS collection "Guides" (or extend one if it exists): title, region, species covered, format (PDF), price, currency, checkout URL (Ko-fi today; name the field generically because guides may move to a merchant-of-record platform such as Gumroad or Payhip later), version number, "last verified" date, short description, cover image, division (paw-passport or tll), status (live, coming soon, hidden). Add one item: the EU pet travel guide, status live, with the URL and price from Nancy. Add the moving guide as "coming soon" (division tll) unless Nancy gives a live URL.
* A reusable "Guide card" component bound to that collection: cover, title, region, "Last verified [month year] · v[version]", price shown in full, and a button that opens the checkout URL in a new tab (rel="noopener", visually hidden "(opens in a new tab)"). Button copy in brand voice; propose two options in the change log. Coming-soon items show "Coming soon" and are not links.
* Place the card list on /the-paw-passport (guide block) and unhide the homepage "Get the guide" link, pointing at the EU guide card or its Ko-fi URL. Point the homepage "Moving guides" expat card at the moving guide card.
* Fire a GA4 event guide_checkout_click with the guide's region and division, after consent only.
* Done when a logged-out visitor can reach the EU guide's Ko-fi checkout from /the-paw-passport and from the homepage, and no href="#" remains on either page.

## 6. Retire the Thailand stub

* /stories/the-art-of-wellbeing-thailand-luxury-health-destination-2026 is live, indexable and links out to thenoise.me. Set it to draft (preferred) or noindex and remove it from the featured slot and library order. Make the /stories featured slot editor-picked, not automatic.

## 7. Connect Google Search Console

Two routes. Use A unless Nancy picks B.

* A. URL-prefix property with the HTML tag (Webflow's own field). Nancy adds https://www.thatlayover.life/ as a URL-prefix property in Search Console, chooses "HTML tag", and gives you only the verification ID (the string inside content=""). Paste it into Webflow Site settings > SEO > Google Site Verification and save. Do not paste the whole meta tag into custom code. It takes effect only on publish, so list it in the change log; after Nancy publishes, she clicks Verify.
* B. Domain property via DNS (covers www and the bare domain). Only with Nancy's explicit yes: add the TXT record Search Console gives her in Cloudflare DNS, change nothing else in DNS, and record the before and after DNS list in the change log.
* Before she submits it, check https://www.thatlayover.life/sitemap.xml: it must list only indexable pages. Remove noindex pages, member-data templates, /map-2-preview, /profile, /collections and the Thailand stub. Confirm robots.txt points to the sitemap and blocks nothing it should not.
* Hand Nancy three click steps for after verification: submit the sitemap, request indexing for the homepage, /the-paw-passport and the five strongest stories, and link the property to GA4 (Admin > Product links > Search Console). Supermetrics comes later; do not set it up.

## 8. Counts (footer change 2 of 2, propose)

* Footer reads "6 stories · 1 traveler · 1 pet" and "87 countries in stories". 87 is Nancy's personal country count, not a story count. Bind each number to tllStates with an accurate label (for example stories published, travelers, pets, countries covered by stories). Propose the wording.
* New bug: the homepage renders Magnus as "35 kg places". Find the binding that maps his weight into a places field and fix it.
* Homepage chapter label "6 STORIES" and the map header "Countries 89 / 90 of 249 places" must come from tllStates. Nancy's country count is 87 everywhere. Report how the map counts "places" (countries, territories, Antarctica?) so Nancy can decide; do not change that logic.

## 9. The newsletter promise

* Apply Nancy's answer to question 3. If cut, replace "The Layover Letter, Sundays 09:00" with a capture line that promises nothing about frequency; propose two options in voice. If kept, leave it and note that the promise is unkept today.

## Acceptance (run before handing back)

In an incognito browser from a Danish IP, at 1440px and 390px:

1. No Google requests or cookies before a consent choice; Cookie settings opens the panel.
2. /visits/* and /my-passport do not return 200; the sitemap lists only indexable pages.
3. The EU guide's Ko-fi checkout opens from /the-paw-passport and the homepage; the guide card shows price, version and last-verified date; the moving guide shows "Coming soon" unless live.
4. The Thailand stub is gone from /stories; the featured slot is editor-picked.
5. The Search Console verification ID sits in Webflow's SEO settings (or the TXT record is in DNS, if Nancy chose B).
6. Footer, homepage and map counts agree and come from tllStates; "35 kg places" is gone.
7. No regressions: /contact still has no relay form, the /support H1 is visible, the New Orleans story shows no Reklame label, and searching "Kilimanjaro" on /stories works with the input visible at 390px.
8. Lighthouse and axe on the homepage, /the-paw-passport and one story, before and after: no performance regression, zero serious or critical axe issues.

## Report back

Write claude/tll-p0-recheck-<date>.md in the same table format as claude/tll-p0-recheck-2026-11-09.md, plus the change log of every Webflow element touched, the consent approach chosen and why, the "places" answer, and a one-line yes or no: is the site safe to promote?
