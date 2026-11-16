"""Builds the site layers from their parts. Run from anywhere: python3 src/site-layers/build-site-layers-v16.py
Two kinds of output, deterministic (same inputs, same bytes):
  src/site-layers/tll-site-layers-v16.js  the core, the one registered site-wide header script (synchronous). In order: the consent
      fallback, the chunk loader, the ten styles, the layers that must run before the first paint on their page (ux-1028 and
      mbar-align head CSS, photos-form-v2 on /share-photos, album-settings on /the-map, phase0, and since the 1 Nov review the
      ads pause, page-heroes, stories-noimg, home-bands and lounge-labels; see CORE below) or on every page (division,
      note-typing, account-hash-tabs), the story layer (/stories/{slug}) and the cover layer (home).
  src/site-layers/chunks/<name>.js  per-path chunks: the layers that only run on those paths, in SCRIPTS order. The loader in the
      core appends them as script tags (async=false keeps the order and never blocks the parser; integrity from the hashes embedded
      here; crossorigin anonymous) from the same pinned jsDelivr commit the core was loaded from, read off its own script tag, so no
      placeholder is needed. Chunks that hold staged layers also get a <name>-preview.js variant, loaded instead of the public one
      only when a preview flag (?preview=, ?qr=) or a tll-preview-* localStorage key is present, so the public never downloads
      staged code. Every layer keeps its own path guard, so a chunk on the wrong page does nothing.
Release step unchanged: commit (core and chunks together, the embedded hashes tie them to one commit), then register the core at
that commit with its own SRI, as today. One registered script, so Webflow's 15-script limit is untouched.
Why (1 Nov 2026): the one-file bundle had reached 500 KB, render-blocking on every page, while a page runs 100 to 125 KB of it.
Each layer's own header comment stays in its source and is left out of the downloads; a one-line source marker takes its place.
History: v16 = v15 plus F1 (29 Oct 2026, Nancy: the old home hero shows for a blink before the cover): the cover style goes into the
head at once and moves to the end of the body when the page is parsed; the cover fills the hero as soon as the hero has arrived.
v15 = v14 plus story photos on five pages and the home cover's Join free button. v14 = v13 plus the 28 Oct UX layer. v13 = v12 plus
Consent Mode v2 at the very top. v12 = v11 plus stamps on the library cards and the letter (inside the cover layer). The story layer
runs only on /stories/{slug}: its style goes at the END of the body once the DOM is parsed, so it sits after the template's own head
and footer styles in the cascade and wins every tie. 10 Nov 2026 (type system): the story and cover layers no longer carry a Google
Fonts link (Newsreader and Inter Tight are gone; Playfair Display and JetBrains Mono come from the site head, Plex from Webflow), so
the build injects no font link; tll-buttons-v1 joins STYLES as the one button set. 12 Nov 2026 (font loading jump on phones):
tll-font-fallbacks-v1 goes first in STYLES (metric-matched local fallback faces TLLSansA, TLLSansR, TLLSerifG, TLLSerifN, TLLSerifT), and
fallbacks() below puts their names into every font stack of the layers as they are built, right after the web font, so a layer's source
keeps its plain stack and the download carries the fallbacks. 13 Nov 2026 (bandwidth fixes 2, 3 and 7, reports/bandwidth-2026-11-13.md):
img-variants caps card and cover photos at 2x on phones (cap()), tll-rail-hold-v1 joins the core, tll-paw-hero-img-v1 joins STYLES.
Same day: tll-self-data-v1 (bandwidth fixes 4 and 5) and tll-library-hold-v1 (the home library jump, N9) join the core.
14 Nov 2026 (the story first-frame jump at 390, reports/evidence/story-first-frame-2026-11-14/): the story layer gets F1 (its style in
the head at once, the magazine moves run as soon as the byline row has arrived). A2: the copied template rules sit in their own head style,
taken out once the template's style is parsed, so later template edits win; two holds keep the photo still for the Receipts line and the
template script's place-and-date rewrite. A3 (same day, the 16.65.0 checks): the template script's place-and-date words, its country link
box and the site flag script's flags are laid out before the first paint, so the page-parsed rewrites no longer move the painted head.
A4 (same day, the A3 checks): a static country table (region-names-v1.json), a flag stand-in made of img elements and put in as soon as
the crumb is parsed, and the photo hold now also covers the story after the hero from the moment the hero is parsed.
16 Nov 2026 (layout shift sweep on the pages that are not stories, reports/evidence/cls-sweep-2026-11-16/, for release 16.67.0): page-heroes
dresses the heroes of /travelers, /the-map, /about and /for-expats as the parser adds them (it waited for the page-parsed event), and
tll-first-paint-v1 joins the core for /travelers, /the-map and /about. The build checks the page rules that layer copies against the saved page
code (FIRST_PAINT below), so a copy cannot drift from its source unnoticed.
Part B, same day: tll-early-state-v1 joins the core. It lays out, while the page is parsed, what the site head (the nav on /account and
/submit, the Menu button), the /stories page code and the profile page code settle at the page-parsed event, and
hands the page back right before that code runs. The build checks the page code it follows against the saved copies (EARLY_STATE below)."""
import re, json, os, hashlib, base64, gzip, glob
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
OUT = 'src/site-layers/tll-site-layers-v16.js'
CHUNK_DIR = 'src/site-layers/chunks'
STYLES = [('src/site-layers/tll-font-fallbacks-v1.html', 'tll-font-fallbacks-v1', 'fallback faces sized like Plex and Playfair, so text keeps its lines when the web fonts arrive'),
          ('src/site-layers/tll-nav-phone-v1.html', 'tll-nav-phone-v1', 'phone header'),
          ('src/site-layers/tll-contrast-v1.html', 'tll-contrast-v1', 'contrast'),
          ('src/site-layers/tll-note-phone-v1.html', 'tll-note-phone-v1', 'round note button on phones'),
          ('src/site-layers/tll-photos-tap-v1.html', 'tll-photos-tap-v1', '/share-photos drop zone tap on iPhones'),
          ('src/site-layers/tll-home-coords-v1.html', 'tll-home-coords-v1', 'home photo coordinates inside the screen on phones'),
          ('src/site-layers/tll-footer-wordmark-v1.html', 'tll-footer-wordmark-v1', 'footer wordmark matches the header'),
          ('src/site-layers/tll-tap-colors-v1.html', 'tll-tap-colors-v1', '/account Stories tab: ink text and a rose underline on hover and tap, no rose or teal text'),
          ('src/site-layers/tll-shelf-ring-v1.html', 'tll-shelf-ring-v1', 'home library rail: room for the avatar ring on phones'),
          ('src/site-layers/tll-masthead-v1.html', 'tll-masthead-v1', 'footer masthead line in Playfair Display italic'),
          ('src/site-layers/tll-buttons-v1.html', 'tll-buttons-v1', 'one button set: filled rose, outlined, text link; square corners; IBM Plex Sans Condensed 600'),
          ('src/site-layers/tll-focus-v1.html', 'tll-focus-v1', '10 Nov hygiene: 2px rose keyboard focus ring (focus-visible) on links, buttons and fields'),
          ('src/site-layers/tll-paw-hero-img-v1.html', 'tll-paw-hero-img-v1', '13 Nov bandwidth fix 7: /the-paw-passport hero takes the 1080px copy on phones and the 1600px copy wider, not the 1.18 MB original')]
