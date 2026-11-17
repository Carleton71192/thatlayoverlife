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


# Layout shift sweep, part B: the fix (16 and 17 November 2026)

For core release 16.67.0, on top of part A (above). Scope: causes C1, C3, C6 and C9 of the survey (`survey/notes.md`) on /account, /submit, the contributor profile and /stories. C7 and C10 (font metric jumps) are left alone: the lab has Liberation fonts and no Georgia or Arial, so the size of those jumps on real phones cannot be measured here.
Delivered by the core alone, `src/site-layers/tll-site-layers-v16.js`. No chunk changed. No Webflow write, no page or site code touched.

- Branch `claude/cls-sweep-2026-11-16`, on top of part A (49b69d2). Not merged. `layers-release` not touched.
- Built core (parts A and B): `src/site-layers/tll-site-layers-v16.js`, 276,440 bytes (part A alone: 260,880; 16.66.0: 252,289), SRI `sha384-rm9a+UhEyhRi7OWymOTl2Ji8o28uPBQD2TMRg6nRg/j1KkvzpCR+UuahQy1PwQu/`. This replaces the SRI in the part A header above.
- The core file carries no version string, as in earlier releases: the version is given when the script is registered and in the release note. Nothing to bump in the file. No release note written.
- Tests: 707 pass (648 after part A, 59 new in `test/early-state-layer.test.js`). A rebuild changes no bytes.

## Result in one table

Standard loads (5 a cell) and CPU 4x slower (3 a cell): CLS median (max), every layout-shift entry counted. Control is the live 16.66.0 core routed from a local copy. Full tables below.

| cell | control | new | loads over 0.1, control / new | CPU 4x: control | CPU 4x: new |
|---|---|---|---|---|---|
| /account 390 | 0.0119 (0.0119) | 0.0119 (0.0119) | 0 of 5 / 0 of 5 | 0.0119 (0.0119) | 0.0119 (0.0119) |
| /account 1440 | 0.3007 (0.3007) | 0.0037 (0.0037) | 5 of 5 / 0 of 5 | 0.3008 (0.3008) | 0.0037 (0.0037) |
| /submit 390 | 0.1437 (0.1437) | 0.0002 (0.0003) | 5 of 5 / 0 of 5 | 0.1439 (0.1439) | 0.0002 (0.0002) |
| /submit 1440 | 0.0552 (0.0552) | 0.0003 (0.0003) | 0 of 5 / 0 of 5 | 0.0554 (0.0554) | 0.0003 (0.0003) |
| /contributors/<profile> 390 | 0.0763 (0.0763) | 0.0004 (0.0004) | 0 of 5 / 0 of 5 | 0.0763 (0.0763) | 0.0004 (0.0004) |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.0008 (0.0019) | 5 of 5 / 0 of 5 | 0.1178 (0.1178) | 0.0019 (0.0019) |
| /stories 390 | 0.0284 (0.0362) | 0.0073 (0.0079) | 0 of 5 / 0 of 5 | 0.0284 (0.0284) | 0.0073 (0.0073) |
| /stories 1440 | 0.1114 (0.1114) | 0.0311 (0.0311) | 4 of 5 / 0 of 5 | 0.0655 (0.0657) | 0.0300 (0.0311) |

Target: under 0.05 median and no load over 0.1, also at CPU 4x. Met in all eight cells in both sets. Home, the three stories and the four part A pages are the same or lower (tables below).

To know before release:
- **/account at 390 in the stress set is 0.094** (control 0.30). The nav part is gone; what is left is the page's own gate card growing after it has been painted ("What is left", 5).
- **/stories at 1440 stays at 0.030.** That is the title's font jump (0.013, C7, left alone as agreed) plus the story count our chunk writes into the title (0.016, "What is left", 1).
- **The nav piece was rewritten at the end of this work**, after its first build turned out to switch off the /account tab rail for signed-in members ("Found on the way", 6). The final piece moves nothing in the page and was measured again on /account and /submit. The lab is signed out; one look at /account with a real signed-in session before release is worth the minute.
- **On a slow phone (CPU 4x) the first paint of the profile and of /stories at phone width is 30 to 40 ms later** (about 430 and 530 ms against 400 and 490). At normal speed every cell is inside the 30 ms line ("Cost").
- **/stories at 412 px wide reads 0.10 with either core** (one load each): the title takes one more line when its web font arrives. A font jump, left alone as agreed, but close to the line ("What is left", 10).

## What changed: one new core layer, `tll-early-state-v1`

The four causes have one shape: the site's own code settles part of the first screen at the page-parsed event (DOMContentLoaded), after the first paint. The layer makes the same end state while the page is parsed, and hands the page back right before that code runs.

