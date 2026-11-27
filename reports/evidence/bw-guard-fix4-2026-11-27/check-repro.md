# Independent check (reproduction): bandwidth guard round 4

- Checked: branch claude/bw-guard-fix2-2026-11-27 at 49889e7ba48be44778995229c8cc143373db0ecb, the head the builder named.
- Compared with: 686e520 ("old", what is merged now). For the parser I also read 66c0034 ("r3", round 3).
- Date: 27 Nov 2026, label bw-guard-fix4-check-repro. Lens: reproduction, bytes measured at a relay that runs in its own process.
- Verdict: **PASS WITH NOTES.**
  - No scenario spends Webflow bytes that 686e520 would not, beyond the notes below. Where a loopback figure is higher for the new code, the same case on a rate-limited link, or repeated 60 times, shows new at or below old.
  - In every run, counted bytes plus open reservations stayed at or under the cap. A monitor that read the shared tally every 2 ms during 12 multi-process runs saw a largest sum exactly equal to the cap, never above it.
  - Extensionless `fetch()` and XHR behave as in 686e520: the same requests with the same headers, the same curl arguments apart from where curl writes the headers, and the same bytes to the byte on every transfer that completes (48 of 48 cases).
  - X-1, X-2 and X-3 of round 3 are closed. No round 2 or round 3 fix regressed, except N-3, which round 4 reopened on purpose (see Notes).
  - The three suites pass: guard 63 of 63 (three runs), vitest 875 of 875, worker 83 of 83.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M). How that was kept is under "Safety".

## Result per item

| Item | Holds? | Evidence (old / new) |
| --- | --- | --- |
| N-3 probe removed; extensionless as 686e520 | yes | ext4.cjs: 48 cases (16 kinds x 3 modes). Same request and forwarded headers in 48 of 48. Same curl arguments in 48 of 48, apart from `-D <file>` becoming `-D -` and a marker before the `-w` text. Equal delivered bytes on every completed transfer, for example 3,000,225 B for a 3 MB JSON, also from a server that sends total `*` or 416. |
| X-1 file over getCapMB | yes | bytes.cjs B1 at 12.5 MB/s: old and new 16,384 to 32,768 B per URL (round 3: 81,920 to 98,304). Loopback: old 128,000 to 259,072, new 128,000 to 356,352 (noise, see "Loopback figures"). |
| X-2 206 with total `*` | yes | B2: 3,000,214 B and 1 request in both. B3: run 1 one GET, runs 2 and 3 none, in both trees. |
| X-3 headers near a cap | yes | B4 (60 KB headers, 0.98 MB body, 1 MB cap): old counted 1,040,907 B, past the cap; new counted 740,905 B and delivered 193,536 B. E13 (100 KB headers): new stops the GET. |
| F-3 too little left | yes | repro-proc, procs and n5: GETs refused with "too little is left ... the run goes on"; no false stop. |
| F-6 old tally entries | yes | f6.cjs: a live pid with no start time holding 1 MB at a 1.5 MB cap. "updated" 1 h or 23 h ago: busy. 25 h ago: granted 1.5 MB. No time stored: busy. |
| Bare M parser rule | yes | All adversary N-1 lines throw on new (old and r3 read them as 0 or 30). 36 log files (every git version, the main checkout, zxm063 at e7cc691 with and without my line): 246 non-zero day cells, 0 differences from old and r3, 0 errors. |
| R-3 Range on a `.js` | yes | main2 S4: 800,948 B delivered in both. |
| R-4 helpers | yes | r4.cjs R4h and x2.cjs X9 on new (old has no helpers). |
| R-5, N-6 wording | yes | repro-parser: each kind of line is named. |
| A-1 redirect loop | yes | loop.cjs: 2 GETs, 200,400 B, no trip in 60 s, in both trees. forms.cjs: 246 forms, 0 differ. |
| A-2 small Range near a cap | yes | cap.cjs C1: 1 GET, 2.68 MB counted of 3 MB. capseq C1s, one by one: 1 GET in both; delivered old 128,000 and 2,031,616, new 196,608 and 196,608. |
| A-3 replay miss | yes | redir.cjs R6 block: 2 Webflow requests (old 5). |
| A-4 claim | yes | claim.cjs K1, K2: the later run fetches once. |
| A-5 reused pid | yes | procs3 Q2a busy, Q2b granted, Q3 field 22. |
| A-6 octet-stream video | yes, after the GET | B6 and x3: same 3,000,200 and 3,000,233 B as old; new does not serve MP4 or WebM. |
| N-1 reservations | yes | P1a: 45 of 45 and 100 of 100 images (old stops at 40). n7: 45 images load. |
| N-2 refused or cut | yes | A refused URL is asked once per run (repro-proc C: 1 request, old 3). |
| N-4 redirected page | yes | n3, new.cjs N9, redir.cjs R1 to R10. |
| N-5 repeated lines | yes | One line twice 200, three times 300. |
| N-7 wording | yes | Trips name the refused GET and what was counted. |

