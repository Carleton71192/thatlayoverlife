#!/usr/bin/env python3
"""Build the layer data files for The Map 2.0 from a Places Been export.

Run:  python3 map-2.0/build-data.py
Reads  map-2.0/source/places_been_export.csv
Writes map-2.0/data/<layer>.json, map-2.0/data/wishlist.json, map-2.0/data/_report.json

Every row keeps the same fields: name, collection, latitude, longitude, country, verb,
year, note, link, depth, source. The verb comes from collections.json, never from here.
Year, note and link are empty until Nancy fills them in (the export has none).
"""
import csv, json, collections, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'source', 'places_been_export.csv')
OUT = os.path.join(HERE, 'data')
CFG = json.load(open(os.path.join(HERE, 'collections.json'), encoding='utf-8'))
COLL = {c['id']: c for c in CFG['collections']}

# Places Been layer/type -> collection id(s). One pin can feed two collections
# (a US national park is also in "parks and monuments everywhere").
def collections_for(layer, typ, cc):
    if layer == 'Cities': return ['cities']
    if layer == 'Airports': return ['airports']
    if layer == 'Landmarks': return ['landmarks']
    if layer == 'UNESCO World Heritage': return ['unesco']
    if layer == 'Ports': return ['ports']
    if layer == 'National parks and monuments':
        out = ['parks-everywhere']
        if typ == 'National park' and cc == 'US': out.insert(0, 'us-national-parks')
        return out
    return []

# ISO 3166-1 alpha-2 -> (name, continent). Only the codes in the export plus a few.
COUNTRY = {
 'AD':('Andorra','Europe'),'AE':('United Arab Emirates','Asia'),'AL':('Albania','Europe'),'AO':('Angola','Africa'),
 'AQ':('Antarctica','Antarctica'),'AR':('Argentina','South America'),'AT':('Austria','Europe'),'AU':('Australia','Oceania'),
 'AW':('Aruba','North America'),'BA':('Bosnia and Herzegovina','Europe'),'BE':('Belgium','Europe'),'BG':('Bulgaria','Europe'),
 'BO':('Bolivia','South America'),'BR':('Brazil','South America'),'BW':('Botswana','Africa'),'BZ':('Belize','North America'),
 'CA':('Canada','North America'),'CH':('Switzerland','Europe'),'CL':('Chile','South America'),'CO':('Colombia','South America'),
 'CR':('Costa Rica','North America'),'CW':('Curaçao','North America'),'CY':('Cyprus','Europe'),'CZ':('Czechia','Europe'),
 'DE':('Germany','Europe'),'DK':('Denmark','Europe'),'DO':('Dominican Republic','North America'),'EC':('Ecuador','South America'),
 'EG':('Egypt','Africa'),'ES':('Spain','Europe'),'FI':('Finland','Europe'),'FJ':('Fiji','Oceania'),'FO':('Faroe Islands','Europe'),
 'FR':('France','Europe'),'GB':('United Kingdom','Europe'),'GH':('Ghana','Africa'),'GR':('Greece','Europe'),'GT':('Guatemala','North America'),
 'HK':('Hong Kong','Asia'),'HN':('Honduras','North America'),'HR':('Croatia','Europe'),'HT':('Haiti','North America'),'HU':('Hungary','Europe'),
 'ID':('Indonesia','Asia'),'IE':('Ireland','Europe'),'IN':('India','Asia'),'IS':('Iceland','Europe'),'IT':('Italy','Europe'),
 'JM':('Jamaica','North America'),'JP':('Japan','Asia'),'KH':('Cambodia','Asia'),'KZ':('Kazakhstan','Asia'),'LA':('Laos','Asia'),
 'LI':('Liechtenstein','Europe'),'LS':('Lesotho','Africa'),'LT':('Lithuania','Europe'),'LV':('Latvia','Europe'),'MA':('Morocco','Africa'),
 'MC':('Monaco','Europe'),'ME':('Montenegro','Europe'),'MK':('North Macedonia','Europe'),'MT':('Malta','Europe'),'MX':('Mexico','North America'),
 'MY':('Malaysia','Asia'),'NL':('Netherlands','Europe'),'NO':('Norway','Europe'),'NP':('Nepal','Asia'),'NZ':('New Zealand','Oceania'),
 'OM':('Oman','Asia'),'PA':('Panama','North America'),'PE':('Peru','South America'),'PH':('Philippines','Asia'),'PL':('Poland','Europe'),
 'PT':('Portugal','Europe'),'PY':('Paraguay','South America'),'QA':('Qatar','Asia'),'RS':('Serbia','Europe'),'SE':('Sweden','Europe'),
 'SG':('Singapore','Asia'),'SI':('Slovenia','Europe'),'SK':('Slovakia','Europe'),'SV':('El Salvador','North America'),'SZ':('Eswatini','Africa'),
 'TH':('Thailand','Asia'),'TR':('Türkiye','Asia'),'TW':('Taiwan','Asia'),'TZ':('Tanzania','Africa'),'US':('United States','North America'),
 'UY':('Uruguay','South America'),'VN':('Vietnam','Asia'),'XK':('Kosovo','Europe'),'ZA':('South Africa','Africa'),'ZM':('Zambia','Africa'),
 'ZW':('Zimbabwe','Africa'),
}
# Codes that are territories or special regions, not UN member or observer states.
NOT_A_COUNTRY = {'AQ','AW','CW','FO','HK','TW','XK'}

