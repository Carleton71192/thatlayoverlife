# Builds passport-embed.html (the HtmlEmbed code) from passport-embed.src.html and countries.txt.
import io
rows=[l.split(' ',4) for l in io.open('countries.txt',encoding='utf-8').read().strip().split('\n')]
rows.append(['900','XK','XKX','E','Kosovo'])  # tllmapidsv1 code for Kosovo
data='|'.join(n+a2+a3+r+name for n,a2,a3,r,name in rows)
assert '"' not in data and '\\' not in data
src=io.open('passport-embed.src.html',encoding='utf-8').read()
out=src.replace('__DATA__',data)
io.open('passport-embed.html','w',encoding='utf-8').write(out)
print(len(rows),'rows; embed chars',len(out))
for w in ['—','–','ship','ledger','!','No filler','Truth over polish']:
    txt=out.split('<script')[0]
    if w in txt: print('WARN markup contains',w)
