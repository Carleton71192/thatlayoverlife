#!/bin/bash
# check-repro (fix3): x/x.cjs on new, r2 and old, one at a time
C=$(cd "$(dirname "$0")/.." && pwd); [ -n "$C" ] || exit 2
source $C/env.sh; export RUNS=$C/runs
for t in new r2 old; do f=$RUNS/x.$t.txt; [ -f $f.done ] && continue; (cd $C/s/x && timeout 600 node -r ../dnsmap.cjs x.cjs $C/$t) > $f 2>&1; echo "exit $?" >> $f; touch $f.done; echo "$(date +%T) end x $t" >> $RUNS/progress.txt; done
echo "$(date +%T) X DONE" >> $RUNS/progress.txt
