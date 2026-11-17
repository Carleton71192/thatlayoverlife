# Layout shift sweep, adversarial check (17 November 2026)

Verdict: PASS WITH NOTES. I did not find anything that should keep the 16.67.0 core off the live site. Twelve notes follow; three of them are places where the new core reads worse than the control in a narrow case.

Checked: branch claude/cls-sweep-2026-11-16 at afe01e7. The core I loaded is 276,440 bytes, sha384-rm9a+UhEyhRi7OWymOTl2Ji8o28uPBQD2TMRg6nRg/j1KkvzpCR+UuahQy1PwQu/, byte equal to the file on the branch and to the measurement check's rebuild. Control: the live 16.66.0 core (sha384-trfI5wIn...) from a local file. Read only: no Webflow tool call, no publish, no form sent, 2,634 non-GET requests aborted and none sent.

This check was started by an agent that a machine restart cut off. Its harness and its first 105 records were kept; everything after that is mine.

## Method

- Diff read line by line: src/site-layers/tll-first-paint-v1.js, tll-early-state-v1.js, tll-page-heroes-v1.js, build-site-layers-v16.py.
- HTML: the 17 copies the measurement check fetched at 01:00 UTC. I made no request to a Webflow host. Other files come from the local caches; a file that is not cached is aborted. Ads and analytics get an empty answer. Memberstack is the patched copy (signed out) or a small stand-in that answers a member (signed in). Math.random is seeded.
- Two arms on the same HTML with the integrity attribute of the core tag removed: ctl = 16.66.0 core, new = branch core. Chunks from the git objects of the live pin in both arms.
- Chromium headless, a fresh context per scenario, one browser, one load at a time, arms in alternating order. deviceScaleFactor 1. Phones: isMobile, hasTouch.
- CLS: the sum of every layout-shift entry (the input-excluded sum is kept in the records). "Late" is the part later than 1 s after load.
- Finished page: box list, body tree, head list, the aria snapshot, the keyboard order, the page text and the classes on html, compared as hashes; the lists stay on the scratch disk because they hold page text.
- 438 scenarios, 566 compared stages, 877 recorded loads, plus about 30 trace loads (harness/dbg-*.cjs). One load failed (a closed page) and was run again.

## Sets

| set | what | scenarios | stages | boxes equal (+ title hold only) | body tree equal | CLS lower by more than 0.01 | CLS higher by more than 0.01 | over 0.1, ctl / new |
|---|---|---|---|---|---|---|---|---|
| fail | each page script throwing or missing, each outside file 404, one at a time | 144 | 144 | 133 (+1) | 134 | 120 | 2 | 69 / 3 |
| markup | changed HTML, query strings, hash links | 66 | 66 | 62 (+1) | 63 | 54 | 1 | 31 / 5 |
| slow | document in pieces, every file held, CPU 4x | 40 | 40 | 40 | 36 | 37 | 0 | 17 / 0 |
| cuts | document in pieces only | 16 | 16 | 15 (+1) | 16 | 16 | 0 | 6 / 0 |
| signedin, signedin2 | Memberstack stand-in answers a member, fast and late, also streamed | 36 | 36 | 33 | 33 | 21 | 2 | 25 / 22 |
| rm | reduced motion | 16 | 16 | 16 | 14 | 14 | 0 | 7 / 0 |
| w320 | 320 px | 8 | 8 | 7 (+1) | 8 | 3 | 0 | 2 / 1 |
| jsoff | JavaScript off | 8 | 8 | 8 | 8 | 0 | 0 | 0 / 0 |
| trav10 | /travelers watched 10 s after load, 4 widths | 8 | 8 | 4 (+4) | 8 | 6 | 0 | 6 / 2 |
| maptall | /the-map on 8 screen shapes, 23 s | 8 | 8 | 3 | 3 | 8 | 0 | 6 / 0 |
| menu | Menu opened and closed, early tap | 12 | 22 | 21 (+1) | 22 | 17 | 0 | 7 / 0 |
| storiesuse, stq2 | /stories chips toggled, search term repeats | 15 | 24 | 24 | 24 | 22 | 2 | 16 / 15 |
| travuse | /travelers search box and chips used | 3 | 21 | 18 (+3) | 21 | 21 | 0 | 21 / 12 |
| mapuse | map bar, chips, a tap on the map, scroll to the end | 3 | 21 | 14 | 14 | 21 | 0 | 21 / 5 |
| reload, reload2 | scroll, then reload | 25 | 50 | 34 (+3) | 39 | 39 | 6 | 30 / 18 |
| back | scroll, leave, back, forward, back | 12 | 24 | 8 | 12 | 18 | 0 | 20 / 11 |
| resize | rotation and window resize after load | 18 | 54 | 53 (+1) | 52 | 48 | 0 | 45 / 36 |
| all | | 438 | 566 | 493 (+16) | 507 | 465 | 13 | 329 / 130 |

