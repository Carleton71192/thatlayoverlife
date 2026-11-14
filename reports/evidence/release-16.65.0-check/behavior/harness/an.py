import json, sys, statistics as S, collections
B = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/check1665-behavior/out/'
files = sys.argv[1:] or ['stories.jsonl', 'restore.jsonl', 'other.jsonl']
G = collections.OrderedDict()
for f in files:
    try:
        for l in open(B + f):
            d = json.loads(l); G.setdefault((d['case'], d['host']), []).append(d)
    except FileNotFoundError: pass
med = lambda a: round(S.median(a), 4) if a else None
def lay(d):
    return json.dumps({k: v for k, v in (d.get('lay') or {}).items() if k != 'footer'}, sort_keys=True)
out = []
hdr = '| case | host | loads | core | CLS 4 s median | CLS max | loads > 0.1 | LCP median ms | FCP median ms | page errors | failed scripts | early style at first frame / gone at end | holds seen / left at end | avatar (w x h, radius) | hero visible at end | Receipts line | final layouts |'
print(hdr); print('|' + '---|' * hdr.count('|')[:-1] if False else '|' + '---|' * (hdr.count('|') - 1))
summ = {}
for (c, h), L in G.items():
    cls = [d['cls4'] for d in L]
    core = sorted(set(','.join(d['core']) for d in L))
    es1 = sum(1 for d in L if d['es']['atFirstRaf']); esEnd = sum(1 for d in L if d['esEnd'])
    hs = sum(1 for d in L if d['waitSeen']); hl = sum(1 for d in L if d['waitEnd'])
    av = collections.Counter('%sx%s %s img %s' % (d['avatar']['w'], d['avatar']['h'], d['avatar']['radius'], d['avatar']['img']) if d['avatar'] else '-' for d in L)
    hv = sum(1 for d in L if d['heroVis'] and d['heroVis']['vis'] and d['heroVis']['h'] > 0 and d['heroVis']['nw'] > 0)
    hvN = sum(1 for d in L if d['heroVis'])
    rc = sum(1 for d in L if d['rcptLine'])
    errs = sum(len(d['errs']) for d in L); sb = sum(len(d['scriptBad']) for d in L)
    lays = collections.Counter(lay(d) for d in L)
    lcp = [d['lcpT'] for d in L if d['lcpT'] is not None]; fcp = [d['fcp'] for d in L if d['fcp'] is not None]
    row = dict(loads=len(L), core=core, clsMed=med(cls), clsMax=max(cls), over=sum(1 for x in cls if x > 0.1), lcpMed=med(lcp), fcpMed=med(fcp), errs=errs, scriptBad=sb,
               es=f'{es1}/{len(L)} first, {esEnd} at end', holds=f'{hs} seen, {hl} left', avatar=dict(av), hero=f'{hv}/{hvN}' if hvN else '-', rcpt=f'{rc}/{len(L)}', layouts=len(lays),
               cls=cls, lcpEl=dict(collections.Counter(d['lcpEl'] for d in L)), blocked=sorted(set(b for d in L for b in d['blocked'])))
    summ[c + ' ' + h] = row
    print(f"| {c} | {h} | {len(L)} | {'/'.join(core)} | {row['clsMed']} | {row['clsMax']} | {row['over']} | {row['lcpMed']} | {row['fcpMed']} | {errs} | {sb} | {row['es']} | {row['holds']} | {'; '.join(f'{k} ({v})' for k, v in av.items())} | {row['hero']} | {row['rcpt']} | {len(lays)} |")
# final layout equal between hosts?
print()
for c in sorted(set(k[0] for k in G)):
    a = collections.Counter(lay(d) for d in G.get((c, 'www'), [])); b = collections.Counter(lay(d) for d in G.get((c, 'test'), []))
    print(c, 'www layouts', len(a), 'test layouts', len(b), 'shared', len(set(a) & set(b)), 'top equal', (a.most_common(1)[0][0] == b.most_common(1)[0][0]) if a and b else None)
json.dump(summ, open(B + 'summary.json', 'w'), indent=1)
