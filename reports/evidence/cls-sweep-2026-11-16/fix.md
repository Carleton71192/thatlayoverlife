# Layout shift sweep, part A: the fix (16 November 2026)

For core release 16.67.0. Scope: causes C2, C4, C5, C8 and C11 of the survey (`survey/notes.md`) on /travelers, /the-map, /for-expats and /about.
Delivered by the core alone, `src/site-layers/tll-site-layers-v16.js`. No chunk changed. No Webflow write, no page or site code touched.

- Branch `claude/cls-sweep-2026-11-16`, from `claude/new-session-zxm063` at 586ce62. Not merged. `layers-release` not touched.
- Built core: `src/site-layers/tll-site-layers-v16.js`, 260,880 bytes (16.66.0: 252,289), SRI `sha384-7kWZjBWCQrwni++UzhGhuhIojHVvmg3uqOa0bdswqATABWBgBXqsEUdse4uAHvtW`.
- The core file carries no version string, as in earlier releases: the version is given when the script is registered and in the release note. Nothing to bump in the file.
- Tests: 648 pass (601 before, 47 new in `test/first-paint-layer.test.js`). A rebuild changes no bytes.

## Result in one table

Standard loads, 5 a cell, CLS median (max). Control is the live 16.66.0 core routed from a local copy. Full tables below.

| cell | control | new | loads over 0.1, control / new |
|---|---|---|---|
| /travelers 390 | 0.1234 (0.1281) | 0.0142 (0.0142) | 5 of 5 / 0 of 5 |
| /travelers 1440 | 0.1353 (0.1619) | 0.0058 (0.0058) | 3 of 5 / 0 of 5 |
| /the-map 390 | 0.1396 (0.1396) | 0.0034 (0.0034) | 5 of 5 / 0 of 5 |
| /the-map 1440 | 0.1003 (0.3509) | 0.0037 (0.0114) | 3 of 5 / 0 of 5 |
| /for-expats 390 | 0.0772 (0.0878) | 0.0131 (0.0131) | 0 of 5 / 0 of 5 |
| /for-expats 1440 | 0.0391 (0.0416) | 0.0001 (0.0001) | 0 of 5 / 0 of 5 |
| /about 390 | 0.0439 (0.0457) | 0.0036 (0.0082) | 0 of 5 / 0 of 5 |
| /about 1440 | 0.0365 (0.0567) | 0.0001 (0.0006) | 0 of 5 / 0 of 5 |

Also under 0.05 with no load over 0.1 at CPU 4x and in the stress set (tables below). Home and the three stories are unchanged.

## What changed

### 1. Hero photos go in while the page is parsed (C2), `tll-page-heroes-v1`

Before: the layer waited for the page-parsed event, then added its style and the photos. The first paint had already happened, so the hero and everything under it moved (faces row on /travelers, photo and 244 px top padding on /the-map at phone width, filmstrip on /about, split hero on /for-expats).

Now, on those four paths only:
- The style goes into the head when the core runs. When the page is parsed it moves to the end of the body, where it has always been, so the order of the styles on the finished page is the same.
- A MutationObserver calls the page's function each time the parser has added nodes. A part that goes in front (the faces row, the map backdrop) goes in as soon as its parent is there. A part that goes at the end of its parent (the map credit, the filmstrip, the split of the /for-expats hero, the photo row after the directory) waits until the parent has arrived whole, so the order of the children is the one the old run made.
- The page-parsed run is still there and does whatever is missing. A throw in the early run stops only the early run.
- Lazy photos (the filmstrip, the row after the directory) get their frame early and their img when the page is parsed, exactly when it went in before. Without this, three more photos were fetched at 390 px (the ones off to the side of the swipe rows).
- A photo that has arrived while the page is still being parsed shows without the 400 ms fade. With the fade, the largest paint on /the-map came about 450 ms later in the lab.
- /stories is unchanged (part B).

### 2. `tll-first-paint-v1`, a new core layer for /travelers, /the-map and /about (C4, C5, C8, C11)

It does nothing on any other path, and nothing if the core runs after the page is parsed. Each piece is let go when the page's own code has done its part.