SCRIPTS = [('src/site-layers/tll-img-variants-v1.js', '10 Nov week one item 4: CMS photos get a srcset from their site-bucket twin variants, the story hero loads first'),
           ('src/components/member-bar/tll-account-hash-tabs-v1.js', 'member bar SETTINGS and CONTRIBUTIONS open their /account tab'),
           ('src/site-layers/tll-note-typing-v1.js', 'note button steps aside while typing'),
           ('src/components/edit-profile-fixes/tll-ep-country-v1.js', '/edit-profile country field reads "Portland, Oregon, USA"; pen name note copy'),
           ('src/site-layers/tll-footer-wordmark-v1.js', 'footer wordmark text'),
           ('src/site-layers/tll-masthead-v1.js', 'footer masthead line: Written by the people who went'),
           ('src/site-layers/tll-ux-1028-v1.js', '28 Oct UX review: type floor, success message contrast, Tell the editor clear of the home hero'),
           ('src/site-layers/tll-page-heroes-v1.js', '29 Oct: story photos on /stories, /travelers, /the-map, /about and /for-expats, credited and linked'),
           ('src/site-layers/tll-first-paint-v1.js', '16 Nov: /travelers, /the-map and /about first screen laid out before the first paint (late page styles, the map height, the title verb)'),
           ('src/site-layers/tll-early-state-v1.js', '16 Nov: the nav on /account and /submit, the Menu button, the /stories filter row and lead card, and the profile head laid out before the first paint, handed back to the page code right before it runs'),
           ('src/site-layers/tll-story-ask-v1.js', '29 Oct: end-of-story ask, Pitch a layover story first, then send one photo'),
           ('src/site-layers/tll-open-slots-v1.js', '29 Oct: /spotlight coming-soon and open-slot cards become one Pitch your layover tile'),
           ('src/site-layers/tll-travelers-fix-v1.js', '29 Oct testers: /travelers link chips as labelled pills inside the card, no empty grid cell, one action tile instead of the open slot'),
           ('src/site-layers/tll-ep-ux-v1.js', '29 Oct testers: /edit-profile save bar at the bottom, field stays put while saving, country suggestions, photo crop'),
           ('src/site-layers/tll-submit-ux-v1.js', '29 Oct testers: /submit toolbar buttons labelled, Subhead easy to find'),
           ('src/site-layers/tll-profile-count-v1.js', '29 Oct: profile STORIES stat keeps the writer own count (the head script wrote the site total)'),
           ('src/site-layers/tll-hover-v1.js', '29 Oct Nancy: dark pink hover on light backgrounds instead of bright teal on /account'),
           ('src/site-layers/tll-home-bands-v1.js', '29 Oct Nancy: home photo bands use members story photos at full size, credited and linked'),
           ('src/site-layers/tll-rail-hold-v1.js', '13 Nov bandwidth fix 3: home rail card photos on phones wait until the rail has its final six or is near the screen'),
           ('src/site-layers/tll-library-hold-v1.js', '13 Nov: home library swipe row holds the height of its tallest card, so the story feed redraw does not move the page (N9)'),
           ('src/site-layers/tll-photos-caption-v1.js', '29 Oct: /share-photos caption room 600 characters with a running count (was cut at 256)'),
           ('src/site-layers/tll-lounge-labels-v1.js', '29 Oct Nancy: /gallery tile labels small, in the corner, off the photo'),
           ('src/site-layers/tll-stories-places-v1.js', '29 Oct Nancy: /stories place chips add Asia, Middle East and Oceania; in the library line'),
           ('src/site-layers/tll-stories-noimg-v1.js', '29 Oct Nancy: /stories card without a photo shows a plain panel; the lead goes to the newest story with a photo'),
           ('src/site-layers/tll-linkout-preview-v1.js', '29 Oct Nancy: /submit link-out form previews the article and sends its share photo (photos only, never ads) once the Worker route is live'),
           ('src/site-layers/tll-linkout-summary-v1.js', '31 Oct Nancy: AI summary box for linked articles, labeled as AI, and an own-photo backup when the article has no usable photo'),
           ('src/site-layers/tll-byline-links-v1.js', '29 Oct Nancy: story card writer name and photo open the writer page'),
           ('src/site-layers/tll-mbar-align-v1.js', '29 Oct Nancy: member bar links line up with the page column'),
           ('src/site-layers/tll-story-fixes-1029-v1.js', '29 Oct Nancy: US flag for US state labels; related heading Other stories from this frequent traveler'),
           ('src/site-layers/tll-email-hello-v1.js', '29 Oct Nancy: every site email address shows and links to hello@thatlayover.life'),
           ('src/site-layers/tll-ep-marks-v1.js', '29 Oct tester Mariam: /edit-profile field marks say saved to your account when only the public page update failed'),
           ('src/site-layers/tll-ep-help-v1.js', '29 Oct tester Roberta: help marks open on tap and keyboard; One line reads Tagline with a hint'),
           ('src/site-layers/tll-expert-from-v1.js', '29 Oct tester Roberta: Location Expert form asks where you are from'),
           ('src/site-layers/tll-submit-gallery-v1.js', '29 Oct tester Roberta: /submit gallery keeps every photo picked, plain autosave line'),
           ('src/site-layers/tll-submit-long-v1.js', '29 Oct Nancy: long stories arrive in full (body-part-1..12)'),
           ('src/site-layers/tll-photos-form-v2.js', '29 Oct Nancy: /share-photos takes 30 photos and PNG'),
           ('src/site-layers/tll-ep-linkstack-v1.js', '29 Oct Nancy: More links editor on /edit-profile'),
           ('src/site-layers/tll-pf-linkstack-v1.js', '29 Oct Nancy: More links on public profiles'),
           ('src/site-layers/tll-redesign-p0-v1.js', '31 Oct Nancy: expats tiles coming soon, Horseshoe Bend off the home shelf, labeled map counts'),
           ('src/site-layers/tll-expats-map-v1.js', '31 Oct Nancy: expats map with flags on /for-expats (opt-in, home base, country level)'),
           ('src/site-layers/tll-story-captions-v1.js', '31 Oct Roberta: photo captions on story pages from Photo placements'),
           ('src/site-layers/tll-intake-v1.js', '31 Oct Nancy: instant set-up of submissions, ending check before send'),
           ('src/site-layers/tll-lounge-members-v1.js', '31 Oct Nancy: member photos appear in the Lounge'),
           ('src/site-layers/tll-lounge-deck-v1.js', '11 Nov Nancy: the Lounge as a swipeable postcard deck on /gallery, staged behind ?preview=lounge'),
           ('src/site-layers/tll-crew-v1.js', '31 Oct Nancy approved the companions mockup: invite then accept, Travels with, shared pets'),
           ('src/site-layers/tll-home-value-v1.js', '31 Oct Value Playbook Phase 1: home value section, staged behind ?preview=value'),
           ('src/site-layers/tll-collections-v1.js', '31 Oct Nancy: souvenir collections on /edit-profile and profiles, private by default with opt in'),
           ('src/site-layers/tll-whats-new-v1.js', '31 Oct Nancy: What is new dot and /account card for signed-in members, entries switched on in the CMS'),
           ('src/site-layers/tll-stamps-v1.js', '31 Oct Value Playbook Phase 2: pursuit stamps and badges, hub noindex until 6 stories from 3 writers'),
           ('src/site-layers/tll-album-v1.js', '31 Oct Value Playbook Phase 3: continent album and Slide Show on profiles, staged behind ?preview=album'),
           ('src/site-layers/tll-album-settings-v1.js', '31 Oct Nancy: per-continent map counts (numbers only) and how each member counts continents (7, 6 or 5)'),
           ('src/site-layers/tll-export-v1.js', '31 Oct Value Playbook Phase 4: Download everything on /account; 1 Nov Phase 1B: records zip from the Worker, photos in parts through /export/photo, one tap per part'),
           ('src/site-layers/tll-pros-v1.js', '31 Oct Value Playbook Phase 6: From the Pros label, author box with one link, pro badge, hub row'),
           ('src/site-layers/tll-division-v1.js', '31 Oct Value Playbook Phase 7: tll or paw-passport on GA4 and revenue links, entity from one setting'),
           ('src/site-layers/tll-paw-v1.js', '31 Oct Value Playbook Phase 8: Paw Passport waitlist and QR landing, staged behind ?preview=paw until the trademark is clear'),
           ('src/site-layers/tll-metrics-v1.js', '31 Oct Value Playbook Phase 9: owner-only investor metrics on /account with snapshot download'),
           ('src/site-layers/tll-series-v1.js', '31 Oct Nancy: every story series (labels, chips, story boxes, Trip Kit, pet note)'),
           ('src/site-layers/tll-expat-v1.js', '31 Oct Nancy: expat build (Lived in, My moves, Living Library, For Expats; staged)'),
           ('src/site-layers/tll-pet-passport-v1.js', '31 Oct Nancy: pet build (Paw Passport page, editor, landing; staged)'),
           ('src/site-layers/tll-work-trips-v1.js', '31 Oct Nancy: That Work Trip Life (map, series labels, Trip Kit; hub staged)'),
           ('src/site-layers/tll-ux-v1.js', '31 Oct Nancy: user flows (story end block, first-stamp welcome, On this day, events; staged)'),
           ('src/site-layers/tll-phase0-v1.js', '31 Oct Nancy: Phase 0 fixes (contact relay, support headline, search, map buttons, shelf count, Thailand stub)'),
           ('src/site-layers/tll-drafted-v1.js', '8 Nov Nancy: the empty pages are drafts; footer, pill, account card and edit-profile links to them hidden'),
           ('src/site-layers/tll-story-is-v1.js', '31 Oct Nancy: what a story looks like here (/submit, story end, empty search); approved, public'),
           ('src/site-layers/tll-ads-v1.js', '31 Oct Nancy: AdSense, tastefully (story pages, library, countries only)'),
           ('src/site-layers/tll-trust-v1.js', '11 Nov Nancy trust prompt: funding label above the first paragraph and on cards, reading time as text, traveled date on cards, Last updated only with a date, correction line, Reklame never alone'),
           ('src/site-layers/tll-stories-count-v1.js', '10 Nov week one item 3: /stories headline count from tllCounts.s (the footer figure), cards until then; words to twenty, digits above'),
           ('src/site-layers/tll-stories-strip-v1.js', '10 Nov week one item 5: the four-cover strip under the /stories search bar is hidden at parse time (it repeated the grid)'),
           ('src/site-layers/tll-note-footer-v1.js', '10 Nov hygiene: the Tell the editor pill fades out while the footer is on screen'),
           ('src/site-layers/tll-p0-closeout-v1.js', '11 Nov launch blockers: Example Text placeholders cleared on /submit and /share-photos; Cookie settings opens /cookies outside Europe'),
           ('src/site-layers/tll-pwa-hold-v1.js', '10 Nov Lighthouse: the footer PWA client HEAD /sw.js is answered locally with a 404 until the PWA Worker is live (no console 404, nothing registered)'),
           ('src/site-layers/tll-self-data-v1.js', '13 Nov bandwidth fixes 4 and 5: counts and pet lists from data on the page instead of downloading /stories, the sitemap and the pet page; other members\' cards on a profile hidden before their photos load')]
MAG = 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html'
COVER = 'src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html'
CONSENT = 'src/site-layers/tll-consent-mode-v2.js'

