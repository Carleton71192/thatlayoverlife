# Sweep Nov 21, 2026: class B, Webflow page code and Designer steps

Written Nov 22, 2026 on branch claude/sweep-fixes-2026-11-21. Nothing here was applied: every item is Webflow page code, a Designer
step, a registered script change or a Map 2.0 pin, so each waits for Nancy's OK and a test-site run first. Ids follow ranked.md, with
the corrections from verify-1.md and verify-2.md. Banned words are spelled with hyphens where a quote needs them. No member data.

How to read a page code item: "Before" is the exact text in the live code today (plain GET of Nov 21; saved copies named where they
exist), "After" is the exact replacement. Designer items are steps.

## B01 /the-map: "Edit your countries on the map ↑" does nothing

The markup href is "#". The registered page script tllmapaddv2-1.0.0.js rewrites it to #tll-map-canvas after 1.5 s (that id exists on
no page) and its click handler looks for the old "Edit my countries" button, while Map 2.0's button reads "Edit my destinations". A
Designer href change alone is undone at run time.

1. Webflow, /the-map, Page settings, Custom code, applied scripts: remove tllmapaddv2 (1.0.0).
2. Designer, /the-map: select the link "Edit your countries on the map ↑", Link settings, URL: `#tll-map-layers`.
3. Publish to the test site; check the click opens the Layers drawer at 390 and 1440, signed in and out.

## B02 /submit: text typed in the last 20 s is lost

Page footer code, block `tll-form-steps-js-v2` (live today; another /submit footer fix is in progress, so fold this into that change).

Before:
```
var timer=setInterval(autosave,20000);
```
After:
```
var timer=setInterval(autosave,20000);
/* 22 Nov 2026 (sweep B02): this browser's copy is saved 1 s after typing stops, on leaving the page and when the tab is hidden; the
   account copy stays on the 20 s timer (local() does not touch last, so autosave still sees the change). Nothing after a send. */
function local(){if(sent)return;var o=snap();if(Object.keys(o).length===0)return;try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}}
var lt=null;f.addEventListener('input',function(){clearTimeout(lt);lt=setTimeout(local,1000);});
window.addEventListener('pagehide',local);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')local();});
```
Check: type, reload after 5 s, the fields come back; send, then pagehide, and nothing is written back.

## B03 /submit, /my-pets, /share-photos: labels name no field, duplicate ids, consent sentences do not tick their boxes

Designer, ids and Label "For" only (names untouched). The /login and /edit-profile forms are Memberstack forms and are in class-c C02.
1. /submit: give each field a unique id (today `field` x14 and others). Suggested ids from the field names: `sub-country`, `sub-city`,
   `sub-when`, `sub-headline`, `sub-excerpt`, `sub-body`, and so on, one per field.
2. For each label, Label settings, For: the id of its own field (48 labels have an empty For today).
3. /my-pets: the same (`field` x6; 8 labels with an empty For); the EU pet passport box: set the outer label's For to the box id.
4. /share-photos: the same for country, caption, name, email, Instagram, the 3 credit radios and the 3 required promises plus 3
   placement boxes (21 labels with an empty For).
5. These forms carry data-ms-member-bound: change no data-ms-* attribute and no name.
The core stopgap for /for-expats (A07) shows the result: a tap on a sentence ticks its box, and screen readers read the sentence.

## B04 /the-map at 390 and 1440: the closed Layers drawer keeps 8 Tab stops

Map 2.0, map-2.0/dist/tll-map-layers.js, then a new map pin on /the-map and /account (with B05).

Before (line 646):
```
  function openDrawer(on) { drawer.dataset.open = on ? '1' : '0'; drawerBtn.setAttribute('aria-expanded', on ? 'true' : 'false'); }
```
After:
```
  function openDrawer(on) { drawer.dataset.open = on ? '1' : '0'; drawerBtn.setAttribute('aria-expanded', on ? 'true' : 'false'); drawer.inert = !on; }
```
and after line 580 (`drawer = el('div', 'tllm-drawer'); drawer.id = 'tllm-drawer'; drawer.dataset.open = '0';`) add `drawer.inert = true;`.
On desktop where the drawer is always shown open, check that the code path that opens it calls openDrawer(true).

## B05 /the-map and /account: Receipts card squeezed, controls under 44 px, two map pins live

Map 2.0 CSS, one new pin on both pages (today /account loads the a81ffb96 map CSS and /the-map 46a21a18).

Before (the live grid rule; repo dist has `repeat(auto-fill,minmax(250px,1fr))`):
```
.tllm-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin-top:22px}
```
After:
```
.tllm-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:14px;margin-top:22px}
```
and for the 33 to 34 px controls at 1440: `.tllm-chip,.tllm-bar-btn,.tllm-zoom button{min-height:44px}`. Then register the same pin on
/the-map and /account.

## B06 /for-expats: 7 fields show "Example text"

