# /edit-profile embeds, 28 October 2026 (Nancy's notes N2 to N5 and N7 to N9)

Page 6a0df371cd5b09ac504421ae on site 69d6145cf421c777840c1e25. Change log: handoff/CHANGE-LOG-EDIT-PROFILE-NOTES-2026-10-28.md. Files are named by the first eight characters of the HtmlEmbed element id.

- before/: the six embeds as served on www on 28 October (publish of 12:00 UTC), before this build. Each matched the newest repo copy.
- after/: what was written. Served on the subdomain at 13:05 UTC on 28 October and compared byte for byte with these files: all nine identical.

| File | Element id | What changed |
|---|---|---|
| c1ecd340 | c1ecd340-2f7e-5c94-50d5-6951f00bd3ef | Origin: From (country plus a place) and Has lived in as two boxes (N2, N3). Keeps the ep-countries list the desks use. |
| 7dccfde8 | 7dccfde8-0d3d-249c-ed22-9c230ffd1723 | 03 Your links: Shop and partners group (N9). |
| 6bf1af49 | 6bf1af49-fb22-ee91-194d-dc2ab4d8d644 | 04 Your crew: "Start typing a name" picker and the new note (N5). |
| 4080e4be | 4080e4be-411e-19fe-af28-9d3d1b70fadf | 07 Directories: What you make chips (N7) and the press form (N8). |
| 464edf19 | 464edf19-2905-ef8d-d746-f45668911298 | Script part C: any field the Worker answers "cannot be saved from a profile" is dropped from that send, so the new fields save to Memberstack before the Worker redeploy. |
| 85cbe1b9 | 85cbe1b9-dfb6-fddb-8b53-4df39aa8d723 | Script part D: Bio and Short bio counters with limits (N4); the old crew Enter rule left for part H. |
| new-css-d3 | 4ef34f95-468c-dd88-cc7b-fc624b62b18b (new, after CSS part D2 ad66c9e4) | Styles for the new pieces. |
| new-js-g | 9afadfb9-2dc1-1548-ca33-a87e453677a0 (new, after script part E afd0cded) | Script part G: N2, N3, N7, N8, N9, and the switch color fix. |
| new-js-h | 1cc28529-c9fd-eda6-b7b1-f34dc93c9b54 (new, after part G) | Script part H: the crew picker (N5). |

Order of the scripts now: A, A2, B, C, C2, D, F, E, G, H. G wraps E.paint and E.fill, so it must stay after E.

Tested on a local copy of the live page with a stand-in member and a stand-in Worker that refuses from-place, makes and partners the way the deployed Worker does: a five-flag record opens as From plus four; From replaces, Has lived in stops at four and needs a From first; removing From moves the first lived-in country up with a note; the place saves and shows in the preview; makes chips save in list order; partners keep their row positions and warn on a half-filled row; the Bio counter reads "1,250 of 1,200, trim 50" in rose; the press form checks outlet and link, shows "Your application did not reach us" when the route is missing, and once sent reads "Sent 28 October 2026. Reviewed within 48 hours." and hides; the crew picker lists matching Travelers from /travelers, leaves out the member and anyone already invited, and Enter or a click adds a waiting invite. Every save read "Saved". Same checks on the served subdomain HTML. No console errors from the page's scripts.

Found in the build and fixed in part G: the site's contrast repair (tll-a11y-motion-v1, site code) catches the directory switches while they fade to ON after load and pins dark text on them, so ON read dark on dark. Part G clears that pin on the page's own switches and chips after load.
