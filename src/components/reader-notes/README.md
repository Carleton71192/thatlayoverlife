# Reader Notes (the "What the writer missed." block on story pages)

Read back from Webflow's registered scripts on 26 Oct 2026 (`tll_reader_notes` and `tll_reader_notes_form`, both v1.0.0, registered 23 Sep 2026, applied site-wide in the footer). The sources were not in the repo before; these are verbatim copies.

How it works
- `tll_reader_notes-1.0.0.js` runs on /stories/{slug}. It builds the section after the share row and reads the Memberstack data table **Story Comments** (key `story_comments`, id tbl_cmuebhqgc00010te77jocaemn) for records with that story's slug and `status = approved`, oldest first, up to 100. Each shows the display name, the date and the note. None: "No notes yet. Been here? Add what the writer missed."
- `tll_reader_notes_form-1.0.0.js` adds the form under it. Logged out: a "Log in to add a note" button (Memberstack login modal). Logged in: a textarea (1500 characters) and "Post note". Posting creates a record with the member id, the story slug, the member's first name as display name, the note, and `status = pending`. The reader sees "Got it. A human reads every note before it goes up."
- Table rules: create needs a login, read is public, update is admin only, delete is the record's own member. So a note is invisible until someone sets its status to `approved` in the Memberstack dashboard (Data Tables, Story Comments). Nothing emails anyone when a note arrives; the Worker is not involved. On 26 Oct the table held no records.
