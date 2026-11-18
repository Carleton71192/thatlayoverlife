# summary table for the form runs (reads an.py json); no story text, no member data
import json, sys, subprocess
P = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov18/check1668-behavior'
src = sys.argv[1] if len(sys.argv) > 1 else P + '/out/results.jsonl'
rows = json.loads(subprocess.check_output(['python3', '-I', P + '/bin/an.py', src, 'json']))
raw = [json.loads(l) for l in open(src)]
FAIL = 'Saved. The editor will add it to the draft list by hand.'
out = []
for d, r in zip(rows, raw):
    L = d['loaded']
    ok_posts = sum(1 for p in d['posts'] if p[1] == 'ok'); fail_posts = sum(1 for p in d['posts'] if p[1] == 'FAIL')
    vis = []
    for v in (d['visits'] or []):
        vis.append(dict(tag=v['tag'], restored=v['view']['restoredOffer'], already=v['view']['alreadySent'], title=bool(v['view']['title']), body=v['view']['bodyFilled'],
                        acct_sent=(v['draft']['account'] or {}).get('sent'), acct_fields=(v['draft']['account'] or {}).get('fields'),
                        after20=(v.get('after20') and dict(restored=v['after20']['view']['restoredOffer'], acct_sent=(v['after20']['draft']['account'] or {}).get('sent'), sentCopy=bool(v['after20']['draft']['accountSent'])))))
    de = d['draft_end'] or {}
    out.append(dict(run=d['run'], page=r['page'], host=r['host'], scen=r['scen'], vp=r['vp'],
        core=L['core'], pc=L.get('pcTag'), chunks=sorted(set(r.get('jsResp') or [])), selfDoc=L.get('selfDoc'), pcRan=L['pc'], cBlock=L['cPatched'],
        docs=len(r['docs']), docStatus=r.get('docStatus'), navAborted=r['navAborted'],
        presses=len(d['presses']), pressesWithEvent=d['presses_with_event'], swallowed=len(d['swallowed']),
        uploads=len(d['uploads']), uploadsFailed=sum(1 for u in d['uploads'] if u[2] == 'FAIL'),
        postsOk=ok_posts, postsFailed=fail_posts, worker=len(d['worker']),
        faded=d['silent_faded_s'], labels=d['labels'], done_at=d['done_at'], done_first=d['done_first'], done_last=d['done_last'], fail_box=d['fail_box'],
        intake=d['intake_seq'], failLineExact=(FAIL in d['intake_seq']), siv=len(d['siv']),
        writes_after_done=[[w[1], w[2]] for w in d['writes_after_done']], acct_end=dict(sent=(de.get('account') or {}).get('sent'), fields=(de.get('account') or {}).get('fields'), gallery=(de.get('account') or {}).get('gallery'), hero=(de.get('account') or {}).get('hero')) if de.get('account') else None,
        visits=vis, pageErr=d['pageErr'], cons=d['cons'], aborted=d['aborted'], misses=d['misses'], nonStubNonGet=[a for a in r['aborted'] if not a.startswith('GET')],
        netHosts=sorted(set(r['netHosts'])), docBytes=r.get('docBytes')))
if len(sys.argv) > 2 and sys.argv[2] == 'json': print(json.dumps(out, indent=1, ensure_ascii=False)); sys.exit()
def f(x): return '-' if x is None else x
print('| page | scenario | width | host | core / photo clean | presses (with submit) | swallowed | uploads | form posts ok / failed | Worker | faded, own label (s) | done box (s, % in view) | line under the done box | account after |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for o in out:
    pcs = (o['pc'][0][:8] if o['pc'] else 'none')
    acct = '-' if not o['acct_end'] else ('marked sent' if o['acct_end']['sent'] else 'unsent draft') + ', %s fields' % o['acct_end']['fields']
    db = 'fail box' if o['fail_box'] and not o['done_at'] else '%s, %s%%' % (o['done_at'], (o['done_first'] or {}).get('pct'))
    print('| %s | %s | %s | %s | %s / %s | %d (%d) | %d | %d%s | %d / %d | %d | %.1f | %s | %s | %s |' % (o['page'], o['scen'], o['vp'].split('x')[0], o['host'], o['core'][0][:8], pcs, o['presses'], o['pressesWithEvent'], o['swallowed'], o['uploads'], ' (%d failed)' % o['uploadsFailed'] if o['uploadsFailed'] else '', o['postsOk'], o['postsFailed'], o['worker'], o['faded'], db, ' / '.join(o['intake']) or '-', acct))
