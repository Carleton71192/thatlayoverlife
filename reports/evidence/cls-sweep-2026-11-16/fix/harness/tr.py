import json,sys
f,pg,w=sys.argv[1],sys.argv[2],int(sys.argv[3]); depth=int(sys.argv[4]) if len(sys.argv)>4 else 1
for l in open(f):
    r=json.loads(l)
    if 'trace' not in r['v'] or r['page']!=pg or r['w']!=w: continue
    print('shifts',[(s['t'],s['rs'],s['v']) for s in r['sh'] if s['v']>0.002],'dcl',r['dcl'],'load',r['loadT'],'fcp',r['fcp'])
    prev={}
    for t,rs,L in r['trace']:
        cur={}
        for x in L:
            ind=(len(x)-len(x.lstrip()))//2
            if ind>depth: continue
            k,v=x.strip().rsplit(':',1); cur[(ind,k)]=v
        ch=[(k,prev.get(k),v) for k,v in cur.items() if prev.get(k)!=v]
        print(t,rs,'; '.join(f"{'  '*k[0]}{k[1][-45:]} {a}->{b}" for k,a,b in ch)[:1200])
        prev=cur
