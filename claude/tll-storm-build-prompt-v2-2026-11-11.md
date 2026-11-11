# Claude Code prompt v2: build the STORM findings into thatlayover.life

Saved 11 November 2026 from Nancy's paste in the Webflow build session, word for word. Not started: the prerequisite below is not met yet.

Replaces claude/tll-monetization-and-storm-build-prompt-2026-11-11.md (v1). Same Phase A to C, plus the deep-dive findings as Phases D to G. Run ONE phase per Claude Code session. Paste the "Standing brief" plus the phase you are running. Start a phase only after the previous one is approved and published.

Prerequisite: the launch blockers in claude/tll-p0-fix-prompt-2026-11-09.md are closed (build principle 3).

## Standing brief (paste at the top of every session)

You are working on thatlayover.life (Webflow, Memberstack members, Cloudflare in front). Read and follow: claude/tll-build-principles-2026-10-31.md and claude/tll-privacy-guardrails-2026-10-19.md. If you cannot reach the TLL project docs, the rules below are the minimum.

Who TLL is for: repeat travelers who fill passports, expats, and pursuit travelers (runners, hikers, pet owners, foodies). TLL is the free, human, story-first home for a traveler's whole life on the road.

Why we are building this (findings from the 11 Nov 2026 competitive review of 30+ travel sites and apps):

1. Search traffic to travel blogs has collapsed (median blog lost about 74% of organic traffic 2022 to 2026). TLL grows through members, newsletter, social and being cited in AI answers. First-hand, named, specific content wins.
2. At TLL's size, brand money (tourism boards, travel brands), affiliate links and objects earn more than subscriptions.
3. Pet travel is TLL's most defensible niche. "Pet friendly" tags on booking sites are often wrong; verified first-hand stay lists are rare.
4. Photographers want a non-algorithmic home (Nat Geo Your Shot closed; Glass charges for it).
5. Year-in-review share cards (Flighty Passport, Strava Year in Sport, Polarsteps Unpacked) are the cheapest growth loop in travel.
6. Paywall backlash is real (Been, Mapstr, AllTrails, Couchsurfing). The free list never shrinks.
7. Danish law treats affiliate links and discount codes as advertising: every commercial block needs a clear label.

Decisions Nancy made (11 Nov 2026): TLL needs revenue; an optional paid tier is in. Remove "no paywalls" language. Keep "Free to join" and "No credit card to join." Everything free today stays free forever, including the US national parks layer.

Site contracts: never touch the nav or footer components without Nancy present. Counts bind to tllStates and are never typed. Type: Playfair Display 800 headlines, IBM Plex Sans Condensed body, JetBrains Mono eyebrows, Syne only in the wordmark. US spelling. No em dashes. Never use any word containing s-h-i-p in site copy (say "member plan", "sponsor", "partner"), and never "ledger", "No filler", "Truth over polish" or "real names". Apply the Emil Kowalski, Taste and Impeccable design skills on every UI change.

How work goes live: Webflow drafts and staging only. Keep a change log (page, element, before, after, why) in claude/tll-storm-changelog-<date>.md. Lighthouse and axe before and after on every template touched; no speed-gate regressions; zero serious or critical axe issues. Stop before publishing: Nancy publishes. Anything that charges money, sends email to members, or creates live prices: build in test mode and stop.

End every session by writing claude/tll-storm-recheck-<phase>-<date>.md: what changed, screenshots at 1440 and 390, scores, open questions for Nancy.

## Phase A: copy and the free-forever promise

1. Search all published and draft copy, CMS items, Memberstack emails, meta, OG, schema and llms.txt for "no paywall(s)", "paywall-free", "100% free", "never pay", "no premium". List every hit before editing.
2. Replace with Option 1 in the draft; list Options 2 and 3 in the change log for Nancy:
   1. "Free to join. Your map, stories and passport stay free forever."
   2. "Free to join. The good stuff stays free. Extras cost about a coffee."
   3. "Your travel life, free forever. Plus is for the extra-credit crowd."
   Keep "Free to join. We're not a gym." and "No credit card to join."
3. A reusable "What's free forever" block bound to one CMS item (map and passport incl. US states and national parks; unlimited stories and photos; pet profiles and passports; expat guides and directory; year-in-review card; following and want-to-go). Place on homepage, sign-up and /plus.

## Phase B: the free growth features (target: live before mid-December)

1. TLL Passport year-in-review card: generated client-side from tllStates and the member's stories for the calendar year (countries, continents, new countries, stories, photos, pet countries, one hero photo). 1080x1920 and 1200x1500. Washi-tape place tag, Passport mode. Download plus Web Share. Opt-in public page /passport/[member]/2026 with "Start your free map." No dates finer than month, no companions' names, no current location. Events: passport_view, passport_download, passport_share.
2. Import travel history: CSV or JSON from Been, Visited, Places Been, Polarsteps; paste a country list; Google Takeout parsed in the browser (countries only, file discarded). Preview with checkboxes, then the map fills. Events: import_start, import_complete, first_stamp.
3. "Want to go" button on every story and country page, a lighter second map layer. Logged-out tap opens sign-up and remembers the place.
4. Opt-in public map link /map/[member], readable without an account, countries only by default.
5. Privacy panel on the account page (public map on/off, states and parks on/off, want-to-go on/off, hide last 30 days default on) plus a "Your whereabouts are never shown" badge.
6. US national parks layer (63 parks), free, bound to tllStates.

