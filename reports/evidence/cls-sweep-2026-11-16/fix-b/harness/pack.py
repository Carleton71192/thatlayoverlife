"""Copy the part B harness into the report folder with the scratch path shortened to B. python3 pack.py <outdir>"""
import os, sys, json, glob, re
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1]; os.makedirs(os.path.join(out, 'var'), exist_ok=True)
SP = os.path.dirname(os.path.dirname(B))  # .../scratchpad
def short(t): return t.replace(B, 'B').replace(SP, 'SCRATCH')
for f in ['h2.cjs', 'mkfinal.py', 'final.sh', 'final4.sh', 'final5.sh', 'mk15.py', 'publish.sh', 'after4.sh', 'after5.sh', 'after6.sh', 'more.sh', 'merge.py', 'export.py', 'extra.py', 'mkfill.py', 'fill_manual.py', 'assemble.py', 'an.py', 'sh.py', 'cmp2.py', 'imgs.py', 'mk.py', 'pack.py']:
    p = os.path.join(B, 'bin', f)
    if os.path.exists(p): open(os.path.join(out, f), 'w').write(short(open(p).read()))
for f in sorted(glob.glob(os.path.join(B, 'out', 'j-*.json'))):
    n = os.path.basename(f)
    if not re.match(r'j-(std|cpu|slow|other|dom|split|fail|sizes|fcp|diag|lcp|dom2|tt|ph|acct|cpufcp2)\.json$', n): continue
    open(os.path.join(out, n), 'w').write(short(open(f).read()))
for f in sorted(glob.glob(os.path.join(B, 'out', 'k-*.json'))) + sorted(glob.glob(os.path.join(B, 'out', 'n-*.json'))):  # /stories (k-) and /account, /submit (n-) run again after the last changes
    open(os.path.join(out, os.path.basename(f)), 'w').write(short(open(f).read()))
for f in sorted(glob.glob(os.path.join(B, 'var', 'p-*.json'))) + [os.path.join(B, 'var', x) for x in ('ev-dom.js', 'ev-tt.js', 'ev-lcp.js', 'init-egypt.js', 'init-acct.js', 'init-a3.js')]:
    if os.path.exists(f): open(os.path.join(out, 'var', os.path.basename(f)), 'w').write(short(open(f).read()))
bad = []
for root, _, files in os.walk(out):
    for f in files:
        t = open(os.path.join(root, f)).read()
        if '/tmp/claude' in t or 'contributors/' in t and 'contributors/<profile>' not in t and 'contributors\\/' not in t: bad.append(f)
print('packed', sum(len(fs) for _, _, fs in os.walk(out)), 'files; check', bad)
