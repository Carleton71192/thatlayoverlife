# CHANGES · v8 · 28 September 2026 · shareables + completion protocol

**Folder is `tll-handoff-v8-2026-09-28`.** Every doc starts with the v8 version line.

## New in v8
1. **Completion protocol.** REQUIREMENTS.md (127 numbered items covering everything in v5 to v8), STATUS.md (one row per ID, evidence required), verify-live.mjs (route + copy checker that also audits STATUS.md). The prompt now forbids "all done" while any row is open.
2. **Shareables system** (SHAREABLES-SPEC.md, shareables/, TLL Shareables standalone): duo, percent, map, passport, pet passport + map, pack cards at 1080×1920 / 1080×1350 / 1200×630, light and dark; UN 193 counting with bonus places and the Airside → Lived tier ladder; two-tap share flow with fallbacks; privacy panel (off by default) and /p/{handle} public page; empty/new/quiet states; alt text. Requirements G01 to G16.
3. **The Pack** (Magnus's friends): a Pack card, a "The Pack" section on the public Paw Passport (screens/20), and an "Ask them" field on My pets (screens/19). Approval by the friend's human required; never scrape Instagram. New Pack Links collection. Requirements H01 to H04. All slots are OPEN SLOT until Nancy supplies real friends.
4. **Parity table fixed.** v7 pointed login, account, lounge, destinations and 404 at the wrong screen numbers. screens/ was re-exported (00 to 40) and the table now matches the files.
5. **Memberstack additions:** share-level, share-slug, share-items, share-ranges (shareables). tllStates values extend to airside|escaped|fed|slept|lived (migration pending Nancy, I07). No other new keys write the map.

---

# CHANGES · v7 (kept for reference) · 28 September 2026 · monetization pass

**Folder is `tll-handoff-v7-2026-09-28`.** If a diff says "identical", you are holding v6 or older.

## New since v6 (monetization pass, from the STORM report). All additive.
1. **For Brands page** (`screens/*for-brands*`), suggested slug `/for-brands`: a hero, three packages (creator casting, stopover content, hosted trip disclosed), "What we measure", "What is never for sale", a past-partners OPEN SLOT, and a mailto `hello@thatlayover.life` with subject `PARTNERSHIP`. **No prices are shown** ("priced per brief"). The footer line says work is invoiced by The Brand Collective. Don't publish a CVR or address until Nancy supplies them.
2. **Editorial Charter rule 08, "Paid work never buys a verdict"**, plus a full policy block (A to F) anchored `#paid-work`. The header becomes "Eight rules". Marked **DRAFT, NANCY TO APPROVE**, so remove that label only once she has. The public client list starts as "CLIENTS SO FAR: NONE."
3. **The Layover Club** on `/support`, anchored `#layover-club`: an optional Ko-fi supporter tier. **Price TBC** (USD 3 to 5 a month, or yearly). Perks: a profile badge, the thank-you page, early Travel Wire access, and a printed-book discount "if and when it exists". The buttons stay disabled with "COMING SOON" until the Ko-fi link exists.
   - **Memberstack:** a custom boolean field `club-supporter`, synced from Ko-fi by hand or through Zapier/Make. When true, show a "Club" badge on the profile. Never gate content on it.
4. **Paw guide sales block:** the price line reads "V1.0 · INCL. 25% MOMS", and the verification line cites **Regulation (EU) 2026/131** with the version and date. The guide PDF itself must be rechecked against EUR-Lex 2026/131 and 2026/705 before the Ko-fi link goes live. That's on Nancy, not the build.
5. **Footer:** a "WORK WITH US" row after GUIDES: For brands · The Layover Club · How paid work works (goes to `/editorial-charter#paid-work`).

## Labeling reminders (Danish marketing law)
Any sponsored story gets **Reklame** before the headline. Any affiliate link gets **Reklamelink** beside it. A paid directory slot, if one ever ships, sits in a separate row labeled **Annonce**, never ranked above the randomized free list.

---


**This export is NOT the same as the previous zip.** If your diff says "identical", you are looking at the old download. This one's folder is named `tll-handoff-v6-2026-09-28` and every doc starts with the version line above.

## New since v5 (build in this order)
1. **Story ledger** (`screens/03-story-detail.html`, `[data-tll-ledger="story"]`): an 8-row receipt at the foot of every story. Submitted by, Edited by, Trip, Published, Last updated, What it cost, Sources, Disclosure. Empty fields render **"Contributor to add"** in muted grey. Never hide the row, and never invent a value. Plus a "Tell the editor" correction mailto (`hello@thatlayover.life`, subject `CORRECTION`).
   - **New Stories CMS fields (additive, don't touch the existing ones):** `trip-when` (text), `cost-summary` (text ≤ 80), `sources` (text, default "First-hand"), `edited-by` (text, default "Nancy Carleton"), `route-stops` (text, comma-separated IATA or place codes), `route-note` (text).
   - Last updated = the item's `updated-on`, formatted `DD MMMM YYYY`. Put `datePublished` and `dateModified` in the Article JSON-LD.
2. **Route strip** under the story hero: renders only when `route-stops` is filled. Stops are in mono, joined with teal arrows, with `route-note` on the right. In the sample, the Balkans and Patagonia stories have it.
3. **Been here / Want to go toggles** on the story page (under the short version) and the country page (above Quick Answers).
   - **Memberstack integration:** store it in member JSON under a **new key `tllPlaces`** = `{ "<iso2>": "been" | "want" }`. **Do not write `tllStates`/`tllStatesAt`** (map-only rule).
   - "Been here" should *also* offer "Add to my map", which routes through the existing map save path. It doesn't write the map directly.
   - Logged out, a tap goes to `/login?redirect=<current>`. Show the counts ("N BEEN · M WANT TO GO"). Don't show a leaderboard.
4. **Your lists** on `/account` (`screens/37-account.html`): a sticker-sheet grid of stamps (circle flag, name, mono meta, dashed ring, slight tilt).
   - Tabs: Pet stamps (from the Pets CMS countries), Want to go (`tllPlaces` = want), Layover airports survived, Marathons, National parks. The last three start empty with honest lines.
   - Store as member JSON `tllLists` = `{ airports:[iata], marathons:[{city,year}], parks:[slug] }` (additive key).
5. **Layover Wrapped card** on `/account`: lands 1 December.
   - Stats come from existing data (stories filed, countries in those stories, pet stamps, want-to-go count).
   - A **quiet-year fallback** ("0 countries, 100% couch.") so nobody gets an empty card. Crew comparison stays off until the crew has more than one person.
   - A "Visible to / Hidden from your crew" switch stored as `wrapped-hidden` (Memberstack custom field, boolean).
   - The shareable card image is Phase 2 (Cloudinary overlay), not now.
6. **Export my data** on `/account` now works in the prototype (downloads JSON). Live: build it as an email request that returns JSON (member, tllStates, tllPlaces, tllLists, pets, nominations) plus Markdown for stories, within one month. This matches the privacy policy.
7. **Two answer guides** (`screens/*answer-guides*`): "The Copenhagen stopover, with or without a dog" and "EES and ETIAS on a layover".
   - Suggested slugs: `/guides/copenhagen-stopover`, `/guides/ees-etias-layover`.
   - Each question is a real **H3**, answers are 40–90 words, and every answer links its official source. Add a ledger (Checked by, Last checked, Sources, Updated). Add FAQPage JSON-LD for structure only.
   - **Both carry a DRAFT banner.** Nancy must check every answer against the linked source before they go live, and set "Last checked" then. Don't remove the banner until she has.
   - Footer gets a "GUIDES" row linking both, plus the Awards page.
8. **TLL Layover Awards** (`screens/*layover-awards*`), suggested slug `/awards`: a member-only nomination form.
   - **Categories:** Best layover airport, Best stopover city, Most pet-friendly hub, Best airport to sleep in, Worst gate to be stuck at.
   - **Fields:** place, and why (≤ 140). One per category per member. Logged out, the form goes to login.
   - **New CMS collection "Award Nominations":** category, place, why, member-id (private), logged-flag (set in review), status (in review / shortlisted / winner / declined), year.
   - **Public page:** no tallies, ever. Editors publish winners with a short "why". The window is *proposed* for 1 to 31 October, and Nancy confirms the dates.

## Unchanged and protected
Read "⚠ PRESERVATION RULES" at the top of IMPLEMENTATION-BRIEF.md. Nothing in this pass removes a story, a binding, a `data-ms-*` attribute or a form input. Every item above is additive.

## Files
- `TLL Site Prototype (standalone).html`: every screen, including the new ones. The SCREENS toggle has "CPH stopover", "EES/ETIAS" and "Layover Awards".
- `screens/`: 39 screen files + `prototype-logic.js`.
- DESIGN-SPEC.md, IMPLEMENTATION-BRIEF.md, CLAUDE-CODE-PROMPT.md, README.md.
