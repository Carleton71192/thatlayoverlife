# Fix-first map: /stories and Home (read-only, 9 Oct 2026)

Site 69d6145cf421c777840c1e25 · /stories page 69d61469f421c777840c204d · Home page 69d6145df421c777840c1e46.
Element ids below are `component` / `element` as the Designer API returns them. Nothing was changed.
Sources: Designer element tree, element settings, class styles, page + site freeform code, applied scripts, Stories CMS, the Map 2.0 bundle in the local repo (`map-2.0/dist/tll-map-layers.js`). The hosted script bodies on the Webflow CDN could not be fetched from this container (proxy returns 000); their behaviour is taken from `handoff/STATUS.md` and the code that calls them.

## /stories

### A. "Front of the shelf" block

Wrapping element to hide (one element hides the whole block, heading, Travel Wire link and all three cards):

| what | type / class | id | visibility |
|---|---|---|---|
| **Block to hide** | Block, tag `section`, class `tll-fos`, attr `data-tll-fos="1"` | `69d61469f421c777840c204d` / `70da7443-5e89-4e61-1474-9222b4afd798` | visible |
| head row | Block `tll-fos-head` | `5707a63b-0f1b-ed9f-90dd-e956eaceafb2` | visible |
| eyebrow "Front of the shelf" | Block `tll-fos-eyebrow` | `9a9eddff-e1b9-aa23-7b52-8f79574a0564` | visible |
| Travel Wire link "The Travel Wire · Today's news →" (href /travel-wire) | Link `tll-fos-wire` | `c91c6500-049b-0b32-3f08-bd89f346e05d` | visible |
| card grid | Block `tll-fos-grid` | `b4c465c7-22f6-7003-d508-82236fda869e` | visible |
| card 1 "Most read this week" (`data-tll-fos-card="most-read"`) | Block `tll-fos-card` | `680e5f0f-feb9-2200-bde5-424b352519d7` | visible |
| card 1 body "Open slot. The read counter is not wired yet, and we do not guess. Until it is, the newest stories sit at the top of the shelf." | Block `tll-fos-body` | `b88528ee-4663-9ad1-b354-b62698ab258c` | visible |
| card 1 CTA "Newest first →" (no href set) | Link `tll-fos-cta` | `8732e46d-ca4e-848b-cb17-29b830e95507` | visible |
| card 2 "From the press desk" (`data-tll-fos-card="press"`) | Block `tll-fos-card-press` | `b37bf643-c14a-43de-bac4-c471a987e2b7` | visible |
| card 2 body "No press bylines yet. The Pros are being recruited. Hosted trips disclosed at the top, verdicts their own." | Block `tll-fos-body` | `9fd6fa8c-8bfa-7ee6-57da-f771f1c052f0` | visible |
| card 2 CTA "Write as press →" (/for-press) | Link `tll-fos-cta-press` | `936e012f-2958-3636-e2b4-7570e8c8894e` | visible |
| card 3 "From the location experts" (`data-tll-fos-card="experts"`) | Block `tll-fos-card-open` | `15076fe8-145d-3f26-19ad-b6bb7f661547` | visible |
| card 3 body "Open slots. Eight years somewhere beats eight days everywhere. The first Location Expert stories land here." | Block `tll-fos-body` | `c7ddda8d-82cd-9534-789a-92ad66c97f0c` | visible |
| card 3 CTA "Become one →" (/for-expats) | Link `tll-fos-cta` | `75332b5d-ab6b-5f94-9223-24df1832b38e` | visible |

Also present, already hidden: an older HTML-embed version of the same block (`.tllfs`, two dashed cards, Travel Wire link) at `73b335fe-e31b-5052-ff26-89fd4dda6a2a` (HtmlEmbed, visibility false) inside the grid section. Leave it, or remove it in the same pass; it renders nothing today.

Script dependencies: none. No script targets `tll-fos`, `data-tll-fos` or `data-tll-fos-card`. The only CSS touching it is one line in the page head freeform (`@media(max-width:820px){.tll-fos-grid{grid-template-columns:1fr}}`), harmless when hidden. Hiding `70da7443-…d798` breaks nothing.

### B. Headline hero

