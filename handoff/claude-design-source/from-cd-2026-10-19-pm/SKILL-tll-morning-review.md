# tll-morning-review

**Job:** every morning, read everything published on That Layover Life in the last 24 hours (stories, link-out stories, Lounge photos with captions, new profiles, pet profiles). Send Nancy one list of what went live, and flag only what needs her. Severity 1 to 3 can be put on hold. Nothing is ever deleted by the skill.

**Runs:** daily 07:30 Copenhagen, or on "run the morning review".

**Why it exists:** stories publish the moment they pass the submission rules (ruling 2026-10-10). The human pass moved from before publish to after. This is that pass. Approved by Nancy 2026-10-19: list everything, approve nothing, hold the bad ones.

## Inputs
- Webflow CMS, site 69d6145cf421c777840c1e25: Stories, Contributors, Pets, Lounge collections, items with published date in the last 24 h (plus anything edited since the last run).
- STANDING-RULINGS.md and the Editorial Charter (rules 01 to 08).
- Last run's log at `review-log/YYYY-MM-DD.md` (so nothing is flagged twice).

## Severity
| Sev | What | Action |
|---|---|---|
| 1 | Illegal or dangerous: breaking a law, smuggling, visa fraud, drugs across borders, harming animals | **Hold now**, ping Nancy immediately |
| 2 | Defamatory: a named person or business accused of something as fact, no source | **Hold now**, ping immediately, draft the note |
| 3 | Cruel or hateful: contempt for a people, place, religion, body. Personal data of a third party (phone, email, address, child's full name, plate, stranger's face without the depicted-persons tick) | **Hold now**, morning message |
| 4 | Not about travel; pure product pitch; undisclosed paid work (Charter 08); copied text; stock or watermarked photos | Stays live, flagged in the morning message |
| 5 | Dead or wrong link on a link-out story; counts typed into copy (COUNT-RULES.md §7) | Stays live, "worth a glance" |

Not flagged: swearing (fudge mode exists), opinions, typos, style, length, stories Nancy would not have written herself. Other people get to share.

## Hold means
- Webflow item set to Draft (unpublished), with a `hold-reason` and `hold-date` written on the item.
- The public URL shows the Charter hold page: "This story is paused while the editor checks one thing. Back soon, or the writer has it." No details of the flag are public.
- The writer gets the drafted note the same hour (see below). Their /account Stories tab shows the story as ON HOLD with the reason and an "Edit and resend" button.
- The story's place tags and map writes stay; nothing is unwound.

## Removal and re-edit process
1. **Hold** (skill or Nancy). Writer notified with the exact sentence and one ask.
2. **Writer edits** in /submit (same editor, draft prefilled) and presses Resend. The read-through runs again. Resend puts the story back in the morning queue, marked RESUBMITTED, not auto-live.
3. **Nancy decides** from the morning message: Release (publishes again, same URL), Hold again (new note), or Remove.
4. **Remove**: item stays in the CMS as Removed with the reason; URL shows "This story was taken down under the Charter" with the rule number. The writer keeps their profile and other stories. Three removals in a year closes submissions for that account; Nancy is told before it triggers.
5. **Appeal**: writer replies to the note; the thread goes to Nancy. No public comment.

## Output
One message to Nancy (Slack or email, her choice) every morning, even when quiet:

```
Morning review · 20 October 2026
Went live since yesterday (5)
  • "Night bus to Skopje" · [name] · North Macedonia · 6 min
  • "Two hours in Doha, one falcon" · [name] · Qatar · 4 min
  • Link-out: "Our van year" · [name] · substack.com
  • Lounge: 2 photos, Iceland, [name]
  • New profile: [name] · Lisbon
On hold (1)
  • "Night bus to Skopje" · SEV 2 · "the driver was drunk" stated as fact, no source.
    Writer told 07:31. Release → · Hold again → · Remove →
Flagged, still live (1)
  • "Two hours in Doha" · SEV 4 · "thanks to Qatar Airways for the lounge" with no Reklame label.
    Draft note to writer below.
Worth a glance (0)
```

If nothing is flagged: the "went live" list, then "Nothing needs you."

For each flag, write a ready-to-send note to the writer in TLL voice (kind, specific, one ask, no em dashes, no exclamation marks) and save it to `review-log/`.

## Rules
- Hold, never delete. Only Nancy removes.
- One message a day plus immediate pings for severity 1 and 2.
- Quote the exact sentence; never paraphrase an accusation.
- Log every run (items read, holds, flags, time) to `review-log/`.
- If the skill is unsure between 3 and 4, it flags (stays live) and says so.

## Needs from Claude Code
- CMS fields on Stories: `hold-reason` (text), `hold-date` (date), `review-status` (option: live / on hold / resubmitted / removed), `removal-rule` (text).
- A Charter hold page and a Charter removal page (two static pages).
- /account Stories tab: ON HOLD state with reason and "Edit and resend".
- /submit: open an existing story for re-edit; Resend sets review-status to resubmitted.
