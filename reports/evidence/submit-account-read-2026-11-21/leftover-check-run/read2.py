# Readout for the independent leftover check (21 Nov 2026).
# python3 read2.py A   -> part A: leftover and local-draft runs, c2 (new) vs c3
# python3 read2.py B   -> part B: main 21-scenario set, c3 (this run) vs stored c2 'new' runs of check.md
import json, collections, sys, re
S = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/leftover-check'
D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/acct-check'
FOUR = ['name', 'body', 'excerpt', 'country']
def load(p):
    try: return [json.loads(l) for l in open(p)]
    except FileNotFoundError: return []
def kind(keys): return '-' if not keys else ('helper-only' if not any(k in keys.split(',') for k in FOUR) else 'draft')
def o(s):
    v = s['view']; d = s['draft']; w = len([c for c in s['ms'] if c[1] == 'updateMemberJSON'])
    n = v['name']
    f = {'Account draft title': 'acct-draft', 'Typed here first': 'typed', 'Signed out draft': 'typed', 'A test story for the send check': 'sendtext', 'Local draft title': 'local-draft'}.get(n)
    if not f: f = 'local-body' if v['body'] == 'Only the body, typed last time.' else ('country-only' if v['country'] else 'empty')
    x = [f]
    if v['alreadySent']: x.append('SENTLINE')
    if v['restoredOffer']: x.append('RESTORED' + ('/empty' if f == 'empty' else ''))
    if v['prefilledTags']: x.append('pref%d' % v['prefilledTags'])
    if v['web'] or v['ig']: x.append('web=' + ('typed' if 'typed' in (v['web'] or '') else 'acct' if v['web'] else '-') + ',ig=' + ('acct' if v['ig'] else '-'))
    if 'credit-mode=anonymous' in v['checked']: x.append('radio=anon')
    if 'credit-mode=pen-name' in v['checked']: x.append('radio=pen')
    a = d['account']; x.append('A:' + ('-' if not a else ('SENT' if a['sent'] else kind(a['keys']))))
    if d['accountSent']: x.append('A.sentCopy')
    x.append('L:' + kind(d['browser'])); x.append('w%d' % w)
    return ' '.join(x)
def seq(r, trip=False):
    t = lambda s: (' trip=' + str(s['view'].get('trip'))) if trip else ''
    out = ['load: ' + o(r['first']) + t(r['first'])]
    if r.get('firstAfter20'): out.append('+20s: ' + o(r['firstAfter20']))
    if r.get('afterSend'): out.append('send(posts %d%s): ' % (len(r['posts']), ' failed' if any(p.get('failed') for p in r['posts']) else '') + o(r['afterSend']))
    for v in r['visits']:
        out.append(v['tag'].replace('same browser', 'same').replace('new browser, account after', 'newbr') + ': ' + o(v) + t(v))
        if v.get('after20'): out.append('  +20s: ' + o(v['after20']))
    return out
def saveText(s): return re.sub(r'\d{1,2}:\d{2}( [AP]M)?', 'H:MM', (s['view']['save'] or ''))
def noifr(raw): return re.sub(r'<IFRAME [^>]*></>', '', raw)
def snaps(r):
    l = [r['first']] + ([r['firstAfter20']] if r.get('firstAfter20') else []) + ([r['afterSend']] if r.get('afterSend') else [])
    for v in r['visits']: l += [v] + ([v['after20']] if v.get('after20') else [])
    return l
def detail(s):
    v = s['view']
    return (tuple(v.get(k) for k in ['name', 'excerpt', 'body', 'country', 'city', 'region', 'web', 'ig']), tuple(v['checked']), saveText(s), v['restoredOffer'], v['alreadySent'], v['prefilledTags'],
            json.dumps(s['draft'], sort_keys=True), len([c for c in s['ms'] if c[1] == 'updateMemberJSON']), s['sig']['textNoSave'])
