# The Map 2.0, Phase 4: optional layers

Date: 7 October 2026. All three pieces are wired and tested with sample data that was never written to the repo. The live files are empty until you supply the inputs, and every empty piece shows a marked placeholder instead of an invented number.

## 1. Human moments

- A new collection on The human layer: square pins, verb "happened", one line of text each.
- Data: `data/moments.json`, kept by hand. It holds an `_example` row to copy. `build-data.py` never rewrites it.
- The chip stays greyed out while the file has no rows. Add a row, push, update the embed hash, and the chip wakes up with the count.

## 2. Ground covered (the heat layer)

- A new collection on On foot and in motion: flat-top hexagons about 25 km across, kraft colored, opacity by a 1 to 5 bucket. Hover names the bucket in words (once, a few times, often, very often, home turf). No raw lines or points are ever drawn or shipped.
- Converter: `build-heat.py`. It reads GPX, CSV or Google Location History files from `source/private/tracks/`, drops every point inside the circles in `source/private/exclusions.json`, bins the rest into hexagons and writes only cell centers and buckets to `data/heat.json`.
- Privacy: `source/private/` is in `.gitignore` (only its README is tracked), so tracks and the exclusion circles never reach GitHub or jsDelivr. Checked with a synthetic track that looped around a fake home point inside a 6 km exclusion circle: 300 of 500 points dropped, no hexagon near that point, and the output file carries only latitude, longitude and bucket.
- To feed it: put your exports in `source/private/tracks/`, write `exclusions.json` with a circle over Copenhagen SV (6 km is a safe default), run `python3 map-2.0/build-heat.py`, read its one-line summary, commit `data/heat.json` only.

## 3. Framed Strava and Polarsteps embeds

- An "In motion" section with two brand frames: label row (source, your caption) and the official embed inside. Both frames read from `collections.json` under `embeds`.
- Strava: paste the activity id (digits from the activity URL) into `strava_activity_id`. The page then loads Strava's own embed script, which is the official, keyless way. Only an activity you have set to public will render.
- Polarsteps: open the trip, Share, Embed, copy the iframe `src` into `src`. Only `https://www.polarsteps.com/...` addresses are accepted; anything else shows the placeholder.
- Until filled, each frame shows a striped placeholder with the instruction. No tokens, keys or feeds anywhere in the page code.

## Numbers added to the page

| Number | Source |
|---|---|
| Human moments count | rows in `data/moments.json` (0 today) |
| Ground covered count | hexagons in `data/heat.json` (0 today); the card says "hexagons covered" so the unit is plain |

## Checked

Offline at 1440 and 390 with sample heat and moment rows served only to the test: both chips switch on and off with the right counts, hexagons draw and hover, moment pins open their card, both empty frames render; then again without sample data: every real count unchanged, the two new chips disabled, frames in placeholder state. Screenshots: `*-heat-sample-data.png` (sample data, labeled as such) and `*-frames.png`. Not checked: a live Strava or Polarsteps embed, since neither id is filled.
