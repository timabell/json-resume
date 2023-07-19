#!/bin/sh -v
# run ./setup.sh first
# https://github.com/rbardini/resumed

mkdir -p output

# json to html
npx resumed render resume.json --output output/tim-abell-cv.html --theme jsonresume-theme-kendall

# html to pdf
input=`pwd`/output/tim-abell-cv.html
npx chromehtml2pdf "file:///$input" --out=output/tim-abell-cv.pdf
