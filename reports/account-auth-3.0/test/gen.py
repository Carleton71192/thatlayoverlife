# Builds offline mock pages from the saved Webflow element trees (read 12 Oct 2026 after the Designer edits) and the AFTER code blocks.
import json,html,sys
A='/home/user/thatlayoverlife/reports/account-auth-3.0/applied/'
BTN={'login':'Log in →','signup':'Create my account →','forgot':'Send reset email'}
def esc(s): return html.escape(s,quote=True)
def attrs(n,extra=None):
    a=dict(n.get('attributes') or {})
    if extra: a.update(extra)
    if n.get('styleNames'): a['class']=' '.join(n['styleNames'])+((' '+a['class']) if 'class' in a else '')
    return ''.join(' %s="%s"'%(k,esc(v)) for k,v in a.items())
def kids(n,page): return ''.join(render(c,page) for c in n.get('children',[]))
def render(n,page):
    t=n['type']; st=n.get('settings') or {}
    if st.get('visibility') is False: return ''
    if t=='String': return esc(n.get('textContent',''))
    if t=='ComponentInstance':
        nm=n['instanceDetails']['name']
        return '<div class="mock-nav"><a href="/">That Layover Life</a> <a href="/stories">Stories</a></div>' if 'Nav' in nm else '<footer class="mock-footer"><p>Site footer</p></footer>'
    if t=='HtmlEmbed':
        eid=n['id']['element']
        if eid.startswith('ee672abf'): return '<div class="w-embed w-script"><div id="my-map" style="background:#0A0B14;padding:64px 20px 72px;color:#F7F1E8"><div style="max-width:1180px;margin:0 auto"><h2 style="margin:0;font-size:40px">Every country, <em style="color:#FF7093">on your map.</em></h2><div style="height:320px;margin-top:18px;background:#16182a;border-radius:4px" aria-label="Map placeholder" role="img"></div></div></div></div>'
        if eid.startswith('c870e60b'): return '<div class="w-embed w-script"><div id="tll-share-host" style="padding:24px;background:#0A0B14;color:#F7F1E8"><h3 style="margin:0">Who gets to see this?</h3><p>Two taps. Then everyone knows.</p><button type="button">Just me</button></div></div>'
        return '<div class="w-embed"></div>'
    tag={'Section':'section','Heading':'h%d'%st.get('headingLevel',2),'Paragraph':'p','Emphasized':'em','Span':'span','List':'ul','Image':'img','FormBlockLabel':'label','FormForm':'form','FormInlineLabel':'span'}.get(t)
    if t in ('Block','DOM'): tag=st.get('tag') or 'div'
    if t=='Link':
        href=(n.get('attributes') or {}).get('href') or (st.get('link') or {}).get('href') or None
        ex={'href':href} if href else {}
        return '<a%s>%s</a>'%(attrs(n,ex),kids(n,page))
    if t=='Image': return '<img%s>'%attrs(n,{'alt':st.get('altText',''),'src':'data:image/gif;base64,R0lGODlhAQABAAAAACw='})
    if t=='FormWrapper': return '<div%s>%s</div>'%(attrs(n,{'class':'w-form'}),kids(n,page))
    if t=='FormTextInput':
        i=st.get('input',{}); ex={'type':i.get('inputType','text'),'name':i.get('inputName','')}
        if i.get('isRequired'): ex['required']=''
        return '<input%s>'%attrs(n,dict(ex,**{'class':'w-input'}))
    if t=='FormCheckboxWrapper': return '<label%s>%s</label>'%(attrs(n,{'class':'w-checkbox'}),kids(n,page))
    if t=='FormCheckboxInput':
        i=st.get('input',{}); ex={'type':'checkbox','name':i.get('inputName',''),'class':'w-checkbox-input'}
        if i.get('isRequired'): ex['required']=''
        return '<input%s>'%attrs(n,ex)
    if t=='FormButton': return '<input type="submit"%s>'%attrs(n,{'value':BTN[page],'data-wait':'Please wait...','class':'w-button'})
    if t=='FormSuccessMessage': return '<div%s>%s</div>'%(attrs(n,{'class':'w-form-done'}),kids(n,page))
    if t=='FormErrorMessage': return '<div%s>%s</div>'%(attrs(n,{'class':'w-form-fail'}),kids(n,page))
    if t=='Body': return kids(n,page)
    if not tag: tag='div'
    return '<%s%s>%s</%s>'%(tag,attrs(n),kids(n,page),tag)
