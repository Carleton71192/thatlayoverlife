# Change log for approval: what the Ahrefs crawl of 29 October 2026 found

Nancy started a new crawl on 28 October; it ran on 29 October at 12:36 UTC. The summary email "(That Layover Life) Noindex page: 202 URLs" and the All issues list in Ahrefs give these numbers.

## Fixed since 22 October
| Ahrefs | 22 Oct | 29 Oct |
|---|---|---|
| Health score | 78 | 99 |
| Errors | 27 | 4. The 4 are the orphan pages below |
| Internal URLs crawled | 121 | 317. The link bindings (S128) now let crawlers reach every country page from /destinations |
| 4XX / 404 pages | 3 | 0 |
| Page has links to redirect | 54 | 1 |
| Orphan pages | 20 | 4: the two Marathon Diaries (your D1 b links), /pillars/paw-passport and /pets |
| Open Graph tags incomplete | 100 | no longer listed |

## What the new numbers mean
- **Noindex page (202).** These are on purpose, and none of them is in the sitemap. Ahrefs sees them now because /destinations links every country:
  - 191 country pages that have no story yet. They are marked noindex, follow, so Google skips the thin pages but still follows their links.
  - 9 member pages, such as /account, /signup and /submit.
  - 2 pillar pages that have no stories yet.
- **Page has only one dofollow incoming internal link: 196 not indexable.** These are the same noindex pages, linked once from /destinations. No change needed.
- **Structured data has schema.org validation error (214).** This one is a real fault; see A1.

## Changes (numbered for your reply)
| # | Where | Change | Result |
|---|---|---|---|
| A1 | Countries template: the page's structured-data setting, and the template head code | **The fault:** every country page sends the same broken data: name "", description "", country code "", and the address /countries/ with no country in it. The data sits in the page's JSON-LD setting, and Webflow does not fill in CMS fields there. In the template head code it does: the canonical and og:url lines already come out right, for example /countries/bulgaria. **The fix:** move the same data, word for word, into the head code, and clear the setting. | Each country page names itself (Country, with its name, code, one-line verdict and address, plus the breadcrumb). The 194 country-page errors go. |
| A2 | Titles and meta descriptions | Pull Ahrefs' lists (titles too long 14; descriptions too long 23, too short 5, missing 3) and draft new lines for your approval, as in SEO-TITLES-DESCRIPTIONS-2026-10-26.md. | No wording changes without your yes on each line. |
| A3 | Redirects | Find the one page that still links to a redirect, the redirect chain and the five 3XX URLs, and point the links at the final address. | The meta refresh is /countries. It clears with your 301 /countries to /destinations in Site settings, Publishing, 301 redirects (S4). |
| A4 | Speed | Look at the 28 slow pages and the 2 slow responses for AI crawlers (page weight, image sizes, server time) and report what can be cut, before changing anything. | A short report with numbers. |
| A5 | Structured data on 5 pages | Article schema missing on 4 pages, FAQPage schema missing on 1, and 8 Google rich-results errors. Find which pages and draft the fix. | Comes back to you as part of A2's list. |

Not proposed: "Changed pages not submitted to IndexNow" (107). Webflow has no IndexNow setting, and Google does not use IndexNow.

## How A1 is checked
- **The JSON-LD stays valid:** if a verdict holds quotation marks, they must not break it. I test on the subdomain first, against every country page.
- **Published HTML:** every country page has its own name and address, and the data parses.
- **Then** your look, and live on your word.
- **Lock:** A1 is a Webflow write, so it waits for the lock, which the cloud session holds now for the page photos.

Reply with the item numbers to approve.
