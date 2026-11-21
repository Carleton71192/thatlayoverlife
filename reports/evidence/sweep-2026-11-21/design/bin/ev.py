#!/usr/bin/env python3
"""Build the committed evidence file from the design probe results, with every text excerpt removed (selectors and numbers only)."""
import json, glob, re, collections, sys
D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-design/results'
out = sys.argv[1]
def strip(s): return re.sub(r'\s*"[^"]*"?', '', str(s))
def selonly(s): return re.sub(r'#[a-z0-9_-]*\d{3,}[a-z0-9_-]*', '', strip(s))
cells = []
for f in sorted(glob.glob(D + '/ds-*.jsonl')):
    if 'smoke' in f: continue
    for l in open(f):
        r = json.loads(l); d = r.get('d')
        if not isinstance(d, dict): continue
        c = {'page': r['page'], 'w': r['w'], 'signed': r['signed'], 'docH': d['docH'], 'scrollW': d['sx'],
             'fontsComputed': {k: v for k, v in d['fams'].items()},
             'fontsRenderedOffKit': [{'stack': p.get('stack', '')[:90], 'cls': p.get('cls', '')[:40], 'rendered': p.get('rendered')} for p in (d['pf'] if isinstance(d['pf'], list) else []) if any(not re.match(r'(Playfair Display|IBM Plex Sans Condensed|JetBrains Mono)', x) for x in (p.get('rendered') or []))],
             'contrastFails': [{k: v for k, v in x.items() if k != 't'} for x in d['contrast']],
             'smallTextUnder12': [{k: v for k, v in x.items() if k != 't'} for x in d['smallType']][:15], 'smallTextUnder12N': d['smallTypeN'],
             'monoVariants': {k: {'n': v['n'], 'ex': [selonly(e) for e in v['ex']]} for k, v in d['mono'].items()},
             'buttonVariants': {k: {'n': v['n'], 'chrome': v['ch'], 'ex': [selonly(e) for e in v['ex']]} for k, v in d['btns'].items()},
             'cardVariants': d['cards'], 'radii': d['radii'],
             'photoRadiusCounts': dict(collections.Counter(p['rad'] for p in d['photos'] if p['w'] >= 100)), 'photosUpscaled': [{k: p[k] for k in ('s', 'w', 'h', 'nat')} for p in d['photos'] if p['up']],
             'headings': [{k: v for k, v in h.items() if k != 't'} for h in d['heads'] if h['tag'] != 'H3'][:30],
             'sections': [{k: x[k] for k in ('y', 'h', 'pt', 'pb', 'lx')} for x in d['sections']], 'offKitTextColors': {k: {'n': v['n'], 'ex': [selonly(e) for e in v['ex']]} for k, v in d['offKit'].items()},
             'inlineLinkStyles': d['inlineLinks'], 'outsideViewport': [selonly(x) for x in d['wide']], 'comingSoonCount': d.get('soon')}
        cells.append(c)
vf = [json.loads(l) for l in open(D + '/vf.jsonl')] if glob.glob(D + '/vf.jsonl') else []
for v in vf:
    if isinstance(v.get('act'), list):
        for o in v['act']: o.pop('t', None)
s = json.dumps({'note': 'Design lens, Nov 21, 2026. Selectors, computed styles and numbers only; text excerpts and names removed; profile paths masked.', 'cells': cells, 'targeted': vf}, separators=(',', ':'))
s = re.sub(r'contributors/[^/?#\s"\'<]+', 'contributors/<profile>', s).replace('contributors/<profile>>', 'contributors/<profile>')
s = re.sub(r'((?:-\d+){3})(?:-\d+)+', r'\1-n', s)
open(out, 'w').write(s); print(out, len(s))
