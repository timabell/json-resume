#!/usr/bin/env node

import { Command } from 'commander'
const program = new Command()

import hjson from 'hjson'
import fs from 'fs'
import * as theme from 'jsonresume-theme-even'
import { render } from 'resumed'

program.command('generate-preview')
    .action(generatePreview)

program.command('generate-auth')
    .option('--recruiter <recruiter>')
    .option('--end-client <end-client>')
    .action(generateAuthd)

program.parse()

async function generatePreview() {
    console.log('generating preview...');
    if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
    }

    var cvhjson = fs.readFileSync('resume.hjson', 'utf8')
    var previewHeader = fs.readFileSync('template-header-preview.txt', 'utf8')
    var previewFooter = fs.readFileSync('template-footer-preview.txt', 'utf8')
    var cv = hjson.parse(cvhjson)
    cv.basics.summary = previewHeader + '\n\n' + cv.basics.summary + '\n\n' + previewFooter
    var jsonCv = JSON.stringify(cv, null, 2) // 2 = two-space indent to trigger pretty-printing
    fs.writeFileSync("output/resume.json", jsonCv)
    var htmlCv = await render(cv, theme)
    fs.writeFileSync("output/resume.html", htmlCv)
    console.log('done');

}

function generateAuthd(opts) {
    console.log('mkauth ' + opts.recruiter + ' ' + opts.endClient);
}
