# Webflow bandwidth: what happened and what to do

13 November 2026. Site: That Layover Life (www.thatlayover.life). Nothing on the site or in Webflow was changed to write this.

**Short version.** Our own automated testing caused most of this. It is not visitors and it is not outside bots. The site is already over the 50 GB limit for this billing period. That alone costs nothing. A charge would only come if the next period goes over too. If testing stays capped, the next period should come in far below 50 GB (estimate). You do not need to buy anything.

How we know: three separate checks (page weight, our own test runs, bots and crawlers), each reviewed a second time. The total comes from your usage dashboard screenshot as recorded in handoff/WEBFLOW-LOCK.md on 13 November: 72.75 GB used in the period that started about 20 October. Of that, 56.64 GB was assets (images, CSS, scripts), and the peak day was 12 November at 34.56 GB. The other figures below are our own measurements and estimates, and each estimate is marked.

## 1. What is using the bandwidth

| Source | This period (estimate) | Confidence |
|---|---|---|
| Our own automated testing (browser checks, layout-shift and font runs, site crawls) | 45 to 65 GB | Medium |
| People visiting the site | 5 to 10 GB | Low |
| Search engines (Google, Bing) | 0.3 to 1.5 GB | Low |
| AI crawlers (GPTBot, ClaudeBot, Meta, Amazon, Perplexity and others) | 0.2 to 2 GB | Low |
| SEO tools (Ahrefs, Semrush and others), including any Ahrefs Site Audit | 0.1 to 1.5 GB | Low |
| **Total on your dashboard** | **72.75 GB** | Medium (from the screenshot as logged) |

How we got these:
- **Testing.** On 12 November alone the dashboard shows 34.56 GB. A normal day before 5 November averaged about 0.43 GB (worked out from the dashboard figures; estimate). Our run files show about 4,170 recorded test page loads on 12 November. Our test scripts turn off the browser cache, so each load downloaded every image again: about 3 MB per phone load and 8.6 to 8.9 MB when a test loaded, scrolled and reloaded (measured). Counting runs from the scripts gives 20 to 38 GB. That count is a floor, because it misses loops. Working back from the dashboard gives about 60 GB above a normal pace. So 45 to 65 GB.
- **People.** We have no visitor analytics. Webflow Analyze, Ahrefs analytics and GA4 were all unavailable. The figure is the quiet late-October pace, about 0.43 GB a day, shared with all outside bots. One full visit costs about 1.8 MB on desktop and 2.6 MB on phones if the visitor scrolls to the bottom. Without scrolling it is 0.7 MB for a story and 2.4 to 2.9 MB for the home page (measured).
- **Bots.** A bot that reads only page text costs about 70 to 90 KB a page. Reading every one of the 136 pages in the sitemap costs about 10 MB (measured). Bots cannot be the main cause on a site this size. Bytespider is already blocked by Webflow (it gets a 403).

One open point: we cannot fully account for 5 to 11 November, about 31 GB (estimate). Most of it lines up with our test days. The download from your usage page (section 3, step A) will show which pages and files were heavy those days.

## 2. Will it go over this month

**The billing period follows your plan's cycle, not the calendar month.** Per your dashboard, this period started about 20 October, so it ends about 19 November.

**This period is already over.** It stands at 72.75 GB of 50 GB, which is 145%. The "50%" email on 13 November does not match the dashboard. It most likely went out late or was triggered earlier. Your dashboard is the number to trust.

**Projection for the rest of this period (estimate):** about 75 to 80 GB at the close. That assumes testing stays capped as in section 4 and normal traffic of 0.4 to 1 GB a day for the last 6 days.

**Projection for the next period (about 20 November to 19 December, estimate):** 10 to 20 GB, most likely around 13 GB. That is well under 50 GB.

