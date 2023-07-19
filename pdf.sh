#!/bin/sh -v
# run ./setup.sh first
# https://github.com/rbardini/resumed

outputPath=output
filename=tim-abell-cv
html="$outputPath/$filename.html"
pdf="$outputPath/$filename.pdf"
mkdir -p "$outputPath"

# json to html
npx resumed render resume.json --output "$html" --theme jsonresume-theme-kendall

# html to pdf
input="`pwd`/$html"
npx chromehtml2pdf "file:///$input" --out="$pdf" \
    --printBackground true \
    --format A4 \
    --marginTop 2cm \
    --marginBottom 2cm \
    --marginLeft 2cm \
    --marginRight 2cm

xdg-open "$pdf"
