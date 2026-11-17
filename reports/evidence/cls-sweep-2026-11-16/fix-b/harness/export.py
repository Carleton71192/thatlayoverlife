"""Tables for fix.md, part B. python3 export.py <outdir>  reads out/f-std.jsonl, f-cpu.jsonl, f-slow.jsonl, f-other.jsonl; writes table.md, loads.csv, cells.json"""
import json, sys, statistics as st, csv, os
from collections import defaultdict
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
PFX = sys.argv[2] if len(sys.argv) > 2 else 'f-'  # 'm-' for the merged files (merge.py)
NAME = {'account': '/account', 'submit': '/submit', 'profile': '/contributors/<profile>', 'stories': '/stories', 'home': '/', 'balkans': 'story: Balkans', 'lisbon': 'story: Lisbon', 'safrica': 'story: Southern Africa',
        'travelers': '/travelers', 'map': '/the-map', 'expats': '/for-expats', 'about': '/about', 'layovers': '/layovers', 'paw': '/the-paw-passport', 'cookies': '/cookies', 'login': '/login', 'signup': '/signup'}
ORDER = list(NAME)
def rows(f):
    R = []
    if not os.path.exists(f): return R
    for l in open(f):
        try: r = json.loads(l)
        except Exception: continue
        if r.get('err'): print('ERR', f, r['page'], r['w'], r['err']); continue
        r['k'] = 'ctl' if 'core-1666' in r['v'] else 'new'
        r['all'] = round(sum(e['v'] for e in r['sh']), 5)
        R.append(r)
    return R
def med(a):
    a = [x for x in a if x is not None]; return st.median(a) if a else None
def top(r):
    s = [e for e in r['sh'] if e['v'] >= 0.002]; s.sort(key=lambda e: -e['v'])
    return '; '.join('%.4f@%dms' % (e['v'], e['t']) for e in s[:3])
SETS = [('Standard (no throttle), 5 loads a cell', 'std'), ('CPU 4x slower, 3 loads a cell', 'cpu'),
        ('Stress: jQuery answer held 600 ms (a paint lands before the end-of-body scripts and the page-parsed event), 3 loads a cell', 'slow'),
        ('The part A pages and five more pages (of part B only the Menu button piece runs there), 3 loads a cell', 'other'),
        ('First paint, 8 more loads a cell', 'fcp')]
md = []; cells = {}; loads = []
for label, f in SETS:
    R = rows(os.path.join(B, 'out', PFX + f + '.jsonl'))
    if not R: continue
    C = defaultdict(lambda: defaultdict(list))
    for r in R: C[(r['page'], r['w'])][r['k']].append(r)
    md.append('### ' + label + '\n')
    md.append('CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.\n')
    md.append('| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |')
    md.append('|---|---|---|---|---|---|---|---|---|---|')
    for p in ORDER:
        for w in sorted(set(k[1] for k in C if k[0] == p)):
            c = C[(p, w)]; a, b = c['ctl'], c['new']
            if not a or not b: continue
            ca, cb = [r['all'] for r in a], [r['all'] for r in b]
            bha, bhb = set(r['bh'] for r in a), set(r['bh'] for r in b)
            eq = 'yes' if bha == bhb and len(bha) == 1 else ('yes (%d end states, the same ones)' % len(bha) if bha == bhb else ('yes (new: %d of the control\'s %d end states)' % (len(bhb), len(bha)) if bhb <= bha else ('partly' if bha & bhb else 'no')))
            fa, fb = med([r['fcp'] for r in a]), med([r['fcp'] for r in b]); la, lb = med([r['lcpT'] for r in a]), med([r['lcpT'] for r in b])
            md.append('| %s %d | %.4f (%.4f) | %.4f | %d of %d | %.4f (%.4f) | %.4f | %d of %d | %s / %s | %s / %s | %s |' % (NAME[p], w, med(ca), med([r['cls'] for r in a]), max(ca), sum(x > 0.1 for x in ca), len(ca), med(cb), med([r['cls'] for r in b]), max(cb), sum(x > 0.1 for x in cb), len(cb), round(fa), round(fb), round(la), round(lb), eq))
            cells['%s|%s|%d' % (f, p, w)] = {'ctl': {'median': med(ca), 'max': max(ca), 'over': sum(x > 0.1 for x in ca), 'n': len(ca), 'fcp': fa, 'lcp': la, 'boxes': sorted(bha)}, 'new': {'median': med(cb), 'max': max(cb), 'over': sum(x > 0.1 for x in cb), 'n': len(cb), 'fcp': fb, 'lcp': lb, 'boxes': sorted(bhb)}}
    md.append('')
    for r in R:
        loads.append([f, NAME[r['page']], r['w'], r['h'], r['k'], r['run'], r['at'], r['all'], r['cls'], r['fcp'], r['lcpT'], r['dcl'], r['loadT'], r['bh'], r['docH'], len(r['errs']), len(r['blocked']), r['aborted'], r['tries'], r['ovl'], top(r)])
open(os.path.join(out, 'table.md'), 'w').write('\n'.join(md) + '\n')
json.dump(cells, open(os.path.join(out, 'cells.json'), 'w'), indent=1)
w = csv.writer(open(os.path.join(out, 'loads.csv'), 'w', newline=''))
w.writerow(['set', 'page', 'width', 'height', 'core', 'run', 'at_utc', 'cls_all', 'cls_input_excluded', 'fcp_ms', 'lcp_ms', 'dcl_ms', 'load_ms', 'box_hash', 'doc_height', 'page_errors', 'images_aborted', 'non_get_aborted', 'tries', 'overlap', 'largest_shifts'])
w.writerows(loads)
print('\n'.join(md)); print(len(loads), 'loads')
