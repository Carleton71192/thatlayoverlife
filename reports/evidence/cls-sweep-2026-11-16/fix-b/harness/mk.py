#!/usr/bin/env python3
# mk.py out.json n core[,core2] page:w[:h] ... [+variant]   -> jobs file
import sys,json
B='B'
out,n,cores=sys.argv[1],int(sys.argv[2]),sys.argv[3].split(',')
extra=''.join(a for a in sys.argv[4:] if a.startswith('+'))
j=[]
for a in sys.argv[4:]:
    if a.startswith('+'): continue
    p=a.split(':'); w=int(p[1]); h=int(p[2]) if len(p)>2 else (900 if w>=800 else (800 if w==360 else 844))
    for c in cores: j.append(dict(page=p[0],w=w,h=h,v='core=%s/var/core-%s.js%s'%(B,c,extra),n=n))
json.dump(j,open(out,'w'))
print(len(j),'jobs')
