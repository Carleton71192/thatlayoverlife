#!/usr/bin/env python3
"""Turn raw tracks into coarse hexagons for the Ground covered layer.

Reads  map-2.0/source/private/tracks/*.gpx, *.csv (lat,lon columns) or *.json (Google Location History)
       map-2.0/source/private/exclusions.json  (circles that are never published)
Writes map-2.0/data/heat.json  (hexagon centers and a 1 to 5 bucket; never a point, never a time)

Run:   python3 map-2.0/build-heat.py [--km 25]
"""
import os, sys, json, math, glob, csv, re, collections

HERE = os.path.dirname(os.path.abspath(__file__))
PRIV = os.path.join(HERE, 'source', 'private')
OUT = os.path.join(HERE, 'data', 'heat.json')
KM = 25.0
if '--km' in sys.argv: KM = float(sys.argv[sys.argv.index('--km') + 1])

def read_points():
    pts = []
    for f in glob.glob(os.path.join(PRIV, 'tracks', '*')):
        ext = f.lower().rsplit('.', 1)[-1]
        txt = open(f, encoding='utf-8', errors='ignore').read()
        if ext == 'gpx':
            for m in re.finditer(r'<trkpt[^>]*lat="([-\d.]+)"[^>]*lon="([-\d.]+)"', txt): pts.append((float(m.group(1)), float(m.group(2))))
            for m in re.finditer(r'<trkpt[^>]*lon="([-\d.]+)"[^>]*lat="([-\d.]+)"', txt): pts.append((float(m.group(2)), float(m.group(1))))
        elif ext == 'csv':
            for r in csv.DictReader(txt.splitlines()):
                k = {x.lower(): x for x in r}
                la = r.get(k.get('lat') or k.get('latitude') or ''); lo = r.get(k.get('lon') or k.get('lng') or k.get('longitude') or '')
                try: pts.append((float(la), float(lo)))
                except (TypeError, ValueError): pass
        elif ext == 'json':
            j = json.loads(txt)
            for loc in j.get('locations', []):
                if 'latitudeE7' in loc: pts.append((loc['latitudeE7'] / 1e7, loc['longitudeE7'] / 1e7))
    return pts

def excluded(pts):
    ex = os.path.join(PRIV, 'exclusions.json')
    circles = json.load(open(ex)).get('circles', []) if os.path.exists(ex) else []
    if not circles: print('WARNING: no exclusions.json; nothing is being masked', file=sys.stderr)
    def far(p):
        for c in circles:
            d = haversine(p[0], p[1], c['latitude'], c['longitude'])
            if d <= float(c.get('km', 6)): return False
        return True
    return [p for p in pts if far(p)], len(circles)

def haversine(a1, o1, a2, o2):
    R = 6371.0; p1, p2 = math.radians(a1), math.radians(a2); dp = p2 - p1; dl = math.radians(o2 - o1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))

# Flat-top hexagon grid on a simple equirectangular plane scaled by latitude. Coarse by design.
def hex_cell(lat, lng, km):
    size = km / 2.0 / 111.32  # circumradius in degrees of latitude
    x = lng * math.cos(math.radians(lat)); y = lat
    q = (2.0 / 3 * x) / size; r = (-1.0 / 3 * x + math.sqrt(3) / 3 * y) / size
    return hex_round(q, r)

def hex_round(q, r):
    x, z = q, r; y = -x - z
    rx, ry, rz = round(x), round(y), round(z)
    dx, dy, dz = abs(rx - x), abs(ry - y), abs(rz - z)
    if dx > dy and dx > dz: rx = -ry - rz
    elif dy > dz: ry = -rx - rz
    else: rz = -rx - ry
    return int(rx), int(rz)

def cell_center(q, r, km, lat_hint):
    size = km / 2.0 / 111.32
    x = size * 1.5 * q; y = size * (math.sqrt(3) / 2 * q + math.sqrt(3) * r)
    lat = y; lng = x / max(0.2, math.cos(math.radians(lat)))
    return round(lat, 3), round(lng, 3)

def main():
    pts = read_points()
    if not pts: print('No track files found in', os.path.join(PRIV, 'tracks')); return
    kept, ncirc = excluded(pts)
    cells = collections.Counter()
    for la, lo in kept:
        if abs(la) > 85: continue
        cells[hex_cell(la, lo, KM)] += 1
    # buckets by quantile so the map shows relative coverage, not raw counts
    vals = sorted(cells.values()); n = len(vals)
    def bucket(v):
        if n == 0: return 1
        rank = vals.index(v) / max(1, n - 1)
        return 1 + min(4, int(rank * 5))
    rows = []
    for (q, r), v in cells.items():
        la, lo = cell_center(q, r, KM, 0)
        rows.append({'latitude': la, 'longitude': lo, 'bucket': bucket(v)})
    rows.sort(key=lambda d: (d['latitude'], d['longitude']))
    json.dump({'collection': 'heat', 'count': len(rows), 'cell_km': KM, 'generated': 'build-heat.py',
               '_about': 'Coarse hexagons from private tracks. Center and a 1 to 5 bucket only.', 'rows': rows},
              open(OUT, 'w', encoding='utf-8'), indent=1)
    print('points read %d, kept after %d exclusion circle(s) %d, hexagons written %d (%.0f km)' % (len(pts), ncirc, len(kept), len(rows), KM))

if __name__ == '__main__':
    main()
