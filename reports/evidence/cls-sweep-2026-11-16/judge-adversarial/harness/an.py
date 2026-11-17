#!/usr/bin/env python3
"""Judge-adversarial analysis. Usage: an.py <outdir> [set ...]
Reads results/<set>.jsonl, pairs the two arms of every scenario and stage, and writes <outdir>/table.md and <outdir>/cells.json.
No page text is written: only hashes, counts, numbers and element names of the layout-shift sources."""
import json, os, sys, glob, re, collections
J = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(J, 'out')
os.makedirs(out, exist_ok=True)
sets = sys.argv[2:] or [os.path.basename(f)[:-6] for f in sorted(glob.glob(os.path.join(J, 'results', '*.jsonl')))]
EQ = ['box', 'tree', 'head', 'aria', 'foc', 'text']
def late(st, ms=1000):
    lt = st.get('loadT') or 0
    return round(sum(e['v'] for e in st.get('sh', []) if e['t'] > lt + ms), 5)
def mask(s): return re.sub(r'contributors/[^/?# "]+', 'contributors/<profile>', s)
def cls_of(c): return ' '.join(sorted(x for x in (c or '').split() if not re.match(r'^(wf-|w-mod-)', x)))
import gzip
def boxdiff(sname, sid, stage):
    """how the two box lists differ: '' (equal), 'title hold +N' (only the /travelers title height and what follows it), or a short count"""
    def rd(arm):
        f = os.path.join(J, 'boxes', '%s-%s-%s%s.tbox.gz' % (sname, sid, arm, '' if stage == 'end' else '.' + stage))
        try: return gzip.open(f, 'rt').read().split('\n')
        except Exception: return None
    a, b = rd('ctl'), rd('new')
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
cells, lines, flags = [], [], []
for sname in sets:
    p = os.path.join(J, 'results', sname + '.jsonl')
    if not os.path.exists(p): continue
    recs = collections.OrderedDict()
    for l in open(p):
        l = l.strip()
        if not l: continue
        r = json.loads(l)
        if not r.get('ok'): continue
        recs.setdefault(r['id'], {})[r['arm']] = r
    lines.append('\n## Set %s (%d scenarios)\n' % (sname, len(recs)))
    lines.append('| scenario | stage | CLS ctl | CLS new | late ctl | late new | same: box tree head aria focus text class | left in new | errors ctl/new | console ctl/new | note |')
    lines.append('|---|---|---|---|---|---|---|---|---|---|---|')
    for sid, arms in recs.items():
        c, n = arms.get('ctl'), arms.get('new')
        if not c or not n:
            lines.append('| %s | - | one arm only | | | | | | | | |' % sid); continue
        ns = len(n['stages']); cs = len(c['stages'])
        for i in range(max(ns, cs)):
            a = c['stages'][i] if i < cs else None; b = n['stages'][i] if i < ns else None
            if not a or not b:
                lines.append('| %s | %s | stage missing in one arm | | | | | | | | |' % (sid, (a or b)['stage'])); flags.append((sname, sid, 'stage missing')); continue
            same = [a.get(k) == b.get(k) for k in EQ] + [cls_of(a.get('htmlClass')) == cls_of(b.get('htmlClass'))]
            note = []
            bd = '' if same[0] else boxdiff(sname, sid, b['stage'])
            if bd: note.append('boxes: ' + bd)
            if a.get('sy') != b.get('sy'): note.append('scrollY %s/%s' % (a.get('sy'), b.get('sy')))
            if a.get('docH') != b.get('docH'): note.append('docH %s/%s' % (a.get('docH'), b.get('docH')))
            if a.get('active') != b.get('active'): note.append('focus on %s / %s' % (a.get('active'), b.get('active')))
            if a.get('marks') != b.get('marks'): note.append('marks differ')
            if a.get('navType') != b.get('navType'): note.append('nav %s/%s' % (a.get('navType'), b.get('navType')))
            hold = {}
            for h in (b.get('holds') or []): hold.setdefault(h[0], []).append((h[1], h[2]))
            lt = b.get('loadT') or 0
            longh = []
            for hid, ev in hold.items():
                plus = [t for o, t in ev if o == '+']; minus = [t for o, t in ev if o == '-']
                if hid == 'tll-fp-title-v1': continue
                if plus and (not minus or max(minus) < max(plus)): longh.append(hid.replace('tll-', '') + ' kept')
                elif minus and max(minus) > lt + 3000: longh.append('%s let go at %d ms' % (hid.replace('tll-', ''), max(minus)))
            if longh: note.append('; '.join(longh))
            cell = dict(boxdiff=bd, set=sname, id=sid, page=n['page'], w=n['w'], h=n['h'], stage=b['stage'], cls_ctl=a['cls'], cls_new=b['cls'], clsNI_ctl=a['clsNI'], clsNI_new=b['clsNI'], late_ctl=late(a), late_new=late(b),
                        same=dict(zip(EQ + ['class'], same)), left=b.get('left'), left_ctl=a.get('left'), err_ctl=c['errN'], err_new=n['errN'], cons_ctl=c['consN'], cons_new=n['consN'],
                        fcp_ctl=a.get('fcp'), fcp_new=b.get('fcp'), lcp_ctl=a.get('lcp'), lcp_new=b.get('lcp'), docH=[a.get('docH'), b.get('docH')], sy=[a.get('sy'), b.get('sy')], holds=b.get('holds'), note=note,
                        errs_new=[mask(x) for x in n.get('errs', [])], errs_ctl=[mask(x) for x in c.get('errs', [])], abort=[c['abortedN'], n['abortedN']], nonGet=[c['nonGet'], n['nonGet']],
                        atDcl=b.get('atDcl'), endSnap=b.get('endSnap'), extra={k: n.get(k) for k in ('menu', 'tap', 'map') if n.get(k) is not None}, extra_ctl={k: c.get(k) for k in ('menu', 'tap', 'map') if c.get(k) is not None})
            cells.append(cell)
            lines.append('| %s | %s | %.4f | %.4f | %.4f | %.4f | %s | %s | %d/%d | %d/%d | %s |' % (sid, b['stage'], a['cls'], b['cls'], late(a), late(b), ' '.join('y' if x else 'N' for x in same),
                ', '.join(x.replace('style#', '') for x in (b.get('left') or [])) or '-', c['errN'], n['errN'], c['consN'], n['consN'], '; '.join(note)))
            f = []
            if not same[1]: f.append('body tree differs')
            if not same[0] and not bd.startswith('title hold'): f.append('boxes differ: ' + bd)
            if not same[0] and bd.startswith('title hold'): f.append('(by design) ' + bd)
            if not same[3] or not same[4]: f.append('aria/focus differ')
            if not same[6]: f.append('html class differs')
            if b['cls'] > a['cls'] + 0.02: f.append('CLS new %.4f > ctl %.4f' % (b['cls'], a['cls']))
            if b['cls'] >= 0.1: f.append('CLS new %.4f over 0.1' % b['cls'])
            if late(b) > late(a) + 0.01: f.append('late shift new %.4f > ctl %.4f' % (late(b), late(a)))
            if n['errN'] > c['errN']: f.append('more page errors in new')
            if n['consN'] > c['consN']: f.append('more console errors in new')
            lf = [x for x in (b.get('left') or []) if x != 'style#tll-fp-title-v1']
            if lf: f.append('left: ' + ','.join(lf))
            if longh: f.append('hold: ' + '; '.join(longh))
            if a.get('sy') != b.get('sy'): f.append('scrollY differs')
            for x in f: flags.append((sname, sid + ' [' + b['stage'] + ']', x))
open(os.path.join(out, 'cells.json'), 'w').write(json.dumps(cells, indent=0))
head = ['# Adversarial check of the 16.67.0 core: every scenario, both arms', '',
        'ctl = live 16.66.0 core routed from a local copy; new = the branch core (afe01e7 build). One load per scenario and arm unless the scenario name ends in a round number.',
        'CLS counts every layout-shift entry. "late" is the part of it later than 1 s after the load event. "same" compares the finished page of the two arms.', '',
        '## Flags (%d)' % len(flags), '']
for s, i, x in flags: head.append('- %s / %s: %s' % (s, i, x))
open(os.path.join(out, 'table.md'), 'w').write('\n'.join(head + lines) + '\n')
print('\n'.join(head[5:]))
print('cells', len(cells))
