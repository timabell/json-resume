# About

This repo is tooling for generating html & pdf CV copies locally from an `hjson` format file.

Created because I want better automated tooling for generating cvs / profiles from a tidy raw data format. Also because [Text-based tools are the ultimate format for everything](https://timwise.co.uk/2023/06/01/text-based-tools-the-ultimate-format-for-everything/)

See

- <https://jsonresume.org/>
- <https://hjson.github.io/> - hjson is a more-human-friendly variant of json (incompatible but convertible)


# Usage

1. Create a `resume.hjson` file in a sibling folder/repo called `cv/`
   1. <https://github.com/hjson/hjson-js> provides conversion tooling for json/hjson
2. install vscode extensions
  - [pdf viewer](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)
  - [json tree](https://marketplace.visualstudio.com/items?itemName=ZainChen.json)
3. run `asdf install` to get right nodejs
4. run [setup.sh](setup.sh) to npm-install dependencies
5. edit [resume.json](resume.json)
6. run [generate.sh](generate.sh) to generate html then pdf

# Why hjson

The data needs to be easily editable, and json isn't bad but doesn't have the ability to embed literal newlines, and has a lot of markup noise. HJson can be easily converted both ways, and is much nicer to edit by hand.
