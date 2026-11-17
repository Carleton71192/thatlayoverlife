import json,re,difflib,sys
R={}
for f in sys.argv[1:]:
  for l in open(f):
    r=json.loads(l)
    if r.get('err'): print('ERR',r['page'],r['w'],r['err']); continue
    parts=r['v'].split('+'); core=[p for p in parts if p.startswith('core=')][0]
    v='+'.join(re.sub(r'^.*/(p-)?','',p).replace('.json','') if '=' in p else p for p in parts if not p.startswith(('core=','eval=')))
    R[(r['page'],r['w'],v or 'base','ctl' if '1666' in core else 'new')]=r
bad=0
for k in sorted(set(k[:3] for k in R)):
    a,b=R.get(k+('ctl',)),R.get(k+('new',))
    if not a or not b: print(k,'missing'); continue
    clean=lambda r:[x for x in r['ev'].split('\n')[2:] if not re.match(r'\s*<(iframe|script) ',x)]
    oa,ob=clean(a),clean(b)
    ha,hb=a['ev'].split('\n')[0].split(' '),b['ev'].split('\n')[0].split(' ')
    hd=[x for x in difflib.unified_diff(sorted(ha),sorted(hb),lineterm='',n=0) if not x.startswith(('---','+++','@@'))]
    d=[x for x in difflib.unified_diff(oa,ob,lineterm='',n=0) if not x.startswith(('---','+++','@@'))]
    ok=a['bh']==b['bh'] and oa==ob and not hd
    bad+=0 if ok else 1
    print('%-9s %5d %-22s boxes %s body %s head %s cls ctl/new %.4f %.4f errs %d %d'%(k[0],k[1],k[2][:22],a['bh']==b['bh'],oa==ob,hd or 'same',sum(e['v'] for e in a['sh']),sum(e['v'] for e in b['sh']),len(a['errs']),len(b['errs'])))
    for x in d[:6]: print('     ',x[:220])
print('cells',len(set(k[:3] for k in R)),'not equal',bad)