Assumptions:
- Our testing stays inside a budget of about 5 GB a month (section 4).
- Traffic stays near the late-October pace. A story going viral would change this. Even 10 times the normal pace would come to about 40 GB at current page weights (estimate).
- Webflow counts image bytes. The 56.64 GB of assets on your dashboard says it does.
- Still unconfirmed: whether traffic to the test site (that-layover-life.webflow.io) counts. We treat it as counted, because its pages load the same image files.

## 3. Fixes that cost nothing, ranked by GB saved

Savings are per month at today's traffic and are estimates. Apart from fix 1, they are small, because people only account for 5 to 10 GB a month. They still make the site faster.

"I can do this" means I stage it, show it to you, and it goes live only when you say so. A Webflow publish sends out everything that is staged, including the 44 font-fix edits staged on 13 November. So we time any publish with a release you have approved.

**Step A, before anything else. Only you can do this in Webflow (5 minutes, read only).**
1. Open the Webflow dashboard and click the That Layover Life site.
2. Open **Site settings**, then the **Usage** tab (it may be labeled Site usage).
3. Write down the bandwidth used so far and the start date of the current period.
4. Download the CSV of pages and assets by bandwidth, then send it to me.

The CSV tells us exactly which files used the bytes. It does not separate bots from people.

| # | Fix | GB saved a month (estimate) | Who |
|---|---|---|---|
| 1 | Cap our own live testing (section 4) | 30 to 60 | I can do this. Already in effect since 13 Nov, 07:50 UTC |
| 2 | Phones get images at 2x instead of 3x on story cards and the home cover. Change the size rules in the site layers so phones load the 800 px files instead of the 1080 px ones. Your profile page on a phone would drop from about 10 MB to about 4.5 to 6 MB. Cards look very slightly softer on 3x phones | 0.5 to 1.5 | I can do this |
| 3 | Home page: stop the old Curacao photo from downloading. The cover script replaces it, so nobody sees it. Set it to lazy loading and keep it as the fallback for visitors without scripts. Hide the zero-size rail images on phones until they are shown, after confirming they never appear. Saves 150 to 780 KB per home view | 0.3 to 0.8 | I can do this |
| 4 | Footer counts read the existing site-stats CMS item instead of downloading /stories, /sitemap.xml and the pet page. Saves about 126 KB per new visitor. The counts and the story rail stay as they are | 0.1 to 0.3 | I can do this |
| 5 | Profile pages: hide other people's story cards before the page paints, so their photos never download. Saves 0.8 to 2.1 MB per profile view. The matching for pen names and co-credits stays as it is | 0.1 to 0.3 | I can do this |
| 6 | Re-upload 4 oversized CMS photos at web size: 1,200 to 1,600 px wide, quality 80. They are the two traveler photos on /travelers (927 KB and 719 KB), the Torrevieja photo (666 KB) and the Spain story hero (370 KB). Story heroes stay at least 1,200 px wide for Google Discover | 0.1 to 0.5 | **Only you can do this in Webflow** (steps below) |
| 7 | Paw Passport hero: use the 1080 px copy on phones and the 1600 px copy on desktop instead of the 1.18 MB original. Saves about 0.7 to 1 MB per view of that page | 0.05 to 0.2 | I can do this |
| 8 | robots.txt: ask bots to skip private pages (/account, /edit-profile, /login, /my-pets, /profile, search results) and block SEO-tool bots that send you no visitors (SemrushBot, MJ12bot, DotBot, BLEXBot, DataForSeoBot, Barkrowler, serpstatbot). Google, Bing, Apple and the AI search bots stay allowed | under 1 | **Only you can do this in Webflow** (steps below) |
| 9 | Ahrefs Site Audit, if you have a project: set it to run monthly, with JavaScript rendering and image checks off | 0 to 1 | Only you can do this, in Ahrefs |

**Steps for fix 6 (Webflow CMS):**
1. In the Designer, open **CMS** in the left panel.
2. Open the collection that holds the photo: Stories for the Spain hero and the Torrevieja photo, or the travelers collection for the two /travelers photos.
3. Open the item, click the image field, choose **Replace**, and upload the smaller file. I can prepare the four resized files for you.
4. Click **Save**. It goes live at the next publish.

