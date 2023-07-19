#!/bin/sh -v
# run ./setup.sh first
# https://github.com/rbardini/resumed

outputPath=output
mkdir -p "$outputPath"

filename=tim-abell-cv
source="resume.hjson"
json="$outputPath/$filename.json"
html="$outputPath/$filename.html"
pdf="$outputPath/$filename.pdf"

# hjson to json - https://www.npmjs.com/package/hjson
hjson "$source" -json > "$json"

# hack to make line breaks show in html
sed -i 's/\\n/\\n<br>/g' "$json"

# json to html
npx resumed render "$json" --output "$html" --theme jsonresume-theme-kendall

# html to pdf
input="`pwd`/$html"
npx chromehtml2pdf "file:///$input" --out="$pdf" \
    --printBackground true \
    --format A4 \
    --marginTop 2cm \
    --marginBottom 2cm \
    --marginLeft 2cm \
    --marginRight 2cm
