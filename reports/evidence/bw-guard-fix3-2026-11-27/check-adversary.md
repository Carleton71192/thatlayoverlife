# Independent check (adversary lens): bandwidth guard fix round 3

- Checked: branch claude/bw-guard-fix2-2026-11-27, head 66c00344731afa11489fd9049b7188dea0422d0c. I read the diff of tools/ from 686e520 line by line, and the whole of tools/wf-guard.cjs at the head.
- Baseline for every "old" figure: 686e520 (what is merged now). "r2" is 7c53c4f.
- Date: 27 Nov 2026, label bw-guard-fix3-check-adversary. I read both round 2 reports first (check-repro.md and check-adversary.md in reports/evidence/bw-guard-fix2-2026-11-27/).
- Verdict: **FAIL.**
  - The items of round 2 are fixed as reported, with one exception: R-1 is fixed only for a 206 that states its total size.
  - Two scenarios spend Webflow bytes that 686e520 does not. Both come from the new extensionless probe:
    - X-1: an extensionless file larger than `getCapMB`, from a server that honors Range. The old code let curl refuse it on its Content-Length. The new code lets the first chunk start and stops it from a 5 ms watch. At the relay: old 0.26 MB, new 1.00 MB, per URL, on every page load in block mode.
    - X-2: a 206 with no total size (`Content-Range: bytes 0-999999/*`). The first chunk is fetched, then the whole file: 4.00 MB where the old code used 3.00 MB. In fetch-once, when that second GET gets no grant, the one-fetch claim is given back although the first chunk was sent. The URL is then fetched again in every later run (1 MB per run in my test; old: once, then refused).
  - One pre-existing gap breaks the new claim in tools/WF-GUARD.md that "the bytes counted plus the open reservations never pass" a cap (X-3). Near a cap, a GET keeps only 16 KB of room for response headers. A 0.98 MB script with 60 KB of headers, at a 1 MB run cap, counted 1.04 MB. The old code does the same, so this is not new spend, but the task asks for FAIL when counted bytes pass a cap.
  - The three suites pass: guard 59 of 59 (four clean runs; two other runs were broken from outside, see Suites), vitest 875 of 875, worker 83 of 83.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M).
  - Every browser run mapped every host name to a stub on 127.0.0.1 (`--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost`, `--no-proxy-server`), with proxy variables unset. forms.cjs answered every request from a route and sent nothing out.
  - Node-side lookups went to 127.0.0.1 (scripts/adversary/dnsmap.cjs).
  - A `curl` wrapper first on the PATH (scripts/adversary/curl-wrapper.sh) refused any call without `--noproxy *` and `--connect-to ::127.0.0.1:`. It logged 1,403 calls, all forced to 127.0.0.1, and refused 0.
  - `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed at scratch files. The real handoff/BANDWIDTH-LOG.md had the same hash before and after (284ec49...), and `<main checkout>/.git/wf-guard` does not exist.
  - One Chromium of mine at a time, closed after each script. None of mine is left running.

## Suites

| Run | Result |
| --- | --- |
| `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 59 of 59 in runs 1, 2, 5 and 6 (runs/adversary/guard-tests-*.txt) |
| `npx vitest run` (node_modules linked from the main checkout for the run, then removed) | 875 of 875, 73 files (runs/adversary/vitest.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 (runs/adversary/worker.txt) |

- Runs 3 and 4 of the guard suite failed 29 and 25 tests with "Target page, context or browser has been closed". The check-repro session ran its crash.cjs at the same time (13:02:42 to 13:03:16 UTC). That script runs `pkill -9 -f 'host-resolver-rules=MA[P]'`, which kills every Chromium on the machine started with that flag, mine included. Runs 5 and 6, after it, pass 59 of 59. I kept the two broken outputs.

## Round 2 items

| Item | Fixed? | Evidence (old 686e520 vs new 66c0034, stubs on 127.0.0.1) |
| --- | --- | --- |
| R-1 extensionless probe refetch | Partly | A 206 that states its total is joined: 3 MB JSON, old 3,000,214 B, new 3,000,539 B at the relay; a server that ignores Range: equal (3,000,192 B); 0.5 MB: old 500,213, new 500,264 (B5). A 206 with no total is still fetched twice: old 3.00 MB, new 4.00 MB (B2, X-2). |
| A-1 redirect page loop | Yes | loop.cjs, block mode, 200 KB page, run cap 20 MB, `|` and `^`: 2 GETs, 0.2 MB, 1 redirect page, no trip in 60 s (old the same; r2 was 200 GETs and 20.04 MB). forms.cjs: 246 URL forms (every printable ASCII character in path and query, `%` sequences, invalid UTF-8 escapes, non-ASCII, credentials, host case, trailing dots, IDN, full-width dots): Chromium requested exactly `chromeForm()` of Node's URL in all 246. |
| A-2 Range reservation near caps | Yes | C1 (60 fetches with `Range: bytes=0-1`, server ignores Range, day cap 3 MB): 1 GET, 2.98 MB counted, both modes. Four runs on one tally near a 5 MB day cap (cap3.cjs): 4.984 MB in every case, Range ignored or probe and join. Ten wf-get processes at a 2 MB day cap (procs3.cjs Q1): tally 2.000 MB, 3 requests (old 1.801 MB, 5 requests). But see X-3. |
| A-3 replay miss | Yes | R2 (302 to `/t|x.html`): 2 GETs in both modes (old 2). R6 block (two pages load the redirecting URL while a third loads its target): 1 GET of the target (old 3; the in-flight share). |
| A-4 claim kept after a refused wait | Yes, with a new hole | K1 (wait times out) and K2 (context closes during the wait): a later run fetches the URL (`cacheFetches` 1). But a claim is now also given back after bytes were sent (X-2). |
| A-5 reused pid | Yes | procs3.cjs Q2, a live `sleep` holding 1 MB at a 1.5 MB day cap: its real start time keeps the reservation (`busy`); another start time is ignored (grant 1.5 MB); an entry without a start time keeps it. Q3: the stored value is field 22 of /proc/<pid>/stat. |
| A-6 octet-stream video | Yes, for MP4, MOV and WebM | B6 fetch-once, 3 MB extensionless `application/octet-stream`: MP4 and WebM headers stop after 1,000,252 B (old 3,000,200 B). AVI, MPEG-TS, Ogg and FLV are not sniffed and are served whole, as in the old code (3,000,511 B vs 3,000,200 B). C4 (iframe, embed, object, script, prefetch, EventSource) is 18 MB as in the old code, as the builder said. |
| A-7 parser residuals | Yes | `12 M requests` and `video 1080 M` no longer count; dates in paths no longer throw. All 21 versions of handoff/BANDWIDTH-LOG.md in git history, every day 10 to 30 Nov: 0 differences from the old parser and 0 errors (441 day totals). Live logs: 21 Nov 97.4, 22 Nov 35, 25 Nov 9, 27 Nov 2.5 MB. Note N-1 below. |
| R-3 docs | Yes | WF-GUARD.md says a non-media file from a server that ignores Range is served whole, up to `getCapMB`. |
| R-4 helpers | Yes | r4.cjs, block mode, apex 301 to www: plain `page.goto` returns the redirect page (200, `x-wf-guard-redirect: 1`, the apex URL); `g.goto` returns the final response (200, the www URL, its body); `g.finalResponse(page)` gives the www URL (runs/adversary/r4-wt.txt). |
| R-5 wording | Yes | Each error names the kind of line: "a table row with a date and a size figure ...", "a heading ...", "a numbered line ...", "a quoted line ...", "a bullet with a size figure but no date the guard can read at its start" (runs/adversary/r5.txt). |

## New findings, most important first

### X-1. An extensionless file over `getCapMB` now costs up to one chunk, where the old code let curl refuse it on its headers

- Code: `probeGet` asks for `bytes=0-<chunk-1>` with a body limit of the whole `getCapMB`. A 206 whose total is over `getCapMB` is stopped by the `watch` callback, which reads curl's header file every 5 ms. By then the body of the 206 is already coming in.
- The old code sent the GET with no Range and `--max-filesize` at `getCapMB`. curl refused the response as soon as it read a Content-Length over the limit.
- Reproduction, scripts/adversary/bytes.cjs B1, an 8 MB extensionless JSON (and B1v, an 8 MB extensionless `video/mp4`), Range honored, bytes delivered at the relay:

| Link at the relay | Old, block | Old, fetch-once | New, block | New, fetch-once |
| --- | --- | --- | --- | --- |
| loopback, no limit (three URLs each) | 261,120 | 195,584 to 261,120 | 1,000,266 | 1,000,266 |
| 12.5 MB/s (100 Mbit/s) | 16,384 | 16,384 to 32,768 | 81,920 to 98,304 | 81,920 to 98,304 |
| 2.5 MB/s (20 Mbit/s) | 16,384 | 16,384 | 16,384 | 16,384 |

- So the extra spend is what arrives during the poll delay: about 70 KB at 100 Mbit/s, the whole 1 MB chunk on a fast link. In block mode it repeats on every page load (each run asks again). It is counted, and no cap is passed.
- It applies to any extensionless Webflow URL fetched by `fetch()` or XHR that is larger than `getCapMB`, video or not. Webflow asset URLs have extensions, so this is rare on the real site. It still breaks the rule this check applies.
- The new WF-GUARD.md text says the guard "stops the transfer at once" for "a 206 whose total size is over `getCapMB` (the first version refused such a file too)". The first version refused it at its headers; this one lets up to a chunk through.
- Fix: probe with a small first range (for example `bytes=0-65535`). The type, the first bytes and the total are all known from it. Then fetch the rest in one GET as now. A file over `getCapMB` then costs at most 64 KB, and a video too.

### X-2. A 206 with no total size costs the first chunk twice, and in fetch-once its claim is given back after bytes were sent

- Code: for a 206 that does not say its total (`bytes 0-999999/*`), or a 416, or a 206 that does not start at 0 or whose body length differs from its range (a 206 with content encoding), `probeGet` falls back to `return netGet(url, headers, cls, { ext: true })`, a whole second GET. That result goes back to `serveWebflow` as it is. When the second GET gets no grant, it carries `unsent: true`, and `serveWebflow` calls `cache.release(key)`. But the probe before it was sent.
- B2, a 3 MB extensionless JSON from a server that sends `Content-Range: bytes 0-999999/*` (valid HTTP for content of unknown length): old 3,000,214 B, 1 request; new 4,000,474 B, 2 requests, in block mode and fetch-once. The builder lists this case in WF-GUARD.md.
- B3, the release (not documented): fetch-once, the same URL in three runs on one cache folder, run cap 1.02 MB each. Each new run sends the 1 MB probe, the second GET has no room, the run stops, and the claim is released:
  - new: 1 request and 1,000,260 B in each of the three runs (3.0 MB in all), and it would go on in every later run;
  - old: run 1 sends one GET (261,120 B at the relay) and stops; runs 2 and 3 send nothing ("fetched before").
  - The same release happens when the second GET waits `reserveWaitS` for other runs or its context closes during the wait.
- How likely: low on Webflow's CDN, which states totals. But fetch-once promises one fetch of a URL ever, and here it does not hold.
- Fix: never pass `unsent` through after a GET was sent (return `{ abort }` in the fallback, as the join path does). For a 206 with no total, ask for the rest with an open range (`bytes=<chunk>-`) under `getCapMB` and join, so the file costs once.

### X-3. Near a cap, response headers have only 16 KB of room, so a GET can pass the cap (pre-existing; the docs now claim it cannot)

- Code: when a cap sets a grant, `tryReserve` gives a body limit of the grant less `HEADER_ALLOWANCE` (16 KB). curl's `--max-filesize` limits the body only. A response with more than 16 KB of headers and a body under the limit reads more than its grant. `countFor` counts what curl read, so the run's counted bytes pass the cap.
- B4, run cap 1 MB, a 0.98 MB `.js` with 60 KB of response headers: counted 1,040,907 B against a 1,000,000 B cap, in block mode and fetch-once. The old code counted the same 1,040,907 B. With 20 KB of headers and a 0.96 MB body it fits (980,427 B), so the gap needs headers over 16 KB plus a body close to what is left.
- Not new spend: 686e520 does the same. But tools/WF-GUARD.md now says "the bytes counted plus the open reservations never pass it", and the task asks for FAIL when counted bytes pass a cap.
- How likely: low. Webflow responses carry a few KB of headers.
- Fix: near a cap, keep `ALLOW` (272 KB) of room for headers too, as a grant far from a cap already does (`limit = grant - ALLOW` when a cap sets the grant). curl stops reading headers at about 100 KB per header and 300 KB in all, so that bound holds.

## Notes (not deciding the verdict)

- N-1. The new bare-M rule drops some figures without an error. A bullet with a date where the only size is a bare "M" not at the end of the line and not before a bracket counts 0: `- 27 Nov, x: 3 M; y: 2 M` reads 0 (r2: 5), `- 27 Nov, x: 3 M total` 0 (r2: 3), `- 27 Nov, x: 3 M, estimated` 0, `- 27 Nov, x: 3 M [E]` 0, and `- 27 Nov, x: 40 M, recheck 30 M (E)` reads 30 (r2: 70). The old code read 0 for all of them too, so this is not new spend. It goes against the N-6 rule that a line with a size is counted or stopped, never read as 0. Throwing on a bare M figure that is not counted would close it.
- N-2. Header bytes. Each extensionless fetch now gets one more `Content-Range` header (51 B), and a file over one chunk one more response (about 0.3 KB): B5 3,000,539 B vs 3,000,214 B, B6 3,000,511 B vs 3,000,200 B. The builder reports this. It is small, and I do not count it toward the verdict.
- N-3. The octet-stream sniff knows MP4, MOV and WebM only. An extensionless AVI, MPEG-TS, Ogg or FLV sent as `application/octet-stream` is fetched whole and served, as in the old code. A video sent with a wrong text type is not sniffed at all. Not new spend.
  - The other way round: an octet-stream file that is not a video but has `free`, `skip`, `wide`, `mdat`, `moov` or `pnot` at bytes 4 to 7 is taken as a video. B6 `text` (`abcdfree text, ...`): new refuses it after the first chunk (1,000,252 B), old serves it (3,000,200 B). Fewer bytes, but the page breaks.
- N-4. Block mode now shares one GET between two requests of one context for the same key. The second request gets the first one's answer even if its own headers (Accept, Accept-Language) differ. That saves bytes; a page that asks for the same URL with different Accept headers gets one answer.
- N-5. The 5 ms watch runs on the Node event loop. With many GETs and a busy loop the delay is longer, and so is the X-1 loss.
- N-6. Pre-existing and unchanged: a caller route that fulfills a 302 to a Webflow URL lets Chromium fetch it unrouted (counted afterwards as a leak; redir.cjs R10, `leaks` 1).

## What else I tried that held

- Redirect page loops by URL form: none of 246 forms differ (see A-1). The chain limit and the 8 pages in 10 s window would still stop a loop that a form difference could start.
- Replay keys per page: R6 shows one stored answer per page and no cross-page use.
- Cross-process reservations near a cap with the new `ALLOW` room: Q1 and cap3 stay at or under the cap. A killed GET counts up to its grant.
- The start-time check (A-5): field 22 is read after the last `)`, so a process name with spaces or brackets does not shift it. A missing /proc keeps the old behavior.
- Released claims racing a real fetch across processes: a released line only removes an earlier fetched line of the same key, and `claim()` refuses while the fetched line is in the list and the release is not yet written. I found no order in which a release removes a later real fetch.
- Parser: no line reads lower than the old code (P3 has no "NEW BELOW OLD" row); the history and live totals are unchanged.
- The added prose in tools/ has no em dashes, exclamation marks or banned words.

## Recommendation

- Do not merge round 3 as it is. X-1 and X-2 are small and rare on the real site, but they are new spend, and X-2 breaks the one-fetch promise of fetch-once. Both have small fixes in `probeGet` (a small first range; no `unsent` after a sent probe; an open range for a missing total).
- X-3 is a one-line change in `tryReserve` and should go with them, so that the WF-GUARD.md claim holds.
- cache-only is not affected by any of these: it sends nothing to Webflow on a miss.

## Environment and files

- This folder is shared with check-repro.md, written at the same time by another session. This check's files are under scripts/adversary/ and runs/adversary/ only. I did not read check-repro.md before writing this.

```sh
export PATH=<folder with scripts/adversary/curl-wrapper.sh installed as curl>:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp CURL_WRAP_LOG=<scratch>/curl-calls.log
```

- Old code for the side-by-side runs: a worktree at 686e520, passed instead of the branch worktree.
- Run a browser script as `node -r ./dnsmap.cjs <script> <worktree or old>` from scripts/adversary/. bytes.cjs takes an optional part name (B1 to B6) and `RELAY_RATE=<bytes per second>`. parser3.cjs takes `<worktree> <old> <main checkout> <r2>`. forms.cjs takes the worktree only.
- New scripts: stub4.cjs (Range, `*` totals, large headers, sniff samples), relayrate.cjs, bytes.cjs (B1 to B6), forms.cjs (U1), parser3.cjs, procs3.cjs (Q1 to Q3), cap3.cjs (C5, C6), r4.cjs (R4h). From round 2, run again: stub3.cjs, redir.cjs, loop.cjs, cap.cjs, claim.cjs, relay.cjs, wfget-child.cjs.
- Output: runs/adversary/, with `-wt` (new) and `-old` files for each side.
- Playwright 1.63.0, Chromium headless shell 1243, Node 22, curl 8.5.0.
