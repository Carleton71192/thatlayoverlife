"""Writes reports/evidence/bw-fetches-2026-11-13/ in the worktree: the Webflow proposal and a sanitized before/after summary
(profile handles replaced by P1..P4, no image file names)."""
import os, json, hashlib, base64, importlib.util, re
H = os.path.dirname(os.path.abspath(__file__))
WT = '/home/user/thatlayoverlife/.claude/worktrees/wf_b3d586d1-61d-2'
OUT = os.path.join(WT, 'reports/evidence/bw-fetches-2026-11-13'); os.makedirs(OUT, exist_ok=True)
spec = importlib.util.spec_from_file_location('edits', os.path.join(H, 'edits.py')); E = importlib.util.module_from_spec(spec); spec.loader.exec_module(E)
core = open(os.path.join(WT, 'src/site-layers/tll-site-layers-v16.js'), 'rb').read()
SRI = 'sha384-' + base64.b64encode(hashlib.sha384(core).digest()).decode()

def edit(t, order):
    eid, page, pid, block, sid, find, rep, pages = t
    return {'id': eid, 'block': block, 'location': ('page ' + page + ' (' + pid + ')') if pid else 'site', 'style_or_script_id': sid,
            'apply_order': order, 'count': 1, 'find': find, 'replace': rep}

D1_PAGES = [('home', '69d6145df421c777840c1e46'), ('/stories', '69d61469f421c777840c204d'), ('/the-paw-passport', '6a3e5e3ed36c8c6a1df1d12e'),
            ('/about', '6a0e05a2685ba39d73f2feb7'), ('Stories Template', '6a0b29eedc14f1444e935766'), ('Contributors Template', '6a0b29c8a7b1840afe9390ab')]
D2_PAGES = [('home', '69d6145df421c777840c1e46'), ('/the-paw-passport', '6a3e5e3ed36c8c6a1df1d12e'), ('/about', '6a0e05a2685ba39d73f2feb7')]
proposal = {
  'title': 'Bandwidth fixes 4 and 5 (reports/bandwidth-2026-11-13.md): no more page downloads for counts; other members\' card photos not loaded on profiles',
  'note': 'Exact find and replace inside each named block; every find occurs exactly once in its block (checked against the live www HTML of 13 Nov 2026 07:35 UTC, where each block is printed verbatim, and against the read of the /the-paw-passport footer code and of the tllfactsv1 source by the Data API). If a find does not match exactly once, skip that edit and report it. Every edited script keeps its old request as the fallback when the layers core or the page data is missing, so the edits are safe in any order. Nothing here touches data-ms-* elements, the nav or footer components, forms or field names (F1, which is inside the footer component, is kept apart under owner_ok_required and is NOT part of this proposal until the owner says so).',
  'needs': {
    'layers_core': 'tllsitelayersv16 at a release commit built from branch claude/fix-bw-fetches-2026-11-13 (adds core layer tll-self-data-v1; chunks unchanged). Build SRI of this branch: ' + SRI + '. Register and apply it the same way as 16.63.0 (rollback 16.63.0, pin 1f2e549aee8627b2f67211463f764380f751c17b, sha384-H+oSdrkcwOOlCvbyOd9Xm+EvqvWHK8Z0lJRpRfsE//z/ZWm7d2GXDxMktP77zztd). Fix 5 (profiles) needs only this.',
    'order': 'Any. The code edits fall back to today\'s requests until the core and the D1/D2 data are live; the core seeds nothing until D1 is on a page.'},
  'edits': [edit(t, i + 1) for i, t in enumerate(E.MAIN)],
  'registered_script': {'id': 'E6', 'how': 'tllfactsv1 is a registered inline script (site footer, version 1.0.0, 1,530 characters). Register version 1.1.0 with the 1.0.0 source after edit E6 (1,775 characters, under the 2,000 limit), then add_site_script tllfactsv1 version 1.1.0, location footer, no attributes, in place of 1.0.0. The other 14 site scripts stay as they are. Rollback: add_site_script tllfactsv1 version 1.0.0.'},
  'designer': [
    {'id': 'D1', 'what': 'Render the Site stats item into the page (fix 4: footer counts and the head story count stop downloading /stories and /sitemap.xml).',
     'pages': [{'page': n, 'page_id': i} for n, i in D1_PAGES],
     'steps': ['On each page, as a page-level element directly before the TLL Site Footer instance (a sibling, NOT inside the footer or nav component): add a Div Block with the custom attribute hidden = hidden.',
               'Inside it add a Collection List bound to Site stats (collection 6ae602821fa37291336b5680), limit 1 item. Leave the Empty State inside the hidden div.',
               'Inside the Collection Item add an Embed with exactly: <span hidden data-tll-site-stats data-stories="STORIES" data-travelers="TRAVELERS" data-pets="PETS" data-countries="COUNTRIES"></span> where each capital word is replaced with the Embed\'s Add Field for the Number field of the same name (stories, travelers, pets, countries).',
               'Read back in the published HTML: one span[data-tll-site-stats] per page with four whole numbers equal to the item (57, 6, 1, 54 on 13 Nov).'],
     'why_not_the_footer': 'The footer component is on every page and would be the natural place, but the footer component is out of bounds for this work. Pages without D1 keep today\'s behavior (one /stories and two sitemap requests per new visitor).'},
    {'id': 'D2', 'what': 'Render Magnus\'s country list into the pages that show his number (fix 4: home, /the-paw-passport, /about stop downloading his pet page). The /the-paw-passport count stays bound to the Pets item.',
     'pages': [{'page': n, 'page_id': i} for n, i in D2_PAGES],
     'steps': ['In the same hidden Div Block as D1 on these pages, add a Collection List bound to Pets (collection 6a0be8194ccc05a63fbdcfa3), limit 20, no filter.',
               'Inside the Collection Item add an Embed with exactly: <span hidden data-tll-pet="SLUG" data-tll-pet-countries="COUNTRIESLIST"></span> with Add Field for Slug and for the plain text field Countries list (countries-list), which is the field the pet page prints as window.TLL_PET.countries.',
               'Read back: span[data-tll-pet="magnus-waffles"] carries the same text as TLL_PET.countries on /pets/magnus-waffles.'],
     'caveat': 'A double quote typed into Countries list would end the attribute early. The pet page has the same limit today (it prints the field inside a JS string).'}],
  'owner_ok_required': [dict(edit(E.OWNER_OK[0], 1), why='This block is inside the footer component (TLL Site Footer). Hard rule: no footer component edits without the owner\'s explicit word. Effect: home makes one /stories request instead of two (77.5 KB less per home first view). Without it everything else still works.')],
  'not_changed_and_why': [
    'tll-live-counts-v3.3 (footer component embed): unchanged. It already reads sessionStorage tllCounts5 first; the core seeds that key from D1 before its DOMContentLoaded run, so it never fetches where D1 is.',
    'tll-live-stories-v1 (site head code): unchanged, same reason (tllStoryN).',
    'Home library rail (h3-shelf-js): still reads /stories once per home view to add stories newer than the ten cards typed in its embed (E5 only shares the request). Removing that request needs the rail to be built from a Stories collection list, a larger Designer change; not done here so the rail stays exactly as it is.',
    'tll_home_story_counter and tllacctpetsv1 (registered scripts): no request on these pages (their elements are absent or the account page only).'],
  'evidence': 'reports/evidence/bw-fetches-2026-11-13/before-after.json (results) and harness/ (the cache harness; profile addresses replaced by profile-1 to profile-4)'}
