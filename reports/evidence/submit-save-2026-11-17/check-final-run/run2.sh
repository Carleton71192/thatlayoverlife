#!/bin/bash
S=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov18/submit-final-check
export NODE_PATH=/opt/node-tools/node_modules
cd $S/bin
OUT=$S/out/results.jsonl
while read p v s vp; do
  [ -z "$p" ] && continue
  if grep -q "\"page\":\"$p\",\"variant\":\"$v\",\"scen\":\"$s\",\"vp\":\"$vp\"" $OUT 2>/dev/null; then echo "skip $p $v $s $vp"; continue; fi
  n=0; while pgrep -f headless_shell >/dev/null; do echo "browser busy, waiting"; sleep 30; n=$((n+1)); [ $n -gt 240 ] && exit 3; done
  timeout 400 node h2.cjs $p $v $s $vp $OUT 2>&1 | tail -2
done <<'J'
submit live one 390x844
submit merged+C one 390x844
submit live mash 390x844
submit merged+C mash 390x844
submit live cached 390x844
submit merged+C cached 390x844
submit live nopunct 390x844
submit merged+C nopunct 390x844
submit live upfail 390x844
submit merged+C upfail 390x844
submit live workerfail 390x844
submit merged+C workerfail 390x844
submit live workeroff 390x844
submit merged+C workeroff 390x844
submit live workerslow 390x844
submit merged+C workerslow 390x844
submit live revisit 390x844
submit merged+C revisit 390x844
submit live+early revisit 390x844
submit merged+C+early revisit 390x844
submit live postfail 390x844
submit merged+C postfail 390x844
submit live+early postfail 390x844
submit merged+C+early postfail 390x844
submit merged+C race 390x844
submit live one 1440x900
submit merged+C one 1440x900
submit live key 1440x900
submit merged+C key 1440x900
submit live workerfail 1440x900
submit merged+C workerfail 1440x900
submit merged+C revisit 1440x900
share-photos live one 390x844
share-photos merged one 390x844
share-photos live one 1440x900
share-photos merged one 1440x900
my-pets live one 390x844
my-pets merged one 390x844
my-pets live one 1440x900
my-pets merged one 1440x900
J
echo ALLDONE