# Core members, by file name: parse-time CSS (ux-1028 head block, mbar-align), parse-time globals that must land before the page's own
# body script (photos-form-v2 sets window.__tllPhotosForm on /share-photos; album-settings wraps window.fetch on /the-map), the GA4
# division set (before the GA config), phase0 (parse-time CSS, redirects and noindex), and two delegates too small to fetch separately.
# Added after the 1 Nov review of the split (the core is written in SCRIPTS order, so these sit after phase0, ahead of the story and
# cover sections):
#   ads             its pause line (window.adsbygoogle.pauseAdRequests=1 off the ad pages) must run synchronously on every page: the home
#                   page head still carries the AdSense tag, and only a pause set before that script runs keeps Auto ads off the home page.
#                   The ad script itself stays behind ad consent inside the layer. Dropped from the stories, story and countries chunks.
#   page-heroes     hero photos above the fold on /stories, /travelers, /the-map, /about and /for-expats; from a chunk they would shift
#                   in after the first paint. Kept out of those chunks (the about chunk had nothing else and is gone).
#   stories-noimg   the lead card swap on /stories, same reason.
#   home-bands      the home band photos, above the fold on phones, same reason.
#   lounge-labels   the /gallery label CSS, in place before the page script paints its labels.
#   img-variants    (10 Nov, week one item 4) first in the core: its MutationObserver must see each img as the parser adds it, before a
#                   lazy photo is fetched, and page-heroes, home-bands and the cover call its window.__tllImgV before they set a src.
#   pwa-hold        (10 Nov) wraps window.fetch before the footer PWA client's window-load HEAD /sw.js, on every page.
#   rail-hold       (13 Nov, bandwidth fix 3) its hold style must be in place before the home rail is parsed, and it counts the rail's
#                   draws from the first one, so it cannot wait for a chunk.
#   self-data       (13 Nov, bandwidth fixes 4 and 5) seeds the count caches from the page's Site stats item before any DOMContentLoaded
#                   listener, and on profiles hides other members' cards from the first paint so their lazy photos are never requested.
#   library-hold    (13 Nov) the home library swipe row height: it listens for the library's first draw, which runs while the page is
#                   parsed (before the first paint), and keeps the row's height from the previous view of this tab before that draw.
#   first-paint     (16 Nov, layout shift sweep) its head styles and its watcher must be in place before /travelers, /the-map and /about are
#                   parsed: it lays out, before the first paint, what those pages' own late styles and page-parsed scripts settle after it.
#                   After page-heroes, so the hero is dressed before the /travelers title is measured (observers run in this order).
#   early-state     (16 Nov, layout shift sweep part B) its watcher must see the nav, the /stories filter row and grid and the profile hero as
#                   the parser adds them, and its window capture listener must be in place before the page-parsed event.
# Accepted tradeoff (1 Nov): travelers-fix (18 KB) stays in the travelers chunk although its top-level style() call shapes the first paint
# of /travelers, so on a slow connection that page can show the retired open-slot tile and the old link chips for a moment before the
# chunk lands. Weighed against adding 18 KB to every page, the brief flash on one directory page was accepted.
CORE = ['tll-img-variants-v1', 'tll-account-hash-tabs-v1', 'tll-note-typing-v1', 'tll-ux-1028-v1', 'tll-mbar-align-v1', 'tll-photos-form-v2',
        'tll-album-settings-v1', 'tll-division-v1', 'tll-phase0-v1', 'tll-drafted-v1',
        'tll-ads-v1', 'tll-page-heroes-v1', 'tll-first-paint-v1', 'tll-early-state-v1', 'tll-stories-noimg-v1', 'tll-home-bands-v1', 'tll-rail-hold-v1', 'tll-library-hold-v1',
        'tll-lounge-labels-v1', 'tll-home-value-v1', 'tll-pwa-hold-v1', 'tll-self-data-v1']
# Chunks: (name, JS regex tested against location.pathname without trailing slashes, public layers, staged layers). A layer that runs on
# several pages is repeated in each of their chunks, so a page fetches one chunk besides site. Inside a chunk the order follows SCRIPTS.
# site holds the unguarded layers that run on every page at DOMContentLoaded or later (none shapes the first paint).
# Preview note (1 Nov): tll-ux-v1 rides only in the story, submit and account preview chunks, so its site-wide signup_start tracking
# (clicks on links to /signup) now runs only on story, /submit and /account previews, not on every page as under the one-file bundle.
# Staged code (UX_PUBLIC=false), so the public is unaffected; preview testers' signup_start counts cover those three pages only.
CHUNKS = [
    ('site', r'/^/', ['tll-footer-wordmark-v1', 'tll-masthead-v1', 'tll-hover-v1', 'tll-byline-links-v1', 'tll-story-fixes-1029-v1',
                      'tll-email-hello-v1', 'tll-ep-help-v1', 'tll-whats-new-v1', 'tll-note-footer-v1', 'tll-p0-closeout-v1'], []),
    ('home', r'/^\/(index\.html)?$/', ['tll-redesign-p0-v1', 'tll-trust-v1'], []),
    ('stories', r'/^\/stories$/', ['tll-stories-places-v1', 'tll-series-v1', 'tll-story-is-v1', 'tll-trust-v1', 'tll-stories-count-v1', 'tll-stories-strip-v1'], []),
    ('story', r'/^\/stories\/[^/]+$/', ['tll-story-ask-v1', 'tll-story-captions-v1', 'tll-pros-v1', 'tll-series-v1', 'tll-story-is-v1', 'tll-trust-v1'], ['tll-ux-v1']),
    ('submit', r'/^\/submit$/', ['tll-submit-ux-v1', 'tll-linkout-preview-v1', 'tll-linkout-summary-v1', 'tll-submit-gallery-v1', 'tll-submit-long-v1',
                                 'tll-intake-v1', 'tll-story-is-v1'], ['tll-ux-v1']),
    ('share-photos', r'/^\/share-photos$/', ['tll-photos-caption-v1', 'tll-intake-v1'], []),
    # work-trips rides along where its country table (window.__tllN2A) or its tll:stamp-added listener is read: /edit-profile (stamps saves),
    # /account (export) and /pursuits/* (its own hub).
    ('edit-profile', r'/^\/edit-profile/', ['tll-ep-country-v1', 'tll-ep-ux-v1', 'tll-ep-marks-v1', 'tll-ep-linkstack-v1', 'tll-crew-v1',
                                           'tll-collections-v1', 'tll-stamps-v1', 'tll-work-trips-v1'], ['tll-expat-v1']),
    ('profile', r'/^\/contributors\/[^/]+$/', ['tll-profile-count-v1', 'tll-pf-linkstack-v1', 'tll-crew-v1', 'tll-collections-v1', 'tll-stamps-v1',
                                               'tll-album-v1', 'tll-pros-v1'], ['tll-expat-v1']),
    ('account', r'/^\/account$/', ['tll-crew-v1', 'tll-export-v1', 'tll-metrics-v1', 'tll-work-trips-v1'], ['tll-ux-v1']),
    ('map', r'/^\/the-map$/', ['tll-redesign-p0-v1'], []),
    ('for-expats', r'/^\/for-expats$/', ['tll-expert-from-v1', 'tll-expats-map-v1', 'tll-series-v1'], ['tll-expat-v1']),
    ('travelers', r'/^\/travelers$/', ['tll-travelers-fix-v1'], []),
    ('pursuits', r'/^\/pursuits\/[^/]+$/', ['tll-stamps-v1', 'tll-pros-v1', 'tll-series-v1', 'tll-work-trips-v1'], []),
    ('pets', r'/^\/(pets\/[^/]+|my-pets|the-paw-passport)$/', ['tll-crew-v1', 'tll-album-v1', 'tll-series-v1'], ['tll-paw-v1', 'tll-pet-passport-v1']),
    ('countries', r'/^\/countries\/[^/]+$/', ['tll-series-v1'], []),
    ('misc', r'/^\/(spotlight|gallery)$/', ['tll-open-slots-v1', 'tll-lounge-members-v1'], ['tll-lounge-deck-v1']),
]

def read(p): return open(p, encoding='utf-8').read()
def sri(b): return 'sha384-' + base64.b64encode(hashlib.sha384(b).digest()).decode('ascii')
def gz(b): return gzip.compress(b, 9, mtime=0)
def kb(b): return '%.1f KB' % (len(b) / 1024.0)
# 12 Nov 2026 (font loading jump): every quoted IBM Plex Sans Condensed, DM Sans (an alias of the Plex files in the site head) or
# Playfair Display that a comma follows, in CSS or in CSS held in a JS string (quotes may be escaped), gets the metric-matched fallback
# names of tll-font-fallbacks-v1 right after it. Unquoted names (only prose in comments) and stacks that already carry them are left as
# they are. Mono stacks are untouched (JetBrains Mono needs no fallback face). Where DM Sans directly follows IBM Plex Sans Condensed, the
# names go after DM Sans, not between the two: until Webflow's font loader has added the Plex faces, the DM Sans alias is the stack's
# first loadable font, and asking for it at the first layout is what starts the Plex download early (names in front of it delayed the
# Plex files by about 0.15 s on slow 4G in the measurements).
FALLBACK_RX = re.compile(r"""(\\?['"])(IBM Plex Sans Condensed|DM Sans|Playfair Display)\1(?!\s*,\s*TLLS)(?!\s*,\s*\\?['"]DM Sans)(?=\s*,)""")
def fallbacks(s):
    return FALLBACK_RX.sub(lambda m: m.group(0) + (',TLLSerifG,TLLSerifN,TLLSerifT' if m.group(2) == 'Playfair Display' else ',TLLSansA,TLLSansR'), s)
def layer(p):
    # The file's own header comment stays in the source; the download carries a one-line marker instead.
    s = read(p); m = re.match(r'\s*/\*.*?\*/[ \t]*\r?\n?', s, re.S)
    if m: s = s[m.end():]
    return '/* %s */\n%s\n' % (p, fallbacks(s.rstrip('\n')))
BY = {os.path.basename(f)[:-3]: f for f, _ in SCRIPTS}
ORDER = {f: i for i, (f, _) in enumerate(SCRIPTS)}
def paths(names):
    for n in names: assert n in BY, 'unknown layer ' + n
    return sorted((BY[n] for n in names), key=ORDER.get)

covered = set(CORE)
for _, _, pub, staged in CHUNKS:
    assert not (set(pub) | set(staged)) & set(CORE), 'a core layer is also in a chunk'
    covered |= set(pub) | set(staged)
assert not [n for n in BY if n not in covered], 'layers in SCRIPTS but in no chunk: ' + str([n for n in BY if n not in covered])
assert len(set(c[0] for c in CHUNKS)) == len(CHUNKS), 'chunk names must be unique'
for name, _, pub, _ in CHUNKS: assert pub, 'chunk %s has no public layer left: drop it from CHUNKS' % name