Section `tll-library-hero` `2a4d384b-bbeb-eaf7-7cce-2edaf3976ba0` > inner `2a4d384b-bbeb-eaf7-7cce-2edaf3976b9f`:

| what | type | id | text in Designer | visibility |
|---|---|---|---|---|
| eyebrow | Span `tll-eyebrow-rose` | `2a4d384b-bbeb-eaf7-7cce-2edaf3976b7a` | "The Library" (uppercased by CSS) | visible |
| H1 | Heading h1 `tll-display-xl tll-library-title` | `acc2873a-f506-b7be-9b0a-51e60c1f14ae` | "Six stories, all worth the " + `<em>` "detour" (`acc2873a-…14ac`) + "." | visible |
| H1 first text node | String | `acc2873a-f506-b7be-9b0a-51e60c1f14aa` | "Six stories, all worth the " | |
| lede | Paragraph `tll-lede tll-library-lede` | `2a4d384b-bbeb-eaf7-7cce-2edaf3976b81` | "Counted by hand in Copenhagen. More landing weekly." | visible |
| old stats row ("4 stories published · 4 countries · 1 Samoyed · Counted by hand…") | Block `tll-library-stats` | `2a4d384b-bbeb-eaf7-7cce-2edaf3976b9e` | | **hidden** |

Is "Eight" hardcoded? **No.** The Designer text is "Six stories". The live page says "Eight" because the page footer script **`tllstorycountv2`** (registered hosted script, applied to /stories and Home, footer) fetches `/sitemap.xml`, counts `/stories/` URLs and rewrites the number word in the H1 and the shelf label (STATUS.md: "reads the story count from /sitemap.xml so the H1 word and the shelf label follow the CMS"). The site-wide `tll-live-stories-v1` (site head freeform) only rewrites "N stories, growing weekly" / "N stories filed" patterns and `<strong>N</strong> stories`, so it does not touch this H1. CMS today: 9 live Stories items (Pantanal published 04:35 UTC on 9 Oct), so the word will read "Nine" once the sitemap regenerates. Any copy change to the H1 must keep the pattern `<Word> stories, …` or tllstorycountv2 will stop matching (exact regex not retrievable; the hosted source is on the Webflow CDN).

### C. Filter band

Section `tll-library-filters`, attr `data-tll-filter-bar`: `2a4d384b-bbeb-eaf7-7cce-2edaf3976bb4` (visible) > inner `tll-container tll-filters-inner` `2a4d384b-bbeb-eaf7-7cce-2edaf3976bb3`.

Pillar chip row: Block `data-tll-chiprow` `8d8b8cc3-3691-1b16-022d-101801a96ad4`

| chip | href | id |
|---|---|---|
| All stories (`data-tll-filter="all"`) | /stories | `8d8b8cc3-3691-1b16-022d-101801a96ac7` |
| Layover Guides | /pillars/layover-guides | `8d8b8cc3-3691-1b16-022d-101801a96ac9` |
| 🐾 Paw Passport | /pillars/paw-passport | `8d8b8cc3-3691-1b16-022d-101801a96acb` |
| Travel Logistics | /pillars/travel-logistics | `8d8b8cc3-3691-1b16-022d-101801a96acd` |
| Cultural Intelligence | /pillars/cultural-intelligence | `8d8b8cc3-3691-1b16-022d-101801a96acf` |
| Stories From the Road | /pillars/stories-from-the-road | `8d8b8cc3-3691-1b16-022d-101801a96ad1` |
| legacy span "SORT: NEWEST ↓" | | `8d8b8cc3-3691-1b16-022d-101801a96ad3` (visible in Designer; the chips script hides it at runtime, and mobile CSS hides it under 700px) |

Pillar chips are plain page links; no script handles them.

Place + sort rows: Block `tll-chip-rows` `data-tll-chips="place-sort"` `ed00275d-d264-21ec-6478-1932fc98123f`

