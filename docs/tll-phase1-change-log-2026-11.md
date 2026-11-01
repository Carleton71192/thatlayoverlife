# Phase 1, speed and photos: change log (1 Nov 2026, staged as site layers 16.50.0, nothing published, Worker not deployed)

**Read for this phase:** Nancy's Phase 1 prompt, the "TLL build order and brand refresh" doc, the saved live code in `scratchpad/p0-1031/`, and the three inventories in `docs/phase1-inventories-2026-11.md`. The project docs the prompt names (performance baseline, photo upload fix, Download everything fix prompt, UX flows Phase 7) are not in the repo or this session; the audit table in the prompt itself was the brief.

**Blocked:** the sandbox cannot reach thatlayover.life, jsDelivr, the Webflow CDN or Cloudinary, so there is no fresh Lighthouse baseline and no after numbers. Everything below was built and tested offline (vitest, node parse checks, Playwright against local fixtures with mocked requests) and reviewed twice by independent reviewers who tried to break it. The gate for this phase (home layout shift under 0.1, images under 1 MB, Lighthouse mobile 50+) can only be measured once `www.thatlayover.life` is allowed under this environment's Network access.

**How it was built:** three builds in isolated copies of the repo, each followed by two adversarial reviewers (correctness, rules), fix passes until both passed, then merged. The review verdicts are in `scratchpad/p1-verdicts.txt` and `scratchpad/p1-verdicts-round2.txt`.

---

## What the inventories found (before touching anything)

- **The bundle was 500 KB, not 426 KB.** The live file at 16.49.0 is 500.5 KB raw (143 KB gzip): 58 scripts plus the story and cover layers, loaded render-blocking on every page. On the home page 110 KB of it runs and 390 KB is dead weight; on /stories 98 KB runs and 402 KB is dead. Block comments alone were 76 KB.
- **Third parties on the home page:** the AdSense script in the home page's own head code (before consent), Ahrefs analytics at first paint, Google Fonts through webfont.js, GSAP with ScrollTrigger and SplitText for the shelf animation, jQuery (Webflow's own), Cloudflare Turnstile on the newsletter form, the CookieConsent stylesheet. The full table with a keep, defer or remove recommendation is in the inventories doc.
- **Images the layers insert:** the home cover photo (the LCP candidate) was loaded with no priority hint and nothing reserved its space; shelf cards, faces and page-hero tiles loaded eagerly at full size; album and rail images had no sized box.

---

## 1. The site script: a small core plus per-page chunks

| Before | After |
|---|---|
| One 500 KB file, render-blocking on every page | A 159 KB core in the header, plus chunks loaded per page without blocking the parser |
| Home page downloads 500 KB of script | Home page downloads about 220 KB in all (core plus the home and site chunks) |
| Live: 16.49.0 (pin 4fdf0e1d) | Staged: 16.50.0 (pin 8c86c215), registered and applied to the header on 1 Nov 12:32 UTC, waiting on a publish |

- **The core** holds what must run before the first paint: the consent defaults, the nine CSS blocks, the cover layer for the home page, the story layer for story pages, the page-hero photos (so /stories, /travelers, /the-map, /about and /for-expats do not shift), the ad pause for ad-free pages, the Phase 0 redirects and noindex rules, and a two-kilobyte loader.
- **The chunks** (23 files under `src/site-layers/chunks/`) hold everything that waits for the page anyway: /stories 40 KB, a story page 29 KB, /submit 37 KB, /edit-profile 94 KB, a profile 68 KB, /account 51 KB (with the rebuilt export), the map 19 KB, and so on. Staged layers (expat, pets, UX previews) ride in separate `-preview` chunks that load only when a preview switch is on, so the public never downloads staged code.
- **How a chunk loads:** the core reads its own script URL (the pinned jsDelivr commit) and appends the chunk files from the same commit, in order, each with an integrity hash computed at build time, so a chunk can never be swapped or served stale. No change to the release steps.
- **Nothing in any layer changed for the split** except two one-line fixes the reviewers asked for: the album settings section polls for its anchors instead of relying on two fixed timers, and the pursuit hub noindex now sits in the core so a hub page is safe before its chunk arrives.
- **Accepted tradeoff:** /travelers can show the retired open-slot tile for a moment on a slow connection before its chunk hides it. The optional next step, moving the cover and story layers into page-level scripts (about 30 KB core), needs Webflow registrations against the 15-script cap and waits for Nancy.

