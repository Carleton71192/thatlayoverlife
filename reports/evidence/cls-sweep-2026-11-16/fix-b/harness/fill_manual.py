"""fill.json = fill-auto.json (mkfill.py) + the hand-written notes below.  python3 fill_manual.py
Every number in these notes was read from out/exp3/table.md, out/exp3/extra.md or the g-*.jsonl sets named next to it."""
import json, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = json.load(open(os.path.join(B, 'fill-auto.json')))
X = json.load(open(os.path.join(B, 'fill-late.json'))) if os.path.exists(os.path.join(B, 'fill-late.json')) else {}

F['RESNOTE'] = ('All tables: `fix-b/table.md`; one row per load: `fix-b/loads.csv`. %s Loads were made between 22:35 UTC on 16 November and 00:20 UTC on 17 November.' % X.get('WHICH',
    'Which core: three builds are in these tables. The /account and /submit rows are from the final core (' + F['HEAD'] + '). The /stories rows are from 951b08c, and all other rows from bdc6d21. '
    'The three built cores were compared byte for byte: bdc6d21 and 951b08c differ in one condition inside the /stories block of the layer, 951b08c and the final core differ only inside the nav block, which runs on /account and /submit alone. '
    'So each row was measured with the code the final core runs on that page. The control was loaded again alongside each time.'))

F['RESAFTER'] = ('Loads over 0.1 with the new core: none in these five sets (' + F['NBIG'] + ' loads). In the smaller sets (' + F['NSMALL'] + ' more loads) three: '
    'the profile at 1440 with the parser held inside the hero (0.102, control 0.156; "What is left", 6), and two pages with broken code '
    '(/submit at 390 with the site head script throwing, 0.141; /stories at 390 with our chunk not loading, 0.117, control 0.148; see the failure cases).\n\n'
    'Largest paint:\n'
    '- /stories at 390 is earlier (about 300 ms against about 550): the lead card and its photo have their final size from the first paint.\n'
    '- /account at 1440: the same element with both cores, the greeting line of the member dashboard, which the page shows for a moment even to a signed-out visitor ("Found on the way", 7).\n'
    '- At CPU 4x the /stories 390 figure is 2.2 to 3.0 s with either core (the lead photo); the two sets of 3 loads do not separate the cores.')

F['BOXNOTE'] = ('In the standard, CPU 4x and stress sets every cell ended in one state, the same with both cores. In the one-load set three control loads differed '
    'from the new core\'s load by an inline size the site\'s own type floor or touch target script had written (profile 390, Balkans 390, Lisbon 360); '
    'four more loads a cell with each core were equal in all 24. /stories at two other screen sizes: see the card photos point below.')

F['IMGNOTE'] = ('In two cells it asks for fewer (profile 390: 19 against 20; /stories 1440: 70 against 72).\n'
    '- **Card photos far below the screen on /stories (a lab effect).** The card photos are lazy, and which ones the browser asks for depends on where the cards sit before the page\'s scripts sort them. '
    'With the lead card in place early that differs by a few cards far down the page. In the lab a photo that is not in the local cache is aborted, and the site then shows its no-photo panel on that card, which is taller. '
    'Three cells end with a different box list for that reason alone: /stories at 768x1024 (22 photos aborted with the new core, 24 with the control) and at 1440x1200 (2 against 5), '
    'and /stories at 1440 with `tll-lib-lead-v1` throwing (one card more with the new core: it sat 3,888 px down before the sort, against 3,996 px with the control). '
    'At 768x1024 the control itself ended in two different states in two runs. With the uncached photos answered by a local picture instead of aborted, all three cells end with the same box list and body tree as the control (`fix-b/extra.md`).')

F['FAILNOTE'] = 'One cell differs in the lab: /stories at 1440 with `tll-lib-lead-v1` throwing, by one card photo far down the page (the card photos point above).'

F['SPLITNOTE'] = ('the finished page equals the control at every point. /stories (6 points): 0.006 to 0.008 at 390 and 0.020 to 0.030 at 1440 (control 0.027 to 0.029 and 0.040 to 0.093). '
    '/submit after the nav: 0.0002 and 0.0001 (control 0.144 and 0.055). The profile after the hero and before the story list: 0.0004 at 390, 0.002 at 1440 (control 0.076 and 0.118). '
    'Two points stay high: the profile inside the hero (0.057 at 390, 0.102 at 1440; control 0.129 and 0.156; item 6 below) and /account after the nav at 390 (0.094; control 0.241; item 5 below; 0.019 at 1440).')

