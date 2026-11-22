import json, sys
S = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov22/check-2'
flt = sys.argv[1] if len(sys.argv) > 1 else ''
for l in open(S + '/results/bt2.jsonl'):
    j = json.loads(l); a = j.get('act')
    if not j['name'].startswith(flt): continue
    extra = ''
    if j['name'].startswith('N3'):
        a = dict(a); sh = a.pop('shifts', None); extra = ' clsLoad %s cls %s shifts %s' % (j['perfLoad']['cls'], j['perf']['cls'], json.dumps(sh)[:160])
    print(j['name'], j['v'], j['run'], 'errs', len(j['errs']), 'cons', len(j['cons']), json.dumps(a)[:420], extra, j.get('navErr', ''))
