# Independent check (reproduction): bandwidth guard round 3

- Checked: branch claude/bw-guard-fix2-2026-11-27 at 66c00344731afa11489fd9049b7188dea0422d0c, the head the builder named (parents 3855ce0 and 7c53c4f).
- Compared with: 686e520 ("old", what is merged now) and 7c53c4f ("r2", round 2). Every probe ran on all three.
- Date: 27 Nov 2026, label bw-guard-fix3-check-repro. Lens: reproduction, bytes measured at a relay.
- Verdict: **FAIL**, on one item: R-1 is not fully fixed.
  - An extensionless `fetch()` whose server answers the probe with a 206 of unknown total (`Content-Range: bytes 0-999999/*`) still costs the first chunk plus the whole file. A 3 MB file costs 4.00 MB at the relay. The old code spent 3.00 MB. This is the case WF-GUARD.md names as the one that "still costs the first chunk twice". The task rule makes it a FAIL.
  - The main R-1 case is fixed. A 3 MB extensionless JSON or image costs 3.0006 MB (old 3.0002, r2 4.0005).
  - A-1 to A-7, R-3 to R-5 and N-1 to N-7 hold. Details per item below.
  - In every scenario I ran, counted bytes plus open reservations stayed at or under the cap.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M). How that was kept is under "Safety".

## Result per item

| Item | Fixed? | Evidence (old / r2 / new) |
| --- | --- | --- |
| R-1 extensionless refetch | **partly** | 3 MB JSON, Range honored: 3.0002 / 4.0005 / 3.0006 MB. 1.2 MB JSON: 1.2002 / 2.2005 / 1.2006 MB. 206 with total `*`: 3.0002 / 4.0005 / **4.0005 MB**. See R-1 below. |
| R-3 Range ignored on a `.js` | yes | main2 S4: `bytes=0-99` on an 0.8 MB script. Served whole and counted 800,197 B in old and new. r2 refused it (256,195 counted). |
| R-4 goto returns the redirect page | yes | X9: `page.goto` returns the small page (200, `x-wf-guard-redirect: 1`). `g.finalResponse(page)` gives 200 with the www URL and the www body. `g.goto(page, url)` gives the same, without the mark. Documented in WF-GUARD.md. |
| R-5 parser wording | yes | A table row now reads "a table row with a date and a size figure; the guard reads only bullets ...". Numbered lines, headings, quoted lines and plain lines are each named. |
| A-1 redirect loop | yes | loop.cjs, block, 200 KB page, run cap 20 MB, `|` and `^`: 2 GETs, 0.2004 MB, no trip in 60 s / 200 GETs, 20.04 MB in 5 s / 2 GETs, 0.2004 MB, no trip. redir.cjs R3 in fetch-once: 2 GETs, 1 redirect page (r2: 650 redirect pages in 8 s). |
| A-2 small Range near a cap | yes | cap.cjs C1 (60 at once, 3 MB day cap): 0 / 60 GETs, 3.075 MB counted / 1 GET, 2.984 MB. One after another (capseq C1s): 1 / 12 / 1 GET. See A-2 below. |
| A-3 replay miss | yes | redir.cjs R2 (`/t|x.html`, both forms answered): 2 / 3 / 2 GETs. R6 block (two pages to the apex URL, a third to www): landing GETs 3 / 4 / 1. |
| A-4 claim kept after a refusal | yes | claim.cjs K1 and K2: the later run with budget fetches the URL once (r2: refused as "fetched before", 0 requests). |
| A-5 reused pid | yes, for new entries | X6: a live pid with another start time: granted 1.5 MB (r2: busy). An entry with no start time (written by older code) still counts as alive, as documented. adversary procs.cjs P4 uses such entries, so it still reads busy. |
| A-6 octet-stream video | yes | x3.cjs, 3 MB extensionless MP4 or WebM sent as `application/octet-stream`: old serves 3.00 MB, r2 4.00 MB; new stops it, 1.00 MB (Range honored) and at most 3.00 MB (Range ignored). cap.cjs C3: 9.0 / 9.0 / 7.0 MB in all. |
| A-7 parser residuals | yes | `12 M requests` now 2.5 (was 14.5 in r2), `video 1080 M` now 1. A date inside a path is no longer read. Residual prose lines still stop new runs, as documented. |
| N-1 reservations | yes | 45 and 100 slow images at once: old stops after 40 requests; new loads 45 of 45 and 100 of 100. wf-get processes at a 1 MB day cap: old completes 1, 1, 1, 1; new 1, 3, 4, 5 (the arithmetic fit). |
| N-2 refused or cut | yes, see the cap note | wf-get `--max-filesize 1`: old counts 196, 197 and 1,000,169 B; new counts 1,000,196, 1,000,197 and 1,256,169 B for 195,584, 261,120 and 1,118,208 B delivered. A refused URL is asked for once per run. |
| N-3 extensionless video | yes | A video whose server honors Range: 3.00 / 1.00 / 1.00 MB. When the server ignores Range, new is never above old (P3 table). |
| N-4 redirected page load | yes | `location.href` and the relative image use the www host. 21 and 25 hop chains are aborted with 0 leaks (old: 1 and 5 leaks). JavaScript off keeps the old behavior. |
| N-5 repeated lines | yes | One line twice: 200, three times: 300 (old 100). |
| N-6 unreadable lines | yes | The 9 forms of check.md throw and name file and line. All 21 versions of the log in git history give the same day totals as old (441 day cells, 0 differences, 0 errors). |
| N-7 wording | yes | "2 non-GET requests aborted"; trips name the refused GET and what was counted. |