## Extensionless fetch in detail (ext4.cjs)

Delivered bytes at the relay, block mode (fetch-once and fetch-once with allowVideo give the same pattern). Full output: runs/repro/ext4-compare.txt.

| Case | Old | New |
| --- | --- | --- |
| E1 JSON 0.3 MB | 300,224 | 300,224 |
| E2 JSON 3 MB, Range honored | 3,000,225 | 3,000,225 |
| E3 JSON 8 MB, over getCapMB (refused by length) | 195,584 | 261,120 |
| E4 JSON 3 MB, server sends total `*` | 3,000,225 | 3,000,225 |
| E5 JSON 3 MB, Range ignored | 3,000,225 | 3,000,225 |
| E6 JSON 3 MB, 416 to any Range | 3,000,225 | 3,000,225 |
| E7 page Range `bytes=0-99` | 391 | 391 |
| E8 video/mp4 3 MB, page Range `bytes=0-` | 3,000,293 | 3,000,293 |
| E9 video/mp4 3 MB, no Range | 3,000,218 | 3,000,218 |
| E11 page 2 MB on www | 2,000,218 | 2,000,218 |
| E12 JSON 0.5 MB, 20 KB headers | 520,454 | 520,454 |
| E13 JSON 0.5 MB, 100 KB headers | 601,414 (served) | 601,414 (stopped) |
| E14 chunked 8 MB (cut at getCapMB) | 7,602,176 | 7,329,023 |
| E15 XHR 1 MB | 1,000,225 | 1,000,225 |
| E16 XHR 8 MB (refused by length) | 193,536 | 291,840 |

- E3, E14 and E16 are refused or cut transfers. Their loopback figures swing both ways across the three modes (E3: +65,536, -65,536, +65,536; E16: +98,304, -67,584, -67,584). The rate-limited runs below settle them.
- E10 was meant to be an octet-stream MP4, but my stub sent it as JSON; it reads 3,000,225 in both. The octet-stream case is covered by bytes.cjs B6 and x3.cjs.
- The round 3 tables also match: repro-browser P3 (all 36 rows equal to the byte) and x.cjs X1 to X3 (3,000,225, 3,000,225 and 1,200,225 B in both).

## Loopback figures, and the same cases on a rate-limited link

- On loopback, what a relay delivers after curl refuses or cuts a response depends on kernel buffers, not on the guard. It swings from 0.13 MB to 3.9 MB in both trees. Example, refusedN.cjs, a 3 MB file refused by its Content-Length, 60 times per tree, alternating: old median 195,584 B, 5 above 400 KB, max 3,000,166; new median 195,584 B, 6 above 400 KB, max 1,273,856. curl read 164 B in every case, in both trees.
- So I re-ran every refused or cut case through a relay limited to a real link rate (cut4.cjs, relay in its own process, old and new alternating, 6 rounds at 12.5 MB/s and 4 at 2.5 MB/s). Delivered, median (min to max), 12.5 MB/s:

| Case | Old | New | Counted, old / new |
| --- | --- | --- | --- |
| T1 wf-get, endless stream, run cap 0.5 MB | 497,664 (494,297 to 514,048) | 192,217 (180,224 to 208,601) | 483,817 / 436,201 |
| T2 wf-get, chunked 3 MB, run cap 0.5 MB | 494,297 (484,057 to 500,441) | 180,224 (180,224 to 193,753) | 483,817 / 436,201 |
| T3 wf-get, 3 MB refused by length (limit 1 MB) | 16,384 (16,384 to 32,768) | 16,384 (16,384 to 16,384) | 196 / 1,000,196 |
| T4 wf-get, chunked 30 MB, limit 1 MB | 1,006,592 (1,006,592 to 1,012,953) | 1,006,592 (1,006,592 to 1,032,192) | 1,000,201 / 1,256,201 |
| T5 wf-get, endless stream, run cap 2 MB | 1,994,752 (1,991,062 to 1,998,742) | 1,689,600 (1,686,233 to 1,689,600) | 1,983,817 / 1,936,201 |
| T6 wf-get, 30 MB refused by length (limit 5 MB) | 16,384 (16,384 to 16,384) | 16,384 (16,384 to 32,768) | 197 / 5,000,197 |
| T7 guard, block, page fetch of an endless stream, run cap 2 MB | 1,994,240 (1,991,680 to 2,059,887) | 1,689,600 (1,683,456 to 1,692,287) | 1,983,817 / 1,936,201 |

