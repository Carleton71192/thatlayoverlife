# Independent check: bandwidth guard fixes (tools/wf-guard.cjs, tools/wf-get.cjs)

- Checked: branch claude/bw-guard-fix-2026-11-27, commit cdeb7a494f981d1a1c9b93fe862d5cfc68a41a78 (parent merge 00e61b9 of d0f8934 and e621b4f).
- Date: 27 Nov 2026, label bw-guard-fix-check.
- Verdict: **PASS WITH NOTES.**
  - The six points I was asked to confirm all hold.
  - The default mode, cache-only, sent 0 HTTP requests to a Webflow host in every probe.
  - The old holes 1 to 11 and 13 to 16, and review items G1 to G4, are fixed. Item 12 is unchanged and documented.
  - Two new findings matter before fetch-once or block mode is used on real pages. N-1 stops runs that are far below the caps. N-2 undercounts responses that curl refuses or cuts at a size limit. Neither can make cache-only spend Webflow bytes.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M).
  - Every browser run mapped every host name to a stub on 127.0.0.1 (`--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost`, `--no-proxy-server`), with proxy variables unset.
  - Node-side lookups were mapped to 127.0.0.1 by a preload (scripts/dnsmap.cjs).
  - A `curl` wrapper first on the PATH (scripts/curl-wrapper.sh) refused any call that did not carry `--noproxy *` and `--connect-to ::127.0.0.1:`. It logged 289 calls, all forced to 127.0.0.1, and refused 0.
  - `WF_GUARD_STATE`, `WF_GUARD_LOG` and `WF_GUARD_MAIN_LOG=none` pointed every run at scratch files. Afterward the real handoff/BANDWIDTH-LOG.md files had the same hashes as before, and `<main checkout>/.git/wf-guard` did not exist.
  - One Chromium at a time; none left running.

## What I ran

| Run | Result |
| --- | --- |
| Builder's tests: `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 35 of 35 pass, three runs in a row (runs/builder-tests.txt) |
| `npx vitest run` on cdeb7a4 | 875 of 875 pass, 73 files (runs/vitest.txt) |
| `node --test worker/test/*.test.js` | 83 of 83 pass (runs/worker.txt) |
| 25 Nov probes S0 to S10, adapted to the new modes (scripts/main2.cjs), block mode and cache-only mode | runs/main-block.txt, runs/main-cache-only.txt |
| 25 Nov crash probes, plus a trip with the default onTrip (scripts/crash.cjs) | runs/crash.txt |
| 25 Nov wf-get probes W1 to W10, plus W11 to W14 (scripts/wfget.cjs) | runs/wfget.txt |
| New probes N1 to N9 (scripts/new.cjs, n3.cjs, n4.cjs, n5.cjs, n7.cjs, n8b.cjs, parser.cjs) | runs/ |

- Playwright 1.63.0, HeadlessChrome 157, Node 22.23.5, curl 8.5.0.
- The new probes use two stubs (scripts/stub2.cjs). Webflow host names use one port and every other host the other port. So any TCP connection to the first stub is contact with a Webflow host name.
- Run any script as `node -r ./dnsmap.cjs <script> <worktree of cdeb7a4>` from scripts/, with the environment in "Environment" below.

## The six points

1. **cache-only sends nothing to Webflow on a cache miss. Holds.**
   - N1 (runs/new-N1.txt): a Webflow page served from `htmlDir` asks for every kind of Webflow resource I could think of, none cached: stylesheet, @import, font, background, img and srcset, picture, video and poster, audio, iframe, object, embed, SVG image, fetch, XHR, EventSource, a worker fetch, preload, prefetch, modulepreload, speculation rules (prerender and prefetch), manifest and icons.
   - It ended four ways: navigation away, `page.close()`, `context.close()`, and `page.close()` with `unloadNonGet: 'all'`. Each time the Webflow stub got 0 HTTP requests. The guard listed 22 misses and counted 0 bytes.
   - N1x (runs/n1x.txt) loaded each kind on its own page three times. Only WebSocket opened TCP connections to the Webflow stub (3 for 3 loads), with no HTTP request seen. WebSocket is a documented gap.
   - main2 in cache-only mode (runs/main-cache-only.txt): the only Webflow requests were those of the two scenarios that ask for fetch-once on purpose (S4 cache part, S6).
2. **A route registered before guard() still runs. Holds.**
   - N2 (runs/new-N2-N6-N9.txt). Every route registered before guard() ran once and nothing reached the Webflow stub:
     - a context route that serves saved HTML
     - a context route and a page route that call `continue()` on a Webflow image (it then ended at the guard and was aborted)
     - a context route whose `route.fetch()` got the cached CSS (status 200; the page showed the cached color)
     - a context route whose `route.fetch()` missed (it threw "refused a Webflow fetch in mode cache-only")
   - `g.lastWord()` was true. After `unrouteAll()` and `unroute('**/*')` the guard was still in place.
   - S10 (both modes): the 25 Nov "route registered before guard" case is now blocked.
