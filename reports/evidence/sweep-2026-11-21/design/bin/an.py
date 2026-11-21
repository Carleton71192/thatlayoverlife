#!/usr/bin/env python3
"""Summarize the design probe results across pages and widths. Usage: python3 -I an.py <section> [filter]"""
import json, sys, glob, os, re, collections
D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-design/results'
rows = []
for f in sorted(glob.glob(D + '/ds-*.jsonl')):
    if 'smoke' in f: continue
    for l in open(f):
        if l.strip(): rows.append(json.loads(l))
sec = sys.argv[1] if len(sys.argv) > 1 else 'list'
flt = sys.argv[2] if len(sys.argv) > 2 else ''
def cell(r): return '%s@%s%s' % (r['page'], r['w'], '' if r['signed'] == 'out' else '+in')
rows = [r for r in rows if isinstance(r.get('d'), dict) and (not flt or flt in cell(r))]
KITF = {'Playfair Display', 'IBM Plex Sans Condensed', 'JetBrains Mono'}
if sec == 'list':
    for r in rows: print(cell(r), r['status'], 'errs', r['errs'], 'wf', r['wf'], 'H', r['d']['docH'], 'sx', r['d']['sx'], 'vw', r['d']['vw'])
elif sec == 'fonts':
    agg = collections.defaultdict(set)
    for r in rows:
        for k, n in r['d']['fams'].items():
            fam = k.split('|')[0]
            if fam not in KITF: agg[k].add(cell(r) + ' x' + str(n))
        for p in (r['d']['pf'] if isinstance(r['d']['pf'], list) else []):
            for x in p.get('rendered', []):
                nm = re.sub(r' x\d+$', '', x)
                if not re.match(r'(Playfair Display|IBM Plex Sans Condensed|JetBrains Mono)', nm):
                    agg['RENDERED ' + nm + ' <- ' + p['stack'][:70] + ' .' + p.get('cls', '')].add(cell(r))
    for k, v in sorted(agg.items()): print(k, '::', len(v), sorted(v)[:8])
elif sec == 'contrast':
    agg = collections.defaultdict(list)
    for r in rows:
        for c in r['d']['contrast']:
            if c.get('overImg'): continue
            cls = re.sub(r'#[^.>]+', '', c['s'])
            agg[(cls, c['fg'], c['bg'], c['r'], round(c['fs']), c['fw'], c['ch'])].append(cell(r) + ' "' + c['t'][:24] + '"')
    for k, v in sorted(agg.items(), key=lambda kv: kv[0][3] or 0):
        print('%.2f' % (k[3] or 0), k[1], 'on', k[2], '%spx %s' % (k[4], k[5]), 'chrome' if k[6] else '', k[0], '::', len(v), v[:3])
elif sec == 'overimg':
    agg = collections.defaultdict(list)
    for r in rows:
        for c in r['d']['contrast']:
            if not c.get('overImg'): continue
            agg[(re.sub(r'#[^.>]+', '', c['s']), c['fg'], c['bg'], round(c['fs']), c.get('shadow'))].append(cell(r) + ' "' + c['t'][:20] + '"')
    for k, v in sorted(agg.items()): print(k, '::', len(v), v[:2])
elif sec == 'small':
    agg = collections.defaultdict(list)
    for r in rows:
        for c in r['d']['smallType']:
            agg[(re.sub(r'#[^.>]+', '', c['s']), c['fs'], c['f'], c['ch'])].append(cell(r) + ' "' + c['t'][:20] + '"')
    for k, v in sorted(agg.items(), key=lambda kv: kv[0][1]): print(k, '::', len(v), v[:2])
elif sec == 'mono':
    agg = collections.defaultdict(list)
    for r in rows:
        for k, m in r['d']['mono'].items(): agg[k].append((cell(r), m['n'], m['ex'][0][:70]))
    for k, v in sorted(agg.items(), key=lambda kv: -sum(x[1] for x in kv[1])): print(sum(x[1] for x in v), k, '::', len(v), [x[0] for x in v][:5], v[0][2])
