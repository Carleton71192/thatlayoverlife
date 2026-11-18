# Release 16.68.0 check: carry lens

Date: 18 Nov 2026, about 09:36 to 09:40 UTC. Plain GETs only (curl), no browser, no form posts, no Webflow tool calls, no publish.
Test site that-layover-life.webflow.io (stamp "Wed Nov 18 2026 09:34:42 GMT+0000") against www.thatlayover.life (stamp "Tue Nov 17 2026 17:13:02 GMT+0000").

Verdict: PASS. The only differences between test and www are the three planned parts plus host and stamp.

## 1. HTML on 17 pages, both hosts

Pages: home, /stories, /about, /the-paw-passport, /travelers, /layovers, /the-map, /for-expats, /cookies, the Balkans story, the Lisbon story, /account, /submit, /my-pets, /share-photos, /login, /signup. One GET per page per host, all 200 (fetch-log.txt). HTML only: about 6.1 MB in total from Webflow hosts, no images, fonts or video.

Method (harness/carry.py, result carry-html.json): take the test HTML, apply only the allowed substitutions, and require byte equality with the www HTML.

- Last Published comment: masked on both sides (one per page on each host).
- data-wf-domain="that-layover-life.webflow.io" to "www.thatlayover.life" (one per page; the test host name appears nowhere else on any test page, and nowhere on www).
- Core script tag: test 0f04fabf403d5c61d1e1f4ff8d850c493a9de62f with sha384-a9tcQUfk... to www a254306f6c62a79f314754d24b44041d61be716d with sha384-2Bc75us2... (exactly one of each on every page; no old core on test, no new core on www).
- Photo clean tag, only on /submit and /my-pets: test f67f3f74 with sha384-b9+lDans... to www 22019832 with sha384-AAifp68s... (exactly one of each on those two pages; zero photo clean tags on the other 15 pages on either host).
- /submit only: webflow-c-after.html (10093 bytes, found once in test, zero times in www) to webflow-c-before.html (8704 bytes, found once in www, zero times in test).

Result: 17 of 17 pages byte identical after these substitutions. Nothing else differs.

Structure checks (each compared byte for byte between hosts, all identical on 17 of 17 pages):

| page | nav | footer | forms | data-ms-* attributes |
|---|---|---|---|---|
| home | 1 | 1 | 3 | 4 |
| stories | 1 | 1 | 3 | 4 |
| about | 1 | 1 | 1 | 4 |
| the-paw-passport | 1 | 1 | 1 | 4 |
| travelers | 1 | 1 | 1 | 4 |
| layovers | 1 | 1 | 1 | 4 |
| the-map | 2 | 1 | 1 | 4 |
| for-expats | 1 | 1 | 3 | 4 |
| cookies | 1 | 1 | 1 | 4 |
| Balkans story | 1 | 1 | 1 | 4 |
| Lisbon story | 1 | 1 | 1 | 4 |
| account | 2 | 1 | 1 | 16 |
| submit | 1 | 1 | 3 | 9 |
| my-pets | 2 | 1 | 2 | 7 |
| share-photos | 1 | 1 | 2 | 7 |
| login | 1 | 1 | 2 | 11 |
| signup | 1 | 1 | 2 | 13 |

Form names, ids, method, action and every input, select, textarea and button (tag, type, name, id, data-name) are equal on both hosts. carry-html.json lists the form field names and the data-ms-* attribute names only (no values, no member or contributor data).

## 2. Files on jsDelivr against git

Fetched once each (jsdelivr-check.psv). All five: SRI computed from the jsDelivr bytes equals the expected SRI, and the bytes equal `git show <pin>:<path>`.

| file | pin | bytes | SRI |
|---|---|---|---|
| src/site-layers/tll-site-layers-v16.js | 0f04fabf | 277485 | sha384-a9tcQUfk... (matches the tag on all 17 test pages) |
| chunks/submit.js | 0f04fabf | 40120 | sha384-H8LLSn6c... (matches the core's integrity entry) |
| chunks/submit-preview.js | 0f04fabf | 57542 | sha384-ED9lWFcq... (matches the core's integrity entry) |
| chunks/share-photos.js | 0f04fabf | 7503 | sha384-uoZrsptU... (matches the core's integrity entry) |
| src/components/photo-clean/tll-photo-clean-v1.js | f67f3f74 | 7920 | sha384-b9+lDans... (matches the tag on test /submit and /my-pets) |

The www SRI values also match git at the old pins (computed locally, no fetch): core a254306f gives sha384-2Bc75us2..., photo clean 22019832 gives sha384-AAifp68s....

`git diff --name-status a254306f..0f04fabf` (git-name-status-a254306f-0f04fabf.txt) lists exactly four files, all M: tll-site-layers-v16.js and chunks submit.js, submit-preview.js, share-photos.js. In the core the only change is the two integrity lines for those chunks (core-diff-a254306f-0f04fabf.diff). Between 22019832 and f67f3f74, inside src/components/photo-clean/ only tll-photo-clean-v1.js and its test file change.

## 3. src/site/live-2026-11-18/r1668

site-scripts.before.json and site-scripts.after.json both hold 15 scripts in the same order; the only differing entry is tllsitelayersv16, version 16.67.0 to 16.68.0 (same location, same attributes). The other differences are the note fields lastUpdated and read (r1668-before-after.diff, r1668-scripts-compare.txt).

## Notes
- The core file itself carries no version string, so 16.68.0 is visible only in the Webflow registration and in the pin; the pin and SRI on every test page are the proof the new core is served.
- Raw HTML and the jsDelivr copies were kept in the session scratchpad and not committed (the story pages carry public bylines); only hashes, counts and names are here.
