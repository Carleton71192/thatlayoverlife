import re
d='/home/user/thatlayoverlife/src/pages/destinations/v3/'
orig=open(d+'orig/page-head-orig.html').read()
css=open(d+'ds3-destinations.css').read()
js=open(d+'ds3-destinations.js').read()
def mcss(s):
    head=s.split('\n',1)[0]  # keep first comment line
    body=s.split('\n',1)[1]
    body=re.sub(r'/\*.*?\*/','',body,flags=re.S)
    body=re.sub(r'\s*\n\s*','',body)
    body=re.sub(r'\s*([{};,>])\s*',r'\1',body)
    body=body.replace(';}','}')
    return head+'\n'+body
def mjs(s):
    out=[]
    for l in s.split('\n'):
        t=l.strip()
        if not t: continue
        if t.startswith('/*') and t.endswith('*/') and out: continue  # drop inner comment lines, keep header
        out.append(t)
    return '\n'.join(out)
block=('\n<script id="tll-d3-atlas-guard-v1">window.__tllAtlas=1</script>'
 '\n<style id="tll-ds3-destinations-v1">\n'+mcss(css)+'\n</style>'
 '\n<script id="tll-ds3-destinations-js-v1">\n'+mjs(js)+'\n</script>')
new=orig+block
assert new.startswith(orig)
assert all(ord(c)<128 for c in new), [c for c in new if ord(c)>127][:5]
open(d+'head-new.html','w').write(new)
open(d+'head-added-block.html','w').write(block)
print(len(orig),len(block),len(new))
