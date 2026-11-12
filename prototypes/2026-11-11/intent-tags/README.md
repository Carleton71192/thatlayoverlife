# Departures by Intent: the Intent Tags panel

A clickable prototype of a tag panel that sorts the TLL library by what a reader is trying to do, set like an airport departures board. Open `index.html` in a browser. Mock-up only: nothing here is loaded by the live site, nothing was committed, and Webflow was not touched.

Screenshots: `shot-390.png` and `shot-1440.png` (full page, after a random pick, with the Pet relocation, Border crossings, 4 to 8 hours and Brazil rows open).

## Files

| File | What it is |
| --- | --- |
| `index.html` | The prototype. One self-contained document. The only external load is the Google Fonts stylesheet. |
| `build.cjs` | `node build.cjs` writes `index.html` from `template.html` and `stories.json`. It writes every row into the HTML, so the panel works with JavaScript off, and it computes every count from the data. |
| `template.html` | The page shell: tokens, CSS and the small filtering script. |
| `stories.json` | The 57 live stories (slug, title, place line, country, contributor, minutes, date), copied from the smart-omnibar prototype, which re-checked them against the live story pages on 12 Nov. |

## How the brief is met

- **Semantic tag panel, CSS-driven.** Three boards, each a `<section>` with an `<h2>`, holding `<ol>` lists of tag rows. Geography adds an `<h3>` per region. A Boarding row is a native `<details>`: its `<summary>` is the board row and opening it shows the "gate", a list of real links. With JavaScript off, every row, every count and every link is there and opens with a click or Enter.
- **Intent Tags grouped by mindset.**
  - *By duration*: Under 4 hours opens onto "Three Hours in Sofia, If You Must (from SOF)"; 4 to 8 hours opens onto "The 6-Hour Copenhagen Reset (from CPH)". Each gate quotes the guide's real section headings. 8 to 12 hours and Overnight layover are Later, Coming soon and not linked. Rows are placed by a guide's hours falling in the range, so a new guide fills its row on rebuild.
  - *By objective*: Border crossings, Pet relocation, Running a marathon, Turning a layover into a trip, Multi-day treks, Going to a wedding, Working remotely and Living abroad open onto real stories and pages. A story is listed only where its own published summary says so (for example the Schengen story's "the village that named Europe's open borders", the Laos and Eswatini stories' "remote-work", the Istanbul story's "A three-hour Istanbul layover turned into four days"). Local grocery hacks, Moving paperwork, Visa dates and City life after the move are Later; their lines are real lines from /for-expats.
  - *By geography*: computed from the story data. 39 places across seven regions, each with its story count, sorted busiest first. Each gate lists that place's stories and links to its country page where one exists (checked live, HTTP 200, on 12 Nov).
- **Departures board feel.** Midnight boards, JetBrains Mono codes set in split-flap tiles (IATA codes for the guides, ISO alpha-3 codes for countries, MULTI for multi-country trips, row numbers for objectives), a Going to column with the count, and a Status column: BOARDING in Maldives Teal, LATER in muted cream. Column heads are hidden from screen readers since the rows read as plain text.
- **Minimal transitions.** Rows settle on load from 0.6 opacity and 8px in 250ms (a 12ms step per row, capped so nothing runs past 300ms). On hover or keyboard focus the code tiles and the status settle again, like a flap board catching up. The open gate settles the same way. Only transform and opacity animate. `prefers-reduced-motion` turns all of it off.
- **A little JS for filtering.** A filter field (accent-insensitive, matches tag names and the titles, places and bylines inside each gate; a match inside a gate opens that row and marks the story), status chips (All, Boarding, Later), a live "Showing N of M tags" line, and an empty-board message. The script also recounts every number from the data in the page on load.
- **Random pick.** TLL has no reading numbers, so "Pick a random story" draws from all 57 stories, says that it is random, lists which tags it sits under (worked out from the boards), and "Show it on the board" filters to it.

Checked in Chromium at 390, 768 and 1440: no sideways scroll, no console errors, no text under 12px, every link and control at least 44px tall, axe-core clean, all six font faces loaded, filtering, chips, random pick and keyboard focus exercised, no animation under reduced motion, and the boards open with JavaScript disabled.

## Departures from the brief's wording

- **Pet relocation** has no story about relocating a pet. The tag opens onto The Paw Passport page, Magnus Waffles's page and the four stories where Magnus comes along (Schengen, Balkans, the Sort Sol drive in Denmark, the dog-friendly Superman screening in São Paulo), plus the €9 EU pet travel guide as a HOLD item marked "LINK: KOFI URL FROM NANCY", not a link.
- **Local grocery hacks** has no story, so it is Later and Coming soon. Its line, "You translate spices in the grocery aisle.", is from /for-expats.
- **"Overnight Layover"** is Later: no guide exists. The other live durations are the two real guides, so "<4 Hours" became "Under 4 hours" and the 6-hour guide sits under "4 to 8 hours".
- **Tags lead to a gate, not straight to a URL.** Most tags cover several stories and the live `/stories?q=` filter is not exact enough to stand in for a tag (on 12 Nov "India" also caught the Indiana Jones story and "United States" caught nothing), so each Boarding tag opens onto its own list of real links instead.
- **Five stories have no single country** in the data. Their place is read from the end of their place line: Rudbøl gives Denmark, and Antarctica, Balkans, Aruba and Curaçao, and Chile and Argentina stand as their own rows. The country field says "Turkey"; the board shows "Türkiye", as the site does.
- **Tailwind** was not used: the brief asks for CSS-driven, and production has no Tailwind.
- **No photos.** A departures board does not need them, so none were used and no photo slots were added.
- **Quoted titles** are used exactly as published. Two of them, "Celebrating an Epic Trip in the Pac NW!" and "Patience, Iago, Patience!", carry an exclamation mark; they stay as written.
- **"Going to a wedding"** is the tag name, not "A wedding abroad", because the New Orleans and Portland weddings were trips home for their writers.

## Real and SAMPLE

Everything shown is real: story titles, place lines, bylines and minutes; the two guide titles, URLs and section headings; the Paw Passport, Magnus Waffles, For Expats, Layovers, Submit and country page URLs; the Later lines, which are quoted from /for-expats. The region grouping and the ISO codes are my classification of real data. All counts are computed. The only placeholder is the Ko-fi link, marked HOLD. Nothing needed a SAMPLE label.

## Moving it onto the real site

Production has a 15-script cap and no Tailwind, so the panel would not be a new script:

1. **Markup in Webflow.** The rows can come from CMS Collection Lists: Stories grouped by country for geography, a small "Intent tags" collection (name, board, status, multi-reference to Stories and to pages) for objectives, and the Layovers collection for duration. Status Later is a switch that drops the multi-reference and shows "Coming soon". Native `<details>` needs no script. That keeps the no-JS panel.
2. **CSS** goes into the shared site-layers stylesheet, using the brand tokens already defined there.
3. **The filter and the random pick** (about 3 KB) go into the existing site-layers bundle (`tll-site-layers-v16.js` or its successor) behind a `data-tll-intent` hook, so they take no new script slot.
4. Counts would come from the Collection Lists themselves; the recount in the script stays as a guard.
5. The editorial call, which stories belong under which objective, stays a human one: the multi-reference field, not keyword matching. Keyword matching on the index produced too many false hits (every story that mentions a "border" in passing).