mode = sys.argv[1] if len(sys.argv) > 1 else 'A'
if mode == 'A':
    rows = load(S + '/out/extra.jsonl')
    by = collections.OrderedDict()
    for r in rows: by.setdefault((r['scen'], r['ms'], r['vp']), {})[r['variant']] = r
    for k, vv in by.items():
        print('##', ' '.join(k), '(visit 1 on the live footer)' if vv.get('c3', vv.get('new', {})).get('firstLive') else '')
        for var in ['new', 'c3']:
            r = vv.get(var)
            if not r: print('   ', var, 'MISSING'); continue
            for line in seq(r, trip=True): print('   %-3s | %s' % ('c2' if var == 'new' else 'c3', line))
            print('   %-3s | pageErr %d cons %d misses %d posts %d' % ('c2' if var == 'new' else 'c3', len(r['pageErr']), len(r['cons']), len(r['misses']), len(r['posts'])))
    print('runs', len(rows), 'pageErr', sum(len(r['pageErr']) for r in rows), 'misses', sum(len(r['misses']) for r in rows), 'posts', sum(len(r['posts']) for r in rows))
else:
    old = {(r['scen'], r['ms'], r['vp']): r for r in load(D + '/out/results.jsonl') if r['variant'] == 'new'}
    live = {(r['scen'], r['ms'], r['vp']): r for r in load(D + '/out/results.jsonl') if r['variant'] == 'live'}
    rows = load(S + '/out/main.jsonl'); same = 0; diffs = []
    for r in rows:
        k = (r['scen'], r['ms'], r['vp']); a = old.get(k)
        if not a: print('NO C2 FOR', k); continue
        sa, sb = seq(a), seq(r)
        da = [detail(s) for s in snaps(a)]; db = [detail(s) for s in snaps(r)]
        ca = collections.Counter(c.split(' ', 1)[1] for c in a['cons']); cb = collections.Counter(c.split(' ', 1)[1] for c in r['cons'])
        cnt = (len(a['posts']), len(a['uploads']), len(a['worker']), a.get('sendEnd'), len(a['pageErr'])) == (len(r['posts']), len(r['uploads']), len(r['worker']), r.get('sendEnd'), len(r['pageErr']))
        st = a['first']['sig']['structNoPrefill'] == r['first']['sig']['structNoPrefill']  # stored c2 runs keep only the hash; iframe position moves between loads (check.md)
        ok = sa == sb and da == db and cnt and set(ca) == set(cb)
        print('%-4s %-16s %-6s %-9s seq %s detail %s counts %s consKinds %s (n %d/%d) structHash %s' % ('SAME' if ok else 'DIFF', *k, sa == sb, da == db, cnt, set(ca) == set(cb), sum(ca.values()), sum(cb.values()), st))
        if ok: same += 1
        else:
            diffs.append(k)
            for i in range(max(len(sa), len(sb))):
                x = sa[i] if i < len(sa) else ''; y = sb[i] if i < len(sb) else ''
                if x != y: print('      c2 | ' + x); print('      c3 | ' + y)
            for i, (x, y) in enumerate(zip(da, db)):
                if x != y: print('      detail', i, [(j, p, q) for j, (p, q) in enumerate(zip(x, y)) if p != q])
    print('compared', len(rows), 'same', same, 'diff', diffs)
    print('c3 runs: posts', sum(len(r['posts']) for r in rows), 'uploads', sum(len(r['uploads']) for r in rows), 'worker', sum(len(r['worker']) for r in rows), 'pageErr', sum(len(r['pageErr']) for r in rows), 'misses', sum(len(r['misses']) for r in rows))
    print('c3 console kinds', dict(collections.Counter(c.split(' ', 1)[1] for r in rows for c in r['cons'])))
    print('aborted kinds', sorted(set(re.sub(r'\?.*', '', x)[:70] for r in rows for x in r['aborted']))[:40])
