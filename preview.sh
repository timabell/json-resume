#!/bin/sh -v

./buildcv.js generate-preview

filename="tim-abell-cv-preview-$(date +%Y-%m-%d)"
xdg-open "output/${filename}.html"
xdg-open "output/${filename}.pdf"
