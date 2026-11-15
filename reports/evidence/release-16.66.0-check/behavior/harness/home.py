import json, itertools, collections
B = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov15/check1666-behavior/'
R = [json.loads(l) for l in open(B + 'out/other.jsonl')]
bx = lambda h: open(B + 'boxes/' + h + '.txt').read().split('\n')
out = {}
for w in (390, 1440):
    L = [d for d in R if d['page'] == 'home' and d['w'] == w]
    W = [bx(d['bh']) for d in L if d['host'] == 'www']; T = [bx(d['bh']) for d in L if d['host'] == 'test']
    var = collections.defaultdict(set)
    for a, b in itertools.combinations(W, 2):
        if len(a) == len(b): var[len(a)] |= {i for i in range(len(a)) if a[i] != b[i]}
    res = []
    for t in T:
        best = None
        for a in W:
            if len(a) != len(t): continue
            d = {i for i in range(len(t)) if t[i] != a[i]}
            extra = d - var[len(t)]
            if best is None or len(extra) < len(best[1]): best = (d, extra)
        res.append(None if best is None else [len(best[0]), len(best[1])])
    ws = collections.Counter(len(a) for a in W); ts = collections.Counter(len(t) for t in T)
    # which boxes vary on www
    vi = sorted(set().union(*var.values()))
    out[w] = dict(wwwLengths=dict(ws), testLengths=dict(ts), wwwVaryingIdx=vi[:40], nVarying=len(vi), test_vs_best_www_diff_and_outside_www_variation=res)
print(json.dumps(out, indent=1))
json.dump(out, open(B + 'out/home-boxes.json', 'w'), indent=1)
