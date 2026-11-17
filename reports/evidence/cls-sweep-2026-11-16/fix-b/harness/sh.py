import json,sys
f=sys.argv[1]; flt=sys.argv[2:] 
for l in open(f):
    r=json.loads(l)
    if flt and (r['page']!=flt[0] or (len(flt)>1 and str(r['w'])!=flt[1])): continue
    print('==',r['page'],r['w'],'run',r['run'],'all',round(sum(e['v'] for e in r['sh']),4),'fcp',r.get('fcp'),'dcl',r.get('dcl'),'load',r.get('loadT'),'lcp',r.get('lcpT'))
    for e in r['sh']:
        if e['v']<0.001: continue
        print('  t',e['t'],'v',e['v'],'inp',e['inp'],e['rs'])
        for s in e['src'][:5]: print('     ',s[0][-78:],s[1],'->',s[2])
