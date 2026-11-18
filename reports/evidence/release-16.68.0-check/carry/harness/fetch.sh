#!/bin/bash
# plain GET of HTML only, once per page per host
set -u
OUT=$1
pages="home:/ stories:/stories about:/about paw-passport:/the-paw-passport travelers:/travelers layovers:/layovers the-map:/the-map for-expats:/for-expats cookies:/cookies balkans:/stories/balkans-ev-road-trip-twelve-countries lisbon:/stories/lisbon-sun-sails-city-built-to-stand-back-up account:/account submit:/submit my-pets:/my-pets share-photos:/share-photos login:/login signup:/signup"
for h in test:that-layover-life.webflow.io www:www.thatlayover.life; do
  n=${h%%:*}; host=${h#*:}
  for p in $pages; do k=${p%%:*}; path=${p#*:}
    f=$OUT/$n/$k.html
    [ -s $f ] && continue
    curl -sS -A 'Mozilla/5.0 (tll carry check)' -H 'Accept: text/html' -o $f -D $OUT/$n/$k.hdr -w "$n $k %{http_code} %{size_download} %{url_effective}\n" "https://$host$path"
  done
done