## R-1 in detail (the FAIL)

Script: repro-browser.cjs P3 (round 2), and my x.cjs (X1 to X3). Delivered bytes at the relay, page `fetch()` with no Range header unless shown. Fetch-once and block give the same figures for these rows.

| URL, extensionless | Old | r2 | New | New minus old |
| --- | --- | --- | --- | --- |
| JSON 0.3 MB, Range honored | 0.3002 | 0.3003 | 0.3003 | +51 B |
| JSON 0.8 MB, Range honored | 0.8002 | 0.8003 | 0.8003 | +51 B |
| JSON 1.2 MB, Range honored (X3) | 1.2002 | 2.2005 | 1.2006 | +379 B |
| JSON 3 MB, Range honored | 3.0002 | 4.0005 | 3.0006 | +358 B |
| image 3 MB, fetch-once | 3.0002 | 4.0005 | 3.0006 | +351 B |
| JSON 3 MB, Range ignored | 3.0002 | 3.20 to 3.29 | 3.0002 | 0 |
| page 2 MB, Range ignored | 2.0002 | 2.20 to 2.29 | 2.0002 | 0 |
| **JSON 3 MB, 206 with total `*` (X1)** | **3.0002** | **4.0005** | **4.0005** | **+1,000,271 B** |
| JSON 3 MB, 416 to every Range (X2) | 3.0002 | 3.0005 | 3.0005 | +270 B |

- X1: the probe gets `bytes 0-999999/*`. probeGet then falls back to a whole second GET (`return netGet(url, headers, cls, { ext: true })`). The stub saw `bytes=0-999999` and then a GET with no Range, in both modes.
- How likely: low. A CDN that knows the file size sends a total. A server that streams a body of unknown length may send `*`. Webflow pages have no extension, so a page fetched by script is in scope.
- A fix that keeps N-3: when the total is `*`, ask for the rest with an open range (`bytes=1000000-`). If that answer is a 206 that starts at the chunk, join the two parts, as the joined path already does.
- The rows of +51 to +379 B are response header bytes: the Content-Range line on a file that fits one chunk, and one more request and response for a larger file. The builder's report states them. They are the price of the N-3 probe. Under the strict rule they are also bytes the old code did not spend. I list them so the reader can judge; I did not make them the reason for the FAIL.
- The 416 row (X2) costs one more small response, 270 B.
- Video rows: new is never above old. A video whose server honors Range costs 1.0003 MB (old 3.0002). A video whose server ignores Range costs 3.0002 MB in fetch-once and 2.4438 MB in block (old 3.0002 both). The guard stops it at its headers, but on loopback most of the body is through by then.
- `/r-video` with `Range: bytes=0-` in fetch-once with allowVideo read 0 in old in P3, because the row before had filled the cache. From an empty cache (X7): old 3.0003 MB, r2 and new 1.0003 MB.

## A-2 and the caps in detail

Scripts: adversary cap.cjs and capseq.cjs, my x.cjs (X4, X5) and x2.cjs (X8). The old code stops falsely (N-1) in the "at once" rows, so the one-by-one rows are the fair comparison.

