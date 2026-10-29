"""Turn a Webflow get_all_elements tree (trees/<page>.json) into static HTML for offline screenshots.
Component instances become <!--NAV--> and <!--FOOTER--> markers; embeds come from embeds/<id>.html when present."""
import json, html, re, pathlib, sys
D = pathlib.Path(__file__).parent
def cls(names): return ' '.join(re.sub(r'\s+', '-', n.strip()).lower() for n in names or [])
VOID = {'img', 'input', 'br', 'hr'}
def render(n):
    t = n.get('type'); s = n.get('settings', {}) or {}
    if s.get('visibility') is False: return ''
    kids = ''.join(render(c) for c in n.get('children', []) or [])
    if t == 'String': return html.escape(n.get('textContent', ''))
    if t == 'Body': return kids
    if t == 'ComponentInstance':
        nm = (n.get('instanceDetails') or {}).get('name', '')
        return '<!--NAV-->' if 'Nav' in nm else '<!--FOOTER-->' if 'Footer' in nm else ''
    if t == 'HtmlEmbed':
        f = D / 'embeds' / (n['id']['element'] + '.html')
        return '<div class="w-embed">' + (f.read_text() if f.exists() else '') + '</div>'
    attrs = dict(n.get('attributes') or {})
    tag = {'Section': 'section', 'Paragraph': 'p', 'Span': 'span', 'Strong': 'strong', 'Emphasized': 'em', 'Link': 'a', 'Image': 'img',
           'List': 'ul', 'ListItem': 'li', 'Blockquote': 'blockquote', 'FormForm': 'form', 'FormTextInput': 'input', 'FormTextarea': 'textarea',
           'FormButton': 'input', 'FormBlockLabel': 'label', 'Figure': 'figure', 'Figcaption': 'figcaption', 'LineBreak': 'br'}.get(t, 'div')
    if t == 'Heading': tag = 'h%d' % s.get('headingLevel', 2)
    if t in ('Block', 'DOM'): tag = (s.get('block') or s.get('dom') or {}).get('tag') or s.get('tag') or 'div'
    c = cls(n.get('styleNames'))
    if t == 'FormWrapper': c = (c + ' w-form').strip()
    if t == 'FormSuccessMessage': c = (c + ' w-form-done').strip()
    if t == 'FormErrorMessage': c = (c + ' w-form-fail').strip()
    if t == 'FormTextInput':
        i = s.get('input') or {}; attrs.setdefault('type', i.get('inputType', 'text')); attrs.setdefault('name', i.get('inputName', '')); c = (c + ' w-input').strip()
    if t == 'FormButton': attrs['type'] = 'submit'; attrs.setdefault('value', 'Submit'); c = (c + ' w-button').strip()
    if t == 'Link':
        l = s.get('link') or {}
        if l.get('href'): attrs['href'] = l['href']
    if t == 'Image': attrs.setdefault('alt', ''); attrs.setdefault('src', 'http://tll.test/placeholder.jpg')
    a = ''.join(' %s="%s"' % (k, html.escape(str(v), quote=True)) for k, v in attrs.items() if k != 'class')
    if c: a = ' class="%s"' % c + a
    if tag in VOID: return '<%s%s>' % (tag, a)
    return '<%s%s>%s</%s>' % (tag, a, kids, tag)
if __name__ == '__main__':
    page = sys.argv[1]
    print(render(json.load(open(D / 'trees' / (page + '.json')))))
