# About

This repo is tooling for generating html & pdf CV copies locally from an `hjson` format file.

It's currently hacky as hell (hello bash) and incomplete, but I already use it for real.

Created because I want better automated tooling for generating cvs / profiles from a tidy raw data format. Also because [Text-based tools are the ultimate format for everything](https://timwise.co.uk/2023/06/01/text-based-tools-the-ultimate-format-for-everything/)

It also supports my [cryptographic signing of right-to-represent](https://timwise.co.uk/recruiters/) messages that are embedded in per-client CV copies.

## Based on / using

- <https://jsonresume.org/>
- <https://hjson.github.io/> - hjson is a more-human-friendly variant of json (incompatible but convertible)
- <https://gnupg.org/> - gpg us used for signing "right to represent" authorizations to prevent misrepresentation


# Usage

1. run [setup.sh](setup.sh) to install dependencies
3. Create a `resume.hjson` file in a sibling folder/repo called `cv/`
   1. <https://github.com/hjson/hjson-js> provides conversion tooling for json/hjson
4. install vscode extensions
  - [pdf viewer](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)
  - [json tree](https://marketplace.visualstudio.com/items?itemName=ZainChen.json)
5. edit the auth file (don't check in) based on described spreadsheet (ask me about this if you want a template)
6. run [sign.sh](sign.sh) to sign the auth info
7.  edit [resume.json](resume.json)
8.  uncomment the auth version in generate
9.  run [generate.sh](generate.sh) to generate html then pdf

# Why hjson

The data needs to be easily editable, and json isn't bad but doesn't have the ability to embed literal newlines, and has a lot of markup noise. HJson can be easily converted both ways, and is much nicer to edit by hand.
