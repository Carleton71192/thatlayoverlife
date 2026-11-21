import json, sys
S='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/leftover-build'
def one(s):
    v=s['view']; d=s['draft']
    four=[k for k in ['name','excerpt','body','country'] if v.get(k)]
    w=sum(1 for c in s['ms'] if c[1]=='updateMemberJSON')
    return 'form=%s restored=%s sent=%s local=%s acct=%s writes=%d save="%s"' % (','.join(four) or 'empty', v['restoredOffer'], v['alreadySent'], d['browser'] or '-', (d['account'] or {}).get('keys','-') if d['account'] else '-', w, (v['save'] or '')[:70])
for l in open(S+'/out/results.jsonl'):
    r=json.loads(l)
    print('##', r['variant'], r['scen'], r['ms'], r['vp'], 'posts', len(r['posts']), 'pageErr', len(r['pageErr']), 'misses', len(r['misses']))
    print('   load   ', one(r['first']))
    if r.get('firstAfter20'): print('   +20s   ', one(r['firstAfter20']))
    for i,v in enumerate(r['visits']):
        if isinstance(v,dict) and 'view' in v: print('   visit%d ' % (i+2), v.get('tag',''), one(v))
        elif isinstance(v,dict):
            for k,x in v.items():
                if isinstance(x,dict) and 'view' in x: print('   v%d.%s ' % (i+2,k), one(x))
