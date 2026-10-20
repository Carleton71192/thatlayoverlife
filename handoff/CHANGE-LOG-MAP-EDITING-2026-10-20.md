# Change log for approval: adding and removing places, and finding your public profile (20 October 2026)

Source: Nancy, 20 Oct: "I am still a bit confused about how to submit places and unsubmit them if they are wrong. It is not fully intuitive." and "Also there is no View my public profile option in edit". Nothing in this log is built. Publish only on your word.

## What a member sees today (read from the live code)
- There is no Save button. A change saves on its own about a second later, and a small "Last saved {date}" line updates. Nothing says "saved" at the moment of the change, and nothing says when a save fails or when you are not logged in.
- There are two ways to log a place, with different words:
  - On the map: tap a country, then Lived, Stayed or Layover only. A "Clear" button appears only after you pick one.
  - In "Stamp it, or list it": Lived, Stayed, Layover or "Not yet". "Not yet" is how you remove a place there.
- Your Memberstack record was last saved on 19 October at 12:35 UTC. Today's two saves did not reach it, so they did not change anything.
- Edit profile has a "View as visitor" button at the top right, beside "All changes save as you type". It opens /contributors/nancy-carleton, but the label does not say "your public profile".

## Changes (numbered for your reply)
| # | Change |
|---|---|
| M1 | One set of words in both places: Lived, Stayed, Layover only, and Remove. "Clear" and "Not yet" go. Remove shows on every country you have logged, not only after a tap. |
| M2 | A status line above the map for members that answers right away: "Saved. Brazil: Lived." / "Removed Vietnam." / "Not saved. Log in to save your map." / "Not saved. Check your connection." with a Try again button. |
| M3 | One line of help above the map for members: "Tap a country and pick how deep you went. Tap it again to change it or remove it. Saves on its own." |
| M4 | Undo for ten seconds after any change or removal, in the same status line. |
| M5 | Edit profile: the top button reads "View my public profile →" and opens your page in a new tab. The same link sits under the preview card. |

## Test report with this log
A test member adds, changes and removes a place in both places on a 390px phone and at 1440, and the record, the public counts and the status line agree after each step. The test member is deleted afterwards.

Reply with the line numbers to approve or change.
