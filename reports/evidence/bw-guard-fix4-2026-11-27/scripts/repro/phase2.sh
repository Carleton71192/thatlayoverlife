#!/bin/bash
# phase 2: waits for run-trees.sh, then ext4 and the rate-limited B1 on both trees, then the three suites on new. One at a time.
source <scratch>/env.sh; R=<scratch>/runs
until grep -q "TREES DONE" $R/progress.txt 2>/dev/null; do sleep 20; done
one() { local n=$1 to=$2 d=$3; shift 3; local o=$R/$n.txt; [ -f $o.done ] && return 0; echo "$(date +%T) start $n" >> $R/progress.txt; (cd $d && timeout $to "$@") > $o 2>&1; echo "exit $?" >> $o; touch $o.done; echo "$(date +%T) end $n" >> $R/progress.txt; }
for t in new old; do one ext4.$t 1200 <scratch>/a node -r ./dnsmap.cjs ext4.cjs <scratch>/$t; done
for t in new old; do one a-bytes-B1-rate12M.$t 900 <scratch>/a env RELAY_RATE=12500000 node -r ./dnsmap.cjs bytes.cjs <scratch>/$t B1; done
for t in new old; do one a-bytes-B4.$t 600 <scratch>/a node -r ./dnsmap.cjs bytes.cjs <scratch>/$t B4; done
for i in 1 2 3; do one guard-tests-$i.new 1500 <scratch>/new node --test tools/test/wf-guard.test.cjs; done
one worker.new 600 <scratch>/new node --test worker/test/
echo "$(date +%T) PHASE2 DONE" >> $R/progress.txt
