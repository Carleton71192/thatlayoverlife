# B15 /submit: step bar

Page /submit (6a0d5e5eb7804d3a750dc266), footer custom code, style `tll-form-steps-v2`. Draft only, not written to Webflow.
class-b.md places these rules in the page head code; on the live page they are in the footer style, so the draft changes them there.

**Change.** `.tllst-seg` becomes a 44 px tall button with the 6 px bar drawn as a centered background (`linear-gradient(...) center/100%
6px no-repeat`); `.on` and `.done` keep their colors (#067A79, #0A0B14) in the same 6 px bar. Rounded ends go (border-radius 0), as in
the class-b.md text.

**Why.** At 1440 each segment is a 5 px target. At 390 the site touch floor makes each one a 44 px filled block, so the bar reads as
three slabs.

**Before.** 5 px bars at 1440, 44 px blocks at 390. **After.** A 6 px bar in a 44 px tap target at both widths.

**Size.** 11,129 to 11,464 characters (+335) of 50,000. sha384 in ../hashes.tsv.

**Same block as B02.** To apply both, write ../submit-footer-B02-B15/after.html.

**Check on the test site.** 390 and 1440: the bar looks like a thin line, a tap anywhere in the 44 px row moves the step, steps 1 to 3
show on, done and upcoming colors.

**Rollback.** Write before.html back to the /submit footer block and publish.

**Tests.** test/classb-2026-11-25.test.js, "B15" (the CSS text; layout needs the browser check above).
