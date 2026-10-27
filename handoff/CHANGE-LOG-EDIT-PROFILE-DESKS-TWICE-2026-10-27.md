# Change log for approval: a country you lived in twice (27 October 2026)

Source: you, 27 October, in 07 The directories on www.thatlayover.life/edit-profile: "I have lived in DK twice". Your Denmark desk reads From 2018, To 2021, with "I live here now" ticked, so the page shows its note "Denmark says you live here now, but the years end in 2021." Nothing in this log is built.

## Why there is no way today
The desks hold one row per country. "Add a place you lived" answers "Denmark already has a desk." for a second Denmark, and the Worker that copies desks to your public record drops a second row for the same country and cuts the years to 11 characters, so "2018–2021, 2024–now" cannot be stored either. There is no workaround on the page; the fix below is small.

## Changes (numbered for your reply)
| # | Change |
|---|---|
| T1 | **A desk can hold more than one stint.** Under the From and To boxes, a link "+ Add another stint" adds a second From and To pair on the same desk (up to three). Each stint has its own years; "I live here now" belongs to the last one and clears its To year. The desk header keeps one flag and one country name, and the LIVE HERE or LIVED HERE tag reads from the last stint. The note "Denmark says you live here now, but the years end in 2021." only shows when the last stint has an end year. Remove a stint with its own small × (the desk's × still removes the whole desk). |
| T2 | **Saved as one desk.** The years save as "2018–2021 · 2024–now" in the desk's years field (one desk per country as now, so /expats and your public record need no change). The Worker's years limit goes from 11 to 40 characters to fit three stints; the one-row-per-country rule in the Worker stays. The Worker change is a redeploy of tll-travel-wire from the repo, no secrets touched. |
| T3 | **Add a place you lived, when the country already has a desk.** Instead of "Denmark already has a desk." the page says "Denmark already has a desk. Add another stint on it?" with an "Add stint" button that does T1 for you. |

## Data note, not a page change
D1. Once T1 is live, your Denmark desk needs the second stint added by you (the years are yours to type); the 2018 to 2021 stint stays as it is. Until then, the note under the desk is right: it has one stint that ends in 2021.

## Test report with the build
On a local copy with a stand-in member, then on the Webflow subdomain: a desk with two stints saves as "2018–2021 · 2024–now", reads back into two pairs after a reload, the tag says LIVE HERE, no note shows; removing the second stint clears the dash and the note returns; the Worker accepts the 40-character years and still drops a second row for the same country; /expats shows the desk once. Then your signed-in look on the subdomain before the custom domains.

Reply with the item numbers to approve or change.

## Approved 27 October 2026
Nancy: "Approve T1 to T3 as written".

## Built in the repo, 27 October 2026 (not yet in Webflow)
Files in src/pages/edit-profile/live-2026-10-27/after/: 85cbe1b9.html (script part D without the desks), new-js-f.html (script part F, the desks with stints; a new HtmlEmbed placed right after part D), new-css-c3.html (CSS part C3, a new HtmlEmbed placed right after CSS part C 8ec4d875) and 4080e4be.html (the directories embed with the Add stint button). The desks moved out of part D into part F because part D with stints was 11,600 characters, over the 10,000 embed limit. Worker: src/profile-sync.js years limit 11 to 40 (test added in test/profile-sync.test.js, 177 tests pass); needs a redeploy of tll-travel-wire from the repo. Tested on a local copy of the live page with a stand-in member: a second stint on Denmark saves as "2018–2021 · 2024–now", reads back as two pairs, the tag says LIVE HERE and the note clears; "Denmark already has a desk. Add another stint on it?" with Add stint; three stints is the limit; removing a stint saves; other desks untouched. The Webflow write waits for a session with the Webflow connector, like E1 to E11.
