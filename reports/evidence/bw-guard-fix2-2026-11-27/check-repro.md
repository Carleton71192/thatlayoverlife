# Independent check (reproduction): bandwidth guard fixes N-1 to N-7

- Checked: branch claude/bw-guard-fix2-2026-11-27, commit 7c53c4fe663a489e6b3980c52d3d656597460182 (parent 58dd4db).
- Baseline for every "old" figure: 686e520, the merge the 27 Nov check looked at.
- Date: 27 Nov 2026, label bw-guard-fix2-check-repro. Lens: reproduction, with bytes measured at a relay.
- Verdict: **FAIL**, on one item only (R-1).
  - N-1 to N-7 are all fixed. I measured each one against the old code. Details below.
  - R-1: the N-3 fix spends Webflow bytes the old code did not. An extensionless `fetch()` of an allowed file larger than `videoChunkMB` is now downloaded one chunk plus whole. A 3 MB JSON costs 4.00 MB at the relay, against 3.00 MB on 686e520. The bytes are counted and the caps hold, but the spend is new. The task rule says FAIL in that case.
  - Nothing I found lets a byte pass the guard uncounted. The fixes close one bypass the old code had (redirect chains over 20 hops, N-4).
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M).
  - Chromium ran with `--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost` and `--no-proxy-server`, with proxy variables unset.
  - Node-side lookups went to 127.0.0.1 through a preload (scripts/dnsmap.cjs).
  - A `curl` wrapper first on the PATH (scripts/curl-wrapper.sh) refused any call without `--noproxy *` and `--connect-to ::127.0.0.1:`. It logged 921 calls, all forced to 127.0.0.1, and refused 0.
  - `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed at scratch files. The real handoff/BANDWIDTH-LOG.md files have the same hashes as before. `<main checkout>/.git/wf-guard` does not exist.
  - One Chromium at a time. None left running.

## How bytes were measured

- scripts/relay.cjs is the n8b relay made reusable. Webflow host names in my probes use the relay's port. The relay forwards the stub's bytes to the client only as fast as the client side takes them. So "delivered" is what reached the client host, not what the stub wrote into its own buffer.
- The guard's curl and wf-get both connect through the relay. A Chromium request that slips past the guard would go through it too.
- "Counted" is what the guard or wf-get put in its tally.

## Result per finding

| Item | Fixed? | Measured (old 686e520 vs new 7c53c4f) |
| --- | --- | --- |
| N-1 reservations | yes | 45 and 100 slow images at once: old tripped after 40 requests, new loads all (45 of 45, 100 of 100), no trip. Processes at a 1 MB day cap: old completed 1, 1, 1, 2; new 1, 3, 4, 5, which is what fits. |
| N-2 refused or cut | yes | wf-get, 1 MB limit: old counted 196, 197 and 1,000,169 bytes for 195,584, 195,584 and 1,118,208 delivered. New counts 1,000,196, 1,000,197 and 1,256,169 for 195,584, 290,816 and 1,147,904 delivered. A refused URL is asked for once per run. |
| N-3 extensionless fetch | yes, see R-1 | An extensionless video by `fetch()`: old 3.00 MB delivered, new at most one 1 MB chunk (0.26 MB when the server ignores Range). |
| N-4 redirected page load | yes | `location.href` and the relative image now use the final host. The final page is fetched once. A chain over 20 hops: old let Chromium follow the rest unrouted (1 and 5 requests past the guard), new aborts it. |
| N-5 repeated lines | yes | One file with a line twice: old 100, new 200. Three times: old 100, new 300. A line in both files once each: 100 in both. |
| N-6 unreadable lines | yes | Numbered list, table row, plain dated line, `## 27 Nov: 3 MB`, `> 27 Nov ...`: old 0, new throws naming file and line. `3 M`, `3000000 bytes`, `3,000,000 bytes`: old 0, new 3. Real logs: same totals as old. |
| N-7 wording and counters | yes | A live-page beacon and POST: old "2 unload beacons stopped", new "2 non-GET requests aborted". Trip on a refused first GET: old "reached 0.00 MB", new names the refused GET and the MB counted. |

## N-1 in detail

