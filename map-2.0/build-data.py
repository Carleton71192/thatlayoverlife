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
OVR = json.load(open(os.path.join(HERE, 'overrides.json'), encoding='utf-8'))
MS_PATH = os.path.join(HERE, 'source', 'member-states.json')
MS = json.load(open(MS_PATH, encoding='utf-8')) if os.path.exists(MS_PATH) else {'me': {}, 'magnus': {}}
DEPTH = {'lived': 'Lived', 'visited': 'Stayed', 'layover': 'Layover only'}

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
# ISO 3166-1 alpha-2 -> numeric, as used by the world-atlas country shapes. Kosovo has no number and is matched by name.
A2N = {"AD":"020","AE":"784","AL":"008","AO":"024","AQ":"010","AR":"032","AT":"040","AU":"036","AW":"533","BA":"070","BE":"056","BG":"100","BO":"068","BR":"076","BW":"072","BZ":"084","CA":"124","CH":"756","CL":"152","CO":"170","CR":"188","CW":"531","CY":"196","CZ":"203","DE":"276","DK":"208","DO":"214","EC":"218","EG":"818","ES":"724","FI":"246","FJ":"242","FO":"234","FR":"250","GB":"826","GH":"288","GR":"300","GT":"320","HK":"344","HN":"340","HR":"191","HT":"332","HU":"348","ID":"360","IE":"372","IN":"356","IS":"352","IT":"380","JM":"388","JP":"392","KH":"116","KZ":"398","LA":"418","LI":"438","LS":"426","LT":"440","LV":"428","MA":"504","MC":"492","ME":"499","MK":"807","MT":"470","MX":"484","MY":"458","NL":"528","NO":"578","NP":"524","NZ":"554","OM":"512","PA":"591","PE":"604","PH":"608","PL":"616","PT":"620","PY":"600","QA":"634","RS":"688","SE":"752","SG":"702","SI":"705","SK":"703","SV":"222","SZ":"748","TH":"764","TR":"792","TW":"158","TZ":"834","US":"840","UY":"858","VN":"704","ZA":"710","ZM":"894","ZW":"716"}
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

    # ---- Hand decisions from overrides.json ----
    def find(layer_rows, name):
        for d in layer_rows:
            if d['name'].lower() == name.lower(): return d
    for mv in OVR.get('copy_to_collections', []):
        src = find(layers[mv['from']], mv['match_name'])
        if not src: print('override: no pin named', mv['match_name'], file=sys.stderr); continue
        for to in mv['to']:
            if find(layers[to], mv['match_name']): continue
            layers[to].append(dict(src, collection=to, verb=COLL[to]['verb'], type=mv.get('type', src['type']), source=src['source'] + ' (moved by overrides.json)'))
    uo = OVR.get('unesco_from_landmarks', {})
    have_ids = set()
    for u in uo.get('rows', []):
        src = find(layers[u.get('from', 'landmarks')], u['match_name'])
        if not src: print('override: no pin named', u['match_name'], file=sys.stderr); continue
        if find(layers['unesco'], u['unesco_name']): continue
        if uo.get('dedupe_by_whc_id') and u.get('whc_id') and u['whc_id'] in have_ids: continue
        if u.get('whc_id'): have_ids.add(u['whc_id'])
        layers['unesco'].append(dict(src, name=u['unesco_name'], collection='unesco', verb=COLL['unesco']['verb'],
            type='UNESCO (from landmark pin)', link=('https://whc.unesco.org/en/list/%d' % u['whc_id']) if u.get('whc_id') else '',
            note='', confirm=True, source=src['source'] + ' (added by overrides.json)'))
    # Every UNESCO row gets an official link: the list page search when no id is known.
    for d in layers['unesco']:
        if not d['link']: d['link'] = 'https://whc.unesco.org/en/list/?search=' + d['name'].replace(' ', '+')

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
            'iso_n3': A2N.get(cc, ''), 'continent': cont, 'un_member_or_observer': cc not in NOT_A_COUNTRY,
            'pin_count': len(pins),
        })
    n3_to_a2 = {v: k for k, v in A2N.items()}; n3_to_a2['XK'] = 'XK'
    for c in countries:
        st = MS['me'].get(c['iso_n3'] or c['country']) or OVR.get('depth', {}).get(c['country'])
        c['depth'] = DEPTH.get(st, '')
    layers['countries'] = countries
    # 🐻‍❄️ Magnus Waffles: one pin per country in his record, placed at the centroid of the human pins there.
    by_a2 = {c['country']: c for c in countries}
    mag = []
    for n3, st in MS.get('magnus', {}).items():
        a2 = n3_to_a2.get(n3); c = by_a2.get(a2)
        if not c: print('magnus: no pins for', n3, file=sys.stderr); continue
        mag.append({'name': c['name'], 'collection': 'magnus', 'latitude': c['latitude'], 'longitude': c['longitude'], 'country': a2,
                    'verb': COLL['magnus']['verb'], 'year': '', 'note': '', 'link': '', 'depth': DEPTH.get(st, ''), 'source': 'member record (tllStates)', 'type': 'Country'})
    layers['magnus'] = mag

    os.makedirs(OUT, exist_ok=True)
    # Proposed depth (design 1g, "Nancy to confirm"): a logged country whose only pins are airports reads as Layover only;
    # one with a city pin reads as Stayed. Never overrides a depth from the member record.
    for c in countries:
        if c['depth']: continue
        kinds = {r['layer'] for r in seen[c['country']]}
        c['depth_proposed'] = 'Layover only' if kinds <= {'Airports'} else 'Stayed'
    # Published stories by country, from source/stories.json (the live site's list); gives the country card its link.
    st_path = os.path.join(HERE, 'source', 'stories.json')
    stories = json.load(open(st_path, encoding='utf-8')).get('stories', []) if os.path.exists(st_path) else []
    for c in countries:
        mine = [st for st in stories if c['country'] in st.get('countries', [])]
        if mine:
            c['link'] = '/stories/' + mine[0]['slug']; c['story'] = mine[0]['name']; c['stories'] = len(mine)
            c['story_list'] = [{'name': st['name'], 'url': '/stories/' + st['slug']} for st in mine]

    # ---- Computed and hand-listed collections from collections.json ----
    all_pins = []
    for cid in ('cities', 'airports', 'ports', 'landmarks', 'unesco', 'parks-everywhere'):
        all_pins += layers.get(cid, [])
    for c in CFG['collections']:
        cid = c['id']
        if c.get('computed') == 'pins_named':
            rows = [dict(r, collection=cid, verb=c['verb']) for r in all_pins if r['name'] in c.get('match', [])]
            seen_n = set(); layers[cid] = [r for r in rows if not (r['name'] in seen_n or seen_n.add(r['name']))]
        elif c.get('computed') == 'unesco_country':
            layers[cid] = [dict(r, collection=cid, verb=c['verb']) for r in layers.get('unesco', []) if r['country'] in c.get('match', [])]
        elif c.get('set_of'):
            st = [x for x in CFG['sets_of_seven'] if x['id'] == c['set_of']][0]
            items = list(st['items']) + ([st['honorary']] if st.get('honorary') else [])
            layers[cid] = [{'name': it['name'], 'collection': cid, 'latitude': it.get('latitude'), 'longitude': it.get('longitude'), 'country': it.get('country', ''),
                            'verb': c['verb'], 'year': '', 'note': '', 'link': '', 'depth': '', 'done': bool(it.get('done')), 'code': it.get('code', ''),
                            'honorary': it is st.get('honorary'), 'source': it.get('source', 'sets_of_seven')} for it in items]
        elif isinstance(c.get('items'), list):
            layers[cid] = [{'name': it[1], 'collection': cid, 'latitude': it[2], 'longitude': it[3], 'country': it[4], 'verb': c['verb'], 'year': '', 'note': '',
                            'link': '', 'depth': '', 'done': bool(it[5]), 'code': it[0], 'source': it[6] if len(it) > 6 else 'hand',
                            'confirm': 'approximate' in (it[6] if len(it) > 6 else '')} for it in c['items']]

    # Hand-kept and separately built files (moments, heat) are never rewritten here; their counts are read back.
    own = {c for c in COLL if COLL[c].get('source') in ('hand', 'build-heat.py') and not isinstance(COLL[c].get('items'), list) and not COLL[c].get('set_of')}
    own.discard('marathons')
    for c in COLL:
        if c in own or c == 'marathons':
            fp = os.path.join(OUT, c + '.json')
            try: layers[c] = json.load(open(fp, encoding='utf-8')).get('rows', [])
            except (OSError, ValueError): layers[c] = []
            continue
        if COLL[c].get('computed') in ('extremes', 'crossed', 'placeholder'): continue
        data = layers.get(c, [])
        data.sort(key=lambda d: (str(d.get('country') or ''), d['name']))
        json.dump({'collection': c, 'count': len(data), 'generated_from': 'places_been_export.csv', 'rows': data},
                  open(os.path.join(OUT, c + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    def count_of(c):
        rows = layers.get(c, [])
        if COLL[c].get('count_from') == 'set' or COLL[c].get('set_of'):
            st = [x for x in CFG['sets_of_seven'] if x['id'] == COLL[c]['set_of']][0]
            return sum(1 for it in st['items'] if it.get('done'))
        if isinstance(COLL[c].get('items'), list): return sum(1 for r in rows if r.get('done') and not r.get('honorary'))
        if COLL[c].get('computed') in ('extremes', 'crossed', 'placeholder'): return None
        return len(rows)
    def vars_of(c):
        rows = layers.get(c, []); n = count_of(c); of = COLL[c].get('denominator'); v = {'n': n}
        if of: v.update({'of': of, 'rest': of - n, 'pct': round(n / of * 100, 1), 'half': (of + 1) // 2})
        kinds = collections.Counter(r.get('type', '') for r in rows); ccs = collections.Counter(r.get('country', '') for r in rows)
        if c == 'cities':
            top = ccs.most_common(4); v['US'] = ccs.get('US', 0)
            v['split'] = ' · '.join('%s %d' % t for t in top) + (' · %d MORE CODES' % (len(ccs) - 4) if len(ccs) > 4 else '')
        if c == 'airports':
            v.update({'large': kinds.get('Large airport', 0), 'medium': kinds.get('Medium airport', 0), 'small': kinds.get('Small airport', 0)})
            v['split'] = '%d LARGE · %d MEDIUM · %d SMALL' % (v['large'], v['medium'], v['small'])
        if c == 'landmarks':
            v.update({'built': kinds.get('Landmark, built', 0), 'natural': kinds.get('Landmark, natural', 0)}); v['split'] = '%d BUILT · %d NATURAL' % (v['built'], v['natural'])
        if c == 'parks-everywhere':
            v.update({'parks': kinds.get('National park', 0), 'monuments': kinds.get('National monument', 0), 'countries': len(ccs)})
            v['split'] = '%d PARKS · %d MONUMENTS · %d COUNTRIES' % (v['parks'], v['monuments'], v['countries'])
        if c == 'countries':
            d = collections.Counter((r.get('depth') or r.get('depth_proposed') or 'Logged') for r in rows)
            v.update({'lived': d.get('Lived', 0), 'stayed': d.get('Stayed', 0), 'layover': d.get('Layover only', 0), 'notyet': (of or 0) - n})
            v['split'] = 'LIVED %d · STAYED %d · LAYOVER ONLY %d' % (v['lived'], v['stayed'], v['layover'])
        return v
    json.dump({'generated_from': 'places_been_export.csv', 'counts': {c: count_of(c) for c in COLL if count_of(c) is not None},
               'vars': {c: vars_of(c) for c in COLL if count_of(c) is not None}},
              open(os.path.join(OUT, 'counts.json'), 'w', encoding='utf-8'), indent=1)
    wishlist = [row(r, 'wishlist') for r in wish]
    json.dump({'collection': 'wishlist', 'count': len(wishlist), 'rows': wishlist},
              open(os.path.join(OUT, 'wishlist.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    # ---- Lines and extremes, from the pins you stood on (cities, airports, ports) ----
    place = [r for r in been if r['layer'] in ('Cities', 'Airports', 'Ports')]
    def pt(r): return {'name': r['name'], 'country': r['country_code'], 'latitude': round(float(r['lat']), 3), 'longitude': round(float(r['lng']), 3)}
    lats = [float(r['lat']) for r in place]; lngs = [float(r['lng']) for r in place]
    ext = {
        'from': 'cities, airports and ports in the Places Been export (762 been pins; landmarks and parks are not places you slept)',
        'north': pt(max(place, key=lambda r: float(r['lat']))), 'south': pt(min(place, key=lambda r: float(r['lat']))),
        'east': pt(max(place, key=lambda r: float(r['lng']))), 'west': pt(min(place, key=lambda r: float(r['lng']))),
        'equator_crossed': min(lats) < 0 < max(lats),
        'tropic_of_cancer_crossed': min(lats) < 23.4367 < max(lats), 'tropic_of_capricorn_crossed': min(lats) < -23.4367 < max(lats),
        'prime_meridian_crossed': min(lngs) < 0 < max(lngs), 'antimeridian_crossed': max(lngs) > 150 and min(lngs) < -150,
        'arctic_circle_crossed': max(lats) > 66.5633, 'antarctic_circle_crossed': min(lats) < -66.5633,
        'hemispheres': sorted({'N' if la >= 0 else 'S' for la in lats} | {'E' if lo >= 0 else 'W' for lo in lngs}),
        'continents': sorted({COUNTRY.get(r['country_code'], ('', ''))[1] for r in been} - {''}),
        'time_zones': None, 'time_zones_note': '[PLACEHOLDER] Needs a time-zone boundary dataset to compute from coordinates; not shown as a number until then.',
    }
    ext['lines_crossed_count'] = sum(1 for k in ('equator_crossed','tropic_of_cancer_crossed','tropic_of_capricorn_crossed','arctic_circle_crossed','antarctic_circle_crossed','prime_meridian_crossed','antimeridian_crossed') if ext[k]); ext['lines_total'] = 7
    ext['hemispheres_count'] = len(ext['hemispheres']); ext['continents_count'] = len(ext['continents'])
    ext['rulebooks'] = {'codes': len(countries), 'un_or_observer': sum(1 for c in countries if c['un_member_or_observer']),
                        'un_only': sum(1 for c in countries if c['un_member_or_observer'] and c['country'] not in ('PS', 'VA'))}
    json.dump(ext, open(os.path.join(OUT, 'extremes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    # ---- Checks for the report ----
    rep = {}
    rep['rows_total'] = len(rows); rep['been'] = len(been); rep['wishlist'] = len(wish)
    rep['also_wishlist_but_been'] = [r['name'] for r in been if r['also_wishlist'] == 'True']
    rep['counts'] = {c: len(layers[c]) for c in COLL}
    rep['country_rule'] = OVR.get('country_rule')
    rep['countries_from_pins'] = len(countries)
    rep['unesco_added_to_confirm'] = [d['name'] for d in layers['unesco'] if d.get('confirm')]
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
    rep['depth'] = collections.Counter(c['depth'] or 'no depth recorded' for c in countries)
    rep['in_member_record_not_in_pins'] = sorted(n3_to_a2.get(k, k) for k in MS['me'] if n3_to_a2.get(k) not in by_a2)
    rep['in_pins_not_in_member_record'] = sorted(c['country'] for c in countries if not c['depth'])
    rep['magnus_countries'] = len(mag)
    rep['hemispheres'] = sorted({('N' if float(r['lat']) >= 0 else 'S') for r in been} | {('E' if float(r['lng']) >= 0 else 'W') for r in been})
    rep['continents'] = sorted({COUNTRY.get(r['country_code'], ('', ''))[1] for r in been} - {''})
    json.dump(rep, open(os.path.join(OUT, '_report.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps(rep, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
