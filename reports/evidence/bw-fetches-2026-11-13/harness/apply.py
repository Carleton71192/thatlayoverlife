"""Builds the "after" documents for the cache harness: the saved live www HTML with the proposal applied exactly as the Merge step
would (each find must occur once), plus the two Designer data elements as Webflow renders a one-item collection list with an
HtmlEmbed, filled with the values the CMS holds now (read 13 Nov 2026 by the Data API, read only). The core script tag gets the SRI
of this branch's build; the harness serves that build for the pinned URL. Also writes the tllfactsv1 1.1.0 source."""
import os, sys, re, json, hashlib, base64, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad'
RAW = SP + '/nov13/fontrel/www/raw'; CARRY = SP + '/nov13/fontrel/check/carry/raw/www'; CACHE = SP + '/nov13/fontrel/check/cache'
WT = '/home/user/thatlayoverlife/.claude/worktrees/wf_b3d586d1-61d-2'
spec = importlib.util.spec_from_file_location('edits', os.path.join(HERE, 'edits.py')); E = importlib.util.module_from_spec(spec); spec.loader.exec_module(E)
STATS = {'stories': 57, 'travelers': 6, 'pets': 1, 'countries': 54}  # Site stats item 6ae602fb1fa37291336b8715, read 13 Nov
MAGNUS = 'Brazil, Germany, Czech Republic, Slovakia, Austria, Albania, Serbia, Kosovo, Bulgaria, Sweden, North Macedonia, Hungary, Poland, Luxembourg, Denmark'
D1 = '<div class="w-dyn-list"><div role="list" class="w-dyn-items"><div role="listitem" class="w-dyn-item"><div class="w-embed"><span hidden data-tll-site-stats data-stories="%(stories)d" data-travelers="%(travelers)d" data-pets="%(pets)d" data-countries="%(countries)d"></span></div></div></div></div>' % STATS
D2 = '<div class="w-dyn-list"><div role="list" class="w-dyn-items"><div role="listitem" class="w-dyn-item"><div class="w-embed"><span hidden data-tll-pet="magnus-waffles" data-tll-pet-countries="%s"></span></div></div></div></div>' % MAGNUS
PAGES = {'home': 'home', 'the-paw-passport': 'the-paw-passport', 'contributors__profile-1': 'profile', 'contributors__profile-2': 'profile',
         'contributors__profile-3': 'profile', 'contributors__profile-4': 'profile', 'about': 'about', 'stories__spain-madrid-wedding-ibiza': 'story'}
D1_ON = {'home', 'the-paw-passport', 'profile', 'about', 'story'}; D2_ON = {'home', 'the-paw-passport', 'about'}
core = open(os.path.join(WT, 'src/site-layers/tll-site-layers-v16.js'), 'rb').read()
SRI = 'sha384-' + base64.b64encode(hashlib.sha384(core).digest()).decode()

def src(n):
    p = os.path.join(RAW, n + '.html')
    return open(p if os.path.exists(p) else os.path.join(CARRY, n + '.html'), encoding='utf-8').read()

def build(variant):
    out = os.path.join(HERE, variant); os.makedirs(out, exist_ok=True); log = []
    edits = E.MAIN + (E.OWNER_OK if variant == 'afterF' else [])
    for n, kind in PAGES.items():
        h = src(n)
        for (eid, page, pid, block, sid, find, rep, pages) in edits:
            if kind not in pages: continue
            c = h.count(find); assert c == 1, (eid, n, c); h = h.replace(find, rep); log.append((n, eid))
        i = h.find('<footer data-tll-canonical-footer'); assert i > 0
        add = '' if variant == 'afterCode' else (D1 if kind in D1_ON else '') + (D2 if kind in D2_ON else '')
        h = h[:i] + add + h[i:]
        h, k = re.subn(r'(tll-site-layers-v16\.js" type="text/javascript" integrity=")sha384-[A-Za-z0-9+/=]+', r'\g<1>' + SRI, h); assert k == 1, n
        open(os.path.join(out, n + '.html'), 'w', encoding='utf-8').write(h)
    facts_u = 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25%2F689e5ba67671442434f3ca35%2F6ab13a0d90d9e8873f2f463c%2Ftllfactsv1-1.0.0.js'
    f = open(os.path.join(CACHE, hashlib.sha1(facts_u.encode()).hexdigest() + '.b'), encoding='utf-8').read()
    assert f.count(E.FACTS_FIND) == 1; f2 = f.replace(E.FACTS_FIND, E.FACTS_NEW)
    open(os.path.join(out, 'tllfactsv1-1.1.0.js'), 'w', encoding='utf-8').write(f2)
    return log, len(f2)

if __name__ == '__main__':
    for v in ['after', 'afterF', 'afterCode']:
        log, flen = build(v); print(v, log, 'tllfactsv1 1.1.0 source', flen, 'chars')
