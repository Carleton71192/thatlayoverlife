# Change log for approval: Designer link bindings (26 October 2026)

Follows S124 (the SEO audit build, live 26 October 2026). The live crawl after that build still finds 14 sitemap pages with no link in the HTML:
- the writer pages /contributors/barzy-adam and /contributors/chesney-lish
- six country pages: Antarctica, Bulgaria, Denmark, Ghana, Kosovo, Montenegro
- /pillars/paw-passport and /pillars/stories-from-the-road
- the two layover guides
- the two Marathon Diaries

They have the same cause. The collection cards and the reference links were built through the Data API. When they publish, Webflow writes `href="#"` (or a fallback such as `/travelers`), and the page scripts put the real address in afterwards, in the browser. Crawlers read the HTML, so they never see the link.

The Data API cannot point a link at "the current item". On 26 October I tried setting a target page on the pillar cards. Webflow wrote `href="detail_stories"`, a broken link, so I reverted it before the live publish. The fix is a link setting in the Designer, one element at a time. Nothing in this log changes any words on the site.

## Corrections first
1. **The S3 promise for the From line's country link was wrong.** The S3 log said one Designer click on the story From line's country link would make the country pages crawlable. It would not:
   - That link reads the story's **Country** field, and Country points at the Destinations collection, not the Countries hubs.
   - Every Destinations item page (for example /destinations/bulgaria) answers with a 301 to /countries/bulgaria.
   - Binding it would put a link to a redirect on every story. That is the issue S124 just cleared (54 pages down to 0).
   - So this log leaves that link alone (L8) and links the country hubs from the /destinations atlas instead (L2).
2. **The Countries template lists can't be filtered to the current country.** The Layovers, Marathons and Paw Passport collections also point their Country field at Destinations. So no list on the Countries template can be filtered to "this country". That is why D1 below needs your choice.

## How each change is made (Designer)
- **A card inside a collection list:**
  1. Select the card in the Navigator.
  2. Open Element settings (the gear).
  3. In Link settings, pick the Collection page option, then choose the current item (for example "Current Contributor").
- **A link on a template page that should go to a referenced item:**
  1. Select the link.
  2. In Link settings, pick the Collection page option.
  3. Choose the reference field (for example "Contributor").

The element ids below are the ones the Data API shows, so I can check each one after your click. You can also find each element in the Navigator by its class.

The page scripts that fill these links in today write the same address the binding will. I read each one:
- the story page script
- the From line script in the footer
- tll-pillar-shelf-v2
- the /travelers roster script
- tll-ds3-destinations-js-v1
- tll-country-filed-v2

So they keep working as they are, and nothing in code changes.

