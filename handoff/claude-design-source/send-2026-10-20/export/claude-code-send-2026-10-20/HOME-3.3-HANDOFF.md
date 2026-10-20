# TLL Home 3.3 handoff · 19 October 2026

Source of truth: `TLL Site Prototype 3.3.dc.html` (home, header, footer, widget, Submit v4). Review frames: `TLL Home 3.3 Review.dc.html`. Baseline 3.2 untouched.

## Rules carried
- Playfair Display 800 headlines (rose italic accent allowed), IBM Plex Sans Condensed body, JetBrains Mono eyebrows, Syne wordmark only.
- Links on light: #067A79. Small rose text on light: #C8325B. Teal #00C9C8 on dark only.
- Counts bind to tllStates (prototype reads TLL_MAP). Never a typed number. Story coverage is labeled "countries in our stories".
- 12px text floor, 44px tap targets, no horizontal page scroll (rails scroll sideways with a cue).
- Voice: no em dashes, no "ships / ledger / No filler / Truth over polish", US English.

## Items 1 to 8 · what changes, why, for whom

1. **Hero** · H1 + one line + free line + two CTAs. Removed the vertical "A travel magazine…" line and "Scroll · the world is long". Coordinates caption kept at 12px. · *First-time visitors.*
2. **Travel dashboard chapter** (merges Passport + Map) · "Every place you have been, in one spot." One CTA → /the-map (passport). Logged out: Nancy's map embedded (`TLL Map.html?mode=public&embed=1`; live: the public map embed) with the count line from tllStates: `{countries} countries{ + Antarctica} · {layovers} layovers beside · {places} of 249 places`. Logged in: the member's own map and "Open your dashboard". Under it the loop strip: Profile / Stories and photos / The map. Never 0/249, never "be the first" for visitors. · *Logged-out visitors, new members.*
3. **Expat chapter** · three cards (Moving guides, Visa trackers, Lifestyle hubs) → /for-expats. Status line: "Opening with the countries our members live in." No invented guides. · *Expats.*
4. **Paw Passport chapter** · existing chapter + one sentence + Ko-fi button "Get the guide · €9". **Ko-fi URL TBC.** · *Pet travelers.*
5. **Story rail** · card = avatar (40px) + contributor name + role eyebrow, then 4:5 image with place label, title, pillar · minutes. Order interleaves non-Nancy bylines first. Chips 44px. Cue "{n} stories · They move sideways →". Live: order by `author != Nancy` first, then date. · *Readers, contributors.*
6. **Global nav (approved 19 Oct)** · Stories · Travelers · The Map · Expats · Paw Passport · About + Share your story (rose) + Log in / avatar. Destinations is out of the nav now that the library is one page; "By place" is a view inside /stories and the footer keeps a Destinations link (`/destinations` 301 → `/stories#by-place`). Mobile: wordmark, Share (44px), Menu (44px) → full-height drawer, 56px rows, Share + Log in at the bottom, free line. · *Everyone.*
7. **Footer (proposal, sign-off needed)** · desktop four columns; phones: accordions (52px headers, 44px rows). Stats: `{n} countries in our stories · {n} stories · {n} travelers · {n} pet`, all from tllStates. Rename "For affiliates" → "For creators" (`/creators`, 301 from `/for-affiliates`). Guides row folded into Discover (the two guide pages are 404 live; publish or drop first). · *Everyone; sign-off Nancy.*
8. **Tell the editor** · fixed, `left: calc(16px + env(safe-area-inset-left))`, `bottom: calc(16px + env(safe-area-inset-bottom))`, z-index 60, `max-width: calc(100vw - 32px)`, card max-height viewport minus insets with internal scroll. Pill 44px. Card: "Spot something? Send a note." textarea + optional email + Send. Hidden while the cookie banner is open (`cookieOpen` → widget not rendered). Live: a Webflow form posting to the editor inbox with page URL attached. · *Readers.*

## Item 9 · Submit v4 (writer-led) · change log first, then build

**Authenticity contract (as given, all honored in the prototype):**
- Writer writes body, headline, excerpt, pull quote. No auto-fill anywhere.
- Machine fields, labeled "suggested", editable: pursuit (five pillars), tags (CMS tag list only; prototype uses a provisional list `TAG_OPTIONS`, replace with the Tags collection), reading time = ceil(words/220), computed, no AI.
- Editor's notes: separate panel (desktop: sticky right column; phone: bottom sheet), different background (#EFE6D6), one suggestion at a time, Accept / Skip, no accept-all. Allowed: spelling, punctuation, capitalization, paragraph breaks, sentence order within a paragraph. Anything else is a tip. Client-side guard converts over-reaching edits to tips; the server must do the same (diff check).
- Nothing changes without Accept. Each note logged `{type, original, suggested, note, decision, at}` → hidden field `notes-log` (JSON) on the submission.
- Photos: before/after per photo, Approve / Keep original, original kept. Cloudinary allowed: crop, straighten, e_improve, e_auto_brightness, e_auto_color, e_auto_contrast, q_auto, f_auto, resize. No generative transforms.
- Steps: 1 The trip (country from Countries list, city, month, story, headline, excerpt, hero photo) · 2 Optional extras collapsed (pull quote, more photos, pets, co-travelers, shout-outs show 1 add up to 5, cost, who it's for, sign-off, link) · Preview (trip-facts block rendered as text; byline links to /contributors/slug; disclosure label at top) · 3 Confirm (rights, credit, disclosure, syndication default on, charter, notes log, join at send or log in with draft kept) · Published (link, copy, add to map, tag who came along).
- Draft autosaves to `localStorage['tll_submit_draft_33']` in try/catch; cleared on publish. One H1 per state. Every field has a `<label for>`.
- Rules to publish: headline, country, excerpt, 300+ words (or link fetched for link-out), own photo approved or kept, rights, charter.

**Live AI service (for the change log):** Cloudflare Worker `notes.thatlayover.life` → Anthropic API, key server-side; Memberstack token verified; 20 requests/member/hour; payload = story text, country, month only; system prompt as specified; server diff check converts any non-allowed edit to a tip; add Anthropic to the processor list on /privacy (wording for Nancy).

**Public policy line (draft for Nancy):** "Stories are written by the people who took the trip. A tool may suggest spelling and structure fixes and tags; the writer decides every change. Photos are adjusted, never altered."

## Also in this pass
- About page merged with live content; Profile v2 map embed fixed (map only, 1140:560).
- Every number on About, profiles, footer, dashboard reads from the record.

## Open for Nancy
1. ~~Nav proposal (item 6)~~ **Approved 19 Oct.** Footer: shortened to one band after Nancy's note; approved with the nav.
2. Ko-fi URL and whether the guide button goes live before the guide.
4. The 404 joke ("This page missed its connection" + a random story) from the audit: cheap, not built yet.
