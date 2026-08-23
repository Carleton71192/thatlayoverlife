# Getting TLL carried by the aggregators

Site work, not worker work. Nothing here touches the Travel Wire service; it lives
in the same repo so the whole distribution picture is in one place.

The Travel Wire reads other publishers' feeds. This is the same plumbing pointed
the other way: making ThatLayover.Life readable by the platforms that carry
travel writing.

## What is not possible

You cannot register with AP or Reuters. They are subscription agencies selling to
newsrooms, and being carried means a syndication contract with an outlet that has
staff reporters. Not a near-term path.

The real version of that ambition is item 7 below: being the person quoted inside
those stories rather than the outlet carried by them.

## Order of work

**1. A valid RSS feed.** Everything else reads it. Webflow publishes one per CMS
collection, normally at `/blog/rss.xml`. Confirm it exists, and confirm each item
carries a real title, an absolute link, a description, and a correct `pubDate`.
Paste the URL into any feed validator before submitting it anywhere.

**2. `NewsArticle` schema on every post.** See `newsarticle-schema.html`. Paste
into the CMS collection page template. This is what tells Google the page is
journalism rather than a landing page.

**3. Google News Publisher Center.** Free, and the largest single return.
Verify the domain in Search Console first, then create the publication using the
copy in `publisher-listings.md`.

**4. Microsoft Start Partner Hub (MSN).** Under-rated. Syndicates partner content
and sends real traffic to travel.

**5. Apple News Publisher.** Free account, submit the RSS feed, they review it.

**6. Flipboard.** The least gatekept on this list and genuinely effective for
travel. Publisher account plus a magazine per content pillar.

**7. Be the source.** Qwoted and Featured. Answer reporter queries on transit
visas, stopover programs, hub disruption, long layovers. One quote in an AP story
does more for the brand than a year of press releases, and "layover and stopover
expert" is a search a reporter actually runs.

Press release wires (EIN Presswire, PRWeb, roughly $100 to $400 a release) are
worth it for a genuine announcement or an original data study. They are not a
distribution channel for regular posts.

## On the news sitemap

Google's news sitemap format needs a `<news:news>` block per URL, and Webflow's
auto-generated sitemap cannot emit it. This is not a blocker: Google News
discovers articles by crawling, and a news sitemap has been optional for years.
Skip it rather than fighting Webflow, and revisit only if Search Console shows a
genuine discovery problem.

## Sequencing note

Items 3 through 6 all reward publishing consistently far more than they reward
the submission itself. A thin archive submitted early tends to get a no, and
reapplying is slower than applying once with a real body of work behind it.