3. **Unload beacons are aborted. Holds for Webflow hosts.**
   - N3 (runs/n3.txt) is a control test. A page sends 10 requests to Webflow hosts from `pagehide` and `visibilitychange`:
     - sendBeacon and a keepalive POST
     - a keepalive GET and an image
     - an XHR POST and a POST built from a `Request` object
     - a sendBeacon and a keepalive fetch taken from a fresh iframe's realm
   - Without the guard, all 10 reached the Webflow stub, on navigation away and on `page.close()`. With the guard, 0 did. The fresh iframe realm was patched too.
   - A beacon to localhost still went out with the default `unloadNonGet: 'webflow'` and was stopped with `'all'`, as documented.
4. **A failed fetch does not crash Node 22. Holds.**
   - N4 (runs/n4.txt) runs in child processes with no `unhandledRejection` handler, in fetch-once, block and cache-only.
   - Failing cases: the guard's own curl (connection dropped), a strict-mode `route.fetch` of another host, a caller `route.fetch` of a Webflow URL and of another host (caught by the caller), and `context.request.get` on a Webflow URL and on another host (caught).
   - Every child exited 0 and printed ALIVE.
   - In fetch-once each failed Webflow URL reached the stub once. A second request was refused ("its one fetch failed").
   - main2 recorded 0 unhandled rejections in both modes.
5. **Two runs at once cannot both pass the daily cap. Holds.**
   - In one process (main2 S8): two runs with a 1 MB day cap each load 0.6 MB at once. One loaded, the other was refused (runs/main-block.txt).
   - Across processes (N5, runs/n5-n8.txt): 2, 6 and 12 wf-get processes started at the same moment, sharing one tally folder, with a 1 MB day cap and 0.6, 0.3 and 0.2 MB each. The stub sent 0.6, 0.3 and 0.2 MB. The tally and the log agree. The cap was never passed. See N-1 for the cost.
6. **Video Range requests are never widened. Holds.**
   - N6a: in cache-only, a video miss was aborted, and a cached whole file was sliced: `bytes=10-19` gave 206 with 10 bytes, `bytes=-5` gave 5 bytes, a range past the end gave 416. The stub got 0 requests.
   - N6b, fetch-once with `allowVideo`, what reached the stub:
     - `bytes=0-99` went as is.
     - `bytes=0-` became `bytes=0-999999`.
     - `bytes=-2500000` became `bytes=-1000000`.
     - `bytes=500000-2999999` became `bytes=500000-1499999`.
     - A caller `route.fallback()` that set `bytes=0-` was cut to 1 MB, and so was `context.request.get` with `bytes=0-`.
     - A multi-range request and a request with no Range header were refused.
     - No video request carried more than 1 MB.
   - One exception, which is not a widened range: see N-3.

## Old findings (25 Nov check and keep-going review), status

| Item | Status | Evidence |
| --- | --- | --- |
| 1 unhandled rejection | fixed | N4, main2 |
| 2 earlier context routes shadowed | fixed | N2, S10 |
| 3 unload non-GET | fixed for Webflow hosts | N3 |
| 4 unfinished responses not counted | fixed: an endless stream tripped at 0.98 MB with a 1 MB cap (stub sent 1.02 MB) | main-block S5 |
| 5 log line before counts settle | fixed; the remaining gap of 0.2 MB in S5 polling is N-2 | main-block S5 |
| 6 redirects into Webflow | fixed: images, a script, a navigation and a caller `route.fetch` through another host were blocked or counted (300,197 counted for 300,000 sent) | main-block S2 |
| 7 daily cap across runs | fixed | point 5 |
| 8 guard(page) after the page closes | fixed: the line written at context close holds 0.50 MB | runs/n7.txt S6c |
| 9 once per cache folder | fixed: one upstream fetch for two contexts, one for a failed URL across three contexts | main S6 |
| 10 host names | fixed: trailing dot, `cdn.thatlayover.life`, `uploads-ssl.webflow.com` are caught | main S1 |
| 11 media by extension | fixed in cache-only and fetch-once; block mode still fetches an extensionless image by `fetch()`, counts it, then refuses it by type | main-block S1 |
| 12 signals without handlers, SIGKILL | unchanged and documented; the tally keeps the 0.30 MB of a killed run | runs/crash.txt |
| 13 log parser | fixed for bullet lines; see N-6 | runs/parser.txt |
| 14 wf-get one GET past the cap | fixed: a 3 MB file at a 1 MB cap is stopped, default `--max 30` and 5 MB per GET hold; see N-2 | runs/wfget.txt W5, W12, W14 |
| 15 no cache-only mode | fixed | point 1 |
| 16 minor | page loads are Webflow pages only (S9: 0); the handler now aborts on an error instead of stalling | main S9 |
| G1 cache mode covered media only | fixed: cache-only serves HTML, CSS, JS and media. The real sweep cache matches the layout: all 246 `.json` files are named `sha1(u)`, and the 36 saved pages match `fileFor()` (home.html, stories__<slug>.html) | N2, sweep-cache check below |
| G2 whole videos | fixed; see N-3 | point 6 |
| G3 lock line | fixed: handoff/WEBFLOW-LOCK.md equals the one on claude/new-session-zxm063; the rule text is in tools/WF-GUARD.md under "Proposed rule" | `git diff` |
| G4 wf-get output folder | fixed: run from another folder, pages went to `<checkout>/wf-get-out/<label>`, which git ignores | runs/wfget.txt W11 |

