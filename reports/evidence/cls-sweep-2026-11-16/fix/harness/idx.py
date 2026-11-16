import json,os,glob,sys,re
S='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad'
dirs=sorted(set(os.path.dirname(p) for p in glob.glob(S+'/nov1[1-6]/**/*.b',recursive=True)))
idx={}
for d in dirs:
    for f in os.listdir(d):
        if f.endswith('.json') and os.path.exists(os.path.join(d,f[:-5]+'.b')):
            try: m=json.load(open(os.path.join(d,f)))
            except Exception: continue
            if isinstance(m,dict) and m.get('u') and m['u'] not in idx: idx[m['u']]=os.path.join(d,f[:-5])
json.dump(idx,open(S+'/nov16/a/cache-index.json','w'))
print(len(dirs),'dirs',len(idx),'urls')
from collections import Counter
c=Counter()
for u in idx:
    h=re.sub(r'^https?://([^/]+)/.*',r'\1',u); ext=(re.search(r'\.([a-z0-9]{2,5})(\?|$)',u.split('?')[0].lower()) or [None,'-'])[1]; c[(h,ext)]+=1
for k,v in sorted(c.items()): print(k,v)
