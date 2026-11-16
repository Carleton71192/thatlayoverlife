"""Make bisect variants: core or chunk with one layer dropped (from its /* src/... */ marker to the next marker).
python3 mkvar.py core-drop <layer-substr> out.js   |  chunk-drop <chunk> <layer-substr> out.js  | core-nosri out.js"""
import sys,re
R='/home/user/thatlayoverlife/src/site-layers/'
def drop(text,sub):
    L=text.split('\n'); idx=[i for i,l in enumerate(L) if l.startswith('/* src/')]
    st=[i for i in idx if sub in L[i]]; assert len(st)==1,(sub,st)
    s=st[0]; nx=[i for i in idx if i>s]; e=nx[0] if nx else None
    if e is None: raise SystemExit('last layer: give explicit end')
    return '\n'.join(L[:s]+['/* dropped '+L[s][3:-3]+' */']+L[e:])
def nosri(t):
    a="s.setAttribute('integrity',g);"; assert t.count(a)==1; return t.replace(a,'')
cmd=sys.argv[1]
if cmd=='core-drop': t=nosri(drop(open(R+'tll-site-layers-v16.js').read(),sys.argv[2])); open(sys.argv[3],'w').write(t)
elif cmd=='core-nosri': open(sys.argv[2],'w').write(nosri(open(R+'tll-site-layers-v16.js').read()))
elif cmd=='chunk-drop': t=drop(open(R+'chunks/'+sys.argv[2]+'.js').read(),sys.argv[3]); open(sys.argv[4],'w').write(t)
