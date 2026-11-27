#!/bin/bash
# Re-runs the 27 Nov probe scripts against one worktree, one Chromium at a time. Usage: run-old-probes.sh <worktree> <suffix>
# Expects the environment of chk/env.sh (curl wrapper first on PATH, proxy variables unset, WF_GUARD_* to scratch).
WT=$1; SUF=$2; cd "$(dirname "$0")"
for p in new n3 n4 n7; do timeout 900 node -r ./dnsmap.cjs $p.cjs $WT > $RUNS/$p-$SUF.txt 2>&1; echo "$p exit $?" >> $RUNS/progress-$SUF.txt; done
PROBE_MODE=block SKIP_SWBLOCK=1 timeout 1200 node -r ./dnsmap.cjs main2.cjs $WT > $RUNS/main-block-$SUF.txt 2>&1; echo "main-block exit $?" >> $RUNS/progress-$SUF.txt
PROBE_MODE=cache-only SKIP_SWBLOCK=1 timeout 1200 node -r ./dnsmap.cjs main2.cjs $WT > $RUNS/main-cache-only-$SUF.txt 2>&1; echo "main-cache-only exit $?" >> $RUNS/progress-$SUF.txt
timeout 900 node crash.cjs $WT > $RUNS/crash-$SUF.txt 2>&1; echo "crash exit $?" >> $RUNS/progress-$SUF.txt
echo DONE >> $RUNS/progress-$SUF.txt
