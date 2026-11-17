"""Final result files: out/m-<set>.jsonl =
   out/f-<set>.jsonl (core of bdc6d21) without its /stories, /account and /submit rows
 + out/s-<set>.jsonl (/stories again after the lead card change, control and core-b14; rows of the core before that change are left out)
 + out/t-<set>.jsonl (/account and /submit again after the nav piece was rewritten, control and the final core).
A set that has not finished (out/final4.flag for s-, out/final5.flag for t-) keeps its f- rows.   python3 merge.py"""
import json, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def flag(f):
    p = os.path.join(B, 'out', f); return open(p).read().split() if os.path.exists(p) else []
DONE_S, DONE_T = flag('final4.flag'), flag('final5.flag')
NAV = ('account', 'submit')
for s in ['std', 'cpu', 'slow', 'other', 'dom', 'split', 'fail', 'sizes', 'fcp']:
    use_s = s in DONE_S and os.path.exists(os.path.join(B, 'out', 's-%s.jsonl' % s))
    use_t = s in DONE_T and os.path.exists(os.path.join(B, 'out', 't-%s.jsonl' % s))
    out = []; n = [0, 0, 0]
    for l in open(os.path.join(B, 'out', 'f-%s.jsonl' % s)):
        r = json.loads(l)
        if (r['page'] == 'stories' and use_s) or (r['page'] in NAV and use_t): continue
        out.append(l.rstrip('\n')); n[0] += 1
    if use_s:
        for l in open(os.path.join(B, 'out', 's-%s.jsonl' % s)):
            if 'core-b11' in json.loads(l)['v']: continue
            out.append(l.rstrip('\n')); n[1] += 1
    if use_t:
        for l in open(os.path.join(B, 'out', 't-%s.jsonl' % s)): out.append(l.rstrip('\n')); n[2] += 1
    open(os.path.join(B, 'out', 'm-%s.jsonl' % s), 'w').write('\n'.join(out) + '\n')
    print(s, n[0], 'rows kept,', n[1], '/stories rows,', n[2], '/account and /submit rows', '' if (use_s or s == 'other') and (use_t or s == 'other') else '(NOT ALL FINAL)')
