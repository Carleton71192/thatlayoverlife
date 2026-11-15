# Fix A4: the story first frame, after the A3 checks (14 and 15 Nov 2026)

Author report. Branch claude/fix-story-first-frame-a4-2026-11-14, made from the A3 head 39f4b67 and pushed. Head ea2cec2. Not merged. Nothing was published, layers-release was not touched, no Webflow tool was called.

- Core at head: 251,113 bytes, 75,683 bytes gzip -9 (A2 250,582 and 75,275; A3 256,759 and 77,612).
- SRI: sha384-v1EUdNInqs4fB+zOZjwfXmb5dgDGjFa92/8UygZtiMSfypWvrp2fXt3PAbbZbcsN
- A rebuild at head changes no bytes. No chunk changed. Tests: 57 files, 597 tests pass (A3: 590).
- Local copy: scratchpad nov14/a4core/tll-site-layers-v16-a4-ea2cec2.js

## What changed (story layer of the core only, src/site-layers/)

1. **No Intl work before the first paint (M).** The flag script's country table is now static: region-names-v1.json holds the 280 region names Chromium gives (written by build-region-names-v1.cjs), and the build turns them into the table by the flag script's own rules (its list first, retired codes skipped, first name wins). A test reads every name through the real flag script with those names and gets the same code from PF. A browser with no Intl.DisplayNames gets the list only, as the flag script does. The table costs 1.8 KB gzip. Names that differ in other engines only cost a stand-in of the wrong size for those names.
2. **The story under the head is held with the photo (M).** data-tll-mg-wait-r now goes on as soon as the hero is parsed, and it also hides the photo before its figure and every later sibling of the hero in the story article (the route strip, the body). The nav comes before the hero and the footer is outside the article, so neither is touched. It lets go when the Receipts block is in, when that block arrives with no byline row before it, or at DOMContentLoaded. The headline and crumbs paint as before.
3. **The route strip uses the template's rules from the first paint.** Found while measuring: once the hold let the body show, the strip was still laid out by Webflow's classes until the template style arrived at the end of the body, then lost 11 px (0.037 on Phuket 412, also on A2). Its six rules, their tokens and the phone media rule join the early style, keyed and removed like the other copies; the build stops if they change in the template.
4. **The stand-in shrinks like the real flags (ADV3).** It is now made of img elements with the flag script's own inline style, no source, alt empty and a loading attribute (so the page's lazy-image pass skips them). In a test page its boxes match real flags at every width down to 60 px; the old spans did not below 120 px.
5. **The stand-in goes in as soon as the country crumb is parsed (ADV4).** PF.pre() only adds it if it is not there yet (an empty crumb still waits for the country name).
6. **Template script throws while parsed (ADV2).** An error event whose current script is tll-st3-story-js-v1 lets the place-and-date words and the link box go at once, while the photo and the body are still held. That script then adds no handler, so this is the page's own result.
7. **The story layer's comments are left out of the download.** The lab's slow 4G model serves the core uncompressed on one 1.6 Mbit/s pipe, and the A2 to A4 notes had grown the story layer from 39 to 53 KB, about 50 ms of first paint. The notes stay in the build script and the sources. Minified with esbuild, the script and both styles are identical to the build before, token for token.

Kept from A3: every hold and the stand-in clear by DOMContentLoaded (the stand-in by the next task) or on failure; the finished page is the page scripts' own; build guards on every mirrored fragment.

## Gate (one browser at a time, the measure harness m.cjs as m4.cjs, same caches and routing)

Core ea2cec2 for every number below except the adversarial rows. Full per-cell tables: fix-a4-cells.md.

- **(a) PASS.** Unthrottled, 351 A4 loads, none over 0.1 in any cell (highest 0.091, Southern Africa 768, where A2 reaches 0.24). Slow 4G, 54 A4 loads, none over 0.1.
- **(b) PASS.** In cells where www or A2 went over 0.1 (including 768), A4 is never worse than A2 by more than 0.01 median.
- **(c) PASS on the final run, with one note.** No cell worse than A2 by more than 0.01 median; 33 of 81 unthrottled cells are better by more than 0.01. Earlier runs (cores 4404866 and c6c9127) flagged the reload at 2,500 px on Balkans and Pantanal. Rechecked with 10 more loads per core on ea2cec2: Balkans A4 0.0105, A2 0.0105. Pantanal A4 0.0174, A2 0.0063 (+0.011): both cores split between 0.006 and 0.028 to 0.044 (A4 5 of 10 high, A2 3 of 10); a second sample of 8 gave 0.0063 on both. It is a race between scroll restoration and the template style arriving above the view, with no hold on at that point.
- **(d) PASS.** All 351 unthrottled A4 loads end with the same box list as a www load in their cell. Slow 4G differences are only the known 11 boxes at the foot of the story (reader notes and write-for-us in the other order), seen on A2 too. In the Balkans reload recheck, 6 of 10 A4 loads ended scrolled 3 px lower; only the fixed progress bar and note button boxes differ.
- **(e) PASS.** No hold, stand-in or early style left on any load; 0 page errors in 1,275 gate loads.
- **(f) PASS.** Slow 4G median FCP is 8 ms later than A2 (median of 18 cells; worst +52 on Balkans 360 and Croatia 390, best -76). Unthrottled FCP is 4 ms earlier than A2 (median of cells).

