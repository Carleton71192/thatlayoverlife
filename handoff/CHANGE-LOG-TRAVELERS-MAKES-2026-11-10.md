# Change log: MAKES on the /travelers cards (10 November 2026)

Source: Nancy, 10 November, choosing "MAKES on /travelers". Since /creators went to draft on 9 November, the What you make note on /edit-profile reads "Your card on /travelers and your page say what you make." The Make things chip on /travelers listed those members, but the cards did not say what anyone makes. Now they do.

## Changes
| # | Change |
|---|---|
| R1 | **The /travelers people card carries Makes.** The roster card (element 75833cff) gets one new attribute, data-tll-makes, bound to the member's Makes field. Its eight existing attributes are written back unchanged. |
| R2 | **The MAKES line.** A new block tll-trav-makes-v1 at the end of the page footer code adds "MAKES PHOTOS · VIDEO · WORDS" under the one line, in teal JetBrains Mono at the card's 12 px (contrast 4.9 to 1). The words are the profile page's for anything saved from Edit profile: the five Makes values, in the saved order. It shows on any people card while Make things is on, using the same test as the Make things chip. Pets, members with Make things off and members who picked nothing get no line. The card's screen reader label names what they make too ("Zain M. Makes photos, video, words. Open the profile"). |
| R3 | **Search finds it.** The page script searches the card text, so "photos" or "video" in the search box finds these members. A link that opens the page with a search (/travelers?q=video) runs the search again once the lines are in, so it finds them too. |

## What stays the same
The page script (Travelers v2), the site layers, the chips and their counts, the shuffle, the cards' other lines and the /edit-profile note. No data-ms-* element. The one member with Make things on today is Zain.

## Notes for you
- Ticking only Other reads "MAKES OTHER" here and on the profile page. If you want "MAKES OTHER THINGS" on both, that is one word in each place.

## On the subdomain, 10 November 2026
R1 to R3 are on https://that-layover-life.webflow.io/travelers, carried by the Webflow build session's subdomain publish (task f8e9f526, about 13:15 UTC) with its portfolio items and the staged site work. Not on www; that waits for your word.
Checked on the subdomain:
- The served page footer code matches src/pages/travelers/live-2026-11-10/after/page-footer.html byte for byte.
- Zain's card carries photos, video and words, and the other seven people cards carry nothing.
- Zain's card reads "MAKES PHOTOS · VIDEO · WORDS" under the one line, on a 375 px phone and at desktop width. The phone shows no sideways scroll.
- /travelers?q=video shows Zain with "1 match." and "1 OF 8".
- The screen reader label reads "Zain M. Makes photos, video, words. Open the profile".
- The page has no failed requests or errors from site code.

## Live on www, 10 November 2026
Published to www, the apex and the subdomain about 16:10 UTC (task 0ae07002) on your word. The same publish carried the portfolio link (S135) and the cloud session's staged work, including site layers 16.53.0. On www the /travelers page code matches the repo copy byte for byte. Zain's card shows the MAKES line, and the label and a ?q=video link work. His profile, the home page and /stories load with no failed requests.

One thing found on the way, not caused by this change: the site layers are served from the GitHub repository through jsDelivr. At about 538 MB the repository is over jsDelivr's 50 MB limit, so a layers file that is not yet cached near a visitor can be refused. It happened once on Zain's profile page and cleared after the file was cached. The lasting fix is to serve the layers from somewhere under the limit, and it is in the lock log for the session that owns the layers.
