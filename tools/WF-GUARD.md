# wf-guard and wf-get: Webflow bandwidth guard for test harnesses

These two tools keep test harnesses off Webflow's bandwidth. The Webflow hosts are www.thatlayover.life, the apex and every other thatlayover.life subdomain, *.webflow.io, *.webflow.com and *.website-files.com. A trailing dot (`www.thatlayover.life.`) counts as the same host. Rules: reports/bandwidth-2026-11-13.md section 4 (rules 1 to 6), reports/bandwidth-2026-11-25.md fix 1, and the 13 Nov STANDING RULE in handoff/WEBFLOW-LOCK.md. This version fixes the findings in reports/evidence/bw-guard-2026-11-25/check.md and the guard section (G1 to G4) of reports/evidence/keep-going-2026-11-25/review.md.

## Browser runs: tools/wf-guard.cjs

```js
const { guard } = require('/path/to/repo/tools/wf-guard.cjs');
const context = await browser.newContext();
const g = guard(context, { label: 'asia-cls-check', cacheDir, htmlDir });   // mode 'cache-only' is the default
await g.ready;                                                              // before the first page load
// ... your own context.route / page.route handlers (before or after guard()), page loads, checks ...
await context.close();   // appends one line to handoff/BANDWIDTH-LOG.md
```

The browser never talks to a Webflow host itself. Every Webflow GET ends at the guard's own route. That route has the last word: it runs after every route of yours, whether you registered it before or after guard().

### Modes

| Mode | Webflow HTML, CSS, JS | Webflow images | Webflow video and fonts | Network |
| --- | --- | --- | --- | --- |
| `cache-only` (default) | from the cache | from the cache | from the cache | never; a miss is aborted, counted and listed |
| `fetch-once` (opt in) | fetched once, stored | fetched once, stored | aborted, unless `allowVideo` or `allowFonts` | each URL at most once, ever |
| `block` | fetched every time | aborted | aborted | every load; Chromium's HTTP cache is off with routes, so this costs repeat fetches |

- **cache-only** answers from `cacheDir` (or `WF_GUARD_CACHE`) and from `htmlDir`. A Webflow GET with no copy is aborted. It is counted in the log line and listed in `g.stats().missList`. Nothing is ever fetched. This is the mode for harnesses like reports/evidence/sweep-2026-11-21/check-3/bin/ab.cjs, which serve everything from the sweep cache. A run in this mode costs 0 MB.
- **fetch-once** fetches a miss with curl, stores it in `cacheDir` and serves the copy from then on. Before the fetch it creates `<sha1>.claim` in the cache folder with an exclusive create. So two contexts, or two processes, never fetch the same URL, and a URL whose one fetch failed is never fetched again. Video and fonts from Webflow are aborted unless you pass `allowVideo: true` or `allowFonts: true`. Allowed video goes in pieces: a request without a Range header is refused, and an open range such as `bytes=0-` is cut to `videoChunkMB` (default 1 MB). The 206 answer says which bytes it holds, and the player asks for the next piece. Each piece is stored under its URL and range.
- **block** aborts Webflow images, video and fonts, and fetches the rest with curl on every load. It is no longer the default, because it pays for the same CSS and JS on every page load.
- In every mode a cache hit is served first, and a Range request is answered from a whole cached copy by slicing it (206). The Range header is never dropped.

The cache layout is the one in scratchpad nov21/sweep-cache/assets (`<sha1(url)>.b` and `.json`), so that folder works as is. Its asset-index.txt, and the guard's own wf-guard-fetched.txt, count as already fetched. `htmlDir` holds pages saved by wf-get (`<path with / as __>.html`, home.html for the root). The guard serves them for Webflow page loads, fetch and XHR in every mode. `wf-get --cache <dir>` also stores pages in the cache layout.

### Counting and caps

- The guard fetches Webflow GETs itself with curl (`--compressed`), so the bytes it counts are the bytes on the wire, body plus headers.
- Before each fetch it reserves what may be used: at most `getCapMB` (default 5), and never more than is left of the run cap (200 MB) or the daily cap (250 MB). curl stops the transfer at that size (`--max-filesize`). So one response cannot run past a cap. A response cut at a cap stops the run. A response cut at `getCapMB` is refused and counted as over the size limit.
- A response that never finishes is cut at `fetchTimeoutS` (default 30). Its bytes so far are counted, and it is counted as unfinished. When a run stops or closes, fetches still running are stopped and their bytes so far are counted before the log line is written.
- A trip writes the log line (marked STOPPED), closes the contexts and, by default, ends the process with an uncaught `WfBudgetError`. `onTrip: 'close'` only closes. `onTrip: fn` calls `fn(err)`. `g.check()` throws once tripped.

### The daily total, shared between runs

