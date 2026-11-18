#!/bin/bash
S=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov18/submit-final-check
export NODE_PATH=/opt/node-tools/node_modules
cd $S/bin
while pgrep -f run2.sh >/dev/null; do sleep 10; done
OUT=$S/out/results.jsonl
while read p v s vp; do
  [ -z "$p" ] && continue
  if grep -q "\"page\":\"$p\",\"variant\":\"$v\",\"scen\":\"$s\",\"vp\":\"$vp\"" $OUT 2>/dev/null; then echo "skip $p $v $s $vp"; continue; fi
  n=0; while pgrep -f headless_shell >/dev/null; do sleep 5; n=$((n+1)); [ $n -gt 600 ] && exit 3; done
  timeout 400 node h2.cjs $p $v $s $vp $OUT 2>&1 | tail -2
done <<'J'
submit live revisit 1440x900
submit merged+C+early revisit 1440x900
J
echo ALLDONE3