A3 gains kept (A4 median, A2 in brackets): Balkans 320 0.0023 (0.134), 344 0.0039 (0.135), 360 0.0087 (0.152), 375 0.0150 (0.153); Croatia 390 0.0039 (0.055); Southern Africa 344 0.0039 (0.051), 360 0.0042 (0.059), 375 0.0041 (0.058), 390 0.0057 (0.056), 412 0.0073 (0.060). At phone widths the median cell is 0.004 on A4, 0.017 on A2, 0.088 on www.

The judge's M cells: Vietnam 320 to 390 now 0.008 to 0.016 (A2 0.008 to 0.058 in this run), Phuket 344 to 412 equal to A2 or lower, Lisbon 390 and 412 0.004 (A2 0.004), Texas 344, 360 and 412 0.004 (A2 0.004 to 0.018), and the reloads on Pantanal and Phuket equal to A2 or lower.

## Adversarial cases (h4.cjs as h5.cjs, core 4404866, 2 loads per core)

| case | www | A2 | A3 (judge) | A4 |
|---|---|---|---|---|
| twelve countries 360 / 390 | 0.066 / 0.078 | 0.036 / 0.037 | 0.062 / 0.054 | 0.005 / 0.005 |
| parser stall after the hero, Balkans 360 | 0.019 | 0.155 | 0.089 | 0.004 |
| same, Southern Africa 390 / Croatia 390 | 0.086 / 0.116 | 0.065 / 0.066 | 0.012 / 0.012 | 0.006 / 0.010 |
| template throws at its top, Southern Africa 390 | 0.058 | 0.075 | 0.165 | 0.005 |
| same, Croatia 390 / Balkans 360 | 0.112 / 0.018 | 0.010 / 0.152 | 0.061 / 0.050 | 0.018 / 0.015 |
| template throws in its place step, Southern Africa 390 | 0.074 | 0.082 | 0.150 | 0.142 |
| flag script 404 / missing, Balkans 360 | 0.017 / 0.020 | 0.021 / 0.021 | 0.145 / 0.143 | 0.145 / 0.150 |
| no Receipts block / no byline row / empty crumb, 360 | 0.118 / 0.091 / 0.085 | 0.040 / 0.076 / 0.041 | 0.005 / 0.039 / 0.018 | 0.004 / 0.039 / 0.005 |

Finished page same as www in every case except banner-top (the reveal fade on the photo, as for A3).

## Not done, and why

- **ADV1 (flag script fails on a Balkans-like story, 0.145).** The flag script is the last script in the body, so its failure is known only after the photo is shown; the stand-in must then go. Fixing it would mean holding the photo until DOMContentLoaded on every load.
- **Template throws inside its page-parsed handler (0.142).** Same reason: known only at DOMContentLoaded. A throw at the top of the script (ADV2) is handled.
- **ADV5 (US state flag at 1.4 s).** Reserving it would keep a stand-in past DOMContentLoaded, which breaks the A3 rule that everything clears by then.

## Worth knowing

- Three lab runs overlapped: a killed harness kept running (Playwright closes its browser on SIGTERM and the harness relaunches one). Those runs were thrown out; every gate number above comes from runs with one browser, checked before each start.
- The static table is Chromium's names (version 141). Rerun build-region-names-v1.cjs and the build if the flag script's names should follow a newer browser.
- Bandwidth: 0 bytes from Webflow or jsDelivr (all cache hits or aborted images), no new HTML GET, 4,272 non-GET requests aborted. Lab data about 15 MB in scratchpad nov14/a4lab.

## Repair round (15 Nov 2026, after the two A4 checks)

One commit on the A4 branch: 413139c (on ea2cec2), pushed, not merged. Only the story layer of the core (src/site-layers/) and the story test changed.

- Core at 413139c: 252,289 bytes, 76,036 bytes gzip -9 -n. SRI sha384-trfI5wInWYlCUfz0XKnR/BqQpouu3JHGMLplaS1AFlYR8UiNBqoOU/6oYwcAJYTl. A rebuild changes no bytes. Tests: 57 files, 601 tests pass.
- Local copy: scratchpad nov14/a4core/tll-site-layers-v16-a4r-413139c.js (byte for byte the committed core).

### What changed

