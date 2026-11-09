# TLL design review, 9 November 2026 (Nancy)

Must fix

1. Every section fades in late (opacity 0 until it reaches the viewport). On a 14,000px homepage you keep landing on blank cream and waiting. This is most of the "not fun, word heavy" feeling. Cut it to 200 to 300ms and start from 0.6.
2. The story page (your product) has zero in-flow photos, zero captions, 18 images dumped in a grid after the text, and no "read next." Readers finish and leave.
3. Body text is about 78 characters a line, some at 113. Condensed type needs a 560px column.
4. Paw Passport has no button at all besides the nav. Nothing to register, nothing to buy.
5. The Location Expert form shows Webflow's default "Example text" placeholder, and inputs across the site have no labels.

Should fix

6. Nine font families load on the homepage; Inter Tight and Newsreader are now used more than Playfair and IBM Plex. Buttons come in two fonts and three corner styles. One Styles pass fixes it.
7. Counts: "6 stories," "Fifty-seven," 58, 87, 89, 90 of 249, all live at once.
8. "The experts so far" on /for-expats lists nobody, and you are not listed for Denmark.

Caveat: Nancy's Chrome window would not shrink below full screen, so phone widths come from the 29 Oct review, not today.

Nancy, 9 Nov: "I much prefer our Paw Passport work (Prototype 3.4) to what is live."
