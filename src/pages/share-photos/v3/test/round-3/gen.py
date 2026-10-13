# Builds the offline mock of /share-photos AFTER the apply plan, from the saved Webflow element tree.
# Output: mock-in.html (signed in), mock-out.html (signed out), site-styles.css (Webflow classes rebuilt from the style export).
import json, html, re, copy, sys, os
V3 = '/home/user/thatlayoverlife/src/pages/share-photos/v3/'
ST = V3 + 'state/'
OUT = V3 + 'test/round-3/'
EXP = '/home/user/thatlayoverlife/reports/evidence/webflow-export-2026-10-13/state/styles/'
PAGE_ID = '6a0dfca3f9fa5b751d154257'

tree = json.load(open(ST + 'tree.json'))['result'][0]['data']
plan = json.load(open(V3 + 'apply-plan.json'))
forms = json.load(open(ST + 'forms.json'))['forms'][0]
placeholders = {f['displayName']: f.get('placeholder') for f in forms['fields']}
resolved = json.load(open(ST + 'resolved-settings.json'))

def esc(s): return html.escape(s, quote=True)
def eid(n): return n['id']['element']
def suf(n): return eid(n)[-4:]

# ---------- 1. apply the Designer-equivalent ops to the tree ----------
index = {}
parents = {}
def walk(n, p=None):
    index[eid(n)] = n; parents[eid(n)] = p
    for c in n.get('children', []) or []: walk(c, n)
walk(tree)

def set_text(n, text):
    # Replace the String children with one String; keep non-String children (none of the targets has any).
    kids = n.get('children', []) or []
    non = [c for c in kids if c.get('type') != 'String']
    assert not non, 'text op on element with nested children: ' + eid(n)
    n['children'] = [{'id': {'component': PAGE_ID, 'element': eid(n) + '-str'}, 'type': 'String', 'textContent': text}]

def build(schema, k=0):
    t = schema['type']
    node = {'id': {'component': PAGE_ID, 'element': 'new-%s-%d' % (t.lower(), id(schema) % 100000)}, 'type': {'DivBlock': 'Block', 'TextBlock': 'Block', 'Paragraph': 'Paragraph'}[t],
            'styleNames': schema.get('set_style', {}).get('style_names', []), 'settings': {'tag': 'div', 'visibility': True}}
    if 'set_text' in schema:
        node['children'] = [{'id': {'component': PAGE_ID, 'element': node['id']['element'] + '-s'}, 'type': 'String', 'textContent': schema['set_text']['text']}]
    else:
        node['children'] = [build(c) for c in schema.get('children', [])]
    return node

applied = []
for op in plan['ops']:
    k = op['kind']
    if k == 'footer-code': continue
    n = index[op['element_id']['element']]
    if k == 'text':
        set_text(n, op['after']); applied.append((k, suf(n)))
    elif k == 'placeholder-clear':
        n.setdefault('_placeholder_cleared', True); applied.append((k, suf(n)))
    elif k == 'required':
        n['settings'].setdefault('input', {})['isRequired'] = (op['after'] == 'required: true'); applied.append((k, suf(n)))
    elif k == 'accept':
        for a in op['action']['attributes']: n.setdefault('attributes', {})[a['name']] = a['value']
        applied.append((k, suf(n)))
    elif k == 'add-elements':
        new = build(op['action']['element_schema'])
        par = parents[eid(n)]; kids = par['children']; i = kids.index(n)
        assert op['action']['creation_position'] == 'after'
        kids.insert(i + 1, new); applied.append((k, suf(n)))
    else:
        raise SystemExit('unknown op ' + k)

# ---------- 2. render the tree to Webflow-shaped HTML ----------
TRIP_OPTIONS = [('', 'Select one...'), ('layover', 'Layover'), ('trip', 'Trip'), ('living', 'Living there'), ('expat', 'Expat life')]  # options are not exposed by the API: mock values
def attrs(n, extra=None, cls_first=None):
    a = dict(n.get('attributes') or {})
    classes = []
    if cls_first: classes += cls_first.split()
    for c in (n.get('styleNames') or []):
        if c not in classes: classes.append(c)
    if 'class' in a:
        for c in a.pop('class').split():
            if c not in classes: classes.append(c)
    if extra:
        for k2, v in extra.items():
            if k2 == 'class':
                for c in v.split():
                    if c not in classes: classes.append(c)
            else: a[k2] = v
    out = ''
    if classes: out += ' class="%s"' % esc(' '.join(classes))
    for k2, v in a.items():
        out += ' %s' % k2 if v == '' and k2 in ('multiple', 'checked', 'required') else ' %s="%s"' % (k2, esc(str(v)))
    return out
