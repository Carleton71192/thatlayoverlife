# The Map 2.0: how to keep it fed

Everything the map shows comes from the files in `map-2.0/`. No code changes needed for new pins or new collections.

## Add a pin

1. Open `data/<collection>.json` (for example `data/landmarks.json`).
2. Copy any row and change the fields: name, latitude, longitude, country (two-letter code), year, note (one line), link (a story URL or an official page). Leave `verb` as it is; the collection sets it.
3. Run `python3 map-2.0/build-data.py` only if the pin came from a Places Been export. For a hand-added pin, instead add it to `overrides.json` under `extra_rows` so the next export does not wipe it. (Phase 3 adds that section.)
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

## Refresh from Strava or a flight log

Not wired yet (Phase 4). The rule stays: tracks and photo points become coarse hexagons or city-level counts before they go anywhere near a published file. Nothing near Copenhagen SV is ever included.

## Change a verb, a denominator or an "as of" date

Edit `collections.json`. The card and the chip read it live.
