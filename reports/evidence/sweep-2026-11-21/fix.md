# Sweep Nov 21, 2026: class A fixes built

Written Nov 22, 2026. Branch claude/sweep-fixes-2026-11-21, from claude/new-session-zxm063 at fae9bb6. Not merged, layers-release
untouched, nothing registered or published. No Webflow, Memberstack, Cloudinary or Worker write; no form sent. One commit a fix, a
vitest file for each, the core rebuilt with build-site-layers-v16.py in every commit.

## Result

| | Before (16.68.0, 0f04fabf) | After (this branch) |
|---|---|---|
| Core tll-site-layers-v16.js | 277,485 B, 81.9 KB gzip | 272,423 B, 78.9 KB gzip |
| Core sha384 | sha384-a9tcQUfkTLuUzZ1IXfw7dVcXSKJnilK7aqF6p5HiS5d80ghZvRrQ6Akt8Ewg/2st | sha384-rX6JpX+ziDO8ce0A32rdwa+F2hX4IyqAQ8eXNR648g+BpItDm62qGyZxty1TxIFF |
| Public chunks story / stories / pursuits / pets / for-expats / profile | 30.7 / 28.6 / 46.5 / 41.6 / 21.7 / 71.8 KB | 13.0 / 17.2 / 28.4 / 29.8 / 10.3 / 64.0 KB |
| vitest | 759 tests, 63 files | 827 tests, 72 files, all pass |
| node --test worker/test | 83 | 83, all pass |

The sweep's own rules add about 8.5 KB to the core; leaving the styles' comments out of the download (last row of the table below)
takes 13.7 KB off, so the core ends 5.1 KB smaller than 16.68.0.

Browser check (build/bin/chk.cjs, results in build/chk.jsonl): 16 cells, the cached pages with this branch's core and chunks served
from the worktree in place of the pinned jsDelivr files, 390 and 1440, signed out and signed in with the stand-in. 0 page errors,
0 bytes from Webflow hosts, every non-GET aborted. The before values come from verify-1.md.

## Fixes, highest impact first

