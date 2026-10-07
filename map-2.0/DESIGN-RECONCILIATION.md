# The Map 2.0 against the Claude Design file "TLL Map Layers" (7 October 2026)

Design file received as `tll-map-layers-handoff-2026-10-07.zip` (TLL Map Layers.dc.html, tll-map-data.js, support.js). Rule: the design wins on how things look; the data files win on Nancy's own counts; Nancy's decisions of today win over both.

## Taken from the design, now in the build

- Dark canvas: sphere #10121C, graticule #1A1D2E, land off #1B1E2E, not-yet #2E2D33 (the "Cream, dimmed" prop; `data-tll-not-yet="full"` gives #E9E1D3).
- Depth fills: Lived Rose #F0507A with a Cream edge, Stayed deep Rose #9C3A5C, Layover only as the Rose diagonal hatch on #3B1A2A. Legend on the Countries card with Not yet counted from the denominator.
- Five shelves, 35 lists, one shape and one color per shelf: Places circle Cream, Wonders diamond Teal, Motion triangle Rose, Lines square Cream, Human ring, Magnus paw Teal. Not-yet pins draw as a dashed outline of the same shape. Rule 1 order (heat, fills, Magnus outlines, pins), Rule 2 quiet cities (dots at 1.5 px and 45 percent past three point layers, other pins 20 percent smaller), Rule 4 no labels.
- Switcher: "LAYERS · N ON · 35 LISTS" bar with the on-chips, a Layers drawer with the shelves (200 ms transform), a bottom sheet on phones with a Done button and 44 px targets. Chip states: default hairline, hover teal edge 160 ms, active Cream with a check, empty dashed and still tappable. Counts read "18/63".
- The receipts: one card per list with mono label, source badge ("FROM PLACES BEEN · SYNCED 6 OCTOBER 2026", "FROM STRAVA · NOT CONNECTED", hand lists carry none), big number, "of X", italic verb, split line, caption, "What counts" rule, as-of line. Zero cards read "0 of X. The list is ready when you are."
- Caption bank: all three options per list are in `collections.json`; option 1 is on the page. Numbers inside captions are templates filled from the data, so "17 of 63" became "18 of 63" and "52 of 1,273" became "70 of 1,273" without anyone retyping.
- Many ways to count: 94 of 249 (Nancy's rulebook), 87 of 195, 87 of 193, OPEN of 330.
- Sets of seven as stamps with three-letter codes, done filled Rose, not-yet dashed, selected teal ring, Giza honorary outside the New 7 row, receipt line below ("STOOD AT · YEAR NOT LOGGED" or "NOT YET · OPEN SLOT").
- Lines strip: number first, label second, source third. Equator, polar circles N S, 7/7 lines crossed, 4/4 hemispheres, ?/38 time zones as an open slot, 7/7 continents "Run on all seven".
- Popover: list eyebrow, Playfair name, "VERB · YEAR NOT LOGGED", one line, "Read the X story →" or "No story filed from here yet."
- Empty states in voice, all of section 10, keyed in `collections.json` under `empty_copy`.
- Motion spec: chips 160 ms cubic-bezier(.2,.8,.2,1), pins fade and settle 3 px over 180 ms, drawer 200 ms transform only, stamps lift 2 px and press to .97, reduced motion instant.
- Heat hexes about 400 km across in Teal, opacity by bucket, "fewer to more" key. Strava frame says "Route hidden near home"; Polarsteps frame gets "Open trip →".
- Extra lists from the design, with data where it exists: Decade Volcanoes 3/16 (Etna, Teide, Rainier from pins), Great Spa Towns 1/11 (Bath), Danish heritage 4 (UNESCO rows in DK), Viking ring forts 0/5, Wine Capitals 0/11, Marathon Majors 1/7 (Berlin 2021 from the race list; the design said 0), SuperHalfs 1/6 (Copenhagen Half from the running log; the design said 0), Mountains 3 (Toubkal, Langley, St. Helens from the log; Mt. Hood left out until confirmed), Auroras 1, Flight arcs, Trains and ferries, Bridges, Metros, Bathing traditions, Weddings abroad, Friends visited, Beds by type as open slots.

## Where the data or Nancy's decisions overrule the design's numbers

| Design says | Page shows | Why |
|---|---|---|
| Countries 87 of 195 | 94 of 249 | Nancy, 7 Oct: include territories and Kosovo. The 87/195 reading sits in Many ways to count. |
| US parks 17 of 63 | 18 of 63 | Nancy, 7 Oct: Zion is a park. |
| UNESCO 52 of 1,273 | 70 of 1,273 | Nancy, 7 Oct: the full list; 18 added from landmark and park pins, each marked to confirm. |
| Wonders of Nature 4 of 7 | 5 of 7 | Nancy, 7 Oct: Table Mountain ticked. |
| Magnus 13 | 14 | The member record has 14 (Denmark included). |
| Layover only 6 (AO, DO, HK, JP, OM, TW), proposed | 2 recorded (DO, TW) plus 4 proposed (AO, HK, JP, OM) | The member record decides where it has a value; the design's airport-only rule fills the gaps as proposals, shown as "proposed" on hover and in the card. The Countries card counts proposals in (6), as the design does. |
| Stories in BG, SE, BR, DK | Stories in GH, MX, ME, CL | The live public map lists those four published stories. The design's four are not on the live list. Nancy to say which is right. |
| Marathon Majors 0, SuperHalfs 0 | 1 and 1 | From the race list and running log Nancy sent today. |
| Furthest north: the Aurora Borealis pin | Tromsø | Extremes come from cities, airports and ports, not sights; same latitude to a tenth of a degree. |

## Not built from the design, on purpose

- Turn 2 (screens 2a, 2b, 2c): per-traveler opt-in, Only me / Public per list, onboarding step and the public page that leaves no trace. This is a member feature (one row per traveler per list in the member record) and belongs with the Memberstack work, not in this embed. Flagged as its own job in STATUS.
- Natural Earth projection: the design draws a static d3 map. The brief asks for zoom into cities with street detail, which needs MapLibre and Mercator. Everything else about the look carries over; the outline shape of the world is the one difference.
- Clustering: the brief asked for it, the design answers density with small city dots and Rule 2 instead. Design wins; clustering is out.
