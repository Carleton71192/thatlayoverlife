import json,sys
thr=float(sys.argv[2]) if len(sys.argv)>2 else 0.005
for l in open(sys.argv[1]):
    r=json.loads(l)
    if r.get('err'): print('ERR',r['page'],r['w'],r['err']); continue
    big=[s for s in r['sh'] if s['v']>thr]
    if not big: continue
    print('==',r['page'],r['w'],r['v'],'run',r['run'],'cls',r['cls'],'dcl',r['dcl'],'load',r['loadT'],'fcp',r['fcp'])
    for s in big:
        print('  t',s['t'],s['rs'],'v',s['v'],'inpflag' if s['inp'] else '')
        for p,a,b in s['src']: print('     ',p[-110:],a,'->',b)
