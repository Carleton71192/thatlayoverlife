# The code edits of the bandwidth fixes 4 and 5 proposal. Each find must occur exactly once in its block (checked against the live
# www HTML of 13 Nov 07:35, where each block is printed verbatim). Imported by apply.py.
PET_FETCH_HOME = "fetch('/pets/magnus-waffles',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(h){\nvar m=h.match(/window\\.TLL_PET=\\{countries:\"([^\"]*)\"/);if(!m)return;"
PET_NEW_HOME = "(window.tllPetCountries?window.tllPetCountries('magnus-waffles'):fetch('/pets/magnus-waffles',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(h){var x=h.match(/window\\.TLL_PET=\\{countries:\"([^\"]*)\"/);if(!x)throw Error('no list');return x[1];})).then(function(c){\nvar m=[0,c];"

PAW_FIND = "fetch('/pets/magnus-waffles',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(h){\nvar m=h.match(/window\\.TLL_PET=\\{countries:\"([^\"]*)\"/);if(!m)return;\n"
PAW_NEW = "(window.tllPetCountries?window.tllPetCountries('magnus-waffles'):fetch('/pets/magnus-waffles',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(h){var x=h.match(/window\\.TLL_PET=\\{countries:\"([^\"]*)\"/);if(!x)throw Error('no list');return x[1];})).then(function(c){\nvar m=[0,c];\n"

ABOUT_FIND = "get('/pets/magnus-waffles').then(function(d){\nvar scripts=Array.from(d.querySelectorAll('script')),match;\nscripts.some(function(s){if(s.textContent.indexOf('window.TLL_PET=')<0)return false;match=s.textContent.match(/countries:\\s*(\"(?:\\\\.|[^\"\\\\])*\")/);return !!match;});\nif(!match)return;"
ABOUT_NEW = "(window.tllPetCountries?window.tllPetCountries('magnus-waffles').then(function(c){return [0,JSON.stringify(c)];}):get('/pets/magnus-waffles').then(function(d){\nvar scripts=Array.from(d.querySelectorAll('script')),match;\nscripts.some(function(s){if(s.textContent.indexOf('window.TLL_PET=')<0)return false;match=s.textContent.match(/countries:\\s*(\"(?:\\\\.|[^\"\\\\])*\")/);return !!match;});\nreturn match;})).then(function(match){\nif(!match)return;"

WRITERS_FIND = "function run(){var c=0;try{c=+sessionStorage.getItem('tllWriterN')||0;}catch(e){}if(c){apply(c);return;}"
WRITERS_NEW = "function has(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),t;while(t=w.nextNode()){if(/^\\s*(\\w+) writers? so far\\./.test(t.nodeValue))return true;}return false;}\nfunction run(){if(!has())return;var c=0;try{c=+sessionStorage.getItem('tllWriterN')||0;}catch(e){}if(c){apply(c);return;}"

SHELF_FIND = "function fresh(){fetch('/stories',{cache:'no-cache'}).then(function(r){return r.ok?r.text():'';})"
SHELF_NEW = "function fresh(){(window.tllSelfDoc?window.tllSelfDoc('/stories').catch(function(){return '';}):fetch('/stories',{cache:'no-cache'}).then(function(r){return r.ok?r.text():'';}))"

FOOT_FIND = "set={};fetch('/stories').then(function(r){return r.ok?r.text():'';})"
FOOT_NEW = "set={};(window.tllSelfDoc?window.tllSelfDoc('/stories').catch(function(){return '';}):fetch('/stories').then(function(r){return r.ok?r.text():'';}))"

FACTS_FIND = "function magnus(){if(!/(magnus|samoyed)/i.test(document.body.textContent))return;fetch('/pets/magnus-waffles',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(h){var m=h.match(/window\\.TLL_PET=\\{countries:\"([^\"]*)\"/);if(!m)return;var n=m[1]"
FACTS_NEW = "function magnus(){if(!/(magnus|samoyed)/i.test(document.body.textContent))return;var hit=0;walk(function(t){if(/\\b22(?=\\s*(countries|COUNTRIES|Countries)\\b)/.test(t.nodeValue))hit=1;});if(!hit)return;(window.tllPetCountries?window.tllPetCountries('magnus-waffles'):fetch('/pets/magnus-waffles',{cache:'no-cache'}).then(function(r){return r.text();}).then(function(h){var x=h.match(/window\\.TLL_PET=\\{countries:\"([^\"]*)\"/);if(!x)throw Error('no list');return x[1];})).then(function(c){var m=[0,c];var n=m[1]"

MAIN = [
  # (id, page or site, page id, block, where, find, replace, pages the HTML check covers)
  ('E1', 'home', '69d6145df421c777840c1e46', 'home embed holding <script id=h3-mag-js> (chapter 04 Magnus line; repo copy src/pages/home/live-2026-10-28/embeds/a4c1009d.html)', 'h3-mag-js', PET_FETCH_HOME, PET_NEW_HOME, ['home']),
  ('E2', 'the-paw-passport', '6a3e5e3ed36c8c6a1df1d12e', 'page footer code (freeform) of /the-paw-passport, <script id=tll-paw-mag-count-v1>', 'tll-paw-mag-count-v1', PAW_FIND, PAW_NEW, ['the-paw-passport']),
  ('E3', 'about', '6a0e05a2685ba39d73f2feb7', 'about embed holding the <script> "About (E1.10 and E2.1 ...)" (repo copy src/pages/about/after-2026-10-20b/embed-c024f6d7-about.html)', 'about-facts-script', ABOUT_FIND, ABOUT_NEW, ['about']),
  ('E4', 'home', '69d6145df421c777840c1e46', 'home page head code (freeform), <script id=tll-live-writers-v1>', 'tll-live-writers-v1', WRITERS_FIND, WRITERS_NEW, ['home']),
  ('E5', 'home', '69d6145df421c777840c1e46', 'home embed holding <script id=h3-shelf-js> (the library rail)', 'h3-shelf-js', SHELF_FIND, SHELF_NEW, ['home']),
  ('E6', 'site', None, 'registered site script tllfactsv1 (inline, site footer): a new version 1.1.0 with this one change, applied in place of 1.0.0', 'tllfactsv1', FACTS_FIND, FACTS_NEW, []),
]
OWNER_OK = [
  ('F1', 'site', None, 'INSIDE THE FOOTER COMPONENT "TLL Site Footer" (710ff458-c06e-d602-a663-e5e88ca1456b): the HtmlEmbed holding <style id=tll-foot-v1> and the footer scripts (repo src/components/footer/tll-foot-v1.html), commissioned label script, function home()', 'tll-foot-v1 commissioned script', FOOT_FIND, FOOT_NEW, ['home', 'the-paw-passport', 'profile', 'about', 'story']),
]
