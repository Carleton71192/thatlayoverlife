/* the adversary N-1 lines (round 3) and other bare-M forms: old, r3 and new readings for 27 Nov */
const X = process.argv[2];
const mods = { old: require(X + '/old/tools/wf-guard.cjs'), r3: require(X + '/r3/tools/wf-guard.cjs'), new: require(X + '/new/tools/wf-guard.cjs') };
const lines = ['- 27 Nov, x: 3 M; y: 2 M', '- 27 Nov, x: 3 M total', '- 27 Nov, x: 3 M, estimated', '- 27 Nov, x: 3 M [E]', '- 27 Nov, x: 40 M, recheck 30 M (E)',
  '- 27 Nov, x: 2.5 MB (M); 12 M requests', '- 27 Nov, x: 1 MB, video 1080 M', '- 27 Nov, x: 3 M', '- 27 Nov, x: 2 M (E)', '- 27 Nov, x: 3 M.',
  '- 27 Nov, bw-guard-fix4-check-repro: stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)', '- 12 M requests, no date', '- 27 Nov, x: 3 MB; 4 M', '- 27 Nov, x: 3M', '- 27 Nov, x: 3 m'];
const day = new Date(Date.UTC(2026, 10, 27, 12));
for (const l of lines) { const v = {}; for (const k in mods) { try { v[k] = +mods[k].dailyTotalMB(l + '\n', day).toFixed(3); } catch (e) { v[k] = 'throws'; } } console.log(JSON.stringify(l).padEnd(100), JSON.stringify(v)); }