# 16 Nov 2026: tll-first-paint-v1 carries copies of page rules (and of three rules of our own travelers chunk) so the first paint has
# them. Each block is marked /*copy:<file>*/ ... /*end*/ with one rule a line as a double-quoted string; every rule must still be in
# the file it names, as text or as it is written inside a JS string. /*words:<file>*/ marks the /travelers title verbs.
FIRST_PAINT = 'src/site-layers/tll-first-paint-v1.js'
def first_paint_checks():
    s = read(FIRST_PAINT); blocks = re.findall(r'/\*copy:([^*]+)\*/\n(.*?)/\*end\*/', s, re.S)
    assert len(blocks) == 4, 'first-paint: four copy blocks expected'
    n = 0
    for f, body in blocks:
        src = read(f)
        for line in body.split('\n'):
            line = line.strip()
            if not line.startswith('"'): continue
            rule = json.loads(line.rstrip('+;'))
            assert rule in src or json.dumps(rule)[1:-1] in src, 'first-paint: %s no longer has the rule %s' % (f, rule[:70])
            n += 1
    assert n == 12, 'first-paint: twelve copied rules expected, found %d' % n
    assert '@media(max-width:600px){.tll-about-final-title{' in read('src/pages/about/live-2026-11-13/next/embed-c024f6d7.after.html'), 'first-paint: the /about phone rules changed'
    m = re.search(r"/\*words:([^*]+)\*/\s*var WORDS=(\[[^\]]*\]);", s)
    assert m and ('var W=' + m.group(2)) in read(m.group(1)), 'first-paint: the /travelers verbs changed'
    assert "/everyone/i.test(tn.nodeValue))tn.nodeValue='People'" in read('src/site-layers/tll-travelers-fix-v1.js'), 'first-paint: the travelers chunk no longer renames the first chip'
    mapcss = read('map-2.0/dist/tll-map-layers.css')
    assert '@media (max-width:760px){' in mapcss and '.tllm-drawer{position:fixed;left:0;right:0;bottom:0;' in mapcss, 'first-paint: the map sheet rule changed'
    assert '@media (max-width:760px){#tll-map-layers .tllm-drawer:not([data-open=\\"1\\"]){display:none}}' in s
first_paint_checks()

# 16 Nov 2026, part B: tll-early-state-v1 makes, early, what page code makes when the page is parsed.
# Each line below is a piece of that code as it is saved in the repo (the site head of 13 Nov, the same as the live head on 16 Nov; the
# /stories and profile scripts from the 16 Nov GET; the profile notes embed of 10 Nov, the same as live on 16 Nov; and the core's
# home base rule). If one changes, the build stops here and the layer has to be read against the new code.
EARLY_STATE = 'src/site-layers/tll-early-state-v1.js'
def early_state_checks():
    s = read(EARLY_STATE)
    head = read('src/site/live-2026-11-13/fonts/site-head.after.html')
    for piece in ("function navOut(){var navs=$$('nav.tll-nav-v1');if(!navs.length)return;if(navs.some(function(n){return !n.closest('[data-ms-content]');}))return;var n=navs[0],w=n.closest('[data-ms-content]');w.parentNode.insertBefore(n,w);}",
                  "function run(){monogram();wordmark();navOut();",
                  "if(nav.__tllmm)return;nav.__tllmm=1;var row=nav.querySelector('.tll-nav-links-row'),cta=nav.querySelector('.tll-nav-cta-row');if(!row||!cta)return;",
                  "var b=document.createElement('button');b.type='button';b.className='tllmm-btn';",
                  "b.textContent='Menu';\ncta.appendChild(b);"):
        assert piece in head, 'early-state: the site head no longer has ' + piece[:80]
    lead = read('src/pages/stories/live-2026-11-16/tll-lib-lead-v1.live.html')
    for piece in ("var inner=document.querySelector('.tll-library-filters .tll-filters-inner'), form=document.querySelector('.tllsb-form'), bar=document.querySelector('.tllsb-bar'); if(!inner||!form||!bar||inner.querySelector('.tllsb-form')) return;",
                  "var slot=document.createElement('div'); slot.className='tll-lib-searchslot'; slot.appendChild(form); var clr=document.getElementById('tll-lib-clear'); if(clr) slot.appendChild(clr); inner.appendChild(slot); inner.setAttribute('data-tll-merged','1'); bar.style.display='none'; }",
                  "k.querySelector('[data-tll-pick]:not(.w-condition-invisible)')",
                  "if(pick&&g.firstElementChild!==pick){ g.insertBefore(pick,g.firstElementChild);",
                  "if(k===lead) k.setAttribute('data-tll-lead','1'); else k.removeAttribute('data-tll-lead');",
                  "function early(){ merge(); return !!document.querySelector('.tll-library-filters .tll-filters-inner[data-tll-merged]'); }"):
        assert piece in lead, 'early-state: tll-lib-lead-v1 no longer has ' + piece[:80]
    chips = read('src/pages/stories/live-2026-11-16/tll-lib-chips-v1.live.html')
    for piece in ("date:Date.parse(d(el,'data-tll-date'))||0", "(b.date-a.date)||(a.i-b.i)", "shown.forEach(function(r){grid.appendChild(r.el);});",
                  "var items=[].slice.call(grid.children).filter(function(el){return el.hasAttribute('data-tll-card')||el.querySelector('[data-tll-card]');});"):
        assert piece in chips, 'early-state: tll-lib-chips-v1 no longer has ' + piece
    m = re.search(r"/\*links:([^*]+)\*/\s*(var LINKS=\[\[.*?\]\];)", s)
    pf = read(m.group(1)) if m else ''
    assert m and m.group(2) in pf, 'early-state: the profile link list changed'
    for piece in ("ey.textContent='TRAVELER · '+UP(slug);", "if(y&&y!=='NaN') bits.push('ON TLL SINCE '+y);", "g.appendChild(el('span',null,'FROM · HAS LIVED IN'));",
                  "on('ranges')?'':'/ 250', 'PLACES'", "var c=el('a','pf5-btn','Get in touch'); c.href=href;", "note='Email shown by their choice.';",
                  "note='Opens their chosen channel or the relay form. Nobody’s email is shown until they reply.';", "B.setAttribute('data-pf5-ready','1');",
                  "if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',run); else run();"):
        assert piece in pf, 'early-state: tll-pf5-profile-js-v1 no longer has ' + piece[:60]
    notes = read('src/pages/contributors-template/live-2026-11-10/after/tll-pf5-n-v1.html')
    for piece in ("if(lab) lab.textContent='FROM'+(place?' '+place:'')+(n>1?' · HAS LIVED IN':'');", "if(makes.length&&on('creators')) bit(meta,'MAKES '+makes.join(' · '));",
                  "var w0=el('a','pf5-work','SEE THE WORK →'); w0.href=work; w0.target='_blank'; w0.rel='noopener ugc';", "if(P&&P.open===true) bit(meta,'OPEN TO PARTNERSHIPS');",
                  "a.rel='sponsored noopener'; a.appendChild(el('span','pf5-tag','PARTNER'));", "function later(){ setTimeout(run,0); }"):
        assert piece in notes, 'early-state: tll-pf5-n-v1 no longer has ' + piece[:60]
    assert "if(show||!home)return;var meta=document.querySelector('[data-pf5=\"meta\"]');" in read('src/site-layers/tll-phase0-v1.js'), 'early-state: the home base rule in tll-phase0-v1 changed'
early_state_checks()

# Chunks first: the core embeds their hashes.
files, hashes = {}, {}
def chunk(name, rx, names):
    body = ''.join(layer(p) for p in paths(names))
    head = ('/* tll-site-layers-v16 chunk %s: loaded by the core loader on paths matching %s, after the core and in this order. Built by '
            'src/site-layers/build-site-layers-v16.py; each layer keeps its own path guard. No data-ms-* element is touched. */\n') % (name, rx)
    b = (head + body).encode('utf-8'); files[name] = b; hashes[name] = sri(b)
for name, rx, pub, staged in CHUNKS:
    chunk(name, rx, pub)
    if staged: chunk(name + '-preview', rx, pub + staged)
rules = []
for name, rx, pub, staged in CHUNKS:
    r = "['%s',%s,'%s'" % (name, rx, hashes[name])
    if staged: r += ",'%s-preview','%s'" % (name, hashes[name + '-preview'])
    rules.append(r + ']')
LOADER = ("/* Chunk loader: the per-path layers live in chunks/ beside this file at the same pinned commit, read off this script's own src, so no\n"
          "   placeholder is needed. async=false keeps the order without blocking the parser; the hashes come from the same build as the chunks.\n"
          "   A preview flag or a tll-preview-* key switches a chunk to its -preview variant, which also carries the staged layers. */\n"
          "(function(){\n"
          "var S=document.currentScript,src=S&&S.src||'';\n"
          "if(!src){var all=document.querySelectorAll('script[src*=\"tll-site-layers-v16\"]');if(all.length)src=all[all.length-1].src;}\n"
          "var m=/^(.*\\/)tll-site-layers-v16\\.js(?:[?#].*)?$/.exec(src);if(!m){try{console.warn('tll-site-layers: not served from its pinned URL, chunks skipped');}catch(e){}return;}\n"
          "var P=location.pathname.replace(/\\/+$/,'')||'/',pv=/[?&](preview|qr)=/.test(location.search);\n"
          "try{for(var i=0;i<localStorage.length;i++){if(String(localStorage.key(i)).indexOf('tll-preview-')===0)pv=true;}}catch(e){}\n"
          "var C=[%s],h=document.head||document.documentElement;\n"
          "for(var j=0;j<C.length;j++){var c=C[j];if(!c[1].test(P))continue;var n=c[0],g=c[2];if(pv&&c[3]){n=c[3];g=c[4];}\n"
          "  var s=document.createElement('script');s.src=m[1]+'chunks/'+n+'.js';s.setAttribute('integrity',g);s.setAttribute('crossorigin','anonymous');s.async=false;h.appendChild(s);}\n"
          "})();\n") % ',\n'.join(rules)

def css(f, i): return [i, fallbacks(re.search(r'<style id="%s">\n(.*)</style>' % i, read(f), re.S).group(1))]
mag = read(MAG)
mag_css = fallbacks(re.search(r'<style id="tll-mag-story-v1">\n(.*?)</style>', mag, re.S).group(1))
mag_js = fallbacks(re.search(r'<script id="tll-mag-story-js-v1">\n(.*?)</script>', mag, re.S).group(1))
assert 'fonts.googleapis' not in mag and "'Newsreader'" not in mag_css and "'Inter Tight'" not in mag_css, 'the story layer carries no font request of its own (10 Nov 2026)'
head = "/* tll-site-layers-v16: the core of the site layers, one registered site-wide header script. Built by src/site-layers/build-site-layers-v16.py.\n"
head += "   In order: consent fallback, chunk loader, %d styles, then\n" % len(STYLES)
head += ''.join('   core   %s (%s)\n' % (f, d) for f, d in SCRIPTS if os.path.basename(f)[:-3] in CORE)
head += '   story  %s (the magazine story page: Playfair Display 800 and Plex, the byline in the head, the stamp on the photo; /stories/{slug} only)\n' % MAG
head += '   cover  %s (the magazine cover: the cover story photo full bleed, the chip, the stamp; home page only)\n' % COVER
head += '   first  %s (Consent Mode v2 defaults when the head consent tool is missing)\n' % CONSENT
head += '   Styles: ' + ', '.join('%s (%s)' % (i, d) for _, i, d in STYLES) + '\n'
head += '   The other layers come in per-path chunks from chunks/ at this same commit, loaded by the chunk loader below:\n'
for name, rx, pub, staged in CHUNKS:
    head += '   chunk  %s %s: %s%s\n' % (name, rx, ', '.join(os.path.basename(p)[:-3] for p in paths(pub)),
                                         (' (+ staged in %s-preview: %s)' % (name, ', '.join(staged)) if staged else ''))
