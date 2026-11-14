# Core release 16.64.0 (13 November 2026)

Nancy's go-ahead in chat, 13 Nov 2026: release, choice 9 on, rewrite history.

## Built and on jsDelivr (done)
- Source: claude/new-session-zxm063 at fb3fc74 (choice 9 on). 552 tests pass; a rebuild changes no bytes.
- layers-release pin: 6ec769bb8fa05d21a459b6d106652854754c4c37
- Core SRI: sha384-m7ORNXLxTadunuYNZM0nrBKIxd+Elr5YS7LL+uIj29kh3sEjfUdQgEhayOdjrEvr
- jsDelivr: core, 24 chunks and the search index match the build byte for byte (26 of 26).
- Contents: bandwidth fixes 2, 3, 4, 5, 7 (layers), story hero box, library hold, choice 9 on, the Sacramento trip deck line.

## Webflow half (waiting: the Webflow MCP was down or not connected from about 07:40 to 14:20 UTC)
1. Lock check, scope line in WEBFLOW-LOCK.md.
2. Stage hero image lazy (remove fetchpriority) and E1 to E6, per reports/evidence/bw-fetches-2026-11-13 and the bw-images proposal. Element ids are in the merge report (home 2a95bf83..., a4c1009d..., 94ce12c0...; /about c024f6d7; /the-paw-passport footer code).
3. Register tllsitelayersv16 16.64.0 at the pin above with the SRI above; apply it in the site footer in place of 16.63.0.
4. D1 and D2 (hidden Site stats and Pets collection lists, before the footer instance, never inside it).
5. Publish the test site only. Independent check under the bandwidth rule (local caches, one fetch per file).
6. www and apex only after Nancy's OK in chat.

## Rollback
16.63.0, pin 1f2e549aee8627b2f67211463f764380f751c17b,
sha384-H+oSdrkcwOOlCvbyOd9Xm+EvqvWHK8Z0lJRpRfsE//z/ZWm7d2GXDxMktP77zztd.

## History rewrite (done 13 Nov, about 14:20 UTC)
The plain merge of the library hold branch was replaced by a squash commit (1e841d5) with a byte-identical tree,
so an early evidence screenshot showing a byline and two member avatars is no longer reachable from any branch.
The session branch moved 2f19e36 -> 5e470e6 (force-push with lease). claude/fix-library-hold-2026-11-13 now points
at 1e841d5 (branch deletion is blocked by the session proxy). GitHub can still serve the old commit by its full
hash until GitHub Support purges cached views; only Nancy can file that request.
Anyone with an older local copy of claude/new-session-zxm063 should reset it to origin before pushing.

## Live (14 Nov 2026, 08:16:50 UTC)
- Published to www, the apex and the test site on Nancy's "Yes, if all pass", after three independent checks of the 07:34 test-site publish passed (evidence under reports/evidence/release-16.64.0-check/).
- Live: core 16.64.0 (pin 6ec769bb), tllfactsv1 1.1.0 (E6), home hero lazy, E1 to E5.
- Not done: D1 and D2 (hidden Site stats and Pets lists; Designer work on six pages). Without them the pages fetch counts as before. F1 waits for Nancy.
- Notes from the checks, none blocking: library cards on phones are about 45 px taller (the hold uses the tallest card); phone photos use the 2x files (softer, by design); a pre-existing story layout jump at 390 with cached photos (same on the old version) is worth its own fix.
