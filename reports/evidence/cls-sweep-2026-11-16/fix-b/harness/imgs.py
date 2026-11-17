import json,sys,re
R={}
for f in sys.argv[1:]:
  for l in open(f):
    r=json.loads(l)
    if r.get('err'): continue
    parts=r['v'].split('+'); core=[p for p in parts if p.startswith('core=')][0]
    v='+'.join(re.sub(r'^.*/(p-)?','',p).replace('.json','') if '=' in p else p for p in parts if not p.startswith(('core=','eval=')))
    im=set(x[1] for x in r['rt'] if x[0]=='img' or re.search(r'\.(jpe?g|png|webp|avif|gif|svg)(\?|$)',x[1],re.I))
    R.setdefault((r['page'],r['w'],v or 'base','ctl' if '1666' in core else 'new'),[]).append((im,set(r.get('blocked') or [])))
for k in sorted(set(k[:3] for k in R)):
    a,b=R.get(k+('ctl',)),R.get(k+('new',))
    if not a or not b: continue
    ua=set().union(*[x[0] for x in a]); ub=set().union(*[x[0] for x in b]); ba=set().union(*[x[1] for x in a]); bb=set().union(*[x[1] for x in b])
    print('%-9s %5d %-16s imgs ctl %d new %d only-ctl %d only-new %d | aborted ctl %d new %d'%(k[0],k[1],k[2][:16],len(ua),len(ub),len(ua-ub),len(ub-ua),len(ba),len(bb)))
    for x in sorted(ua-ub)[:4]: print('    only ctl',x[-70:])
    for x in sorted(ub-ua)[:4]: print('    only new',x[-70:])
