# Independent check: Webflow bandwidth guard (tools/wf-guard.cjs, tools/wf-get.cjs)

- Checked: branch claude/bw-guard-2026-11-25, commit d0f8934c3efe94a47f5cb75d045fd7dee5728108 (parent a997980).
- Date: 25 Nov 2026, label bw-guard-check.
- Verdict: **PASS WITH NOTES**. The main path works. The guard blocks Webflow images, video and fonts on the four host families, counts finished responses in wire bytes, stops a run at its cap and writes its log line (also on a crash). But four of the builder's claims are too strong: "every non-GET aborted", "counts every byte", the daily cap across runs, and the description of routes registered before guard(). There is also one crash bug. Fix items 1 to 3 below before the first live run.
- Webflow traffic for this check: 0 page loads, 0 MB from Webflow (M). Every browser run mapped every host name to a stub on 127.0.0.1 (`--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost`, `--no-proxy-server`, proxy variables unset). Node-side `route.fetch` was also mapped to 127.0.0.1 by a preload (scripts/dnsmap.cjs). One exception happened before that preload existed: in the first run, a `route.fetch` started in Node tried to connect to cdn.prod.website-files.com on a random local port. It failed at once (no proxy, no route, AggregateError) and received 0 bytes. One Chromium at a time; none left running.

## What I ran

| Run | Result |
| --- | --- |
| Builder's tests: `NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` | 17 of 17 pass (2.2 s); the real handoff/BANDWIDTH-LOG.md is untouched afterward |
| `npx vitest run` on d0f8934 | 849 of 849 pass, 72 files (tools/test is excluded, as stated) |
| `node --test worker/test/*.test.js` | 83 of 83 pass |
| Break-it scenarios S0 to S10 (scripts/main.cjs) | runs/main.txt |
| Follow-ups E1 to E6 (scripts/extra.cjs) | runs/extra.txt |
| Crash before close, 10 ways (scripts/crash.cjs, crash-child.cjs) | runs/crash.txt, runs/crash2.txt |
| wf-get W1 to W10 (scripts/wfget.cjs, curl forced to the stub with `--noproxy '*' --connect-to ::127.0.0.1:PORT`) | runs/wfget.txt |

Playwright 1.63.0, HeadlessChrome 157, Node 22.23.5.

## Claims that hold

- Host spellings (S1, block mode, the real host list). All of these were blocked: uppercase www and apex, the apex itself, `cdn.prod.website-files.com` and its uppercase form, `assets-global.website-files.com`, a deep subdomain `a.b.c.website-files.com`, `that-layover-life.webflow.io` and its uppercase form, an uppercase `.JPG` extension, a percent-encoded extension on an `<img>`, an extensionless `<img>` URL, and a CSS background image. `new URL()` lowercases the host, so uppercase is never a problem.
- Same-host redirect (S2). A Webflow page path that 302s to a Webflow image is blocked.
- Service workers (S3). With Playwright 1.63, requests made by a service worker go through `context.route`. Its install-time Webflow image was blocked, its POST and PUT were aborted, a page image fetched through the worker was blocked, and a 500 KB Webflow script it fetched was counted (500,197 bytes). The builder's "limits" note says service worker requests are not counted. That is too pessimistic for this Playwright version.
- Range requests (S4).
  - Block mode aborts `<video>` from Webflow, with or without an extension, and a `fetch()` with a Range header to a `.mp4`.
  - A Range request to a non-media Webflow file is counted at what the server sent (800,197 bytes counted against 800,000 sent).
  - Cache mode drops the Range header, fetches the whole file once, serves both `<video>` elements and a reload from the copy, and makes 0 further fetches.
- Caller route tricks (S10). `route.fallback({url})` and `route.continue({url})` that rewrite to a Webflow image are still blocked, and so is `page.goto()` straight to a Webflow image.
- Non-GET while the page is alive (S9). POST, PUT, HEAD, DELETE (XHR), PATCH to another host, a form POST submit and `navigator.sendBeacon` were all aborted. A ping from `<a ping>` never reached the stub.
- Run cap on finished responses (S5 polling). The run tripped at 1.00 MB with a 1 MB cap, wrote "STOPPED at the run cap", closed the context and stopped further requests.
- Daily cap, runs one after the other (S8). The second run tripped on the day cap, and a third run was refused at start.
- Log line on crash (crash.txt). A line was written for each of these:
  - an uncaught exception
  - an unhandled rejection
  - `process.exit(1)`
  - SIGTERM and SIGINT with Playwright's default signal handlers (exit 0 and 130)
  - a Chromium crash followed by a normal end
  - a normal end without `close()`
- gzip counting in wf-get (W1). It counted 726 bytes (521 compressed body plus headers) for a page that decodes to 240,007 bytes, so the figure really is wire bytes.
- Redirect chains in wf-get (W7). A Webflow-to-Webflow chain was counted (200,411 bytes counted against 200,000 sent).
- Log parser on the real log: 25 Nov comes to 9.00 MB and 21 Nov to 97.40 MB, matching the builder's figures and my own sums.
- The other changes are as described. The lock line is new and inserted under the 13 Nov STANDING RULE with no old line edited. There is one 0 MB log line. The commit ends with both trailer lines. I found no em dashes, exclamation marks or banned words in the added text.

