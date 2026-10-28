# Home page image weights, 2026-10-28

Read-only audit of the 21 image URLs the home page loads (18 embeds, the hero, the cover layer). Weights come from the Webflow Data API where the asset lives on site 69d6145cf421c777840c1e25, otherwise from the full-size copies the Webflow asset preview returned into the repo (`src/pages/home/mobile-proto-2026-10-26/img`, `handoff/wayback`). Nothing was changed.

| Image | Weight | Pixels | Home section | Largest display | Recommended export |
|---|---|---|---|---|---|
| Pantanal jaguar hero | 500.6 KB | 2400x1350 | Library rail card | 760x950 (380x475 at 2x) | WebP, 960 wide, q78, about 85 KB |
| Sortsol murmuration hero | 402.4 KB | 2400x1350 | Library rail card | 760x950 | WebP, 960 wide, q78, about 80 KB |
| Chesney Lish Spain (Ibiza) hero | 368.9 KB | 1440x1920 | Library rail card and cover layer | Full width, up to 1920 | WebP, 1440 wide (source max), q75, about 170 KB |
| Barzy Adam Horseshoe Bend hero | 368.3 KB | 1536x1920 | Library rail card | 760x950 | WebP, 960 wide, q78, about 110 KB |
| Curacao hero (6a115e2be857613f33b48a9d) | 318.5 KB | 1600x1066 (declared) | Hero | Full width, up to 1920 | WebP, 1600 wide (source max), q80, about 140 KB |
| Magnus Holi side | 313.2 KB | 1082x1624 | Paw passport | Half page, up to 960 CSS px | WebP, 1082 wide (source max), q78, about 120 KB |
| Interlude Montenegro coast | API reports 0 bytes, unverified, likely over 300 KB | 2000x1333 (declared) | Interlude band | Full width, up to 1920 | WebP, 1920 wide, q75, about 180 KB |
| Interlude Denmark coast | same as above | 2000x1500 (declared) | Interlude band | Full width | WebP, 1920 wide, q75, about 190 KB |
| Interlude Antarctica ice | same as above | 2000x1500 (declared) | Interlude band | Full width | WebP, 1920 wide, q75, about 190 KB |
| Interlude Rio Brazil | same as above | 2000x1500 (declared) | Interlude band | Full width | WebP, 1920 wide, q75, about 190 KB |

Under 300 KB, for reference: Brazil riverboats 268.8 KB (2400x1350, lounge tile and library card, worth the same 960 px WebP at about 80 KB), Nancy Carleton avatar 155.8 KB (used 16 times at 40 to 72 px, a 144 px WebP would be about 8 KB), Chesney avatar 39.3 KB, Barzy avatar 13.0 KB. Doha is 315.2 KB as an original but the lounge loads the 800 px variant, which is much lighter.

Total matched: 10 images with a confirmed weight, 2,815 KB (2.7 MB). Ten more could not be weighed: the four interludes (API size 0) and six older library and lounge photos (Ghana kids, Fitz Roy, La Paz, Bulgaria, Montenegro coast, Antarctica hero) that live on the 6a0b29c6d081332e921900d8 asset path, which the API token cannot read (404), and the repo holds only their 500 px previews.

Notes:
1. Thirteen of the 21 URLs sit on the 6a0b29c6d081332e921900d8 path; the Webflow API returns "site cannot be found" for it and the CDN is blocked from this container, so those weights rest on the repo copies named in the header.
2. The largest savings are in the library rail: four hero photos of 2400 or 1920 px feed a 380x475 card, so a 960 px WebP cuts about 1.3 MB on first paint with no visible loss.
3. The interludes declare 2000 px in their img tags and Webflow could not build a 2000 px variant (FILESIZE_EXCEEDS_CAP), so treat them as the next heaviest group and confirm their weight in the Webflow Assets panel before export.
