#!/bin/bash
# resumable; one Chromium at a time (sets in turn)
cd /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov27/lead/check-work/bin || exit 1
export NODE_PATH=/opt/node22/lib/node_modules
R=../results
for set in load click brk eq; do
  for i in 1 2 3; do node pw.cjs $set >> $R/$set.log 2>&1 && break; sleep 5; done
  echo "$set-DONE $(date -u +%H:%M)" >> $R/run.log
done
