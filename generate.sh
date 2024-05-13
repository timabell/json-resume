#!/bin/sh -v
# run ./setup.sh first
# https://github.com/rbardini/resumed

outputPath=output
mkdir -p "$outputPath"

filename=tim-abell-cv
source="resume.hjson"
# source="authd-resume.hjson" # uncomment this to use auth'd copy
json="$outputPath/$filename.json"
html="$outputPath/$filename.html"
pdf="$outputPath/$filename.pdf"
cvauth="$outputPath/signed-auth.txt.asc"

# hjson to json - https://www.npmjs.com/package/hjson
hjson "$source" -json > "$json"

# top-and-tail summary block
jq -r '.basics.summary' "$json" > "$outputPath/inputSummary.txt"
sed -i 's/\\n/\n/g' "$outputPath/inputSummary.txt"

# preview summary
cat "template-header-preview.txt" "$outputPath/inputSummary.txt" "template-footer-preview.txt" "template-footer-warning.txt" > "$outputPath/previewSummary.txt"

# auth'd summary
cat "template-header-authd.txt" "$outputPath/inputSummary.txt" "template-footer-warning.txt" "$cvauth" > "$outputPath/authdSummary.txt"

# todo: put authd summary back into json before rendering

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