## Holes, most serious first

1. **A failed network fetch crashes the harness (cache mode, and any caller `route.fetch`).**
   - `track(p)` calls `p.finally(...)` and drops the promise that returns. When `p` rejects, that derived promise rejects with no handler.
   - On Node 22 this is an unhandled rejection, which ends the process, even though `fromCache` and the caller both catch the original error.
   - Reproduced twice. S6: a dropped connection on a first cache fetch gave "UNHANDLED REJECTION route.fetch: socket hang up", and the run without a handler died. E4: the caller caught the `route.fetch` error itself, and the guard still raised an unhandled rejection.
   - The builder's "first fetch failed" test passes only because its failure is not a thrown network error.
   - Fix: `p.finally(...).catch(() => {})`, or `p.then(done, done)`.
2. **Context routes registered before guard() are shadowed, not slipped (E1).**
   - The guard's handler ends with `route.continue()`. A context route registered earlier (for example one that serves saved HTML) never runs: the request went to the server and the local route ran 0 times.
   - Any harness that sets up its cache routes and then calls guard() silently loads all Webflow HTML, CSS and JS from the network. It is counted and capped, but it is the bandwidth the cache was meant to save.
   - The existing sweep harness (check-3 ab.cjs, "abort any cache miss") would lose its cache-only behavior this way.
   - Page routes registered before guard() do slip past it, as documented: a page route that called `continue()` let a Webflow image through (E2, E3, also with guard(page)).
   - Fix: use `route.fallback()` instead of `route.continue()` in the guard's handler (both places). Earlier routes then still get their turn after the guard has decided. Correct tools/WF-GUARD.md to match.
3. **Non-GET during page unload is not aborted (S9, E5).**
   - These reached the stub:
     - `sendBeacon` and `fetch(..., {keepalive: true, method: 'POST'})` sent from `pagehide` or `visibilitychange`, both on navigation away and on `page.close()`
     - a keepalive POST to a Webflow host name
   - Chromium sends these after the frame is gone, outside request interception.
   - The live inline code I could see does not do this: the /the-map snapshot POST with keepalive fires 1.5 s after a member save, while the page is alive, so it is routed and aborted. Third-party analytics (GTM, ahrefs) can still beacon at unload.
   - `page.request` and `context.request` POSTs are not watched either. This is documented and was confirmed: POST /s9-apirequest reached the stub.
   - Fix: a `context.addInitScript` that turns `navigator.sendBeacon` into a no-op returning true and rejects non-GET `fetch` and XHR in the page. Keep the route abort as the second line.
4. **Bytes of responses that never finish are not counted, and the cap cannot fire during one response (S5).**
   - Counting happens only on `requestfinished`. `requestfailed` adds 0 bytes.
   - An endless Webflow script streamed 4.99 MB in 4 s with a 1 MB run cap. The guard counted 0, never tripped, and the closing log line said 0.00 MB.
   - The same applies to a large download cut off by `context.close()`.
   - Fix: count `requestfailed` with `request.sizes()` where it resolves, or track bytes through a CDP session (`Network.dataReceived`), and treat a response over a size limit as a trip.
5. **On a trip, the log line is written before counts in flight settle (S5 polling).** The log says 1.00 MB (5 responses), while the stub sent 1.40 MB (7 responses). The 2 responses in flight at the trip were cut off when the contexts closed and were never counted (see item 4). Fix: write the line after `Promise.allSettled(run.pending)` in `trip`, as `closeAsync` already does.
6. **Redirects from a non-Webflow host into a Webflow host are neither blocked nor counted (S2).**
   - Chromium does not route redirect hops, and `passedChain` only counts chains that started on a Webflow host. Confirmed:
     - a localhost image and an `img.example.org` image that 302 to a Webflow image both reached the server
     - a 300 KB Webflow script reached through a localhost redirect counted 0
     - a navigation through a redirect added 0 bytes
     - a caller `route.fetch` of a non-Webflow URL redirecting to a Webflow image fetched it, uncounted and unblocked
   - The same applies to wf-get (W2: 300 KB uncounted; W3: a Webflow page path that redirects to an image downloads the image).
   - Live exposure looks small: nothing in the saved live HTML or worker/src redirects into website-files.com.
   - Fix: in `requestfinished`, also count any request whose own URL is a Webflow URL, and check `response.url()` in `guardedFetch`. For wf-get, use `%{url_effective}` and refuse redirects to media with `--max-redirs 0`, following redirects by hand.
7. **The daily cap does not hold across runs at the same time (S8).**
   - Each run reads the log at start (and every 10 s), but a run's own bytes reach the log only when it closes. Two concurrent runs with a 1 MB day cap each took 0.6 MB, neither tripped, and the day ended at 1.20 MB.
   - The default log is also per checkout (handoff/BANDWIDTH-LOG.md next to the tool), so parallel worktrees do not see each other unless `WF_GUARD_LOG` points at one file. The builder notes this, but the default is the unsafe choice.
   - Fix: a shared running-tally file (append "label +bytes" as counted, read it with the log), and a default log path outside the worktree.
