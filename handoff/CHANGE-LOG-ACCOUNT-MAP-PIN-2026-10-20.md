# Change log: /account map pin moves to aeba470 (20 October 2026)

**Status:** Approved 21 Oct 2026 with one change (Nancy: "Approve the account map pin, use today's version"): pinned to a81ffb9 instead of aeba470, live (STATUS S122). Original status: proposed, awaiting Nancy's approval. Staged as an unpublished Webflow edit on 20 October 2026; the code was read back and matches the after file. Nothing is published. STATUS.md row S121.
**Site:** 69d6145cf421c777840c1e25. **Page:** /account 6a0d5c23c57426a9c563e8de. **Element:** HtmlEmbed ee672abf-2d76-2371-e49d-ea35ffd3960c ("My map", Map 2.0 in member mode).
**Before and after code:** src/pages/account/live-2026-10-20/map-embed-ee672abf-before.html (read from Webflow today) and map-embed-ee672abf-after.html (what was staged).
**Why:** COUNT-RULES.md section 7, stale browser copies. Follows S94 (handoff/CHANGE-LOG-ACCOUNT-COUNTS-2026-10-20.md, item 9), which moved the save stamp in the repo and left this pin for later.

## 1. The problem

The inline map on /account loads the Map 2.0 bundle from jsDelivr pinned to commit 6a1098ab. In that bundle, a tap on a country writes `localStorage.tllStatesAt` (the browser copy's "newest" stamp) at the moment of the tap, before the save to Memberstack runs. If that save fails, the browser copy keeps the newest stamp and can win over the saved map on the next load. This is the cause of the 87, 94 and 85 in Nancy's audit.

Commit aeba470 stamps `tllStatesAt` only inside the success handler of `updateMemberJSON`, with the same time as the saved map. /account has no `__tllPush` of its own (only /the-map does), so on /account the bundle saves through its own `pushMemberstack`, which is the code that carries the fix.

## 2. The change

One embed, four strings. The commit hash 6a1098ab4f3c8d1f0f42a7dcd9bab6e5fbf0e4e9 becomes aeba470383a28a3d6143f282a758de18ded29aec in:

1. the stylesheet link (`.../thatlayoverlife@{hash}/map-2.0/dist/tll-map-layers.css`);
2. `data-tll-version` on `#tll-map-layers`, which sets where the bundle reads collections.json and the data files;
3. `var V` in the loader script, which loads the bundle from jsDelivr and falls back to statically.io;
4. the HTML comment at the top, which now reads "pinned to commit aeba470... (20 Oct 2026, was 6a1098ab: the map stamps tllStatesAt only after a successful save)".

Nothing else in the embed changes: the heading, the help paragraph, the two buttons (Edit the full list, Open full screen), the counter block, `data-tll-style` and `data-tll-editor="inline"` stay as they are. The embed comment says `data-tll-editor="inline"`, and the attribute is still there: aeba470 reads it the same way 6a1098ab did ("Edit my destinations" scrolls to the map and the member logs by tapping a country, rather than going to /the-map#edit).

Checked today: every file the embed needs is served from cdn.jsdelivr.net at aeba470 (dist/tll-map-layers.js 200, 100,308 bytes; dist/tll-map-layers.css 200; collections.json 200; data/countries.json 200; data/owner-record.json 200). The served bundle has the same SHA-256 as the file in the repo at aeba470 (4e0b9e0c...ace9) and contains the line "tllStatesAt is stamped after a successful save". The statically.io fallback answers 200 at aeba470 after its usual redirect.

## 3. What else changes for a member using the map on /account

The diff of map-2.0/ from 6a1098ab to aeba470 covers commits 7b4a88d, c568219, edb910c (S94), 3e28650 (S106), a458790 (S110, live counts) and aeba470 (S114, rulebook whys). /the-map has had all of this since S110 and S114. On /account the member gets:

**Saving**
- The save stamp fix above (S94).
- A bar above the map, members only: "Last saved 19 October 2026" (from `tllStatesAt` in the member JSON) and a 44px "Refresh from my account" button that re-reads the account copy, writes it to the browser and repaints (S110, B3.8).
- The bundle now listens to every same-tab `updateMemberJSON` save on the page and repaints once it succeeds. On /account that includes the lists block and the logbook; it changes nothing they save.

**Numbers**
- The counter above the map ("countries logged", "of the list") now comes from the one count function in the bundle (`TLLMapCounts`): places Lived or Stayed by any person on the account, best depth wins, Antarctica included, pets never, Kosovo read from 900, XK or undefined. Before, it counted only the member's own traveler, from the map shapes. For Nancy's 19 October map it reads 90 / 249 and 36%; the /account Logged card (S94) reads 90 of 249 from the same rules, so the two now agree.
- Country fills show the best depth of anyone on the account, not only the member's own traveler.
- The Countries card under the map shows countries with "+ Antarctica", "Places 90 of 249", the depth rows and continents of 7.
- The rulebooks are computed: codes of 249, UN members of 193, UN plus Holy See and Palestine of 195; the Travelers' Century Club stays OPEN.
- "Why the numbers differ" lists the member's own places that are not among the 193 UN members (on Nancy's map these include Antarctica, Kosovo and New Caledonia) with one line each. The same line shows under the name in a country's popup and in the keyboard list (S114).
- Lines and extremes are by country (furthest north, south, east and west by the center of each country's shape, equator and prime meridian, hemispheres of 4, continents of 7). Polar circles, tropics, antimeridian and time zones are gone.
- Cities, airports, US parks and parks everywhere count from the member's logbook (`tllLog`, `tllParks` in the member JSON). The Places Been pins for those lists show only on the site owner's map.

**Lists and copy**
- 28 of the 35 lists leave the page for now (`hidden_until_loggable`), including the Magnus paw chip. Seven remain: Countries, Cities, Airports, US national parks, Parks everywhere, Lines and extremes, Lines crossed.
- Copy from S106 and S114: heading "Every list, one row each.", "No story from here yet.", the walked ruling in every rule (one night or the center at ground level, past the gate and inside), the lines subtitle "From the countries on your map, so it changes when your map does."

**Loading and scrolling**
- MapLibre and the country shapes load only when the map is about one screen away; a list's data file loads the first time it is switched on (S110, B3.9).
- The page scrolls past the map; zoom needs Ctrl or Cmd plus scroll, two fingers on phones (S106).
- The embed still names the OpenFreeMap dark style in `data-tll-style`. aeba470 treats that URL as "use the built-in plain base style", so the /account map loses the OpenFreeMap street and label tiles, as /the-map did on S110. The countries draw from the map's own shapes either way.

## 4. Not in this change

- **M1 to M4 (S120).** /the-map now loads a81ffb9, which adds Remove in place of Clear, the save status line ("Saved. Angola: Layover only."), the members' help line and Undo. aeba470 does not have them, so after this change the /account popup still says Clear and shows no save message. Moving /account to a81ffb9 instead is one more string change; it was not asked for here and has not been checked on /account.
- The /account head and footer code, the Logged, Pawed and Written cards, and every `data-ms-*` element. Only the embed's code setting was written.
- The heading "Every country, on your map." and the label "countries logged" under a places number (see question 2).

## 5. Open questions

1. Pin /account at aeba470 as written, or at a81ffb9 so /account and /the-map run the same map code, M1 to M4 included? Recommended: a81ffb9 in a follow-up, after a check on the subdomain.
2. The counter label says "countries logged" over a number out of 249 that includes Antarctica, so by COUNT-RULES section 8 it is a places number. Same question as S94 question 1; no copy changed here.

## 6. Verification plan after approval

Publish to the Webflow subdomain only. Load /account signed in, check the loader line clears, the map starts when scrolled near, the counter and the Logged card show the same number, "Last saved" shows a date, and a tap on a country saves (the "Last saved" date moves only once the save has succeeded). Then publish to both custom domains and log the result in STATUS.md.