FORGOT='''<div class="mock-nav"><a href="/">That Layover Life</a></div>
<section class="tll-section tll-bg-paper tll-forgot-section"><div class="tll-container tll-forgot-inner"><div class="tll-forgot-card">
<div class="tll-eyebrow-rose tll-forgot-eyebrow">RESET PASSWORD</div><h1 class="tll-display-l tll-text-midnight tll-forgot-title">Lost the <em class="tll-text-rose tll-forgot-em">thread.</em></h1>
<p class="tll-body-l tll-text-mid tll-forgot-sub">Drop your email and we will send a reset email to get you back on the road.</p>
<div class="tll-auth-form tll-forgot-form w-form"><form data-ms-form="forgot-password"><div class="tll-auth-field"><label class="tll-micro tll-text-mid">Your email</label><input class="tll-auth-input w-input" id="field" data-ms-member="email" type="email" name="email" required></div><input type="submit" class="tll-btn tll-btn-primary tll-auth-submit w-button" value="Send reset email"></form>
<div class="w-form-done"><div>Sent. Check your inbox for the reset email, and if nothing lands in a few minutes, look in spam before you try again.</div></div><div class="w-form-fail"><div>That did not send. Check the address and try again, or write to hello@thatlayover.life.</div></div></div>
<div class="tll-forgot-divider"></div><div class="tll-forgot-alt-row"><a class="tll-text-rose tll-auth-link" href="/login">← Back to log in</a><a class="tll-text-rose tll-auth-link" href="/signup">Join the Travelers →</a></div></div>
<div class="tll-forgot-ephemera"><div class="tll-stamp tll-stamp-hotel"><div class="tll-stamp-text">Lost &amp; Found</div><div class="tll-stamp-text-large">CDG</div><div class="tll-stamp-text-small">Recovered with patience</div></div></div></div></section>
<footer class="mock-footer"><p>Site footer</p></footer>'''
BASE='''<style>body{margin:0;font-family:system-ui,sans-serif;background:#FDF9F3;color:#0A0B14}.w-form-done,.w-form-fail{display:none}.tll-container{max-width:1200px;margin:0 auto;padding:0 24px;box-sizing:border-box}
.tll-section-dark{background:#0A0B14;color:#F7F1E8}.mock-nav{padding:14px 16px;background:#fff;border-bottom:1px solid #ddd}.mock-footer{padding:40px 16px;background:#0A0B14;color:#fff}
.tll-stamp{border:2px solid #C8325B;padding:10px;transform:rotate(-4deg);color:#C8325B;text-align:center}img{max-width:100%}*{box-sizing:border-box}input{font:inherit}</style>'''
def page(name,mode):
    head=open(A+name+'-head-AFTER.html').read(); foot=open(A+name+'-footer-AFTER.html').read()
    body=FORGOT if name=='forgot' else render(json.load(open(name+'-tree.json')),name)
    ms=open('ms-mock.js').read().replace('__MODE__',mode)
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+name+'</title><link rel="stylesheet" href="/site.css">'+BASE+'<script>'+ms+'</script>'+head+'</head><body>'+body+foot+'</body></html>'
for name,mode in [('account','member'),('account','anon'),('account','member-empty'),('login','anon'),('signup','anon'),('forgot','anon')]:
    open('out-%s-%s.html'%(name,mode),'w').write(page(name if name!='forgot' else 'forgot',mode))
print('ok')
