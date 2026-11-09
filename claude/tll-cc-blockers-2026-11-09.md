# Claude Code prompt: close the remaining TLL launch blockers (9 Nov 2026)

Paste this into Claude Code with the Webflow MCP connected to the That Layover Life site.

You are working on thatlayover.life (Webflow). Read these project docs first and follow them: claude/tll-build-principles-2026-10-31.md, claude/tll-privacy-guardrails-2026-10-19.md, claude/tll-p0-recheck-2026-11-09.md. Site contracts that hold throughout: do not touch the nav or footer components beyond the single link fix in item 2; all counts bind to tllStates, never hardcoded; type stays Playfair Display 800 headlines, IBM Plex Sans Condensed body, JetBrains Mono eyebrows; US spelling; never use "ship", "ledger", "no filler" or "truth over polish" in copy. Work in Webflow drafts, produce a change log, and stop before publishing: Nancy publishes.

Goal: make the site safe to promote. Six blockers remain from the 29 Oct review. Fix them in this order, verify each in a browser before moving on, and do nothing beyond this list.

## 1. Consent before ads (legal, highest priority)

- Make TLL's CookieConsent banner actually run for first-time visitors, with categories Necessary, Analytics (GA4 G-T1K83PRL1R) and Advertising (AdSense pub-7257230007536660).
- Load Funding Choices and adsbygoogle only after the Advertising category is accepted. Nothing from fundingchoicesmessages.google.com, pagead2.googlesyndication.com or doubleclick may request before consent. Same for GA4 and Analytics.
- Decide and document one approach: either TLL's banner is the only consent UI and Google's EU message is turned off in AdSense Privacy & messaging, or Google's message is the consent UI and it is wired to Google Consent Mode v2 so GA4 respects it. Do not run both.
- Update /cookies and /privacy so the processor list matches what actually loads (Cloudflare, Google Analytics, AdSense, Ko-fi, Ahrefs, Webflow, any others you find) and remove "Advertising. Not running yet."
- Verify in an incognito window: first load sets no FCCDCF/FCNEC/_ga cookies and makes no Google requests until a choice is made.

## 2. Footer "Cookie settings" link

- `a[data-tll-cookie-prefs]` must open the consent preferences panel from item 1 on every page, with no console error. This is the only footer change allowed.

## 3. Marathon diary privacy pass

- /marathon-diaries/copenhagen-marathon-2026-recap: do not rewrite Nancy's prose. Flag every line containing Asger, balcony, third floor, Vesterbrogade, Værnedamsvej, "88 countries" and "Ledger" in the change log with a suggested neutral replacement, and set the item to draft until Nancy approves the edits. A named four-year-old and the home building must not stay public.
- Also search all published stories and pages for future travel plans, companions' whereabouts and home-locating details per the privacy guardrails doc; list hits, do not edit.

## 4. Member data off the public site

- The Visits CMS template (and Bookmarks, Comments, Photo submissions, Press applications, Pet notes and any other member-data collection) must not serve a 200 page. noindex is not enough. Disable the collection template pages or password-protect them, and remove them from the sitemap. Verify /visits/nancy-carleton-luxembourg-city-2026 no longer returns 200.

## 5. Make the guide buyable

- Add the Ko-fi buy button for the €9 Paw Passport field guide to the field-guide block on /the-paw-passport and unhide the homepage "Get the guide · €9" link, pointing both at the real Ko-fi product URL (ask Nancy for it if it is not in the project; do not invent one). Button copy in brand voice, price shown, opens in a new tab.
- Point the homepage "Moving guides" expat card at the Ko-fi moving guide if it is live; otherwise keep "Coming soon" and make the card not look clickable.

## 6. Remove the relay form from /contact and retire the Thailand stub

- /contact: remove the member-to-member "Write to … through TLL" relay form and its rate-limit error. Keep the three mailto doors and the "Tell the editor" widget.
- /stories/the-art-of-wellbeing-thailand-luxury-health-destination-2026: set to draft (preferred) or add noindex and remove from the featured and library order. Make the /stories featured slot editor-picked, not auto.

## Counts (quick, do with item 5)

- Homepage chapter label "6 STORIES" and the map header "Countries 89 / 90 of 249 places" must come from tllStates like the footer does. Nancy's country count is 87 everywhere. Report what the map counts as "places" so Nancy can decide whether territories belong in it.

## Acceptance (run before handing back)

In an incognito browser from a Danish IP: no Google requests before consent; Cookie settings opens the panel; /visits/* and /my-passport do not return 200; the guide can be bought from /the-paw-passport and the homepage; /contact has no relay form; the Thailand stub is gone from /stories; /support H1 and the New Orleans label are still correct (they were fixed, do not regress them); search for "Kilimanjaro" still works on desktop and the input is visible at 390px. Write the results into claude/tll-p0-recheck-<date>.md in the same table format as the 9 Nov file, and a change log of every Webflow element touched.