head += '   No data-ms-* element is touched. */\n'
consent = layer(CONSENT)
styles = "(function(){var L=%s;var h=document.head||document.documentElement;for(var i=0;i<L.length;i++){if(document.getElementById(L[i][0]))continue;var s=document.createElement('style');s.id=L[i][0];s.textContent=L[i][1];h.appendChild(s);}})();\n" % json.dumps([css(f, i) for f, i, _ in STYLES])
# F1 on the story page (14 Nov 2026, the first-frame jump at 390; reports/evidence/story-first-frame-2026-11-14/diagnosis.md, idea A).
# The template rules the first paint needs, copied as they are from the Stories Template's own style (tll-st3-story-v1, which comes only
# at the end of the body, after jQuery and webflow.js): the byline row with the writer's avatar (unsized, that photo was painted at its
# natural 342x513 px and the template style then shrank it to 40 px) and the meta row. Keyed on the template's page id on html; :where()
# keeps each rule exactly as heavy as the template's own, and the values are the template's, so the finished page is unchanged.
# A2 (14 Nov 2026, reports/evidence/story-first-frame-2026-11-14/judge.md, breakage 1): the copies live in a style of their own,
# style#tll-story-st3-early-v1, which stays in the head (so it always comes before the template's style and loses every tie to it) and
# is taken out as soon as the template's style has been parsed whole, or when the page is parsed. A Designer edit to those template
# rules (a changed value, a removed rule) therefore always wins on the finished page; at worst the first frames show the old value.
ST3_PAGE = ':where(html[data-wf-page="6a0b29eedc14f1444e935766"])'
ST3_EARLY = [
    '{--st3-line:#E0DACE;--st3-rose:#F0507A;--st3-teal-deep:#067A79;--st3-muted:#6B6660;--st3-f-mono:\'JetBrains Mono\',ui-monospace,monospace}',
    ' .tll-story-hero .tll-story-meta-row{display:flex !important;align-items:center !important;flex-wrap:wrap;gap:0 11px}',
    ' .tll-story-hero .tll-story-meta-row>:nth-child(5),@P@ .tll-story-hero .tll-story-meta-row>:nth-child(6){display:none !important}',
    ' .tll-story-hero .tll-story-meta-row>:not(:first-child) img{display:none !important}',
    ' .tll-story-hero .tll-story-meta-row>:first-child img{width:26px !important;height:26px !important;border-radius:50% !important;border:1.5px solid rgba(247,241,232,.6) !important;box-shadow:none !important;vertical-align:-8px !important;margin-right:11px !important;box-sizing:border-box}',
    ' .st3-author{display:flex;align-items:center;margin:0 0 26px;padding:0 0 20px;border-bottom:1px solid var(--st3-line)}',
    ' .st3-author-link{display:inline-flex;align-items:center;gap:12px;min-height:44px;color:inherit !important;text-decoration:none !important;border-radius:4px;transition:transform 150ms ease-out}',
    ' .st3-author-avatar{flex:none;width:40px;height:40px;border-radius:50%;border:2px solid var(--st3-rose);overflow:hidden;background:#1d5e5d;box-sizing:border-box}',
    ' .st3-author-img{display:block;width:100%;height:100%;object-fit:cover}',
    ' .st3-author-name{font:700 14px/1.3 var(--st3-f-body);color:var(--st3-teal-deep)}',
    ' .st3-author-name::after{content:"\\00A0\\2192";content:"\\00A0\\2192" / ""}',
    ' .st3-author-filed{margin-top:2px;font:500 10px/1.4 var(--st3-f-mono);letter-spacing:1px;text-transform:uppercase;color:var(--st3-muted)}',
    ' .st3-author-filed:has([data-st3-loc].w-dyn-bind-empty)>span:first-child{display:none}',
    ' .st3-author-filed [data-st3-loc]:not(.w-dyn-bind-empty)+[data-st3-when]:not(.w-dyn-bind-empty)::before{content:"\\00A0\\00B7\\00A0"}',
    ' .st3-author-filed .w-dyn-bind-empty{display:none}']
# A2: one site footer rule too. The story's "How this trip was paid for" link sits at the top of the story body and is hidden by the site
# footer style (tll-foot-v1, parsed after the byline row) until the footer script marks a commissioned story; with no hero photo the body
# is in view, so the early first paint showed the link and the footer style then pulled the story up 20 px (0.07 on the no-photo story).
FOOT_SRC = 'src/components/footer/tll-foot-v1.html'
FOOT_EARLY = ' a[data-tll-commissioned="story"]{display:none}'
assert 'a[data-tll-commissioned="story"]{display:none;' in read(FOOT_SRC), 'the footer still hides the commissioned link'
# A3: two more template rules. The template's tll-st3-r1-v1 style (parsed in the body, after the first paint) hides the first place pill
# of the meta row (the place shows once, in the breadcrumb) and the arrow left in front of the hidden title crumb. Either made the head
# lose a line once that style arrived, pulling the headline, byline and photo up 17 to 33 px (0.01 to 0.02 on the Croatia and Southern
# Africa stories at 360 and 390). The same rules, keyed the same way, in the early style.
R1_SRC = 'src/pages/story/after-2026-10-20/embed-3074c26c-after.html'
R1_RULES = ['[data-tll-breadcrumb] span:has(+ [data-tll-crumb="title"]){display:none !important}',
            '.tll-story-meta-row > .tll-story-byline-loc:first-child,.tll-story-meta-row > .tll-story-byline-loc:first-child + .tll-story-meta-divider{display:none !important}']
for r in R1_RULES: assert r in read(R1_SRC), 'the template rule changed: ' + r[:60]
R1_EARLY = [' ' + r.replace(',', ',@P@ ') for r in R1_RULES]
# A4: the route strip under the hero. Until the template's style arrives (at the end of the body) the strip is laid out by Webflow's own
# classes, 11 px taller at phone widths (26 px stop line, no ROUTE label); when the style arrives the strip shrinks and the story body under
# it moves up (0.037 on the Phuket story at 412 whenever a frame was painted in between, on A2 too). The template's route rules, keyed
# the same way, with the tokens they read, in the early style. The live template style is the 13 Nov snapshot below (the same bytes as
# the style in the story pages saved for the A3 checks).
ST3_SRC = 'src/pages/stories-template/live-2026-11-13/fonts/page-footer.after.html'
ROUTE_RULES = ['[data-tll-route]{background:var(--st3-ink-2) !important;border-bottom:1px solid #1a1d35;display:flex !important;align-items:center;flex-wrap:wrap;gap:6px 10px;padding:11px max(var(--st3-pad),calc((100% - var(--st3-col)) / 2)) !important;color:var(--st3-cream)}',
               '[data-tll-route]::before{content:"Route";font:500 10.5px/1.4 var(--st3-f-mono);letter-spacing:2px;text-transform:uppercase;color:var(--st3-slate)}',
               '[data-tll-route] [data-tll-route-stops]{font:600 11px/1.4 var(--st3-f-mono);letter-spacing:1px;text-transform:uppercase;color:var(--st3-cream)}',
               '[data-tll-route] .tll-route-arrow{color:var(--st3-teal) !important;margin:0 10px !important}',
               '[data-tll-route] [data-tll-route-note]{margin-left:auto;font:500 10.5px/1.4 var(--st3-f-mono);letter-spacing:1px;text-transform:uppercase;color:var(--st3-teal)}',
               '[data-tll-route] [data-tll-route-note].w-dyn-bind-empty{display:none}']
ROUTE_PHONE = ['[data-tll-route]{padding:11px 16px !important}', '[data-tll-route] [data-tll-route-note]{margin-left:0;flex-basis:100%}']
ROUTE_TOKENS = ['--st3-ink-2:#12141F', '--st3-cream:#F7F1E8', '--st3-teal:#00C9C8', '--st3-slate:#9496AC', '--st3-col:680px', '--st3-pad:28px']
ST3_LIVE = read(ST3_SRC)
for r in ROUTE_RULES + ROUTE_TOKENS: assert r in ST3_LIVE, 'the template route rule changed: ' + r[:60]
assert '@media(max-width:767px){' + ''.join(ROUTE_PHONE) + '}' in ST3_LIVE, 'the template route rules for phones changed'
ROUTE_EARLY = ['{' + ';'.join(ROUTE_TOKENS) + '}'] + [' ' + r for r in ROUTE_RULES]
st3_early = ('/* F1 (14 Nov 2026): the Stories Template rules the first paint needs (meta row, byline row and avatar), as in tll-st3-story-v1,\n'
             '   and the footer rule that hides the commissioned link, as in tll-foot-v1. Only until both styles have been parsed: then this\n'
             '   style is taken out, so the template and the footer always have the last word. A3: and the two template rules that hide the\n'
             '   arrow before the hidden title crumb and the first place pill of the meta row, as in tll-st3-r1-v1. A4: and the template\'s route\n'
             '   strip rules, as in tll-st3-story-v1. */\n'
             + ''.join(ST3_PAGE + r.replace('@P@', ST3_PAGE) + '\n' for r in ST3_EARLY + [FOOT_EARLY] + R1_EARLY + ROUTE_EARLY)
             + '@media(max-width:767px){' + ''.join(ST3_PAGE + ' ' + r for r in ROUTE_PHONE) + '}\n')
