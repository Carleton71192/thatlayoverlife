> **HANDOFF VERSION: v9 · 5 October 2026 · 2.0 editorial look + accessibility + mobile.** Start with CLAUDE-CODE-PROMPT.md, then keep STATUS.md updated as you go.

> **FIRST:** read the "⚠ PRESERVATION RULES" section at the top of IMPLEMENTATION-BRIEF.md. Published stories and Memberstack functionality are never removed, only optimized.

# Paste this into Claude Code · TLL full build, v9
**5 October 2026 · from Claude Design · site thatlayover.life (Webflow `69d6145cf421c777840c1e25`)**

You are bringing thatlayover.life into full parity with the approved design, then building the traveler directory, the v6/v7 features, the shareables system and The Pack. The design is the source of truth.

## What changed in v9 (read before anything else)
- **The design source is now `TLL Site Prototype 2.0 (standalone).html`.** Where it differs from `screens-v8-reference/`, 2.0 wins. The v8 screen files stay for copy and structure only.
- **New group J (J01 to J16):** accessibility, mobile nav, image loading, motion, boarding-pass headers, luggage-tag people cards, type scale, Sticker Passport, Colophon.
- **Build order for v9:** J01 to J07 on the global nav, home and one story first (these touch every page), then the B parity rows, then J08 to J16.
- **One metaphor per job** (DESIGN-SPEC-v9.md §1). Don't put a stamp where a tag belongs.
- Read COUNCIL-REVIEW.md once. **Nancy approved the freeze (5 October 2026): no new screens or features until STATUS.md shows 50 Done rows with evidence.**
- `screens-v9/` has 16 screenshots for quick visual reference.
- The page header is the **Departures board** (J10). Layovers are trains, boats and roads too: no flight-only words in UI.

## ⚠ Completion protocol (this is why v8 exists)
Earlier sessions reported "done" while items were silently skipped. From now on:
1. **REQUIREMENTS.md is the contract.** It has **146 numbered items** (A01 to J16). Nothing counts unless it has an ID.
2. **STATUS.md is the ledger.** One row per ID, never merged. Allowed statuses: TODO, In progress, Done, Partial, Blocked, N/A, Deferred.
   - **Done needs evidence:** the live URL with `?v=` and one line on what you saw. No URL, not Done.
   - **Partial** says exactly what is left. **Blocked** says who or what it waits on. N/A is only allowed where REQUIREMENTS says so (B31, B32). Deferred only for G16.
3. **Update STATUS.md after every single item**, not at the end. If your context runs low, stop, save STATUS.md, and tell Nancy where to resume. The next session starts by reading STATUS.md.
4. **Run `node handoff/verify-live.mjs`** after every publish batch. It checks every route for 404s, em dashes, retired copy, US-order dates, stray emails and banned words, and it audits STATUS.md for missing IDs and Done-without-evidence. Paste its summary into your session report.
5. **Never say "all done"** while any row is TODO, In progress or Partial. End every session with the STATUS summary line, the verify-live summary, and the list of rows still open.
6. If something in the design is impossible or unclear, mark it Blocked with the reason and move to the next ID. Don't quietly substitute something else.
7. If you find a live page with no ID, add it to STATUS.md as a new row (X01, X02…) and ask Nancy before changing it.

## 0 · Read these first, in this order
1. `handoff/README.md`
2. `handoff/REQUIREMENTS.md` and `handoff/STATUS.md`
3. `handoff/DESIGN-SPEC-v9.md` then `handoff/DESIGN-SPEC.md` (tokens, components, copy rules, §3b group pages, §3c directory)
4. `handoff/IMPLEMENTATION-BRIEF.md` (Memberstack mapping, contract hooks)
5. `handoff/SHAREABLES-SPEC.md` (cards, counting, share flow, privacy, The Pack)
6. `handoff/TLL Site Prototype 2.0 (standalone).html` (floating SCREENS menu, bottom left) and `handoff/TLL Shareables (standalone).html` (pan/zoom board)
7. `handoff/screens-v8-reference/NN-*.html` and `handoff/shareables/NN-*.html` for exact markup, plus the two logic files for data and copy

The prototype markup is a reference, not code to paste. Rebuild it in Webflow with existing classes where they exist and inline styles where they don't.

