import json,sys,statistics as stt,re
from collections import defaultdict
D='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov16/survey'
def lab(v):
    v=v.replace(D+'/var/','')
    m={'html=p-nonavout.json':'site head navOut off','html=p-nomm.json':'site head mobile nav off','core=core-noph.js':'core without page-heroes','core=core-nosignup.js':'core without the ux-1028 nav signup size','core=core-nosri.js':'local core (control)','core=core-noux.js':'core without ux-1028','html=p-nopf5hero.json':'profile hero() off','html=p-pf5now.json':'profile script run at once','nocore':'core blocked','nochunk':'chunks blocked','nows':'Webflow-hosted page/site scripts blocked','nofonts':'web fonts blocked','noms':'Memberstack blocked','nowfjs':'webflow.js/jQuery/GSAP blocked','hoist':'body styles moved to head','nomobile':'isMobile off','notouch':'hasTouch off','base':'live (base)'}
    return ' + '.join(m.get(p,p) for p in v.split('+'))
rows=[json.loads(l) for f in sys.argv[1:] for l in open(f)]
rows=[r for r in rows if not r.get('err')]
C=defaultdict(lambda: defaultdict(list))
for r in rows:
    r['clsa']=round(sum(e['v'] for e in r['sh']),5); C[(r['page'],r['w'])][r['v']].append(r)
out=[]
for k in sorted(C):
    b=C[k].get('base')
    if not b or len(C[k])<2: continue
    bm=stt.median(x['clsa'] for x in b)
    print(f"== {k[0]} {k[1]}  base median {bm:.4f} (n{len(b)})")
    for v,rs in sorted(C[k].items(),key=lambda kv:stt.median(x['clsa'] for x in kv[1])):
        if v=='base': continue
        m=stt.median(x['clsa'] for x in rs)
        print(f"   {m:.4f} max {max(x['clsa'] for x in rs):.4f} n{len(rs)}  {lab(v)}")
        out.append({'page':k[0],'width':k[1],'variant':lab(v),'n':len(rs),'cls_median':round(m,5),'cls_max':max(x['clsa'] for x in rs),'base_median':round(bm,5)})
json.dump(out,open(D+'/out/bisect-cells.json','w'),indent=1)