def kids(n): return ''.join(render(c) for c in n.get('children', []) or [])
def render(n):
    t = n['type']; st = n.get('settings') or {}
    if st.get('visibility') is False: return ''
    if t == 'String': return esc(n.get('textContent', ''))
    if t == 'ComponentInstance':
        nm = n['instanceDetails']['name']
        if 'Nav' in nm: return '<div class="mock-nav" data-mock="nav" role="banner"><a href="/">That Layover Life</a> <a href="/stories">Stories</a> <a href="/gallery">Lounge</a></div>'
        return '<footer class="mock-footer" data-mock="footer"><p>TLL Site Footer (component placeholder)</p></footer>'
    if t == 'Body': return kids(n)
    if t == 'Section': return '<section%s>%s</section>' % (attrs(n), kids(n))
    if t in ('Block', 'DOM'):
        tag = st.get('tag') or (st.get('block') or {}).get('tag') or (st.get('dom') or {}).get('tag') or 'div'
        return '<%s%s>%s</%s>' % (tag, attrs(n), kids(n), tag)
    if t == 'Heading':
        tag = 'h%d' % st.get('headingLevel', 2); return '<%s%s>%s</%s>' % (tag, attrs(n), kids(n), tag)
    if t == 'Paragraph': return '<p%s>%s</p>' % (attrs(n), kids(n))
    if t == 'Emphasized': return '<em%s>%s</em>' % (attrs(n), kids(n))
    if t == 'Span': return '<span%s>%s</span>' % (attrs(n), kids(n))
    if t == 'Link':
        href = (st.get('link') or {}).get('href') or (n.get('attributes') or {}).get('href')
        ex = {'href': href} if href else {}
        return '<a%s>%s</a>' % (attrs(n, ex), kids(n))
    if t == 'FormWrapper':
        return '<div%s>%s</div>' % (attrs(n, {'class': 'w-form'}), kids(n))
    if t == 'FormForm':
        f = st['form']['formSettings']
        ex = {'id': 'wf-form-Html-Form', 'name': 'wf-form-Html-Form', 'data-name': f['name'], 'method': f['method'], 'data-wf-page-id': PAGE_ID, 'data-wf-element-id': eid(n)}
        if f.get('action'): ex['action'] = f['action']
        return '<form%s>%s</form>' % (attrs(n, ex), kids(n))
    if t == 'FormBlockLabel': return '<label%s>%s</label>' % (attrs(n), kids(n))
    if t == 'FormTextInput':
        i = st.get('input', {}); name = i.get('inputName', ''); typ = i.get('inputType', 'text')
        ex = {'type': typ, 'name': name, 'data-name': name}
        if typ == 'text': ex['maxlength'] = '256'
        if i.get('isRequired'): ex['required'] = ''
        ph = placeholders.get(name)
        if ph and not n.get('_placeholder_cleared') and typ != 'file': ex['placeholder'] = ph
        if typ == 'file' and ph and not n.get('_placeholder_cleared'): ex['placeholder'] = ph  # Webflow would carry it; the plan clears it
        return '<input%s>' % attrs(n, dict(ex, **{'class': 'w-input'}))
    if t == 'FormSelect':
        i = st.get('input', {}); name = i.get('inputName', '')
        ex = {'name': name, 'data-name': name}
        if i.get('isRequired'): ex['required'] = ''
        opts = ''.join('<option value="%s">%s</option>' % (esc(v), esc(l)) for v, l in TRIP_OPTIONS)
        return '<select%s>%s</select>' % (attrs(n, dict(ex, **{'class': 'w-select'})), opts)
    if t == 'FormRadioInput':
        r = resolved[suf(n)]
        ex = {'type': 'radio', 'name': r['groupName'], 'data-name': r['groupName'], 'value': r['value']}
        return '<input%s>' % attrs(n, dict(ex, **{'class': 'w-form-formradioinput w-radio-input'}))
    if t == 'FormCheckboxWrapper': return '<label%s>%s</label>' % (attrs(n, {'class': 'w-checkbox'}), kids(n))
    if t == 'FormCheckboxInput':
        i = st.get('input', {}); name = i.get('inputName', '')
        ex = {'type': 'checkbox', 'name': name, 'data-name': name}
        if i.get('isRequired'): ex['required'] = ''
        return '<input%s>' % attrs(n, dict(ex, **{'class': 'w-checkbox-input'}))
    if t == 'FormInlineLabel': return '<span%s>%s</span>' % (attrs(n, {'class': 'w-form-label'}), kids(n))
    if t == 'FormButton':
        r = resolved[suf(n)]
        return '<input%s>' % attrs(n, {'type': 'submit', 'data-wait': r['loadingText'], 'value': r['buttonText'], 'class': 'w-button'})
    if t == 'FormSuccessMessage': return '<div%s>%s</div>' % (attrs(n, {'class': 'w-form-done', 'tabindex': '-1', 'role': 'region', 'aria-label': 'Html Form success'}), kids(n))
    if t == 'FormErrorMessage': return '<div%s>%s</div>' % (attrs(n, {'class': 'w-form-fail', 'tabindex': '-1', 'role': 'region', 'aria-label': 'Html Form failure'}), kids(n))
    raise SystemExit('unhandled type ' + t)

