#!/usr/bin/env node

import { Command } from 'commander'
const program = new Command()

import hjson from 'hjson'
import fs from 'fs'
import * as theme from 'jsonresume-theme-kendall'
import { render } from 'resumed'
import puppeteer from 'puppeteer'
import open from 'open'
import path from 'path'

const OUTPUT_DIR = 'output'

program.command('generate-preview')
    .action(generatePreview)

program.command('generate-auth')
    .option('--recruiter <recruiter>')
    .option('--end-client <end-client>')
    .action(generateAuthd)

program.command('open')
    .description('Open the generated files')
    .action(openFiles)

program.parse()

async function generatePreview() {
    console.log('Generating preview...');
    ensureOutputFolderExists()

    var cv = readCvData()
    var templates = readTemplates();

    // replace summary with top-n-tailed summary
    cv.basics.summary = templates.preview_header
        + '\n\n' + cv.basics.summary
        + '\n\n' + templates.preview_footer
        + '\n\n' + templates.warning;

    cv.basics.summary = cv.basics.summary.replace(/\n/g, '\n<br>')

    cv.work.forEach((entry) => {
        entry.summary = entry.summary.replace(/\n/g, '\n<br>')
    })

    fs.copyFileSync('profile.jpg', `${OUTPUT_DIR}/profile.jpg`)

    var jsonCv = JSON.stringify(cv, null, 2) // 2 = two-space indent to trigger pretty-printing
    fs.writeFileSync(`${OUTPUT_DIR}/resume.json`, jsonCv)
    var htmlCv = await render(cv, theme)
    var htmlPath = `${OUTPUT_DIR}/tim-abell-cv.html`
    fs.writeFileSync(htmlPath, htmlCv)
    console.log('done');

    var pdfPath = `${OUTPUT_DIR}/tim-abell-cv.pdf`
    await generatePdf(htmlPath, pdfPath)
}

function ensureOutputFolderExists() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR)
    }
}

function readTemplates() {
    return {
        "warning": fs.readFileSync('template-footer-warning.txt', 'utf8'),
        "preview_header": fs.readFileSync('template-header-preview.txt', 'utf8'),
        "preview_footer": fs.readFileSync('template-footer-preview.txt', 'utf8'),
    }
}

function readCvData() {
    var cvhjson = fs.readFileSync('resume.hjson', 'utf8')
    var cv = hjson.parse(cvhjson)
    return cv
}

function generateAuthd(opts) {
    console.log('mkauth ' + opts.recruiter + ' ' + opts.endClient);
}

async function generatePdf(input, output) {
    console.log("launching headless browser to generate pdf...")
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    input = path.resolve(input)
    await page.goto(`file:///${input}`, { waitUntil: 'networkidle0' });
    await page.pdf({ path: output, format: 'A4' });
    await browser.close();
    console.log(`pdf saved to ${output}`)
}

async function openFiles() {
    const filesToOpen = [`${OUTPUT_DIR}/tim-abell-cv.html`, `${OUTPUT_DIR}/tim-abell-cv.pdf`];

    for (const file of filesToOpen) {
        await open(file);
    }
}