- **When.** A MutationObserver watches the page arrive. A piece goes in once the elements it needs have arrived whole.
- **Hand-back.** A capture listener for DOMContentLoaded on `window` runs before every listener on `document`. There the layer takes its own work out again (the stand-in button, the nav's early style, the cards back in the served order). The page's listeners then run in the same task on the page as it was served, so no frame is painted in between, and the finished page is the page code's own work. If a page script is missing or throws, nothing of the layer is left: the page ends as it does on www.
- **After.** A bubble listener on `window` runs after every listener on `document` (follow-ups only).
- **Hard release.** After 20 s without a page-parsed event everything is handed back and the layer stops.
- If the core runs after the page is parsed, the layer does nothing.

| piece | where | what goes in early | handed back / let go |
|---|---|---|---|
| Menu button (C9) | every page that has the site head script `tll-mobile-nav-js-v1` | A stand-in button with the real button's class at the end of the nav's button row, so the row has its final width from the first paint (and from 768 to 899 px the header its final height). Not announced, not in the tab order. | Taken out before the site head script adds the real button. A tap on the stand-in is passed on to the real one. Script missing: nothing goes in. Script throws: no button at the end, as on www. |
| Nav (C1) | /account and /submit, with the site head script `tll-proto-parity-js-v1` | Nothing is moved. The nav is the first child of a `[data-ms-content="members"]` wrapper that the site hides until Memberstack has answered. A style (`tll-es-nav-v1`) shows the nav inside that wrapper: the wrapper gets no box of its own (`display:contents`) and its other children stay hidden. That is the picture `navOut()` makes when it moves the nav in front of the wrapper. It applies only while `html` has no `ms-loaded` class. The nav carries a mark (`data-tll-es-nav`); the wrapper and every data-ms-* attribute stay as they are. | Style and mark are removed before `navOut()` runs, which then moves the nav out as always. Script missing: nothing set. Script throws: the nav ends inside the hidden wrapper, as on www. Not set in a browser that does not know `:has()` (Chrome before 105, Safari before 15.4, Firefox before 121): those load as they do today. |
| Search form (C6) | /stories | The form goes into the filter row, made the way `merge()` in the page's `tll-lib-lead-v1` makes it. | Handed back the moment that script's element is parsed (the observer runs before the script does); the script then merges for itself. Script missing: unmerged when the page is parsed. |
| Lead card (C6) | /stories, not with a search (`?q=`) | The first card leads from the moment the parser adds it, before its own content arrives (it is the editor's pick or the newest story on all but rare days). When the whole grid has arrived the page's rules are asked (the pick, else the newest by date). If they name another card, the page's own moves are made early: the chip script's order (each card appended again), the pick in front, the mark. | Before the page's scripts run the mark is taken off and a changed order is put back. The page then sorts and marks as always. |
| Title fonts | /stories | The title stays in its own fallback faces until both of its font files are in, then takes both at once (the step part A takes for the /the-map title). | Let go when both files are in or one has failed, or after 20 s. Not set when both are already in. |
| Profile head (C3) | /contributors/{slug} | A stand-in for the hero's text column, filled from the same attributes of `[data-pf5="root"]` that the page's `tll-pf5-profile-js-v1` and `tll-pf5-n-v1` read. It sits right after the real column. The real column is not touched and not shown until the page code has filled it. The flags in the stand-in are their round places only, so no file is asked for early. The badge (and the initials when there is no photo) go on the photo early. | The stand-in is removed one timer after the page-parsed listeners, when the notes embed has finished the real column. The early badge and initials are removed before the page code adds its own. Page script missing or throwing: the stand-in goes and the column is as served. |

Three things about the profile stand-in:
- **The home base is never in it.** The core's own rule (`tll-phase0-v1`) is that the home base stays hidden until the Worker says the member has switched it on. On www it shows from the page-parsed event until the Worker answers (see "Found on the way", 4). The stand-in does not show it any earlier.
- **A profile set to Off gets no stand-in.** The page hides such a page from visitors once its code has run, so nothing of it is filled in before that.
- **The story count in the stat strip** needs the story list, which comes later in the page. Until the list has arrived the STORIES cell keeps its room (hidden), so the strip does not rewrap when the count goes in.

The build checks the page code the layer follows against saved copies (`early_state_checks()` in the build script): the site head of 13 November (the same as the live head on 16 November), the /stories footer scripts and the profile script from the 16 November GET (saved read-only under `src/pages/stories/live-2026-11-16/` and `src/pages/contributors-template/live-2026-11-16/`), the profile notes embed and the core's home base rule. The tests run the layer together with that saved page code and compare the finished page with the one the page code makes alone.

### Found on the way

1. **What the browser counts on /stories.** When the page is parsed the page's chip script appends every card again (the sort), and our chunk appends every place chip again (its order, with three more chips). A node that is taken out and put back within one frame has no earlier position for the browser, so its move is not counted. The survey's 0.016 "lead card re-marked" entry is in fact the story count our chunk writes in front of the title: the rose word moves 129 px at 1440. The lead card and the chips do move on screen, but they were never in the number. A first try marked the lead card, when the whole grid had arrived, on a grid that was already painted (parser held inside the grid): the neighbors were pushed 500 px and counted, 0.10. Now the first card is marked the moment the parser adds it, before it can have been painted, and when another card has to lead the layer makes the page's own moves (every card appended again), which cost what the page's own run costs. (One step earlier the mark waited until the card's own content had arrived. A frame painted in between showed the card as a plain card first: 0.05 at 1440 in 1 load of 13, and 0.012 to 0.024 at 390 with the parser held inside the card. With the mark at once that point reads 0.007 at 390 and 0.030 at 1440, like every other load.)
2. **The /stories title and its two font files.** The same one-file state part A found on /the-map: with the regular Playfair file in and the italic not yet, the rose word jumps 132 px to the right and back, 0.049 on top of the font jump, in about half of the control loads at 1440 here (the "0.063 in one load" of C7 in the survey). The title piece takes that state out. The 7 px jump when the title goes from its fallback faces to Playfair (C7 itself) is still there.
3. **Two pieces for our stories chunk were tried and taken out again.** The place chips: put in early, the row of eight chips wraps on tablets while the web font is not in yet, and one chip changes rows when it arrives (0.07 at 768 px in the lab, against 0.03 with the chunk adding them later, uncounted). The story count: Written early, the count rewraps a title that is still in its fallback faces. With a frame already painted (CPU 4x paints before the whole grid is parsed) that moved the page 7 px and the rose word 129 px in one frame: 0.07 at 1440, against 0.016 for the chunk's own write when the fonts are in. Whether a frame has been painted cannot be asked reliably from inside the parser's task. So the chunk writes the count and adds the chips as it always has, and the 0.016 stays (see "What is left", 1).
4. **Profile: two things shown for a moment on www, not changed.** The home base is on the profile from the page-parsed event until the Worker's answer takes it out again (about 0.3 s in the lab). The STORIES figure in the stat strip reads the site total for a moment (57 for 52 on the lab profile) before our profile chunk puts the member's own count back. Both are the page and site code as they are today.
5. **/account at phone width.** The 0.012 the survey put under C1 is not the nav move. It is the sign-in links in the nav showing after load, when the page's gate script has decided the visitor is signed out (`html.tll-anon`). Left as it is (see "What is left", 4).
6. **The first build of the nav piece broke the /account tab rail for signed-in members. Found and fixed before this report.** It moved the nav in front of its wrapper early and put it back before `navOut()` ran. But the page script `tll-a3-account-js-v1` (Account 3.0) runs while the page is parsed, not at the page-parsed event, and takes the first `[data-ms-content="members"]` in the document. As served that is the wrapper around the whole dashboard. With the nav moved out it was the nav's own member block, so the script found no hero and stopped: no tab rail, no `html.a3-on`. A signed-out visitor sees none of this (Memberstack removes the dashboard), and the lab is signed out, so the box list and the body tree were equal. What gave it away was the largest paint on /account at 1440 (392 ms against 144) and then the missing `a3-on` class on `html`, which the body tree compare had skipped. The piece now moves nothing (table above), so every page script finds the page as served. Checked in the lab: when the page is parsed the members wrapper has the same markup with both cores (tab rail, 7 tabs, 6 panel headings, `html.a3-on`; `fix-b/extra.md`). The finished-page compare now includes the classes of `html`. The build pins the site rules and the page script line this relies on.
7. **/account shows the member dashboard to signed-out visitors for a moment (page code, not changed).** Once `tll-a3-account-js-v1` has run, the page's rule `html.a3-on [data-ms-content=members].a3-grid{display:grid}` outweighs the site rule that hides member blocks, so the empty dashboard is on screen until Memberstack removes it (about 0.1 s in the lab; its greeting line is the largest paint of the control). With the control this is also what the 0.30 at 1440 is counted on: the dashboard is already painted when `navOut()` lifts the nav out of it, and the browser counts the wrapper as moved by 77 px. With the new core the dashboard still shows for that moment after the page is parsed, as on www; the nav no longer moves it. Proposal below.

## Results

All tables: `fix-b/table.md`; one row per load: `fix-b/loads.csv`. Loads were made between 22:35 UTC on 16 November and 01:00 UTC on 17 November.

**Which build each row is from.** The layer changed twice while these sets ran, and only the pages a change touches were loaded again (with the control alongside each time). bdc6d21 is the core before the last two changes; 951b08c has the /stories lead card change; the final core (263014e) has the rewritten nav piece. The three built cores were compared byte for byte: bdc6d21 and 951b08c differ in one condition inside the /stories block of the layer; 951b08c and the final core differ only inside the nav block, which runs on /account and /submit alone. So every row was measured with the code the final core runs on that page.

| set | build of the new core, by page |
|---|---|
| standard | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile, home, Balkans, Lisbon, Southern Africa |
| CPU 4x | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile |
| stress | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile |
| other pages | bdc6d21: all pages |
| first paint | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile, Balkans |
| finished page | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile, home, Balkans, Lisbon, Southern Africa, /travelers, /the-map, /for-expats, /about, /layovers, /the-paw-passport, /cookies, /login, /signup |
| parser held | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile |
| failure cases | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile |
| other screens | final core: /account, /submit; 951b08c: /stories; bdc6d21: profile |

### Standard (no throttle), 5 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 390 | 0.0119 (0.0000) | 0.0119 | 0 of 5 | 0.0119 (0.0000) | 0.0119 | 0 of 5 | 136 / 148 | 396 / 408 | yes |
| /account 1440 | 0.3007 (0.3007) | 0.3007 | 5 of 5 | 0.0037 (0.0037) | 0.0037 | 0 of 5 | 140 / 144 | 168 / 176 | yes |
| /submit 390 | 0.1437 (0.0000) | 0.1437 | 5 of 5 | 0.0002 (0.0000) | 0.0003 | 0 of 5 | 148 / 132 | 148 / 132 | yes |
| /submit 1440 | 0.0552 (0.0552) | 0.0552 | 0 of 5 | 0.0003 (0.0003) | 0.0003 | 0 of 5 | 136 / 152 | 136 / 152 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0000) | 0.0763 | 0 of 5 | 0.0004 (0.0000) | 0.0004 | 0 of 5 | 148 / 152 | 220 / 212 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 5 of 5 | 0.0008 (0.0008) | 0.0019 | 0 of 5 | 144 / 168 | 208 / 228 | yes |
| /stories 390 | 0.0284 (0.0002) | 0.0362 | 0 of 5 | 0.0073 (0.0002) | 0.0079 | 0 of 5 | 200 / 184 | 592 / 304 | yes |
| /stories 1440 | 0.1114 (0.1114) | 0.1114 | 4 of 5 | 0.0311 (0.0311) | 0.0311 | 0 of 5 | 192 / 200 | 192 / 200 | yes |
| / 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0000 (0.0000) | 0.0000 | 0 of 5 | 200 / 164 | 200 / 164 | yes |
| / 1440 | 0.0005 (0.0005) | 0.0005 | 0 of 5 | 0.0005 (0.0005) | 0.0005 | 0 of 5 | 192 / 200 | 192 / 200 | yes |
| story: Balkans 360 | 0.0196 (0.0000) | 0.0196 | 0 of 5 | 0.0088 (0.0000) | 0.0155 | 0 of 5 | 156 / 156 | 156 / 156 | yes |
| story: Balkans 390 | 0.0034 (0.0000) | 0.0034 | 0 of 5 | 0.0000 (0.0000) | 0.0000 | 0 of 5 | 132 / 164 | 184 / 192 | yes |
| story: Balkans 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 184 / 172 | 184 / 172 | yes |
| story: Lisbon 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0001 (0.0000) | 0.0001 | 0 of 5 | 144 / 148 | 192 / 184 | yes |
| story: Lisbon 390 | 0.0038 (0.0000) | 0.0040 | 0 of 5 | 0.0005 (0.0000) | 0.0005 | 0 of 5 | 144 / 164 | 176 / 180 | yes |
| story: Lisbon 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 156 / 168 | 156 / 168 | yes |
| story: Southern Africa 360 | 0.0041 (0.0000) | 0.0041 | 0 of 5 | 0.0001 (0.0000) | 0.0001 | 0 of 5 | 144 / 152 | 176 / 188 | yes |
| story: Southern Africa 390 | 0.0057 (0.0000) | 0.0057 | 0 of 5 | 0.0002 (0.0000) | 0.0002 | 0 of 5 | 160 / 172 | 192 / 196 | yes |
| story: Southern Africa 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 0.0001 (0.0001) | 0.0001 | 0 of 5 | 180 / 140 | 180 / 140 | yes |

### CPU 4x slower, 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 390 | 0.0119 (0.0119) | 0.0119 | 0 of 3 | 0.0119 (0.0119) | 0.0119 | 0 of 3 | 440 / 368 | 1168 / 1156 | yes |
| /account 1440 | 0.3008 (0.3008) | 0.3008 | 3 of 3 | 0.0037 (0.0037) | 0.0037 | 0 of 3 | 412 / 340 | 552 / 896 | yes |
| /submit 390 | 0.1439 (0.0000) | 0.1439 | 3 of 3 | 0.0002 (0.0000) | 0.0002 | 0 of 3 | 424 / 300 | 424 / 300 | yes |
| /submit 1440 | 0.0554 (0.0554) | 0.0554 | 0 of 3 | 0.0003 (0.0003) | 0.0003 | 0 of 3 | 476 / 340 | 476 / 340 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0001) | 0.0763 | 0 of 3 | 0.0004 (0.0001) | 0.0004 | 0 of 3 | 408 / 456 | 536 / 612 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 3 of 3 | 0.0019 (0.0019) | 0.0019 | 0 of 3 | 388 / 404 | 556 / 532 | yes |
| /stories 390 | 0.0284 (0.0257) | 0.0284 | 0 of 3 | 0.0073 (0.0052) | 0.0073 | 0 of 3 | 492 / 488 | 3000 / 2844 | yes |
| /stories 1440 | 0.0655 (0.0655) | 0.0657 | 0 of 3 | 0.0300 (0.0300) | 0.0311 | 0 of 3 | 496 / 560 | 496 / 560 | yes |

### Stress: jQuery answer held 600 ms (a paint lands before the end-of-body scripts and the page-parsed event), 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 390 | 0.3000 (0.2407) | 0.3000 | 3 of 3 | 0.0938 (0.0819) | 0.0938 | 0 of 3 | 136 / 132 | 400 / 388 | yes |
| /account 1440 | 0.0692 (0.0692) | 0.0693 | 0 of 3 | 0.0184 (0.0184) | 0.0184 | 0 of 3 | 140 / 140 | 400 / 404 | yes |
| /submit 390 | 0.1439 (0.1437) | 0.1441 | 3 of 3 | 0.0003 (0.0000) | 0.0003 | 0 of 3 | 108 / 128 | 108 / 152 | yes |
| /submit 1440 | 0.0554 (0.0554) | 0.0554 | 0 of 3 | 0.0004 (0.0004) | 0.0004 | 0 of 3 | 116 / 132 | 116 / 132 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0763) | 0.0763 | 0 of 3 | 0.0004 (0.0001) | 0.0004 | 0 of 3 | 144 / 160 | 196 / 208 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 3 of 3 | 0.0019 (0.0019) | 0.0019 | 0 of 3 | 132 / 156 | 192 / 216 | yes |
| /stories 390 | 0.0284 (0.0257) | 0.0284 | 0 of 3 | 0.0073 (0.0052) | 0.0073 | 0 of 3 | 240 / 204 | 976 / 276 | yes |
| /stories 1440 | 0.0498 (0.0498) | 0.0498 | 0 of 3 | 0.0311 (0.0311) | 0.0311 | 0 of 3 | 220 / 216 | 220 / 216 | yes |

