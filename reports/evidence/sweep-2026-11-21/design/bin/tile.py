#!/usr/bin/env python3
"""tile.py <shot.jpg> <y0> <y1> [cols] [outwidth]: cut a band of a tall screenshot into side-by-side columns."""
import sys, os
from PIL import Image
D='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-design'
src=sys.argv[1]; y0=int(sys.argv[2]); y1=int(sys.argv[3]); cols=int(sys.argv[4]) if len(sys.argv)>4 else 1; ow=int(sys.argv[5]) if len(sys.argv)>5 else 1400
im=Image.open(os.path.join(D,'shots',src)); W,H=im.size; y1=min(y1,H)
seg=(y1-y0+cols-1)//cols
out=Image.new('RGB',(W*cols+10*(cols-1),seg),'white')
for i in range(cols):
    a=y0+i*seg; b=min(a+seg,y1)
    if a>=b: break
    out.paste(im.crop((0,a,W,b)),(i*(W+10),0))
if out.width>ow: out=out.resize((ow,int(out.height*ow/out.width)))
p=os.path.join(D,'tiles',os.path.basename(src)[:-4]+'_%d_%d_%d.jpg'%(y0,y1,cols)); out.save(p,quality=70); print(p, out.size, 'src', (W,H))