| Id | File | What | Before | After (measured) |
|---|---|---|---|---|
| A07 | tll-label-for-v1.js (new, for-expats chunk) | Each label with an empty for names the first field inside it, when that id is the field's own; Memberstack forms and other pages skipped; no id or name changes | a tap on either consent sentence left the box unticked; accessible names "" | both boxes tick from the sentence; names "I am 16 or older and I have re...", "I run or co-run this group, an..." |
| A01 | tll-story-is-v1.js (stories chunk) | search() stands aside when the page code note (data-s3) is there; the fallback has no banned verb, counts the cards and links /submit and /stories | banned verb, "Yours could be the first" above 57 stories, "See all stories" linked /submit | /stories?q=zzqx shows the page note "No stories match “zzqx” yet. Share your story → / Clear the search" (links /submit, /stories) |
| A02 | tll-sweep-1121-v1.html (new core style) | Under 480px the /support email em is 28px and may break anywhere | 40px em, 396px wide, right edge 420 at 390 | 28px, 274px wide, x 58 to 332; scrollWidth 390 |
| A03 | tll-buttons-v1.html | .tll-cta-ghost-dark joins the outlined kind in ink (both sit on light cards) | cream on teal #00A9A4, 2.59:1, 999px pill | ink #0A0B14 on transparent over #EFEAE1 / #F7F4EE, 16.4:1, square, Plex 600 |
| A04 | tll-sweep-1121-v1.html | Closing headings on /stories and /contact: clamp(26px,6vw,32px); the /stories rose word to #C8325B (over a later !important page rule) | 16.3px; /stories em #F0507A on #F8F2E6, 3.07:1 | 26px at 390 (32px at 1440 unchanged); em rgb(200,50,91), 4.6:1 |
| A05 | tll-buttons-v1.html | /about buttons join the set; cite and list items in Plex Sans Condensed | Liberation Serif in the cite (38 glyphs), the 4 li and both buttons; 8px corners, weight 700 | cite and li paint IBM Plex Sans Condensed; buttons square, 600, filled rose or outlined |
| A06 | tll-sweep-1121-v1.html | /submit and /my-pets (page ids): help text, help, status ink 72%, 400, upright; legend #C8325B; labels 13.5px; placeholders #6B6660 | help 50% ink 300 italic (3.5:1), legend 3.35:1, status 4.17:1, placeholder 3.49:1 | rgba(13,15,26,.72) 400 normal (7.3 to 7.8:1), legend rgb(200,50,91), placeholder rgb(107,102,96) (5.1 to 5.7:1); /share-photos untouched |
| A08 | tll-gate-return-v1.js (new, site chunk) | A gate Log in or Join click on /submit, /my-pets, /share-photos stores the page; the next signed-in page shows one fixed card "Back to your story / pets / photos" | the member stayed on /account | unit tested (7 cases); not in the browser run (it needs a sign-in across two pages) |
| A11 | tll-byline-links-v1.js (site chunk) | The byline row loses role, tabindex and aria-label once its name is a keyboard link, also after tllauthorlinkv1's 1.5 s pass | 3 Tab stops a card | 2 a card (57 fewer on /stories) |
| A12 | tll-stories-places-v1.js (stories chunk) | A place chip writes ?place= (replaceState); a ?place= on load presses that chip | the URL stayed /stories | Asia click: /stories?place=Asia; All places: /stories; ?place=Europe at 1440: Europe pressed, 14 cards shown |
| A13 | tll-buttons-v1.html | 404 buttons (first filled, others outlined cream), /submit step buttons, /the-map .tll-park-cta and .tlllb-cta, /account .tll-exp button, /for-expats a[data-tll-btn] and FIND (the B14 part with data-tll-btn) | cream fills 6px, 999px mono pills, teal pill, #F0507A at 3.07:1, 7px DM Sans 700 | all square, Plex 600, 48px (FIND 44px); one rose fill a group; .tllst-hide still hides Back at step 1 |
| A10 | tll-sweep-1121-v1.html | 44px tap floor on touch screens for the nav pair, /travelers link chips, /for-expats country field; Save for later 44px everywhere | nav Share your story 40px at 390; Save for later 86x26 at 1440; chips and field 32px | 44px each (nav at 390, Save for later at 1440, field at 390) |
| A14 | tll-sweep-1121-v1.html | 12px floor on 37 named JetBrains Mono classes, with an id in its weight to outweigh page !important rules; SVG text left out | 8.5 to 11px | 12px; /account stat labels no overflow at 390 or 1440; /the-map labels on one line |
| A15 | tll-album-v1.js (profile, pets chunks) | The tape's photos and countries line wraps inside the tape; the 9px is gone | nowrap, 162 to 177px in a 142 to 159px tape | normal, 112px in a 130px tape at 1440 |
| A16 | tll-stories-places-v1.js + tll-sweep-1121-v1.html | A place that wrapped below the writer name is marked and loses the dot, and keeps its own line | 17 of 57 bylines at 390 began a line with "·" | 17 of 57 on their own line, 0 with a dot |
| A09 | tll-sweep-1121-v1.html | On /account at 960px and wider the Tell the editor pill sits bottom right; hide-while-typing was already live | 138x44 over the side menu at x 16 | x 1286 at 1440; at 390 it stays the 44px circle bottom left |
| A17 | tll-sweep-1121-v1.html | #tllm-sample in Plex Sans Condensed over the inline "IBM Plex Sans" | 104 glyphs in a system face | 104 glyphs IBM Plex Sans Condensed; the SAMPLE MAP label stays mono |
| A18 | build-site-layers-v16.py | tll-series-v1 and tll-pros-v1 to the staged lists; a staged-only chunk is allowed (countries) and the loader skips a rule with no public hash unless a preview flag is set | 17 KB of staged code in 9 public chunks | 63.3 KB less in the public chunks; ?preview=wire still loads them (loader test) |
| A19 | build-site-layers-v16.py, tll-home-value-v1.js | tll-open-slots-v1 (draft /spotlight only) to misc-preview; the home value header says public | misc 3.2 KB; header said STAGED with PUBLIC=true | misc 1.8 KB; header and build note say public since Oct 31 |
| A20 | src/site-layers/archive/ | git mv of 36 files (the 29 old builds and bundles, 704,763 B, plus 4 old flag scripts, 2 old wrappers, 1 PNG; 819,633 B) | old builds beside the live one | archive/README.md; the v16 build output is unchanged |
| A21 | tools/page-code-from-html.py, src/pages/live-2026-11-21/ | A read-only split of page head and footer code out of plain-GET HTML; refuses template pages; saved copies for 8 pages | 15 live blocks without a saved copy | its split of /login's footer equals au3-footer-block.html byte for byte; home, stories, the-map, account, gallery, destinations, for-press, the-paw-passport saved |
| defrag | build-site-layers-v16.py | The core styles go without their comments (quote-aware strip), as the layers' header comments already do | 13.7 KB of comments in the core | rules unchanged (test compares braces and declarations per style) |

Also: test/mini-dom.js gained cloneNode, and a fix for compound selectors (`.a[b]`), whose class and id tests read a shared match
variable and always failed; no existing test changed result.

## Not built, with reasons

- B14 "Claim your desk →" and "Register as a Press Traveler →": they carry only Webflow inline-a-* classes, so a class has to be
  added in the Designer (class-b.md B14). The data-tll-btn pair and FIND moved to A13 and are built.
- A13 /login and /signup buttons (Continue with Google, Log in, Create my account): they carry data-ms-auth-provider and sit in
  data-ms-form forms, so they wait for C02.
- A14 weight 700 on JetBrains Mono: left as is; the page asks for 700 and the browser paints the 600 file, with no visible harm found.
  The 11px story page eyebrows (K09) are SVG or template classes not in the measured list.
- A10 /share-photos promise rows (20px) and the map controls: inside a data-ms-member-bound form and Map 2.0 CSS, so B03 and B05.
- A21 "saved twice": refuted in verify-1 (the repo keeps one source; the duplicate is in Webflow), class-b.md B24.

## Notes for the release

