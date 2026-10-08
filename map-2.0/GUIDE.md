# The Map 2.0: how to keep it fed

Everything the map shows comes from the files in `map-2.0/`. No code changes needed for new pins or new collections.

## Where the countries come from

The countries layer, the counter and the paw layer read the editor's logged record (Memberstack member JSON, mirrored to the browser), not the data files. Logged-out visitors see `data/owner-record.json`, a copy of the site owner's states; refresh it by re-reading the member JSON into `source/member-states.json` and running the small conversion (see PHASE-5-NOTES). Lived and Stayed make the total; layovers are counted apart. Pins in `data/countries.json` only propose a country until it is logged in the editor.

## Add a pin

1. Open `data/<collection>.json` (for example `data/landmarks.json`).
2. Copy any row and change the fields: name, latitude, longitude, country (two-letter code), year, note (one line), link (a story URL or an official page). Leave `verb` as it is; the collection sets it.
3. If the pin came from a Places Been export, run `python3 map-2.0/build-data.py` instead of editing by hand. A hand-added pin in an export-built file is wiped by the next export, so for hand pins use `data/moments.json` (kept by hand) or ask for an `extra_rows` section in `overrides.json`.
4. Commit, push, and update the commit hash in the Webflow embed.

## Add a whole new collection

1. Add one entry to `collections.json` under `collections`: id, name, shelf (places, wonders, motion, lines or human), verb, denominator (a number or null), as_of, what_counts, caption. Pin shape comes from the shelf; set `pin_shape` to override.
2. Create `data/<id>.json` with the same row shape as the others.
3. Add the id and its count to `data/counts.json`, or re-run `build-data.py` if the rows come from the export.
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
