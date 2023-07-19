#!/bin/sh -v
outputPath=output
filename=tim-abell-cv
html="$outputPath/$filename.html"
pdf="$outputPath/$filename.pdf"
xdg-open "$html"
xdg-open "$pdf"