Designer, Placeholder only (copy for Nancy's OK; field names untouched):
| Form | Label | name | Proposed placeholder |
|---|---|---|---|
| Claim your desk | Your name or pen name | field (A07 renames it at run time) | Your name or pen name |
| Claim your desk | Email | email | you@example.com |
| Run a group? List it. | GROUP NAME | group-name | Copenhagen Running Club |
| Run a group? List it. | CITY OR AREA | city-or-area | Østerbro |
| Run a group? List it. | COUNTRY | country | Denmark |
| Run a group? List it. | WHERE IT LIVES (LINK) | group-link | https:// |
| Run a group? List it. | YOUR EMAIL (NEVER SHOWN) | email | you@example.com |

## B07 Copy with words from the banned list

Designer text, for Nancy's OK.
1. /for-expats, "What a Location Expert does", card 02 heading. Before: "F-i-l-e-s the local truth". After: "Knows the local truth".
2. /my-pets, Short bio placeholder. Before: "45kg of Samoyed. Refuses to acknowledge goats. Considers the cruise s-h-i-p the only acceptable
   form of ocean transit." After: "45kg of Samoyed. Refuses to acknowledge goats. Considers the ferry the only acceptable form of ocean
   transit."
3. Side find (verify-2): home page JSON-LD says every story is "f-i-l-e-d under one of five editorial pillars". Home page head code
   (or the SEO settings that write it): replace "f-i-l-e-d under" with "sorted into".

## B08 /my-pets and the /submit gate: small copy

1. /my-pets page code, function heading(). Before:
   ```
   function heading(){if(!title)return;var em=title.querySelector('em');var n=pets.length;if(em)em.textContent=n+(n===1?' bestie':' besties');}
   ```
   After:
   ```
   function heading(){if(!title)return;var em=title.querySelector('em');var n=pets.length;if(em)em.textContent=n?n+(n===1?' bestie':' besties'):'your besties';
     var add=document.querySelector('.tll-mypets-card-add-title');if(add)add.textContent=n?'Register another pet':'Register your pet';}
   ```
   (At 0 the heading keeps its Designer words "your besties", which the page shows before the script runs.)
2. /submit gate, Designer: the h2 "Sign in to write your trip." sits above a "Log in" button. After: "Log in to write your trip."
   (the em stays on "write your trip").

## B09 Site head and footer near the 50,000 character cap

Site head 48,441 (96.9%). Steps, in one release with a core build:
1. Core: a new staged chunk `pwa` holding the PWA client (`tll-pwa-v1-js`, 12,739 chars, and `tll-pwa-v1-css`, 2,612 chars, from the site
   footer), loaded only with a preview flag until the PWA Worker is live (tll-pwa-hold already answers HEAD /sw.js with a 404).
2. Core: `tll-proto-parity-v1` (style, 6,165) into STYLES and `tll-proto-parity-js-v1` (9,964) into CORE, unchanged.
3. Site footer: delete the blocks `<style id="tll-pwa-v1-css">...</style>` and `<script id="tll-pwa-v1-js">...</script>`.
4. Site head: delete `<style id="tll-proto-parity-v1">...</style>` and `<script id="tll-proto-parity-js-v1">...</script>`.
Frees about 15,400 characters in the footer and 16,200 in the head. Check the parity script's order against the page code it repairs.

## B10 About 97,700 characters of style at the end of the body

Page code, per page: cut each footer `<style>` block and paste it, unchanged, at the end of the same page's head code. All fit:
/share-photos (29,606 into a 719 head), Stories Template (21,623 into 19,034, 40,657 in all), /the-map (16,048 into 13,217),
/travelers 3,656, /my-pets 3,563, /submit 3,126 (with the in-progress /submit fix), /account 2,743, Countries Template 1,141,
/stories 1,060. The core injects its styles in the site head, before page head code, so page rules still come after the core.
The five site footer styles (tll-pass-a, tll-core-v2-css, tll-forms-v2, tll-note-v1-css, tll-pwa-v1-css) do not fit in the site
head; they go into core STYLES in a later build. Then retire the core copies that exist only to bridge the late styles.

## B11 Core one-page code

Corrected in verify-2: tll-album-settings-v1 also runs on /edit-profile ("05D · Your album"). Steps:
1. Build tll-photos-form-v2 as its own file at the same commit; register it as a page header script on /share-photos; drop it from CORE.
2. Keep tll-album-settings-v1 in the core (or register it on both /the-map and /edit-profile).
Saves 18.1 KB of core on every other page. Check that the page header script runs before the /share-photos body script.

## B12 Four dead page scripts

Webflow page scripts, at the next release: remove tllstorycountv2 and tllstorycountv3 from /stories (the core's
tll-stories-count-v1 owns the count; v2 still fetches /sitemap.xml when no count is cached), tll_home_story_counter from home (its
target is on 0 of 33 pages), tllpf3guardv1 from the Contributors Template (nothing reads window.__tllProfStats).

## B13 Three different gate layouts

Designer, the anonymous blocks on /submit and /my-pets: copy the /share-photos gate (left aligned, the three steps, the age line) and
change only the heading and the first step to the page's own task. Change no data-ms-* attribute.

## B14 /for-expats and /for-press buttons with only Webflow inline-a-* classes

The data-tll-btn pair and FIND are done in the core (A13). Designer, the remaining two: select "Claim your desk →" (/for-expats) and
"Register as a Press Traveler →" (/for-press), add the class `tll-cta-rose` (filled rose in the button set). /for-press also loses its
teal fill (#00C9C8) that way.

## B15 /submit step bar

/submit page head code (with the in-progress /submit fix). Before:
```
.tllst-seg{flex:1;height:5px;background:#EDE6DA;border-radius:6px;border:0;padding:0;cursor:pointer;transition:background .3s}
.tllst-seg.on{background:#067A79}
.tllst-seg.done{background:#0A0B14}
```
After:
```
.tllst-seg{flex:1;height:44px;min-height:44px;background:linear-gradient(#EDE6DA,#EDE6DA) center/100% 6px no-repeat;border-radius:0;border:0;padding:0;cursor:pointer;transition:background .3s}
.tllst-seg.on{background:linear-gradient(#067A79,#067A79) center/100% 6px no-repeat}
.tllst-seg.done{background:linear-gradient(#0A0B14,#0A0B14) center/100% 6px no-repeat}
```
A 6 px visible bar inside a 44 px target at both widths (the site touch floor made each segment a 44 px filled block at 390).

## B16 Heading scale inverted

Page code: home h2 bands from 74.88 px (and the 103.68 px "You went. Write it down.") to at most 0.9 of the H1 (70 px at 1440);
/account a3 CSS: the H2 "Overview" from 64 px to 40 px; /stories s3 CSS: `html.tllp-stories h1.tll-library-title{font-size:clamp(40px,3.4vw,46px) !important}`
(was clamp(30px,...), so 40 px at 390). /the-map "WORLD HERITAGE SITES": Designer, change the H2 to a div with the mono eyebrow class.

## B17 /edit-profile: same id on a style and a script

Page code. Before: `<script id="tll-edit-dir-v1">`. After: `<script id="tll-edit-dir-v1-js">`. Nothing reads the script by id.

## B18 /submit: picker links use aria-pressed without a role

Designer, /submit, the two fork-pick links (`a[data-tll-fork-pick="write"]` and `="link"`): Custom attributes, add `role` = `button`.

## B19 Two runtime contrast repairers on every view

One browser run over the 33 cached pages listing what site head tll-proto-parity-js-v1 contrast() and site footer
tll-a11y-motion-v1 change; put those colors into tll-contrast-v1; then switch both repairers off and remove home's
tll_postcard_contrast. Core and site code, one release.

## B20 Photo corners

Designer, Variables: set `Sizes / Image / image-radius` to 0. Leave `card-radius` (.75rem) as it is. Avatars keep their own 50%.

## B21 Off-palette colors and the same link or card styled two ways

Page code as each page is touched: #FF7093 to #F0507A (/about "lounge", 404 "connection."), #D98A2B to #C8325B (404 eyebrow, /account
Snapped label), #0D0F1A to #0A0B14 on the /for-expats, /for-press and /faq H1s, #C8425E and #A92549 to #C8325B, #0B1220 and #4A5568
to #0A0B14 and #6B6660 on /layovers. The core mapping of #0D0F1A is not proposed: it needs per-class selectors and changes almost nothing.

## B22 Section spacing and left edges drift

Page code as pages are touched: kit steps 8, 16, 24, 40, 64 for section padding; one content edge per page on /the-map, /for-brands
and /support. Centered hero columns stay centered.

## B23 Footer headings act as dead buttons at 1440

Footer component embed (src/components/footer/tll-foot-v1.html), proposal only. Before:
```
var h=col.querySelector('h4');if(!h)return;h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded','false');
```
After:
```
var h=col.querySelector('h4');if(!h)return;function a11y(){if(mq.matches){h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded',col.getAttribute('data-tll-open')==='true'?'true':'false');}else{h.removeAttribute('role');h.removeAttribute('tabindex');h.removeAttribute('aria-expanded');}}a11y();if(mq.addEventListener)mq.addEventListener('change',a11y);
```

## Moved here by the checks

- B24 (A21, the half that holds): /login and /signup carry the same head style (11,940) and footer (6,017) twice in Webflow. The repo
  already keeps one source (src/pages/auth/au3-auth.css, au3-footer-block.html). Proposal: keep both copies in Webflow until Nancy
  wants a site-level guard; any edit goes to both pages from those two files.
- B25 (C07 split): tll_world_map_v1 and tllmapv3 make no Memberstack call and #tll-map-canvas exists on no page. Webflow site
  scripts: remove both (frees 2 of the 15 slots). Check first that no CMS item renders #tll-map-canvas or path.country.
- B26 (C08, cleanup): the core focus ring (tll-focus-v1, an id in its weight and !important) already wins everywhere, so the 19 page
  and site :focus-visible rules are dead. Remove them as each page is touched; no decision needed.
