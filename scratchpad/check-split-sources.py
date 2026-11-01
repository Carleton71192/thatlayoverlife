"""check-split-sources.py (1 Nov 2026): offline proof that the split build moved code without changing it. For every layer in SCRIPTS,
the code after its header comment must appear verbatim in exactly the outputs the build tables say (core, or the chunks and their
-preview variants), and must also appear verbatim in the one-file bundle at the live pin, so the split carries the same bytes of
code. The story and cover sections, the style loader and the consent fallback are compared byte for byte with the old bundle.
Layers changed after the pin (CHANGED below) are held to a line budget against their source at the pin instead.
Run from the repo root: python3 scratchpad/check-split-sources.py [path to the old one-file bundle]"""
import os, re, sys, subprocess, difflib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
LIVE_PIN = '4fdf0e1'   # 16.49.0, the one-file bundle the lock file records as live
old = sys.argv[1] and open(sys.argv[1], encoding='utf-8').read() if len(sys.argv) > 1 else \
    subprocess.run(['git', 'show', LIVE_PIN + ':src/site-layers/tll-site-layers-v16.js'], capture_output=True, text=True, check=True).stdout
build = open('src/site-layers/build-site-layers-v16.py', encoding='utf-8').read()
ns = {'__file__': os.path.join(ROOT, 'src/site-layers/build-site-layers-v16.py')}
exec(build[:build.index('def read(p)')], ns)   # only the tables, not the build itself
SCRIPTS, CORE, CHUNKS = ns['SCRIPTS'], ns['CORE'], ns['CHUNKS']
# Layers changed since the live pin (1 Nov review of the split): their code is not in the old bundle. Instead the diff against the
# source at the pin may touch at most this many lines (changed, added or removed, header comment included), and the old code must
# still be in the old bundle, so the layer is the one the pin had plus the stated one-line change.
CHANGED = {'tll-album-settings-v1': 3,   # header note (2 lines); the /edit-profile timers became a poll (1 code line)
           'tll-phase0-v1': 5}           # header note (2), comment (2), /pursuits/{slug} joined the parse-time noindex list (1 code line)
def at_pin(f): return subprocess.run(['git', 'show', LIVE_PIN + ':' + f], capture_output=True, text=True, check=True).stdout
def changed_lines(a, b):
    n = 0
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a.splitlines(), b.splitlines(), autojunk=False).get_opcodes():
        if op != 'equal': n += max(i2 - i1, j2 - j1)
    return n
def strip(p):
    s = open(p, encoding='utf-8').read(); m = re.match(r'\s*/\*.*?\*/[ \t]*\r?\n?', s, re.S)
    return (s[m.end():] if m else s).rstrip('\n')
core = open('src/site-layers/tll-site-layers-v16.js', encoding='utf-8').read()
chunks = {f[:-3]: open(os.path.join('src/site-layers/chunks', f), encoding='utf-8').read() for f in sorted(os.listdir('src/site-layers/chunks')) if f.endswith('.js')}
fails = 0
def check(ok, msg):
    global fails
    if not ok: fails += 1
    print(('ok   ' if ok else 'FAIL ') + msg)
for f, _ in SCRIPTS:
    name = os.path.basename(f)[:-3]; code = strip(f)
    if name in CHANGED:
        pinned = at_pin(f); m = re.match(r'\s*/\*.*?\*/[ \t]*\r?\n?', pinned, re.S); pinned_code = (pinned[m.end():] if m else pinned).rstrip('\n')
        n = changed_lines(pinned, open(f, encoding='utf-8').read())
        check(pinned_code in old and 0 < n <= CHANGED[name], 'changed since the pin within budget (%d of %d lines; pinned code in the old bundle: %s): %s' % (n, CHANGED[name], pinned_code in old, name))
    else:
        check(code in old, 'in the old bundle verbatim: ' + name)
    want = set(['core']) if name in CORE else set()
    for cn, rx, pub, staged in CHUNKS:
        if name in pub: want.add(cn); want |= set([cn + '-preview']) if staged else set()
        if name in staged: want.add(cn + '-preview')
    have = set(['core'] if code in core else []) | set(cn for cn, t in chunks.items() if code in t)
    check(want == have, 'placed exactly in %s: %s' % (sorted(want), name) + ('' if want == have else ' (have %s)' % sorted(have)))
STORY_START = "(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;"
check(old[old.index(STORY_START):] == core[core.index(STORY_START):], 'story and cover sections byte-identical to the old bundle')
style_loader = re.search(r"^\(function\(\)\{var L=.*$", old, re.M).group(0) + '\n'   # the style loader is one line
check(style_loader in core, 'style loader byte-identical to the old bundle')
consent = strip('src/site-layers/tll-consent-mode-v2.js')
check(consent in core and core.index(consent) < core.index('Chunk loader'), 'consent fallback present and ahead of the loader')
for n, t in list(chunks.items()) + [('core', core)]:
    marks = re.findall(r'^/\* (src/[^ ]+\.js) \*/$', t, re.M)
    check(len(marks) == len(set(marks)), 'no layer twice in ' + n)
    idx = [[x[0] for x in SCRIPTS].index(m) for m in marks if m != 'src/site-layers/tll-consent-mode-v2.js']
    check(idx == sorted(idx), 'SCRIPTS order kept in ' + n)
print('layers checked:', len(SCRIPTS), 'failures:', fails)
sys.exit(1 if fails else 0)
