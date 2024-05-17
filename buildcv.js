#!/usr/bin/env node

import { Command } from 'commander'
const program = new Command()

import hjson from 'hjson'
import fs from 'fs'
import * as theme from 'jsonresume-theme-kendall'
import { render } from 'resumed'
import puppeteer from 'puppeteer';
import path from 'path'

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
    console.log('generating preview...');
    if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
    }

    var cvhjson = fs.readFileSync('resume.hjson', 'utf8')
    var previewHeader = fs.readFileSync('template-header-preview.txt', 'utf8')
    var previewFooter = fs.readFileSync('template-footer-preview.txt', 'utf8')
    var cv = hjson.parse(cvhjson)
    cv.basics.summary = previewHeader + '\n\n' + cv.basics.summary + '\n\n' + previewFooter
    cv.basics.summary = cv.basics.summary.replace(/\n/g, '\n<br>')
    cv.work.forEach((entry) => {
        entry.summary = entry.summary.replace(/\n/g, '\n<br>')
    })

    var jsonCv = JSON.stringify(cv, null, 2) // 2 = two-space indent to trigger pretty-printing
    fs.writeFileSync("output/resume.json", jsonCv)
    var htmlCv = await render(cv, theme)
    var htmlPath = 'output/tim-abell-cv.html'
    fs.writeFileSync(htmlPath, htmlCv)
    console.log('done');

    var pdfPath = 'output/tim-abell-cv.pdf'
    await generatePdf(htmlPath, pdfPath)
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
import open from 'open';

async function openFiles() {
    const filesToOpen = ['output/tim-abell-cv.html', 'output/tim-abell-cv.pdf'];

    for (const file of filesToOpen) {
        await open(file);
    }
}