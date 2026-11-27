#!/bin/bash
# run.sh <dir> <script> <tag> [args]: runs a probe on old and new, one at a time
source <scratch>/probes/env.sh; d=$1; s=$2; tag=$3; shift 3
for t in old new; do T=<scratch>/$t; [ $t = new ] && T=<scratch>/fix4
  (cd <scratch>/probes/$d && timeout 900 node -r ./dnsmap.cjs $s $T "$@") > <scratch>/probes/runs/$tag.$t.txt 2>&1; echo "exit $?" >> <scratch>/probes/runs/$tag.$t.txt
done
