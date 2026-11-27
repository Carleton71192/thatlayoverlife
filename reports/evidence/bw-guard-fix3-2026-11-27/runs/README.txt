Measurement outputs for bw-guard-fix3 (branch claude/bw-guard-fix2-2026-11-27), all against stubs on 127.0.0.1.
old = 686e520 (merged), r2 = 7c53c4f (round 2), final = this round.
p3-*: reports/evidence/bw-guard-fix2-2026-11-27/scripts/repro-browser.cjs P3 (R-1; bytes measured at its relay).
loop-*: scripts/adversary/loop.cjs (A-1). cap-*: scripts/adversary/cap.cjs (A-2 C1 to C4).
capseq-*: scripts/capseq.cjs here (C1 one fetch after another, and 60 at once at a 12 MB day cap).
Run as the check reports say: node -r ./dnsmap.cjs <script> <tools parent>, from the scripts folder of the check, with the
curl wrapper first on the PATH. capseq.cjs needs stub3.cjs and dnsmap.cjs from scripts/adversary/ next to it.
guard-tests.txt: NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/*.test.cjs (59 of 59).
