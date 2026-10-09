# Item 1: flashing counter on /the-map (#tll-map-counter, #tll-map-pct)

Read-only investigation, 9 Oct 2026. Site 69d6145cf421c777840c1e25, page 6a0df81df4016d4f78cfb22a.
Raw blocks saved beside this file: site_freeform_head.txt, site_freeform_footer.txt, map_page_freeform_head.txt,
map_page_freeform_footer.txt, home_freeform_head.txt, home_freeform_footer.txt.

## Elements on /the-map (Designer data)

| element | id | static text / attrs |
|---|---|---|
| Block `.tll-map-counter-num` | `#tll-map-counter` (el c84d785f-...-8bd33b107932) | text "– / 195" |
| Block `.tll-map-counter-pct` | `#tll-map-pct` (el ...107936) | text "–" |
| Block `.tll-map-canvas` | `#tll-map-canvas` (el ...10793c), **visibility: false** (hidden, not removed) | `data-visited` = 89 comma-separated numeric ISO ids, 84 unique (724, 826, 196, 231, 388 appear twice) |

Five HTML embeds on the page: Map 2.0 MapLibre loader (`#tll-map-layers`, pinned to commit 6a1098ab), fullscreen button,
logbook v2, tll-share-v1 bundle, v9.1 pin-cluster script. None of these five writes the counter or pct.

## Every writer of #tll-map-counter / #tll-map-pct, in load order

### W1. Registered script `tll_world_map_v1` v1.0.0 ("TLL World Map v1"), applied SITE-WIDE, footer
Hosted at cdn.prod.website-files.com/...6a0df83eefd9c9fb58e69e1e/tll_world_map_v1-1.0.0.js. Runs on every page, acts only
where `#tll-map-canvas` exists. Reads `data-visited`, loads d3 + topojson + world-atlas, draws the old flat map INTO
`#tll-map-canvas` (`c.innerHTML=''` then appends an svg), then:

```js
const visited=(c.dataset.visited||'').split(',').map(s=>s.trim().toUpperCase()).filter(Boolean);
...
svg.selectAll('path.country').data(f).join('path').attr('class','country').attr('d',path)
  .attr('fill',d=>visited.includes(String(d.id).padStart(3,'0'))?'#F0507A':'#FDF9F3')
...
const counter=document.getElementById('tll-map-counter');
if(counter){counter.textContent=visited.length+' / 195'}
const pct=document.getElementById('tll-map-pct');
if(pct){pct.textContent=Math.round(visited.length/195*100)+'%'}
```
Timing: after DOMContentLoaded + three CDN fetches (typically 0.5 to 2 s). Writes "<visited.length> / 195".
Note: the old SVG it draws is what the public-view script, member editor v4, tllmapfillv2, tllmapv3 and the
pin-cluster embed all poll for (`getMap()` = the svg with the most paths), so those scripts depend on W1 running.

### W2. Page head /the-map, public-view script (runs only when logged out or ?view=public)
Gate at map_page_freeform_head.txt line 13: if no `_ms-mid`/`_ms-mem` in localStorage, sets
`window.__tllMapV4=1; window.__tllPublic=1` (this disables the member editor in the footer, W4).
Lines 15-80: polls every 300 ms until W1's svg exists, repaints every country LAND, adds 4 story pins, then (lines 63-65):

```js
    var c1=document.getElementById("tll-map-counter"); if(c1) c1.textContent=String(STORIES.length);
    var c2=document.getElementById("tll-map-pct");
    if(c2){fetch("/sitemap.xml",{cache:"no-cache"}).then(function(r){return r.text();}).then(function(x){
      var m=x.match(/<loc>[^<]*\/stories\/[^<]+<\/loc>/g);
      if(m)c2.textContent=m.length+(m.length===1?" story":" stories");}).catch(function(){});}
    var host=(document.querySelector("#tll-map-canvas")||{}).parentNode||map.parentNode;
    var lg=document.createElement("div"); lg.id="tllLegend";
```
Writes counter = "4" (STORIES.length, no "/ 195") and pct = "<N> stories" from the sitemap. Both land after W1.

### W3. SITE HEAD freeform, `<script id="tll-proto-parity-js-v1">` (site_freeform_head.txt lines 175-222), function placeholders(), lines 205-207
Runs on DOMContentLoaded (`run()`), on /the-map only:

```js
    /* Map: invented "recently lit" counts and continent totals */
    if(P==='/the-map'){$$('section').forEach(function(s){if(/Recently lit/.test(s.textContent)&&/By continent/.test(s.textContent))s.style.display='none';});
      fetch(location.pathname,{cache:'force-cache'}).then(function(r){return r.text();}).then(function(h){
        var d=new DOMParser().parseFromString(h,'text/html');
        var fix=function(){['tll-map-counter','tll-map-pct'].forEach(function(id){
          var a=d.getElementById(id),b=document.getElementById(id);
          if(a&&b&&b.textContent!==a.textContent)b.textContent=a.textContent;});};
        fix();[500,1500,3000,6000].forEach(function(t){setTimeout(fix,t);});}).catch(function(){});}
    if(P==='/spotlight')spotlight();
```
Re-fetches the page's own HTML and copies the STATIC text ("– / 195" and "–") back into both elements at 0, 500, 1500, 3000
and 6000 ms after the fetch resolves. Every other writer that landed before each tick gets overwritten, so the counter
visibly alternates between a number and the dash. **This is the direct cause of the flashing.** The five timers also race
W1/W2/W4 so the final resting value depends on network timing.

### W4. Page footer /the-map, member editor v4 (map_page_freeform_footer.txt lines 13-159), members only
Skipped entirely when W2's gate set `__tllMapV4=1` (logged out). For members:

```js
  function tllOwnN(d){ ... counts states where own (non-pet) travelers have 'lived' or 'visited' ... }
  function quickCount(){try{var s=JSON.parse(localStorage.getItem("tllStates")||"null");var n=s&&s.v===2&&s.states?tllOwnN(s):0;
    var c=document.querySelector("#tll-map-counter,.tll-map-counter-num");if(c)c.textContent=/\//.test(c.textContent)?n+" / 249":String(n);
    var pc=document.querySelector("#tll-map-pct,.tll-map-counter-pct");if(pc)pc.textContent=Math.round(n/249*100)+"%";}catch(e){}}
  window.__tllQuickCount=quickCount; quickCount();                                   // line 18-19, runs at once
  ...
    function count(){return tllOwnN(data);}
    function updateCount(){var n=count();var c=document.querySelector("#tll-map-counter,.tll-map-counter-num");
      if(c){c.textContent=/\//.test(c.textContent)?n+" / 249":String(n);}
      var pc=document.querySelector("#tll-map-pct,.tll-map-counter-pct");if(pc)pc.textContent=Math.round(n/249*100)+"%";
      var h=document.getElementById("tllEmpty");if(h)h.style.display=n?"none":"block";
      if(btn)btn.textContent=n?"✎  Log or edit countries":"✎  Log a country";}        // line 70
    ...
    redrawAll(); updateCount(); rebuildLegend();                                     // line 84, after W1's svg is ready
    window.__tllMapApply=function(ns){data=migrate(ns);redrawAll();rebuildLegend();rebuildTStrip();updateCount();announce();...}; // line 148
```
Also called from the Memberstack sync script in the page head (map_page_freeform_head.txt line 117-118):
`if(window.__tllQuickCount) window.__tllQuickCount(); if(window.__tllMapApply) window.__tllMapApply(rs);`
Writes "n / 249" only if the current text already contains "/", else bare "n". Because W1 writes "/ 195" and W3 writes
"– / 195", the format flips between "n / 249", "n", "89 / 195" and "– / 195" for members.

### Not writers (checked)
- Home page footer `__tllLiveCounts` (home_freeform_footer.txt lines 18-19) writes `n+" / 195"` into #tll-map-counter and
  `pct+"%"` into #tll-map-pct, but the home page has no element with either id, no #tll-map-canvas and no data-visited
  (queried). Harmless there; page-level only, never runs on /the-map.
- Site-wide registered `tllmapv3`: click → /countries/<slug>; in ?embed=1 repaints paths from a hardcoded id list. No counter.
- Page-level `tllmapfillv2` (every 500 ms repaints paths Rose/LAND from tllStates; member only), `tllmapaddv2` (opens the
  editor from ?add=), `tllmapembedv1` (embed-mode CSS). No counter writes.
- Site head `tll-live-stories-v1` and site footer blocks: no reference to the counter ids.
- Registered but not applied anywhere: tllmapsharev1, tllmapsamplev1, tll_stats_map_copy_v2..v5, tll_stats_map_fix_v1.

## Where the logged-out "85" comes from
There is no hardcoded 85 and no default tllStates in any block. The logged-out number is `visited.length` from W1, i.e. the
token count of `data-visited` on `#tll-map-canvas`. In the Designer that attribute currently holds 89 tokens (84 unique)
so W1 would write "89 / 195" on the next publish; if the live page shows 85 the published attribute predates a Designer edit
(5 duplicate ids were added at the tail: 196, 231, 388 and 724, 826 repeat). Either way the number is the site's own
country list, not the visitor's, and W2 then overwrites it with "4" before W3 resets it to "– / 195".

## What to remove, and what could break

1. **Remove W3's fetch-and-reset block** (site head, lines 206-207 inside `placeholders()`): the `fetch(location.pathname ...)`
   statement only. Keep the preceding line that hides the "Recently lit / By continent" section (still invented content).
   Nothing else in the site depends on it. What else `tll-proto-parity-js-v1` does and must be preserved:
   contrast() (WCAG contrast repair after load), wordmark() (nav "LAYOVER LIFE." lockup), navOut() (moves nav out of
   Memberstack gated wrapper), consent() (unchecks syndication opt-ins), COPY/copy() (five copy rewrites + /support "Six doors"),
   homeSearch() (home search pill class), placeholders() for /contributors (hides "#" rows), /travelers (hides invented roster),
   /spotlight (spotlight() feature card + open slots), monogram() (NC avatar fallback).
2. **Stop W1 writing the counter on /the-map**: either remove `tll_world_map_v1` from the site scripts (it is only useful where
   `#tll-map-canvas` exists, which is /the-map alone) or keep it for the hidden SVG but accept the "/ 195" write. Risk if
   removed outright: W2 (public pins), W4 (member editor), tllmapfillv2, tllmapv3 and the pin-cluster embed all wait for the
   svg W1 draws; without it they poll out and the "Log a country" panel / `window.__tllMapApply` never mount. Safer first
   step: leave W1 applied, and let the Map 2.0 counter be the single owner (see 4).
3. **Remove W2's two writes** (map head lines 63-65: `c1.textContent=String(STORIES.length)` and the sitemap write into c2);
   keep the pin drawing and legend. Risk: none for the counter; the "N stories" text was never the intended meaning of pct.
4. **Pick one owner of the counter**: W4's quickCount/updateCount ("n / 249") for members, and for logged-out visitors decide
   whether the hero shows the site list ("/ 195" from data-visited) or the dash. Note W4 is format-sensitive
   (`/\//.test(c.textContent)`), so whatever the static text is on publish decides whether it renders "n / 249" or "n".
5. Element-side: `#tll-map-canvas` is visibility:false in the Designer, so W1 draws into a display:none container
   (clientWidth 0 → 1100 fallback). Harmless but wasted (three CDN fetches on every /the-map load).
