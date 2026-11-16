import json,csv,statistics as stt,re,sys,os
from collections import defaultdict
sys.path.insert(0,'/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov16/survey/bin')
D='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov16/survey'
OUT=sys.argv[1]
import importlib.util
spec=importlib.util.spec_from_file_location('bis',D+'/bin/bis.py')
PATHS={'home':'/','stories':'/stories','travelers':'/travelers','layovers':'/layovers','map':'/the-map','expats':'/for-expats','paw':'/the-paw-passport','about':'/about','cookies':'/cookies','account':'/account','submit':'/submit','login':'/login','signup':'/signup','profile':'/contributors/<profile>'}
LAB={'html=p-nonavout.json':'site head navOut off','html=p-nomm.json':'site head mobile nav off','html=p-nowm.json':'site head wordmark off','html=p-nogreys.json':'site head greys timer off','core=core-noph.js':'core without page-heroes','core=core-nosignup.js':'core without ux-1028 nav signup size','core=core-nosri.js':'local core, no SRI (control)','html=p-nopf5hero.json':'profile hero() off','html=p-pf5now.json':'profile script run at once','nocore':'core blocked','nochunk':'chunks blocked','nows':'Webflow-hosted custom scripts blocked','nofonts':'web fonts blocked','noms':'Memberstack blocked','nowfjs':'webflow.js, jQuery, GSAP blocked','hoist':'body styles moved to head','nomobile':'isMobile off','notouch':'hasTouch off','base':'live','cpu=4':'CPU 4x slower','trace':'live, frame trace','trace=5000':'live, frame trace'}
def lab(v): return ' + '.join(LAB.get(p,p) for p in v.replace(D+'/var/','').split('+'))
SENS=re.compile(os.environ.get('TLL_SCRUB','^$^'),re.I)  # names are kept out of the repo: set TLL_SCRUB to a regex of names to mask
rows=[]
for f in ['base','bis','bis2','bis3','bis4']:
    for l in open(D+'/out/'+f+'.jsonl'):
        r=json.loads(l); r['batch']=f; r['cls_all']=round(sum(e['v'] for e in r['sh']),5); r['cls_noinp']=round(sum(e['v'] for e in r['sh'] if not e['inp']),5); r['label']=lab(r['v']); rows.append(r)
def short(p): return ' > '.join(p.split(' > ')[-2:])
def clean(s): return SENS.sub('<x>',s)
with open(OUT+'/loads.csv','w',newline='') as fh:
    w=csv.writer(fh); w.writerow(['batch','page','path','width','variant','run','utc','cls','cls_without_input_flagged','shifts','shifts_over_0.005','largest_shift','largest_shift_t_ms','largest_shift_phase','fcp_ms','lcp_ms','dcl_ms','load_ms','core_pin','aborted_images','page_errors','box_hash'])
    for r in rows:
        sh=r['sh']; big=max(sh,key=lambda s:s['v']) if sh else None
        w.writerow([r['batch'],r['page'],PATHS[r['page']],r['w'],r['label'],r['run'],r['at'],r['cls_all'],r['cls_noinp'],len(sh),sum(s['v']>0.005 for s in sh),big and big['v'],big and big['t'],big and {'l':'parsing','i':'after DCL','c':'after load'}[big['rs']],r['fcp'],r['lcpT'],r['dcl'],r['loadT'],' '.join(r['core']),len(r['blocked']),len(r['errs']),r['bh']])
def med(a):
    a=[x for x in a if x is not None]; return stt.median(a) if a else None
cells=defaultdict(list)
for r in rows: cells[(r['page'],r['w'],r['label'])].append(r)
def cell(k,rs):
    cl=[r['cls_all'] for r in rs]; sig=defaultdict(list)
    for r in rs:
        for s in r['sh']:
            if s['v']<=0.005: continue
            top=sorted(s['src'],key=lambda x:-(x[1][2]*x[1][3]))
            sig[({'l':'parsing','i':'after DCL','c':'after load'}[s['rs']],clean(short(top[0][0])) if top and top[0][0] else '(text)')].append({'t':s['t'],'v':s['v'],'run':r['run'],'src':[[clean(a),b,c] for a,b,c in s['src']]})
    return {'page':k[0],'path':PATHS[k[0]],'width':k[1],'variant':k[2],'n':len(rs),'cls_median':round(stt.median(cl),4),'cls_max':round(max(cl),4),'over_0_1':sum(c>0.1 for c in cl),
      'cls_median_without_input_flagged':round(stt.median(r['cls_noinp'] for r in rs),4),'fcp_median':med([r['fcp'] for r in rs]),'lcp_median':med([r['lcpT'] for r in rs]),'dcl_median':med([r['dcl'] for r in rs]),'load_median':med([r['loadT'] for r in rs]),
      'aborted_images':len(set(b for r in rs for b in r['blocked'])),
      'shifts_over_0_005':[{'phase':g[0],'node':g[1],'loads':len(set(e['run'] for e in es)),'t_median_ms':med([e['t'] for e in es]),'v_median':med([e['v'] for e in es]),'v_max':max(e['v'] for e in es),'example_sources':es[0]['src']} for g,es in sorted(sig.items(),key=lambda kv:-sum(e['v'] for e in kv[1]))]}
base=[cell(k,rs) for k,rs in cells.items() if k[2]=='live' and rs[0]['batch']=='base']
base.sort(key=lambda c:(-c['cls_median'],-c['cls_max']))
var=[cell(k,rs) for k,rs in cells.items() if not (k[2]=='live' and rs[0]['batch']=='base') and 'trace' not in k[2]]
json.dump({'base':base,'variants':var},open(OUT+'/cells.tmp.json','w'),indent=1)
with open(OUT+'/table.tmp.md','w') as fh:
    fh.write('| rank | cell | CLS median | CLS max | loads > 0.1 | median without input-flagged entries | FCP median ms | LCP median ms | DCL median ms | shifts over 0.005 (phase, node, loads, median value) |\n|---|---|---|---|---|---|---|---|---|---|\n')
    for i,c in enumerate(base,1):
        s='; '.join(f"{x['phase']}, {x['node']}, {x['loads']} of {c['n']}, {x['v_median']:.4f}" for x in c['shifts_over_0_005'][:3]) or '-'
        fh.write(f"| {i} | {c['path']} {c['width']} | {c['cls_median']:.4f} | {c['cls_max']:.4f} | {c['over_0_1']} of {c['n']} | {c['cls_median_without_input_flagged']:.4f} | {c['fcp_median']:.0f} | {c['lcp_median']:.0f} | {c['dcl_median']:.0f} | {s} |\n")
    bm={(c['page'],c['width']):c['cls_median'] for c in base}
    fh.write('\n\n| cell | variant | n | CLS median | CLS max | live median |\n|---|---|---|---|---|---|\n')
    for c in sorted(var,key=lambda c:(c['page'],c['width'],c['cls_median'])):
        fh.write(f"| {c['path']} {c['width']} | {c['variant']} | {c['n']} | {c['cls_median']:.4f} | {c['cls_max']:.4f} | {bm.get((c['page'],c['width']),float('nan')):.4f} |\n")
print(len(rows),len(base),len(var))
