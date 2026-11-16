import json,re,difflib,sys
R={}
for l in open(sys.argv[1]):
    r=json.loads(l)
    v=re.sub(r'core=\S*?core-([\w.]+?)\.js\+?','',r['v']); v=re.sub(r'\+?eval=\S+','',v); v=v.split('/')[-1] or 'base'
    R[(r['page'],r['w'],v,'ctl' if '1666' in r['v'] else 'new')]=r
keys=sorted(set(k[:3] for k in R))
for k in keys:
    a,b=R.get(k+('ctl',)),R.get(k+('new',))
    if not a or not b: print(k,'missing'); continue
    clean=lambda r:[re.sub(r'class=tll-ph-in \| ','',x) for x in r['ev'].split('\n')[2:] if not re.match(r'\s*<(iframe|script) ',x)]
    oa,ob=clean(a),clean(b)
    ha,hb=a['ev'].split('\n')[0].split(' '),b['ev'].split('\n')[0].split(' ')
    hd=[x for x in difflib.unified_diff(sorted(ha),sorted(hb),lineterm='',n=0) if not x.startswith(('---','+++','@@'))]
    d=[x for x in difflib.unified_diff(oa,ob,lineterm='',n=0) if not x.startswith(('---','+++','@@'))]
    print(k,'boxes same',a['bh']==b['bh'],'docH',a['docH'],b['docH'],'body same',oa==ob,'head diff',hd,'cls ctl/new',round(sum(e['v'] for e in a['sh']),4),round(sum(e['v'] for e in b['sh']),4),'errs',len(a['errs']),len(b['errs']))
    for x in d[:6]: print('     ',x[:200])
