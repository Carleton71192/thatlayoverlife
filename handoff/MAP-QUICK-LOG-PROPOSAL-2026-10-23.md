# Map quick log: proposal (23 October 2026)

Nancy, 23 Oct, with a Places Been screenshot: "I still find myself logging on Places Been because their interface is easier. We have more to do."

## Why Places Been is easier (compared with the live /the-map editor, footer-v6-aq.html)

| Places Been | /the-map today |
| --- | --- |
| Map and list on one screen; the map updates as you tick | "Log a country" opens a full-height dark panel over the map; the map is hidden while you log |
| Three big boxes per row (about 44px), one tap each | Pill buttons about 20px tall with 11px text, one row of pills per traveler (Me, Jay, Magnus each get a line) |
| Countries and cities in one list, one search | Countries only; cities, airports and the rest are typed into a separate "Log a place" form on /account, with a year |
| Search box sits above the keyboard on a phone | Search box at the top of the panel; the keyboard covers the results |
| Want and Fav sit beside Been | "Want to go" lives on country pages, not in the map editor |
| Ticking saves; nothing else to press | Every tap already saves, and there is still a Save button at the bottom |
| Tapping a pin on the map shows the same three boxes | Clicking a country opens the panel and searches for it |

## Proposed build: quick log v1 (/the-map only, same saved data)

1. Split screen on phones: map on top (about 40 percent), list below, search box pinned above the keyboard.
2. One row per place: flag, name, and big tap boxes. Proposed columns: BEEN, LIVED, WANT, with LAYOVER as a fourth (the site is about layovers, and the count rules keep layovers apart). Tap once on, tap again off. No Save button; a short "Saved" line instead.
3. One traveler at a time: a chip strip at the top (Me, Jay, Magnus). Rows show only the chosen traveler's boxes.
4. Countries and cities in one search. Cities from GeoNames (free, credit required), loaded only when you type. Cities save to the same city list /account already reads, so nothing else changes.
5. Tap a pin or a country on the map: a small card with the same boxes.
6. The counts keep the one-count rules: only BEEN and LIVED count toward the 249; LAYOVER and WANT are kept apart; Antarctica shows as + AQ.

Saved data does not change shape: countries stay in tllStates, cities in tllLists, Want in tllPlaces. Built as a hosted script, tested offline at phone width, then the test site, then live on Nancy's go.

## Decisions for Nancy

- Columns: BEEN, LIVED, WANT and LAYOVER (recommended), or only three.
- Import: if Places Been can export your list, send me the file and I will write an importer, so nobody has to tick 89 countries twice.
