#!/bin/bash
A=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov16/a
cd $A/bin
rm -f $A/out/final9.flag
for s in std cpu slow5; do rm -f $A/out/$s.jsonl; node h.cjs $A/out/$s.jsonl $A/out/j-$s.json > $A/out/$s.log 2>&1; done
rm -f $A/out/more.jsonl; node h.cjs $A/out/more.jsonl $A/out/j-more.json > $A/out/more.log 2>&1
rm -f $A/out/split.jsonl; node h2.cjs $A/out/split.jsonl $A/out/j-split.json > $A/out/split.log 2>&1
rm -f $A/out/fail5.jsonl; node h.cjs $A/out/fail5.jsonl $A/out/j-fail5.json > $A/out/fail5.log 2>&1
rm -f $A/out/tall5.jsonl; node h.cjs $A/out/tall5.jsonl $A/out/j-tall5.json > $A/out/tall5.log 2>&1
echo done > $A/out/final9.flag