Scripts: repro-browser.cjs (P1), repro-proc.cjs (A, B, D), and the old n7.cjs and n5.cjs. Output: runs/repro-browser-*.txt, runs/repro-proc-*.txt, runs/n7-new.txt, runs/n5-n8-*.txt.

- One page, many GETs (fetch-once, run cap 200 MB, getCapMB 5):
  - 45 images at 0.8 s each: new loads 45, 45 stub requests, 5 GETs waited, no trip. Old: "p1 reached 0.00 MB from Webflow, the run cap is 200 MB; run stopped" after 40 requests.
  - 100 images: new loads 100, 60 GETs waited, no trip. Old: the same stop after 40.
  - n7.cjs again: 45 images load (45 stub requests, 45 stored). With 240 MB already logged today, 3 images load with no trip.
- Processes at a 1 MB day cap, all started at the same moment, through the relay (repro-proc A):

| Processes and size | Fit by arithmetic | Old complete | New complete | New stub requests | New delivered | New counted |
| --- | --- | --- | --- | --- | --- | --- |
| 2 x 600 KB | 1 | 1 | 1 | 2 | 0.80 MB | 0.98 MB |
| 6 x 300 KB | 3 | 1 | 3 | 4 | 1.10 MB | 1.16 MB |
| 12 x 200 KB | 4 | 1 | 4 | 5 | 1.00 MB | 1.00 MB |
| 12 x 190 KB | 5 | 2 | 5 | 6 | 1.14 MB | 1.14 MB |

  - The builder's figures hold: 1, 3 and 5 for 600, 300 and 190 KB.
  - In each new row one extra GET reaches the stub. It is the last GET, made with what was left of the cap, and refused by size. See R-2: the old code makes the same GET inside one run.
- Waiting for another process (repro-proc D). A child process reserves the whole 1 MB cap, then settles:
  - D1, wait 1 s, hold 3 s: the GET is refused with "other runs held what is left of the daily cap for 1 s". The run is not stopped. 0 stub requests. The log line says "1 refused after waiting for other GETs to settle".
  - D2, wait 10 s, hold 3 s: the GET goes after 2.9 s and returns 200.
  - D3, the holder is killed with SIGKILL while it holds: the GET goes after 1.1 s. A dead process's reservation does not block.
  - D4, the holder settles 1 MB really used: the waiter stops at the daily cap, 0 stub requests.
- Waits inside one process (P1c, P1d, run cap 6 MB so one 5 MB grant at a time):
  - The context closes while four GETs wait: 1 stub request, 0 more in the next 6 s. Closing took 0.01 s.
  - With `reserveWaitS: 1`: 3 GETs refused after waiting, the run goes on, the log line counts them.
- In-process caps still hold: main2 S8 (runs/main-block-new.txt), two runs with a 1 MB day cap loading 0.6 MB each at once. One loads. The other waits, makes its last GET with 0.4 MB left, is refused by size and stops. Day total 0.98 MB.

## N-2 in detail

Scripts: repro-proc.cjs (C), repro-browser.cjs (P2), old main2.cjs and wfget.cjs. Output: runs/repro-proc-*.txt, runs/repro-browser-*.txt, runs/main-block-new.txt, runs/wfget-new.txt.

- wf-get, `--max-filesize 1`, through the relay:

| Response | Old counted | Old delivered | New counted | New delivered |
| --- | --- | --- | --- | --- |
| Content-Length 3 MB | 196 | 195,584 | 1,000,196 | 195,584 |
| Content-Length 30 MB | 197 | 195,584 | 1,000,197 | 290,816 |
| chunked 30 MB | 1,000,169 | 1,118,208 | 1,256,169 | 1,147,904 |

- The same 6 MB URL three times in one wf-get run: old 3 requests, 717,824 bytes delivered, 588 counted. New 1 request, 195,584 delivered, 5,000,196 counted, and "2 refused again as over the size limit earlier in the run".
- Block mode, a page with a 6 MB script and a chunked 8 MB script, loaded three times (P2a): old 6 requests, 18.95 MB delivered, 15.00 MB counted. New 2 requests, 5.38 MB delivered, 10.26 MB counted, 4 refused again.
- Run cap 1 MB, a page polls 200 KB files (P2b and main2 S5): old counted 0.80 MB for 1.00 MB sent. New counts 1,000,983 bytes for 1,000,985 delivered. The 2 bytes are header bytes curl reports a little differently; I see no gap that matters.
- Endless stream at a 1 MB run cap (main2 S5): old counted 0.98 MB for 1.02 MB sent, new 1.24 MB.
- The counted figure was at or above the delivered figure in every case above.

