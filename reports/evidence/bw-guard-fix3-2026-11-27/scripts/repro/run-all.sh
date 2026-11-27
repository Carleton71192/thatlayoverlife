#!/bin/bash
# check-repro (fix3): runs every round 2 probe on one tree, one job at a time (so one Chromium at a time). Resumable: a job
# whose output has a .done marker is skipped. Usage: run-all.sh <tree dir> <tag> ; needs env.sh sourced and RUNS set.
T=$1; TAG=$2; S=$(cd "$(dirname "$0")" && pwd)
[ -n "$T" ] && [ -n "$TAG" ] && [ -n "$RUNS" ] || { echo "usage"; exit 2; }
export OUTDIR=$RUNS/out-$TAG; mkdir -p "$OUTDIR"
job() { # name timeout dir cmd...
  local n=$1 to=$2 d=$3; shift 3; local o=$RUNS/$n.$TAG.txt
  [ -f "$o.done" ] && return 0
  echo "$(date +%T) start $n $TAG" >> $RUNS/progress.txt
  (cd "$d" && timeout "$to" "$@") > "$o" 2>&1; local x=$?
  echo "exit $x" >> "$o"; touch "$o.done"; echo "$(date +%T) end $n $TAG exit $x" >> $RUNS/progress.txt
  sleep 1; echo "$(date +%T) chromium processes after $n: $(pgrep -fc "headless_shell|chrome-headless|chromium" )" >> $RUNS/progress.txt
}
A=$S/adversary
job repro-browser 1500 $S node -r ./dnsmap.cjs repro-browser.cjs $T
job repro-proc 900 $S node -r ./dnsmap.cjs repro-proc.cjs $T
job repro-parser 300 $S node repro-parser.cjs $T ${MAIN_CHECKOUT:?set MAIN_CHECKOUT}/handoff/BANDWIDTH-LOG.md $RUNS/../rep/handoff/BANDWIDTH-LOG.md $T/handoff/BANDWIDTH-LOG.md
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
job adv-redir 900 $A node -r ./dnsmap.cjs redir.cjs $T
job adv-loop 300 $A node -r ./dnsmap.cjs loop.cjs $T
job adv-cap 600 $A node -r ./dnsmap.cjs cap.cjs $T
job adv-capseq 600 $A node -r ./dnsmap.cjs capseq.cjs $T
job adv-claim 300 $A node -r ./dnsmap.cjs claim.cjs $T
job adv-procs 600 $A node -r ./dnsmap.cjs procs.cjs $T
job adv-words 300 $A node -r ./dnsmap.cjs words.cjs $T
[ "$TAG" != old ] && job adv-parser 300 $A node parser.cjs $T $RUNS/../old ${MAIN_CHECKOUT:?set MAIN_CHECKOUT}
echo "$(date +%T) ALL DONE $TAG" >> $RUNS/progress.txt
