import json, sys
S='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov18/submit-final-check'
src = sys.argv[1] if len(sys.argv) > 1 else S + '/out/results.jsonl'
rows = [json.loads(l) for l in open(src)]
def seq(xs):
    o = []
    for x in xs:
        if not o or o[-1] != x: o.append(x)
    return o
out = []
for r in rows:
    T0 = r['T0']; L = r['end']['L']; tl = [e for e in L['tl'] if e['t'] >= T0 - 200]
    rel = lambda t: round((t - T0) / 1000, 1)
    ORIG = r['pre']['btn']; FORM = {'submit': 'submit-story', 'share-photos': 'share-photos', 'my-pets': 'add-pet'}[r['page']]
    done_at = next((e['t'] for e in tl if e['done']), None)
    silent = 0.0
    for a, b in zip(tl, tl[1:] + [None]):
        if a['formVis'] and a['dis'] and a['btn'] == ORIG: silent += ((b['t'] if b else a['t']) - a['t']) / 1000
    presses = [rel(p['t']) for p in r['presses']]
    subs = [(rel(s['t']), s['submitter']) for s in L['subs'] if s['form'] == FORM]
    rs = [rel(x['t']) for x in L['rs'] if x['form'] == FORM]
    swallowed = [t for t in rs if sum(1 for s in subs if abs(t - s[0]) <= 0.15) - sum(1 for p in presses if abs(t - p) <= 0.15) < 1]
    effective = sum(1 for p in presses if any(abs(p - s[0]) <= 0.15 for s in subs))
    first_done = next((e for e in tl if e['done']), None); last = tl[-1] if tl else {}
    ms = r['end']['ms'] or []
    upd = [(rel(c[0]), c[2] if len(c) > 2 else '', c[3] if len(c) > 3 else None) for c in ms if c[1] == 'updateMemberJSON']
    reads = [rel(c[0]) for c in ms if c[1] == 'getMemberJSON']
    d = dict(
        run=f"{r['page']} {r['variant']} {r['scen']} {r['vp']}", loaded=r['loaded'], photos=r.get('photoCount'),
        presses=presses, presses_with_event=effective, submit_events=subs, requestSubmit=rs, swallowed=swallowed,
        uploads=[(rel(u['t']), (u['folder'] or '').split('/')[-1], 'FAIL' if u.get('failed') else 'ok') for u in r['uploads']],
        posts=[(rel(p['t']), 'FAIL' if p.get('failed') else 'ok', p['links'], p['body_end'], p['turnstile']) for p in r['posts']],
        worker=[(rel(w['t']), w['kind'], w['auth']) for w in r['worker']],
        done_at=rel(done_at) if done_at else None, fail_box=any(e['fail'] for e in tl),
        labels=seq([e['btn'] + (' [disabled]' if e['dis'] else '') for e in tl if e['formVis']]),
        up=seq([e['up'] for e in tl if e['up'] is not None and e['formVis']]),
        silent_faded_s=round(silent, 2),
        endSend=seq([(e['endSend'], e['endSendRole']) for e in tl if e['endSend']]), endBody=seq([e['endBody'] for e in tl if e['endBody']]),
        done_first=(first_done and dict(top=first_done['doneTop'], bot=first_done['doneBot'], pct=first_done['doneVisPct'])),
        done_last=(last.get('done') and dict(top=last['doneTop'], bot=last['doneBot'], pct=last['doneVisPct'])),
        intake=seq([(rel(e['t']), e['intake'], e['intakeRole']) for e in tl if e['intake']]),
        intake_seq=seq([e['intake'] for e in tl if e['intake']]),
        save_line=seq([e['save'] for e in tl if e.get('save')]),
        siv=[(rel(x['t']), x['el'], x['o']) for x in L.get('siv', []) if x['t'] >= T0],
        cons=sorted(set(r['cons'])), pageErr=r['pageErr'], aborted=sorted(set(r['aborted'])), misses=r['misses'],
        pre_autosave=r.get('preAutosave'), race_tick=rel(r['raceTick']) if r.get('raceTick') else None,
        ms_reads=reads, ms_writes=upd, writes_after_done=[w for w in upd if done_at and w[0] > rel(done_at)],
        draft_end=r['end'].get('draft'), done_text=r['end'].get('doneText'), visits=r.get('visits'),
    )
    out.append(d)
if len(sys.argv) > 2 and sys.argv[2] == 'json': print(json.dumps(out, indent=1, ensure_ascii=False))
else:
    for d in out:
        print('=====', d['run'])
        for k, v in d.items():
            if k != 'run': print(' ', k, ':', v)