OLD_STORY_RUN = "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();\n"
assert mag_js.count(OLD_STORY_RUN) == 1
NEW_STORY_RUN = ("/* F1: run() as soon as the byline row has arrived (an element follows it), before the first paint, so the photo box (heroR), the figure\n"
                 "   and the byline in the head are there from the first frame. The Receipts line waits for the Receipts block to arrive whole (rcpt()\n"
                 "   reads its rows), and run() waits while that block is still arriving. The page-parsed event stays as the fallback.\n"
                 "   A2 (14 Nov 2026, the judge's breakage 2, the photo nudged down on stories with a Receipts line): two holds on the hero, both set\n"
                 "   when run() puts the byline into the head early. data-tll-mg-wait-r keeps the photo (and a stamp with no photo) invisible until\n"
                 "   the Receipts block has arrived and the Receipts line is in, so the line never pushes a painted photo down. data-tll-mg-wait-d keeps\n"
                 "   the place-and-date line to its first line, invisible, until the template's own script (tll-st3-story-js-v1, which shortens that\n"
                 "   line to {place} and {Month Year} when the page is parsed) has run: its page-parsed listener is added once that script has been\n"
                 "   parsed, so it runs after the template's. The styles for both holds are at the end of the story style; neither changes the\n"
                 "   finished page.\n"
                 "   A3 (same day, the 16.65.0 checks): the place-and-date line is no longer clamped. PF.pre() writes the template's own words into it\n"
                 "   at once, and data-tll-mg-wait-d now gives the country crumb the box of the link the template makes of it (see PF above).\n"
                 "   A4 (same day, the A3 checks): data-tll-mg-wait-r goes on as soon as the hero has been parsed, and it now also keeps everything\n"
                 "   after the hero in the story (the route strip, the story body) invisible, so a frame painted before the Receipts block has been\n"
                 "   parsed shows no content that the Receipts line, or the byline moving into the head, could push down; the head (crumbs,\n"
                 "   headline) is painted as before. It is let go when the Receipts block is in, when that block has arrived with no byline row\n"
                 "   before it, or when the page is parsed. The flag stand-in goes in as soon as the country crumb has been parsed. */\n"
                 "(function(){if(document.readyState!=='loading'){run();return;}var mo=null,ran=0,rd=0,hd=0,sh=0,cr=0;\n"
                 "/* A2: an element counts as arrived whole once an element follows it or one of its ancestors, below the body's own children (scripts\n"
                 "   add nodes to the end of the body while it is parsed, such as a consent iframe, which once made a half-parsed Receipts block count\n"
                 "   as whole on slow 4G), and never because of the story style, which is moved after each style as it arrives. */\n"
                 "function whole(n){for(;n&&n.parentNode&&n.parentNode!==document.body;n=n.parentNode){var x=n.nextElementSibling;if(x===MS)x=x.nextElementSibling;if(x)return true;}return false;}\n"
                 "function hold(k,on){var h=document.querySelector('.tll-story-hero');if(!h)return;if(on)h.setAttribute('data-tll-mg-wait-'+k,'');else h.removeAttribute('data-tll-mg-wait-'+k);}\n"
                 "function late(){var c=document.querySelector('.tll-story-hero .tll-story-hero-content'),a=c&&c.querySelector('.st3-author');if(a)rcpt(c,a);rd=1;hold('r',0);}\n"
                 "function after(){hold('d',0);PF.done();}\n"
                 "/* A4: an error thrown by the template script while it is parsed means it never adds its page-parsed handler: let go at once.\n"
                 "   Repair round (15 Nov): only if the script had not yet added that handler (a throw after it, at the end of the script, still\n"
                 "   leaves the handler to write the words at DOMContentLoaded, so the hold stays until then). While the page is parsed,\n"
                 "   document.addEventListener notes a DOMContentLoaded listener added by that script; it is put back once the script is in. */\n"
                 "var tdl=0,oal=Object.prototype.hasOwnProperty.call(document,'addEventListener')?document.addEventListener:null,dal=document.addEventListener;\n"
                 "function wal(ty){var s=document.currentScript;if(ty==='DOMContentLoaded'&&s&&s.id==='tll-st3-story-js-v1')tdl=1;return dal.apply(this,arguments);}\n"
                 "function unwal(){if(document.addEventListener!==wal)return;if(oal)document.addEventListener=oal;else delete document.addEventListener;}\n"
                 "try{document.addEventListener=wal;}catch(e){}\n"
                 "function terr(){var s=document.currentScript;if(s&&s.id==='tll-st3-story-js-v1'&&!tdl)after();}\n"
                 "function stop(){if(mo){mo.disconnect();mo=null;}window.removeEventListener('error',terr);unwal();}\n"
                 "window.addEventListener('error',terr);\n"
                 "if(window.MutationObserver){mo=new MutationObserver(function(){var led=document.querySelector('[data-tll-ledger=\"story\"]');\n"
                 "  if(!sh&&document.querySelector('.tll-story-hero')){sh=1;hold('r',1);}\n"
                 "  if(!cr){var C=document.querySelector('[data-tll-crumb=\"country\"]');if(C&&whole(C)){cr=1;PF.crumb(C);}}\n"
                 "  if(!ran){var au=document.querySelector('.st3-author');if(!au&&!rd&&led&&whole(led)){rd=1;hold('r',0);}\n"
                 "    if(!whole(au)||(led&&!whole(led)))return;run();ran=1;\n"
                 "    var c=document.querySelector('.tll-story-hero .tll-story-hero-content');if(c&&c.querySelector('.st3-author'))PF.pre();else if(!rd){rd=1;hold('r',0);}}\n"
                 "  if(!rd&&led&&whole(led))late();\n"
                 "  var hs=document.getElementById('tll-st3-story-js-v1');if(!hd&&hs&&whole(hs)){hd=1;unwal();document.addEventListener('DOMContentLoaded',after);}\n"
                 "  if(rd&&hd)stop();});\n"
                 "  mo.observe(document.documentElement,{childList:true,subtree:true});}\n"
                 "document.addEventListener('DOMContentLoaded',function(){stop();run();late();if(!hd)after();PF.end();});})();\n")
# the two holds (A2): matched only while the hero carries the attribute, so the finished page is unchanged
HOLD_CSS = ('/* F1 holds (A2, 14 Nov 2026), set and cleared by the early run: nothing matches once the page is parsed. A3: wait-d gives the\n'
            '   country crumb the box of the link the template script makes of it (as the magazine rule for the crumb links); the flag stand-in\n'
            '   shows its count as generated text. A4: wait-r also keeps the photo before it moves into its figure and the story after the hero\n'
            '   (the route strip, the body; never the nav, which comes before the hero, or the footer, which is outside the story) invisible */\n'
            '.tll-story-hero[data-tll-mg-wait-r] .tll-mg-fig,.tll-story-hero[data-tll-mg-wait-r] .tll-story-hero-content>.tll-mg-stamp{visibility:hidden}\n'
            '.tll-story-hero[data-tll-mg-wait-r] .tll-story-hero-img,.tll-story-hero[data-tll-mg-wait-r]~*{visibility:hidden}\n'
            '.tll-story-hero[data-tll-mg-wait-d] [data-tll-breadcrumb] div[data-tll-crumb="country"]{display:inline-flex;align-items:center;min-height:44px}\n'
            '.tll-story-hero [data-tll-mg-flags]>[data-t]::after{content:attr(data-t)}\n')
# A3 (14 Nov 2026, reports/evidence/release-16.65.0-check/): what the page-parsed scripts do to the story head, laid out before the first paint.
# The template script (tll-st3-story-js-v1, src/pages/story/after-2026-10-20/embed-3074c26c-after.html) rewrites the place-and-date line
# ({place} from the story's byline location, {Month Year}) and turns the country crumb into a link (inline-flex, 44 px tall in the
# magazine style); the site flag script (tllflagsv53, a Webflow page script, src/site-layers/tllflagsv53.js) puts up to four 22 px flags
# and "+N countries" in front of the crumb. At 320 to 412 px either can push the crumb onto a second row, and the painted headline, byline,
# Receipts line and photo moved down 26 to 38 px (0.15 on the Balkans story at 360). PF.pre() runs right after the early run:
#   - it writes the template's own words into the place-and-date line (the template writes the same words again, so nothing moves),
#     and puts the old words back after the template's page-parsed handler if that handler never did its part (the script threw);
#   - when the template will make the crumb a link, data-tll-mg-wait-d on the hero gives the crumb the link's box until that handler has run;
#   - when the flag script will draw flags, an empty stand-in of the same size (no text of its own, so neither script reads it) sits in
#     front of the crumb text until the real flags are in, in the same step; if no flag script is on the page, or none drew by the
#     first task after DOMContentLoaded, it is taken out.
# The country list and the reading of a place are the flag script's own (FLAGS_A below is read from src/site-layers/tllflagsv53.js).
FLAGS = read('src/site-layers/tllflagsv53.js')
for frag in ["function f(t){var p=t.split(/,| and | & |\\//i),o=[],l=1;p.forEach(function(x){if(!z(x))return;var c=q(x);c?c.split(' ').forEach(function(k){o.indexOf(k)<0&&o.push(k)}):l=0});return l&&o.length?o:(q(p[p.length-1])||'').split(' ').filter(String)}",
             "function z(s){return(''+s).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\\s+/g,' ').trim()}",
             "if(!N){N=A;try{var d=new Intl.DisplayNames('en',{type:'region'});for(var a=65;a<91;a++)for(var b=65;b<91;b++){var c=String.fromCharCode(a,b),n=d.of(c);if(n!=c&&!/^(AN|BU|CS|DD|NH|RH|VD|YD)$/.test(c)&&!N[z(n)])N[z(n)]=c.toLowerCase()}}catch(e){}}return N[s]||''",
             "D.querySelectorAll('.tll-lib-meta,.tll-story-byline-loc,[data-tll-crumb=country]')",
             "var c=e.__f?[]:f(e.textContent);if(!c.length)return;",
             "w.style.cssText='display:inline-flex;vertical-align:-6px;margin-right:6px';c.slice(0,4).forEach(function(k,j){",
             "i.style.cssText='width:22px;height:22px;border-radius:50%;margin-left:'+(j?-7:0)+'px';w.appendChild(i)});if(c[4]){var n=c.length-4;w.append('\\xa0+'+n+' countr'+(n>1?'ies':'y'))}e.insertBefore(w,e.firstChild)",
             "D.readyState[0]=='l'?D.addEventListener('DOMContentLoaded',R):R()"]:
    assert frag in FLAGS, 'the flag script changed; check PF against it: ' + frag[:60]