| piece | what it holds | let go |
|---|---|---|
| `style#tll-fp-page-v1` | Copies of late page rules: the /travelers search box (5 rules of `tll-trav-search-css`, at the end of the body), the Open full screen link on /the-map (1 rule of the map section embed), the phone sizes of the /about hero (3 rules of an embed after the article). Stand-ins for what the /travelers page script writes when the page is parsed: the empty search note hidden, room for one figure in each chip count and in the card count. On /the-map at phone width: the map's closed bottom sheet left out of the layout. | Right after the page-parsed listeners have run (timeout 0), or after 20 s. It sits in the head, before the page's own styles, so the page wins every tie while both are there. |
| `style#tll-fp-ours-v1` (/travelers) | The three rules of our own travelers chunk that change the chip row and the grid (no Pets chip, no open slot, no empty first cell), and the chunk's word for the first chip (People). The chunk arrives by itself after the core; until then a painted grid moved one cell. | When the chunk's style is in the head. Without the chunk: after load (the chip reads Everyone again), or after 20 s. |
| `style#tll-fp-title-v1` (/travelers) | C8. The title keeps the height of its tallest verb. Measured on a hidden copy of the title at the width it has, once the title has arrived, and again after load, a resize and the web fonts. The words and the rotation are the page's. | Kept while the page rotates the verb. Not set for a reader who asks for reduced motion (the page does not rotate then). Taken out when the page is parsed and the page script has not written a verb (script missing or failed), or after 20 s without a page-parsed event. |
| `style#tll-fp-map-v1` (/the-map) | C4. The Map 2.0 mount (`#tll-map-layers`) keeps a height of one screen (at most 1,400 px), so what follows the map starts below the screen. | When the map is drawn and taller than the hold, when the embed's own status line reports a failure, when the page has no mount, or after 20 s. |
| `style#tll-fp-maptitle-v1` (/the-map) | The title stays in the fallback faces until both of its font files are in, then takes both at once (see "Found on the way", 2). | When both files have loaded or one has failed, or after 20 s. Not set when both are already in. |
| invite (/the-map) | The signed-out "Start your own map" link, which the page head script (`tll-map-invite-js-v1`) adds when the page is parsed (the hero grew 90 px). It goes in as soon as the counter is parsed, made the same way. That script then finds it and adds nothing. | Not added for a signed-in member or when that script is not on the page. |

The build checks every copied rule against the saved page code (`first_paint_checks()` in the build script), and the tests check it again. The one page fragment with no saved copy was the /the-map full screen embed; the 16 November GET of it is saved as `src/pages/the-map/live-2026-11-16/embed-fs.live.html` (read only).

Why C5 on /the-map needs only one copied rule: the passport block and the legend also change size when their styles arrive (146 to 371 px at 1440), but with the map held one screen tall they are below the screen when that happens.

### Found on the way (same four pages, fixed because the cells needed it)

1. **/the-map invite link.** Not in the survey's list: the page head script adds the link when the page is parsed, 90 px of the 294 px the phone hero grew. See the table above.
2. **/the-map title and its two font files.** The title is set in Playfair Display 800 and 800 italic. The files arrive one after the other. With both fallback faces the title takes two lines at 1440, with both web fonts also two, but with only the regular file in it fits one line. So the page under the title went up 83 px and down again, or the first paint was a line short and then moved down: 0.24 to 0.37, in 13 of 56 standard loads of the control over the four measurement rounds and 7 of 22 of the first two builds of this branch; 0 of 17 with the final core (the survey booked its one case as a passport style race). Now the title stays in the fallback faces alone (its own stack without Playfair Display) until both files are in, and then takes both in one step, so the one-line state is never laid out. The two files are asked for when the title has been parsed, which is when the browser asks for them anyway (no earlier download). A first try that only held the title's height did not cover a first layout that already had one file in.
3. **/the-map phone sheet.** When the map is drawn before the page is parsed (stress set), the site's reveal script then puts a transform on the map embed and the map's closed bottom sheet, fixed to the screen and slid out of view, is placed against the embed instead. Nobody sees it; the browser counts 0.13. The early page style leaves the closed sheet out of the layout until the page is parsed.
4. **/about phone sizes.** The page sets the hero's phone sizes in an embed 6 KB after the hero. A paint between the two showed the desktop sizes first (0.03 to 0.05 at 390 with the parser held there). Three rules are now in the early page style.

## Results

