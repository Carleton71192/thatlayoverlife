# B38 Account (/account, page 6a0d5c23c57426a9c563e8de)
Staged 29 Sep 2026 from screen 38. Additive only; Memberstack blocks untouched.
- New block data-tll-acct=extras (inside the members block, after the module cards): "Your lists" sticker sheet (tabs Pet stamps / Want to go / Layover airports survived / Marathons / National parks, counts in the tab labels, honest empty lines) and the "Layover Wrapped · lands 1 December" card (headline, stats, crew line, Visible to / Hidden from your crew switch).
- Head: tll-acct-lists-v1 CSS appended to the existing tll-acct-dash-v2 block. Footer: tll-acct-lists-v1 script appended after the existing stats script (re-sent verbatim).
- Data: LOGGED and PAWED counts on the module cards and pet stamps come from tllStates (read only; localStorage then member JSON). Want to go from member JSON tllPlaces (= "want"). Airports, marathons, parks from member JSON tllLists (empty until something writes them). Names via Intl.DisplayNames, flags as emoji from the numeric to alpha-2 table.
- Wrapped quiet-year fallback when countries, pet stamps and someday list are all zero. Hidden switch writes the Memberstack custom field wrapped-hidden and falls back to member JSON wrappedHidden if the field does not exist yet.
- Export stays an email request (mailto), per D06; copy updated. WRITTEN and SNAPPED counts not shown (no per-member source yet).
