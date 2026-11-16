import json,sys,statistics as stt
from collections import defaultdict,Counter
rows=[json.loads(l) for f in sys.argv[1:] for l in open(f)]
rows=[r for r in rows if not r.get('err')]
for r in rows: r['clsx']=r['cls']; r['cls']=round(sum(e['v'] for e in r['sh']),5)
cells=defaultdict(list)
for r in rows: cells[(r['page'],r['w'],r['v'])].append(r)
def med(a): a=[x for x in a if x is not None]; return stt.median(a) if a else None
def short(p): return ' > '.join(p.split(' > ')[-2:])[-80:]
out=[]
for k,rs in cells.items():
    cl=[r['cls'] for r in rs]
    sig=Counter(); ex={}
    for r in rs:
        for s in r['sh']:
            if s['v']<=0.005: continue
            top=sorted(s['src'],key=lambda x:-(x[1][2]*x[1][3]))[:2]
            g=(s['rs'], short(top[0][0]) if top else '?')
            sig[g]+=1; ex.setdefault(g,[]).append((s['t'],s['v'],r['dcl']))
    out.append((stt.median(cl),k,len(rs),max(cl),sum(c>0.1 for c in cl),med([r['fcp'] for r in rs]),med([r['lcpT'] for r in rs]),med([r['dcl'] for r in rs]),sig,ex))
out.sort(key=lambda x:(-x[0],-x[3]))
for m,k,n,mx,o,fcp,lcp,dcl,sig,ex in out:
    print(f"{k[0]:9} {k[1]:4} {k[2]:12} n{n} med {m:.4f} max {mx:.4f} >0.1 {o}  fcp {fcp} lcp {lcp} dcl {dcl}")
    for g,c in sig.most_common(6):
        e=ex[g]; print(f"      {c}x {g[0]} {g[1]}  t~{int(med([x[0] for x in e]))} v~{med([x[1] for x in e]):.4f}")
