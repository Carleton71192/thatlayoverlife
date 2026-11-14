import json,sys,re
NOISE=re.compile(r'Memberstack\] Could not load the app|Failed to load resource: net::ERR_FAILED')
for f in sys.argv[1:]:
  for l in open(f):
    d=json.loads(l)
    tl=[r for r in d.get('tl',[]) if r[1] is not None]
    mut=[m[0] for m in d.get('mut',[])]
    hs=[r[1] for r in tl]
    shrink=None
    if tl and mut:
        t0=mut[0]; before=[r[1] for r in tl if r[0]<t0]; after=[r[1] for r in tl if r[0]>=t0]
        shrink=(before[-1] if before else None, min(after) if after else None, after[-1] if after else None)
    errs=[e for e in d.get('errs',[]) if not NOISE.search(e)]
    shs=[(s['v'],s['t'],s['src'][0][0] if s['src'] else '') for s in d.get('sh',[]) if s['v']>0.001]
    print(f"{d['case']:<28}{d['v']:<3}r{d['run']} cls={d['cls']:<8} core={d.get('core')} tH first/max/final={hs[0] if hs else None}/{max(hs) if hs else None}/{hs[-1] if hs else None} redraw(before,minAfter,final)={shrink} mut={mut[:3]} val={d.get('val')} low={d.get('valLow')} afterLib={d.get('valAfterLib')} prevHero={d.get('valPrevIsHero')} txt={d.get('valTxt')} shelf={d.get('shelf')} y={d.get('y')} cur={d.get('curacao')} self={d.get('selfFetch')} errs={errs} sbad={d.get('scriptBad')} sh={shs[:5]}")
