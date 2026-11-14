import re,sys,difflib
def n(s):
    s=s.replace('https://that-layover-life.webflow.io','https://www.thatlayover.life').replace('that-layover-life.webflow.io','www.thatlayover.life')
    s=re.sub(r'data-wf-[a-z-]+="[^"]*"','',s)
    s=re.sub(r'<!-- Last Published:[^>]*-->','',s)
    s=s.replace('6ec769bb8fa05d21a459b6d106652854754c4c37','PIN').replace('1f2e549aee8627b2f67211463f764380f751c17b','PIN')
    s=s.replace('sha384-m7ORNXLxTadunuYNZM0nrBKIxd+Elr5YS7LL+uIj29kh3sEjfUdQgEhayOdjrEvr','SRI').replace('sha384-H+oSdrkcwOOlCvbyOd9Xm+EvqvWHK8Z0lJRpRfsE//z/ZWm7d2GXDxMktP77zztd','SRI')
    s=re.sub(r'tllfactsv1-1\.[01]\.0\.js','tllfactsv1.js',s)
    s=re.sub(r'/[0-9a-f]{24}/[0-9a-f]{24}%2Ftllfactsv1|[0-9a-f]{24}%2F[0-9a-f]{24}%2Ftllfactsv1','FACTS',s)
    s=re.sub(r'(src="[^"]*tllfactsv1\.js")[^>]*', r'\1', s)
    return re.sub(r'>\s*<','>\n<',s).split('\n')
for k in sys.argv[1:]:
    a=n(open(f'raw/www/{k}.html').read()); b=n(open(f'raw/test/{k}.html').read())
    d=[l for l in difflib.unified_diff(a,b,lineterm='',n=0) if not l.startswith(('---','+++','@@'))]
    print('==',k,len(d),'changed lines')
    for l in d: print('  ',l[:260])
