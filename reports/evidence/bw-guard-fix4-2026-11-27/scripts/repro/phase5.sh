#!/bin/bash
source <scratch>/env.sh; R=<scratch>/runs
until grep -q "PHASE4 DONE" $R/progress.txt 2>/dev/null; do sleep 20; done
one() { local n=$1 to=$2 d=$3; shift 3; local o=$R/$n.txt; [ -f $o.done ] && return 0; echo "$(date +%T) start $n" >> $R/progress.txt; (cd $d && timeout $to "$@") > $o 2>&1; echo "exit $?" >> $o; touch $o.done; echo "$(date +%T) end $n" >> $R/progress.txt; }
for i in 1 2; do for t in new old; do one inv4-$i.$t 900 <scratch>/a node -r ./dnsmap.cjs inv4.cjs <scratch>/$t; done; done
echo "$(date +%T) PHASE5 DONE" >> $R/progress.txt
