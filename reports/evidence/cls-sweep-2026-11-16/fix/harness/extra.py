"""Smaller sets for fix.md. python3 extra.py <outdir> [tag]  reads out/split.jsonl, fail5.jsonl, tall5.jsonl, more.jsonl and out/n5/scroll.jsonl; writes extra.md"""
import json,sys,re,os,statistics as st,difflib
from collections import defaultdict
A=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out=sys.argv[1]; NEW=sys.argv[2] if len(sys.argv)>2 else 'n7'
NAME={'travelers':'/travelers','map':'/the-map','expats':'/for-expats','about':'/about'}
def load(f,new=NEW):
    R=[]
    if not os.path.exists(f): return R
    for l in open(f):
        r=json.loads(l)
        if r.get('err'): continue
        r['k']='ctl' if 'core-1666' in r['v'] else 'new'; r['all']=round(sum(e['v'] for e in r['sh']),4); R.append(r)
    return R
md=['# Layout shift sweep, part A: the smaller sets (16 November 2026)','','Same harness and rules as the tables in fix.md. Control = live 16.66.0 core routed from a local copy, new = the 16.67.0 core. CLS counts every entry.','']
# parser held
SPL={'trav-a':'/travelers, inside the hero before the eyebrow','trav-b':'/travelers, inside the hero before the lede','trav-c':'/travelers, before the chip row',
     'map-a':'/the-map, inside the hero before the eyebrow','map-b':'/the-map, inside the hero before the counter','map-c':'/the-map, after the map mount, before the legend',
     'expats-a':'/for-expats, inside the hero before the buttons','expats-b':'/for-expats, after the hero','about-a':'/about, inside the hero before the intro','about-b':'/about, after the hero'}
C=defaultdict(dict)
for r in load(os.path.join(A,'out','split.jsonl')):
    v=re.search(r'p-split-([\w-]+)\.json',r['v']).group(1); C[(v,r['w'])][r['k']]=r
md+=['## Parser held for 350 ms at one point of the page (a paint lands there), one load each','','| point | width | control | new | boxes equal |','|---|---|---|---|---|']
for v in SPL:
    for w in (390,1440):
        c=C.get((v,w),{})
        if 'ctl' in c and 'new' in c: md.append('| %s | %d | %.4f | %.4f | %s |' % (SPL[v],w,c['ctl']['all'],c['new']['all'],'yes' if c['ctl']['bh']==c['new']['bh'] else 'no'))
md.append('')
# failure cases
FL={'p-tvthrow.json':'/travelers page script throws when it starts','p-tvrunthrow.json':'/travelers page script throws before it writes a verb','nochunk':'/travelers chunk does not load','rm':'/travelers with reduced motion',
    'noscript=tll-map-layers.js':'/the-map map code does not load','p-noinvite.json':'/the-map without the invite script'}
C=defaultdict(dict)
for r in load(os.path.join(A,'out','fail5.jsonl')):
    v=re.sub(r'core=\S*?core-[\w.]+?\.js\+?','',r['v']); v=re.sub(r'\+?eval=\S+','',v).split('/')[-1]
    C[(v,r['w'])].setdefault(r['k'],[]).append(r)
def body(r): return [re.sub(r'class=tll-ph-in \| ','',x) for x in r['ev'].split('\n')[2:] if not re.match(r'\s*<(iframe|script) ',x)]
md+=['## Failure cases, control against new','','| case | width | loads | control CLS | new CLS | boxes equal | body tree equal |','|---|---|---|---|---|---|---|']
for v in FL:
    for w in (390,1440):
        c=C.get((v,w),{})
        if 'ctl' not in c or 'new' not in c: continue
        a,b=c['ctl'],c['new']
        bx=all(x['bh']==a[0]['bh'] for x in a+b); bd=all(body(x)==body(a[0]) for x in a+b)
        md.append('| %s | %d | %d + %d | %s | %s | %s | %s |' % (FL[v],w,len(a),len(b),', '.join('%.4f'%x['all'] for x in a),', '.join('%.4f'%x['all'] for x in b),'yes' if bx else 'no','yes' if bd else 'no'))
md.append('')
# tall
C=defaultdict(lambda: defaultdict(list))
for r in load(os.path.join(A,'out','tall5.jsonl')): C[(r['page'],r['w'],r['h'])][r['k']].append(r['all'])
md+=['## Other screen sizes, one load each','','| page | screen | control | new |','|---|---|---|---|']
for k in sorted(C): md.append('| %s | %dx%d | %s | %s |' % (NAME[k[0]],k[1],k[2],', '.join('%.4f'%x for x in C[k]['ctl']),', '.join('%.4f'%x for x in C[k]['new'])))
md.append('')
# more
M=load(os.path.join(A,'out','more.jsonl'))
def vals(f,k): return sorted(r['all'] for r in M if f(r) and r['k']==k)
md+=['## /the-map 1440, the title and its two font files','','| set | control | new |','|---|---|---|']
md.append('| standard, 6 more loads each | %s | %s |' % (', '.join('%.4f'%x for x in vals(lambda r:r['page']=='map' and re.search(r'core-[\w.]+\.js$',r['v']) is not None,'ctl')),', '.join('%.4f'%x for x in vals(lambda r:r['page']=='map' and re.search(r'core-[\w.]+\.js$',r['v']) is not None,'new'))))
md.append('| with a per-frame trace of the title, 6 loads each | %s | %s |' % (', '.join('%.4f'%x for x in vals(lambda r:'init-h1' in r['v'],'ctl')),', '.join('%.4f'%x for x in vals(lambda r:'init-h1' in r['v'],'new'))))
md.append('| web fonts blocked, 5 loads each | %s | %s |' % (', '.join('%.4f'%x for x in vals(lambda r:'nofonts' in r['v'],'ctl')),', '.join('%.4f'%x for x in vals(lambda r:'nofonts' in r['v'],'new'))))
md.append('')
C=defaultdict(lambda: defaultdict(list))
for r in M:
    if 'cpu=4' in r['v']: C[(r['page'],r['w'])][r['k']].append(r)
md+=['## CPU 4x, 5 more loads a cell (first paint)','','| cell | FCP control (ms, sorted) | FCP new | median control / new | CLS median control / new |','|---|---|---|---|---|']
for k in sorted(C):
    a,b=C[k]['ctl'],C[k]['new']
    md.append('| %s %d | %s | %s | %d / %d | %.4f / %.4f |' % (NAME[k[0]],k[1],', '.join(str(x['fcp']) for x in sorted(a,key=lambda x:x['fcp'])),', '.join(str(x['fcp']) for x in sorted(b,key=lambda x:x['fcp'])),st.median(x['fcp'] for x in a),st.median(x['fcp'] for x in b),st.median(x['all'] for x in a),st.median(x['all'] for x in b)))
md.append('')
S=load(os.path.join(A,'out','n5','scroll.jsonl'))
if S:
    md+=['## /the-map 390, scrolled to the map 2.5 s after load (one load each, an earlier build of this branch)','','| core | CLS | the entry after the scroll |','|---|---|---|']
    for r in S:
        e=[x for x in r['sh'] if x['t']>2400 and x['v']>0.002]
        md.append('| %s | %.4f | %s |' % ('control' if r['k']=='ctl' else 'new',r['all'],'; '.join('%.4f at %d ms, the map sheet %s to %s' % (x['v'],x['t'],x['src'][0][1],x['src'][0][2]) for x in e)))
    md.append('')
open(os.path.join(out,'extra.md'),'w').write('\n'.join(md)+'\n'); print('\n'.join(md))
