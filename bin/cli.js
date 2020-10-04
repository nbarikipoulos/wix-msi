#!/usr/bin/env node

/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const args = require('../cli/arguments')
const toMSI = require('../index')

yargs
  .locale('en')
  .version()
  .alias('h', 'help')
  .usage('Usage: $0 [bin] --help for detailed help')
  .showHelpOnFail(false)
  .strict()
  .demandCommand(1)

args.forEach(arg => yargs.option(arg.key, arg.details))

const argv = yargs.argv

const name = argv._[0]

const _argv = _ => {
  const result = {
    buildDir: argv.buildDir,
    exe: argv.exe,
    homepage: argv.link,
    ico: argv.ico,
    banner: argv.banner,
    background: argv.background,
    uuid: argv.uuid
  }
  for (const p in result) {
    if (!result[p]) {
      delete result[p]
    }
  }
  return result
}

toMSI(name, _argv())