- At 2.5 MB/s the medians are T1 497,664 / 180,224, T3 16,384 / 16,384, T4 1,009,279 / 1,006,592, T5 1,991,680 / 1,690,624, T7 1,992,831 / 1,689,600. The relay moves 16 KB at a time, so single samples differ by 16 KB steps.
- B1 at 12.5 MB/s: 8 URLs, old 147,456 B in all, new 163,840 B in all; one URL in each tree read 32,768 instead of 16,384.

## Rows where old used fewer bytes, and why

The comparison script flags any row where new delivered more than old plus 1 KB (runs/repro/compare-old-new.txt: 372 rows, 39 flagged). Each flag falls in one of two groups.

- Old stops falsely (N-1), so the "at once" row of old shows 0 or 1 GET: cap.cjs C1, C2; capseq C1b; repro-browser P1b; n7 45 images; n5 and repro-proc A; procs P1; x.cjs X4; main2 S5 polling; inv4 I1, I3. The fair rows are the one-by-one ones:
  - capseq C1s (3 MB, day cap 3 MB): 1 GET in both; delivered old 128,000 and 2,031,616, new 196,608 and 196,608.
  - x2 X8 (day cap 12 MB): 4 GETs in both, same curl arguments; delivered old 9,194,229 and 9,259,765, new 9,261,813 and 9,196,277.
  - repro-proc B (five 300 KB files, day cap 1 MB): old 4 requests and 1,159,663 B, new 3 requests and 862,538 B.
  - procs3 Q1: old 4 requests (tally 1.801 MB), new 2 (1.68 MB).
  - X4 one stream at a time is cut4 T7 above: new below old.
- A refused or cut response on loopback (see the previous section): bytes.cjs B1 and B3 run 1, capseq C1s fetch-once, procs P2 (same 2 requests and 3,190,395 B written by the stub in both), words W2, ext4 E3, E14, E16, n5 N8, n8b, wfget W5 and W14, x.cjs X5, main2 S5 stream (stub sent old 1.02 MB, new 0.70 MB; the relay figure landed on another line in old).

## Caps

- inv4.cjs: 10, 20 and 6 wf-get processes on one tally at day caps of 3, 5 and 1.2 MB, with mixed URLs (Content-Length and chunked, 20, 60 and 100 KB of headers, an endless stream). Two runs per tree. Largest counted plus reserved seen by the monitor: exactly 3,000,000, 5,000,000 and 1,200,000 B in all 12 runs, never more. Final tallies on new: 2.79 and 2.94 MB, 4.68 and 4.81 MB, 0.94 and 0.94 MB.
- x.cjs X4: 12 endless streams, run cap 2 MB: counted 1,936,201, reserved at the stop 0. X5: counted 436,201 of 500,000.
- cap3 C5 and C6 (four runs on one tally, day cap 5 MB): tally 4.757 and 4.68 MB. Old stops all four runs at their start (N-1).
- B4: counted 740,905 of 1,000,000 (old 1,040,907).
- No run reported a `pastGrant` value above 0.

## Suites on 49889e7

