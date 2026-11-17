#!/usr/bin/env python3
"""Re-check 1 analysis of the scenario sets (adv/results/<set>.jsonl). Usage: an-adv.py <outdir> [set ...]
Writes <outdir>/table-adv.md (one row per scenario, stage and arm group), <outdir>/groups.json and <outdir>/loads-adv.csv.
No page text is written: only hashes, counts, numbers and element names."""
import json, os, sys, glob, re, collections, statistics, csv, gzip
J = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'adv')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(J, 'out')
os.makedirs(out, exist_ok=True)
ORDER = ['n1', 'n2', 'n2x', 'n2y', 'n3', 'n3slow', 'n7', 'atkq', 'atknav', 'atkenv', 'atkfail']
sets = sys.argv[2:] or [s for s in ORDER if os.path.exists(os.path.join(J, 'results', s + '.jsonl'))]
EQ = ['box', 'tree', 'head', 'aria', 'foc', 'text']
ARMS = ['ctl', 'old', 'new']
mask = lambda s: re.sub(r'contributors/[^/?# "]+', 'contributors/<profile>', s)
cls_of = lambda c: ' '.join(sorted(x for x in (c or '').split() if not re.match(r'^(wf-|w-mod-)', x)))
f4 = lambda x: '-' if x is None else '%.4f' % x
def late(st, ms=1000):
    lt = st.get('loadT') or 0
    return round(sum(e['v'] for e in st.get('sh', []) if e['t'] > lt + ms), 5)
def gone(st, hid):
    """when a head style of the sweep was taken out (ms after navigation start), or 'stays'"""
    add = [h[2] for h in (st.get('holds') or []) if h[0] == hid and h[1] == '+']; rem = [h[2] for h in (st.get('holds') or []) if h[0] == hid and h[1] == '-']
    if not add: return None
    return rem[-1] if rem else 'stays'
def boxdiff(sname, sid, stage, arm):
    def rd(a):
        f = os.path.join(J, 'boxes', '%s-%s-%s%s.tbox.gz' % (sname, sid, a, '' if stage == 'end' else '.' + stage))
        try: return gzip.open(f, 'rt').read().split('\n')
        except Exception: return None
    a, b = rd('ctl'), rd(arm)
    if a is None or b is None: return '?'
    if a == b: return ''
    if len(a) != len(b): return '%d/%d boxes' % (len(a), len(b))
    ds, nd, title = set(), 0, 0
    for x, y in zip(a, b):
        if x == y: continue
        nd += 1
        nx, rx = x.rsplit(' ', 1); ny, ry = y.rsplit(' ', 1)
        if nx != ny: return '%d lines differ, names too' % sum(1 for p, q in zip(a, b) if p != q)
        px = list(map(int, rx.split(','))); py = list(map(int, ry.split(',')))
        d = [q - p for p, q in zip(px, py)]
        if 'tll-travelers-title' in nx and d[0] == 0 and d[1] == 0 and d[2] == 0: title = d[3]
        if d[0] or d[2]: return '%d lines differ (x or width)' % sum(1 for p, q in zip(a, b) if p != q)
        ds.add(d[1] if d[1] else d[3])
    if title and all(abs(x - title) <= 1 for x in ds): return 'title hold %+d px' % title
    return '%d lines differ (y or height by %s)' % (nd, ','.join(str(x) for x in sorted(ds))[:40])