- The daily total is the sum of three things: the shared log in the main checkout (found from the git repository the tool sits in), the log of this checkout (lines in both count once), and a running tally.
- The tally is `tally-YYYY-MM-DD.json` in `<main checkout>/.git/wf-guard/`. Every worktree of the repository shares that folder. Each run writes its bytes and open reservations there under a lock file (`lock`, exclusive create, taken as stale after 10 s). So two runs at once, in one process or in two, see each other's bytes at once and cannot both pass the cap.
- Log lines written by the tools carry their run id (`run 3fa9c2`). A line whose run id is in the tally is not counted twice. Reservations of a process that has ended do not count.
- Overrides: `WF_GUARD_LOG` (the log written to), `WF_GUARD_MAIN_LOG` (`none` to skip the main checkout log), `WF_GUARD_STATE` (the tally folder). The tests use all three.

`node tools/wf-guard.cjs day [YYYY-MM-DD]` prints the day's total from the logs and the tally.

The log parser reads a bullet line (`-`, `*` or `+`, indented or not) that starts with a date in any of these forms: `25 Nov`, `25 November 2026`, `Nov 25`, `November 25, 2026`, `**25 Nov**`, `21 to 22 Nov`, `21-22 Nov`, `20 Oct to 19 Nov`, `28 Dec to 2 Jan` (across the new year), `2026-11-25`, `25-11-2026`, `25/11/2026`. The size is the sum of every KB, MB, GB, KiB, MiB, GiB, kilobyte, megabyte and gigabyte figure in the line, taking the upper end of a range (`5 to 57 MB` is 57). A bullet line with a size figure and no date it can read is an error, never 0: a new run refuses to start and names the line. During a run the last good total is kept and a warning is printed.

### Non-GET requests, unload beacons and page.request

- Every non-GET request to any host that reaches a route is aborted (form posts, Memberstack writes, XHR).
- Chromium sends `sendBeacon` and `fetch(..., {keepalive: true})` from `pagehide` or `visibilitychange` after the frame is gone, where no route sees them. So the guard adds an init script that makes `navigator.sendBeacon` and every non-GET `fetch()` to a Webflow host do nothing (the beacon returns true, the fetch rejects). `unloadNonGet: 'all'` does the same for every host. The init script runs in every frame of pages loaded after guard(). A page already open when guard() is called gets it on its next load.
- `context.request` and `page.request` (the same object) do not go through routes. The guard wraps them: a non-GET request throws, a Webflow GET is answered like a browser GET (from the cache, fetched once, or refused), and a redirect is followed one hop at a time through the guard.

### Your own routes

Register them before or after guard(); both work.

