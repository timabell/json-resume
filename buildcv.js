#!/usr/bin/env node
const {program} = require('commander')
program.command('generate-preview')
    .action(() => {
        console.log('mkpreview');
    })
program.command('generate-auth')
    .option('--recruiter <recruiter>')
    .option('--end-client <end-client>')
    .action((opts) => {
        console.log('mkauth ' + opts.recruiter + ' ' + opts.endClient);
    })
program.parse()