## New findings, most important first

### N-1. Full-size reservations stop runs that are far below the caps (fetch-once, block, wf-get)

- Each Webflow GET reserves `getCapMB` (5 MB) in the shared tally before it starts. A GET whose reservation cannot be granted trips the run, even when the bytes really used are tiny.
- Reproduction, runs/n7.txt (scripts/n7.cjs):
  - A fetch-once page with 45 Webflow images (about 70 bytes each, all requested at once). Result: "wf-guard: n7 reached 0.00 MB from Webflow, the run cap is 200 MB; run stopped". 40 requests reached the stub, 0 were stored. With 30 images the page loaded normally.
  - The log already holds 240 MB for today (10 MB left). A page with 3 small images at once. Result: "brought the 27 Nov total to the daily cap of 250 MB; run stopped", with 0 bytes counted.
- Across processes (N5): open reservations of one run count against the others. So 1 of 2, 1 of 6 and 1 of 12 processes ran, although 1, 3 and 5 would have fit. Most of the others were refused at start with "the daily total ... is already 1.00 MB".
- Effect: no extra Webflow bytes, but false stops. With the default `onTrip: 'throw'` the process ends, and the log line says "STOPPED at the run cap" for a run that used almost nothing. A fetch-once run over a story page with 40 or more images stops on its first page.
- Fix: trip only on bytes really counted. When only reservations block a GET, wait for them to settle instead of tripping. Or reserve a smaller first slice and let curl stop at it.

### N-2. A response refused or cut at a size limit is counted at what curl read, not what the server sent

- The guard and wf-get count `size_download + size_header`. When curl refuses a response because its Content-Length is over `--max-filesize`, that is about 165 bytes. The server has already started sending.
- Reproduction, runs/n8b.txt (scripts/n8b.cjs). A TCP relay forwards the server's bytes to curl with backpressure, so it counts what reached the client host.
  - Content-Length 3 MB, limit 1 MB: counted 164 bytes, 195,584 bytes delivered.
  - Content-Length 30 MB, limit 1 MB: counted 165 bytes, 195,584 bytes delivered.
  - Chunked 30 MB, limit 1 MB: counted 1,000,169 bytes, 1,152,406 bytes delivered.
  - On a real link the gap is up to the TCP window in flight (E, roughly 0.1 to a few MB per GET).
- Where it shows:
  - main-block S5 polling: the stub sent 1.00 MB, the guard counted 0.80 MB, because the fifth 200 KB response was refused at the run cap.
  - wf-get W14: a 6 MB file was counted as 413 bytes.
  - In block mode a non-media Webflow file over 5 MB (a large JSON or PDF) is fetched again on every page load. Each time it counts about 165 bytes and never trips, because a refusal at `getCapMB` is recorded as "over the size limit" and not as a stop.
- Fix: count the declared Content-Length, or a fixed allowance such as 256 KB, for a refused response. Remember refused URLs in the run so block mode does not fetch them again.

### N-3. fetch() of a Webflow video with no file extension downloads the whole file

- A `fetch()` or XHR request has resource type fetch or xhr. With no `.mp4` in the path the guard classes it as a document. So it is fetched without a Range bound, up to `getCapMB`. The content type is checked only after the download.
- Reproduction, runs/new-N2-N6-N9.txt:
  - N6c, fetch-once without `allowVideo`: `/noext-video-8` sent 3,000,000 bytes, which were counted and then refused.
  - N6b, with `allowVideo`: `/noext-video-7` was delivered whole (3,000,000 bytes) in one GET with no Range header.
- `<video>` elements are not affected (resource type media). Webflow's own video URLs carry `.mp4`. So the risk is low. "Never widened" still holds. "Video only in pieces, or not at all" does not hold for this case.
- Fix: for Webflow CDN hosts, refuse an extensionless fetch or XHR in fetch-once and block mode unless a caller allows it. Or cap such a GET at `videoChunkMB` until its type is known.

### N-4. A redirected navigation keeps its first URL, so relative links resolve against the wrong host

