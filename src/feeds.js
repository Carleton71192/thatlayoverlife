// The feed roster.
//
// `enabled: false` means the URL could not be confirmed as a working, publicly
// offered feed. Run `npm run verify-feeds` to check every entry, then flip the
// ones that come back OK. Disabled entries are skipped entirely at run time.

export const FEEDS = [
  {
    id: 'skift',
    source: 'SKIFT',
    url: 'https://skift.com/feed/',
    enabled: true,
    notes: 'Trade press. Publicly offered WordPress feed.',
  },
  {
    id: 'points-guy',
    source: 'THE POINTS GUY',
    url: 'https://thepointsguy.com/feed/',
    enabled: true,
    notes: 'Loyalty and aviation. Publicly offered WordPress feed.',
  },
  {
    id: 'simple-flying',
    source: 'SIMPLE FLYING',
    url: 'https://simpleflying.com/feed/',
    enabled: true,
    notes: 'Aviation. Publicly offered WordPress feed.',
  },
  {
    id: 'bbc-world',
    source: 'BBC',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    enabled: true,
    // BBC retired its standalone Travel feed, so this is the world feed with a
    // travel-relevance filter applied. See travelFilter below.
    travelOnly: true,
    notes: 'General world feed, filtered to travel-relevant items.',
  },
  {
    id: 'lonely-planet',
    source: 'LONELY PLANET',
    url: 'https://www.lonelyplanet.com/news/feed',
    enabled: false,
    notes: 'URL unverified. Run npm run verify-feeds before enabling.',
  },
  {
    id: 'reuters',
    source: 'REUTERS',
    url: 'https://www.reutersagency.com/feed/?best-topics=lifestyle',
    enabled: false,
    notes: 'Reuters retired its public agency feeds. Verify a current URL, or drop.',
  },
  {
    id: 'ap',
    source: 'AP',
    url: 'https://apnews.com/hub/travel',
    enabled: false,
    notes: 'That URL is an HTML hub, not RSS. AP has no public travel RSS. Verify or drop.',
  },
];

export function activeFeeds(feeds = FEEDS) {
  return feeds.filter((feed) => feed.enabled);
}

// Keywords used to pull travel-relevant items out of a general news feed.
const TRAVEL_WORDS = [
  'airline', 'airlines', 'airport', 'airports', 'flight', 'flights', 'flying',
  'aviation', 'travel', 'traveler', 'travellers', 'travelers', 'tourism',
  'tourist', 'tourists', 'holiday', 'holidays', 'vacation', 'hotel', 'hotels',
  'resort', 'cruise', 'cruises', 'passport', 'visa', 'visas', 'border',
  'railway', 'rail', 'train', 'trains', 'eurostar', 'ferry', 'baggage',
  'boarding', 'layover', 'stopover', 'itinerary', 'destination', 'backpacker',
  'hostel', 'airfare', 'jet', 'runway', 'terminal', 'customs', 'immigration',
];

const TRAVEL_PATTERN = new RegExp(`\\b(${TRAVEL_WORDS.join('|')})\\b`, 'i');

/** True when a general-news item reads as travel news. */
export function isTravelRelevant(item) {
  return TRAVEL_PATTERN.test(`${item?.title || ''} ${item?.summary || ''}`);
}
