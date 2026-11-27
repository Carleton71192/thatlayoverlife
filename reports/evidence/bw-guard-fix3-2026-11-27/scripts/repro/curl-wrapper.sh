#!/bin/bash
# Safety wrapper: refuse any curl call that is not forced onto 127.0.0.1 with no proxy.
LOG=${CURL_WRAP_LOG:-/dev/null}
args="$*"
if [[ "$args" == *"--noproxy *"* && "$args" == *"--connect-to ::127.0.0.1:"* ]]; then
  echo "OK $(date +%T) ${@: -1}" >> $LOG
  unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy
  exec /usr/bin/curl "$@"
fi
echo "REFUSED $(date +%T) $args" >> $LOG
echo "curl wrapper: refused (not forced to 127.0.0.1)" >&2
exit 7