### The part A pages and five more pages (of part B only the Menu button piece runs there), 3 loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /travelers 390 | 0.1234 (0.0128) | 0.1238 | 3 of 3 | 0.0100 (0.0050) | 0.0100 | 0 of 3 | 140 / 112 | 140 / 112 | yes |
| /travelers 1440 | 0.1412 (0.1412) | 0.2407 | 3 of 3 | 0.0058 (0.0058) | 0.0058 | 0 of 3 | 144 / 116 | 144 / 116 | yes |
| /the-map 390 | 0.1396 (0.0000) | 0.1396 | 3 of 3 | 0.0000 (0.0000) | 0.0000 | 0 of 3 | 140 / 116 | 216 / 148 | yes |
| /the-map 1440 | 0.1236 (0.1236) | 0.3594 | 3 of 3 | 0.0110 (0.0110) | 0.0114 | 0 of 3 | 128 / 144 | 220 / 176 | yes |
| /for-expats 390 | 0.0772 (0.0000) | 0.0772 | 0 of 3 | 0.0049 (0.0000) | 0.0096 | 0 of 3 | 148 / 152 | 184 / 152 | yes |
| /for-expats 1440 | 0.0391 (0.0391) | 0.0391 | 0 of 3 | 0.0001 (0.0001) | 0.0001 | 0 of 3 | 144 / 140 | 148 / 140 | yes |
| /about 390 | 0.0439 (0.0000) | 0.0457 | 0 of 3 | 0.0002 (0.0000) | 0.0003 | 0 of 3 | 128 / 124 | 128 / 124 | yes |
| /about 1440 | 0.0365 (0.0365) | 0.0578 | 0 of 3 | 0.0006 (0.0006) | 0.0008 | 0 of 3 | 120 / 132 | 120 / 132 | yes |
| /layovers 390 | 0.0385 (0.0000) | 0.0390 | 0 of 3 | 0.0000 (0.0000) | 0.0146 | 0 of 3 | 120 / 112 | 120 / 112 | yes |
| /layovers 1440 | 0.0146 (0.0146) | 0.0146 | 0 of 3 | 0.0014 (0.0014) | 0.0146 | 0 of 3 | 136 / 144 | 136 / 144 | yes |
| /the-paw-passport 390 | 0.0222 (0.0000) | 0.0558 | 0 of 3 | 0.0188 (0.0000) | 0.0188 | 0 of 3 | 140 / 124 | 168 / 180 | yes |
| /the-paw-passport 1440 | 0.0080 (0.0080) | 0.0080 | 0 of 3 | 0.0080 (0.0080) | 0.0080 | 0 of 3 | 148 / 160 | 216 / 196 | yes |
| /cookies 390 | 0.0034 (0.0000) | 0.0038 | 0 of 3 | 0.0000 (0.0000) | 0.0000 | 0 of 3 | 128 / 108 | 128 / 108 | yes |
| /cookies 1440 | 0.0001 (0.0001) | 0.0001 | 0 of 3 | 0.0001 (0.0001) | 0.0006 | 0 of 3 | 136 / 140 | 136 / 140 | yes |
| /login 390 | 0.0636 (0.0000) | 0.0636 | 0 of 3 | 0.0057 (0.0000) | 0.0057 | 0 of 3 | 128 / 112 | 128 / 112 | yes |
| /login 1440 | 0.0023 (0.0023) | 0.0036 | 0 of 3 | 0.0023 (0.0023) | 0.0024 | 0 of 3 | 124 / 132 | 124 / 132 | yes |
| /signup 390 | 0.0036 (0.0000) | 0.0412 | 0 of 3 | 0.0076 (0.0000) | 0.0113 | 0 of 3 | 116 / 140 | 116 / 140 | yes |
| /signup 1440 | 0.0016 (0.0016) | 0.0084 | 0 of 3 | 0.0003 (0.0003) | 0.0017 | 0 of 3 | 136 / 124 | 136 / 124 | yes |

