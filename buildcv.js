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

        fs.readFile('resume.hjson', 'utf8', function(err,cvhjson) {
            if (err){
                throw (err)
            }
            var cv = hjson.parse(cvhjson)
            var cvjson = hjson.stringify(cv)
            fs.writeFile("output/resume.json", cvjson, function(err){
                if (err){
                    throw (err)
                }
            })
        })
        console.log('done');
    })
program.command('generate-auth')
    .option('--recruiter <recruiter>')
    .option('--end-client <end-client>')
    .action((opts) => {
        console.log('mkauth ' + opts.recruiter + ' ' + opts.endClient);
    })
program.parse()