json.dump(proposal, open(os.path.join(OUT, 'webflow-proposal.json'), 'w'), indent=1, ensure_ascii=False)

# sanitized before/after
alias = {}
def name(p):
    if p.startswith('/contributors/'):
        alias.setdefault(p, 'profile P%d' % (len(alias) + 1)); return alias[p]
    return p
def load(f): return json.load(open(os.path.join(H, f)))
runs = {'before': load('out-before-7.json') + load('out-before-story.json'), 'after': load('out-after-7.json') + load('out-after-story.json'),
        'after_code_only': load('out-afterCode-7.json') + load('out-afterCode-story.json'), 'after_with_F1': load('out-afterF-7.json')}
def probe(p):
    q = {k: v for k, v in p.items() if k not in ('layerCss',)}
    return q
B = {(r['p'], r['w']): r for r in runs['before']}
rows = []
for k, b in B.items():
    row = {'page': name(k[0]), 'width': k[1],
           'before': {'self_requests': b['self'], 'self_wire_bytes': b['selfWire'], 'webflow_image_requests': b['imgReq'], 'webflow_image_wire_bytes': b['imgWire']}}
    for m in ('after', 'after_code_only', 'after_with_F1'):
        A = {(r['p'], r['w']): r for r in runs[m]}
        if k not in A: continue
        a = A[k]
        same = probe(a['probe']) == probe(b['probe']) and a['probeScrolled'] == b['probeScrolled']
        row[m] = {'self_requests': a['self'], 'self_wire_bytes': a['selfWire'], 'webflow_image_requests': a['imgReq'], 'webflow_image_wire_bytes': a['imgWire'],
                  'counts_and_lists_identical': same, 'page_errors': a['errs'], 'non_get_aborted': a['nonGetAborted']}
    p = b['probe']
    row['what_was_compared'] = {'footer': p['footer'], 'tllCounts': p['tllCounts'], 'head_story_numbers': p['storyNumbers'], 'magnus_home': p['mag'],
                                'paw_lines_count': len(p['magN']), 'rail_cards': len(p.get('railAll') or []) or None, 'rail_shown': p.get('railShown'), 'rail_total': p.get('h3Total'),
                                'profile_story_cards': p.get('cards'), 'profile_meta': p.get('storiesMeta'), 'profile_pets_shown': p.get('petsShown'), 'robots': p.get('robots')}
    if 'cards' not in p: row['what_was_compared'] = {k2: v for k2, v in row['what_was_compared'].items() if not k2.startswith('profile_') and k2 != 'robots'}
    rows.append(row)
json.dump({'note': 'Cache harness, 13 Nov 2026. Live www HTML saved by the 07:35 post-publish check (two profiles with stories from the 06:56 carry snapshot); every Webflow-host request served from the local cache or aborted; 0 Webflow bytes and 0 HTML GETs in these runs. Wire bytes are the sizes measured on real loads on 13 Nov (nov13/bandwidth/per-visit): /stories 77,538, /sitemap.xml 3,611, /pets/magnus-waffles 48,141. "after" = core + edits E1 to E6 + Designer data D1/D2 (rendered with the values the CMS holds now); "after_code_only" = core + edits, no Designer data; "after_with_F1" adds the footer edit that needs the owner\'s OK. Each run is one fresh first view (no cookies, no session storage). The rail order is random by design, so its set of cards, shown count and total are compared. Profile image requests before the fix depend on timing (how far the page had laid out before the profile script ran), so they vary run to run.',
           'rows': rows}, open(os.path.join(OUT, 'before-after.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(alias)); print('rows', len(rows))
