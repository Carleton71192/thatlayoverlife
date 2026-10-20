# The Map 2.0: how to keep it fed

Everything the map shows comes from the files in `map-2.0/`. No code changes needed for new pins or new collections.

## Where the countries come from

Every number on the page is counted live (20 October 2026, B3). The countries card, the counter, the rulebooks and Lines and extremes read the member's saved map (tllStates in the Memberstack member JSON, mirrored to the browser). Cities, airports, US parks and parks everywhere read the logbook (tllLog and tllParks in the same member JSON). The counting functions are the `TLLMapCounts` block at the top of `dist/tll-map-layers.js`, tested in `test/map-live-counts.test.js`. `data/counts.json` and `data/extremes.json` are no longer read.

Logged-out visitors see the site owner's live map from the URL in `data-tll-owner-url` on the map root (a GET that returns tllStates v2). If that attribute is empty or the request fails, they see `data/owner-record.json`, the 7 October copy. Lived and Stayed make places; Antarctica is a place, not a country; layovers are counted apart; pets never count in the member's numbers. Pins in `data/countries.json` only propose a country until it is logged in the editor, and the Places Been pins for cities, airports and parks show only on the owner's map.

## The rulebook whys

Every one of the 250 entries that is not among the 193 UN members has a kind (observer, partial, territory, antarctica) and one plain line in the `WHY` table of the `TLLMapCounts` block, read with `TLLMapCounts.why(id)`. The map shows it under the name in the country card and the keyboard pin list, and lists the record's own places that have one under the rulebooks as "Why the numbers differ". The passport on /the-map shows it through `src/pages/the-map/after-2026-10-20/why-annotate.js` (also `window.__tllWhy(id)`). To change a line, edit the table, keep it under 110 characters with its tail, and run the tests.

## Hide or bring back a list

A list members cannot log yet carries `"hidden_until_loggable": true` in `collections.json`. It is then off the page for everyone (chip, drawer, card, pins) and its data file stays in the repo. Set it to `false` or remove the line to bring the list back.

## Add a pin

1. Open `data/<collection>.json` (for example `data/landmarks.json`).
2. Copy any row and change the fields: name, latitude, longitude, country (two-letter code), year, note (one line), link (a story URL or an official page). Leave `verb` as it is; the collection sets it.
3. If the pin came from a Places Been export, run `python3 map-2.0/build-data.py` instead of editing by hand. A hand-added pin in an export-built file is wiped by the next export, so for hand pins use `data/moments.json` (kept by hand) or ask for an `extra_rows` section in `overrides.json`.
4. Commit, push, and update the commit hash in the Webflow embed.

## Add a whole new collection

1. Add one entry to `collections.json` under `collections`: id, name, shelf (places, wonders, motion, lines or human), verb, denominator (a number or null), as_of, what_counts, caption. Pin shape comes from the shelf; set `pin_shape` to override.
2. Create `data/<id>.json` with the same row shape as the others.
3. Give it a live count source: `"count_from": "logbook"` with a `logbook_count` key, or keep it hidden with `"hidden_until_loggable": true` until members can log it. Pins alone never make a count.
4. Commit, push, update the hash. A new chip and a new card appear.

## Refresh from a Places Been export

1. Export from Places Been as CSV. Save it over `source/places_been_export.csv`.
2. Run `python3 map-2.0/build-data.py`. It rewrites every data file and `counts.json`, re-applies `overrides.json`, and prints the checks (duplicates, same place in two layers, wishlist rows).
3. Read `data/_report.json` for anything flagged. Commit, push, update the hash.

## Refresh the Ground covered layer from Strava, Garmin or Google tracks

1. Put the export files in `map-2.0/source/private/tracks/` (GPX, CSV with lat and lon columns, or Google Location History JSON). This folder never goes to GitHub.
2. Make sure `map-2.0/source/private/exclusions.json` has a circle over home (see the README in that folder). 6 km is a safe default.
3. Run `python3 map-2.0/build-heat.py`. It prints one line: points read, points kept, hexagons written. Only `data/heat.json` changes, and it holds hexagon centers and a 1 to 5 bucket, nothing else.
4. Commit `data/heat.json`, push, update the hash.

## Add a human moment

Open `data/moments.json`, copy the `_example` row into `rows`, fill name, latitude, longitude, country and the one-line note. Commit, push, update the hash. The chip turns on by itself once there is a row.

## Fill the Strava and Polarsteps frames

In `collections.json` under `embeds`, paste the Strava activity id (digits only) or the Polarsteps iframe src. Past trips only. Commit, push, update the hash.

## A flight log

Not a layer yet. Airports already come from Places Been. If you want routes drawn between them, that is a new collection and a new conversation: lines on a map are the one thing the privacy rules watch most closely.

## Change a verb, a denominator, a caption or an "as of" date

Edit `collections.json`. Each list has three captions from the design's caption bank; the first is on the page, swap the order to change it. Numbers in captions are written as `{n}`, `{of}`, `{rest}`, `{pct}` and the split variables, so they fill themselves from the data.

## Tick an item in a hand list (Marathon Majors, SuperHalfs, Viking ring forts, Mountains)

In `collections.json`, find the list's `items`, set the sixth value to `true` and add a short source as the seventh. Run `build-data.py`. The stamp, the chip count and the card follow.