elif sec == 'btns':
    agg = collections.defaultdict(list)
    for r in rows:
        for k, b in r['d']['btns'].items(): agg[k].append((cell(r), b['n'], b['ex'][0][:70], b['ch']))
    for k, v in sorted(agg.items()):
        print(sum(x[1] for x in v), k, '::', len(v), [x[0] for x in v][:4], v[0][2], 'chrome' if v[0][3] else '')
elif sec == 'cards':
    agg = collections.defaultdict(list)
    for r in rows:
        for k, n in r['d']['cards'].items(): agg[k].append(cell(r))
    for k, v in sorted(agg.items()): print(k, '::', len(v), v[:4])
elif sec == 'radii':
    agg = collections.Counter()
    for r in rows:
        for k, n in r['d']['radii'].items(): agg[k] += n
    print(agg.most_common())
elif sec == 'photos':
    for r in rows:
        for p in r['d']['photos']:
            bad = []
            if p['rad'] not in ('0px',): bad.append('rad ' + p['rad'])
            if p['distort']: bad.append('DISTORT')
            if p['up']: bad.append('upscaled nat ' + p['nat'])
            if bad: print(cell(r), p['s'][:60], '%sx%s' % (p['w'], p['h']), 'ar', p['ar'], p['fit'], p['src'][-30:], bad)
elif sec == 'heads':
    for r in rows:
        hs = [h for h in r['d']['heads'] if not h['ch']]
        ri = sum(1 for h in hs if h['roseItalic'])
        h1 = [h for h in hs if h['tag'] == 'H1']
        h2 = collections.Counter('%s %s %s %s' % (h['f'][:8], h['fs'], h['fw'], h['tt']) for h in hs if h['tag'] == 'H2')
        print(cell(r), 'H1', [(h['t'][:30], h['f'][:8], h['fs'], h['fw'], h['color']) for h in h1], 'roseItalicHeads', ri, 'H2', dict(h2))
elif sec == 'headsx':
    for r in rows:
        for h in r['d']['heads']:
            if h['ch']: continue
            print(cell(r), h['tag'], h['t'][:40], h['f'][:10], h['fs'], h['fw'], h['ls'], h['tt'], h['color'], 'x', h['x'], 'w', h['w'], 'ri', h['roseItalic'])
elif sec == 'offkit':
    agg = collections.defaultdict(list)
    for r in rows:
        for k, o in r['d']['offKit'].items(): agg[k].append((cell(r), o['n'], o['ex'][0][:60]))
    for k, v in sorted(agg.items(), key=lambda kv: -sum(x[1] for x in kv[1])): print(sum(x[1] for x in v), k, len(v), 'pages', v[0][2], [x[0] for x in v][:4])
elif sec == 'links':
    agg = collections.defaultdict(list)
    for r in rows:
        for k, n in r['d']['inlineLinks'].items(): agg[k].append(cell(r) + ' x' + str(n))
    for k, v in sorted(agg.items()): print(k, '::', len(v), v[:5])
elif sec == 'misc':
    for r in rows:
        d = r['d']
        if d['wide'] or d['unfinished'] or d.get('soon') or d['sx'] > d['vw'] + 1:
            print(cell(r), 'sx', d['sx'], 'vw', d['vw'], 'wide', d['wide'][:3], 'unf', d['unfinished'][:5], 'soon', d.get('soon'))
elif sec == 'sections':
    for r in rows:
        d = r['d']; ss = d['sections']
        lx = collections.Counter(s['lx'] for s in ss if s['lx'] is not None)
        pads = collections.Counter(s['pt'] + '/' + s['pb'] for s in ss)
        empt = [s['s'][:50] + ' h' + str(s['h']) for s in ss if s['empty']]
        print(cell(r), 'lefts', dict(lx), 'pads', dict(pads), 'EMPTY', empt[:3])
