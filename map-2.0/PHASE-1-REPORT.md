# The Map 2.0, Phase 1: data

> Revised 7 October 2026 after Nancy's decisions, see `overrides.json`. Countries count every code (94). Zion is a park (US parks 18 of 63). 18 UNESCO properties added from landmark and park pins (UNESCO 70, each marked to confirm on whc.unesco.org). Table Mountain ticked. Marathons still need Nancy's race list. Data hosting: static JSON in this repo through jsDelivr.

Date: 7 October 2026. Source: `source/places_been_export.csv` (766 rows, the GeoJSON is the same 766 pins). Built by `build-data.py`; the numbers below are read from `data/_report.json`, not typed.

## What is in the folder

| File | What it is |
|---|---|
| `collections.json` | The only file to edit to add a collection: name, shelf, verb, denominator, as-of date, what-counts rule, pin shape. Also the four sets of seven. |
| `data/countries.json` … `data/ports.json` | One file per layer, same fields in every row: name, collection, latitude, longitude, country, verb, year, note, link, depth, source. |
| `data/wishlist.json` | The 4 wishlist-only pins, kept out of every layer. |
| `data/magnus.json` | Empty. The export has no Magnus Waffles 🐻‍❄️ pins. |
| `data/_report.json` | Every check below, machine-readable. |
| `build-data.py` | Re-run after a new Places Been export. No build step for the site; this only refreshes data files. |

## Counts from the data

| Layer | Rows | Prompt said |
|---|---|---|
| Countries (from pins) | 94 codes, of which 87 are UN members or observers | 87 stated, 88 on the live site |
| Cities | 470 | 470 |
| Airports | 132 | 132 |
| US national parks | 17 of 63 | 17 of 63 |
| National parks and monuments everywhere | 27 | 27 |
| UNESCO World Heritage | 52 of 1,273 | 52 of 1,273 |
| Landmarks | 77 | 77 |
| Ports | 4 | 4 |
| Wishlist only | 4 | 4 |

The 7 non-country codes in the pins: Antarctica, Aruba, Curaçao, Faroe Islands, Hong Kong, Taiwan, Kosovo. Count those and you get 94. Count only UN members and observers and you get 87, which is the number you state. Kosovo is the swing between 87 and 88: it is not a UN member, and most "every country" counters still list it. Your call.

## Decisions for Nancy (not guessed)

1. **Country count.** 87 (UN rule) or 88 (UN plus Kosovo) or 94 (every code in the pins, territories included). The countries layer should also come from your member map record (tllStates: lived, visited, layover), not from pins, because pins cannot tell "Lived" from "Layover only". Phase 2 will read tllStates for depth and use the pin-derived list only to cross-check.
2. **Zion.** It is a landmark pin, not a park pin. Move it to the parks layer and US national parks becomes 18 of 63. Same question for Grand Canyon (a city pin and a landmark pin; the park pin exists, so parks are fine).
3. **Landmarks that are inscribed UNESCO sites but missing from your UNESCO layer.** Candidates from your landmark pins, to confirm against whc.unesco.org before any count changes: Eiffel Tower, Louvre, Notre-Dame (Paris, Banks of the Seine), Statue of Liberty, Tower of London, Westminster Abbey and Big Ben (Palace of Westminster), Edinburgh Castle (Old and New Towns of Edinburgh), Hungarian Parliament (Budapest), Leaning Tower of Pisa (Piazza del Duomo), Giza Pyramids and Great Sphinx (Memphis and its Necropolis), Chichen Itza, Neuschwanstein Castle (inscribed 2025), Perito Moreno and Fitz Roy (Los Glaciares), Victoria Falls (Mosi-oa-Tunya), Bay of Kotor, Grand Canyon, Franz Josef and Fox Glacier and Aoraki/Mount Cook (Te Wahipounamu), Carlsbad Caverns, Everglades, Olympic. If all confirm, UNESCO rises well above 52. I have not changed the count.
4. **Seven Natural Wonders.** Which list? I used the usual CNN 1997 list and ticked five from your pins; Parícutin is the one you have not pinned. Table Mountain (New 7 Wonders of Nature) has no pin, though Cape Town does.
5. **Continents marathoned.** No race data in the export. Send a list (name, city, country, year) and I will add it as a collection.
6. **Verbs.** I filled honest placeholders (logged, connected through, docked at, ticked, seen, walked, was here). Every caption and what-counts line is marked `[COPY NEEDED]`.

## Rows that look wrong or need a look

- **One place in two layers (same spot):** Yellowstone is in three (landmark, park, UNESCO). Arches, Yosemite, Mesa Verde, Teide, Plitvice, Galápagos, Great Barrier Reef, Taj Mahal, Sydney Opera House, Acropolis, Stonehenge, Tikal, Abu Simbel each sit in two. This is fine for a layered map (each layer counts its own thing) and the card counts are per layer, so nothing double-counts. Say if you want any of them to live in one layer only.
- **Same name, different places (all real):** Santa Cruz (Aruba and California), Vancouver (BC and Washington), Toledo (Spain and Oregon), Glasgow (Scotland and Oregon), Panama City (Panama and Florida), Portland (Oregon and Maine), Albany, Ashland, Dallas, Lafayette, Troy (two US each). La Paz is a Bolivian city, a Mexican city and a Mexican port. Kept all.
- **Victoria Falls:** the city pin is in Zimbabwe, the landmark pin in Zambia. Both are correct (the falls straddle the border).
- **Been plus wishlist:** Ushuaia and Saint-Tropez are marked Been and also wishlist. They stay in the been layers.
- **Crater Lakes National Park, AU** next to **Crater Lake National Park, US**: both real, not a typo.
- **No pin is missing a country code. No pin has a blank name.**

## Privacy check

Copenhagen, Hvidovre and Rødovre are city-level pins, which is what the rules allow. No raw tracks or photo points are in these files. The wishlist file is the only "future" data and it is not loaded by any layer.

## Lines and extremes, computed from been pins (for Phase 3)

- Furthest north: Aurora Borealis pin (69.68°). Furthest south: Rothera Research Station (−67.57°). Furthest east: Suva (178.44°). Furthest west: Lihue (−159.37°).
- Arctic Circle crossed (Tromsø, Narvik, aurora pin). Antarctic Circle crossed (Rothera). Equator crossed.
- Hemispheres: 4 of 4. Continents: 7 of 7.
- Time zones: the export has no time-zone field and computing offsets from coordinates needs a boundary dataset. Phase 3 will show a clearly marked placeholder unless you want that dataset loaded.
