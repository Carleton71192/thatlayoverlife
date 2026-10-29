"""Builds src/site-layers/tll-site-layers-v16.js from its parts. Run from the repo root: python3 src/site-layers/build-site-layers-v16.py
v16 = v15 plus F1 (29 Oct 2026, Nancy: the old home hero shows for a blink before the cover): the cover style goes into the head at once and moves to the end of the body when the page is parsed, as before; the cover fills the hero as soon as the hero has arrived, before the first paint, instead of waiting for every script on the page.
v16 also carries v15's 15.1.0 parts: the end-of-story ask (tll-story-ask-v1.js), the /spotlight action tile (tll-open-slots-v1.js) and the people strip's action tile (in the rebuilt cover).
v15 = v14 plus story photos on five pages (src/site-layers/tll-page-heroes-v1.js: /stories, /travelers, /the-map, /about, /for-expats) and the home cover's Join free button (rebuilt tll-mag-cover-v1.html).
v14 = v13 plus the 28 Oct UX layer (src/site-layers/tll-ux-1028-v1.js: type floor, success message contrast, Tell the editor clear of the home hero). v13 = v12 plus Consent Mode v2 at the very top (src/site-layers/tll-consent-mode-v2.js; Google tags default to denied, CookieConsent updates analytics_storage). v12 = v11 plus stamps on the library cards and the letter (inside the cover layer) (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html), which runs only on /stories/{slug}:
its font link goes in the head and its style goes at the END of the body once the DOM is parsed, so it sits after the template's own
head and footer styles in the cascade and wins every tie."""
import re, json
STYLES = [('src/site-layers/tll-nav-phone-v1.html', 'tll-nav-phone-v1', 'phone header'),
          ('src/site-layers/tll-contrast-v1.html', 'tll-contrast-v1', 'contrast'),
          ('src/site-layers/tll-note-phone-v1.html', 'tll-note-phone-v1', 'round note button on phones'),
          ('src/site-layers/tll-photos-tap-v1.html', 'tll-photos-tap-v1', '/share-photos drop zone tap on iPhones'),
          ('src/site-layers/tll-home-coords-v1.html', 'tll-home-coords-v1', 'home photo coordinates inside the screen on phones'),
          ('src/site-layers/tll-footer-wordmark-v1.html', 'tll-footer-wordmark-v1', 'footer wordmark matches the header'),
          ('src/site-layers/tll-tap-colors-v1.html', 'tll-tap-colors-v1', '/account Stories tab: ink text and a rose underline on hover and tap, no rose or teal text'),
          ('src/site-layers/tll-shelf-ring-v1.html', 'tll-shelf-ring-v1', 'home library rail: room for the avatar ring on phones'),
          ('src/site-layers/tll-masthead-v1.html', 'tll-masthead-v1', 'footer masthead line in Newsreader italic')]
SCRIPTS = [('src/components/member-bar/tll-account-hash-tabs-v1.js', 'member bar SETTINGS and CONTRIBUTIONS open their /account tab'),
           ('src/site-layers/tll-note-typing-v1.js', 'note button steps aside while typing'),
           ('src/components/edit-profile-fixes/tll-ep-country-v1.js', '/edit-profile country field reads "Portland, Oregon, USA"; pen name note copy'),
           ('src/site-layers/tll-footer-wordmark-v1.js', 'footer wordmark text'),
           ('src/site-layers/tll-masthead-v1.js', 'footer masthead line: Written by the people who went'),
           ('src/site-layers/tll-ux-1028-v1.js', '28 Oct UX review: type floor, success message contrast, Tell the editor clear of the home hero'),
           ('src/site-layers/tll-page-heroes-v1.js', '29 Oct: story photos on /stories, /travelers, /the-map, /about and /for-expats, credited and linked'),
           ('src/site-layers/tll-story-ask-v1.js', '29 Oct: end-of-story ask, Pitch a layover story first, then send one photo'),
           ('src/site-layers/tll-open-slots-v1.js', '29 Oct: /spotlight coming-soon and open-slot cards become one Pitch your layover tile'),
           ('src/site-layers/tll-travelers-fix-v1.js', '29 Oct testers: /travelers link chips as labelled pills inside the card, no empty grid cell, one action tile instead of the open slot'),
           ('src/site-layers/tll-ep-ux-v1.js', '29 Oct testers: /edit-profile save bar at the bottom, field stays put while saving, country suggestions, photo crop'),
           ('src/site-layers/tll-submit-ux-v1.js', '29 Oct testers: /submit toolbar buttons labelled, Subhead easy to find'),
           ('src/site-layers/tll-profile-count-v1.js', '29 Oct: profile STORIES stat keeps the writer own count (the head script wrote the site total)'),
           ('src/site-layers/tll-hover-v1.js', '29 Oct Nancy: dark pink hover on light backgrounds instead of bright teal on /account'),
           ('src/site-layers/tll-home-bands-v1.js', '29 Oct Nancy: home photo bands use members story photos at full size, credited and linked'),
           ('src/site-layers/tll-photos-caption-v1.js', '29 Oct: /share-photos caption room 600 characters with a running count (was cut at 256)'),
           ('src/site-layers/tll-lounge-labels-v1.js', '29 Oct Nancy: /gallery tile labels small, in the corner, off the photo'),
           ('src/site-layers/tll-stories-places-v1.js', '29 Oct Nancy: /stories place chips add Asia, Middle East and Oceania; in the library line'),
           ('src/site-layers/tll-stories-noimg-v1.js', '29 Oct Nancy: /stories card without a photo shows a plain panel; the lead goes to the newest story with a photo')]