### First paint, 8 more loads a cell

CLS counts every layout-shift entry (the input-excluded median is in brackets). Control = www HTML with the live 16.66.0 core routed from a local copy; new = the same HTML with the 16.67.0 core (parts A and B). FCP and LCP are medians in ms.

| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | LCP control / new | boxes equal |
|---|---|---|---|---|---|---|---|---|---|
| /account 1440 | 0.3007 (0.3007) | 0.3007 | 8 of 8 | 0.0037 (0.0037) | 0.0037 | 0 of 8 | 146 / 148 | 174 / 186 | yes |
| /submit 390 | 0.1438 (0.0000) | 0.1439 | 8 of 8 | 0.0002 (0.0000) | 0.0003 | 0 of 8 | 134 / 144 | 134 / 144 | yes |
| /contributors/<profile> 390 | 0.0763 (0.0000) | 0.0763 | 0 of 8 | 0.0004 (0.0000) | 0.0004 | 0 of 8 | 126 / 140 | 172 / 194 | yes |
| /contributors/<profile> 1440 | 0.1178 (0.1178) | 0.1178 | 5 of 8 | 0.0008 (0.0008) | 0.0019 | 0 of 8 | 140 / 146 | 214 / 212 | yes |
| /stories 390 | 0.0284 (0.0002) | 0.0362 | 0 of 8 | 0.0073 (0.0002) | 0.0073 | 0 of 8 | 202 / 210 | 598 / 306 | yes |
| /stories 1440 | 0.0804 (0.0804) | 0.1140 | 4 of 8 | 0.0311 (0.0311) | 0.0311 | 0 of 8 | 204 / 206 | 204 / 206 | yes |
| story: Balkans 390 | 0.0034 (0.0000) | 0.0034 | 0 of 8 | 0.0000 (0.0000) | 0.0000 | 0 of 8 | 156 / 150 | 190 / 178 | yes |