- The core changes, so the release is a new core registration at the commit that holds it (core and chunks together, as usual).
- The refactor branch (origin/claude/codebase-refactor-2026-11-12) also edits tll-story-is-v1 and tll-stories-places-v1. Merging it
  after this branch needs those two files read side by side; the build regenerates the core and chunks.
- A06 and A13 restyle parts of /submit through the core only; the /submit footer page code is untouched. chunks/share-photos.js is
  byte for byte as at fae9bb6. chunks/submit.js and submit-preview.js differ only in the search() function of tll-story-is-v1, which
  A01 required: that layer rides in the submit chunk too, but search() runs only on /stories (run() calls it for that path only).
  When the in-progress /submit fix lands, rebuild rather than merge the chunk files.
- New copy waiting for Nancy's OK: the A01 fallback and the A08 card words (class-c.md C13, C14).

## Nov 22 follow-up: the notes of the independent check

The check of this branch (check.md on claude/new-session-zxm063, section 6) passed it with notes; notes 1 to 4 and 8 are resolved
here, one commit each, the core rebuilt in each. Notes 5 to 7 asked for no code change. Browser runs use a copy of the check harness
(check/bin on claude/new-session-zxm063) with the plain-GET cache; images and fonts not in the cache are answered with stand-ins, so
nothing was downloaded from Webflow hosts; every non-GET aborted.

| | Before (1ef84ab) | After (this follow-up) |
|---|---|---|
| Core tll-site-layers-v16.js | 272,423 B | 273,683 B, 79.2 KB gzip |
| Core sha384 | sha384-rX6JpX+ziDO8ce0A32rdwa+F2hX4IyqAQ8eXNR648g+BpItDm62qGyZxty1TxIFF | sha384-zZQB/zsehgGnNd/jgQFu0T1AqScv35Wvg4rT533wLyECh6g4NFcOeANuIB6Qe25t |
| chunks/site.js | 23,692 B | 20,588 B (site-preview.js 23,839 B is new) |
| vitest | 827 tests, 72 files | 844 tests, 72 files, all pass |
| node --test worker/test | 83 | 83, all pass |

| Note | What | Why | Before | After (measured) |
|---|---|---|---|---|
| 1 (A08) | tll-gate-return-v1: the card rule is html body #tll-gate-back.tll-gate-back (1,1,2) with !important on position, right, bottom, left, top and z-index; the /account lift is one attribute heavier (bottom:76px !important) | the site head's parallax rule .tllp-home :has(> img[data-tll-parallax="hero"]) ~ * (0,2,1) matched the card on the home page | position relative, z-index 2, 2264px below the fold at 390 (Chromium, that rule and the layer) | fixed, 16px from the right and bottom; unit test reads the page rule from the saved site head and compares weights |
| 2 (A08, C14) | tll-gate-return-v1 moves to the site chunk's staged list; site gets a site-preview variant | the card's words wait for Nancy (class-c C14) | in the public site chunk | only with ?preview=, ?qr= or a tll-preview-* key (loader test); code and tests kept |
| 2 (A01, C13) | no code change; a test runs the saved live /stories page code (search v4 and the Stories 3.0 companion) with ?q=zzqx | the fallback is public, its words wait for Nancy too | untested against the live page code | the page note wins when the page code runs first and when the companion comes after the fallback |
| 3 (A12) | new core layer tll-place-wait-v1 and a tll-sweep-1121-v1 rule: while a ?place= that names a place chip is pending, .tll-lib-grid is visibility:hidden (no reflow); the replay takes the mark off once it pressed the chip, found none or gave up (its 3 s wait); the core lets go if the chunk fails, 3 s after the chunk has run, and after 10 s | with late scripts all cards painted, then dropped to the place's | core and chunks 3 s late, /stories?place=Asia at 390: CLS 0.5179 in 3 of 3 loads (live 0.2569) | 0.2569 in 5 of 5 loads, Asia pressed, 11 cards, grid visible at the end; normal speed ?place=Europe at 1440 0.0299 (live 0.0309); no ?place=: nothing changes (unit test) |
| 4 (A14) | html body .tll-lib-meta:not(#tll-mono-12){letter-spacing:1px !important} | at 12px the page's 2px !important with nowrap and an ellipsis clipped more place names | place tags clipped of 57: 6 at 390, 2 at 1440 (live 2 and 1) | 2 at 390, 1 at 1440. Every element the floor reaches, on the 34 cached pages at both widths: only .tll-lib-meta meets 2px or more with nowrap and an ellipsis, so no other class changed |
| 8 (A14) | [data-tll-x=eyebrow] joins the A14 list | the page sets the /for-expats eyebrows to 10px; its floor script lifted only some, the map's only when the map drew before window load | the five eyebrows 12, 10, 10 (map), 10, 12px, 3 of 3 loads at 390 and at 1440 | 12px each in every load |

For the release: the A08 card is no longer public, so C14 can be answered at any time; to make the card public, move
tll-gate-return-v1 back to the site chunk's public list in build-site-layers-v16.py and rebuild. A01's fallback (C13) stays public.
