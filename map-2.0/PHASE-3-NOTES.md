# The Map 2.0, Phase 3: the counted pieces

Date: 7 October 2026. Everything below is rendered from the data files; nothing is typed into the page.

## New on the page, in order under the map

1. **Counted by hand**: one card per collection from `collections.json`: big number, denominator, verb, thin progress line, caption, what counts, as-of date. Numbers count up once when a third of the card is visible (1.3 s, ease out); under reduced motion they show at once. Every caption still reads `[COPY NEEDED]`.
2. **Depth of visit** on the Countries card and on the map: Lived (deep Rose), Stayed (Rose), Layover only (pale Rose with a dashed Ink edge, so the difference is not color alone), and a counted "Layover only" line. Hover on a country names its depth.
3. **Sets of seven**: a row of seven stamps per set. Ticked stamps are Rose with a check; a tap names the item and whether it is ticked. Keyboard: Tab to a stamp, Enter or Space.
4. **Lines and extremes**: furthest north, south, east and west (tap to fly there), lines crossed, hemispheres, continents, and a clearly marked "Not counted yet" for time zones.
5. **Magnus Waffles 🐻‍❄️** layer: paw pins on the 14 countries in his record, from the same member record as the depth data.

## Where the depth and the pet data come from

`source/member-states.json` is a one-time read (7 October 2026) of the site owner's Memberstack member JSON, the `tllStates` record the live map writes. It holds only the per-country state for "Me" and for Magnus; no email, no profile. Re-read the member JSON and overwrite this file to refresh. The live map keeps writing that record; nothing here changes it.

## Every number the page shows, and where it comes from

| Number | Shown as | Source |
|---|---|---|
| 94 | Countries, chip, card, page counter | `data/countries.json` rows (all codes in the Places Been pins, territories and Kosovo included) |
| 249 | Countries denominator | `collections.json` (ISO 3166-1 codes plus Kosovo), as of 7 Oct 2026 |
| 38% | Page counter | 94 / 249, rounded |
| 5, 78, 2 | Lived, Stayed, Layover only | `countries.json` depth, from `source/member-states.json` |
| 9 | Logged, depth not recorded yet | countries with a pin but no state in the member record: AO, AW, BW, CW, FO, HK, JP, LI, OM |
| 470 | Cities | `data/cities.json` |
| 132 | Airports | `data/airports.json` |
| 4 | Ports | `data/ports.json` |
| 70 of 1,273 | UNESCO World Heritage | `data/unesco.json` (52 pins plus 18 from landmark and park pins, marked to confirm); denominator in `collections.json`, as of July 2025 |
| 77 | Landmarks | `data/landmarks.json` |
| 18 of 63 | US national parks | `data/us-national-parks.json` (17 pins plus Zion, moved by `overrides.json`); 63 from `collections.json` |
| 28 | National parks and monuments everywhere | `data/parks-everywhere.json` |
| 16 | Marathons | `data/marathons.json`, from Nancy's list of 7 Oct 2026; four race towns without a pin are marked approximate |
| 14 | Magnus Waffles 🐻‍❄️ | `data/magnus.json`, from the pet's states in the member record |
| 4 of 7, 6 of 7, 5 of 7, 7 of 7 | New 7 Wonders of the World, Seven Natural Wonders, New 7 Wonders of Nature, Continents marathoned | `done` flags in `collections.json` sets_of_seven, each with its pin named in `source` |
| Tromsø, Rothera Research Station, Suva, Lihue | Furthest north, south, east, west | `data/extremes.json`, computed from cities, airports and ports (places you stood; landmarks and parks are excluded) |
| 3 of 3 | Lines crossed | same file: Equator, Arctic Circle (Tromsø), Antarctic Circle (Rothera) |
| 4 of 4 | Hemispheres | same file |
| 7 of 7 | Continents | same file, from the continent of every pin country, Antarctica included |
| Not counted yet | Time zones | placeholder; needs a time-zone boundary dataset |

## Flags for Nancy

- The member record has two countries with no pin: Luxembourg (442) and New Caledonia (540). They are not counted. Add a pin in Places Been and they join on the next export.
- Nine pin countries have no depth in the member record (listed above). They show as logged; mark them Lived, Visited or Layover in the map editor and re-read the record.
- Magnus's record has 14 countries; his pet profile lists 13 (Denmark is the extra one, marked Lived). Data wins; say if the profile should change.
- "Furthest north" is Tromsø, not the Aurora Borealis landmark pin 0.03° further north, because extremes come from places, not sights. Say if you want sights included.

## Checked

Offline at 1440 and 390: every card number equals its data file, depth counts add up to 94, every set's ticks, every extremes item, Magnus layer draws 14 paws, keyboard stamps and extremes work. Screenshots in `reports/evidence/map-2.0/` (`*-cards.png`, `*-sets.png`, `*-ext.png`). Still unchecked here: the OpenFreeMap street tiles.
