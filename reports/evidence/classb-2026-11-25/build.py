"""Class B page code drafts of 27 Nov 2026: writes each item's after.html from its before.html (the live block) and hashes.tsv.
Reads and writes only files in this folder; no Webflow access. Run: python3 -I build.py"""
import os, hashlib, base64
OUT = os.path.dirname(os.path.abspath(__file__))

def rd(p): return open(os.path.join(OUT, p), encoding='utf8').read()
def rep(s, a, b):
    assert s.count(a) == 1, ('not exactly once', a[:80], s.count(a)); return s.replace(a, b)

SUB_FOOT = rd('B02-submit-autosave/before.html')
SUB_HEAD = rd('B18-submit-picker-roles/before.html')
EP_FOOT = rd('B17-edit-profile-script-id/before.html')
PETS_FOOT = rd('B08-my-pets-heading/before.html')

# B02: /submit footer, this browser's copy saved 1 s after typing stops, on tab hide and on page leave
B02_A = "var timer=setInterval(autosave,20000);\n"
B02_B = B02_A + (
"/* 27 Nov 2026 (sweep B02): text typed in the 20 s before a reload or a closed tab was lost. This browser's copy is now also saved 1 s after typing\n"
"   stops, when the tab is hidden and when the page is left. The account copy stays on the 20 s timer (local() leaves last alone, so the autosave\n"
"   still sends the change). Same rules as the autosave: only with words the writer typed (own), never after the send, and not again after Send\n"
"   until the writer types (the submit handler below removes this browser's copy). */\n"
"var held=false,lt=null;\n"
"function local(){if(sent||held)return;var o=snap();if(!own(o))return;try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}}\n"
"f.addEventListener('input',function(){held=false;clearTimeout(lt);lt=setTimeout(local,1000);});\n"
"f.addEventListener('submit',function(){held=true;clearTimeout(lt);});\n"
"window.addEventListener('pagehide',local);\n"
"document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')local();});\n")

# B15: /submit footer style tll-form-steps-v2, the step bar segments
B15_A = (".tllst-seg{flex:1;height:5px;background:#EDE6DA;border-radius:6px;border:0;padding:0;cursor:pointer;transition:background .3s}\n"
".tllst-seg.on{background:#067A79}\n"
".tllst-seg.done{background:#0A0B14}\n")
B15_B = ("/* 27 Nov 2026 (sweep B15): a 6 px bar drawn inside a 44 px tap target, the same at 390 and 1440 (the site touch floor had made each segment a 44 px block at 390). */\n"
".tllst-seg{flex:1;height:44px;min-height:44px;background:linear-gradient(#EDE6DA,#EDE6DA) center/100% 6px no-repeat;border-radius:0;border:0;padding:0;cursor:pointer;transition:background .3s}\n"
".tllst-seg.on{background:linear-gradient(#067A79,#067A79) center/100% 6px no-repeat}\n"
".tllst-seg.done{background:linear-gradient(#0A0B14,#0A0B14) center/100% 6px no-repeat}\n")

# B18: /submit head script tll-share-fork-js-v1, the two picks say they are buttons and answer Space
B18_A = "    fork.addEventListener('click',function(e){var a=e.target.closest('[data-tll-fork-pick]'); if(!a) return; e.preventDefault(); pick(a.getAttribute('data-tll-fork-pick'));});\n"
B18_B = B18_A + (
"    /* 27 Nov 2026 (sweep B18): the two picks are links that act as toggle buttons (aria-pressed), so they say so (role=button) and answer Space\n"
"       like a button. Enter already works (a link click). The Designer can carry the role later; setting it twice does no harm. */\n"
"    [].forEach.call(fork.querySelectorAll('[data-tll-fork-pick]'),function(a){a.setAttribute('role','button');});\n"
"    fork.addEventListener('keydown',function(e){if(e.key!==' '&&e.key!=='Spacebar') return; var a=e.target.closest('[data-tll-fork-pick]'); if(!a) return; e.preventDefault(); pick(a.getAttribute('data-tll-fork-pick'));});\n")

# B17: /edit-profile footer, the script no longer shares its id with the head style
B17_A = '<script id="tll-edit-dir-v1">'
B17_B = '<script id="tll-edit-dir-v1-js">'

# B08 part 1: /my-pets footer, heading() at 0 pets and the add card title
B08_A = "  function heading(){if(!title)return;var em=title.querySelector('em');var n=pets.length;if(em)em.textContent=n+(n===1?' bestie':' besties');}\n"
B08_B = ("  /* 27 Nov 2026 (sweep B08): at 0 pets the heading keeps its Designer words (\"your besties\", not \"0 besties\") and the add card asks for the first pet. */\n"
"  function heading(){if(!title)return;var em=title.querySelector('em');var n=pets.length;if(em)em.textContent=n?n+(n===1?' bestie':' besties'):'your besties';\n"
"    var add=document.querySelector('.tll-mypets-card-add-title');if(add)add.textContent=n?'Register another pet':'Register your pet';}\n")

items = {
  'B02-submit-autosave': [('footer', '6a0d5e5eb7804d3a750dc266', '/submit', SUB_FOOT, rep(SUB_FOOT, B02_A, B02_B))],
  'B15-submit-step-bar': [('footer', '6a0d5e5eb7804d3a750dc266', '/submit', SUB_FOOT, rep(SUB_FOOT, B15_A, B15_B))],
  'B18-submit-picker-roles': [('head', '6a0d5e5eb7804d3a750dc266', '/submit', SUB_HEAD, rep(SUB_HEAD, B18_A, B18_B))],
  'B17-edit-profile-script-id': [('footer', '6a0df371cd5b09ac504421ae', '/edit-profile', EP_FOOT, rep(EP_FOOT, B17_A, B17_B))],
  'B08-my-pets-heading': [('footer', '6a0df9ffc4a846ee4db92b63', '/my-pets', PETS_FOOT, rep(PETS_FOOT, B08_A, B08_B))],
}
# B02 and B15 change the same /submit footer block: one combined after for a single write
items['submit-footer-B02-B15'] = [('footer', '6a0d5e5eb7804d3a750dc266', '/submit', SUB_FOOT, rep(rep(SUB_FOOT, B02_A, B02_B), B15_A, B15_B))]

def sri(s): return 'sha384-' + base64.b64encode(hashlib.sha384(s.encode('utf8')).digest()).decode()
def hx(s): return hashlib.sha384(s.encode('utf8')).hexdigest()
rows = []
for name, blocks in items.items():
    d = os.path.join(OUT, name); os.makedirs(d, exist_ok=True)
    for loc, pid, path, before, after in blocks:
        assert before != after and len(after) < 50000
        open(os.path.join(d, 'before.html'), 'w', encoding='utf8').write(before)
        open(os.path.join(d, 'after.html'), 'w', encoding='utf8').write(after)
        rows.append((name, path, pid, loc, len(before), len(after), len(after) - len(before), hx(before), hx(after), sri(before), sri(after)))
with open(os.path.join(OUT, 'hashes.tsv'), 'w', encoding='utf8') as f:
    f.write('item\tpage\tpage_id\tblock\tbefore_chars\tafter_chars\tdelta\tbefore_sha384_hex\tafter_sha384_hex\tbefore_sri\tafter_sri\n')
    for r in rows: f.write('\t'.join(map(str, r)) + '\n')
for r in rows: print(r[0], r[1], r[3], r[4], r[5], r[6], r[7][:16], r[8][:16])
