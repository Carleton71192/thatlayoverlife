# Release 16.66.0 live check (16 Nov 2026, plain GETs only)

- Published www, apex and test site 09:06:09 UTC (publishTaskId 0c62d87b-5941-434a-8fd3-73dfbf22d640). Webflow get_site: both custom domains lastPublished 2026-11-16T09:06:09Z.
- www home showed the new pin from 09:06:29 UTC (page stamp 09:06:01). The apex is not reachable from this sandbox (proxy refusal); its publish time is confirmed in Webflow only.
- 12 pages on www and the test site (home, /stories, /about, /the-paw-passport, /travelers, /layovers, /the-map, /for-expats, /cookies, Vietnam, Lisbon and Balkans stories): HTML identical after masking the host name and the Last Published stamp, 12 of 12. Each page carries pin 3df16988 once and neither 6ec769bb nor 0daa78b4.
- Croatia and Phuket stories on www also carry the new pin once and no old pin.
- Bandwidth: about 30 HTML GETs from Webflow hosts, no images, no browser.
