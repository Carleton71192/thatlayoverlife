import json, sys
S = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov17/submit-check'
rows = [json.loads(l) for l in open(S + '/out/results.jsonl')]
ORIG = 'Send it to the editor'
def seq(xs):
    o = []
    for x in xs:
        if not o or o[-1] != x: o.append(x)
    return o
out = []
for r in rows:
    T0 = r['T0']; L = r['end']['L']; tl = L['tl']
    rel = lambda t: round((t - T0) / 1000, 1)
    tl = [e for e in tl if e['t'] >= T0 - 200]
    done_at = next((e['t'] for e in tl if e['done']), None)
    # faded and silent: button disabled, own label, form visible
    silent = 0.0
    for a, b in zip(tl, tl[1:] + [None]):
        if a['formVis'] and a['dis'] and a['btn'] == ORIG:
            silent += ((b['t'] if b else a['t']) - a['t']) / 1000
    presses = [rel(p['t']) for p in r['presses']]
    subs = [(rel(s['t']), s['submitter']) for s in L['subs'] if s['form'] == 'submit-story']
    rs = [rel(x['t']) for x in L['rs'] if x['form'] == 'submit-story']
    # a requestSubmit is swallowed when no submit event fires for it: events near it, minus the press that caused one, is zero
    swallowed = [t for t in rs if sum(1 for s in subs if abs(t - s[0]) <= 0.15) - sum(1 for p in presses if abs(t - p) <= 0.15) < 1]
    effective = sum(1 for p in presses if any(abs(p - s[0]) <= 0.15 for s in subs))
    first_done = next((e for e in tl if e['done']), None)
    last = tl[-1] if tl else {}
    ms_after = [c for c in (r['end']['ms'] or []) if done_at and c[0] > done_at and c[1] == 'updateMemberJSON']
    d = dict(
        run=f"{r['variant']} {r['scen']} {r['vp']}",
        loaded=r['loaded'],
        presses=presses, presses_with_event=effective, submit_events=subs, requestSubmit=rs, swallowed=swallowed,
        uploads=[(rel(u['t']), u['folder'].split('/')[-1], u['fname'], 'FAIL' if u.get('failed') else 'ok') for u in r['uploads']],
        posts=[(rel(p['t']), 'FAIL' if p.get('failed') else 'ok', p['gallery'], bool(p['hero']), p['body_end']) for p in r['posts']],
        worker=[(rel(w['t']), w['kind'], w['auth']) for w in r['worker']], preflight=r['preflight'],
        done_at=rel(done_at) if done_at else None,
        labels=seq([e['btn'] + (' [disabled]' if e['dis'] else '') for e in tl if e['formVis']]),
        up=seq([e['up'] for e in tl if e['up'] is not None and e['formVis']]),
        silent_faded_s=round(silent, 2),
        endSend=seq([(e['endSend'], e['endSendRole']) for e in tl if e['endSend']]), endBody=seq([e['endBody'] for e in tl if e['endBody']]),
        fail_box=any(e['fail'] for e in tl),
        done_first=(first_done and dict(top=first_done['doneTop'], bot=first_done['doneBot'], pct=first_done['doneVisPct'], sy=first_done['sy'], docH=first_done['docH'])),
        done_last=(last.get('done') and dict(top=last['doneTop'], bot=last['doneBot'], pct=last['doneVisPct'], sy=last['sy'])),
        intake=seq([(rel(e['t']), e['intake'], e['intakeRole']) for e in tl if e['intake']]) and [x for x in seq([(e['intake'], e['intakeRole']) for e in tl if e['intake']])],
        intake_first_t=next((rel(e['t']) for e in tl if e['intake']), None),
        active=seq([e['active'] for e in tl]),
        siv=[(rel(x['t']), x['el'], x['o']) for x in L.get('siv', []) if x['t'] >= T0],
        foc=[(rel(x['t']), x['el'], x['vis']) for x in L.get('foc', []) if x['t'] >= T0],
        cons=sorted(set(r['cons'])), pageErr=r['pageErr'], aborted=sorted(set(r['aborted'])),
        autosave_after_done=len(ms_after), ls=r['end']['ls'], msJSON=r['end']['msJSON'],
    )
    out.append(d)
if len(sys.argv) > 1 and sys.argv[1] == 'json':
    print(json.dumps(out, indent=1, ensure_ascii=False))
else:
    for d in out:
        print('=====', d['run'])
        for k, v in d.items():
            if k != 'run': print(' ', k, ':', v)
