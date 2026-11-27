#!/bin/bash
# runs run-all.sh on new, r2 and old in turn, then the tree-independent U1 probe
C=$(cd "$(dirname "$0")/.." && pwd); [ -n "$C" ] || exit 2
source $C/env.sh; export RUNS=$C/runs
for t in new r2 old; do $C/s/run-all.sh $C/$t $t; done
f=$RUNS/adv-urlnorm.any.txt; [ -f $f.done ] || { (cd $C/s/adversary && timeout 300 node -r ./dnsmap.cjs urlnorm.cjs) > $f 2>&1; echo "exit $?" >> $f; touch $f.done; }
echo "$(date +%T) TREES DONE" >> $RUNS/progress.txt
