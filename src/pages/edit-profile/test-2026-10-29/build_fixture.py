"""Builds fixture.html: the /edit-profile embeds in live DOM order (as listed by Webflow on 29 Oct 2026), newest copy of each."""
import pathlib
D = pathlib.Path(__file__).resolve().parent.parent
ORDER = ['0ca3ea29','893d1f5b','f6cfdde0','8ec4d875','57e2c1d1','84ea086a','ad66c9e4','4ef34f95','2801598c','d8844951','78fc0c2a','c1ecd340','cc36e886','cd5e08aa','7dccfde8','6bf1af49','b1ca89a9','88c74d4a','4080e4be','f3e80157','e36d44a7','37e23119','f63c9386','e555bb45','464edf19','3984bfd4','85cbe1b9','c6629241','afd0cded','9afadfb9','1cc28529']
NEW = {'57e2c1d1':'live-2026-10-27/after/new-css-c3.html','84ea086a':'live-2026-10-27/after/new-css-d.html','ad66c9e4':'live-2026-10-27/after/new-css-d2.html','4ef34f95':'live-2026-10-28/after/new-css-d3.html','c6629241':'live-2026-10-27/after/new-js-f.html','afd0cded':'live-2026-10-27/after/new-js-e.html','9afadfb9':'live-2026-10-28/after/new-js-g.html','1cc28529':'live-2026-10-28/after/new-js-h.html'}
def latest(i):
    if i in NEW: return D / NEW[i]
    for d in ['live-2026-10-29/after','live-2026-10-28/after','live-2026-10-27/after','live-2026-10-27/before']:
        p = D / d / (i + '.html')
        if p.exists(): return p
    raise SystemExit('missing ' + i)
css = ''.join('<link rel="stylesheet" href="http://tll.test/css/%s">' % f for f in ['webflow-base.css','tll-webflow.css','fonts.css'])
body = '\n'.join('<div class="w-embed">%s</div>' % latest(i).read_text() for i in ORDER)
out = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' + css + '<!--BUNDLE--></head><body><nav style="height:64px;background:#0A0B14"></nav><main>' + body + '</main></body></html>'
(pathlib.Path(__file__).parent / 'fixture.html').write_text(out)
print('fixture', len(out), [str(latest(i).relative_to(D)) for i in ORDER][:3])
