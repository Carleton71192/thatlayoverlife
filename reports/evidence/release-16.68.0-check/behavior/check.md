# Release 16.68.0 check: behavior lens (18 Nov 2026)

Verdict: **PASS WITH NOTES.** On the real test-site documents, A (photo clean 1.2.0), B (core 16.68.0) and C (/submit footer code) do
what the release note says, run for run the same as the lab (`reports/evidence/submit-save-2026-11-17/check-final.md`), and nothing
else moved: home, /stories, /travelers, /the-map and two stories finish with the same page and the same CLS as www. The notes below
were all known from the lab; none should keep the release off www.

Test site that-layover-life.webflow.io (published 09:34 UTC) against www.thatlayover.life. Form runs 09:44 to 10:29 UTC, page loads
10:29 to 10:36 UTC. Independent of the builder, read only: no Webflow tool calls, no publish, no real form post, no upload, no Worker,
Cloudinary or Memberstack API call.

## Method

- Chromium headless (Playwright), one browser at a time (every run waited until no other browser was running).
- Every load is one real navigation to the real host (route.continue), status 200, ending on the asked path. Nothing in the HTML
  was changed. Our jsDelivr files (core, chunks, photo clean) were answered from `git show <pin>:<path>` at the pin the page asked
  for (byte equal to jsDelivr, carry check), so the browser's SRI check ran for real on both hosts.
