import json, sys, os
H = os.path.dirname(os.path.abspath(__file__))
B = {(r['p'], r['w']): r for r in json.load(open(os.path.join(H, 'out-before.json')))}
for mode in sys.argv[1:]:
    A = {(r['p'], r['w']): r for r in json.load(open(os.path.join(H, 'out-%s.json' % mode)))}
    print('=====', mode)
    for k, b in B.items():
        a = A[k]; pb = dict(b['probe']); pa = dict(a['probe'])
        for x in (pb, pa): x.pop('layerCss', None)
        diffs = [f for f in sorted(set(pb) | set(pa)) if pb.get(f) != pa.get(f)]
        sb = b['probeScrolled']; sa = a['probeScrolled']
        d2 = [f for f in sb if sb[f] != sa[f]]
        print(k, 'DIFF ' + str(diffs) if diffs else 'same', 'scrolled DIFF ' + str(d2) if d2 else 'scrolled same',
              '| self', len(b['self']), '->', len(a['self']), b['selfWire'], '->', a['selfWire'],
              '| img', b['imgReq'], '->', a['imgReq'], b['imgWire'], '->', a['imgWire'], '| errs', b['errs'], a['errs'],
              '| nonGet', a['nonGetAborted'], 'layersLocal', a['layersLocal'])
        for f in diffs: print('    ', f, 'B=', str(pb.get(f))[:200], 'A=', str(pa.get(f))[:200])
