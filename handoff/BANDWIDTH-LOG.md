# Webflow bandwidth log (all sessions and scheduled tasks)

One line per run that touches a Webflow host (www.thatlayover.life, the apex, that-layover-life.webflow.io, website-files.com): date (UTC), session or task, what ran, page loads, Webflow MB (M measured or E estimate). Budget: 250 MB a day, 5 GB a month, 200 MB a run. Rules: reports/bandwidth-2026-11-13.md section 4 and the 13 Nov STANDING RULE in handoff/WEBFLOW-LOCK.md. Background: reports/bandwidth-2026-11-25.md.

## Period from about 20 Nov 2026 (backfilled 25 Nov from evidence)
- 21 Nov, rl169 sweep debug pass: 191 photos fetched once into a cache, 25.4 MB (M, rule 1 break); 302 status GETs, 5 to 57 MB (E, uncounted at the time)
- 21 to 22 Nov, rl169 sweep checks (check, verify-1, check-2, check-3, build): 0 MB from Webflow (M, cached assets)
- 21 to 22 Nov, rl169 plain GETs for the /submit and 16.69.0 releases: about 60 HTML pages, about 10 MB (E)
- 22 Nov 22:10, scheduled Sunday Night Audit (PageSpeed on thatlayover.life): 5 to 20 MB (E, not logged by the task)
- 20 to 25 Nov, scheduled TLL daily submissions report: 0 to 5 MB a day (E, not logged by the task)
- 25 Nov, rl169 16.69.0 live check: 24 HTML GETs, about 4 MB (E); bandwidth audit: about 0 MB (M, saved HTML only)
- 25 Nov, bw-guard: built tools/wf-guard.cjs and tools/wf-get.cjs, tests against a stub server on this machine only, 0 page loads, 0 MB from Webflow (M)
- 25 Nov, asia-cls-check (independent check of 2c51cda): 362 browser page loads from cached pages and assets, 0 HTML GETs, 0 MB from Webflow (M)
- 25 Nov, bw-guard-check: independent check of the bandwidth guard (d0f8934) against a stub on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, classb-check (independent check of the class B drafts): 3 HTML GETs, 0.6 MB (M); 126 browser page loads from cached pages and assets, 0 MB from Webflow (M)
- 27 Nov, keep-going review (adversarial review of the asia, classb and guard tracks): 0 page loads, 0 HTML GETs, 0 MB from Webflow (M); one Chromium run against a local stub on 127.0.0.1 only
- 25 Nov, asia-cls (?place=Asia lead-mark wait, branch claude/asia-cls-2026-11-25): 0 page loads, 0 MB from Webflow (M, saved page code and unit tests only)
- 27 Nov, classb page code drafts: 0 page loads, 0 MB from Webflow hosts (M; Webflow MCP API reads only, saved HTML of 21 and 25 Nov)
- 27 Nov, rl170 test-site release: 28 HTML GETs from Webflow hosts, about 1.9 MB (M); no images, no browser
- 27 Nov, bw-guard-fix-check (independent check of cdeb7a4): tests and probes against stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, bw-guard-fix (branch claude/bw-guard-fix-2026-11-27): fixed tools/wf-guard.cjs and tools/wf-get.cjs, tests against a stub server on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, bw-guard-fix2 (branch claude/bw-guard-fix2-2026-11-27): N-1 to N-7, tests against stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, bw-guard-fix2-check-repro: stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, bw-guard-fix2-check-adversary: stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, bw-guard-fix3 (branch claude/bw-guard-fix2-2026-11-27): R-1, A-1 to A-7, R-3 to R-5, tests against stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, bw-guard-fix3-check-adversary: stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
- 27 Nov, rl170 www publish check: 44 HTML GETs from Webflow hosts, about 8.4 MB (M); no images, no browser
- 27 Nov, correction to the rl170 www publish check line above (first round plus re-fetch were under-added): add 0.3 MB (M)
- 27 Nov, rl171 B08 test-site check: 3 HTML GETs from Webflow hosts, about 0.45 MB (M); no images, no browser
- 27 Nov, bw-guard-fix3-check-repro: stubs on 127.0.0.1 only, 0 page loads, 0 MB from Webflow (M)
