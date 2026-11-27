# rl171: B08 /my-pets empty-state wording on www (27 Nov 2026, plain GETs only)

- Nancy in chat 27 Nov: "Publish www".
- Pre-check: site lastUpdated 2026-11-27T13:44:36Z (bookkeeping after the 13:44:26 test publish); site scripts unchanged since 10:03:44Z.
- Published www, apex and the test site (publishTaskId ce7334ec-c164-453f-abb0-36b9c95cac09, stamp 14:12:36 UTC).
- GETs at 14:13:36 UTC: the www /my-pets footer equals B08 after.html byte for byte (trailing newline stripped). www equals test on /my-pets and home (host and stamp masked); core pin 121b4fe9 once on each.
- The apex is not reachable from this machine's proxy; it shares the publish.
- Bandwidth: 4 HTML GETs from Webflow hosts, about 0.79 MB (M).
