# Build brief: TLL Travel Wire aggregation service

You are building a small RSS aggregation service for That Layover Life (thatlayover.life), a travel magazine on Webflow. The site's front end already exists; you are building the data service only.

## Requirements

**Platform:** Cloudflare Workers + Workers KV + Cron Triggers (free tier). Use Wrangler. If I don't have a Cloudflare account, walk me through creating one (free) before deploying.

**Scheduled job (every 30 min):**
1. Fetch these RSS/Atom feeds (fail soft per feed — one bad feed must not kill the run):
   - Reuters Lifestyle/Travel: https://www.reutersagency.com/feed/?best-topics=lifestyle (verify; substitute the current Reuters travel feed if moved)
   - AP Travel: https://apnews.com/hub/travel (use its RSS if available)
   - BBC Travel: https://feeds.bbci.co.uk/news/world/rss.xml (filter travel-relevant) or the dedicated BBC Travel feed if available
   - Skift: https://skift.com/feed/
   - The Points Guy: https://thepointsguy.com/feed/
   - Lonely Planet news: https://www.lonelyplanet.com/news/feed (verify)
   - Simple Flying: https://simpleflying.com/feed/
   Verify each URL at build time; comment out any that are dead or disallow aggregation, and tell me which.
2. Normalize each item to:
   ```json
   {
     "id": "sha1 of link",
     "title": "...",
     "link": "...",
     "source": "SKIFT",
     "publishedAt": "ISO 8601",
     "summary": "feed's own snippet, plain text, max 280 chars",
     "region": "EUROPE|ASIA|AMERICAS|AFRICA|MIDDLE EAST|OCEANIA|GLOBAL",
     "country": "ISO 3166-1 alpha-2 or null"
   }
   ```
3. Region/country tagging: keyword matching on title+summary against a country/city gazetteer (build a compact one: country names, ISO codes, top ~200 travel cities, common demonyms). Map country → region with a static table. Untaggable items get region GLOBAL, country null.
4. Deduplicate by id; keep the newest 100 items; store as one JSON blob in KV.

**Public endpoint:** `GET /wire` returns `{updatedAt, items: [...]}` with CORS `Access-Control-Allow-Origin: *`. Query params: `region` (filter), `country` (ISO alpha-2 filter), `limit` (default 30). Cache at the edge for 5 minutes.

**Hard rules:**
- Titles, links, and feed-provided snippets ONLY. Never fetch or store article bodies or images.
- Every item keeps its source name verbatim.
- No API keys or paid services.

**Quality bar:** include a couple of unit tests for the normalizer and the tagger, a README with the deploy command, and log a one-line summary per cron run.

**Deploy:** guide me through `wrangler login` and `wrangler deploy` step by step, assuming I have never used a terminal for development. At the end, print the live endpoint URL clearly.
