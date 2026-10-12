# For Nancy this afternoon (fix pass, 12 Oct 2026)

Running list. Everything I changed is an unpublished edit; you publish. Updated as the pass goes.

## Decisions still open
- [ ] **Paw Passport checkout** (Ko-fi or Gumroad) and the product URL. Until then the buy button, the "coming soon" line and the EUR 9 mention are removed (unpublished).
- [ ] **TLL Ko-fi page URL** (account: hello@thatlayover.life). Until then, the Ko-fi buttons on /support are removed (unpublished) rather than left on "#".
- [ ] **/faq paid-tier line.** Proposed: "Membership is free and stays free. If you want to buy us a coffee, the Ko-fi button is there. It unlocks nothing except our gratitude."
- [ ] **Newsletter name:** "The Layover Letter" everywhere? Yes or no.

## Decided (12 Oct)
- Footer guides: build short pages now (/copenhagen-stopover, /ees-etias-layover). Drafts to come; footer links stay as they are.
- La Paz: not hosted. The "This story was hosted" line comes off.
- Passport total: 249.

## Needs you in the Designer (2 minutes each)
1. **/destinations links (Blocker 1).** The cards and flag tiles now link correctly through the page script, but the raw HTML still says /detail_stories and /detail_countries until you rebind them. In the Designer, open /destinations and, for each of these 3 links, set Link settings to "Current Stories item" (card) or "Current Countries item" (2 tile lists):
   - Story card link inside the Stories collection list (data-ds3=card)
   - Country tile link in atlas list 1 (data-ds3=tile)
   - Country tile link in atlas list 2 (data-ds3=tile)

## Needs you present (shared components: nav, footer, "Tell the editor")
- (to come from the verification pass)

## Needs your click (accounts, services, Google)
- (to come: Search Console verification, GA4 property merge)

## Publish
- Nothing has been published since your fix-pass prompt. When you're ready, one site publish covers every staged change.