- The guard follows redirects itself and fulfills the first request with the last answer. This is documented.
- I confirmed the reason: with no guard, a route that fulfills a 302 does not see the next hop (N9, "seen": only `/hop1`).
- Reproduction, N9 (runs/new-N2-N6-N9.txt): `page.goto` of the apex with a 301 to `www/landing.html`.
  - Without the guard: `location.href` is the www page, and the relative image loads from www.
  - With the guard: `location.href` stays the apex redirect URL, and the relative image is requested from the apex host.
- Effect:
  - In cache-only, assets requested from the apex host miss even when the www copy is cached.
  - In fetch-once, the guard stores a second copy under the apex host.
  - Page code that reads `location` sees the wrong path.
  - A localhost-to-Webflow redirect also counts 0 page loads (main S2).
- Fix: for a main-frame navigation that ends on another URL, fulfill the first request with a tiny page that calls `location.replace(<final URL>)`. The final URL then loads as a new request that the guard routes.

### N-5. Two identical lines in one log count once

- `readDailyTotalMB` drops a line whose text it has already seen, so a line found in both the main and the worktree log counts once. But it also drops a repeat inside one file.
- Reproduction, runs/parser-dup.txt: a log with "- 27 Nov, sweep pass: 100 MB (E)" twice. `readDailyTotalMB` gives 100, `dailyTotalMB` gives 200.
- Two hand-written lines for two runs can match word for word. This errs low.
- Fix: count each line as often as it appears in a file, and take the larger count when the same line is in both files.

### N-6. Dated lines that are not bullets count 0, silently

- Reproduction, runs/parser.txt. These count 0 MB for 27 Nov, with no error:
  - `1. 27 Nov, x: 3 MB` (numbered list)
  - `| 27 Nov | x | 3 MB |` (table row)
  - `27 Nov, x: 3 MB` (no bullet)
  - `- 27 Nov, x: 3 M`
  - `- 27 Nov, x: 3000000 bytes`
- Every bullet format the 25 Nov check listed is now read. Dated bullets the parser cannot read throw `WfLogFormatError`, as claimed (for example `- Thu 27 Nov`, `- 27th Nov`, `- x: 3 MB`).
- The real logs use bullets today: 27 Nov reads 2.50 MB, 25 Nov 9.00 MB, 21 Nov 97.40 MB.
- Fix: treat any line with a size figure and a date anywhere in it as an error unless it is a bullet the parser reads. Add `bytes` and a bare `M` after a number.

### N-7. Minor wording and counters

- "unload beacons stopped" in the log line counts every non-GET fetch to a Webflow host stopped by the init script while the page is alive. At a real unload the binding is gone, so it stays 0. In N3, 0 was counted while 10 unload requests were stopped.
- A trip at a cap that refuses the first response says "reached 0.00 MB from Webflow, the run cap is X MB". Seen in N7, wf-get W5 and crash "trip-default". The stop is right. The wording suggests the cap was used.

### N-8. Notes, no action needed

- unrouteAll race (runs/n7.txt N2r): a page asked for Webflow URLs every millisecond while the caller ran `unrouteAll()` and `unroute('**/*')` 40 times. 0 HTTP requests reached the Webflow stub. Chromium opened 12 TCP connections to it with no request. On HTTPS that would be TLS handshakes only.
- WebSocket to a Webflow host opens a TCP connection (documented gap).
- In this Chromium, the 25 Nov S3 variant with `serviceWorkers: 'block'` still hangs for about 400 s with or without the guard (runs/main-block.txt). It was skipped in the cache-only run. This is the same environment issue as on 25 Nov.

## Other checks

- Real sweep cache (scratchpad nov21/sweep-cache): all 246 `assets/*.json` files are named `sha1(u)`. 36 of them keep `%2F` in `u`, as the page HTML does. The 36 pages in `html/` match `fileFor()`. So cache-only can use that folder as is.
- The commit carries both trailer lines. I found no em dashes and no exclamation marks in the added prose.
- The 25 Nov BANDWIDTH-LOG merge kept both sides. handoff/WEBFLOW-LOCK.md is unchanged against claude/new-session-zxm063.

## Recommendation

- cache-only is ready. The "Proposed rule" in tools/WF-GUARD.md can go into handoff/WEBFLOW-LOCK.md for cache-only runs.
- Fix N-1 and N-2 before a harness relies on fetch-once or block mode. N-3 to N-7 are small.

## Environment

```sh
export PATH=<scripts dir with curl-wrapper.sh installed as curl>:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/tmp
```

## Files

- Scripts: reports/evidence/bw-guard-fix-2026-11-27/scripts/. main2.cjs, crash.cjs and wfget.cjs are the 25 Nov scripts adapted to the new modes. The others are new.
- Output: reports/evidence/bw-guard-fix-2026-11-27/runs/.
