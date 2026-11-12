# build: font loading jump (12 Nov 2026)

Work folder: /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/fonts/build

Nothing was written to Webflow, published, committed or pushed. No build script was run inside /home/user/thatlayoverlife: every build was made in a private copy of the repo's src (git archive of HEAD) in this folder. Every non-GET request was aborted in the browser.

## Verdicts

1. **Home page font shift is gone on phones and desktop once both halves are in.** Layers fix plus the proposed Webflow change: 390 fresh 0.117 to 0.004, slow 4G 0.197 to 0.004; 360 fresh 0.096 to 0.004, slow 4G 0.109 to 0.004; 1440 fresh 0.131 to 0.000, slow 4G 0.132 to 0.000; restored reloads 0.000 to 0.003. What is left (0.003 to 0.004 on phones) is the MENU button the phone-nav layer injects, not fonts.
2. **The layers fix alone does most of it** (390 fresh 0.117 to 0.015, slow 4G 0.197 to 0.015; 1440 0.131 to 0.061). The rest is text styled only by Webflow code: the nav logo, the hero headline's italic word (the head code's `h1 *` rule) and the home embeds.
3. **The look is unchanged.** Screenshots after the fonts load at 1440 and 390, deviceScaleFactor 1: hero, value section and story body pixel-identical before and after, and all 849 text boxes on home and the story page keep their position, size, font, weight and style.
4. **Text is not invisible longer than today.** Paired medians over 110 runs each: Plex body text invisible +0 ms (fast) and +10 ms (slow 4G, quartiles -96 to +118) with both halves in; Plex arrives at the same time.
5. **N9 (value section after the library on phones) now meets the home reviewer's bar in 11 of 12 restored-reload cases with both halves in, but not in all 12.** The one miss, 360x800 restored at 4,000 px (+0.169), is not fonts: with every web font blocked it is still there in every variant (a bimodal 0.01 / 0.07 / 0.29 settle of the photo interlude figure.h3-il and the Layover guides band). With the layers fix alone, N9 misses 3 of 12. My verdict: N9 is ready to switch on after the Webflow change goes in; strictly by the bar it still fails one case, for a reason that is not N9's or the fonts'. Details in "N9" below.
6. **Story and /travelers**: the font part is small there and their totals are dominated by two non-font causes found on the way (the story hero photo is `loading="lazy"` with no reserved box, about half of all loads shift 0.4 to 1.2; /travelers gets a 135 px push when its chunk restyles the page). The fix does not make either worse. See "Found on the way".

## Files changed in the repo (not committed)

All under /home/user/thatlayoverlife:

- **src/site-layers/tll-font-fallbacks-v1.html** (new): style `tll-font-fallbacks-v1`, ten `@font-face` rules for local fallback faces sized like the web fonts (TLLSansA: Arial, Helvetica, Liberation Sans, Arimo; TLLSansR: Roboto; TLLSerifG: Georgia, Gelasio; TLLSerifN: Noto Serif; TLLSerifT: Times New Roman, Liberation Serif, Tinos), each with size-adjust and ascent and descent overrides from the font files (the investigation's metrics.json) and the unicode-range of the Google Fonts files they stand in for (latin, latin-ext, vietnamese), plus `:root,body{...}` giving the same fallbacks to Webflow's Designer font variables (`--_typography---tll-font-body`, `--_typography---font--body-font`, `--_typography---font--button-font`, `--_typography---tll-font-display`), each with its own first family and the rest of its stack unchanged.
- **src/site-layers/build-site-layers-v16.py**: the new style goes first in STYLES; a new `fallbacks()` puts `TLLSansA,TLLSansR` after every quoted `IBM Plex Sans Condensed` or `DM Sans` and `TLLSerifG,TLLSerifN,TLLSerifT` after every quoted `Playfair Display` that a comma follows, in every layer, style, the story layer and the cover layer as they are built (141 stacks today; layer sources keep their plain stacks). Where `'DM Sans'` directly follows Plex the names go after DM Sans only (see "Two things I changed along the way"). Docstring updated.
- **src/site-layers/tll-home-value-v1.js**: `.tll-val h2` `max-width:18ch` to `11.88em`, `.tll-val-lede` `60ch` to `32.4em`, with a comment. Nothing else in the file changed; `N9_PHONES_AFTER_LIBRARY` is still `false`.
- **src/site-layers/tll-masthead-v1.html**: `max-width:34ch` to `21.76em` (Playfair 800 italic "0" is 0.64 em), comment added.
- **src/design/magazine-2026-10/cover-build/cover.template.html** and **tll-mag-cover-v1.html** (same edit in both; I ran build-cover.py in my private copy and its output is byte for byte my edited tll-mag-cover-v1.html): hero h1 `max-width:12ch` to `7.92em`, promise line `36ch` to `19.44em`, comment added. Checked on the 16.62.0 cover (one subhead): both rules are there.
- **src/design/magazine-2026-10/story-build/tll-mag-story-v1.html**: `.tll-story-excerpt` `44ch` to `23.76em`, desktop `h1.tll-story-title` `16ch` to `10.56em`, comment added.

Why em for ch: a ch is the "0" of the first font that is loaded, so a ch width shrinks while a fallback shows and the lines rewrap when the web font arrives. Playfair 800 "0" = 0.66 em, Plex Condensed "0" = 0.54 em, so the em values are the same widths once loaded (the screenshots confirm it).

Not changed: the built files (tll-site-layers-v16.js and chunks/). The release step has to run `python3 src/site-layers/build-site-layers-v16.py` as usual. My private build of these sources: core sha384-H+oSdrkcwOOlCvbyOd9Xm+EvqvWHK8Z0lJRpRfsE//z/ZWm7d2GXDxMktP77zztd, 226 KB (67.1 KB gzip, +2.4 KB gzip on 16.62.0, mostly the unicode-range lists and the comment); only the travelers chunk changes besides the core (home, story and site chunks change only by the inserted names). Tests: 433 of 433 pass in the repo with these sources; 427 of 427 in my copy (feed-flags needs scripts/, same failure on HEAD).

## The proposed Webflow change (exact)

The full list is /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/fonts/build/webflow-proposal.json: 44 find-and-replace edits in 18 code blocks, each with the block id, where it lives, the exact find and replace text, its order inside the block and how many occurrences to replace. It was generated from www as fetched today and re-checked against www after 16.62.0 went live (core 6ebffe0): every block is unchanged and applying the list reproduces, byte for byte, the pages I measured as "LW". The edits only insert the same fallback names after the web font name (same rule as the build) and turn ch widths of Plex and Playfair text into the same length in em. The names do nothing until the core with `tll-font-fallbacks-v1` is live, so the two can go out in either order.

Priority 1, the ones that matter on the home page (block, occurrences, before => after):

- tll-home-hero-phone-v1 x1 | font-family:'IBM Plex Sans Condensed',system-ui,sans-serif !important => font-family:'IBM Plex Sans Condensed',TLLSansA,TLLSansR,system-ui,sans-serif !important
- tll-home-hero-phone-v1 x1 | max-width:46ch !important => max-width:24.84em !important
- tll-home3-v1 x1 | --h3-body:'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif => --h3-body:'IBM Plex Sans Condensed',TLLSansA,TLLSansR,'IBM Plex Sans',system-ui,sans-serif
- tll-home3-v1 x1 | line-height:1.55;color:var(--h3-text2);max-width:52ch; => line-height:1.55;color:var(--h3-text2);max-width:28.08em;
- tll-home3-v1 x1 | margin:clamp(36px,6vh,64px) 0 0;max-width:20ch} => margin:clamp(36px,6vh,64px) 0 0;max-width:13.2em}
- tll-home3-v1 x1 | font-family:'Playfair Display',Georgia,serif => font-family:'Playfair Display',TLLSerifG,TLLSerifN,TLLSerifT,Georgia,serif
- tll-home3-v1 x1 | --h3-head:'Playfair Display',Georgia,serif => --h3-head:'Playfair Display',TLLSerifG,TLLSerifN,TLLSerifT,Georgia,serif
- tll-home3-v1 x1 | color:var(--h3-text2);max-width:46ch; => color:var(--h3-text2);max-width:24.84em;
- tll-home3-v1 x1 | margin:26px 0 0;max-width:22ch} => margin:26px 0 0;max-width:14.52em}
- tll-proto-parity-v1 x1 | font-family:'IBM Plex Sans Condensed','DM Sans',system-ui,sans-serif => font-family:'IBM Plex Sans Condensed','DM Sans',TLLSansA,TLLSansR,system-ui,sans-serif
- tll-proto-parity-v1 x1 | --_typography---font--heading-font:'Playfair Display',Georgia,serif => --_typography---font--heading-font:'Playfair Display',TLLSerifG,TLLSerifN,TLLSerifT,Georgia,serif
- tll-proto-parity-v1 x2 | font-family:'IBM Plex Sans Condensed',system-ui,sans-serif => font-family:'IBM Plex Sans Condensed',TLLSansA,TLLSansR,system-ui,sans-serif
- tll-proto-parity-v1 x3 | font-family:'Playfair Display',Georgia,serif !important => font-family:'Playfair Display',TLLSerifG,TLLSerifN,TLLSerifT,Georgia,serif !important
- tll-proto-type-v1 x1 | font-family:'Playfair Display',Georgia,serif !important => font-family:'Playfair Display',TLLSerifG,TLLSerifN,TLLSerifT,Georgia,serif !important

