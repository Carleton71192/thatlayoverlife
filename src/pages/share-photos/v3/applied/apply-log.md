# /share-photos v3 apply log (13 Oct 2026)

Page 6a0dfca3f9fa5b751d154257, site 69d6145cf421c777840c1e25. Every write is a staged, unpublished edit. Nothing was published. Agent fable-5.1|workflow|qmzrt, session ses_3JxJ0e4t0CfR7N00ZUfLZKPGz64. Readbacks: applied/page-footer-readback.html, applied/elements-readback.json.

Id shorthand: …8670 means c09ceb51-0ee9-0a93-6196-eee626758670.

| Op | Kind | Target | Result |
|---|---|---|---|
| 1 | footer-code | page footer | Applied. Fresh footer read matched the 1525-byte capture (only the tll-form-fix block). New footer = tll-photos-v3.html + newline + tll-photos-form-v1.html, 48180 bytes, node --check OK, CSS parsed in Chromium (156 rules). set_page_freeform_code done; readback byte-identical (sha256 464d1b35…5520). Head code and page scripts unchanged. |
| 2 | text | …8670 eyebrow | Applied via plan alternate. set_text refused: "This element doesn't support text". set_settings text: "The Layover Lounge". |
| 3 | text | …867c legend | Applied (set_settings text): "Your photos". |
| 4 | text | …868d legend | Applied (set_settings text): "The story". |
| 5 | text | …86cb legend | Applied (set_settings text): "Your credit". |
| 6 | text | 455964ef-…2f04 promises label | Applied via plan alternate. set_text refused: "This element doesn't support text". Text: "Three promises · ticked separately, never pre-ticked". |
| 7 | text | …867e help | Applied (set_text). |
| 8 | text | …8680 glyph | Applied via plan alternate after set_text refused ("This element doesn't support text"): "↑". |
| 9 | text | …8682 drop headline | Applied via plan alternate after the same set_text refusal. |
| 10 | text | …8684 drop sub | Applied via plan alternate after the same set_text refusal. |
| 11 | text | …868f help | Applied (set_text). |
| 12 | text | …8691 span (Country label) | Applied (set_text). Label …8693 still holds input …8692 (name country, required). |
| 13 | text | …86b7 span (Caption label) | Applied (set_text). |
| 14 | text | …86ba caption help | Applied (set_text). |
| 15 | text | …8695 span (City label) | Applied (set_text). |
| 16 | text | …8699 span (Year label) | Applied (set_text). |
| 17 | text | …869d span (Trip type label) | Applied (set_text). |
| 18 | text | …86c0 pet legend | Applied (set_settings text). |
| 19 | text | …86c2 pet help | Applied (set_text). |
| 20 | text | …86c4 pet label span | Applied (set_text). Class tll-photos-vh stays a runtime script step. |
| 21 | text | …86cd credit help | Applied (set_text). |
| 22 | text | …86d2 radio span | Applied (set_text): "My name". Radio …86d0 still checked by default. |
| 23 | text | …86da radio span | Applied (set_text): "Anonymous Traveler". |
| 24 | text | …86df syndication span | Applied (set_text). |
| 25 | text | …86e9 inline label | Applied (set_settings text). |
| 26 | text | …86f0 inline label | Applied (set_settings text). |
| 27 | text | …86f7 inline label | Applied (set_settings text). |
| 28 | text | …870d status span | Applied (set_text). |
| 29 | text | …8712 success text | Applied via plan alternate after set_text refused ("This element doesn't support text"). Wrapper …8711 untouched. |
| 30 | text | …8715 error text | Applied via plan alternate after the same refusal. Wrapper …8714 untouched. |
| 31 | text | …871b gate eyebrow | Applied via plan alternate after the same refusal. |
| 32 | text | …8722 gate lede | Applied (set_text). |
| 33 | placeholder-clear | …8687 photos | Skipped: no placeholder setting key exposed (query_settings lists domId, visibility, name, required, type only). Left for the Designer; script step 1 removes it at runtime. |
| 34 | placeholder-clear | …8692 country | Skipped: placeholder key not exposed (0 matches). Left for the Designer. |
| 35 | placeholder-clear | …8696 city | Skipped: placeholder key not exposed (0 matches). Left for the Designer. |
| 36 | placeholder-clear | …869a year | Skipped: placeholder key not exposed (full key list has no placeholder). Left for the Designer. |
| 37 | placeholder-clear | …86b8 caption | Skipped: placeholder key not exposed (0 matches). Left for the Designer. |
| 38 | placeholder-clear | …86c5 pets-along | Skipped: placeholder key not exposed (0 matches). Left for the Designer. |
| 39 | required | …869a year | Applied: required true to false. Name, type number, min 1990, max 2030, dom id unchanged. |
| 40 | required | …8687 photos | Applied: required false to true. Name photos, type file, dom id photos-upload unchanged. |
| 41 | accept | …8687 photos | Skipped: no accept setting key exposed on the file input. Per the stage rule the plan's set_attributes route was not improvised. accept stays image/*; script step 2 sets image/jpeg,image/webp at runtime. Left for the Designer. |
| 42 | add-elements | after …8722 in …8728 | Applied with follow-up. Builder created the 11 elements in place but returned partial_success "One or more styles not found" for all five class names, and the three TextBlocks kept the default "This is some text inside of a div block.". Plan pre-step run: five empty classes created (data_style_tool create_style, no properties), set_style on the 11 elements, set_settings text on the three word blocks. Readback: Drop, Where, Send rows plus the member line, order 871b, 8720, 8722, NEW, 8727. data-ms-content on …872a unchanged. |
| 43 | add-elements | after …8727 in …8728 | Applied. Class tll-photos-age created empty beforehand (same builder refusal seen in op 42). Builder created df5c25f8 with the class; its text came back as the default and was set with set_settings text: "Free. Travelers are 16 and older." |

Not touched: site code, registered scripts, nav, footer components, CMS, other pages, form method, action, enctype and data attributes, every input name and id, both data-ms-content blocks, tllgateflashv1. No publish call was made.
