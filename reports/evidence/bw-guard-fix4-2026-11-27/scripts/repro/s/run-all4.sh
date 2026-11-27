#!/bin/bash
# check-repro (fix4): every round 2 and round 3 probe on one tree, one job at a time (one Chromium at a time).
# Resumable: a job whose output has a .done marker is skipped. Usage: run-all4.sh <tree dir> <tag>; env.sh sourced, RUNS,
# MAIN_CHECKOUT, ZXM_LOG, OLD, R3 set.
T=$1; TAG=$2; S=$(cd "$(dirname "$0")" && pwd); A=$(cd "$S/../a" && pwd)
[ -n "$T" ] && [ -n "$TAG" ] && [ -n "$RUNS" ] && [ -n "$S" ] || { echo "usage"; exit 2; }
export OUTDIR=$RUNS/out-$TAG; mkdir -p "$OUTDIR"
job() { # name timeout dir cmd...
  local n=$1 to=$2 d=$3; shift 3; local o=$RUNS/$n.$TAG.txt
  [ -f "$o.done" ] && return 0
  echo "$(date +%T) start $n $TAG" >> $RUNS/progress.txt
  (cd "$d" && timeout "$to" "$@") > "$o" 2>&1; local x=$?
  echo "exit $x" >> "$o"; touch "$o.done"; echo "$(date +%T) end $n $TAG exit $x" >> $RUNS/progress.txt
  sleep 1; echo "$(date +%T) my chromium after $n: $(pgrep -f "headless_shell|chrome-headless" | xargs -r ps -o ppid= -p 2>/dev/null | wc -l) (all users' processes)" >> $RUNS/progress.txt
}
SA=$S/adversary
# round 2 (fix2) probes, relayed copies
job repro-browser 1500 $S node -r ./dnsmap.cjs repro-browser.cjs $T
job repro-proc 900 $S node -r ./dnsmap.cjs repro-proc.cjs $T
job repro-parser 300 $S node repro-parser.cjs $T ${MAIN_CHECKOUT:?}/handoff/BANDWIDTH-LOG.md ${ZXM_LOG:?} $T/handoff/BANDWIDTH-LOG.md
job parser 300 $S node parser.cjs $T
job new 900 $S node -r ./dnsmap.cjs new.cjs $T
job n3 900 $S node -r ./dnsmap.cjs n3.cjs $T
job n4 900 $S node -r ./dnsmap.cjs n4.cjs $T
job n5 900 $S node -r ./dnsmap.cjs n5.cjs $T
job n7 900 $S node -r ./dnsmap.cjs n7.cjs $T
job n8b 300 $S node -r ./dnsmap.cjs n8b.cjs $T
job main-block 1200 $S env PROBE_MODE=block SKIP_SWBLOCK=1 node -r ./dnsmap.cjs main2.cjs $T
job main-cache-only 1200 $S env PROBE_MODE=cache-only SKIP_SWBLOCK=1 node -r ./dnsmap.cjs main2.cjs $T
job crash 900 $S node crash.cjs $T
job wfget 600 $S node -r ./dnsmap.cjs wfget.cjs $T
job adv-redir 900 $SA node -r ./dnsmap.cjs redir.cjs $T
job adv-loop 300 $SA node -r ./dnsmap.cjs loop.cjs $T
job adv-cap 600 $SA node -r ./dnsmap.cjs cap.cjs $T
job adv-capseq 600 $SA node -r ./dnsmap.cjs capseq.cjs $T
job adv-claim 300 $SA node -r ./dnsmap.cjs claim.cjs $T
job adv-procs 600 $SA node -r ./dnsmap.cjs procs.cjs $T
job adv-words 300 $SA node -r ./dnsmap.cjs words.cjs $T
[ "$TAG" != old ] && job adv-parser 300 $SA node parser.cjs $T ${OLD:?} ${MAIN_CHECKOUT}
# round 3 check-repro probes (x/)
job x 900 $S/x node -r ../dnsmap.cjs x.cjs $T
job x2 900 $S/x node -r ../dnsmap.cjs x2.cjs $T
job x3 600 $S/x node -r ../dnsmap.cjs x3.cjs $T
job x5rep 600 $S/x node -r ../dnsmap.cjs x5rep.cjs $T
job x8conn 900 $S/x node -r ../dnsmap.cjs x8conn.cjs $T
job refused 300 $S/x node -r ../dnsmap.cjs refused.cjs $T
# round 3 check-adversary probes
job a-bytes 1200 $A node -r ./dnsmap.cjs bytes.cjs $T
job a-redir 900 $A node -r ./dnsmap.cjs redir.cjs $T
job a-loop 300 $A node -r ./dnsmap.cjs loop.cjs $T
job a-cap 600 $A node -r ./dnsmap.cjs cap.cjs $T
job a-cap3 600 $A node -r ./dnsmap.cjs cap3.cjs $T
job a-capseq-b 600 $A node -r ./dnsmap.cjs capseq-b.cjs $T
job a-claim 300 $A node -r ./dnsmap.cjs claim.cjs $T
job a-procs3 600 $A node -r ./dnsmap.cjs procs3.cjs $T
job a-r4 300 $A node -r ./dnsmap.cjs r4.cjs $T
job a-forms 600 $A node forms.cjs $T
[ "$TAG" != old ] && job a-parser3 300 $A node parser3.cjs $T ${OLD} ${MAIN_CHECKOUT} ${R3:?}
echo "$(date +%T) ALL DONE $TAG" >> $RUNS/progress.txt