Loads over 0.1 with the new core: none in these five sets (253 loads). In the smaller sets (106 more loads) three: the profile at 1440 with the parser held inside the hero (0.102, control 0.156; "What is left", 6), and two pages with broken code (/submit at 390 with the site head script throwing, 0.141; /stories at 390 with our chunk not loading, 0.117, control 0.148; see the failure cases).

Largest paint:
- /stories at 390 is earlier (about 300 ms against about 550): the lead card and its photo have their final size from the first paint.
- /account at 1440: the same element with both cores, the greeting line of the member dashboard, which the page shows for a moment even to a signed-out visitor ("Found on the way", 7). At CPU 4x it is painted later with the new core (see "The finished page", last point).
- At CPU 4x the /stories 390 figure is 2.2 to 3.0 s with either core (the lead photo); the two sets of 3 loads do not separate the cores.


## The finished page

Checked on every load above and, with the body tree and the head, on one more load a cell (`fix-b/extra.md`).

- The list of every laid-out box at the end of the load (position and size) equals the control in these cells: the eight cells in scope, home, the three stories at 360, 390 and 1440, the four part A pages and five more pages (/layovers, /the-paw-passport, /cookies, /login, /signup), at 390 and 1440. In the standard, CPU 4x and stress sets every cell ended in one state, the same with both cores. In the one-load set three control loads differed from the new core's load by an inline size the site's own type floor or touch target script had written (profile 390, Balkans 390, Lisbon 360); four more loads a cell with each core were equal in all 24. /stories at two other screen sizes: see the card photos point below.
- The body tree (tags, attributes, text) and the list of the head's children at the end of the load equal the control in those cells, with the same three control loads apart. Nothing of this layer is left in the page: no stand-in, no style, no attribute. (On /travelers the head keeps part A's `style#tll-fp-title-v1`, as reported in part A.)
- In these cells no image file is asked for that the control does not ask for. In two cells it asks for fewer (profile 390: 19 against 20; /stories 1440: 70 against 72).
- **Card photos far below the screen on /stories (a lab effect).** The card photos are lazy, and which ones the browser asks for depends on where the cards sit before the page's scripts sort them. With the lead card in place early that differs by a few cards far down the page. In the lab a photo that is not in the local cache is aborted, and the site then shows its no-photo panel on that card, which is taller. Three cells end with a different box list for that reason alone: /stories at 768x1024 (22 photos aborted with the new core, 24 with the control) and at 1440x1200 (2 against 5), and /stories at 1440 with `tll-lib-lead-v1` throwing (one card more with the new core: it sat 3,888 px down before the sort, against 3,996 px with the control). At 768x1024 the control itself ended in two different states in two runs. With the uncached photos answered by a local picture instead of aborted, all three cells end with the same box list and body tree as the control (`fix-b/extra.md`).
- What a reader can see differently while the page loads, by design: the Menu button, the nav on /account and /submit, the merged search row, the lead card and the profile head are there from the first paint instead of arriving at the page-parsed event. On the profile the home base is not in the head before the page code has run (on www it is not there either before that).
- One more, on /account only. The page shows the empty member dashboard to every visitor as soon as its own script has run ("Found on the way", 7). With the new core it shows when the page is parsed instead, because until then the nav's early style keeps the rest of the wrapper hidden. In a standard load that is the same moment (the greeting line is painted at 176 ms against 168, medians of 5 loads). At CPU 4x it is about 0.34 s later (896 ms against 552, 3 loads), and it will be later by as long as the scripts at the end of the page take to arrive. A signed-out visitor sees less of a dashboard that is not meant for them. A signed-in member on a slow phone sees the empty dashboard that much later; its content comes when Memberstack has answered, as before.