## N-3 in detail, and R-1

Script: repro-browser.cjs (P3). A second local stub serves odd answers on a Webflow host name, behind its own relay. Output: runs/repro-browser-*.txt. Delivered MB at the relay, page `fetch()` with no Range header unless shown:

| URL (3 MB unless shown) | Old, all modes | New fetch-once | New fetch-once allowVideo | New block |
| --- | --- | --- | --- | --- |
| video, server honours Range | 3.00, refused after (allowVideo: served whole) | 1.00, refused | 1.00, refused | 1.00, refused |
| video, server ignores Range | 3.00 | 0.26 (counted 1.02), refused | 0.26, refused | 0.26, refused |
| video, chunked, ignores Range | 3.00 | 1.12 (counted 1.27), refused | 1.12, refused | 1.15, refused |
| video, page sends `Range: bytes=0-` | 3.00 (allowVideo: 0, sliced from the whole copy the row above stored) | 1.00, refused | 1.00, served 206 | 1.00, refused |
| font, no extension | 3.00, refused | 1.00, refused | 1.00, refused | 1.00, refused |
| image, no extension | 3.00 | **4.00**, served | **4.00**, served | 1.00, refused |
| JSON 0.3 MB | 0.30 | 0.30 | 0.30 | 0.30 |
| JSON 0.8 MB | 0.80 | 0.80 | 0.80 | 0.80 |
| JSON 3 MB, honours Range | 3.00 | **4.00** | **4.00** | **4.00** |
| JSON 3 MB, ignores Range | 3.00 | **3.20** (counted 4.02) | **3.39** | **3.26** |
| HTML 2 MB, ignores Range | 2.00 | **2.26** (counted 3.02) | **2.26** | **2.20** |
| `/v.json` that serves video | 3.00, refused | 3.00, refused | 3.00, served | 3.00, refused |

- N-3 as stated is fixed. No extensionless video, font or (in block mode) image costs more than one 1 MB chunk now. The old new.cjs probe agrees: `/noext-video-8` went from 3,000,000 bytes to one 1,000,000-byte range, and `/noext-video-7` with `allowVideo` is no longer sent whole (runs/new-new.txt).
- **R-1 (FAIL). The probe spends bytes the old code did not.** For an allowed file over `videoChunkMB`, `probeGet` throws the first chunk away and fetches the whole file again (tools/wf-guard.cjs, `probeGet`: `if (r.truncated) return netGet(url, headers, cls)` and the 206 branch that is not the whole file).
  - A file that honours Range costs one chunk more: 3 MB costs 4 MB. A file just over 1 MB costs about twice its size.
  - A file that ignores Range costs what reached the client before curl refused it, plus the whole file.
  - In block mode this repeats on every page load. In fetch-once it happens once per URL.
  - It is counted, so no cap is passed. WF-GUARD.md says so ("That costs the first chunk twice"). But the old code fetched these files once.
  - It applies to `fetch()` and XHR of Webflow URLs whose last path part has no extension: JSON endpoints, pages fetched by script, an image fetched by script.
  - A fix that keeps N-3: when the probe's 206 shows the total and the type is allowed, fetch only `bytes=<chunk>-<total-1>` and join the two parts, then serve a 200. A server that honours Range (the Webflow CDN does) then costs the file once. For a server that ignores Range, curl could be given the whole `getCapMB` limit once the type is known from the headers, or the guard could accept the small loss and say so.
- Residual, unchanged from the old code: a URL with a non-media extension that serves video (`/v.json` above) is still fetched whole, then refused by type. Webflow video URLs end in `.mp4`, so the risk is low.

## N-4 in detail

Script: repro-browser.cjs (P4). Output: runs/repro-browser-*.txt, runs/new-new.txt (N9).

