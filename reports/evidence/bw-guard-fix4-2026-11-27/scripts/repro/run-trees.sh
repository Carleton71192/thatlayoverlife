#!/bin/bash
source <scratch>/env.sh; export RUNS=<scratch>/runs MAIN_CHECKOUT=<main checkout> ZXM_LOG=<scratch>/zxm-log.md OLD=<scratch>/old R3=<scratch>/r3
for t in new old; do <scratch>/s/run-all4.sh <scratch>/$t $t; done
f=$RUNS/adv-urlnorm.any.txt; [ -f $f.done ] || { (cd <scratch>/s/adversary && timeout 300 node -r ./dnsmap.cjs urlnorm.cjs) > $f 2>&1; echo "exit $?" >> $f; touch $f.done; }
echo "$(date +%T) TREES DONE" >> $RUNS/progress.txt