body = render(tree)

# ---------- 3. rebuild the site's Webflow classes from the style export ----------
classes_used = set(re.findall(r'class="([^"]*)"', body))
used = set()
for c in classes_used: used.update(c.split())
styles = json.load(open(EXP + 'styles-base.json'))
variables = {}
for col in json.load(open(EXP + 'variables.json'))['collections']:
    for v in col.get('variables') or []: variables[v['id']] = v
def val(v):
    if isinstance(v, dict):
        if 'id' in v and v['id'] in variables:
            x = variables[v['id']]; return val(x.get('value'))
        if 'unit' in v and 'value' in v: return '%s%s' % (v['value'], v['unit'])
        if 'id' in v: return 'inherit /* unresolved %s */' % v['id']
    if isinstance(v, (int, float)): return str(v)
    return str(v)
css = []
for s in styles:
    sel = s['selector']; names = [x for x in sel.split('.') if x]
    if not all(nm in used for nm in names): continue
    props = (s.get('properties') or {}).get('base', {}).get('properties') or {}
    if not props: continue
    decl = ';'.join('%s:%s' % (k2, ("'%s'" % val(v) if k2 == 'font-family' and ' ' in val(v) else val(v))) for k2, v in props.items())
    css.append('%s{%s}' % (sel, decl))
open(OUT + 'site-styles.css', 'w').write('/* Webflow classes used on /share-photos, rebuilt from reports/evidence/webflow-export-2026-10-13 (base breakpoint only). */\n' + '\n'.join(css) + '\n')

# ---------- 4. assemble ----------
WEBFLOW_BASE = '''<style id="mock-webflow-base">/* mock: the slice of webflow.css the page relies on */
*{box-sizing:border-box}html{font-family:sans-serif;-webkit-text-size-adjust:100%}body{margin:0;min-height:100%;background-color:#fff;font-family:Arial,sans-serif;font-size:14px;line-height:20px;color:#333}
h1{font-size:38px;line-height:44px;margin:20px 0 10px;font-weight:bold}h2{font-size:32px;line-height:36px;margin:20px 0 10px;font-weight:bold}p{margin:0 0 10px}a{background-color:transparent}
fieldset{margin:0 2px;padding:.35em .625em .75em;border:1px solid silver}legend{padding:0;border:0}button,input,select{font:inherit;margin:0}button,select{text-transform:none}
.w-form{margin:0 0 15px}.w-form-done{display:none;padding:20px;text-align:center;background-color:#ddd}.w-form-fail{display:none;margin-top:10px;padding:10px;background-color:#ffdede}
label{display:block;margin-bottom:5px;font-weight:bold}.w-input,.w-select{display:block;width:100%;height:38px;padding:8px 12px;margin-bottom:10px;font-size:14px;line-height:1.42857143;color:#333;vertical-align:middle;background-color:#fff;border:1px solid #ccc}
.w-input:focus,.w-select:focus{border-color:#3898EC;outline:0}.w-checkbox{display:block;margin-bottom:5px;padding-left:20px}.w-checkbox::before,.w-checkbox::after{content:" ";display:table}.w-checkbox::after{clear:both}
.w-checkbox-input{float:left;margin:4px 0 0 -20px;line-height:normal}.w-form-formradioinput{margin:4px 0 0}.w-form-label{display:inline-block;cursor:pointer;font-weight:normal;margin-bottom:0}
.w-button{display:inline-block;padding:9px 15px;background-color:#3898EC;color:#fff;border:0;line-height:inherit;text-decoration:none;cursor:pointer;border-radius:0}
.mock-nav{padding:14px 16px;background:#0A0B14;color:#fff}.mock-nav a{color:#fff;margin-right:12px}.mock-footer{padding:40px 16px;background:#0A0B14;color:#fff}
</style>'''

