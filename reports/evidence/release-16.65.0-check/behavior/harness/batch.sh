#!/bin/bash
B=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov14/check1665-behavior
cd $B; export NODE_PATH=/opt/node-tools/node_modules
chk(){ a=$(df -BG --output=avail / | tail -1 | tr -dc 0-9); echo "df avail ${a}G"; df -h / | tail -1; [ "$a" -lt 2 ] && { echo STOP disk; exit 1; }; }
chk; node bin/run.cjs out/stories.jsonl 10 "story:390x844;balkans:390x844;croatia:390x844;story:1440x900;balkans:1440x900;croatia:1440x900"
chk; node bin/run.cjs out/restore.jsonl 5 "story:390x844:restore"
chk; node bin/run.cjs out/other.jsonl 3 "home:390x844;home:1440x900;stories:390x844"
chk; echo DONE