FLAGS_A = re.search(r"A=(\{[^{}]*\})", FLAGS).group(1)
# A4 (14 Nov 2026, the A3 checks in reports/evidence/story-a3-judge/): the flag script's table of country names as a static copy. A3 built
# it with Intl.DisplayNames before the first paint whenever a place was not on the flag script's own list (about 9 ms, 40 ms at a quarter
# of the CPU speed), and that extra work let the browser paint a frame before the Receipts block had been parsed (the route strip and the
# story body then moved when the Receipts line went in) and made the first paint later on slow phones. The names come from
# src/site-layers/region-names-v1.json (written by build-region-names-v1.cjs in Chromium); the table is built from them here by the flag
# script's own rules: its list first, then each code in order unless retired or its name is already taken, names read through its z().
import unicodedata
def flag_z(t):
    t = re.sub('[\u0300-\u036f]', '', unicodedata.normalize('NFD', t)).lower()
    return re.sub(r'\s+', ' ', re.sub('[^a-z ]+', ' ', t)).strip()
FLAGS_KEYS = [a or b for a, b in re.findall(r"(?:'([^']+)'|([a-z]+)):'[a-z ]+'", FLAGS_A)]
assert len(FLAGS_KEYS) == FLAGS_A.count(':') and 'balkans' in FLAGS_KEYS, 'the flag script list reads as expected'
REGION = json.loads(read('src/site-layers/region-names-v1.json'))['names']
assert len(REGION) > 240 and ['VN', 'Vietnam'] in REGION, 'region names file'
REGION_N = {}
for c, n in REGION:
    k = flag_z(n)
    if c != n and not re.match(r'^(AN|BU|CS|DD|NH|RH|VD|YD)$', c) and k not in FLAGS_KEYS and k not in REGION_N: REGION_N[k] = c.lower()
assert all('|' not in k for k in REGION_N)
FLAGS_T = '|'.join(c + k for k, c in REGION_N.items())
TPL_JS = read('src/pages/story/after-2026-10-20/embed-3074c26c-after.html')
for frag in ["function tc(s){return /[a-z]/.test(s)?s:s.toLowerCase().replace(/(^|[\\s,(\\/-])(\\S)/g,function(m,a,b){return a+b.toUpperCase();});}",
             "function place(){var L=q('[data-st3-loc]');if(!L||L.dataset.st3Place)return;L.dataset.st3Place='1';",
             "var where=by?tc(by):cn;if(where){L.textContent=where;L.classList.remove('w-dyn-bind-empty');}",
             "var C=q('[data-tll-crumb=\"country\"]');if(C&&okSlug(cs)&&C.tagName!=='A'){var a=document.createElement('a');",
             "function author(){var A=q('[data-st3-author]');if(!A||A.dataset.st3Done)return;A.dataset.st3Done='1';",
             "var mo=t.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i),y=t.match(/\\b(19|20)\\d{2}\\b/);",
             "if(mo&&y){w.textContent=mo[1].charAt(0).toUpperCase()+mo[1].slice(1).toLowerCase()+' '+y[0];return;}",
             "function run(){links();author();place();"]:
    assert frag in TPL_JS, 'the template script changed; check PF against it: ' + frag[:60]
CRUMB_A = '.tll-story-hero [data-tll-breadcrumb] a{display:inline-flex;align-items:center;min-height:44px;'
assert CRUMB_A in mag_css, 'the magazine style still sizes the crumb links'
PF_SRC = ("/* A3 (14 Nov 2026): the template script's place-and-date words, the box of its country link and the site flag script's flags, laid out\n"
          "   before the first paint (see the build script). Each piece mirrors the page script it stands in for and is let go after it.\n"
          "   A4 (same day): the country names come from a static table (no Intl work before the first paint), the stand-in is made of the\n"
          "   flag script's own elements (so it shrinks as the real flags do) and goes in as soon as the country crumb is parsed. */\n"
          "var PF=(function(){var P=null,W=null,AU=null,PH=null,FO=null;\n"
          "function tc(s){return /[a-z]/.test(s)?s:s.toLowerCase().replace(/(^|[\\s,(\\/-])(\\S)/g,function(m,a,b){return a+b.toUpperCase();});}\n"
          "var FA=%s,FS=%s,FT=null,OWN=Object.prototype.hasOwnProperty;\n"
          "function fz(s){return(''+s).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\\s+/g,' ').trim();}\n"
          "/* the flag script's table of country names: its own list, then the static copy of the names it reads from Intl.DisplayNames (FS,\n"
          "   code and name, built from region-names-v1.json by the flag script's rules); a browser with no Intl.DisplayNames gets the list only,\n"
          "   as the flag script does there */\n"
          "function fq(s){s=fz(s);if(OWN.call(FA,s))return FA[s];if(typeof Intl!='object'||!Intl.DisplayNames)return '';\n"
          "  if(!FT){FT={};for(var l=FS.split('|'),i=0;i<l.length;i++)FT[l[i].slice(2)]=l[i].slice(0,2);}return OWN.call(FT,s)?FT[s]:'';}\n"
          "function ff(t){var p=t.split(/,| and | & |\\//i),o=[],l=1;p.forEach(function(x){if(!fz(x))return;var c=fq(x);c?c.split(' ').forEach(function(k){o.indexOf(k)<0&&o.push(k);}):l=0;});return l&&o.length?o:(fq(p[p.length-1])||'').split(' ').filter(String);}\n"
          "function unflag(){if(FO){FO.disconnect();FO=null;}if(PH&&PH.parentNode)PH.parentNode.removeChild(PH);PH=null;}\n"
          "/* the stand-in: the flag script's box (a span), the flag script's own img elements and inline style with no source (so the site's\n"
          "   img rules size them exactly as they size the real flags; loading set, so the page's lazy-image pass skips them), the count as\n"
          "   generated text. It goes in the same step as the real flags arrive in front of it, or with the crumb when the template swaps it */\n"
          "function flag(C,n){var w=document.createElement('span');w.setAttribute('data-tll-mg-flags','');w.setAttribute('aria-hidden','true');w.style.cssText='display:inline-flex;vertical-align:-6px;margin-right:6px';\n"
          "  for(var j=0;j<n&&j<4;j++){var i=document.createElement('img');i.alt='';i.setAttribute('loading','lazy');i.style.cssText='width:22px;height:22px;border-radius:50%%;margin-left:'+(j?-7:0)+'px';w.appendChild(i);}\n"
          "  if(n>4){var x=document.createElement('span');x.style.cssText='display:block;margin:0;padding:0;border:0';x.setAttribute('data-t','\\u00a0+'+(n-4)+' countr'+(n-4>1?'ies':'y'));w.appendChild(x);}\n"
          "  C.insertBefore(w,C.firstChild);PH=w;\n"
          "  if(window.MutationObserver&&C.parentNode){FO=new MutationObserver(function(){if(!PH||!PH.parentNode){unflag();return;}\n"
          "    for(var k=PH.parentNode.firstChild;k;k=k.nextSibling)if(k!==PH&&k.nodeType===1&&k.querySelector&&k.querySelector('img')){unflag();return;}});\n"
          "    FO.observe(C.parentNode,{childList:true,subtree:true});}}\n"
          "/* as soon as the country crumb has been parsed (A4): the stand-in from the crumb's own text */\n"
          "function crumb(C){try{if(PH||!C.closest||!C.closest('.tll-story-hero'))return;var ct=C.textContent.trim(),k=ct?ff(ct):[];if(k.length)flag(C,k.length);}catch(e){}}\n"
          "function pre(){var h=document.querySelector('.tll-story-hero');if(!h)return;\n"
          "  var L=document.querySelector('[data-st3-loc]'),C=document.querySelector('[data-tll-crumb=\"country\"]'),link=false,cn='';AU=document.querySelector('[data-st3-author]');\n"
          "  try{if(L&&!L.dataset.st3Place){var by=(L.getAttribute('data-st3-byline')||'').trim(),wh;cn=(L.getAttribute('data-st3-country-name')||'').trim();wh=by?tc(by):cn;\n"
          "      link=!!(C&&C.tagName!=='A'&&/^[a-z0-9-]+$/.test((L.getAttribute('data-st3-country')||'').trim()));\n"
          "      if(wh&&L.textContent!==wh){P=[L,L.textContent,L.getAttribute('class')];L.textContent=wh;L.classList.remove('w-dyn-bind-empty');}}\n"
          "    var w=AU&&!AU.dataset.st3Done&&AU.querySelector('[data-st3-when]'),t=w&&!w.classList.contains('w-dyn-bind-empty')?w.textContent.trim():'';\n"
          "    if(t){var mo=t.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i),y=t.match(/\\b(19|20)\\d{2}\\b/);\n"
          "      if(mo&&y){var nt=mo[1].charAt(0).toUpperCase()+mo[1].slice(1).toLowerCase()+' '+y[0];if(nt!==w.textContent){W=[w,w.textContent];w.textContent=nt;}}}\n"
          "    if(C&&h.contains(C)){if(link)h.setAttribute('data-tll-mg-wait-d','');if(!PH){var ct=C.textContent.trim()||(link?cn:''),k=ct?ff(ct):[];if(k.length)flag(C,k.length);}}\n"
          "  }catch(e){}}\n"
          "/* after the template's page-parsed handler: its words stay; if it never wrote them (it threw), the old words come back. A4: also\n"
          "   at once when the template script itself throws while it is parsed (it then adds no handler), while the photo and the story\n"
          "   below the head are still held */\n"
          "function done(){if(P&&!P[0].dataset.st3Place){P[0].textContent=P[1];if(P[2]===null)P[0].removeAttribute('class');else P[0].setAttribute('class',P[2]);}if(W&&!(AU&&AU.dataset.st3Done))W[0].textContent=W[1];P=W=null;}\n"
          "/* when the page is parsed: with no flag script on the page now, else at the latest in the next task. Repair round (15 Nov): if a real\n"
          "   flag is in front of the stand-in it goes; if none came (the flag script failed or found no country), the stand-in stays as an\n"
          "   empty box, hidden, so the crumb does not lose a line under a painted head (if flags still come later, it goes then). A stand-in\n"
          "   that went out of the page with the old crumb (the template made the crumb a link) is let go as before */\n"
          "function keep(){if(!PH)return;var C=PH.parentNode;if(!C||[].indexOf.call(document.querySelectorAll('[data-tll-mg-flags]'),PH)<0){unflag();return;}\n"
          "  for(var k=C.firstChild;k;k=k.nextSibling)if(k!==PH&&k.nodeType===1&&k.querySelector&&k.querySelector('img')){unflag();return;}\n"
          "  PH.style.visibility='hidden';}\n"
          "function end(){if(!PH)return;if(!document.querySelector('script[src*=\"tllflags\"]'))keep();else setTimeout(keep,0);}\n"
          "return {crumb:crumb,pre:pre,done:done,end:end};})();\n") % (FLAGS_A, json.dumps(FLAGS_T))