## Failure cases and other sets

Tables in `fix-b/extra.md`. In short:

- **Page code missing or throwing** (11 cases: each of the two site head scripts, the two /stories scripts, our stories chunk, the two profile scripts; 23 cells at 390 and 1440): the finished page (boxes, body tree, head) equals the control with the same fault in 22 of the 23 cells. One cell differs in the lab: /stories at 1440 with `tll-lib-lead-v1` throwing, by one card photo far down the page (the card photos point above). The layout shift of a broken page can be higher than the control's, because what went in early is taken out again: /submit with the site head script throwing moves 0.14 at 390 (0.05 at 1440) when the nav's early style is removed and the nav is hidden again (the control never shows the nav at all in that case). /stories without `tll-lib-lead-v1` and the profile without its script move 0.02 to 0.07 for the same reason (control 0.005 to 0.03).
- **Parser held for 350 ms at 11 points** (a paint lands there): the finished page equals the control at every point. /stories (6 points): 0.006 to 0.008 at 390 and 0.020 to 0.030 at 1440 (control 0.027 to 0.029 and 0.040 to 0.093). /submit after the nav: 0.0000 and 0.0001 (control 0.144 and 0.055). The profile after the hero and before the story list: 0.0004 at 390, 0.002 at 1440 (control 0.076 and 0.118). Two points stay high: the profile inside the hero (0.057 at 390, 0.102 at 1440; control 0.129 and 0.156; item 6 below) and /account after the nav at 390 (0.094; control 0.261; item 5 below; 0.019 at 1440).
- **Other screens** (360x800, 412x915, 390x1100, 768x1024, 1440x1200), one load a cell. /account 1440x1200: 0.003 (control 0.300); the four phone and tablet sizes 0.004 to 0.009 with either core (item 4 below). /submit: 0.0000 to 0.009 (control 0.092 to 0.197). Profile: 0.0004 to 0.008 at the four phone and tablet sizes (control 0.011 to 0.334), 0.039 at 1440x1200 (control 0.182). /stories: 0.008 at 360x800 and 390x1100 (control 0.018 to 0.040), 0.031 at 768x1024 (control 0.031), 0.029 at 1440x1200 (control 0.043), 0.099 at 412x915 (control 0.117). The high ones are item 10 below.

## What is left, and why

Numbers are from the standard loads with the new core unless noted.