**Verified offline:** every layer's code is byte-identical to the old bundle except the layers changed on purpose in this phase; the right chunks load, in order, on 11 page types; no chunk loads on a page that does not need it; the ad pause runs on the home page before any chunk; the hub noindex exists before the pursuits chunk.

## 2. Home cover: no layout shift, early cover photo

The Lighthouse shift of 0.70 had two causes, both reproduced on the saved fixture:
- With the cover style in the head, the page's own phone rules won every tie until the bundle moved the style later, so the headline and deck resized after load. Every hero rule now carries one extra selector so the cover wins from the first paint.
- The words block is bottom-anchored, so inserting the chip, kicker, Join button and credit pushed it up by about 188 px on phones. CSS that applies before the cover runs now holds that room.

Also: a preload link for the week's cover photo at high priority, `fetchpriority=high` and eager loading on the cover image, lazy loading with async decode on every shelf card and face, sized boxes so nothing jumps. **Measured on the fixture:** the first element after the hero moves 0 px at 390 and 1440 (was 188 px and 116 px); the final page is pixel-identical to before (0 differing pixels). Webflow responsive variants (`-p-500`, `-p-800`) are tried only for lazy tiles, with a fallback to the original, never for above-the-fold images.

## 3. Ads load at idle, after consent, only where allowed

After ad consent the AdSense script loads when the browser is idle (within 4 s) on story, library and country pages. Auto ads keep behaving exactly as before (a first draft had switched them off until manual slot ids exist; the reviewers caught that and it was reverted). The consent gate is unchanged.

## 4. Home page head: the pre-consent AdSense tag (found by the reviewers)

Phase 0 replaced the ad script in the site head, but the home page's own head code (added 28 Oct) still loaded `adsbygoogle.js` before any choice. Removed and verified by readback; staged for the next publish. Until then the home page still makes ad requests before a choice.

## 5. Download everything, rebuilt for iPhone and the free Worker plan (Phase 1B)

**The problem:** the old button built the whole zip in the browser, fetching every photo across origins and holding it all in memory; on iPhone that failed with "Load failed", and a big library could exhaust memory.

**The constraint found in review:** the Worker runs on the Cloudflare free plan (10 ms CPU per request, 50 subrequests), so a Worker that streams every photo byte through a checksum would fail mid-download on any real library. The first design did exactly that and was redesigned.

