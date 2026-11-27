#!/bin/bash
# runs the round 3 adversary scripts on old (686e520) and new (49889e7), one at a time (one Chromium at a time)
source <scratch>/env.sh; cd <scratch>/scripts/adversary
for s in cap cap3 procs3 claim redir loop r4; do for t in old4 adv4; do
  timeout 900 node -r ./dnsmap.cjs $s.cjs <scratch>/../$t > <scratch>/runs/adversary/$s-$t.txt 2>&1; echo "exit $?" >> <scratch>/runs/adversary/$s-$t.txt
done; done
timeout 900 node forms.cjs <scratch>/../adv4 > <scratch>/runs/adversary/forms-adv4.txt 2>&1; echo "exit $?" >> <scratch>/runs/adversary/forms-adv4.txt
echo ALLDONE > <scratch>/runs/adversary/run-r3.done
