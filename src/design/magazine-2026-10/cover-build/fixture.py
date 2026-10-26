"""Offline stand-in of the live home page for testing the magazine cover layer. Run from the repo root:
python3 src/design/magazine-2026-10/cover-build/fixture.py
Source: the 13 Oct 2026 Webflow export of the home page, whose hero (the [data-h3-hero] block: photo, eyebrow, h1, lede, hidden links,
the CTA embed and the coordinates embed) matches the live tree read on 26 Oct. The section embeds below the hero are the export's
13 Oct versions; the live ones are newer, but the cover layer does not touch them. The CSS is served at /css/ by shots.mjs."""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[4]
EXPORT = ROOT / 'handoff/claude-design-source/webflow-export-2026-10-13'
h = (EXPORT / 'pages/index.html').read_text()
h = re.sub(r'href="\.\./css/([^"]+)"', r'href="http://tll.test/css/\1"', h)
# the two hero embeds are newer on the live page (26 Oct): swap in the repo copies
import re as _re
live = ROOT / 'src/pages/home/live-2026-10-26'
cta = (live / 'embed-13326a8e-after.html').read_text()
h, n1 = _re.subn(r'<style>\.h3-hero-free\{.*?<p class="h3 h3-hero-free">[^<]*</p>', lambda m: cta, h, count=1, flags=_re.S)
coords = (live / 'embeds/de5cdec9.html').read_text()
h, n2 = _re.subn(r'<p class="h3 h3-hero-coords">.*?</style>', lambda m: coords, h, count=1, flags=_re.S)
print('swapped embeds: cta', n1, 'coords', n2)
# the 13 Oct export carried a second, older CTA block in the hero that the live page no longer has (the live tree has one embed in the words block)
parts = h.split('<div class="h3 h3-hero-cta">')
if len(parts) == 3:
    tail = parts[2]; h = parts[0] + '<div class="h3 h3-hero-cta">' + parts[1] + tail[tail.index('</div>') + 6:]; print('dropped the export\'s stray second CTA block')
h = h.replace('</body>', '<!--LAYER-->\n</body>')
out = pathlib.Path(__file__).with_name('fixture-home.html'); out.write_text(h)
print('wrote', out.name, len(h) // 1024, 'KB; hero blocks:', h.count('data-h3-hero'))
