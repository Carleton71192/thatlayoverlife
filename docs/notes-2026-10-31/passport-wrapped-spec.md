# Passport Wrapped: spec only

Status: SPEC ONLY. Do not build. For Nancy to review, 31 Oct 2026.

## What it is

A December Slide Show of a member's year on That Layover Life: new stamps, firsts, stories and pursuits, ending on a share card. It reuses the existing Slide Show from the continent photo album, so it should feel like the album, not a new product.

## Opt-in

- Off by default. A member turns it on from their account ("Make my Passport Wrapped").
- Each December, the member sees a preview before anything can be shared.
- Nothing is public unless the member shares it. Turning it off removes any share link.
- Pets get their own Wrapped only if the owner opts the pet in separately.

## Data needs

Only data that already exists on the site. Every count is computed from these records at render time; no count is ever typed into copy.

| Source | Fields used |
|---|---|
| Stamps | country, city, month, year, pursuit, and a work-trip flag |
| Stories | published date, country |
| Map countries | Lived, Stayed or Layover mark, and the date the mark was added |
| Pets | name the owner chose, firsts (first train, first ferry, first snow, first beach and so on), with country and year |
| Pursuits | pursuit name and the stamps tagged to it |

The year window is 1 January to 30 November of the current year, so nothing recent is shown (see privacy). Exact cutoff to confirm with Nancy.

## Slides (draft order)

1. Cover: "[First name]'s year in stamps." Year shown only if the member chooses.
2. New countries: computed count of countries with a first stamp this year, then the countries.
3. Firsts: first stamp on a new continent, first story, first Lived mark.
4. Stories: computed count of stories published this year, with titles the member already published.
5. Pursuits: the pursuits with the most new stamps.
6. Homes: new Lived marks, shown as countries only.
7. Pets (if opted in): the pet's firsts this year.
8. Share card.

## What is shown by default

- Countries and continents: yes.
- Cities: no, unless the member turns cities on.
- Years and months: no, unless the member turns them on. Default copy says "this year."
- Stories: titles and countries only.
- Photos: only photos already public in the member's album.

## Privacy rules

- City or country only. Never a street, venue, hotel or coordinates.
- Nothing current. No stamp, story or mark from December, and never "where I am now."
- Work-trip stamps read "A work trip" unless the member gives permission to show more. Employers are never named.
- No children's names anywhere, including in captions pulled from stories.
- Counts are computed from records, never typed.
- A pet's location follows the same rules as its owner's.

## Accessibility and motion

- Respect the system "reduced motion" setting: slides change with a simple fade or no transition, and nothing auto-advances.
- Manual next and back controls on every slide, usable by keyboard.
- Every slide has a text alternative; the whole show can be read as a plain list.
- Text meets contrast rules on top of photos (use a scrim).

## Share card

- Two sizes: 1200x630 (link previews, LinkedIn) and 1080x1920 (stories format).
- Shows: first name, computed count of new countries, top pursuit, and the TLL mark.
- Does not show cities, dates or years unless the member chose them.
- The member previews the card before it is generated. No auto-posting anywhere.

## Out of scope

- Comparing members with each other or ranking them.
- Any paid version.
- Sending Wrapped by email without the member asking.

## Open questions for Nancy

- Exact year cutoff (30 November, or earlier).
- Is "Lived" shown as its own slide or folded into new countries?
- Does a pet Wrapped launch the same December or a year later?
