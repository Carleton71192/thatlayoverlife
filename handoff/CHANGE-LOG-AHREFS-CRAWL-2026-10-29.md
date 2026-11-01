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

## Approved 1 November 2026
Nancy: "Approve all" (A1 to A5).

## A1 written and on the subdomain (1 November 2026)
Written under the usability session's shared lock scope, then published to the subdomain only (task c848f5e3).
- **What changed:** the Countries template head code now ends with the country structured data, id tll-country-ld-v1. The JSON-LD page setting is cleared.
- **Check on that-layover-life.webflow.io:** all 197 country pages have one block that parses. Each has its own name, address (/countries/{slug}), country code and description, for example Afghanistan, AF.
- **Live** waits for Nancy's word, with the usability session's /creators build.

## A2 to A5: what I found (1 November 2026, from a fresh crawl of www and the Ahrefs issue lists)
- **A2 titles and descriptions:** the drafts for your approval are in handoff/SEO-TITLES-DESCRIPTIONS-2026-11-01.md: 14 titles, 24 descriptions and one fallback line.
- **A3 links that go through a redirect:**
  - 58 story pages carry href="/countries" on the From line's country link (L8, unbound on purpose). It is hidden, and the page script writes the real country. Its fallback is /countries, which is the meta refresh to /destinations. Fix: point that fallback at /destinations in the Stories template (one link setting, no words). Your 301 /countries to /destinations in Site settings clears the meta refresh itself.
  - Your story "Marathons on all 7 continents" links to https://thatlayover.life/stories/antarctica-marathon, the apex address, which redirects to www. Fix: change that one link to /stories/antarctica-marathon in the story body. The link changes, the words do not.
- **A4 speed:** the 28 slow pages are a server timing at crawl time, not page weight.
  - Ahrefs measured 1.0 to 3.0 seconds to the first byte on 66 KB pages. Today I measure 0.09 seconds median and 0.41 seconds at most, on all 113 indexable pages.
  - 18 of the 28 are noindex country pages.
  - The pattern fits Webflow's cache being cold just after a publish. Nothing on the pages to change. If the Thursday crawl keeps landing right after a publish, move the scheduled crawl to a quiet day in Ahrefs.
- **A5 structured data:**
  - "Article page missing Article schema" (4) is Ahrefs guessing that /stories, /the-paw-passport, /for-expats and /pillars/paw-passport are articles. They are collection pages, so Article would be wrong. No change.
  - "FAQ page missing FAQPage schema" (1) is /support, which is a contact page. No change.
  - **"Google rich results validation error" (8)** is the same fault as A1 on the writer pages (7) and the pet page (1). Their template JSON-LD setting sends an empty Person or Thing at /contributors/ or /pets/. The profile block in their head code then points at a person that does not exist.

## A6, proposed: the same fix as A1 on the other six templates
Today's check of every live page finds the empty structured-data block on:
- Writers (9 pages)
- Pillars (4)
- Paw Passport entries (4)
- Layover guides (2)
- Marathon Diaries (2)
- Pets (1)

Each template's JSON-LD setting holds CMS fields that Webflow leaves empty. The fix is A1's:
- Move each block into that template's head code, word for word.
- Drop a second breadcrumb where the head code already has one.
- Clear the setting.

No words change. It needs the lock, a subdomain test of every page, then your look.
