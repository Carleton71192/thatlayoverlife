# Private inputs (never committed)

Everything in this folder except this README is ignored by git. Put here:

- `tracks/` : Strava GPX exports, Garmin or Apple Health exports, Google Location History JSON. Raw points. They never leave your computer.
- `exclusions.json` : places that must never appear, as circles. Example:

```json
{ "circles": [ { "name": "home", "latitude": 0, "longitude": 0, "km": 6 } ] }
```

Run `python3 map-2.0/build-heat.py`. It writes only `map-2.0/data/heat.json`: coarse hexagons with a 1 to 5 bucket, nothing else. Check the printed summary, then commit `data/heat.json` alone.