Where: tll-proto-parity-v1 and tll-proto-type-v1 are in Site settings > Custom code > Head code; tll-home3-v1 is the home embed holding that style; tll-home-hero-phone-v1 is the home code holding that style in the body. The parity stack ending `,serif !important` (3 occurrences) includes `.tll-nav-logo-block`, the nav logo on every page, the largest single piece of what the layers cannot reach.

Priority 2 (story template, /travelers, the rest of the home embeds and head code): tll-shelf-fix, tll-proto-parity-js-v1, h3b-expats, h3b-letter, tll-v9-j13-v1, tll-story-extras-v1, tll-st3-story-v1, tll-v9-b04-hero-v1, tv-v2-css. Priority 3 (footer code, below the fold): tll-forms-v2, tll-note-v1-css, tll-pwa-v1-css, tll-a11y-motion-v1, tll-flow-v1 (its hero and atlas rules match nothing on the home page today; its stacks still get the names).

Not in the list: three inline `style` attributes on home with an unquoted `Playfair Display,Georgia,serif` (not shown on load), and Webflow Designer class stacks such as `DM Sans, sans-serif` in the site CSS (Designer cannot hold custom stacks; the ones that read the font variables are covered from the layers).

Optional, from the investigation and not re-measured here: five `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the Plex 400 and 600, Playfair 800 roman and italic and JetBrains Mono files at the top of the site head code (exact text in /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/fonts/inv/fixes.cjs, PRELOAD). It shortens invisible Plex text on slow 4G by about 2 s but adds nothing to the layout shift result above.

## Two things I changed along the way

- **Webflow sets its font variables on `body` again below 992 px**, so a `:root` override does nothing on phones. Found by checking a box that still moved (the value cards' text reads `--_typography---font--body-font`); the rule is `:root,body`. The first full run (820 runs) was thrown away for this.
- **`'IBM Plex Sans Condensed','DM Sans',...` keeps DM Sans second.** With the names between the two, the Plex 400 file arrived about 0.15 s later on slow 4G (paired median over 110 runs) and Plex text stayed invisible about 0.09 s longer: until Webflow's loader adds the Plex faces, the DM Sans alias (same files) is the stack's first loadable font, and asking for it at the first layout is what starts the Plex download early. Putting the names after DM Sans brought both back to today (numbers below). Also: the fallback faces carry a unicode-range, because without it characters the web fonts lack (the arrow U+2192 in "Send your trip →") were drawn from scaled Arial instead of today's font, moving a few buttons by 1 to 2 px.

## How it was measured

- Harness: meas.cjs. The three www pages (home, /stories/spain-madrid-wedding-ibiza, /travelers, fetched once) are served from a local HTTPS server under the real host name, streamed in 8 KB gzip pieces, so parsing, first paint and CDP throttling behave as on www; the core tag points at a private build on the same server. "today" is my private build of HEAD, byte for byte the 16.62.0 core and chunks that www runs now (6ebffe0). New browser context per run, variants interleaved within each run.
- Variants: today; L = layers fix (this build); LW = L plus the Webflow change applied to the page (wf.cjs, the same edits as webflow-proposal.json); LN9 and LWN9 = the same with `N9_PHONES_AFTER_LIBRARY=true` in the private build.
- PerformanceObserver('layout-shift', buffered) installed before any page script; the number is the sum of entries without recent input (session-window CLS is in the summary files and agrees). Sources recorded per entry. 390x844 and 360x800 (hasTouch, DPR 3, isMobile false) and 1440x900; fresh, slow 4G (CDP Network.emulateNetworkConditions 1.44 Mbit/s, 562.5 ms), restored (load, scroll, reload) and restored on slow 4G; five runs per case, medians.
- Memberstack: its app request is a POST, aborted, so Memberstack would hide the nav sign-in block at about 2 s, which a signed-out visitor never sees; memberstack.js is served with that one fail-closed line disabled (as in the investigation). isMobile is false because isMobile:true reports a synthetic input that hides early shifts.
- Final numbers: runs/ (816 runs, final build) and runs-v2/story.jsonl (story with the photo loading). Earlier full runs: runs-v1/ (before the unicode-range), runs-v2/ (before the DM Sans ordering); they agree with the final numbers on home.

## Before and after (median of five runs; today = www as it runs now)

The last column is per case and noisy (single runs differ by hundreds of ms); the pooled, paired numbers are in "Text is never invisible longer than today".

**Home (/)**

| case | today | layers fix (L) | L + Webflow change (LW) | invisible Plex text, today / LW (ms) |
|---|---|---|---|---|
| 390x844 fresh | 0.117 | 0.015 | 0.004 | 626 / 808 |
| 390x844 slow 4G | 0.197 | 0.015 | 0.004 | 2106 / 2140 |
| 390x844 restored at 1,233 | 0.016 | 0.000 | 0.000 | 526 / 0 |
| 390x844 restored, slow 4G at 1,233 | 0.021 | 0.008 | 0.000 | 2215 / 2130 |
| 360x800 fresh | 0.096 | 0.018 | 0.004 | 0 / 358 |
| 360x800 slow 4G | 0.109 | 0.018 | 0.004 | 2091 / 2065 |
| 360x800 restored at 1,233 | 0.000 | 0.000 | 0.000 | 671 / 373 |
| 360x800 restored, slow 4G at 1,233 | 0.043 | 0.043 | 0.000 | 2118 / 2165 |
| 1440x900 fresh | 0.131 | 0.061 | 0.000 | 261 / 316 |
| 1440x900 slow 4G | 0.132 | 0.061 | 0.000 | 2095 / 2063 |
| 1440x900 restored at 1,233 | 0.010 | 0.014 | 0.003 | 65 / 50 |
| 1440x900 restored, slow 4G at 1,233 | 0.036 | 0.035 | 0.003 | 2040 / 2066 |

Where the shift went (sources): today, 390 fresh is the hero words block (#tll-main and the inline-div holding the headline and promise line) dropping as the headline goes from 3 lines to 2, plus the nav row; with L, a 4 to 6 px drop of the same block remains, from the nav logo and the headline's italic word, which only the Webflow head code styles; with LW, only the MENU button injection (0.003) remains. At 1440 the L residual (0.061) is the same 6 px drop of the hero block.

**Story (/stories/spain-madrid-wedding-ibiza), as served.** About half of all story loads, in every variant, have one 0.4 to 1.2 shift when the hero photo arrives (it is `loading="lazy"`, has no width or height, and the story layer sets `aspect-ratio:auto`, so its box is 28 px tall until the photo decodes). Runs with that shift: today 27 of 60, L 29 of 60, LW 28 of 60 (and 31, 27, 27 of 60 in the earlier full run), so the fix does not change it, but it makes these medians flip between about 0.05 and 0.6. Note: this table is from runs-v2 (L is the final build for this page; LW there used the earlier name order before DM Sans, see above).

| case | today | layers fix (L) | L + Webflow change (LW) | invisible Plex text, today / LW (ms) |
|---|---|---|---|---|
| 390x844 fresh | 0.047 | 0.059 | 0.054 | 315 / 368 |
| 390x844 slow 4G | 0.059 | 0.631 | 0.631 | 1445 / 1484 |
| 390x844 restored at 1,233 | 0.245 | 0.193 | 0.229 | 224 / 176 |
| 390x844 restored, slow 4G at 1,233 | 1.308 | 1.184 | 1.184 | 1652 / 1655 |
| 360x800 fresh | 0.071 | 0.071 | 0.059 | 269 / 255 |
| 360x800 slow 4G | 0.620 | 0.042 | 0.044 | 1766 / 1525 |
| 360x800 restored at 1,233 | 0.279 | 0.227 | 0.195 | 557 / 549 |
| 360x800 restored, slow 4G at 1,233 | 0.392 | 1.259 | 1.157 | 1673 / 1803 |
| 1440x900 fresh | 0.012 | 0.011 | 0.013 | 207 / 295 |
| 1440x900 slow 4G | 0.413 | 0.413 | 0.413 | 1676 / 1614 |
| 1440x900 restored at 1,233 | 0.425 | 0.328 | 0.328 | 406 / 407 |
| 1440x900 restored, slow 4G at 1,233 | 0.524 | 0.453 | 0.932 | 1639 / 1628 |

**Story with the hero photo request blocked** (final build, all three variants; isolates the rest of the page from the photo race; blocking the photo adds its own broken-image box, so the absolute level is higher than as served, compare across the row only):

| case | today | layers fix (L) | L + Webflow change (LW) | invisible Plex text, today / LW (ms) |
|---|---|---|---|---|
| 390x844 fresh | 0.288 | 0.281 | 0.278 | 534 / 910 |
| 390x844 slow 4G | 0.283 | 0.279 | 0.296 | 1522 / 1612 |
| 390x844 restored at 1,233 | 0.631 | 0.540 | 0.540 | 298 / 427 |
| 390x844 restored, slow 4G at 1,233 | 0.664 | 0.540 | 0.540 | 1590 / 1637 |
| 360x800 fresh | 0.308 | 0.305 | 0.280 | 451 / 186 |
| 360x800 slow 4G | 0.285 | 0.278 | 0.263 | 1437 / 1557 |
| 360x800 restored at 1,233 | 0.687 | 0.560 | 0.528 | 195 / 437 |
| 360x800 restored, slow 4G at 1,233 | 0.751 | 0.631 | 0.591 | 1621 / 1595 |
| 1440x900 fresh | 0.147 | 0.146 | 0.145 | 183 / 130 |
| 1440x900 slow 4G | 0.145 | 0.144 | 0.144 | 1389 / 1674 |
| 1440x900 restored at 1,233 | 0.370 | 0.351 | 0.304 | 231 / 177 |
| 1440x900 restored, slow 4G at 1,233 | 0.383 | 0.356 | 0.356 | 1550 / 1600 |

The font part on the story page: fresh loads equal within 0.01 to 0.03; restored reloads 0.63 to 0.54 (390), 0.69 to 0.53 (360, 0.56 with L), 0.37 to 0.30 (1440). With the photo loading, runs without the photo shift: restored at 1,233 today 0.237 to 0.193 at 390 and 0.277 to 0.195 at 360. In the as-served table, the 390 slow 4G L and LW cells (0.631) and the 360 restored slow 4G cells are runs where the photo race landed in 3 or more of 5 runs; today's 360 slow 4G cell (0.620) is the same race the other way.

**/travelers**

| case | today | layers fix (L) | L + Webflow change (LW) | invisible Plex text, today / LW (ms) |
|---|---|---|---|---|
| 390x844 fresh | 0.164 | 0.134 | 0.133 | 542 / 641 |
| 390x844 slow 4G | 0.210 | 0.180 | 0.168 | 2008 / 2084 |
| 390x844 restored at 1,233 | 0.245 | 0.280 | 0.227 | 308 / 299 |
| 390x844 restored, slow 4G at 1,233 | 0.493 | 0.502 | 0.443 | 2096 / 1931 |
| 360x800 fresh | 0.116 | 0.113 | 0.160 | 127 / 97 |
| 360x800 slow 4G | 0.168 | 0.173 | 0.171 | 2125 / 1854 |
| 360x800 restored at 1,233 | 0.239 | 0.248 | 0.238 | 207 / 86 |
| 360x800 restored, slow 4G at 1,233 | 0.478 | 0.519 | 0.519 | 1903 / 1753 |
| 1440x900 fresh | 0.187 | 0.345 | 0.131 | 121 / 111 |
| 1440x900 slow 4G | 0.118 | 0.118 | 0.113 | 2183 / 1693 |
| 1440x900 restored at 1,233 | 0.698 | 0.683 | 0.674 | 337 / 147 |
| 1440x900 restored, slow 4G at 1,233 | 0.615 | 0.615 | 0.600 | 1955 / 1793 |

/travelers is dominated by non-font shifts (the travelers chunk restyles the page about 135 px down when it runs, the accepted tradeoff in the build notes; the card grid settles on restored reloads). Single-case medians move both ways by up to 0.15 between runs; paired over all runs per width, L and LW minus today are between -0.032 and +0.013 in this run and between -0.028 and +0.012 in the two earlier full runs, so no change either way. The 1440 fresh L cell (0.345, runs 0.45, 0.14, 0.35, 0.35, 0.29 against today's 0.15 to 0.36) is that noise.

## N9

Bar (the home reviewer's): with N9 switched on, the median restored-reload shift may not be more than 0.02 above today, in every case. Today = www now (16.62.0, N9 off). Rise = N9 column minus today; FAIL = more than +0.02.

| case | today | L | L + N9 | rise | LW | LW + N9 | rise |
|---|---|---|---|---|---|---|---|
| 390x844 restored at 1,233 | 0.016 | 0.000 | 0.011 | -0.005 | 0.000 | 0.005 | -0.011 |
| 390x844 restored at 2,500 | 0.088 | 0.027 | 0.076 | -0.012 | 0.019 | 0.054 | -0.035 |
| 390x844 restored at 4,000 | 0.065 | 0.065 | 0.065 | -0.000 | 0.038 | 0.024 | -0.041 |
| 390x844 restored, slow 4G at 1,233 | 0.021 | 0.008 | 0.015 | -0.007 | 0.000 | 0.004 | -0.017 |
| 390x844 restored, slow 4G at 2,500 | 0.122 | 0.049 | 0.041 | -0.081 | 0.022 | 0.074 | -0.048 |
| 390x844 restored, slow 4G at 4,000 | 0.189 | 0.095 | 0.092 | -0.097 | 0.090 | 0.091 | -0.098 |
| 360x800 restored at 1,233 | 0.000 | 0.000 | 0.008 | +0.007 | 0.000 | 0.007 | +0.007 |
| 360x800 restored at 2,500 | 0.059 | 0.088 | 0.146 | +0.087 FAIL | 0.013 | 0.057 | -0.002 |
| 360x800 restored at 4,000 | 0.075 | 0.083 | 0.162 | +0.086 FAIL | 0.062 | 0.244 | +0.169 FAIL |
| 360x800 restored, slow 4G at 1,233 | 0.043 | 0.043 | 0.019 | -0.025 | 0.000 | 0.007 | -0.036 |
| 360x800 restored, slow 4G at 2,500 | 0.073 | 0.075 | 0.151 | +0.078 FAIL | 0.013 | 0.052 | -0.021 |
| 360x800 restored, slow 4G at 4,000 | 0.161 | 0.161 | 0.162 | +0.001 | 0.098 | 0.104 | -0.057 |

**N9 on fresh loads (not part of the bar)**

| case | today | L | L + N9 | LW | LW + N9 |
|---|---|---|---|---|---|
| 390x844 fresh | 0.117 | 0.015 | 0.015 | 0.004 | 0.003 |
| 390x844 slow 4G | 0.197 | 0.015 | 0.015 | 0.004 | 0.004 |
| 360x800 fresh | 0.096 | 0.018 | 0.018 | 0.004 | 0.004 |
| 360x800 slow 4G | 0.109 | 0.018 | 0.018 | 0.004 | 0.004 |

- **L + N9 (layers only): fails 3 of 12** (360 restored at 2,500, normal and slow 4G, and restored at 4,000). With N9 the value section sits right under the library at 360; with the layers alone the library rail and the value headline's italic word (both styled by Webflow code) still reflow.
- **LW + N9 (layers and Webflow change): passes 11 of 12.** The miss is 360x800 restored at 4,000 px, runs 0.067, 0.244, 0.300, 0.244, 0.011 (median 0.244 against today 0.075). It also missed in the two earlier full runs (+0.185; +0.021). It is not fonts: with every web font request blocked, 360 at 4,000 still shows 0.01 to 0.30 in every variant (today 0.067, L 0.055 with runs up to 0.296, LN9 0.069 with a 0.297, LW 0.064, LWN9 0.067; runs/ctl-nofonts.jsonl). The sources are the photo interlude figure.h3-il (`<figure class="h3 h3-il">`, in a home embed) and the Layover guides band above it settling after load; with N9 on, the reload at 4,000 lands on that interlude, so the race shows more often. At 2,500 px, where N9 moved the risk before, LW + N9 is at or below today (0.054 and 0.074 against 0.088 and 0.122 at 390; 0.057 and 0.052 against 0.059 and 0.073 at 360).
- On fresh loads N9 changes nothing (second table above).

My reading: the font jump that blocked N9 is fixed (LW + N9 is lower than today in 10 of 12 cases, and the two cases that failed in the home review with the font fix missing, 360 slow 4G restored at 2,500 and 390 slow 4G restored at 4,000, now pass at -0.021 and -0.098). By the letter of the bar N9 still fails one case, because of a settle in the home embeds that has nothing to do with N9's code or the fonts. Switch it on after the Webflow change is live if the orchestrator accepts that one case (or after the interlude settle is fixed, a separate task); do not switch it on with the layers fix alone.

## The look is unchanged

- Screenshots after `document.fonts.ready` plus 3 s, deviceScaleFactor 1, Math.random seeded the same in every load, reduced motion: home hero, home value section, story body and the first 2,600 px of home and the story page, at 1440 and 390, today against L and LW. All pixel-identical, with one exception: the story page top at 390 with LW differs in 66,263 pixels inside the hero photo only (bbox 16,379 to 374,856; a decode difference in the photo, text boxes identical; it was identical in the previous round). Two loads of today against each other are identical too. Files: shots/*.png, pdiff.txt, shots/cmp-story-390-top.png.
- Every text box (849 on home and the story page at 1440 and 390): none moves or changes size, and font family, weight, size and style are the same in every box (boxes.txt).
- The fallback holds the layout: with every web font blocked, text boxes whose height differs from the loaded page: home 390: 51 boxes, 418 px in all today; 47, 296 px with L; 31, 100 px with LW. Home 1440: 45 (510 px), 42 (376 px), 26 (35 px). Story 390: 35 (348 px), 10 (97 px), 9 (94 px). What is left with LW is Webflow Designer classes and the footer, below the first screen (boxes.txt).

## Text is never invisible longer than today

Webflow's font loader serves Plex with `font-display:auto` (block), so Plex text is invisible from first paint until the file arrives or 3 s pass; Playfair and JetBrains Mono swap. The fallback faces do not change that (they are what the invisible text is laid out with). Measured from the runs (first paint, Plex 400 arrival from the FontFace status, invisible = from first paint to Plex 400 loaded, capped at 3 s after it started loading), 110 runs per variant, paired with today in the same run:

    fast before: runs 110, first paint 580 ms, Plex 400 in 805.5 ms, Plex text invisible 272 ms (median)
    fast L: runs 110, first paint 590 ms, Plex 400 in 749.5 ms, Plex text invisible 218 ms (median)
    fast LW: runs 110, first paint 610 ms, Plex 400 in 750.5 ms, Plex text invisible 197.5 ms (median)
    slow 4G before: runs 110, first paint 2826 ms, Plex 400 in 4879 ms, Plex text invisible 2031 ms (median)
    slow 4G L: runs 110, first paint 2844 ms, Plex 400 in 4918.5 ms, Plex text invisible 2016.5 ms (median)
    slow 4G LW: runs 110, first paint 2866 ms, Plex 400 in 4815 ms, Plex text invisible 1962 ms (median)
    fast L minus today, paired runs 110: invisible Plex text median -6.5 ms (quartiles -217 to 129), Plex 400 arrival median -8.5 ms
    fast LW minus today, paired runs 110: invisible Plex text median 0 ms (quartiles -197 to 179), Plex 400 arrival median -1.5 ms
    slow 4G L minus today, paired runs 110: invisible Plex text median -18 ms (quartiles -112 to 101), Plex 400 arrival median 38.5 ms
    slow 4G LW minus today, paired runs 110: invisible Plex text median 10 ms (quartiles -96 to 118), Plex 400 arrival median 34.5 ms

So no longer and no shorter than today within noise. Shortening it is the optional preload above.

## Found on the way (not fonts; not changed)

1. **Story hero photo has no reserved box and is lazy.** In the story template the `<img class="tll-story-hero-img">` has `loading="lazy"`, no width or height, and the story layer (src/design/magazine-2026-10/story-build/tll-mag-story-v1.html) sets `.tll-story-hero-img{height:auto;aspect-ratio:auto}`; its figure is 28 px tall until the photo decodes, then 506 px at 390. One 0.4 to 1.2 shift in about half of all story loads (fresh and restored, phones and desktop). Fix candidates: eager loading for the hero, and an aspect ratio from the CMS image (or a fixed min-height) in the story layer.
2. **/travelers 135 px push** when the travelers chunk (tll-travelers-fix-v1) restyles the page, 0.08 to 0.26 per load, plus card-grid settles on restored reloads (0.2 to 0.7). Known tradeoff in the build notes (1 Nov).
3. **MENU button injection** on phones widens the nav CTA row 254 to 320 px: 0.003 on home, 0.03 on the story page, up to 0.09 on /travelers when it lands with other changes. A min-width on `.tll-nav-v1 .tll-nav-cta-row` below 768 px would remove it (investigation's suggestion; not measured).
4. **Home restored reloads below 2,500 px** settle by 0.01 to 0.30 from the library rail foot (`.h3-shelf-foot`, about 46 px) and the interlude figure.h3-il, with or without web fonts. This is what keeps N9 from a clean pass.

## Caveats

- Local fallback fonts on this machine: Liberation Sans for the Arial path and Liberation Serif for the Times path were exercised; the Georgia, Roboto and Noto Serif paths were not (not installed). iOS and Android not tested on a device. A device without any of the named local fonts falls through to today's stack, so it cannot get worse than today. Safari applies size-adjust (17 and later); if it ignores the ascent and descent overrides, line heights are still set explicitly in these rules, so wrapping, the main cause, stays matched.
- Five parallel browsers on 4 cores; variants interleaved in every run, so load affects all variants alike.
- Story and /travelers medians are bimodal for the non-font reasons above; read them with the pooled counts.
- Restored positions: 1,233 for every page; 2,500 and 4,000 also for the N9 cases.

## Files in the work folder

- Builds: base/ (HEAD, equals 16.62.0), after/ (this change), afterN9/ (this change with N9 on); prev-build/ (earlier builds).
- Harness: meas.cjs (measurement), wf.cjs (the Webflow change applied to a page), genprop.cjs (writes and checks webflow-proposal.json), sum.cjs and tables.cjs (summaries), shots.cjs and pdiff.py (look checks), valprobe.cjs, ruleprobe.cjs, varprobe.cjs, charprobe.cjs, frames.cjs (probes).
- Data: runs/*.jsonl (final), runs-v2/, runs-v1/, runs-aborted-varbug/, runs-killed2/; summary-final.tsv, summary-story-v2.tsv, summary-story-iso.tsv, tables.md, foit.txt, boxes.txt, pdiff.txt; fetched/ (www pages as measured), fetched-now/ (www after 16.62.0 went live).
- Proposal: webflow-proposal.json. Source diff against HEAD as left in the repo: source.diff.