| Scenario | Old | r2 | New |
| --- | --- | --- | --- |
| C1: 60 at once, Range bytes=0-1 ignored, 3 MB files, day cap 3 MB | 0 GETs (false stop) | 60 GETs, 3.075 MB counted, 3.20 MB delivered | 1 GET, 2.984 MB counted, 0.26 to 0.29 MB delivered |
| C1s: the same one by one | 1 GET | 12 GETs, 3.074 MB counted | 1 GET, 2.984 MB counted |
| C1b: 60 at once, day cap 12 MB | 1 request (false stop) | 60 requests, 12.041 MB counted | 4 GETs, 11.984 MB counted |
| X8: the same one by one, day cap 12 MB | 4 GETs, 9.001 MB counted | 47 GETs, 12.043 MB counted | 4 GETs, 11.984 MB counted |
| C2: 60 at once, no Range, getCapMB 1, day cap 3 MB | 0 GETs (false stop) | 3 GETs, 3.001 MB counted | 3 GETs, 2.984 MB counted |
| X4: 12 endless streams at once, block, run cap 2 MB | 0 GETs (false stop) | 1 GET, 2.240 MB counted | 1 GET, 2.000 MB counted, 0 reserved at the stop |
| X5: wf-get, one endless stream, run cap 0.5 MB | 0.484 MB counted | 0.740 MB counted | 0.500 MB counted |

- In each row new makes no more GETs than old makes one by one, and counted plus reserved stays at or under the cap.
- X8 one by one: old and new both make 4 GETs with the same curl arguments, the same `--max-filesize` and the same Range header (captured with a debug curl wrapper, scripts/repro/curl-wrapper-debug.sh).

### Note: at a cap the count is now clamped below what was delivered

This is not a FAIL under the task rule. Delivered is not above what the old code delivers in the same run (rows 1, 2 and 4), and counted plus reserved stays under the cap. But the count no longer covers every delivered byte there. Bytes, delivered / counted:

| Scenario | Old | r2 | New |
| --- | --- | --- | --- |
| P2b: block, run cap 1 MB, page polls 200 KB files | 996,372 / 800,983 | 1,000,985 / 1,000,983 | 1,000,985 / 1,000,000 |
| repro-proc B: one wf-get run, five 300 KB files, day cap 1 MB | 1,161,711 / 900,786 | 1,161,711 / 1,156,786 | 1,096,175 / 1,000,000 |
| repro-proc A: 6 wf-get processes, 300 KB each, day cap 1 MB | 300,197 / 300,197 (false stop) | 1,200,788 / 1,156,786 | 1,161,711 / 1,000,000 |
| words.cjs W3: chunked 3 MB, wf-get run cap 0.5 MB | 642,048 / 0.484 MB | 642,048 / 0.740 MB | 642,048 / 0.500 MB |

- The last GET near a cap is granted what is left. The server sends more than that before curl refuses it, and the count stops at the grant. WF-GUARD.md says so ("The server may still have sent up to a TCP window more").
- r2 counted those bytes and passed the cap; new stays at the cap and leaves them out. The old code counted less than both.
- Not sending a GET when less than the allowance is left of a cap (A-8 of the round 2 adversary check) would remove the gap.

### Note: a response stopped at its headers can count less than was delivered

- P3, fetch-once with allowVideo, a video whose server ignores Range: 3,000,239 B delivered, 2,548,736 counted. x3.cjs, block, MP4 octet-stream with Range ignored: 3,000,233 delivered, 2,284,544 counted.
- The stop allowance is the 256 KB of check.md; on loopback more than that is in flight. Delivered is not above old in these rows (old served 3.00 MB and counted it). Same category as the round 2 A-8 note.

## A-1, A-3, A-4, A-5 notes

- A-1 window limit: X10 sends one page to 12 apex URLs that 301 to www pages, one after another. 24 GETs in old, r2 and new. In new the first 8 get the redirect page, the last 4 are answered directly ("redirectDirect": 4), so their `location` is the apex URL, as in the old code. No extra bytes; a crawler that loads many redirecting URLs quickly loses the N-4 location fix after 8 in 10 s. Documented.
- A-3: in block mode two requests of one context for the same URL share one GET. R6 shows 1 landing GET for 3 pages.
- A-4: the later run's fetch is the one fetch fetch-once allows (1 request, 248 B). The old code cannot run K1 and K2 (it has no reservations; it stops at the start).
- A-5: procs.cjs P4 still reads busy, because its tally entries have no start time. X6 with an entry whose start time differs reads stale, as intended.

## Old probes run again (all on three trees)

