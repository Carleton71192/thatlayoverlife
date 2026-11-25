# wf-guard and wf-get: Webflow bandwidth guard for test harnesses

Every new harness that loads Webflow pages (www.thatlayover.life, the apex, that-layover-life.webflow.io, *.website-files.com) uses these two tools. Rules: reports/bandwidth-2026-11-13.md section 4 (rules 1 to 6), reports/bandwidth-2026-11-25.md fix 1, and the 13 Nov STANDING RULE in handoff/WEBFLOW-LOCK.md.

## Browser runs: tools/wf-guard.cjs

```js
const { guard } = require('/path/to/repo/tools/wf-guard.cjs');
const context = await browser.newContext();
const g = guard(context, { label: 'asia-cls-check', mode: 'block' });  // FIRST, before any route of your own
// ... your own context.route / page.route handlers, page loads, checks ...
await context.close();   // appends one line to handoff/BANDWIDTH-LOG.md
```

What it does:

- **Images, video and fonts from Webflow hosts**: `mode: 'block'` (default) aborts them. `mode: 'cache'` serves them from `cacheDir` (or `WF_GUARD_CACHE`) and sends each URL to the network at most once ever, even if that first fetch failed. The folder layout is the one in scratchpad nov21/sweep-cache/assets (`<sha1(url)>.b` and `.json`), so that cache can be used as is; its asset-index.txt counts as already fetched.
- **Counts every byte from Webflow hosts**: wire bytes (body plus headers) for browser requests, body plus headers for fetches. HTML, CSS and scripts still load from the network; serve them from saved copies in your own routes when you can (rule 3).
- **Caps**: the run stops at 200 MB, or when the UTC day's total in handoff/BANDWIDTH-LOG.md plus this run reaches 250 MB. guard() throws at once if the day is already at the cap. On a trip the log line is written (marked STOPPED), the contexts are closed and, by default, an uncaught `WfBudgetError` ends the process. `onTrip: 'close'` only closes; `onTrip: fn` calls `fn(err)`. `g.check()` throws once tripped.
- **Every non-GET request to any host is aborted** (form posts, Memberstack writes, beacons).
- **One log line on close** of the context (or the page, if you passed a page). It reads like `- 25 Nov 14:05 UTC, <label>: wf-guard block run, 12 page loads, 30 Webflow responses, 1.25 MB from Webflow (M); aborted 40 Webflow images, video or fonts and 2 non-GET requests`.

Your own routes: register them after guard(). The guard wraps them, so `route.continue()` passes on to the guard (it acts as `route.fallback()`), `route.fulfill()` from a local copy costs nothing, and `route.fetch()` is counted (and refused for non-GET, or for Webflow media in block mode). Routes registered before guard() are not wrapped and can slip past it.

Many contexts in one run (one tally, one log line):

```js
const { guard, createRun } = require('.../tools/wf-guard.cjs');
const run = createRun({ label: 'sweep-check', mode: 'cache' });
for (const job of jobs) { const ctx = await browser.newContext(); guard(ctx, { run, mode: 'cache', cacheDir }); /* ... */ await ctx.close(); }
run.close();   // or it is written when the process exits
```

Options: `label` (required; a task name, never a member's name), `mode`, `cacheDir`, `run`, `logFile` (or `WF_GUARD_LOG`; default handoff/BANDWIDTH-LOG.md of the checkout the tool sits in), `runCapMB` (200), `dayCapMB` (250), `onTrip`, `hosts` (replaces the Webflow host list; tests only). `g.stats()` gives the counts so far.

Playwright is not a dependency: pass your own context or page. Here it resolves with `NODE_PATH=/opt/node22/lib/node_modules`.

## Plain HTML GETs: tools/wf-get.cjs

```sh
node tools/wf-get.cjs --label carry-check --out /tmp/.../html --max 30 https://www.thatlayover.life/ https://www.thatlayover.life/stories
node tools/wf-get.cjs --label carry-check --out /tmp/.../html --list urls.txt
```

GET only, through curl with `--compressed` (so the bytes counted are the bytes on the wire). Refuses image, video and font URLs. Saves each page as `<path with / as __>.html` (home is home.html). Stops before the next URL at the run cap, the daily cap or `--max`. Appends one line (`... wf-get plain GETs, 24 GETs (1 not 200), 3.10 MB from Webflow (M)`). Exit 0 done, 3 stopped by a cap, 2 bad arguments. From code: `await require('./tools/wf-get.cjs').wfGet(urls, { label, out, max })`.

## The daily total

`node tools/wf-guard.cjs day [YYYY-MM-DD]` prints the day's total from the log. A line counts for each day its leading date or range covers (`25 Nov`, `21 to 22 Nov`, `2026-11-25`). Lines from these tools count their `MB from Webflow (M)` figure; other lines count all their MB, KB and GB figures, taking the upper end of a range. That errs on the high side on purpose. Several worktrees each have their own copy of the log: point `WF_GUARD_LOG` at one shared copy when runs happen in parallel, and copy the lines into the branch you push.

## Tests

`NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs` (a stub server on this machine stands in for Webflow; no Webflow traffic).
