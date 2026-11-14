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
template script's place-and-date rewrite."""
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
# Accepted tradeoff (1 Nov): travelers-fix (18 KB) stays in the travelers chunk although its top-level style() call shapes the first paint
# of /travelers, so on a slow connection that page can show the retired open-slot tile and the old link chips for a moment before the
# chunk lands. Weighed against adding 18 KB to every page, the brief flash on one directory page was accepted.
CORE = ['tll-img-variants-v1', 'tll-account-hash-tabs-v1', 'tll-note-typing-v1', 'tll-ux-1028-v1', 'tll-mbar-align-v1', 'tll-photos-form-v2',
        'tll-album-settings-v1', 'tll-division-v1', 'tll-phase0-v1', 'tll-drafted-v1',
        'tll-ads-v1', 'tll-page-heroes-v1', 'tll-stories-noimg-v1', 'tll-home-bands-v1', 'tll-rail-hold-v1', 'tll-library-hold-v1',
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
st3_early = ('/* F1 (14 Nov 2026): the Stories Template rules the first paint needs (meta row, byline row and avatar), as in tll-st3-story-v1,\n'
             '   and the footer rule that hides the commissioned link, as in tll-foot-v1. Only until both styles have been parsed: then this\n'
             '   style is taken out, so the template and the footer always have the last word. */\n'
             + ''.join(ST3_PAGE + r.replace('@P@', ST3_PAGE) + '\n' for r in ST3_EARLY + [FOOT_EARLY]))
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
                 "   finished page. */\n"
                 "(function(){if(document.readyState!=='loading'){run();return;}var mo=null,ran=0,rd=0,hd=0;\n"
                 "/* A2: an element counts as arrived whole once an element follows it or one of its ancestors, below the body's own children (scripts\n"
                 "   add nodes to the end of the body while it is parsed, such as a consent iframe, which once made a half-parsed Receipts block count\n"
                 "   as whole on slow 4G), and never because of the story style, which is moved after each style as it arrives. */\n"
                 "function whole(n){for(;n&&n.parentNode&&n.parentNode!==document.body;n=n.parentNode){var x=n.nextElementSibling;if(x===MS)x=x.nextElementSibling;if(x)return true;}return false;}\n"
                 "function hold(k,on){var h=document.querySelector('.tll-story-hero');if(!h)return;if(on)h.setAttribute('data-tll-mg-wait-'+k,'');else h.removeAttribute('data-tll-mg-wait-'+k);}\n"
                 "function late(){var c=document.querySelector('.tll-story-hero .tll-story-hero-content'),a=c&&c.querySelector('.st3-author');if(a)rcpt(c,a);rd=1;hold('r',0);}\n"
                 "function after(){hold('d',0);}\n"
                 "function stop(){if(mo){mo.disconnect();mo=null;}}\n"
                 "if(window.MutationObserver){mo=new MutationObserver(function(){var led=document.querySelector('[data-tll-ledger=\"story\"]');\n"
                 "  if(!ran){if(!whole(document.querySelector('.st3-author'))||(led&&!whole(led)))return;run();ran=1;\n"
                 "    var c=document.querySelector('.tll-story-hero .tll-story-hero-content');if(c&&c.querySelector('.st3-author')){hold('d',1);hold('r',1);}}\n"
                 "  if(!rd&&led&&whole(led))late();\n"
                 "  var hs=document.getElementById('tll-st3-story-js-v1');if(!hd&&hs&&whole(hs)){hd=1;document.addEventListener('DOMContentLoaded',after);}\n"
                 "  if(rd&&hd)stop();});\n"
                 "  mo.observe(document.documentElement,{childList:true,subtree:true});}\n"
                 "document.addEventListener('DOMContentLoaded',function(){stop();run();late();if(!hd)after();});})();\n")
# the two holds (A2): matched only while the hero carries the attribute, so the finished page is unchanged
HOLD_CSS = ('/* F1 holds (A2, 14 Nov 2026), set and cleared by the early run: nothing matches once the page is parsed */\n'
            '.tll-story-hero[data-tll-mg-wait-r] .tll-mg-fig,.tll-story-hero[data-tll-mg-wait-r] .tll-story-hero-content>.tll-mg-stamp{visibility:hidden}\n'
            '.tll-story-hero[data-tll-mg-wait-d] .tll-story-hero-content .st3-author-filed{display:-webkit-box !important;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden;visibility:hidden}\n')
mag_js_early = mag_js.replace(OLD_STORY_RUN, NEW_STORY_RUN, 1)
story = ("(function(){if(!/^\\/stories\\/[^/]+\\/?$/.test(location.pathname))return;if(document.getElementById('tll-mag-story-v1'))return;\n"
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
         "%s})();\n") % (json.dumps(st3_early), json.dumps(mag_css + HOLD_CSS), mag_js_early)
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
core = (head + consent + LOADER + styles + ''.join(layer(p) for p in paths(CORE)) + story + cover).encode('utf-8')

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
