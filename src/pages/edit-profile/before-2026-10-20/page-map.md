# /edit-profile before Packet C (20 October 2026)

Site 69d6145cf421c777840c1e25, page 6a0df371cd5b09ac504421ae. Read with data_element_tool get_all_elements depth 4 and a full query of the two Memberstack content blocks. Every element id below is in component 6a0df371cd5b09ac504421ae. No HtmlEmbed element exists on the page: all custom code is page freeform head and footer code (saved here as page-head-before.html and page-footer-before.html) plus one applied script tllgateflashv1 1.0.0 in the header. The v3 rail files in the repo (head-v3-redesign-append.html, footer-v3-rail.html) were never applied in Webflow.

## Tree (depth 4)
- Body 6a0df371cd5b09ac504421b4
  - ComponentInstance TLL Nav v1 9427e5d7-ab4d-3f34-72c8-d89f881478a7 (untouched)
  - Section .tll-section.tll-bg-paper.tll-edit-section 63c6284b-3818-4de0-a4e4-f9b53f51487c
    - Block .tll-container.tll-edit-container 63c6284b-3818-4de0-a4e4-f9b53f51487b
      - Block data-ms-content="members" 63c6284b-3818-4de0-a4e4-f9b53f51486b
        - Block .tll-edit-header data-tll-reveal 63c6284b-3818-4de0-a4e4-f9b53f5147c4
          - Block .tll-eyebrow-rose.tll-edit-eyebrow 5147bc, text "· Your profile · Edit mode ·"
          - Heading h1 .tll-display-l.tll-text-midnight.tll-edit-title 5147c1, "Edit your profile."
          - Paragraph .tll-lede.tll-text-mid.tll-edit-sub 5147c3, "Saved to your account when you hit Save. The public page is published by the editor, so nothing goes live by itself."
        - Block data-tll-edit="ledger" a38f05d1-4bec-f1ec-f78c-1106c3ea8d35 (h2 ledger-eb, h3 ledger-n, p ledger-sub, link ledger-link to /the-map)
        - FormWrapper .tll-edit-form 63c6284b-3818-4de0-a4e4-f9b53f514856
          - FormForm data-ms-form="profile" 63c6284b-3818-4de0-a4e4-f9b53f514857
            - fieldset Identity 5147e1: legend 5147c7, help 5147c9, then labels below
            - fieldset Travel stats 5147fd: legend 5147e4, help 5147e6, grid 5147fb
            - fieldset Where else you exist 514825: legend 514800, help 514802, grid 514823
            - fieldset Open to 514850: legend 514828, help 51482a, toggles 51484e
            - Block .tll-edit-actions 514855: FormButton .tll-btn.tll-btn-primary.tll-edit-save 514852, Link "Cancel and go back" 514854 (/account)
          - FormSuccessMessage 514858, FormErrorMessage 51485b
        - Block data-tll-edit="dir" 3dbfdb5e-a64b-3551-5398-ce2e580f43fa (old directory editor: h2 dir-eb, p dir-lede, dir-app 3dbfdb5e-...-ce2e580f43f8 filled by the footer script, dir-src 43f9 with a hidden Collection List of tags 6d945762-451b-2ee3-4652-dc4e8331ad0d)
        - Block data-tll-edit="desig" f838a8dd-93e3-5c1a-f029-741375bbddc3 (Designations: Location Expert, Press, Blog on the Wire cards and the note)
        - Block .tll-edit-account-actions 63c6284b-3818-4de0-a4e4-f9b53f51486a (Account: Change password, Sign out data-ms-action="logout" 514865, Privacy)
      - Block .tll-edit-locked data-ms-content="anonymous" 63c6284b-3818-4de0-a4e4-f9b53f51487a ("Sign in to tell us who you are." with Log in and Or join the Travelers)
  - ComponentInstance TLL Site Footer c928a4b0-63b7-d57c-57e9-6db0f314c395 (untouched)

## data-ms-* elements (never changed, moved, deleted or renamed)
| data-ms attribute | element type | element id (63c6284b-3818-4de0-a4e4-f9b53f51...) | wrapper label id |
|---|---|---|---|
| data-ms-content="members" | Block | 486b | |
| data-ms-content="anonymous" | Block | 487a | |
| data-ms-form="profile" | FormForm | 4857 | |
| data-ms-member="name" | FormTextInput | 47cc | 47cd |
| data-ms-member="fun-title" | FormTextInput | 47d0 | 47d3 |
| data-ms-member="home-base" | FormTextInput | 47d6 | 47d7 |
| data-ms-member="bio-short" | FormTextarea | 47da | 47db |
| data-ms-member="bio-long" | FormTextarea | 47de | 47df |
| data-ms-member="country-count" | FormTextInput number | 47e9 | 47ea |
| data-ms-member="cities-count" | FormTextInput number | 47ed | 47ee |
| data-ms-member="states-count" | FormTextInput number | 47f1 | 47f2 |
| data-ms-member="national-parks-count" | FormTextInput number | 47f5 | 47f6 |
| data-ms-member="continents-marathoned" | FormTextInput number | 47f9 | 47fa |
| data-ms-member="personal-website-url" | FormTextInput url | 4805 | 4806 |
| data-ms-member="linkedin-url" | FormTextInput url | 4809 | 480a |
| data-ms-member="instagram-url" | FormTextInput url | 480d | 480e |
| data-ms-member="youtube-url" | FormTextInput url | 4811 | 4812 |
| data-ms-member="tiktok-url" | FormTextInput url | 4815 | 4816 |
| data-ms-member="vimeo-url" | FormTextInput url | 4819 | 481a |
| data-ms-member="substack-url" | FormTextInput url | 481d | 481e |
| data-ms-member="twitter-x-url" | FormTextInput url | 4821 | 4822 |
| data-ms-member="available-for-press" | FormCheckboxInput | 482b | 4831 |
| data-ms-member="available-for-partnerships" | FormCheckboxInput | 4832 | 4838 |
| data-ms-member="available-for-sponsored-stories" | FormCheckboxInput | 4839 | 483f |
| data-ms-member="available-for-collabs" | FormCheckboxInput | 4840 | 4846 |
| data-ms-member="accepts-newsletter" | FormCheckboxInput | 4847 | 484d |
| data-ms-action="logout" | Link | 4865 | |

Every input carries id="field" (duplicate ids) and the checkboxes id="checkbox"; the labels wrap their inputs, so association is implicit.

## Memberstack custom fields before (keys)
accepts-newsletter, affiliation, available-for-collabs, available-for-partnerships, available-for-press, available-for-sponsored-stories, bio-long, bio-short, cities-count, club-supporter, contact-ig, contact-mode, contact-relay-on, contact-wa, country-count, custom-slug, first-name, fun-title, home-base, instagram-url, is-creator, is-expat, is-press, knows, languages, last-name, linkedin-url, link-instagram, link-instagram-on, link-newsletter, link-newsletter-on, link-other, link-other-on, link-strava, link-strava-on, link-tiktok, link-tiktok-on, link-website, link-website-on, link-youtube, link-youtube-on, lives-city, lives-country, lives-years, monetization, name, national-parks-count, personal-website-url, press-verified, regions, roles, roles-press, share-items, share-level, share-ranges, share-slug, states-count, substack-url, tags, tiktok-url, twitter-x-url, vimeo-url, wrapped-hidden.

Missing from the CONTRACTS list on 20 October: one-line, from-and-lived-in, credit-mode, pen-name, visibility, links-shown, alltrails-url, komoot-url, garmin-url, beli-url, list-expats, list-creators, list-press, and the two keys the contract called existing but which were not in the app: youtube-url, strava-url.
