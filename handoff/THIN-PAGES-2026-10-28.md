# Thin-page audit for AdSense, 28 October 2026

Site: www.thatlayover.life (Webflow site 69d6145cf421c777840c1e25). Read-only audit. Nothing was written or published.

## How the numbers were made

- Sitemap, robots and canonical data come from `src/seo/live-2026-10-26/crawl-www-2026-10-27.json` (101 sitemap URLs, crawled 27 October).
- Static-page word counts come from the full Webflow element tree for each page (`get_all_elements`, depth -1). Only text under visible ancestors is counted. Elements set to hidden in Webflow, elements with a `hidden` attribute, form success and error messages, and the shared nav and footer components are excluded.
- Where a page builds content in HtmlEmbed blocks (Home, The Map, Travelers, About, Newsletter, Paw Passport), the embed `code` was read and stripped of `<style>`, `<script>` and tags. Text that scripts inject at runtime is not counted, so these are floors.
- CMS counts come from `list_collection_items`, counting rich-text field words per item. Template chrome (labels, buttons) adds roughly 50 to 100 words per CMS page and is not included.
- Estimates are rounded. Treat them as within about 15 percent.

## Two findings before the table

1. **Five pages on the brief's sitemap list are not in the sitemap.** press-trips, press, expats, ees-etias-layover and copenhagen-stopover are drafts in Webflow and absent from the crawled sitemap. They are included below as drafts.
2. **There are no link-out stories.** The `external-url` field is empty on all 68 Stories items. The two shortest live stories are ordinary short posts (102 and 227 words), not pointers to another site.

## Static pages

Words are visible words on the page, excluding nav and footer.

| URL | What it is | Est. visible words | Call | Reason |
|---|---|---|---|---|
| / | Home, built from 18 embeds | about 800 | keep | Real editorial copy plus story and map teasers. Another agent is editing Home today, so recheck after that lands. |
| /stories | Library index | about 150 static plus 54 story cards (about 1,900) | keep | Strong hub. Fix the H1, which says "Six stories" while 54 are live. |
| /contact | Contact doors | about 230 | keep | Short but required as a trust page, and it names a real editor. |
| /the-map | Interactive country map tool | about 260 | fill | Mostly UI labels. Add 300 or more words on how the count works (249 places, the Antarctica rule, layovers counted apart). |
| /about | About TLL | about 720 | keep | Solid first-person page. A second, older layout is hidden in the Designer and does not render. |
| /travelers | Traveler roster | about 100 plus 5 CMS cards | fill | Open-slot copy outweighs the roster. Add an intro and a line per traveler. |
| /faq | FAQ | about 420 | keep | Useful answers with sources. Could grow, but it is not thin. |
| /support | Support | about 450 | keep | Adequate for a help page. |
| /spotlight | Traveler spotlight | about 165 | noindex | Every slot reads "Not picked yet", "Coming soon" or "Open slot". Also hide from nav until a real feature runs. |
| /privacy | Privacy policy | about 1,100 | keep | Complete, already discloses AdSense cookies. |
| /terms | Terms of service | about 1,400 | keep | Complete. |
| /for-expats | Expat program page | about 445 | keep | Enough original copy. |
| /for-press | Press program and press-trip form | about 380 | keep | Legitimate partner page. |
| /for-affiliates | Affiliate pitch | about 105 | merge | Three checklist lines and a CTA. Fold into /for-brands as an "Affiliates" section. |
| /gallery | Photo wall (Layover Lounge) | about 60 plus 16 photos | fill | Image-only. Add a caption of 20 to 40 words to each photo. |
| /the-paw-passport | Pet travel hub | about 480 plus 4 entry links | keep | Real EU pet-rule guidance. The strongest Paw Passport page. |
| /destinations | Atlas hub | about 90 static plus 54 story cards and 197 country tiles | keep | Navigation hub with substantial linked content. |
| /pets | Pet roster | about 200 | merge | One pet plus two "Open slot" cards. Fold into /the-paw-passport, which already shows Magnus and the roster. |
| /editorial-charter | Seven editorial rules | about 300 | keep | Trust page. Rule 08 is hidden as a draft, which is fine. |
| /community-guidelines | Five house rules | about 230 | keep | Short by design and expected on UGC sites. |
| /newsletter | Signup page | about 45 | noindex | One paragraph and a form. The same signup sits on /stories and Home. |
| /cookies | Cookie policy | about 390 | keep | Complete, names every cookie including AdSense ones. |
| /travel-wire | Aggregated third-party headlines | about 200 static plus JS-loaded headlines | noindex | Rendered content is other publishers' headlines, a scraped-content signal for AdSense review. Also hide from nav. |
| /awards | Layover Awards nomination form | about 160 | noindex | A form with house rules. The window closes 31 October with no winners page yet. Also hide from nav until results run. |
| /for-brands | Brand partnerships | about 360 | keep | Real offer copy. |
| /creators | Creator directory | about 90 | noindex | Directory is empty ("Nobody has switched on I'm a creator yet"). Also hide from nav until five or more creators opt in. |
| /press-trips (draft) | Press-trip board | about 110 | keep | Leave unpublished. Board is empty. |
| /press (draft) | Press directory | about 130 | keep | Leave unpublished. Directory is empty. |
| /expats (draft) | Expat directory | about 110 | keep | Leave unpublished. Directory is empty. |
| /ees-etias-layover (draft) | EES and ETIAS answer guide | about 400 | fill | Good original Q and A with official sources. Check each answer, set "Last checked", then publish. |
| /copenhagen-stopover (draft) | CPH stopover answer guide | about 400 | fill | Same pattern. Check sources, publish, and cross-link with /layovers/cph-copenhagen-6h so the two do not compete. |

