# Build prompt: /travelers role badges and Founding 100

Received from Nancy in the cloud session on 12 Nov 2026. Saved as given, except that one member's first name is replaced by "the member who holds Nº 002" (house rule: no member names in repo files).

Decisions used (Nancy can change any before pasting):

* Chip reads "Lives there"; card badge reads "EXPAT · {country}".
* Press badge only after bylines are confirmed by Nancy.
* Founding 100 number is earned with a first published story, not at sign-up.

You are working on That Layover Life (thatlayover.life), built on Webflow with Memberstack. Task: make the /travelers page show who each person is (Expat, Creator, Press, Pet, team) and add the Founding 100 numbered stamp.

## Rules

* Work in Webflow drafts only. Nothing is published until Nancy approves your change log.
* Apply the Emil Kowalski design skill, the Taste Skill and the Impeccable design skill to every visual decision.
* Keep every page slug, CMS collection, field name, form name and data-carrying class. Don't rename existing Memberstack fields. If you need a new field, propose it in the change log first.
* Nav, footer and the "Tell the editor" button are shared components: don't touch them.
* Copy rules: US spelling, no em dashes, never use the word "ships." Never show anyone's current location.
* Every count comes from tllStates. Never type in a number the site calculates.

## Step 0: Check before building

Open /travelers at desktop and 375px wide. Confirm what the card badge, the filter chips and the top filter bar are bound to now. Confirm that these Memberstack fields exist: `is-expat`, `is-creator`, `is-press`, `press-verified`, `lives-country`, `lives-city`, `lives-years`, `roles`. Report anything missing before going further.

## Step 1: Role badge bound to data

Replace the hard-coded "TRAVELER" badge on person cards with one bound to Memberstack:

* `is-expat` → ⌂ EXPAT · {lives-country}
* `location-expert` → ⌂ LOCATION EXPERT · {lives-country}. If the field doesn't exist, propose an editor-only boolean field for it.
* `is-creator` → ✎ CREATOR
* `is-press` AND `press-verified` → ◆ PRESS ✓. If `is-press` is set without `press-verified`, show CREATOR instead.
* Pet profiles → 🐾 PET
* Nancy keeps FOUNDER · EDITOR.
* No role means no badge. Never show "Traveler" as a badge.
* Show at most two role badges, in this priority order: team, Press ✓, Location Expert, Expat, Creator.

## Step 2: Badge style

* Each badge is an icon plus an uppercase word. Use an outline for roles members choose themselves (Expat, Creator) and a filled badge for roles TLL checks (Location Expert, Press ✓). Keep the existing boxed style for the team.
* Badges are static: no link, no hover state, and nothing that makes them look like the filter chips.
* Check the page in grayscale. Every role must still be easy to tell apart.

## Step 3: One name per role

* Use these labels for both the top filter bar and the chips: "Everyone · Lives there · Creators · Press · Pets".
* Remove "The Pros," "Make things," "& affiliates" and "Location Experts" from the filter labels.

## Step 4: Card sublines and fun titles

* Expat: "{lives-city or lives-country} since {year}", only if the member has switched that on.
* Creator: keep the existing "Makes photos · video · words" line.
* Press: up to two outlet names from confirmed bylines.
* The member's fun-title shows only as the caption under their name. It never goes in the badge slot.

## Step 5: Founding 100

* Propose an editor-only Memberstack field `founding-number` (integer 1 to 100, unique, never reused). Nancy assigns it when a member's first story is published: Nancy is 1, the member who holds Nº 002 is 2.
* On cards, show a small "Nº 002" stamp in a corner of the photo, separate from the role badges. On the profile page, show it large. Replace the "FOUNDING 02" badge on that member's card with this stamp.
* Add a tllStates count of assigned numbers. Near the open-slot card, show "Founding 100: {n} claimed". Change the open-slot card to read "Your name here. Nº {next} is still open." Once all 100 are assigned, show "Founding 100: closed" and remove the open-slot line.

## Step 6: Legend

Above the grid, add one line: "⌂ Lives there · ✎ Makes things · ◆ Press, bylines checked by the editor · 🐾 Pets · Nº = one of the Founding 100. Filled badge = checked by TLL." Link "checked" to /press-rules. If that page doesn't exist, create a draft placeholder and list it in the change log.

## Step 7: Fix the counts

* Bind the chip counts and the stats strip to tllStates. Right now the strip says "1 traveler" while the chips say 8 people.
* Change the meta description so it matches the page's "In random order" instead of "Sorted by recent bylines."

## Done means

* A change log listing every edit, with before and after screenshots at desktop and 375px.
* Every proposed new field is listed separately for Nancy's approval.
* A list of open questions for Nancy and anything you couldn't do.