## Phase C: Plus groundwork (waitlist only, test mode)

1. /plus page as "Coming soon, get notified": free-forever block first, then planned extras (cities, airports and UNESCO layers; trip reels; ad-free reading; profile themes; extra pet profiles; early access). Planned prices shown plainly: $3.99/mo or $29/yr; Founding member, lifetime $79, first 500. One form: email plus "I'd buy the $79 founding lifetime" checkbox. Events: plus_view, plus_waitlist_submit, founding_interest.
2. Anti-money-pit rules everywhere: no upgrade prompts, locks or Plus badges on stories, map, passport, sign-up, submission, expat or pet pages; one Plus mention per page max; never a modal; full price in USD and EUR; cancel in two clicks; renewal reminder 7 days before yearly renewal.
3. Memberstack test mode only: free plan, TLL Plus monthly and yearly, founding lifetime capped at 500. Gating audit proving nothing on the free-forever list is gated. Write up tax setup (EU VAT on digital sales from a Danish seller) for Nancy's accountant; do not decide it. Stop.

## Phase D: stories, affiliates and newsletter (revenue that works now)

1. Story templates: build two or three variants of the one story template (photo essay, long read, quick dispatch) chosen by a CMS field. Every story opens on its best photo, full bleed on mobile; a captioned photo every 300 to 400 words.
2. Receipts block at the top of every story: where, month and year, who (first names or "with my sister"), cost range, would I go back. CMS fields, optional.
3. "Steal this trip" box after the story: route, best base, one booking tip, and up to three affiliate links (fields: partner, URL, type). Label: draft "Affiliate links: we may earn a small commission. It never changes what we write." for Nancy's approval; Danish practice may require "Reklame". Links rel="sponsored noopener noreferrer", new tab. Never mid-story.
4. Author card at the end: their map, country count, follow button; then a next story by place or pursuit (no dead ends).
5. Newsletter capture ("Layover Letter," every other week) on every story and the homepage. Capture only: store in Memberstack or a Webflow form; do not connect an email service.
6. Ko-fi guide cards: EU pet travel guide on pet pages and Magnus's profile; moving guide on expat hubs. Price on the card, new tab.
7. AdSense: only on story and guide pages that pass the speed gate, after consent, loaded when idle, max one slot after the "Steal this trip" box. Never on map, passport, profiles, sign-up, /plus or pet pages.
8. Contributor style guide page (public): tone, the receipts block, photo rules, AI rules (author writes headline, excerpt and quotes; AI may suggest structure and tags only; light photo cleanup, never changing the photo).

## Phase E: pets, photos and expat hubs (the niches)

1. Verified large-dog stays: a CMS collection (hotel, city, country, max dog weight confirmed, fee, date confirmed, confirmed by member, source note). Public list filterable by country and weight. Seed with Nancy's list (AC Bologna, Bernini Palace, Hotel Alfa, Courtyard Bremen and others) as drafts for her to complete. "Verified by a 35 kg dog" badge only when a written confirmation date exists.
2. Free "May I bring my dog?" email tool: pick language (English, Danish, German, Italian, French, Spanish, Portuguese), dog size and dates, copy the email. No sending from TLL.
3. Pet passport on pet profiles: pet countries on a map and border notes, bound to tllStates.
4. Layover Lounge monthly photo assignment: a CMS item (theme, dates, rules), member submissions tagged to it, an editor's pick featured on the homepage. Strip GPS on upload, keep country; EXIF camera details shown only if the member opts in; no AI-generated images.
5. "Export as carousel": from any story, download its photos as 1080x1350 slides with the washi-tape place tag (5 to 10 slides default, up to 20).
6. City hub pages for expat cities: member stories, Nancy's guides, a small data card (visa notes, cost, climate) with a source link per fact, opted-in expat profile cards ("Lives here since 2022, also knows São Paulo and Hanoi") with each member's chosen contact channel, and a public Q&A answered by opted-in members. No DMs, no current locations.

## Phase F: sponsors and media kit

1. /partners page: audience described by who reads TLL (repeat travelers, expats, pet owners, pursuit travelers), never raw pageviews. Offer packages: pursuit hub sponsor for a quarter (hub banner, two stories, one Lounge photo assignment, one newsletter mention) and a destination week. Contact form only; no prices published without Nancy.
2. Sponsor slot component for pursuit hubs: "Reklame for [Sponsor name]" first, name linked in a new tab, shown only when both name and URL are filled. No paid ranking anywhere.
3. A downloadable one-page media kit (PDF from a Webflow page) using live counts from tllStates.

## Phase G: search and AI visibility

1. Article and Person schema on every story (author with travel stats), Place on country and city hubs, FAQ only where real Q&A exists.
2. llms.txt listing the hubs, the free-forever page, the verified dog stays and the style guide. Stories readable without JavaScript.
3. "Plan it in your tool" links on stories: Google Maps list, Wanderlog, printable PDF itinerary.
4. Run the AEO query set in claude/tll-aeo-query-set-2026-11-09.md before and after; record which TLL pages are cited.

## Acceptance for every phase

* No banned words, no em dashes, US spelling; nav and footer untouched; counts bound to tllStates.
* No upgrade prompt or lock on the core loop; every commercial block labeled.
* Lighthouse and axe before and after; no regressions.
* Change log and recheck file written; nothing published by Claude Code.