F['SIZENOTE'] = ('one load a cell. /account 1440x1200: 0.003 (control 0.300); the four phone and tablet sizes 0.004 to 0.009 with either core (item 4 below). '
    '/submit: 0.0003 to 0.007 (control 0.092 to 0.182), and 0.050 at 412x915 (control 0.197). '
    'Profile: 0.0004 to 0.008 at the four phone and tablet sizes (control 0.011 to 0.334), 0.039 at 1440x1200 (control 0.182). '
    '/stories: 0.008 at 360x800 and 390x1100 (control 0.018 to 0.040), 0.031 at 768x1024 (control 0.031), 0.029 at 1440x1200 (control 0.043), 0.099 at 412x915 (control 0.117). The high ones are item 10 below.')

F['SIZELEFT'] = ('\n   - /stories at 412x915: 0.099 (control 0.117). At this width the title takes one more line when Playfair arrives, 29 px, with either core: the C7 font jump, left alone as agreed. '
    'With the fonts blocked the same line is added when our chunk writes the story count (33 px, 0.110). The lab\'s fallback faces are not a phone\'s, so whether a phone wraps here is not known from the lab. Worth a look on a real phone at this width.\n'
    '   - /submit at 412x915: 0.050. A font jump: 0.000 with the fonts blocked (C10).\n'
    '   - /submit on tall screens (390x1100, 768x1024, 1440x1200): 0.004 to 0.007. A block of the form near the bottom of the page gets 56 px shorter when the page code runs.\n'
    '   - Profile at 1440x1200: 0.037. A section 1,000 px down is taken out about 1 s into the load (our profile chunk and the album; item 3). Below the screen at 1440x900.\n'
    '   - Profile at 390x1100 and 768x1024: 0.005 and 0.008, the home base going out again (item 3).')

F['PROFC'] = '0.057 at 390 and 0.102 at 1440; the control 0.129 and 0.156'

F['IMGCOST'] = ('no new request and none earlier than before, with one small exception. The stand-ins ask for no file. The exception: on /stories the set of lazy card photos '
    'the browser asks for can differ by a few cards far below the screen, in both directions (two fewer in the standard 1440 load, one more at 1440 when `tll-lib-lead-v1` throws; see "The finished page").')

F['SETS'] = ('standard (5 loads a cell: the eight scope cells, home, three stories at 360, 390 and 1440), CPU 4x and stress (3 loads a scope cell), the part A pages and five more pages (3 loads a cell), '
    'first paint (8 more loads on six cells), finished page (1 load a cell on all 37 cells, with the body tree and head), parser held (11 points), failure cases (11 cases, 23 cells), other screens (5 sizes a scope page). '
    + F['NALL'] + ' loads in these sets, half of them control. ' + 'The /stories cells of every set were run again after the lead card change and the /account and /submit cells after the nav piece was rewritten; see "Results" for which build each row is from.'
    + ' Smaller checks named in the text (`out` files `g-*`): ' + 'four more finished-page loads on four cells (dom2), fonts blocked at 412x915 and a card trace at 1440 (diag), uncached photos answered locally (ph), the members wrapper when the page is parsed (a3), work per run of the layer (tt), first paint at CPU 4x with 6 loads (cpufcp2).')
fl = os.path.join(B, 'out', 'final5.flag'); done5 = open(fl).read().split() if os.path.exists(fl) else []
todo = [x for x in ('std', 'cpu', 'dom', 'fail', 'split', 'slow', 'sizes', 'fcp') if x not in done5]
F['STATUS'] = ('**Status, not final:** the /account and /submit rows of these sets are still being measured again with the final core: ' + ', '.join(todo) + '. Until this line is gone, those rows in the tables are from build bdc6d21, whose nav piece had the fault described under "Found on the way", 6. One load a cell with the final core is in already (the a3 check in `fix-b/extra.md`).\n\n') if todo else ''
json.dump(F, open(os.path.join(B, 'fill.json'), 'w'), indent=1)
print('fill.json', len(F), 'keys')