| Suite | Result |
| --- | --- |
| `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/wf-guard.test.cjs` | 63 of 63, three runs (runs/repro/guard-tests-1.new.txt to -3) |
| `npx vitest run` (node_modules linked from the main checkout for the run, then removed) | 875 of 875, 73 files (runs/repro/vitest.new.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 (runs/repro/worker.new.txt) |

## Notes (not deciding the verdict)

- N-3 is open again, by design. An extensionless `fetch()` of a Webflow video costs the whole file up to getCapMB, as in 686e520 (repro-browser P3 `/nr-video` and `/r-video`, 3,000,239 B; new.cjs N6c 3,000,207 B). Rounds 2 and 3 cut that to about 1 MB. WF-GUARD.md states it as a known gap.
- R7 fetch-once (redir.cjs): new makes one more Webflow GET, 248 B, for the page's relative image. Old sent that image to localhost because the page kept the localhost URL; new loads the page under its www URL (N-4 of round 2), so the image is asked from www. Same as round 3.
- Tighter near a cap. Each GET now keeps 0.32 MB of room, also near a cap. A file that fits what is left but not what is left minus 0.32 MB is refused and the run stops (P7b: 0.3 MB at a 0.5 MB cap, old served it; B4b: 0.96 MB with 20 KB of headers at a 1 MB cap, old served 980,427 B). wf-get processes at once that complete at a 1 MB day cap: 1, 2, 3, 3 for 600, 300, 200 and 190 KB files (arithmetic fit 1, 3, 4, 5). These spend less than old.
- Count above delivery. A response refused by its Content-Length counts up to its limit (round 2 N-2 rule): T3 counts 1,000,196 B and T6 5,000,197 B for 16,384 B on the link (old counted 196 and 197). This errs high and uses up a cap sooner.
- Count below loopback delivery at a cut. On loopback a cut transfer can deliver more than its count, in both trees (X4 new 2,770,153 B delivered and 1,936,201 counted at a 2 MB cap; x5rep old up to 3,886,592 B delivered at a 0.5 MB cap). On a rate-limited link delivered stayed under counted for every new row (T1 to T7).
- Headers over 64 KB now stop a GET and the page gets an error (E13). Bytes are not above old.
- F-6 rests on the "updated" time only for entries with no start time. Current code writes a start time wherever /proc exists. Where it does not (MY_START null), a live run's entry would lose its reservation after 24 h with no tally write; a GET lasts at most fetchTimeoutS, so I see no real case.
- The A-6 sniff takes a text file with "free" at bytes 4 to 7 as video (B6 text); not served, same bytes as old. Carried from round 3.
- My x.cjs, x2.cjs, x5rep.cjs and refused.cjs runs on new ended with exit 1 at teardown, because my relay lacked `srv.close`. Every result line had been printed. I added `srv` before the old runs, which exit 0 where the old code has the features.
- The old tree fails claim.cjs, procs.cjs, procs3.cjs, r4.cjs, forms.cjs and x.cjs X6 at the start, because it lacks reservations, the helpers or chromeForm. As expected.

## How bytes were measured

- relay/relayfile.cjs starts relayfile-child.cjs as its own process. The child is the TCP relay of round 3's relay.cjs (with backpressure). Before it forwards a chunk to the client it writes the connection's running total into a file at a fixed offset. The probe reads the totals with a synchronous file read, so a busy probe process cannot change the count and no figure arrives late.
- relay.cjs, relayline.cjs and relayrate.cjs in my copies of the round 2 and 3 scripts now load relayfile.cjs. The in-process originals are kept as `*.inproc.cjs`. Rate limiting (`RELAY_RATE`) also runs in the child.
- For main2.cjs, wfget.cjs and crash.cjs the stub answers every host, so their relay figure covers localhost pages too, as in round 3.

## Safety

- Chromium ran with `--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost` and `--no-proxy-server`, proxy variables unset. Node lookups went to 127.0.0.1 (dnsmap.cjs).
- A curl wrapper first on the PATH (scripts/repro/curl-wrapper.sh) refused any call without `--noproxy *` and `--connect-to ::127.0.0.1:` and then ran curl with exec, so a kill from the guard reaches curl itself. It logged 2,696 calls, all forced to 127.0.0.1, and refused 0. One test call of the wrapper itself, before any probe, was refused and that log was cleared.
- `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed at scratch files. `<main checkout>/.git/wf-guard` does not exist. The main checkout's log had the same hash before and after my runs (d49826f...).
- One Chromium of mine at a time, closed after each script. crash.cjs kills Chromium with `pkill`; in my copy it only matches a flag that only my browsers carry (`--wfcheck-tag=fix4cr`), so it could not touch another session's browser. None of mine is left running.

## Environment

```sh
export PATH=<scratch>/bin:$PATH      # bin/curl is scripts/repro/curl-wrapper.sh
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/tmp/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/tmp/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp CURL_WRAP_LOG=<scratch>/runs/curl-calls.log
```

- Trees: worktrees of 49889e7 (new), 686e520 (old) and 66c0034 (r3, parser only).
- run-trees.sh runs s/run-all4.sh on new, then old: every round 2 probe (s/, s/adversary/), every round 3 repro probe (s/x/) and every round 3 adversary probe (a/), one job at a time. phase2.sh to phase5.sh then run ext4, B1 at 12.5 MB/s, B4, the guard suite, cut4, vitest, the loopback repeats and inv4, one at a time.
- `node s/x/cmp4.cjs <runs>` lists old against new for every job. `node a/ext4cmp.cjs <ext4.old.txt> <ext4.new.txt>` compares the extensionless cases. parse/cmp.cjs and parse/lines.cjs are the parser checks.
- Playwright 1.63.0, Chromium headless shell 1243, Node 22.23.5, curl 8.5.0.

## Files

- scripts/repro/s/: the round 3 check-repro scripts (round 2 scripts with relayed stubs, and x/), with the relay swapped for relayfile.cjs, crash.cjs scoped to my own browsers, run-all4.sh, x/cmp4.cjs and x/refusedN.cjs.
- scripts/repro/a/: the round 3 check-adversary scripts (bytes, cap, cap3, capseq-b, claim, forms, loop, parser3, procs3, r4, redir), and my new probes ext4.cjs, ext4cmp.cjs, cut4.cjs, inv4.cjs and f6.cjs.
- scripts/repro/relay/, curl-wrapper.sh, env.sh, run-trees.sh, phase2.sh to phase5.sh, parse/.
- runs/repro/: `<job>.<tree>.txt` for each probe and tree, `.both.txt` for probes that alternate the trees, compare-old-new.txt, ext4-compare.txt, parser-history.txt, parser-bareM.txt, the suites, and progress.txt. Scratch paths are shortened to `<scratch>`.
