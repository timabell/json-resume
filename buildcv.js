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
import { execSync } from 'child_process'

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

    var dateStr = new Date().toISOString().split('T')[0]
    await generateCvFiles(cv, `tim-abell-cv-preview-${dateStr}`)
}

async function generateAuthd(opts) {
    console.log('Generating authorized CV...');

    // Validate required options
    if (!opts.recruiter) {
        console.error('Error: --recruiter is required');
        process.exit(1);
    }
    if (!opts.endClient) {
        console.error('Error: --end-client is required');
        process.exit(1);
    }

    ensureOutputFolderExists()

    var cv = readCvData()
    var templates = readTemplates();

    // Generate authorization text with client details
    var authText = templates.authorization
        .replace('CLIENT_NAME', opts.recruiter)
        .replace('END_CLIENT', opts.endClient)
        .replace('DATE', new Date().toISOString().split('T')[0])
        .replace('AUTH_CODE', Math.random().toString(36).substring(2, 15))
        .replace('EXPIRY', new Date(Date.now() + 182 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 90 days from now

    // Write authorization to file
    fs.writeFileSync(`${OUTPUT_DIR}/auth.txt`, authText)

    // GPG sign the authorization file
    try {
        console.log('Signing authorization file with GPG...')
        execSync(`gpg --yes --clearsign --output ${OUTPUT_DIR}/auth.txt.asc ${OUTPUT_DIR}/auth.txt`, { 
            cwd: process.cwd(),
            stdio: 'inherit'
        })
        console.log('Authorization file signed successfully')
    } catch (error) {
        console.error('Failed to sign authorization file:', error.message)
        process.exit(1)
    }

    // Create auth'd header with client name
    var authdHeader = templates.authd_header
        .replace('CLIENT_NAME', opts.recruiter)
        .replace('END_CLIENT', opts.endClient)

    // Read the signed authorization file
    var signedAuthText = fs.readFileSync(`${OUTPUT_DIR}/auth.txt.asc`, 'utf8')

    // replace summary with auth'd summary
    cv.basics.summary = authdHeader
        + '\n\n' + cv.basics.summary
        + '\n\n' + templates.warning
        + '\n\n' + signedAuthText;

    // Create sanitized filename with recruiter and client
    var sanitizedRecruiter = opts.recruiter.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    var sanitizedClient = opts.endClient.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    var dateStr = new Date().toISOString().split('T')[0]
    var authFilename = `tim-abell-cv-authd-${sanitizedRecruiter}-${sanitizedClient}-${dateStr}`

    await generateCvFiles(cv, authFilename)
}

async function generateCvFiles(cv, filename) {
    cv.basics.summary = cv.basics.summary.replace(/\n/g, '\n<br>')

    cv.work.forEach((entry) => {
        entry.summary = entry.summary.replace(/\n/g, '\n<br>')
    })

    fs.copyFileSync('profile.jpg', `${OUTPUT_DIR}/profile.jpg`)

    console.log('generating json...');
    var jsonCv = JSON.stringify(cv, null, 2) // 2 = two-space indent to trigger pretty-printing
    fs.writeFileSync(`${OUTPUT_DIR}/resume.json`, jsonCv)

    console.log('generating html...');
    var htmlCv = await render(cv, theme)
    var htmlPath = `${OUTPUT_DIR}/${filename}.html`
    fs.writeFileSync(htmlPath, htmlCv)

    console.log('generating pdf...');
    var pdfPath = `${OUTPUT_DIR}/${filename}.pdf`
    await generatePdf(htmlPath, pdfPath)
    console.log('generation complete');
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
        "authd_header": fs.readFileSync('template-header-authd.txt', 'utf8'),
        "authorization": fs.readFileSync('template-authorization.txt', 'utf8'),
    }
}

function readCvData() {
    var cvhjson = fs.readFileSync('resume.hjson', 'utf8')
    var cv = hjson.parse(cvhjson)
    return cv
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