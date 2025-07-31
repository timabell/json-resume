# About

This repo is tooling for generating html & pdf CV copies locally from an `hjson` format file.

It's currently hacky as hell (hello bash) and incomplete, but I already use it for real.

Created because I want better automated tooling for generating cvs / profiles from a tidy raw data format. Also because [Text-based tools are the ultimate format for everything](https://0x5.uk/2023/06/01/text-based-tools-the-ultimate-format-for-everything/)

It also supports my [cryptographic signing of right-to-represent](https://charmconsulting.co.uk/recruiters/) messages that are embedded in per-client CV copies.

## Based on / using

- <https://jsonresume.org/>
- <https://hjson.github.io/> - hjson is a more-human-friendly variant of json (incompatible but convertible)
- <https://gnupg.org/> - gpg us used for signing "right to represent" authorizations to prevent misrepresentation


# Usage

1. run [setup.sh](setup.sh) to install dependencies
2. Create a `input/resume.hjson` (see [input/resume.example.hjson](example hjson))
    1. <https://github.com/hjson/hjson-js> provides conversion tooling for json/hjson
    2. This linkedin exporter does a great job: <https://github.com/joshuatz/linkedin-to-jsonresume>
    3. You might find it convenient to symlink the hjson to a version controlled cv data git repo
3. Create a `input/profile.jpg`
    1. example for testing at [input/profile.example.jpg](input/profile.example.jpg)
    2. Again you may want to symlink this to a more permanent location to avoid losing it to a git clean.
4. install vscode extensions
    - [pdf viewer](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)
    - [json tree](https://marketplace.visualstudio.com/items?itemName=ZainChen.json)
5. generate a preview with `./buildcv.js generate-preview`
6. generate an authorized copy with `./buildcv.js generate-auth --recruiter xxx --end-client yyy`

```sh
./buildcv.js generate-preview
```

```sh
./buildcv.js generate-auth --recruiter xxx --end-client yyy
```

If you have multiple gpg keys, you can specify which one to use with the `--gpg-key` option (email or key id).

```sh
./buildcv.js generate-auth --recruiter xxx --end-client yyy --gpg-key xxx
```

To reuse an existing authorization (allowing CV text updates without changing auth details), use the `--auth-code` option with a code from the CSV log:

```sh
./buildcv.js generate-auth --auth-code ABC123XYZ
```

# Why hjson

The data needs to be easily editable, and json isn't bad but doesn't have the ability to embed literal newlines, and has a lot of markup noise. HJson can be easily converted both ways, and is much nicer to edit by hand.
