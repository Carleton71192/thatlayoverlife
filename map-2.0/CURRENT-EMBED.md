# What runs on /the-map today (read from Webflow, 7 October 2026)

There is no single `tll-map-canvas` embed. The map is four pieces:

1. **Site-wide world-map script** (site custom code, shared with the home page and profiles): draws an Equal Earth SVG of every country with d3 and topojson from world-atlas, into the `#tll-map-canvas` div. The div carries a `data-visited` list of ISO numeric codes.
2. **Map page head code**: the public view (Cream land, pins on the four countries with a story, hover names, legend, "Log in to map your own countries" button) and the Memberstack sync for `tllStates`.
3. **Map page footer code**: the member editor (Rose, teal, amber and more per traveler; Lived, Visited, Layover; side panel with search; Magnus as a pet traveler). Saves to localStorage `tllStates` and pushes to Memberstack JSON.
4. **Three embeds**: the OPEN FULL SCREEN button and fullscreen style; the member logbook `#tll-logbook` (parks, cities, airports lists saved to Memberstack); and the share bundle `tll-share-v1` loaded from jsDelivr.

Library: d3 v7 plus topojson-client, a static SVG. No tiles, no zoom, no clustering.