1. **The story count in the /stories title (our chunk `tll-stories-count-v1`).** Written when the page is parsed: the rose word moves 129 px at 1440 (0.016) and 43 px at 390 (0.005). Not written early, see "Found on the way", 3. It is the largest single entry left on /stories. A fix needs the number on the page before the title is painted (proposal below).
2. **Font jumps on /stories (C7, C10), left alone as agreed.** The title is 7 px shorter in Playfair than in its fallback faces at 1440 (0.013) and 4 px at 390 (0.007, or 0.020 when it lands in one frame with the other fonts); the chips and the nav change width when Plex arrives (0.003). The lab's fallback fonts are Liberation, not Georgia or Arial, so these sizes are the lab's. The title's own font stack has none of the site's fitted fallback faces (proposal below).
3. **Profile, after the stand-in has gone.** The home base comes in with the page code and goes out again when the Worker answers (0.0007 at 1440x900; on a taller phone screen the meta line is on screen and wraps one line more while the home base is there, see the other screens in `fix-b/extra.md`). The More links block of our profile chunk (`tll-pf-linkstack-v1`, 50 ms after the page-parsed event), the owner's Edit profile button and the album section (about 1 s, below the screen in the lab) come in as before; the lab profile has no More links. The About section is hidden by the page code when the bio is empty, and the pet section is shown or hidden, at the page-parsed event as before.
4. **/account, the sign-in links in the nav.** The page's gate rule hides every signed-out block, the nav's Log in and Sign up included, until the gate script has decided the visitor is signed out. They show after load: 0.012 at 390 (the button row wraps to a second line), 0.004 at 1440. The same with the control. Not touched: this is the page's sign-in gate.
5. **/account, the gate card with a paint before the end of the page.** The page script at the end of the body adds two lines and a link to the gate card. When the card is already on screen (stress set and held parser: Memberstack has answered before the page is parsed) it grows and moves: 0.08 at 390 with either core. In the standard and CPU 4x loads the card shows after that script has run.
6. **A paint inside the profile hero's own markup.** With the parser held between the photo and the text column, the photo is painted alone and moves when the column arrives (0.057 at 390 and 0.102 at 1440; the control 0.129 and 0.156). The hero is about 1 KB of markup.
7. **The place chips on /stories (our chunk `tll-stories-places-v1`).** Three chips are added and the row is put in A to Z order at the page-parsed event, as before. Not counted by the browser at 390 and 1440; from about 600 to 900 px the longer row takes a second line and pushes the grid down 52 px. Not put in early, see "Found on the way", 3.
8. **The card order on /stories below the lead.** The page's chip script sorts the cards newest first at the page-parsed event, as before. The first five are in that order already; the rest change places below the screen. Not counted by the browser (see "Found on the way", 1).
9. **Signed-in members.** The lab is signed out. For a signed-in member the Menu piece does the same, and the nav piece sets the same style until the page is parsed, or until Memberstack has answered (`html.ms-loaded`) if that comes first. What a signed-out lab can show of the member's page was compared: the dashboard markup on /account when the page is parsed is the same with both cores (`fix-b/extra.md`). A check with a real signed-in session before release would close this.
10. **Seen at other screen sizes, not part of this work:** 
   - /stories at 412x915: 0.099 (control 0.117). At this width the title takes one more line when Playfair arrives, 29 px, with either core: the C7 font jump, left alone as agreed. With the fonts blocked the same line is added when our chunk writes the story count (33 px, 0.110). The lab's fallback faces are not a phone's, so whether a phone wraps here is not known from the lab. Worth a look on a real phone at this width.
   - /submit at 412x915: 0.0002 in the load in the table, but 0.050 in an earlier load (build bdc6d21). A font jump that lands in some loads: 0.000 with the fonts blocked (C10).
   - /submit on tall screens (390x1100, 768x1024, 1440x1200): 0.006 to 0.009. A block of the form near the bottom of the page gets 56 px shorter when the page code runs.
   - Profile at 1440x1200: 0.037. A section 1,000 px down is taken out about 1 s into the load (our profile chunk and the album; item 3). Below the screen at 1440x900.
   - Profile at 390x1100 and 768x1024: 0.005 and 0.008, the home base going out again (item 3).
11. **Not looked into:** /login and /signup form jumps (survey: one load in five at 390), /layovers and /the-paw-passport font jumps (C10).

## Proposals for page and site code (not made)

- **Nav on /account and /submit (C1):** in the Designer, put the nav in front of the members wrapper on these two pages, as it is on every other page. `navOut()` and the core's nav piece can then go.
- **Menu button (C9):** have the button in the nav markup (shown under 900 px by the existing rule) and let the site head script only wire it. The stand-in can then go.
- **/stories page code (C6):** put the search form inside the filter row in the Designer instead of moving it by script; sort the story list newest first in the Designer so the chip script's sort changes nothing on load; add the three missing place chips in the Designer in the chunk's order. The lead mark could then be one CSS rule on the first card when no pick is set.
- **/stories story count:** render the Site stats item (`[data-tll-site-stats]`, the one-item list `tll-self-data-v1` already reads) in the /stories hero. The count is then on the page before the title is painted, and the chunk (or the core) can write it at once. Nothing typed.
- **/stories title fonts (C7):** add `TLLSerifG,TLLSerifN,TLLSerifT` after Playfair Display in `--s3-head` (page head style `tll-s3-stories-v1`), as every other Playfair stack on the site has them. The title would then take the room of Playfair while the font loads. To be measured on real phones.
- **Profile (C3):** move the hero part of `tll-pf5-profile-js-v1` into an embed right after the hero (where `tll-pf5-n-v1` already sits) and run it at once, not at the page-parsed event. The core's stand-in can then go.
- **Profile home base (core `tll-phase0-v1`, ours):** take the home base out in the same task the hero is built, and put it in only when the Worker says the member has switched it on. Today it shows for about 0.3 s on every profile. A core change with its own test; not made here because it changes what a reader sees during the load.
- **Profile STORIES figure (site head `tll-live-stories-v1`):** skip /contributors/ pages, as the script already skips /account. The site total would no longer be written over the member's own count for a moment.
- **/account gate:** put the gate card's two lines and its back link into the Designer markup, and narrow the rule that hides signed-out blocks to the gate card, so the nav's sign-in links are not held back.
- **/account dashboard shown to signed-out visitors for a moment:** in the page's Account 3.0 style, let the grid rule apply only once Memberstack has said the visitor is a member (`html.ms-loaded.a3-on [data-ms-content=members].a3-grid`), so the site's hide rule holds until then.
- **/account page script:** have `tll-a3-account-js-v1` take the dashboard wrapper by its place (`.tll-account-wrap > [data-ms-content="members"]`) instead of the first member block in the document, so it no longer depends on where the nav sits.

