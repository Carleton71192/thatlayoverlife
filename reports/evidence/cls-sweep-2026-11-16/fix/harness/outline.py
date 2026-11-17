import re,sys
h=open(sys.argv[1],encoding='utf-8').read()
bi=h.index('<body')
for m in re.finditer(r'<(script|style|link)\b([^>]*)>',h):
    tag,attrs=m.group(1),m.group(2)
    if tag=='link' and 'stylesheet' not in attrs and 'preload' not in attrs: continue
    end=h.find('</'+tag+'>',m.end()) if tag!='link' else m.end()
    idm=re.search(r'id="([^"]*)"',attrs); src=re.search(r'(?:src|href)="([^"]*)"',attrs)
    print(('HEAD' if m.start()<bi else 'BODY'),m.start(),tag,(idm.group(1) if idm else ''),(src.group(1)[-70:] if src else ''),end-m.end(), ('defer' if 'defer' in attrs else '')+('async' if 'async' in attrs else ''))
print('len',len(h),'body at',bi)
