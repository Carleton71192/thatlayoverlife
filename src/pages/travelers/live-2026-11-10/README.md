# /travelers MAKES, 10 November 2026 (R1 to R3)

Page 6a0e0632ef1e4948167e827c. Change log: handoff/CHANGE-LOG-TRAVELERS-MAKES-2026-11-10.md.

- before/card-attributes.json: the roster people card 75833cff-c508-0418-500a-0e538e2e2ee2 attributes as read on 10 November (two static, seven bound to Contributors). Written back unchanged with one more: data-tll-makes bound to Makes (5734a59d7bf62db91aae776c475c6364). Read back.
- before/page-footer.html: the page footer code as served on www and the subdomain on 10 November (identical on both).
- after/tll-trav-makes-v1.html: the new block. after/page-footer.html: before, a newline, the block. Written with set_page_freeform_code.

Tested on the live www page with the block injected: Zain's card reads "MAKES PHOTOS · VIDEO · WORDS" under the one line; cards with Make things off stay bare; a second run adds nothing; /travelers?q=video moves from "Nobody by that name yet" and "0 OF 8" to "1 match." and "1 OF 8"; the card label reads "Zain M. Makes photos, video, words. Open the profile". Reviewed by two agents (correctness, copy and accessibility) before the write; their two fixes (?q= re-run, label) are in.