- The guard wraps every route handler of the context and of its pages, including those registered before guard() (it reaches them through Playwright's `_routes` list). In a wrapped handler, `route.continue()` acts as `route.fallback()`, so the request goes on to the next route and finally to the guard.
- `route.fulfill()` from a local copy costs nothing and is not counted.
- `route.fetch()` goes through the guard: non-GET throws, a Webflow URL is answered from the cache or fetched under the mode's rules, and redirects are followed one hop at a time. `route.fulfill({ response })` accepts what it returns.
- The guard's own handler ends with `route.fallback()` for anything it lets through. `g.lastWord()` is true when the guard sits at the end of the route list. If a future Playwright drops `_routes`, it is false: routes registered before guard() then run after the guard's decision, and their `continue()` is not wrapped.
- `context.unrouteAll()` and `context.unroute('**/*')` keep the guard in place.

### Redirects

- Chromium does not route the next hop of a redirect, not even one answered with `route.fulfill()`. So the guard follows redirects itself, one hop at a time, and gives the browser the last answer. Every Webflow hop goes through the mode's rules. A redirect from another host into a Webflow host is blocked or served from the cache like any Webflow GET.
- With the default `strictRedirects: true` the guard also fetches non-Webflow GETs itself (`route.fetch` with `maxRedirects: 0`), so that it sees their redirects. Responses from other hosts are then buffered, not streamed.
- A page load that was redirected keeps its first URL in the address bar, because the browser gets the final answer for the first request. Load the final URL when that matters.
- `strictRedirects: false` lets non-Webflow requests go straight to the network. A redirect from there into a Webflow host then reaches Webflow. The guard cannot stop it, but it counts it and its bytes, and the log line says how many reached Webflow past the guard.

### The log line

One line on close of the context (also when you passed a page, and also after that page closed):

`- 27 Nov 14:05 UTC, <label>: wf-guard cache-only run 3fa9c2, 12 page loads, 0 Webflow GETs, 0.00 MB from Webflow (M); 640 served from the cache, 3 cache misses aborted, 0 images, video or fonts aborted, 2 non-GET requests aborted`

Page loads are main-frame Webflow pages answered, from the cache or the network. Extra counts are added when they are not 0: unfinished responses, responses that reached Webflow past the guard, unload beacons stopped, URLs refused as fetched before, responses over the size limit, and STOPPED at a cap.

### Options

`label` (required; a task name, never a member's name), `mode`, `cacheDir`, `htmlDir`, `allowVideo`, `allowFonts`, `videoChunkMB` (1), `unloadNonGet` (`'webflow'` or `'all'`), `strictRedirects` (true), `run`, `logFile`, `readLogs`, `stateDir`, `runCapMB` (200), `dayCapMB` (250), `getCapMB` (5), `fetchTimeoutS` (30), `onTrip`, `hosts` (replaces the Webflow host list; tests only), `curlArgs` (tests only). `g.stats()` gives the counts so far.

Many contexts in one run (one tally, one log line):

```js
const { guard, createRun } = require('.../tools/wf-guard.cjs');
const run = createRun({ label: 'sweep-check', mode: 'cache-only' });
for (const job of jobs) { const ctx = await browser.newContext(); await guard(ctx, { run, cacheDir, htmlDir }).ready; /* ... */ await ctx.close(); }
run.close();   // or it is written when the process exits
```

Moving a harness like ab.cjs onto the guard: call `guard(ctx, { label, cacheDir: <sweep-cache/assets>, htmlDir: <sweep-cache/html> })` and keep its own route. Its saved-HTML answers and cache answers are fulfilled before the guard sees them, its `continue()` now ends at the guard, and every Webflow miss is aborted instead of reaching the network.

Playwright is not a dependency: pass your own context or page. Here it resolves with `NODE_PATH=/opt/node22/lib/node_modules`. curl must be on the PATH; it uses the session proxy like any other command.

### What the guard cannot catch

- A `fetch(..., {keepalive: true})` from a web worker or service worker at unload (the init script runs in pages and frames only).
- WebSocket traffic, and `routeFromHAR` answers.
- A process killed with SIGKILL, or one that dies on SIGTERM or SIGINT with Playwright's signal handlers turned off, writes no log line. Its tally entry still holds the bytes counted so far.
- d3e54v103j8qbb.cloudfront.net (Webflow's jQuery copy) is not in the host list. It is not billed to the site plan. Pass your own `hosts` list if you want it caught.

## Plain HTML GETs: tools/wf-get.cjs

```sh
node tools/wf-get.cjs --label carry-check https://www.thatlayover.life/ https://www.thatlayover.life/stories
node tools/wf-get.cjs --label carry-check --list urls.txt --cache /path/to/assets
```

- GET only, through curl with `--compressed`, so the bytes counted are the bytes on the wire.
- Pages are saved to `wf-get-out/<label>/` in the root of the checkout the script sits in (ignored by git), whatever the current folder is. `--out` sets another folder. The log line goes to handoff/BANDWIDTH-LOG.md of the same checkout. Both paths are fixed by the script's own location.
- At most `--max` GETs (default 30; each redirect hop is a GET). At most `--max-filesize` MB per GET (default 5; curl stops the transfer there). Never more than is left of the run cap or the shared daily cap.
- Redirects are followed by hand, at most 5 hops. Image, video and font URLs are refused before any request, a redirect to one is refused before it is fetched, and a response with an image, video or font content type is refused after the GET and not saved.
- Exit 0 done, 3 stopped by a cap, 2 bad arguments. One log line: `... wf-get run 3fa9c2, 24 GETs (1 not 200), 3.10 MB from Webflow (M)`.
- From code: `await require('./tools/wf-get.cjs').wfGet(urls, { label, out, max, maxFileMB, cache })`.

## Tests

`NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs`. A stub server on 127.0.0.1 stands in for Webflow. Chromium maps every host name to 127.0.0.1, and every curl call gets `--noproxy '*' --connect-to ::127.0.0.1:`, so no request leaves the machine. The tests check at the end that the real logs and the real tally folder are untouched. vitest skips tools/test/.

## Proposed rule

This text is proposed for handoff/WEBFLOW-LOCK.md, as a sub-line under the 13 Nov STANDING RULE. It is not in the lock file yet. Add it only after an independent check of this version passes.

> Added <date>, bandwidth guard (tools/wf-guard.cjs, tools/wf-get.cjs, checked in <evidence path>): every new harness that loads Webflow pages calls guard() from tools/wf-guard.cjs on each browser context, in mode cache-only (the default) unless a task needs new copies, and then in mode fetch-once. Plain HTML GETs go through tools/wf-get.cjs (at most 30 a run). Mode block is for short runs only. Both tools count Webflow bytes on the wire, stop a run at 200 MB or at 250 MB for the UTC day (shared by every run on this machine), abort every non-GET request, and append one line to handoff/BANDWIDTH-LOG.md. Usage: tools/WF-GUARD.md.