**Steps for fix 8 (robots.txt):**
1. Open **Site settings**, then **SEO**, then scroll to **Indexing** and find the robots.txt box.
2. Paste the short version I give you. It is the low-risk part of the draft in nov13/bandwidth/bots/robots_proposed.txt, without the AI-training lines.
3. Click **Save**. It takes effect at the next publish, so time it with an approved release.

Not recommended now:
- Converting images to WebP. Site scripts hard-code .jpg file names, so this could break images.
- Making this week's home cover lazy. It would slow the first paint and hurt search.
- Asking Webflow to block bots broadly. Bots are not the cause, and broad blocking could cut off Google, AI citations and Ahrefs.
- Publishing less often. It saves only about 3 MB a time.

## 4. What we change in our own testing starting today

These rules are logged as a standing rule for every session in handoff/WEBFLOW-LOCK.md (13 November, 07:50 UTC).

1. **No Webflow images, video or fonts in test runs.** Every browser test against www or the webflow.io test site blocks them, unless the test is about images.
2. **Layout-shift and loading-speed tests use local copies.** These tests need real images, so we download each image once and serve it from a local copy. We never block them, because missing images would change the results.
3. **HTML, CSS and scripts once per publish.** We fetch each page and file once after each publish (or once a day) and serve every later test load from that saved copy. No live loads inside loops.
4. **A byte budget.** Each run counts its Webflow bytes and stops itself at 200 MB. All agents together stay under about 250 MB a day and 5 GB a month (10% of the plan).
5. **No browser crawls of the whole site.** We compare pages with plain compressed downloads, once per site per day. A full browser crawl runs only before a publish, with images blocked.
6. **A shared log.** Every run adds a line to a shared file (date, task, page loads, Webflow MB), so our total can be checked against your Usage page.
7. **The font release is re-checked offline** from saved copies, plus at most one live check per page with images blocked.

Bot rules in robots.txt would not have stopped any of this. Our test browsers do not read that file.

## 5. What it costs if it does go over

From Webflow's help pages. I read these through search summaries only, because help.webflow.com is blocked from this session, so please check them yourself:
- [Surge protection for overages](https://help.webflow.com/hc/en-us/articles/42067001590163)
- [Why was I charged when my site exceeded its bandwidth limit?](https://help.webflow.com/hc/en-us/articles/38084158877075-Why-was-I-charged-when-my-site-exceeded-its-bandwidth-limit)
- [Updated pricing and simplified plans for May 2026](https://help.webflow.com/hc/en-us/articles/51059955082387)

What those pages say:
- **First period over:** no overage charge. This is the current period.
- **Second period over in a row:** Webflow adds bandwidth add-ons to the Premium plan automatically at the end of that period. They are sized by the lower of the two periods.
- **Price:** add-ons start at +50 GB. Webflow's own example prices +100 GB at $40 a month, which works out to about $20 a month per 50 GB when billed yearly. Third-party sites list about $30 a month when billed monthly. One Webflow example does not fit that rate, so please confirm the price on the pricing page.
- **Example (estimate):** if the next period also went over, say to 55 GB, the lower of the two periods would be 55 GB. That means one +50 GB add-on, about $20 to $30 a month, until usage drops again.

**Decisions for you:**
1. **Buying bandwidth: no.** Do not buy an add-on in advance. If testing stays capped, the next period should come in well under 50 GB (estimate).
2. **Step A:** please send me the Usage CSV and the period start date. Nothing else is needed this week.
3. **Fixes 2 to 5 and 7:** do you want them staged now, to go live with the next release you approve?
4. **Optional:** do you want AI training crawlers (GPTBot, ClaudeBot, CCBot, Meta) blocked in robots.txt? It saves well under 1 GB a month. In exchange, future AI models would know less about the brand. My suggestion is to leave them allowed.