The sets with clicks, reloads and resizes count the moves those actions cause, in both arms; that is why many cells are over 0.1 there. Every row of every set is in table.md.

## What held

- Nothing is left behind. In 566 probes no stand-in, no mark attribute and no early style is left at the end, apart from two by design: style#tll-fp-title-v1 on /travelers, and the map hold in one broken case (note 3).
- Page errors: the same count in both arms in every scenario, the same messages. No new console error text.
- Page scripts failing (144 cases): the finished page equals the control in 133, and in 1 more apart from the title hold. The other 10: the map hold in 2 (note 3), the invite link and a reveal class in 3 (notes 8 and 9), a tap mark in 3 (note 11), a card photo missing from the cache in 2 (lab).
- Unexpected markup (no title, no chips, no counter, no map mount, no filter row, no search form, pick on card 5 or 40, old first card, hidden first card, a new verb in the page code, eleven profile variants): finished page equal, CLS not higher than the control by more than 0.01 in 65 of 66 (the one is note 1).
- A profile set to Off: no stand-in, no early style, the same sequence as the control until the page code sends the visitor to /travelers (harness/dbg-pfoff.cjs).
- Slow load at CPU 4x: new 0.000 to 0.030, control 0.012 to 0.304. First paint: median 8 ms earlier, range 156 earlier to 68 later, on loads of about 3.8 s.
- Reduced motion: new 0.000 to 0.031, the title hold is not set. JavaScript off: equal, nothing runs.
- /travelers over 10 s: no late move added. Each verb change scores 0.005 to 0.007 (control 0.013 to 0.018).
- The map hold lets go 300 to 460 ms after navigation start on all 8 screen shapes; the drawn map is 2,362 to 4,137 px tall, always taller than the hold.
- Back and forward: new lower than the control, or within 0.002 of it, in all 24 stages, and the scroll position comes back closer to where the reader was (exact on /travelers and the profile; the control drifts by 41 to 3,366 px).
- Menu: open, close with Escape, and focus are equal in all 10 cells. Chips and search on /stories and /travelers, and the map controls: every stage equal apart from the title hold.
- Signed in with the stand-in: /account has its tab rail, 8 tabs, 6 panel heads, the member bar and the nav in both arms.

## Notes