| Script | Result on 66c0034 |
| --- | --- |
| new.cjs | N1 cache-only: 0 HTTP requests to the Webflow stub in all four endings, 22 misses each. N6c: `/noext-video-8` one 1 MB range (old 3 MB). N9: location and relative image on www. |
| n3.cjs | 0 Webflow unload requests with the guard; the localhost beacon goes with `'webflow'` and is stopped with `'all'`. |
| n4.cjs | every child exits 0 and prints ALIVE in all three modes. |
| n5.cjs | N5 as N-1 above. N8 counts as N-2 above. |
| n7.cjs | 30 and 45 images load with no trip (old: 40-request stop at 45); N2r race 0 HTTP requests. |
| n8b.cjs | unchanged, as expected (it calls `curlFetch` directly). |
| main2.cjs block and cache-only | S4 is R-3 above. S5 endless stream now 1.00 MB counted at a 1 MB cap (r2 1.24). S8 day cap holds. cache-only: Webflow requests only where S4 and S6 ask for fetch-once. 0 unhandled rejections. |
| crash.cjs | every mode as before. Its leftover Chromium count is a global `pgrep` and counted another check's browser that ran on this machine at the same time; none of mine was left. |
| wfget.cjs W1 to W14 | as r2, W5 and W14 count up to the grant. |
| adversary redir, loop, cap, capseq, claim, procs, words, parser, urlnorm | as above. urlnorm: 32 forms, 2 differ (`|`, `^`), the two chromeForm covers. |

- The old tree fails claim.cjs and procs.cjs at the start (it has no reservations), as expected.

## Suites on 66c0034

| Suite | Result |
| --- | --- |
| `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 59 of 59 pass, three runs (runs/repro/guard-tests-1.new.txt to -3) |
| `npx vitest run` (node_modules linked from the main checkout for the run, then removed) | 875 of 875 pass, 73 files (runs/repro/vitest.new.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 pass (runs/repro/worker.new.txt) |

## How bytes were measured, and one artifact

- Every Webflow host name in every probe points at a relay in front of a local stub (scripts/repro/relayline.cjs, with stub2r.cjs, stubr.cjs and adversary/stub3r.cjs). The guard's curl, wf-get and any Chromium request that slipped past the guard all go through it. Each printed line carries the bytes the relay passed to the client since the line before.
- For main2.cjs, wfget.cjs and crash.cjs the stub answers every host, so their relay figure covers localhost pages too.
- Artifact: a relay in the probe's own process can over-read a refused response when that process is busy. In x2.cjs X8 (block, run after X7), the refused fourth GET read 0.9 to 3.0 MB in new and 0.2 to 0.3 MB in old. With the relay in its own process (relayproc.cjs) both read 0.16 to 0.26 MB (runs/repro/x8conn6.txt). The curl calls were identical. So I count those rows as equal. Refused-response figures from in-process relays elsewhere are upper bounds; they vary run to run in all three trees (x5rep.all.txt, refused.all.txt).
- main-block.new.txt ends with exit 143: the relay kept that process alive after its last line, and I stopped it. Its output is complete. relayline.cjs now unrefs its server.

## Safety

- Chromium ran with `--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost` and `--no-proxy-server`, proxy variables unset. Node lookups went to 127.0.0.1 (dnsmap.cjs).
- A curl wrapper first on the PATH refused any call without `--noproxy *` and `--connect-to ::127.0.0.1:`. It logged 4,140 calls, all forced to 127.0.0.1, and refused 0.
- `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed at scratch files. `<main checkout>/.git/wf-guard` does not exist. The main checkout's log changed during the check through other commits (6773c39 and before); my runs did not write to it.
- One Chromium of mine at a time, closed after each script.

## Environment

```sh
export PATH=<folder with scripts/repro/curl-wrapper.sh installed as curl>:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp CURL_WRAP_LOG=<scratch>/curl-calls.log
```

- Trees: worktrees of 66c0034 (new), 7c53c4f (r2) and 686e520 (old).
- `RUNS=<runs> MAIN_CHECKOUT=<main checkout> scripts/repro/run-all.sh <tree> <tag>` runs every round 2 probe on one tree, one at a time. run-trees.sh does all three. run-x.sh runs x/x.cjs. x2.cjs, x3.cjs, x5rep.cjs, x8conn.cjs and refused.cjs run as `node -r ../dnsmap.cjs <script> <tree>` from scripts/repro/x/.
- `node x/compare.cjs <runs> <job> <fields>` puts the three trees side by side.
- Playwright 1.63.0, Chromium headless shell 1243, Node 22.23.5, curl 8.5.0.

## Files

- scripts/repro/: the round 2 scripts (scripts/ and scripts/adversary/ of bw-guard-fix2-2026-11-27, with the stub swapped for a relayed one), the builder's capseq.cjs (relayed), and my x/ probes: x.cjs (X1 to X6), x2.cjs (X7 to X10), x3.cjs (A-6), x5rep.cjs, x8conn.cjs, refused.cjs, compare.cjs, and relayproc.cjs.
- runs/repro/: `<job>.<tree>.txt` for each probe and tree, the suites, and progress.txt. Scratch paths are shortened to `<scratch>`.
