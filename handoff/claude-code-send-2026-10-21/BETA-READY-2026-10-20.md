# BETA-READY · the smallest live site testers and paid contributors can use

Do this before packets B to F. Goal: a stranger from Upwork can sign up, build a map, publish a story with their own photo, and report a problem, end to end, on the live site, without help. Change log first; Nancy approves; publish both domains + subdomain.

## Must work (in this order)
1. **Sign up / log in** (Memberstack). Email + Google. Min age 16 checkbox. Profile publishes at sign-up (`/contributors/{slug}`), thin profile renders cleanly: name, photo or initials, "On TLL since".
2. **Edit profile.** Name, photo upload, short bio, home base, flags (lived in), links. Saves as you go.
3. **The map.** Add countries Lived / Stayed, save, "Last saved" shows. Profile hero counts read from the saved map (COUNT-RULES). No zeros shown to logged-out visitors.
4. **Submit v4, minimum version.** Writer-led form: headline, place, body (rich text), own hero photo, rights tick, Charter tick, affiliate declaration. Publishes the moment it passes the rules (300+ words, photo, place, links resolve). Email copy to the writer. Story shows on the writer's profile and in /stories. Editor's notes and photo adjust can wait for Packet E.
5. **Commissioned label.** CMS boolean `commissioned` on Stories. When on, the story shows "Commissioned by TLL" above the byline and in the card meta. Charter rule 08 applies (flat fee, verdict never bought).
6. **Tell the editor** widget on every page (page URL + note + optional email → editor inbox). This is how testers report bugs in place.
7. **Morning review** running (hold default), so paid stories get read after they publish.

## Must not be broken
- No 404s in nav or footer. 404 page has the three buttons.
- /stories count matches the list. Footer stats from tllStates.
- Banned words gone from live UI ("the shelf", old 48h line on the story path).
- 12px text floor, 44px targets on every step above, on a 390px phone.

## Can wait (not needed for beta)
Share cards, Expats v2 and desks, Travelers v3, motion pass, video, Lounge, Wire, awards, Club, guide sales.

## Beta test script (give to testers)
1. Sign up on your phone. 2. Add a photo and three countries you have lived in or stayed in. 3. Build your map, save, check your profile numbers. 4. Submit a real trip, 300+ words, your own photo. 5. Find your story in /stories and on your profile. 6. Use "Tell the editor" once to report anything odd. 7. Repeat 1 to 3 on a laptop with a different browser. Record your screen and narrate.

## Done means
Nancy, on a fresh phone, completes the script in under 15 minutes with no help, and every step leaves a record (Memberstack member, CMS story, map save, editor-inbox note).
