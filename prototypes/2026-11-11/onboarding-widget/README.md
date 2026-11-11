# Start Your Map: onboarding widget prototype

A single-file prototype (`index.html`) of a three-step onboarding widget for That Layover Life. A visitor picks Travel Map or Paw Passport, ticks the lines that are true, watches a dotted world map light up, and lands on a claim block that links to the real signup page. Open `index.html` in a browser. `shot-390.png` and `shot-1440.png` show step two with four lines ticked.

## How the brief is met

| Brief | In the prototype |
| --- | --- |
| 3-step interactive widget | Three steps built as an accessible tab set: Pick a path, Tick what is true, Claim it. Arrow keys, Home and End move between tabs. |
| Paw Passport or personal Travel Map | Step one offers both as a radio pair. Each path has its own list and keeps its own ticks if you switch back. |
| Tabbed mock interface with things to check off | Step two is a checklist in two labeled groups per path. |
| Vector map that updates as boxes are ticked | Inline SVG, 1,163 dots sampled from Natural Earth land (public domain). Ticking lights the map west to east, and unticking dims it again. |
| "Your Profile is 40% Live" | The readout is computed from the ticks (`ticked / total`). Four of ten gives 40%. No number on the page is typed, including the step numbers and the "worth 10%" line. |
| Editorial look, monochrome accents, photography placeholders | Brand Kit v2.4 tokens in one `:root` block. Paper and Cream surfaces, Ink controls, one Midnight panel carrying the only teal. Two real story photos in step one and a labeled PHOTO slot in step three. |
| Claim CTA block | Step three: headline, a computed summary, one filled button to `https://www.thatlayover.life/signup`, and one text link. |
| Fully responsive, self-contained | One HTML file. The only external load is the Google Fonts stylesheet. Checked at 390 and 1440 with no sideways scroll and no console errors. On phones the map panel sticks to the top so it stays in view while you tick. |

## Where I departed from the brief's wording, and why

- **"Free Forever" became "Free to join."** Nancy removed "Free, forever" from the site on 10 Nov, and the voice rules ask for no reassurance nobody requested. The button reads "Claim your map" with "Free to join." beside it.
- **No em dash in the CTA.** The brief's one-line CTA is split into a button label and a short sentence. Buttons are sentence case.
- **The map is labeled SAMPLE.** It also carries the line "Not a record of your trips", because ticking "slept on an airport floor" says nothing about which countries someone has visited. The lit area is a progress picture and does not stand for places.
- **"Nothing is saved" is said twice, quietly.** Once under the checklist and once under the CTA, where it also says the real profile starts at zero. The widget does not use localStorage at all.
- **Checklist lines are written as "You have..."** so the brief's examples match the real lines from /for-expats, which are in second person.
- **No Tailwind.** The brief did not ask for it and production has none, so the CSS is plain.
- **The big percentage is in JetBrains Mono**, since the kit puts counts in Mono. Playfair is kept for headlines.
- **The page headline is mine** ("Start with what you have already survived."). It is interface copy for the widget and is not presented as a story headline.

## What is real and what is sample

Real:
- Four checklist lines, verbatim from /for-expats: "Your checked bag is 23 kg of snacks from home." "You translate spices in the grocery aisle." "You have a residence card and opinions about it." "The world feels smaller. In a good way."
- Path card lines, verbatim from the live site: "Tap a country to log it, and the counter is your honest total." (/the-map, capitalized) and "If they crossed a border with you, they get a page." (/the-paw-passport).
- Both photos, downloaded from the stories' own hero URLs, cropped, downscaled to under 60 KB each and embedded as data URIs. Alt text is the site's own. Credits link to the stories: "I've Been in Schengen for Years. This Weekend I Actually Went." (Nancy Carleton) and "Even Brave Boys Get Scared" (Jay Carleton).
- Links: /signup, /the-map, /pets/magnus-waffles, /for-expats, /the-paw-passport.

Written for this prototype (plain lines, marked `src: 'plain'` or `'brief'` in the data):
- "You have slept on an airport floor." is the brief's own example.
- The other In transit lines, "You have lived somewhere you were not born.", and the Paw Passport list. Three Paw lines lean on phrases from /the-paw-passport (crossing a border, a vet abroad, border-control stories) and are marked `src: 'paw-passport'`, but they are paraphrases and Nancy should read them as new copy.

Sample:
- The dotted map, the percentage and the "Sample profile" card in step three. Each is labeled SAMPLE in Mono.

Not included: the €9 guide and its Ko-fi link, since this widget has no place for a purchase. Nothing on the page points to a feature that does not exist.

## Moving it onto the real site

Production is Webflow plus site-layer scripts, with a 15-script cap and no Tailwind.

- **Markup:** a Webflow section (or one HTML embed) holding the static structure: the tab row, three panels, the preview panel with an empty `<svg>`. The two photos become normal Webflow assets, or CMS references to the stories so the credits stay correct.
- **Styles:** the CSS here is already plain and token-based. It would move into the existing site-layer CSS under a `tll-onboard-` prefix, reusing the site's button and focus classes (`tll-buttons-v1`, `tll-focus-v1`) so the widget does not redefine them.
- **Script:** one new site layer, `tll-onboard-v1.js`, about 6 KB with the dot grid and the two lists inlined. To stay under the cap it can be folded into an existing home or signup layer and only run when it finds the widget's root element.
- **Copy:** the lists should live where Nancy can edit them. A small CMS collection (line, path, group, order) rendered into the page and read by the script would do it. The percentage logic does not change with the number of lines.
- **Handing off to signup:** today nothing carries over. If Nancy wants it to, the script could pass the chosen path to /signup as a query parameter so the welcome screen opens on the map or on pet registration. That needs a decision and a small change in the account layer.
- **Analytics:** the natural events are path chosen, first tick, reached step three and CTA click, sent only after consent through the existing consent-mode layer.