lines, flags, groups, tot = [], [], collections.OrderedDict(), collections.Counter()
csvf = open(os.path.join(out, 'loads-adv.csv'), 'w', newline=''); wr = csv.writer(csvf)
wr.writerow(['set', 'scenario', 'arm', 'stage', 'cls_all', 'cls_input_excluded', 'late_cls', 'scroll_y', 'wanted_y', 'doc_height', 'fcp_ms', 'dcl_ms', 'load_ms', 'holds(id:gone_ms)', 'left', 'active_element', 'page_errors', 'console_errors', 'non_get_aborted', 'box', 'tree', 'aria', 'focus', 'text'])
for sname in sets:
    p = os.path.join(J, 'results', sname + '.jsonl')
    if not os.path.exists(p): continue
    recs = collections.OrderedDict()
    for l in open(p):
        l = l.strip()
        if not l: continue
        r = json.loads(l)
        if not r.get('ok'): tot['failed'] += 1; continue
        recs.setdefault(r['id'], {})[r['arm']] = r
    lines.append('\n## Set %s (%d scenarios)\n' % (sname, len(recs)))
    lines.append('| scenario | stage | CLS ctl | CLS old | CLS new | late ctl / old / new | scroll y ctl / old / new (wanted) | new same as ctl: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |')
    lines.append('|---|---|---|---|---|---|---|---|---|---|---|---|')
    for sid, arms in recs.items():
        tot['scen'] += 1
        for a, r in arms.items():
            tot['loads'] += 1; tot['nonGet'] += r.get('nonGet', 0)
            for st in r['stages']:
                ids = sorted(set(h[0] for h in (st.get('holds') or [])))
                wr.writerow([sname, mask(sid), a, st['stage'], st['cls'], st['clsNI'], late(st), st['sy'], st.get('wantY', ''), st['docH'], st.get('fcp'), st.get('dcl'), st.get('loadT'),
                             ' '.join('%s:%s' % (i, gone(st, i)) for i in ids), ' '.join(st['left']), st['active'], r['errN'], r['consN'], r.get('nonGet', 0), st['box'], st['tree'], st['aria'], st['foc'], st['text']])
        c, n, o = arms.get('ctl'), arms.get('new'), arms.get('old')
        if not n: lines.append('| %s | - | no new arm | | | | | | | | | |' % mask(sid)); continue
        base = c or o
        ns = len(n['stages'])
        gid = re.sub(r'-r\d+$', '', sid); g = groups.setdefault(sname + ':' + gid, {'set': sname, 'id': gid, 'stages': collections.OrderedDict()})
        for i in range(ns):
            b = n['stages'][i]; a = c['stages'][i] if c and i < len(c['stages']) else None; od = o['stages'][i] if o and i < len(o['stages']) else None
            tot['stages'] += 1
            gs = g['stages'].setdefault(b['stage'], {x: {'cls': [], 'late': [], 'dy': [], 'sy': [], 'docH': [], 'mapHold': [], 'noteHold': [], 'titleHold': [], 'active': [], 'left': []} for x in ARMS})
            for arm, st in (('ctl', a), ('old', od), ('new', b)):
                if not st: continue
                q = gs[arm]; q['cls'].append(st['cls']); q['late'].append(late(st)); q['sy'].append(st['sy']); q['docH'].append(st['docH']); q['active'].append(st['active']); q['left'].append(len(st['left']))
                if st.get('wantY') is not None: q['dy'].append(st['sy'] - st['wantY'])
                for key, hid in (('mapHold', 'tll-fp-map-v1'), ('noteHold', 'tll-fp-note-v1'), ('titleHold', 'tll-es-libtitle-v1')):
                    v = gone(st, hid)
                    if v is not None: q[key].append(v)
            note = []
            if a:
                same = [a[k] == b[k] for k in EQ] + [cls_of(a['htmlClass']) == cls_of(b['htmlClass'])]
                if not same[0]:
                    bd = boxdiff(sname, sid, b['stage'], 'new'); note.append('boxes: ' + bd)
                    if bd.startswith('title hold'): tot['boxTitleOnly'] += 1
                else: tot['boxEq'] += 1
                if same[1]: tot['treeEq'] += 1
                if same[3]: tot['ariaEq'] += 1
                if same[4]: tot['focEq'] += 1
                tot['cmp'] += 1
                d = b['cls'] - a['cls']
                if d > 0.01: tot['higher'] += 1; note.append('new higher by %.3f' % d)
                if d < -0.01: tot['lower'] += 1
                if a['cls'] > 0.1: tot['ctlOver'] += 1
                if b['cls'] > 0.1: tot['newOver'] += 1
                if late(b) > late(a) + 0.005: note.append('late +%.3f' % (late(b) - late(a)))
                if a.get('wantY') is not None and abs(b['sy'] - b['wantY']) > abs(a['sy'] - a['wantY']) + 2: note.append('scroll further from wanted: ctl %+d, new %+d' % (a['sy'] - a['wantY'], b['sy'] - b['wantY']))
                if a['active'] != b['active']: note.append('active element: ctl %s, new %s' % (a['active'], b['active']))
                if c['errN'] != n['errN']: note.append('page errors %d/%d' % (c['errN'], n['errN']))
                if c['consN'] != n['consN']: note.append('console errors %d/%d' % (c['consN'], n['consN']))
                if a.get('vis') != b.get('vis'): note.append('visibility differs')
                samestr = ' '.join('y' if x else 'N' for x in same)
            else: samestr = '(no ctl arm)'
            if b['left']: tot['left'] += 1; note.append('left: ' + ' '.join(b['left']))
            if od and a and od['cls'] + 0.01 < b['cls']: note.append('new higher than old by %.3f' % (b['cls'] - od['cls']))
            if note and any(not x.startswith('boxes: title hold') for x in note): flags.append((sname, mask(sid), b['stage'], '; '.join(note)))
            wanted = b.get('wantY')
            lines.append('| %s | %s | %s | %s | %s | %s / %s / %s | %s / %s / %s%s | %s | %s | %s/%s | %s/%s | %s |' % (
                mask(sid), b['stage'], f4(a['cls']) if a else '-', f4(od['cls']) if od else '-', f4(b['cls']),
                ('%.3f' % late(a)) if a else '-', ('%.3f' % late(od)) if od else '-', '%.3f' % late(b),
                a['sy'] if a else '-', od['sy'] if od else '-', b['sy'], (' (%d)' % wanted) if wanted is not None else '',
                samestr, ' '.join(b['left']) or '-', c['errN'] if c else '-', n['errN'], c['consN'] if c else '-', n['consN'], '; '.join(note)))
