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
    id: 'guardian-travel',
    source: 'THE GUARDIAN',
    url: 'https://www.theguardian.com/uk/travel/rss',
    enabled: true,
    notes: 'Travel desk of a national paper. Strong destination reporting.',
  },
  {
    id: 'atlas-obscura',
    source: 'ATLAS OBSCURA',
    url: 'https://www.atlasobscura.com/feeds/latest',
    enabled: true,
    notes: 'Place-led features. Almost every item names somewhere.',
  },
  {
    id: 'cn-traveler',
    source: 'CONDE NAST TRAVELER',
    url: 'https://www.cntraveler.com/feed/rss',
    enabled: true,
    notes: 'Consumer travel magazine.',
  },
  {
    id: 'afar',
    source: 'AFAR',
    url: 'https://www.afar.com/rss',
    enabled: true,
    notes: 'Consumer travel magazine. URL unconfirmed, verify-feeds will settle it.',
  },
  {
    id: 'nomadic-matt',
    source: 'NOMADIC MATT',
    url: 'https://www.nomadicmatt.com/feed/',
    enabled: true,
    notes: 'Independent blog. Budget and long-term travel.',
  },
  {
    id: 'adventurous-kate',
    source: 'ADVENTUROUS KATE',
    url: 'https://www.adventurouskate.com/feed/',
    enabled: true,
    notes: 'Independent blog. Destination guides, solo travel.',
  },
  {
    id: 'never-ending-footsteps',
    source: 'NEVER ENDING FOOTSTEPS',
    url: 'https://www.neverendingfootsteps.com/feed/',
    enabled: true,
    notes: 'Independent blog. Long-form destination writing.',
  },

  // Added September 2026. None of these were checked against the live web
  // from the build environment. `npm run verify-feeds -- --apply` switches off
  // any that fail. Keep the enabled total at or under MAX_ACTIVE_FEEDS.

  // Newspaper and broadcaster travel desks.
  {
    id: 'nyt-travel',
    source: 'THE NEW YORK TIMES',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml',
    enabled: true,
    notes: 'Travel desk of a national paper.',
  },
  {
    id: 'independent-travel',
    source: 'THE INDEPENDENT',
    url: 'https://www.independent.co.uk/travel/rss',
    enabled: true,
    notes: 'Travel desk of a national paper. Strong on airline and rail news.',
  },
  {
    id: 'telegraph-travel',
    source: 'THE TELEGRAPH',
    url: 'https://www.telegraph.co.uk/travel/rss.xml',
    enabled: true,
    notes: 'Travel desk of a national paper.',
  },
  {
    id: 'cnn-travel',
    source: 'CNN',
    url: 'http://rss.cnn.com/rss/edition_travel.rss',
    enabled: true,
    notes: 'Legacy CNN travel feed. May have gone stale, verify-feeds will settle it.',
  },
  {
    id: 'euronews-travel',
    source: 'EURONEWS',
    url: 'https://www.euronews.com/rss?level=vertical&name=travel',
    enabled: true,
    notes: 'European travel desk. Good for strikes, rules and rail.',
  },
  {
    id: 'al-jazeera',
    source: 'AL JAZEERA',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    enabled: true,
    travelOnly: true,
    notes: 'General world feed, filtered to travel-relevant items. Covers Gulf hubs.',
  },
  {
    id: 'smithsonian-travel',
    source: 'SMITHSONIAN',
    url: 'https://www.smithsonianmag.com/rss/travel/',
    enabled: true,
    notes: 'Place-led features.',
  },

  // Travel magazines and trade press.
  {
    id: 'travel-leisure',
    source: 'TRAVEL + LEISURE',
    url: 'https://www.travelandleisure.com/syndication/feed',
    enabled: true,
    notes: 'Consumer travel magazine. URL unconfirmed.',
  },
  {
    id: 'matador',
    source: 'MATADOR NETWORK',
    url: 'https://matadornetwork.com/feed/',
    enabled: true,
    notes: 'Destination features.',
  },
  {
    id: 'travel-off-path',
    source: 'TRAVEL OFF PATH',
    url: 'https://www.traveloffpath.com/feed/',
    enabled: true,
    notes: 'Entry rules, visas and destination news.',
  },
  {
    id: 'travelpulse',
    source: 'TRAVELPULSE',
    url: 'https://www.travelpulse.com/rss/news',
    enabled: true,
    notes: 'Trade press. URL unconfirmed.',
  },
  {
    id: 'business-traveller',
    source: 'BUSINESS TRAVELLER',
    url: 'https://www.businesstraveller.com/feed/',
    enabled: true,
    notes: 'Airline, lounge and hub news.',
  },
  {
    id: 'executive-traveller',
    source: 'EXECUTIVE TRAVELLER',
    url: 'https://www.executivetraveller.com/rss',
    enabled: true,
    notes: 'Airline, lounge and hub news, Asia-Pacific lean. URL unconfirmed.',
  },
  {
    id: 'schengen-news',
    source: 'SCHENGEN NEWS',
    url: 'https://schengen.news/feed/',
    enabled: true,
    notes: 'Visa and border rules. Directly useful for transit planning.',
  },
  {
    id: 'travel-noire',
    source: 'TRAVEL NOIRE',
    url: 'https://travelnoire.com/feed',
    enabled: true,
    notes: 'Destination and culture features.',
  },

  // Aviation and loyalty.
  {
    id: 'one-mile-at-a-time',
    source: 'ONE MILE AT A TIME',
    url: 'https://onemileatatime.com/feed/',
    enabled: true,
    notes: 'Airline and hotel loyalty news.',
  },
  {
    id: 'view-from-the-wing',
    source: 'VIEW FROM THE WING',
    url: 'https://viewfromthewing.com/feed/',
    enabled: true,
    notes: 'Airline industry and loyalty.',
  },
  {
    id: 'paddle-your-own-kanoo',
    source: 'PADDLE YOUR OWN KANOO',
    url: 'https://www.paddleyourownkanoo.com/feed/',
    enabled: true,
    notes: 'Airline and cabin crew news.',
  },
  {
    id: 'head-for-points',
    source: 'HEAD FOR POINTS',
    url: 'https://www.headforpoints.com/feed/',
    enabled: true,
    notes: 'UK loyalty and airline news. Heathrow-heavy.',
  },
  {
    id: 'loyalty-lobby',
    source: 'LOYALTYLOBBY',
    url: 'https://loyaltylobby.com/feed/',
    enabled: true,
    notes: 'Loyalty and airline news, international lean.',
  },
  {
    id: 'live-and-lets-fly',
    source: "LIVE AND LET'S FLY",
    url: 'https://liveandletsfly.com/feed/',
    enabled: true,
    notes: 'Airline reviews and news.',
  },
  {
    id: 'airline-geeks',
    source: 'AIRLINEGEEKS',
    url: 'https://airlinegeeks.com/feed/',
    enabled: true,
    notes: 'Aviation news.',
  },
  {
    id: 'airways-mag',
    source: 'AIRWAYS',
    url: 'https://airwaysmag.com/feed',
    enabled: true,
    notes: 'Aviation news, route launches.',
  },
  {
    id: 'aerotime',
    source: 'AEROTIME',
    url: 'https://www.aerotime.aero/feed',
    enabled: true,
    notes: 'Aviation news. URL unconfirmed.',
  },

  // Independent destination blogs.
  {
    id: 'rick-steves',
    source: 'RICK STEVES',
    url: 'https://blog.ricksteves.com/feed/',
    enabled: true,
    notes: 'Europe-focused blog.',
  },
  {
    id: 'expert-vagabond',
    source: 'EXPERT VAGABOND',
    url: 'https://expertvagabond.com/feed/',
    enabled: true,
    notes: 'Independent blog. Destination guides.',
  },
  {
    id: 'uncornered-market',
    source: 'UNCORNERED MARKET',
    url: 'https://uncorneredmarket.com/feed/',
    enabled: true,
    notes: 'Independent blog. Culture and food.',
  },
  {
    id: 'legal-nomads',
    source: 'LEGAL NOMADS',
    url: 'https://www.legalnomads.com/feed/',
    enabled: true,
    notes: 'Independent blog. Food and long-term travel.',
  },
  {
    id: 'hand-luggage-only',
    source: 'HAND LUGGAGE ONLY',
    url: 'https://handluggageonly.co.uk/feed/',
    enabled: true,
    notes: 'Independent blog. Short trips and city breaks.',
  },
  {
    id: 'goats-on-the-road',
    source: 'GOATS ON THE ROAD',
    url: 'https://www.goatsontheroad.com/feed/',
    enabled: true,
    notes: 'Independent blog. Destination guides.',
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

// Cloudflare's free plan allows 50 outbound fetches per run. Each enabled feed
// is one, and the margin covers retries and anything added later.
export const MAX_ACTIVE_FEEDS = 45;

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
