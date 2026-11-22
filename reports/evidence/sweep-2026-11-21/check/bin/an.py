"""Analyse results/ab.jsonl and results/sig: perf, errors, measures, and the page-equality diff (live vs branch)."""
import json, gzip, os, sys, statistics as S, collections, re
C = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-check/results'
rows = [json.loads(l) for l in open(os.path.join(C, 'ab.jsonl'))]
G = collections.defaultdict(list)
for r in rows: G[(r['file'], r['w'], r['signed'], r['v'])].append(r)
out = {'perf': [], 'errs': [], 'measures': {}, 'sig': {}}
med = lambda xs: S.median(xs) if xs else None
pages = sorted({(r['file'], r['w'], r['signed']) for r in rows}, key=lambda k: (k[0], k[1]))
for (f, w, s) in pages:
    L, B = G[(f, w, s, 'live')], G[(f, w, s, 'br')]
    if not L or not B: continue
    g = lambda R, k1, k2: [x[k1][k2] for x in R if x.get(k1) and x[k1].get(k2) is not None]
    p = dict(page=f, w=w, signed=s, n=(len(L), len(B)),
             cls_live=med(g(L, 'perf', 'cls')), cls_br=med(g(B, 'perf', 'cls')),
             clsload_live=med(g(L, 'perfLoad', 'cls')), clsload_br=med(g(B, 'perfLoad', 'cls')),
             fcp_live=med(g(L, 'perfLoad', 'fcp')), fcp_br=med(g(B, 'perfLoad', 'fcp')),
             cls_live_all=g(L, 'perf', 'cls'), cls_br_all=g(B, 'perf', 'cls'), fcp_live_all=g(L, 'perfLoad', 'fcp'), fcp_br_all=g(B, 'perfLoad', 'fcp'),
             bytes_live=L[0]['localBytes'], bytes_br=B[0]['localBytes'], chunks_live=L[0]['m'].get('chunks') if L[0].get('m') else None, chunks_br=B[0]['m'].get('chunks') if B[0].get('m') else None)
    p['dcls'] = round(p['cls_br'] - p['cls_live'], 4) if p['cls_br'] is not None and p['cls_live'] is not None else None
    p['dfcp'] = (p['fcp_br'] - p['fcp_live']) if p['fcp_br'] is not None and p['fcp_live'] is not None else None
    out['perf'].append(p)
    el = collections.Counter(e for x in L for e in x['errs'] + x['cons']); eb = collections.Counter(e for x in B for e in x['errs'] + x['cons'])
    new = [e for e in eb if e not in el]; gone = [e for e in el if e not in eb]
    out['errs'].append(dict(page=f, w=w, pageerr_live=sum(len(x['errs']) for x in L), pageerr_br=sum(len(x['errs']) for x in B), cons_live=sum(len(x['cons']) for x in L), cons_br=sum(len(x['cons']) for x in B),
                            new=new, gone=gone, bad_br=sorted({b for x in B for b in x['bad']} - {b for x in L for b in x['bad']}), nav=[x.get('navErr') for x in L + B if x.get('navErr')], nonGet=sum(x['nonGet'] for x in L + B)))
    mL, mB = L[0].get('m') or {}, B[0].get('m') or {}
    out['measures']['%s %s %s' % (f, w, s)] = {k: {'live': mL.get(k), 'br': mB.get(k)} for k in sorted(set(mL) | set(mB)) if json.dumps(mL.get(k)) != json.dumps(mB.get(k))}
    # page equality from signatures
    def sigs(R): return [json.load(gzip.open(os.path.join(C, 'sig', x['sigFile']))) for x in R if x.get('sigFile') and os.path.exists(os.path.join(C, 'sig', x['sigFile']))]
    SL, SB = sigs(L), sigs(B)
    if not SL or not SB: continue
    def stable(Ss, k, fld):
        vals = [json.dumps(x[k][fld]) if k in x else None for x in Ss]
        return vals[0] if len(set(vals)) == 1 else 'NOISE'
    keys = set().union(*[set(x) for x in SL + SB])
    ch = collections.Counter(); ex = collections.defaultdict(list); boxn = 0; only_br = []; only_live = []; noise = 0
    for k in keys:
        inL = all(k in x for x in SL); inB = all(k in x for x in SB); anyL = any(k in x for x in SL); anyB = any(k in x for x in SB)
        if inB and not anyL: only_br.append(k); continue
        if inL and not anyB: only_live.append(k); continue
        if not (inL and inB): noise += 1; continue
        for fld in ('s', 't', 'a'):
            a, b = stable(SL, k, fld), stable(SB, k, fld)
            if 'NOISE' in (a, b): continue
            if a != b:
                leaf = re.sub(r'#\d+$', '', k.split('>')[-1]); ch[(fld, leaf)] += 1
                if len(ex[(fld, leaf)]) < 2: ex[(fld, leaf)].append((k[-90:], json.loads(a), json.loads(b)))
        a, b = stable(SL, k, 'b'), stable(SB, k, 'b')
        if 'NOISE' not in (a, b) and a != b: boxn += 1
    out['sig']['%s %s %s' % (f, w, s)] = dict(elements=len(keys), boxChanged=boxn, onlyBr=len(only_br), onlyLive=len(only_live), unstable=noise,
        onlyBrEx=[re.sub(r'#\d+$', '', k.split('>')[-1]) for k in only_br][:12], onlyLiveEx=[re.sub(r'#\d+$', '', k.split('>')[-1]) for k in only_live][:12],
        changed=[dict(field=fl, el=lf, n=n, ex=ex[(fl, lf)]) for (fl, lf), n in ch.most_common(40)])
json.dump(out, open(os.path.join(C, 'an.json'), 'w'), indent=1, ensure_ascii=False)
for p in out['perf']:
    print('%-58s %4d %s n=%s cls %.4f->%.4f (d %+.4f) load %.4f->%.4f fcp %s->%s (d %s) bytes %d->%d' % (p['page'][:58], p['w'], p['signed'], p['n'], p['cls_live'], p['cls_br'], p['dcls'], p['clsload_live'], p['clsload_br'], p['fcp_live'], p['fcp_br'], p['dfcp'], p['bytes_live'], p['bytes_br']))
