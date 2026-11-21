# Sweep 21 Nov 2026, lens DEBUG: what is broken on www

Read only. No Webflow, Memberstack, Cloudinary or Worker writes; no form sent; every non-GET aborted in the browser.
Live state checked: core 16.68.0 (layers-release pin 0f04fabf), www as served on 21 Nov 2026 between 09:52 and 10:50 UTC.
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
- Targeted runs (debug/bin/x.cjs): R1 with `?country=Denmark`, the /the-map full screen link clicked, layers fed changed markup,
  same-site fetches per page.
- Webflow-host bytes for this lens: about 32 MB (26.5 MB browser assets, 5.2 MB HTML, 57 KB scripts).

Harness noise, not site faults: Turnstile and Memberstack POSTs are aborted by the harness, so their "Failed to load resource:
net::ERR_FAILED" lines and "[Cloudflare Turnstile] Error: 300010" warnings are ours. The signed-out avatar `img src=""` on
/account (a `data-ms-action` element) reads as broken only because the stand-in never fills it.

## Result in one line

0 page errors in 90 loads; 0 console errors from site code; 0 4xx/5xx on our assets; all 11 jsDelivr pins 200; all 8 Worker GET
endpoints the pages call answer 200; all 302 internal link targets answer 200 or a 301. The broken things are behavioral.

## Findings

Severity: high = broken or blocks a user; medium = confusing or noticeably off; low = polish.

1. **D1 (KNOWN, still live): /for-expats shows no experts.** All widths, signed in or out. "The experts so far." keeps its
   fallback link and no card, and the country finder answers "No expert in Denmark yet" while the Worker's /expats-map lists
   2 expats (countries dk and th) and the map shows them. The page footer script (`loadTravelers`, for-expats.html at byte
   142105) fetches /travelers and reads `a.tll-trav-card-dark[href^="/contributors/"]` with `[data-tll-t^="pill-"]` country
   pills; live /travelers has 9 profile links, all `a.tv-card`, 0 `tll-trav-card-dark` and 0 `data-tll-t="pill-` attributes.
   Severity high. Fix lives in page code (/for-expats footer). Smallest fix: build the list from the Worker's
   GET /expats-map (slug, country, place), which the map already uses, instead of parsing /travelers. KNOWN:
   handoff/NANCY-WHEN-HOME.md "Codebase refactor branch awaiting your OK", origin/claude/codebase-refactor-2026-11-12 updates.md
   section 6 item 4 (R1).
2. **D2 (new): /the-map "OPEN FULL SCREEN →" does nothing.** 390 and 1440, signed in and out. Both links on the page
   (`a[data-tll-map="fullscreen"]` in the hero and the ghost button in `.tll-map-cta-row`) point at `#tll-map-canvas`, an id
   that no page has any more (0 of 33). The page's fs-embed script starts with `if(!a||!c)return;`, so no handler is bound and
   a tap only sets the hash. Severity medium. Fix lives in page code (/the-map, the fs-embed and the two links). Smallest fix:
   point both at `#tll-map-layers` and call `requestFullscreen()` on that root (the Map 2.0 container), or remove the link.
3. **D3 (new): /account "Newsletter" card leads to the home page.** All widths, signed in. The settings card "Newsletter. It
   lands when a story earns it. Manage your subscription. Preferences →" links /newsletter, which answers 301 to / since the
   9 Nov redirect import (handoff/WEBFLOW-LOCK.md 9 Nov 08:05). Severity medium. Fix lives in the Designer (/account settings
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
7. **D7 (KNOWN decision, stale flag): staged Worker routes ship to everyone.** `tll-series-v1` (`ROUTES_LIVE=false`, 11,040
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
    `[data-tll-fork-pick="write"]` and `[data-tll-fork-pick="link"]`; `aria-pressed` is not allowed on a link, so screen
    readers announce two links to "#". Severity low. Page code (/submit). Smallest fix: add `role="button"` to both.
11. **D11 (new): two versions of the Map 2.0 code are live.** /the-map loads map-2.0 at 46a21a18 (25 Oct) and /account at
    a81ffb96 (20 Oct). The only difference is the signed-out sample map, which /account never shows, so nothing is broken
    today; a later map fix would reach one page only. Severity low. Page code (/account map embed `data-tll-version`). Smallest
    fix: move /account to the same pin at the next map change.
12. **D12 (new): the ledger sync runs on every page for members.** `tll_ledger_sync-1.0.0.js` (site-wide) calls Memberstack
    `getCurrentMember` and `queryDataRecords` on each page view of a signed-in member and can add up to 8 records per view
    when the member's places are not in the trip_ledger table. Read from the script; not exercised (the stand-in answers no
    records). Severity low. Webflow site script. Smallest fix: run it only on /the-map and /account; decision for Nancy since it
    touches Memberstack behavior.

Targeted runs (R1 in the browser, the full screen click, changed markup, same-site fetches): waiting for the browser; this section is filled in by the next commit.


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
- debug/bin/ (harness: d.cjs, x.cjs, static.py, an.py, run scripts)
