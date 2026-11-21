import json, collections, sys
D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/acct-check'
rows = [json.loads(l) for l in open(D + '/out/' + (sys.argv[1] if len(sys.argv) > 1 else 'results.jsonl'))]
def o(s):
    v = s['view']; d = s['draft']; w = len([c for c in s['ms'] if c[1] == 'updateMemberJSON'])
    f = 'acct-draft' if v['name'] == 'Account draft title' else ('typed' if v['name'] in ('Typed here first', 'Signed out draft') else ('sendtext' if v['name'] == 'A test story for the send check' else ('country-only' if v['country'] else 'empty')))
    x = [f]
    if v['alreadySent']: x.append('SENTLINE')
    if v['restoredOffer']: x.append('RESTORED' + ('/empty' if f == 'empty' else ''))
    if v['prefilledTags']: x.append('pref%d' % v['prefilledTags'])
    if v['web'] or v['ig']: x.append('web=' + ('typed' if 'typed' in (v['web'] or '') else 'acct' if v['web'] else '-') + ',ig=' + ('acct' if v['ig'] else '-'))
    if 'credit-mode=anonymous' in v['checked']: x.append('radio=anon')
    if 'credit-mode=pen-name' in v['checked']: x.append('radio=pen')
    a = d['account']; x.append('A:' + ('-' if not a else ('SENT' if a['sent'] else ('helper-only' if not any(k in a['keys'].split(',') for k in ['name', 'body', 'excerpt', 'country']) else 'draft'))))
    if d['accountSent']: x.append('A.sentCopy')
    b = d['browser']; x.append('L:' + ('-' if not b else ('helper-only' if not any(k in b.split(',') for k in ['name', 'body', 'excerpt', 'country']) else 'draft')))
    x.append('w%d' % w)
    return ' '.join(x)
out = collections.OrderedDict()
for r in rows:
    k = (r['scen'], r['ms'], r['vp'])
    seq = ['load: ' + o(r['first'])]
    if r.get('firstAfter20'): seq.append('+20s: ' + o(r['firstAfter20']))
    if r.get('afterSend'): seq.append('send(posts %d%s): ' % (len(r['posts']), ' failed' if any(p.get('failed') for p in r['posts']) else '') + o(r['afterSend']))
    for v in r['visits']:
        seq.append(v['tag'].replace('same browser', 'same').replace('new browser, account after', 'newbr') + ': ' + o(v))
        if v.get('after20'): seq.append('  +20s: ' + o(v['after20']))
    out.setdefault(k, {})[r['variant']] = (seq, r)
for k, vv in out.items():
    print('##', ' '.join(k))
    L, N = vv['live'], vv['new']
    for i in range(max(len(L[0]), len(N[0]))):
        a = L[0][i] if i < len(L[0]) else ''; b = N[0][i] if i < len(N[0]) else ''
        print('   live | ' + a); print('   new  | ' + b) if a != b else print('   new  | (same)')
    ca = collections.Counter(c.split(' ', 1)[1] for c in L[1]['cons']); cb = collections.Counter(c.split(' ', 1)[1] for c in N[1]['cons'])
    kinds = set(ca) | set(cb)
    print('   console kinds', sorted(kinds), 'counts', sum(ca.values()), sum(cb.values()), '| pageErr', len(L[1]['pageErr']), len(N[1]['pageErr']), '| textNoSave same', L[1]['first']['sig']['textNoSave'] == N[1]['first']['sig']['textNoSave'], '| structNoPrefill same', L[1]['first']['sig']['structNoPrefill'] == N[1]['first']['sig']['structNoPrefill'])
print('runs', len(rows), 'posts', sum(len(r['posts']) for r in rows), 'uploads', sum(len(r['uploads']) for r in rows), 'worker', sum(len(r['worker']) for r in rows), 'misses', sum(len(r['misses']) for r in rows))
print('aborted', dict(collections.Counter(x for r in rows for x in r['aborted'])))
print('all console kinds', dict(collections.Counter(c.split(' ', 1)[1] for r in rows for c in r['cons'])), 'pageErr', sum(len(r['pageErr']) for r in rows))