### Standard (no throttle), 5 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core. FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1234 (0.0128) | 0.1281 | 5 of 5 | 0.0142 (0.0050) | 0.0142 | 0 of 5 | 144 / 132 | 144 / 132 | yes |
| /travelers 1440 | 0.1353 (0.1353) | 0.1619 | 3 of 5 | 0.0058 (0.0058) | 0.0058 | 0 of 5 | 168 / 132 | 176 / 132 | yes |
| /the-map 390 | 0.1396 (0.0000) | 0.1396 | 5 of 5 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 152 / 144 | 244 / 184 | yes |
| /the-map 1440 | 0.1003 (0.1003) | 0.3509 | 3 of 5 | 0.0037 (0.0037) | 0.0114 | 0 of 5 | 164 / 144 | 260 / 196 | yes |
| /for-expats 390 | 0.0772 (0.0000) | 0.0878 | 0 of 5 | 0.0131 (0.0000) | 0.0131 | 0 of 5 | 148 / 136 | 164 / 136 | yes |
| /for-expats 1440 | 0.0391 (0.0391) | 0.0416 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 156 / 140 | 156 / 140 | yes |
| /about 390 | 0.0439 (0.0000) | 0.0457 | 0 of 5 | 0.0036 (0.0000) | 0.0082 | 0 of 5 | 116 / 132 | 116 / 132 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0567 | 0 of 5 | 0.0001 (0.0001) | 0.0006 | 0 of 5 | 148 / 160 | 148 / 160 | yes |
| / 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 184 / 168 | 184 / 168 | yes |
| / 1440 | 0.0005 (0.0005) | 0.0005 | 0 of 5 | 0.0005 (0.0005) | 0.0006 | 0 of 5 | 196 / 192 | 196 / 192 | yes |
| story: Balkans 360 | 0.0128 (0.0000) | 0.0196 | 0 of 5 | 0.0196 (0.0000) | 0.0196 | 0 of 5 | 160 / 168 | 160 / 168 | yes |
| story: Balkans 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 148 / 148 | 180 / 180 | yes |
| story: Balkans 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 164 / 172 | 164 / 172 | yes |
| story: Lisbon 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0041 (0.0000) | 0.0047 | 0 of 5 | 148 / 160 | 180 / 180 | yes |
| story: Lisbon 390 | 0.0040 (0.0000) | 0.0040 | 0 of 5 | 0.0038 (0.0000) | 0.0040 | 0 of 5 | 152 / 164 | 192 / 200 | yes |
| story: Lisbon 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 180 / 172 | 180 / 172 | yes |
| story: Southern Africa 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 152 / 152 | 184 / 188 | yes |
| story: Southern Africa 390 | 0.0057 (0.0000) | 0.0057 | 0 of 5 | 0.0057 (0.0000) | 0.0057 | 0 of 5 | 160 / 156 | 200 / 184 | yes |
| story: Southern Africa 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 156 / 180 | 156 / 180 | yes |

### CPU 4x slower, 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core. FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1239 (0.1234) | 0.1239 | 3 of 3 | 0.0142 (0.0088) | 0.0142 | 0 of 3 | 500 / 372 | 500 / 372 | yes |
| /travelers 1440 | 0.2043 (0.2043) | 0.2044 | 2 of 3 | 0.0058 (0.0058) | 0.0058 | 0 of 3 | 384 / 328 | 896 / 328 | yes |
| /the-map 390 | 0.2002 (0.1860) | 0.2194 | 3 of 3 | 0.0034 (0.0034) | 0.0034 | 0 of 3 | 416 / 432 | 1080 / 432 | yes |
| /the-map 1440 | 0.1084 (0.1084) | 0.1152 | 3 of 3 | 0.0110 (0.0110) | 0.0110 | 0 of 3 | 380 / 400 | 892 / 400 | yes |
| /for-expats 390 | 0.0878 (0.0000) | 0.0878 | 0 of 3 | 0.0131 (0.0034) | 0.0131 | 0 of 3 | 412 / 428 | 800 / 428 | yes |
| /for-expats 1440 | 0.0415 (0.0415) | 0.0415 | 0 of 3 | 0.0004 (0.0004) | 0.0004 | 0 of 3 | 496 / 420 | 496 / 420 | yes |
| /about 390 | 0.0245 (0.0000) | 0.0245 | 0 of 3 | 0.0036 (0.0000) | 0.0036 | 0 of 3 | 392 / 400 | 392 / 400 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0365 | 0 of 3 | 0.0007 (0.0007) | 0.0007 | 0 of 3 | 412 / 376 | 412 / 376 | yes |

