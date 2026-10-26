"""Builds src/site-layers/tll-site-layers-v6.js from its parts. Run from the repo root: python3 src/site-layers/build-site-layers-v6.py
v6 = v5 plus the story spacing fix (the From line separators, inline photo captions, the gallery grid, the invite and sign-off) (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html), which runs only on /stories/{slug}:
its font link goes in the head and its style goes at the END of the body once the DOM is parsed, so it sits after the template's own
head and footer styles in the cascade and wins every tie."""
import re, json
STYLES = [('src/site-layers/tll-nav-phone-v1.html', 'tll-nav-phone-v1', 'phone header'),
          ('src/site-layers/tll-contrast-v1.html', 'tll-contrast-v1', 'contrast'),
          ('src/site-layers/tll-note-phone-v1.html', 'tll-note-phone-v1', 'round note button on phones'),
          ('src/site-layers/tll-photos-tap-v1.html', 'tll-photos-tap-v1', '/share-photos drop zone tap on iPhones'),
          ('src/site-layers/tll-home-coords-v1.html', 'tll-home-coords-v1', 'home photo coordinates inside the screen on phones'),
          ('src/site-layers/tll-footer-wordmark-v1.html', 'tll-footer-wordmark-v1', 'footer wordmark matches the header'),
          ('src/site-layers/tll-tap-colors-v1.html', 'tll-tap-colors-v1', '/account Stories tab: ink text and a rose underline on hover and tap, no rose or teal text')]
SCRIPTS = [('src/components/member-bar/tll-account-hash-tabs-v1.js', 'member bar SETTINGS and CONTRIBUTIONS open their /account tab'),
           ('src/site-layers/tll-note-typing-v1.js', 'note button steps aside while typing'),
           ('src/components/edit-profile-fixes/tll-ep-country-v1.js', '/edit-profile country field reads "Portland, Oregon, USA"; pen name note copy'),
           ('src/site-layers/tll-footer-wordmark-v1.js', 'footer wordmark text')]
MAG = 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html'
def css(f, i): return [i, re.search(r'<style id="%s">\n(.*)</style>' % i, open(f).read(), re.S).group(1)]
mag = open(MAG).read()
mag_css = re.search(r'<style id="tll-mag-story-v1">\n(.*?)</style>', mag, re.S).group(1)
mag_js = re.search(r'<script id="tll-mag-story-js-v1">\n(.*?)</script>', mag, re.S).group(1)
mag_font = re.search(r'<link rel="stylesheet" href="([^"]+)">', mag).group(1)
head = "/* tll-site-layers-v6: one site script, so the site stays within Webflow's 15-script limit. Built by src/site-layers/build-site-layers-v6.py from:\n"
head += ''.join('   style  %s (%s)\n' % (f, d) for f, _, d in STYLES) + ''.join('   script %s (%s)\n' % (f, d) for f, d in SCRIPTS)
head += '   story  %s (the magazine story page: Newsreader, the byline in the head, the stamp on the photo; /stories/{slug} only)\n' % MAG
head += '   No data-ms-* element is touched. */\n'
loader = "(function(){var L=%s;var h=document.head||document.documentElement;for(var i=0;i<L.length;i++){if(document.getElementById(L[i][0]))continue;var s=document.createElement('style');s.id=L[i][0];s.textContent=L[i][1];h.appendChild(s);}})();\n" % json.dumps([css(f, i) for f, i, _ in STYLES])
story = ("(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;\n"
         "var f=document.createElement('link');f.rel='stylesheet';f.href=%s;(document.head||document.documentElement).appendChild(f);\n"
         "function place(){var s=document.createElement('style');s.id='tll-mag-story-v1';s.textContent=%s;document.body.appendChild(s);}\n"
         "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();\n"
         "%s})();\n") % (json.dumps(mag_font), json.dumps(mag_css), mag_js)
open('src/site-layers/tll-site-layers-v6.js', 'w').write(head + loader + '\n'.join(open(f).read() for f, _ in SCRIPTS) + '\n' + story)
print('built', len(STYLES), 'styles', len(SCRIPTS), 'scripts + story layer', len(mag_css), 'css bytes')
