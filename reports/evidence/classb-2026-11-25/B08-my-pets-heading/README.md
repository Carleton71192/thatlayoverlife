# B08 part 1 /my-pets: heading and add card at 0 pets

Page /my-pets (6a0df9ffc4a846ee4db92b63), footer custom code, script `tll-pet-editor`, function `heading()`. Draft only, not written
to Webflow. Part 2 of B08 (the /submit gate heading) is a Designer change and is not drafted.

**Change.** At 0 pets the heading keeps its Designer words ("your besties") instead of "0 besties", and the add card title reads
"Register your pet" instead of "Register another pet". At 1 or more pets nothing changes ("1 bestie", "2 besties", "Register another
pet"). Text as in class-b.md; the copy waits for Nancy's OK.

**Why.** A signed-in member with no pets saw "Traveling with 0 besties." above "Register another pet".

**Before / after.** 0 pets: "0 besties" and "Register another pet" / "your besties" and "Register your pet". 1 and 2 pets: same.

**Size.** 14,468 to 14,774 characters (+306) of 50,000. sha384 in ../hashes.tsv.

**Note.** before.html is the live block as is, including the founder seed already in the live code and in earlier repo copies.

**Check on the test site.** A test member with no pets, then add one: the heading and card title switch.

**Rollback.** Write before.html back to the /my-pets footer block and publish.

**Tests.** test/classb-2026-11-25.test.js, "B08".
