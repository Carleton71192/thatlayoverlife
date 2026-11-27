# Late lead mark on /stories (asia-cls check of 25 Nov, note 2)

Branch claude/late-lead-2026-11-27, cut from claude/new-session-zxm063 at a2ad2ad (core 16.70.0, sha384-lQYm..., live on www).

## Who owns what

- The lead mark: page code, `tll-lib-lead-v1` in the /stories footer (saved in src/pages/live-2026-11-21/stories/page-footer.html,
  same as the 27 Nov live page). It marks the first visible grid item. It re-marks 30 ms after the grid's child list changes, and
  at once on the `tll:lib-filtered` event. It does not see a style change on a grid item (its observer has no subtree).
- The place filter: page code `tll-lib-chips-v1` for the chips on the page (All places, Africa, Americas, Antarctica, Europe). It
  hides items with display and re-appends the shown ones, so the lead layer sees a child-list change.
- The core: `tll-stories-places-v1` (stories chunk) adds Asia, Middle East and Oceania. At normal speed it runs first and the page
  wires every chip. When the core and chunks are late, the page has wired its chips already, so the added chips filter through the
  core's fallback. The fallback hid items with display and did not move them, and sent no event. The lead layer saw nothing, so the
  lead stayed on a hidden card for good.

## Change (core only, no page code)

`tll-stories-places-v1` adds one document click listener. After any place or sort chip click (the chip's own handler runs first,
on the chip) it sends `tll:lib-filtered`. The lead layer then marks the first visible card in the same click. This covers the
fallback chips, the page's own chips (no 30 ms window with the lead on a hidden card) and the ?place= replay (the replay's
settle() sees the lead move while the grid is still hidden). Other listeners of the event: the page's s3 note (acts only on
the ?q= note) and the layer's own byline dots (debounced).

Core rebuilt with build-site-layers-v16.py: 273,848 B, sha384-vtQYZzh8oCb2Dn6Z0Cz+jrg60Clgicg8f5ba6uSWukhCgZOkACTCBxMUnrvaJ81M.
Only chunks/stories.js, chunks/stories-preview.js and the stories hash line in the core change. The build has no version
field; 16.71.0 is the version to register with the new pin and integrity.

## Tests

test/stories-late-lead.test.js, 7 tests (page chip and lead scripts from the saved footer, the layer run 3 s late). 6 fail on the
16.70.0 layer, 7 pass. vitest 882 of 882, worker 83 of 83.

## Browser (saved pages only)

bin/ab.cjs and bin/pw.cjs from the asia-cls check. Top-frame HTML from the 21 Nov cache (its lead, chips, search and s3 scripts equal
the 27 Nov live page). Core and chunks from disk: old = a2ad2ad worktree, new = this branch, each core tag's integrity set to its own
hash. Webflow-host assets from the asset cache, misses aborted. Memberstack stand-in, signed out. Story Worker aborted (none seen).
late3s: core and chunks answered 3 s late. 8 loads per case and variant, order alternated, 208 loads.

lead first: at the end the one lead mark is on the first visible grid item. hidFr: loads with a frame where the grid is visible and
the lead mark is on a hidden item. CLS after a scroll to the bottom and back (median, range); in the click cases it is the same
after the click (the click adds 0).

| Case | lead first old / new | hidFr old / new | CLS old | CLS new |
|---|---|---|---|---|
| Asia 1440 normal | 8 / 8 | 0 / 0 | 0.0303 (0.0296 to 0.0814) | 0.0303 (0.0299 to 0.0308) |
| Asia 1440 late3s | **0 / 8** | **8 / 0** | 0.1374 | 0.1374 (to 0.1377) |
| Asia 390 normal | 8 / 8 | 0 / 0 | 0 (to 0.005) | 0 (to 0.005) |
| Asia 390 late3s | **0 / 8** | **8 / 0** | 0.2569 | 0.2569 |
| Europe 1440 normal, late3s | 8 / 8 | 0 / 0 | 0.0301, 0.1374 | 0.0308, 0.1374 |
| Nowhere 1440 normal, late3s | 8 / 8 | 0 / 0 | 0.0307, 0.1374 | 0.0304, 0.1374 |
| no place 1440 normal, late3s | 8 / 8 | 0 / 0 | 0.0302, 0.1374 | 0.0301, 0.1374 |
| late3s, Asia chip click, 1440 | **0 / 8** | **8 / 0** | 0.1374 | 0.1374 |
| late3s, Asia chip click, 390 | **0 / 8** | **8 / 0** | 0.2569 | 0.2569 |
| normal, Asia chip click, 1440 | 8 / 8 | **8 / 0** | 0.0302 | 0.0304 |

All 208 loads: one lead mark or none, 0 card shifts, 0 page errors, 0 non-GET, 0 misses, 0 bytes from Webflow hosts. The one
console line per load is the harness's own abort of the Turnstile script. The old 0.0814 load is a shift of the filter section,
not the lead. The 0.1374 and 0.2569 late figures are the late core itself, equal in both builds.

## Not done

- With the core late, a reader who picks Asia, Middle East or Oceania and then a sort chip gets the page's own filter back (its place
  is still the last page chip), so all cards show while the added chip looks pressed. The lead is still the first visible card.
  The live page has no sort chips today, so this cannot happen yet.
- Taking it live needs a new pin and integrity in the site head (16.71.0), like any core change.

Files: bin (ab.cjs, pw.cjs, an-lead.py), results (lead.jsonl, lead-summary.txt, net.json).
