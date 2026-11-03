#!/bin/bash
S=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/audit
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd $S
for p in "/" "/stories" "/stories/antarctica-marathon" "/the-map" "/the-paw-passport"; do
  n=$(echo "$p" | sed 's#^/$#home#; s#^/##; s#/#_#g')
  for r in 1 2 3; do
    timeout 200 node_modules/.bin/lighthouse "https://www.thatlayover.life$p" --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=$S/lh/$n-$r.json >/dev/null 2>&1
    echo "$n run $r: $?"
  done
done
echo LH-DONE
