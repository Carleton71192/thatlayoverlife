import json,sys,statistics as st
from collections import defaultdict
SP='SCRATCH/'
rows=[]
for f in sys.argv[1:]:
    for l in open(f):
        try: r=json.loads(l)
        except: continue
        if r.get('err'): print('ERR',r['page'],r['w'],r['err']); continue
        rows.append(r)
cells=defaultdict(list)
for r in rows:
    v=r['v'].replace(SP,'').replace('nov16/b/var/','').replace('core=','').replace('+trace','')
    r['all']=round(sum(e['v'] for e in r['sh']),5)
    cells[(r['page'],r['w'],v)].append(r)
def med(a):
    a=[x for x in a if x is not None]; return st.median(a) if a else None
for k in sorted(cells):
    rs=cells[k]; a=[r['all'] for r in rs]
    print(f"{k[0]:10}{k[1]:5} {k[2][:44]:44} n{len(rs)} med {med(a):.4f} max {max(a):.4f} >0.1:{sum(x>0.1 for x in a)} excl {med([r['cls'] for r in rs]):.4f} fcp {med([r['fcp'] for r in rs])} lcp {med([r['lcpT'] for r in rs])} dcl {med([r['dcl'] for r in rs])} bh {len(set(r['bh'] for r in rs))} errs {sum(len(r['errs']) for r in rs)}")
