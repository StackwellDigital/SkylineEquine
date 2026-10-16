#!/usr/bin/env bash
# Downloads each product photo from Skyline Equine's Wix media host into images/<id>.jpg
# (resized to max 900px, JPEG). Needs static.wixstatic.com allowed for outbound traffic.
set -u
cd "$(dirname "$0")/.."
mkdir -p images
ok=0; fail=0
while IFS=$'\t' read -r id media; do
  [ -z "$id" ] && continue
  url="https://static.wixstatic.com/media/${media}/v1/fit/w_900,h_900,q_85/file.jpg"
  if curl -fsS -m 30 -o "images/${id}.jpg" "$url"; then ok=$((ok+1)); else echo "FAILED: $id"; rm -f "images/${id}.jpg"; fail=$((fail+1)); fi
done < images.tsv
echo "downloaded=$ok failed=$fail"
