# AdSense "Low value content": what the reviewer saw, and what to change before 14 November

Written 8 November 2026 from the live sitemap (105 URLs). Word counts are the visible text of each page without nav and footer, fetched without a browser, so they include card labels and run a little high. The stories are not the problem: 58 stories, the shortest about 1,000 words, most between 2,000 and 3,900. The thin pages are the hub and program pages around them.

## The pages a reviewer lands on and finds thin

| Page | Words | What it shows today | Suggested move |
| --- | --- | --- | --- |
| /travel-wire | 199 | "Updated every 30 minutes" and an empty list; the Worker that feeds it is not deployed | Deploy the Worker, or set the page to draft until it is |
| /newsletter | 63 | "The dispatch is coming" and a sign-up box | Draft until the first letter has gone out, or add the first issue as text |
| /gallery | 63 | Photo grid with a two-line intro | Caption each photo with place and one line, or draft |
| /creators | 65 | Directory with the Coming soon tiles | Draft until three real creator cards exist |
| /awards | 196 | "Proposed window 1 to 31 October" (past) | Draft until the awards run, or rewrite as a dated results or announcement page |
| /spotlight | 178 | One featured traveler slot | Draft, or fill with the feature text |
| /pillars/paw-passport | 86 | Pillar page with a short intro | Draft (the hub rule: six stories, three writers and an intro) |
| /pets | 180 | One pet on the roster | Draft until three pets, or merge into /the-paw-passport |
| /pets/magnus-waffles | 208 | The one pet page | Goes with /pets |
| /travelers | 212 | Directory landing with filter pills | Keep if the member cards render for a signed-out visitor; otherwise draft |
| /for-brands | 294 | Sales page | Keep; it is a real page |
| /the-map | 301 | The map; little text signed out | Keep, add two paragraphs of text under the map (which countries the stories cover, how the counter works) |
| /countries/* (6) | 345 to 720 | Country pages with the story list | Keep the six; do not add the other 190 before they have stories |

Everything else in the sitemap (about, contact, faq, support, legal pages, the two layover pages, the two marathon diaries, nine contributor pages, /stories, /destinations) is substantive enough.

## Why this matters for the review

Google's "Low value content" verdict is about the site as a whole: pages that are mostly template, pages that promise content that is not there ("Updated every 30 minutes", "coming soon", a past award window), and directories with empty slots. One or two such pages are tolerated; here they are about 12 of the 47 non-story URLs. The stories themselves are the strongest argument for approval, so the fastest route is to take the empty program pages out of the index until they have content, then request the review on or after 14 November 2026.

## What I can do once Nancy says which

- Set the chosen pages to draft in Webflow (they come off the site and out of the sitemap at the next publish), and add the matching 301s or leave them 404.
- Or, for pages she wants to keep: set them noindex (page setting), which keeps them reachable from the footer but out of the crawl.
- Write the two paragraphs for /the-map and the gallery captions as drafts for her words (AI never writes story text; these are site copy, and go in only after her yes).
- After the changes: one publish, a sitemap check, then she presses "Request review" in AdSense on 14 November or later.

## Not the cause

- ads.txt is live and correct; the consent tool and Consent Mode are in place; the pre-consent ad tag is gone from the home head (7 Nov).
- No page carries AI-written story text, stock photos or scraped content.