### Stress: jQuery answer held 600 ms (a paint lands before the end-of-body styles and the page-parsed scripts), 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core. FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1593 (0.1588) | 0.1698 | 3 of 3 | 0.0488 (0.0483) | 0.0488 | 0 of 3 | 160 / 112 | 160 / 112 | no |
| /travelers 1440 | 0.3950 (0.3950) | 0.3950 | 3 of 3 | 0.0354 (0.0354) | 0.0354 | 0 of 3 | 168 / 132 | 680 / 132 | yes |
| /the-map 390 | 0.5625 (0.3872) | 0.6119 | 3 of 3 | 0.0034 (0.0034) | 0.0034 | 0 of 3 | 148 / 140 | 1544 / 164 | yes |
| /the-map 1440 | 0.2087 (0.2087) | 0.2087 | 3 of 3 | 0.0120 (0.0120) | 0.0120 | 0 of 3 | 168 / 148 | 1288 / 188 | yes |
| /for-expats 390 | 0.0878 (0.0772) | 0.0878 | 0 of 3 | 0.0131 (0.0034) | 0.0131 | 0 of 3 | 144 / 128 | 724 / 128 | yes |
| /for-expats 1440 | 0.0415 (0.0415) | 0.0415 | 0 of 3 | 0.0004 (0.0004) | 0.0004 | 0 of 3 | 148 / 144 | 148 / 144 | yes |
| /about 390 | 0.0245 (0.0243) | 0.0245 | 0 of 3 | 0.0036 (0.0034) | 0.0036 | 0 of 3 | 120 / 120 | 120 / 120 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0365 | 0 of 3 | 0.0007 (0.0007) | 0.0007 | 0 of 3 | 116 / 128 | 116 / 128 | yes |

Loads over 0.1 with the new core: none in these three sets (143 loads). In the smaller sets (76 more loads with the new core) one: /the-map at 768x1024, 0.122, of which 0.074 is the Menu button (C9) and the rest is inside the map.

Largest paint: earlier on /the-map, /for-expats and /travelers 1440 because the hero photo is in the first paint.

## The finished page

Checked on every load above: the list of every laid-out box at the end of the load (position and size) with the new core against the control.

