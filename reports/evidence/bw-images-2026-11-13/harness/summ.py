"""Writes measurements.json for the evidence: Webflow bytes per view from the cache-only runs (n-*)."""
import json, sys
O = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov13/next/bwimg/out/'
def m(t): return json.load(open(O + 'm-' + t + '.json'))
ROWS = [  # label, page, before tag, after tag (after = this branch's layers plus the Webflow proposal where it applies)
    ('home, phone 390 at 3x', 'home', 'home-b-390', 'home-ap-390'),
    ('home, phone 390 at 2x', 'home', 'home-b-390x2', 'home-ap-390x2'),
    ('home, desktop 1440 at 1x', 'home', 'home-b-1440', 'home-ap-1440'),
    ('/the-paw-passport, phone 390 at 3x', 'paw', 'paw-b-390', 'paw-a-390'),
    ('/the-paw-passport, desktop 1440 at 1x', 'paw', 'paw-b-1440', 'paw-a-1440'),
    ('profile page with the most own stories, phone 390 at 3x', 'profile', 'prof-b-390', 'prof-a-390'),
    ('profile page with the most own stories, phone 390 at 2x', 'profile', 'prof-b-390x2', 'prof-a-390x2'),
    ('/stories, phone 390 at 3x', 'stories', 'st-b-390', 'st-a-390'),
    ('/stories, phone 390 at 2x', 'stories', 'st-b-390x2', 'st-a-390x2'),
    ('/stories, desktop 1440 at 1x', 'stories', 'st-b-1440', 'st-a-1440')]
out = []
for label, page, b, a in ROWS:
    for mode in ('top', 'scroll'):
        try: B, A = m('n-%s-%s' % (mode, b)), m('n-%s-%s' % (mode, a))
        except FileNotFoundError: continue
        r = {'view': label, 'mode': 'no scroll, 5 s' if mode == 'top' else 'scrolled to the bottom twice',
             'webflow_bytes_before': B['wfBytes'], 'webflow_bytes_after': A['wfBytes'], 'saved_bytes': B['wfBytes'] - A['wfBytes'],
             'image_bytes_before': B['imgBytes'], 'image_bytes_after': A['imgBytes'], 'image_files_before': B['imgFiles'], 'image_files_after': A['imgFiles']}
        if B['blocked'] or A['blocked']: r['note'] = 'files not in the cache were blocked in both runs (%d, %d); the file picks are compared, the byte totals cover cached files only' % (len(B['blocked']), len(A['blocked']))
        out.append(r)
# home split: layers alone, proposal alone
for mode in ('top', 'scroll'):
    out.append({'view': 'home, phone 390 at 3x, split', 'mode': mode, 'before': m('n-%s-home-b-390' % mode)['wfBytes'], 'layers_only': m('n-%s-home-a-390' % mode)['wfBytes'],
                'proposal_only': m('n-%s-home-bp-390' % mode)['wfBytes'], 'both': m('n-%s-home-ap-390' % mode)['wfBytes']})
json.dump(out, open(sys.argv[1], 'w'), indent=1)
for r in out: print(r)