1. **Reload at 2,500 px ended at 2,503 (measure judge, gate part d).** Read in the Chromium source and checked in the lab: the browser restores the position twice, first by the element that was at the top of the view as soon as the page is tall enough, then by the scroll position when loading ends. The second one is skipped while the browser's scroll anchor still holds the element of the first one. On www and A2 a later style change clears that anchor before loading ends; with the A4 head laid out from the first paint it often did not, and a 6 px growth above the view was then followed by anchoring. Taking the hold under the head out made it worse (7 of 8 loads at 2,503), so the hold was not the cause. Fix: on a reload or a back or forward load (scroll restoration not manual), at the load event the layer scrolls one pixel up and back in the same task. Nothing moves on the screen, the anchor is cleared, and the browser's own restore at the end of loading puts the page exactly where it was, as on www.
2. **Failed flag script on a Balkans-like story (adversarial judge, item 1).** When the page is parsed and no real flag is in front of the stand-in (404, throw, network error, missing tag, or the flag script drew nothing), the stand-in stays as an empty box with visibility hidden instead of being taken out. If flags still come later, it goes in the same step. A stand-in that left with the old crumb (the template made the crumb a link) goes as before.
3. **Throw at the end of the template script (adversarial judge, note).** While the page is parsed, document.addEventListener notes whether tll-st3-story-js-v1 adds a DOMContentLoaded listener; a throw from that script releases the place-and-date hold at once only if it had not. The page's own document.addEventListener is put back as soon as that script has been parsed (or at DOMContentLoaded).

### Gate (one browser at a time, the measure judge's m.cjs, same caches and routing; W, A2 and the new core in turn, rotated)

1,053 unthrottled, 162 slow 4G and 60 recheck loads (plus 20 A4 loads in the recheck for reference). 0 bytes from Webflow or jsDelivr, no HTML GET, every non-GET aborted, no other browser running during any load.

- **(a) PASS.** 0 of 351 unthrottled loads of the new core over 0.1 (highest 0.086, Southern Africa 768); 0 of 54 on slow 4G (highest 0.0195). www 151 and A2 29 unthrottled loads over 0.1.
- **(b) PASS.** 52 cells have a www or A2 load over 0.1. At 768 the new core is 0.074 to 0.086 (A2 0.074 to 0.144). The Balkans reload was flagged on 3 loads (0.0455 against A2 0.0105) and passes the recheck below.
- **(c) PASS after the recheck.** Flagged on 3 loads: the reload at 2,500 px on Balkans and Pantanal. 10 more loads per core: Balkans 0.0105 (A2 0.0105, A4 0.0105), Pantanal 0.0268 (A2 0.0284, A4 0.0268). Every core splits between a low and a high value on these reloads (the race between the restore and the template style arriving above the view, before the load event, so item 1 cannot touch it). No other cell is worse than A2 by more than 0.01; 30 unthrottled and 13 slow 4G cells are better by more than 0.01.
- **(d) PASS.** All 351 unthrottled loads equal a www load box for box, including the 9 reload cells; in the recheck 20 of 20 ended at 2,500 (A4 in the same recheck: 7 of 10 Balkans reloads at 2,503). Slow 4G: 49 of 54 equal www; the other 5 are the known foot-of-story order race (the same 11 boxes with the same sizes in a band about 390 px tall, reader notes and the write-for-us ask in the other order), against 1 of 54 on A2 in this run and 1 on A4 in the judge's run. None of the three changes touches the foot of the story.
- **(e) PASS.** No hold, stand-in or early style left on any gate load; 0 page errors on any core.
- **(f) PASS.** Slow 4G median of cell differences in FCP, new core minus A2: -20 ms (range -128 to +88); all loads 6,704 against 6,696 ms. Unthrottled -4 ms.

A3 gains kept (median, A2 in brackets): Balkans 320 0.0023 (0.134), 344 0.0039 (0.135), 360 0.0192 (0.151), 375 0.0213 (0.153); Croatia 390 0.0039 (0.055); Southern Africa 344 0.0039 (0.051), 360 0.0042 (0.059), 375 0.0041 (0.058), 390 0.0057 (0.059), 412 0.0073 (0.060). Phone-width median cell 0.0041 (A2 0.0143, www 0.0661).

### Adversarial recheck (the adversarial judge's h6.cjs as h7.cjs, A4 and the new core, 2 loads each; www and A2 values are the judge's)

- Flag script 404, throws, network error, tag missing, Balkans 360: A4 0.134 to 0.150, new core 0.0087 to 0.0195 (www 0.017 to 0.019, A2 0.015 to 0.021). zz-no-flag-tag 360: 0.150 to 0.014.
- Throw at the end of the template script: Southern Africa 390 0.157 to 0.0039, Croatia 390 0.064 to 0.0039, Balkans 360 0.044 to 0.014. A throw at the top and a syntax error stay at 0.004 to 0.015.
- Slow flag script, parser stalls after the hero and in the crumb, twelve countries, back and forward, older Intl names: within 0.01 of A4.
- Unchanged: a throw inside the template's place step, Southern Africa 390 0.142 (www 0.071, A2 0.074). The US state flag (ADV5) was not addressed.
- The price of item 2: when no flag came, the finished crumb keeps an empty hidden box in front of its text, so that crumb differs from www. Seen on the flag failure cases and on zz-turkiye with older Intl names (the flag script drew no flag where the static table expected one).

Lab files: scratchpad nov14/a4fix-lab (m.cjs with the new core added, dbg.cjs, an5.py, out/fast.jsonl, slow.jsonl, recheck.jsonl, the reload traces d1 to d4) and nov14/a4fix-adv (h7.cjs, anR.py, out/R2.jsonl, R3.jsonl).
