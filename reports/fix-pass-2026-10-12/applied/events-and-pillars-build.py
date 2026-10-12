A='/home/user/thatlayoverlife/reports/fix-pass-2026-10-12/applied/'
rd=lambda p:open(p,newline='',encoding='utf-8').read()
def wr(p,s): open(p,'w',newline='',encoding='utf-8').write(s)
# EDIT 1
f=rd(A+'site-footer-ga4-events-before.html')
tail="requestAnimationFrame(a))}}();\n</script>"
assert f.count(tail)==1 and f.endswith(tail)
assert f.count('tll-ga4-events-v1')==0
js=rd('ga4.js')
fa=f+'\n<script id="tll-ga4-events-v1">\n'+js+'</script>'
assert fa.startswith(f) and fa.count('<script id="tll-ga4-events-v1">')==1
wr(A+'site-footer-ga4-events-after.html',fa)
# EDIT 2
p=rd(A+'pillars-template-footer-before.html')
anchor="  if(ex){ex.style.display='block';n+=ex.querySelectorAll('.w-dyn-item').length;}\n"
assert p.count(anchor)==1
ins="  if(n<3&&slug!=='paw-passport'&&slug!=='stories-from-the-road'&&!document.querySelector('meta[name=\"robots\"]')){var rb=document.createElement('meta');rb.setAttribute('name','robots');rb.setAttribute('content','noindex, follow');document.head.appendChild(rb);}\n"
pa=p.replace(anchor,anchor+ins)
assert pa.count(ins)==1 and pa.replace(ins,'',1)==p
wr(A+'pillars-template-footer-after.html',pa)
# node --check every inline script in both AFTERs
import re,subprocess
for name,s in [('footer',fa),('pillar',pa)]:
    for i,m in enumerate(re.finditer(r'<script([^>]*)>(.*?)</script>',s,re.S)):
        if 'src=' in m.group(1): continue
        open('chk.js','w').write(m.group(2))
        r=subprocess.run(['node','--check','chk.js'],capture_output=True,text=True)
        print(name,i,m.group(1).strip() or '-', 'OK' if r.returncode==0 else r.stderr)
print(len(f),len(fa),len(p),len(pa))