| row / chip | attr | id |
|---|---|---|
| Place row | Block `tll-chip-row` | `94028673-b476-4457-dc40-03564bc427c4` |
| label "Place" | `tll-filter-label` | `e4d359ef-5039-4dba-0714-753dfcfafea6` |
| All places (on) | `data-tll-place="all"` | `d78e5c45-f7f5-56e0-4455-9d7d2510beab` |
| Europe | `data-tll-place="Europe"` | `47047540-4a8f-e709-b0b8-f22463726bad` |
| Africa | `data-tll-place="Africa"` | `a6d37604-292d-883e-ecdf-6855e97dec8d` |
| Americas | `data-tll-place="Americas"` | `3ea5d16b-0950-a8a4-7221-439895f3fadc` |
| Antarctica | `data-tll-place="Antarctica"` | `4391ae2f-045b-a52a-8687-121e2e83a55d` |
| Sort row | Block `tll-chip-row` | `98f819bc-48be-e6b0-2d8a-c67c1e70a344` |
| label "Sort" | `tll-filter-label` | `9120638f-f68a-93f5-59da-018199f06c97` |
| Most recent (on) | `data-tll-sort="recent"` | `a4412894-a177-79c1-b03c-cd5045fdbf49` |
| A to Z by country | `data-tll-sort="az"` | `1af40010-8758-bd8e-b35c-388a1a8ad001` |
| Read time | `data-tll-sort="time"` | `61eb371a-ac36-7c1c-05a3-1eafe9c34d21` |

Place and sort chips are Link elements with no href, `role="button"`, `aria-pressed`. Active chip has class `tll-filter-chip-on`, inactive `tll-shelf-chip`.

Teal "✍ Share your story" button: Link `tll-filter-cta`, href /submit, `2a4d384b-bbeb-eaf7-7cce-2edaf3976bb2` (visible).

Script driving place + sort: **page footer freeform**, `<script id="tll-lib-chips-v1">` ("TLL Stories chips v1, 2026-09-28"). It reads the hidden per-card data blocks (`data-tll-region`, `data-tll-mins`, `data-tll-date`, `data-tll-country`) and re-appends the cards. Sort logic verbatim:

```js
var rows=items.map(function(el,i){return{el:el,i:i,region:d(el,'data-tll-region'),mins:parseFloat(d(el,'data-tll-mins'))||999,date:Date.parse(d(el,'data-tll-date'))||0,country:(d(el,'data-tll-country')||d(el,'data-tll-region')).toLowerCase()};});
var place='all',sort='recent';
function apply(){
  var shown=rows.filter(function(r){return place==='all'||r.region===place;});
  rows.forEach(function(r){r.el.style.display=shown.indexOf(r)>-1?'':'none';});
  shown.sort(function(a,b){return sort==='az'?a.country.localeCompare(b.country):sort==='time'?a.mins-b.mins:(b.date-a.date)||(a.i-b.i);});
  shown.forEach(function(r){grid.appendChild(r.el);});
  ...
```
Empty place → injects `#tll-chip-note` "Nothing on the shelf for {place} yet. Be the first. Share your story →". Place match is an exact string compare against the card's `data-tll-region` text, so chip values must equal the CMS Region option names.

Sticky CSS: the **Designer class `tll-library-filters`** (style id `2a4d384b-bbeb-eaf7-7cce-2edaf3976c2d`), base breakpoint: `position: sticky; top: 0; z-index: 50; padding: 14px 0; background-color: rgba(247,244,238,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(28,28,28,0.06)`. Note the nav `.tll-nav-v1` is also sticky, top 0, z-index 50, so the band pins directly under/over the nav. Mobile layout of the band comes from page head freeform `<style id="tll-lib-filters-mobile-v1">` (stacks rows, horizontal-scroll chip rows under 700px) and `<style id="tll-lib-chips-css-v1">` (focus rings).

### D. Search block

Section `tllsb-bar` `6b8749f3-2560-6665-99ed-9b01d8ce6cdb` (visible) > `tllsb-inner` `…6cda`:

| what | id |
|---|---|
| label "Search the shelf" (Block `tllsb-label`) | `6b8749f3-2560-6665-99ed-9b01d8ce6ccd` |
| form wrapper (FormWrapper `tllsb-form`, method get, no action) | `6b8749f3-2560-6665-99ed-9b01d8ce6cd0` |
| form | `6b8749f3-2560-6665-99ed-9b01d8ce6cd1` |
| input `#tll-lib-q`, name `q`, aria-label "Search the library" (FormTextInput `tllsb-input`) | `6b8749f3-2560-6665-99ed-9b01d8ce6cce` |
| submit button (FormButton `tllsb-btn`) | `6b8749f3-2560-6665-99ed-9b01d8ce6ccf` |
| success msg "Searching the shelf." | `6b8749f3-2560-6665-99ed-9b01d8ce6cd2` (CSS-hidden) |
| error msg "That search did not run…" | `6b8749f3-2560-6665-99ed-9b01d8ce6cd5` (CSS-hidden) |
| "Clear search" link `#tll-lib-clear` → /stories | `6b8749f3-2560-6665-99ed-9b01d8ce6cd9` |