csvf.close()
# group summary
G = ['\n## Groups (repeats pooled; values in load order per arm)\n', '| set | scenario | stage | arm | loads | CLS min / median / max | over 0.1 | late max | end y minus wanted | map hold gone ms | note hold gone ms | title hold gone ms | active element |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
for key, g in groups.items():
    for stage, arms in g['stages'].items():
        if max(len(arms[a]['cls']) for a in ARMS) < 2 and g['set'] not in ('n1', 'n2', 'n2x', 'n2y', 'n3', 'n3slow', 'n7'): continue
        for a in ARMS:
            q = arms[a]
            if not q['cls']: continue
            rng = lambda v: ('%s to %s' % (min(v), max(v)) if len(set(v)) > 1 else str(v[0])) if v else '-'
            hold = lambda v: ('stays x%d ' % v.count('stays') if 'stays' in v else '') + (rng([x for x in v if x != 'stays']) if [x for x in v if x != 'stays'] else '') if v else '-'
            G.append('| %s | %s | %s | %s | %d | %s / %s / %s | %d | %.3f | %s | %s | %s | %s | %s |' % (g['set'], mask(g['id']), stage, a, len(q['cls']), f4(min(q['cls'])), f4(statistics.median(q['cls'])), f4(max(q['cls'])),
                sum(1 for x in q['cls'] if x > 0.1), max(q['late']), ' '.join('%+d' % x for x in q['dy']) or '-', hold(q['mapHold']), hold(q['noteHold']), hold(q['titleHold']), ' '.join('%s x%d' % (k, v) for k, v in collections.Counter(q['active']).items())))
head = ['# Re-check 1: scenario tables (generated by harness/an-adv.py)', '',
        'Arms: ctl = live 16.66.0 core, old = the afe01e7 build (before the repair), new = the repaired core (634b842). CLS counts every layout-shift entry. Late = the part later than 1 s after load.', '',
        'Totals: %d scenarios, %d loads, %d compared stages (new against ctl). Boxes equal in %d (+%d apart from the /travelers title hold), body tree equal in %d, aria equal in %d, keyboard order equal in %d. New CLS lower by more than 0.01 in %d stages, higher in %d. Over 0.1: ctl %d, new %d. Stages with something left behind in new: %d. Non-GET requests aborted: %d. Failed loads: %d.' % (
            tot['scen'], tot['loads'], tot['cmp'], tot['boxEq'], tot['boxTitleOnly'], tot['treeEq'], tot['ariaEq'], tot['focEq'], tot['lower'], tot['higher'], tot['ctlOver'], tot['newOver'], tot['left'], tot['nonGet'], tot['failed']), '',
        '## Rows with a note (%d)' % len(flags), '', '| set | scenario | stage | what |', '|---|---|---|---|'] + ['| %s | %s | %s | %s |' % f for f in flags]
open(os.path.join(out, 'table-adv.md'), 'w').write('\n'.join(head + G + lines) + '\n')
json.dump({k: v for k, v in groups.items()}, open(os.path.join(out, 'groups.json'), 'w'), indent=0)
print('\n'.join(head[:4])); print('flags:', len(flags))
for f in flags: print(' ', f)