## Changes (numbered for your reply)
| # | Page and element | Set the link to | What it fixes |
|---|---|---|---|
| L1 | /travelers, the traveler card in the roster list (class tv-card, data-tll-trav-card="traveler", element 75833cff-c508-0418-500a-0e538e2e2ee2) | Collection page, Current Contributor | Every writer page gets a link in the HTML from /travelers, including the two orphans. Today it renders `href="#"` live (with the /travelers fallback I set under S124). |
| L1b | /travelers, the pet card in the same section (data-tll-trav-card="pet", b9f5b5b8-309b-8f7b-1db9-e3a62098d255) | Collection page, Current Pet | Optional. Pet pages get an HTML link from /travelers (today the fallback is /pets). |
| L2 | /destinations, the two atlas tiles (data-ds3="tile"; element 02ac7fa8-bfa6-ff88-195c-71dac771ad1d in the "Atlas part 1" list and d363da1c-9c97-91b4-bbed-037bddd021ef in "Atlas part 2") | Collection page, Current Country | All 250 atlas tiles render `href="#"` today. After this, every country hub, including the six orphans, has an HTML link from /destinations, which is in the main menu. |
| L2b | /destinations, the story card on the shelf (data-ds3="card", 37e35a86-a5b1-0ba2-1c7f-3cfd758054f6) | Collection page, Current Story | The stories on /destinations get real links (they are reachable from /stories already, so this is for the shelf's own users and crawl depth). |
| L3 | Stories template, the From line's pursuit link (class st3-from-link, data-st3-from-part="pursuit", 3ae0f7fc-2769-3ce9-21ea-b9ac5d271ef7) | Collection page, reference field Pillar | Every story links its pillar page in the HTML. That covers /pillars/paw-passport and /pillars/stories-from-the-road, plus the three pillar pages not in the sitemap. Today the fallback is /stories. |
| L4 | Stories template, the byline (class st3-author-link, 09c29e7a-5347-fea2-dfdb-d58efca59b21) and "See their work" (class st3-cc-link, 2f1123db-374a-e33d-79e7-a0e27bf36466) | Collection page, reference field Contributor | Every story links its writer's page in the HTML, in place of the /travelers fallback from S124. |
| L5 | Stories template, the traveled-with chips: the person chip (class st3-tw-chip, 500ce191-ba0c-bee4-8787-ad8ce4db96e8) and the pet chip (80e7ad49-91b9-e53b-babb-31b6d0eaf3b9), each inside its own nested list | Collection page, Current Contributor and Current Pet | Co-travelers and pets get HTML links from the stories they appear in. |
| L6 | Pillars template, the three cards (class tllpr-card): the story card 86505254-e538-c893-336f-41547bb83ca4, the layover card d0f0b8cd-2d5a-ce2e-e2fc-513905a3c2db, the Paw Passport card 9e1276e4-09e1-d3a1-e6a7-80f46c5bb3ca | Collection page, Current Story, Current Layover, Current Magnus Diary Entry | The two layover guides get an HTML link from /pillars/layover-guides, and the Paw Passport entries from /pillars/paw-passport. Side effect: the lists are not filtered. Every pillar page carries all of them, and CSS hides the ones the script does not show, so the other four pillar pages would carry hidden links to the two layover guides and four entries. |
| L7 | Pillars template, the stories list (#tllpr-stories, ec5d22cd-3459-7618-d885-98c1080394cf) | Add the filter "Pillar is Current Pillar" | Each pillar page then holds only its own stories in the HTML, instead of all of them hidden behind the script. Before the filter goes on, three live stories need their Pillar set, or they drop off the pillar page: even-brave-boys-get-scared, horseshoe-bend-arizona, spain-madrid-wedding-ibiza. Their From line pursuit link is empty for the same reason. |
| L8 | Stories template, the From line's country link (15348ece-1faa-9b28-9433-b34d1f063e7e) | No change | See the correction above. Binding it would link every story to a redirect. The country hubs are covered by L2. |

## One decision for you
**D1. The two Marathon Diaries.** No pillar page lists them. The only list that holds them is "races" on the Countries template (#tllcf-races, card ab3a82da-de7b-dd30-3a39-ea17907d204f), and it can't be filtered to one country (see correction 2). Pick one:
- **(a)** Bind the three Countries template cards to the current item: layover, race and Paw Passport (class tllcf-card: 63506e42-95da-9f95-558d-448b4ae3ca4c, ab3a82da-de7b-dd30-3a39-ea17907d204f, d10ca4d5-948f-9d88-9ecd-c9b83765d4f6). No new words.
  - Every country page, about 200 of them, then carries links to all the diaries, layover guides and entries, hidden by CSS except where the script matches.
  - Crawlers would reach both diaries.
  - It does not fix the Kosovo list, which already shows three unrelated items.
- **(b)** You link the two diaries from your own story "Marathons on all 7 continents", in your words. It is the natural reading path and a visible link in context, which counts for more than a hidden one.
- **(c)** A small list of the two diaries on a page you name, built like the Paw Passport block. The titles are the diaries' own; the one label line above them comes to you for approval before it goes in.

I recommend (b). (a) is the choice if you want no writing at all.

## After your clicks (my part)
1. I take the Webflow lock (WEBFLOW-LOCK.md).
2. I read back every element above through the Data API, to confirm the link mode and that no other setting moved.
3. I publish to the Webflow subdomain only and crawl it. Expected result: every sitemap page has an HTML link (apart from the D1 pages if you pick (b) and have not edited yet), still no 4XX, no internal link to a redirect, one H1 per page.
4. With a clean crawl, I publish to both custom domains and the subdomain, crawl www again, release the lock and log it as S125.

Then you run New crawl in Ahrefs, and we compare with the 28 issues of 15 October.

Reply with the item numbers to approve or change, and a, b or c for D1.