def row(r, coll, extra=None):
    d = {
        'name': r['name'].strip(),
        'collection': coll,
        'latitude': round(float(r['lat']), 5),
        'longitude': round(float(r['lng']), 5),
        'country': r['country_code'],
        'verb': COLL[coll]['verb'] if coll in COLL else 'Not yet',
        'year': '',
        'note': '',
        'link': '',
        'depth': '',
        'source': 'places_been:' + r['placesbeen_id'],
        'type': r['type'],
    }
    if extra: d.update(extra)
    return d

def main():
    rows = list(csv.DictReader(open(SRC, encoding='utf-8')))
    been = [r for r in rows if r['status'] == 'Been']
    wish = [r for r in rows if r['status'] != 'Been']
    layers = collections.defaultdict(list)
    for r in been:
        for c in collections_for(r['layer'], r['type'], r['country_code']):
            layers[c].append(row(r, c))

    # Countries: a candidate list derived from pins. The live member map (tllStates) is the
    # real record of depth (lived / stayed / layover). See the report flag.
    seen = {}
    for r in been:
        cc = r['country_code']
        seen.setdefault(cc, []).append(r)
    countries = []
    for cc in sorted(seen):
        name, cont = COUNTRY.get(cc, (cc, ''))
        pins = seen[cc]
        lat = sum(float(p['lat']) for p in pins) / len(pins)
        lng = sum(float(p['lng']) for p in pins) / len(pins)
        countries.append({
            'name': name, 'collection': 'countries', 'latitude': round(lat, 3), 'longitude': round(lng, 3),
            'country': cc, 'verb': COLL['countries']['verb'], 'year': '', 'note': '', 'link': '',
            'depth': '', 'source': 'places_been:derived from %d pins' % len(pins),
            'continent': cont, 'un_member_or_observer': cc not in NOT_A_COUNTRY,
            'pin_count': len(pins),
        })
    layers['countries'] = countries
    layers['magnus'] = []  # 🐻‍❄️ No Magnus pins in the export yet. Add rows by hand or from his own export.

    os.makedirs(OUT, exist_ok=True)
    for c in COLL:
        data = layers.get(c, [])
        data.sort(key=lambda d: (d['country'], d['name']))
        json.dump({'collection': c, 'count': len(data), 'generated_from': 'places_been_export.csv', 'rows': data},
                  open(os.path.join(OUT, c + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    wishlist = [row(r, 'wishlist') for r in wish]
    json.dump({'collection': 'wishlist', 'count': len(wishlist), 'rows': wishlist},
              open(os.path.join(OUT, 'wishlist.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    # ---- Checks for the report ----
    rep = {}
    rep['rows_total'] = len(rows); rep['been'] = len(been); rep['wishlist'] = len(wish)
    rep['also_wishlist_but_been'] = [r['name'] for r in been if r['also_wishlist'] == 'True']
    rep['counts'] = {c: len(layers[c]) for c in COLL}
    rep['countries_from_pins'] = len(countries)
    rep['countries_un_only'] = sum(1 for c in countries if c['un_member_or_observer'])
    rep['territories_in_pins'] = sorted(cc for cc in seen if cc in NOT_A_COUNTRY)
    # same name in two layers
    byname = collections.defaultdict(list)
    for r in been: byname[re.sub(r'\W+', ' ', r['name'].lower()).strip()].append((r['layer'], r['type'], r['country_code']))
    rep['same_name_two_layers'] = {n: v for n, v in byname.items() if len({x[0] for x in v}) > 1}
    rep['same_name_same_layer'] = {n: v for n, v in byname.items() if len(v) > 1 and len({x[0] for x in v}) == 1}
    # same spot (within ~1 km) across layers
    grid = collections.defaultdict(list)
    for r in been: grid[(round(float(r['lat']), 2), round(float(r['lng']), 2))].append((r['layer'], r['name']))
    rep['same_spot_two_layers'] = [v for v in grid.values() if len({x[0] for x in v}) > 1]
    rep['beyond_arctic_circle'] = [(r['name'], float(r['lat'])) for r in been if float(r['lat']) > 66.5633]
    rep['beyond_antarctic_circle'] = [(r['name'], float(r['lat'])) for r in been if float(r['lat']) < -66.5633]
    rep['extremes_been'] = {
        'north': max(been, key=lambda r: float(r['lat']))['name'],
        'south': min(been, key=lambda r: float(r['lat']))['name'],
        'east': max(been, key=lambda r: float(r['lng']))['name'],
        'west': min(been, key=lambda r: float(r['lng']))['name'],
    }
    rep['hemispheres'] = sorted({('N' if float(r['lat']) >= 0 else 'S') for r in been} | {('E' if float(r['lng']) >= 0 else 'W') for r in been})
    rep['continents'] = sorted({COUNTRY.get(r['country_code'], ('', ''))[1] for r in been} - {''})
    json.dump(rep, open(os.path.join(OUT, '_report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps(rep, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
