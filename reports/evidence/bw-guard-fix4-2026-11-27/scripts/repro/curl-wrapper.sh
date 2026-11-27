#!/bin/bash
# check-repro (fix4) safety wrapper: refuse any curl call that is not forced onto 127.0.0.1 with no proxy. Logs the full
# arguments, then execs curl (so a kill from the guard reaches curl itself).
LOG=${CURL_WRAP_LOG:-/dev/null}
args="$*"
if [[ "$args" == *"--noproxy *"* && "$args" == *"--connect-to ::127.0.0.1:"* ]]; then
  echo "OK $(date +%T.%N | cut -c1-12) $args" >> "$LOG"
  unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy
  exec /usr/bin/curl "$@"
fi
echo "REFUSED $(date +%T) $args" >> "$LOG"
echo "curl wrapper: refused (not forced to 127.0.0.1)" >&2
exit 7
