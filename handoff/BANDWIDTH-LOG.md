# Webflow bandwidth log (all sessions and scheduled tasks)

One line per run that touches a Webflow host (www.thatlayover.life, the apex, that-layover-life.webflow.io, website-files.com): date (UTC), session or task, what ran, page loads, Webflow MB (M measured or E estimate). Budget: 250 MB a day, 5 GB a month, 200 MB a run. Rules: reports/bandwidth-2026-11-13.md section 4 and the 13 Nov STANDING RULE in handoff/WEBFLOW-LOCK.md. Background: reports/bandwidth-2026-11-25.md.

## Period from about 20 Nov 2026 (backfilled 25 Nov from evidence)
- 21 Nov, rl169 sweep debug pass: 191 photos fetched once into a cache, 25.4 MB (M, rule 1 break); 302 status GETs, 5 to 57 MB (E, uncounted at the time)
- 21 to 22 Nov, rl169 sweep checks (check, verify-1, check-2, check-3, build): 0 MB from Webflow (M, cached assets)
- 21 to 22 Nov, rl169 plain GETs for the /submit and 16.69.0 releases: about 60 HTML pages, about 10 MB (E)
- 22 Nov 22:10, scheduled Sunday Night Audit (PageSpeed on thatlayover.life): 5 to 20 MB (E, not logged by the task)
- 20 to 25 Nov, scheduled TLL daily submissions report: 0 to 5 MB a day (E, not logged by the task)
- 25 Nov, rl169 16.69.0 live check: 24 HTML GETs, about 4 MB (E); bandwidth audit: about 0 MB (M, saved HTML only)
- 25 Nov, asia-cls-check (independent check of 2c51cda): 362 browser page loads from cached pages and assets, 0 HTML GETs, 0 MB from Webflow (M)
