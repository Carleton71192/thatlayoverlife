#!/bin/bash
source <scratch>/env.sh; R=<scratch>/runs
until grep -q "PHASE2 DONE" $R/progress.txt 2>/dev/null; do sleep 20; done
one() { local n=$1 to=$2 d=$3; shift 3; local o=$R/$n.txt; [ -f $o.done ] && return 0; echo "$(date +%T) start $n" >> $R/progress.txt; (cd $d && timeout $to "$@") > $o 2>&1; echo "exit $?" >> $o; touch $o.done; echo "$(date +%T) end $n" >> $R/progress.txt; }
one cut4-rate12M.both 2400 <scratch>/a env REPS=6 node -r ./dnsmap.cjs cut4.cjs <scratch>/old <scratch>/new
one cut4-rate2M.both 2400 <scratch>/a env REPS=4 RELAY_RATE=2500000 node -r ./dnsmap.cjs cut4.cjs <scratch>/old <scratch>/new
ln -sfn <main checkout>/node_modules <scratch>/new/node_modules
one vitest.new 1200 <scratch>/new npx vitest run
rm -f <scratch>/new/node_modules
echo "$(date +%T) PHASE3 DONE" >> $R/progress.txt
