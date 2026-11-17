#!/bin/bash
# usage: run.sh set [set...]   (finished loads are skipped; one browser at a time: never start two of these)
cd "$(dirname "$0")"
for s in "$@"; do NODE_PATH=/opt/node22/lib/node_modules node adv.cjs "$s" >> ../results/$s.log 2>&1; done
date -u +%FT%TZ > ../results/run.flag
