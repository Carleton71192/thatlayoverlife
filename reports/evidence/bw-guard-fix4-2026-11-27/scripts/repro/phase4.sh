#!/bin/bash
source <scratch>/env.sh; R=<scratch>/runs
until grep -q "PHASE3 DONE" $R/progress.txt 2>/dev/null; do sleep 20; done
one() { local n=$1 to=$2 d=$3; shift 3; local o=$R/$n.txt; [ -f $o.done ] && return 0; echo "$(date +%T) start $n" >> $R/progress.txt; (cd $d && timeout $to "$@") > $o 2>&1; echo "exit $?" >> $o; touch $o.done; echo "$(date +%T) end $n" >> $R/progress.txt; }
for i in 1 2 3; do one refused-alt$i.both 300 <scratch>/s/x node -r ../dnsmap.cjs refused.cjs <scratch>/old <scratch>/new; done
for i in 1 2; do one x5rep-alt$i.both 600 <scratch>/s/x node -r ../dnsmap.cjs x5rep.cjs <scratch>/old <scratch>/new; done
echo "$(date +%T) PHASE4 DONE" >> $R/progress.txt