- Equal in every cell at 390 and 1440, standard and CPU 4x, for /the-map, /for-expats, /about, home and the three stories. (In earlier rounds /the-map ended in one of two states with either core, 2 to 3 px apart inside the map: the map's own drawing.)
- /travelers differs in one way, on purpose (C8): at 390 the title box is 121 px for every verb. With the control it is 81 px for three of the four verbs and 121 px for "photograph". In the standard and CPU 4x loads both cores ended on "photograph", so the lists are equal there. In the stress loads the control ended on a short verb and its list differs by exactly that: title 81 against 121 px, everything under it 40 px lower. At 1440 every verb takes the same two lines, so the hold changes nothing.
- The body tree (tags, attributes, text) at the end of the load is the same as the control in all 8 cells in scope (one more load a cell with the final core; one exception, next point). Outside the body or by timing: `style#tll-fp-title-v1` stays in the head on /travelers; `data-tll-floor` on `html` reads 3 instead of 4 on /the-map (the site's type floor script now meets the invite link on its first pass instead of its second; the link ends with the same inline size); the order of styles and iframes that scripts add to the head and the end of the body varies from load to load with either core.
- On /travelers at 390 the site's touch-target script sometimes writes an inline padding of 10 px on three filter chips (they are 44 px tall either way, same boxes). It was there with one core and not the other in 4 of 23 compared pairs, in both directions; it depends on sub-pixel positions at load, not on the core.
- The same Webflow image files are asked for in all 8 cells.

One behavior note: the site's reveal script (`tllreveal`) decides when the page is parsed which blocks start below the screen and gives those a short fade when scrolled to. With the map held one screen tall, the blocks after the map always count as below the screen, which is where they end up once the map is drawn. At 1440x900 that is the same decision as before. On a taller desktop window the passport block was inside the screen when the page was parsed and got no fade; it now gets the fade when scrolled to. The same can flip for one block on /travelers at some phone heights because of the 40 px title hold.

## Failure cases and other sets

Tables in `fix/extra.md`. In short:

- **Page code missing or failing** (6 cases, 390 and 1440): the finished page equals the control in every case but one class. /travelers page script throwing at its start or before it writes a verb: title hold and page style are gone when the page is parsed. Chunk not loaded: our rules go after load and the first chip reads Everyone again. Reduced motion: no title hold. Map code not loaded: the hold goes when the embed's status line says so (at 1440 that release moves the passport block up, 0.045). /the-map without the invite script: no invite; at 1440 the passport block carries the reveal class (the note above: without the invite the hero is 91 px shorter and the control had that block inside the screen).
- **Parser held for 350 ms at 10 points** (a paint lands there): with the new core nothing is over 0.064 (control up to 0.46). /the-map and /about: 0.001 to 0.012 at all five points. /travelers at 390: 0.049 to 0.064, at 1440: 0.035 (items 4 and 8 below). /for-expats inside the hero at 1440: 0.028 (item 8).
- **Other screens** (one load): /travelers at 390x1100, 412x915 and 1440x1200: 0.004 to 0.013 (control 0.10 to 0.16). /the-map at 412x915 and 1440x1200: 0.005 and 0.007 (control 0.15 and 0.42). At 768x1024: /travelers 0.076 and /the-map 0.122 (control 0.35 and 0.44); 0.074 of each is the Menu button (item 3), the rest on /the-map is inside the map (item 6).
- **CPU 4x first paint, 5 more loads a cell:** control / new medians: /about 1440 420 / 440 ms, /for-expats 390 416 / 396, /travelers 390 364 / 380, /travelers 1440 388 / 360.

## What is left, and why

Numbers are from the standard loads with the new core unless noted.

1. **Type floor on the Find your people bar (site head, `tll-floor-js-v1`).** When the page is parsed the script sets 12 px on the label and the current pill (9 px before); they widen and the pills move right 29 to 45 px. 0.002 to 0.005 alone. Not pre-applied from the core: the script only writes where the size is under 12 px, so an early rule would make it skip those elements, and taking the rule out again would undo the size.
2. **Touch-target padding on the current pill (site footer, `tll-a11y-motion-v1`).** At load, on touch screens, the current pill gets 4 px more height and the page moves 5 px. 0.004 at 390. Same reason as 1 (the script measures first).
3. **Mobile nav Menu button (C9, part B).** 0.0034 on every phone page; 0.074 at 768 px, where the button makes the header 8 px taller.
4. **The verb itself (C8).** The words move inside the held title when the verb changes: 0.004 to 0.007 every 3.2 s, each on its own (the field metric does not add them up). The first change comes when the page is parsed (the page script replaces "live" with a random verb); when it lands in the same frame as items 1 and 3 the browser scores them together: 0.028 to 0.037 in the stress loads, which is most of the 0.035 (1440) and 0.049 (390) of /travelers there. Not changed: the words and the rotation are the page's.
5. **Chip counts (C11).** The page script first writes counts of people and pets together, then our chunk rewrites them for people only (10 to 9 on today's page): a 7 px change of one chip in two steps. The room for one figure and the early word People take out the rewrap of the chip row. The card bodies (labels, figures, makes line, link chips) are still filled when the page is parsed; at 390x844 and 1440x900 the grid starts below the screen.
6. **Inside the map (C4, Map 2.0 code).** When the sample note comes in, the map's own bar moves 88 to 111 px (0.008 at 1440x900, where the top 160 px of the map are on screen; 0.019 at 1440x1200; 0.037 at 768x1024), and when the status line "LOADING THE MAP CODE" is taken out the map moves up 27 px (0.003 to 0.010). The core holds the mount's height, not what the map does inside it.
7. **The map's phone sheet when the reader scrolls to the map (found here, not fixed).** The embed around the map carries the reveal transform until it is scrolled to; when the reveal ends, the closed sheet jumps from the embed to the screen. Nobody sees it, but the browser counts 0.085 (one scroll to the map at 390 px, the same with the control). The early page style only covers the time before the page is parsed. A lasting fix belongs in the map's CSS (proposal below).
8. **A paint inside a hero's own markup.** With the parser held inside the /for-expats hero, the unsplit hero is painted first and then split (0.027 at 1440, control 0.040). Inside the /travelers hero at 390, the faces row is painted before the title and moves 29 px when the rest arrives (0.015). The heroes are 0.7 to 1.2 KB of markup, so a real network rarely stops there.
9. **Font swap on /for-expats 390 (C10).** The lede wraps one line more when Plex arrives, in the lab's fonts: 0.005 to 0.010. The lab has Liberation fonts, not Arial or Georgia, so real phones may differ. The /the-map title is the only font work in this part. Titles on other pages can have the same one-file state at some width (none seen on these four pages in the lab), and a wrap that differs between the fallback faces and the finished fonts is still a jump when the fonts are in.
10. **The header grows 2 px at 1440 while the page loads** (all pages, about 0.002). Not looked into (nav, out of scope).

## Proposals for page and site code (not made)

- **Site head, `tll-floor-v1` style:** add `.tll-fyp-label h6,.tll-fyp-pill-on` to the 12 px list and `.tll-fyp-pill-on` to the 44 px rule. Takes out items 1 and 2 on every page with the Find your people bar.
- **/travelers embed d8735ad4 (`tv-v2-js`, `verb()`):** start from the verb that is in the HTML (`i = W.indexOf(em.textContent)`) instead of a random one, so nothing changes when the page is parsed. Optional: count people only there, so the chunk has nothing to rewrite.
- **/travelers page footer:** move `tll-trav-search-css` into the page head. The core copy can then go.
- **/the-map page head:** put the invite link into the hero markup (the existing `html.tll-map-public` rule can show it only to visitors) instead of adding it by script; move the Open full screen rule into the head.
- **/the-map Map 2.0 embed:** give `#tll-map-layers` a `min-height` in the embed; keep the status line's box (`visibility:hidden` instead of `display:none`) or put it inside the mount; keep the room of the sample note from the start. Map CSS: hide the closed phone sheet with `visibility:hidden` (delayed by the 200 ms slide) so it is not counted, or leave the map embed out of the reveal script.
- **/the-map title:** make the wrap independent of the font files, for example a line break before "on the map" from 992 px up. One Designer change; the title piece can then go. For part B (fonts): the same take-both-at-once step could serve every title with rose italic words.
- **/about embed c024f6d7:** move the `@media(max-width:600px)` hero rules into the page head. The core copy can then go.
- **Page heroes:** if the faces row, the map backdrop, the filmstrip and the side photo were in the Webflow markup, the core would not have to add them (a larger Designer job, not needed for the numbers above).

## Cost

- Core size: 260,880 bytes against 252,289 (gzip 78,220 against 76,011 bytes). The two layers go into the core without their comments. On every page.
- First paint: standard medians in the scope cells are between 36 ms earlier and 16 ms later than the control (table). On home and the stories, where the new code does not run, the median is 164 ms with both cores over 220 loads each (all four measurement rounds of this branch). CPU 4x: between 128 ms earlier and 20 ms later with 3 loads a cell; with 5 more loads on four cells between 28 ms earlier and 20 ms later (`fix/extra.md`). The work that used to run after the first paint (building the hero photos, measuring the title) now runs before it.
- Bandwidth: no new request. Eager photos are asked for earlier, lazy photos at the same moment as before.

## Method

- Harness: `fix/harness/h.cjs`, the survey harness plus a delayed answer for one resource, HTML patches, reduced motion, an init script and an end-of-load script (`h2.cjs` adds the held parser and the scroll). www HTML by one plain GET per page: the survey's copies for the non-story pages, three story pages fetched for this part (225 KB). Every load is served from that copy at the www address. The core tag is routed to a local core with integrity removed in the routed HTML only; chunks come from the git objects of pin 3df16988 with SRI intact (no chunk changed, so the new core's hashes match them). Webflow css, js, images and fonts from the local caches, anything not cached aborted (2 image sizes a load on home and two stories at 1440, the same with both cores). Every non-GET aborted. Ads and analytics answered empty, Memberstack patched as before, Math.random seeded the same on every load.
- Chromium headless, one browser at a time, fresh context per load. 390x844 and 360x800: Android UA, isMobile, hasTouch, dsf 3. 1440x900: desktop UA, dsf 1.
- CLS: sum of all layout-shift entries until at least 4 s after load and 5 s after navigation start. Every entry is counted (under isMobile Chromium flags the first 0.9 s as recent input); the input-excluded median is in brackets in the tables.
- Sets, all with the final core (e2166af): standard 5 loads a cell (19 cells, 190 loads), CPU 4x 3 loads a cell (8 cells), stress 3 loads a cell (8 cells), and the smaller sets in `fix/extra.md`. Earlier builds of the branch were measured the same way; their numbers are quoted only where the text says so.
- Files: `fix/table.md`, `fix/cells.json`, `fix/loads.csv` (one row per load), `fix/extra.md`, `fix/harness/`.
- Limits: Chromium only; lab fonts (Liberation, no Georgia or Arial); documents served whole from disk, so the stress and held-parser sets stand in for a network; ads answered empty; signed-out only.
- No Webflow tool call, no publish, no non-GET request, no form sent. Webflow hosts in this part: 3 HTML GETs (225 KB), 0 image, video or font bytes.