8. **guard(page): after the page closes, later traffic in the same context is not logged (S6c).** The line said 0.10 MB, then 400 KB more loaded through a new page of the same context (the guard showed 0.50 MB) and never reached the log. Fix: keep the run open until the context closes, or stop guarding when the page closes.
9. **"Each URL at most once ever" is per guard, not per cache folder (S6).**
   - With two contexts sharing one cache folder and one run, the same image requested at the same time was fetched upstream twice.
   - A URL whose first fetch failed in context A was fetched again by context B, which was guarded before the failure. Only a context guarded after it (C) was refused.
   - `ever` and `inflight` live inside each `guard()` call and are loaded once from wf-guard-fetched.txt.
   - Fix: one cache object per folder (a module-level map), and re-check the fetched list before each fetch.
10. **Host names the matcher misses (S1, W6).**
    - A trailing dot (`www.thatlayover.life.`, `cdn.prod.website-files.com.`) is a valid name that `new URL()` keeps. It passed and was not counted.
    - Other subdomains of the site (`cdn.thatlayover.life`) and `*.webflow.com` (for example `uploads-ssl.webflow.com`, Webflow's older asset host) are not matched. None of these appear in the saved live HTML today (webflow.com appears only in a comment).
    - Fix: strip a trailing dot before matching; match `(^|\.)thatlayover\.life$` and `(^|\.)webflow\.com$`. The d3e54v103j8qbb.cloudfront.net jQuery gap is documented.
11. **Media check by extension misses some fetch() and XHR loads (S1).** A Webflow image fetched with `fetch()` from an extensionless URL, or with a percent-encoded extension (`a%2Epng`), passed as non-media and was counted, not blocked. `<img>` loads are fine because of the resource type. Fix: decode the pathname before the extension test, and in `requestfinished` treat an `image/`, `video/`, `audio/` or `font/` content type from a Webflow host as a violation to report.
12. **Signals without Playwright's handlers, and SIGKILL, write no line (crash.txt).**
    - With `handleSIGTERM: false` or `handleSIGINT: false` the process died on the signal with no log line. SIGKILL also writes none, which cannot be avoided.
    - With the defaults, Playwright closes the browser, and the line is written.
    - Fix: write a provisional "started" line at guard() time and replace or complete it on close, or add `process.once('SIGTERM'/'SIGINT')` handlers that close open runs.
13. **The log parser errs low on formats it does not know.**
    - The docs say it "errs on the high side on purpose", but these lines count 0 MB:
      - a full month name ("25 November")
      - month first ("Nov 25")
      - a bold date ("**25 Nov**")
      - a `*` bullet
      - "megabytes"
      - "25-11-2026"
      - a range across the new year ("28 Dec to 2 Jan", on either day)
    - A guard line with a figure added by hand ("1.00 MB from Webflow (M); later 300 MB by hand") counts only 1 MB.
    - The real log uses the recognized form today, so this matters only for future hand-written lines.
    - Fix: warn (stderr) on any "- " line with an MB figure whose date is not recognized, and count it toward today's total.
14. **wf-get: one GET can blow through the cap (W5).**
    - The run cap is checked only between URLs. With a 1 MB cap, a 3 MB file was downloaded in full before the stop. `--max-time 60` lets one endless response stream for a minute.
    - An extensionless Webflow image URL is downloaded (W4). `--max` has no default, while this session's rule allows at most 30 plain HTML GETs.
    - Fix: `--max-filesize` set to the remaining budget, a `content-type` check (`-w %{content_type}`), and a default `--max 30`.
15. **No cache-only mode.** This session's rule for browser runs is "cached assets only, abort any cache miss". Cache mode fetches each miss from Webflow once. A `mode: 'cache-only'` (serve hits, abort misses, count 0) would let ab.cjs move onto the guard without weakening that rule.
16. Minor points.
    - "page loads" in the log line counts every top-level navigation, including localhost and other hosts (S9 reported 5 page loads, all on localhost), so it is not a Webflow page-load count.
    - The guard handler's `catch {}` swallows every error, not only the closed-page case, which can leave a request stalled.
    - In cache mode the first fetch of a large video downloads the whole file, because the Range header is dropped.

## Environment note (not a guard defect)

In this Chromium, once a context that had registered a service worker was closed, a new context on the same origin with `serviceWorkers: 'block'` hung or reported the page closed. This happened with or without the guard (scripts/swcrash.cjs, "noguard" and "guard" both hung), so it is not counted against the tool. Run S3's second half failed for this reason only.

## Files

- Scripts: reports/evidence/bw-guard-2026-11-25/scripts/ (stub.cjs is the local stub; dnsmap.cjs maps Node-side lookups to 127.0.0.1; run with `node -r ./dnsmap.cjs main.cjs <worktree of d0f8934>`).
- Output: reports/evidence/bw-guard-2026-11-25/runs/.
