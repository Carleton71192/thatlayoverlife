import json, sys, collections, re
# Summarize ux-*.jsonl: small tap targets (not inline, not under 24 by chrome only), tab-walk problems. Names are not printed for card links.
for fn in sys.argv[1:]:
    for l in open(fn):
        j = json.loads(l); a = j.get('act') or {}
        if not isinstance(a, dict) or 'ux' not in a: print(j['file'], j['w'], j['signed'], 'NO ACT', a); continue
        ux = a['ux']; tabs = a['tabs']
        sm = [x for x in ux['small'] if not x['inline']]
        c = collections.Counter((x['s'].split('>')[-1].split('.')[0:2] and '.'.join(x['s'].split('>')[-1].split('.')[0:2]), x['w'] // 4 * 4, x['h'] // 4 * 4) for x in sm)
        print('==', j['file'][:40], j['w'], j['signed'], 'small', len(sm), 'lt24', ux['smallLt24'], 'sx', ux['sx'], 'vw', ux['vw'])
        for k, n in c.most_common(12):
            ex = next(x for x in sm if '.'.join(x['s'].split('>')[-1].split('.')[0:2]) == k[0])
            print('   %3d %-55s %sx%s  e.g. "%s"' % (n, k[0][:55], k[1], k[2], ex['t'][:30]))
        bad = [t for t in tabs if t.get('hidden') or t.get('off') or not t.get('ring', True)]
        seq = [t['s'] for t in tabs]
        rep = [s for s, n in collections.Counter(seq).items() if n > 2]
        print('   tabs: first', [t['s'][:30] for t in tabs[:3]], 'hidden/off/noring', [(t['s'][:40], t.get('hidden'), t.get('off'), t.get('ring')) for t in bad][:8], 'repeats>2', rep[:5])