MS_MOCK = '''<script id="mock-memberstack">/* mock: Memberstack DOM package, read-only; records every write */
(function(){
  var q=location.search;
  if(/noms/.test(q)) return;                         /* ?noms: no Memberstack at all (fallback check) */
  window.__msWrites=[]; window.__msReads=0;
  var member={id:'mem_test',customFields:{'first-name':'Nancy','last-name':'Carleton'}};
  function noop(){ return Promise.resolve({data:null}); }
  window.$memberstackDom={
    getCurrentMember:function(){ window.__msReads++; return Promise.resolve({data:member}); },
    getMemberJSON:function(){ return Promise.resolve({data:{}}); },
    updateMember:function(x){ window.__msWrites.push(['updateMember',x]); return Promise.resolve({data:member}); },
    updateMemberJSON:function(x){ window.__msWrites.push(['updateMemberJSON',x]); return Promise.resolve({}); },
    loginMemberEmailPassword:noop, logout:noop, openModal:noop, hideModal:noop, onAuthChange:function(){}, getApp:noop
  };
})();
</script>'''

WF_FORM_MOCK = '''<script id="mock-webflow-forms">/* mock: stands in for Webflow's jQuery form handler (bubble phase). Counts runs; never posts. */
window.__wfHandlerRuns=0;
document.addEventListener('DOMContentLoaded',function(){
  var f=document.querySelector('form[data-tll-form="share-photos"]');
  if(f) f.addEventListener('submit',function(ev){ window.__wfHandlerRuns++; ev.preventDefault(); });
});
</script>'''

site_head = open(ST + 'site-head.html').read()
page_head = open(ST + 'page-head.html').read()
site_footer = open(ST + 'site-footer.html').read()
page_footer_old = open(ST + 'page-footer.html').read()
page_footer_new = re.sub(r'<style id="tll-form-fix">.*?</style>', '', page_footer_old, flags=re.S).strip()
assert page_footer_new == '', 'page footer holds more than the tll-form-fix block'
page_footer_new = open(V3 + 'tll-photos-v3.html').read() + '\n' + open(V3 + 'tll-photos-form-v1.html').read()

def page(mode):
    cls = 'w-mod-js' + (' ms-loaded' if mode == 'in' else '')
    return ('<!doctype html><html lang="en" class="%s" data-mock-mode="%s"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Share photos (mock, %s)</title>\n' % (cls, mode, mode)
            + WEBFLOW_BASE + '\n<link rel="stylesheet" href="/site-styles.css">\n' + MS_MOCK + WF_FORM_MOCK + '\n<!-- site head -->\n' + site_head + '\n<!-- page head -->\n' + page_head
            + '\n</head><body class="body">\n' + body + '\n<!-- site footer -->\n' + site_footer + '\n<!-- page footer (new) -->\n' + page_footer_new + '\n</body></html>')
open(OUT + 'mock-in.html', 'w').write(page('in'))
open(OUT + 'mock-out.html', 'w').write(page('out'))
print('ops applied:', len(applied), 'site classes rebuilt:', len(css))
print('mock-in.html', os.path.getsize(OUT + 'mock-in.html'), 'bytes')
