#!/usr/bin/env node
const {program} = require('commander')
var hjson = require('hjson')
var fs = require('fs')
program.command('generate-preview')
    .action(() => {
        console.log('generating preview...');
        if (!fs.existsSync( 'output')){
            fs.mkdirSync( 'output');
        }

        var cvhjson = fs.readFileSync('resume.hjson', 'utf8')
        var cv = hjson.parse(cvhjson)
        console.log(cv.basics.summary);

        var cvjson = hjson.stringify(cv)
        fs.writeFileSync("output/resume.json", cvjson)
        console.log('done');
    })
program.command('generate-auth')
    .option('--recruiter <recruiter>')
    .option('--end-client <end-client>')
    .action((opts) => {
        console.log('mkauth ' + opts.recruiter + ' ' + opts.endClient);
    })
program.parse()
