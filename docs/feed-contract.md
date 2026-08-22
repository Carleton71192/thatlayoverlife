# Feed contract

## The JSON the site expects from `GET /wire`

```json
{
  "updatedAt": "2026-08-22T14:30:00Z",
  "items": [
    {
      "id": "f3a91c…",
      "title": "Doha extends free transit visas to 96 hours",
      "link": "https://apnews.com/…",
      "source": "AP",
      "publishedAt": "2026-08-22T09:12:00Z",
      "summary": "Qatar doubles the stopover window for 95 nationalities…",
      "region": "MIDDLE EAST",
      "country": "QA"
    }
  ]
}
```

## Query params
- `region` — one of EUROPE, ASIA, AMERICAS, AFRICA, MIDDLE EAST, OCEANIA (omit = all, incl. GLOBAL)
- `country` — ISO 3166-1 alpha-2
- `limit` — default 30, max 100

## Feeds (verify at build time)
| Source | Feed | Notes |
|---|---|---|
| Reuters | reutersagency.com travel/lifestyle feed | verify current URL |
| AP | apnews.com travel hub RSS | verify availability |
| BBC Travel | feeds.bbci.co.uk | filter travel-relevant |
| Skift | skift.com/feed | trade press |
| The Points Guy | thepointsguy.com/feed | loyalty/aviation |
| Lonely Planet | lonelyplanet.com/news/feed | verify |
| Simple Flying | simpleflying.com/feed | aviation |

## Rules
- Headlines + links + feed snippets only. No bodies, no images.
- Source named verbatim on every item.
- Drop any feed whose terms disallow aggregation; report which.
- Region mapping: static country→region table (UN M49 style, 6 travel regions + GLOBAL fallback).
