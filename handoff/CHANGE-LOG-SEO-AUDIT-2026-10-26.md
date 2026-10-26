# Change log for approval: Ahrefs site audit fixes (26 October 2026)

Source: your Ahrefs Site Audit PDF (crawl of 15 October, 28 issues). The Ahrefs API is not on your plan, so every item below was re-checked by our own crawl of www.thatlayover.life on 26 October 2026 (117 pages reached, 102 in the sitemap). Nothing in this log is built. The Webflow lock is held by the cloud session since 21 October, so the build waits for that lock to be released as well as for your approval.

## A correction first
S114 said the raw HTML of every story was free of the typed count. That check was wrong: it looked for "88 countries and counting" as one string, and the page splits it into two spans. Today all 53 stories still carry the author box count in their HTML, hidden on screen by the R1 style: "88 countries and counting" on 50, "57 countries and counting" on 1, an empty number on 2. Search engines and AI readers see it. Item S1 fixes it.

## What the crawl found, against the Ahrefs list
| Ahrefs issue (15 Oct) | Today | Cause |
|---|---|---|
| 404 page (2), page has links to broken page (92 + 13) | 3 broken targets, linked from 7 pages | /creators directory tabs link to /expats and /press; the profile template's pet chip has the fallback link /paw-passport |
| Page has links to redirect (49) | 54 story pages link to /contributors, which redirects to /travelers | The byline and "See their work" links carry href="/contributors" in the HTML; a script rewrites them to the writer's page in the browser, so crawlers only see the redirect (the A6.1 deviation from 20 Oct) |
| Orphan page (16 + 1) | 21 sitemap pages have no link in the HTML | Writer pages, country pages and pillar pages are only linked by script (same cause); plus pages nothing links to at all: 4 Paw Passport entries, 2 layover guides, 2 Marathon Diaries, /awards, /spotlight, /contributors/anonymous |
| Meta refresh redirect (1), non-canonical page in sitemap (1) | /countries jumps to /destinations with a meta refresh, says its canonical is /destinations, and is in the sitemap | Old page left in place |
| Multiple H1 tags (1) | 6 pages | Profile template has a leftover second H1 that reads "Heading" (5 profiles); /submit's sign-in gate uses an H1 beside the form's |
| Open Graph tags incomplete (92), X card missing (1) | og:url is missing on 109 pages; /cookies and /creators have no social tags at all; two writer profiles have no description | Webflow does not write og:url; the two pages were never filled in; the two writers' short bios are empty |
| Title too long (12), meta description too long (25) or too short (4 + 1) | 37 titles over 60 characters, 27 descriptions over 160, 12 under 110 | Mostly the stories' own SEO fields; full list in SEO-TITLES-DESCRIPTIONS-2026-10-26.md |
| Schema.org validation error (66) | No JSON that fails to parse; one visible flaw: apostrophes in story headlines come out as &#39; inside the structured data | The 15 Oct crawl predates the A5 story template fixes; the rest should show on the next crawl |
| Noindex page (9) | 8 pages, all sign-in and account pages | On purpose. No change |
| Changed pages not submitted to IndexNow (67) | n/a | Webflow has no IndexNow setting. No change |

## Changes (numbered for your reply)
| # | Change |
|---|---|
| S1 | Story template: remove the author box count element (st3-cc-count) so no count is in the HTML. This finishes E2.3 as approved ("Bios carry no counts"). |
| S2 | Fix the three broken links: /creators tabs to /for-expats and /for-press, the profile pet chip's fallback to /the-paw-passport (the script still sends it to the pet's own page). |
| S3 | Story template byline and "See their work": your one click each in the Designer to link them to the writer's page (the Data API cannot do it). Until then I change their fallback from /contributors to /travelers, so crawlers see no redirect. The same click on the From line's country and pursuit links makes the country and pillar pages crawlable. |
| S4 | /countries: a 301 to /destinations in Site settings, Publishing, 301 redirects (your click), and the page left out of the sitemap. |
| S5 | One H1 per page: the profile template's leftover "Heading" removed, and the /submit sign-in gate heading made an H2. |
| S6 | Titles and descriptions: the words are yours or the writers'. Pick one: (a) you shorten them from the list, or (b) I draft shorter versions of the static pages only (Awards, Gallery, For brands, Cookies, Creators, the two country pages) for your line-by-line approval and leave the stories to you. |
| S7 | Social tags: og:url on every page (the page's own address, from the page head code on the templates and each static page); title, description and image for /cookies and /creators (drafted for your approval with S6); the two writer profiles' descriptions fall back to their one-line when the short bio is empty. |
| S8 | Pages nothing links to: link the four Paw Passport entries from /the-paw-passport, the two layover guides and two Marathon Diaries from their pillar pages, and set /contributors/anonymous to noindex and out of the sitemap. /awards and /spotlight: tell me whether they are live pages (then they go in the footer) or not ready (then they leave the sitemap). |
| S9 | Story structured data: write the headline without the &#39; escape. |

## Test report with this log
A fresh crawl of all pages after the build: no 4XX targets, no internal link to a redirect, no sitemap page without an HTML link (or a reason in this log), one H1 per page, og:url on every indexable page, the author box count gone from all 53 stories. Then you run New crawl in Ahrefs and we compare the 28.

Reply with the item numbers to approve or change.