NEW_STORY_RUN = PF_SRC + NEW_STORY_RUN
mag_js_early = mag_js.replace(OLD_STORY_RUN, NEW_STORY_RUN, 1)
# A4 (14 Nov 2026): the story layer's comments stay here and in its sources and are left out of the download, as every other layer's
# header comment is. A2 and A3 had brought about 9 KB of comments into the core; on the lab's slow 4G model (one 1.6 Mbit/s pipe, the
# core not compressed) every 5 KB costs about 25 ms of first paint. A comment is cut only where it starts outside a string on its line
# (an even number of each quote mark before it on its line); a test checks that the code is the same token for token.
def uncomment(t):
    out, i = [], 0
    for m in re.finditer(r'/\*.*?\*/', t, re.S):
        if m.start() < i: continue
        line = t[t.rfind('\n', 0, m.start()) + 1:m.start()]
        if any(line.count(q) % 2 for q in '\'"`'): continue
        if m.group(0) == '/*HERO*/': continue  # the hero table marker (build-hero-ratios-v1.py and its test look for it)
        assert m.group(0).startswith('/* '), 'unexpected comment form: ' + m.group(0)[:40]
        out.append(t[i:m.start()]); i = m.end()
        if t[i:i + 1] == '\n' and (not out[-1] or out[-1].endswith('\n')): i += 1
    out.append(t[i:])
    return ''.join(out)
story = ("(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;\n"
         "/* Repair round (15 Nov 2026, the A4 checks): on a reload or a back or forward load the browser puts the reader back where they were.\n"
         "   It does that as soon as the page is tall enough, by the element that was at the top of the view, and again when the page has\n"
         "   loaded, by the scroll position, unless the first one still holds. With the head laid out from the first paint, the first one\n"
         "   held more often, and content above the view that changed size later then left the page a few pixels off (3 px on the Balkans\n"
         "   story at 390, 2,503 instead of 2,500). At the load event a scroll of one pixel and back (no frame in between, so nothing moves on\n"
         "   the screen) lets the browser's own restore at the end of loading put the page exactly where it was, as it does for the page\n"
         "   without this layer. Nothing is done when the page manages its own scroll restoration. */\n"
         "try{var NV=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];\n"
         "  if(NV&&(NV.type==='reload'||NV.type==='back_forward')&&history.scrollRestoration!=='manual'&&document.readyState!=='complete')\n"
         "    window.addEventListener('load',function(){var x=window.scrollX,y=window.scrollY;if(y>=1){window.scrollTo(x,y-1);window.scrollTo(x,y);}});}catch(e){}\n"
         "/* F1: the style goes in at once, so the story head is styled from the first paint. While the page is parsed it is kept after every style\n"
         "   that arrives (the template's own tll-st3-story-v1 at the end of the body would otherwise win the ties for those frames); once the page\n"
         "   is parsed it moves to the end of the body, as in v9 to v16. A2: the copied template and footer rules are in ES, a style of their own that\n"
         "   stays in the head, before both of those styles, and is taken out once both have been parsed whole (each has its sheet) or the\n"
         "   page is parsed. */\n"
         "var hd=document.head||document.documentElement,ES=null;\n"
         "if(document.readyState==='loading'){ES=document.createElement('style');ES.id='tll-story-st3-early-v1';ES.textContent=%s;hd.appendChild(ES);}\n"
         "var MS=document.createElement('style');MS.id='tll-mag-story-v1';MS.textContent=%s;hd.appendChild(MS);\n"
         "var so=null,TS=null,FS=null;function drop(){if(ES&&ES.parentNode)ES.parentNode.removeChild(ES);}\n"
         "/* a style the parser adds gets its sheet only once its end tag has been parsed */\n"
         "function past(n){return !!(n&&n.sheet);}\n"
         "function place(){if(so){so.disconnect();so=null;}drop();document.body.appendChild(MS);}\n"
         "if(document.readyState==='loading'){if(window.MutationObserver){so=new MutationObserver(function(ms){var at=null;\n"
         "  for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){var n=ms[i].addedNodes[j];if(n.nodeName==='STYLE'){if(n.id==='tll-st3-story-v1')TS=n;if(n.id==='tll-foot-v1')FS=n;}\n"
         "    if(n.nodeName==='STYLE'&&n!==MS&&n!==ES&&n.parentNode&&(n.compareDocumentPosition(MS)&2)&&(!at||(at.compareDocumentPosition(n)&4)))at=n;}\n"
         "  if(at)at.parentNode.insertBefore(MS,at.nextSibling);if(TS&&FS&&past(TS)&&past(FS))drop();});so.observe(document.documentElement,{childList:true,subtree:true});}\n"
         "  document.addEventListener('DOMContentLoaded',place);}else place();\n"
         "%s})();\n") % (json.dumps(uncomment(st3_early)), json.dumps(uncomment(mag_css + HOLD_CSS)), uncomment(mag_js_early))
story = uncomment(story)
cov = read(COVER)
cov_css = fallbacks(re.search(r'<style id="tll-mag-cover-v1">\n(.*?)</style>', cov, re.S).group(1))
cov_js = fallbacks(re.search(r'<script id="tll-mag-cover-js-v1">\n(.*?)</script>', cov, re.S).group(1))
assert 'fonts.googleapis' not in cov and "'Newsreader'" not in cov_css and "'Inter Tight'" not in cov_css, 'the cover layer carries no font request of its own (10 Nov 2026)'
OLD_RUN = "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();\n})();"
assert cov_js.count(OLD_RUN) >= 1
NEW_RUN = ("/* F1: fill the hero as soon as it has arrived (its next sibling exists), before the first paint; the page-parsed event stays as the fallback. */\n"
           "(function(){if(document.readyState!=='loading'){run();return;}var mo=null;\n"
           "function ready(){var h=document.querySelector('[data-h3-hero]');return !!(h&&h.nextElementSibling);}\n"
           "if(window.MutationObserver){mo=new MutationObserver(function(){if(ready()){mo.disconnect();mo=null;run();}});mo.observe(document.documentElement,{childList:true,subtree:true});}\n"
           "document.addEventListener('DOMContentLoaded',function(){if(mo){mo.disconnect();mo=null;}run();});})();\n})();")
cov_js_early = cov_js.replace(OLD_RUN, NEW_RUN, 1)
cover = ("(function(){if(!/^\\/(index\\.html)?$/.test(location.pathname))return;if(document.getElementById('tll-mag-cover-v1'))return;\n"
         "/* F1: the style goes in at once, so the cover is styled from the first paint; it moves to the end of the body once the page is parsed, as in v9 to v15. */\n"
         "var CS=document.createElement('style');CS.id='tll-mag-cover-v1';CS.textContent=%s;(document.head||document.documentElement).appendChild(CS);\n"
         "function place(){document.body.appendChild(CS);}\n"
         "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();\n"
         "%s})();\n") % (json.dumps(cov_css), cov_js_early)
# 16 Nov 2026: the two layers of the layout shift sweep go into the core without their comments (about 9 KB of them), as the story
# layer does since A4. Their sources keep every comment; first_paint_checks() above reads the copy markers from the source.
BARE = ('tll-page-heroes-v1', 'tll-first-paint-v1')
BARE += ('tll-early-state-v1',)  # part B, same day
def bare(t):
    out, i = [], 0
    for m in re.finditer(r'/\*.*?\*/', t, re.S):
        if m.start() < i: continue
        line = t[t.rfind('\n', 0, m.start()) + 1:m.start()]
        if any(line.count(q) % 2 for q in '\'"`'): continue
        out.append(t[i:m.start()]); i = m.end()
        if t[i:i + 1] == '\n' and (not out[-1] or out[-1].endswith('\n')): i += 1
    out.append(t[i:])
    return ''.join(out)
def core_layer(p):
    s = layer(p)
    if os.path.basename(p)[:-3] not in BARE: return s
    marker, rest = s.split('\n', 1)
    return marker + '\n' + bare(rest)
core = (head + consent + LOADER + styles + ''.join(core_layer(p) for p in paths(CORE)) + story + cover).encode('utf-8')

os.makedirs(CHUNK_DIR, exist_ok=True)
for name, b in files.items():
    open(os.path.join(CHUNK_DIR, name + '.js'), 'wb').write(b)
for stale in sorted(glob.glob(os.path.join(CHUNK_DIR, '*.js'))):
    if os.path.basename(stale)[:-3] not in files: os.remove(stale); print('removed stale chunk', stale)
open(OUT, 'wb').write(core)
print('core   %-24s %9s  (%s gzip)  %s' % (os.path.basename(OUT), kb(core), kb(gz(core)), sri(core)))
for name in files:
    print('chunk  %-24s %9s  (%s gzip)  %s' % (name + '.js', kb(files[name]), kb(gz(files[name])), hashes[name]))
print('built core with', len(STYLES), 'styles,', len(CORE), 'core layers, story layer', len(mag_css), 'css bytes, cover layer', len(cov_css), 'css bytes;', len(files), 'chunks')