- Form runs: `harness/h3.cjs`, made from the lab harness `check-final-run/h2.cjs` by `harness/mk-h3.py` (only the document source,
  the jsDelivr answers and the Worker's allowed origin changed). Stubs exactly as in the lab: Cloudinary upload 4 s a photo
  (or 500 once for "upfail"), Webflow form post 1.5 s `{code:200}` (or 500 where the scenario says), Worker `/intake` 6 s
  `{saved:true,held:true}` (or 502, or a dropped connection), Memberstack a local fake with a signed-in test member and a JSON store
  that carries to a later visit, Turnstile a local fake. Every other non-GET was aborted (0 needed: no unstubbed non-GET came up),
  every request to workers.dev, cloudinary.com and Memberstack hosts was stubbed or aborted, same-origin fetches (sitemap, /stories)
  were aborted on both hosts alike, as in the lab. Images and fonts only from local caches; 0 fetched.
- Page loads: `harness/pl.cjs`, the 16.67.0 check's `b.cjs` with the new pins and page list. Memberstack APIs aborted, workers.dev and
  cloudinary.com from local caches or aborted, same-origin fetches from the carry check's plain GETs (09:36 UTC), Math.random seeded
  the same on both hosts. 6 pages x 390 and 1440 x 3 loads x 2 hosts = 72 loads.
- Analysis: `harness/an.py` (the lab's), `harness/sm.py` (table), `harness/pan.py` (page loads).
- Files: `form-table.md` and `form-runs.json` (42 form runs), `pages-table.md`, `pages-summary.json`, `pages-loads.csv` (72 loads).
  No story text, member or contributor data: dummy text, a fake member and three generated test photos. Screenshots and raw run files
  stay in the session scratchpad.

## 1. What each load ran

| | test (21 form runs, 36 page loads) | www (21 form runs, 36 page loads) |
|---|---|---|
| core tag | `0f04fabf` with `sha384-a9tcQUfk...` on every load | `a254306f` with `sha384-2Bc75us2...` on every load |
| core answered and ran | 0f04fabf, HTTP 200, `tllSelfDoc` present: 57 of 57 | a254306f, HTTP 200, `tllSelfDoc` present: 57 of 57 |
| photo clean tag (/submit, /my-pets) | `f67f3f74` with `sha384-b9+lDans...`, ran: 19 of 19 | `22019832` with `sha384-AAifp68s...`, ran: 19 of 19 |
| chunks | site, submit, pets, share-photos, home, stories, story, travelers, map: all at 0f04fabf, all 200 | the same chunks, all at a254306f, all 200 |
| /submit footer C (`tllStorySent` in the page) | 17 of 17 /submit runs | 0 of 17 |
| /share-photos | no photo clean tag (as designed), own uploader `tll-photo-send-v1` at 4d12668d | the same |

Every document: one navigation, HTTP 200 (74 form-run documents and 72 page loads; revisit and postfail runs load 5 documents each).
0 failed scripts, 0 aborted navigations.

## 2. Form runs (42)

/submit: one press, a press every second during the uploads (mash, 14 presses), cached resend after a forced cancel (first form post
500, then a second press with every photo cached), body without end punctuation (ends in an emoji), failed upload (second upload
500 once), Worker 502 (both widths) and Worker connection dropped (390), second visit after a successful send, second visit after a
failed form post; at 390x844 and 1440x900 on both hosts. /my-pets and /share-photos: one press, 390 and 1440, both hosts.
Full table: `form-table.md`.

| Check | test (16.68.0 + 1.2.0 + C) | www (16.67.0 + 1.1.0) |
|---|---|---|
| One form post per scenario | yes, 21 of 21 (at most one successful post; the extra posts are the forced 500s) | yes, 21 of 21 |
| No extra upload | yes: /submit 3 a run (upfail 4: the failed photo and the next one sent again, photo 1 not repeated), /my-pets 2, /share-photos 1 | the same counts |
| Swallowed presses | 0 | 4 (cached and nopunct, 390 and 1440) |
| Presses to get the story out (cached, nopunct) | 2 | 3 |
| Button faded with its own label, /submit | 0.0 s in 17 of 17 | 12.5 to 16.8 s |
| Button faded with its own label, /my-pets | 0.0 s (390 and 1440) | 8.3 and 8.4 s |
| Button labels while sending (/submit) | "Sending photos 1 of 3", "2 of 3", "3 of 3", then Webflow's "Sending to Copenhagen…"; after a failed upload it comes back as "Send it to the editor" | "Send it to the editor" faded, then "Sending to Copenhagen…" |
| Button labels while sending (/my-pets) | "Sending photos 1 of 2", "2 of 2", "Photos are up. Sending" (1440 sample), "Issuing…" | "Create passport →" faded, then "Issuing…" |
| Line under the done box, Worker fine | "Saved. It is with the editor." at the done box | "Sending it to the editor…" for 6 s, then the same line |
| Line under the done box, Worker 502 or dropped | "Saved. It is with the editor.", then exactly "Saved. The editor will add it to the draft list by hand." (`role=status`), 3 of 3 runs | "Sending it to the editor…", then "Saved. It is with the editor." (wrong) |
| Done box comes into view | 99 to 100 percent at 390, 100 percent at 1440, at first show, every run with a done box; on nopunct 390 the page scrolled it in once | 99 percent at 390, 100 percent at 1440 |
| Done box time (one press) | 14.1 to 14.2 s | 14.1 s |
| Account after the send | marked sent, 15 fields, hero and both gallery links (15 of 15 runs with a done box) | unsent draft (upfail: 13 fields, photo links lost) |
| Page errors | 0 | 0 |
| Console errors | same set as www for every page, scenario and width: the aborted requests and the 500, 502 or dropped connection the stubs were told to give | |
| /share-photos | "Send it to the Lounge →" faded 4.2 s, done box 5.7 to 5.8 s, 100 percent in view | the same |

Later visits (390 and 1440 alike):

| | test | www |
|---|---|---|
| Second visit after a successful send, same browser | form empty, no "Draft restored"; account still marked sent, 15 fields | "Draft restored", the sent story back in the form |
| 20 s later, nothing typed | autosave writes the generated fields as a new draft; the sent copy moves to `tllStorySent` (kept) | autosave writes the sent story again as an unsent draft (13 fields) |
| Third visit, same browser | "Draft restored" over an empty form (note 2) | "Draft restored", the sent story in the form |
| New browser, account as after the send | form empty | form empty |
| Second visit after a failed form post | "Draft restored", the unsent story back in the form; account unsent, 15 fields, no sent mark | the same |

## 3. Page loads (72)

| page | width | www CLS median / max | test CLS median / max | 16.67.0 on test, 17 Nov | finished page equal to www |
|---|---|---|---|---|---|
| home | 390 | 0.0000 / 0.0000 | 0.0000 / 0.0000 | 0.0000 | 3 of 3 |
| home | 1440 | 0.0005 / 0.0006 | 0.0005 / 0.0005 | 0.0005 | 3 of 3 |
| /stories | 390 | 0.0073 / 0.0073 | 0.0073 / 0.0073 | 0.0073 | 3 of 3 |
| /stories | 1440 | 0.031 / 0.031 | 0.031 / 0.031 | 0.030 | 3 of 3 |
| /travelers | 390 | 0.0100 / 0.0100 | 0.0100 / 0.0100 | 0.010 | 3 of 3 |
| /travelers | 1440 | 0.0058 / 0.0058 | 0.0058 / 0.0058 | 0.0058 | 3 of 3 |
| /the-map | 390 | 0.0000 / 0.0000 | 0.0000 / 0.0000 | 0.0000 | 3 of 3 |
| /the-map | 1440 | 0.011 / 0.011 | 0.0037 / 0.011 | 0.011 | 3 of 3 |
| Balkans story | 390 | 0.0000 / 0.0000 | 0.0000 / 0.0000 | 0.0000 | 3 of 3 |
| Balkans story | 1440 | 0.0001 / 0.0001 | 0.0001 / 0.0001 | 0.0001 | 3 of 3 |
| Lisbon story | 390 | 0.0005 / 0.0005 | 0.0005 / 0.0006 | 0.0005 | 3 of 3 |
| Lisbon story | 1440 | 0.0001 / 0.0001 | 0.0001 / 0.0001 | 0.0001 | 3 of 3 |

- Finished page: the box list of every visible element equals a www load in its cell in 36 of 36 test loads; page text, html classes,
  document height, element count, Menu button count and the count of images not drawn are equal by host in every cell.
- CLS: 0 loads over 0.1 on either host. Every cell matches 16.67.0 as measured on the test site yesterday. /the-map 1440 has a timing
  race between two states (0.003 or 0.011, the extra shift is the map bar), seen on both hosts (www 2 of 3 at 0.011, test 1 of 3);
  same sources, not a change.
- Holds and stand-ins: none left at the end of any load except `style#tll-fp-title-v1` on /travelers, on both hosts (by design).
- 0 page errors, 0 failed scripts. Console errors are the same on both hosts, load for load: the aborted Memberstack app request and
  its "Could not load the app and member" line.
- FCP and LCP medians move both ways by host (see `pages-table.md`); no pattern, and the core differs only in two integrity lines.

## 4. Notes (not blocking, all known from the lab)

1. The "Already sent to the editor" line did not show on any later visit (Memberstack loads after the steps script, lab note 1).
   The sent story is still never put back into the form.
2. A blank later visit after a send leads to "Draft restored from your last visit." over an empty form on the visit after (lab
   note 2). Not the sent story, so no second send is invited, but the line is wrong.
3. At 390 the failure line wraps and the done box grows to 92 percent in view (bottom 847 to 869 px) (lab note 3).
4. /share-photos still fades its button 4.2 s a photo on both hosts (its own uploader, unchanged; lab note 4).
5. Not covered: the real Memberstack, Turnstile, Cloudinary, Webflow form endpoint and Worker (all stand-ins); Safari and iOS.

## 5. Bandwidth

From Webflow hosts: 146 documents (74 form-run, 72 page-load), 9.9 MB as transferred (form runs 4.34 MB, page loads 5.55 MB). No
image, video or font fetched (0 cache misses); no sitemap fetch. Plus one challenges.cloudflare.com script on /stories loads (both
hosts alike, as in the 16.67.0 check).
