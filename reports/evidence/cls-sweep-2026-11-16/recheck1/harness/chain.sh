#!/bin/bash
# Re-check 1: every set, one after the other. Finished loads are skipped, so this is safe to start again after a restart.
cd "$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
J=../jm/results; A=../adv/results
step() { echo "$(date -u +%FT%TZ) start $*" >> ../chain.log; "$@"; echo "$(date -u +%FT%TZ) done $* (exit $?)" >> ../chain.log; }
jm() { node jm.cjs "$1" >> $J/$1.log 2>&1; }
adv() { node adv.cjs "$1" >> $A/$1.log 2>&1; }
for s in "$@"; do case "$s" in std|cpu|lay|fu|fucpu) step jm $s;; *) step adv $s;; esac; done
echo "$(date -u +%FT%TZ) CHAIN DONE $*" >> ../chain.log
