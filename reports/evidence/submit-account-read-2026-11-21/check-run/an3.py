import json, sys, collections
D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/acct-check'
rows = [json.loads(l) for l in open(D + '/out/results.jsonl')]
def vsum(s):
    if not s: return '-'
    v = s['view']; d = s['draft']
    filled = ','.join(k for k in ['name', 'excerpt', 'body', 'country', 'city', 'region'] if v.get(k))
    dcl = v.get('dcl') or 0
    ms_at = (v['msAt'] - dcl) if v.get('msAt') else None
    reads = [c[0] - dcl for c in s['ms'] if c[1] == 'getMemberJSON']
    writes = [c for c in s['ms'] if c[1] == 'updateMemberJSON']
    out = {
        'filled': filled or 'empty', 'vals': {k: v[k] for k in ['name', 'country', 'web', 'ig'] if v.get(k)}, 'checked': v['checked'],
        'save': (v['save'] or '')[:60], 'restored': v['restoredOffer'], 'sentLine': v['alreadySent'], 'pref': v['prefilledTags'],
        'msAt': ms_at, 'reads': reads[:4], 'writes': len(writes),
        'acct': d['account'] and (('SENT ' if d['account']['sent'] else 'unsent ') + d['account']['keys']), 'acctSentCopy': bool(d['accountSent']), 'browser': d['browser'],
    }
    return out
by = collections.OrderedDict()
for r in rows:
    k = (r['scen'], r['ms'], r['vp']); by.setdefault(k, {})[r['variant']] = r
for k, vv in by.items():
    print('==', *k)
    for var in ['live', 'new']:
        r = vv.get(var)
        if not r: print('  ', var, 'MISSING'); continue
        print('  ', var, 'posts', len(r['posts']), 'failed', sum(1 for p in r['posts'] if p.get('failed')), 'pageErr', len(r['pageErr']), 'cons', len(r['cons']), 'aborted', len(r['aborted']), 'misses', len(r['misses']), 'msScript', r.get('msScript'), 'send', r.get('sendEnd'), 'preAuto', r.get('preAutosave'))
        print('     first', json.dumps(vsum(r['first'])))
        if r.get('firstAfter20'): print('     +20s ', json.dumps(vsum(r['firstAfter20'])))
        if r.get('afterSend'): print('     sent ', json.dumps(vsum(r['afterSend'])))
        for v in r['visits']:
            print('     ', v['tag'][:34].ljust(34), json.dumps(vsum(v)))
            if v.get('after20'): print('      +20s'.ljust(41), json.dumps(vsum(v['after20'])))
    if 'live' in vv and 'new' in vv:
        a, b = vv['live'], vv['new']
        sa, sb = a['first']['sig'], b['first']['sig']
        print('   sig first: struct', sa['struct'] == sb['struct'], 'structNoPrefill', sa['structNoPrefill'] == sb['structNoPrefill'], 'text', sa['text'] == sb['text'], 'textNoSave', sa['textNoSave'] == sb['textNoSave'])
        ca = collections.Counter(c.split(' ', 1)[1] for c in a['cons']); cb = collections.Counter(c.split(' ', 1)[1] for c in b['cons'])
        print('   console same:', ca == cb, '' if ca == cb else ('new-only ' + str(cb - ca) + ' live-only ' + str(ca - cb)))
        print('   pageErr', a['pageErr'][:2], b['pageErr'][:2], 'aborted same:', sorted(set(a['aborted'])) == sorted(set(b['aborted'])))
allab = collections.Counter(x for r in rows for x in r['aborted'])
print('ABORTED (all runs):', dict(allab))
print('MISSES (all runs):', sum(len(r['misses']) for r in rows), 'runs', len(rows))
print('POSTS total', sum(len(r['posts']) for r in rows), 'uploads', sum(len(r['uploads']) for r in rows), 'worker', sum(len(r['worker']) for r in rows))
print('PAGEERR', [e for r in rows for e in r['pageErr']][:5])
print('CONS kinds', collections.Counter(c.split(' ', 1)[1] for r in rows for c in r['cons']))