## CMS template groups

| URL pattern | What it is | CMS: items, median words | Call | Reason |
|---|---|---|---|---|
| /stories/* | Travel stories | 54 live (all in sitemap), median 1,183 body words, plus about 250 in short-version and quick-answers | keep | The core of the site. Two live items are thin (see notes). 14 more are drafts, 6 of them 5-word stubs. |
| /countries/* | Country guides | 197 published; 9 linked to a traveler story, 188 public-source facts only; median verdict 25 words, body field empty on all 197 | noindex | 191 are already noindex. Of the 6 indexable, Kosovo is facts-only and should join them. Keep the 5 story-backed ones indexable. |
| /contributors/* | Traveler profiles | 4 live; bios 30 to 110 words, median about 34 | fill | Jay, Barzy and Chesney have no long bio, only an 18 to 23 word card line. |
| /paw-passport/* | Magnus diary entries | 4 live, 264 to 601 words (body plus logistics), median about 347 | keep | First-hand and useful. One entry is borderline (see notes). |
| /pets/* | Pet passports | 1 live, about 100 words of bio fields | fill | Magnus Waffles has a 77-word long bio. Add 150 to 250 words. |
| /layovers/* | Layover guides | 2 live: CPH 526 words, Sofia 271 words | keep | CPH is fine. Sofia is thin (see notes). Four archived drafts hold 360 to 630 words each that could be revived. |
| /marathon-diaries/* | Race diaries | 2 live: Copenhagen recap 848 words, Tokyo pre-race 304 words | keep | Both original. Tokyo grows after the race. |
| /pillars/* | Editorial pillar hubs | 2 indexable: stories-from-the-road (52 story cards), paw-passport (0 stories, 4 diary cards, about 80 words) | merge | Point the Paw Passport pillar to /the-paw-passport and noindex the pillar page. cultural-intelligence and travel-logistics are already noindex. |

## Notes on thin CMS items

Only items that are live and indexable, or flagged in the brief, are listed.

**Stories**
- /stories/even-brave-boys-get-scared: 102 words, 1-minute read. A dog-friendly cinema outing in Sao Paulo, not a trip. Expand to 400 or more words (venue, how the screening worked, dog rules) or refile it as a Magnus diary entry.
- /stories/horseshoe-bend-arizona: 227 words. Add logistics (drive time, parking, permit for the river kayak) to pass 500.
- Next shortest live stories are 466 to 508 words (Ghana, Montenegro, La Paz). Acceptable.
- Link-out stories: none. `external-url` is empty on all 68 items, and no body uses "read the full story" or "originally published" wording.

**Countries**
- Kosovo: indexable, facts-only. Its description says the facts "are not yet checked". Noindex it like the other 188 facts-only pages.
- Story-backed and indexable: Antarctica, Ghana, Bulgaria, Montenegro, Denmark. Their `body` field is empty, so each shows about 25 words of verdict plus a data table. Add 150 to 300 first-hand words to `body` for each.
- Story-backed but noindex: Tanzania, Mexico, Chile, Brazil. Leave noindex until each gets a written body.

**Contributors**
- /contributors/jay-carleton: 18-word short bio plus a 12-word line, no long bio, 1 story.
- /contributors/barzy-adam: 23-word short bio that restates his one story, no long bio, 1 story.
- /contributors/chesney-lish: 23-word short bio that restates her one story, no long bio, 1 story.
- /contributors/nancy-carleton: 52-word long bio plus 51 story cards. Fine.

**Magnus diary**
- /paw-passport/magnus-montenegro-border: 150 body words plus 114 logistics words. Add the border paperwork specifics to pass 400.

**Pets**
- /pets/magnus-waffles: 77-word long bio, 15-word card bio, 8-word quote. Add the border history already told in the diary.

**Layovers**
- /layovers/sof-sofia-3h: 177 walk-through words plus 94 practical words. Expand the walk-through to match the CPH guide.

## Counts per recommendation

| Call | Static pages | CMS groups | Total |
|---|---|---|---|
| keep | 19 (including 3 drafts left unpublished) | 4 | 23 |
| fill | 5 | 2 | 7 |
| merge | 2 | 1 | 3 |
| noindex | 5 | 1 | 6 |
| hide-from-nav | 0 as the main call; 4 as a second step (spotlight, creators, travel-wire, awards) | 0 | 0 |
| **Total rows** | 31 | 8 | 39 |

Nothing here recommends deleting a page or CMS item.

## The ten weakest pages, with the single most useful fix

1. **/newsletter** (about 45 words). Noindex it and drop it from the sitemap. The same form already sits on Home and /stories.
2. **/gallery** (about 60 words, 16 photos). Write a 20 to 40 word caption for each photo: place, date, what is happening. That alone puts it past 500 words.
3. **/pillars/paw-passport** (about 80 words, 0 stories filed). Link the pillar to /the-paw-passport and noindex the pillar page.
4. **/creators** (about 90 words, empty directory). Noindex it and remove it from the footer until at least five creators opt in.
5. **/countries/kosovo** (about 25-word templated verdict plus unchecked public data). Noindex it to match the other 188 facts-only country pages.
6. **/contributors/barzy-adam** (about 34 words; Jay Carleton and Chesney Lish are the same). Fill the `bio-long` field with 80 to 150 first-person words for all three.
7. **/stories/even-brave-boys-get-scared** (102 words). Expand it to 400 or more words with the venue and dog-screening details, or refile it as a Magnus diary entry.
8. **/for-affiliates** (about 105 words). Merge it into /for-brands as an "Affiliates" section and link there from the footer.
9. **/spotlight** (about 165 words, all placeholders). Noindex it and remove it from nav until the first traveler is picked.
10. **/travel-wire** (about 200 static words plus third-party headlines). Noindex it. Aggregated headlines are the biggest content-quality risk in an AdSense review, more than any word count.

Next in line: /pets (merge into /the-paw-passport), /awards (noindex after 31 October), /travelers (fill), /the-map (fill).
