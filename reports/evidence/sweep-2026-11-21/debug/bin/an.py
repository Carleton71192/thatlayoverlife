import json,sys,os,collections
R='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-debug/results'
HARN=('challenges.cloudflare.com','client.memberstack.com')
agg=collections.defaultdict(list)
rows=[]
for f in sys.argv[1:]:
    for l in open(os.path.join(R,f)):
        j=json.loads(l); rows.append(j)
for j in rows:
    k=f"{j['page']} {j['w']} {j['signed']}"
    cons=[c for c in j['cons'] if c!='Failed to load resource: net::ERR_FAILED']
    failed=[x for x in j['failed'] if not any(h in x for h in HARN)]
    p=j.get('probe') or {}
    out={'errs':j['errs'],'cons':cons,'bad':j['bad'],'failed':failed,'worker':sorted(set(j['worker'])),'jsd':j['jsd'],'navErr':j.get('navErr'),'status':j.get('status'),
         'site':j['siteFetched'],'stand':j['stand'],
         'dup':p.get('dup'),'badHash':p.get('badHash'),'noAlt':p.get('imgNoAlt'),'emptyBig':p.get('imgEmptyBigN'),'emptyBigS':p.get('imgEmptyBig',[])[:3],'broken':p.get('imgBroken'),'emptyLinks':p.get('emptyLinks'),'hrefHash':[h for h in (p.get('hrefHash') or []) if 'Cookie settings' not in h],
         'unres':p.get('unresolved'),'lb':p.get('lbEmpty'),'fails':p.get('fails'),'overflow':(p.get('sx',0)-p.get('vw',0)) if p else None,'h1':p.get('h1'),'warns':[w for w in j['warns'] if 'tll' in w.lower() or 'error' in w.lower()][:4]}
    out={a:b for a,b in out.items() if b not in (None,[],0,{},'') or a in ('status',)}
    print(k, json.dumps(out)[:2500])
