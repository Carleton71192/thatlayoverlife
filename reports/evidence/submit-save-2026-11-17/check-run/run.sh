#!/bin/bash
S=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov17/submit-check
export NODE_PATH=/opt/node-tools/node_modules
cd $S/bin
OUT=$S/out/results.jsonl
while read v s vp; do
  [ -z "$v" ] && continue
  if grep -q "\"variant\":\"$v\",\"scen\":\"$s\",\"vp\":\"$vp\"" $OUT 2>/dev/null; then echo "skip $v $s $vp"; continue; fi
  n=0; while pgrep -f headless_shell >/dev/null; do echo "browser busy, waiting"; sleep 60; n=$((n+1)); [ $n -gt 240 ] && exit 3; done
  timeout 240 node h.cjs $v $s $vp $OUT 2>&1 | tail -2
done <<'J'
live one 390x844
branch one 390x844
live mash 390x844
branch mash 390x844
live cached 390x844
branch cached 390x844
live nopunct 390x844
branch nopunct 390x844
live upfail 390x844
branch upfail 390x844
live workerfail 390x844
branch workerfail 390x844
live workeroff 390x844
branch workeroff 390x844
live key 1440x900
branch key 1440x900
live one 1440x900
branch one 1440x900
c1667 one 390x844
branch+C one 390x844
J
echo ALLDONE