## 1 · Hard rules (never break these)
- **Never touch the "TLL Nav v1" component's Memberstack blocks.** Login/account switching lives there. Adding a link is fine; editing the anon/member wrappers is not.
- **Never remove** element IDs, `data-*` attributes, form input names or Memberstack attributes. Adding is fine.
- **Don't remove or reorder the site-level registered scripts.** Keep the cookie consent and GA4 (consent-gated).
- **Countries are never hardcoded.** Counts bind to data (`tllStates` for Nancy's map, CMS for published stories). Member JSON keys `tllStates` / `tllStatesAt` are the only things that write the map.
- **Publish to both custom domains plus the Webflow subdomain, every time.** Check each publish with a `?v=` cache-buster.
- **Voice:** Lonely Planet × Klarna × a National Park Service sign. Quirky, dry, funny. No em dashes. Never invent facts, quotes, stats, people, pets or photo credits. Open slots say OPEN SLOT or SAMPLE.
- **Dates:** Copenhagen order with the month spelled out ("28 September 2026"). No other format.
- **Teal:** `#00C9C8` on dark surfaces only. `#067A79` for teal text on cream or paper.
- **Type:** Playfair Display 800 for headlines, IBM Plex Sans Condensed for body, JetBrains Mono for eyebrows and meta. Syne appears only in the wordmark.
- **Retired:** vibe collections (Sunset Mist, Desert Glow, Alpine Escape, Wild Routes, Salty Air) and anti-AI framing as marketing ("not chatbots", "0 stories by a chatbot").
- **Banned words, with one exception:** "microchip", "titer/titre" and "FAVN" stay out of site UI, forms and marketing copy. Informative pet-travel content (the Paw Passport guide and its free companion story) is exempt, because EU law requires those steps. The pet registration form still has no medical fields.
- **Min age is now 16** (changed today; the live sign-up says 13, so update the checkbox label).


## 2 · Job one: full-site parity (REQUIREMENTS group B, every row)
For each B row: fetch the live page (cache-busted), open the matching screen file, list every difference (section order, copy, components, states, colors, type, links, empty states), fix, publish, re-fetch, write the STATUS row.

| ID | Live URL | Screen file |
|---|---|---|
| B00 | nav on every page | 00-global-nav-and-chrome |
| B01 | / | 01-home |
| B02 | /stories | 02-stories |
| B03 | /stories/{slug} | 03-story-detail |
| B04 | /travelers | 04-travelers |
| B05 | /the-paw-passport | 05-paw |
| B06 | /about | 06-about-share |
| B07 | /share | 07-pen-a-tale-submission |
| B08 | /travel-wire | 08-the-travel-wire-news |
| B09 | /editor-desk | 09-editor-desk-review-panels |
| B10 | /countries/{slug} | 10-country-page |
| B11 | /profile/{slug} | 11-public-profile |
| B12 | /edit-profile | 12-edit-profile |
| B13 | /spotlight | 13-spotlight |
| B14 | /faq | 14-faq |
| B15 | /support | 15-support |
| B16 | /for-expats | 16-expats-the-location-experts |
| B17 | /for-press | 17-press-trips-the-pros |
| B18 | /for-affiliates | 18-recruit-pages |
| B19 | /my-pets | 19-my-pets-form (now includes the Pack request field) |
| B20 | /paw-passport/{slug} | 20-public-paw-passport-payoff (now includes The Pack) |
| B21 | /pets | 21-pets-index |
| B22 | /the-map | 22-the-map (chrome only, never the engine) |
| B23 | /editorial-charter | 23-editorial-charter |
| B24 | /community-guidelines | 24-community-guidelines |
| B25 | /privacy, /terms | 25-legal-privacy-terms |
| B26 | /forgot-password | 26-forgot-password |
| B27 | /contact | 27-contact |
| B28 | /cookies | 28-cookies |
| B29 | /share-photos | 29-share-photos |
| B30 | story OG tags | 30-share-card-og-preview |
| B31 | none (reference) | 31-style-guide |
| B32 | see group C | 32-directory-boards-expats-creators-press |
| B33 | /guides/copenhagen-stopover, /guides/ees-etias-layover | 33-answer-guides-aeo |
| B34 | /awards | 34-layover-awards |
| B35 | /for-brands | 35-for-brands-stopover-partnerships |
| B36 | 404 | 36-404 |
| B37 | /login, /signup | 37-login-signup |
| B38 | /account | 38-account |
| B39 | /gallery | 39-lounge |
| B40 | /destinations | 40-destinations |
| B41 | footer on every page | end of 40-destinations, after `<!-- FOOTER -->` |

(v7's table had stale screen numbers for login, account, lounge, destinations and 404. This one is correct.)

## 3 · Job two (REQUIREMENTS group C): the traveler directory (spec in DESIGN-SPEC §3c, boards in screen 32)
Three opt-ins on one profile: **Expat → `/expats`**, **Creator → `/creators`**, **Press → `/press`** (plus the `/press-trips` board).

**Principles:**
- **Opt-in, always.** Nothing shows unless the member switched it on.
- **Where you know, never where you are.** Country, optional city, how long. No neighborhood, no address, no live check-ins.
- **Shuffled, never ranked.** Directory order is random on every load. No paid placement.
- **Contact without exposure.** Contact happens only through Instagram, a WhatsApp Business short link (`wa.me/message/…`; reject `wa.me/{number}`), or an email relay form. A raw phone number or email is never rendered. There is no DM system.

**Build pieces:**
1. **Memberstack custom fields:**
   - Toggles: `is-expat`, `is-creator`, `is-press`.
   - Expat: `lives-country`, `lives-city`, `lives-years`, `knows` (a list of country + years), `tags` (max 5), `languages`.
   - Creator/press: `roles`, `affiliation`, `regions`, `monetization` (affiliates / hosted trips / sponsors).
   - Links and contact: `link-{type}` + `link-{type}-on`, `contact-mode` (none / platforms), `contact-ig`, `contact-wa`, `contact-relay-on`.
2. **How directory data reaches public pages.** Memberstack member data isn't public. Sync opted-in members into a **Directory CMS collection**, one item per member. It holds only the public fields, and only while the matching toggle is on. Switching a toggle off removes the member from that directory on the next sync. Switching contact to "none" hides every contact route at once.
3. **Verified press:** a manual flag Nancy sets after she sees one of: 2+ published pieces, a press card, an editor or outlet reference, or a portfolio site.
4. **New CMS collections:**
   - **Resources:** name, url, type, country, note, checked-on, status.
   - **Press Trips:** destination, dates, covered, wants, host, deadline, apply-url, status. Hide a trip after its deadline, and label every trip "Hosted trip".
   - **Stories additions:** `external-url`, `platform`, `gated` (none / paywall / login).
5. **Pages:**
   - `/expats`, `/creators`, `/press`, `/press-trips`.
   - An expat block on every country page. It has to look right with one card, and it needs an honest empty state.
   - A "Where expats already gather" resources block.
6. **Link-out stories:**
   - `/share` gets a "Write it here / Link to it" fork.
   - Link-out cards put the platform icon in the flag spot, say "Opens on {platform} ↗" and open in a new tab, and show a gate chip when one is set.
   - They count toward the member's story total, the country page and the map. Site-wide counts say what they count.
7. **Review is the same light pass for native and link-out stories:** a photo and a title, it's travel, the link works, the country is right.
8. **Guardrails:**
   - "Report this profile" on every card.
   - A rate limit on the relay form.
   - Outbound links use `rel="noopener nofollow ugc"` and open in a new tab.
   - Hosted trips follow Danish disclosure: "Reklame for [company]" first, plus a label beside each affiliate link.

**Interest tags are PROVISIONAL** (screen 32, board D0: 26 tags in 6 groups). Build the tag field as a CMS option list so it can be swapped later. Don't hardcode it. The taxonomy research replaces or confirms these tags before launch.

**Seed data:**
- **Nancy** is the only real directory member: lives in Denmark, knows Brazil and Vietnam, tags Running scene and Groceries + cooking. Abroad since 2018 (lives-years computed from that). Languages: English, Danish, Portuguese. Channels (from her Linktree, 28 September 2026): Instagram @nancycarleton, YouTube @nancycarleton, Linktree linktr.ee/nancycarleton, website thatlayover.life. Her WhatsApp and email are on that Linktree too, but never render them: contact goes through Instagram or the relay form. Her business links (Brand Collective, Damgaard, 42TAX, LAAS, Lub Bub) stay off her travel profile unless she asks.
- **Resources:** Denmark gets the 4 in DESIGN-SPEC §3b. InterNations is a global network and can be listed per country once someone has checked that country has an active chapter. "AMSOC" in Brazil is **unconfirmed**. Don't list it until Nancy gives the full name and URL.


## 4 · Job three: v6 and v7 features (groups D and E)
Spec in CHANGES.md (v6 and v7 sections). Every item there has an ID in D or E.

## 5 · Job four: Memberstack gating (group F)
Mapping in IMPLEMENTATION-BRIEF.md. Test each gated page logged out and logged in, and record both in STATUS.

## 6 · Job five: shareables (group G) and The Pack (group H)
Full spec in SHAREABLES-SPEC.md. Build the percent card end to end first (all sizes, share flow, privacy panel, /p/ page) as the proof, then the rest on the same shell. G16 (server OG images) stays Deferred until G01 to G15 are live. The Pack never shows a friend without their human's approval and never scrapes Instagram.

## 7 · Build order
1. Parity (B), highest traffic first: B01, B02, B03, B04, B10, B00, B41.
2. Site-wide rules sweep (A), then run verify-live.mjs until it is clean.
3. Gating (F).
4. Directory (C).
5. v6/v7 features (D, E).
6. Shareables (G), then The Pack (H).
7. Final pass: re-run every B row against the live site and verify-live.mjs; update STATUS.

## 8 · Waiting on Nancy (group I, already marked Blocked)
Don't guess any of these. Build around them with the documented defaults and leave the row Blocked until she answers.
