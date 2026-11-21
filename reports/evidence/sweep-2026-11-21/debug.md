# Sweep Nov 21, 2026, lens DEBUG: what is broken on www

Read only. No Webflow, Memberstack, Cloudinary or Worker writes; no form sent; every non-GET aborted in the browser.
Live state checked: core 16.68.0 (layers-release pin 0f04fabf), www as served on Nov 21, 2026 between 09:52 and 10:50 UTC.
No member data in this file or the evidence: profile slugs are masked as /contributors/<profile>.

## How

- Plain GET once of 36 pages (the page list, every top-level page linked from the home nav and footer, the 404 page,
  /edit-profile), /sitemap.xml and 302 internal paths (status only, 1 byte read each). Cache: scratch sweep-cache/html.
- Static pass over the cached HTML (debug/bin/static.py): anchors, duplicate ids, img alt, `node --check` on all 115 unique
  inline scripts, JSON and JSON-LD blocks.
- Browser pass (debug/bin/d.cjs, headless Chromium, one browser at a time): 33 pages at 390 and 1440 signed out, 12 pages at
  390 and 1440 with a signed-in Memberstack stand-in (no name, a made-up address), 90 loads. Each load waits 5 to 6 s, scrolls
  to the bottom and back, then reads the live DOM (duplicate ids, dead `#` targets, content images without alt, broken images,
  links without a name, `href="#"` links, unresolved tokens). Documents come from the GET cache; Webflow CSS, JS, fonts and
  images from the shared asset cache (fetched once); jsDelivr and the Worker GETs live. Memberstack is a stand-in in both
  states (signed out answers no member), so `data-ms-*` behavior is not exercised.
- Targeted runs (debug/bin/x.cjs, y.cjs): R1 with `?country=Denmark`, both /the-map links to `#tll-map-canvas` clicked, layers
  fed changed markup, same-site fetches per page.
- Webflow-host bytes for this lens: about 32 MB (26.5 MB browser assets, 5.2 MB HTML, 57 KB scripts).

Harness noise, not site faults: Turnstile and Memberstack POSTs are aborted by the harness, so their "Failed to load resource:
net::ERR_FAILED" lines and "[Cloudflare Turnstile] Error: 300010" warnings are ours. The signed-out avatar `img src=""` on
/account (a `data-ms-action` element) reads as broken only because the stand-in never fills it.

## Result in one line

0 page errors in 116 loads (90 in the main pass, 26 targeted); 0 console errors from site code; 0 4xx/5xx on our assets; all 11 jsDelivr pins 200; all 8 Worker GET
endpoints the pages call answer 200; all 302 internal link targets answer 200 or a 301. The broken things are behavioral.

## Findings

Severity: high = broken or blocks a user; medium = confusing or noticeably off; low = polish.

1. **D1 (KNOWN, still live): /for-expats shows no experts.** All widths, signed in or out. "The experts so far." keeps its
   fallback link and no card, and the country finder answers "No expert in Denmark yet" while the Worker's /expats-map lists
   2 expats (countries dk and th), the list the expats map layer reads. The page footer script (`loadTravelers`, for-expats.html at byte
   142105) fetches /travelers and reads `a.tll-trav-card-dark[href^="/contributors/"]` with `[data-tll-t^="pill-"]` country
   pills; live /travelers has 9 profile links, all `a.tv-card`, 0 `tll-trav-card-dark` and 0 `data-tll-t="pill-` attributes.
   Severity high. Fix lives in page code (/for-expats footer). Smallest fix: build the list from the Worker's
   GET /expats-map (slug, country, place), which the map already uses, instead of parsing /travelers. KNOWN:
   handoff/NANCY-WHEN-HOME.md "Codebase refactor branch awaiting your OK", origin/claude/codebase-refactor-2026-11-12 updates.md
   section 6 item 4 (R1).