- Apex 301 to `www/landing.html`, block and fetch-once: `location.href` is the www page (old: the apex redirect URL). The relative image goes to the www host in fetch-once (old: the apex host). The final page reached the stub once. `pageLoads` 1, `redirectPages` 1.
- cache-only on the cache the fetch-once run filled: the same navigation lands on the www page with 3 cache hits and 0 stub requests.
- A Location with an upper-case host, a space in the path and a fragment: the final page reached the stub once, so the stored answer was used.
- A Webflow 302 to a localhost page: the localhost page was requested once (by the guard), not again by Chromium.
- JavaScript off: the old behavior, as documented (no redirect page).
- An iframe that redirects: unchanged.
- Redirect chains (Chromium requests counted as stub requests minus curl calls):

| Chain | Old stub requests / curl calls | Old past the guard | New stub requests / curl calls | New result |
| --- | --- | --- | --- | --- |
| 20 hops, block | 21 / 21 | 0 | 21 / 21 | loads, location right |
| 21 hops, block | 22 / 21 | 1 (`leaks` 1) | 21 / 21 | aborted, `redirectLimit` 1 |
| 25 hops, block | 26 / 21 | 5 (`leaks` 5) | 21 / 21 | aborted |
| 25 hops, fetch-once | 27 / 22 | 5 | 21 / 21 | aborted |

  - So the builder's extra fix closes a real bypass of the old code.

## N-5, N-6 in detail

Script: repro-parser.cjs, and the old parser.cjs. Output: runs/repro-parser.txt, runs/parser-*.txt.

- N-5: one file with the same line twice: old 100 MB, new 200. Three times: old 100, new 300. Main twice and worktree once: old 100, new 200. A copy in each file once: 100 in both.
- N-6: these were 0 and now throw `WfLogFormatError` with `<file>:<line>`: `1. 27 Nov, x: 3 MB`, `1) 27 Nov ...`, `| 27 Nov | x | 3 MB |`, `27 Nov, x: 3 MB`, an indented plain line, `## 27 Nov: 3 MB`, `> 27 Nov ...`, `Nov 27: 3 MB`, `2026-11-27 x 3 MB`. A run does not start on such a log.
- `- 27 Nov, x: 3 M`, `3000000 bytes` and `3,000,000 bytes` now read 3 MB.
- As documented, `3 MB on 27 Nov` on a plain line is still skipped, and so is the real header line "Budget: 250 MB a day; the 13 Nov STANDING RULE".
- The real logs (main checkout, origin/claude/new-session-zxm063, both worktrees) give the same day totals with the old and new parser: 21 Nov 97.4, 22 Nov 35, 25 Nov 9, 27 Nov 2.5 MB, and no error.
- Every line of the old parser.cjs reads the same as before except the five N-6 lines.

## N-7 in detail

- A live page that calls `sendBeacon` and a POST `fetch()` to Webflow (P7a): 0 requests reach the stub in both. Old log: "2 unload beacons stopped". New log: "2 non-GET requests aborted". The `unloadStopped` field is gone from `stats()`.
- At unload (n3.cjs again): 0 Webflow requests with the guard, as before. Not counted, as the docs say.
- Trip wording (P7b, crash.cjs `trip-default`, wfget W5, main2 S5):
  - Run cap 0.5 MB, first GET 1 MB. Old: "reached 0.00 MB from Webflow, the run cap is 0.5 MB". New: "stopped at the run cap of 0.5 MB: a GET of <url> was refused because it was larger than the 0.50 MB left; 0.48 MB counted from Webflow in this run, the refused GET included".
  - Run cap 0.5 MB, 0.3 then 0.3 MB. Old: "reached 0.30 MB". New: names the second GET and "0.20 MB left; 0.56 MB counted".
  - A size limit that is not a cap does not trip and logs "1 over the size limit".

## Other notes (no action needed for the verdict)