The result-count line ("N STORY MATCHING “Q” · CLEAR THE SEARCH TO SEE THE WHOLE SHELF" / "N STORIES MATCHING…" / "NOTHING FILED FOR “Q” YET. THE SHELF GROWS WEEKLY.") is **not a Designer element**. It is a `div[role=status]` created at runtime by page footer freeform `/* TLL library search v3 (2026-09-23) */`, inserted before the grid, only when `?q=` is in the URL. The same script hides non-matching `[data-tll-card]` cards by `textContent` substring; zero hits re-shows every card.

Submit wiring: page footer freeform `/* TLL library search UI v2 */` wires `#tll-lib-q`, fills it from `?q=`, shows the Clear link, and navigates to `/stories?q=…` on Enter/submit (capture phase, so Webflow's form handler never runs).

Bot-check: **Webflow Turnstile** is applied site-wide to every form. The search script deliberately detaches it: `form.removeAttribute('data-turnstile-sitekey')`, removes `w-form-loading`, forces the submit button enabled and keeps it enabled with a MutationObserver. The Home search footer script does the same. No reCAPTCHA. If the form element is replaced or its id changes, Turnstile re-disables the button.

Styling: page head `<style id="tll-lib-search-v2">` (pill layout) then `<style id="tll-v9-j12-v1">` (the big underlined Playfair headline input, pink `tllsb-btn`).

### E. Story card grid

- Section `tll-library-grid-section` `2a4d384b-bbeb-eaf7-7cce-2edaf3976bf9` > `tll-container` `…bf8`.
- **Yes, a CMS Collection List**: DynamoWrapper `43ed9711-cfab-25ae-d6fb-310c8eacf75a`, source `collectionId: 6a0b29eddc14f1444e935760` (**Stories**), `queryMode: dynamic`, `filters: []`, **`sort: []`** (no sort set: Webflow default manual/creation order), `limit: 100`, no pagination. DynamoList class `tll-lib-grid` `43ed9711-cfab-25ae-d6fb-310c8eacf75b`; DynamoItem `…f75c`; empty state `…f75d` "Nothing on the shelf yet. Be the first to file a story."
- Card: Link `tll-lib-card` `data-tll-card="cms"` `7e8747f4-7b3a-723c-abc1-f3fafea0aa2f` (href set at runtime from the card's id by page footer `/* TLL story card links v2 */`), Image `tll-lib-img` `f9cab572-d0bb-8378-5462-8e789d595b06`, body `57e1c936-…bdfd8` with meta `75b477bd-…cdae`, H2 title `9882c47c-6172-0b48-8b76-800b9411949c` (bound to Stories › Name `4f8f9a69191510bd511fd2fe03a504af`), lede `1f28d260-…38c3`, byline `43b77561-…06b1` (`data-tll-byline="card"`, avatar `4ae110d0-…b0b9`, name `c827f1fa-…a9bd`), "Read the story →" `b9cfbff8-…2e62`. Hidden data blocks feeding the chips script: `data-tll-author` `fa679476-…64c8`, `data-tll-country` `0cec8021-…8073`, `data-tll-date` `354ca43f-…c84a`, `data-tll-mins` `3003c797-…45d0`, `data-tll-region` `2a6bb030-…7cf5`.
- Runtime ordering: the chips script re-sorts to "Most recent" (published date desc) on load, so the Designer order is only what crawlers and no-JS see.
- Old v3 JS grid container `tll-library-grid` `2a4d384b-bbeb-eaf7-7cce-2edaf3976bf7` is **hidden** (page footer CSS still styles `.tll-library-grid`; do not re-add a JS card builder, per the comment).
- **Tilt CSS** on photos: page head `<style id="tll-v9-j12-v1">`:
  `.tll-lib-grid > :nth-child(odd) .tll-lib-img{transform:rotate(-.8deg)}` / `.tll-lib-grid > :nth-child(even) .tll-lib-img{transform:rotate(.9deg)}` with `@media(prefers-reduced-motion:reduce){.tll-lib-grid > * .tll-lib-img{transform:none !important}}`. Because the chips script re-appends cards, odd/even recomputes after every sort.
- Page scripts that touch the cards: `tllflagsv4` (country flag badge from byline text), `tllauthorlinkv1` (byline → /contributors/{slug}), `tllstorycountv2` (counts). Site `tll-flow-js-v1` (hidden HtmlEmbed `133b8eba-b739-99ba-a0f6-216a688ccbf9` at body end, visibility false, so it does **not** run on this page today).
- After the grid: section `tll-library-empty-cta` `2a4d384b-bbeb-eaf7-7cce-2edaf3976c09` ("THE LIBRARY KEEPS GROWING" / "More stories on the way." / "Share your story →" + "What TLL is"), then **newsletter** section `tll-library-newsletter` `2a4d384b-bbeb-eaf7-7cce-2edaf3976c24`: eyebrow "THE WEEKLY LAYOVER" `…c0b`, H3 "One story, when it's worth it." `…c10`, sub "No schedule we'd break…" `…c12`, FormWrapper `tll-library-news-form` `…c16` (form `…c17`, `target=_blank`, method get, **no action**, email input `#field` `…c13`, submit `…c15`), fine print "Hosted on Substack. By subscribing you agree to TLL's privacy policy." `…c22`. This form is still under Turnstile and has no action, so it posts nowhere useful; outside this item's scope but worth a line in the log. Footer component instance "TLL Site Footer" `6dca7dbc-7074-5442-bd8e-11f5183bb88b`.

### F. Scripts and freeform code on /stories

Applied page scripts (footer, registered hosted on Webflow CDN; bodies not fetchable here):
- `tllauthorlinkv1` 1.0.0: makes the card/story byline link to `/contributors/{slug}`.
- `tllstorycountv2` 1.0.0: counts `/stories/` URLs in `/sitemap.xml` and rewrites the H1 number word and the shelf label (also applied to Home).
- `tllflagsv4` 1.0.0: adds a circular country flag to each card from the byline's country (hosted flags + Intl.DisplayNames index; source in repo `src/site-layers/tllflagsv4.js`).

Page head freeform (11.3k chars): canonical link; `tll-lib-search-v2` (search pill CSS); `tll-lib-filters-mobile-v1` (filter band stacking under 700px); `tll-flow-v1` (reveal + endless atlas CSS, unused while the flow embed is hidden); `tll-v9-j12-v1` (big headline search input, shelf-card look, photo tilt).

Page footer freeform (8.6k chars): story card links v2 (href from card id); Stories Index v4 CSS for the retired `.tll-library-grid`; library search v3 (filters cards on `?q=`, inserts the count line); library search UI v2 (wires `#tll-lib-q`, detaches Turnstile, routes to `/stories?q=`); `tll-lib-chips-v1` (place filter + sort, hides the "SORT: NEWEST" span, sets `#tll-shelf-grid`); `tll-lib-chips-css-v1` (chip focus/hover, `.tll-fos-grid` 1-column under 820px).

Site-wide (every page), relevant parts: site scripts `tll_memberstack_init_v2` (head), `tllformcontrolsv3` (head), footer: `tll_memberstack_skin_v1`, `tll_feedback_widget_v1`, `tll_world_map_v1` (old d3 SVG map into `#tll-map-canvas`, not present on Home now), `tllfactsv1`, `tllreveal` 1.1.0 (reveal-on-scroll), `tll_ledger_sync`, `tll_save_story`, `tll_saved_shelf`, `tll_reader_notes`, `tll_reader_notes_form`, `tllformlabelsv1`, `tllavatarv1`, `tllmapv3`. Site head freeform: embed-mode CSS, craft polish, `tll-live-stories-v1` (story-count rewriter for "N stories filed / growing weekly" patterns + search placeholder), mobile nav, GA4 + Ahrefs analytics, `tll-proto-parity-v1` CSS (hides `#tll-ad-slot-home`, `.w-dyn-bind-empty` leftovers, styles `form.tll-home-search`), `tll-proto-parity-js-v1` (contrast repair, wordmark, copy swaps, adds `tll-home-search` class and renames Submit → Search), v9 chrome/type/scrim/motion. Site footer freeform: cookieconsent 3.1.0, share fixes, pass-A CSS, core v2 CSS, forms v2 CSS, `tll-core-v2` JS (lazy images, member H1s, founder avatar, Trip Ledger on /edit-profile), `tll-a11y-motion-v1`.

## Home

### G. Atlas and stats block ("Where the Travelers have been")

Outermost wrapper: **Block `tll-map` `69d6145df421c777840c1e46` / `beb831d5-0273-2ff1-9c40-a7e05a6553f9`** (visible, plain div, no id). Hiding it hides the whole block. Its contents, in order:

1. `tll-map-top` `beb831d5-0273-2ff1-9c40-a7e05a6553f2`: heading `tll-map-h` `…53ee` "Where the Travelers have " + span `tll-map-accent` `…53ed` "been."; link `tll-map-link` `…53f1` "Open the full map →" (/the-map).
2. HtmlEmbed `61b09da1-6a8c-03d1-dfcd-074478161a51` — **hidden** (visibility false). Old iframe of `/the-map?embed=1` ("Map of the 87 countries visited").
3. **HtmlEmbed `4b170d8b-d0df-77cd-b27b-505062b05e5a` — visible. This is the Map 2.0 embed and it sits INSIDE `tll-map`.** It loads `map-2.0/dist/tll-map-layers.css/.js` from jsDelivr (commit `6a1098ab…`, statically.io fallback) into `#tll-map-layers`, with a `#tllm-boot` status line ("LOADING THE MAP CODE").
4. `tll-map-note` `4dd8dfd1-f3cd-d8e9-cd19-bed01b68a63c` "Every pink country belongs to the editor. Go make a worse one."

Everything in the review list except the H2 is rendered by the Map 2.0 bundle inside `#tll-map-layers`, not by Webflow elements: the switcher bar (`.tllm-bar`) with the **"Edit my destinations"** button (Phase 5 item 7, `data-tll-editor="/the-map#edit"`), the hero counter, then sections `section('THE RECEIPTS · ONE ROW PER LIST', 'Counted by hand, <em>list by list.</em>')`, `'MANY WAYS TO COUNT'` (rulebooks of 249 / 195 / 193 / **330** Travelers' Century Club → "OPEN of 330" when nothing counted), `'SETS OF SEVEN'`, `'LINES AND EXTREMES'` (strip cell `'?/38', 'Time zones', 'Open slot'`), `'IN MOTION'` (the empty **Strava / Polarsteps** frames, `collections.json › embeds` both `connected:false`), source badges built as `label + ' · SYNCED ' + date` from `collections.json › sources` (`FROM PLACES BEEN`, synced 2026-10-06), and `'0 of {of}.'` cards from `empty_copy.card_zero`.

So:
- Hide the whole block incl. the globe → hide `beb831d5-0273-2ff1-9c40-a7e05a6553f9`.
- Keep the globe but drop the receipts/stats/Strava/time-zone rows → that is **not a Webflow change**; it is a Map 2.0 change in the repo (`map-2.0/collections.json` or `dist/tll-map-layers.js`) plus a new pinned commit hash in embed `4b170d8b…`. The embed itself has no toggle.
- Nothing else depends on this block: the site-wide flow script (hidden embed `81aad1d1-60de-9d15-b2bf-263de891af9c`, visibility false, not running) is the only code that queries `.tll-map`; `tll_world_map_v1` looks for `#tll-map-canvas`, which Home no longer has.

### H. Home search box and the line under it

Inside section `#tll-shelf` `e646451a-68a7-b183-3a52-6da4762de20c` > `…de20b` > `…de207` > Block `c618aa80-c5fc-05d8-1a40-9ccfa36c9ffb`:

| what | id |
|---|---|
| FormWrapper (class `inline-form-0-1-2`) | `69d6145df421c777840c1e46` / `c618aa80-c5fc-05d8-1a40-9ccfa36c9ff1` |
| form (no action/method set in Designer; footer script sets action=/stories, method=get) | `c618aa80-c5fc-05d8-1a40-9ccfa36c9ff2` |
| text input `#Search-the-library`, name `Search-the-library`, aria-label "Search stories" | `c618aa80-c5fc-05d8-1a40-9ccfa36c9fee` |
| submit button (value "Submit", renamed "Search" at runtime) | `c618aa80-c5fc-05d8-1a40-9ccfa36c9ff0` |
| success msg "Check your inbox. One click to confirm, and you will hear the day the doors open. Nothing else, ever." | `c618aa80-c5fc-05d8-1a40-9ccfa36c9ff3` (stale newsletter copy on a search form) |
| error msg "That did not go through. Try once more, or email hello@thatlayover.life." | `c618aa80-c5fc-05d8-1a40-9ccfa36c9ff6` |
| **line "Double opt-in · No newsletter bribe · Leave any time"** (Block `inline-div-0-…-44`) | `c618aa80-c5fc-05d8-1a40-9ccfa36c9ffa`, String child `…9ff9` |

Scripts on this box: Home footer freeform `/* TLL home search routing v2 */` (action → /stories?q=, Turnstile detached, button held enabled); Home head `tll-home-search-placeholder-v1` (placeholder text); site `tll-proto-parity-js-v1 › homeSearch()` (adds class `tll-home-search`, Submit → Search); page script `tllhomesearchv5` (registered, footer; earlier version of the same routing, body not fetchable). CSS: site `tll-proto-parity-v1` (`form.tll-home-search` pill), Home head `tll-home-search-v3` + `tll-home-search-mobile-v4`. The "Double opt-in" line has no script dependency; hiding or rewriting `c618aa80-…9ffa` is safe. Also in this section and already CSS-hidden: ad slot `#tll-ad-slot-home` `e646451a-68a7-b183-3a52-6da4762de20a`.

### I. "Already on the shelf · 8 stories, counted by hand" and the random three

- Eyebrow Block `e646451a-68a7-b183-3a52-6da4762de1e7` (String `…de1e6`). Designer text: **"Already on the shelf · 6 stories, counted by hand"**. The "8" on the live page comes from page script **`tllstorycountv2`** (sitemap count), same as the /stories H1. The site `tll-live-stories-v1` regexes do not match this string. Keep the `N stories` pattern if the copy changes.
- Random three: HtmlEmbed `cd17db29-e34a-8909-36d3-0fb4d2bd6ef6` (inside `…de204`). It contains six hardcoded `<a class="tll-shelf-card">` cards (Balkans EV, Ghana, Patagonia, La Paz, Montenegro, Antarctica; all "Nancy Carleton"), the CSS `.tll-shelf-grid[data-tll-rotate] .tll-shelf-card:nth-child(n+4){display:none}`, and an inline script that Fisher-Yates shuffles the children on each visit ("Rotate the shelf: shuffle all live stories, show three per visit. No-JS shows the first three."). It is **not** CMS-bound: new stories (Sort Sol, Northern Brazil, Pantanal) are missing from the pool, and the embed, not a script, is where to add them. Below it: "See the full library →" `e646451a-68a7-b183-3a52-6da4762de206`.

## What could break (summary)

- A: hiding `tll-fos` `70da7443-…d798` is safe; no script references it.
- B/I: the number words are rewritten by `tllstorycountv2` from the sitemap; editing the H1/eyebrow copy away from "<word> stories" will freeze the count at the Designer value ("Six"). The Designer currently says Six while the CMS has 9 live stories.
- C: chips depend on `data-tll-place` values matching CMS Region option names exactly, and on the hidden per-card data blocks; the band's stickiness is the class, not code.
- D: the search form must keep `#tll-lib-q` and its wrapper, or Turnstile re-disables the button; the count line is script-made.
- E: the grid is the Stories collection list with no Designer sort; order is set client-side.
- G: hiding `tll-map` `beb831d5-…53f9` removes the Map 2.0 globe too (embed `4b170d8b…` is inside it). Trimming only the stats needs a repo change + new pinned hash.
- H: the "Double opt-in" line is a plain block with no dependencies; the form's success/error copy is stale newsletter text.