2. **D2 (new): /the-map "Edit your countries on the map ↑" does nothing.** 390 and 1440, signed in and out. The ghost button
   in `.tll-map-explainer-inner .tll-map-cta-row` links `#tll-map-canvas`, an id no page has any more (0 of 33). Clicked from
   where it sits, the page stays put (1440 signed out: scrollY 4692 before and after, the map 3,952 px above; 390 signed in:
   20680 before and after) and only the hash changes. The hero "OPEN FULL SCREEN →" with the same href works, because the
   Map 2.0 code (map-2.0/dist/tll-map-layers.js at 46a21a18) has its own full-screen click handler (full screen on in both runs, 1440 and 390); the page's own fs-embed script
   still looks for `#tll-map-canvas` and returns at once. Severity medium. Fix lives in page code (/the-map explainer link).
   Smallest fix: change that link's href to `#tll-map-layers` (the Map 2.0 root); the dead fs-embed script can go at the
   same time.
3. **D3 (new): /account "Newsletter" card leads to the home page.** All widths, signed in. The settings card "Newsletter. It
   lands when a story earns it. Manage your subscription. Preferences →" links /newsletter, which answers 301 to / since the
   Nov 9 redirect import (handoff/WEBFLOW-LOCK.md Nov 9 08:05). Severity medium. Fix lives in the Designer (/account settings
   card link). Smallest fix: link the card to where the newsletter is managed today, or hide the card until a page exists;
   decision for Nancy which.
4. **D4 (KNOWN): footer links /awards, /spotlight, /creators answer 301** on all 32 pages with the footer. Severity low.
   Designer (footer component). KNOWN: NANCY-WHEN-HOME "Footer sitting ... Decide whether Layover Awards, Spotlight and For
   creators come out."
5. **D5 (KNOWN): footer "Cookie settings" is `href="#"`.** Every page. Severity low. KNOWN: NANCY-WHEN-HOME footer sitting
   F1a, F1b.
6. **D6 (new): two site-wide registered scripts have no target on any page.** `tll_world_map_v1-1.0.0.js` (2,832 bytes) returns
   at once unless `#tll-map-canvas` exists (0 of 33 pages), and `tllmapv3-1.0.0.js` (1,959 bytes) only drives the old D3 map
   (`?embed=1` view and a capture click on `path.country`). Both load on all 33 pages. Severity low. Fix lives in the Webflow
   site scripts (Designer or a release). Smallest fix: remove both from the site-level applied scripts after a check that no
   CMS item still renders `#tll-map-canvas` or `path.country`; decision for Nancy.
7. **D7 (KNOWN decision, stale flag): staged Worker routes reach every visitor.** `tll-series-v1` (`ROUTES_LIVE=false`, 11,040
   bytes) rides in the public countries, for-expats, pets, pursuits, stories and story chunks, and `tll-pros-v1`
   (`ROUTE_LIVE=false`, 6,266 bytes) in profile, pursuits and story; both exit at once without `?preview=wire`. Their comments
   say "set it to true once GET /series (/pros) answers 200"; both answer 200 today (series lists 0 stories, pros 0 entries).
   Severity low. Fix lives in the core build (src/site-layers/build-site-layers-v16.py CHUNKS). Smallest fix: move both layers
   to the staged lists so only -preview chunks carry them, until Nancy says yes to W18; KNOWN: NANCY-WHEN-HOME "Worker feature
   decisions left open" (W18), handoff/CHANGE-LOG-WORKER-CATCHUP-2026-11-11.md.
8. **D8 (new): duplicate ids in Webflow forms.** /submit `id="field"` x14, `field-2` x4, `radio` x3, `checkbox` x4, `field-5`
   x4; /my-pets `field` x6; /edit-profile `field` x4; /signup x3; /login x2 (static HTML and live DOM agree). A `label for=`
   on such an id points at the first field only. Severity low. Designer (element ids only, never the field names, proposal).
9. **D9 (new): /edit-profile page code has `<style id="tll-edit-dir-v1">` and `<script id="tll-edit-dir-v1">`.** Same id twice;
   `getElementById` finds the style. Severity low. Page code. Smallest fix: rename the script id (for example
   `tll-edit-dir-js-v1`).
10. **D10 (new): /submit Write or Link picker uses `<a href="#" aria-pressed>` without `role="button"`.**
    `[data-tll-fork-pick="write"]` and `[data-tll-fork-pick="link"]`; `aria-pressed` is not allowed on a link, so assistive tech
    meets two links to "#" whose pressed state may not be read. Severity low. Page code (/submit). Smallest fix: add `role="button"` to both.