- R-2. The last GET at a cap. When less than a full grant is left, the guard and wf-get still make one GET with what is left. If the file is bigger, curl refuses it and the bytes in flight are lost. Repro-proc B shows the old code does the same inside one run: five 300 KB files at a 1 MB day cap deliver 1.096 MB in both versions. The old code counted 0.90 MB, the new one 1.16 MB. So this is not new spend. The new count can show a little over a cap, as the builder said. Across runs the new code is better: the old code counted about 165 bytes for that GET, so each later run could make another one.
- R-3. A Range request now reserves only its length (`wantFor`). When a server ignores Range on a non-media file, the response is refused by size and the page's `fetch()` fails. main2 S4: `kb800.js` with `Range: bytes=0-99` was served whole (0.80 MB) by the old code; now it is refused, counted 0.26 MB, and not served. Fewer bytes, but a page that relies on it breaks. The Webflow CDN honours Range, so this should be rare. WF-GUARD.md does not mention the failure.
- R-4. With the N-4 fix, `page.goto()` on a redirecting URL returns the guard's small redirect page (status 200, header `x-wf-guard-redirect`), not the final answer. `page.url()` was already the final URL when `goto` returned in all my runs. A harness that reads `response.text()` or `response.status()` from `goto` gets the small page. Worth one line in WF-GUARD.md.
- R-5. The aggregated parser error says "no date the guard can read at the start of a bullet" even for a table row. It names the file and line, so this is wording only.
- The guard docs, the code comments and the commit carry no em dashes, no exclamation marks and none of the banned words. The commit ends with the two required lines.

## Old probes run again on 7c53c4f

All 27 Nov scripts, with paths adapted (scripts/run-old-probes.sh). Output files end in `-new`; `-old` files are the same scripts on 686e520 where I needed a baseline.

| Script | Result on 7c53c4f |
| --- | --- |
| new.cjs N1 (cache-only, every resource kind, four endings) | 0 HTTP requests to the Webflow stub in all four, 22 misses, 0 bytes (runs/new-new.txt) |
| new.cjs N2, N6a | as before: earlier routes run, nothing reaches the stub; cache-only video slices right |
| new.cjs N6b, N6c | improved by N-3 (see above) |
| new.cjs N9 | location and relative image now right |
| n3.cjs | 0 Webflow unload requests with the guard; localhost beacon goes with `'webflow'` and is stopped with `'all'`, as before |
| n4.cjs | every child exits 0 and prints ALIVE in all three modes |
| n7.cjs | N-1 fixed (above); N2r race 0 HTTP requests, 12 TCP connections (as before); S6c log line 0.50 MB |
| n5.cjs | see N-1 (runs/n5-n8-new.txt, runs/n5-n8-old.txt) |
| n8b.cjs | unchanged, as expected: it calls `curlFetch` directly, and the allowance is added above it (`countedBytes`) |
| parser.cjs | unchanged except the five N-6 lines |
| main2.cjs, block and cache-only (the S3 variant with `serviceWorkers: 'block'` skipped, as on 27 Nov) | same as the 27 Nov run except S2 page load now counted 1, S4 (R-3), S5 (N-2) and S8 (R-2). cache-only: the only Webflow requests are the ones S4 and S6 ask for in fetch-once on purpose. 0 unhandled rejections in both. main2 failed to write its JSON summary at the end (OUTDIR unset in my first run); the text output is complete |
| crash.cjs | every mode as on 27 Nov; `trip-default` now uses the new wording; no Chromium left over |
| wfget.cjs W1 to W14 | as before, except W5 and W14 now count the allowance (983,805 and 5,000,413 bytes) |

## Test suites on 7c53c4f

| Suite | Result |
| --- | --- |
| `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 47 of 47 pass, two runs (runs/guard-tests-1.txt, -2.txt) |
| `npx vitest run` (node_modules linked from the main checkout for the run, then removed) | 875 of 875 pass, 73 files (runs/vitest.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 pass (runs/worker.txt) |

## Environment

```sh
export PATH=<dir with scripts/curl-wrapper.sh installed as curl>:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp OUTDIR=<scratch>/out
```

- Run a script as `node -r ./dnsmap.cjs <script> <worktree>` from scripts/. repro-parser.cjs takes the worktree and then log files to read.
- Playwright 1.63.0, HeadlessChrome 157, Node 22.23.5, curl 8.5.0.

## Files

- scripts/: the 27 Nov scripts (curl-wrapper.sh now takes its log path from `CURL_WRAP_LOG`), plus relay.cjs, repro-proc.cjs, repro-browser.cjs, repro-parser.cjs and run-old-probes.sh.
- runs/: output. Scratch paths are shortened to `<scratch>` or `<path>`.