**The design that holds:**
1. **"Download everything"** asks the Worker to prepare a copy (`POST /export/prepare`, with the member's map), then follows a plain link (`GET /export/zip?t=…`) that streams a **records zip**: README, profile, every story as its own page plus a list, collections, stamps, pets, companions, places lived, the map files, and `photos/index.html` with every photo's link. No photo bytes, so it costs a few milliseconds of CPU and a handful of requests, and a plain link download works on iPhone. The link is valid 15 minutes.
2. **"Download your photos"** (shown when the copy has photos) fetches each photo through a Worker proxy (`GET /export/photo`, same-origin for the browser, host allowlist, image only, no checksum, streams straight through) and packs them with JSZip in **parts** of at most 25 photos or about 80 MB, so memory stays bounded. **Every part saves on its own tap** ("Save part N of K"), because browsers block a second download that has no tap behind it. Photos that fail are listed as links. The proxy stays open 60 minutes.
3. A new store-only zip writer (`src/zip.js`, no library, streaming, with tests against Python's zipfile and unzip).

**Worker routes added:** `POST /export/prepare`, `GET /export/zip`, `GET /export/photo`. `POST /export` is unchanged. No new secrets, vars or KV namespaces.

**Deploy order matters:** the Worker first (`npx wrangler deploy`), then the site publish. The old layer keeps working against the new Worker, but the new layer needs the new routes.

**Visible changes on /account (for approval):** the card is now styled (a 31 Oct bug left its CSS uninjected); new strings for the new states: "Your copy is on its way.", "Download your photos", "Save part N of K", "Part N of K is ready to save.", "N photos in K parts."; the README's stories and photos lines changed to describe the two-step copy. The old lines ("Gathering your stories and records…", "Photos N of M…", "Done. N stories, M photos (K listed as links).", "The download did not finish. Try again.") are kept word for word.

**Worker strings, also new (for approval):** the README in the records zip describes the two-step copy; `photos/index.html` says "Your photos" and "N photos, each with its link." with the line "The photos themselves come as zip parts from "Download your photos" on your account page."; a browser that opens an old link sees a small page, "That download link has expired. Go back to your account page and press the button again." (or "The download could not start. Go back to your account page and try again.") with a "Back to your account" link; two JSON errors the card can show: "Your map is too large to include. Try again without it." and, for one photo that times out, that photo is listed as a link instead.

**Events:** `download_complete` now marks the records link being followed (no photo count); a new `photos_complete` carries photos, parts and links.

**Third review round (1 Nov, afternoon):** every part, part 1 included, saves on its own tap; a finished or failed card keeps its lines when the link expires; duplicate photo names inside a part get -2, -3 like the Worker's zip; the part count K is steady across a run; JSZip gets 60 s to arrive, then the fallback line shows and the buttons free up. 310 unit tests and a 101-check Playwright run against a mocked Worker, all green.

## 6. Not done in this phase, and why

- **Lighthouse before and after, live screenshots, the real-user data check:** no network to the site. Needs `www.thatlayover.life` allowed in the environment's Network access, then one run before and one after the publish.
- **Fonts (self-host four families as WOFF2 subsets, remove webfont.js, Newsreader, DM Sans, Inter Tight):** these live in Webflow Site settings and the Designer's font setup; the site head's Google Fonts link also needs to become non-blocking. Needs a session with Nancy. The bundle still inserts the Newsreader and Inter Tight stylesheet for the cover; that goes once the families are consolidated.
- **Turnstile only on form focus, GSAP deferred, jQuery kept only if Webflow needs it:** these are in the home page's footer code and Designer embeds. The inventory says what to change; applying it blind (no way to see the shelf animation) risks breaking the home page, so it waits for network access.
- **Photo pipeline for member uploads (HEIC conversion, 400 to 1600 px WebP versions, backfill):** HEIC needs a converter library of about 1 MB loaded on demand and testing on an iPhone; the backfill needs the CDN. Cloudinary already serves sized versions by URL (the layers use `c_limit,w_…,q_auto,f_auto`); Webflow-hosted CMS images have variants only where Webflow made them. Planned for when the network is open.
- **/gallery and /stories "Load more" after two screens:** needs the live page structure.
- **Hidden duplicate blocks and the 2,401-element DOM:** Designer work, needs the live page and Nancy.

## 7. Needs Nancy

1. Allow `www.thatlayover.life` (and ideally `cdn.jsdelivr.net`, `cdn.prod.website-files.com`, `res.cloudinary.com`) under Network access for this environment, so the baseline and the after numbers can be measured.
2. Approve the /account card strings and the styled card (see `scratchpad/shots-1031/export_*.png`).
3. Deploy the Worker, then say go for the publish. The new core is registered as 16.50.0 and applied to the header; it goes live only with a publish. Any publish by anyone carries it, so the lock file says what to do if a publish is needed before your go.
4. After publish, on the subdomain first: open the home page (the cover fills before paint as before), a story page, /travelers, /the-map (save still posts continent counts), and run one export with more than 25 photos on an iPhone and a Mac.
5. A session for the fonts and the home page footer scripts.

## Rollback

Re-apply site layers 16.49.0 (the one-file bundle) in Webflow; the Worker's old `POST /export` route is unchanged, so the old layer keeps working.
