#!/bin/bash
B=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov15/check1666-behavior
cd $B; export NODE_PATH=/opt/node-tools/node_modules
chk(){ a=$(df -BG --output=avail / | tail -1 | tr -dc 0-9); echo "$(date -u +%T) df avail ${a}G"; [ "$a" -lt 2 ] && { echo STOP disk; exit 1; }; }
ST="balkans croatia safrica madrid vietnam phuket lisbon"
PH=""; DK=""; for s in $ST; do PH="$PH;$s:320x780;$s:360x780;$s:375x780;$s:390x844"; DK="$DK;$s:1440x900"; done
chk; node bin/h.cjs out/phone.jsonl 5 "${PH#;}"
chk; node bin/h.cjs out/desk.jsonl 3 "${DK#;}"
chk; node bin/h.cjs out/restore.jsonl 5 "balkans:390x844:restore;madrid:390x844:restore"
chk; node bin/h.cjs out/other.jsonl 5 "home:390x844;stories:390x844"
chk; node bin/h.cjs out/other.jsonl 3 "home:1440x900;stories:1440x900"
chk; echo DONE
