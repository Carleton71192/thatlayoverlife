# The Map 2.0, Phase 2: the map and the layer switcher

Date: 7 October 2026. Built from the brief and the Design 2.0 map screen. The Claude Design file "TLL Map Layers" could not be read from this session, so where it decides a detail differently, the design wins and I will adjust.

## What is built

- `dist/tll-map-layers.js` and `dist/tll-map-layers.css`: the whole map. Plain JavaScript and CSS, no build step. About 34 KB together.
- `embed/tll-map-layers.embed.html`: the short block to paste into Webflow (about 1 KB). It loads the two files above from jsDelivr, pinned to one commit, so it never grows past Webflow's 10,000-character embed limit.
- `preview/index.html`: a local preview with the same page chrome as /the-map.
- `data/counts.json`: the number on every chip, written by `build-data.py`. If a data file disagrees with it when a layer loads, the data file wins and the chip updates.

## How it behaves

- Canvas: pale sea, Cream land, Rose for every logged country, from the same Natural Earth shapes the current map uses. Antarctica is not drawn (it cannot be in this projection); a small "Antarctica, logged" label sits where it would be.
- Street detail: OpenFreeMap tiles (no key, no account) fade in from zoom 5, so the world view stays brand-first and a city zoom shows real streets.
- Switcher: five shelves, one chip per collection, several on at once, Countries on by default. Each chip shows its count and denominator and is a real button with aria-pressed, visible focus and press feedback. A layer's data file loads only when its chip is first switched on.
- Pins: a different shape per shelf (circle, diamond, triangle, dash, paw) and a different color per shelf, so color is never the only signal. Layers with more than 40 pins cluster until zoom 9; a cluster badge shows the count and a tap zooms into it. Badges are drawn on the device, not fetched as a font, so clusters still work if the tile server is down.
- Card: collection, name, verb and year, country, one-line note, story or official UNESCO link. UNESCO rows added from landmark pins carry a small "Listing to confirm" line until you confirm them.
- Keyboard: a "Browse pins by keyboard" list under the map lists every pin on the switched-on layers with a filter box; picking one flies there and opens its card. Chips, zoom buttons, list and card close button all take focus with a visible ring.
- Motion: chips ease in 160 ms, pins fade in 180 ms and settle with the cluster zoom, no bounce. Under prefers-reduced-motion everything is instant.
- The page's OPEN FULL SCREEN button now puts this block into browser full screen; the counters #tll-map-counter and #tll-map-pct are written from the data (94 / 249 and 38%).
- The logbook, the share bundle and Memberstack are not touched. The old country engine's localStorage record (tllStates) is not read yet; Phase 3 brings depth of visit from it.

## Checked

Offline, with Playwright at 1440 and 390 wide: every chip on and off, counts on every chip equal the rows in each data file (470, 132, 4, 70, 77, 18, 28), 94 countries filled, the keyboard list and card open for a filtered pin, no page errors. Screenshots in `reports/evidence/map-2.0/`. Not checked here, because this container has no route to the tile server: the OpenFreeMap street detail from zoom 5 and the glyph-free cluster badges on a real tile style. Please check both in the local preview.

## Paste-in steps for Webflow (when you are ready; nothing is live yet)

1. Open the /the-map page in the Designer. Add a new Embed element directly below the existing map canvas block (`#tll-map-canvas`). Do not delete anything.
2. Paste the contents of `embed/tll-map-layers.embed.html`. Replace the three `COMMIT` tokens with the commit hash given in the handoff message. Save.
3. Set the old canvas block (`#tll-map-canvas`) and its legend to Display: None. Keep the OPEN FULL SCREEN link, the counters, the logbook and the share embed exactly where they are.
4. Preview in the Designer: the new block should show the switcher and the map, with 94 Rose countries.
5. Publish only after you have looked at it on a phone. Revert is one step: set the old block back to Display: Block and set the new embed to Display: None.

Not yet in the embed, by design: the page head and footer code for the old engine stays until Phase 3 replaces the country layer's reading of tllStates. Both can run side by side because the new block has its own ids and classes (all start with tllm-).