## Cost

- Core size: 276,440 bytes against 260,880 after part A (gzip 83,578 against 78,220). The layer goes into the core without its comments (15,560 bytes of code). On every page.
- First paint: at normal speed no cell is more than 24 ms later. Medians per cell over the standard, finished-page, other-pages and first-paint sets (4 to 14 loads a cell and core, 37 cells): between 44 ms earlier and 24 ms later than the control; the eight cells in scope between 2 ms earlier and 24 ms later. Over all 242 loads a core the median is 148 ms with the control and 148 ms with the new core. Single sets of 5 loads scatter by about 30 ms either way with the same core (a frame is 16 ms), which is why the per-set columns above show differences of that size in both directions. At CPU 4x the three-load sets scatter too much to read. Six more loads a core on the three cells that looked later (core 951b08c): the profile at 390: 434 ms against 402 (+32); /stories at 390: 528 ms against 486 (+42); /stories at 1440: 522 ms against 516 (+6). So on a slow phone the first paint of the profile and of /stories at phone width is about 30 to 40 ms later, out of about 450 ms. The next point says where that goes.
- Work while the page is parsed: the layer runs once for each batch of nodes the parser adds (39 to 63 runs a load), until its pieces are in. Measured with a timer around each run (core bdc6d21 with the timer added, 26 loads): /account, /submit, home and a story 0.2 to 0.5 ms a load in total (up to 4.6 ms at CPU 4x); the profile 1.3 to 2.3 ms (7.6 to 11.0 at CPU 4x); /stories 18 to 33 ms, the longest single run 32 ms (at CPU 4x 77 to 100 ms, longest 53). On /stories nearly all of it is two steps that ask the browser for computed styles (the title's font, and whether a card is shown, once the whole grid has arrived); each makes the browser work out the styles of everything parsed so far. The browser has to do that work for its next frame in any case, so only part of it is added, but it is done earlier and in one piece. That is the likely source of the later first paint on /stories at CPU 4x (on the profile the stand-in itself has to be styled and painted). Not made lighter in this round. On a page with none of its pieces the layer sets up nothing. With the Menu piece alone it watches until the page is parsed, and each run is one check that the stand-in is still last in its row.
- Bandwidth: no new request and none earlier than before, with one small exception. The stand-ins ask for no file. The exception: on /stories the set of lazy card photos the browser asks for can differ by a few cards far below the screen, in both directions (two fewer in the standard 1440 load, one more at 1440 when `tll-lib-lead-v1` throws; see "The finished page").

## Method

- Harness: `fix-b/harness/h2.cjs`, the part A harness unchanged (documents from the saved www HTML, the core tag routed to a local core with integrity removed in the routed HTML only, chunks from the git objects of pin 3df16988 with SRI intact, Webflow css, js, images and fonts from the local caches, anything not cached aborted, every non-GET aborted, ads and analytics answered empty, Memberstack patched as before, Math.random seeded). No new GET to a Webflow host in this part: the HTML copies of the survey and of part A are reused. `ev-dom.js` gives the body tree and the head list at the end of a load.
- Chromium headless, one browser at a time, fresh context per load. 390x844 and 360x800: Android UA, isMobile, hasTouch, dsf 3. 1440x900: desktop UA, dsf 1.
- CLS: sum of all layout-shift entries until at least 4 s after load and 5 s after navigation start. Every entry is counted; the input-excluded median is in brackets in the tables.
- Sets (final core: 263014e): standard (5 loads a cell: the eight scope cells, home, three stories at 360, 390 and 1440), CPU 4x and stress (3 loads a scope cell), the part A pages and five more pages (3 loads a cell), first paint (8 more loads a cell on seven cells), finished page (1 load a cell on all 37 cells, with the body tree and head), parser held (11 points), failure cases (11 cases, 23 cells), other screens (5 sizes a scope page). 718 loads in these sets, half of them control. The /stories cells of every set were run again after the lead card change and the /account and /submit cells after the nav piece was rewritten; see "Results" for which build each row is from. Smaller checks named in the text (`out` files `g-*`): four more finished-page loads on four cells (dom2), fonts blocked at 412x915 and a card trace at 1440 (diag), uncached photos answered locally (ph), the members wrapper when the page is parsed (a3), work per run of the layer (tt), first paint at CPU 4x with 6 loads (cpufcp2).
- Files: `fix-b/table.md`, `fix-b/cells.json`, `fix-b/loads.csv` (one row per load), `fix-b/extra.md`, `fix-b/harness/`.
- Limits: Chromium only; lab fonts (Liberation, no Georgia or Arial); documents served whole from disk, so the stress and held-parser sets stand in for a network; ads answered empty; signed-out only; one contributor profile.
- No Webflow tool call, no publish, no non-GET request, no form sent. Webflow hosts in this part: 0 bytes.
