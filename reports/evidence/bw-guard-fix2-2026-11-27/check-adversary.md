# Independent check (adversary lens): bandwidth guard fix round 2

- Checked: branch claude/bw-guard-fix2-2026-11-27, head 7c53c4fe663a489e6b3980c52d3d656597460182 (one commit on 58dd4db). Diff read line by line from 686e520.
- Date: 27 Nov 2026, label bw-guard-fix2-check-adversary.
- Verdict: **FAIL.**
  - N-1 to N-7 are fixed as reported. Every case in check.md now behaves as asked.
  - Two of the fixes open ways to spend Webflow bytes that 686e520 did not. Both are shown on stubs, old and new code side by side:
    - A-1 (from the N-4 fix): the redirect page can loop. In block mode one page load spent the whole 20 MB run cap in 5 s. The old code spent 0.2 MB on the same page.
    - A-2 (from the N-1 and N-3 changes): a GET with a small Range header reserves only the range. Near a cap, 60 such GETs went to Webflow at once. The run counted 3.07 MB against a 3 MB day cap, and 48 of the 60 responses counted about 0. The old code sent none.
  - The three suites pass: guard 47 of 47 (three runs), vitest 875 of 875, worker 83 of 83.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M).
  - Every browser run mapped every host name to a stub on 127.0.0.1 (`--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost`, `--no-proxy-server`), proxy variables unset.
  - Node-side lookups went to 127.0.0.1 (scripts/adversary/dnsmap.cjs).
  - A `curl` wrapper first on the PATH (scripts/adversary/curl-wrapper.sh) refused any call without `--noproxy *` and `--connect-to ::127.0.0.1:`. It logged 7,034 calls, all forced to 127.0.0.1, and refused 0.
  - `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed at scratch files. The real handoff/BANDWIDTH-LOG.md had the same hash before and after, and `<main checkout>/.git/wf-guard` does not exist.
  - One Chromium of mine at a time, closed after each script.

## Suites

| Run | Result |
| --- | --- |
| `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 47 of 47 pass, three runs (runs/adversary/guard-tests-1.txt to 3) |
| `npx vitest run` (node_modules linked from the main checkout for the run, then removed) | 875 of 875 pass, 73 files (runs/adversary/vitest.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 pass (runs/adversary/worker.txt) |

## N-1 to N-7

| Item | Status | Evidence |
| --- | --- | --- |
| N-1 reservations | Fixed as reported. 12 wf-get processes, 1 MB day cap, 190 KB each: 5 loaded, none refused at start (old: 3 loaded, 9 refused at start). A live process holding the whole cap: the GET waited 2.2 s, was refused, the run did not trip, and the next GET was granted once the holder ended. But see A-2, A-4 and A-5. | runs/adversary/procs-new.txt P1, P3; procs-old.txt |
| N-2 refused or cut responses | Fixed. A 3 MB file at a 0.5 MB run cap counts 0.48 MB (old 0.00). The same 3 MB URL twice at `--max-filesize 1`: one request, 1.00 MB counted, the second refused without a request (old: two requests, 0.00 MB). Chunked 3 MB at 0.5 MB: 0.74 MB (old 0.48). But a GET killed when the run trips still counts only what reached the disk (A-2). | runs/adversary/words-new.txt W1 to W4, words-old.txt |
| N-3 extensionless fetch | Fixed for fetch and XHR of a file served as `video/*`: one 1 MB range, then aborted (old: the whole 3 MB). Residuals in A-6. | runs/adversary/cap-new.txt C3, cap-old.txt |
| N-4 redirected page loads | Fixed as reported: apex 301 to www gives `location` on www, the relative image from www, one page load; localhost to Webflow now counts the page load; a 25-hop chain is aborted with 0 leaks (old: 5 leaks, Chromium followed the rest itself). JavaScript off keeps the old behavior. But the redirect page opens A-1 and A-3. | runs/adversary/redir-new.txt R1, R4, R7, R8; redir-old.txt |
| N-5 repeated lines | Fixed. One file with a line twice: 200 (old 100). Main once and worktree twice: 200. Main twice and worktree twice: 200. | runs/adversary/parser.txt P4 |
| N-6 unreadable lines | Fixed for every case in check.md. All 17 versions of handoff/BANDWIDTH-LOG.md in git history give the same total as the old parser for every day from 10 to 30 Nov (357 day totals, 0 differences, 0 errors). The live logs read 21 Nov 97.4, 22 Nov 35, 25 Nov 9, 27 Nov 2.5. Residuals in A-7. | runs/adversary/parser.txt P1 to P3 |
| N-7 wording and counters | Fixed. "w stopped at the run cap of 0.5 MB: a GET of ... was refused because it was larger than the 0.50 MB left; 0.48 MB counted from Webflow in this run, the refused GET included". The unload counter is gone; the docs say an unload beacon is stopped but not counted. | runs/adversary/words-new.txt W1, W3; cap-new.txt C1 |

## New findings, most important first

### A-1. The redirect page can loop, and in block mode the loop spends Webflow bytes up to the run cap (new with the N-4 fix)

- The guard keeps the final answer under Node's form of the final URL (`resp.url()`) and the redirect page calls `location.replace()` with that string. Chromium then asks for its own form of the URL. When the two differ, the replay map misses and the guard fetches the URL again.
- They differ for `|` and `^` in a path: Node keeps them, Chromium sends `%7C` and `%5E` (runs/adversary/urlnorm.txt, 32 forms tried, 2 differ).
- If the server sends the escaped form back to the raw form with a 301 (a canonicalizing server), each round is: fetch the escaped form (301), fetch the raw form (the page), serve a new redirect page, and so on. Nothing stops it but the caps.
- Reproduction, scripts/adversary/loop.cjs, block mode, a 200 KB page, run cap 20 MB:
  - new code: 200 Webflow GETs and 20.04 MB in 5 s, stopped at the run cap, 0 page loads counted, 99 redirect pages (runs/adversary/loop-new.txt);
  - old code: 2 GETs, 0.2 MB, 1 page load (runs/adversary/loop-old.txt).
  - With the default 200 MB cap the same page would use the whole run cap in under a minute.
- In fetch-once the bytes stay at 3 GETs (the cache answers), but the page never settles: 643 redirect pages in 8 s (runs/adversary/redir-new.txt R3).
- How likely: Webflow slugs do not contain `|` or `^`, so a real Webflow page is unlikely to start this. Any 301 rule or link that lands on such a path does. It breaks the rule this check applies (no new way to spend Webflow bytes), so it decides the verdict.
- Fix: key the replay map in a form both sides agree on (for example, percent-encode `|` and `^` in the path before storing and before looking up), and never answer a main-frame request with a second redirect page while the previous one for that frame is less than a few seconds old: answer it with the final response instead.

### A-2. A GET with a small Range header reserves only its range, so near a cap many GETs go out at once and most are counted at about 0

- `wantFor()` reserves the range length plus 16 KB for a bounded Range header. This applies to any Webflow GET that carries one, in block mode and fetch-once, not only to video.
- If the server sends more than the range (a 200 with the whole file), curl refuses it, and `countedBytes()` counts up to 256 KB more than the grant. When the run then trips, `killInflight()` counts the other GETs in flight at the bytes on disk, which is about 0 for a refused response.
- Reproduction, scripts/adversary/cap.cjs C1: a page makes 60 fetches with `Range: bytes=0-1`, the server ignores Range and sends 3 MB with a Content-Length, day cap 3 MB.
  - new code, both modes: 60 requests reached the stub. 12 settled at 256 KB each, so the run counted 3.07 MB against the 3 MB cap. The other 48 were killed at the trip and counted about 0 ("48 unfinished" in the log line). The stub wrote 180 MB on loopback, where socket buffers hold whole bodies. On a real link each refused response is a TCP window in flight; at the 195,584 bytes per response measured in check.md N-2 that is about 11.7 MB past a 3 MB cap.
  - old code: 0 requests (the N-1 false stop) (runs/adversary/cap-old.txt).
- The new text in tools/WF-GUARD.md says "the bytes counted plus the open reservations never pass it". C1 shows they do.
- How likely: low with Webflow's CDN, which honors Range. It needs a page that sends small Range headers and a server that ignores them.
- Fix: reserve at least the allowance a refused response would count (`HEADER_ALLOWANCE + CUT_ALLOWANCE`) for every GET, and have `killInflight()` count a killed GET at the larger of its bytes on disk and that allowance.

### A-3. A replay miss costs a second fetch of the final page (new with the N-4 fix)

- R2 (runs/adversary/redir-new.txt): a 302 to `/t|x.html` on a server that answers both forms. New code: 3 GETs and 0.20 MB more, in block mode and in fetch-once (the escaped form is a new cache key). Old code: 2 GETs.
- R6, block mode: two pages load the same redirecting URL while a third loads its target. New code: 4 GETs of the 200-byte target for 3 pages (old: 3). The third page took a replay entry meant for another page.
- Fix: the A-1 fix covers the first case. For the second, key the replay entry by page as well as URL.

### A-4. In fetch-once, a GET refused after waiting keeps its one-fetch claim

- `serveWebflow()` takes the claim file before `netGet()` waits. When the wait times out, or the context closes during the wait, the claim stays, and the URL is refused as "fetched before" in every later run on that cache folder, although it was never fetched.
- Reproduction, runs/adversary/claim-new.txt K1 and K2: 0 requests to the stub, and a later run with budget left gets `cacheRefused: 1`, `cacheFetches: 0`.
- Errs low (fewer bytes). Fix: reserve before claiming, or delete the claim and its line in wf-guard-fetched.txt when nothing was sent.

### A-5. A stale reservation whose pid is in use again blocks every GET

- A reservation counts while `process.kill(pid, 0)` succeeds. A tally entry left by a crashed run, whose pid now belongs to another process, holds its bytes all day. Every GET then waits `reserveWaitS` and is refused. runs/adversary/procs-new.txt P4 shows a live unrelated pid holding 1 MB: `busy`.
- Errs low. Fix: store the process start time with the pid, or drop reservations older than the longest possible GET (`fetchTimeoutS` plus a margin).

### A-6. N-3 residuals (not new, but "video only in pieces" still does not hold everywhere)

- An extensionless video sent as `application/octet-stream` is not seen as video. The probe takes 1 MB, then the whole 3 MB is fetched again and handed to the page: 4 MB where the old code used 3 MB (runs/adversary/cap-new.txt C3).
- A 3 MB extensionless JSON from a server that ignores Range: the probe is refused (counted 1 MB), then fetched whole. The docs say a larger file costs the first chunk twice; with a server that ignores Range it is the TCP window of a refused response.
- An extensionless video through an iframe, embed, object, script, prefetch or EventSource is still fetched whole up to `getCapMB`, then refused by type: 18 MB for 6 URLs, the same as the old code (runs/adversary/cap-new.txt C4).

### A-7. N-6 residuals

- Over-reads that err high: `- 27 Nov, x: 2.5 MB (M); 12 M requests` counts 14.5 MB, and `video 1080 M` counts 1,081 MB.
- Plain lines that now throw and stop every new run until edited: `See reports/evidence/bw-guard-fix-2026-11-27/check.md: 3 MB` (the folder name is a date), `From 1 Dec the budget is 250 MB a day` and `## 27 Nov 2026 (2.5 MB)`. This fails closed, as the docs say, but one prose line stops all Playwright work.
- Not caught, as the docs say: `x: 3 MB on 27 Nov` and the table row `| 3 MB | 27 Nov |`.

### A-8. Notes

- A GET is still sent when only 32 KB to 256 KB is left. In P1 the sixth process was granted about 50 KB, the server sent 190 KB, and the tally ended at 1.14 MB for a 1 MB cap. The count matches what was sent, but the cap is passed by one response. Not sending a GET when less than `CUT_ALLOWANCE` is left would avoid it.
- 256 KB can be less than a TCP window on a fast link (100 Mbit/s at 50 ms is about 625 KB). The allowance follows check.md's suggested figure, so this is a note.
- Pre-existing, old and new alike: a caller route that answers with `route.fulfill({ status: 302, headers: { location: <Webflow URL> } })` lets Chromium fetch the Webflow URL itself, unrouted. The guard counts it afterwards as a leak (runs/adversary/redir-*.txt R10).

## What else I tried that held

- Range handling, read in the code (not probed): a page's own Range on an extensionless fetch is cut to the chunk; a multi-range or `Bytes=` header is dropped and the URL probed; an invalid range like `bytes=100-50` reserves 16 KB and cannot fetch more.
- Concurrency across processes for full-size GETs: a grant is the whole remainder near the cap, so GETs without a Range header go one at a time there (P1, P2, C2).
- Cache poisoning between hosts: the replay map is per context and keyed by the full URL; the probe stores a 206 as a 200 only when the range covers the whole file.
- `context._options.javaScriptEnabled` exists in Playwright 1.63 (checked with a one-line script), and R4 shows the JavaScript-off path works.
- The added prose has no em dashes, exclamation marks or banned words.

## Recommendation

- Do not use fetch-once or block mode on real pages until A-1 is fixed. A-2 should be fixed in the same round. cache-only is not affected by either: it sends nothing to Webflow on a miss.
- A-3 to A-5 are small and can go with them.

## Environment and files

- This folder is shared with check-repro.md, a separate check written at the same time. This check's files are under scripts/adversary/ and runs/adversary/ only. I did not read check-repro.md before writing this.

```sh
export PATH=<folder with scripts/adversary/curl-wrapper.sh installed as curl>:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp
```

- Old code for the side-by-side runs: `git archive 686e520 tools | tar -x -C <old>`, then pass `<old>` instead of the worktree.
- Run a browser script as `node -r ./dnsmap.cjs <script> <worktree or old>` from scripts/adversary/. parser.cjs takes `<worktree> <old> <main checkout>`.
- Scripts: stub3.cjs (the 27 Nov stub2 plus routes that ignore Range, an octet-stream video and a canonicalizing redirect), urlnorm.cjs (U1), parser.cjs (P1 to P4), redir.cjs (R1 to R10), loop.cjs (R3b), cap.cjs (C1 to C4), procs.cjs with wfget-child.cjs (P1 to P4), claim.cjs (K1, K2), words.cjs (W1 to W4).
- Output: runs/adversary/, with `-new` and `-old` files for each side.
- Playwright 1.63.0, Chromium headless shell 1243, Node 22.23.5, curl 8.5.0.