1. /stories with a search term, 1440 px, fonts not cached. 9 loads an arm of /stories?q=lisbon: new 0.12 in 5 and 0.71 in 4; control 0.17 to 0.36 in 8 and 0.77 in 1. Medians 0.12 and 0.23. The 0.71 is one frame in which the title takes its two font files (the hold is let go) and the search filter pulls the matching cards up; Chromium multiplies the two. The reader sees the same two things in both arms. At 390: 0.384 (4 of 4) against 0.412 to 0.420. With no match (?q=zzzzqqq) new is lower: 0.041 against 0.123. For the builder: stand the title hold down when the address has a search term, as the lead card piece already does. Trace: results/dbg-stq-lisbon-1440.log.gz.
2. Reload at the very end of /about, 390 px: new 0.45 to 0.52 in 4 of 4 loads, control 0.13 to 0.155. The page is tall earlier, so the browser puts the scroll position back before the page is parsed, and the page-parsed work then moves what is on screen (39 px, then 111 px; the control has the 111 px move only). Reload from mid page is the other way round: 0.000 against 0.355. On /for-expats both arms read about 1.0 on a reload at the end (control 1.09 to 1.11 in 3 of 4, new 1.02 in 4 of 4); the new core ends 870 px above the old position in 3 of 4 loads, the control in 1 of 4.
3. Map code that loads but never starts (empty or throwing file, or no data): the one-screen hold stays until the embed writes its DID NOT START line, 9.6 s, then the page under it moves up 844 or 900 px (0.037 late at 1440, off screen at 390). The control never shows the empty box. With the file missing (404) or the embed missing the hold lets go at once.
4. /travelers at 320 px is not fixed: 0.151 against 0.169. The Find your people pills take one more row (34 px) when the site head type floor runs. Over 0.1 in both arms.
5. /travelers title hold. At 320 and 390 px the title box is 121 px for every verb (81 px on www for the short ones), so the page is 40 px longer. After a window resize the hold is measured again 200 ms later; from 1440 to 768 px that is one more move of 0.026 (77 px), which Chromium marks as input.
6. Signed in is a stand-in, not a real session. Finished page equal in 33 of 36 cells; the other 3 are races that repeats showed in both arms (results/dbg-acct-1500.log.gz). When the member answer comes before the page is parsed, the nav piece stands down and the nav jump stays: /account 1440 0.784 against 0.788, /submit 390 0.109 against 0.109 (3 loads an arm each). One look at /account in a real signed-in session is still open, as the builders say.
7. A tap on the stand-in Menu button before the page is parsed: the menu opens at the page-parsed event (3 s later in the slowed load) and focus ends on body. In the control the tap can only land on the real button, which keeps focus.
8. Tall and wide screens (768x1024, 1024x1366, 1440x1600, 1920x1080, 2560x1440): one or two blocks after the map now carry the site reveal class until they are scrolled to (opacity 0.6, 8 px lower). After a jump straight to the page end they stay that way while above the screen. The builders named this.
9. Broken pages where the new core reads higher: /submit with the site head script throwing, 0.141 against 0.000 (the control never shows the nav at all); the profile with its page script throwing at 1440, 0.030 against 0.009. When the /the-map invite script throws, the new core ends with the invite link and the control without it.
10. /the-map#tll-passport lands inside the map in both arms (scroll 840 px control, 1,750 px new at 1440). CLS 0.98 against 1.35.
11. Marks written by site head scripts that measure (data-tc, data-tll-tap, data-tll-contrast) differ on 1 to 3 elements in a handful of cells, in both directions. Of 23 probes an arm of /the-map at 390 where the map drew, one map button lacks its tap mark twice in the control and once with the new core. A race that is there today.
12. What the core touches at run time, for the record: a stand-in button in the nav row and a mark attribute on the nav, both gone before the site head script runs; on /account and /submit a style that gives the members wrapper no box of its own and hides its other children until the page is parsed. No data-ms attribute is written, no form or field name is touched, nav and footer end equal in every cell.

## Not covered

- A real signed-in session. Browsers other than Chromium (the nav piece needs :has(), the map hold needs min()). Real phone fonts: the lab has Liberation faces.
- A real slow network: the model is a document sent in pieces, every file held 0.3 to 4.3 s, CPU 4x.
- A restore from the back/forward cache: Chromium loaded the page again on back.
- Lab effect seen in 6 cells: a card photo that is not in the cache is aborted in one arm and the site shows its no-photo panel.

## Bandwidth and disk

- Webflow hosts: 0 bytes. The Turnstile script went to its own host on the pages that load it.
- Disk: 6.4 GB free at the end.

## Files

- table.md: every scenario and stage, both arms, with the flag list on top. cells.json.gz: the same as data.
- results/*.jsonl.gz: one record per scenario and arm (hashes, counts, shift sources by element name; no page text). results/dbg-*.log.gz: the three traces.
- harness/: lib.cjs (routes and probes), scen.cjs (every scenario), adv.cjs (runner), an.py (pairs the arms), dbg-acct.cjs, dbg-stq.cjs, dbg-pfoff.cjs.
