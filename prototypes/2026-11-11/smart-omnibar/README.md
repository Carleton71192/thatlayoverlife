# Smart Travel Omnibar

A clickable prototype of one search bar for the whole TLL library. Open `index.html` in a browser. It answers while you type, groups what it finds into stories, layover guides and expat hubs, and when nothing matches it shows the "Stuck at the gate?" state instead of a dead page. Mock-up only: nothing here is loaded by the live site.

Screenshots: `shot-390.png` and `shot-1440.png` (results for "visa", full page), `shot-390-gate.png` and `shot-1440-gate.png` (the gate state for "Lisbno").

## How the brief is met

- **Suggestions while typing, by category.** Every keystroke searches the embedded library and shows three groups: Stories, Layover guides, Expat hubs. Rows show the real title, place, contributor and minutes, with the matched letters in Deep Teal. Stories show six, with a "Show all" row when there are more.
- **Matching.** Title, place, country and contributor from the real data, plus airport codes and city names for the two guides. Accent-insensitive: "Sao Paulo" finds São Paulo, "Rudbol" finds Rudbøl. A word that only appears inside a story (from `src/data/story-search-index.json`) still counts, and the row says which word, for example "Mentioned in the story: visas".
- **Zero matches.** "Stuck at the gate?" with "Try exploring these instead." under it, then three places drawn at random from the places in the real library, a "Pick 3 others" button, and a "Did you mean Lisbon?" row when a spelling fix would find something. Picking a place runs that search.
- **Combobox.** WAI-ARIA combobox on the input: `aria-expanded`, `aria-controls`, `aria-activedescendant`, a listbox of options grouped with `role="group"`. Down and Up move (and wrap), Enter opens the highlighted row, Escape closes the list and a second Escape empties the bar. A polite live region announces the count ("8 matches for visa. 8 stories. 1 expat hub, coming soon.") a moment after typing stops.
- **Tailwind and vanilla JS.** Tailwind 3.4.17 from the CDN, configured inline with the brand tokens. The brand primitives (buttons, chips, focus, rows) are plain CSS on purpose, see the last section. The logic is one plain script with no libraries.
- **Brand and site rules.** Colors only from the `:root` tokens, Playfair 800 with one rose italic word per headline, Plex Sans Condensed for text, JetBrains Mono for labels, square buttons and photos, rose focus ring on Paper and teal on Midnight, 250ms entry from 0.6 opacity and 8px, off under reduced motion. Checked in Chromium at 390, 768 and 1440: no sideways scroll, no console errors, axe-core clean, every control at least 44px tall.

## Second review, 12 Nov

- The corner link, the masthead link, the two text links inside the list and the photo credits are now at least 44px to tap. The corner link sits in a labeled `nav`.
- "Pick 3 others" never repeats a place that is already on screen.
- After you scroll down a long list and type something new, the page brings the top of the answer back under the bar instead of leaving you halfway down.
- Very long queries wrap instead of running off the sheet.
- Small copy: the date is US style, the expat link reads "Read the For expats page →", and the gate note no longer uses the word "trending".

## Departures from the brief's wording

- **"4 Hours in Doha" and "Copenhagen Paperwork Checklist"** do not exist, so they are not in the bar. The bar uses the two real guides instead: Copenhagen in 6 hours and Sofia in 3. Doha still finds the real Doha story.
- **"Expat Hubs"** have no live pages. The group always appears, its header says "Expat hubs · coming soon", and the three areas named on /for-expats (Moving guides, Visa trackers, Lifestyle hubs) are rows marked "Coming soon" that are never links. Their descriptions are lines already on the site. The group ends with a real link to /for-expats.
- **"3 random trending destination tags."** TLL has no reading numbers, so nothing claims to be popular. The label says "3 places, picked at random from the library", and the places are the real place lines from story pages.
- **"Stuck at the Gate? Try exploring these instead..."** is split into a headline and a sentence, without the ellipsis, and in sentence case.
- **"Smart Travel Omnibar"** is kept as the eyebrow; the headline is "Type a place. See who went."

## Real and SAMPLE

Everything shown is real. The 57 stories (titles, place lines, countries, contributors, minutes, dates) were read from the live story pages and re-checked against them on 12 Nov; the body words come from `story-search-index.json`. The two guides, their codes, paces and author were checked on their live pages. The four photos are the stories' own hero images, each under 60 KB, credited "Photo: <contributor>" and linked to the story. Counts on the page (57, 2, 0, the match counts) are computed from the data in the page. No SAMPLE content was needed, so none is labeled. The only line I wrote that points somewhere new is "Been there yourself? Share your story →", which goes to the live /submit page.

## Moving it onto the real site

The live search lives in `src/site-layers/tll-phase0-v1.js` (bundled into `tll-site-layers-v16.js`) and fetches `story-search-index.json` from jsDelivr. The production version would replace that search inside the same bundle, so it takes no new script slot under the 15-script cap.

- **No Tailwind in production.** The Tailwind classes here only lay out the page. The bar itself would use the plain-CSS primitives already at the top of this file (`.omni-input`, `.opt`, `.chip`, `.btn`, `.tag-soon`), injected by the layer the way other layers add their CSS.
- **Data.** The index today maps slug to body words only. It needs `t, p, c, by, m, d` per story (title, place line, country, contributor, minutes, date) added by the build script, plus the guides list. Loaded on first focus of the bar, not with the page, since the words alone are about 170 KB.
- **Photos** would come from the CMS images on the cards, not data URIs.
- **Where the bar sits** is the open question below; the logic does not care.

## For Nancy to decide

1. Where the bar lives: the existing /stories search spot, a nav search that opens this sheet, or both.
2. Whether matching inside the story text stays on. It is what makes "visa" find eight stories, and it also finds stories that mention a word in passing.
3. Whether the expat group shows on every search, or only when someone types something expat-ish, until the first hub opens.
4. Whether the "Share your story" link belongs on the gate state.
5. The index change above: adding title, place, contributor and minutes to `story-search-index.json` in the build.