MAG = 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html'
def css(f, i): return [i, re.search(r'<style id="%s">\n(.*)</style>' % i, open(f).read(), re.S).group(1)]
mag = open(MAG).read()
mag_css = re.search(r'<style id="tll-mag-story-v1">\n(.*?)</style>', mag, re.S).group(1)
mag_js = re.search(r'<script id="tll-mag-story-js-v1">\n(.*?)</script>', mag, re.S).group(1)
mag_font = re.search(r'<link rel="stylesheet" href="([^"]+)">', mag).group(1)
head = "/* tll-site-layers-v16: one site script, so the site stays within Webflow's 15-script limit. Built by src/site-layers/build-site-layers-v16.py from:\n"
head += ''.join('   style  %s (%s)\n' % (f, d) for f, _, d in STYLES) + ''.join('   script %s (%s)\n' % (f, d) for f, d in SCRIPTS)
head += '   story  %s (the magazine story page: Newsreader, the byline in the head, the stamp on the photo; /stories/{slug} only)\n' % MAG
head += '   first  src/site-layers/tll-consent-mode-v2.js (Consent Mode v2 defaults and CookieConsent updates; AdSense readiness, 28 Oct 2026)\n'
head += '   No data-ms-* element is touched. */\n'
consent = open('src/site-layers/tll-consent-mode-v2.js').read()
loader = "(function(){var L=%s;var h=document.head||document.documentElement;for(var i=0;i<L.length;i++){if(document.getElementById(L[i][0]))continue;var s=document.createElement('style');s.id=L[i][0];s.textContent=L[i][1];h.appendChild(s);}})();\n" % json.dumps([css(f, i) for f, i, _ in STYLES])
story = ("(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;\n"
         "if(!document.querySelector('link[href=\"'+%s+'\"]')){var f=document.createElement('link');f.rel='stylesheet';f.href=%s;(document.head||document.documentElement).appendChild(f);}\n"
         "function place(){var s=document.createElement('style');s.id='tll-mag-story-v1';s.textContent=%s;document.body.appendChild(s);}\n"
         "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();\n"
         "%s})();\n") % (json.dumps(mag_font), json.dumps(mag_font), json.dumps(mag_css), mag_js)
COVER = 'src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html'
cov = open(COVER).read()
cov_css = re.search(r'<style id="tll-mag-cover-v1">\n(.*?)</style>', cov, re.S).group(1)
cov_js = re.search(r'<script id="tll-mag-cover-js-v1">\n(.*?)</script>', cov, re.S).group(1)
cov_font = re.search(r'<link rel="stylesheet" href="([^"]+)">', cov).group(1)
head = head.replace('   No data-ms-* element is touched. */', '   cover  %s (the magazine cover: the cover story photo full bleed, the chip, the stamp; home page only)\n   No data-ms-* element is touched. */' % COVER)
OLD_RUN = "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();\n})();"
assert cov_js.count(OLD_RUN) >= 1
NEW_RUN = ("/* F1: fill the hero as soon as it has arrived (its next sibling exists), before the first paint; the page-parsed event stays as the fallback. */\n"
           "(function(){if(document.readyState!=='loading'){run();return;}var mo=null;\n"
           "function ready(){var h=document.querySelector('[data-h3-hero]');return !!(h&&h.nextElementSibling);}\n"
           "if(window.MutationObserver){mo=new MutationObserver(function(){if(ready()){mo.disconnect();mo=null;run();}});mo.observe(document.documentElement,{childList:true,subtree:true});}\n"
           "document.addEventListener('DOMContentLoaded',function(){if(mo){mo.disconnect();mo=null;}run();});})();\n})();")
cov_js_early = cov_js.replace(OLD_RUN, NEW_RUN, 1)
cover = ("(function(){if(!/^\\/(index\\.html)?$/.test(location.pathname))return;if(document.getElementById('tll-mag-cover-v1'))return;\n"
         "if(!document.querySelector('link[href=\"'+%s+'\"]')){var f=document.createElement('link');f.rel='stylesheet';f.href=%s;(document.head||document.documentElement).appendChild(f);}\n"
         "/* F1: the style goes in at once, so the cover is styled from the first paint; it moves to the end of the body once the page is parsed, as in v9 to v15. */\n"
         "var CS=document.createElement('style');CS.id='tll-mag-cover-v1';CS.textContent=%s;(document.head||document.documentElement).appendChild(CS);\n"
         "function place(){document.body.appendChild(CS);}\n"
         "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();\n"
         "%s})();\n") % (json.dumps(cov_font), json.dumps(cov_font), json.dumps(cov_css), cov_js_early)
open('src/site-layers/tll-site-layers-v16.js', 'w').write(head + consent + loader + '\n'.join(open(f).read() for f, _ in SCRIPTS) + '\n' + story + cover)
print('built', len(STYLES), 'styles', len(SCRIPTS), 'scripts + story layer', len(mag_css), 'css bytes + cover layer', len(cov_css), 'css bytes')
