# Independent check (adversary lens): bandwidth guard round 4

- Checked: branch claude/bw-guard-fix2-2026-11-27 at 49889e7ba48be44778995229c8cc143373db0ecb, the head the builder named. I read the diff of tools/ from 686e520 line by line, all of tools/wf-guard.cjs at the head, and the diff of tools/ from 66c0034 (round 3).
- Baseline for every "old" figure: 686e520 (what is merged now).
- Date: 27 Nov 2026, label bw-guard-fix4-check-adversary. I read both round 3 checks first (check-repro.md and check-adversary.md in reports/evidence/bw-guard-fix3-2026-11-27/).
- Verdict: **PASS WITH NOTES.**
  - The N-3 probe is gone, with no leftovers in code, tests or docs. Every round 3 failure (X-1, X-2, R-1 with total `*`) now costs the same as old.
  - X-3 holds: in every scenario I ran, counted bytes plus open reservations stayed at or under the cap. Old passes the cap in four of my header cases; new does not.
  - I found no scenario where new delivers more Webflow bytes than old in the same run, beyond loopback noise that disappears at a rate-limited relay.
  - Two cases where new spends Webflow bytes old does not, both from earlier fixes the checks accepted. I did not count them toward the verdict, and say why under D-1 and D-2. A reader with a stricter rule may judge D-1 differently.
  - No round 2 or round 3 fix regressed.
  - The three suites pass: guard 63 of 63 (two runs), vitest 875 of 875, worker 83 of 83.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M).
  - Browsers mapped every host to 127.0.0.1 (`--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost`, `--no-proxy-server`); Node lookups went to 127.0.0.1 (dnsmap.cjs); proxy variables were unset.
  - A curl wrapper first on the PATH refused any call without `--noproxy *` and `--connect-to ::127.0.0.1:`. It logged 1,044 calls, all forced to 127.0.0.1, and refused 0 (runs/adversary/curl-calls.log).
  - `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed at scratch files. handoff/BANDWIDTH-LOG.md in the main checkout had the same hash before and after (d49826f...), and `<main checkout>/.git/wf-guard` does not exist.
  - Delivered bytes were counted by a relay in its own process (scripts/adversary/relayproc4.cjs, with an optional rate). One Chromium of mine at a time; none is left running.

## Suites

| Run | Result |
| --- | --- |
| `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 63 of 63, two runs (runs/adversary/guard-tests-1.txt, -2.txt) |
| `npx vitest run` (node_modules linked from the main checkout for the run, then removed) | 875 of 875, 73 files (runs/adversary/vitest.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 (runs/adversary/worker.txt) |

## Leftovers of the removed probe

- No `probeGet`, header-file watch, `--no-buffer`, `rangeWatch`, chunk join, `contentRange` or `joined` in tools/. The only Range bound left is `boundRange` for allowed video in fetch-once, which old has too.
- An extensionless fetch or XHR is one GET under `getCapMB` with the page's own headers, as in old. The A-6 sniff reads `r.body` after the GET and only decides whether to serve.
- The test file pins this: N-3 is one GET with no Range, and `stats().joined` is undefined.

## Round 3 failures, old vs new (delivered at the relay process)

| Case | Old | New |
| --- | --- | --- |
| X-1 / B1: 8 MB extensionless JSON over `getCapMB`, 3 URLs per mode, 12.5 MB/s relay | 16,384 to 32,768 B per URL | 16,384 B per URL |
| B1 at 2.5 MB/s | 16,384 B per URL | 16,384 B per URL |
| B1 on loopback with no rate (noise) | 128,000 to 783,360 B | 128,000 to 618,496 B |
| X-2 / B2: 3 MB, 206 with total `*` | 3,000,214 B, 1 request | 3,000,214 B, 1 request, both modes |
| B3: B2 in fetch-once, three runs on one cache, run cap 1.02 MB | 1 request in run 1, then "fetched before" | the same |
| B5a, B5b, B5c (R-1 cases) | 3,000,214 / 3,000,192 / 500,213 B | equal, byte for byte |
| B6 octet-stream MP4, WebM, text | 3,000,200 B, served | 3,000,200 B, refused after the GET |
| X8r: 60 sequential 3 MB `.js` with `Range: bytes=0-1` ignored, day cap 12 MB, 12.5 MB/s | 4 GETs, 9,016,960 / 9,033,344 B (block / fetch-once) | 4 GETs, 9,016,960 / 9,016,960 B |

- The builder's X8 row (9.20 vs 9.32 MB) is loopback noise: the fourth GET is refused at its headers, and what is in flight then varies. With no rate I saw 193,536 vs 196,608 B for that connection; at 12.5 MB/s it is 16,384 B in both trees.

## Header margin at caps (X-3), wf-get, one URL per run

Script: scripts/adversary/hdr4.cjs with stub5.cjs (a raw TCP stub). Delivered at a relay limited to 2.5 MB/s; the unlimited run is in runs/adversary/hdr4-rate0.txt and gives the same picture.

| Case | Old: delivered / counted | New: delivered / counted, result |
| --- | --- | --- |
| H1 (B4): 60 KB headers, 0.98 MB body, run cap 1 MB | 1,039,980 / 1,039,980, **over the cap** | 59,980 / 739,978, stopped at the cap |
| H2: 63 KB headers, 0.6 MB, run cap 1 MB | 662,974 / 662,974 | 662,974 / 662,974, served |
| H3: 65 KB headers | 164,970 / 164,970 | 64,970 / 164,970, stopped at the margin |
| H4: one 64,100 B header line | 164,200 / 164,200 | 65,536 / 164,200, stopped |
| H5: one 99,000 B header line | 199,100 / 199,100 | 114,688 / 199,100, stopped (curl hands the line over whole) |
| H6: 290 KB of headers | 389,520 / 389,520 | 65,536 / 164,968, stopped |
| H8: 103 Early Hints of 40 KB, then 30 KB headers | 169,858 / 169,858 | 72,586 / 169,858, stopped (both blocks count) |
| H9: chunked, 70 KB of trailers | 590,128 / 520,078 | 576,894 / 831,622, downloaded whole, then refused (see N-5) |
| H10: chunked, 60 KB headers, 0.98 MB, run cap 1 MB | 1,040,484 / 1,039,984, **over the cap** | 748,112 / 995,984, stopped at the cap |
| H11: gzip chunked, same | 1,040,827 / 1,040,326, **over the cap** | 755,283 / 996,008, stopped at the cap |
| H12: gzip chunked, 20 KB headers, 2 MB, run cap 1 MB | 1,007,360 / 1,003,704, **over the cap** | 713,096 / 956,088, stopped at the cap |
| H13: a header line starting with the guard's `-w` marker, then 80 KB | 179,967 / 179,967 | 179,967 / 179,967, **served** (see N-4) |
| H15: headers trickled 1 KB per 5 ms, 120 KB | 219,860 / 219,860 | 64,968 / 164,968, stopped |
| H16: 290 KB headers, run cap 0.4 MB | 319,519 / 319,519 | 65,536 / 94,967, stopped |
| H17: 20 KB headers, 0.67 MB, run cap 1 MB | 690,060 / 690,060 | equal, served |
| H18 (P7b): 20 KB headers, 0.3 MB, run cap 0.5 MB | 320,060 / 320,060, served | 20,060 / 276,058, stopped at the cap (tighter, as reported) |

- HTTP/2 (h2.cjs: TLS on 127.0.0.1, self-signed, curl `-k --http2`): status, headers and the `-w` marker parse as with HTTP/1.1. 100 KB of headers is stopped (curl hands the decoded block over at once, so 200,304 B are read, as old). 250 KB and 600 KB are refused by nghttp2 itself in both trees (see N-6).
- curl 8.5.0 refuses an HTTP/1.1 response with over about 300 KB of headers, so on HTTP/1.1 what curl reads stays inside a grant near a cap (ALLOW is 320 KB). `pastGrant` stayed 0 in every run.

## Reservations across processes and stale tally entries

Script: scripts/adversary/resv4.cjs. This process read the tally file every 2 ms while wf-get processes ran and kept the largest "counted by all runs plus open reservations".

| Scenario | Old | New |
| --- | --- | --- |
| V1: 12 processes at once, day cap 2 MB, `--max-filesize 1`, each 0.3 MB, 0.9 MB with 60 KB headers, 3 MB, 0.3 MB (12.5 MB/s) | max 2,000,000; 6 refused at start (false stops); 725,716 B delivered | max 2,000,000; 1,260,181 B delivered; counted 1,680,099 |
| V1 one process after another (the fair comparison for old) | 1,980,341 B delivered | 1,260,181 B delivered |
| V2: 8 processes, run cap 0.5 MB each, day cap 3 MB, chunked 2 MB and slow headers (12.5 MB/s), one after another | 3,068,744 B delivered | 1,226,736 B delivered; max counted plus reserved 3,000,000 |
| V2 at once, no rate | 6,115,936 B delivered, counted 2,902,320 | 4,681,144 B delivered, counted 2,936,104, max 3,000,000 |

- In every sample new stayed at or under the cap. procs3 Q1 (round 3): new 1.68 MB, 2 requests; old 1.80 MB with 8 of 10 processes refused at start.
- V3, a live `sleep` with 1 MB reserved and 0.2 MB counted, day cap 1.5 MB:
  - real start time, no start time with `updated` 1 h, 23.9 h, 48 h in the future, unreadable, or missing: the reservation holds (busy);
  - another start time, no start time with `updated` 24.1 h or 25 h ago, or a dead pid: stale, grant 1.3 MB with a body limit of 0.98 MB.
  - The 0.2 MB counted always stays counted. F-6 works as written, and a bad clock errs toward holding.
- cap.cjs, cap3.cjs (round 3): C1 1 GET, 2.68 MB counted of a 3 MB cap; C2 3 GETs; C5 4.757 of 5 MB. Old stops falsely at once in these; one by one it makes as many or more GETs.

## Redirects and loops

- forms.cjs: 246 URL forms, 0 where Chromium requests a target the replay keys miss.
- loop.cjs (`|` and `^`, 200 KB page, run cap 20 MB, 60 s): 2 GETs, 0.2 MB, no trip, as old.
- redir.cjs: R2 2 GETs (old 2), R3 2 GETs, R6 1 landing GET (old 3), R8 25-hop chain 21 requests and 0 leaks (old 26 to 27 requests and 5 leaks), R10 1 leak as old (pre-existing N-6 of round 3).
- r4.cjs: `page.goto` gives the redirect page with the mark, `g.goto` and `g.finalResponse` give the www page.

## Parser

Script: scripts/adversary/parser4.cjs.

- P1: all 33 versions of handoff/BANDWIDTH-LOG.md (every git commit on every branch that touched it, the zxm063 tip fe8f714 and the main checkout) for every day 1 Oct to 31 Dec: 3,036 cells, 225 non-zero, 0 differences from old, 0 errors on either side. Totals on the zxm063 tip: 21 Nov 97.4, 22 Nov 35, 25 Nov 9, 27 Nov 12.44 MB.
- P2: 96 hand-written lines. New never reads lower than old without throwing. All the round 3 N-1 lines throw. `3 M`, `3M`, `3 M.`, `3 M (M)` count 3.
- P3: 524 mutations of the real bullet lines (bare M, units, brackets, list marks, date forms): 0 read lower than old without an error; new throws on 145, old on 6.

## Notes (not deciding the verdict)

### D-1. F-3 in fetch-once can turn a URL that old lost into one full fetch in a later run

- Code: a GET refused as `low` returns `unsent`, so fetch-once releases its claim (as for A-4).
- d1.cjs D1, 12.5 MB/s: run 1 has 0.3 MB left of a 3 MB day cap and fetches a 3 MB script then a 50 KB script; runs 2 and 3 have a fresh 10 MB cap and the same cache folder.
  - Old: run 1 sends the 3 MB GET, curl refuses it at its headers (32,768 B delivered), the run stops, and the claim stays. Run 2 refuses the script as "fetched before" and fetches the 50 KB one. Total 82,958 B; the 3 MB script is never stored.
  - New: run 1 sends nothing (`lowRefused` 2). Run 2 fetches both once (3,050,382 B). Run 3 sends nothing.
  - D1b, only the 50 KB script: 50,190 B in both trees (old in run 1, new in run 2).
- So across runs new spends 3 MB here that old does not, because old's cap stop loses the URL for good. That is the same pattern as A-4 (K1, K2), which the round 3 checks accepted as a fix: the later fetch is the URL's one fetch. I follow that precedent. Within any one run new spends less (0 B against 32,768 B).

### D-2. Fetch-once now fetches relative images of a redirected page from the page's real host

- redir.cjs R7, fetch-once: a localhost URL that 302s to a www page. Old leaves the page at the localhost URL, so `rel.png` goes to localhost. New loads it from www and fetches it once. This is the N-4 fix of round 2, reported by the builder and accepted by both round 3 checks. Block mode aborts the image, so it costs nothing there.

### N-3. A response stopped at its headers can count less than was delivered

- `countedBytes` for a stopped response with a declared length adds at most the rest of the body. It leaves out the rest of the headers, which can be most of the response.
- H6 with no rate: 389,520 B delivered, 253,790 counted (old counted 389,520). H16 at 0.4 MB: 319,519 delivered, 204,747 counted.
- At 2.5 MB/s the count is above what was delivered (65,536 delivered, 164,968 counted). The count stays inside the grant, so no cap is passed. But WF-GUARD.md says this count "errs high on purpose".
- Fix: for a header stop, add `CUT_ALLOWANCE` (or the 300 KB curl limit less what was read) instead of the rest of the body.

### N-4. A header line that starts with the marker text turns the header margin off

- `curlFetch` stops reading the header size once `out.indexOf(WMARK)` finds the marker, `\n@@wf-guard@@ `. A response line `@@wf-guard@@ x: ...` puts it there. H13: 80 KB of headers is served whole (old the same).
- The count is still taken from curl's `-w` figures (the parse uses the last marker), and it is clamped at the grant, so caps hold. curl's own 300 KB limit keeps the read inside a near-cap grant on HTTP/1.1. No Webflow response would carry such a line.
- Fix: a random marker per call, or count the stdout bytes before the last marker only after close and stop on the running total minus the marker.

### N-5. Chunked trailers count as headers

- H9: a chunked response with 70 KB of trailers is downloaded whole, then stopped by the margin and not served. Same bytes as old, which served it. Webflow does not send trailers.

### N-6. Pre-existing: a curl error after the headers began counts what `-w` reports, which can be 0

- HTTP/2 with 250 KB and 600 KB of headers (nghttp2 "Too many CONTINUATION frames"): 291,309 and 556,055 B delivered, counted 0, old and new. An HTTP/1.1 header line without a colon (my first stub run, runs/adversary/hdr4.txt H13): 179,964 B delivered, 98 counted, both trees.
- Not new, and not a cap pass in counted bytes, but delivered bytes go uncounted. A failed transfer could count at least what reached stdout and the body file.

### N-7. Pre-existing: a damaged tally file is read as empty, then overwritten

- V4: another run with 1.4 MB counted, the tally file cut short, day cap 1.5 MB: grant 1.5 MB, and the other run's entry is gone after the write. Old does the same. Writes are atomic (temporary file and rename), so this needs damage from outside.

### N-8. Parser residuals that read 0, as in old

- `- On 27 Nov, x: 3 M; y: 2 M` (the date not at the start and only bare M figures) reads nothing; the bare-M throw applies only to dated bullets. Also `3 MBs`, `.5 MB`, `3 m`, `3e6 bytes`, a Greek capital mu. Old reads 0 for all of them.
- The other way: new throws on lines old skipped, for example `- note: 120 bytes header` (bytes are now a size) and a dated `3 M` followed by a question mark. None is in any version of the log. Such a line would stop new runs at their start until fixed, which costs no bytes.

### N-9. The count can run far above delivery

- A file refused on its Content-Length counts up to its limit (round 2 N-2 rule): B1 counts 5,000,212 B for 16,384 delivered, X8r 11.68 MB for 9.02 MB. Several such URLs in one run can stop it early or use up the day for other runs. The builder reports this.

### N-10. From code reading: F-3 refusals in fetch-once append two lines per request

- Each `low` refusal writes a claim line and a `released` line to wf-guard-fetched.txt, and `claim()` rereads the whole file. A page that polls a URL near a cap grows the file without bound. No bytes; I did not measure it.

## What else I tried that held

- One GET at the limits: F-3 refuses at 335,999 B left and grants at 336,000 B with a 16,000 B body limit (code); D2, block mode with 0.3 MB left and one 50 KB script asked for 40 times: new 0 requests and no trip, old 6 GETs (267,334 B) and a stop.
- D3, block mode, a `.js` with 70 KB of headers asked for 3 times: new 1 GET (65,536 B) and 2 "refused again"; old 3 GETs (513,063 B).
- Kill paths: a header stop, `killInflight` and a timeout all settle inside the grant; `reserved` was 0 in every tally after a run.
- `countFor` never returns more than the grant; the bytes past it go to `pastGrant`, which stayed 0.
- The added prose in tools/ has no em dashes, exclamation marks or banned words.

## Recommendation

- Merge is reasonable on bandwidth grounds: no scenario I ran spends more in a run than 686e520, and the X-3 claim now holds.
- Before or after merge: N-3 and N-4 are small changes in `countedBytes` and `curlFetch` that make the count match the docs. D-1 should be stated in WF-GUARD.md next to F-3 ("a later run fetches a URL refused here").

## Environment and files

```sh
export PATH=<folder with scripts/adversary/curl-wrapper.sh installed as curl>:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp CURL_WRAP_LOG=<scratch>/curl-calls.log
```

- Old tree: a worktree at 686e520; new tree: a worktree at 49889e7. Run each script from scripts/adversary/ as `node -r ./dnsmap.cjs <script> <tree>`.
- New scripts: relayproc4.cjs and relayc.cjs (relay in its own process, optional rate), stub5.cjs (raw HTTP/1.1 stub for header cases), hdr4.cjs (H1 to H18, both trees in one call: `hdr4.cjs <new> <old> [rate]`), h2.cjs (HTTP/2, `h2.cjs <new> <old> <folder with key.pem and cert.pem>`), resv4.cjs (V1 to V4; `SEQ=1` runs the processes one after another, `RELAY_RATE` sets the relay rate), d1.cjs (D1 to D3), x8.cjs (X8r), parser4.cjs (`parser4.cjs <new> <old> <folder of log versions>`), fmt.cjs and cmpb.cjs (tables).
- From round 3, run again on both trees: bytes.cjs (its relay moved to its own process), cap.cjs, cap3.cjs, procs3.cjs, claim.cjs, redir.cjs, loop.cjs, r4.cjs, forms.cjs (new only), with stub3.cjs and stub4.cjs. Old fails procs3 Q2, claim and r4 at the start because it lacks those features.
- Output: runs/adversary/, `-old4` (old) and `-adv4` (new) per script.
- I did not run crash.cjs (it kills every Chromium on the machine) or the repro probes main2, n3 to n8b.
- Playwright 1.63.0, Chromium headless shell 1243, Node 22, curl 8.5.0 with nghttp2 1.59.0.