11. **D11 (new): two versions of the Map 2.0 code are live.** /the-map loads map-2.0 at 46a21a18 (Oct 25) and /account at
    a81ffb96 (Oct 20). The only difference is the signed-out sample map, which /account never shows, so nothing is broken
    today; a later map fix would reach one page only. Severity low. Page code (/account map embed `data-tll-version`). Smallest
    fix: move /account to the same pin at the next map change.
12. **D12 (new): the places sync runs on every page for members.** The site-wide script with asset id 6ab3ffc725f5275a468b5b0c (the places sync) calls Memberstack
    `getCurrentMember` and `queryDataRecords` on each page view of a signed-in member and can add up to 8 records per view
    when the member's places are not yet in its Memberstack data table. Read from the script; not exercised (the stand-in answers no
    records). Severity low. Webflow site script. Smallest fix: run it only on /the-map and /account; decision for Nancy since it
    touches Memberstack behavior.
13. **D13 (KNOWN): every page downloads /stories and /sitemap.xml for counts.** Same-site fetches per load (390, signed
    out): /sitemap.xml twice and /stories once on story pages, the profile, /travelers, /cookies, /about, /the-paw-passport,
    /for-expats and /edit-profile; /stories three /sitemap.xml requests; home three /stories requests, two /sitemap.xml and
    /pets/<pet>; /for-expats adds /travelers (the R1 parse). Later requests may be answered 304 by the browser cache; the
    harness counts requests, not bytes. Severity low. KNOWN: NANCY-WHEN-HOME "D1 and D2: hidden Site stats and Pets lists"
    and "Footer sitting ... F1 fetch line" (bandwidth fix 4; that note says two /stories requests on home, this pass saw
    three).

Targeted runs (debug/results/extra.jsonl, extra2.jsonl), 0 page errors in all 26:
- R1 in the browser, /for-expats?country=Denmark at 1440 and 390: heading "The experts so far.", 0 expert cards, the fallback
  link, and "No expert in Denmark yet. Live there? The desk is yours to claim." (D1).
- Layers fed changed markup, no page error in any: Lisbon story without the gallery section, without the share row, and with
  its h1 turned into an h2; /stories without `tll-lib-grid`; /travelers without `tv-card`; home without `data-h3-track`; the
  profile with no h1.
- Signed out with the stand-in answering no member cookie, /account and /edit-profile send no Worker request (in the main pass
  the stand-in still returned a cookie, so the Worker POSTs logged there are the harness, not the site).


## Checked and fine

- Internal links: 302 paths, 298 answer 200, 4 answer 301 (/awards, /creators, /spotlight to /stories or /travelers, KNOWN;
  /newsletter to /, D3). 197 /countries pages linked from /destinations all answer 200. link-status.txt (profile paths masked, so it lists fewer lines).
- Hash links handled by script: /the-map#edit (the map page's hashOpen), /account `#card` (data-a3-go tab switch).
- jsDelivr: core 0f04fabf, photo send 4d12668d, account stories a1fb28e5, quick log cab2aea1, member way e4342d4e, photo clean
  f67f3f74, map CSS 46a21a18 and a81ffb96, owner record aeba4703, share card 725d85ac, circle flags: all 200.
- Worker GETs seen in the browser: /owner-map, /expats-map, /lounge, /whats-new, /album, /collections/public, /crew/public,
  /stamps/public; checked by curl too: /health, /pros, /series, /settings. All 200.
- Inline scripts: 115 unique, 0 syntax errors; JSON and JSON-LD blocks all parse.
- Content images: no visible `img` without an alt attribute on any page. Empty alt only where a text link or a labelled button
  carries the name (story card avatars, /destinations card photos, /travelers photo tiles, the profile album mounts).
- Story galleries: Lisbon 8 tiles and Vietnam 19 tiles render with no placeholder showing; Balkans (no gallery photos) shows no
  empty gallery.
- 404 page answers 404 with its own page.

## Evidence

- debug/results/out390.jsonl, out1440.jsonl, in.jsonl, extra.jsonl (one line per load; masked), net.json (bytes)
- debug/static.json (static pass), debug/link-status.txt (status per internal path, masked)
- debug/results/extra2.jsonl (the /the-map explainer link clicked)
- debug/bin/ (harness: d.cjs, x.cjs, y.cjs, static.py, an.py, run scripts)
